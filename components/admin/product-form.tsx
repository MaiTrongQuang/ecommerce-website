"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createClient } from "@/lib/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2, Plus, X } from "lucide-react"
import { Database } from "@/lib/database"
import { useLanguage } from "@/lib/i18n/context"

type Product = Database['public']['Tables']['products']['Row']
type Category = Database['public']['Tables']['categories']['Row']

interface ProductFormProps {
  product?: Product
  categories: Category[]
  onSuccess?: () => void
}

export function ProductForm({ product, categories, onSuccess }: ProductFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [images, setImages] = useState<string[]>(product?.images || [])
  const [newImageUrl, setNewImageUrl] = useState("")
  const router = useRouter()
  const supabase = createClient()
  const { t } = useLanguage()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string),
      compare_at_price: formData.get("compare_at_price") ? parseFloat(formData.get("compare_at_price") as string) : null,
      cost_per_item: formData.get("cost_per_item") ? parseFloat(formData.get("cost_per_item") as string) : null,
      sku: formData.get("sku") as string,
      barcode: formData.get("barcode") as string,
      quantity: parseInt(formData.get("quantity") as string),
      category_id: formData.get("category_id") as string,
      status: formData.get("status") as "draft" | "active" | "archived",
      images: images,
    }

    try {
      if (product) {
        const { error } = await supabase
          .from("products")
          .update(data)
          .eq("id", product.id)
        
        if (error) throw error
        toast.success(t("admin.form.successUpdate"))
      } else {
        const { error } = await supabase
          .from("products")
          .insert(data)
        
        if (error) throw error
        toast.success(t("admin.form.successCreate"))
      }

      router.refresh()
      if (onSuccess) onSuccess()
    } catch (error: any) {
      toast.error(error.message || t("admin.form.error"))
    } finally {
      setIsLoading(false)
    }
  }

  const addImage = () => {
    if (newImageUrl) {
      setImages([...images, newImageUrl])
      setNewImageUrl("")
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">{t("admin.form.name")}</Label>
          <Input id="name" name="name" defaultValue={product?.name} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">{t("admin.form.slug")}</Label>
          <Input id="slug" name="slug" defaultValue={product?.slug} required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">{t("admin.form.description")}</Label>
        <Textarea id="description" name="description" defaultValue={product?.description || ""} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="price">{t("admin.form.price")}</Label>
          <Input id="price" name="price" type="number" step="0.01" defaultValue={product?.price} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="compare_at_price">{t("admin.form.compareAtPrice")}</Label>
          <Input id="compare_at_price" name="compare_at_price" type="number" step="0.01" defaultValue={product?.compare_at_price || ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cost_per_item">{t("admin.form.costPerItem")}</Label>
          <Input id="cost_per_item" name="cost_per_item" type="number" step="0.01" defaultValue={product?.cost_per_item || ""} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="sku">{t("admin.form.sku")}</Label>
          <Input id="sku" name="sku" defaultValue={product?.sku || ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="barcode">{t("admin.form.barcode")}</Label>
          <Input id="barcode" name="barcode" defaultValue={product?.barcode || ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="quantity">{t("admin.form.quantity")}</Label>
          <Input id="quantity" name="quantity" type="number" defaultValue={product?.quantity || 0} required />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category_id">{t("admin.form.category")}</Label>
          <Select name="category_id" defaultValue={product?.category_id || ""}>
            <SelectTrigger>
              <SelectValue placeholder={t("admin.form.selectCategory")} />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">{t("admin.form.status")}</Label>
          <Select name="status" defaultValue={product?.status || "active"}>
            <SelectTrigger>
              <SelectValue placeholder={t("admin.form.selectStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>{t("admin.form.images")}</Label>
        <div className="flex gap-2">
          <Input 
            value={newImageUrl} 
            onChange={(e) => setNewImageUrl(e.target.value)} 
            placeholder={t("admin.form.imageUrl")} 
          />
          <Button type="button" onClick={addImage} size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-4">
          {images.map((url, index) => (
            <div key={index} className="relative group aspect-square rounded-md overflow-hidden border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Product ${index + 1}`} className="object-cover w-full h-full" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {product ? t("admin.form.update") : t("admin.form.create")}
        </Button>
      </div>
    </form>
  )
}
