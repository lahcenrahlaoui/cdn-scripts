(function(){
  // Base‑64‑encoded allowed hosts (including port)
  const _encoded = [
    "bG9jYWxob3N0OjMwMDA=",      // "localhost:3000"
    "ZXhhbXBsZS5jb20=",          // "example.com"
    "YW5vdGhlcmRvbWFpbi5jb20="   // "anotherdomain.com"
  ];
  
  // Decode into plain‑text host strings
  const _allowedHosts = _encoded.map(atob);
  
  // location.host includes port (e.g., "localhost:3000")
  const _currentHost = location.host;

  if (_allowedHosts.includes(_currentHost)) {
    setInterval(() => {
      console.log(`[CDN SCRIPT] Running on authorized host: ${_currentHost}`);
    }, 1000);
  } else {
    console.warn(`[CDN SCRIPT] Access denied — this script is blocked on: ${_currentHost}`);
  }
})();
