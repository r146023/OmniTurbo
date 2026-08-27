export { Omni, Omni as OmniTurbo } from "./Omni.js";
export { default } from "./Omni.js";

export * from "./types/result_types.js";
export * from "./types/issue_types.js";
export * from "./types/schema_types.js";
export * from "./types/datatype_types.js";
export * from "./types/privacy_types.js";
export * from "./types/store_types.js";
export * from "./types/options_types.js";

export * from "./datatypes/DataTypeRegistry.js";
export * from "./schema/SchemaRegistry.js";
export * from "./privacy/PrivacyRegistry.js";
export * from "./aliases/AliasRegistry.js";




import { Omni } from "./Omni.js";

declare global {
  // eslint-disable-next-line no-var
  var __OMNITURBO_SINGLETON__: Omni | undefined;

  // eslint-disable-next-line no-var
  var __OMNITURBO_PROXY__: Omni | undefined;
}

function ensureOmni(): Omni {
  return globalThis.__OMNITURBO_SINGLETON__ ??= new Omni();
}

export const omni: Omni =
  globalThis.__OMNITURBO_PROXY__ ??=
    new Proxy({} as Omni, {
      get(_target, prop, receiver) {
        const instance = ensureOmni();
        const value = Reflect.get(instance, prop, receiver);

        if (typeof value === "function") {
          return value.bind(instance);
        }

        return value;
      },

      set(_target, prop, value, receiver) {
        const instance = ensureOmni();
        return Reflect.set(instance, prop, value, receiver);
      },

      has(_target, prop) {
        return prop in ensureOmni();
      },
    });

export const omniTurbo = omni;

export function getOmni(): Omni {
  return ensureOmni();
}

export function setOmni(instance: Omni): Omni {
  globalThis.__OMNITURBO_SINGLETON__ = instance;
  return instance;
}

export function resetOmni(): Omni {
  globalThis.__OMNITURBO_SINGLETON__ = new Omni();
  return globalThis.__OMNITURBO_SINGLETON__;
}