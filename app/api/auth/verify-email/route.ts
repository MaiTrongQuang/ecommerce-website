import { createClient } from "@/lib/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, type = "signup" } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Resend confirmation email
    const { error } = await supabase.auth.resend({
      type: type === "signup" ? "signup" : "email_change",
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/callback`,
      },
    })

    if (error) {
      if (error.message.includes("already confirmed")) {
        return NextResponse.json(
          { error: "Email is already verified" },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      message: "Verification email sent successfully. Please check your inbox.",
    })
  } catch (error) {
    console.error("[Auth] Error sending verification email:", error)
    return NextResponse.json(
      { error: "An error occurred while sending verification email" },
      { status: 500 }
    )
  }
}

