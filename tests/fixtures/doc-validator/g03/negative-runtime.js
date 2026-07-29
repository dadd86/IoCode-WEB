fetch("/local-data.json");
import("/local-module.js");

const request = new XMLHttpRequest();
request.open("GET", "/local-request.json");

new WebSocket("/local-socket");
new EventSource("/local-events");

const documentationUrl = "https://developer.mozilla.org/";
