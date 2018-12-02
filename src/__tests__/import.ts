import { getAST } from '../index';

describe('Import statements', () => {
  it('single statement', () => {
    const mojo = `
import "foo";
    `;
    expect(getAST(mojo)).toMatchInlineSnapshot(`
Object {
  "body": Array [
    Object {
      "filename": "foo",
      "type": "ImportStatement",
    },
  ],
  "type": "Mojom",
}
`);
  });

  it('double statement', () => {
    const mojo = `
import "foo";

import "bar";
    `;
    expect(getAST(mojo)).toMatchInlineSnapshot(`
Object {
  "body": Array [
    Object {
      "filename": "foo",
      "type": "ImportStatement",
    },
    Object {
      "filename": "bar",
      "type": "ImportStatement",
    },
  ],
  "type": "Mojom",
}
`);
  });
});
