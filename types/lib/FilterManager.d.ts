declare namespace FFCreatorSpace {
  export type ShaderConfig = {
    name: string;
    paramsTypes: Record<string, unknown>;
    defaultParams: Record<string, unknown>;
    glsl: string;
  };

  export interface FilterManager {
    /** */
    getFilterByName(name: string): ShaderConfig | undefined;

    getRandomShader(): ShaderConfig;

    register(filter: ShaderConfig): this;
  }

  export const FilterManager: FilterManager;
}
