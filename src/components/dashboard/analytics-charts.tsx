"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type DealsByStage = {
  stage: string;
  count: number;
};

type LeadsByStatus = {
  status: string;
  count: number;
};

type AnalyticsChartsProps = {
  dealsByStage: DealsByStage[];
  leadsByStatus: LeadsByStatus[];
};

function formatLabel(value: string) {
  return value
    .replace("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function AnalyticsCharts({
  dealsByStage,
  leadsByStatus,
}: AnalyticsChartsProps) {
  const formattedDeals = dealsByStage.map((item) => ({
    ...item,
    stage: formatLabel(item.stage),
  }));

  const formattedLeads = leadsByStatus.map((item) => ({
    ...item,
    status: formatLabel(item.status),
  }));

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Deals by Stage</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formattedDeals}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="stage"
                  tick={{ fontSize: 12 }}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={70}
                />

                <YAxis allowDecimals={false} />

                <Tooltip />

                <Bar
                  dataKey="count"
                  fill="currentColor"
                  className="fill-primary"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Leads by Status</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formattedLeads}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="status"
                  tick={{ fontSize: 12 }}
                />

                <YAxis allowDecimals={false} />

                <Tooltip />

                <Bar
                  dataKey="count"
                  fill="currentColor"
                  className="fill-primary"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}