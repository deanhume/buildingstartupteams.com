'use strict';

var cacheVersion = 1;
var currentCache = {
  offline: 'offline-cache' + cacheVersion
};
const offlineUrl = 'offline-page.html';

this.addEventListener('install', event => {
  event.waitUntil(
    caches.open(currentCache.offline).then(function(cache) {
      return cache.addAll([
          'result.min.css',
          './js/material.min.js',
          offlineUrl
      ]);
    })
  );
});

this.addEventListener('fetch', event => {

    // Check for WebP image support
  	if (/\.jpg$|.png$/.test(event.request.url)) {

  		// Inspect the accept header for WebP support
      var supportsWebp = false;
      if (event.request.headers.has('accept')){
          supportsWebp = event.request.headers
                                      .get('accept')
                                      .includes('webp');
      }

  		// If we support WebP
  		if (supportsWebp)
  		{
          // Clone the request
          var req = event.request.clone();

          // Build the return URL
    			var returnUrl = req.url.substr(0, req.url.lastIndexOf(".")) + ".webp";

          event.respondWith(
            fetch(returnUrl, {
              mode: 'no-cors'
            })
          );
      }
	}
  // Offline page
  else if (event.request.mode === 'navigate' || (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
        event.respondWith(
          fetch(event.request.url).catch(error => {
              // Return the offline page
              return caches.match(offlineUrl);
          })
    );
  }
  else{
        // Respond with everything else if we can
        event.respondWith(caches.match(event.request)
                        .then(function (response) {
                        return response || fetch(event.request);
                    })
            );
      }
});
