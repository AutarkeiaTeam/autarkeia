"use client"
import {{ useState }} from "react"
import Link from "next/link"

export default function Login() {{
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <div className="min-h-screen bg-[#f5f7fa] flex items-center justify-center px-4">
      <div className="bg-white border border-[#d4dce8] rounded-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <p className="text-xl font-light tracking-[3px] text-[#0d1b2a] mb-1">
              AUT<span className="text-[#009b70]">ARK</span>EIA
            </p>
          </Link>
          <h1 className="text-2xl font-light text-[#0d1b2a] mt-4 mb-2">Welcome back</h1>
          <p className="text-sm text-[#8a9bb0]">Sign in to your account</p>
        </div>
        <div className="flex flex-col gap-4 mb-6">
          <div>
            <label className="text-xs font-medium text-[#3d5166] mb-1.5 block">Email address</label>
            <input type="email" value={{email}} onChange={{e => setEmail(e.target.value)}} className="w-full border border-[#d4dce8] rounded-lg px-4 py-2.5 text-sm text-[#0d1b2a] outline-none focus:border-[#009b70] transition-colors" placeholder="you@example.com" />
          </div>
          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-xs font-medium text-[#3d5166]">Password</label>
              <a href="#" className="text-xs text-[#009b70] hover:underline">Forgot password?</a>
            </div>
            <input type="password" value={{password}} onChange={{e => setPassword(e.target.value)}} className="w-full border border-[#d4dce8] rounded-lg px-4 py-2.5 text-sm text-[#0d1b2a] outline-none focus:border-[#009b70] transition-colors" placeholder="••••••••" />
          </div>
        </div>
        <button className="w-full bg-[#009b70] text-white text-sm font-medium py-2.5 rounded-lg hover:bg-[#007a58] transition-colors mb-4">Sign in</button>
        <p className="text-center text-xs text-[#8a9bb0]">
          Don&apos;t have an account?{{" "}}
          <Link href="/signup" className="text-[#009b70] hover:underline font-medium">Create one free</Link>
        </p>
      </div>
    </div>
  )
}}
