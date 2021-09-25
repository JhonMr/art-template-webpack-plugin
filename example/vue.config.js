const ArtTemplatePlugin = require('../index');
const enlang = require('./src/langs/en');
const cnlang = require('./src/langs/cn');

module.exports = {
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: '系统-前端',
    },
    admin: {
      entry: 'src/adminMain.js',
      template: 'public/admin.html',
      filename: 'admin.html',
      title: '系统-中端',
    }
  },
  configureWebpack: {
    plugins: [
      new ArtTemplatePlugin(
        [
          {
            template: 'public/index.html',
            fileDataMap: {
              _default: cnlang,
              "en.html": enlang,
            }
          },
          {
            template: 'public/admin.html',
            fileData: cnlang
          }
        ]
      )
    ]
  }
}
