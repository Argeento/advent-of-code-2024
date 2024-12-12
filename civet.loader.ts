import { plugin, file, write } from 'bun';
import lodash from 'lodash';

await plugin({
  name: 'AoC Civet loader',
  async setup(builder) {
    const { compile } = await import('@danielx/civet');

    const utilsSrc = await file('./src/utils.civet').text();
    const utilsExports = getExports(utilsSrc);

    const lodashExports = Object.keys(lodash);
    const autoDts = createAutoImportDts(utilsExports, lodashExports);

    await write('./src/auto-import.d.ts', autoDts);

    return builder.onLoad({ filter: /\.civet$/ }, async ({ path }) => {
      let source = await file(path).text();

      source =
        `input from ./input.txt
{ ${utilsExports.join(', ')} } from ../utils.civet
{ ${lodashExports.join(', ')} } from lodash

` + source;

      return {
        contents: await compile(source),
        loader: 'tsx',
      };
    });
  },
});

function getExports(source: string) {
  const regex = /export\s+\{.*?as\s+(\w+)\s*\}|\bexport\s+function\s+(\w+)/g;

  const exports: string[] = [];

  let match;
  while ((match = regex.exec(source)) !== null) {
    exports.push(match[1] || match[2]);
  }

  exports.push('memo');

  return exports;
}

function createAutoImportDts(utilsExports: string[], lodashExports: string[]) {
  return `import * as utils from "./utils.civet"
import lodash from "lodash"

declare global {
  // Utils
${utilsExports.map((e) => `  const ${e}: typeof utils.${e}`).join(';\n')}

  // Lodash
${lodashExports.map((e) => `  const ${e}: typeof lodash.${e}`).join(';\n')}
}

export {}`;
}
