export const DEFAULT_AUTH_CALLBACK = "/dashboard";
export const SIGN_IN_PATH = "/sign-in";


export function getSafeCallbackPath(callbackUrl: string | null | undefined): string {
  if (!callbackUrl) return DEFAULT_AUTH_CALLBACK;


  if (callbackUrl.startsWith("/") && !callbackUrl.startsWith("//")) {
    return callbackUrl;
  }

  return DEFAULT_AUTH_CALLBACK;
}
