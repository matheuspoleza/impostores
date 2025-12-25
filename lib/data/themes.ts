import themesData from "./themes.json";
import { Theme } from "@/types/game";

export const themes: Theme[] = themesData.themes;

export function getThemeByName(name: string): Theme | undefined {
  return themes.find((t) => t.name === name);
}

