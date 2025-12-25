"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { getAvailableAvatars } from "@/lib/utils/avatars";

interface AvatarSelectorProps {
  selectedAvatar?: string;
  onSelect: (avatar: string) => void;
  onClose: () => void;
}

export default function AvatarSelector({
  selectedAvatar,
  onSelect,
  onClose,
}: AvatarSelectorProps) {
  const [avatars, setAvatars] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAvatars = async () => {
      setIsLoading(true);
      const availableAvatars = await getAvailableAvatars();
      setAvatars(availableAvatars);
      setIsLoading(false);
    };
    
    loadAvatars();
  }, []);

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-40"
      />

      {/* Modal */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 shadow-card-3d max-h-[80vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-board-brown/10">
          <h3 className="font-display text-2xl text-board-brown">
            Selecione um Avatar
          </h3>
          <button
            onClick={onClose}
            className="px-4 py-2 text-board-brown font-display text-lg"
          >
            Concluir
          </button>
        </div>

        {/* Grid de Avatares */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-board-brown/50 font-body">Carregando avatares...</div>
            </div>
          ) : avatars.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-board-brown/50 font-body">Nenhum avatar encontrado</div>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {avatars.map((avatar) => {
              const isSelected = selectedAvatar === avatar;
              return (
                <motion.button
                  key={avatar}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    onSelect(avatar);
                    onClose();
                  }}
                  className={`
                    relative aspect-square rounded-card-lg overflow-hidden
                    border-2 transition-all
                    ${
                      isSelected
                        ? "border-innocent-card shadow-card-lg scale-105"
                        : "border-board-brown/30 hover:border-board-brown/50"
                    }
                  `}
                >
                  <Image
                    src={avatar}
                    alt="Avatar"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 25vw, 20vw"
                  />
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 bg-innocent-card/20 flex items-center justify-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}

