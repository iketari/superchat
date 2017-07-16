import BaseView from '../framework/view';

import Form from '../components/form/form';
import Menu from '../components/menu/menu';


export default class MainView extends BaseView {
	render () {
		this.form.render();
		this.menu.render();

		this.el.append(this.menu.el);
		this.el.append(this.form.el);
	}

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
							id: 'send_by_enter'
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
							id: 'send_by_alt_enter'
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
