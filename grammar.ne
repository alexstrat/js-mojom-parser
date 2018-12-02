@preprocessor typescript
@builtin "number.ne"
@builtin "string.ne"
@builtin "whitespace.ne"

@{% function nuller() { return null; } %}
@{% function joiner(d) { return d.join(''); } %}
@{% const nth = i => d => d[i] %}

# ENTRY
MojomFile -> (_ Statement _ {% nth(1) %}):* {% d => ({
  type: 'Mojom',
  body: d[0] || []
}) %}
Statement ->
    ModuleStatement {% id %}
  | ImportStatement {% id %}
  | Definition      {% id %}


# MODULES
ModuleStatement -> AttributeSection:? _ "module" __ Identifier ";" {% d => ({
    type: 'ModuleStatement',
    namespace: d[4],
    attributes: d[0] || [],
  })
%}

# IMPORT
ImportStatement -> "import" __ dqstring _ ";" {% (data) => ({
    type: 'ImportStatement',
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
Attribute -> Name ("=" AttributeValue {% nth(1) %}):? {% d => ({
    type: 'Attribute',
    key: d[0],
    value: d[1] ? d[1] : true // no value means flag
  })
%}
AttributeValue ->
    Name    {% id %}
  | Literal {% id %}

# STRUCT
Struct -> AttributeSection:? _ "struct" __ Name _ ("{" StructBody "}"):? _ ";"
StructBody -> (Const | Enum | StructField):*
StructField -> AttributeSection:? TypeSpec Name Ordinal:? Default:? ";"

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


TypeSpec -> TypeName Nullable:?
Nullable -> "?"
Associated -> "associated"
TypeName ->  Array | FixedArray | Map | InterfaceRequest | BasicTypeName

BasicTypeName ->  HandleType | NumericType | Associated:? Identifier
NumericType -> "bool" | "int8" | "uint8" | "int16" | "uint16" | "int32" | "uint32" | "int64" | "uint64" | "float" | "double"
HandleType -> "handle" ("<" SpecificHandleType ">"):?
SpecificHandleType -> "message_pipe" | "shared_buffer" | "data_pipe_consumer" | "data_pipe_producer"

Array -> "array" "<" TypeSpec ">"
FixedArray -> "array" "<" TypeSpec "," IntConstDec ">"
Map -> "map" "<" Identifier "," TypeSpec ">"

InterfaceRequest -> Associated:? Identifier "&"

Default -> ("=" Constant):?

# ENUMS
Enum -> AttributeSection:? "enum" Name "{" NonEmptyEnumValueList ",":? "}" ";"
NonEmptyEnumValueList -> (EnumValue ("," EnumValue):*)
EnumValue -> AttributeSection:? Name ("=" (Integer|Identifier)):?

# CONSTANTS
Const -> "const" TypeSpec Name "=" Constant ";"
Constant -> Literal | Identifier


Identifier -> Name ("." Name {% nth(1) %}):* {% d => ({
  type: 'Identifier',
  name: [d[0], ...d[1]]
  })
%}

Literal ->
    Integer   {% d => ({ type: 'Literal', kind: 'number', value: d[0] }) %}
  | jsonfloat {% d => ({ type: 'Literal', kind: 'number', value: d[0] }) %}
  | "true"    {% d => ({ type: 'Literal', kind: 'boolean', value: true }) %}
  | "false"   {% d => ({ type: 'Literal', kind: 'boolean', value: false }) %}
  | "default" {% d => ({ type: 'Literal', kind: 'default' }) %}
  | dqstring  {% d => ({ type: 'Literal', kind: 'string', value: d[0] }) %}

Integer -> IntConst | "+" IntConst | "-" IntConst
IntConst -> IntConstDec | IntConstHex

Name -> [a-zA-Z_] [0-9a-zA-Z_]:* {% d => [d[0], ...d[1]].join('') %}
IntConstDec -> "0" | [1-9] [0-9]:*
IntConstHex -> "0" [xX] [0-9a-fA-F]:+
Ordinal -> "@" ("0"|([1-9] [0-9]:*))

EOL               -> [\\x0A\\x0D]:+
Comment           -> "//" ([^\\x0A\\x0D] [\\x00-\\xFFFF]):* EOL
WS                -> wschar # comment
