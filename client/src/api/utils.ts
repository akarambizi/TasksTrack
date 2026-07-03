/**
 * Gets the api url.
 * @param {string} path - The path to append to the base URL.
 * @returns {string} The api url.
 */
export const getUrl = (path: string) => {
    let baseUrl = '';
    const mode = import.meta.env.MODE || 'development';

    switch (mode) {
        case 'production':
            baseUrl = '';
            break;
        case 'mock':
            baseUrl = '/mock';
            break;
        default:
            baseUrl = '';
    }

    return `${baseUrl}${path}`;
};
