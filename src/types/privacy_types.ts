import type { OmniResult } from "./result_types";
import type { SetOptions } from "./options_types";

export interface OmniWriteToken {
  id: string;
  rootPath: string;
  owner?: string;
  canWriteChildren: boolean;
  created: number;
}

/**
 * ## OmniPrivateSetter
 *
 * The `OmniPrivateSetter` type represents a function that can be used to set values in the Omni
 * system while respecting privacy rules. It has two overloads:
 *
 * 1. The first overload allows setting a value at the root path or a specified path without
 *    providing a child path. It takes a value and optional set options, and returns an
 *    `OmniResult`.
 * 2. The second overload allows setting a value at a specific child path. It takes a child path, a
 *    value, and optional set options, and returns an `OmniResult`.
 *
 * Additionally, the `OmniPrivateSetter` has a `token` property of type `OmniWriteToken`, which
 * contains information about the write token associated with the setter, including its ID, root
 * path, owner, permissions for writing to child paths, and creation timestamp.
 */
export type OmniPrivateSetter = {
  (value: unknown, options?: SetOptions): OmniResult;
  (childPath: string, value: unknown, options?: SetOptions): OmniResult;
  token: OmniWriteToken;
};


/**
 * ## PrivacyRule
 *
 * The `PrivacyRule` interface defines the structure of a privacy rule in the Omni system. It
 * includes the following properties:
 *
 * - `rootPath`: A string representing the root path to which the privacy rule applies (e.g.,
 *   "user").
 * - `tokenId`: A string representing the unique identifier of the write token associated with this
 *   privacy rule.
 * - `owner` (optional): A string representing the owner of the privacy rule, if applicable.
 * - `canWriteChildren`: A boolean indicating whether the write token allows writing to child paths
 *   of the root path.
 * - `deletePolicy`: A string that specifies the delete policy for the root path, which can be one
 *   of "anyone", "owner", or "never". This policy determines who is allowed to delete the data at
 *   the root path.
 *
 * This interface is designed to provide a standardized way to represent privacy rules that govern
 * how data can be written and deleted in the Omni system, allowing for better management of data
 * access and permissions.
 *
 */
export interface PrivacyRule {
  rootPath: string;
  tokenId: string;
  owner?: string;
  canWriteChildren: boolean;
  deletePolicy: "anyone" | "owner" | "never";
}
