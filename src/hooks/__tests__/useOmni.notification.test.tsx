import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { omni } from '../../OmniTurbo';
import { useOmni } from '../useOmni';
import { describe, beforeEach, it, expect } from 'vitest';

function TestComponent({ path }: { path: string }) {
  const value = useOmni(path);
  return <div data-testid="value">{String(value)}</div>;
}

describe('useOmni notification system', () => {
  beforeEach(() => omni.clear());

  it('rerenders component when simple value changes', () => {
    omni.set('foo.bar', 'initial');
    console.log("key: foo.bar, value: initial");

    render(<TestComponent path="foo.bar" />);
    expect(screen.getByTestId('value').textContent).toBe('initial');

    act(() => {
      omni.set('foo.bar', 'updated');
      console.log("key: foo.bar, value: updated");
    });

    expect(screen.getByTestId('value').textContent).toBe('updated');
  });




  it('does not rerender if value is unchanged', () => {
    omni.set('foo.bar', 'same');
    let renderCount = 0;

    function RenderCounter() {
      renderCount++;
      const value = useOmni('foo.bar');
      return <div data-testid="value">{String(value)}</div>;
    }

    render(<RenderCounter />);
    expect(screen.getByTestId('value').textContent).toBe('same');
    expect(renderCount).toBe(1);

    act(() => {
      omni.set('foo.bar', 'same');
    });

    // Should not rerender since value didn't change
    expect(renderCount).toBe(1);
  });





  it('rerenders when nested object value changes', () => {
    omni.set('user.profile.name', 'Alice');
    console.log("key: user.profile.name, value: Alice");
    render(<TestComponent path="user.profile.name" />);
    expect(screen.getByTestId('value').textContent).toBe('Alice');
    act(() => {
      omni.set('user.profile.name', 'Bob');
      console.log("key: user.profile.name, value: Bob");
    });
    expect(screen.getByTestId('value').textContent).toBe('Bob');
  });



  it('rerenders when an object is the value and the component subscribes to the parent key', () => {
    var profile = {
        name: 'Alice',
        age: 24
    };
    omni.batch(profile,'user.profile');
    console.log("key: user.profile, value: ", profile);

    render(<TestComponent path="user.profile.name" />);

    expect(screen.getByTestId('value').textContent).toBe('Alice');
    act(() => {
      omni.set('user.profile.name', 'Bob');
      console.log("key: user.profile.name, value: Bob");
    });
    expect(screen.getByTestId('value').textContent).toBe('Bob');
  });

  it('does not rerender when unrelated key changes', () => {
    omni.set('foo.bar', 'initial');
    render(<TestComponent path="foo.bar" />);
    expect(screen.getByTestId('value').textContent).toBe('initial');

    act(() => {
      omni.set('baz.qux', 'changed');
      console.log("key: baz.qux, value: changed");
    });

    // Should still be 'initial' since foo.bar didn't change
    expect(screen.getByTestId('value').textContent).toBe('initial');
  });


  it('rerenders when a deeply nested value changes', () => {
    omni.set('settings.notifications.email', true);
    console.log("key: settings.notifications.email, value: true");
    render(<TestComponent path="settings.notifications.email" />);
    expect(screen.getByTestId('value').textContent).toBe('true');

    act(() => {
      omni.set('settings.notifications.email', false);
      console.log("key: settings.notifications.email, value: false");
    });

    expect(screen.getByTestId('value').textContent).toBe('false');
  });


  it('handles multiple components subscribing to the same key', () => {
    omni.set('shared.value', 'initial');
    console.log("key: shared.value, value: initial");

    const { rerender } = render(<TestComponent path="shared.value" />);
    expect(screen.getByTestId('value').textContent).toBe('initial');

    act(() => {
      omni.set('shared.value', 'updated');
      console.log("key: shared.value, value: updated");
    });

    rerender(<TestComponent path="shared.value" />);
    expect(screen.getByTestId('value').textContent).toBe('updated');
  });


  it('does not rerender when the value is the same after a set', () => {
    omni.set('foo.bar', 'same');
    console.log("key: foo.bar, value: same");

    const { rerender } = render(<TestComponent path="foo.bar" />);
    expect(screen.getByTestId('value').textContent).toBe('same');

    act(() => {
      omni.set('foo.bar', 'same');
      console.log("key: foo.bar, value: same");
    });

    // Should not rerender since value didn't change
    rerender(<TestComponent path="foo.bar" />);
    expect(screen.getByTestId('value').textContent).toBe('same');
  });



  it('handles batch updates correctly', () => {
    omni.set('batch.value', 'initial');
    console.log("key: batch.value, value: initial");

    const { rerender } = render(<TestComponent path="batch.value" />);
    expect(screen.getByTestId('value').textContent).toBe('initial');

    act(() => {
      omni.batch(() => {
        omni.set('batch.value', 'updated1');
        omni.set('batch.value2', 'updated2');
      });
      console.log("key: batch.value, value: updated1");
      console.log("key: batch.value2, value: updated2");
    });

    rerender(<TestComponent path="batch.value" />);
    expect(screen.getByTestId('value').textContent).toBe('updated1');
  });


  it('handles complex nested updates', () => {
    omni.batch({ a: 1, b: { c: 2 } },'complex.data');
    console.log("key: complex.data, value: { a: 1, b: { c: 2 } }");

    const { rerender } = render(<TestComponent path="complex.data.b.c" />);
    expect(screen.getByTestId('value').textContent).toBe('2');

    act(() => {
      omni.set('complex.data.b.c', 3);
      console.log("key: complex.data.b.c, value: 3");
    });

    rerender(<TestComponent path="complex.data.b.c" />);
    expect(screen.getByTestId('value').textContent).toBe('3');
  });


  it('handles updates to arrays', () => {
    omni.set('array.data', [1, 2, 3]);
    console.log("key: array.data, value: [1, 2, 3]");

    const { rerender } = render(<TestComponent path="array.data" />);
    expect(screen.getByTestId('value').textContent).toBe('1,2,3');

    act(() => {
      omni.set('array.data', [4, 5, 6]);
      console.log("key: array.data, value: [4, 5, 6]");
    });

    rerender(<TestComponent path="array.data" />);
    expect(screen.getByTestId('value').textContent).toBe('4,5,6');
  });


  it('handles updates to arrays with objects', () => {
    omni.set('array.objects', [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]);
    console.log("key: array.objects, value: [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]");

    const { rerender } = render(<TestComponent path="array.objects" />);
    expect(screen.getByTestId('value').textContent).toBe('[object Object],[object Object]');

    act(() => {
      omni.set('array.objects', [{ id: 1, name: 'Charlie' }, { id: 2, name: 'Dave' }]);
      console.log("key: array.objects, value: [{ id: 1, name: 'Charlie' }, { id: 2, name: 'Dave' }]");
    });

    rerender(<TestComponent path="array.objects" />);
    expect(screen.getByTestId('value').textContent).toBe('[object Object],[object Object]');
  });

  


  // it('handles updates to arrays with nested objects', () => {
  //   omni.set('nested.array', [{ id: 1, details: { name: 'Alice' } }, { id: 2, details: { name: 'Bob' } }]);
  //   console.log("key: nested.array, value: [{ id: 1, details: { name: 'Alice' } }, { id: 2, details: { name: 'Bob' } }]");

  //   const { rerender } = render(<TestComponent path="nested.array.0.details.name" />);
  //   expect(screen.getByTestId('value').textContent).toBe('Alice');

  //   act(() => {
  //     omni.set('nested.array.0.details.name', 'Charlie');
  //     console.log("key: nested.array.0.details.name, value: Charlie");
  //   });

  //   rerender(<TestComponent path="nested.array.0.details.name" />);
  //   expect(screen.getByTestId('value').textContent).toBe('Charlie');
  // });










});