"use client";
import { Button, ButtonProps } from "@/components/ui/button";
import { Icon } from "@/components/Icon";
import { cn } from "@/lib/utils";
import { shortenIfAddress, useEthers } from "@usedapp/core";

type ConnectButton = {
  className?: string;
};

export const ConnectButton = ({ className }: ConnectButton) => {
  const { account, active, activateBrowserWallet, deactivate } = useEthers();
  const connected = !!account && !!active;

  return (
    <div className={cn(className)}>
      {(() => {
        if (!connected) {
          return <HamburgerButton onClick={activateBrowserWallet} />;
        }
        // if (connected) {
        //   return (
        //     <Button variant="bordered" onClick={openChainModal} type="button">
        //       Wrong network
        //     </Button>
        //   );
        // }
        return (
          <div className="flex items-center gap-2">
            <Button
              className="flex gap-1"
              variant="bordered"
              onClick={deactivate}
            >
              <span className="max-w-[120px] truncate">
                {shortenIfAddress(account)}
              </span>
            </Button>
          </div>
        );
      })()}
    </div>
  );
};

const HamburgerButton = (props: ButtonProps) => {
  return (
    <Button
      size="icon"
      variant="bordered"
      className="h-[40px] w-[40px]"
      {...props}
    >
      <Icon name="hamburger" className="h-[20px] w-[20px] text-text/75" />
    </Button>
  );
};
