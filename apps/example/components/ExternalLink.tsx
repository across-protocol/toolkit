import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "./ui";
import Link from "next/link";
import { Icon } from "./Icon";

export type ExternalLinkProps = {
  href: string;
  variant?: ButtonProps["variant"];
  icon?: boolean;
  className?: string;
  children?: React.ReactNode;
};

export function ExternalLink({
  href,
  icon = false,
  className,
  variant,
  children,
  ...props
}: ExternalLinkProps) {
  return (
    <Button
      variant={variant}
      asChild
      className={cn(
        "text-text/75 hover:text-text hover:border-text border border-border-secondary rounded-md px-3 py-2 flex gap-2 items-center",
        className,
      )}
    >
      <Link target="_blank" href={href} {...props}>
        {children}
        {icon && (
          <Icon className="w-[1em] h-[1em] text-inherit" name="link-external" />
        )}
      </Link>
    </Button>
  );
}
