const logoShellClass =
  "inline-flex items-center gap-2 font-light tracking-[2px] text-[15px] sm:text-base text-[#009b70]"

/** Same on-screen size everywhere (matches 40×40 favicon asset). */
const logoImgClass = "h-10 w-10 shrink-0 object-contain"

function LogoImage() {
  return (
    <img
      src="/FAVICON10.png"
      alt=""
      width={40}
      height={40}
      className={logoImgClass}
      aria-hidden
    />
  )
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`${logoShellClass} ${className}`}>
      <LogoImage />
      <span>AUTARKEIA</span>
    </div>
  )
}

/** Footer: raw asset + white wordmark only (no shared header shell styles). */
export function LogoLight() {
  return (
    <>
      <img src="/FAVICON10.png" alt="" width={40} height={40} />{" "}
      <span className="text-white">autarkeia</span>
    </>
  )
}
