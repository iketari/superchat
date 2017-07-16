const config = {
	apiKey: 'AIzaSyDJcAVX9BYqk66vBtCa9pvjK2M1nobgprM',
	authDomain: 'components-e2e6e.firebaseapp.com',
	databaseURL: 'https://components-e2e6e.firebaseio.com',
	projectId: 'components-e2e6e',
	storageBucket: 'components-e2e6e.appspot.com',
	messagingSenderId: '586252010443'
};

export class FirebaseService {
	setup({firebase}) {
		this.firebase = firebase;
		this.app = firebase.initializeApp(config);
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
