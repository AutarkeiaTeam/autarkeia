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
        <span className={edge}>AUT</span>
        <span className="text-[#009b70]">ARK</span>
        <span className={edge}>EIA</span>
      </span>
    </div>
  )
}

/** Footer brand: FOOTER1 mark + AUTARKEIA (light wordmark). */
export function LogoLight({ className = "" }: { className?: string }) {
  return (
    <div
      className={`inline-flex items-center gap-2 font-light tracking-[2px] text-[15px] sm:text-base ${className}`.trim()}
    >
      <img
        src="/FOOTER1.png"
        alt=""
        className="h-6 w-auto shrink-0 align-middle"
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
