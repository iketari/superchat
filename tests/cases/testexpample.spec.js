import Signin from '../pages/Signin';
import Main from '../pages/Main';

const signin = new Signin();
const main = new Main();

describe('Sign in button', () => {
	it('should open signin page', () => {
		main.open();
		main.wait();
		main.hasItem('signin');
		main.clickItem('signin');
		signin.wait();
	});
});
