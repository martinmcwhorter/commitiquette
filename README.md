# commitiquette

Plugin for Commitizen that uses commitLint configuration. Allows you to use both Commitizen and commitLint with a single configuration.

![Node.js CI](https://github.com/martinmcwhorter/commitiquette/workflows/Node.js%20CI/badge.svg)
[![codecov](https://codecov.io/gh/martinmcwhorter/commitiquette/branch/master/graph/badge.svg)](https://codecov.io/gh/martinmcwhorter/commitiquette)

## Installation

Use npm or yarn to install commitiquette into your project.

```bash
npm install commitiquette --save-dev
```

## Usage

Update `package.json` Commitizen configuration.

```json
  "config": {
    "commitizen": {
      "path": "commitiquette"
    }
  },
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
