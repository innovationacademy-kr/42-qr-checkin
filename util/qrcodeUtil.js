const QRCode = require('qrcode');
const { encrypt,decrypt } = require('./cryptoUtil');

module.exports = async function getDataUrl(data) {
  if (!data) {
    return '';
  }
  const string = Date.now() + '|' + data;
  return await QRCode.toDataURL(encrypt(string));;
}
