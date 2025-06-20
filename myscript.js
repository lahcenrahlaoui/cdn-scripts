(function(){
  const _encoded = [
    "bG9jYWxob3N0",           // "localhost"
    "ZXhhbXBsZS5jb20=",       // "example.com"
    "YW5vdGhlcmRvbWFpbi5jb20=" // "anotherdomain.com"
  ];
  const _allowed = _encoded.map(atob);
  const _host = location.hostname;

  if (_allowed.includes(_host)) {
    setInterval(() => {
      console.log("Hello from my CDN script!");
    }, 5000);
  } else {
    console.warn("Blocked by CDN script on:", _host);
  }
})();
