import 'milligram/dist/milligram.css';
import './components/app/app.css';

import Router from './framework/router';
import {capitalize} from './framework/utils';

import views from './views';

const appEl = document.querySelector('.app');

const router = new Router({
	node: appEl
});

['main', 'chat', 'login'].forEach(viewName => {
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