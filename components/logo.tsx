export function Logo({ className = "" }: { className?: string }) {
  return (
    <div
      className={`inline-flex items-center gap-2 font-light tracking-[2px] text-[15px] sm:text-base ${className}`}
    >
      <img
        src="/FAVICON10.png"
        alt=""
        width={40}
        height={40}
        className="h-9 w-9 shrink-0 object-contain sm:h-10 sm:w-10"
        aria-hidden
      />
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
    <div
      className={`inline-flex items-center font-light tracking-[3px] text-[13px] ${className}`}
    >
      <span>
        <span className="text-white">AUT</span>
        <span className="text-[#009b70]">ARK</span>
        <span className="text-white">EIA</span>
      </span>
    </div>
  )
}
