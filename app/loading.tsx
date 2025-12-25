"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="h-screen w-full bg-gradient-to-br from-board-cream via-board-beige to-board-cream dark:from-board-dark dark:via-board-brown dark:to-board-dark flex items-center justify-center fixed inset-0">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-6"
      >
        <motion.div
          animate={{ 
            rotate: [0, 360],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <Image
            src="/logo.png"
            alt="Logo"
            width={120}
            height={120}
            className="object-contain aspect-square"
            priority
            style={{ width: '120px', height: '120px' }}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-board-brown dark:text-board-cream font-display text-xl"
        >
          Carregando...
        </motion.div>
      </motion.div>
    </div>
  );
}

