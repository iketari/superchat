export default class BaseView {

    constructor({el, router}) {
        this.el = el;
        this.router = router;
    }

    /**
     * Метод показывает view
     */
    show () {
        this.el.hidden = false;
    }

    /**
     * Метод скрывает view
     */
    hide () {
        this.el.hidden = true;
    }


}
