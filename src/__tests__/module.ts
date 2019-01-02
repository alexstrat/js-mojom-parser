import './__utils__/toBeValidMojomAST';
import { getAST } from '../index';

describe('Module statement', () => {
  it('parse basic module def', () => {
    const ast = getAST(`
module fooo;
  `);
    expect(ast).toBeValidMojomAST();
    expect(ast).toMatchInlineSnapshot(`
Object {
  "body": Array [
    Object {
      "attributes": Array [],
      "namespace": Object {
        "name": Array [
          "fooo",
        ],
        "type": "Identifier",
      },
      "type": "ModuleStatement",
    },
  ],
  "type": "Mojom",
}
`);
  });

  it('parse dotted module def', () => {
    const ast = getAST(`
module fooo.bar.foo;
  `);
    expect(ast).toBeValidMojomAST();
    expect(ast).toMatchInlineSnapshot(`
Object {
  "body": Array [
    Object {
      "attributes": Array [],
      "namespace": Object {
        "name": Array [
          "fooo",
          "bar",
          "foo",
        ],
        "type": "Identifier",
      },
      "type": "ModuleStatement",
    },
  ],
  "type": "Mojom",
}
`);
  });

  it('parse attibutes module def', () => {
    const ast = getAST(`
    [Sync]module fooo.bar.foo;
    `)
    expect(ast).toBeValidMojomAST();
    expect(ast).toMatchInlineSnapshot(`
Object {
  "body": Array [
    Object {
      "attributes": Array [
        Object {
          "key": "Sync",
          "type": "Attribute",
          "value": true,
        },
      ],
      "namespace": Object {
        "name": Array [
          "fooo",
          "bar",
          "foo",
        ],
        "type": "Identifier",
      },
      "type": "ModuleStatement",
    },
  ],
  "type": "Mojom",
}
`);
  });

  it('parse attibutes with value module def', () => {
    const ast = getAST(`
    [Get="foo"]module fooo.bar.foo;
    `)
    expect(ast).toBeValidMojomAST();
    expect(ast).toMatchInlineSnapshot(`
Object {
  "body": Array [
    Object {
      "attributes": Array [
        Object {
          "key": "Get",
          "type": "Attribute",
          "value": Object {
            "kind": "string",
            "type": "Literal",
            "value": "foo",
          },
        },
      ],
      "namespace": Object {
        "name": Array [
          "fooo",
          "bar",
          "foo",
        ],
        "type": "Identifier",
      },
      "type": "ModuleStatement",
    },
  ],
  "type": "Mojom",
}
`);
  });
});
