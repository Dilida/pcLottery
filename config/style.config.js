const args = require('minimist')(process.argv.slice(2));
const writeFile = require('write');
const fs = require('fs');
const chalk = require('chalk');

function styleError(msg) {
  if (!msg) {
    msg = '[FAIL] Build failed with style, number errors';
  }
  console.warn();
  console.warn(chalk.red(msg));
  console.warn();

  process.exit(1);
}

module.exports = function (chain, appPaths) {
  if (!args.s || !args.n) {
    styleError();
  }
  const style = args.s;
  const statics = '.';
  const number = args.n.toString().padStart(3, 0);
  console.log(chalk.blue(' build style: '), `${style}${number}`);
  const urlPath = chain.output.get('publicPath') || '/';

  const distDir = chain.output.get('path');
  const selectStyle = {
    copy: [
      'browser.html',
      'awesome.proto',
      'app.styl',
      'path.styl',
      'css',
      'icons',
      'images',
      `${style}/css`,
      `${style}/fonts`,
      `${style}/images`,
      `${style}/${style}${number}`,
    ],
    appStyle: () => {
      writeFile(
        appPaths.resolve.src('statics/app.styl'),
        `$path = '${urlPath}'
$styleName = '${style}'
$styleNumber = '${number}'
$styleFolder = '${style}${number}'
@import '${statics}/${style}/${style}${number}/css/theme'`,
      );
      writeFile(
        appPaths.resolve.src('statics/path.styl'),
        `@import '${statics}/${style}/css/var'
@import '${statics}/${style}/${style}${number}/css/var'`,
      );
    },
  };
  // 判斷version是否存在(驗證指定style和version的路徑是否存在)
  fs.exists(
    appPaths.resolve.src(`statics/${style}/${style}${number}`),
    (exists) => {
      if (!exists) {
        styleError('[FAIL] version is not exists. Can not find the style folder which been assigned');
      }
    },
  );
  // 向指定路徑檔案寫入引用style路徑
  selectStyle.appStyle ? selectStyle.appStyle() : null;
  console.log(chalk.blue(' style :'), 'write done');

  if (distDir) {
    // 建置(build)專案時才需要copy
    return selectStyle.copy.map((file) => {
      const copyObj = {
        from: appPaths.resolve.src(`statics/${file}`),
        to: `${distDir}/statics/${file}`,
      };
      return copyObj;
    });
  }
  return false;
};
