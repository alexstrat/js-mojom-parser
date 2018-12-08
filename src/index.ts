import { Parser, Grammar } from 'nearley';
import { MojomNode } from './ast';
import * as grammar from './grammar';

export function getAST(sourceCode: string): MojomNode {
  const parser = new Parser(Grammar.fromCompiled(grammar));
  
  parser.feed(sourceCode);
  const results = parser.results;

  if(results.length == 0) throw new Error('Nothing to parse');
  if (results.length > 1) console.warn('Ambiguous');
  return results[0] as MojomNode;
}

export * from './ast';
