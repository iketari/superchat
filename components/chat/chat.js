import {deepEqual} from '../../modules/utils';
import tmpl from './chat.tmpl.pug';
import './chat.css';

debugger;

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

export class Chat {
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

		this._init();
	}

	_initEvents () {
		this.el.addEventListener('change', (event) => {

			if (event.target.classList.contains('chat__userinput')) {
				this.data.user = event.target.value;
				this.render();
			}
		});
	}

	_init () {
		this.startPolling();
		
	}

	startPolling () {
		this.__pollingID = setInterval(() => {

			if (!this.data.user) {
				return;
			}

			this.chatService.getMessages(data => {
				console.log('getMessages', data);

				if (deepEqual(
						this.data.messages, 
						data.map(this._prepareMessage.bind(this)))
					) {
					return;
				}

				this.set(data);
				this.render();

			});
		}, 4000);
	}

	stopPolling () {
		clearInterval(this.__pollingID);
	}

	render () {
		this._saveScrollTop();
		this.el.innerHTML = tmpl(this.getData());
		this._restoreScrollTop();
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

	getData () {
		return this.data;
	}

	getUsername () {
		return this.data.user;
	}

	_updateMessages () {
		this.data.messages = this.data.messages.sort((message1, message2) => {
			return message2.date - message1.date;
		});	
	}


	set (messages = []) {
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