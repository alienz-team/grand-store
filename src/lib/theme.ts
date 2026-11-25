export type Theme = "light" | "dark";
export const THEME_KEY = "gs-theme";

/**
 * Runs in <head> before first paint so there is no flash of the wrong theme.
 * A saved choice wins; otherwise the OS setting decides.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";var d=document.documentElement;d.dataset.theme=t;d.style.colorScheme=t}catch(e){}})()`;
