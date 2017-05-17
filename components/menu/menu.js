import tmpl from './menu.tmpl.pug';
import './menu.css';


export class Menu {
    constructor ({el, data = {}}) {
        this.el = el;
        this.data = data;
    }

    render () {
        console.log(this.data);
        this.el.innerHTML = tmpl(this.data);
    }
}