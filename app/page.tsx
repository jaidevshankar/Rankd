"use client"

import { useState } from "react"
import { Home, Search, Users, MenuIcon, AlignLeft, Plus } from "lucide-react"
import Image from "next/image"

export default function RankdApp() {
  const [selectedTab, setSelectedTab] = useState("Movies")

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen relative">
      {/* Status Bar */}
      <div className="flex justify-between items-center p-2 px-4">
        <div className="font-semibold">9:41</div>
        <div className="flex items-center gap-1">
          <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M1 4.5C1 2.84315 2.34315 1.5 4 1.5H14C15.6569 1.5 17 2.84315 17 4.5V7.5C17 9.15685 15.6569 10.5 14 10.5H4C2.34315 10.5 1 9.15685 1 7.5V4.5Z"
              stroke="black"
              strokeWidth="1.5"
            />
            <path d="M11 4L14 6L11 8V4Z" fill="black" />
          </svg>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8 0C9.5913 0 11.1174 0.632141 12.2426 1.75736C13.3679 2.88258 14 4.4087 14 6C14 7.5913 13.3679 9.11742 12.2426 10.2426C11.1174 11.3679 9.5913 12 8 12C6.4087 12 4.88258 11.3679 3.75736 10.2426C2.63214 9.11742 2 7.5913 2 6C2 4.4087 2.63214 2.88258 3.75736 1.75736C4.88258 0.632141 6.4087 0 8 0ZM8 2C6.93913 2 5.92172 2.42143 5.17157 3.17157C4.42143 3.92172 4 4.93913 4 6C4 7.06087 4.42143 8.07828 5.17157 8.82843C5.92172 9.57857 6.93913 10 8 10C9.06087 10 10.0783 9.57857 10.8284 8.82843C11.5786 8.07828 12 7.06087 12 6C12 4.93913 11.5786 3.92172 10.8284 3.17157C10.0783 2.42143 9.06087 2 8 2Z"
              fill="black"
            />
          </svg>
          <svg width="24" height="12" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="0.5" width="21" height="11" rx="2.5" stroke="black" />
            <rect x="2" y="2" width="18" height="8" rx="1" fill="black" />
            <rect x="22" y="3" width="2" height="6" rx="1" fill="black" />
          </svg>
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center p-4">
        <button>
          <AlignLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Rankd</h1>
        <div className="w-8 h-8 rounded-full overflow-hidden">
          <Image
            src="/placeholder.svg?height=32&width=32"
            alt="Profile"
            width={32}
            height={32}
            className="object-cover"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-2 px-4 mt-4">
        <button
          className={`px-6 py-2 rounded-full ${selectedTab === "Albums" ? "bg-[#f6f6f6] text-black" : "bg-[#f6f6f6] text-black"}`}
          onClick={() => setSelectedTab("Albums")}
        >
          Albums
        </button>
        <button
          className={`px-6 py-2 rounded-full ${selectedTab === "Movies" ? "bg-black text-white" : "bg-[#f6f6f6] text-black"}`}
          onClick={() => setSelectedTab("Movies")}
        >
          Movies
        </button>
        <button className="w-10 h-10 rounded-full bg-[#f6f6f6] flex items-center justify-center">
          <Plus size={20} />
        </button>
      </div>

      {/* Main Content */}
      <div className="px-4 mt-8">
        <h2 className="text-3xl font-bold mb-6">Pick the Better Movie</h2>

        {/* Movie 1 */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-48 h-64 overflow-hidden mb-2">
            <Image
              src="/placeholder.svg?height=256&width=192"
              alt="Akira movie poster"
              width={192}
              height={256}
              className="object-cover rounded-md"
            />
          </div>
          <h3 className="text-2xl font-bold">Akira</h3>
        </div>

        {/* Movie 2 */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-48 h-64 overflow-hidden mb-2">
            <Image
              src="/placeholder.svg?height=256&width=192"
              alt="Everything Everywhere All at Once movie poster"
              width={192}
              height={256}
              className="object-cover rounded-md"
            />
          </div>
          <h3 className="text-2xl font-bold text-center">
            Everything, Everywhere,
            <br />
            All at Once
          </h3>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200">
        <div className="flex justify-around items-center p-4">
          <button className="flex flex-col items-center">
            <Home size={24} fill="black" stroke="black" />
          </button>
          <button className="flex flex-col items-center">
            <Search size={24} stroke="#888888" />
          </button>
          <button className="flex flex-col items-center">
            <Users size={24} stroke="#888888" />
          </button>
          <button className="flex flex-col items-center">
            <MenuIcon size={24} stroke="#888888" />
          </button>
        </div>
        {/* iPhone Home Indicator */}
        <div className="h-1 w-32 bg-black rounded-full mx-auto mb-2"></div>
      </div>
    </div>
  )
}

