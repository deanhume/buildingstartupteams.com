'use strict';

var cacheVersion = 2;
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
          'https://fonts.googleapis.com/css?family=Roboto:regular,bold,italic,thin,light,bolditalic,black,medium&lang=en',
          'https://fonts.googleapis.com/icon?family=Material+Icons',
          'https://fonts.gstatic.com/s/roboto/v15/RxZJdnzeo3R5zSexge8UUVtXRa8TVwTICgirnJhmVJw.woff2',
          'https://fonts.gstatic.com/s/roboto/v15/vPcynSL0qHq_6dX7lKVByfesZW2xOQ-xsNqO47m55DA.woff2',
          'https://fonts.gstatic.com/s/roboto/v15/CWB0XYA8bzo0kSThX0UTuA.woff2',
          'https://fonts.gstatic.com/s/roboto/v15/Hgo13k-tfSpn0qi1SFdUfVtXRa8TVwTICgirnJhmVJw.woff2',
          'https://fonts.gstatic.com/s/roboto/v15/RxZJdnzeo3R5zSexge8UUVtXRa8TVwTICgirnJhmVJw.woff2',
          'https://fonts.gstatic.com/s/roboto/v15/vPcynSL0qHq_6dX7lKVByfesZW2xOQ-xsNqO47m55DA.woff2',
          'https://fonts.gstatic.com/s/roboto/v15/CWB0XYA8bzo0kSThX0UTuA.woff2',
          'https://fonts.gstatic.com/s/roboto/v15/Hgo13k-tfSpn0qi1SFdUfVtXRa8TVwTICgirnJhmVJw.woff2',
          'https://fonts.gstatic.com/s/materialicons/v12/2fcrYFNaTjcS6g4U3t-Y5ZjZjT5FdEJ140U2DJYC3mY.woff2',
          'https://fonts.gstatic.com/s/materialicons/v12/2fcrYFNaTjcS6g4U3t-Y5ZjZjT5FdEJ140U2DJYC3mY.woff2',
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

    // We want to save data, so restrict icons and fonts too
    if (event.request.url.includes('fonts.googleapis.com')) {
        // return nothing
        event.respondWith(new Response('', {status: 408, statusText: 'Ignore fonts to save data.' }));
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
