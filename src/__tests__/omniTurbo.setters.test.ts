// @vitest-environment node
import { describe, it, expect, beforeEach } from 'vitest';
import { omni } from '../OmniTurbo';

function randomString(length: number, symbols = true): string {
  let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:,.<>?/~`';
  if (!symbols) chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
}

describe('OmniTurbo Setters', () => {
    beforeEach(() => omni.clear());

    it('sets and gets a primitive value', () => {
        expect(omni.set('foo', 123)).toBe(true);
        expect(omni.get('foo')).toBe(123);
    });

    it('overwrites a value and returns correct status', () => {
        omni.set('foo', 1);
        expect(omni.set('foo', 2)).toBe(true);
        expect(omni.set('foo', 2)).toBe(false); // unchanged
        expect(omni.get('foo')).toBe(2);
    });

    it('sets and gets a string value', () => {
        omni.set('bar', 'hello');
        expect(omni.get('bar')).toBe('hello');
    });

    it('sets and gets a boolean value', () => {
        omni.set('baz', true);
        expect(omni.get('baz')).toBe(true);
        omni.set('baz', false);
        expect(omni.get('baz')).toBe(false);
    });

    it('sets and gets an array value', () => {
        omni.set('arr', [1, 2, 3]);
        expect(omni.get('arr')).toEqual([1, 2, 3]);
    });

    it('sets and gets an object value atomically', () => {
        const obj = { a: 1, b: 2 };
        omni.set('obj', obj);
        expect(omni.get('obj')).toEqual(obj);
        expect(omni.get('obj.a')).toBeUndefined();
    });

    it('sets an object with asObject:true and flattens keys', () => {
        const user = { name: 'Alice', age: 30 };
        omni.set('user', user, { asObject: true });

        expect(omni.get('user.name')).toBe('Alice');
        expect(omni.get('user.age')).toBe(30);
        expect(omni.getObj('user')).toEqual(user);
    });

    it('throws if asObject:true is used with non-object', () => {
        expect(() => omni.set('fail', 123, { asObject: true })).toThrow();
        expect(() => omni.set('fail', null, { asObject: true })).toThrow();
        expect(() => omni.set('fail', [1, 2, 3], { asObject: true })).toThrow();
    });

    it('sets nested objects with asObject:true', () => {
        const nested = { profile: { name: 'Bob', age: 40 }, active: true };
        omni.set('account', nested, { asObject: true });
        expect(omni.get('account.profile.name')).toBe('Bob');
        expect(omni.get('account.profile.age')).toBe(40);
        expect(omni.get('account.active')).toBe(true);
        expect(omni.getObj('account')).toEqual(nested);
    });

    it('sets an object using setObj (alias for batch)', () => {
        const obj = { x: 1, y: { z: 2 } };
        omni.setObj(obj, 'root');
        expect(omni.get('root.x')).toBe(1);
        expect(omni.get('root.y.z')).toBe(2);
        expect(omni.getObj('root')).toEqual({ x: 1, y: { z: 2 } });
    });

    it('sets multiple values using batch (object mode)', () => {
        omni.batch({ a: 1, b: { c: 2 } }, 'prefix');
        expect(omni.get('prefix.a')).toBe(1);
        expect(omni.get('prefix.b.c')).toBe(2);
        expect(omni.getObj('prefix')).toEqual({ a: 1, b: { c: 2 } });
    });

    it('sets multiple values using batch (function mode)', () => {
        omni.batch(() => {
        omni.set('foo', 1);
        omni.set('bar', 2);
        });
        expect(omni.get('foo')).toBe(1);
        expect(omni.get('bar')).toBe(2);
    });

    it('sets with history and can undo/redo', () => {
        omni.set('hist', 1, { history: true });
        omni.set('hist', 2, { history: true });
        omni.set('hist', 3, { history: true });
        expect(omni.get('hist')).toBe(3);
        expect(omni.canUndo('hist')).toBe(true);
        omni.undo('hist');
        expect(omni.get('hist')).toBe(2);
        omni.redo('hist');
        expect(omni.get('hist')).toBe(3);
    });

    it('sets with clone:shallow and clone:deep', () => {
        const obj = { a: 1, b: { c: 2 } };
        omni.set('cloneTest', obj, { clone: 'shallow' });
        const shallow = omni.get('cloneTest', { clone: 'shallow' });
        expect(shallow).not.toBe(obj);
        expect(shallow.b).toBe(obj.b);

        omni.set('cloneTestDeep', obj, { clone: 'deep' });
        const deep = omni.get('cloneTestDeep', { clone: 'deep' });
        expect(deep).not.toBe(obj);
        expect(deep.b).not.toBe(obj.b);
        expect(deep).toEqual(obj);
    });

    it('sets with suppressNotifications and suppressTimeline', () => {
        omni.set('noNotify', 1, { suppressNotifications: true, suppressTimeline: true });
        expect(omni.get('noNotify')).toBe(1);
        // No direct way to test notifications/timeline here, but should not throw
    });

    it('sets and gets random string paths', () => {
        const path = `foo.${randomString(8)}.bar`;
        omni.set(path, 42);
        expect(omni.get(path)).toBe(42);
    });

    it('sets and gets values with symbols in path', () => {
        const path = `foo.${randomString(8, true)}.bar`;
        omni.set(path, 'symbolic');
        expect(omni.get(path)).toBe('symbolic');
    });

    it('sets and gets deeply nested values', () => {
        omni.set('a.b.c.d.e', 99);
        expect(omni.get('a.b.c.d.e')).toBe(99);
        expect(omni.getObj('a.b.c.d')).toEqual({ e: 99 });
        expect(omni.getObj('a.b.c')).toEqual({ d: { e: 99 } });
    });

    it('overwrites object with atomic value', () => {
        omni.set('obj', { a: 1, b: 2 }, { asObject: true });
        expect(omni.get('obj.a')).toBe(1);
        omni.set('obj', 123);
        expect(omni.get('obj')).toBe(123);
        expect(omni.get('obj.a')).toBeUndefined();
    });

    it('overwrites atomic value with object (asObject)', () => {
        omni.set('obj', 123);
        expect(omni.get('obj')).toBe(123);
        omni.set('obj', { a: 1, b: 2 }, { asObject: true });
        expect(omni.get('obj.a')).toBe(1);
        expect(omni.getObj('obj')).toEqual({ a: 1, b: 2 });
    });

    it('handles empty object with asObject:true', () => {
        omni.set('empty', {}, { asObject: true });
        expect(omni.get('empty')).toEqual({});
    });

    it('handles empty object with asObject:true and allows setting children after', () => {
        omni.set('empty', {}, { asObject: true });
        expect(omni.get('empty')).toEqual({});


        omni.set('empty.child', 'value');
        expect(omni.get('empty.child')).toBe('value');
    });

    it('handles falsy values (0, "", false)', () => {
        omni.set('zero', 0);
        omni.set('emptyStr', '');
        omni.set('falsyBool', false);
        expect(omni.get('zero')).toBe(0);
        expect(omni.get('emptyStr')).toBe('');
        expect(omni.get('falsyBool')).toBe(false);
    });

    it('handles null and undefined values', () => {
        omni.set('nullVal', null);
        omni.set('undefVal', undefined);
        expect(omni.get('nullVal')).toBeNull();
        expect(omni.get('undefVal')).toBeUndefined();
    });

    it('returns false if setting unchanged value in quick mode', () => {
        omni.setQuickMode(true);
        omni.set('quick', 1);
        expect(omni.set('quick', 1)).toBe(false);
        omni.setQuickMode(false);
    });

    it('sets and gets values in quick mode', () => {
        omni.setQuickMode(true);
        omni.set('quickie', 123);
        expect(omni.get('quickie')).toBe(123);
        omni.setQuickMode(false);
    });

    it('sets and gets values in batch mode', () => {
        omni.batch(() => {
            omni.set('batched', 1);
            omni.set('batched2', 2);
        });
        expect(omni.get('batched')).toBe(1);
        expect(omni.get('batched2')).toBe(2);
    });

    it('throws error if setObj is called with non-object', () => {
        expect(() => omni.setObj(123 as any)).toThrow();
        expect(() => omni.setObj(null as any)).toThrow();
        expect(() => omni.setObj([1, 2, 3] as any)).toThrow();
    });


});