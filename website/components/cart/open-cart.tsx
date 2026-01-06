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
    <div className="flex h-10 items-center gap-2 rounded-md border border-white/20 bg-transparent px-4 text-white/70 transition-colors hover:border-white/40 hover:text-white">
      <ShoppingCartIcon
        className={clsx(
          "h-5 w-5 transition-all ease-in-out",
          className,
        )}
      />
      <span className="text-sm font-medium">{quantity ?? 0}</span>
    </div>
  );
}
