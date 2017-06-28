import tmpl from './menu.tmpl.pug';
import './menu.css';


export default class Menu {
	constructor ({el, data = {}}) {
		this.el = el;
		this.data = data;
	}

	render () {
		this.el.innerHTML = tmpl(this.data);
	}
}