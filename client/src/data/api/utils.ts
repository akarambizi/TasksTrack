/**
 * Gets the api url.
 * @param {string} path - The path to append to the base URL.
 * @returns {string} The api url.
 */
export const getUrl = (path: string) => {
    const mode = import.meta.env.MODE || 'development';
    const baseUrl = mode === 'mock' ? '/mock' : '';

    return `${baseUrl}${path}`;
};
