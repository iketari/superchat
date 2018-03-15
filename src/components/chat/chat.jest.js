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
	const date = new Date(100500);
	date.setHours(0);
	
	const messages = [
		{
			name: 'name',
			text: 'text',
			date: date.getTime()
		}
	]
	chat.add(messages);

	chat.render();

	expect(chat.el.innerHTML).toMatchSnapshot();
});