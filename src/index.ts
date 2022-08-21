#!/usr/bin/env node

const type = process.argv[2];
const fs = require('fs');
if (!fs.existsSync('./esb')) {
  fs.mkdirSync('./esb');
}
if (type == 'service') {
  fs.copyFileSync(
    './node_modules/ergonomic-service-bindings/assets/service-types.ts',
    './esb/service.types.ts'
  );
  fs.copyFileSync(
    './node_modules/ergonomic-service-bindings/assets/service-wrapper.ts',
    './esb/service.wrapper.ts'
  );
  require('esbuild')
    .build({
      entryPoints: ['./esb/service.wrapper.ts'],
      bundle: true,
      outfile: 'esb/index.js',
      platform: 'neutral'
    })
    .catch(() => process.exit(1));
} else if (type == 'consumer') {
  const toml = require('toml');
  const data = toml.parse(fs.readFileSync('./wrangler.toml'));
  fs.copyFileSync(
    './node_modules/ergonomic-service-bindings/assets/client-wrapper.ts',
    './esb/client.wrapper.ts'
  );
  require('esbuild')
    .build({
      entryPoints: ['./esb/client.wrapper.ts'],
      bundle: true,
      outfile: 'esb/index.js',
      platform: 'neutral',
      define: {
        BINDING_LIST: JSON.stringify(data.services.map((s) => s.binding))
      }
    })
    .catch(() => process.exit(1));
}
