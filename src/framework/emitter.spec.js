import Emitter from './emitter';

describe('Emitter', () => {
	let someObj, anotherObj, callbacks;

	beforeEach(() => {
		someObj = {};

		anotherObj = {};

		callbacks = {
			foo () {}
		}
	});

	describe('apply', () => {
		it('should extend object with methods on and trigger', () => {
			Emitter.apply(someObj);

			assert.property(someObj, 'on', 'The object should has own method on');
			assert.property(someObj, 'trigger', 'The object should has own method on');
		});

		it('should not override existing events', () => {
			let spy = sinon.spy(callbacks, 'foo');
			Emitter.apply(someObj);

			someObj.on('foo', callbacks.foo);

			Emitter.apply(someObj);

			someObj.trigger('foo')

			assert(spy.called, 'The callback should be called');
		});
	});
});
