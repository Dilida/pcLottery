

const args = require('minimist')(process.argv.slice(2));
const merge = require('webpack-merge');
const prodEnv = require('./prod.env');

const argsUrlType = args.u || '';
// const chalk = require('chalk');

function getTestUrl() {
  let java = 'api.baochi888.com';
  let goLangIP = '113.196.55.206:9302'; // 眾籌彩api，不同後端
  let picUrl = 'admin.baochiapi.com';
  switch (argsUrlType) {
    case 'testoce':
      java = 'testoce.api.baochi888.com';
      goLangIP = 'testoce.go.baochi888.com';
      break;
    // case 'stage':
    // apiUrl = 'api.66bccp.com';
    // goUrl = '113.196.55.206:9302';
    // configUrl = '192.168.0.226:8110';
    // break;
    case 'stage':
      java = 'api.66bccp.com';
      goLangIP = 'stg.go.66bccp.com';
      picUrl = 'stg.img.baochiapi.com';
      break;
    case 'dev':
      java = '121.58.234.210:19093';
      goLangIP = '113.196.55.206:9302';
      break;
    default:
  }
  return {
    picurl: `"http://${picUrl}/photo/pic/"`,
    java: `"http://${java}/"`,
    goLang: `"http://${goLangIP}/v1/crowdfunding/"`, // 眾籌彩api，不同後端
    javaMaintainLog: `"http://${java}/hades/api/maintain/"`,
  };
}

module.exports = merge(prodEnv, {
  NODE_ENV: '"testing"',
  API_URL: getTestUrl(),
  API_URL_HTTP: getTestUrl(),
});
