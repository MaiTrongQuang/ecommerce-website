"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AddressForm } from "@/components/address-form"
import { useLanguage } from "@/lib/i18n/context"
import { useAuth } from "@/lib/use-auth"
import { ArrowLeft, Plus, MapPin, Edit, Trash2, Check } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Address {
  id: string
  full_name: string
  phone: string
  address_line1: string
  address_line2: string | null
  city: string
  state: string
  postal_code: string
  country: string
  is_default: boolean
  created_at: string
  updated_at: string
}

interface AddressesContentProps {
  addresses: Address[]
  initialLanguage: "en" | "vi"
}

export function AddressesContent({ addresses: initialAddresses, initialLanguage }: AddressesContentProps) {
  const { t } = useLanguage()
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [deletingAddressId, setDeletingAddressId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.push("/auth/login")
    }
  }, [user, authLoading, router])

  const handleAddNew = () => {
    setEditingAddress(null)
    setIsFormOpen(true)
  }

  const handleEdit = (address: Address) => {
    setEditingAddress(address)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/addresses/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || t("addresses.deleteError"))
      }

      setAddresses(addresses.filter((addr) => addr.id !== id))
      toast.success(t("addresses.deleted"))
      setDeletingAddressId(null)
    } catch (error) {
      console.error("Error deleting address:", error)
      toast.error(error instanceof Error ? error.message : t("addresses.deleteError"))
    } finally {
      setIsLoading(false)
    }
  }

  const handleSetDefault = async (id: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/addresses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_default: true }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || t("addresses.setDefaultError"))
      }

      const { address } = await response.json()
      
      // Update local state
      setAddresses(
        addresses.map((addr) => ({
          ...addr,
          is_default: addr.id === id,
        }))
      )

      toast.success(t("addresses.setAsDefault"))
    } catch (error) {
      console.error("Error setting default address:", error)
      toast.error(error instanceof Error ? error.message : t("addresses.setDefaultError"))
    } finally {
      setIsLoading(false)
    }
  }

  const handleFormSuccess = (address: Address) => {
    if (editingAddress) {
      // Update existing address
      setAddresses(addresses.map((addr) => (addr.id === address.id ? address : addr)))
      toast.success(t("addresses.updated"))
    } else {
      // Add new address
      setAddresses([address, ...addresses])
      toast.success(t("addresses.added"))
    }
    setIsFormOpen(false)
    setEditingAddress(null)
    router.refresh()
  }

  if (authLoading) {
    return (
      <div className="container py-8 text-center">
        <p>{t("common.loading")}</p>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/account">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("account.backToAccount")}
          </Link>
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t("addresses.title")}</h1>
            <p className="text-muted-foreground mt-2">{t("addresses.desc")}</p>
          </div>
          <Button onClick={handleAddNew} className="gap-2">
            <Plus className="h-4 w-4" />
            {t("addresses.addNew")}
          </Button>
        </div>
      </div>

      {addresses.length === 0 && !isFormOpen ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t("addresses.noAddresses")}</h3>
            <p className="text-sm text-muted-foreground mb-4">{t("addresses.noAddressesDesc")}</p>
            <Button onClick={handleAddNew}>
              <Plus className="mr-2 h-4 w-4" />
              {t("addresses.addFirstAddress")}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <Card key={address.id} className={address.is_default ? "border-primary" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      {address.full_name}
                      {address.is_default && (
                        <Badge variant="default" className="ml-2">
                          {t("addresses.default")}
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="mt-1">{address.phone}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm mb-4">
                  <p className="text-muted-foreground">{address.address_line1}</p>
                  {address.address_line2 && (
                    <p className="text-muted-foreground">{address.address_line2}</p>
                  )}
                  <p className="text-muted-foreground">
                    {address.city}, {address.state} {address.postal_code}
                  </p>
                  <p className="text-muted-foreground">{address.country}</p>
                </div>
                <div className="flex gap-2">
                  {!address.is_default && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(address.id)}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      {t("addresses.setAsDefault")}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(address)}
                    className="flex-1"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    {t("common.edit")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeletingAddressId(address.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Address Form Dialog */}
      {isFormOpen && (
        <AddressForm
          address={editingAddress || undefined}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setIsFormOpen(false)
            setEditingAddress(null)
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deletingAddressId !== null} onOpenChange={(open) => !open && setDeletingAddressId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("addresses.deleteConfirm")}</AlertDialogTitle>
            <AlertDialogDescription>{t("addresses.deleteConfirmDesc")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingAddressId && handleDelete(deletingAddressId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

