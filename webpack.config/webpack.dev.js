const {smart} = require('webpack-merge')
const webpack = require('webpack')
const base = require('./webpack.base')
module.exports = smart(base,{
  mode:'development',
  devtool:'eval-source-map',
  devServer:{
    hot:true,
    port:3000,
    progress:false,
    contentBase:'./dist',
    open:true,
    compress:true,
    // proxy:{
    //   '/api':{
    //     target:'http://localhost:3000',
    //     pathRewrite:{
    //       '/api':''
    //     }
    //   }
    // },
  },
  plugins:[
    new webpack.DefinePlugin({
      ENV:JSON.stringify('development')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ]
})


