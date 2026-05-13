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

export type LogoVariant = "header" | "footer"

export function Logo({
  className = "",
  variant = "header",
}: {
  className?: string
  variant?: LogoVariant
}) {
  const edge =
    variant === "header" ? "text-[#0d1b2a]" : "text-white"
  return (
    <div className={`${logoShellClass} ${className}`}>
      <LogoImage />
      <span>
        <span className={edge}>AUT</span>
        <span className="text-[#009b70]">ARK</span>
        <span className={edge}>EIA</span>
      </span>
    </div>
  )
}

/** Same layout and mark as header; wordmark for dark footer (AUT/EIA white, ARK green). */
export function LogoLight({ className = "" }: { className?: string }) {
  return <Logo variant="footer" className={className} />
}
