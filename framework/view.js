export default class BaseView {

	/**
	 * Constructor of View
	 * @param {Object} param0 
	 * @param {HTMLElement} param0.el
	 * @param {Router} param0.router
	 */
	constructor({el, router}) {
		this.el = el;
		this.router = router;

		this.el.classList.add(this.name);
		this.el.hidden = true;
	}

	/**
	 * Creating an instance of View
	 * @param {Object} param0 
	 * @param {Router} param0.router
	 * @returns {View}
	 */
	static create ({router}) {
		const view =new this({
			el: document.createElement('div'),
			router
		});

		return view;
	}

	/**
	 * Get a name of this view
	 */
	get name () {
		return this.constructor.name;
	}

	/**
	 * Will be called by Router on starting route
	 */
	show () {
		this.el.hidden = false;
	}

	/**
	 * Will be called by Router on ending route
	 */
	hide () {
		this.el.hidden = true;
	}
}
