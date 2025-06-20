(function(){
  const _encoded = [
    "bG9jYWxob3N0OjMwMDA=",      // "localhost:3000"
    "ZXhhbXBsZS5jb20=",          // "example.com"
    "YW5vdGhlcmRvbWFpbi5jb20="   // "anotherdomain.com"
  ];
  const _allowedHosts = _encoded.map(atob);
  const _currentHost = location.host; // includes port (e.g., "localhost:3000")

  if (_allowedHosts.includes(_currentHost)) {
    setInterval(() => {
      console.log("Hello from my CDN script!");
    }, 5000);
  } else {
    console.warn("CDN script blocked on:", _currentHost);
  }
})();
