import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function UsersTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-6 w-1/4 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-2/4 animate-pulse rounded-md bg-muted" />
        <div className="flex items-center gap-2 pt-4">
          <div className="relative flex-1">
            <div className="h-10 animate-pulse rounded-md bg-muted" />
          </div>
          <div className="h-10 w-32 animate-pulse rounded-md bg-muted" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border">
          <div className="divide-y">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4">
                <div className="grid gap-1">
                  <div className="h-5 w-32 animate-pulse rounded-md bg-muted" />
                  <div className="h-4 w-48 animate-pulse rounded-md bg-muted" />
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-4 w-24 animate-pulse rounded-md bg-muted" />
                  <div className="h-6 w-20 animate-pulse rounded-md bg-muted" />
                  <div className="h-6 w-16 animate-pulse rounded-md bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
