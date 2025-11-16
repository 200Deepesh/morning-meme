interface ApiError {
    message: string;
    status?: number;
}

interface ApiResponse<T> {
    data?: T;
    error?: ApiError;
}

interface FetchConfig<TBody> {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
    queryParams?: Record<string, string | number>;
    reqBody?: TBody;
}

async function httpRequest<TResponse, TBody>(url: string, config: FetchConfig<TBody> = {}): Promise<ApiResponse<TResponse>> {
    try {
        let finalUrl = url;
        const body = (config.method && config.method != "GET") ? JSON.stringify(config.reqBody) : null;

        if (config.queryParams) {
            const params = new URLSearchParams();
            for (const [key, value] of Object.entries(config.queryParams)) {
                params.append(key, value?.toString());
            }
            finalUrl = `${url}?${params.toString()}`;
        }

        const response = await fetch(finalUrl, {
            method: config.method || 'GET',
            headers: {
                "Content-Type": "application/json",
                ...config.headers
            },
            body: body,
        });

        if (!response.ok) {
            return {
                error: {
                    status: response.status,
                    message: `HTTP error: ${response.statusText}`,
                }
            };
        }

        const data: TResponse = await response.json();
        return { data };
    } catch (error) {
        return {
            error: {
                message: error instanceof Error ? error.message : "Unknow error occurred",
            }
        };
    }
}

export { httpRequest };