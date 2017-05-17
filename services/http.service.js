export class HttpService {
    constructor () {}

    /**
     * Setting the base URL for requests
     * @param {string} url
     */
    setBaseUrl (url) {
        this.baseUrl = url;
    }

    /**
     * Making a HTTP request
     * @param {string} type specified a HTTP method
     * @param {Object} data specified a body of request
     * @returns {Promise}
     */
	makeRequest (type = 'GET', data = {}) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open(type, this.baseUrl, true);

            xhr.addEventListener('load', () => resolve({
                data: JSON.parse(xhr.responseText),
                xhr
            }));
            xhr.addEventListener('error', reject);
            xhr.addEventListener('abort', reject);

            xhr.send(JSON.stringify(data));
        });
	}

    static getInstance (...rest) {
		return new this(...rest);
	}
}