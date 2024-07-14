'use strict'

const postcss = require('postcss');
const CleanCss = require('clean-css');

const initializer = (opts = {}) => {
  const cleancss = new CleanCss(opts)

  return (css, res) => {
    return new Promise((resolve, reject) => {
      cleancss.minify(css.toString(), (err, min) => {
        if (err) {
          return reject(new Error(err.join('\n')))
        }

        for (let w of min.warnings) {
          res.warn(w)
        }

        res.root = postcss.parse(min.styles)
        resolve()
      })
    })
  }
}

module.exports = postcss.plugin('clean', initializer)