export const DEFAULT_AUTH_CALLBACK = "/dashboard";
export const SIGN_IN_PATH = "/sign-in";

/**
 * Validates and returns a safe callback path for post-login redirect.
 * Prevents open-redirect vulnerabilities by restricting to internal relative paths.
 */
export function getSafeCallbackPath(callbackUrl: string | null | undefined): string {
  if (!callbackUrl) return DEFAULT_AUTH_CALLBACK;

  // Must start with '/' but not '//' (protocol-relative URLs)
  if (callbackUrl.startsWith("/") && !callbackUrl.startsWith("//")) {
    return callbackUrl;
  }

  return DEFAULT_AUTH_CALLBACK;
}
