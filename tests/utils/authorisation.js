import accounts from '../store/accounts';

export default {
	/** 
     * @returns {{username, password}} random account
     */
	get() {
		return accounts[Math.floor(Math.random() * accounts.length)];
	}
};
