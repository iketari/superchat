export class WindowService {
    constructor ({document}) {
        this.document = document;
    }

    /**
     * Add listener to 'visibilitychange' event
     * @param {function} cb
     */
    onVisibilityChange (cb) {
        this.document.addEventListener('visibilitychange', () => {
			cb(document.visibilityState);
		});
    }

    static getInstance (...rest) {
		return new this(...rest);
	}
}