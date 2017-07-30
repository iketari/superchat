import chai from 'chai';
import {deepEqual, capitalize, isPrimitive} from './utils';

describe('utils', () => {

	describe('deepEqual - compares two objects by value.', () => {

		let eqAssert = actual => assert(actual, 'Objects should be equal');
		let notEqAssert = actual => assert(!actual, 'Objects should not be equal');

		it('should be true for two empty objects', () => {
			let actual = deepEqual({}, {});

			eqAssert(actual);
		});


		it('should be true for two filled objects with the same data', () => {
			let actual = deepEqual({foo: 1}, {foo: 1});

			eqAssert(actual);
		});

		it('should be false for two filled different objects', () => {
			let actual = deepEqual({foo: 1}, {foo: 2});

			notEqAssert(actual);
		});

		it('should be false for objects with different properties', () => {
			let actual = deepEqual({foo: 1}, {bar: 1});

			notEqAssert(actual);
		})

		it('should be true for two the same filled nested objects',  () => {
			let objA = {
				foo: 1,
				bar: {
					foo: 1
				}
			};

			let objB = {
				foo: 1,
				bar: {
					foo: 1
				}
			}

			eqAssert(deepEqual(objA, objB));
		});

		it('should be true for two filled objects with inner arrays',  () => {
			let objA = {
				foo: 1,
				bar: {
					foo: [1]
				}
			};

			let objB = {
				foo: 1,
				bar: {
					foo: [1]
				}
			};

			eqAssert(deepEqual(objA, objB));
		});

		it('should be true for two filled objects with inner array of objects',  () => {
			let objA = {
				foo: 1,
				bar: {
					foo: [{foo: 1}]
				}
			};

			let objB = {
				foo: 1,
				bar: {
					foo: [{foo: 1}]
				}
			};

			eqAssert(deepEqual(objA, objB));
		});

		it('should be true for two filled objects with inner array consists of dates',  () => {
			let ts = Date.now();

			let objA = {
				foo: 1,
				bar: {
					foo: [{foo: new Date(ts)}]
				}
			};

			let objB = {
				foo: 1,
				bar: {
					foo: [{foo: new Date(ts)}]
				}
			};

			eqAssert(deepEqual(objA, objB));
		});

		it('should be false for null and undefined', () => {
			let foo = null;
			let bar = undefined;

			let actual = deepEqual(foo, bar);

			notEqAssert(actual);
		});

		it('should be false for objects of different sizes', () => {
			let objA = {
				foo: 1,
				bar: 2
			};

			let objB = {
				foo: 1
			};

			notEqAssert(deepEqual(objA, objB));
		});
	});

	describe('capitalize - raises the first letter of the string to uppercase.', () => {
		it('should capitalize only first letter', () => {
			expect(capitalize('foo')).to.equal('Foo');
		});

		it('should capitalize one letter', () => {
			expect(capitalize('f')).to.equal('F');
		});

		it('should not capitalize empty string', () => {
			expect(capitalize('')).to.equal('');
		});
	});

	describe('isPrimitive - returns true if argument belongs to primitive type.', () => {
		chai.should();

		it('should return true for numbers, strings, booleans, null, undefined', () => {
			isPrimitive(1).should.equal(true);
			isPrimitive('1').should.equal(true);
			isPrimitive(true).should.equal(true);
			isPrimitive(null).should.equal(true);
			isPrimitive(undefined).should.equal(true);
		});

		it('should return false for objects, arrays, dates, regexps', () => {
			isPrimitive({}).should.equal(false);
			isPrimitive([]).should.equal(false);
			isPrimitive(new Date).should.equal(false);
			isPrimitive(/.*/g).should.equal(false);
		})
	});

});