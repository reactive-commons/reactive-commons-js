import camelCase from 'lodash.camelcase'
import typescript from 'rollup-plugin-typescript2'
import builtins from 'builtin-modules';

const pkg = require('./package.json')
const dependencies = Object.keys(pkg.dependencies || {});

const libraryName = 'reactive-commons'

export default {
  input: `src/index.ts`,
  output: [
    { file: pkg.main, name: camelCase(libraryName), format: 'cjs', sourcemap: true },
    { file: pkg.module, format: 'esm', sourcemap: true }
  ],
  external: [
    ...dependencies,
    ...builtins,
  ],
  watch: {
    include: 'src/**'
  },
  plugins: [
    typescript({ useTsconfigDeclarationDir: true })
  ]
}
