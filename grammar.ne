@preprocessor typescript
@builtin "number.ne"
@builtin "string.ne"
@builtin "whitespace.ne"

@{% function nuller() { return null; } %}
@{% function joiner(d) { return d.join(''); } %}

MojomFile -> StatementList
StatementList -> _ Statement:* _
Statement -> ModuleStatement | ImportStatement | Definition

ModuleStatement -> AttributeSection:? "module" WS:+ Identifier ";"
ImportStatement -> "import" WS:+ dqstring ";"
Definition -> Struct | Union | Interface | Enum | Const

# ATTRIBUTES
AttributeSection -> "[" AttributeList "]"
AttributeList -> (Attribute ("," Attribute):*):?
Attribute -> Name ("=" (Name|Literal)):?

# STRUCT
Struct -> AttributeSection:? "struct" Name ("{" StructBody "}"):? ";"
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


Identifier -> (Name ("." Name):*)

Literal -> Integer | jsonfloat | "true" | "false" | "default" | dqstring

Integer -> IntConst | "+" IntConst | "-" IntConst
IntConst -> IntConstDec | IntConstHex

Name -> [a-zA-Z_] [0-9a-zA-Z_]:*
IntConstDec -> "0" | [1-9] [0-9]:*
IntConstHex -> "0" [xX] [0-9a-fA-F]:+
Ordinal -> "@" ("0"|([1-9] [0-9]:*))

EOL               -> [\\x0A\\x0D]:+
Comment           -> "//" ([^\\x0A\\x0D] [\\x00-\\xFFFF]):* EOL
WS                -> wschar # comment
