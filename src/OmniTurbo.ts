/**
 * 🚀 OMNI TURBO - PERFORMANCE ANNIHILATION EDITION
 *
 * @author Colemen Atwood
 */



// import { performance } from 'perf_hooks';


// ==========================================
// 🔥 ULTRA-OPTIMIZED DATA STRUCTURES
// ==========================================

interface TurboValueObject {
  value: any;
  prev?: any;
  subs?: Map<string, TurboSubscriber>; // Hash map instead of array
  history?: any[];
  historySize?: number;
  historyIndex?: number;
  created: number;
  updated?: number;
  // Optimization flags
  isPrimitive: boolean;
  needsClone: boolean;
  frozen?: boolean; // Immutable optimization
  changeLog?: ChangeLogEntry[];
}

interface ChangeLogEntry {
  timestamp: number;
  oldValue: any;
  newValue: any;
  action: 'created' | 'updated' | 'deleted' | 'undo' | 'redo';
  index?: number; // For ordering events at same timestamp
}

interface TimelineEntry {
  timestamp: number;
  path: string;
  oldValue: any;
  newValue: any;
  action: 'created' | 'updated' | 'deleted' | 'undo' | 'redo';
  index: number;
}

interface TurboSubscriber {
  id: string;
  fn: Function;
  type: number; // 0=PRE, 1=POST (faster than string comparison)
  once?: boolean;
}

interface AlertConfigTurbo {
  id: string;
  key: string;
  fn: Function;
  condition?: Function;
  throttle: number;
  lastTrigger: number;
  once: boolean;
}

interface BatchOperation {
  path: string;
  value: any;
  options?: any;
}

export interface SetOptions {
  /**
   * If true, the value will be set immediately without waiting for the next tick.
   * This is useful for synchronous updates but can lead to performance issues if overused.
   * @default false
   */
  immediate?: boolean;
  /**
   * If true, the value will have a tracked history of values.
   * This is useful for undo/redo functionality.
   * @default true
   */
  history?: boolean;
  /**
   * If true, the value will be cloned before being set.
   * This is useful for ensuring immutability and preventing unintended side effects.
   * @default 'none'
   * - 'none': No cloning, set the value as-is.
   * - 'shallow': Perform a shallow clone of the value.
   * - 'deep': Perform a deep clone of the value.
   */
  clone?: 'none' | 'shallow' | 'deep';

  suppressNotifications?: boolean;
  /**
   * If true, the value will not be added to the timeline.
   * This is useful for performance optimization when you don't need to track changes.
   * @default false
   */
  suppressTimeline?: boolean;
  /**
   * If true, the value must be an object.
   * Then the set method will parse the object into the store so its children will be accessible
   * using dot notation.
   * If false, the value will be set as-is "atomically" without parsing.
   * Atomic object's children are not accessible using dot notation. you can only retrieve the object as a whole.
   * @default null|false
   */
  asObject?: boolean;
}







// ==========================================
// 🚀 HYPER-OPTIMIZED UTILITIES
// ==========================================

// Ultra-fast type checking
const isPrimitive = (val: any): boolean => {
  const type = typeof val;
  return val === null || type !== 'object';
};

// Optimized shallow clone (no deep clone by default)
const fastClone = (obj: any, mode: 'none' | 'shallow' | 'deep' = 'none'): any => {
  if (mode === 'none' || isPrimitive(obj)) return obj;

  if (mode === 'shallow') {
    if (Array.isArray(obj)) return [...obj];
    if (obj instanceof Date) return new Date(obj);
    return { ...obj };
  }

  // Deep clone (expensive - only when explicitly requested)
  if (mode === 'deep') {
    if (Array.isArray(obj)) return obj.map(item => fastClone(item, 'deep'));
    if (obj instanceof Date) return new Date(obj);

    const copy: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        copy[key] = fastClone(obj[key], 'deep');
      }
    }
    return copy;
  }

  return obj;
};

// Lightning-fast equality check
const fastEquals = (a: any, b: any): boolean => {
  if (a === b) return true;
  if (a === null || b === null) return false;
  if (typeof a !== typeof b) return false;

  if (isPrimitive(a)) return false;

  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!fastEquals(a[i], b[i])) return false;
    }
    return true;
  }

  if (typeof a === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
      if (!b.hasOwnProperty(key) || !fastEquals(a[key], b[key])) return false;
    }
    return true;
  }

  return false;
};

// Ultra-fast ID generation
let idCounter = 0;
const generateFastId = (): string => `${Date.now().toString(36)}${(++idCounter).toString(36)}`;

// Path utilities
const getPathParts = (path: string): string[] => path.split('.');

/**
 * Simple version that excludes arrays (treats them as single values)
 *
 * @param obj - The object to flatten
 * @param prefix - Internal prefix for recursion
 * @returns Flattened object excluding array expansion
 *
 * @example
 * ```typescript
 * const nested = {
 *   user: { name: "John" },
 *   items: [1, 2, 3]
 * };
 *
 * flattenObjectSimple(nested);
 * // {
 * //   "user.name": "John",
 * //   "items": [1, 2, 3]  // Array kept as single value
 * // }
 * ```
 */
export function flattenObjectSimple(obj: any, prefix: string = ''): Record<string, any> {
    const result: Record<string, any> = {};

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            const newKey = prefix ? `${prefix}.${key}` : key;

            if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
                // Only flatten plain objects, not arrays
                Object.assign(result, flattenObjectSimple(value, newKey));
            } else {
                // Store everything else as-is (including arrays)
                result[newKey] = value;
            }
        }
    }

    return result;
}

// ==========================================
// 🔥 THE TURBO OMNI CLASS
// ==========================================

class OmniTurbo {
  private store = new Map<string, TurboValueObject>(); // Direct path keys, no hashing
  private fastStore = new Map<string, any>(); // ✅ SEPARATE ultra-fast store
  private waiters: Array<{keys: string[], exclude: any[], resolve: Function}> = [];
  private alerts = new Map<string, AlertConfigTurbo[]>();
  private batchMode = false;
  private batchQueue: BatchOperation[] = [];
  private parentCache = new Map<string, string[]>(); // ✅ Cache parent paths
  private parentNotifications = true;
  private globalSubscribers = new Map<string, Function>();


  private globalTimeline: TimelineEntry[] = [];
  private timelineEnabled = true;
  private timelineMaxSize = 1000; // Limit timeline size
  private changeCounter = 0; // For ordering events at same timestamp


  public plugins: Record<string, any> = {}; // Plugin registry
  public verbose: boolean = false;



  // Performance monitoring
  private opCount = 0;
  private benchmarkMode = false;

  // Performance modes
  private quickMode = false; // Fair comparison mode

  constructor() {}

  private _log(message: string, ...args: any[]): void {
    if (this.benchmarkMode || this.verbose) {
      console.log(`[OMNI-TURBO] ${message}`, ...args);
    }
  }

  public registerPlugin(name: string, plugin: any): void {
    if (this.plugins[name]) {
      console.warn(`Plugin ${name} is already registered. Overwriting.`);
    }
    this.plugins[name] = plugin;
  }


  /**
   * 🚀 CACHED PARENT PATH CALCULATION
   */
  private _getParentPaths = (path: string): string[] => {
    // ✅ Check cache first
    let parents = this.parentCache.get(path);
    if (parents) return parents;

    // ✅ Calculate once, cache forever
    if (!path.includes('.')) {
      parents = [];
    } else {
      const parts = path.split('.');
      parents = [];
      for (let i = parts.length - 1; i > 0; i--) {
        parents.push(parts.slice(0, i).join('.'));
      }
    }

    this.parentCache.set(path, parents);
    return parents;
  };


  /**
   * 🎯 FEATURE CONTROL - PERFORMANCE VS FEATURES
   */
  setParentNotifications = (enabled: boolean): void => {
    this.parentNotifications = enabled;
  };


//   #####  ####### ######  #######    #     # ####### ####### #     # ####### ######   #####
//  #     # #     # #     # #          ##   ## #          #    #     # #     # #     # #     #
//  #       #     # #     # #          # # # # #          #    #     # #     # #     # #
//  #       #     # ######  #####      #  #  # #####      #    ####### #     # #     #  #####
//  #       #     # #   #   #          #     # #          #    #     # #     # #     #       #
//  #     # #     # #    #  #          #     # #          #    #     # #     # #     # #     #
//   #####  ####### #     # #######    #     # #######    #    #     # ####### ######   #####

  /**
   * Sets a value at the specified path in the store with optimized performance modes.
   *
   * If the `asObject` option is provided and true, the value must be a plain object.
   * In this case, all properties of the object will be flattened into dot-notation paths
   * under the given path, just like `setObj` or `batch(object, path)`.
   * If `asObject` is not set or false, the value is set atomically at the given path.
   *
   * @param path - The dot-notation path where the value should be stored
   * @param value - The value to set at the specified path
   * @param options - Configuration options for the set operation
   * @param options.immediate - When true, bypasses batch mode and executes immediately
   * @param options.history - When true, enables history tracking for this value
   * @param options.clone - Controls cloning of the value ('none', 'shallow', 'deep')
   * @param options.suppressNotifications - When true, suppresses notifications for this set
   * @param options.suppressTimeline - When true, suppresses timeline logging for this set
   * @param options.asObject - When true, value must be a plain object and will be flattened into dot-notation paths under the given path
   *
   * @returns `true` if the value was set or queued successfully, `false` if the value was unchanged in quick mode
   *
   * @remarks
   * This method operates in different modes for optimal performance:
   * - **Quick Mode**: Uses direct Map operations with zero-overhead notifications
   * - **Batch Mode**: Queues operations for bulk processing unless `immediate` option is set
   * - **Regular Mode**: Falls back to internal set method with full feature support
   * - **Object Mode**: If `asObject` is true, flattens the object and sets all properties as dot-notation paths
   *
   * In quick mode, the method performs early exit optimization when the new value
   * equals the existing value. Benchmark tracking is automatically enabled when
   * `benchmarkMode` is active.
   *
   * @example
   * // Set a value in quick mode
   * store.set('user.name', 'John Doe');
   *
   * // Set with immediate execution (bypasses batch mode)
   * store.set('user.email', 'john@example.com', { immediate: true });
   *
   * // Set an object and flatten its properties under 'user'
   * store.set('user', { name: 'Alice', age: 30 }, { asObject: true });
   * // Equivalent to:
   * // user.name = 'Alice'
   * // user.age = 30
   */
  set = (path: string, value: any, options: SetOptions = {}): boolean => {
    // If asObject is true, delegate to setObj
    if (options.asObject) {
      if (!value || typeof value !== 'object' || Array.isArray(value)) {
        throw new Error('set with asObject:true expects a plain object');
      }
      if (Object.keys(value).length === 0) {
        // Explicitly store empty object
        return this._setInternal(path, {}, options);
      }
      this.setObj(value, path);
      return true;
    }

    // NEW: If overwriting with atomic, delete all children first
    if (isPrimitive(value) || Array.isArray(value)) {
      // Delete all child paths before setting atomic value
      const prefixWithDot = path + '.';
      const childKeys = Array.from(this.store.keys()).filter(k => k.startsWith(prefixWithDot));
      for (const childKey of childKeys) {
        this.store.delete(childKey);
        this.fastStore.delete(childKey);
      }
    }

    // ...existing code...
    if (this.quickMode && !this.batchMode) {
      if (this.benchmarkMode) this.opCount++; // ✅ Track benchmarks

      const oldValue = this.fastStore.get(path);
      if (oldValue === value) return false;

      this.fastStore.set(path, value);

      // ✅ NUCLEAR notification - no parent overhead
      const valueObj = this.store.get(path);
      if (valueObj?.subs?.size) {
        for (const sub of valueObj.subs.values()) {
          sub.fn(path, value); // ✅ Direct call, zero overhead
        }
      }

      return true;
    }

    // ...rest of set method...
    if (this.benchmarkMode) this.opCount++;

    if (this.batchMode && !options.immediate) {
      this.batchQueue.push({ path, value, options });
      return true;
    }

    return this._setInternal(path, value, options);
  };


  /**
   * 🚀 ADAPTIVE NOTIFICATION SYSTEM
   */
  private _adaptiveNotify = (path: string, value: any, oldValue?: any): void => {
    const entry = this.store.get(path);
    if (entry?.subs?.size) {
      for (const sub of entry.subs.values()) {
        sub.fn(path, value);
      }
    }

    // 🌍 NOTIFY GLOBAL SUBSCRIBERS
    this._notifyGlobalSubscribers(path, value, oldValue);


    // ✅ Parent notifications only when feature is enabled
    if (this.parentNotifications && !this.quickMode) {
      const parents = this._getParentPaths(path);
      for (const parentPath of parents) {
        const parentEntry = this.store.get(parentPath);
        if (parentEntry?.subs?.size) {
          // FIX: Use getObj to reconstruct the parent value
          const parentValue = this.getObj(parentPath) ?? parentEntry.value;
          for (const sub of parentEntry.subs.values()) {
            sub.fn(parentPath, parentValue);
          }
        }
      }
    }
  };

  /**
   * ☢️ NUCLEAR NOTIFICATION - ZERO OVERHEAD MODE
   */
  private _nuclearNotify = (path: string, value: any, oldValue?: any): void => {
    // ✅ Quick mode: ONLY direct notifications (like Redux/Zustand)
    if (this.quickMode) {
      const entry = this.store.get(path);
      if (entry?.subs?.size) {
        for (const sub of entry.subs.values()) {
          sub.fn(path, value);
        }
      }

      // 🌍 NOTIFY GLOBAL SUBSCRIBERS even in quick mode
      this._notifyGlobalSubscribers(path, value, oldValue);
      return; // ✅ NO parent notifications in Quick mode
    }

    // ✅ Full mode: Use optimized parent notifications
    this._turboNotify(path, value);
  };

  /**
   * ⚡ TURBO NOTIFICATION - MINIMAL OVERHEAD
   */
  private _turboNotify = (path: string, value: any, oldValue?: any, skipParents = false): void => {
    // ✅ Direct notification - no extra lookups
    const entry = this.store.get(path);
    if (entry?.subs?.size) {
      for (const sub of entry.subs.values()) {
        sub.fn(path, value);
      }
    }

    // 🌍 NOTIFY GLOBAL SUBSCRIBERS (only once, not for parents)
    if (!skipParents) {
      this._notifyGlobalSubscribers(path, value, oldValue);
    }


    // ✅ Parent notifications only when needed
    if (!skipParents && this.parentNotifications) {
      const parents = this._getParentPaths(path);
      for (const parentPath of parents) {
        const parentEntry = this.store.get(parentPath);
        if (parentEntry?.subs?.size) {
          // FIX: Use getObj to reconstruct the parent value
          const parentValue = this.getObj(parentPath) ?? parentEntry.value;
          for (const sub of parentEntry.subs.values()) {
            sub.fn(parentPath, parentValue);
          }
        }
      }
    }
  };


  get = (path: string, options: { 
    clone?: 'none' | 'shallow' | 'deep';
    asObject?: boolean;
  } = {}): any => {
    // ✅ NUCLEAR: Direct Map lookup for Quick mode
    if (this.quickMode) {
      if (this.benchmarkMode) this.opCount++;
      
      // Check if exact path exists FIRST
      if (this.fastStore.has(path)) {
        return this.fastStore.get(path);
      }
      
      // ✨ ONLY check for object mode if explicitly requested
      if (options.asObject) {
        // console.log("OmniTurbo.get() - Object mode requested, building object from fast store");
        return this._buildObjectFromFastStore(path, options);
      }
      
      return undefined;
    }

    // ✅ Benchmark tracking for regular mode
    if (this.benchmarkMode) this.opCount++;

    const valueObj = this.store.get(path);
    
    // ✅ CRITICAL: Return exact path value if it exists
    if (valueObj && valueObj.value !== undefined) {
      const value = valueObj.value;
      
      if (value === null || value === undefined || typeof value !== 'object') {
        return value;
      }

      const cloneMode = options.clone || 'none';
      if (cloneMode === 'none') return value;
      if (cloneMode === 'shallow') return Array.isArray(value) ? [...value] : { ...value };
      if (cloneMode === 'deep') return JSON.parse(JSON.stringify(value));

      return value;
    }

    // ✨ ONLY check for object mode if explicitly requested
    if (options.asObject) {
      return this._buildObjectFromStore(path, options);
    }

    return undefined;
  };

  /**
   * TURBO SUBSCRIBE - Hash map lookups instead of arrays
   * ✅ FIXED: Lightweight subscription storage
   */
  subscribe = (path: string, callback: Function, type: 'PRE' | 'POST' = 'POST'): (() => void) => {
    const id = generateFastId();

    let valueObj = this.store.get(path);
    if (!valueObj) {
      valueObj = {
        value: undefined,
        isPrimitive: true,
        needsClone: false,
        created: Date.now(),
        subs: new Map()
      };
      this.store.set(path, valueObj);
    }

    if (!valueObj.subs) {
      valueObj.subs = new Map();
    }

    valueObj.subs.set(id, {
      id,
      fn: callback,
      type: type === 'PRE' ? 0 : 1
    });

    return () => {
      valueObj?.subs?.delete(id);
    };
  };

  // ==========================================
  // 🔥 BATCH OPERATIONS - ANNIHILATION EDITION
  // ==========================================

  /**
   * 🔥 ANNIHILATION MODE BATCH - MASSIVE SPEEDUP
   */


  // /**
  //  * Executes multiple operations in batch mode to optimize performance and reduce notifications.
  //  *
  //  * During batch execution, all operations are queued and processed together at the end,
  //  * minimizing redundant notifications and improving efficiency for bulk updates.
  //  *
  //  * @param operations - A function containing the operations to be batched
  //  *
  //  * @remarks
  //  * - Temporarily enables batch mode during execution
  //  * - In quick mode: Updates are applied directly to the fast store with nuclear notifications
  //  * - In regular mode: Updates go through internal validation with adaptive notifications
  //  * - Only sends notifications for paths that actually changed
  //  * - Automatically restores previous batch mode state after execution
  //  * - Processes any pending waiters after batch completion
  //  *
  //  * @example
  //  * ```typescript
  //  * omniTurbo.batch(() => {
  //  *   omniTurbo.set('user.name', 'John');
  //  *   omniTurbo.set('user.age', 30);
  //  *   omniTurbo.set('user.email', 'john@example.com');
  //  * });
  //  * // All three updates are processed together with minimal notifications
  //  * ```
  //  */
  // batch = (operations: () => void): void => {
  //   const wasBatchMode = this.batchMode;
  //   this.batchMode = true;
  //   this.batchQueue = [];

  //   operations();

  //   if (this.quickMode) {
  //     // ✅ NUCLEAR: Direct updates to Quick store
  //     const affectedPaths = new Set<string>();

  //     for (const { path, value } of this.batchQueue) {
  //       const oldValue = this.fastStore.get(path);
  //       if (oldValue !== value) {
  //         this.fastStore.set(path, value);
  //         affectedPaths.add(path);
  //       }
  //     }

  //     // ✅ FIXED: Use nuclear notification with correct values
  //     for (const path of affectedPaths) {
  //       this._nuclearNotify(path, this.fastStore.get(path));
  //     }
  //   } else {
  //     // Regular batch processing
  //     const affectedPaths = new Set<string>();

  //     for (const { path, value, options } of this.batchQueue) {
  //       if (this._setInternal(path, value, { ...options, suppressNotifications: true })) {
  //         affectedPaths.add(path);
  //       }
  //     }

  //     // ✅ FIXED: Use cached values, not this.get()
  //     for (const path of affectedPaths) {
  //       const valueObj = this.store.get(path);
  //       if (valueObj) {
  //         this._adaptiveNotify(path, valueObj.value); // ← Use cached value!
  //       }
  //     }
  //   }

  //   this.batchMode = wasBatchMode;
  //   this.batchQueue = [];
  //   this._checkWaiters();
  // };


  /**
   * Executes multiple operations in batch mode or flattens and sets an object.
   *
   * When passed a function, executes multiple operations in batch mode to optimize performance
   * and reduce notifications. When passed an object, flattens it using dot notation and sets
   * each path-value pair in a single batch operation.
   *
   * @param operationsOrObject - Either a function containing operations to batch, or an object to flatten and set
   * @param pathPrefix - Optional prefix for object flattening (only used when first param is an object)
   *
   * @remarks
   * **Function Mode:**
   * - Temporarily enables batch mode during execution
   * - Queues all operations and processes them together
   * - Minimizes notifications for bulk updates
   *
   * **Object Mode:**
   * - Flattens the object using `flattenObjectSimple`
   * - Sets each flattened path-value pair in a single batch
   * - Automatically handles nested objects and preserves arrays
   *
   * @example
   * ```typescript
   * // Function mode (original behavior)
   * omniTurbo.batch(() => {
   *   omniTurbo.set('user.name', 'John');
   *   omniTurbo.set('user.age', 30);
   *   omniTurbo.set('user.email', 'john@example.com');
   * });
   *
   * // Object mode (new functionality)
   * omniTurbo.batch({
   *   user: {
   *     name: 'John',
   *     age: 30,
   *     address: {
   *       street: '123 Main St',
   *       city: 'New York'
   *     },
   *     hobbies: ['reading', 'coding']
   *   },
   *   settings: {
   *     theme: 'dark',
   *     notifications: true
   *   }
   * });
   * // Equivalent to:
   * // user.name = 'John'
   * // user.age = 30
   * // user.address.street = '123 Main St'
   * // user.address.city = 'New York'
   * // user.hobbies = ['reading', 'coding']  // Arrays preserved
   * // settings.theme = 'dark'
   * // settings.notifications = true
   *
   * // Object mode with path prefix
   * omniTurbo.batch({
   *   name: 'John',
   *   age: 30
   * }, 'user');
   * // Sets: user.name = 'John', user.age = 30
   * ```
   */
  batch = (
    operationsOrObject: (() => void) | Record<string, any>,
    pathPrefix?: string
  ): void => {
    // Check if first parameter is a function (original behavior)
    if (typeof operationsOrObject === 'function') {
      this._batchOperations(operationsOrObject as () => void);
      return;
    }

    // Object mode - flatten and set
    if (operationsOrObject && typeof operationsOrObject === 'object' && !Array.isArray(operationsOrObject)) {
      this._batchObject(operationsOrObject, pathPrefix);
      return;
    }

    // Invalid input
    throw new Error('batch() expects either a function or an object');
  };

  /**
   * 🔥 ORIGINAL BATCH OPERATIONS (Function Mode)
   * Now triggers notifications and alerts for every operation in order,
   * so all intermediate changes are observed (not just the final value).
   */
  private _batchOperations = (operations: () => void): void => {
    const wasBatchMode = this.batchMode;
    this.batchMode = true;
    this.batchQueue = [];

    // Collect all operations in the batch queue
    operations();

    // For each operation in order, apply and collect old/new values
    const notifications: Array<{ path: string, oldValue: any, newValue: any }> = [];

    for (const { path, value, options } of this.batchQueue) {
      const valueObj = this.store.get(path);
      const oldValue = valueObj ? valueObj.value : undefined;
      if (this._setInternal(path, value, { ...options, suppressNotifications: true })) {
        const newValueObj = this.store.get(path);
        notifications.push({ path, oldValue, newValue: newValueObj ? newValueObj.value : value });
      }
    }

    // Now notify and alert for each operation in order
    for (const { path, oldValue, newValue } of notifications) {
      if (this.quickMode) {
        this._nuclearNotify(path, newValue, oldValue);
      } else {
        this._adaptiveNotify(path, newValue, oldValue);
      }
      this._triggerTurboAlerts(path, newValue, oldValue);
    }

    this.batchMode = wasBatchMode;
    this.batchQueue = [];
    this._checkWaiters();
  };

  /**
   * 🆕 BATCH OBJECT FLATTENING (Object Mode)
   */
  private _batchObject = (obj: Record<string, any>, pathPrefix?: string): void => {
    const wasBatchMode = this.batchMode;
    this.batchMode = true;
    this.batchQueue = [];

    // Flatten the object
    const flattened = flattenObjectSimple(obj);

    // Queue all flattened paths
    for (const [key, value] of Object.entries(flattened)) {
      const fullPath = pathPrefix ? `${pathPrefix}.${key}` : key;
      this.batchQueue.push({ path: fullPath, value, options: {} });
    }

    // For each operation in order, apply and collect old/new values
    const notifications: Array<{ path: string, oldValue: any, newValue: any }> = [];

    for (const { path, value, options } of this.batchQueue) {
      const valueObj = this.store.get(path);
      const oldValue = valueObj ? valueObj.value : undefined;
      if (this._setInternal(path, value, { ...options, suppressNotifications: true })) {
        const newValueObj = this.store.get(path);
        notifications.push({ path, oldValue, newValue: newValueObj ? newValueObj.value : value });
      }
    }

    // Now notify and alert for each operation in order
    for (const { path, oldValue, newValue } of notifications) {
      if (this.quickMode) {
        this._nuclearNotify(path, newValue, oldValue);
      } else {
        this._adaptiveNotify(path, newValue, oldValue);
      }
      this._triggerTurboAlerts(path, newValue, oldValue);
    }

    this.batchMode = wasBatchMode;
    this.batchQueue = [];
    this._checkWaiters();
  };


  /**
   * Multi-get with single operation overhead
   */
  getMany = (paths: string[]): Record<string, any> => {
    const result: Record<string, any> = {};
    for (const path of paths) {
      result[path] = this.get(path);
    }
    return result;
  };

  // ==========================================
  // 🚀 PERFORMANCE MONITORING & MODES
  // ==========================================

  startBenchmark = (): void => {
    this.benchmarkMode = true;
    this.opCount = 0;
  };

  endBenchmark = (): {operations: number, opsPerMs: number} => {
    this.benchmarkMode = false;
    const ops = this.opCount;
    this.opCount = 0;
    return {
      operations: ops,
      opsPerMs: ops / 1000
    };
  };

  /**
   * ☢️ NUCLEAR MODE TOGGLE
   */
  setQuickMode = (enabled: boolean): void => {
    this.quickMode = enabled;

    if (enabled) {
      // ✅ Migrate data to nuclear store
      for (const [path, valueObj] of this.store.entries()) {
        if (valueObj.value !== undefined) {
          this.fastStore.set(path, valueObj.value);
        }
      }
    } else {
      // ✅ Migrate data back to full store
      for (const [path, value] of this.fastStore.entries()) {
        let valueObj = this.store.get(path);
        if (!valueObj) {
          valueObj = {
            value,
            isPrimitive: isPrimitive(value),
            needsClone: !isPrimitive(value),
            created: Date.now(),
            subs: new Map()
          };
          this.store.set(path, valueObj);
        } else {
          valueObj.value = value;
        }
      }
      this.fastStore.clear();
    }
  };

  // ==========================================
  // 🔥 TURBO ALERTS - OPTIMIZED CONDITIONS
  // ==========================================

  alert = (path: string, callback: Function, options: {
    condition?: Function;
    throttle?: number;
    once?: boolean;
  } = {}): (() => void) => {
    const id = generateFastId();

    const alert: AlertConfigTurbo = {
      id,
      key: path,
      fn: callback,
      condition: options.condition,
      throttle: options.throttle || 0,
      lastTrigger: 0,
      once: options.once || false
    };

    const existing = this.alerts.get(path) || [];
    existing.push(alert);
    this.alerts.set(path, existing);

    return () => this._removeAlert(id);
  };

  // ==========================================
  // 🔧 TURBO INTERNALS - ANNIHILATION EDITION
  // ==========================================

  // /**
  //  * ✅ FIXED: Internal set method with notification control
  //  */
  // private _setInternal = (path: string, value: any, options: {
  //   history?: boolean;
  //   clone?: 'none' | 'shallow' | 'deep';
  //   suppressNotifications?: boolean;
  // } = {}): boolean => {
  //   let valueObj = this.store.get(path);
  //   const isNew = !valueObj;
  //   const isPrim = isPrimitive(value);

  //   if (isNew) {
  //     valueObj = {
  //       value,
  //       prev: value,
  //       isPrimitive: isPrim,
  //       needsClone: !isPrim,
  //       created: Date.now(),
  //       subs: new Map()
  //     };

  //     if (options.history !== false) {
  //       valueObj.history = [];
  //       valueObj.historySize = 10;
  //     }

  //     this.store.set(path, valueObj);

  //     if (!options.suppressNotifications) {
  //       if (this.quickMode) {
  //         this._nuclearNotify(path, value, undefined);
  //       } else {
  //         this._adaptiveNotify(path, value, undefined);
  //       }

  //       this._checkWaiters();
  //       this._triggerTurboAlerts(path, value, undefined);
  //     }

  //     return true;
  //   }

  //   // Fast equality check
  //   if (valueObj && fastEquals(value, valueObj.value)) return false;

  //   // Store old value for notifications
  //   const oldValue = valueObj!.value;

  //   // History management
  //   if (valueObj && valueObj.history && options.history !== false) {
  //     valueObj.history.push(valueObj.value);
  //     if (valueObj.history.length > (valueObj.historySize || 10)) {
  //       valueObj.history.shift();
  //     }
  //   }

  //   valueObj!.prev = valueObj!.value;
  //   valueObj!.value = value;
  //   valueObj!.updated = Date.now();
  //   valueObj!.isPrimitive = isPrim;
  //   valueObj!.needsClone = !isPrim;

  //   if (!options.suppressNotifications) {
  //     if (this.quickMode) {
  //       this._nuclearNotify(path, value, oldValue);
  //     } else {
  //       this._adaptiveNotify(path, value, oldValue);
  //     }

  //     this._checkWaiters();
  //     this._triggerTurboAlerts(path, value, oldValue);
  //   }

  //   return true;
  // };

  /**
   * ✅ FIXED: Internal set method with proper history management
   */
  private _setInternal = (path: string, value: any, options: {
    history?: boolean;
    clone?: 'none' | 'shallow' | 'deep';
    suppressNotifications?: boolean;
    suppressTimeline?: boolean;
  } = {}): boolean => {
    let valueObj = this.store.get(path);
    const isNew = !valueObj;
    const isPrim = isPrimitive(value);

    if (isNew) {
      // Create new value object
      valueObj = {
        value,
        prev: undefined, // ✅ No previous value for new entries
        isPrimitive: isPrim,
        needsClone: !isPrim,
        created: Date.now(),
        subs: new Map()
      };

      // ✅ FIXED: Enable history by default, respect options
      if (options.history !== false) {
        valueObj.history = [];
        valueObj.historySize = 10;
      }

      this.store.set(path, valueObj);

      if (!options.suppressNotifications) {
        if (this.quickMode) {
          this._nuclearNotify(path, value, undefined);
        } else {
          this._adaptiveNotify(path, value, undefined);
        }

        this._checkWaiters();
        this._triggerTurboAlerts(path, value, undefined);
      }

      return true;
    }

    // ✅ CRITICAL: Fast equality check BEFORE any changes
    if (valueObj && fastEquals(value, valueObj.value)) {
      return false; // No change, don't update history
    }

    // ✅ FIXED: Store old value BEFORE updating
    const oldValue = valueObj!.value;

    // ✅ FIXED: Update history BEFORE changing the value
    if (valueObj!.history && options.history !== false) {
      // Add current value to history (not the new one!)
      this._log("%cOmniTurbo[setInternalValue] : Adding to History: ","background:green", oldValue);
      this._log(" %cOmniTurbo[setInternalValue] : Current History: ","background:green", valueObj!.history);
      valueObj!.history.push(oldValue);

      // Maintain history size limit
      if (valueObj!.history.length > (valueObj!.historySize || 10)) {
        this._log("   OmniTurbo[setInternalValue] : History size exceeded, removing oldest entry");
        valueObj!.history.shift(); // Remove oldest entry (FIFO/FAFO)
      }
    } else if (options.history !== false && !valueObj!.history) {
      this._log("OmniTurbo[setInternalValue] : Initializing history for existing value without it");
      // ✅ FIXED: Initialize history for existing values that don't have it
      valueObj!.history = [oldValue]; // Start with current value
      valueObj!.historySize = 10;
      valueObj!.historyIndex = -1;
    }

    // ✅ NOW update the values
    valueObj!.prev = oldValue;        // Store previous value
    valueObj!.value = value;          // Set new value
    valueObj!.updated = Date.now();   // Update timestamp
    valueObj!.isPrimitive = isPrim;
    valueObj!.needsClone = !isPrim;


    this._log("OmniTurbo[setInternalValue] : Value History:", valueObj!.history);
    this._log("OmniTurbo[setInternalValue] : Value History Index:", valueObj!.historyIndex);
    this._log("OmniTurbo[setInternalValue] : historyCount:", this.historyCount(path));
    this._log("OmniTurbo[setInternalValue] : redoCount:", this.redoCount(path));
    this._log("OmniTurbo[setInternalValue] : canUndo:", this.canUndo(path));
    this._log("OmniTurbo[setInternalValue] : canRedo:", this.canRedo(path));



    // ✨ ADD TO TIMELINE
    if (!options.suppressTimeline) {
      this._addToTimeline(path, oldValue, value, 'updated');
    }



    if (!options.suppressNotifications) {
      if (this.quickMode) {
        this._nuclearNotify(path, value, oldValue);
      } else {
        this._adaptiveNotify(path, value, oldValue);
      }

      this._checkWaiters();
      this._triggerTurboAlerts(path, value, oldValue);
    }

    return true;
  };

  // private _addHistoryToValueObject = (valueObj: TurboValueObject, value: any): void => {

  //   if (!valueObj.history) {
  //     valueObj.history = [];
  //     valueObj.historySize = 10; // Default history size
  //   }

  //   // Add current value to history
  //   valueObj.history.push(value);
  //   if (valueObj.history.length??0 > valueObj?.historySize??10) {
  //     valueObj.history.shift(); // Remove oldest entry if exceeded
  //   }

  //   // Reset history index for new values
  //   valueObj.historyIndex = -1;
  // }

  private _checkWaiters = (): void => {
    if (!this.waiters.length) return;

    this.waiters = this.waiters.filter(waiter => {
      const results: any = {};
      let ready = true;

      for (const key of waiter.keys) {
        const value = this.get(key);
        if (waiter.exclude.includes(value)) {
          ready = false;
          break;
        }
        results[key] = value;
      }

      if (ready) {
        waiter.resolve(results);
        return false; // Remove from waiters
      }
      return true; // Keep waiting
    });
  };

  private _triggerTurboAlerts = (path: string, newValue: any, oldValue: any): void => {
    const alerts = this.alerts.get(path);
    if (!alerts?.length) return;

    const now = Date.now();

    for (let i = alerts.length - 1; i >= 0; i--) {
      const alert = alerts[i];

      if (alert.throttle && (now - alert.lastTrigger) < alert.throttle) continue;
      if (alert.condition && !alert.condition(newValue, oldValue)) continue;

      try {
        alert.fn(newValue, oldValue);
        alert.lastTrigger = now;

        if (alert.once) {
          alerts.splice(i, 1);
        }
      } catch (error) {
        console.error('Alert error:', error);
      }
    }
  };

  private _removeAlert = (alertId: string): void => {
    for (const [path, alerts] of this.alerts.entries()) {
      const filtered = alerts.filter(a => a.id !== alertId);
      if (filtered.length === 0) {
        this.alerts.delete(path);
      } else {
        this.alerts.set(path, filtered);
      }
    }
  };

  // ==========================================
  // 🎯 CONVENIENCE METHODS - TURBO CHARGED
  // ==========================================
  /**
   * Toggles the boolean value at the specified path.
   *
   * If the value is `true`, it will become `false`. If the value is `false`, it will become `true`.
   * If the value is `undefined`, it will be treated as `false` and toggled to `true`.
   * If the value is a number or string, it will be coerced to boolean and toggled.
   * Throws an error if the value is an object, array, or function.
   *
   * @param path - The dot-notation path to toggle
   * @returns The new boolean value after toggling
   * @throws {Error} If the value at the path is not a primitive (boolean, number, string, or undefined)
   *
   * @example
   * omni.set('flag', true);
   * omni.toggle('flag'); // false
   * omni.toggle('flag'); // true
   *
   * omni.toggle('newFlag'); // true (undefined treated as false)
   *
   * omni.set('num', 0);
   * omni.toggle('num'); // true
   *
   * omni.set('obj', { a: 1 });
   * omni.toggle('obj'); // throws Error
   */
  toggle = (path: string): boolean => {
    const current = this.get(path);
    if (
      current !== undefined &&
      typeof current !== 'boolean' &&
      typeof current !== 'number' &&
      typeof current !== 'string'
    ) {
      throw new Error(`Cannot toggle non-primitive value at path: ${path}`);
    }
    const newValue = !current;
    this.set(path, newValue);
    return newValue;
  };

  /**
   * Increments the numeric value at the specified path by a given amount.
   *
   * If the value is `undefined`, it is treated as `0` and incremented by the amount.
   * Throws an error if the value is not a number or undefined.
   *
   * @param path - The dot-notation path to increment
   * @param amount - The amount to increment by (default: 1)
   * @returns The new numeric value after incrementing
   * @throws {Error} If the value at the path is not a number or undefined
   *
   * @example
   * omni.set('count', 5);
   * omni.increment('count'); // 6
   * omni.increment('count', 4); // 10
   *
   * omni.increment('newCount'); // 1 (undefined treated as 0)
   *
   * omni.set('flag', true);
   * omni.increment('flag'); // throws Error
   */
  increment = (path: string, amount: number = 1): number => {
    const current = this.get(path);
    if (current === undefined) {
      this.set(path, amount);
      return amount;
    }
    if (typeof current !== 'number') {
      throw new Error(`Cannot increment non-number at path: ${path}`);
    }
    const newValue = current + amount;
    this.set(path, newValue);
    return newValue;
  };

  /**
   * Decrements the numeric value at the specified path by a given amount.
   *
   * If the value is `undefined`, it is treated as `0` and decremented by the amount.
   * Throws an error if the value is not a number or undefined.
   *
   * @param path - The dot-notation path to decrement
   * @param amount - The amount to decrement by (default: 1)
   * @returns The new numeric value after decrementing
   * @throws {Error} If the value at the path is not a number or undefined
   *
   * @example
   * omni.set('count', 10);
   * omni.decrement('count'); // 9
   * omni.decrement('count', 4); // 5
   *
   * omni.decrement('newCount'); // -1 (undefined treated as 0)
   *
   * omni.set('flag', false);
   * omni.decrement('flag'); // throws Error
   */
  decrement = (path: string, amount: number = 1): number => {
    const current = this.get(path);
    if (current === undefined) {
      this.set(path, -amount);
      return -amount;
    }
    if (typeof current !== 'number') {
      throw new Error(`Cannot decrement non-number at path: ${path}`);
    }
    const newValue = current - amount;
    this.set(path, newValue);
    return newValue;
  };

  /**
   * Pushes one or more items onto the end of the array at the specified path.
   *
   * If the value is `undefined`, it is treated as an empty array and the items are pushed.
   * Throws an error if the value at the path is not an array or undefined.
   *
   * @param path - The dot-notation path to the array
   * @param items - The items to push onto the array
   * @returns The new length of the array after pushing
   * @throws {Error} If the value at the path is not an array or undefined
   *
   * @example
   * omni.set('arr', [1, 2]);
   * omni.push('arr', 3); // 3
   * omni.push('arr', 4, 5); // 5
   *
   * omni.push('newArr', 'a'); // 1 (undefined treated as [])
   *
   * omni.set('str', 'not an array');
   * omni.push('str', 1); // throws Error
   */
  push = (path: string, ...items: any[]): number => {
    const current = this.get(path);
    if (current === undefined) {
      const newArray = [...items];
      this.set(path, newArray);
      return newArray.length;
    }
    if (!Array.isArray(current)) {
      throw new Error(`Cannot push to non-array at path: ${path}`);
    }
    const newArray = [...current, ...items];
    this.set(path, newArray);
    return newArray.length;
  };

  /**
   * Removes the last element from the array at the specified path and returns it.
   * Throws an error if the value at the path is not an array.
   *
   * @param path - The dot-notation path to the array
   * @returns The removed element, or undefined if the array is empty
   * @throws {Error} If the value at the path is not an array
   *
   * @example
   * omni.set('arr', [1, 2, 3]);
   * omni.pop('arr'); // 3
   * omni.get('arr'); // [1, 2]
   */
  pop = (path: string): any => {
    const current = this.get(path);
    if (!Array.isArray(current)) {
      throw new Error(`Cannot pop from non-array at path: ${path}`);
    }
    const newArray = [...current];
    const popped = newArray.pop();
    this.set(path, newArray);
    return popped;
  };

  /**
   * Removes the first element from the array at the specified path and returns it.
   * Throws an error if the value at the path is not an array.
   *
   * @param path - The dot-notation path to the array
   * @returns The removed element, or undefined if the array is empty
   * @throws {Error} If the value at the path is not an array
   *
   * @example
   * omni.set('arr', [1, 2, 3]);
   * omni.shift('arr'); // 1
   * omni.get('arr'); // [2, 3]
   */
  shift = (path: string): any => {
    const current = this.get(path);
    if (!Array.isArray(current)) {
      throw new Error(`Cannot shift from non-array at path: ${path}`);
    }
    const newArray = [...current];
    const shifted = newArray.shift();
    this.set(path, newArray);
    return shifted;
  };

  /**
   * Adds one or more elements to the beginning of the array at the specified path.
   * Throws an error if the value at the path is not an array or undefined.
   *
   * @param path - The dot-notation path to the array
   * @param items - The items to add to the beginning of the array
   * @returns The new length of the array after unshifting
   * @throws {Error} If the value at the path is not an array or undefined
   *
   * @example
   * omni.set('arr', [2, 3]);
   * omni.unshift('arr', 1); // 3
   * omni.get('arr'); // [1, 2, 3]
   *
   * omni.unshift('newArr', 'a'); // 1 (undefined treated as [])
   */
  unshift = (path: string, ...items: any[]): number => {
    const current = this.get(path);
    if (current === undefined) {
      const newArray = [...items];
      this.set(path, newArray);
      return newArray.length;
    }
    if (!Array.isArray(current)) {
      throw new Error(`Cannot unshift to non-array at path: ${path}`);
    }
    const newArray = [...items, ...current];
    this.set(path, newArray);
    return newArray.length;
  };

  /**
   * Changes the contents of the array at the specified path by removing or replacing existing elements and/or adding new elements in place.
   * Throws an error if the value at the path is not an array.
   *
   * @param path - The dot-notation path to the array
   * @param start - The index at which to start changing the array
   * @param deleteCount - The number of elements to remove
   * @param items - The elements to add to the array, beginning at start
   * @returns An array containing the deleted elements
   * @throws {Error} If the value at the path is not an array
   *
   * @example
   * omni.set('arr', [1, 2, 3, 4]);
   * omni.splice('arr', 1, 2, 'a', 'b'); // [2, 3]
   * omni.get('arr'); // [1, 'a', 'b', 4]
   */
  splice = (path: string, start: number, deleteCount?: number, ...items: any[]): any[] => {
    const current = this.get(path);
    if (!Array.isArray(current)) {
      throw new Error(`Cannot splice non-array at path: ${path}`);
    }
    const newArray = [...current];
    const removed = newArray.splice(start, deleteCount ?? (newArray.length - start), ...items);
    this.set(path, newArray);
    return removed;
  };

  /**
   * Returns the type of the value at the specified path.
   *
   * The result will be one of:
   * - 'undefined' (if the path does not exist)
   * - 'null'
   * - 'array'
   * - 'object'
   * - 'string'
   * - 'number'
   * - 'boolean'
   * - 'function'
   * - 'symbol'
   * - 'bigint'
   *
   * @param path - The dot-notation path to check
   * @returns The type of the value at the path as a string
   *
   * @example
   * omni.set('foo', 123);
   * omni.typeOf('foo'); // 'number'
   * omni.set('bar', [1,2,3]);
   * omni.typeOf('bar'); // 'array'
   * omni.set('baz', null);
   * omni.typeOf('baz'); // 'null'
   * omni.typeOf('missing'); // 'undefined'
   */
  typeOf = (path: string): string => {
    const value = this.get(path);
    if (value === undefined) return 'undefined';
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    return typeof value;
  };



  // ==========================================
  // 🔄 ASYNC COORDINATION
  // ==========================================

  waitForValues = async (keys: string[] | string, exclude: any[] = [undefined, null]): Promise<any> => {
    if (typeof keys === 'string') keys = [keys];

    return new Promise(resolve => {
      this.waiters.push({keys: keys as string[], exclude, resolve});
      this._checkWaiters();
    });
  };

  // ==========================================
  // 🐛 DEBUG & UTILITIES
  // ==========================================

  getStats = () => ({
    storeSize: this.store.size,
    activeWaiters: this.waiters.length,
    activeAlerts: Array.from(this.alerts.values()).flat().length,
    globalSubscribers: this.globalSubscribers.size, // 🌍 Include global subscriber count
    quickMode: this.quickMode,
    batchMode: this.batchMode,
    parentNotifications: this.parentNotifications,
    timeline: {
      enabled: this.timelineEnabled,
      totalEntries: this.globalTimeline.length,
      maxSize: this.timelineMaxSize,
      memoryUsage: JSON.stringify(this.globalTimeline).length
    }

  });


  /**
   * 🔄 CLEAR ALL DATA - RESET EVERYTHING
   * Completely clears all data, subscriptions, alerts, and waiters.
   */
  clear = (): void => {
    this.store.clear();
    this.fastStore.clear(); 
    this.parentCache.clear(); 
    this.globalSubscribers.clear();
    this.waiters = [];
    this.alerts.clear();
    this.batchQueue = [];
  };


  /**
   * 🔄 CHECK IF PATH EXISTS
   * 
   * Returns true if the path exists in the store, false otherwise.
   */
  exists = (path: string): boolean => {
    if (this.quickMode) {
      return this.fastStore.has(path);
    }
    return this.store.has(path) && this.store.get(path)!.value !== undefined;
  };


  /**
   * 🔄 DELETE PATH AND ALL CHILDREN
   * 
   * Deletes the specified path and all its child paths (descendants).
   * @param path - The path to delete
   * @return true if the path existed and was deleted, false otherwise.
   */
  delete = (path: string): boolean => {
    let existed = false;

    // Notify subscribers and alerts BEFORE deleting the path
    if (this.store.has(path) || this.fastStore.has(path)) {
      existed = true;

      const oldValue = this.get(path);
      this._addToTimeline(path, oldValue, undefined, 'deleted');
      if (this.quickMode) {
        this._nuclearNotify(path, undefined, oldValue);
      } else {
        this._adaptiveNotify(path, undefined, oldValue);
      }
      // 🔥 Trigger alerts for the deleted path
      this._triggerTurboAlerts(path, undefined, oldValue);

      this.store.delete(path);
      this.fastStore.delete(path);
    }

    // Delete all child paths (descendants)
    const prefixWithDot = path + '.';
    const childKeys = Array.from(this.store.keys()).filter(k => k.startsWith(prefixWithDot));
    for (const childKey of childKeys) {
      const oldValue = this.get(childKey);
      this._addToTimeline(childKey, oldValue, undefined, 'deleted');
      if (this.quickMode) {
        this._nuclearNotify(childKey, undefined, oldValue);
      } else {
        this._adaptiveNotify(childKey, undefined, oldValue);
      }
      // 🔥 Trigger alerts for the deleted child path
      this._triggerTurboAlerts(childKey, undefined, oldValue);

      this.store.delete(childKey);
      this.fastStore.delete(childKey);
      existed = true;
    }

    return existed;
  };


  /**
   * 🔍 FAST CHILD PATH CHECKER
   */
  private _hasChildPaths = (prefix: string): boolean => {
    const prefixWithDot = prefix + '.';
    
    if (this.quickMode) {
      // ✅ ULTRA FAST: Early exit on first match
      for (const fullPath of this.fastStore.keys()) {
        if (fullPath.startsWith(prefixWithDot)) {
          return true;
        }
      }
    } else {
      // ✅ OPTIMIZED: Early exit on first match
      for (const fullPath of this.store.keys()) {
        if (fullPath.startsWith(prefixWithDot)) {
          return true;
        }
      }
    }
    
    return false;
  };
  /**
   * 🎯 CONVENIENCE METHOD - GET PATHS UNDER PREFIX
   * 
   * Returns all paths that start with the given prefix
   */
  getChildPaths = (prefix: string): string[] => {
    const prefixWithDot = prefix + '.';
    const childPaths: string[] = [];
    
    if (this.quickMode) {
      for (const fullPath of this.fastStore.keys()) {
        if (fullPath.startsWith(prefixWithDot)) {
          childPaths.push(fullPath);
        }
      }
    } else {
      for (const fullPath of this.store.keys()) {
        if (fullPath.startsWith(prefixWithDot)) {
          childPaths.push(fullPath);
        }
      }
    }
    
    return childPaths.sort();
  };


  /**
   * 🔥 BATCH GET OBJECTS - GET MULTIPLE OBJECTS AT ONCE
   * 
   * Super efficient way to get multiple objects in one operation
   */
  getBatchObj = (paths: string[], options: { 
    clone?: 'none' | 'shallow' | 'deep';
  } = {}): Record<string, any> => {
    const result: Record<string, any> = {};
    
    for (const path of paths) {
      const obj = this.getObj(path, options);
      if (obj !== undefined) {
        result[path] = obj;
      }
    }
    
    return result;
  };

  /**
   * 🎯 CHECK IF PATH HAS CHILDREN (PUBLIC)
   * 
   * Useful for UI components to know if a node can be expanded
   */
  hasChildren = (path: string): boolean => {
    return this._hasChildPaths(path);
  };

  /**
   * 🔍 GET OBJECT KEYS - GET IMMEDIATE CHILDREN KEYS
   * 
   * Returns only the immediate child keys, not full paths
   */
  getObjectKeys = (path: string): string[] => {
    const prefixWithDot = path + '.';
    const keys = new Set<string>();
    
    const pathSource = this.quickMode ? this.fastStore.keys() : this.store.keys();
    
    for (const fullPath of pathSource) {
      if (fullPath.startsWith(prefixWithDot)) {
        const relativePath = fullPath.substring(prefixWithDot.length);
        const firstKey = relativePath.split('.')[0];
        keys.add(firstKey);
      }
    }
    
    return Array.from(keys).sort();
  };

  /**
   * 🚀 GET FLATTENED OBJECT - RETURN AS FLAT KEY-VALUE PAIRS
   * 
   * Returns all child paths as a flat object with full dot-notation keys
   */
  getFlatObj = (prefix: string): Record<string, any> => {
    const result: Record<string, any> = {};
    const prefixWithDot = prefix + '.';
    
    if (this.quickMode) {
      for (const [fullPath, value] of this.fastStore.entries()) {
        if (fullPath.startsWith(prefixWithDot)) {
          const relativePath = fullPath.substring(prefixWithDot.length);
          result[relativePath] = value;
        }
      }
    } else {
      for (const [fullPath, valueObj] of this.store.entries()) {
        if (fullPath.startsWith(prefixWithDot) && valueObj.value !== undefined) {
          const relativePath = fullPath.substring(prefixWithDot.length);
          result[relativePath] = valueObj.value;
        }
      }
    }
    
    return result;
  };


//  #     # ###  #####  ####### ####### ######  #     #
//  #     #  #  #     #    #    #     # #     #  #   #
//  #     #  #  #          #    #     # #     #   # #
//  #######  #   #####     #    #     # ######     #
//  #     #  #        #    #    #     # #   #      #
//  #     #  #  #     #    #    #     # #    #     #
//  #     # ###  #####     #    ####### #     #    #




  // Time travel (if history is enabled)
  getHistory = (path: string): any[] => {
    const valueObj = this.store.get(path);
    return valueObj?.history || [];
  };

  /**
   * Sets the history for a value at the specified path.
   * This method allows you to manually set the history array for a value, it WILL NOT notify subscribers.
   * 
   * @param path - The path to the value in the store
   * @param history - The history array to set
   * @param historySize - Optional size limit for the history array (default is 10)
   */
  setHistoryInternal=(path: string, history: any[], historySize: number = 10): void => {
    const valueObj = this.store.get(path);
    if (!valueObj) {
      throw new Error(`No value found at path: ${path}`);
    }

    valueObj.history = history.slice(0, historySize); // Limit history size
    valueObj.historySize = historySize;
    valueObj.historyIndex = -1; // Reset index to current value
    valueObj.updated = Date.now();
  }


  /**
   * Checks if there are any undo operations available for a value at the specified path.
   * 
   * @param path - The path to the value in the store
   * @returns True if undo is possible, false otherwise
   */
  canUndo = (path: string): boolean => {
    const valueObj = this.store.get(path);
    if (!valueObj?.history) return false;

    const currentIndex = valueObj.historyIndex ?? -1;
    return currentIndex < valueObj.history.length - 1;
  };

  /**
   * Gets the number of undo operations available for a value at the specified path.
   * 
   * @param path - The path to the value in the store
   * @returns The number of undo operations available, or 0 if no history exists
   */
  canRedo = (path: string): boolean => {
    const valueObj = this.store.get(path);
    if (!valueObj?.history) return false;

    const currentIndex = valueObj.historyIndex ?? -1;
    return currentIndex > 0;
  };

  /**
   * Gets the number of redo operations available for a value at the specified path.
   * 
   * @param path - The path to the value in the store
   * @returns The number of redo operations available, or 0 if no history exists
   */
  redoCount = (path: string): number => {
    const valueObj = this.store.get(path);
    if (!valueObj?.history) return 0;
    const historyLength = valueObj.history.length;

    const currentIndex = valueObj.historyIndex ?? 0;
    // if(currentIndex === 0) return 0; // No redo if at current value

    return currentIndex;
  };


  /**
   * Gets the number of history entries for a value at the specified path.
   * 
   * @param path - The path to the value in the store
   * @returns The number of history entries, or 0 if no history exists
   */
  historyCount = (path: string): number => {
    const valueObj = this.store.get(path);
    if (!valueObj?.history) return 0;
    const historyLength = valueObj.history.length;

    if (historyLength === 0) return 0;

    const currentIndex = (valueObj.historyIndex ?? -1) + 1; // +1 because historyIndex is -1 when at the current value
    // this._log("currentIndex: ", currentIndex);
    return historyLength - Math.abs(currentIndex);
  };


  undo = (path: string): boolean => {
    const valueObj = this.store.get(path);
    if (!valueObj?.history || !this.canUndo(path)) return false;


    const currentIndex = valueObj.historyIndex ?? -1;
    var newIndex = currentIndex + 1;
    this._log("%cOmniTurbo[undo] : Current History: ","background:#63630c", valueObj.history);
    this._log("%cOmniTurbo[undo] : Current History Index: ","background:#63630c", currentIndex);
    this._log("%cOmniTurbo[undo] : New History Index: ","background:#63630c", newIndex);

    // Store current value in history if we're at the "current" position
    if (currentIndex === -1) {
      this._log("%cOmniTurbo[undo] : Adding current value to history before undoing: ","background:#63630c", valueObj.value);
      valueObj.history.push(valueObj.value);
      valueObj.historyIndex = 0; // Reset index to 0 after adding current value
      newIndex = 1; // Start from the beginning of history
      // Maintain history size limit
      if (valueObj.history.length > (valueObj.historySize || 10)) {
        this._log("%cOmniTurbo[undo] : History size exceeded, removing oldest entry","background:#797f38");
        valueObj.history.shift();
        // Adjust index since we removed from beginning
        valueObj.historyIndex = (valueObj.historyIndex ?? -1) + 1;
        return this.undo(path); // Try again with adjusted index
      }
    }

    // Navigate to previous value
    const targetValue = valueObj.history[valueObj.history.length - 1 - newIndex];
    const oldValue = valueObj.value;

    valueObj.value = targetValue;
    valueObj.prev = oldValue;
    valueObj.historyIndex = newIndex;
    valueObj.updated = Date.now();

    this._addToTimeline(path, oldValue, targetValue, 'undo');

    // Notify subscribers
    if (this.quickMode) {
      this.fastStore.set(path, valueObj.value);
      this._nuclearNotify(path, valueObj.value, oldValue);
    } else {
      this._notifyGlobalSubscribers(path, valueObj.value,valueObj.prev);
      this._adaptiveNotify(path, valueObj.value, oldValue);
    }
    return true;
  };

  redo = (path: string): boolean => {
    const valueObj = this.store.get(path);
    if (!valueObj?.history || !this.canRedo(path)) return false;

    const currentIndex = valueObj.historyIndex ?? -1;
    const newIndex = currentIndex - 1; // Move forward (closer to current)
    
    this._log("%cOmniTurbo[redo] : Current History: ","background:#3a9b94", valueObj.history);
    this._log("%cOmniTurbo[redo] : Current History Index: ","background:#3a9b94", currentIndex);
    this._log("%cOmniTurbo[redo] : New History Index: ","background:#3a9b94", newIndex);

    // Get the target value
    let targetValue: any;
    
    if (newIndex === -1) {
      // Moving back to the "current" value (the one that was added when first undo was called)
      targetValue = valueObj.history[valueObj.history.length - 1];
      this._log("%cOmniTurbo[redo] : Moving back to current value: ","background:#3a9b94", targetValue);
    } else {
      // Get value from history
      targetValue = valueObj.history[valueObj.history.length - 1 - newIndex];
      this._log("%cOmniTurbo[redo] : Moving to history value: ","background:#3a9b94", targetValue);
    }

    const oldValue = valueObj.value;

    // Update the value and index
    valueObj.value = targetValue;
    valueObj.prev = oldValue;
    valueObj.historyIndex = newIndex;
    valueObj.updated = Date.now();


    this._addToTimeline(path, oldValue, targetValue, 'redo');

    // Notify subscribers
    if (this.quickMode) {
      this.fastStore.set(path, valueObj.value);
      this._nuclearNotify(path, valueObj.value, oldValue);
    } else {
      this._notifyGlobalSubscribers(path, valueObj.value, oldValue);
      this._adaptiveNotify(path, valueObj.value, oldValue);
    }

    this._log("%cOmniTurbo[redo] : Redo completed successfully","background:#2ed573");
    return true;
  };



  /**
   * 🎯 GET ONLY PATHS THAT CAN BE UNDONE (filtered version)
   */
  getUndoablePaths = (): string[] => {
    const paths: string[] = [];
    
    for (const [path, valueObj] of this.store.entries()) {
      if (valueObj.history && this.canUndo(path)) {
        paths.push(path);
      }
    }
    
    this._log(
      `%c🔙 UNDOABLE PATHS %cFound ${paths.length} paths that can be undone`,
      'background:#ff6b6b; color:white; padding:2px 6px; border-radius:3px; font-weight:bold;',
      'color:#ff6b6b; font-weight:bold;',
      paths
    );
    
    return paths;
  };

  /**
   * 🎯 GET ONLY PATHS THAT CAN BE REDONE (filtered version)
   */
  getRedoablePaths = (): string[] => {
    const paths: string[] = [];
    
    for (const [path, valueObj] of this.store.entries()) {
      if (valueObj.history && this.canRedo(path)) {
        paths.push(path);
      }
    }
    
    this._log(
      `%c🔄 REDOABLE PATHS %cFound ${paths.length} paths that can be redone`,
      'background:#4ecdc4; color:white; padding:2px 6px; border-radius:3px; font-weight:bold;',
      'color:#4ecdc4; font-weight:bold;',
      paths
    );
    
    return paths;
  };





  undoAll = (): { successful: string[]; failed: string[] } => {
    const successful: string[] = [];
    const failed: string[] = [];
    
    this._log(
      '%c🔙 BULK UNDO ALL %cUndoing all possible paths...',
      'background:#ff6b6b; color:white; padding:2px 6px; border-radius:3px; font-weight:bold;',
      'color:#ff6b6b; font-weight:bold;'
    );

    const undoablePaths = this.getUndoablePaths();
    
    for (const path of undoablePaths) {
      try {
        if (this.undo(path)) {
          successful.push(path);
          this._log(`%c✅ ${path}`, 'color:#2ed573;');
        } else {
          failed.push(path);
          this._log(`%c❌ ${path}`, 'color:#ff4757;');
        }
      } catch (error) {
        failed.push(path);
        this._log(`%c💥 ${path}`, 'color:#ff4757;', error);
      }
    }

    this._log(
      `%c🎯 BULK UNDO COMPLETE %cSuccess: ${successful.length}, Failed: ${failed.length}`,
      'background:#2ed573; color:white; padding:2px 6px; border-radius:3px; font-weight:bold;',
      'color:#2ed573; font-weight:bold;'
    );

    return { successful, failed };
  };



  /**
   * 🔄 BULK REDO ALL REDOABLE PATHS
   */
  redoAll = (): { successful: string[]; failed: string[] } => {
    const successful: string[] = [];
    const failed: string[] = [];
    
    this._log(
      '%c🔄 BULK REDO ALL %cRedoing all possible paths...',
      'background:#4ecdc4; color:white; padding:2px 6px; border-radius:3px; font-weight:bold;',
      'color:#4ecdc4; font-weight:bold;'
    );

    const redoablePaths = this.getRedoablePaths();
    
    for (const path of redoablePaths) {
      try {
        if (this.redo(path)) {
          successful.push(path);
          this._log(`%c✅ ${path}`, 'color:#2ed573;');
        } else {
          failed.push(path);
          this._log(`%c❌ ${path}`, 'color:#ff4757;');
        }
      } catch (error) {
        failed.push(path);
        this._log(`%c💥 ${path}`, 'color:#ff4757;', error);
      }
    }

    this._log(
      `%c🎯 BULK REDO COMPLETE %cSuccess: ${successful.length}, Failed: ${failed.length}`,
      'background:#2ed573; color:white; padding:2px 6px; border-radius:3px; font-weight:bold;',
      'color:#2ed573; font-weight:bold;'
    );

    return { successful, failed };
  };









  // Get all paths (for debugging)
  getAllPaths = (): string[] => {
    return Array.from(this.store.keys());
  };

  // Performance test utilities
  benchmark = (name: string, operations: () => void, iterations: number = 1000): void => {
    this.startBenchmark();

    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
      operations();
    }
    const end = performance.now();

    const result = this.endBenchmark();
    const totalTime = end - start;

    this._log(`🔥 ${name}:`);
    this._log(`  ${iterations} operations in ${totalTime.toFixed(2)}ms`);
    this._log(`  Average: ${(totalTime / iterations).toFixed(4)}ms per operation`);
    this._log(`  Rate: ${(iterations / (totalTime / 1000)).toFixed(0)} ops/sec`);
    this._log(`  Omni operations tracked: ${result.operations}`);
  };




  /**
   * 🌍 GLOBAL SUBSCRIBER - Called on ANY value change
   * Perfect for real-time viewers and debugging tools
   */
  subscribeGlobal = (callback: (path: string, value: any, oldValue?: any) => void): (() => void) => {
    const id = generateFastId();
    this.globalSubscribers.set(id, callback);

    return () => {
      this.globalSubscribers.delete(id);
    };
  };

  /**
   * 🔥 NOTIFY ALL GLOBAL SUBSCRIBERS
   */
  private _notifyGlobalSubscribers = (path: string, value: any, oldValue?: any): void => {
    if (this.globalSubscribers.size === 0) return;

    for (const callback of this.globalSubscribers.values()) {
      try {
        callback(path, value, oldValue);
      } catch (error) {
        console.error('Global subscriber error:', error);
      }
    }
  };




//  ####### ### #     # ####### #       ### #     # #######
//     #     #  ##   ## #       #        #  ##    # #
//     #     #  # # # # #       #        #  # #   # #
//     #     #  #  #  # #####   #        #  #  #  # #####
//     #     #  #     # #       #        #  #   # # #
//     #     #  #     # #       #        #  #    ## #
//     #    ### #     # ####### ####### ### #     # #######



  setTimelineEnabled = (enabled: boolean): void => {
    this.timelineEnabled = enabled;
    if (!enabled) {
      this.globalTimeline = [];
    }
  };

  /**
   * Set maximum timeline size (for memory management)
   */
  setTimelineMaxSize = (size: number): void => {
    this.timelineMaxSize = size;
    this._trimTimeline();
  };


  /**
   * Add entry to timeline
   */
  private _addToTimeline = (
    path: string, 
    oldValue: any, 
    newValue: any, 
    action: 'created' | 'updated' | 'deleted' | 'undo' | 'redo'
  ): void => {
    if (!this.timelineEnabled) return;

    const timestamp = Date.now();
    const entry: TimelineEntry = {
      timestamp,
      path,
      oldValue,
      newValue,
      action,
      index: ++this.changeCounter
    };

    // Add to global timeline
    this.globalTimeline.push(entry);

    // Add to individual path's change log
    const valueObj = this.store.get(path);
    if (valueObj) {
      if (!valueObj.changeLog) {
        valueObj.changeLog = [];
      }
      
      valueObj.changeLog.push({
        timestamp,
        oldValue,
        newValue,
        action,
        index: this.changeCounter
      });

      // Limit individual change logs
      if (valueObj.changeLog.length > 50) {
        valueObj.changeLog.shift();
      }
    }

    // Trim global timeline if needed
    this._trimTimeline();
  };


  /**
   * Trim timeline to max size
   */
  private _trimTimeline = (): void => {
    if (this.globalTimeline.length > this.timelineMaxSize) {
      const excess = this.globalTimeline.length - this.timelineMaxSize;
      this.globalTimeline.splice(0, excess);
    }
  };

  /**
   * Get complete chronological timeline
   */
  getTimeline = (options: {
    limit?: number;
    startTime?: number;
    endTime?: number;
    paths?: string[];
    actions?: ('created' | 'updated' | 'deleted' | 'undo' | 'redo')[];
    sortOrder?: 'asc' | 'desc';
  } = {}): TimelineEntry[] => {
    let timeline = [...this.globalTimeline];

    // Filter by time range
    if (options.startTime) {
      timeline = timeline.filter(entry => entry.timestamp >= options.startTime!);
    }
    if (options.endTime) {
      timeline = timeline.filter(entry => entry.timestamp <= options.endTime!);
    }

    // Filter by paths
    if (options.paths && options.paths.length > 0) {
      timeline = timeline.filter(entry => 
        options.paths!.some(path => 
          entry.path === path || entry.path.startsWith(path + '.')
        )
      );
    }

    // Filter by actions
    if (options.actions && options.actions.length > 0) {
      timeline = timeline.filter(entry => options.actions!.includes(entry.action));
    }

    // Sort
    const sortOrder = options.sortOrder || 'desc';
    timeline.sort((a, b) => {
      const timeDiff = sortOrder === 'desc' 
        ? b.timestamp - a.timestamp 
        : a.timestamp - b.timestamp;
      
      // If timestamps are equal, use index for consistent ordering
      return timeDiff !== 0 ? timeDiff : (sortOrder === 'desc' ? b.index - a.index : a.index - b.index);
    });

    // Limit results
    if (options.limit && options.limit > 0) {
      timeline = timeline.slice(0, options.limit);
    }

    return timeline;
  };

  /**
   * Get timeline for specific path
   */
  getPathTimeline = (path: string): ChangeLogEntry[] => {
    const valueObj = this.store.get(path);
    return valueObj?.changeLog || [];
  };

  /**
   * Get recent changes (last N entries)
   */
  getRecentChanges = (limit: number = 10): TimelineEntry[] => {
    return this.getTimeline({ limit, sortOrder: 'desc' });
  };

  /**
   * Get changes in time range
   */
  getChangesInRange = (startTime: number, endTime: number): TimelineEntry[] => {
    return this.getTimeline({ startTime, endTime, sortOrder: 'asc' });
  };

  /**
   * Get changes for specific paths
   */
  getChangesForPaths = (paths: string[]): TimelineEntry[] => {
    return this.getTimeline({ paths, sortOrder: 'desc' });
  };

  /**
   * Clear timeline
   */
  clearTimeline = (): void => {
    this.globalTimeline = [];
    this.changeCounter = 0;
    
    // Clear individual change logs
    for (const [, valueObj] of this.store.entries()) {
      if (valueObj.changeLog) {
        valueObj.changeLog = [];
      }
    }
  };

  /**
   * Export timeline as JSON
   */
  exportTimeline = (): string => {
    return JSON.stringify({
      timeline: this.globalTimeline,
      exported: Date.now(),
      totalChanges: this.changeCounter
    }, null, 2);
  };

  /**
   * Get timeline statistics
   */
  getTimelineStats = (): {
    totalEntries: number;
    oldestEntry?: TimelineEntry;
    newestEntry?: TimelineEntry;
    actionCounts: Record<string, number>;
    pathCounts: Record<string, number>;
    timeSpan: number;
    entriesPerMinute: number;
  } => {
    if (this.globalTimeline.length === 0) {
      return {
        totalEntries: 0,
        actionCounts: {},
        pathCounts: {},
        timeSpan: 0,
        entriesPerMinute: 0
      };
    }

    const sorted = [...this.globalTimeline].sort((a, b) => a.timestamp - b.timestamp);
    const oldest = sorted[0];
    const newest = sorted[sorted.length - 1];
    const timeSpan = newest.timestamp - oldest.timestamp;

    const actionCounts: Record<string, number> = {};
    const pathCounts: Record<string, number> = {};

    for (const entry of this.globalTimeline) {
      actionCounts[entry.action] = (actionCounts[entry.action] || 0) + 1;
      pathCounts[entry.path] = (pathCounts[entry.path] || 0) + 1;
    }

    return {
      totalEntries: this.globalTimeline.length,
      oldestEntry: oldest,
      newestEntry: newest,
      actionCounts,
      pathCounts,
      timeSpan,
      entriesPerMinute: timeSpan > 0 ? (this.globalTimeline.length / (timeSpan / 60000)) : 0
    };
  };






//  ####### ######        # #######  #####  #######    ######  #######  #####  ####### #     #  #####  ####### ######  #     #  #####  ####### ### ####### #     #
//  #     # #     #       # #       #     #    #       #     # #       #     # #     # ##    # #     #    #    #     # #     # #     #    #     #  #     # ##    #
//  #     # #     #       # #       #          #       #     # #       #       #     # # #   # #          #    #     # #     # #          #     #  #     # # #   #
//  #     # ######        # #####   #          #       ######  #####   #       #     # #  #  #  #####     #    ######  #     # #          #     #  #     # #  #  #
//  #     # #     # #     # #       #          #       #   #   #       #       #     # #   # #       #    #    #   #   #     # #          #     #  #     # #   # #
//  #     # #     # #     # #       #     #    #       #    #  #       #     # #     # #    ## #     #    #    #    #  #     # #     #    #     #  #     # #    ##
//  ####### ######   #####  #######  #####     #       #     # #######  #####  ####### #     #  #####     #    #     #  #####   #####     #    ### ####### #     #


  /**
   * Sets all properties of an object as dot-notation paths in the store.
   * Alias for batch(object).
   * 
   * @param obj - The object to flatten and set
   * @param pathPrefix - Optional prefix for all keys
   */
  setObj = (obj: Record<string, any>, pathPrefix?: string): void => {
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
      throw new Error('setObj expects a plain object');
    }
    this.batch(obj, pathPrefix);
  };


  /**
   * 🔥 GET OBJECT - RECONSTRUCT NESTED OBJECT FROM STORED PATHS
   * 
   * Retrieves all paths that start with the given prefix and reconstructs them
   * into a nested object structure.
   * 
   * @param path - The path prefix to search for (e.g., "x.y")
   * @param options - Configuration options
   * @returns Reconstructed object or undefined if no matching paths
   * 
   * @example
   * ```typescript
   * // If store contains:
   * // "x.y.z" = 123
   * // "x.y.name" = "John"
   * // "x.y.settings.theme" = "dark"
   * 
   * omni.getObj("x.y");
   * // Returns: { z: 123, name: "John", settings: { theme: "dark" } }
   * 
   * omni.getObj("x.y.settings");
   * // Returns: { theme: "dark" }
   * ```
   */
  getObj = (path: string, options: { 
    clone?: 'none' | 'shallow' | 'deep';
    includeArrays?: boolean;
  } = {}): any => {
    if (this.benchmarkMode) this.opCount++;

    // ✅ QUICK MODE: Use fastStore for lightning speed
    if (this.quickMode) {
      return this._buildObjectFromFastStore(path, options);
    }

    // ✅ REGULAR MODE: Use full store
    return this._buildObjectFromStore(path, options);
  };

  /**
   * 🚀 FAST STORE OBJECT BUILDER (Quick Mode)
   */
  private _buildObjectFromFastStore = (prefix: string, options: any): any => {
    const result: any = {};
    const prefixWithDot = prefix + '.';
    let hasMatches = false;

    // ✅ BLAZING FAST: Single pass through fastStore
    for (const [fullPath, value] of this.fastStore.entries()) {
      if (fullPath.startsWith(prefixWithDot)) {
        hasMatches = true;
        const relativePath = fullPath.substring(prefixWithDot.length);
        this._setNestedValue(result, relativePath, value, options);
      }
    }

    return hasMatches ? result : undefined;
  };

  /**
   * 🏪 FULL STORE OBJECT BUILDER (Regular Mode)
   */
  private _buildObjectFromStore = (prefix: string, options: any): any => {
    const result: any = {};
    const prefixWithDot = prefix + '.';
    let hasMatches = false;

    // ✅ OPTIMIZED: Single pass through store
    for (const [fullPath, valueObj] of this.store.entries()) {
      if (fullPath.startsWith(prefixWithDot) && valueObj.value !== undefined) {
        hasMatches = true;
        const relativePath = fullPath.substring(prefixWithDot.length);
        
        let value = valueObj.value;
        
        // Apply cloning if requested
        if (options.clone && !isPrimitive(value)) {
          value = fastClone(value, options.clone);
        }
        
        this._setNestedValue(result, relativePath, value, options);
      }
    }

    return hasMatches ? result : undefined;
  };


  /**
   * Returns the entire store as a fully nested object.
   */
  toObject = (options: { clone?: 'none' | 'shallow' | 'deep' } = {}): any => {
    const result: any = {};
    // Use the main store for reconstruction
    for (const [fullPath, valueObj] of this.store.entries()) {
      if (valueObj.value !== undefined) {
        let value = valueObj.value;
        if (options.clone && !isPrimitive(value)) {
          value = fastClone(value, options.clone);
        }
        this._setNestedValue(result, fullPath, value, options);
      }
    }
    return result;
  };


  /**
   * 🏗️ NESTED VALUE SETTER - RECONSTRUCT OBJECT STRUCTURE
   */
  private _setNestedValue = (obj: any, path: string, value: any, options: any): void => {
    const parts = path.split('.');
    let current = obj;

    // Navigate/create nested structure
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      
      if (!(part in current)) {
        current[part] = {};
      } else if (typeof current[part] !== 'object' || current[part] === null) {
        // Overwrite non-object values with objects to continue nesting
        current[part] = {};
      }
      
      current = current[part];
    }

    // Set the final value
    const lastPart = parts[parts.length - 1];
    current[lastPart] = value;
  };
}


















// ==========================================
// 🚀 EXPORT THE MONSTER
// ==========================================

export const omniInstance = new OmniTurbo();
export const omni = new Proxy(omniInstance, {
  get(target, prop, receiver) {
    // If the property exists on the OmniTurbo instance, use it
    if (prop in target) {
      return Reflect.get(target, prop, receiver);
    }
    // Otherwise, check plugins
    if (typeof prop === "string" && target.plugins && prop in target.plugins) {
      return target.plugins[prop];
    }
    // Default behavior (undefined)
    return undefined;
  }
});

export default OmniTurbo;
// Export types for consumers
export type { TurboValueObject, TurboSubscriber, AlertConfigTurbo };