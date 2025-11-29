"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "@/lib/i18n/context"
import { Mail, MapPin, Phone, Clock } from "lucide-react"
import { useState } from "react"

export default function ContactPage() {
  const { t } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setIsSuccess(true)
  }

  return (
    <div className="container py-12 md:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            {t("contact.title")}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("contact.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("contact.info.address")}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <p className="font-medium">Mai Trọng Quang Store</p>
                  <p className="text-muted-foreground">
                    123 Đường Nguyễn Huệ, Quận 1<br />
                    Thành phố Hồ Chí Minh, Việt Nam
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("contact.info.contact")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Phone className="h-5 w-5 text-primary shrink-0" />
                  <p>+84 123 456 789</p>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="h-5 w-5 text-primary shrink-0" />
                  <p>contact@maitrongquang.com</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("contact.info.hours")}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-start gap-4">
                <Clock className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <p className="font-medium">Thứ 2 - Thứ 6</p>
                  <p className="text-muted-foreground">8:00 - 20:00</p>
                  <p className="font-medium mt-2">Thứ 7 - Chủ Nhật</p>
                  <p className="text-muted-foreground">9:00 - 18:00</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>{t("contact.title")}</CardTitle>
              <CardDescription>
                {t("contact.subtitle")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                  <div className="rounded-full bg-green-100 p-3 text-green-600">
                    <Mail className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-green-600">
                    {t("contact.form.success")}
                  </h3>
                  <Button onClick={() => setIsSuccess(false)} variant="outline">
                    {t("common.back")}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t("contact.form.name")}</Label>
                    <Input id="name" required placeholder="Nguyễn Văn A" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t("contact.form.email")}</Label>
                    <Input id="email" type="email" required placeholder="email@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">{t("contact.form.subject")}</Label>
                    <Input id="subject" required placeholder="Vấn đề cần hỗ trợ" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">{t("contact.form.message")}</Label>
                    <Textarea 
                      id="message" 
                      required 
                      placeholder="Nội dung tin nhắn..." 
                      className="min-h-[150px]"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? t("common.sending") : t("contact.form.send")}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
