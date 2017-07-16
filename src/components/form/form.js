import tmpl from './form.tmpl.pug';
import './form.css';

import Emitter from '../../framework/emitter';


export default class Form {
	constructor({el, data = {}, fields = null}) {
		Emitter.apply(this);
		this.el = el;
		this.data = data;
		this.fields = fields || null;

		this._initEvents();
	}

	fillFormValues(formdata) {
		this.reset();
		for (let [fieldname, fieldvalue] of Object.entries(formdata)) {
			if (this.formEl.elements[fieldname].type === 'checkbox') {
				this.formEl.elements[fieldname].checked = fieldvalue;
				continue;
			}
			this.formEl.elements[fieldname].value = fieldvalue;
		}
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

		if (this.fields !== null) {
			for (let name of this.fields) {
				if (this.formEl.elements[name].type === 'checkbox') {
					formData[name] = this.formEl.elements[name].checked;
					continue;
				}
				formData[name] = this.formEl.elements[name].value;
			}

			return formData;
		}

		[...this._getInputs()].forEach(input => {
			formData[input.name] = input.value;
		});

		return formData;
	}
}
