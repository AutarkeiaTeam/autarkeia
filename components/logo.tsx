import Image from "next/image"

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <Image 
        src="/logo.png" 
        alt="Autarkeia" 
        width={32} 
        height={32} 
        priority
      />
    </div>
  )
}

export function LogoLight({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <Image 
        src="/logo.png" 
        alt="Autarkeia" 
        width={32} 
        height={32} 
        priority
      />
    </div>
  )
}