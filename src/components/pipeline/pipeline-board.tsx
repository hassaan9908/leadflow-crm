"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
const stages = [
  "new",
  "contacted",
  "qualified",
  "proposal",
  "negotiation",
  "won",
  "lost",
] as const;

type Stage = (typeof stages)[number];

type Deal = {
  id: string;
  title: string;
  value: number;
  stage: string;
  expected_close_date: string | null;
  companyName: string | null;
  leadName: string | null;
};

type PipelineBoardProps = {
  initialDeals: Deal[];
  workspaceId: string;
};

export function PipelineBoard({
  initialDeals,
  workspaceId,
}: PipelineBoardProps) {
  const [deals, setDeals] = useState(initialDeals);
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const totalPipelineValue = deals.reduce(
    (total, deal) => total + deal.value,
    0
  );

  function handleDragStart(event: DragStartEvent) {
    const deal = deals.find(
      (item) => item.id === event.active.id
    );

    if (deal) {
      setActiveDeal(deal);
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveDeal(null);

    const { active, over } = event;

    if (!over) return;

    const dealId = String(active.id);
    const newStage = String(over.id) as Stage;

    if (!stages.includes(newStage)) return;

    const currentDeal = deals.find(
      (deal) => deal.id === dealId
    );

    if (!currentDeal) return;

    if (currentDeal.stage === newStage) return;

    const previousDeals = deals;

    // Optimistic UI update
    setDeals((currentDeals) =>
      currentDeals.map((deal) =>
        deal.id === dealId
          ? { ...deal, stage: newStage }
          : deal
      )
    );

    const supabase = createClient();

    const { error } = await supabase
  .from("deals")
  .update({
    stage: newStage,
  })
  .eq("id", dealId)
  .eq("workspace_id", workspaceId);

if (error) {
  console.error("Failed to update deal:", error);

  // Rollback UI
  setDeals(previousDeals);

  toast.error("Failed to update deal stage.");

  return;
}

toast.success(
  `${currentDeal.title} moved to ${formatStage(newStage)}.`
);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-8 rounded-lg border bg-background p-4">
        <div>
          <p className="text-sm text-muted-foreground">
            Total Deals
          </p>

          <p className="text-2xl font-bold">
            {deals.length}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Pipeline Value
          </p>

          <p className="text-2xl font-bold">
            ${totalPipelineValue.toLocaleString()}
          </p>
        </div>
      </div>

      <DndContext
  id="leadflow-pipeline-dnd"
  sensors={sensors}
  onDragStart={handleDragStart}
  onDragEnd={handleDragEnd}
>
        <div className="overflow-x-auto pb-4">
          <div className="flex min-w-max gap-4">
            {stages.map((stage) => {
              const stageDeals = deals.filter(
                (deal) => deal.stage === stage
              );

              return (
                <PipelineColumn
                  key={stage}
                  stage={stage}
                  deals={stageDeals}
                />
              );
            })}
          </div>
        </div>

        <DragOverlay>
          {activeDeal ? (
            <div className="w-72">
              <DealCard deal={activeDeal} overlay />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

function PipelineColumn({
  stage,
  deals,
}: {
  stage: Stage;
  deals: Deal[];
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage,
  });

  const stageValue = deals.reduce(
    (total, deal) => total + deal.value,
    0
  );

  return (
    <div
      ref={setNodeRef}
      className={`w-72 shrink-0 rounded-lg border transition-colors ${
        isOver
          ? "bg-primary/5"
          : "bg-muted/20"
      }`}
    >
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">
            {formatStage(stage)}
          </h2>

          <Badge variant="secondary">
            {deals.length}
          </Badge>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">
          ${stageValue.toLocaleString()}
        </p>
      </div>

      <div className="min-h-40 space-y-3 p-3">
        {deals.length > 0 ? (
          deals.map((deal) => (
            <DraggableDeal
              key={deal.id}
              deal={deal}
            />
          ))
        ) : (
          <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
            Drop deal here
          </div>
        )}
      </div>
    </div>
  );
}

function DraggableDeal({
  deal,
}: {
  deal: Deal;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: deal.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={isDragging ? "opacity-30" : ""}
    >
      <DealCard deal={deal} />
    </div>
  );
}

function DealCard({
  deal,
  overlay = false,
}: {
  deal: Deal;
  overlay?: boolean;
}) {
  return (
    <div
      className={`cursor-grab rounded-lg border bg-background p-4 shadow-sm active:cursor-grabbing ${
        overlay ? "shadow-lg" : ""
      }`}
    >
      <Link
  href={`/dashboard/pipeline/${deal.id}`}
  className="font-medium hover:underline"
  onPointerDown={(event) => event.stopPropagation()}
>
  {deal.title}
</Link>

      <p className="mt-1 text-lg font-semibold">
        ${deal.value.toLocaleString()}
      </p>

      <div className="mt-3 space-y-1 text-sm text-muted-foreground">
        <p>
          Company: {deal.companyName ?? "No company"}
        </p>

        <p>
          Lead: {deal.leadName ?? "No lead"}
        </p>

        <p>
          Close:{" "}
          {deal.expected_close_date
            ? new Date(
                deal.expected_close_date
              ).toLocaleDateString()
            : "—"}
        </p>
      </div>
    </div>
  );
}

function formatStage(stage: string) {
  return stage.charAt(0).toUpperCase() + stage.slice(1);
}