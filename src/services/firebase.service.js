const config = {
	apiKey: 'AIzaSyDJcAVX9BYqk66vBtCa9pvjK2M1nobgprM',
	authDomain: 'components-e2e6e.firebaseapp.com',
	databaseURL: 'https://components-e2e6e.firebaseio.com',
	projectId: 'components-e2e6e',
	storageBucket: 'components-e2e6e.appspot.com',
	messagingSenderId: '586252010443'
};

export class FirebaseService {
	constructor () {}

	setup ({firebase}) {
		this.firebase = firebase;
		this.app = firebase.initializeApp(config);
	}

	auth () {
		return this.firebase.auth();
	}
}

export default new FirebaseService();
