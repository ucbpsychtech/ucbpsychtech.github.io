const version = '20190903184747';
const cacheName = `static::${version}`;

const buildContentBlob = () => {
  return ["/cognitive%20neuroscience/sleep/cardiovascular%20health/aging/2019/09/03/Vyoma-Shah/","/behavior%20and%20systems%20neuroscience/cognitive%20neuroscience/memory/2019/08/07/Alice-Berners-Lee/","/developmental%20psychology/cognitive%20neuroscience/childhood%20inequality/language/2019/07/13/Monica-Ellwood-Lowe/","/cognitive%20neuroscience/artificial%20intelligence/emotion%20recognition/2019/07/13/Mandy-Chen/","/developmental%20psychology/artificial%20intellignece/2019/07/13/Eliza-Kosoy/","/social-personality/cognitive%20neuroscience/emotion%20recognition/artificial%20intelligence/2019/07/13/Alan-Cowen/","/about/","/categories/","/contact/","/donate/","/spotlights/","/","/outreach/","/assets/styles.css","/thanks/","/manifest.json","/assets/search.json","/redirects.json","/sitemap.xml","/robots.txt","/spotlights/page2/","/feed.xml","https://upload.wikimedia.org/wikipedia/commons/7/74/Greek_uc_psi.svg", "/assets/default-offline-image.png", "/assets/scripts/fetch.js"
  ]
}

const updateStaticCache = () => {
  return caches.open(cacheName).then(cache => {
    return cache.addAll(buildContentBlob());
  });
};

const clearOldCache = () => {
  return caches.keys().then(keys => {
    // Remove caches whose name is no longer valid.
    return Promise.all(
      keys
        .filter(key => {
          return key !== cacheName;
        })
        .map(key => {
          console.log(`Service Worker: removing cache ${key}`);
          return caches.delete(key);
        })
    );
  });
};

self.addEventListener("install", event => {
  event.waitUntil(
    updateStaticCache().then(() => {
      console.log(`Service Worker: cache updated to version: ${cacheName}`);
    })
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(clearOldCache());
});

self.addEventListener("fetch", event => {
  let request = event.request;
  let url = new URL(request.url);

  // Only deal with requests from the same domain.
  if (url.origin !== location.origin) {
    return;
  }

  // Always fetch non-GET requests from the network.
  if (request.method !== "GET") {
    event.respondWith(fetch(request));
    return;
  }

  // Default url returned if page isn't cached
  let offlineAsset = "/offline/";

  if (request.url.match(/\.(jpe?g|png|gif|svg)$/)) {
    // If url requested is an image and isn't cached, return default offline image
    offlineAsset = "/assets/default-offline-image.png";
  }

  // For all urls request image from network, then fallback to cache, then fallback to offline page
  event.respondWith(
    fetch(request).catch(async () => {
      return (await caches.match(request)) || caches.match(offlineAsset);
    })
  );
  return;
});
