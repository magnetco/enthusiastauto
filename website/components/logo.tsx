import clsx from "clsx";
import LogoIcon from "./icons/logo";

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
      <LogoIcon
        className={clsx({
          "h-[24px] w-auto": !size,
          "h-[18px] w-auto": size === "sm",
        })}
      />
    </div>
  );
}
