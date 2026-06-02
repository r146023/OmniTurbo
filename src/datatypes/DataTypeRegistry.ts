import type { OmniDataTypeDefinition, OmniDataTypeName } from "../types/datatype_types";

export class DataTypeRegistry {
  private types = new Map<string, OmniDataTypeDefinition>();

  register(definition: OmniDataTypeDefinition): void {
    if (!definition.name || typeof definition.name !== "string") {
      throw new Error("DataType definition requires a string name");
    }
    this.types.set(definition.name, definition);
  }

  registerMany(definitions: OmniDataTypeDefinition[]): void {
    for (const definition of definitions) this.register(definition);
  }

  get(name: OmniDataTypeName | undefined): OmniDataTypeDefinition | undefined {
    if (!name) return undefined;
    return this.types.get(name);
  }

  has(name: OmniDataTypeName): boolean {
    return this.types.has(name);
  }

  list(): OmniDataTypeDefinition[] {
    return Array.from(this.types.values());
  }
}
