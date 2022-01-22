// postcss配置文件

module.exports = {
  plugins: {
    'postcss-pxtorem': {
      rootValue({file}){
        return file.indexOf('vant') === -1 ? 75 : 37.5
      },
      propList: ['*'],
      // 配置无需转换的样式资源
      exclude: 'github-markdown'
    }
  }
}