import { cn } from "@/lib/utils";
import { Button, Input, InputProps } from "./ui";

export type TokenInputProps = InputProps & {
  onMax?: () => void;
  balance?: string;
  className?: string;
};

export function TokenInput({
  className,
  balance,
  onMax,
  ...props
}: TokenInputProps) {
  return (
    <div className={cn("relative", className)}>
      <Input className={cn({ "pr-[110px]": !!balance })} {...props} />
      {balance && (
        <div className="text-text/50 gap-2 text-sm flex items-center justify-center h-full absolute top-0 bottom-0 right-2 ">
          {balance}
          {onMax && (
            <Button
              className="text-xs rounded-md px-2 py-1 h-fit"
              variant="bordered"
              onClick={onMax}
            >
              MAX
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
