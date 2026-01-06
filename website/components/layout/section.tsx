import { cn } from "@/lib/utils";
import { ElementType, HTMLAttributes, PropsWithChildren } from "react";
import Container from "./container";

type SectionProps = PropsWithChildren<
  HTMLAttributes<HTMLElement> & {
    as?: ElementType;
    containerClassName?: string;
    /** When true, section uses dark theme (for hero sections). Default is light theme. */
    dark?: boolean;
  }
>;

export default function Section({
  as: Tag = "section",
  className,
  containerClassName,
  children,
  dark = false,
  ...props
}: SectionProps) {
  return (
    <Tag className={cn(!dark && "light-section", "px-page-x", className)} {...props}>
      <Container className={containerClassName}>{children}</Container>
    </Tag>
  );
}

 