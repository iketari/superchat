import Signin from '../pages/Signin';
import Main from '../pages/Main';
import authorisation from '../utils/authorisation';

const signin = new Signin();
const main = new Main();

describe('Sign in page', () => {
    it('should log in existing user', () => {
        main.open();
        main.wait();
        main.hasItem('signin');
        main.clickItem('signin');

        const {username, password} = authorisation.get();

        signin.wait();
        signin.setFieldValue('username', username);
        signin.setFieldValue('password', password);
        signin.submit();

        main.wait();
        main.hasItem('chat');
    });
});
