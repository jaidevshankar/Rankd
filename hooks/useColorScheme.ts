"use client"

import { useState, useEffect } from "react"
import { Appearance } from "react-native"

export function useColorScheme(): "light" | "dark" | null {
  const [colorScheme, setColorScheme] = useState<"light" | "dark" | null>(Appearance.getColorScheme())

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setColorScheme(colorScheme)
    })

    return () => subscription.remove()
  }, [])

  return colorScheme
}