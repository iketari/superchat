import 'milligram/dist/milligram.css';
import './components/app/app.css';

import Router from './framework/router';
import {capitalize} from './framework/utils';

import views from './views';

const appEl = document.querySelector('.app');

// TODO: remove injections in favor of global objects
const router = new Router({
    node: appEl,
    history: window.history
});

// TODO: View.create
['main', 'chat', 'login'].forEach(viewName => {
    let el = document.createElement('div');
    // TODO (Ilya) refactor into dynamic includes
    let View = views[capitalize(viewName)];

    // TODO: static View.create
    el.classList.add(viewName);
    el.hidden = true;
    appEl.appendChild(el);

    // TODO: rename to route
    router.register(`/${viewName}`, new View({ el, router }));
});

if (location.pathname === '/') {
    router.go('/main');
} else {
    router.go(location.pathname);
}

router.start();
