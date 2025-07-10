// @vitest-environment node

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { omni } from '../OmniTurbo';

describe('OmniTurbo History, Undo, and Redo', () => {
  beforeEach(() => omni.clear());

  it('tracks history for a path by default', () => {
    omni.set('foo', 1);
    omni.set('foo', 2);
    omni.set('foo', 3);
    expect(omni.getHistory('foo')).toEqual([1, 2]);
  });

  it('can undo and redo a single value', () => {
    omni.set('foo', 'a');
    omni.set('foo', 'b');
    expect(omni.get('foo')).toBe('b');
    expect(omni.canUndo('foo')).toBe(true);
    expect(omni.undo('foo')).toBe(true);
    expect(omni.get('foo')).toBe('a');
    expect(omni.canRedo('foo')).toBe(true);
    expect(omni.redo('foo')).toBe(true);
    expect(omni.get('foo')).toBe('b');
  });

  it('undo returns false if nothing to undo', () => {
    omni.set('foo', 1);
    expect(omni.undo('foo')).toBe(false);
  });

  it('redo returns false if nothing to redo', () => {
    omni.set('foo', 1);
    expect(omni.redo('foo')).toBe(false);
  });

  it('multiple undos and redos work as expected', () => {
    omni.set('foo', 1);
    omni.set('foo', 2);
    omni.set('foo', 3);
    omni.set('foo', 4);
    expect(omni.get('foo')).toBe(4);

    expect(omni.undo('foo')).toBe(true); // 3
    expect(omni.get('foo')).toBe(3);
    expect(omni.undo('foo')).toBe(true); // 2
    expect(omni.get('foo')).toBe(2);
    expect(omni.undo('foo')).toBe(true); // 1
    expect(omni.get('foo')).toBe(1);
    expect(omni.undo('foo')).toBe(false); // nothing left

    expect(omni.redo('foo')).toBe(true); // 2
    expect(omni.get('foo')).toBe(2);
    expect(omni.redo('foo')).toBe(true); // 3
    expect(omni.get('foo')).toBe(3);
    expect(omni.redo('foo')).toBe(true); // 4
    expect(omni.get('foo')).toBe(4);
    expect(omni.redo('foo')).toBe(false); // nothing left
  });

  it('history is truncated to historySize', () => {
    omni.set('foo', 0, { history: true });
    for (let i = 1; i <= 15; i++) {
      omni.set('foo', i, { history: true });
    }
    // Default historySize is 10, so only last 10 values should be kept
    expect(omni.getHistory('foo').length).toBeLessThanOrEqual(10);
  });

  it('can set custom history and historySize', () => {
    omni.set('foo', 1);
    omni.set('foo', 2);
    omni.setHistoryInternal('foo', [10, 20, 30], 2);
    expect(omni.getHistory('foo')).toEqual([10, 20]);
  });

  it('undo/redo does not work if history is disabled', () => {
    omni.set('foo', 1, { history: false });
    omni.set('foo', 2, { history: false });
    expect(omni.canUndo('foo')).toBe(false);
    expect(omni.undo('foo')).toBe(false);
    expect(omni.canRedo('foo')).toBe(false);
    expect(omni.redo('foo')).toBe(false);
  });

  it('undoAll and redoAll operate on all undoable/redoable paths', () => {
    omni.set('a', 1);
    omni.set('a', 2);
    omni.set('b', 'x');
    omni.set('b', 'y');
    omni.set('c', true);

    // Undo all
    const undoResult = omni.undoAll();
    expect(undoResult.successful).toContain('a');
    expect(undoResult.successful).toContain('b');
    expect(omni.get('a')).toBe(1);
    expect(omni.get('b')).toBe('x');

    // Redo all
    const redoResult = omni.redoAll();
    expect(redoResult.successful).toContain('a');
    expect(redoResult.successful).toContain('b');
    expect(omni.get('a')).toBe(2);
    expect(omni.get('b')).toBe('y');
  });


    it('setting a new value after undo purges redo history', () => {
    omni.set('foo', 1);
    omni.set('foo', 2);
    omni.set('foo', 3);
    omni.undo('foo'); // now at 2
    omni.set('foo', 99); // should purge redo (3)
    expect(omni.getHistory('foo')).toEqual([1, 2]);
    expect(omni.canRedo('foo')).toBe(false);
    expect(omni.get('foo')).toBe(99);
    });


  it('history is preserved after undo/redo', () => {
    omni.set('foo', 1);
    omni.set('foo', 2);
    omni.set('foo', 3);
    omni.undo('foo');
    omni.redo('foo');
    expect(omni.getHistory('foo')).toEqual([1, 2, 3]);
  });

  it('history is not tracked for deleted paths', () => {
    omni.set('foo', 1);
    omni.set('foo', 2);
    omni.delete('foo');
    expect(omni.getHistory('foo')).toEqual([]);
    expect(omni.canUndo('foo')).toBe(false);
    expect(omni.canRedo('foo')).toBe(false);
  });

  it('history is not tracked for non-existent paths', () => {
    expect(omni.getHistory('nope')).toEqual([]);
    expect(omni.canUndo('nope')).toBe(false);
    expect(omni.canRedo('nope')).toBe(false);
  });

  it('undo/redo does not affect other paths', () => {
    omni.set('foo', 1);
    omni.set('foo', 2);
    omni.set('bar', 'a');
    omni.set('bar', 'b');
    omni.undo('foo');
    expect(omni.get('foo')).toBe(1);
    expect(omni.get('bar')).toBe('b');
    omni.undo('bar');
    expect(omni.get('bar')).toBe('a');
    expect(omni.get('foo')).toBe(1);
  });

  it('undo/redo triggers notifications and alerts', () => {
    const cb = vi.fn();
    omni.set('foo', 1);
    omni.set('foo', 2);
    omni.alert('foo', cb);
    omni.undo('foo');
    expect(cb).toHaveBeenCalledWith(1, 2);
    omni.redo('foo');
    expect(cb).toHaveBeenCalledWith(2, 1);
  });
});