/**
 * Simple router based on HTML5 History API
 * @module {Router} Router
 */

/**
 * @class {Router}
 */
export class Router {

    /**
     * @constructor
     */
    constructor({node, history}) {
        /** @member {HTMLElement} node */
        this.node = node;
        /** @member {History} history */
        this.history = history;
        /** @member {Object} routes */
        this.routes = {};
    }

    /**
     * Register the view for the path
     * @param {string} path
     * @param {BaseView} view
     * @method route
     */
    route(path, view) {
        this.routes[path] = view;
    }

    /**
     * Get registred view by path of route
     * @param {string} route
     * @returns {BaseView}
     * @method _getViewByRoute
     */
    _getViewByRoute(route) {
        return this.routes[route];
    }

    /**
     * Handle clicks on links into the node
     * @param {MouseEvent} event
     * @method onRouteChange
     */
    onRouteChange(event) {
        if (!(event.target instanceof HTMLAnchorElement)) {
            return;
        }

        if (this.go(event.target.getAttribute('href'))) {
            event.preventDefault();
        }
    }

    /**
     * Start listening popstate event and clicks on links into the node
     * @method start
     */
    start() {
        this.node
            .addEventListener('click', event => this.onRouteChange(event));

        window.addEventListener('popstate', _ => {
            this.go(location.pathname);
        });
    }

    /**
     * Switch route to the path
     * @param {string} path
     * @returns {boolean} - is route exists
     * @method go
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
        this.history.pushState({}, '', path);

        if(this.currentView) {
            this.currentView.hide();
        }

        this.currentView = view;
        return true;
    }

}