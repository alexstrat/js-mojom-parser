import { getAST } from '../index';

describe('Union definition', () => {
  it('parse a single field union', () => {
    expect(
      getAST(`
union ExampleUnion {
  string str;
};

`)
    ).toMatchInlineSnapshot(`
Object {
  "body": Array [
    Object {
      "attributes": Array [],
      "body": Array [
        Object {
          "attributes": Array [],
          "name": "str",
          "ordinalValue": null,
          "type": "UnionField",
          "typing": Object {
            "nullable": false,
            "type": "TypeSpec",
            "typing": Object {
              "type": "PrimitiveType",
              "value": "string",
            },
          },
        },
      ],
      "name": "ExampleUnion",
      "type": "UnionDefinition",
    },
  ],
  "type": "Mojom",
}
`);
  });

  it('parse a double field union', () => {
    expect(
      getAST(`
union ExampleUnion {
  string str;
  StringPair pair;
};

`)
    ).toMatchInlineSnapshot(`
Object {
  "body": Array [
    Object {
      "attributes": Array [],
      "body": Array [
        Object {
          "attributes": Array [],
          "name": "str",
          "ordinalValue": null,
          "type": "UnionField",
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
          "name": "pair",
          "ordinalValue": null,
          "type": "UnionField",
          "typing": Object {
            "nullable": false,
            "type": "TypeSpec",
            "typing": Object {
              "identifier": Object {
                "name": Array [
                  "StringPair",
                ],
                "type": "Identifier",
              },
              "isAssociate": false,
              "isRequest": false,
              "type": "InterfaceType",
            },
          },
        },
      ],
      "name": "ExampleUnion",
      "type": "UnionDefinition",
    },
  ],
  "type": "Mojom",
}
`);
  });
});
