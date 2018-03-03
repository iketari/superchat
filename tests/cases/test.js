import Signin from '../pages/Signin';
import Main from '../pages/Main';

const signin = new Signin();
const main = new Main();

describe('Sign in button', () => {
    it('should open sign in page', () => {
        main.open();
        main.wait();
        main.clickSignin();
        signin.wait();
    });
});
