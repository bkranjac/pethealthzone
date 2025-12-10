import { useNavigate } from 'react-router-dom';

/**
 * Wrapper around React Router's useNavigate that handles test environment
 * where navigation may not be fully implemented (e.g., JSDOM)
 */
export function useAppNavigate() {
  const navigate = useNavigate();

  return (path: string) => {
    try {
      navigate(path);
    } catch (navError) {
      // Handle JSDOM "Not implemented: navigation" errors in test environment
      if (navError instanceof Error && !navError.message.includes('navigation')) {
        throw navError;
      }
    }
  };
}
