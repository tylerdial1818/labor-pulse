"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils/format";
import type { RevenuePoint } from "@/types/analytics";

export function RevenueChart({ data }: { data: RevenuePoint[] }) {
  return (
    <Card className="min-h-[360px]">
      <CardHeader>
        <div>
          <CardTitle>Revenue trajectory</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">Actual revenue against plan by month.</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#0e7490" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#0e7490" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} tickFormatter={(value) => formatCurrency(Number(value))} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} contentStyle={{ borderRadius: 8, borderColor: "#d9e1ea" }} />
              <Area type="monotone" dataKey="target" stroke="#94a3b8" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
              <Area type="monotone" dataKey="revenue" stroke="#0e7490" strokeWidth={3} fill="url(#revenueFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
