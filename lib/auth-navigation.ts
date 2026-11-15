/** Only allow navigation back to an application path on this origin. */
export function safeReturnTo(value: string | null | undefined) {
  if (!value || value.length > 2048 || !value.startsWith("/") || value.startsWith("//") || /[\\\u0000-\u0020]/.test(value)) return "/";
  const pathname = value.split(/[?#]/)[0];
  if (/^\/(sign-in|sign-up|api|_next)(\/|$)/.test(pathname)) return "/";
  return value;
}
