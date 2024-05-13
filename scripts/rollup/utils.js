import path from 'path';
import fs from 'fs';

import ts from 'rollup-plugin-typescript2';
import cjs from '@rollup/plugin-commonjs';
import replace from 'rollup-plugin-replace';

const pkgPath = path.resolve(__dirname, '../../packages');
const distPath = path.resolve(__dirname, '../../dist/node_modules');

export const resolvePkgPath = (pkgName, isDist) => {
  if (isDist) {
    return `${distPath}/${pkgName}`;
  }
  return `${pkgPath}/${pkgName}`;
};

// 解析packagejson
export const getPackageJson = (pkgName) => {
  try {
    const pkgPath = `${resolvePkgPath(pkgName)}/package.json`;

    const str = fs.readFileSync(pkgPath, { encoding: 'utf-8' });

    return JSON.parse(str);
  } catch {}
};

export const getBaseRollupPlugins = ({ alias = { __DEV__: true }, typescript = {} } = {}) => {
  return [replace(alias), cjs(), ts(typescript)];
};
