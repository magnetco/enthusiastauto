import clsx from "clsx";
import LogoIcon from "./icons/logo";

export default function LogoSquare({ size }: { size?: "sm" | undefined }) {
  return (
    <div
      className={clsx(
        "flex flex-none items-center justify-center px-3 py-2",
        {
          "h-[40px]": !size,
          "h-[30px]": size === "sm",
        },
      )}
    >
      <LogoIcon
        className={clsx({
          "h-[24px]": !size,
          "h-[18px]": size === "sm",
        })}
      />
    </div>
  );
}
