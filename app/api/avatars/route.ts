import { NextResponse } from "next/server";
import { readdir } from "fs/promises";
import { join } from "path";

/**
 * API Route para listar avatares disponíveis dinamicamente
 * Lê os arquivos da pasta public/avatars
 */
export async function GET() {
  try {
    const avatarsDir = join(process.cwd(), "public", "avatars");
    
    // Lê todos os arquivos da pasta avatars
    const files = await readdir(avatarsDir);
    
    // Filtra apenas arquivos de imagem (png, jpg, jpeg, webp, etc)
    const imageExtensions = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"];
    const avatarFiles = files
      .filter((file) => {
        const ext = file.toLowerCase().substring(file.lastIndexOf("."));
        return imageExtensions.includes(ext);
      })
      .map((file) => `/avatars/${file}`)
      .sort(); // Ordena alfabeticamente
    
    return NextResponse.json({ avatars: avatarFiles });
  } catch (error) {
    console.error("Erro ao listar avatares:", error);
    // Retorna lista padrão em caso de erro
    return NextResponse.json({
      avatars: ["/avatars/avatar-1.png", "/avatars/avatar-2.png"],
    });
  }
}

