import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RecentItem {
  id: string;
  title: string;
  subtitle?: string;
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
  };
  value?: string;
  timestamp?: string;
}

interface RecentListCardProps {
  title: string;
  items: RecentItem[];
  emptyMessage?: string;
  className?: string;
}

/**
 * Reusable card displaying a list of recent items.
 * Used for Recent Orders, Recent Products, Low Stock alerts, etc.
 */
export function RecentListCard({
  title,
  items,
  emptyMessage = "No items",
  className,
}: RecentListCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            {emptyMessage}
          </p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{item.title}</p>
                  {item.subtitle && (
                    <p className="text-xs text-muted-foreground truncate">
                      {item.subtitle}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {item.badge && (
                    <Badge variant={item.badge.variant ?? "secondary"}>
                      {item.badge.label}
                    </Badge>
                  )}
                  {item.value && (
                    <span className="text-sm font-medium">{item.value}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
