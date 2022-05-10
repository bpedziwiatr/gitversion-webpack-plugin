# Webpack plugin
Plugin allows to call gitversion cli (assume is installed on machine). To get version information and append output css/js files from webpack assets.

example:
```js
// gitversion - Branch.feature-issue23-cr.Sha.a2f0053911d75e6c1bc3137ba8c26f1a1c37f0c3
(function webpackUniversalModuleDefinition(root, factory) {
```

# Options

- `appendFile` add gitversion at end if true present, else at begining of file
- `regex` - regex to find css/js default "\.js$|\.css$"

```js
interface GitVersionPluginOptions {
  appendFile?: boolean
  regex?: string
}
```
# Webpack setup

```js
const GitVersionPlugin = require('gitversion-webpack-plugin').default;
...
plugins: [
    ...
    new GitVersionPlugin(),
]
```