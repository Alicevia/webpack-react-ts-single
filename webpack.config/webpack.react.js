const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode:'production',
  entry:{
    react:['react'],
    reactdom:['react-dom']
  },
  output:{
    filename:'[name]_dll.js',
    path:path.resolve(__dirname,'../dll'),
    library:'[name]_dll'
  },
  plugins:[
    new webpack.DllPlugin({
      name:'[name]_dll',
      // context:__dirname,
      path:path.resolve(__dirname,'../dll','[name].manifest.json')
    }),
  ]
}