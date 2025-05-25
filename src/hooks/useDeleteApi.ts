import { useState } from "react";
import api from "../axios";

const useDeleteApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const deleteData = async (path: string, id: number | string) => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);
            
            const response = await api.delete(`${path}/${id}`);
            
            setSuccess(true);
            return response.data;
        } catch (err: any) {
            console.error("Error deleting data:", err);
            setError(err.response?.data?.message || "Error deleting data");
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { deleteData, loading, error, success };
};

export default useDeleteApi; 