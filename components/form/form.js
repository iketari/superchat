(function () {
	'use strict';

	//import
	const tmpl = window.formTmpl;

	class Form {
		constructor(options) {
			this.el = options.el;

			this._initEvents();
		}

		render () {
			this.el.innerHTML = tmpl(this.data);

			this.formEl = this.el.querySelector('form');
		}

		/**
		 * Установка callback отправки формы
		 * @param  {Function} cb
		 */
		onSubmit (cb) {
			this._submitCallback = cb;
		}

		reset () {
			this.formEl.reset();
		}
	
		_initEvents () {
			this.el.addEventListener('submit', this._onSubmit.bind(this));
		}

		_onSubmit (event) {
			event.preventDefault();
			let formData = this._getFormData();

			this._submitCallback(formData);
		}

		_getInputs () {
			return this.el.querySelectorAll('input, textarea');
		}

		_getFormData () {
			let formData = {};

			[...this._getInputs()].forEach(input => {
				formData[input.name] = {
					value: input.value
				};
			});

			return formData;
		}

	}

	//export
	window.Form = Form;
})();