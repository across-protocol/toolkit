import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bridge } from "./Bridge";
import { Stake } from "./Stake";
import { cn } from "@/lib/utils";

const TABS = {
  BRIDGE: "BRIDGE",
  STAKE: "STAKE",
} as const;

export function BridgeOrAction({ className }: { className?: string }) {
  return (
    <Tabs
      className={cn(
        "w-full max-w-[600px] gap-4 flex flex-col items-center justify-start",
        className,
      )}
      defaultValue={TABS.BRIDGE}
    >
      <TabsList>
        <TabsTrigger value={TABS.BRIDGE}>Bridge</TabsTrigger>
        <TabsTrigger value={TABS.STAKE}>Bridge + Action</TabsTrigger>
      </TabsList>

      <TabsContent className="w-full" value={TABS.BRIDGE}>
        <Bridge />
      </TabsContent>
      <TabsContent className="w-full" value={TABS.STAKE}>
        <Stake />
      </TabsContent>
    </Tabs>
  );
}
