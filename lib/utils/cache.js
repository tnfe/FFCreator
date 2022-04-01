'use strict';
const md5 = require('md5');
const fs = require('fs');
const path = require('path');
const url = require('url');

// node-fetch from v3 is an ESM-only module - you are not able to import it with require().
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const CacheUtil = {
  cacheDir: null,
  async cachedResource(src, progress) {
    const key = md5(src);
    const ext = url.parse(src).pathname.split('.').slice(-1)[0];
    const cacheFile = path.join(CacheUtil.cacheDir, `${key}.${ext}`);
    if (fs.existsSync(cacheFile)) return cacheFile;
    const total = 1024 * 1024;
    progress && progress({ key, total, loaded: 1 });
    const res = await fetch(src);
    return new Promise((resolve, reject) => {
      const fileStream = fs.createWriteStream(cacheFile);
      res.body.pipe(fileStream);
      res.body.on("error", (err) => {
        reject(err);
      });
      fileStream.on("finish", function() {
        progress && progress({ key, total, loaded: total });
        resolve(cacheFile);
      });
    });
  },
  async cacheNode(node, progress) {
    const { type, src, path, url, fontFamily, preload } = node.conf;
    let source = src || path || url;
    if (type === 'text' && fontFamily?.startsWith('http')) { // must preload
      const fontPath = await CacheUtil.cachedResource(fontFamily, progress);
      node.setFont(fontPath);
    } else if (['image', 'gif'].includes(type) && source && preload) { // default preload=false
      node.conf.src = await CacheUtil.cachedResource(source, progress);
    } else if (['audio', 'video'].includes(type) && source && preload) { // default preload=false
      node.conf.src = await CacheUtil.cachedResource(source, progress);
      const paths = source.split('/');
      node.conf.srcFile = paths[paths.length - 1];
    } else {
      source = null;
    }
    if (source) node.conf.origSrc = source;
  },
}

module.exports = CacheUtil;