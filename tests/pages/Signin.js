import Page from './Page';

class Signin extends Page {
	constructor() {
		super();
	}

	get path () {
		return '/login';
	}

	get container() {
		return '.LoginView';
	}

	get locators() {
		const container = this.container;

		return Object.assign({}, super.locators, {
			inputs: {
				username: `${container} [name="username"]`,
				password: `${container} [name="password"]`,
			},
			submit: `${container} [type="submit"]`,
		});
	}

	/**
     * Set field value
     * @param {string} name 
     * @param {string} value 
     */
	setFieldValue(name, value) {
		browser.setValue(this.locators.inputs[name], value);
	}

	/**
     * Click on submit button
     */
	submit() {
		browser.click(this.locators.submit);
	}
}

export default Signin;
