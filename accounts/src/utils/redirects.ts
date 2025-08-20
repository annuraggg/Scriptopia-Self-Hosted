// Utility to determine redirect URL based on user metadata and platform preference
export const getRedirectUrl = (user?: any): string => {
  // If user has metadata indicating their primary platform, use that
  if (user?.publicMetadata?.primaryPlatform) {
    switch (user.publicMetadata.primaryPlatform) {
      case "enterprise":
        return import.meta.env.VITE_ENTERPRISE_FRONTEND_URL || "/";
      case "campus":
        return import.meta.env.VITE_CAMPUS_FRONTEND_URL || "/";
      case "candidate":
        return import.meta.env.VITE_CANDIDATE_FRONTEND_URL || "/";
      case "meet":
        return import.meta.env.VITE_MEET_FRONTEND_URL || "/";
      case "code":
        return import.meta.env.VITE_CODE_FRONTEND_URL || "/";
      default:
        break;
    }
  }

  // If user has organization metadata, redirect to enterprise/campus
  if (user?.publicMetadata?.orgId || user?.publicMetadata?.instituteId) {
    if (user.publicMetadata.orgId) {
      return import.meta.env.VITE_ENTERPRISE_FRONTEND_URL || "/";
    }
    if (user.publicMetadata.instituteId) {
      return import.meta.env.VITE_CAMPUS_FRONTEND_URL || "/";
    }
  }

  // Check for specific role-based redirects
  if (user?.publicMetadata?.roleName) {
    const role = user.publicMetadata.roleName.toLowerCase();
    if (role.includes("admin") || role.includes("hr") || role.includes("recruiter")) {
      return import.meta.env.VITE_ENTERPRISE_FRONTEND_URL || "/";
    }
    if (role.includes("student") || role.includes("candidate")) {
      return import.meta.env.VITE_CANDIDATE_FRONTEND_URL || "/";
    }
    if (role.includes("faculty") || role.includes("instructor")) {
      return import.meta.env.VITE_CAMPUS_FRONTEND_URL || "/";
    }
  }

  // Check the referring URL to understand which platform the user came from
  const referrer = document.referrer;
  if (referrer) {
    if (referrer.includes("enterprise")) {
      return import.meta.env.VITE_ENTERPRISE_FRONTEND_URL || "/";
    }
    if (referrer.includes("campus")) {
      return import.meta.env.VITE_CAMPUS_FRONTEND_URL || "/";
    }
    if (referrer.includes("candidate")) {
      return import.meta.env.VITE_CANDIDATE_FRONTEND_URL || "/";
    }
    if (referrer.includes("meet")) {
      return import.meta.env.VITE_MEET_FRONTEND_URL || "/";
    }
    if (referrer.includes("code")) {
      return import.meta.env.VITE_CODE_FRONTEND_URL || "/";
    }
  }

  // Check for URL parameters that might indicate the intended platform
  const urlParams = new URLSearchParams(window.location.search);
  const platform = urlParams.get("platform") || urlParams.get("redirect_to");
  if (platform) {
    switch (platform.toLowerCase()) {
      case "enterprise":
        return import.meta.env.VITE_ENTERPRISE_FRONTEND_URL || "/";
      case "campus":
        return import.meta.env.VITE_CAMPUS_FRONTEND_URL || "/";
      case "candidate":
        return import.meta.env.VITE_CANDIDATE_FRONTEND_URL || "/";
      case "meet":
        return import.meta.env.VITE_MEET_FRONTEND_URL || "/";
      case "code":
        return import.meta.env.VITE_CODE_FRONTEND_URL || "/";
    }
  }

  // Default fallback - redirect to main application
  return import.meta.env.VITE_MAIN_FRONTEND_URL || import.meta.env.VITE_CANDIDATE_FRONTEND_URL || "/";
};

// Perform platform-aware redirect after successful authentication
export const redirectAfterAuth = (user?: any): void => {
  const redirectUrl = getRedirectUrl(user);
  window.location.href = redirectUrl;
};