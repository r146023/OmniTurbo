export { Omni, Omni as OmniTurbo } from "./Omni";
export { default } from "./Omni";

export * from "./types/result_types";
export * from "./types/issue_types";
export * from "./types/schema_types";
export * from "./types/datatype_types";
export * from "./types/privacy_types";
export * from "./types/store_types";
export * from "./types/options_types";

export * from "./datatypes/DataTypeRegistry";
export * from "./schema/SchemaRegistry";
export * from "./privacy/PrivacyRegistry";
export * from "./aliases/AliasRegistry";




import { Omni } from "./Omni";

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