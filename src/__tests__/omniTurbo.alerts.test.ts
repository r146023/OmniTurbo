// @vitest-environment node
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { omni } from '../OmniTurbo';

describe('OmniTurbo Alerts', () => {
    beforeEach(() => omni.clear());

    it('calls alert callback on value change', () => {
        const cb = vi.fn();
        omni.alert('foo', cb);
        omni.set('foo', 1);
        expect(cb).toHaveBeenCalledWith(1, undefined);
        omni.set('foo', 2);
        expect(cb).toHaveBeenCalledWith(2, 1);
        expect(cb).toHaveBeenCalledTimes(2);
    });

    it('does not call alert if value is unchanged', () => {
        const cb = vi.fn();
        omni.set('foo', 1);
        omni.alert('foo', cb);
        omni.set('foo', 1);
        expect(cb).not.toHaveBeenCalled();
    });

    it('alert can be unsubscribed', () => {
        const cb = vi.fn();
        const unsub = omni.alert('foo', cb);
        omni.set('foo', 1);
        unsub();
        omni.set('foo', 2);
        expect(cb).toHaveBeenCalledTimes(1);
    });

    it('alert with once:true only fires once', () => {
        const cb = vi.fn();
        omni.alert('foo', cb, { once: true });
        omni.set('foo', 1);
        omni.set('foo', 2);
        expect(cb).toHaveBeenCalledTimes(1);
        expect(cb).toHaveBeenCalledWith(1, undefined);
    });

    it('alert with throttle only fires after interval', async () => {
        const cb = vi.fn();
        omni.alert('foo', cb, { throttle: 50 });
        omni.set('foo', 1);
        omni.set('foo', 2);
        omni.set('foo', 3);
        expect(cb).toHaveBeenCalledTimes(1);

        // Wait for throttle interval to pass
        await new Promise(res => setTimeout(res, 60));
        omni.set('foo', 4);
        expect(cb).toHaveBeenCalledTimes(2);
    });

    it('alert with condition only fires when condition is met', () => {
        const cb = vi.fn();
        omni.alert('foo', cb, { condition: (newVal:any, oldVal:any) => newVal > 10 });
        omni.set('foo', 5);
        omni.set('foo', 15);
        omni.set('foo', 8);
        omni.set('foo', 20);
        expect(cb).toHaveBeenCalledTimes(2);
        expect(cb).toHaveBeenCalledWith(15, 5); // <-- oldValue is 5, not undefined
        expect(cb).toHaveBeenCalledWith(20, 8);
    });

    it('alert receives correct oldValue', () => {
        const cb = vi.fn();
        omni.set('foo', 1);
        omni.alert('foo', cb);
        omni.set('foo', 2);
        omni.set('foo', 3);
        expect(cb).toHaveBeenCalledWith(2, 1);
        expect(cb).toHaveBeenCalledWith(3, 2);
    });

    it('multiple alerts on same path all fire', () => {
        const cb1 = vi.fn();
        const cb2 = vi.fn();
        omni.alert('foo', cb1);
        omni.alert('foo', cb2);
        omni.set('foo', 1);
        expect(cb1).toHaveBeenCalledWith(1, undefined);
        expect(cb2).toHaveBeenCalledWith(1, undefined);
    });

    it('alerts are independent per path', () => {
        const cb1 = vi.fn();
        const cb2 = vi.fn();
        omni.alert('foo', cb1);
        omni.alert('bar', cb2);
        omni.set('foo', 1);
        omni.set('bar', 2);
        expect(cb1).toHaveBeenCalledWith(1, undefined);
        expect(cb2).toHaveBeenCalledWith(2, undefined);
        expect(cb1).toHaveBeenCalledTimes(1);
        expect(cb2).toHaveBeenCalledTimes(1);
    });

    it('alert can be removed by unsubscribe function', () => {
        const cb = vi.fn();
        const unsub = omni.alert('foo', cb);
        omni.set('foo', 1);
        unsub();
        omni.set('foo', 2);
        expect(cb).toHaveBeenCalledTimes(1);
    });

    it('alert does not fire after clear()', () => {
        const cb = vi.fn();
        omni.alert('foo', cb);
        omni.set('foo', 1);
        omni.clear();
        omni.set('foo', 2);
        expect(cb).toHaveBeenCalledTimes(1);
    });

    it('alert works with batch updates', () => {
        const cb = vi.fn();
        omni.alert('foo', cb);
        omni.batch(() => {
            omni.set('foo', 1);
            omni.set('foo', 2);
        });
        expect(cb).toHaveBeenCalledTimes(2);
        expect(cb).toHaveBeenCalledWith(1, undefined);
        expect(cb).toHaveBeenCalledWith(2, 1);
    });

    it('alert works with batch object mode', () => {
        const cb = vi.fn();
        omni.alert('foo.bar', cb);
        omni.batch({ foo: { bar: 1, baz: 2 } });
        expect(cb).toHaveBeenCalledWith(1, undefined);
    });

    it('alert works with delete', () => {
        const cb = vi.fn();
        omni.set('foo', 1);
        omni.alert('foo', cb);
        omni.delete('foo');
        expect(cb).toHaveBeenCalledWith(undefined, 1);
    });


});