import * as path from "path";
// import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs';
// import { babel } from '@rollup/plugin-babel';
import { terser } from "rollup-plugin-terser";

const config = {
  // treeshake: {
  //   moduleSideEffects: 'no-external',
  //   propertyReadSideEffects: false,
  //   tryCatchDeoptimization: false
  // },
  input: {
    index: path.resolve(__dirname, 'lib/index.js'),
  },
  external: [
    ...Object.keys(require('./package.json').dependencies)
  ],
  output: {
    dir: path.resolve(__dirname, 'dist/'),
    entryFileNames: `[name].js`,
    chunkFileNames: 'chunks/dep-[hash].js',
    exports: 'default',
    esModule: true,
    format: 'cjs',
    externalLiveBindings: false,
    freeze: false,
  },
  plugins: [
    commonjs({
      extensions: ['.js'],
    }),
    terser(),
  ],
}

export default config
