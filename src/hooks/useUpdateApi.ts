import { useState } from "react";
import api from "../axios";

const useUpdateApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const updateData = async (path: string, data: any, method: "patch" | "post" = "patch") => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);
            
            let response;
            if (method === 'patch') {
                response = await api.patch(path, data);
            } else {
                response = await api.post(path, data);
            }
            
            setSuccess(true);
            return response.data;
        } catch (err: any) {
            console.error("Error updating data:", err);
            setError(err.response?.data?.message || "Error updating data");
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { updateData, loading, error, success };
};

export default useUpdateApi; 