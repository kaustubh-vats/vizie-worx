import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'
import terser from '@rollup/plugin-terser'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import babel from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';

const packageJson = require('./package.json')

export default [
  {
    preserveModule: true,
    input: 'src/index.ts',
    output: [
      {
        file: packageJson.main,
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      typescript(),
      peerDepsExternal(),
      resolve(),
      commonjs(),
      terser(),
      babel({
        babelHelpers: 'bundled'
      }),
      postcss({
        modules: true
      })
    ],
    external: [ 'react' ]
  },
  {
    input: 'dist/cjs/types/src/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts.default()],
    external: [/\.css$/],
  },
]