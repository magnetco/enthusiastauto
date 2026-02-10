import { Clock, MapPin, Phone } from "lucide-react";

interface ServiceContactInfoProps {
  variant?: "card" | "inline";
}

const hours = [
  { day: "Monday", time: "8 am - 5 pm" },
  { day: "Tuesday", time: "8 am - 5 pm" },
  { day: "Wednesday", time: "8 am - 5 pm" },
  { day: "Thursday", time: "8 am - 5 pm" },
  { day: "Friday", time: "8 am - 5 pm" },
  { day: "Saturday - Sunday", time: "Closed" },
];

export function ServiceContactInfo({ variant = "card" }: ServiceContactInfoProps) {
  if (variant === "inline") {
    return (
      <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
        <a
          href="tel:513-554-1269"
          className="flex items-center gap-2 transition-colors hover:text-primary"
        >
          <Phone className="h-4 w-4" />
          <span>513-554-1269</span>
        </a>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>Monday-Friday, 8am - 5pm</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>11608 Reading Rd, Cincinnati, OH 45241</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-muted p-6">
      <h3 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
        <Clock className="h-5 w-5 text-primary" />
        Service Department Hours
      </h3>

      <div className="mb-6 space-y-2">
        {hours.map(({ day, time }) => (
          <div key={day} className="flex justify-between text-sm">
            <span className="text-muted-foreground">{day}</span>
            <span className={time === "Closed" ? "text-muted-foreground" : "font-medium text-foreground"}>
              {time}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-3 border-t border-border pt-4">
        <a
          href="tel:513-554-1269"
          className="flex items-center gap-3 text-lg font-bold text-primary transition-colors hover:text-primary/90"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Phone className="h-5 w-5" />
          </div>
          513-554-1269
        </a>

        <div className="flex items-start gap-3 text-sm text-muted-foreground">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
            <MapPin className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium text-foreground">Enthusiast Auto Group</p>
            <p>11608 Reading Rd</p>
            <p>Cincinnati, OH 45241</p>
          </div>
        </div>
      </div>
    </div>
  );
}

