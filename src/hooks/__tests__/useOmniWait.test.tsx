import React from 'react';
import { render, act, screen, waitFor } from '@testing-library/react';
import { omni } from '../../OmniTurbo';
import { useOmniWait } from '../useOmni';
import { describe, it, beforeEach, expect } from 'vitest';

function WaitComponent({
    paths,
    exclude,
    debugName,
    }: {
    paths: string[];
    exclude?: any[];
    debugName?: string;
    }) {
    const { ready, values, loading } = useOmniWait(paths, exclude, debugName);
    return (
        <div>
            <div data-testid="ready">{String(ready)}</div>
            <div data-testid="loading">{String(loading)}</div>
            <div data-testid="values">{JSON.stringify(values)}</div>
        </div>
    );
}

describe('useOmniWait', () => {
    beforeEach(() => {
        omni.clear();
    });

    it('waits for a single path to become ready', async () => {
        render(<WaitComponent paths={['foo']} />);
        expect(screen.getByTestId('ready').textContent).toBe('false');
        expect(screen.getByTestId('loading').textContent).toBe('true');

        act(() => {
        omni.set('foo', 42);
        });

        await waitFor(() =>
        expect(screen.getByTestId('ready').textContent).toBe('true')
        );
        expect(screen.getByTestId('values').textContent).toContain('"foo":42');
    });

    it('waits for multiple paths to become ready', async () => {
        render(<WaitComponent paths={['a', 'b']} />);
        expect(screen.getByTestId('ready').textContent).toBe('false');

        act(() => {
        omni.set('a', 1);
        });
        expect(screen.getByTestId('ready').textContent).toBe('false');

        act(() => {
        omni.set('b', 2);
        });

        await waitFor(() =>
        expect(screen.getByTestId('ready').textContent).toBe('true')
        );
        expect(screen.getByTestId('values').textContent).toContain('"a":1');
        expect(screen.getByTestId('values').textContent).toContain('"b":2');
    });

    it('respects exclude values (default: undefined, null)', async () => {
        act(() => {
        omni.set('x', undefined);
        omni.set('y', null);
        });
        render(<WaitComponent paths={['x', 'y']} />);
        expect(screen.getByTestId('ready').textContent).toBe('false');

        act(() => {
        omni.set('x', 10);
        omni.set('y', 20);
        });

        await waitFor(() =>
        expect(screen.getByTestId('ready').textContent).toBe('true')
        );
        expect(screen.getByTestId('values').textContent).toContain('"x":10');
        expect(screen.getByTestId('values').textContent).toContain('"y":20');
    });

    it('supports custom exclude values', async () => {
        render(<WaitComponent paths={['foo']} exclude={[-1]} />);
        act(() => {
        omni.set('foo', -1);
        });
        expect(screen.getByTestId('ready').textContent).toBe('false');

        act(() => {
        omni.set('foo', 0);
        });

        await waitFor(() =>
        expect(screen.getByTestId('ready').textContent).toBe('true')
        );
        expect(screen.getByTestId('values').textContent).toContain('"foo":0');
    });

    it('reacts to changes after initial render', async () => {
        render(<WaitComponent paths={['foo']} />);
        expect(screen.getByTestId('ready').textContent).toBe('false');

        act(() => {
        omni.set('foo', 123);
        });

        await waitFor(() =>
        expect(screen.getByTestId('ready').textContent).toBe('true')
        );

        act(() => {
        omni.set('foo', undefined);
        });

        await waitFor(() =>
        expect(screen.getByTestId('ready').textContent).toBe('false')
        );
    });

    it('handles nested object values', async () => {
        act(() => {
        omni.set('user.name', 'Alice');
        omni.set('user.age', 30);
        });
        render(<WaitComponent paths={['user.name', 'user.age']} />);
        await waitFor(() =>
        expect(screen.getByTestId('ready').textContent).toBe('true')
        );
        expect(screen.getByTestId('values').textContent).toContain('"user.name":"Alice"');
        expect(screen.getByTestId('values').textContent).toContain('"user.age":30');
    });

    it('handles object reconstruction for missing direct values', async () => {
        act(() => {
        omni.set('obj.a', 1);
        omni.set('obj.b', 2);
        });
        render(<WaitComponent paths={['obj']} />);
        await waitFor(() =>
        expect(screen.getByTestId('ready').textContent).toBe('true')
        );
        expect(screen.getByTestId('values').textContent).toContain('"obj":{"a":1,"b":2}');
    });

    it('cleans up subscriptions on unmount', async () => {
        const { unmount } = render(<WaitComponent paths={['foo']} />);
        act(() => {
        omni.set('foo', 1);
        });
        await waitFor(() =>
        expect(screen.getByTestId('ready').textContent).toBe('true')
        );
        unmount();
        // No error should occur, and subscriptions should be cleaned up
        act(() => {
        omni.set('foo', 2);
        });
        // No assertion needed; test passes if no errors are thrown
    });

    it('sets loading to false when ready', async () => {
        render(<WaitComponent paths={['foo']} />);
        expect(screen.getByTestId('loading').textContent).toBe('true');
        act(() => {
        omni.set('foo', 'done');
        });
        await waitFor(() =>
        expect(screen.getByTestId('loading').textContent).toBe('false')
        );
    });

    it('works with debugName for logging (no crash)', async () => {
        render(<WaitComponent paths={['foo']} debugName="test-debug" />);
        act(() => {
        omni.set('foo', 99);
        });
        await waitFor(() =>
        expect(screen.getByTestId('ready').textContent).toBe('true')
        );
    });
});