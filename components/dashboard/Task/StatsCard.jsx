import { Card, CardContent } from "@/components/ui/card";

export function StatsCard({ title, value, icon }) {
  return (
    <Card className="min-w-[180px] h-[88px] border-[#6387CE] flex items-center justify-start p-3">
      <CardContent className="px-4 py-2 flex items-center gap-3 w-full">
        <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
          <img
            src={icon || "/placeholder.svg"}
            alt={title}
            className="max-w-full max-h-full object-contain"
          />
        </div>
        <div className="flex flex-col justify-center text-left leading-tight">
          <p className="text-sm font-medium truncate">{title}</p>
          <p className="text-base font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
