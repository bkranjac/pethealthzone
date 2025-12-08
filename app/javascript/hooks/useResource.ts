import { useState, useEffect, useCallback } from 'react';
import { useApi } from './useApi';

interface UseResourceOptions {
  autoFetch?: boolean;
}

interface ResourceWithId {
  id: number;
}

/**
 * Generic hook for CRUD operations on a resource
 * @param endpoint - API endpoint (e.g., '/api/v1/pets')
 * @param options - Configuration options
 */
export function useResource<T extends ResourceWithId>(
  endpoint: string,
  options: UseResourceOptions = {}
) {
  const { autoFetch = true } = options;
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<string | null>(null);
  const { apiCall } = useApi();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiCall<T[]>(endpoint);
      setData(result || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [endpoint, apiCall]);

  const fetchOne = useCallback(
    async (id: number): Promise<T | null> => {
      try {
        return await apiCall<T>(`${endpoint}/${id}`);
      } catch (err) {
        throw new Error(
          err instanceof Error ? err.message : 'Failed to fetch resource'
        );
      }
    },
    [endpoint, apiCall]
  );

  const createItem = useCallback(
    async (item: Partial<T>): Promise<T> => {
      try {
        const created = await apiCall<T>(endpoint, {
          method: 'POST',
          body: JSON.stringify(item),
        });
        if (created) {
          setData((prev) => [...prev, created]);
          return created;
        }
        throw new Error('Failed to create resource');
      } catch (err) {
        throw new Error(
          err instanceof Error ? err.message : 'Failed to create resource'
        );
      }
    },
    [endpoint, apiCall]
  );

  const updateItem = useCallback(
    async (id: number, updates: Partial<T>): Promise<T> => {
      try {
        const updated = await apiCall<T>(`${endpoint}/${id}`, {
          method: 'PUT',
          body: JSON.stringify(updates),
        });
        if (updated) {
          setData((prev) =>
            prev.map((item) => (item.id === id ? updated : item))
          );
          return updated;
        }
        throw new Error('Failed to update resource');
      } catch (err) {
        throw new Error(
          err instanceof Error ? err.message : 'Failed to update resource'
        );
      }
    },
    [endpoint, apiCall]
  );

  const deleteItem = useCallback(
    async (id: number): Promise<void> => {
      try {
        await apiCall(`${endpoint}/${id}`, {
          method: 'DELETE',
        });
        setData((prev) => prev.filter((item) => item.id !== id));
      } catch (err) {
        throw new Error(
          err instanceof Error ? err.message : 'Failed to delete resource'
        );
      }
    },
    [endpoint, apiCall]
  );

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  return {
    data,
    loading,
    error,
    fetchData,
    fetchOne,
    createItem,
    updateItem,
    deleteItem,
    refetch: fetchData,
  };
}
