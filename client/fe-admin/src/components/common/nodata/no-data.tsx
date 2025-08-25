import { FileX } from "lucide-react";

export function NoData({
  message = "No data available",
}: {
  message?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
      <FileX className="h-12 w-12 mb-3" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
