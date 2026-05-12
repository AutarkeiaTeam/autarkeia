export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img src="/logo.png" alt="Autarkeia" width="32" height="32" className="h-8 w-8 flex-shrink-0 object-contain" />
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
    <div className={`flex items-center gap-2 ${className}`}>
      <img src="/logo.png" alt="Autarkeia" width="32" height="32" className="h-8 w-8 flex-shrink-0 object-contain" />
      <span className="font-light tracking-[3px] text-[13px]">
        <span className="text-white">AUT</span>
        <span className="text-[#009b70]">ARK</span>
        <span className="text-white">EIA</span>
      </span>
    </div>
  )
}
