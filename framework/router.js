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
     * Регистрация маршрута
     * @param {string} route
     * @param {BaseView} view
     * @method register
     */
    register(route, view) {
        this.routes[route] = view;
    }

    /**
     * Выбор View по маршруту
     * @param {string} route
     * @returns {BaseView}
     */
    _getViewByRoute(route) {
        return this.routes[route];
    }

    /**
     * Обрботчик события клика по ссылке
     * @param {MouseEvent} event
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
     * Запустить процес маршрутизации
     */
    start() {
        this.node
            .addEventListener('click', event => this.onRouteChange(event));

        window.addEventListener('popstate', _ => {
            this.go(location.pathname);
        });
    }

    /**
     * Перетий по маршруту
     * @param {string} path
     * @returns {boolean} - если есть маршрурт
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