"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/lib/i18n/context"
import { X } from "lucide-react"
import { toast } from "sonner"
import type { Address } from "@/lib/types/address"

interface AddressFormProps {
  address?: Address
  onSuccess: (address: Address) => void
  onCancel: () => void
}

export function AddressForm({ address, onSuccess, onCancel }: AddressFormProps) {
  const { t } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    full_name: address?.full_name || "",
    phone: address?.phone || "",
    address_line1: address?.address_line1 || "",
    address_line2: address?.address_line2 || "",
    city: address?.city || "",
    state: address?.state || "",
    postal_code: address?.postal_code || "",
    country: address?.country || "VN",
    is_default: address?.is_default || false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = address ? `/api/addresses/${address.id}` : "/api/addresses"
      const method = address ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formData.full_name,
          phone: formData.phone,
          address_line1: formData.address_line1,
          address_line2: formData.address_line2 || null,
          city: formData.city,
          state: formData.state,
          postal_code: formData.postal_code,
          country: formData.country,
          is_default: formData.is_default,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || t("addresses.saveError"))
      }

      onSuccess(result.address)
    } catch (error) {
      console.error("Error saving address:", error)
      toast.error(error instanceof Error ? error.message : t("addresses.saveError"))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{address ? t("addresses.editAddress") : t("addresses.addAddress")}</CardTitle>
              <CardDescription>{t("addresses.formDesc")}</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">{t("addresses.fullName")} *</Label>
                <Input
                  id="full_name"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{t("addresses.phone")} *</Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address_line1">{t("addresses.addressLine1")} *</Label>
              <Input
                id="address_line1"
                required
                value={formData.address_line1}
                onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address_line2">{t("addresses.addressLine2")}</Label>
              <Input
                id="address_line2"
                value={formData.address_line2}
                onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">{t("addresses.city")} *</Label>
                <Input
                  id="city"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">{t("addresses.state")} *</Label>
                <Input
                  id="state"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postal_code">{t("addresses.postalCode")} *</Label>
                <Input
                  id="postal_code"
                  required
                  value={formData.postal_code}
                  onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">{t("addresses.country")} *</Label>
              <Input
                id="country"
                required
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_default"
                checked={formData.is_default}
                onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="is_default" className="cursor-pointer">
                {t("addresses.setAsDefault")}
              </Label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? t("common.saving") : address ? t("common.update") : t("common.add")}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                {t("common.cancel")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

