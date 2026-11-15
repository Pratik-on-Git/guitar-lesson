/**
 * Inline <head> script: applies the saved (or system) theme before first
 * paint so dark mode never flashes light. Reads the same key as useTheme().
 */
export const THEME_SCRIPT = `(()=>{var t;try{t=JSON.parse(localStorage.getItem("gl-theme"))}catch(e){}var d=t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d)})()`;
