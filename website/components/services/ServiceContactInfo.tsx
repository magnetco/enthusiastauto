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
      <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-neutral-600">
        <a
          href="tel:513-554-1269"
          className="flex items-center gap-2 transition-colors hover:text-blue-600"
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
    <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-6">
      <h3 className="mb-4 flex items-center gap-2 font-semibold text-neutral-900">
        <Clock className="h-5 w-5 text-blue-600" />
        Service Department Hours
      </h3>

      <div className="mb-6 space-y-2">
        {hours.map(({ day, time }) => (
          <div key={day} className="flex justify-between text-sm">
            <span className="text-neutral-600">{day}</span>
            <span className={time === "Closed" ? "text-neutral-400" : "font-medium text-neutral-900"}>
              {time}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-3 border-t border-neutral-200 pt-4">
        <a
          href="tel:513-554-1269"
          className="flex items-center gap-3 text-lg font-bold text-blue-600 transition-colors hover:text-blue-700"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
            <Phone className="h-5 w-5" />
          </div>
          513-554-1269
        </a>

        <div className="flex items-start gap-3 text-sm text-neutral-600">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
            <MapPin className="h-5 w-5 text-neutral-500" />
          </div>
          <div>
            <p className="font-medium text-neutral-900">Enthusiast Auto Group</p>
            <p>11608 Reading Rd</p>
            <p>Cincinnati, OH 45241</p>
          </div>
        </div>
      </div>
    </div>
  );
}

