"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/use-cart"
import { useAuth } from "@/lib/use-auth"
import { useLanguage } from "@/lib/i18n/context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { CreditCard, Truck, ShoppingBag } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"

function CheckoutContent() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const { t } = useLanguage()

  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [sameAsBilling, setSameAsBilling] = useState(true)

  // Shipping address state
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
  })

  // Billing address state
  const [billingAddress, setBillingAddress] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
  })

  const subtotal = total
  const shipping = total > 50 ? 0 : 10
  const tax = subtotal * 0.1
  const finalTotal = subtotal + shipping + tax

  if (items.length === 0) {
    return (
      <div className="container py-16">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">{t("checkout.emptyCart")}</h2>
            <p className="text-muted-foreground mb-6">{t("checkout.addItemsToProceed")}</p>
            <Button onClick={() => router.push("/products")}>{t("cart.continueShopping")}</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      // Create addresses first
      const shippingResponse = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...shippingAddress,
          full_name: shippingAddress.fullName,
          address_line1: shippingAddress.addressLine1,
          address_line2: shippingAddress.addressLine2,
          postal_code: shippingAddress.postalCode,
        }),
      })

      if (!shippingResponse.ok) throw new Error("Failed to save shipping address")
      const { address: shippingAddr } = await shippingResponse.json()

      let billingAddrId = shippingAddr.id
      if (!sameAsBilling) {
        const billingResponse = await fetch("/api/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...billingAddress,
            full_name: billingAddress.fullName,
            address_line1: billingAddress.addressLine1,
            address_line2: billingAddress.addressLine2,
            postal_code: billingAddress.postalCode,
          }),
        })

        if (!billingResponse.ok) throw new Error("Failed to save billing address")
        const { address: billingAddr } = await billingResponse.json()
        billingAddrId = billingAddr.id
      }

      // Create order
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            product_id: item.product_id,
            name: item.name,
            images: [item.image],
            quantity: item.quantity,
            price: item.price,
          })),
          shipping_address_id: shippingAddr.id,
          billing_address_id: billingAddrId,
          payment_method: paymentMethod,
        }),
      })

      if (!orderResponse.ok) throw new Error("Failed to create order")
      const { order } = await orderResponse.json()

      clearCart()
      toast.success(t("checkout.orderPlacedSuccess"))
      router.push(`/account/orders/${order.id}`)
    } catch (error) {
      console.error("[v0] Checkout error:", error)
      toast.error(t("checkout.failedProcessOrder"))
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t("checkout.title")}</h1>
        <p className="text-muted-foreground mt-2">{t("checkout.subtitle")}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  {t("checkout.shippingAddress")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">{t("checkout.fullName")} *</Label>
                    <Input
                      id="fullName"
                      required
                      value={shippingAddress.fullName}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">{t("checkout.phone")} *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="addressLine1">{t("checkout.addressLine1")} *</Label>
                  <Input
                    id="addressLine1"
                    required
                    value={shippingAddress.addressLine1}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine1: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="addressLine2">{t("checkout.addressLine2")}</Label>
                  <Input
                    id="addressLine2"
                    value={shippingAddress.addressLine2}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine2: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">{t("checkout.city")} *</Label>
                    <Input
                      id="city"
                      required
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">{t("checkout.state")} *</Label>
                    <Input
                      id="state"
                      required
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">{t("checkout.postalCode")} *</Label>
                    <Input
                      id="postalCode"
                      required
                      value={shippingAddress.postalCode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Billing Address */}
            <Card>
              <CardHeader>
                <CardTitle>{t("checkout.billingAddress")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sameAsBilling"
                    checked={sameAsBilling}
                    onCheckedChange={(checked) => setSameAsBilling(checked as boolean)}
                  />
                  <Label htmlFor="sameAsBilling" className="cursor-pointer">
                    {t("checkout.sameAsShipping")}
                  </Label>
                </div>

                {!sameAsBilling && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="billingFullName">{t("checkout.fullName")} *</Label>
                        <Input
                          id="billingFullName"
                          required
                          value={billingAddress.fullName}
                          onChange={(e) => setBillingAddress({ ...billingAddress, fullName: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="billingPhone">{t("checkout.phone")} *</Label>
                        <Input
                          id="billingPhone"
                          type="tel"
                          required
                          value={billingAddress.phone}
                          onChange={(e) => setBillingAddress({ ...billingAddress, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="billingAddressLine1">{t("checkout.addressLine1")} *</Label>
                      <Input
                        id="billingAddressLine1"
                        required
                        value={billingAddress.addressLine1}
                        onChange={(e) => setBillingAddress({ ...billingAddress, addressLine1: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="billingAddressLine2">{t("checkout.addressLine2")}</Label>
                      <Input
                        id="billingAddressLine2"
                        value={billingAddress.addressLine2}
                        onChange={(e) => setBillingAddress({ ...billingAddress, addressLine2: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="billingCity">{t("checkout.city")} *</Label>
                        <Input
                          id="billingCity"
                          required
                          value={billingAddress.city}
                          onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="billingState">{t("checkout.state")} *</Label>
                        <Input
                          id="billingState"
                          required
                          value={billingAddress.state}
                          onChange={(e) => setBillingAddress({ ...billingAddress, state: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="billingPostalCode">{t("checkout.postalCode")} *</Label>
                        <Input
                          id="billingPostalCode"
                          required
                          value={billingAddress.postalCode}
                          onChange={(e) => setBillingAddress({ ...billingAddress, postalCode: e.target.value })}
                        />
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  {t("checkout.paymentMethod")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer">
                      <div className="font-medium">{t("checkout.creditDebitCard")}</div>
                      <div className="text-sm text-muted-foreground">{t("checkout.paySecurely")}</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                      <div className="font-medium">{t("checkout.paypal")}</div>
                      <div className="text-sm text-muted-foreground">{t("checkout.payWithPaypal")}</div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>{t("checkout.orderSummary")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.product_id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.name} x {item.quantity}
                      </span>
                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t("cart.subtotal")}</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t("cart.shipping")}</span>
                    <span className="font-medium">{shipping === 0 ? t("checkout.free") : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t("cart.tax")}</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{t("cart.total")}</span>
                    <span className="font-bold text-xl">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
                  {isProcessing ? t("checkout.processing") : t("checkout.placeOrder")}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  {t("checkout.agreeTerms")}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <CheckoutContent />
    </ProtectedRoute>
  )
}
