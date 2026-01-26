import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { Objective } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ObjectiveProgressChartProps {
  objectives: Objective[];
  className?: string;
}

export function ObjectiveProgressChart({
  objectives,
  className,
}: ObjectiveProgressChartProps) {
  // Sort by progress descending and take top 5
  const data = useMemo(() => {
    return [...objectives]
      .sort((a, b) => b.progressPercentage - a.progressPercentage)
      .slice(0, 5)
      .map((obj) => ({
        name: obj.name,
        progress: Math.round(obj.progressPercentage),
        // Color based on progress
        color:
          obj.progressPercentage >= 100
            ? "hsl(var(--primary))" // Completed
            : obj.progressPercentage >= 50
            ? "hsl(var(--accent))" // Good progress
            : "hsl(var(--muted-foreground))", // Low progress
      }));
  }, [objectives]);

  if (data.length === 0) {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Top Objectives Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.3} />
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis
                type="category"
                dataKey="name"
                width={100}
                tick={{ fontSize: 12 }}
                tickFormatter={(value: string) =>
                  value.length > 15 ? `${value.substring(0, 15)}...` : value
                }
              />
              <Tooltip
                cursor={{ fill: "transparent" }}
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
                itemStyle={{ color: "hsl(var(--popover-foreground))" }}
                formatter={(value: number) => [`${value}%`, "Progress"]}
              />
              <Bar dataKey="progress" radius={[0, 4, 4, 0]} barSize={20}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
