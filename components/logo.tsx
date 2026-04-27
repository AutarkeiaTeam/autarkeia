export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`font-light tracking-[3px] ${className}`}>
      <span className="text-[#0d1b2a]">AUT</span>
      <span className="text-[#009b70]">ARK</span>
      <span className="text-[#0d1b2a]">EIA</span>
    </span>
  )
}

export function LogoLight({ className = "" }: { className?: string }) {
  return (
    <span className={`font-light tracking-[3px] ${className}`}>
      <span className="text-white">AUT</span>
      <span className="text-[#009b70]">ARK</span>
      <span className="text-white">EIA</span>
    </span>
  )
}
