import filter from './html-filter';


describe.only('html-filter', () => {
	it('Escapes simple texts', () => {
		assert.strictEqual(filter(`- "42!", сказала Машина.\nЭто и был главный ответ на Вопрос жизни, вселенной & всего такого...`, ['strong', 'em']),
			'- &quot;42!&quot;, сказала Машина.<br/>Это и был главный ответ на Вопрос жизни, вселенной &amp; всего такого...');
	});

	it('Works with valid html', () => {
		assert.strictEqual(filter(`<strong>Hello, <em>World!</em></strong>\n1 + 2 < 4!`, ['strong', 'em']),
			'<strong>Hello, <em>World!</em></strong><br/>1 + 2 &lt; 4!');
	});

	it('Filter XSS', () => {
		assert.strictEqual(filter(`<script>alert('1');</script>`, ['strong', 'em']), '&lt;script&gt;alert(&#39;1&#39;);&lt;/script&gt;');
		assert.strictEqual(filter(`<img src="bad" onerror="alert('1');">`, ['strong', 'em']), '&lt;img src=&quot;bad&quot; onerror=&quot;alert(&#39;1&#39;);&quot;&gt;');
	});
});
