import { getAST } from '../index';

describe('Module statement', () => {
  it('parse basic module def', () => {
    expect(
      getAST(`
module fooo;
    `)
    ).toMatchInlineSnapshot(`
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
    expect(
      getAST(`
module fooo.bar.foo;
    `)
    ).toMatchInlineSnapshot(`
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
    expect(
      getAST(`
[Sync]module fooo.bar.foo;
    `)
    ).toMatchInlineSnapshot(`
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
    expect(
      getAST(`
[Get="foo"]module fooo.bar.foo;
    `)
    ).toMatchInlineSnapshot(`
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
