module.exports = {
  entry: './components/app/app.js',
  output: {
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {test: /\.pug$/, use: 'pug-loader'},
      {
        test: /\.js$/,
        use: [{
          loader: 'babel-loader',
          options: { presets: ['es2015'] },
        }],
      },
    ]
  }
}