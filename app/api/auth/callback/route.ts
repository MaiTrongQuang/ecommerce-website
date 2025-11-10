import { createClient } from "@/lib/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get("code")
    const next = requestUrl.searchParams.get("next") || "/"

    if (code) {
      const supabase = await createClient()
      
      // Exchange code for session
      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error("[Auth] Error exchanging code for session:", error)
        return NextResponse.redirect(
          new URL(`/auth/error?error=${encodeURIComponent(error.message)}`, request.url)
        )
      }

      // Redirect to success page or intended destination
      return NextResponse.redirect(new URL(next, request.url))
    }

    // No code provided, redirect to login
    return NextResponse.redirect(new URL("/auth/login", request.url))
  } catch (error) {
    console.error("[Auth] Error in callback:", error)
    return NextResponse.redirect(
      new URL("/auth/error?error=callback_error", request.url)
    )
  }
}

