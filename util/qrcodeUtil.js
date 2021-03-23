const QRCode = require('qrcode');
const { encrypt } = require('./cryptoUtil');

module.exports = async function getDataUrl(data) {
  if (!data) {
    return '';
  }
  const string = Date.now() + '/' + data;
  const encrypted = encrypt(string);
  const url = await QRCode.toDataURL(encrypted);
  return url;
}
