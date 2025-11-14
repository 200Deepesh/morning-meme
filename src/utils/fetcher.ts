interface ApiError {
    message: string;
    status?: number;
}

interface ApiResponse<T> {
    data?: T;
    error?: ApiError;
}

interface FetchConfig {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
    queryParams?: Record<string, string | number>;
}

async function fetcher<T>(url: string, config: FetchConfig = {}): Promise<ApiResponse<T>> {
    try {
        let finalUrl = url;

        if (config.queryParams) {
            const params = new URLSearchParams();
            for (const [key, value] of Object.entries(config.queryParams)) {
                params.append(key, value?.toString());
            }
            finalUrl = `${url}?${params.toString()}`;
        }

        const response = await fetch(finalUrl, {
            method: config.method || 'GET',
            headers: { ...config.headers },
        });

        if (!response.ok) {
            return {
                error: {
                    status: response.status,
                    message: `HTTP error: ${response.statusText}`,
                }
            };
        }

        const data: T = await response.json();
        return { data };
    } catch (error) {
        return {
            error: {
                message: error instanceof Error ? error.message : "Unknow error occurred",
            }
        };
    }
}

export { fetcher };