const fs = require('fs');
const path = require('path');

const dir = '/static/config.js';

module.exports = function () {
  const keys = Object.keys(process.env);
  const items = keys.filter(key => key.match(/^CONFIG_/));
  if (!items || items.length === 0) {
    throw new Error(
      `You have not specify the .env file in project root folder. See /.env.sample how it looks like.`
    );
  }
  console.log('ENV VARIABLE:', JSON.stringify(items));
  const values = items.reduce((total, key) => {
    return {
      ...total,
      [ key.replace(/^CONFIG_/, '') ]: process.env[ key ]
    };
  }, {});

  const file = `window.__APPCONFIG__ = ${JSON.stringify(values)}\n`;
  fs.writeFileSync(path.join(__dirname, '..', dir), file);
};
