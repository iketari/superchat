import BaseView from './view';

describe('BaseView', () => {
	let View, view, router;

	beforeEach(() => {
		View = class extends BaseView {
			constructor (...args) {
				super(...args);
			}
		};

		router = {};

		view = View.create({router});
	});

	describe('static create', () => {
		it('should return instance of Class', () => {
			assert.instanceOf(view, BaseView, 'view should be an instance of BaseView class');
			assert.strictEqual(view.el.hidden, true, 'the element should be hide');
		});
	});

	describe('show', () => {
		it('should toggle hidden property of the element of view', () => {
			view.show();

			assert.strictEqual(view.el.hidden, false, 'the element should be visible');
		});
	});


	describe('hide', () => {
		it('should toggle hidden property of the element of view', () => {
			view.hide();

			assert.strictEqual(view.el.hidden, true, 'the element should be hide');
		});
	});

});
