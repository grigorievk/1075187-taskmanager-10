self.addEventListener(`install`, (event) => {
});

self.addEventListener(`activate`, (event) => {
  event.waitUntil(
      caches.keys()
        .then(
            (keys) => Promise.all(
                keys.map(
                    (key) => {
                      if (key.indexOf(CACHE_PREFIX) === 0 && key !== CACHE_NAME) {
                        return caches.delete(key);
                      }

                      return null;
                    }
                ).filter(
                    (key) => key !== null
                )
            )
        )
  );
});

const fetchHandler = (event) => {
  const {request} = event;

  event.respondWith(
      caches.match(request)
        .then((cacheResponse) => {
          if (cacheResponse) {
            return cacheResponse;
          }

          return fetch(request)
            .then((response) => {
              if (!response || response.status !== 200 || response.type !== `basic`) {
                return response;
              }

              const clonedResponse = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, clonedResponse));

              return response;
            });
        })
  );
};

self.addEventListener(`fetch`, fetchHandler);
