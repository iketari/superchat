/**
 * Простой роутер на History API
 * @module {Router} Router
 */

/**
 * @class {Router}
 */
export default class Router {

    /**
     * @constructor
     */
    constructor({node, history}) {
        this.node = node;
        this.history = history;

        this.routes = {};
    }

    /**
     * Регистрация маршрута
     * @param {string} route
     * @param {BaseView} view
     * @method Router
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
