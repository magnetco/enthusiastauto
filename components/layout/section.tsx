import { cn } from "@/lib/utils";
import { ElementType, HTMLAttributes, PropsWithChildren } from "react";
import Container from "./container";

type SectionProps = PropsWithChildren<
  HTMLAttributes<HTMLElement> & {
    as?: ElementType;
    containerClassName?: string;
  }
>;

export default function Section({
  as: Tag = "section",
  className,
  containerClassName,
  children,
  ...props
}: SectionProps) {
  return (
    <Tag className={cn("px-page-x", className)} {...props}>
      <Container className={containerClassName}>{children}</Container>
    </Tag>
  );
}

 