import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

export default function OpenCart({
  className,
  quantity,
}: {
  className?: string;
  quantity?: number;
}) {
  return (
    <div className="relative flex h-10 w-10 items-center justify-center rounded-md text-white/70 transition-colors hover:text-white">
      <ShoppingCartIcon
        className={clsx(
          "h-5 w-5 transition-all ease-in-out",
          className,
        )}
      />

      {quantity ? (
        <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] font-bold text-black">
          {quantity}
        </div>
      ) : null}
    </div>
  );
}
