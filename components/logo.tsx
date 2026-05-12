import Image from "next/image"

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Image 
      src="/logo.png" 
      alt="Autarkeia" 
      width={40} 
      height={40} 
      className={className}
    />
  )
}

export function LogoLight({ className = "" }: { className?: string }) {
  return (
    <Image 
      src="/logo.png" 
      alt="Autarkeia" 
      width={40} 
      height={40} 
      className={className}
    />
  )
}