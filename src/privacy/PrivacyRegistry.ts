import { generateFastId } from "../core/ids";
import { isChildPath, normalizePath } from "../core/path";
import type { OmniIssue } from "../types/issue_types";
import type { PrivacyRule, OmniWriteToken } from "../types/privacy_types";

export class PrivacyRegistry {
  private rules = new Map<string, PrivacyRule>();

  createRule(rootPath: string, options: { owner?: string; canWriteChildren?: boolean; deletePolicy?: "anyone" | "owner" | "never" } = {}): OmniWriteToken {
    const normalized = normalizePath(rootPath);
    const token: OmniWriteToken = {
      id: generateFastId("token"),
      rootPath: normalized,
      owner: options.owner,
      canWriteChildren: options.canWriteChildren ?? true,
      created: Date.now(),
    };

    this.rules.set(normalized, {
      rootPath: normalized,
      tokenId: token.id,
      owner: options.owner,
      canWriteChildren: token.canWriteChildren,
      deletePolicy: options.deletePolicy ?? "owner",
    });

    return token;
  }

  getRuleForPath(path: string): PrivacyRule | undefined {
    const normalized = normalizePath(path);
    const rules = Array.from(this.rules.values())
      .filter((rule) => isChildPath(rule.rootPath, normalized))
      .sort((a, b) => b.rootPath.length - a.rootPath.length);
    return rules[0];
  }

  canWrite(path: string, token?: OmniWriteToken): { allowed: boolean; issue?: OmniIssue } {
    const normalized = normalizePath(path);
    const rule = this.getRuleForPath(normalized);
    if (!rule) return { allowed: true };

    const isRoot = rule.rootPath === normalized;
    const validToken = token?.id === rule.tokenId;
    const childAllowed = isRoot || rule.canWriteChildren;

    if (validToken && childAllowed) return { allowed: true };

    return {
      allowed: false,
      issue: {
        code: "OMNI_PRIVATE_PATH",
        severity: "error",
        path: normalized,
        message: `Path '${normalized}' is private${rule.owner ? ` to ${rule.owner}` : ""}. Use the private setter returned when the path was created.`,
        source: "privacy",
        expected: "valid write token",
        received: token?.id ?? "none",
      },
    };
  }

  canDelete(path: string, token?: OmniWriteToken): { allowed: boolean; issue?: OmniIssue } {
    const normalized = normalizePath(path);
    const rule = this.getRuleForPath(normalized);
    if (!rule) return { allowed: true };
    if (rule.deletePolicy === "anyone") return { allowed: true };
    if (rule.deletePolicy === "owner" && token?.id === rule.tokenId) return { allowed: true };

    return {
      allowed: false,
      issue: {
        code: "OMNI_PRIVATE_DELETE_DENIED",
        severity: "error",
        path: normalized,
        message: `Path '${normalized}' cannot be deleted without its owner token.`,
        source: "privacy",
        expected: rule.deletePolicy,
        received: token?.id ?? "none",
      },
    };
  }

  removeRule(rootPath: string): void {
    this.rules.delete(normalizePath(rootPath));
  }

  list(): PrivacyRule[] {
    return Array.from(this.rules.values());
  }
}
