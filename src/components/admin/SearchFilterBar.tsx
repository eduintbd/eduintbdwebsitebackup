import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SearchFilterBarProps {
  onSearchChange: (value: string) => void;
  onFilterChange: (filters: Filters) => void;
  filters: Filters;
}

export interface Filters {
  search: string;
  destination: string;
  stage: string;
  status: string;
  priority: string;
}

export function SearchFilterBar({
  onSearchChange,
  onFilterChange,
  filters,
}: SearchFilterBarProps) {
  const [localSearch, setLocalSearch] = useState(filters.search);

  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    onSearchChange(value);
  };

  const updateFilter = (key: keyof Filters, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    setLocalSearch("");
    onFilterChange({
      search: "",
      destination: "",
      stage: "",
      status: "",
      priority: "",
    });
  };

  const activeFilterCount = Object.values(filters).filter(
    (v) => v && v !== ""
  ).length;

  return (
    <div className="backdrop-blur-md bg-card/50 border border-border rounded-xl p-4 shadow-lg sticky top-20 z-10">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or phone..."
              value={localSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 bg-background/50"
            />
          </div>

          <Select
            value={filters.destination}
            onValueChange={(value) => updateFilter("destination", value)}
          >
            <SelectTrigger className="w-full lg:w-[180px] bg-background/50">
              <SelectValue placeholder="Destination" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Destinations</SelectItem>
              <SelectItem value="UK">UK</SelectItem>
              <SelectItem value="USA">USA</SelectItem>
              <SelectItem value="Canada">Canada</SelectItem>
              <SelectItem value="Australia">Australia</SelectItem>
              <SelectItem value="Germany">Germany</SelectItem>
              <SelectItem value="New Zealand">New Zealand</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.stage} onValueChange={(value) => updateFilter("stage", value)}>
            <SelectTrigger className="w-full lg:w-[180px] bg-background/50">
              <SelectValue placeholder="Stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="Lead Generation">Lead Generation</SelectItem>
              <SelectItem value="Qualification">Qualification</SelectItem>
              <SelectItem value="Counseling">Counseling</SelectItem>
              <SelectItem value="Application">Application</SelectItem>
              <SelectItem value="Admission & Visa">Admission & Visa</SelectItem>
              <SelectItem value="Pre-Departure">Pre-Departure</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.priority}
            onValueChange={(value) => updateFilter("priority", value)}
          >
            <SelectTrigger className="w-full lg:w-[180px] bg-background/50">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          {activeFilterCount > 0 && (
            <Button
              variant="outline"
              size="icon"
              onClick={clearFilters}
              className="shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2">
            {filters.destination && filters.destination !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {filters.destination}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => updateFilter("destination", "")}
                />
              </Badge>
            )}
            {filters.stage && filters.stage !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {filters.stage}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => updateFilter("stage", "")}
                />
              </Badge>
            )}
            {filters.priority && filters.priority !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {filters.priority}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => updateFilter("priority", "")}
                />
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
