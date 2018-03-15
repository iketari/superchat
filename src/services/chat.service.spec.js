import ChatService from './chat.service';

describe('ChatService', () => {
	describe('getMessages', () => {
		let chatService;
		let makeRequestStub;

		beforeEach(() => {
			const http = {
				setBaseUrl() {},
				makeRequest() {},
			};

			makeRequestStub = sinon.stub(http, 'makeRequest');

			// do not use static getInstance
			chatService = new ChatService({
				baseUrl: '',
				http
			});
		});

		it('returns array of messages', async () => {
			makeRequestStub.resolves({ data: [1, 2] });

			const messages = await chatService.getMessages();

			assert.isArray(messages);
			assert.deepEqual(messages, [1, 2]);
		});

		it('returns empty array if there is no messages', async () => {
			makeRequestStub.resolves({});

			const messages = await chatService.getMessages();

			assert.isArray(messages);
			assert.lengthOf(messages, 0);
		});
	});
});
