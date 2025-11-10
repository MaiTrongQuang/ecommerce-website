"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/i18n/context"

interface Profile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  role: string
  created_at: string
  updated_at: string
}

export default function ProfilePage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/profile")
        if (!response.ok) {
          if (response.status === 401) {
            router.push("/auth/login")
            return
          }
          throw new Error("Failed to fetch profile")
        }

        const data = await response.json()
        setProfile(data.profile)
        setFormData({
          full_name: data.profile.full_name || "",
          phone: data.profile.phone || "",
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdating(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: formData.full_name.trim() || null,
          phone: formData.phone.trim() || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update profile")
      }

      const data = await response.json()
      setProfile(data.profile)
      setSuccess(true)
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : t("account.failedUpdate"))
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/account">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("account.backToAccount")}
        </Link>
      </Button>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>{t("account.profileTitle")}</CardTitle>
            <CardDescription>{t("account.profileDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">{t("account.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile?.email || ""}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  {t("account.emailCannotChange")}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="full_name">{t("account.fullName")}</Label>
                <Input
                  id="full_name"
                  type="text"
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                  placeholder={t("account.fullName")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{t("account.phone")}</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder={t("account.phonePlaceholder")}
                />
              </div>

              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950 rounded-md">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-3 text-sm text-green-600 bg-green-50 dark:bg-green-950 rounded-md">
                  {t("account.profileUpdated")}
                </div>
              )}

              <div className="flex gap-4">
                <Button type="submit" disabled={updating}>
                  {updating ? t("account.updating") : t("account.updateProfile")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  asChild
                  disabled={updating}
                >
                  <Link href="/account">{t("common.cancel")}</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

