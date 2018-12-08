@preprocessor typescript
@builtin "number.ne"
@builtin "string.ne"
@builtin "whitespace.ne"

@{% 
  import {
    NodeType,
    MojomNode,
    ImportStatementNode,
    ModuleStatementNode,
    AttributeNode,
    ConstDefinitionNode,
    IdentifierNode,
    LiteralNode,
    TypeSpecNode,
    InterfaceTypeNode,
    LiteralKind,
    StructDefinitionNode,
    StructFieldNode,
    PrimitiveTypeNode,
  } from './ast';
%}
@{% const nth = i => d => d[i] %}

@{% const RESERVED_TYPES = ['bool', 'int8', 'uint8', 'int16', 'uint16', 'int32', 'uint32', 'int64', 'uint64', 'float', 'double', 'string', 'handle'] %}

# ENTRY
MojomFile -> (_ Statement _ {% nth(1) %}):* {% (d): MojomNode => ({
  type: NodeType.Mojom,
  body: d[0] || []
}) %}
Statement ->
    ModuleStatement {% id %}
  | ImportStatement {% id %}
  | Definition      {% id %}


# MODULES
ModuleStatement -> AttributeSection:? _ "module" __ Identifier ";" {% (d): ModuleStatementNode => ({
    type: NodeType.ModuleStatement,
    namespace: d[4],
    attributes: d[0] || [],
  })
%}

# IMPORT
ImportStatement -> "import" __ dqstring _ ";" {% (data): ImportStatementNode => ({
    type: NodeType.ImportStatement,
    filename: data[2],
  })
%}

Definition ->
    Struct    {% id %}
  | Union     {% id %}
  | Interface {% id %}
  | Enum      {% id %}
  | Const     {% id %}

# ATTRIBUTES
AttributeSection -> "[" AttributeList:? "]" {% nth(1) %}
AttributeList -> Attribute ("," Attribute {% nth(1) %}):* {% d => [d[0], ...d[1]] %}
Attribute -> Name ("=" AttributeValue {% nth(1) %}):? {% (d): AttributeNode => ({
    type: NodeType.Attribute,
    key: d[0],
    value: d[1] ? d[1] : true // no value means flag
  })
%}
AttributeValue ->
    Name    {% id %}
  | Literal {% id %}

# STRUCT
Struct -> AttributeSection:? _ "struct" __ Name _ ("{" StructBody "}" {% nth(1) %}):? _ ";" {% (data): StructDefinitionNode => ({
    type: NodeType.StructDefinition,
    name: data[4],
    attributes: data[0],
    body: data[6],
  })
%}
StructBody -> ( _ (
    Const        {% id %}
  | Enum         {% id %}
  | StructField  {% id %}
) _ {%nth(1)%}):* {% id %}

StructField -> AttributeSection:? TypeSpec __ Name Ordinal:? _ Default:? ";" {% (d): StructFieldNode => ({
    type: NodeType.StructField,
    attributes: d[0] || [],
    typing: d[1],
    name: d[3],
    ordinalValue: d[4],
    defaultValue: d[6]
  })
%}
Default -> "=" _ Constant {% nth(2) %}

# UNION
Union -> AttributeSection:? "union" Name "{" UnionField:* "}" ";"
UnionField -> AttributeSection:? TypeSpec Name Ordinal:? ";"

# INTERFACE
Interface -> AttributeSection:? "interface" Name "{" InterfaceBody:? "}" ";"
InterfaceBody -> (Const | Enum | Method):*
Method -> AttributeSection:? Name Ordinal:? "(" ParameterList:? ")" Response:? ";"
ParameterList -> (Parameter ("," Parameter):*)
Parameter -> AttributeSection:? TypeSpec Name Ordinal:?
Response -> ("=>" "(" ParameterList ")")


# TYPES
TypeName ->
    PrimitiveType {% (d): PrimitiveTypeNode => ({ type: NodeType.PrimitiveType, value: d[0]}) %}
  | Array
  | FixedArray
  | Map
  | HandleType
  | InterfaceType {% id %}

PrimitiveType ->
    "bool"    {% id %}
  | "int8"    {% id %}
  | "uint8"   {% id %}
  | "int16"   {% id %}
  | "uint16"  {% id %}
  | "int32"   {% id %}
  | "uint32"  {% id %}
  | "int64"   {% id %}
  | "uint64"  {% id %}
  | "float"   {% id %}
  | "double"  {% id %}
  | "string"  {% id %}

Array -> "array" "<" TypeSpec ">"
FixedArray -> "array" "<" TypeSpec "," IntConstDec ">"
Map -> "map" "<" Identifier "," TypeSpec ">"

HandleType -> "handle" ("<" SpecificHandleType ">"):?
SpecificHandleType -> "message_pipe" | "shared_buffer" | "data_pipe_consumer" | "data_pipe_producer"

Associated -> "associated" __ {% () => true %}
InterfaceType -> Associated:? Identifier "&":? {% (d) :InterfaceTypeNode => ({
    type: NodeType.InterfaceType,
    identifier: d[1],
    isRequest: d[2] ? true : false,
    isAssociate: d[0] ? true : false,
  })
%}

Nullable -> "?"
TypeSpec -> TypeName Nullable:? {% (d): TypeSpecNode => ({
    type: NodeType.TypeSpec,
    typing: d[0],
    nullable:  d[1] ? true : false
  })
%}

# ENUMS
Enum -> AttributeSection:? "enum" Name "{" NonEmptyEnumValueList ",":? "}" ";"
NonEmptyEnumValueList -> (EnumValue ("," EnumValue):*)
EnumValue -> AttributeSection:? Name ("=" (Integer|Identifier)):?

# CONSTANTS
Const -> "const" __ TypeName __ Name _ "=" _ Constant _ ";" {% (data): ConstDefinitionNode => ({
    type: NodeType.ConstDefinition,
    name: data[4],
    value: data[8],
    typing: data[2]
  })
%}
Constant -> 
    Literal    {% id %}
  | Identifier {% id %}


Identifier -> Name ("." Name {% nth(1) %}):* {% (d,l, reject): IdentifierNode | {} => {
  // reject identifier that matches a reserved type
  const name = [d[0], ...d[1]];
  if (RESERVED_TYPES.indexOf(name.join('')) !== -1) {
    return reject;
  }
  return {
    type: NodeType.Identifier,
    name: name
  }
}
%}

Literal ->
    Integer   {% (d): LiteralNode => ({ type: NodeType.Literal, kind: LiteralKind.number,   value: d[0]   }) %}
  | jsonfloat {% (d): LiteralNode => ({ type: NodeType.Literal, kind: LiteralKind.number,   value: d[0]   }) %}
  | "true"    {% (d): LiteralNode => ({ type: NodeType.Literal, kind: LiteralKind.boolean,  value: true   }) %}
  | "false"   {% (d): LiteralNode => ({ type: NodeType.Literal, kind: LiteralKind.boolean,  value: false  }) %}
  | "default" {% (d): LiteralNode => ({ type: NodeType.Literal, kind: LiteralKind.default                 }) %}
  | dqstring  {% (d): LiteralNode => ({ type: NodeType.Literal, kind: LiteralKind.string,   value: d[0]   }) %}

Integer -> IntConst | "+" IntConst | "-" IntConst
IntConst -> IntConstDec | IntConstHex

Name -> [a-zA-Z_] [0-9a-zA-Z_]:* {% d => [d[0], ...d[1]].join('') %}
IntConstDec -> "0" | [1-9] [0-9]:*
IntConstHex -> "0" [xX] [0-9a-fA-F]:+
Ordinal -> "@" unsigned_int {% nth(1) %}

EOL               -> [\\x0A\\x0D]:+
Comment           -> "//" ([^\\x0A\\x0D] [\\x00-\\xFFFF]):* EOL
WS                -> wschar # comment
