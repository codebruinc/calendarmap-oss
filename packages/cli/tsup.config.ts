import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs'],
  dts: false,
  clean: true,
  minify: false,
  splitting: false,
  target: 'node16',
  bundle: true,
  external: ['commander', 'papaparse', 'fs', 'process', 'path'],
  noExternal: ['@calendarmap/engine'],
});