module.exports = {
  /**
  * @function formatDate
  * @param {string} dateString formatting should be 'yyyy-mm-dd'
  * @param {string} locale BCP 47 language tag, e.g. 'en-us'
  * @param {object} options includes keys for weekday, year, month, day, hour, etc.
  */
  formatDate: function (dateString, locale, options) {
    return new Date(dateString).toLocaleString(locale, options);
  }
};