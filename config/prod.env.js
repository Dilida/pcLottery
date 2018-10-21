const args = require('minimist')(process.argv.slice(2));

const style = args.s || 'king';
const number = args.n ? args.n.toString().padStart(3, 0) : 1;
console.log('number: ', number);
console.log('style: ', style);
const publishDate = Date.now();

module.exports = {
  NODE_ENV: '"production"',
  STYLE_NAME: `"${style}"`,
  STYLE_NUMBER: `"${number}"`,
  PUBLISH_DATE: `"${publishDate}"`,
  API_URL: {
    picurl: '"https://img.will888.cn/photo/pic/"', // 图片地址
    java: '"https://api.88bccp.com/"', // 线上环境
    config: '"https://api.88bccp.com/magic-tools/config/"',
    goLang: '"https://api.zcbaap.com/v1/crowdfunding/"', // 眾籌彩api，不同後端
    javaMaintainLog: '"https://api.baapzc.com/hades/api/maintain/"', // java maintain page
  },
  API_URL_HTTP: {
    picurl: '"http://img.wbwill.com/photo/pic/"', // 图片地址
    java: '"http://api.99bccp.com/"', // 线上环境
    config: '"http://api.99bccp.com/magic-tools/config/"', // 线上环境
    goLang: '"http://api.zcddbp.com/v1/crowdfunding/"', // 眾籌彩api，不同後端
    javaMaintainLog: '"https://api.baapzc.com/hades/api/maintain/"', // java maintain page
  },
};
