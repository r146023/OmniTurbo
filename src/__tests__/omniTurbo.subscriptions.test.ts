// @vitest-environment node
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { omni } from '../OmniTurbo';

describe('OmniTurbo Subscriptions', () => {
    beforeEach(() => omni.clear());

    it('notifies subscriber on value change', () => {
        const cb = vi.fn();
        omni.subscribe('foo.bar', cb);
        omni.set('foo.bar', 123);
        expect(cb).toHaveBeenCalledWith('foo.bar', 123);
    });

    it('does not notify if value is unchanged', () => {
        const cb = vi.fn();
        omni.set('foo.bar', 1);
        omni.subscribe('foo.bar', cb);
        omni.set('foo.bar', 1);
        expect(cb).not.toHaveBeenCalled();
    });

    it('notifies multiple subscribers', () => {
        const cb1 = vi.fn();
        const cb2 = vi.fn();
        omni.subscribe('foo.bar', cb1);
        omni.subscribe('foo.bar', cb2);
        omni.set('foo.bar', 'hi');
        expect(cb1).toHaveBeenCalledWith('foo.bar', 'hi');
        expect(cb2).toHaveBeenCalledWith('foo.bar', 'hi');
    });

    it('unsubscribes correctly', () => {
        const cb = vi.fn();
        const unsub = omni.subscribe('foo.bar', cb);
        omni.set('foo.bar', 1);
        unsub();
        omni.set('foo.bar', 2);
        expect(cb).toHaveBeenCalledTimes(1);
    });

    it('notifies parent subscribers if enabled', () => {
        omni.setParentNotifications(true);
        const parentCb = vi.fn();
        omni.subscribe('foo', parentCb);
        omni.set('foo.bar', 42);
        expect(parentCb).toHaveBeenCalledWith('foo', { bar: 42 });
    });

    it('does not notify parent subscribers if disabled', () => {
        omni.setParentNotifications(false);
        const parentCb = vi.fn();
        omni.subscribe('foo', parentCb);
        omni.set('foo.bar', 42);
        expect(parentCb).not.toHaveBeenCalled();
    });

    it('notifies child and parent subscribers', () => {
        omni.setParentNotifications(true);
        const parentCb = vi.fn();
        const childCb = vi.fn();
        omni.subscribe('foo', parentCb);
        omni.subscribe('foo.bar', childCb);
        omni.set('foo.bar', 99);
        expect(childCb).toHaveBeenCalledWith('foo.bar', 99);
        expect(parentCb).toHaveBeenCalledWith('foo', { bar: 99 });
    });

    it('notifies global subscribers on any change', () => {
        const globalCb = vi.fn();
        const unsub = omni.subscribeGlobal(globalCb);
        omni.set('x.y', 5);
        expect(globalCb).toHaveBeenCalledWith('x.y', 5, undefined);
        unsub();
        omni.set('x.y', 6);
        expect(globalCb).toHaveBeenCalledTimes(1);
    });

    it('notifies on delete', () => {
        const cb = vi.fn();
        omni.set('foo.bar', 1);
        omni.subscribe('foo.bar', cb);
        omni.delete('foo.bar');
        expect(cb).toHaveBeenCalledWith('foo.bar', undefined);
    });

    it('notifies on overwrite with atomic value', () => {
        const cb = vi.fn();
        omni.set('foo', { bar: 1 }, { asObject: true });
        omni.subscribe('foo', cb);
        omni.set('foo', 123);
        expect(cb).toHaveBeenCalledWith('foo', 123);
    });

    it('notifies once if "once" option is used', () => {
        const cb = vi.fn();
        omni.subscribe('foo.bar', cb);
        omni.set('foo.bar', 1);
        omni.set('foo.bar', 2);
        expect(cb).toHaveBeenCalledTimes(2); // Default is not once

        // Now test with once
        const cbOnce = vi.fn();
        omni.subscribe('foo.baz', cbOnce);
        omni.set('foo.baz', 1);
        omni.set('foo.baz', 2);
        // The default subscribe does not support once, but alerts do
        // For alerts:
        const alertCb = vi.fn();
        omni.alert('foo.once', alertCb, { once: true });
        omni.set('foo.once', 1);
        omni.set('foo.once', 2);
        expect(alertCb).toHaveBeenCalledTimes(1);
    });

    it('subscribes before and after value exists', () => {
        const cb = vi.fn();
        omni.subscribe('foo.bar', cb);
        omni.set('foo.bar', 1);
        expect(cb).toHaveBeenCalledWith('foo.bar', 1);

        const cb2 = vi.fn();
        omni.set('baz.qux', 2);
        omni.subscribe('baz.qux', cb2);
        omni.set('baz.qux', 3);
        expect(cb2).toHaveBeenCalledWith('baz.qux', 3);
    });

    it('notifies on batch updates', () => {
        const cb = vi.fn();
        omni.subscribe('user.name', cb);
        omni.batch(() => {
        omni.set('user.name', 'Alice');
        omni.set('user.age', 30);
        });
        expect(cb).toHaveBeenCalledWith('user.name', 'Alice');
    });

    it('notifies on batch object mode', () => {
        const cb = vi.fn();
        omni.subscribe('settings.theme', cb);
        omni.batch({ settings: { theme: 'dark', notifications: true } });
        expect(cb).toHaveBeenCalledWith('settings.theme', 'dark');
    });

    it('notifies on setObj', () => {
        const cb = vi.fn();
        omni.subscribe('root.x', cb);
        omni.setObj({ x: 1, y: 2 }, 'root');
        expect(cb).toHaveBeenCalledWith('root.x', 1);
    });

    it('notifies on undo/redo', () => {
        const cb = vi.fn();
        omni.subscribe('foo.bar', cb);
        omni.set('foo.bar', 1, { history: true });
        omni.set('foo.bar', 2, { history: true });
        omni.undo('foo.bar');
        expect(cb).toHaveBeenCalledWith('foo.bar', 1);
        omni.redo('foo.bar');
        expect(cb).toHaveBeenCalledWith('foo.bar', 2);
    });

    it('notifies with correct oldValue for global subscribers', () => {
        const globalCb = vi.fn();
        omni.subscribeGlobal(globalCb);
        omni.set('foo.bar', 1);
        omni.set('foo.bar', 2);
        expect(globalCb).toHaveBeenCalledWith('foo.bar', 2, 1);
    });
});