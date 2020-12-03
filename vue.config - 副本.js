const path = require('path')
// const NODE_ENV = process.env.NODE_ENV
// const LodashWebpackPlugin = require('lodash-webpack-plugin')
// const webpack = require('webpack')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  lintOnSave: true,
  productionSourceMap: false,
  assetsDir: 'static',
  devServer: {
    historyApiFallback: true,
    https: false,
    hot: true,
    host: 'localhost',
    port: 80,
    disableHostCheck: true,
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: 'https://www.baidu.com/',
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/',
        },
      },
    },
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('lin', resolve('src/lin'))
      .set('assets', resolve('src/asset'))
    config.module
      .rule('md')
      .test(/\.md$/)
      .use('vue-loader')
      .loader('vue-loader')
      .end()
      .use('vue-markdown-loader')
      .loader('vue-markdown-loader/lib/markdown-compiler')
  },
  configureWebpack: {
    resolve: {
      extensions: ['.js', '.json', '.vue', '.scss', '.html'],
    },
    // const plugins = [
    //   new LodashWebpackPlugin({
    //     shorthands: true,
    //     cloning: true,
    //     paths: true,
    //   }),
    //   new webpack.ProvidePlugin({
    //     _: 'src/lin/util/lodash',
    //   }),
    // ]
    // if (NODE_ENV === 'production') {
    //   const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    //   plugins.push(new BundleAnalyzerPlugin())

    //   // 开启gzip压缩
    //   const CompressionWebpackPlugin = require('compression-webpack-plugin')
    //   const productionGzipExtensions = ['js', 'css']
    //   plugins.push(
    //     new CompressionWebpackPlugin({
    //       algorithm: 'gzip',
    //       test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
    //       threshold: 10240,
    //       minRatio: 0.8,
    //     }),
    //   )
    // }
    // return {
    //   plugins,
    // }
  },
  css: {
    loaderOptions: {
      sass: {
        data: '@import "@/assets/style/share.scss";',
      },
    },
  },
  devServer: {},
  // node_modules依赖项es6语法未转换问题
  transpileDependencies: ['vuex-persist'],
}
