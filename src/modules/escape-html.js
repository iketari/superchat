/**
 * Escape html-entities in input string
 * @param {String} input
 * @return {String} - escaped string
 */
export default function escape(input) {
	return input
		.replace(/&/g, '&amp;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}
