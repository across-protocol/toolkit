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
        "fixed top-0 z-20 h-[72px] flex w-full items-center justify-between bg-transparent px-4 md:px-6",
        className,
      )}
      {...props}
    >
      <div className="relative flex items-center justify-start gap-2">
        <Icon name="across-logo" className="h-8 w-8 text-accent" />
        <h2 className="text-text font-extralight text-xl">
          Integrator Toolkit Demo
        </h2>
      </div>

      <ConnectButton className="relative" />
    </div>
  );
};
