import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getServerLanguage } from "@/lib/i18n/server"
import { t } from "@/lib/i18n"

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams
  const lang = await getServerLanguage()

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{t(lang, "auth.somethingWentWrong")}</CardTitle>
          </CardHeader>
          <CardContent>
            {params?.error ? (
              <p className="text-sm text-muted-foreground mb-4">{t(lang, "common.error")}: {params.error}</p>
            ) : (
              <p className="text-sm text-muted-foreground mb-4">{t(lang, "auth.unspecifiedError")}</p>
            )}
            <Button asChild className="w-full">
              <Link href="/auth/login">{t(lang, "auth.backToLogin")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
