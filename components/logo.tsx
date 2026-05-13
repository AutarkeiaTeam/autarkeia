const logoShellClass =
  "inline-flex items-center gap-2 font-light tracking-[2px] text-[15px] sm:text-base text-[#009b70]"

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
  return (
    <div className={`${logoShellClass} ${className}`}>
      <LogoImage />
      {variant === "footer" ? (
        <span className="lowercase">autarkeia</span>
      ) : (
        <span>AUTARKEIA</span>
      )}
    </div>
  )
}

/** Footer brand row (same mark + sizing as header; lowercase wordmark). */
export function LogoLight({ className = "" }: { className?: string }) {
  return <Logo variant="footer" className={className} />
}
