import clsx from "clsx";
import FlagIcon from "./icons/flag";
import TextIcon from "./icons/text";

export default function Logo({ size }: { size?: "sm" | undefined }) {
  return (
    <div
      className={clsx(
        "flex flex-none items-center justify-center pr-3 py-2",
        {
          "h-[40px]": !size,
          "h-[30px]": size === "sm",
        },
      )}
    >
      <div className="flex items-center gap-2">
        <FlagIcon
          className={clsx({
            "h-[24px] w-auto": !size,
            "h-[18px] w-auto": size === "sm",
          })}
        />
        <TextIcon
          className={clsx({
            "h-[24px] w-auto": !size,
            "h-[18px] w-auto": size === "sm",
          })}
        />
      </div>
    </div>
  );
}
