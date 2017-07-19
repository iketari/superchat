/**
 * Module that provides basic view functionality
 * @module {BaseView} BaseView
 */

/**
 * @class BaseView
 * @alias module:BaseView
 */
export default class BaseView {
	/**
	 * Constructor of View
	 * @constructor
	 * @param {Object} param0
	 * @param {HTMLElement} param0.el
	 * @param {Router} param0.router
	 */
	constructor({el, router}) {
		this.el = el;
		this.router = router;

		this.el.classList.add(this.name);
		this.el.hidden = true;

		this._createComponents();
		this._initMediate();

		this.render();
	}

	/**
	 * Creating an instance of View
	 * @param {Object} param0
	 * @param {Router} param0.router
	 * @returns {View}
	 */
	static create ({router}) {
		return new this({
			el: document.createElement('div'),
			router
		});
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

	/**
	 * Rendering nested components
	 */
	render () {}

	/**
	 * Creating nested components
	 */
	_createComponents () {}

	/**
	 * Initiate an messaging between components
	 */
	_initMediate () {}
}
