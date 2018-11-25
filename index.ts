import { Grammars } from 'ebnf';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const grammar = readFileSync(resolve(__dirname, './grammar.ebnf'), 'utf8')
const parser = new Grammars.Custom.Parser(grammar, {});

export function getAST(codeSource: string) {
  return parser.getAST(codeSource);
};
