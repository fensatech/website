import { createServerSupabase } from "./supabase"
import type { Profile, Kid } from "@/types"

export async function createProfile(data: {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
}) {
  const sb = createServerSupabase()
  const { error } = await sb
    .from("profiles")
    .upsert(data, { onConflict: "id", ignoreDuplicates: true })
  if (error) console.error("[db] createProfile:", error.message)
}

export async function getProfile(id: string): Promise<Profile | null> {
  const sb = createServerSupabase()
  const { data } = await sb.from("profiles").select("*").eq("id", id).single()
  return data ?? null
}

export async function updateProfile(id: string, updates: Partial<Profile>) {
  const sb = createServerSupabase()
  const { error } = await sb
    .from("profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
  if (error) throw new Error(error.message)
}

export async function getKids(profileId: string): Promise<Kid[]> {
  const sb = createServerSupabase()
  const { data } = await sb
    .from("kids")
    .select("*")
    .eq("profile_id", profileId)
    .order("created_at")
  return data ?? []
}

export async function replaceKids(
  profileId: string,
  kids: { name: string; dob: string | null }[]
) {
  const sb = createServerSupabase()
  await sb.from("kids").delete().eq("profile_id", profileId)
  if (kids.length === 0) return
  const { error } = await sb
    .from("kids")
    .insert(kids.map((k) => ({ ...k, profile_id: profileId })))
  if (error) throw new Error(error.message)
}

export async function saveCalendar(data: {
  profile_id: string
  kid_id: string | null
  filename: string
  storage_path: string
}) {
  const sb = createServerSupabase()
  const { error } = await sb.from("calendars").insert(data)
  if (error) throw new Error(error.message)
}
