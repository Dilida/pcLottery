
const args = require('minimist')(process.argv.slice(2));
const merge = require('webpack-merge');
const prodEnv = require('./prod.env');

const useTestUrl = !!(args.u && args.u === 'test');
const testApiDomain = {
  picurl: '"http://admin.baochiapi.com/photo/pic/"',
  // java: '"http://mock.bccp.com/mock/"', // 测试环境
  java: '"http://api.baochi888.com/"',
  javaTest: '"http://api.baochi888.com/"',
  goLang: '"http://113.196.55.206:9302/v1/crowdfunding/"', // 眾籌彩api，不同後端
  javaMaintainLog: '"http://api.baochi888.com/hades/api/maintain/"',
};

const prodApiDomain = {
  picurl: '"http://admin.baochiapi.com/photo/pic/"',
  java: '"http://mock.bccp.com/mock/"', // 开发环境
  goLang: '"http://113.196.55.206:9302/v1/crowdfunding/"', // 眾籌彩api，不同後端
  javaMaintainLog: '"http://api.baochi888.com/hades/api/maintain/"',
};

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_URL: useTestUrl ? testApiDomain : prodApiDomain,
  API_URL_HTTP: useTestUrl ? testApiDomain : prodApiDomain,
});

