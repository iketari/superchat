
import tmpl from './chat.tmpl.pug';
import './chat.css';

/**
 * @typedef {Object} ChatData
 *
 * @property {string} user - the name of the current user
 * @property {Array<ChatMessage>} messages - the array of chat messages
 */

/**
 * @typedef {Object} ChatMessage
 *
 * @property {string} text - the message body
 * @property {string} name - the message author name
 */

export default class Chat {
	constructor({
		el,
		data = {messages: []},
		avatarService
	}) {
		this.el = el;
		this.data = data;

		this._scrollStrategy = 'bottom';

		this.avatarService = avatarService;

		this._initEvents();
	}

	_initEvents () {}

	render ({scroll} = {}) {
		this._saveScrollTop();
		this.el.innerHTML = tmpl(this.data);
		this._restoreScrollTop(scroll);
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
			switch (this._scrollStrategy) {
			case 'bottom':
				chatBox.scrollTop = chatBox.scrollHeight;
				break;
			case 'fixed':
				chatBox.scrollTop = this._scrollTop;
			}
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
	 * How to restore scroll after render
	 * @param {string} strategy
	 */
	setScrollStrategy (strategy) {
		this._scrollStrategy = strategy;
	}

	/**
	 * Adds to the chat a bunch of messages
	 * @param {Array<ChatMessages>} messages
	 */
	add (messages = []) {
		let addOneMessageMethod = this.addOne.bind(this);

		messages.forEach(addOneMessageMethod);
	}

	/**
	 * Adds to the chat one message
	 * @param {ChatMessage} data
	 */
	addOne (data) {
		this.data.messages.push(this._prepareMessage(data));
	}

	_prepareMessage ({name, text, date = Date.now(), html}) {
		return {
			avatar: this.avatarService.getAvatar(name),
			name,
			isMine: name === this.data.user,
			text,
			date: new Date(date),
			html
		};
	}

	/**
	 * Sets up the current user name
	 */
	setUserName (name) {
		this.data.user = name;
	}
}
