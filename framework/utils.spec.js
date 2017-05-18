import {deepEqual} from './utils';

describe('utils', function() {

    describe('deepEqual', function() {

        it('deepEqual empty objects', function() {
            let actual = deepEqual({}, {});
            
            assert(actual, 'Равенство пустых объектов');
        });


        it('deepEqual non-empty objects', function() {
            let actual = deepEqual({foo: 1}, {foo: 1});
            
            assert(actual, 'Равенство НЕпустых объектов');
        });

        it('deepEqual non-empty different objects', function() {
            let actual = !deepEqual({foo: 1}, {foo: 2});
            
            assert(actual, 'Равенство пустых объектов');
        });
    });

});