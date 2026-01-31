/**
 * Gets the api url.
 * @param {string} path - The path to append to the base URL.
 * @returns {string} The api url.
 */
export const getUrl = (path: string) => {
    let baseUrl = '';
    const env = process.env.NODE_ENV || 'dev';
    switch (env) {
        case 'prod':
            baseUrl = '';
            break;
        case 'mock':
            baseUrl = 'http://localhost:4200'; // mock server
            break;
        default:
            baseUrl = 'http://localhost:5206'; // dev
    }

    return `${baseUrl}${path}`;
};

/**
 * Utility function to build URL query parameters from an object
 * @param params - Object with key-value pairs to convert to query string
 * @returns URLSearchParams object
 */
export const buildQueryParams = (params?: Record<string, unknown>): URLSearchParams => {
    const queryParams = new URLSearchParams();
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                queryParams.append(key, value.toString());
            }
        });
    }
    return queryParams;
};
