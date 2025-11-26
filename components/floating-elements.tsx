"use client"

import { useEffect, useState } from "react"

const EMOJIS = ["🌴", "☀️", "🏖️", "✈️", "🌺", "🍹", "⛱️", "🌊", "🎉", "🎊"]

export function FloatingElements() {
  const [elements, setElements] = useState<
    { id: number; emoji: string; left: number; delay: number; duration: number }[]
  >([])

  useEffect(() => {
    const newElements = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      left: Math.random() * 100,
      delay: Math.random() * 20,
      duration: 15 + Math.random() * 20,
    }))
    setElements(newElements)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {elements.map((el) => (
        <div
          key={el.id}
          className="absolute text-2xl opacity-20"
          style={{
            left: `${el.left}%`,
            animation: `float ${el.duration}s ease-in-out infinite`,
            animationDelay: `${el.delay}s`,
            top: `${Math.random() * 100}%`,
          }}
        >
          {el.emoji}
        </div>
      ))}
    </div>
  )
}
