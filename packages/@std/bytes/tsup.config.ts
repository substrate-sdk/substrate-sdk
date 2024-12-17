import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: {
      index: 'src/mod.ts',
    },
    outDir: 'dist/esm',
    format: ['esm'],
    dts: true,
    sourcemap: true,
    clean: true,
  },
  {
    entry: {
      index: 'src/mod.ts',
    },
    outDir: 'dist/commonjs',
    format: ['cjs'],
    dts: true,
    sourcemap: true,
    clean: true,
  },
])
