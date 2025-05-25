import { useState, useCallback } from 'react';
import api from '../axios';

const useDetailApi = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPath, setCurrentPath] = useState<string | null>(null);

    const fetchData = useCallback(async (path: string, id?: number) => {
        try {
            setLoading(true);
            setError(null);
            
            const url = id ? `${path}/${id}` : path;
            setCurrentPath(url);
            
            const response = await api.get(url);
            console.log('detail api response:', response);
            
            if (response.data.data) {
                console.log('view data', response.data.data);
                setData(response.data.data);
                return response.data.data;
            } else {
                setError(response.data?.message || 'Failed to fetch data');
                return null;
            }
        } catch (err: any) {
            console.error('Error fetching detail:', err);
            setError(err.response?.data?.message || err.message || 'An error occurred');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const refetch = useCallback(() => {
        if (!currentPath) return Promise.resolve(null);
        return fetchData(currentPath);
    }, [currentPath, fetchData]);

    return { data, loading, error, fetchData, refetch };
};

export default useDetailApi; 