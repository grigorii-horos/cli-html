# Welcome to cli-html

![Version](https://img.shields.io/github/package-json/v/horosgrisa/cli-html.svg)
[![Documentation](https://img.shields.io/badge/documentation-yes-brightgreen.svg)](https://github.com/horosgrisa/cli-html#readme)
[![Maintenance](https://img.shields.io/maintenance/yes/2019.svg)](https://github.com/horosgrisa/cli-html/graphs/commit-activity)
[![License: GPL-3.0](https://img.shields.io/github/license/horosgrisa/cli-html.svg)](https://github.com/horosgrisa/cli-html/blob/master/LICENSE)
![Downloads](https://img.shields.io/npm/dw/cli-html.svg)

> Renderer HTML in the Terminal.
> Supports pretty tables and syntax highlighting

## Install

```sh
npm i -g cli-html
```

## Example

```sh
html examples/demo.html
```

This will produce the following:

![Screenshot of cli-html](./images/1.png)

## Usage as module

```sh
npm i cli-html
```

```js
import cliHtml from 'cli-html';

const html = `
<h1>Hello World</h1>
`

console.log(cliHtml(html));
```

## Run tests

```sh
npm run test
```

## Author

👤**Grigorii Horos**

* Github: [@grigorii-horos](https://github.com/grigorii-horos)

## Contributing

Contributions, issues and feature requests are welcome!

Feel free to check [issues page](https://github.com/grigorii-horos/cli-html/issues).

## Show your support

Give a ⭐️ if this project helped you!

## License

Copyright © 2019 [Grigorii Horos](https://github.com/grigorii-horos).

This project is [GPL-3.0-or-later](https://github.com/grigorii-horos/cli-html/blob/master/LICENSE) licensed.
