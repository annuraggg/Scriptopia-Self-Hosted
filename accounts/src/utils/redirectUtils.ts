/**
 * Utility functions for handling redirects after authentication
 */

export interface RedirectParams {
  platform?: string;
  returnTo?: string;
}

/**
 * Get redirect parameters from URL search params
 */
export function getRedirectParams(): RedirectParams {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    platform: urlParams.get('platform') || undefined,
    returnTo: urlParams.get('returnTo') || undefined,
  };
}

/**
 * Determine the appropriate redirect URL after authentication
 * @param params - redirect parameters from URL or user metadata
 * @returns the full URL to redirect to
 */
export function getPostAuthRedirectUrl(params: RedirectParams = {}): string {
  const { platform, returnTo } = params;
  
  // If returnTo is provided, use it (for maintaining intended destination)
  if (returnTo) {
    try {
      // Validate the returnTo URL is from our trusted domains
      const url = new URL(returnTo);
      const trustedDomains = [
        import.meta.env.VITE_CAMPUS_URL,
        import.meta.env.VITE_CANDIDATE_URL,
        import.meta.env.VITE_ENTERPRISE_URL,
        import.meta.env.VITE_MAIN_URL,
      ].filter(Boolean);

      const isValidDomain = trustedDomains.some(domain => {
        try {
          const trustedUrl = new URL(domain);
          return url.origin === trustedUrl.origin;
        } catch {
          return false;
        }
      });

      if (isValidDomain) {
        return returnTo;
      }
    } catch {
      // Invalid URL, fall through to default logic
    }
  }

  // If platform is specified, redirect to that platform
  if (platform) {
    switch (platform.toLowerCase()) {
      case 'campus':
        return import.meta.env.VITE_CAMPUS_URL || 'http://localhost:5175';
      case 'candidate':
      case 'candidates':
        return import.meta.env.VITE_CANDIDATE_URL || 'http://localhost:5173';
      case 'enterprise':
        return import.meta.env.VITE_ENTERPRISE_URL || 'http://localhost:5172';
      default:
        break;
    }
  }

  // Default: redirect to main application or campus
  return import.meta.env.VITE_MAIN_URL || import.meta.env.VITE_CAMPUS_URL || 'http://localhost:5175';
}

/**
 * Perform redirect with proper error handling
 * @param redirectUrl - URL to redirect to
 */
export function performRedirect(redirectUrl: string): void {
  try {
    // Use window.location.href for external redirects
    window.location.href = redirectUrl;
  } catch (error) {
    console.error('Failed to redirect:', error);
    // Fallback to campus if main redirect fails
    window.location.href = import.meta.env.VITE_CAMPUS_URL || 'http://localhost:5175';
  }
}

/**
 * Get the current page URL for returnTo parameter
 */
export function getCurrentReturnToUrl(): string {
  return window.location.href;
}