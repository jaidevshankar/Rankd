import Link from "next/link"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-black px-6 py-24">
      <div className="w-full max-w-md flex flex-col items-center gap-8">
        <h1 className="text-white text-6xl font-bold mt-24 mb-8">Rankd</h1>

        <div className="w-full space-y-6">
          <button className="w-full py-5 rounded-full bg-[#ff9500] text-black text-xl font-medium">&nbsp;</button>

          <button className="w-full py-5 rounded-full bg-[#b5a642] text-black text-xl font-medium">&nbsp;</button>

          <button className="w-full py-5 rounded-full bg-[#a39425] text-black text-xl font-medium">&nbsp;</button>

          <button className="w-full py-5 rounded-full bg-[#5c5215] text-black text-xl font-medium">&nbsp;</button>
        </div>

        <div className="mt-12 text-white text-lg">
          <Link href="/login" className="underline">
            Login
          </Link>
          <span> or </span>
          <Link href="/signup" className="underline">
            Sign Up
          </Link>
        </div>
      </div>
    </main>
  )
}
