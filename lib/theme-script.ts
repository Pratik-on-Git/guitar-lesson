/**
 * Inline <head> script: applies the saved (or system) theme before first
 * paint so dark mode never flashes light. Reads the same key as useTheme().
 */
export const THEME_SCRIPT = `try{var t=JSON.parse(localStorage.getItem("gl-theme"));if(t==="dark"||(t===null&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`;
