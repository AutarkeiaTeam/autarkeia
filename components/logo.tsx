export function Logo({ className = "" }: { className?: string }) {
  return (
    <div
      className={`inline-flex items-center gap-2 font-light tracking-[3px] text-xl sm:text-2xl ${className}`}
    >
      <img
        src="/FAVICON10.png"
        alt=""
        width={48}
        height={48}
        className="h-10 w-10 shrink-0 object-contain sm:h-11 sm:w-11"
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
