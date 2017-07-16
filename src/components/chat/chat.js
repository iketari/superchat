
import tmpl from './chat.tmpl.pug';
import './chat.css';

/**
 * @typedef {Object} ChatData
 *
 * @property {string} user - имя текущего пользователя
 * @property {Array<ChatMessage>} messages - масси сообщений в чате
 */

/**
 * @typedef {Object} ChatMessage
 *
 * @property {string} text - Текст сообщения
 * @property {string} name - имя отправителя сообщения
 */

export default class Chat {
	constructor({
		el,
		data = {messages: []},
		avatarService,
		chatService
	}) {
		this.el = el;
		this.data = data;

		this.avatarService = avatarService;
		this.chatService = chatService;

		this._initEvents();
	}

	_initEvents () {
		this.chatService.on('messages', this._onMessages.bind(this));
	}

	render () {
		this._saveScrollTop();
		this.el.innerHTML = tmpl(this.data);
		this._restoreScrollTop();
	}

	_onMessages (messages) {
		this.setMessages(messages);
		this.render();
	}

	_saveScrollTop () {
		let chatBox = this.el.querySelector('.chat__box');

		if (chatBox) {
			this._scrollTop = chatBox.scrollTop;
		}
	}

	_restoreScrollTop () {
		let chatBox = this.el.querySelector('.chat__box');

		if (chatBox) {
			chatBox.scrollTop = this._scrollTop;
		}
	}

	_updateMessages () {
		this.data.messages = this.data.messages.sort((message1, message2) => {
			return message2.date - message1.date;
		});
	}

	setMessages (messages = []) {
		this.data.messages.length = 0;
		this.add(messages);
	}

	/**
	 * Массовое добавление сообщений
	 * @param {Array<ChatMessages>} messages
	 */
	add (messages = []) {
		let addOneMessageMethod = this.addOne.bind(this);

		messages.forEach(addOneMessageMethod);
	}

	/**
	 * Добавить новое сообщение в чат
	 * @param {ChatMessage} data
	 */
	addOne (data) {
		this.data.messages.push(this._prepareMessage(data));
	}

	_prepareMessage ({avatar, name, text, date = Date.now()}) {
		return {
			avatar: this.avatarService.getAvatar(name),
			name,
			isMine: name === this.data.user,
			text,
			date: new Date(date)
		};
	}

	/**
	 * Устанавливаем текущего юзера
	 */
	setUserName (name) {
		this.data.user = name;
	}
}
