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
import { AcrossChain } from "@across-protocol/integrator-sdk";
import { Skeleton } from "./ui";
import Image from "next/image";
import { Divider } from "./Divider";
import { SelectProps } from "@radix-ui/react-select";

export type ChainSelectProps = SelectProps & {
  chains: AcrossChain[] | undefined;
  chain: AcrossChain["chainId"] | undefined;
  onChainChange: (_chainId: AcrossChain["chainId"]) => void;
  className?: string;
  id?: string;
};

export function ChainSelect({
  chains,
  chain,
  onChainChange,
  id,
  className,
  ...props
}: ChainSelectProps) {
  if (!chains) {
    return (
      <Skeleton
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-border-secondary bg-background px-3 py-2 text-sm ",
          className,
        )}
      />
    );
  }
  return (
    <Select
      onValueChange={(value) => onChainChange(parseInt(value))}
      value={chain?.toString()}
      {...props}
    >
      <SelectTrigger id={id} className={cn("w-full", className)}>
        <SelectValue placeholder="Select a chain" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Select a chain</SelectLabel>
          <Divider className="my-3" />
          {chains.map((chain) => (
            <SelectItem key={chain.chainId} value={chain.chainId.toString()}>
              <div className="flex gap-2 items-center">
                <Image
                  alt={`logo for ${chain.name}`}
                  src={chain.logoUrl}
                  width={24}
                  height={24}
                />
                <p> {chain.name}</p>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
