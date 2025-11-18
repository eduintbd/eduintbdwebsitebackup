import { Button } from "@/components/ui/button";
import { Table, Columns } from "lucide-react";

interface ViewSwitcherProps {
  view: "table" | "kanban";
  onViewChange: (view: "table" | "kanban") => void;
}

export function ViewSwitcher({ view, onViewChange }: ViewSwitcherProps) {
  return (
    <div className="flex gap-2 backdrop-blur-sm bg-card/50 border border-border rounded-lg p-1">
      <Button
        variant={view === "table" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("table")}
        className="gap-2"
      >
        <Table className="h-4 w-4" />
        Table View
      </Button>
      <Button
        variant={view === "kanban" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("kanban")}
        className="gap-2"
      >
        <Columns className="h-4 w-4" />
        Kanban View
      </Button>
    </div>
  );
}
