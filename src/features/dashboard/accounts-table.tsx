import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils/format";
import type { AccountRow } from "@/types/analytics";

const healthTone = {
  Strong: "success",
  Watch: "warning",
  "At risk": "danger"
} as const;

export function AccountsTable({ rows }: { rows: AccountRow[] }) {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Priority accounts</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">Client-facing account health and renewal context.</p>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-border bg-muted/70 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-semibold">Account</th>
              <th className="px-5 py-3 font-semibold">Region</th>
              <th className="px-5 py-3 font-semibold">Segment</th>
              <th className="px-5 py-3 font-semibold">Owner</th>
              <th className="px-5 py-3 text-right font-semibold">Revenue</th>
              <th className="px-5 py-3 font-semibold">Health</th>
              <th className="px-5 py-3 font-semibold">Renewal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-muted/45">
                <td className="px-5 py-4 font-semibold text-foreground">{row.account}</td>
                <td className="px-5 py-4 text-muted-foreground">{row.region}</td>
                <td className="px-5 py-4 text-muted-foreground">{row.segment}</td>
                <td className="px-5 py-4 text-muted-foreground">{row.owner}</td>
                <td className="px-5 py-4 text-right font-semibold">{formatCurrency(row.revenue)}</td>
                <td className="px-5 py-4">
                  <Badge tone={healthTone[row.health]}>{row.health}</Badge>
                </td>
                <td className="px-5 py-4 text-muted-foreground">{row.renewalDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
