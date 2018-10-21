# H5-PC

### NODE版本需求
Node.Js 8.X

### 需手动安装

```
npm install -g rollup@0.59.0
npm install vue-awesome-swiper --save
npm install gsap
```

### 本地開發启动指令

#### with quasar-cli

```
quasar dev -s ${styleName} -n ${version}
```

#### with npm
```
快速啟動(默認版本king001)
npm run dev:king
自訂啟動版本
npm run dev -- -s ${styleName} -n ${version} -u ${test}
```

##### 自訂參數部分
``` 
styleName: [king, default, style];
version: 1-10
test: 切换后端接口网址[ test ] 预设使用 开发网址
```

TIP: 使用测试环境接口需修改HOSTS 设定`pc.kingbaytest.co 127.0.0.1`

### 测试环境建置(build)指令
```
quasar build -d -t ios -u dev -s king -n 6
```
> 新增自订义参数 
>
> u = 切换后端接口网址[ dev, starge] 预设使用 测试网址


### 正式环境建置(build)指令
```
quasar build -t ios -u dev -s king -n 6
```
