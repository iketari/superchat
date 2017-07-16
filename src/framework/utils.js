/**
 * @module utils
 */

function _isPrimitive(target) {
	return typeof target !== 'object' && target !== null;
}

/**
 * Сравнивает объекты по значниию
 * @param {Object} src
 * @param {Object} dest
 * @returns {boolean}
 */
function deepEqual(x, y) {
	if ((typeof x === 'object' && x != null) && (typeof y === 'object' && y != null)) {
		if (Object.keys(x).length != Object.keys(y).length) {
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
 * Поднимает первую букву строки в верхний регистр
 * @param {string} str
 * @returns {string}
 */
function capitalize(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export { deepEqual, capitalize };
