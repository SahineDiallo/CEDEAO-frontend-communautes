import { useState, useEffect, useCallback } from "react";

interface UseCommunityDataOptions<T, P extends Record<string, string | number>> {
  fetchFn: (params: P) => Promise<T>;
  params?: P;
  skip?: boolean;
}

interface UseCommunityDataReturn<T, P> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: (newParams: P) => Promise<void>;
}

export const useCommunityData = <T, P extends Record<string, string | number>>({
  fetchFn,
  params = {} as P,
  skip = false,
}: UseCommunityDataOptions<T, P>): UseCommunityDataReturn<T, P> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (fetchParams: P) => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchFn(fetchParams);
        setData(result);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [fetchFn]
  );

  useEffect(() => {
    if (!skip && !data) {
      fetchData(params);
    }
  }, [params, skip, data, fetchData]);

  const refetch = async (newParams: P) => await fetchData(newParams);

  return { data, loading, error, refetch };
};
