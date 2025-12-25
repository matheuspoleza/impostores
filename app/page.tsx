"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/setup");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.6,
          ease: "easeOut",
        }}
        className="flex flex-col items-center justify-center"
      >
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-[300px] h-[300px]"
        >
          <Image
            src="/logo.png"
            alt="Jogo do Impostor"
            width={300}
            height={300}
            priority
            className="object-contain w-full h-full"
            style={{ aspectRatio: '1 / 1' }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

