import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";
import { getCurrentWorkspaceId } from "@/lib/workspace";
export default async function DashboardPage() {
  const supabase = await createClient();
  const workspaceId = await getCurrentWorkspaceId();

  const [
    { data: leads },
    { data: deals },
    { data: activities },
  ] = await Promise.all([
   supabase
  .from("leads")
  .select("id, status, created_at")
  .eq("workspace_id", workspaceId),

    supabase
  .from("deals")
  .select("id, value, stage, created_at")
  .eq("workspace_id", workspaceId),

    supabase
  .from("activities")
  .select(`
    id,
    type,
    description,
    created_at,
    leads (
      first_name,
      last_name
    ),
    deals (
      title
    )
  `)
  .eq("workspace_id", workspaceId)
  .order("created_at", { ascending: false })
  .limit(5),
  ]);

  const totalLeads = leads?.length ?? 0;

  const qualifiedLeads =
    leads?.filter((lead) => lead.status === "qualified").length ?? 0;

  const activeDeals =
    deals?.filter(
      (deal) =>
        deal.stage !== "won" &&
        deal.stage !== "lost"
    ).length ?? 0;

  const wonDeals =
    deals?.filter((deal) => deal.stage === "won") ?? [];

  const pipelineValue =
    deals
      ?.filter((deal) => deal.stage !== "lost")
      .reduce(
        (total, deal) => total + Number(deal.value ?? 0),
        0
      ) ?? 0;

  const wonRevenue = wonDeals.reduce(
    (total, deal) => total + Number(deal.value ?? 0),
    0
  );

  const totalClosedDeals =
    deals?.filter(
      (deal) =>
        deal.stage === "won" ||
        deal.stage === "lost"
    ).length ?? 0;

  const conversionRate =
    totalClosedDeals > 0
      ? Math.round(
          (wonDeals.length / totalClosedDeals) * 100
        )
      : 0;

  const dealStages = [
    "new",
    "contacted",
    "qualified",
    "proposal",
    "negotiation",
    "won",
    "lost",
  ];

  const dealsByStage = dealStages.map((stage) => ({
    stage,
    count:
      deals?.filter((deal) => deal.stage === stage).length ?? 0,
  }));

  const leadStatuses = [
    "new",
    "contacted",
    "qualified",
    "unqualified",
    "customer",
  ];

  const leadsByStatus = leadStatuses.map((status) => ({
    status,
    count:
      leads?.filter((lead) => lead.status === status).length ?? 0,
  }));

  const stats = [
    {
      title: "Total Leads",
      value: totalLeads.toLocaleString(),
    },
    {
      title: "Qualified Leads",
      value: qualifiedLeads.toLocaleString(),
    },
    {
      title: "Active Deals",
      value: activeDeals.toLocaleString(),
    },
    {
      title: "Pipeline Value",
      value: `$${pipelineValue.toLocaleString()}`,
    },
    {
      title: "Won Revenue",
      value: `$${wonRevenue.toLocaleString()}`,
    },
    {
      title: "Conversion Rate",
      value: `${conversionRate}%`,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard
        </h1>

        <p className="text-muted-foreground">
          Overview of your sales performance and pipeline.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="text-3xl font-bold">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AnalyticsCharts
        dealsByStage={dealsByStage}
        leadsByStatus={leadsByStatus}
      />

      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {activities && activities.length > 0 ? (
              activities.map((activity) => {
                const lead = activity.leads;
                const deal = activity.deals;

                return (
                  <div
                    key={activity.id}
                    className="flex items-start justify-between gap-4 border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium capitalize">
                        {activity.type.replace("_", " ")}
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {activity.description ?? "No description"}
                      </p>

                      <p className="mt-2 text-xs text-muted-foreground">
                        {lead
                          ? `Lead: ${lead.first_name} ${lead.last_name ?? ""}`
                          : ""}
                        {lead && deal ? " • " : ""}
                        {deal ? `Deal: ${deal.title}` : ""}
                      </p>
                    </div>

                    <span className="shrink-0 text-xs text-muted-foreground">
                      {activity.created_at
  ? new Date(activity.created_at).toLocaleString()
  : "—"}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground">
                No recent activities.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}