"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export default function Toast({ message, isVisible, onClose }: ToastProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-24 left-4 right-4 z-50 max-w-md mx-auto"
        >
          <div className="bg-board-brown text-board-cream rounded-card-lg shadow-card-3d p-4 flex items-center justify-between gap-3">
            <p className="font-body text-base flex-1">{message}</p>
            <button
              onClick={onClose}
              className="p-1 hover:bg-black/10 rounded-full transition-colors flex-shrink-0"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

