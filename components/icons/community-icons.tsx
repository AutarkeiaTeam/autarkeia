import type { ReactNode, SVGProps } from "react"

const VIEW_BOX = "0 0 64 64"

const strokeProps = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 4,
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

/** Single family home — arched roof, round windows, rounded door. */
export function IndividualHomeIcon(props: IconProps) {
  return (
    <CommunityIcon {...props}>
      <path d="M 14 38 Q 32 9 50 38" {...strokeProps} />
      <rect x="15" y="38" width="34" height="20" rx="5" {...strokeProps} />
      <rect x="27" y="44" width="10" height="14" rx="3" {...strokeProps} />
      <circle cx="22" cy="42" r="4" {...strokeProps} />
      <circle cx="42" cy="42" r="4" {...strokeProps} />
    </CommunityIcon>
  )
}

/** Three clustered homes — center house tallest, simplified bodies only. */
export function CoLivingIcon(props: IconProps) {
  return (
    <CommunityIcon {...props}>
      <path d="M 6 34 Q 13 18 20 34" {...strokeProps} />
      <rect x="6" y="34" width="14" height="14" rx="4" {...strokeProps} />
      <path d="M 22 32 Q 32 10 42 32" {...strokeProps} />
      <rect x="22" y="32" width="20" height="18" rx="4" {...strokeProps} />
      <path d="M 44 34 Q 51 18 58 34" {...strokeProps} />
      <rect x="44" y="34" width="14" height="14" rx="4" {...strokeProps} />
    </CommunityIcon>
  )
}

/** Longhouse — shallow arched roof, round windows, centered door. */
export function CommunalLivingIcon(props: IconProps) {
  return (
    <CommunityIcon {...props}>
      <path d="M 8 40 Q 32 28 56 40" {...strokeProps} />
      <rect x="8" y="40" width="48" height="16" rx="5" {...strokeProps} />
      <circle cx="16" cy="46" r="3.5" {...strokeProps} />
      <circle cx="26" cy="46" r="3.5" {...strokeProps} />
      <circle cx="38" cy="46" r="3.5" {...strokeProps} />
      <circle cx="48" cy="46" r="3.5" {...strokeProps} />
      <rect x="28" y="44" width="8" height="12" rx="3" {...strokeProps} />
    </CommunityIcon>
  )
}

/** Market stall — arched canopy, two posts, counter, produce circles. */
export function MarketIcon(props: IconProps) {
  return (
    <CommunityIcon {...props}>
      <path d="M 12 36 Q 32 12 52 36" {...strokeProps} />
      <line x1="18" y1="36" x2="18" y2="54" {...strokeProps} />
      <line x1="46" y1="36" x2="46" y2="54" {...strokeProps} />
      <line x1="18" y1="48" x2="46" y2="48" {...strokeProps} />
      <circle cx="26" cy="43" r="3.5" {...strokeProps} />
      <circle cx="38" cy="43" r="3.5" {...strokeProps} />
    </CommunityIcon>
  )
}
