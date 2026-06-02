import type { OmniResult } from "./result_types";
import type { SetOptions } from "./options_types";

export interface OmniWriteToken {
  id: string;
  rootPath: string;
  owner?: string;
  canWriteChildren: boolean;
  created: number;
}

export type OmniPrivateSetter = {
  (value: unknown, options?: SetOptions): OmniResult;
  (childPath: string, value: unknown, options?: SetOptions): OmniResult;
  token: OmniWriteToken;
};

export interface PrivacyRule {
  rootPath: string;
  tokenId: string;
  owner?: string;
  canWriteChildren: boolean;
  deletePolicy: "anyone" | "owner" | "never";
}
