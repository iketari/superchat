import {deepEqual, capitalize} from './utils';

describe('utils', () => {

    // TODO: в it описать, что именно должна делать функция 
    describe('deepEqual - comparing objects by value', () => {

        let eqAssert = actual => assert(actual, 'Objects should be equal');
        let notEqAssert = actual => assert(actual, 'Objects shouldn\'t be equal');

        it('empty objects should be equal', () => {
            let actual = deepEqual({}, {});

            eqAssert(actual);
        });

        
        it('filled objects should be equal with the same data', () => {
            let actual = deepEqual({foo: 1}, {foo: 1});

            eqAssert(actual);
        });

        it('filled different objects', () => {
            let actual = !deepEqual({foo: 1}, {foo: 2});
            
            notEqAssert(actual);
        });

        it('felled objects with inner objects',  () => {
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

        it ('felled objects with inner arrays',  () => {
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

        it ('felled objects with inner array consists of objects',  () => {
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

        it ('felled objects with inner array consists of dates',  () => {
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
    });

    describe('capitalize', function () {
        it('Capitalize filled string', () => {
            expect(capitalize('foo')).to.equal('Foo');
        });

        it('Capitalize one char string', () => {
            expect(capitalize('f')).to.equal('F');
        });

        it('Capitalize empty string', () => {
            expect(capitalize('')).to.equal('');
        });
    });

});