import { LoadingIndicator, Status } from "@/components/LoadingIndicator";
import { cn } from "@/lib/utils";
import { ExecutionProgress, SwapExecutionProgress } from "@across-protocol/app-sdk";

export type ProgressProps = {
  progress: ExecutionProgress | SwapExecutionProgress;
  error?: Error | null;
  className?: string;
};

// TODO: make more fully featured
export function Progress({ progress, error, className }: ProgressProps) {
  if (progress.status === "idle") {
    return;
  }

  const status = (() => {
    if (
      progress.status === "txError" ||
      progress.status === "simulationError" ||
      progress.status === "error"
    ) {
      return Status.ERROR;
    }
    if (progress.status === "txSuccess" && progress.step === "fill") {
      return Status.SUCCESS;
    }
    return Status.PENDING;
  })();

  const label = (() => {
    if (
      progress.status === "txError" ||
      progress.status === "simulationError" ||
      progress.status === "error"
    ) {
      return progress.error.name;
    }
    if (progress.step === "approve") {
      return "Approving ERC20 spend...";
    }
    if (progress.step === "deposit") {
      return "Depositing on origin chain...";
    }
    if (progress.step === "fill" && progress.status === "txSuccess") {
      return "Bridge complete!";
    }

    if (progress.step === "fill" && progress.status === "txPending") {
      return "Filling on destination chain...";
    }
  })();

  return (
    <div
      className={cn("px-2 w-full flex flex-col items-center gap-2", className)}
    >
      <p className="text-text/75 text-sm">{label}</p>
      <LoadingIndicator status={status} />
    </div>
  );
}
