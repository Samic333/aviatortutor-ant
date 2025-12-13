import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { redirect } from "next/navigation";
import { Receipt, DollarSign } from "lucide-react";

export default async function StudentBillingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const payments = await prisma.booking.findMany({
    where: {
      studentId: user.id,
      paymentStatus: { in: ["PAID", "REFUNDED", "PENDING"] }
    },
    include: { class: true },
    orderBy: { createdAt: 'desc' }
  });

  const totalSpent = payments
    .filter(p => p.paymentStatus === "PAID")
    .reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing & Payments</h1>
        <p className="text-muted-foreground">History of your transactions.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Lifetime</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No transactions found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100/50 text-gray-700 border-b">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {payments.map(item => (
                    <tr key={item.id}>
                      <td className="px-4 py-3">{new Date(item.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3 font-medium">{item.class.title}</td>
                      <td className="px-4 py-3">
                        <Badge variant={item.paymentStatus === "PAID" ? "default" : "outline"}>
                          {item.paymentStatus}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {item.paymentStatus === "REFUNDED" ? "-" : ""}${item.price.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
