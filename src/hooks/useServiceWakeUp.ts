'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface ServiceHealth {
    backend: boolean;
    milvus: boolean;
    isChecking: boolean;
    allHealthy: boolean;
}

interface DetailedHealthResponse {
    status: string;
    services: {
        postgresql?: { status: string };
        milvus?: { status: string };
        llm?: { status: string };
    };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
const CHECK_INTERVAL = 5000; // Check every 5 seconds

/**
 * Hook to wake up backend and Milvus services on cold start.
 * Continuously checks health until both services are healthy, then stops.
 */
export function useServiceWakeUp() {
    const [health, setHealth] = useState<ServiceHealth>({
        backend: false,
        milvus: false,
        isChecking: true,
        allHealthy: false,
    });

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const isMounted = useRef(true);

    const checkHealth = useCallback(async () => {
        try {
            // Check detailed health endpoint which includes Milvus status
            const response = await fetch(`${API_URL}/health/detailed`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                const data: DetailedHealthResponse = await response.json();

                const backendHealthy = data.status === 'healthy' || data.status === 'degraded';
                const milvusHealthy = data.services?.milvus?.status === 'healthy';

                if (isMounted.current) {
                    setHealth({
                        backend: backendHealthy,
                        milvus: milvusHealthy,
                        isChecking: !(backendHealthy && milvusHealthy),
                        allHealthy: backendHealthy && milvusHealthy,
                    });

                    // Stop checking if both are healthy
                    if (backendHealthy && milvusHealthy && intervalRef.current) {
                        clearInterval(intervalRef.current);
                        intervalRef.current = null;
                        console.log('[ServiceWakeUp] All services healthy, stopping health checks');
                    }
                }
            } else {
                // Backend responded but with error - still means backend is up
                if (isMounted.current) {
                    setHealth(prev => ({
                        ...prev,
                        backend: true,
                        isChecking: true,
                    }));
                }
            }
        } catch (error) {
            // Backend not responding - keep checking
            console.log('[ServiceWakeUp] Services not ready, retrying...');
            if (isMounted.current) {
                setHealth({
                    backend: false,
                    milvus: false,
                    isChecking: true,
                    allHealthy: false,
                });
            }
        }
    }, []);

    useEffect(() => {
        isMounted.current = true;

        // Initial check immediately
        checkHealth();

        // Set up interval for periodic checks
        intervalRef.current = setInterval(checkHealth, CHECK_INTERVAL);

        // Cleanup on unmount
        return () => {
            isMounted.current = false;
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [checkHealth]);

    return health;
}

export default useServiceWakeUp;
