export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <img src="/logo.png" alt="Autarkeia" width="96" height="96" className="w-24 h-24" />
      <span className="font-light tracking-[3px]">
        <span className="text-[#0d1b2a]">AUT</span>
        <span className="text-[#009b70]">ARK</span>
        <span className="text-[#0d1b2a]">EIA</span>
      </span>
    </div>
  )
}

export function LogoLight({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <img src="/logo.png" alt="Autarkeia" width="96" height="96" className="w-24 h-24" />
      <span className="font-light tracking-[3px]">
        <span className="text-white">AUT</span>
        <span className="text-[#009b70]">ARK</span>
        <span className="text-white">EIA</span>
      </span>
    </div>
  )
}
