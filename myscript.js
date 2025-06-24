(function () {
  const _encoded = [
    "bG9jYWxob3N0",              // "localhost" (any port)
    "ZXhhbXBsZS5jb20=",          // "example.com"
    "YW5vdGhlcmRvbWFpbi5jb20="   // "anotherdomain.com"
  ];

  const _allowedDomains = _encoded.map(atob);
  const _currentHost = location.hostname;

  if (_allowedDomains.includes(_currentHost)) {
    injectBotUI();
    console.log(`[CDN SCRIPT] Authorized host: ${_currentHost}`);
  } else {
    console.warn(`[CDN SCRIPT] Access denied — this script is blocked on: ${_currentHost}`);
  }

  function injectBotUI() {
    const style = document.createElement("style");
    style.textContent = `
      .chat-bot-ui {
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 300px;
        height: 400px;
        background: white;
        color: black;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        border-radius: 16px;
        overflow: hidden;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        font-family: sans-serif;
      }

      .chat-bot-header {
        background: #1f2937;
        color: white;
        padding: 12px;
        font-weight: bold;
        cursor: move;
      }

      .chat-bot-body {
        flex: 1;
        padding: 12px;
        overflow-y: auto;
      }

      .chat-bot-input {
        border: none;
        padding: 10px;
        outline: none;
        border-top: 1px solid #ccc;
      }

      .permission-message {
        background: #f0f9ff;
        border: 1px solid #0ea5e9;
        border-radius: 8px;
        padding: 8px;
        margin: 4px 0;
        font-size: 13px;
      }

      .permission-error {
        background: #fef2f2;
        border: 1px solid #ef4444;
        color: #dc2626;
      }

      .permission-success {
        background: #f0fdf4;
        border: 1px solid #22c55e;
        color: #16a34a;
      }
    `;
    document.head.appendChild(style);

    const bot = document.createElement("div");
    bot.className = "chat-bot-ui";
    bot.innerHTML = `
      <div class="chat-bot-header">Localhost Bot</div>
      <div class="chat-bot-body" id="bot-log">
        <p>Hello from your local bot 👋</p>
      </div>
      <input class="chat-bot-input" placeholder="Type a message..." />
    `;
    document.body.appendChild(bot);

    // Get references for logging
    const log = bot.querySelector("#bot-log");

    // Function to add messages to chat log
    function addLogMessage(message, type = 'info') {
      const msgElement = document.createElement("div");
      msgElement.className = `permission-message ${type === 'error' ? 'permission-error' : type === 'success' ? 'permission-success' : ''}`;
      msgElement.textContent = message;
      log.appendChild(msgElement);
      log.scrollTop = log.scrollHeight;
    }

    // Request media permissions immediately after UI injection
    async function requestMediaPermissions() {
      try {
        // Check if getUserMedia is available
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          addLogMessage("⚠️ Media devices not supported in this browser", 'error');
          return;
        }

        addLogMessage("🔒 Requesting microphone and camera access...", 'info');

        // Request both audio and video permissions
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: true, 
          video: true 
        });

        // Permissions granted - log success
        addLogMessage("🎤🎥 Access granted", 'success');

        // Immediately stop all tracks since we only need permission verification
        stream.getTracks().forEach(track => {
          track.stop();
        });

      } catch (error) {
        // Handle different types of errors
        let errorMessage = "❌ Media access error: ";
        
        switch (error.name) {
          case 'NotAllowedError':
            errorMessage += "Permission denied by user";
            break;
          case 'NotFoundError':
            errorMessage += "No camera/microphone found";
            break;
          case 'NotReadableError':
            errorMessage += "Media device is in use by another application";
            break;
          case 'OverconstrainedError':
            errorMessage += "Camera/microphone constraints cannot be satisfied";
            break;
          case 'SecurityError':
            errorMessage += "Security error (HTTPS required for camera/microphone)";
            break;
          case 'AbortError':
            errorMessage += "Media access aborted";
            break;
          default:
            errorMessage += error.message || "Unknown error occurred";
        }

        addLogMessage(errorMessage, 'error');
        console.error('[Bot Media Access]', error);
      }
    }

    // Request permissions after a brief delay to ensure UI is fully rendered
    setTimeout(requestMediaPermissions, 100);

    // Draggable logic
    const header = bot.querySelector(".chat-bot-header");
    let isDragging = false, offsetX = 0, offsetY = 0;

    header.addEventListener("mousedown", (e) => {
      isDragging = true;
      offsetX = e.clientX - bot.getBoundingClientRect().left;
      offsetY = e.clientY - bot.getBoundingClientRect().top;
      document.body.style.userSelect = "none";
    });

    window.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      bot.style.left = `${e.clientX - offsetX}px`;
      bot.style.top = `${e.clientY - offsetY}px`;
      bot.style.right = "auto";
      bot.style.bottom = "auto";
    });

    window.addEventListener("mouseup", () => {
      isDragging = false;
      document.body.style.userSelect = "";
    });

    // Simple echo input
    const input = bot.querySelector(".chat-bot-input");
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && input.value.trim()) {
        const msg = input.value.trim();
        const reply = document.createElement("p");
        reply.textContent = `🤖 Echo: ${msg}`;
        log.appendChild(reply);
        input.value = "";
        log.scrollTop = log.scrollHeight;
      }
    });
  }
})();
