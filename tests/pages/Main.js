import { assert } from 'chai';

import Page from './Page';

class Main extends Page {
    constructor() {
        super();
    }

    get path () {
        return 'https://components-e2e6e.firebaseapp.com/main'; 
    }

    get container() {
        return '.MainView';
    }

    get locators() {
        const container = this.container;

        return Object.assign({}, super.locators, {
            signin: `${container} a[href*='login']`,
        });
    }

    clickSignin() {
        browser.waitForVisible(this.locators.signin);
        browser.click(this.locators.signin);
    }
}

export default Main;
