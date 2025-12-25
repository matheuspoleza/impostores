/**
 * Lista todos os avatares disponíveis na pasta public/avatars
 * Retorna os caminhos relativos para uso com Next.js Image
 * 
 * Esta função busca dinamicamente os avatares através da API route.
 * Para adicionar novos avatares, basta adicionar os arquivos na pasta public/avatars.
 */
export async function getAvailableAvatars(): Promise<string[]> {
  try {
    const response = await fetch("/api/avatars", {
      cache: "no-store", // Sempre busca a lista mais recente
    });
    
    if (!response.ok) {
      throw new Error("Erro ao buscar avatares");
    }
    
    const data = await response.json();
    return data.avatars || [];
  } catch (error) {
    console.error("Erro ao buscar avatares:", error);
    // Retorna lista padrão em caso de erro
    return [
      "/avatars/avatar-1.png",
      "/avatars/avatar-2.png",
    ];
  }
}

/**
 * Retorna um avatar padrão caso nenhum seja especificado
 */
export function getDefaultAvatar(): string {
  return "/avatars/avatar-1.png";
}

/**
 * Valida se um caminho de avatar é válido
 */
export function isValidAvatar(avatarPath: string): boolean {
  const validExtensions = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"];
  const ext = avatarPath.toLowerCase().substring(avatarPath.lastIndexOf("."));
  return avatarPath.startsWith("/avatars/") && validExtensions.includes(ext);
}

