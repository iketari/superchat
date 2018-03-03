import Page from './Page';

class Signin extends Page {
    constructor() {
        super();
    }

    get path () {
        return 'https://components-e2e6e.firebaseapp.com/login'; 
    }

    get container() {
        return '.LoginView';
    }

    get locators() {
        return Object.assign({}, super.locators, {
            
        });
    }
}

export default Signin;
