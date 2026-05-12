export function Logo({ className = "" }: { className?: string }) {
  return (
    <div
      className={`inline-flex items-center font-light tracking-[3px] text-xl sm:text-2xl ${className}`}
    >
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
