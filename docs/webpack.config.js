// how npm run build:example works
// 1. build the library into js files in the dist folder using tsc
// 2. build the ts files in docs using swc
// 3. webpack them into the bundle.js file

module.exports = {
  mode: 'development',
  context: __dirname,
  entry: './index.js',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  output: {
    path: __dirname,
    filename: 'bundle.js',
  },
};
