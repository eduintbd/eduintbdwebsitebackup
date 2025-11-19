import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, ExternalLink, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SavedResource {
  id: string;
  title: string;
  url: string;
  category: string;
  saved_at: string;
}

interface SavedResourcesProps {
  studentId: string;
}

export function SavedResources({ studentId }: SavedResourcesProps) {
  const [resources, setResources] = useState<SavedResource[]>([]);
  const { toast } = useToast();

  // Predefined resources that students can save
  const availableResources = [
    { title: "IELTS Learning Platform", url: "/ielts-learning", category: "Learning" },
    { title: "Study Abroad Planner", url: "/study-planner", category: "Planning" },
    { title: "AI Education Advisor", url: "/ai-advisor", category: "Guidance" },
    { title: "Accommodation Finder", url: "/accommodation", category: "Living" },
    { title: "Visa Assistance", url: "/visa", category: "Documentation" },
    { title: "Scholarship Guide", url: "/scholarship", category: "Finance" },
    { title: "Pre-Departure Guide", url: "/pre-departure", category: "Travel" },
    { title: "Career Counseling", url: "/career", category: "Career" },
  ];

  useEffect(() => {
    loadSavedResources();
  }, [studentId]);

  const loadSavedResources = async () => {
    // For now, store in localStorage as we don't have a saved_resources table
    const saved = localStorage.getItem(`saved_resources_${studentId}`);
    if (saved) {
      setResources(JSON.parse(saved));
    }
  };

  const saveResource = (resource: { title: string; url: string; category: string }) => {
    const newResource: SavedResource = {
      id: Date.now().toString(),
      ...resource,
      saved_at: new Date().toISOString(),
    };

    const updated = [...resources, newResource];
    setResources(updated);
    localStorage.setItem(`saved_resources_${studentId}`, JSON.stringify(updated));

    toast({
      title: "Resource Saved",
      description: `${resource.title} added to your saved resources.`,
    });
  };

  const removeResource = (id: string) => {
    const updated = resources.filter((r) => r.id !== id);
    setResources(updated);
    localStorage.setItem(`saved_resources_${studentId}`, JSON.stringify(updated));

    toast({
      title: "Resource Removed",
      description: "Resource removed from your saved list.",
    });
  };

  const isResourceSaved = (url: string) => {
    return resources.some((r) => r.url === url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bookmark className="h-5 w-5" />
          Resources & Tools
        </CardTitle>
        <CardDescription>Save and access helpful resources</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Available Resources */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Available Resources</h3>
          <div className="grid gap-2">
            {availableResources.map((resource) => (
              <div
                key={resource.url}
                className="flex items-center justify-between p-2 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium">{resource.title}</p>
                  <p className="text-xs text-muted-foreground">{resource.category}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                  >
                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                  {!isResourceSaved(resource.url) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => saveResource(resource)}
                    >
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Saved Resources */}
        {resources.length > 0 && (
          <div className="space-y-2 pt-4 border-t">
            <h3 className="text-sm font-semibold">Your Saved Resources</h3>
            <div className="grid gap-2">
              {resources.map((resource) => (
                <div
                  key={resource.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-primary/5 border border-primary/20"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{resource.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Saved {new Date(resource.saved_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                    >
                      <a href={resource.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeResource(resource.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
