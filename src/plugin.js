const htmlWebpackPlugin = require("html-webpack-plugin");
const template = require('art-template');
const pluginName = "artTemplatePlugin";

class ArtTemplatePlugin {
  constructor(pages= [], templateOptions= {}) {
    this.tOptions = templateOptions;
    this.pages = {};
    this.creates = [];
    if(!pages) return ;
    if(!pages instanceof Array) {
      pages = [pages];
    }
    pages.map(it => {
      if(it.create) this.creates.push(it.filename);
      this.pages[it.filename] = it.fileDataMap;
    })
  }
  apply(compiler) {
    compiler.hooks.compilation.tap(pluginName, compilation => {
      const htmlWebpackPluginAfterEmit = compilation.hooks.htmlWebpackPluginAfterEmit || htmlWebpackPlugin.getHooks(compilation).afterEmit;
      htmlWebpackPluginAfterEmit.tapAsync(pluginName, (data, cb) => {
        const filename = data.outputName;
        const source = (data.html &&data.html.source) || (compilation.assets[filename] && compilation.assets[filename].source);
        if(!source) {
          console.log('\x1B[41m%s\x1B[49m', 'art-template-webpack-plugin error (without source)!');
          cb(null, data);
          return false;
        }
        const code = source();
        const fileDataMap = this.pages[filename];
        if(this.creates.includes(filename)) {
          for(let name in fileDataMap) {
            let _name = name
            if(name === '_default') {
              _name = filename;
            }
            newCompilationAssets(compilation, _name, template.render(code, fileDataMap[name], this.tOptions));
          }
        }
        else {
          newCompilationAssets(compilation, filename, template.render(code, fileDataMap, this.tOptions));
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
