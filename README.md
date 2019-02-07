# Mojom parser

Parse [Mojom IDL](https://chromium.googlesource.com/chromium/src/+/master/mojo/public/tools/bindings/README.md) into AST.

_⚠️ The implementation is still incomplete._

## Installation

_This package is not published yet._

## Usage

```ts
import { getAST } from 'mojom-parser';

const mojomSource = `
module widget.mojom;

struct StringPair {
  string first@1 = "ff";
  string? second;
};
`;

const ast = getAST(mojomSource);
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

### TODOS
As noted, the implementation is incomplete. Here are the missing part:

- [ ] Implement `interface` type
- [ ] Verify the types such as array, map etc. are properly parsed
- [ ] Handle comments in source code
- [ ] Fix grammar ambiguosity issues

## License
[ISC](https://choosealicense.com/licenses/isc/)
