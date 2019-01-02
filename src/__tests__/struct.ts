import './__utils__/toBeValidMojomAST';
import { getAST } from '../index';

describe('Struct definition', () => {
  it('parse StrintPair', () => {
    const ast = getAST(`
    struct StringPair {
      string first@1 = "ff";
      string? second;
    };
    `);
    expect(ast).toBeValidMojomAST();
    expect(ast).toMatchInlineSnapshot(`
Object {
  "body": Array [
    Object {
      "attributes": Array [],
      "body": Array [
        Object {
          "attributes": Array [],
          "defaultValue": Object {
            "kind": "string",
            "type": "Literal",
            "value": "ff",
          },
          "name": "first",
          "ordinalValue": 1,
          "type": "StructField",
          "typing": Object {
            "nullable": false,
            "type": "TypeSpec",
            "typing": Object {
              "type": "PrimitiveType",
              "value": "string",
            },
          },
        },
        Object {
          "attributes": Array [],
          "defaultValue": null,
          "name": "second",
          "ordinalValue": null,
          "type": "StructField",
          "typing": Object {
            "nullable": true,
            "type": "TypeSpec",
            "typing": Object {
              "type": "PrimitiveType",
              "value": "string",
            },
          },
        },
      ],
      "name": "StringPair",
      "type": "StructDefinition",
    },
  ],
  "type": "Mojom",
}
`);
  });
});
