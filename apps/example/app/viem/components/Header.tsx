"use client";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/Icon";
import { ConnectButton } from "./ConnectButton";
import { useScrollPosition } from "@/lib/hooks/useScrollPosition";

export const Header = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  const scrollPosition = useScrollPosition();

  return (
    <div
      className={cn(
        "fixed bg-background border-b border-transparent top-0 z-20 h-[72px] flex w-full items-center justify-between px-4 md:px-6",
        { "border-b-border": scrollPosition > 72 },
        className,
      )}
      {...props}
    >
      <div className="relative flex items-center justify-start gap-2">
        <Icon name="across-logo" className="h-8 w-8 text-accent" />
        <h2 className="text-text font-extralight text-xl">Integrator SDK</h2>
      </div>

      <ConnectButton className="relative" />
    </div>
  );
};
