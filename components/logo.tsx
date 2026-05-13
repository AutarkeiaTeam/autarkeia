"use client"

import { useId } from "react"

const logoShellClass =
  "inline-flex items-center gap-2 font-light tracking-[2px] text-[15px] sm:text-base"

const logoImgClass =
  "h-9 w-9 shrink-0 object-contain sm:h-10 sm:w-10"

function LogoImage() {
  return (
    <img
      src="/FAVICON10.png"
      alt=""
      width={40}
      height={40}
      className={logoImgClass}
      aria-hidden
    />
  )
}

/** White matte in PNG becomes mask holes; fill is flat #009b70 (no square underlay). */
function LogoMarkFooterSvg() {
  const safe = useId().replace(/:/g, "")
  const maskId = `footer-logo-mask-${safe}`
  const filterId = `footer-logo-inv-${safe}`

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
      width={40}
      height={40}
      className={logoImgClass}
      aria-hidden
    >
      <defs>
        <filter id={filterId} colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="-1 0 0 0 1  0 -1 0 0 1  0 0 -1 0 1  0 0 0 1 0"
          />
        </filter>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="40" height="40">
          <image
            href="/FAVICON10.png"
            width="40"
            height="40"
            preserveAspectRatio="xMidYMid meet"
            filter={`url(#${filterId})`}
          />
        </mask>
      </defs>
      <rect width="40" height="40" fill="#009b70" mask={`url(#${maskId})`} />
    </svg>
  )
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`${logoShellClass} ${className}`}>
      <LogoImage />
      <span>
        <span className="text-[#0d1b2a]">AUT</span>
        <span className="text-[#009b70]">ARK</span>
        <span className="text-[#0d1b2a]">EIA</span>
      </span>
    </div>
  )
}

export function LogoLight({ className = "" }: { className?: string }) {
  return (
    <div className={`${logoShellClass} ${className}`}>
      <LogoMarkFooterSvg />
      <span>
        <span className="text-white">AUT</span>
        <span className="text-[#009b70]">ARK</span>
        <span className="text-white">EIA</span>
      </span>
    </div>
  )
}
