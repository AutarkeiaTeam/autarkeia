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

/** PNG white matte × #009b70 → brand green; glyph stays a darker green (same asset as header). */
function LogoImageFooter() {
  return (
    <span
      className={`relative isolate inline-block shrink-0 ${logoImgClass}`}
      aria-hidden
    >
      <span className="absolute inset-0 bg-[#009b70]" />
      <img
        src="/FAVICON10.png"
        alt=""
        width={40}
        height={40}
        className="absolute inset-0 h-full w-full object-contain mix-blend-multiply"
        aria-hidden
      />
    </span>
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
      <LogoImageFooter />
      <span>
        <span className="text-white">AUT</span>
        <span className="text-[#009b70]">ARK</span>
        <span className="text-white">EIA</span>
      </span>
    </div>
  )
}
