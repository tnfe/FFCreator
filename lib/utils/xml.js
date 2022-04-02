const { isBrowser } = require("browser-or-node");
let oParser, xml2string;
if (isBrowser) {
  oParser = new DOMParser();
} else {
  const { DOMParser, XMLSerializer } = require('@xmldom/xmldom');
  oParser = new DOMParser();
  xml2string = new XMLSerializer().serializeToString;
}

const canvas = { width: 100, height: 100 };

const measure = (data, width, height) => {
  const num = Number(data);
  if (!isNaN(num)) return num;

  let lower_data = data.toLowerCase().trim();
  if (['true', 'false'].includes(lower_data)) {
    return lower_data == 'true';
  }

  if (lower_data.match(/^\[(.*)\]$/)) {
    const arr = JSON.parse(lower_data);
    return Array.isArray(arr) ? arr.map(i => measure(i, width, height)) : data;
  }

  const unit = (input, unit, original, target) => {
    if (!input.endsWith(unit)) return null;
    const inum = Number(input.substring(0, input.length - unit.length));
    return isNaN(inum) ? null : inum * (original / target);
  }

  const units = [
    ['rpx', width, 360],
    ['px', 360, 360],
    ['vw', width, 100],
    ['vh', height, 100]
  ];
  for (let i = 0; i < units.length; i++) {
    const inum = unit(lower_data, units[i][0], units[i][1], units[i][2]);
    if (inum !== null) return inum;
  }

  return data;
}

function parseNode(node) {
  const data = { type: node.nodeName };
  if (node.attributes.length > 0) {
    for (let i = 0; i < node.attributes.length; i++) {
      const attr = node.attributes[i]
      data[attr.name] = measure(attr.value, canvas.width, canvas.height);
    }
    if (data.type === 'canvas') Object.assign(canvas, data);
  }

  data.children = [];
  if (data.type === 'html') {
    if (isBrowser) {
      data.innerHTML = node.innerHTML;
    } else {
      const html = xml2string(node);
      data.innerHTML = html.replace(/\<html[^\>]*\>/g, '').replace(/\<\/html[^\>]*\>/g, '');
    }
  } else if (node.childNodes.length > 0) {
    const nodes = Array.isArray(node.childNodes) ? node.childNodes : Object.values(node.childNodes);
    nodes.map(cn => {
      if (typeof(cn) !== 'object' || !cn.nodeName || cn.nodeName.startsWith('#')) return;
      data.children.push(parseNode(cn));
    });
  }
  return data;
}

module.exports = {
  parseXml: function (xml) {
    const oDOM = oParser.parseFromString(xml, "application/xml");
    if (oDOM.documentElement.nodeName.toLowerCase() == 'miraml') {
      return parseNode(oDOM.documentElement, measure);
    }
  }
};