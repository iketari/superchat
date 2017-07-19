import split from './tag-split';


describe('tag-split', () => {
	it('Split open tags', () => {
		const openTags1 = split('<b><b><b>', ['b']);
		const openTags2 = split('<em><em><em>', ['em']);
		const openTags3 = split('<strong><i><b><em>', ['em', 'strong', 'i', 'b']);
		assert.deepEqual(openTags1, [{tag: '<b>'}, {tag: '<b>'}, {tag: '<b>'}]);
		assert.deepEqual(openTags2, [{tag: '<em>'}, {tag: '<em>'}, {tag: '<em>'}]);
		assert.deepEqual(openTags3, [{tag: '<strong>'}, {tag: '<i>'}, {tag: '<b>'}, {tag: '<em>'}]);
	});

	it('Split close tags', () => {
		const closeTags1 = split('</b></b></b>', ['b']);
		const closeTags2 = split('</em></em></em>', ['em']);
		const closeTags3 = split('</strong></i></b></em>', ['em', 'strong', 'i', 'b']);
		assert.deepEqual(closeTags1, [{tag: '</b>'}, {tag: '</b>'}, {tag: '</b>'}]);
		assert.deepEqual(closeTags2, [{tag: '</em>'}, {tag: '</em>'}, {tag: '</em>'}]);
		assert.deepEqual(closeTags3, [{tag: '</strong>'}, {tag: '</i>'}, {tag: '</b>'}, {tag: '</em>'}]);
	});

	it('Split both, open and close tags', () => {
		const bothTags = split('<strong><em><i><b></i></em></strong></b>', ['em', 'strong', 'i', 'b']);
		assert.deepEqual(bothTags, [
			{tag: '<strong>'}, {tag: '<em>'}, {tag: '<i>'}, {tag: '<b>'}, {tag: '</i>'}, {tag: '</em>'}, {tag: '</strong>'}, {tag: '</b>'}
		]);
	});

	it('Split text nodes', () => {
		const textNode1 = split('Hello, world', ['em', 'strong', 'i', 'b']);
		const textNode2 = split('42\n\n1 + 2 = 3', ['em', 'strong', 'i', 'b']);
		const textNode3 = split('<bad>', ['em', 'strong', 'i', 'b']);

		assert.deepEqual(textNode1, [{text: 'Hello, world'}]);
		assert.deepEqual(textNode2, [{text: '42\n\n1 + 2 = 3'}]);
		assert.deepEqual(textNode3, [{text: '<bad>'}]);
	});

	it('Split all', () => {
		const test = split('<strong>Hello, <em>world</em></strong>\n<i>42!</i>', ['em', 'strong', 'i', 'b']);
		assert.deepEqual(test, [
			{tag: '<strong>'},
			{text: 'Hello, '},
			{tag: '<em>'},
			{text: 'world'},
			{tag: '</em>'},
			{tag: '</strong>'},
			{text: '\n'},
			{tag: '<i>'},
			{text: '42!'},
			{tag: '</i>'},
		]);
	});
});
