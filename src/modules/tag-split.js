/**
 * Splits input on tag- and text-nodes
 * @param {String} input
 * @param {Array<String>} taglist - list of valid tagnames
 */
export default function split(input, taglist = []) {
	const nodes = [];

	const tags = [];
	taglist
		.forEach(tagname => {
			let name = tagname.trim().toLowerCase();
			tags.push(`<${name}>`, `</${name}>`);
		});

	let lastpos = 0;
	let pos = 0;
	while (pos < input.length) {
		let tag = tags.find(tagstr => input.substr(pos, tagstr.length) === tagstr);
		if (tag) {
			if (pos > lastpos) {
				nodes.push({text: input.substring(lastpos, pos)});
			}
			pos += tag.length;
			lastpos = pos;
			nodes.push({tag});
		} else {
			pos++;
		}
	}
	if (pos > lastpos) {
		nodes.push({text: input.substring(lastpos, pos)});
	}

	return nodes;
}
