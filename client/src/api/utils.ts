/**
 * Gets the api url.
 * @param {string} path - The path to append to the base URL.
 * @returns {string} The api url.
 */
export const getUrl = (path: string) => {
    let baseUrl;
    switch (process.env.REACT_APP_API_ENV) {
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
