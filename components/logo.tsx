export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img src="/logo.png" alt="Autarkeia" width="60" height="60" className="w-16 aspect-square object-contain flex-shrink-0" />
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
    <div className={`flex items-center gap-2 ${className}`}>
      <img src="/logo.png" alt="Autarkeia" width="60" height="60" className="w-16 aspect-square object-contain flex-shrink-0" />
      <span className="font-light tracking-[3px]">
        <span className="text-white">AUT</span>
        <span className="text-[#009b70]">ARK</span>
        <span className="text-white">EIA</span>
      </span>
    </div>
  )
}
