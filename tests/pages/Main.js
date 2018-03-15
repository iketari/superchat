// import { assert } from 'chai';

import Page from './Page';

class Main extends Page {
	constructor() {
		super();
	}

	get path () {
		return '/main';
	}

	get container() {
		return '.MainView';
	}

	get locators() {
		const container = this.container;

		return Object.assign({}, super.locators, {
			items: {
				signin: `${container} a[href*='login']`,
				chat: `${container} a[href*='chat']`,
				settings: `${container} a[href*='settings']`,
			},
		});
	}

	/**
     * Wait for item (link) with given name
     * 
     * @param {string} name link name
     */
	hasItem(name) {
		browser.waitForExist(this.locators.items[name]);
	}

	/**
     * Click on item
     * 
     * @param {string} name 
     */
	clickItem(name) {
		browser.click(this.locators.items[name]);
	}
}

export default Main;
