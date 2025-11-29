import { AdminRoute } from "@/components/admin-route"
import { AdminNav } from "@/components/admin/admin-nav"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminRoute>
      <div className="flex min-h-screen">
        <aside className="w-64 hidden md:block fixed inset-y-0 z-50">
          <AdminNav />
        </aside>
        <main className="flex-1 md:pl-64">
          <div className="container py-8">
            {children}
          </div>
        </main>
      </div>
    </AdminRoute>
  )
}
