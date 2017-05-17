export class BaseView {

    constructor({el}) {
        this.el = el;
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
