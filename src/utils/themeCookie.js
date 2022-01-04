import Cookies from "js-cookie";
const themeKey = 'hm-hrsaas-exm-theme'

export function getThemeCookie() {
  return Cookies.get(themeKey)
}
export function setThemeCookie(val) {
  Cookies.set(themeKey, val)
}
export function removeThemeCookie() {
  Cookies.remove(themeKey)
}
