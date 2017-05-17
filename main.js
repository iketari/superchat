import 'milligram/dist/milligram.css';
import './components/app/app.css';

import {Router} from './framework/router';
import {capitalize} from './framework/utils';

import views from './views';

const appEl = document.querySelector('.app');

const router = new Router({
    node: appEl,
    history: window.history
});

['main', 'chat', 'login'].forEach(viewName => {
    let el = document.createElement('div');
    let View = views[capitalize(viewName)];

    el.classList.add(viewName);
    el.hidden = true;
    appEl.appendChild(el);

    router.register(`/${viewName}`, new View({ el, router }));
});

router.go('/main');
router.start();