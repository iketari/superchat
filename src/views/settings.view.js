import BaseView from '../framework/view';

import Form from '../components/form/form';
import Menu from '../components/menu/menu';

import SettingsService from '../services/settings.service';


const settings = SettingsService.getInstance();

/**
 * @class SettingsView
 */
export default class SettingsView extends BaseView {
	/**
	 * @override
	 */
	render () {
		this.form.render();
		this.menu.render();

		this.el.append(this.menu.el);
		this.el.append(this.form.el);

		this._updateSettingsForm();
		this.form.on('submit', this._onSave.bind(this));
	}

	/**
	 * @override
	 * @private
	 */
	_initMediate () {
		const selfView = this;
		settings.on('change-settings:html', function (e) {
			// console.log('change-settings:html', e);
			selfView._updateSettingsForm();
		});
		settings.on('change-settings:sendKeys', function (e) {
			// console.log('change-settings:sendKeys', e);
			selfView._updateSettingsForm();
		});
	}

	/**
	 * @private
	 */
	_updateSettingsForm() {
		const formdata = {};
		formdata.use_html = settings.settings.html;
		formdata.send_keys = settings.settings.sendKeys;

		this.form.fillFormValues(formdata);
	}

	/**
	 * @private
	 */
	_onSave(e) {
		if (e.use_html) {
			settings.allowHtmlUsage();
		} else {
			settings.disallowHtmlUsage();
		}

		settings.setSendMessageKeys(
			e.send_keys === SettingsService.SEND_KEYS.ALT_ENTER ? SettingsService.SEND_KEYS.ALT_ENTER : SettingsService.SEND_KEYS.ENTER
		);

		this.router.go('/main');
	}

	/**
	 * @override
	 * @private
	 */
	_createComponents () {
		this.menu = new Menu({
			el: document.createElement('div'),
			data: {
				title: 'Chat Settings',
				items: [],
				home: true
			}
		});

		this.form = new Form({
			el: document.createElement('div'),
			fields: ['use_html', 'send_keys'],
			data: {
				widgets: [
					{
						tag: 'h4',
						inner: 'Use html in messages?',
					},
					{
						tag: 'input',
						attributes: {
							type: 'checkbox',
							name: 'use_html',
							id: 'use_html'
						},
						label: {
							inner: 'Allow html'
						}
					},
					{
						tag: 'h4',
						inner: 'Send message by',
					},
					{
						tag: 'input',
						attributes: {
							type: 'radio',
							name: 'send_keys',
							id: 'send_by_enter',
							value: 'Enter',
							checked: 'checked'
						},
						label: {
							inner: 'Enter'
						}
					},
					{
						tag: 'input',
						attributes: {
							type: 'radio',
							name: 'send_keys',
							id: 'send_by_alt_enter',
							value: 'Alt + Enter'
						},
						label: {
							inner: 'Alt + Enter'
						}
					},
					{
						tag: 'input',
						attributes: {
							type: 'submit',
							name: 'action',
							value: 'Save'
						}
					}
				]
			}
		});
	}
}
