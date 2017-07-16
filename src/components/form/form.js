import tmpl from './form.tmpl.pug';
import './form.css';

import Emitter from '../../framework/emitter';


export default class Form {
	constructor({el, data = {}}) {
		Emitter.apply(this);
		this.el = el;
		this.data = data;

		this._initEvents();
	}

	render () {
		this.el.innerHTML = tmpl(this.data);

		this.formEl = this.el.querySelector('form');
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

		this.trigger('submit', formData);
	}

	_getInputs () {
		return this.el.querySelectorAll('input, textarea');
	}

	_getFormData () {
		let formData = {};

		[...this._getInputs()].forEach(input => {
			formData[input.name] = input.value;
		});

		return formData;
	}
}
