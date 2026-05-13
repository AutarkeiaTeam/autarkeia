const logoShellClass =
  "inline-flex items-center gap-2 font-light tracking-[2px] text-[15px] sm:text-base"

/** Same on-screen size everywhere (matches 40×40 favicon asset). */
const logoImgClass = "h-10 w-10 shrink-0 object-contain"

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

/** Footer brand: FOOTER1 mark + AUTARKEIA (light wordmark). */
export function LogoLight({ className = "" }: { className?: string }) {
  return (
    <div
      className={`inline-flex items-center gap-2 bg-transparent font-light tracking-[2px] text-[15px] sm:text-base ${className}`.trim()}
    >
      <img
        src="/FOOTER1.png"
        alt=""
        className="h-6 w-auto shrink-0 bg-transparent align-middle"
        decoding="async"
        aria-hidden
      />
      <span>
        <span className="text-white">AUT</span>
        <span className="text-[#009b70]">ARK</span>
        <span className="text-white">EIA</span>
      </span>
    </div>
  )
}
