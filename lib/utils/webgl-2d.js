
const { createCanvas, createImageData, registerFont } = require('../../inkpaint/lib/index');

function mixin(src, dst) {
  const keys = Object.keys(src);
  for (let i = 0; i < keys.length; ++i) {
    const propertyName = keys[i];
    const srcProperty = Object.getOwnPropertyDescriptor(src, propertyName);
    const dstProperty = Object.getOwnPropertyDescriptor(dst, propertyName);
    if (dstProperty === srcProperty) continue;
    Object.defineProperty(dst, propertyName, srcProperty);
  }
}

const WebGL2dContext = {
  getImageData(x, y, w, h) {
    const data = new Uint8ClampedArray(w * h * 4);
    const flipY = this.drawingBufferHeight - y - h
    this.readPixels(x, flipY, w, h, this.RGBA, this.UNSIGNED_BYTE, data)
    // flip upside down
    const flipData = new Uint8ClampedArray(w * h * 4);
    for (let r = 0; r < h; r++) {
      flipData.set(data.subarray(r * w * 4, (r + 1) * w * 4), (h - r - 1) * w * 4)
    }
    return createImageData(flipData, w, h);
  },
}

const WebGL2D = {
  getContext(canvas) {
    if (!canvas._webgl_ctx_) {
      canvas._webgl_ctx_ = canvas.getContext('webgl');
      mixin(WebGL2dContext, canvas._webgl_ctx_);
    }
    return canvas._webgl_ctx_;
  }
}

module.exports = WebGL2D;