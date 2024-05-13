import { getPackageJson, resolvePkgPath, getBaseRollupPlugins } from './utils';

import generatePackageJson from 'rollup-plugin-generate-package-json';

const { name, module } = getPackageJson('react');
// 包
const pkgPath = resolvePkgPath(name);
// 产
const distPath = resolvePkgPath(name, 'isDist');

export default [
  {
    input: `${pkgPath}/${module}`,
    output: {
      file: `${distPath}/index.js`,
      name: 'index.js',
      format: 'umd',
    },
    plugins: [
      ...getBaseRollupPlugins(),
      generatePackageJson({
        inputFolder: pkgPath,
        outputFolder: distPath,
        baseContents: {
          name,
          description,
          version,
          main: 'index.js',
        },
      }),
    ],
    // external: ['react', 'react-dom'],
  },
  // jsx runtime
  {
    input: `${pkgPath}/src/jsx.ts`,
    output: [
      {
        file: `${distPath}/jsx-runtime.js`,
        name: 'jsx-runtime.js',
        format: 'umd',
      },
      {
        file: `${distPath}/jsx-dev-runtime.js`,
        name: 'jsx-dev-runtime.js',
        format: 'umd',
      },
    ],
    plugins: getBaseRollupPlugins(),
  },
];
