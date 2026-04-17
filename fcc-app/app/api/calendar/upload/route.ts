import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { createServerSupabase } from "@/lib/supabase"
import { saveCalendar } from "@/lib/db"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.profileId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 })
  }

  const file = formData.get("file")
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 })
  }

  if (!file.name.endsWith(".ics")) {
    return NextResponse.json(
      { error: "Only .ics calendar files are supported" },
      { status: 400 }
    )
  }

  const maxSize = 5 * 1024 * 1024 // 5 MB
  if (file.size > maxSize) {
    return NextResponse.json({ error: "File too large (max 5 MB)" }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Sanitise filename
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
  const storagePath = `${session.profileId}/${Date.now()}_${safeName}`

  const supabase = createServerSupabase()
  const { error: storageError } = await supabase.storage
    .from("calendars")
    .upload(storagePath, buffer, {
      contentType: "text/calendar",
      upsert: false,
    })

  if (storageError) {
    console.error("[calendar/upload] storage:", storageError.message)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }

  try {
    await saveCalendar({
      profile_id: session.profileId,
      kid_id: null,
      filename: safeName,
      storage_path: storagePath,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error"
    console.error("[calendar/upload] db:", msg)
    // Storage succeeded, DB insert failed — non-critical, still return success
  }

  return NextResponse.json({ ok: true, filename: safeName })
}
