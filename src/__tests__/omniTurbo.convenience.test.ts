// @vitest-environment node
import { describe, it, expect, beforeEach } from 'vitest';
import { omni } from '../OmniTurbo';

describe('OmniTurbo Convenience Methods', () => {
    beforeEach(() => omni.clear());

    // increment
    it('increments a number value', () => {
        omni.set('num', 5);
        expect(omni.increment('num')).toBe(6);
        expect(omni.get('num')).toBe(6);
        expect(omni.increment('num', 4)).toBe(10);
        expect(omni.get('num')).toBe(10);
    });

    it('increments a non-existent value (should treat as 0)', () => {
        expect(omni.increment('newNum')).toBe(1);
        expect(omni.get('newNum')).toBe(1);
    });

    it('throws when incrementing a boolean', () => {
        omni.set('flag', true);
        expect(() => omni.increment('flag')).toThrow();
    });

    it('throws when incrementing a string', () => {
        omni.set('str', 'hello');
        expect(() => omni.increment('str')).toThrow();
    });

    // decrement
    it('decrements a number value', () => {
        omni.set('num', 10);
        expect(omni.decrement('num')).toBe(9);
        expect(omni.get('num')).toBe(9);
        expect(omni.decrement('num', 4)).toBe(5);
        expect(omni.get('num')).toBe(5);
    });

    it('decrements a non-existent value (should treat as 0)', () => {
        expect(omni.decrement('newNum')).toBe(-1);
        expect(omni.get('newNum')).toBe(-1);
    });

    it('throws when decrementing a boolean', () => {
        omni.set('flag', false);
        expect(() => omni.decrement('flag')).toThrow();
    });

    it('throws when decrementing a string', () => {
        omni.set('str', 'world');
        expect(() => omni.decrement('str')).toThrow();
    });

    // toggle
    it('toggles a boolean value', () => {
        omni.set('flag', true);
        expect(omni.toggle('flag')).toBe(false);
        expect(omni.get('flag')).toBe(false);
        expect(omni.toggle('flag')).toBe(true);
        expect(omni.get('flag')).toBe(true);
    });

    it('toggles a non-existent value (should treat as false)', () => {
        expect(omni.toggle('newFlag')).toBe(true);
        expect(omni.get('newFlag')).toBe(true);
    });

    it('toggles a number (should coerce to boolean)', () => {
        omni.set('num', 0);
        expect(omni.toggle('num')).toBe(true);
        expect(omni.get('num')).toBe(true);
        omni.set('num', 42);
        expect(omni.toggle('num')).toBe(false);
        expect(omni.get('num')).toBe(false);
    });

    it('toggles a string (should coerce to boolean)', () => {
        omni.set('str', '');
        expect(omni.toggle('str')).toBe(true);
        expect(omni.get('str')).toBe(true);
        omni.set('str', 'hello');
        expect(omni.toggle('str')).toBe(false);
        expect(omni.get('str')).toBe(false);
    });



    describe('array', () => {


        // push
        it('pushes to an array', () => {
            omni.set('arr', [1, 2]);
            expect(omni.push('arr', 3)).toBe(3);
            expect(omni.get('arr')).toEqual([1, 2, 3]);
            expect(omni.push('arr', 4, 5)).toBe(5);
            expect(omni.get('arr')).toEqual([1, 2, 3, 4, 5]);
        });

        it('pushes to a non-existent value (should treat as empty array)', () => {
            expect(omni.push('newArr', 'a')).toBe(1);
            expect(omni.get('newArr')).toEqual(['a']);
        });

        it('throws when pushing to a non-array (string)', () => {
            omni.set('str', 'not an array');
            expect(() => omni.push('str', 1)).toThrow();
        });

        it('throws when pushing to a non-array (number)', () => {
            omni.set('num', 123);
            expect(() => omni.push('num', 1)).toThrow();
        });

        it('throws when pushing to a non-array (object)', () => {
            omni.set('obj', { a: 1 });
            expect(() => omni.push('obj', 2)).toThrow();
        });

        it('pushes objects and arrays as items', () => {
            omni.set('arr', []);
            expect(omni.push('arr', { a: 1 })).toBe(1);
            expect(omni.push('arr', [2, 3])).toBe(2);
            expect(omni.get('arr')).toEqual([{ a: 1 }, [2, 3]]);
        });


        // pop
        it('pops from an array', () => {
            omni.set('arr', [1, 2, 3]);
            expect(omni.pop('arr')).toBe(3);
            expect(omni.get('arr')).toEqual([1, 2]);
            expect(omni.pop('arr')).toBe(2);
            expect(omni.get('arr')).toEqual([1]);
            expect(omni.pop('arr')).toBe(1);
            expect(omni.get('arr')).toEqual([]);
            expect(omni.pop('arr')).toBeUndefined();
            expect(omni.get('arr')).toEqual([]);
        });

        it('throws when popping from non-array', () => {
            omni.set('notArr', 123);
            expect(() => omni.pop('notArr')).toThrow();
        });

        // shift
        it('shifts from an array', () => {
            omni.set('arr', [1, 2, 3]);
            expect(omni.shift('arr')).toBe(1);
            expect(omni.get('arr')).toEqual([2, 3]);
            expect(omni.shift('arr')).toBe(2);
            expect(omni.get('arr')).toEqual([3]);
            expect(omni.shift('arr')).toBe(3);
            expect(omni.get('arr')).toEqual([]);
            expect(omni.shift('arr')).toBeUndefined();
            expect(omni.get('arr')).toEqual([]);
        });

        it('throws when shifting from non-array', () => {
            omni.set('notArr', { a: 1 });
            expect(() => omni.shift('notArr')).toThrow();
        });

        // unshift
        it('unshifts to an array', () => {
            omni.set('arr', [3, 4]);
            expect(omni.unshift('arr', 1, 2)).toBe(4);
            expect(omni.get('arr')).toEqual([1, 2, 3, 4]);
        });

        it('unshifts to a non-existent value (should treat as empty array)', () => {
            expect(omni.unshift('newArr', 'a')).toBe(1);
            expect(omni.get('newArr')).toEqual(['a']);
        });

        it('throws when unshifting to non-array', () => {
            omni.set('notArr', false);
            expect(() => omni.unshift('notArr', 1)).toThrow();
        });

        // splice
        it('splices an array (remove and add)', () => {
            omni.set('arr', [1, 2, 3, 4]);
            expect(omni.splice('arr', 1, 2, 'a', 'b')).toEqual([2, 3]);
            expect(omni.get('arr')).toEqual([1, 'a', 'b', 4]);
        });

        it('splices an array (remove only)', () => {
            omni.set('arr', [1, 2, 3]);
            expect(omni.splice('arr', 0, 2)).toEqual([1, 2]);
            expect(omni.get('arr')).toEqual([3]);
        });

        it('splices an array (add only)', () => {
            omni.set('arr', [1, 2]);
            expect(omni.splice('arr', 1, 0, 'x')).toEqual([]);
            expect(omni.get('arr')).toEqual([1, 'x', 2]);
        });

        it('throws when splicing non-array', () => {
            omni.set('notArr', 'abc');
            expect(() => omni.splice('notArr', 0, 1)).toThrow();
        });



    });










    // typeof
    describe('typeOf', () => {
        beforeEach(() => omni.clear());

        it('returns "undefined" for missing path', () => {
            expect(omni.typeOf('missing')).toBe('undefined');
        });

        it('returns "null" for null value', () => {
            omni.set('val', null);
            expect(omni.typeOf('val')).toBe('null');
        });

        it('returns "array" for arrays', () => {
            omni.set('arr', []);
            expect(omni.typeOf('arr')).toBe('array');
            omni.set('arr2', [1, 2, 3]);
            expect(omni.typeOf('arr2')).toBe('array');
        });

        it('returns "object" for plain objects', () => {
            omni.set('obj', { a: 1 });
            expect(omni.typeOf('obj')).toBe('object');
            omni.set('obj2', {});
            expect(omni.typeOf('obj2')).toBe('object');
        });

        it('returns "string" for strings', () => {
            omni.set('str', 'hello');
            expect(omni.typeOf('str')).toBe('string');
            omni.set('emptyStr', '');
            expect(omni.typeOf('emptyStr')).toBe('string');
        });

        it('returns "number" for numbers', () => {
            omni.set('num', 42);
            expect(omni.typeOf('num')).toBe('number');
            omni.set('zero', 0);
            expect(omni.typeOf('zero')).toBe('number');
            omni.set('neg', -1);
            expect(omni.typeOf('neg')).toBe('number');
            omni.set('nan', NaN);
            expect(omni.typeOf('nan')).toBe('number');
        });

        it('returns "boolean" for booleans', () => {
            omni.set('boolTrue', true);
            expect(omni.typeOf('boolTrue')).toBe('boolean');
            omni.set('boolFalse', false);
            expect(omni.typeOf('boolFalse')).toBe('boolean');
        });

        it('returns "function" for functions', () => {
            const fn = () => {};
            omni.set('fn', fn);
            expect(omni.typeOf('fn')).toBe('function');
        });

        it('returns "symbol" for symbols', () => {
            const sym = Symbol('s');
            omni.set('sym', sym);
            expect(omni.typeOf('sym')).toBe('symbol');
        });



        it('returns correct type for nested paths', () => {
            omni.set('nested.obj', { foo: 1 });
            expect(omni.typeOf('nested.obj')).toBe('object');
            omni.set('nested.arr', [1, 2]);
            expect(omni.typeOf('nested.arr')).toBe('array');
            omni.set('nested.str', 'abc');
            expect(omni.typeOf('nested.str')).toBe('string');
        });
    });




});