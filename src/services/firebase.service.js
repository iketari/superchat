import config from './config.service';

export class FirebaseService {
	setup({firebase}) {
		this.firebase = firebase;
		this.app = firebase.initializeApp(config.get('firebase'));
	}

	auth() {
		return this.firebase.auth();
	}

	/**
	 * Logout current user
	 * @returns {Promise}
	 */
	logOut() {
		return this.auth().signOut();
	}

	signIn (email, password) {
		return this.auth().signInWithEmailAndPassword(email, password)
			.catch(error => {
				//TODO: Emit event
				console.log('signIn: ', error.code, error.message);
			});
	}

	/**
	 * Create new user with email and password
	 * @param {string} email 
	 * @param {string} password 
	 * @returns {Promise}
	 */
	signUp(email, password) {
		return this.auth().createUserWithEmailAndPassword(email, password)
			.catch(error => {
				//TODO: Emit event
				console.log('signUp: ', error.code, error.message);
			});
	}

	onAuthStateChanged (callback) {
		return this.auth().onAuthStateChanged(callback);
	}
}

export default new FirebaseService();
