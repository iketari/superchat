(function () {
	'use strict';

	const utils = {
		deepEqual (src, dest) {
			return JSON.stringify(src) === JSON.stringify(dest);
		}
	}

	//export
	window.utils = utils;
})();