import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<"svg"> & {
  name: string;
  className?: string;
};

export function Icon({ name, className, ...props }: Props) {
  return (
    <svg className={cn("w-[1em] h-[1em] inline", className)} {...props}>
      <use href={`icons.svg#${name}`} />
    </svg>
  );
}
