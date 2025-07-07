// @vitest-environment node
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { omni } from '../OmniTurbo';
import fs from 'fs';


function randomString(length: number,symbols=true): string {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:,.<>?/~`';
    if (symbols === false) {
        chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    }
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function saveOmniToFile(){
    
    const path = 'omni-store-dump.json';
    const storeData = omni.toObject();
    console.log("storeData:", storeData);
    fs.writeFileSync(path, JSON.stringify(storeData, null, 2), 'utf-8');
}


describe('OmniTurbo core', () => {
    beforeEach(() => omni.clear());

    it('sets and gets a value', () => {
        omni.set('foo.bar', 123);
        expect(omni.get('foo.bar')).toBe(123);
    });

    it('supports batch function operations', () => {
        omni.batch(() => {
            omni.set('a', 1);
            omni.set('b', 2);
        });
        expect(omni.get('a')).toBe(1);
        expect(omni.get('b')).toBe(2);
    });

    it('updates value with set', () => {
        omni.set('foo.bar', 'initial');
        expect(omni.get('foo.bar')).toBe('initial');
        omni.set('foo.bar', 'updated');
        expect(omni.get('foo.bar')).toBe('updated');
    });


    it('returns undefined for non-existent keys', () => {
        expect(omni.get('non.existent')).toBeUndefined();
    });


    it('notifies subscribers on value change', () => {
        const callback = vi.fn();
        omni.subscribe('foo.bar', callback);
        omni.set('foo.bar', 'test');
        expect(callback).toHaveBeenCalledWith('foo.bar', 'test');
    });


    it('notifies subscribers on nested value change', () => {
        const callback = vi.fn();
        omni.subscribe('foo.bar.baz', callback);
        omni.set('foo.bar.baz', 'nested value');
        expect(callback).toHaveBeenCalledWith('foo.bar.baz', 'nested value');
    });



    it('does not notify subscribers if value is unchanged', () => {
        const callback = vi.fn();
        omni.set('foo.bar', 'unchanged');
        omni.subscribe('foo.bar', callback);
        omni.set('foo.bar', 'unchanged'); // Same value
        expect(callback).not.toHaveBeenCalled();
    });




    it('clears all values', () => {
        omni.set('foo.bar', 123);
        omni.clear();
        expect(omni.get('foo.bar')).toBeUndefined();
    });

    it('handles simple dot paths', () => {
        omni.set('foo.bar', 'baz');
        expect(omni.get('foo.bar')).toBe('baz');
        omni.set('foo.bar', 'qux');
        expect(omni.get('foo.bar')).toBe('qux');
    });

    it('handles UUIDv4 in paths', () => {
        const path = "foo.bar.S9A0XPH1-QN2k-Mh9j-Gg6Y-QncjbNuk4J6p.name"
        omni.set(path, 'baz');
        expect(omni.get(path)).toBe('baz');
        omni.set(path, 'qux');
        expect(omni.get(path)).toBe('qux');
    });

    it('handles Symbols in paths', () => {
        const path = `foo.bar.${randomString(18)}.name`
        omni.set(path, 'baz');
        expect(omni.get(path)).toBe('baz');
        omni.set(path, 'qux');
        expect(omni.get(path)).toBe('qux');
    });

    it('handles nested dot paths', () => {
        omni.set('user.profile.name', 'Alice');
        expect(omni.get('user.profile.name')).toBe('Alice');
        omni.set('user.profile.name', 'Bob');
        expect(omni.get('user.profile.name')).toBe('Bob');
    });

    it('handles object values with set{asObject:true}', () => {
        const user = { name: 'Alice', age: 30 };
        omni.set('user', user,{asObject: true});
        expect(omni.get('user')).toEqual(user);
        user.age = 31; // Mutate the object
        omni.set('user', user,{asObject: true}); // Update the reference
        expect(omni.get('user').age).toBe(31);
    });

    it('handles object values with batch', () => {
        const path = "user"
        const user = { name: 'Alice', age: 30 };
        omni.batch(user,path);
        expect(omni.getObj(path)).toEqual(user);
        user.age = 31; // Mutate the object
        omni.batch(user,path); // Update the reference
        expect(omni.getObj(path).age).toBe(31);
    });

    it('handles array values with set{asObject:true}', () => {
        const arr = [1, 2, 3];
        omni.set('numbers', arr, { asObject: true });
        expect(omni.get('numbers')).toEqual(arr);
        arr.push(4); // Mutate the array
        omni.set('numbers', arr, { asObject: true }); // Update the reference
        expect(omni.get('numbers')).toEqual([1, 2, 3, 4]);
    });

    it('handles path existence correctly', () => {
        const path = "numbers"
        const value = randomString(10,false);
        expect(omni.exists(path)).toEqual(false);
        omni.set(path,value);
        expect(omni.get(path)).toEqual(value);
    });







    it('handles simple path deletion', () => {
        const path = "foo.bar";
        const value = randomString(10,false);
        omni.set(path, value);
        expect(omni.get(path)).toEqual(value);
        omni.delete(path);
        expect(omni.get(path)).toBeUndefined();
    });

    it('handles parent nested path deletion', () => {
        const path = "user.profile.name";
        const value = randomString(10,false);
        omni.set(path, value);
        expect(omni.get(path)).toEqual(value);
        omni.delete(path);
        // omni.delete('user.profile');

        if(omni.get(path) != undefined){
            console.log(`Error: Path ${path} should be undefined after deletion, but got:`, omni.get(path));
        }
        
        expect(omni.get(path)).toBeUndefined();
        saveOmniToFile();
    });




    // it('supports wildcard subscriptions', () => {
    //     const callback = vi.fn();
    //     omni.subscribe('user.*', callback);
    //     omni.set('user.profile.name', 'Alice');
    //     expect(callback).toHaveBeenCalledWith('user.profile.name', 'Alice');
    //     omni.set('user.settings.theme', 'dark');
    //     expect(callback).toHaveBeenCalledWith('user.settings.theme', 'dark');
    // });

    // it('clears subscriptions on clear', () => {
    //     const callback = vi.fn();
    //     omni.subscribe('foo.bar', callback);
    //     omni.set('foo.bar', 'test');
    //     expect(callback).toHaveBeenCalledWith('foo.bar', 'test');
    //     omni.clear();
    //     omni.set('foo.bar', 'new value');
    //     expect(callback).not.toHaveBeenCalled();
    // });





});