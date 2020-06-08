const path = require('path')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const Happypack = require('happypack')
const webpack = require('webpack')
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

let dllAry = []
const dllFiles = fs.readdirSync(path.resolve(__dirname, '../dll'))
dllFiles.forEach(file => {
  if (/.*dll.js/.test(file)) {
    dllAry.push(
      new AddAssetHtmlWebpackPlugin({
        filepath: path.resolve(__dirname, '../dll', file) //
      })
    )

  }
  if (/.*\.manifest.json/.test(file)) {
    dllAry.push(
      new webpack.DllReferencePlugin({
        manifest: path.resolve(__dirname, '../dll', file)
      })
    )
  }
})

module.exports = {
  entry: {
    index: path.resolve(__dirname, '../src/index')
  },
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, '../dist'),
    // 为动态加载的 Chunk 配置输出文件的名称
    chunkFilename: '[name].js',
    // publicPath:'http://cdn'//cdn地址 这样所有的js都会加上cdn的地址
  },
  resolve: {
    extensions: ['.tsx', '.jsx','.js',]
  },
  plugins: [
    new Happypack({
      id: 'js',
      loaders: ['babel-loader?cacheDirectory'],
    }),
    new Happypack({
      id: 'css',
      loaders: ['css-loader', 'postcss-loader']
    }),

    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      hash: true,
      chunks: ['index']
    }),
    new MiniCssExtractPlugin({
      filename: 'css/index.[hash].css'
    }),

    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        // path.resolve(__dirname, '../dist')
        "!manifest.json",
        "!_dll_react.js",
      ]
    }),
    // new webpack.DllReferencePlugin({
    //   manifest: path.resolve(__dirname, '../dll', 'manifest.json')
    // }),
    // // npm i add-asset-html-webpack-plugin --save-dev 将一些静态的文件导入到html中
    // new AddAssetHtmlWebpackPlugin({
    //   filepath: path.resolve(__dirname, '../dll', '_dll_react.js') //
    // }),
    ...dllAry
  ],
  module: {
    rules: [
      {
        test: /\.css$/, use: [
          MiniCssExtractPlugin.loader,
          'happypack/loader?id=css',
        ]
      },

      {
        test: /\.less$/, use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      },
      {
        test: /\.html$/, use: 'html-withimg-loader'
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 5 * 1024,
            outputPath: 'img/',
            esModule: false,
            // publicPath:'http://www.'
          }
        }
      },
      {
        test: /\.(eot|woff2?|ttf|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name]-[hash:5].[ext]',
              limit: 5000, // fonts file size <= 5KB, use 'base64'; else, output svg file
              // publicPath: 'fonts/',
              outputPath: 'fonts/'
            }
          }
        ]
      },
      {
        test: /\.(t|j)sx?$/,
        use: 'Happypack/loader?id=js',
        include: path.resolve(__dirname, '../src')
      }
    ]
  }
}