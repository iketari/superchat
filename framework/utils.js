/**
 * Сравнивает объекты по значниию
 * @param {Object} src
 * @param {Object} dest
 * @returns {boolean}
 */
function deepEqual (src, dest) {
	return JSON.stringify(src) === JSON.stringify(dest);
}

/**
 * Поднимает первую букву строки в верхний регистр
 * @param {string} str
 * @returns {string}
 */
function capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export {deepEqual, capitalize};