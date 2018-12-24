export enum NodeType {
  Mojom = 'Mojom',
  ModuleStatement = 'ModuleStatement',
  ImportStatement = 'ImportStatement',
  Attribute = 'Attribute',
  StructDefinition = 'StructDefinition',
  ConstDefinition = 'ConstDefinition',
  Identifier = 'Identifier',
  Literal = 'Literal',
  TypeSpec = 'TypeSpec',
  InterfaceType = 'InterfaceType',
  StructField = 'StructField',
  PrimitiveType = 'PrimitiveType',
  UnionDefinition = 'UnionDefinition',
  UnionField = 'UnionField',
  EnumDefinition = 'EnumDefinition',
  EnumValue = 'EnumValue',
};

interface ASTNode {
  type: NodeType;
}
/**
 * Represents a mojom file.
 */
export interface MojomNode extends ASTNode {
  type: NodeType.Mojom;
  body: [(ImportStatementNode | ModuleStatementNode | Definition)];
};

type Definition =
    StructDefinitionNode
  | UnionDefinitionNode
//  | InterfaceDefinitionNode
  | EnumDefinitionNode
  | ConstDefinitionNode
;

/**
 * Represents an "import" statement.
 */
export interface ImportStatementNode extends ASTNode {
  type: NodeType.ImportStatement;
  filename: string;
};

/**
 * Represents a "module" statement.
 */
export interface ModuleStatementNode extends ASTNode {
  type: NodeType.ModuleStatement,
  namespace: IdentifierNode;
  attributes: [AttributeNode];
};

/**
 * Represents an attribute that alters a definition.
 */
export interface AttributeNode extends ASTNode {
  type: NodeType.Attribute;
  key: string;
  value: (number | string | boolean);
}

/**
 * Represents an "struct" definition.
 */
export interface StructDefinitionNode extends ASTNode {
  type: NodeType.StructDefinition;
}

type ConstantNode = LiteralNode | IdentifierNode;

/**
 * Represents a contant definition.
 */
export interface ConstDefinitionNode extends ASTNode {
  type: NodeType.ConstDefinition;
  name: string,
  typing: TypeSpecNode;
  value: ConstantNode;
}

/**
 * Represents an identifier.
 */
export interface IdentifierNode extends ASTNode {
  type: NodeType.Identifier;
  name: [string],
}

export enum LiteralKind {
  number = 'number',
  boolean = 'boolean',
  string = 'string',
  default = 'default',
};

export interface ILiteralNode extends ASTNode {
  type: NodeType.Literal;
  kind: LiteralKind;
}

export interface NumberLiteralNode extends ILiteralNode {
  kind: LiteralKind.number;
  value: number;
};
export interface StringLiteralNode extends ILiteralNode {
  kind: LiteralKind.string;
  value: string;
};
export interface BooleanLiteralNode extends ILiteralNode {
  kind: LiteralKind.boolean;
  value: boolean;
};

export interface DefaultLiteralNode extends ILiteralNode {
  kind: LiteralKind.default;
};

/**
 * Represents a literal.
 */
export type LiteralNode = NumberLiteralNode | BooleanLiteralNode | StringLiteralNode | DefaultLiteralNode;

/**
 * Represents a TypeSpec
 */
export interface TypeSpecNode extends ASTNode {
  type: NodeType.TypeSpec;
  nullable: boolean;
  typing: InterfaceTypeNode /* .. */;
};

/**
 * Represents an interface type.
 */
export interface InterfaceTypeNode extends ASTNode {
  type: NodeType.InterfaceType;
  identifier: IdentifierNode;
  isRequest: boolean;
  isAssociate: boolean;
};

export enum PrimitiveTypeValues {
  bool = 'bool',
  int8 = 'int8',
  uint8 = 'uint8',
  int16 = 'int16',
  uint16 = 'uint16',
  int32 = 'int32',
  uint32 = 'uint32',
  int64 = 'int64',
  uint64 = 'uint64',
  float = 'float',
  double = 'double',
  string = 'string',
}
/**
 * Represents a primitive type.
 */
export interface PrimitiveTypeNode extends ASTNode {
  type: NodeType.PrimitiveType;
  value: PrimitiveTypeValues;
};

/**
 * Represents a struct.
 */
export interface StructDefinitionNode extends ASTNode {
  type: NodeType.StructDefinition;
  name: string;
  attributes: [AttributeNode];
  body: [(ConstDefinitionNode /* | Enum*/ | StructFieldNode)]
};

/**
 * Represents a field of a struct
 */
export interface StructFieldNode extends ASTNode {
  type: NodeType.StructField;
  attributes: [AttributeNode],
  typing: TypeSpecNode,
  name: string,
  ordinalValue: number | null,
  defaultValue: ConstantNode,
};

export interface UnionDefinitionNode extends ASTNode {
  type: NodeType.UnionDefinition,
  name: string,
  attributes: [AttributeNode];
  body: [UnionFieldNode]
}

export interface UnionFieldNode extends ASTNode {
  type: NodeType.UnionField,
  attributes: [AttributeNode],
  typing: TypeSpecNode,
  name: string,
  ordinalValue: number | null,
}

export interface EnumDefinitionNode extends ASTNode {
  type: NodeType.EnumDefinition,
  attributes: [AttributeNode],
  name: string,
  body: [EnumValueNode],
}

export interface EnumValueNode extends ASTNode {
  type: NodeType.EnumValue,
  attributes: [AttributeNode],
  name: string,
  value: (null | number | IdentifierNode)
}
