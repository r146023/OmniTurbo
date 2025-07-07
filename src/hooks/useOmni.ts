import { useCallback, useSyncExternalStore, useState, useEffect, useMemo, useRef } from 'react';
import { omni } from '../OmniTurbo'; // Adjust path to your actual Omni file

/**
 * Type definitions for hooks 
 */
interface UseOmniOptions {
  defaultValue?: any;
  transform?: (value: any) => any;
  debounce?: number;
}

interface OmniBatchPaths {
  [key: string]: string;
}

/**
 * Modern React 18 hook that provides seamless Omni integration
 * 🚀 This recreates your beloved universal state management!
 * 
 * Arguments
 * ---------------
 * @param {string} path - Dot-notation path to the data (e.g., 'user.profile.name')
 * @param {UseOmniOptions} [options] - Advanced configuration options
 * 
 * Return
 * ---------------
 * @return {T} The value at the specified path, auto-updates on changes
 * 
 * Meta
 * ---------------
 * @since 06/04/2025 12:00:00
 * @category Omni Hooks
 * @version 2.0
 * 
 * @example
 * ```typescript
 * // Basic usage - exactly like your old system!
 * function UserProfile() {
 *   const userName = useOmni('user.name');
 *   const userEmail = useOmni('user.email');
 *   
 *   // Auto-updates when Omni data changes - zero boilerplate!
 *   return <div>Hello {userName} ({userEmail})</div>
 * }
 * 
 * // With default value
 * const theme = useOmni('ui.theme', { defaultValue: 'light' });
 * 
 * // With transformation
 * const uppercaseName = useOmni('user.name', {
 *   transform: (name) => name?.toUpperCase()
 * });
 * ```
 * 
 * @performance O(1) subscription management with React 18 optimizations
 * @reactive ✅ Auto-updates components when data changes
 * @throws {never} Returns undefined/defaultValue for missing paths
 */
export function useOmni<T = any>(
  path: string, 
  options: UseOmniOptions = {}
): T {
  const { defaultValue, transform, debounce } = options;
  
  // React 18's useSyncExternalStore for perfect sync with external store
  const rawValue = useSyncExternalStore(
    // Subscribe function - called when component mounts/path changes
    useCallback((callback) => {
      if (debounce) {
        let timeoutId: ReturnType<typeof setTimeout>;
        const debouncedCallback = () => {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => callback(), debounce);
        };
        return omni.subscribe(path, debouncedCallback);
      }
      
      return omni.subscribe(path, callback);
    }, [path, debounce]),
    
    // Get snapshot function - returns current value
    useCallback(() => {
      return omni.get(path,{asObject:true});
    }, [path]),
    
    // Server snapshot (SSR) - returns safe default
    () => defaultValue
  );
  
  // Apply transformations and defaults
  return useMemo(() => {
    const value = rawValue ?? defaultValue;
    return transform ? transform(value) : value;
  }, [rawValue, defaultValue, transform]);
}

/**
 * Hook for setting Omni values with optimized re-renders
 * 
 * Arguments
 * ---------------
 * None - returns a stable setter function
 * 
 * Return
 * ---------------
 * @return {Function} Stable setter function for updating Omni values
 * 
 * Meta
 * ---------------
 * @since 06/04/2025 12:00:00
 * @category Omni Hooks
 * @version 2.0
 * 
 * @example
 * ```typescript
 * function UserEditor() {
 *   const setOmni = useOmniSetter();
 *   
 *   const handleSave = () => {
 *     setOmni('user.name', 'New Name');
 *     setOmni('user.lastUpdated', new Date());
 *   };
 * }
 * ```
 * 
 * @performance O(1) - Stable reference, no unnecessary re-renders
 * @reactive ✅ Updates trigger re-renders in subscribed components
 */
export function useOmniSetter() {
  return useCallback((path: string, value: any) => {
    omni.set(path, value);
  }, []); // Empty deps - omni is singleton, stable reference
}

/**
 * Combined hook for both getting and setting Omni values
 * 🎯 Perfect for form inputs and interactive components!
 * 
 * Arguments
 * ---------------
 * @param {string} path - Dot-notation path to the data
 * @param {T} [defaultValue] - Default value if path doesn't exist
 * @param {UseOmniOptions} [options] - Advanced configuration options
 * 
 * Return
 * ---------------
 * @return {[T, (value: T) => void]} Tuple of [value, setter] like useState
 * 
 * Meta
 * ---------------
 * @since 06/04/2025 12:00:00
 * @category Omni Hooks
 * @version 2.0
 * 
 * @example
 * ```typescript
 * function Counter() {
 *   const [count, setCount] = useOmniState('counter', 0);
 *   
 *   return (
 *     <div>
 *       <p>Count: {count}</p>
 *       <button onClick={() => setCount(count + 1)}>
 *         Increment
 *       </button>
 *     </div>
 *   );
 * }
 * 
 * // Works with complex objects too
 * function UserForm() {
 *   const [user, setUser] = useOmniState('user.profile', {
 *     name: '',
 *     email: ''
 *   });
 *   
 *   return (
 *     <form>
 *       <input 
 *         value={user.name}
 *         onChange={(e) => setUser({ ...user, name: e.target.value })}
 *       />
 *     </form>
 *   );
 * }
 * ```
 * 
 * @performance O(1) with React 18 optimizations
 * @reactive ✅ Both getter and setter trigger appropriate re-renders
 */
export const useOmniState = <T = any>(
  path: string,
  defaultValue?: T
): [T, (newValue: T) => void] => {
  // ✅ Get initial value with fallback to default
  const getInitialValue = useCallback(() => {
    var value = omni.get(path);
    if(value == null){
      value = omni.getObj(path);
    }
    
    console.log(`🔍 useOmniState(${path}) initial value:`, value);
    return value !== undefined ? value : defaultValue;
  }, [path, defaultValue]);

  const [value, setValue] = useState<T>(getInitialValue);
  const isUnmountedRef = useRef(false);

  // ✅ Setter function that updates OmniTurbo
  const setOmniValue = useCallback((newValue: T) => {
    console.log(`🔥 useOmniState(${path}) setting:`, newValue);
    omni.set(path, newValue);
  }, [path]);

  // ✅ Subscribe to changes with proper cleanup
  useEffect(() => {
    isUnmountedRef.current = false;
    
    console.log(`🔥 useOmniState(${path}) subscribing...`);
    
    // Set initial value if it doesn't exist
    if (omni.get(path) === undefined && defaultValue !== undefined) {
      console.log(`🔥 useOmniState(${path}) setting default:`, defaultValue);
      omni.set(path, defaultValue);
    }

    // Subscribe to exact path changes
    const unsubscribe = omni.subscribe(path, (changedPath: string, newValue: T) => {
      console.log(`🔥 useOmniState(${path}) received update:`, { changedPath, newValue });
      
      // Only update if component is still mounted and path matches exactly
      if (!isUnmountedRef.current && changedPath === path) {
        setValue(newValue);
      }
    });

    // Also subscribe to global changes that might affect this path
    const unsubscribeGlobal = omni.subscribeGlobal((changedPath: string, newValue: any) => {
      // Only update if the exact path changed
      if (!isUnmountedRef.current && changedPath === path) {
        console.log(`🔥 useOmniState(${path}) global update:`, newValue);
        setValue(newValue);
      }
    });

    // Cleanup function
    return () => {
      console.log(`🔥 useOmniState(${path}) unsubscribing...`);
      isUnmountedRef.current = true;
      unsubscribe();
      unsubscribeGlobal();
    };
  }, [path, defaultValue]);

  // ✅ Update local state if path value changes externally
  useEffect(() => {
    const currentValue = omni.get(path);
    if (currentValue !== undefined && currentValue !== value) {
      console.log(`🔥 useOmniState(${path}) external change detected:`, currentValue);
      setValue(currentValue);
    }
  }, [path, value]);

  return [value, setOmniValue];
};

/**
 * Batch subscription hook for multiple paths
 * ⚡ Subscribe to multiple Omni paths with a single hook!
 * 
 * Arguments
 * ---------------
 * @param {OmniBatchPaths} paths - Object mapping result keys to Omni paths
 * @param {UseOmniOptions} [options] - Shared options for all subscriptions
 * 
 * Return
 * ---------------
 * @return {Object} Object with same keys as input, values auto-update
 * 
 * Meta
 * ---------------
 * @since 06/04/2025 12:00:00
 * @category Omni Hooks
 * @version 2.0
 * 
 * @example
 * ```typescript
 * function UserDashboard() {
 *   const data = useOmniBatch({
 *     user: 'user.profile',
 *     theme: 'ui.theme',
 *     notifications: 'user.notifications',
 *     settings: 'user.settings'
 *   });
 *   
 *   // All these auto-update when their respective Omni paths change!
 *   return (
 *     <div className={`theme-${data.theme}`}>
 *       <h1>Welcome {data.user?.name}!</h1>
 *       <p>Notifications: {data.notifications?.length}</p>
 *       <Settings config={data.settings} />
 *     </div>
 *   );
 * }
 * 
 * // With default values
 * const data = useOmniBatch({
 *   theme: 'ui.theme',
 *   locale: 'ui.locale'
 * }, { defaultValue: 'light' }); // Applied to all paths
 * ```
 * 
 * @performance O(n) where n is number of paths, but optimized subscriptions
 * @reactive ✅ Component re-renders when ANY subscribed path changes
 */
export function useOmniBatch<T extends OmniBatchPaths>(
  paths: T,
  options: UseOmniOptions = {}
): { [K in keyof T]: any } {
  const result = {} as { [K in keyof T]: any };
  
  // Subscribe to each path individually
  for (const [key, path] of Object.entries(paths)) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    result[key as keyof T] = useOmni(path, options);
  }
  
  return result;
}

/**
 * Advanced hook for computed values based on multiple Omni paths
 * 🧮 Create derived state that auto-updates when dependencies change!
 * 
 * Arguments
 * ---------------
 * @param {Function} computeFn - Function that computes the result based on dependencies
 * @param {string[]} dependencies - Array of Omni paths that trigger recomputation
 * @param {any[]} [extraDeps] - Additional React dependencies for the computation
 * 
 * Return
 * ---------------
 * @return {T} Computed value that updates when dependencies change
 * 
 * Meta
 * ---------------
 * @since 06/04/2025 12:00:00
 * @category Omni Hooks - Advanced
 * @version 2.0
 * 
 * @example
 * ```typescript
 * function UserStats() {
 *   // Compute full name when first/last name changes
 *   const fullName = useOmniComputed(
 *     () => {
 *       const first = omni.get('user.firstName');
 *       const last = omni.get('user.lastName');
 *       return `${first} ${last}`.trim();
 *     },
 *     ['user.firstName', 'user.lastName']
 *   );
 *   
 *   // Complex computation with multiple data sources
 *   const userScore = useOmniComputed(
 *     () => {
 *       const points = omni.get('user.points') || 0;
 *       const level = omni.get('user.level') || 1;
 *       const multiplier = omni.get('game.multiplier') || 1;
 *       return points * level * multiplier;
 *     },
 *     ['user.points', 'user.level', 'game.multiplier']
 *   );
 *   
 *   return <div>{fullName}: {userScore} points</div>;
 * }
 * ```
 * 
 * @performance O(n) where n is number of dependencies, memoized computation
 * @reactive ✅ Recomputes only when specified dependencies change
 */
export function useOmniComputed<T>(
  computeFn: () => T,
  dependencies: string[],
  extraDeps: any[] = []
): T {
  // Subscribe to all dependency paths
  const depValues = dependencies.map(path => useOmni(path));
  
  // Memoize the computation
  return useMemo(() => {
    return computeFn();
  }, [...depValues, ...extraDeps]);
}

/**
 * Hook for Omni operations with loading and error states
 * 💪 Production-ready hook with full error handling!
 * 
 * Arguments
 * ---------------
 * @param {string} path - Omni path to manage
 * @param {UseOmniOptions & { async?: boolean }} [options] - Configuration options
 * 
 * Return
 * ---------------
 * @return {Object} Object with value, loading, error states and actions
 * 
 * Meta
 * ---------------
 * @since 06/04/2025 12:00:00
 * @category Omni Hooks - Advanced
 * @version 2.0
 * 
 * @example
 * ```typescript
 * function UserProfile() {
 *   const {
 *     value: user,
 *     loading,
 *     error,
 *     setValue,
 *     refresh,
 *     clear
 *   } = useOmniResource('user.profile');
 *   
 *   if (loading) return <Spinner />;
 *   if (error) return <Error message={error.message} />;
 *   
 *   return (
 *     <div>
 *       <h1>{user?.name}</h1>
 *       <button onClick={() => setValue({ ...user, name: 'New Name' })}>
 *         Update Name
 *       </button>
 *       <button onClick={refresh}>Refresh</button>
 *       <button onClick={clear}>Clear</button>
 *     </div>
 *   );
 * }
 * ```
 * 
 * @performance O(1) with optimized state management
 * @reliability ✅ Full error handling and loading states
 */
export function useOmniResource<T>(
  path: string,
  options: UseOmniOptions & { async?: boolean } = {}
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const value = useOmni<T>(path, options);
  const setValue = useOmniSetter();
  
  const setValueSafe = useCallback(async (newValue: T) => {
    try {
      setLoading(true);
      setError(null);
      
      if (options.async) {
        // Handle async operations
        await new Promise(resolve => {
          setValue(path, newValue);
          setTimeout(resolve, 0); // Next tick
        });
      } else {
        setValue(path, newValue);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [path, setValue, options.async]);
  
  const refresh = useCallback(() => {
    setError(null);
    // Trigger a re-fetch or validation if needed
    const currentValue = omni.get(path);
    setValue(path, currentValue);
  }, [path, setValue]);
  
  const clear = useCallback(() => {
    setValue(path, undefined);
    setError(null);
  }, [path, setValue]);
  
  return {
    value,
    loading,
    error,
    setValue: setValueSafe,
    refresh,
    clear
  };
}

/**
 * Hook for Omni alerts - subscribe to conditional notifications
 * 🚨 Your unique alert system made React-friendly!
 * 
 * Arguments
 * ---------------
 * @param {string} path - Omni path to watch
 * @param {Function} callback - Function to call when alert triggers
 * @param {Object} [options] - Alert configuration options
 * 
 * Return
 * ---------------
 * @return {Function} Cleanup function to remove the alert
 * 
 * Meta
 * ---------------
 * @since 06/04/2025 12:00:00
 * @category Omni Hooks - Unique Features
 * @version 2.0
 * 
 * @example
 * ```typescript
 * function ShoppingCart() {
 *   const [showFreeShipping, setShowFreeShipping] = useState(false);
 *   
 *   // Alert when cart total exceeds $100
 *   useOmniAlert('cart.total', (newValue, oldValue) => {
 *     if (newValue > 100 && oldValue <= 100) {
 *       setShowFreeShipping(true);
 *     }
 *   }, {
 *     condition: (newValue, oldValue) => newValue > oldValue,
 *     throttle: 1000
 *   });
 *   
 *   return (
 *     <div>
 *       {showFreeShipping && <div>🎉 Free shipping unlocked!</div>}
 *     </div>
 *   );
 * }
 * ```
 * 
 * @performance O(1) - Efficient alert system
 * @unique ✅ Feature not available in Redux/Zustand
 */
export function useOmniAlert(
  path: string,
  callback: (newValue: any, oldValue: any) => void,
  options: {
    condition?: (newValue: any, oldValue: any) => boolean;
    throttle?: number;
    once?: boolean;
  } = {}
) {
  useEffect(() => {
    const cleanup = omni.alert(path, callback, options);
    return cleanup;
  }, [path, callback, options.condition, options.throttle, options.once]);
}

/**
 * Hook for waiting on multiple Omni values
 * ⏳ Your unique async coordination made React-friendly!
 * 
 * Arguments
 * ---------------
 * @param {string[]} paths - Array of paths to wait for
 * @param {any[]} [exclude] - Values to exclude (treat as "not ready")
 * 
 * Return
 * ---------------
 * @return {Object} Object with ready state and resolved values
 * 
 * Meta
 * ---------------
 * @since 06/04/2025 12:00:00
 * @category Omni Hooks - Unique Features
 * @version 2.0
 * 
 * @example
 * ```typescript
 * function DataDependentComponent() {
 *   const { ready, values } = useOmniWait(['api.user', 'api.settings']);
 *   
 *   if (!ready) {
 *     return <div>Loading dependencies...</div>;
 *   }
 *   
 *   return (
 *     <div>
 *       <h1>Welcome {values['api.user'].name}!</h1>
 *       <Settings config={values['api.settings']} />
 *     </div>
 *   );
 * }
 * ```
 * 
 * @performance O(n) where n is number of paths
 * @unique ✅ Feature not available in Redux/Zustand
 */
// export function useOmniWait(
//   paths: string[],
//   exclude: any[] = [undefined, null],
//   debugName?: string
// ) {
//   const [ready, setReady] = useState(false);
//   const [values, setValues] = useState<Record<string, any>>({});
//   const [loading, setLoading] = useState(true);
  
//   const stablePaths = useMemo(() => paths, [JSON.stringify(paths)]);
//   const stableExclude = useMemo(() => exclude, [JSON.stringify(exclude)]);
  
//   useEffect(() => {
//     let mounted = true;
    
//     const checkValues = () => {
//       if (!mounted) return;
      
//       const result: Record<string, any> = {};
//       let allReady = true;
      
//       for (const path of stablePaths) {
//         // ✅ Try direct value first
//         let value = omni.get(path);
        
//         // ✅ If no direct value, try object reconstruction
//         if (value === undefined && omni.hasChildren?.(path)) {
//           value = omni.getObj?.(path);
//           console.log(`🔍 useOmniWaitSmart(${debugName || path}) - Using object value:`, value);
//         }
        
//         // ✅ Check if value is excluded
//         if (value === undefined || stableExclude.includes(value)) {
//           allReady = false;
//           break;
//         }
        
//         result[path] = value;
//       }
      
//       if (allReady && mounted) {
//         console.log(`✅ useOmniWaitSmart(${debugName || 'paths'}) - All ready:`, result);
//         setValues(result);
//         setReady(true);
//         setLoading(false);
//       } else if (mounted) {
//         console.log(`⏳ useOmniWaitSmart(${debugName || 'paths'}) - Still waiting...`);
//       }
//     };
    
//     // ✅ Initial check
//     checkValues();
    
//     // ✅ Set up monitoring
//     const unsubscribe = omni.subscribeGlobal?.((changedPath: string) => {
//       const relevant = stablePaths.some(path => 
//         changedPath === path || 
//         changedPath.startsWith(path + '.') ||
//         path.startsWith(changedPath + '.')
//       );
      
//       if (relevant) {
//         console.log(`🔄 useOmniWaitSmart(${debugName || 'paths'}) - Change detected:`, changedPath);
//         setTimeout(checkValues, 10); // Small delay to ensure consistency
//       }
//     });
    
//     return () => {
//       mounted = false;
//       unsubscribe?.();
//     };
//   }, [stablePaths, stableExclude, debugName]);
  
//   return { ready, values, loading };
// }

export function useOmniWait(
  paths: string[],
  exclude: any[] = [undefined, null],
  debugName?: string
) {
  const [ready, setReady] = useState(false);
  const [values, setValues] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  
  const stablePaths = useMemo(() => paths, [JSON.stringify(paths)]);
  const stableExclude = useMemo(() => exclude, [JSON.stringify(exclude)]);
  
  const isWaitingRef = useRef(false);
  const mountedRef = useRef(true);
  
  useEffect(() => {
    if (isWaitingRef.current) return;
    
    setReady(false);
    setLoading(true);
    setValues({});
    
    console.log(`🎯 useOmniWait(${debugName}) - Targeted subscription for:`, stablePaths);
    
    isWaitingRef.current = true;
    
    const checkValues = () => {
      if (!mountedRef.current) return;
      
      const result: Record<string, any> = {};
      let allReady = true;
      
      for (const path of stablePaths) {
        // ✅ Try direct value first
        let value = omni.get(path);
        
        // ✅ If no direct value, try object reconstruction
        if (value === undefined && omni.hasChildren?.(path)) {
          value = omni.getObj?.(path);
        }
        
        // ✅ Check if value is excluded
        if (value === undefined || stableExclude.includes(value)) {
          allReady = false;
          break;
        }
        
        result[path] = value;
      }
      
      if (allReady && mountedRef.current) {
        console.log(`✅ useOmniWait(${debugName}) - All paths ready:`, result);
        setValues(result);
        setReady(true);
        setLoading(false);
        isWaitingRef.current = false;
      }
    };
    
    // ✅ PERFORMANCE FIX: Subscribe to SPECIFIC paths only!
    const unsubscribers: (() => void)[] = [];
    
    for (const targetPath of stablePaths) {
      // ✅ Subscribe to exact path
      const unsubExact = omni.subscribe?.(targetPath, (changedPath: string, newValue: any) => {
        if (changedPath === targetPath) {
          console.log(`🎯 useOmniWait(${debugName}) - Direct change:`, changedPath);
          setTimeout(checkValues, 10);
        }
      });
      
      if (unsubExact) unsubscribers.push(unsubExact);
      
      // ✅ Subscribe to child paths (for object reconstruction)
      const unsubChildren = omni.subscribe?.(targetPath + '.*', (changedPath: string, newValue: any) => {
        if (changedPath.startsWith(targetPath + '.')) {
          console.log(`🎯 useOmniWait(${debugName}) - Child change:`, changedPath);
          setTimeout(checkValues, 10);
        }
      });
      
      if (unsubChildren) unsubscribers.push(unsubChildren);
    }
    
    // ✅ Initial check
    checkValues();
    
    // ✅ Cleanup all targeted subscriptions
    return () => {
      console.log(`🧹 useOmniWait(${debugName}) - Cleaning up ${unsubscribers.length} targeted subscriptions`);
      unsubscribers.forEach(unsub => unsub());
      isWaitingRef.current = false;
    };
  }, [stablePaths, stableExclude, debugName]);
  
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      isWaitingRef.current = false;
    };
  }, []);
  
  return { ready, values, loading };
}


/**
 * 🎯 RECOMMENDED - SINGLE PATH WAIT (MOST STABLE)
 */
export function useOmniWaitSingle(
  path: string,
  exclude: any[] = [undefined, null],
  debugName?: string
) {
  const [ready, setReady] = useState(false);
  const [value, setValue] = useState<any>(undefined);
  
  useEffect(() => {
    console.log(`🔄 useOmniWaitSingle(${debugName || path}) - Starting wait`);
    
    setReady(false);
    setValue(undefined);
    
    omni.waitForValues([path], exclude)
      .then((resolvedValues: Record<string, any>) => {
        console.log(`✅ useOmniWaitSingle(${debugName || path}) - Ready:`, resolvedValues[path]);
        setValue(resolvedValues[path]);
        setReady(true);
      })
      .catch((error) => {
        console.error(`❌ useOmniWaitSingle(${debugName || path}) - Error:`, error);
      });
  }, [path, JSON.stringify(exclude), debugName]);
  
  return { ready, value };
}


















/**
 * Export type definitions for consumers
 */
export type { UseOmniOptions, OmniBatchPaths };