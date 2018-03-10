import Chat from './chat';

let chat;

beforeEach(() => {
	chat = new Chat({
		el: document.createElement('div'),
		data: { messages: [] },
		avatarService: {
			getAvatar() {
				return 'avatar.jpg';
			}
		}
	});
});

test('Should render a banner for empty message list', () => {
	chat.render();

	expect(chat.el.innerHTML).toMatchSnapshot();
});

test('Should render one message', () => {
	const messages = [
		{
			name: 'name',
			text: 'text',
			date: 100500
		}
	]
	chat.add(messages);

	chat.render();

	expect(chat.el.innerHTML).toMatchSnapshot();
});