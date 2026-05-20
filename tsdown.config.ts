import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/countries.ts',
    'src/locations.ts',
    'src/states-ansi.ts',
    'src/timezones.ts',
  ],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  target: 'node22',
  sourcemap: true,
});
