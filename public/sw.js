// Import workbox modules using dynamic import
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

workbox.routing.registerRoute(
  ({ url }) => url.pathname === "/book",
  new workbox.strategies.NetworkOnly()
);
