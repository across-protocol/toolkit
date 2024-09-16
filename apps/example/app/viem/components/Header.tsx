import { cn } from "@/lib/utils";
import { Icon } from "@/components/Icon";
import { ConnectButton } from "./ConnectButton";

export const Header = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  return (
    <div
      className={cn(
        "fixed top-0 z-20 flex w-full items-center justify-between bg-transparent p-4 md:p-5",
        className,
      )}
      {...props}
    >
      <div className="relative flex items-center justify-start gap-2">
        <Icon name="across-logo" className="h-8 w-8 text-accent" />
        <h2 className="text-gradient-oval text-2xl">SDK Example - Viem</h2>
      </div>

      <ConnectButton className="relative" />
    </div>
  );
};
