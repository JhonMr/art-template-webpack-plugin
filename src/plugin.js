const htmlWebpackPlugin = require("html-webpack-plugin");
const template = require('art-template');
const path = require('path');
const pluginName = "artTemplatePlugin";

class ArtTemplatePlugin {
  constructor(pages= [], templateOptions= {}) {
    this.tOptions = Object.assign({
      minimize: false,
      cache: false,
      include: function(filename, includeData, includeBlock, includeOptions) {
        return template.defaults.include(filename, includeData, includeBlock, includeOptions);
      }
    }, templateOptions);
    this.pages = pages;
    if(!pages instanceof Array) {
      this.pages = [pages];
    }
  }
  apply(compiler) {
    compiler.hooks.compilation.tap(pluginName, compilation => {
      const htmlWebpackPluginAfterEmit = compilation.hooks.htmlWebpackPluginAfterEmit || htmlWebpackPlugin.getHooks(compilation).afterEmit;
      htmlWebpackPluginAfterEmit.tapAsync(pluginName, (data, cb) => {
        let filepath = null;
        try {
          filepath = data.plugin.options.template.slice(data.plugin.options.template.indexOf('!')+1).replace(/\\/g, '/');
          console.log(filepath)
        } catch(e) {
          console.log('\x1B[41m%s\x1B[49m', 'art-template-webpack-plugin error (get filepath fail)')
        }
        const filename = data.outputName;

        const source = (data.html &&data.html.source) || (compilation.assets[filename] && compilation.assets[filename].source);
        if(!source) {
          console.log('\x1B[41m%s\x1B[49m', 'art-template-webpack-plugin error (without source)!');
          cb(null, data);
          return false;
        }
        let code = source();
        const fileConfig = this.pages.find(it => filepath.indexOf(it.template) == filepath.length - it.template.length);
        if(fileConfig) {
          const basePath = filepath.slice(0, filepath.indexOf(filename));
          // 强制替换路径
          code = code.replace(/\{\{\s*@?(?:include|extend)\s*(?:'|")([^}\s]+?)(?:'|")/gim, (a, b) => a.replace(b, path.resolve(basePath, b)).replace(/\\/g, '\/'));
          let fileDataMap = fileConfig.fileDataMap;
          if(!fileDataMap) {
            fileDataMap = {
              _default: fileConfig.fileData
            }
          }
          for(let name in fileDataMap) {
            let _name = name
            if(name === '_default') {
              _name = filename;
            }
            newCompilationAssets(compilation, _name, template.render(code, fileDataMap[name], this.tOptions));
          }
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
