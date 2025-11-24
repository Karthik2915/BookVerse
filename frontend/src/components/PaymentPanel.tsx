
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "./ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "./ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

const chartData = [
  { month: "January", earnings: 186 },
  { month: "February", earnings: 305 },
  { month: "March", earnings: 237 },
  { month: "April", earnings: 73 },
  { month: "May", earnings: 209 },
  { month: "June", earnings: 214 },
];

const chartConfig = {
  earnings: {
    label: "Earnings",
    color: "#2563eb",
  },
};

const paymentHistory = [
  { date: "2024-05-01", amount: "$150.00", status: "Paid" },
  { date: "2024-04-01", amount: "$200.00", status: "Paid" },
  { date: "2024-03-01", amount: "$100.00", status: "Paid" },
];

export function PaymentPanel() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-center mb-8">Payment Panel</h1>
        <Card>
          <CardHeader>
            <CardTitle>Your Earnings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-4xl font-bold">$1,014.00</div>

            <div>
              <h3 className="font-semibold mb-4">Earnings Over Time</h3>
              <ChartContainer
                config={chartConfig}
                className="w-full h-[300px]"
              >
                <BarChart data={chartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar
                    dataKey="earnings"
                    fill="var(--color-earnings)"
                    radius={4}
                  />
                </BarChart>
              </ChartContainer>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Payment History</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentHistory.map((payment, index) => (
                    <TableRow key={index}>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>{payment.amount}</TableCell>
                      <TableCell>{payment.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <Button>Withdraw Earnings</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
