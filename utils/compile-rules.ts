import { Grammars } from 'ebnf';
import { readFileSync, writeFileSync } from 'fs';
import { inspect } from 'util';
import { resolve } from 'path';

const grammar = readFileSync(resolve(__dirname, '../grammar.ebnf'), 'utf8')

//Grammars.W3C.parser.debug = true;
const rules = Grammars.Custom.getRules(grammar);

const p = new Grammars.Custom.Parser(grammar, {});

writeFileSync(resolve(__dirname, '../rules.js'), `module.exports = ${inspect(rules, false, 20, false)};`)
