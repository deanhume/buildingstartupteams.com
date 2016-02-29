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

  // Offline support
  if (event.request.mode === 'navigate' || (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
        event.respondWith(
          fetch(event.request.url).catch(error => {
              // Return the offline page
              return caches.match(offlineUrl);
          })
    );
  }
  // Save Data support
  else if(event.request.headers.get('save-data')){
    //Return smaller images
    if (/\.jpg$|.gif$|.png$/.test(event.request.url)) {

      let saveDataUrl = event.request.url.substr(0, event.request.url.lastIndexOf(".")) + '-savedata' + event.request.url.substr(event.request.url.lastIndexOf("."), event.request.url.length - 1);

      event.respondWith(
        fetch(saveDataUrl, {
          mode: 'no-cors'
        })
      );
    }

    // We want to save data, so restrict icons and fonts
    if (event.request.url.includes('fonts.googleapis.com')) {
        // return nothing
        event.respondWith(new Response('', {status: 408, statusText: 'Request timed out.' }));
    }
  }
  // Check for WebP image support
  else if (/\.jpg$|.gif$|.png$/.test(event.request.url)) {
    // Inspect the accept header for WebP support
    let supportsWebp = false;
    if (event.request.headers.has('accept')){
        supportsWebp = event.request.headers
                                    .get('accept')
                                    .includes('webp');
    }

    // If we support WebP
    if (supportsWebp)
    {
        // Clone the request
        let req = event.request.clone();

        // Build the return URL
        let returnUrl = req.url.substr(0, req.url.lastIndexOf(".")) + ".webp";

        event.respondWith(
          fetch(returnUrl, {
            mode: 'no-cors'
          })
        );
    }
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
