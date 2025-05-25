import { useState } from "react";
import api from "../axios";

const useCreateApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const createData = async (path: string, data: any) => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);
            
            const response = await api.post(path, data);
            
            setSuccess(true);
            return response.data;
        } catch (err: any) {
            console.error("Error creating data:", err);
            setError(err.response?.data?.message || "Error creating data");
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { createData, loading, error, success };
};

export default useCreateApi; 