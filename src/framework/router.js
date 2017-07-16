/**
 * Simple router based on HTML5 History API
 * @module {Router} Router
 */

/**
 * @class {Router}
 */
export default class Router {

	/**
	 * @constructor
	 * @param {Object} param0
	 * @param {HTMLElement} param0.node
	 */
	constructor({node}) {
		/** @member {HTMLElement} node */
		this.node = node;

		/** @member {Object} routes */
		this.routes = {};
	}

	/**
	 * Register the view for the path
	 * @param {string} path
	 * @param {BaseView} view
	 * @method route
	 * @public
	 */
	route(path, view) {
		this.routes[path] = view;
	}

	/**
	 * Get registred view by path of route
	 * @param {string} route
	 * @returns {BaseView}
	 * @method _getViewByRoute
	 * @private
	 */
	_getViewByRoute(route) {
		return this.routes[route];
	}

	/**
	 * Handle clicks on links into the node
	 * @param {MouseEvent} event
	 * @method
	 * @name _onClick
	 * @private
	 */
	_onClick(event) {
		if (!(event.target instanceof HTMLAnchorElement)) {
			return;
		}

		if (this.go(event.target.getAttribute('href'))) {
			event.preventDefault();
		}
	}

	/**
	 * Start listening popstate event and clicks on links into the node
	 * @method
	 * @name start
	 * @public
	 */
	start() {
		this.node
			.addEventListener('click', event => this._onClick(event));

		window.addEventListener('popstate', _ => {
			this.go(location.pathname);
		});
	}

	/**
	 * Switch route to the path
	 * @param {string} path
	 * @returns {boolean} - is route exists
	 * @method go
	 * @public
	 */
	go(path) {
		let view = this._getViewByRoute(path);

		if (!view) {
			return false;
		}

		if (this.currentView === view) {
			return true;
		}

		view.show();
		window.history.pushState({}, '', path);

		if(this.currentView) {
			this.currentView.hide();
		}

		this.currentView = view;
		return true;
	}
}
