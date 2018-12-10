import { getAST } from '../index';

describe('Enum definition', () => {
  it('parse enum without value', () => {
    expect(
      getAST(`
enum Department {
  SALES,
  DEV,
};
    `)
    ).toMatchInlineSnapshot(`
Object {
  "body": Array [
    Object {
      "attributes": null,
      "body": Array [
        Object {
          "attributes": Array [],
          "name": "SALES",
          "type": "EnumValue",
          "value": null,
        },
        Object {
          "attributes": Array [],
          "name": "DEV",
          "type": "EnumValue",
          "value": null,
        },
      ],
      "name": "Department",
      "type": "EnumDefinition",
    },
  ],
  "type": "Mojom",
}
`);
  });

  it('parse enum with values', () => {
    expect(
      getAST(`
enum Department {
  SALES = 0,
  DEV = 1,
};
    `)
    ).toMatchInlineSnapshot(`
Object {
  "body": Array [
    Object {
      "attributes": null,
      "body": Array [
        Object {
          "attributes": Array [],
          "name": "SALES",
          "type": "EnumValue",
          "value": 0,
        },
        Object {
          "attributes": Array [],
          "name": "DEV",
          "type": "EnumValue",
          "value": 1,
        },
      ],
      "name": "Department",
      "type": "EnumDefinition",
    },
  ],
  "type": "Mojom",
}
`);
  });
});
