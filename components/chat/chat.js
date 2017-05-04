(function () {
  'use strict';

  /**
  * @typedef {Object} ChatMessage
  * @property {string} username
  * @property {string} message
  */

  class Chat {
    constructor({el, data = {messages: []}}) {
      this.el = el;
      this.data = data; // массив сообщений
      // this.data = {
      //     messages: [ {username: 'text', message: 'text'} ]
      // }
    }

    render () {
      let messagesHTML = this.data.messages.map(mData => {
        return `<div class="chat__message">
                  <span class="chat__author">${mData.username}</span>
                   ${mData.message}
                </div>`;
      }).join('');

      this.el.innerHTML = `
        <div class="chat">
          ${messagesHTML}
        </div>
      `;
    }

    /**
    * Add message into chat store. Without rerender
    * @param {ChatMessage} данные сообщения
    */
    addMessage (message) {
      this.data.messages.push(message);
    }
  }

  //export
  window.Chat = Chat;
})();
