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

	it('indtanceof', () => {            
		expect(router instanceof Router);
	});

	it('fn._getViewByRoute', () => {
		router.route('/someroute', view);

		let resView = router._getViewByRoute('/someroute');

		expect(resView === view, 'View shoud be the same');
	});

	it('fn.go new view', () => {
		let spy = sinon.spy(view, 'show');
		router.route('/someroute', view);

		router.go('/someroute');

		assert(spy.called, 'View.fn.show should be called');
	});

	it('fn.go no view', () => {
		let spy = sinon.spy(view, 'show');
		router.route('/someroute', view);

		router.go('/someotherroute');

		assert(spy.notCalled, 'View.fn.show should not be called');
	});

	it('fn.go several calls', () => {
		let spy = sinon.spy(view, 'show');
		router.route('/someroute', view);

		router.go('/someroute');
		router.go('/someroute');

		assert(spy.calledOnce, 'View.fn.show should be called once');
	});

	it('fn.go several views', () => {
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