import 'milligram/dist/milligram.css';
import './components/app/app.css';

import Router from './framework/router';
import { capitalize } from './framework/utils';

import * as firebase from 'firebase/app';
import * as auth from 'firebase/auth';
import * as database from 'firebase/database';

import firebaseService from './services/firebase.service';
import ChatService from './services/chat.service';
import PreloaderService from './services/preloader.service';

import * as views from './views';

const preloader = PreloaderService.getInstance();

firebaseService.setup({
	firebase,
	auth,
	database
});

const appEl = document.querySelector('.app');

const router = new Router({
	node: appEl
});

['main', 'chat', 'login', 'settings']
	.forEach(viewName => {
		const ViewClass = views[capitalize(viewName)];
		const view = ViewClass.create({router});

		appEl.appendChild(view.el);

		router.route(`/${viewName}`, view);
	});

if (location.pathname === '/') {
	router.go('/main');
}

firebaseService.onAuthStateChanged((user) => {
	if (user) {
		let chatService = ChatService.getInstance();
		chatService.setUserName(user.email);

		firebaseService.auth().currentUser
			.getIdToken(/* forceRefresh */ true)
			.then(idToken => sessionStorage.setItem('token', idToken))
			.catch(error => {
				// TODO: Handle error
				console.error(error);
			});
	}
	router.start();
	setTimeout(function () {
		preloader.hide();
	}, 300);
});
