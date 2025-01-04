import React, { useState } from 'react';
import { toast } from 'sonner';

const useFetch = (cb) => {
    const [data, setData] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fn = async (...args) => {
        setLoading(true);
        setError(null);
        try {
            const response = await cb(...args);
            setData(response);
        } catch (error) {
            const errorMessage = error?.message || "An unexpected error occurred.";
            setError(error);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setData(undefined);
        setError(null);
    };

    return { data, loading, error, fn, setData, reset };
};

export default useFetch;
