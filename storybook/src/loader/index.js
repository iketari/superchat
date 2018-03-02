import Chat from '../../../src/components/chat/chat';
import Form from '../../../src/components/form/form';
import Menu from '../../../src/components/menu/menu';

export class Loader {
	constructor() {
		this.blocks = {
			Chat, Form, Menu
		};
	}

	getBlock(name, data, el) {
		el.classList.add(name.toLowerCase());
		return new this.blocks[name](Object.assign(data, {el}));
	}
}
