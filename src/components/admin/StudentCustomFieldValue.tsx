import { Badge } from "@/components/ui/badge";
import { CheckCircle2, X } from "lucide-react";

interface CustomFieldValueProps {
  fieldType: string;
  value: string | null;
  options?: any;
}

export function StudentCustomFieldValue({ fieldType, value, options }: CustomFieldValueProps) {
  if (!value) {
    return <span className="text-muted-foreground text-sm">Not set</span>;
  }

  switch (fieldType) {
    case 'boolean':
      return value === 'true' || value === '1' ? (
        <CheckCircle2 className="h-4 w-4 text-green-500" />
      ) : (
        <X className="h-4 w-4 text-muted-foreground" />
      );
    
    case 'date':
      try {
        return <span className="text-sm">{new Date(value).toLocaleDateString()}</span>;
      } catch {
        return <span className="text-sm">{value}</span>;
      }
    
    case 'select':
      return <Badge variant="outline" className="text-xs">{value}</Badge>;
    
    case 'number':
      return <span className="text-sm">{parseFloat(value).toLocaleString()}</span>;
    
    case 'textarea':
      return (
        <span className="text-sm max-w-xs truncate block" title={value}>
          {value}
        </span>
      );
    
    case 'text':
    default:
      return <span className="text-sm">{value}</span>;
  }
}
