import { LoadingIndicator, Status } from "@/components/LoadingIndicator";
import { cn } from "@/lib/utils";
import { ExecutionProgress } from "@across-toolkit/sdk";

export type ProgressProps = {
  progress: ExecutionProgress;
  error?: Error | null;
  className?: string;
};

export function Progress({ progress, error, className }: ProgressProps) {
  if (progress.status === "idle") {
    return;
  }

  if (progress.status === "error") {
    return (
      <p className={cn("text-destructive", className)}>
        An Unknown error occurred
      </p>
    );
  }

  const status = (() => {
    if (
      progress.status === "txError" ||
      progress.status === "txSimulationError"
    ) {
      return Status.ERROR;
    }
    if (progress.status === "txSuccess" && progress.type === "fill") {
      return Status.SUCCESS;
    }
    return Status.PENDING;
  })();

  const label = (() => {
    if (progress.type === "approve") {
      return "Approving ERC20 spend...";
    }
    if (progress.type === "deposit") {
      return "Depositing on origin chain...";
    }
    if (progress.type === "fill" && progress.status === "txSuccess") {
      return "Bridge complete!";
    }

    if (progress.type === "fill" && progress.status !== "txSuccess") {
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
