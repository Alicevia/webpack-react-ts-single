const { smart } = require('webpack-merge')
const base = require('./webpack.base')
const OptimizeCss = require('optimize-css-assets-webpack-plugin')
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = smart(base, {
  mode: 'production',
  optimization: {
    runtimeChunk: {
      name: entrypoint => `runtime~${entrypoint.name}`
    },
    // 1.共用的module (node_module文件夹的那些模块)和公共的chunk
    // 2.输出的chunk体积大于30kb的（指还没有gz和min喔）
    // 3.当加载请求数要求最大并行数小于或等于5时
    // 4.初始化页面，加载请求数要求最大并行请求要小于或等于3时
    splitChunks: {//多页应用抽离公共代码
      cacheGroups: {//缓存组
        venders: {//抽离第三方文件
          name: 'venders',
          priority: 1,//先抽离第三文件为一个单独的文件
          test: /node_modules/,
          chunks: 'initial',
          minSize: 0,
          minChunks: 1,
        },
        common: {//公共模块
          name: 'common',
          chunks: 'all', //initial 入口chunk async 只对异步导入的文件处理 all全部chunk
          minSize: 30 * 1024,
          minChunks: 2,//最少复用过几次抽离
        },
      }
    },
    minimizer: [
      new OptimizeCss(),
      new HtmlWebpackPlugin({
        template: './public/index.html',
        filename: 'index.html',
        hash: true,
        minify: {
          removeAttributeQuotes: true,
          collapseWhitespace: true
        }
      }),
      new ParallelUglifyPlugin({
        uglifyJS: {
          output: {
            beautify: false,
            comments: false
          },
          compress: {
            drop_console: false,
            collapse_vars: true,
            reduce_vars: true
          }
        }
      })
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      ENV: JSON.stringify('production')
    })
  ]
})


