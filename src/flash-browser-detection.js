/**
 * Based on 
 * https://code.google.com/p/doctype-mirror/wiki/ArticleDetectFlash#The_code
 */
(function() {
  /**
   * Derived from Apple's suggested sniffer.
   * @param {String} desc e.g. Shockwave Flash 7.0 r61
   * @return {String} 7.0.61
   */
  function getFlashVersion(desc) {
    var matches = desc.match(/[\d]+/g);
    matches.length = 3;  // To standardize IE vs FF
    return matches.join('.');
  }

  var hasFlash = false;
  var flashVersion = '';

  if (navigator.plugins && navigator.plugins.length) {
    var plugin = navigator.plugins['Shockwave Flash'];
    if (plugin) {
      hasFlash = true;
      if (plugin.description) {
        flashVersion = getFlashVersion(plugin.description);
      }
    }

    if (navigator.plugins['Shockwave Flash 2.0']) {
      hasFlash = true;
      flashVersion = '2.0.0.11';
    }

  } else if (navigator.mimeTypes && navigator.mimeTypes.length) {
    var mimeType = navigator.mimeTypes['application/x-shockwave-flash'];
    hasFlash = mimeType && mimeType.enabledPlugin;
    if (hasFlash) {
      flashVersion = getFlashVersion(mimeType.enabledPlugin.description);
    }

  } else {
    try {
      // Try 7 first, since we know we can use GetVariable with it
      var ax = new ActiveXObject('ShockwaveFlash.ShockwaveFlash.7');
      hasFlash = true;
      flashVersion = getFlashVersion(ax.GetVariable('$version'));
    } catch (e) {
      // Try 6 next, some versions are known to crash with GetVariable calls
      try {
        var ax = new ActiveXObject('ShockwaveFlash.ShockwaveFlash.6');
        hasFlash = true;
        flashVersion = '6.0.21';  // First public version of Flash 6
      } catch (e) {
        try {
          // Try the default activeX
          var ax = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
          hasFlash = true;
          flashVersion = getFlashVersion(ax.GetVariable('$version'));
        } catch (e) {
          // No flash
        }
      }
    }
  }

  /**
   * Append the no-flash class to html tag if the browser does not support Flash
   */
  if (!hasFlash) {
    document.documentElement.className += ' no-flash';
  }

})();
