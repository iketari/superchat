import escape from './escape-html';


describe.only('escape-html', () => {
	it('Escapes strings without special characters', () => {
		assert.strictEqual(escape('42'), '42');
		assert.strictEqual(escape('foo bar'), 'foo bar');
		assert.strictEqual(escape('Съешь же ещё этих мягких французских булок, да выпей чаю.'), 'Съешь же ещё этих мягких французских булок, да выпей чаю.');
	});

	it('Escapes special characters', () => {
		assert.strictEqual(escape(`"""`), '&quot;&quot;&quot;');
		assert.strictEqual(escape(`'''`), '&#39;&#39;&#39;');
		assert.strictEqual(escape(`&&&`), '&amp;&amp;&amp;');
		assert.strictEqual(escape(`<<<`), '&lt;&lt;&lt;');
		assert.strictEqual(escape(`>>>`), '&gt;&gt;&gt;');
	});

	it('Escapes text with special characters', () => {
		assert.strictEqual(escape(`'str = "\'>\'\\"\\"&>h<e>&<y>"'`), '&#39;str = &quot;&#39;&gt;&#39;\\&quot;\\&quot;&amp;&gt;h&lt;e&gt;&amp;&lt;y&gt;&quot;&#39;');
		assert.strictEqual(escape(`<img src="#" />`), '&lt;img src=&quot;#&quot; /&gt;');
	});
});
