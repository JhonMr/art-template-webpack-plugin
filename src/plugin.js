const htmlWebpackPlugin = require("html-webpack-plugin");
const template = require('art-template');
const pluginName = "artTemplatePlugin";

class ArtTemplatePlugin {
  constructor(pages= [], templateOptions= {}) {
    this.tOptions = templateOptions;
    this.pages = {};
    this.creates = [];
    if(pages && pages instanceof Array) {
      pages.map(it => {
        if(it.create) this.creates.push(it.filename);
        this.pages[it.filename] = it.fileDataMap;
      })
    }
  }
  apply(compiler) {
    compiler.hooks.compilation.tap(pluginName, compilation => {
      const htmlWebpackPluginAfterEmit = compilation.hooks.htmlWebpackPluginAfterEmit || htmlWebpackPlugin.getHooks(compilation).afterEmit;
      htmlWebpackPluginAfterEmit.tapAsync(pluginName, (data, cb) => {
        const filename = data.outputName;
        const source = data.html.source();
        const fileDataMap = this.pages[filename];
        if(this.creates.includes(filename)) {
          for(let name in fileDataMap) {
            let _name = name
            if(name === '_default') {
              _name = filename;
            }
            newCompilationAssets(compilation, _name, template.render(source, fileDataMap[name], this.tOptions));
          }
        }
        else {
          newCompilationAssets(compilation, filename, template.render(source, fileDataMap, this.tOptions));
        }
        cb(null, data);
      })
    })
  }
}

function newCompilationAssets(compilation, name, data) {
  compilation.assets[name] = {
    source: function() {
      return data;
    },
    size: function() {
      return data.length;
    }
  }
}

module.exports = ArtTemplatePlugin;
