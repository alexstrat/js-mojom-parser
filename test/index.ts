import { getAST } from '../index';
import { readFileSync } from 'fs';
import { resolve } from 'path'; 
import { inspect } from 'util';
const { asTree } = require('treeify') as { asTree: (any) => string };

const codeSource = readFileSync(resolve(__dirname, './example.mojom'), 'utf8');
console.log(inspect(getAST(codeSource), { showHidden: false, depth: null}));