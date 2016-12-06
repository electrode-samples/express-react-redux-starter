import Open from 'open';
import Path from 'path';
import Express from 'express';
import Webpack from 'webpack';
import WebpackDevMiddleware from 'webpack-dev-middleware';
import WebpackHotMiddleware from 'webpack-hot-middleware';
import Config from '../../webpack.config.dev';

/* eslint-disable no-console */

const server = Express();
const port = 3000;

const compiler = Webpack(Config);

server.use(WebpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: Config.output.publicPath
}));

server.use(WebpackHotMiddleware(compiler));

server.get('*', function(req, res) {
  res.sendFile(Path.join( __dirname, '../../source/index.html'));
});

server.listen(port, function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log('server running @ ' + port);
    Open(`http://localhost:${port}`);
  }
});
