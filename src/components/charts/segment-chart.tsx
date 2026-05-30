"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils/format";
import type { SegmentPerformance } from "@/types/analytics";

export function SegmentChart({ data }: { data: SegmentPerformance[] }) {
  return (
    <Card className="min-h-[360px]">
      <CardHeader>
        <div>
          <CardTitle>Segment performance</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">Revenue and pipeline by customer segment.</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="segment" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} tickFormatter={(value) => formatCurrency(Number(value))} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} contentStyle={{ borderRadius: 8, borderColor: "#d9e1ea" }} />
              <Bar dataKey="revenue" fill="#0e7490" radius={[6, 6, 0, 0]} />
              <Bar dataKey="pipeline" fill="#f59e0b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
