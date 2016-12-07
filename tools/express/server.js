import Open from 'open';
import Path from 'path';
import Express from 'express';
import Webpack from 'webpack';
import WebpackDevMiddleware from 'webpack-dev-middleware';
import WebpackHotMiddleware from 'webpack-hot-middleware';
import Config from '../../webpack.config.dev';

import { renderToString } from 'react-dom/server';
import { createStore } from 'redux';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from '../../source/store/configureStore';
import App from '../../source/components/App';

const server = Express();
const port = 3000;

const compiler = Webpack(Config);

server.use(WebpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: Config.output.publicPath
}));

server.use(WebpackHotMiddleware(compiler));

server.get('*', handleRender);

function handleRender(req, res) {
  const store = configureStore();
  const html = renderToString(
    <Provider store={store}>
      <App />
    </Provider>
  );
  const preloadedState = store.getState();
  res.send(renderFullPage(html, preloadedState));
}

function renderFullPage(html, preloadedState) {
  return `
    <!doctype html>
    <html>
      <head>
        <title>Express React Redux Starter</title>
      </head>
      <body>
        <div id="app">${html}</div>
        <script>
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState)}
        </script>
        <script src="/bundle.js"></script>
      </body>
    </html>
    `;
}

server.listen(port, function(err) {
  /* eslint-disable no-console */

  if (err) {
    console.log(err);
  } else {
    console.log('server running @ port ' + port);
    Open(`http://localhost:${port}`);
  }
});
