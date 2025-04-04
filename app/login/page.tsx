import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="flex flex-col h-screen bg-[#000000]">
      <div className="flex-1 flex flex-col justify-center items-center p-6">
        <h1 className="text-4xl font-bold text-white mb-12">Rankd</h1>

        <div className="w-full space-y-4 max-w-xs">
          <button className="w-full py-3 rounded-full bg-[#ff9500] text-[#24262b] font-semibold">Continue</button>

          <button className="w-full py-3 rounded-full bg-[#d9d9d9]/80 text-[#24262b] font-semibold">Continue</button>

          <button className="w-full py-3 rounded-full bg-[#808080]/80 text-[#24262b] font-semibold">Continue</button>

          <button className="w-full py-3 rounded-full bg-[#808080]/60 text-[#24262b] font-semibold">Continue</button>
        </div>
      </div>

      <div className="p-6 text-center">
        <p className="text-white">
          <Link href="/login" className="underline">
            Login
          </Link>{" "}
          or{" "}
          <Link href="/signup" className="underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}
