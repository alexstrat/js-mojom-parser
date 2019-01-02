import { resolve } from 'path';
import * as TJS from 'typescript-json-schema';
import { matchers } from 'jest-json-schema';

expect.extend(matchers);

const program = TJS.getProgramFromFiles([resolve(__dirname, '../../ast.ts')], {
  strictNullChecks: true,
});
const schema = TJS.generateSchema(program, 'MojomNode');


declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidMojomAST(): CustomMatcherResult;
    }
  }
}

expect.extend({
  // @ts-ignore
  toBeValidMojomAST: (node: object) => matchers.toMatchSchema(node, schema),
});
