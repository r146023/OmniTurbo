import { getRelativePath, joinPath } from "../core/path";
import type { OmniPrivateSetter, OmniWriteToken } from "../types/privacy_types";
import type { OmniResult } from "../types/result_types";
import type { SetOptions } from "../types/options_types";

export type TokenSetFunction = (path: string, value: unknown, options?: SetOptions) => OmniResult;

/**
 * Creates the capability-style setter returned from privateSet operations.
 *
 * Usage:
 * ```ts
 * setter(false);              // writes root path
 * setter("child.key", true);  // writes root.child.key
 * ```
 */
export function createPrivateSetter(token: OmniWriteToken, setWithToken: TokenSetFunction): OmniPrivateSetter {
  function privateSetter(value: unknown, options?: SetOptions): OmniResult;
  function privateSetter(childPath: string, value: unknown, options?: SetOptions): OmniResult;
  function privateSetter(a: unknown, b?: unknown, c?: SetOptions): OmniResult {
    if (typeof a === "string" && arguments.length >= 2) {
      const relative = getRelativePath(token.rootPath, joinPath(token.rootPath, a));
      const path = relative ? joinPath(token.rootPath, relative) : token.rootPath;
      return setWithToken(path, b, { ...(c ?? {}), token });
    }
    return setWithToken(token.rootPath, a, { ...((b as SetOptions | undefined) ?? {}), token });
  }

  (privateSetter as OmniPrivateSetter).token = token;
  return privateSetter as OmniPrivateSetter;
}
