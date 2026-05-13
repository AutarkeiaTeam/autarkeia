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
    <div
      className={`inline-flex items-center gap-1 font-light tracking-[2px] text-[14px] sm:text-[15px] ${className}`}
    >
      <img
        src="/FAVICON10.png"
        alt=""
        width={40}
        height={40}
        className="h-10 w-10 shrink-0 object-contain"
        aria-hidden
      />
      <span>
        <span className="text-[#0d1b2a]">AUT</span>
        <span className="text-[#009b70]">ARK</span>
        <span className={edge}>EIA</span>
      </span>
    </>
  )
}

export function LogoLight({ className = "" }: { className?: string }) {
  return <Logo variant="footer" className={className} />
}
