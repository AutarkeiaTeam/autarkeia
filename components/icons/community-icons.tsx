import type { ReactNode, SVGProps } from "react"

const VIEW_BOX = "0 0 64 64"

const strokeProps = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
}

type IconProps = SVGProps<SVGSVGElement>

function CommunityIcon({ children, className, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox={VIEW_BOX}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      {...props}
    >
      {children}
    </svg>
  )
}

/** Single house: pitched roof, door, two square windows. */
export function IndividualHomeIcon(props: IconProps) {
  return (
    <CommunityIcon {...props}>
      <path d="M32 16 L52 36 H12 Z" {...strokeProps} />
      <rect x="16" y="36" width="32" height="20" {...strokeProps} />
      <rect x="28" y="44" width="8" height="12" {...strokeProps} />
      <rect x="20" y="40" width="6" height="6" {...strokeProps} />
      <rect x="38" y="40" width="6" height="6" {...strokeProps} />
    </CommunityIcon>
  )
}

/** Three smaller houses in a row — clustered co-living. */
export function CoLivingIcon(props: IconProps) {
  const house = (ox: number) => (
    <g key={ox}>
      <path d={`M${ox + 8} 30 L${ox + 16} 38 H${ox} Z`} {...strokeProps} />
      <rect x={ox} y="38" width="16" height="12" {...strokeProps} />
      <rect x={ox + 5} y="42" width="4" height="4" {...strokeProps} />
    </g>
  )

  return (
    <CommunityIcon {...props}>
      {house(6)}
      {house(24)}
      {house(42)}
    </CommunityIcon>
  )
}

/** Long horizontal dwelling — shallow roof, spaced windows, centered door. */
export function CommunalLivingIcon(props: IconProps) {
  return (
    <CommunityIcon {...props}>
      <path d="M10 40 L32 28 L54 40 Z" {...strokeProps} />
      <rect x="10" y="40" width="44" height="14" {...strokeProps} />
      <rect x="14" y="44" width="5" height="5" {...strokeProps} />
      <rect x="22" y="44" width="5" height="5" {...strokeProps} />
      <rect x="37" y="44" width="5" height="5" {...strokeProps} />
      <rect x="45" y="44" width="5" height="5" {...strokeProps} />
      <rect x="29" y="46" width="6" height="8" {...strokeProps} />
    </CommunityIcon>
  )
}

/** Market stall: canopy on four posts with counter below. */
export function MarketIcon(props: IconProps) {
  return (
    <CommunityIcon {...props}>
      <path d="M14 34 L32 18 L50 34" {...strokeProps} />
      <line x1="16" y1="34" x2="16" y2="52" {...strokeProps} />
      <line x1="48" y1="34" x2="48" y2="52" {...strokeProps} />
      <line x1="14" y1="48" x2="50" y2="48" {...strokeProps} />
      <line x1="12" y1="52" x2="52" y2="52" {...strokeProps} />
    </CommunityIcon>
  )
}
