/**
 * @module utils
 */

/**
 * Returns true if argument belongs to primitive type
 * @param {*} target
 * @returns {boolean}
 */
function isPrimitive(target) {
	return typeof target !== 'object' || target === null;
}

/**
 * Compares two objects by value
 * @param {Object} src
 * @param {Object} dest
 * @returns {boolean}
 */
function deepEqual(x, y) {
	if (!isPrimitive(x) && !isPrimitive(y)) {
		if (Object.keys(x).length !== Object.keys(y).length) {
			return false;
		}

		for (let prop in x) {
			if (y.hasOwnProperty(prop)) {
				if (!deepEqual(x[prop], y[prop])) {
					return false;
				}
			} else {
				return false;
			}
		}

		return true;
	} else {
		return x === y;
	}
}

/**
 * Transforms the first letter of the string to capital
 * @param {string} str
 * @returns {string}
 */
function capitalize(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export { deepEqual, capitalize, isPrimitive };
