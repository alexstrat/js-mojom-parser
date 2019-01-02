import './__utils__/toBeValidMojomAST';
import { getAST } from '../index';

describe('Import statements', () => {
  it('single statement', () => {
    const ast = getAST(`
import "foo";
    `)
    expect(ast).toBeValidMojomAST();
    expect(ast).toMatchInlineSnapshot(`
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
    const ast = getAST(`
    import "foo";
    
    import "bar";
    `);
    expect(ast).toBeValidMojomAST();
    expect(ast).toMatchInlineSnapshot(`
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
