import {deepEqual, capitalize} from './utils';

describe('utils', () => {

    describe('deepEqual - comparacing objects by value', () => {

        let eqAssert = actual => assert(actual, 'Onjects should be equal');
        let notEqAssert = actual => assert(actual, 'Onjects shouldn\'t be equal');

        it('empty objects', () => {
            let actual = deepEqual({}, {});
            
            eqAssert(actual);
        });


        it('filled objects', () => {
            let actual = deepEqual({foo: 1}, {foo: 1});
            
            eqAssert(actual);
        });

        it('filled different objects', () => {
            let actual = !deepEqual({foo: 1}, {foo: 2});
            
            notEqAssert(actual);
        });

        it ('felled objects with inner objects',  () => {
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

    });

});