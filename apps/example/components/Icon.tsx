type Props = React.ComponentPropsWithoutRef<"svg"> & {
  name: string;
  className?: string;
};

export function Icon({ name, className, ...props }: Props) {
  return (
    <svg className={className} {...props}>
      <use href={`icons.svg#${name}`} />
    </svg>
  );
}
