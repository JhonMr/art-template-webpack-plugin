# art-template-webpack-plugin
A webpack plugin handle HTML with art-template. Help for insert data and create multi-language HTML.

#### Installation

npm i --save-dev art-template-webpack-plugin

#### Basic Use

```
// vue.config.js
const tempPlugin = require('art-template-webpack-plugin');
const cnObject = {"title": "测试应用", "description": "这是一款用于测试art-template-webpack-plugin的应用", "notes": ["插入数据", "生成多语言HTML"]};
const enObject = {"title": "Test application","description": "This is a test Application for art-template-webpack-plugin", "notes": ["Insert data", "careat multi-language HTML"]};
module.exports = {
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
    },
    admin: {
      entry: 'src/adminMain.js',
      template: 'public/admin.html',
      filename: 'admin.html',
    }
  },
  configureWebpack: {
    plugins: [
      new ArtTemplatePlugin(
        [
          {
            filename: 'index.html',
            create: true,                   // create file
            fileDataMap: {
              _default: cnObject,           // ‘_default’ for handle index.html width cnObject
              "en.html": enObject,           // create a ‘en.html’ base on ‘index.html’ and handle with enObject
            }
          },
          {
            filename: 'admin.html',
            fileDataMap: cnObject           // Handle admin.html width cnObject
          }
        ]
      )
    ]
  }
}

```

```
// index.html
<!DOCTYPE html>
<html lang="">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <meta name="title" content="{{title}}">
    <meta name="description" content="{{description}}">
    <link rel="icon" href="<%= BASE_URL %>favicon.ico">
    <title><%= htmlWebpackPlugin.options.title %></title>
  </head>
  <body>
    <ul>
        {{each notes $item $i}}
        <li>{{$i}}.{{$item}}</li>
        {{/each}}
    </ul>
    <div id="app"></div>
    <!-- built files will be auto injected -->
  </body>
</html>
```
