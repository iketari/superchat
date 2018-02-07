'use strict';

const { assert } = chai; 

describe('isPrimitive - проверяет, является ли тип примитивным', () => {
  [1, '1', true, null, undefined].forEach((item) => {
    it(`Должен возвращать true для примитивных типов: ${item}`, () => {
      assert(isPrimitive(item));
    });
  });
  
  [{}, [], new Date, /.*/g].forEach((item) => {
    it(`Должен возвращать false для примитивных типов: ${item}`, () => {
      assert(!isPrimitive(item));
    });
  });
});

describe('deepEqual - сравнивает объекты по значению', () => {
  it('должен возвращать true для пустых объектов', () => {
    let actual = deepEqual({}, {});
    
    assert(actual, 'Объекты не равны');
  });
  
  it('должен возвращать true для объектов с одинаковыми данными', () => {
    let actual = deepEqual({foo: 1}, {foo: 1});
    
    assert(actual, 'Объекты не равны');
  });
  
  it('должен возвращать false для объектов с разными данными', () => {
    let actual = deepEqual({foo: 1}, {foo: 2});
    
    assert(!actual, 'Объекты равны');
  });
  
  it('должен возвращать false для объектов с разными свойствами', () => {
    let actual = deepEqual({foo: 1}, {bar: 1});
    
    assert(!actual, 'Объекты равны');
  });
  
  it('должен возвращать true для объектов с одинаковыми вложенными объектами', () => {
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
		};
		
    let actual = deepEqual(objA, objB);
    
    assert(actual, 'Объекты не равны');
  });
  
  it('должен возвращать true для объектов с одинаковыми вложенными массивами', () => {
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
		
    let actual = deepEqual(objA, objB);
    
    assert(actual, 'Объекты не равны');
  });
  
  it('должен возвращать true для объектов с одинаковыми вложенными массивами объектов', () => {
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
		
    let actual = deepEqual(objA, objB);
    
    assert(actual, 'Объекты не равны');
  });
  
  it('должен возвращать true для объектов с одинаковыми вложенными массивами дат', () => {
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
		
    let actual = deepEqual(objA, objB);
    
    assert(actual, 'Объекты не равны');
  });
  
  it('должен возвращать false для null и undefined', () => {
    let actual = deepEqual(null, undefined);
    
    assert(!actual, 'Объекты равны');
  });
  
  it('должен возвращать false для объектов разной длины', () => {
    let objA = {
			foo: 1,
			bar: 2
		};

		let objB = {
			foo: 1
		};
    
    let actual = deepEqual(objA, objB);
    
    assert(!actual, 'Объекты равны');
  });
});

