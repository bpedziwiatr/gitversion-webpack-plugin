import { Compilation, Compiler } from 'webpack'
import { GitVersionCommand, GitVersionModel } from './gitversion-command'

interface GitVersionPluginOptions {
  appendFile?: boolean
  regex?: string
  useDotnet?:boolean
}

export class GitVersionPlugin {
    gitVersionCommand: GitVersionCommand
    gitVersion: GitVersionModel | null 
    regex:string = "\.js$|\.css$"
    appendFile:boolean = false
  
    constructor(options: GitVersionPluginOptions = {}) {
      if(options.appendFile !== undefined){
        this.appendFile = options.appendFile;
      }
      if(options.regex !== undefined){
        this.regex =options.regex;
      }
      this.gitVersion = null;
      this.gitVersionCommand = new GitVersionCommand(false);      
    }
  
    async apply(compiler: Compiler) {    
      
      this.gitVersion = await this.gitVersionCommand.getVersion();
      compiler.hooks.emit.tap('GitVersionPlugin', compilation => {
        this.applyGitVersionToAssets(compilation);
      });
    }
    validateFile(fileName:string) {
      const regex = new RegExp(this.regex, "g");
      return regex.test(fileName);
    }
    applyGitVersionToAssets(compilation: Compilation) {
      Object.keys(compilation.assets).forEach((fileName) => {
        if (!this.validateFile(fileName)) {
          return;
        }
        const appendText = `// gitversion - ${this.gitVersion?.InformationalVersion}`;
        let fileContent = compilation.assets[fileName].source();
        if(this.appendFile){
          
          fileContent = `${fileContent}\n${appendText}`;
        }else{
          fileContent = `${appendText}\n${fileContent}`;
        }
        
        compilation.assets[fileName] = {
          source: function() {
            console.log('source')
            return fileContent
          },
          size: function() {
            console.log('size')
            return fileContent ? fileContent.length : 0
          },
          buffer: function() {
            console.log('buffer')
            return Buffer.from(fileContent)
          },
          map: function() {
            console.log('map')
            return {}
          },
          sourceAndMap: function() {
            console.log('sourceAndMap')
            return { source: fileContent, map: {} }
          },
          updateHash: function() {
            console.log('updateHash')
          },      
        };
      });
    }
  }