export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center ${className}`}>
      <span className="font-light tracking-[3px] text-[13px]">
        <span className="text-[#0d1b2a]">AUT</span>
        <span className="text-[#009b70]">ARK</span>
        <span className="text-[#0d1b2a]">EIA</span>
      </span>
    </div>
  )
}

export function LogoLight({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center ${className}`}>
      <span className="font-light tracking-[3px] text-[13px]">
        <span className="text-white">AUT</span>
        <span className="text-[#009b70]">ARK</span>
        <span className="text-white">EIA</span>
      </span>
    </div>
  )
}
