"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export function Header() {
  return (
    <motion.header
      className="relative text-center mb-12 md:mb-16"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="pointer-events-none absolute inset-0 -z-10 flex justify-center">
        <div className="h-40 w-40 md:h-52 md:w-52 rounded-full bg-amber-200/40 blur-[110px]" />
      </div>

      <motion.div
        className="aurora-shell glass-panel accent-ring rounded-3xl px-6 py-8 md:px-10 md:py-12 flex flex-col items-center gap-5 festive-shadow"
        whileHover={{ scale: 1.015 }}
        transition={{ duration: 0.25 }}
      >
        {/* Decorative corner elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-4 right-6 text-amber-400 text-2xl md:text-3xl floating-dots">✨</div>
          <div className="absolute bottom-6 left-8 text-rose-400 text-2xl md:text-3xl">🌺</div>
          <div className="absolute bottom-10 right-10 text-amber-500/80 text-xl md:text-2xl">🪔</div>
        </div>

        {/* Logo and Title Container */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="relative w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28">
            <Image
              src="/logo-removebg-preview.png"
              alt="Ahile Foods Logo"
              fill
              className="object-contain drop-shadow-md"
              priority
            />
          </div>
        </motion.div>

        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold festive-text-gold drop-shadow-sm"
          initial={{ scale: 0.92 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          🪔 Ahile Diwali Specials 🪔
        </motion.h1>

        <div className="festive-divider w-36 md:w-48 mx-auto" />

        <motion.p
          className="text-base md:text-lg text-muted-foreground max-w-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          Traditional sweets and savory delights crafted fresh for the festival of lights.
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center gap-3 text-xs md:text-sm text-muted-foreground/90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <span className="badge-pill">Premium Ingredients</span>
          <span className="badge-pill">Diwali Exclusive Menu</span>
        </motion.div>
      </motion.div>
    </motion.header>
  )
}