(function () {
  'use strict';

  class Form {
    constructor({el}) {
      this.el = el;

      this._onSubmit = this._onSubmit.bind(this);
      this._initEvents();
    }

    onSubmit (message) {
      console.warn('You should define your own onSubmit');
      console.info('message:', message);
    }

    _initEvents () {
      this.el.addEventListener('submit', this._onSubmit);
    }

    _onSubmit (event) {
      event.preventDefault();

      let formData = this._getFormData();
      this.onSubmit(formData);
    }

    _getFormData () {
      let names = this.el.querySelectorAll('[name]');
      let data = {};

      names.forEach(el => {
        data[el.name] = el.value;
      });

      return data;
    }

    render () {
      this.el.innerHTML = `
        <input name="username" required placeholder="Имя пользователя" />
        <form class="form">
          <textarea name="message" required placeholder="Сообщение..." rows=4></textarea>
          <br/>
          <input type="submit"/>
        </form>
      `;
    }
  }

  // export
  window.Form = Form;

})();
