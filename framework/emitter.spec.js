import Emitter from './emitter';

describe('Emitter', () => {
    let someObj, anotherObj;

    beforeEach(() => {
        someObj = {};
    });

    it('static method apply', () => {
        Emitter.apply(someObj); 

        assert(someObj.hasOwnProperty('on'));
    });



   

});