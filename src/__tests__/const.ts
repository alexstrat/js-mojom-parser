import { getAST } from '../index';

describe('Const definition', () => {
  it('parse w/ primitive type', () => {
    expect(
      getAST(`
const string kServiceName = "business";
    `)
    ).toMatchInlineSnapshot(`
Object {
  "body": Array [
    Object {
      "name": "kServiceName",
      "type": "ConstDefinition",
      "typing": Object {
        "type": "PrimitiveType",
        "value": "string",
      },
      "value": Object {
        "kind": "string",
        "type": "Literal",
        "value": "business",
      },
    },
  ],
  "type": "Mojom",
}
`);
  });

  it('parse w/ identifier type', () => {
    expect(
      getAST(`
const Fooo kServiceName = "bar";
    `)
    ).toMatchInlineSnapshot(`
Object {
  "body": Array [
    Object {
      "name": "kServiceName",
      "type": "ConstDefinition",
      "typing": Object {
        "identifier": Object {
          "name": Array [
            "Fooo",
          ],
          "type": "Identifier",
        },
        "isAssociate": false,
        "isRequest": false,
        "type": "InterfaceType",
      },
      "value": Object {
        "kind": "string",
        "type": "Literal",
        "value": "bar",
      },
    },
  ],
  "type": "Mojom",
}
`);
  });
});
