import { useMemo, memo } from "react";
import clsx from "clsx";

type Props = {
  dex: string;
  size?: number;
  className?: string;
};

function getLogoUrl(dex: string, px: number): string {
  const s = dex.toLowerCase();
  return `https://icons.llamao.fi/icons/protocols/${s}?w=${px}&h=${px}`;
}

export const ProtocolIcon = memo(function ({
  dex,
  size = 24,
  className,
}: Props) {
  const logoUrl = useMemo(() => getLogoUrl(dex, size), [dex, size]);
  return (
    <img
      src={logoUrl}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      className={clsx("inline-block rounded", className)}
      style={{ width: size, height: size }}
      title={dex}
    />
  );
});
