import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { TokenInfo } from "@across-toolkit/sdk";
import { Skeleton } from "./ui";
import Image from "next/image";
import { SelectProps } from "@radix-ui/react-select";

export type TokenSelectProps = SelectProps & {
  tokens: TokenInfo[] | undefined;
  className?: string;
};

export function TokenSelect({ tokens, className, ...props }: TokenSelectProps) {
  if (!tokens) {
    return (
      <Skeleton
        className={cn(
          "flex h-10 min-h-10 w-full items-center justify-between rounded-md border border-border-secondary bg-background px-3 py-2 text-sm ",
          className,
        )}
      />
    );
  }

  return (
    <Select {...props}>
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue placeholder="Select a Token" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Select a Token</SelectLabel>
          {tokens.map((token) => (
            <SelectItem
              key={token.address + token.symbol}
              value={token.address}
            >
              <div className="flex gap-2 items-center">
                <Image
                  alt={`logo for ${token.name}`}
                  src={token.logoUrl}
                  width={24}
                  height={24}
                />
                <p>{token.symbol}</p>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
