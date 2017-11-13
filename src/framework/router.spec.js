import Router from './router';

describe('Router', () => {
	let router, node, history, view, secondView;

	beforeEach(() => {
		history = {
			pushState () {}
		};

		node = document.createElement('div');

		view = {
			show () {},
			hide () {}
		};

		secondView = {
			show () {},
			hide () {}
		};

		router = new Router({
			node,
			history
		});
	});

	describe('constructor', () => {
		it('should instantiate', () => {
			expect(router instanceof Router);
		});
	});

	describe('fn.route / fn._getViewByRoute', () => {
		it('should return a view, which was associated with a route', () => {
			router.route('/someroute', view);

			let resView = router._getViewByRoute('/someroute');

			assert.strictEqual(resView, view, 'View should be the same');
		});
	});

	describe('fn._onClick', () => {
		it('should switch to the route after click by <a href="/someroute">', () => {
			let spy = sinon.spy(router, 'go');
			let a = document.createElement('a');
			let click = new Event('click', {
				bubbles: true,
				cancelable: true
			});

			a.href = '/someroute';
			node.appendChild(a);
			document.body.appendChild(node);

			router.route('/someroute', view);
			router.start();

			a.dispatchEvent(click);

			assert.isTrue(spy.called, 'fn.go should be called');
			assert.isTrue(spy.calledWithExactly('/someroute'), 'fn.go should be called');
		});

		it('should not switch to the route after click by <a href="/someroute"> after routing preventing', () => {
			let a = document.createElement('a');
			let click = new Event('click', {
				bubbles: true,
				cancelable: true
			});

			a.href = '/someroute';
			node.appendChild(a);
			document.body.appendChild(node);

			router.route('/someroute', view);
			router.start();
			let spy = sinon.spy(router, 'go');

			a.addEventListener('click', event => {
				// prevent routing
				event.isRoutingPrevented = true;

				//prevent reload
				event.preventDefault();
			});

			a.dispatchEvent(click);

			assert.isTrue(spy.notCalled, 'fn.go should not be called');
		});

		it('should not switch to the route after click by <a href="/somewrongroute">', () => {
			let a = document.createElement('a');
			let click = new Event('click', {
				bubbles: true,
				cancelable: true
			});

			a.href = '/somewrongroute';
			node.appendChild(a);
			document.body.appendChild(node);

			router.route('/someroute', view);
			router.start();
			let spy = sinon.spy(router, 'go');

			a.addEventListener('click', event => {
				//prevent reload
				event.preventDefault();
			});

			a.dispatchEvent(click);

			assert.isTrue(spy.called, 'fn.go should not be called');
			assert.isTrue(spy.returned(false), 'fn.go should return false');
		});

		it('should not switch to the route after click by <div href="/someroute">', () => {
			let div = document.createElement('div');
			let click = new Event('click', {
				bubbles: true,
				cancelable: true
			});

			div.setAttribute('href','/someroute');
			node.appendChild(div);
			document.body.appendChild(node);

			router.route('/someroute', view);
			router.start();
			let spy = sinon.spy(router, 'go');

			div.dispatchEvent(click);

			assert.isTrue(spy.notCalled, 'fn.go should not be called');
		});

	});

	describe('fn.go', () => {
		it('should call show method of view on go to a correct route', () => {
			let spy = sinon.spy(view, 'show');
			router.route('/someroute', view);

			router.go('/someroute');

			assert(spy.called, 'View.fn.show should be called');
		});

		it('should no call show method of view on go to a incorrect route', () => {
			let spy = sinon.spy(view, 'show');
			router.route('/someroute', view);

			router.go('/someotherroute');

			assert(spy.notCalled, 'View.fn.show should not be called');
		});

		it('should call show method of view on go to a correct route only once by one route', () => {
			let spy = sinon.spy(view, 'show');
			router.route('/someroute', view);

			router.go('/someroute');
			router.go('/someroute');

			assert(spy.calledOnce, 'View.fn.show should be called once');
		});

		it('should call show/hide methods of views properly', () => {
			let spyShow = sinon.spy(view, 'show');
			let spyHide = sinon.spy(view, 'hide');
			let secondSpyShow = sinon.spy(secondView, 'show');
			let secondSpyHide = sinon.spy(secondView, 'hide');

			router.route('/firstroute', view);
			router.route('/secondroute', secondView);

			router.go('/firstroute');
			router.go('/secondroute');

			assert(spyShow.calledOnce, 'View.fn.show should be called once');
			assert(spyHide.calledOnce, 'View.fn.hide should be called once');
			assert(secondSpyShow.calledOnce, 'View.fn.show (second) should be called once');
			assert(secondSpyHide.notCalled, 'View.fn.hide should not be called');
		});
	});

	describe('fn.start', () => {
		it('should add eventListener on click', () => {
			let spy = sinon.spy(node, 'addEventListener');

			router.start();

			assert(spy.called, 'window.addEventListener should be called');
			assert(spy.calledWith('click'), 'window.addEventListener should be called with click');
		});
	});

});
