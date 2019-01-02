import './__utils__/toBeValidMojomAST';
import { getAST } from '../index';

describe('Const definition', () => {
  it('parse w/ primitive type', () => {
    const ast = getAST(`
const string kServiceName = "business";
    `);
    expect(ast).toBeValidMojomAST()
    expect(ast).toMatchInlineSnapshot(`
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
    const ast = getAST(`
const Fooo kServiceName = "bar";
    `);
    expect(ast).toBeValidMojomAST();
    expect(ast).toMatchInlineSnapshot(`
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
