import escape from './escape-html';
import split from './tag-split';

/**
 * Filter HTML and removes possible XSS
 * @param {String} input
 * @param {Array<String>} validTags - list of valid tagnames
 */
export default function filter(input, validTags = []) {
	return split(input, validTags)
		.map(node => typeof node.text === 'string'? escape(node.text) : (node.tag || ''))
		.join('')
		.replace(/\n/ig, '<br/>');
}
