/**
 * Environment configuration validation for redirects
 */

export interface EnvironmentConfig {
  API_URL: string;
  ACCOUNTS_CENTER: string;
  CAMPUS_URL?: string;
  CANDIDATE_URL?: string;
  ENTERPRISE_URL?: string;
  MAIN_URL?: string;
}

/**
 * Get and validate environment configuration
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  const config: EnvironmentConfig = {
    API_URL: import.meta.env.VITE_API_URL || '',
    ACCOUNTS_CENTER: import.meta.env.VITE_ACCOUNTS_CENTER || '',
    CAMPUS_URL: import.meta.env.VITE_CAMPUS_URL,
    CANDIDATE_URL: import.meta.env.VITE_CANDIDATE_URL,
    ENTERPRISE_URL: import.meta.env.VITE_ENTERPRISE_URL,
    MAIN_URL: import.meta.env.VITE_MAIN_URL,
  };

  // Validate required environment variables
  const required = ['API_URL', 'ACCOUNTS_CENTER'];
  const missing = required.filter(key => !config[key as keyof EnvironmentConfig]);
  
  if (missing.length > 0) {
    console.warn(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return config;
}

/**
 * Check if environment is properly configured for authentication
 */
export function validateAuthEnvironment(): boolean {
  const config = getEnvironmentConfig();
  return !!(config.API_URL && config.ACCOUNTS_CENTER);
}