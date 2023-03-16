// Import PouchDB
importScripts('https://cdn.jsdelivr.net/npm/pouchdb@7.2.1/dist/pouchdb.min.js');

// Create a new PouchDB database
const db = new PouchDB('recipes');

// Listen for the install event and open a new cache
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('recipes-cache').then(cache => {
            return cache.addAll([
                '/pouchdb/pouchdb.js',
                '/js/db.js',
                '/css/styles.css'
            ]);
        })
    );
});

// Listen for the fetch event and respond with the cached PouchDB database
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) {
                return response;
            }
            return fetch(event.request);
        })
    );
});
