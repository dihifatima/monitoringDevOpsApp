import { useCallback, useState } from 'react';
import { linkJenkinsJob, type LinkJenkinsJobRequest } from '@/src/services/connectorsService';

export function useLinkJenkinsJob() {
  const [isLinking, setIsLinking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const link = useCallback(async (request: LinkJenkinsJobRequest): Promise<boolean> => {
    setIsLinking(true);
    setError(null);
    try {
      await linkJenkinsJob(request);
      return true;
 } catch (err: any) {
  console.log('LINK ERROR:', err?.response?.status, err?.response?.data, err?.message);
  setError('Impossible de lier ce job. Vérifie le nom exact du job Jenkins.');
  return false;
} finally {
      setIsLinking(false);
    }
  }, []);

  return { link, isLinking, error };
}