import type { OmniTimelineAction, TimelineEntry } from "../types/store_types";

export class Timeline {
  private entries: TimelineEntry[] = [];
  private counter = 0;

  enabled = true;
  maxSize = 1000;

  add(path: string, oldValue: unknown, newValue: unknown, action: OmniTimelineAction): void {
    if (!this.enabled) return;
    this.entries.push({ timestamp: Date.now(), path, oldValue, newValue, action, index: ++this.counter });
    while (this.entries.length > this.maxSize) this.entries.shift();
  }

  list(): TimelineEntry[] {
    return [...this.entries];
  }

  clear(): void {
    this.entries = [];
  }
}
