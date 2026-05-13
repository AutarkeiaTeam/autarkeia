const wordmarkClass =
  "font-light tracking-[2px] text-[15px] sm:text-base"

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
    <>
      <img src="/FAVICON10.png" alt="" aria-hidden />
      <span className={`${wordmarkClass} ${className}`.trim()}>
        <span className={edge}>AUT</span>
        <span className="text-[#009b70]">ARK</span>
        <span className={edge}>EIA</span>
      </span>
    </>
  )
}

export function LogoLight({ className = "" }: { className?: string }) {
  return <Logo variant="footer" className={className} />
}
