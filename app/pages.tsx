"use client"

import { useState } from "react"
import { Menu, Home, Search, Users, List, Plus } from "lucide-react"
import Image from "next/image"

export default function RankdApp() {
  const [activeTab, setActiveTab] = useState<"albums" | "movies">("albums")
  const [activeScreen, setActiveScreen] = useState<"compare-movies" | "compare-albums" | "rankings">("compare-movies")

  return (
    <div className="max-w-md mx-auto bg-[#ffffff] min-h-screen">
      {/* Status Bar */}
      <div className="flex justify-between items-center p-2 text-[#24262b]">
        <div>9:41</div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3 16.5L12 7.5L21 16.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="h-3 w-3">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3 16.5L12 7.5L21 16.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="h-4 w-6 border-2 border-[#24262b] rounded-sm relative">
            <div className="absolute right-0 top-0 bottom-0 w-2/3 bg-[#24262b]"></div>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="flex justify-between items-center px-4 py-2">
        <button className="p-2">
          <Menu size={24} className="text-[#24262b]" />
        </button>
        <h1 className="text-xl font-bold text-[#24262b]">Rankd</h1>
        <div className="w-8 h-8 rounded-full bg-[#d9d9d9] overflow-hidden">
          <Image
            src="/placeholder.svg?height=32&width=32"
            alt="Profile"
            width={32}
            height={32}
            className="object-cover"
          />
        </div>
      </header>

      {/* Tabs */}
      <div className="flex justify-center items-center gap-2 px-4 py-2">
        <button
          onClick={() => {
            setActiveTab("albums")
            setActiveScreen("compare-albums")
          }}
          className={`px-4 py-1 rounded-full ${
            activeTab === "albums" ? "bg-[#24262b] text-white" : "bg-[#f6f6f6] text-[#24262b]"
          }`}
        >
          Albums
        </button>
        <button
          onClick={() => {
            setActiveTab("movies")
            setActiveScreen("compare-movies")
          }}
          className={`px-4 py-1 rounded-full ${
            activeTab === "movies" ? "bg-[#24262b] text-white" : "bg-[#f6f6f6] text-[#24262b]"
          }`}
        >
          Movies
        </button>
        <button className="w-8 h-8 flex items-center justify-center">
          <Plus size={20} className="text-[#24262b]" />
        </button>
      </div>

      {/* Main Content */}
      <main className="px-4 py-6">
        {activeScreen === "compare-movies" && (
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-6 text-[#24262b]">Pick the Better Movie</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col items-center">
                <div className="w-40 h-56 mb-2 overflow-hidden rounded border border-[#dadada]">
                  <Image
                    src="/placeholder.svg?height=224&width=160"
                    alt="Akira"
                    width={160}
                    height={224}
                    className="object-cover"
                  />
                </div>
                <span className="text-[#24262b] font-medium">Akira</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-40 h-56 mb-2 overflow-hidden rounded border border-[#dadada]">
                  <Image
                    src="/placeholder.svg?height=224&width=160"
                    alt="Everything, Everywhere, All at Once"
                    width={160}
                    height={224}
                    className="object-cover"
                  />
                </div>
                <span className="text-[#24262b] font-medium text-center">
                  Everything, Everywhere,
                  <br />
                  All at Once
                </span>
              </div>
            </div>
          </div>
        )}

        {activeScreen === "compare-albums" && (
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-6 text-[#24262b]">Pick the Better Album</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col items-center">
                <div className="w-40 h-40 mb-2 overflow-hidden rounded bg-[#d9d9d9]">
                  <Image
                    src="/placeholder.svg?height=160&width=160"
                    alt="Album 1"
                    width={160}
                    height={160}
                    className="object-cover"
                  />
                </div>
                <span className="text-[#24262b] font-medium">Album 1</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-40 h-40 mb-2 overflow-hidden rounded bg-[#d9d9d9]">
                  <Image
                    src="/placeholder.svg?height=160&width=160"
                    alt="Album 2"
                    width={160}
                    height={160}
                    className="object-cover"
                  />
                </div>
                <span className="text-[#24262b] font-medium">Album 2</span>
              </div>
            </div>
          </div>
        )}

        {activeScreen === "rankings" && (
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold mb-6 text-[#24262b]">Your Ranking:</h2>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="text-xl font-bold text-[#24262b]">1.</span>
                <div className="w-32 h-32 overflow-hidden rounded border border-[#dadada]">
                  <Image
                    src="/placeholder.svg?height=128&width=128"
                    alt="Ranked item 1"
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xl font-bold text-[#24262b]">2.</span>
                <div className="w-32 h-32 overflow-hidden rounded border border-[#dadada]">
                  <Image
                    src="/placeholder.svg?height=128&width=128"
                    alt="Ranked item 2"
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xl font-bold text-[#24262b]">3.</span>
                <div className="w-32 h-32 overflow-hidden rounded border border-[#dadada]">
                  <Image
                    src="/placeholder.svg?height=128&width=128"
                    alt="Ranked item 3"
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-[#dadada]">
        <div className="flex justify-around items-center py-4">
          <button
            onClick={() => setActiveScreen("compare-movies")}
            className={`p-2 ${activeScreen === "compare-movies" ? "border-b-2 border-[#24262b]" : ""}`}
          >
            <Home size={24} className="text-[#24262b]" />
          </button>
          <button className="p-2">
            <Search size={24} className="text-[#24262b]" />
          </button>
          <button className="p-2">
            <Users size={24} className="text-[#24262b]" />
          </button>
          <button
            onClick={() => setActiveScreen("rankings")}
            className={`p-2 ${activeScreen === "rankings" ? "border-b-2 border-[#24262b]" : ""}`}
          >
            <List size={24} className="text-[#24262b]" />
          </button>
        </div>
      </div>
    </div>
  )
}


