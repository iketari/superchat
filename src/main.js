import 'milligram/dist/milligram.css';
import './components/app/app.css';

import Router from './framework/router';
import Store from './framework/store';
import { capitalize } from './framework/utils';

import * as firebase from 'firebase/app';
import * as auth from 'firebase/auth';
import * as database from 'firebase/database';

import firebaseService from './services/firebase.service';

import * as views from './views';

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
} else {
	router.go(location.pathname);
}

router.start();
