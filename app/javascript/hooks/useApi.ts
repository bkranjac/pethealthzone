/**
 * Custom hook for making API calls with automatic CSRF token handling
 */
export function useApi() {
  const getCsrfToken = (): string => {
    return (
      document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')
        ?.content || ''
    );
  };

  const apiCall = async <T = any>(
    url: string,
    options: RequestInit = {}
  ): Promise<T | null> => {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': getCsrfToken(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.errors?.join(', ') || `Request failed with status ${response.status}`
      );
    }

    // Handle 204 No Content responses
    if (response.status === 204) {
      return null;
    }

    return response.json();
  };

  return { apiCall, getCsrfToken };
}
