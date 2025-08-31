(function() {
  // Replace BUSINESS_ID dynamically
  const businessId = 'BUSINESS_ID'; // This will be replaced in dashboard for each business

  // Create widget container
  const widget = document.createElement('div');
  widget.id = 'ai-chat-widget';
  widget.style.position = 'fixed';
  widget.style.bottom = '20px';
  widget.style.right = '20px';
  widget.style.width = '350px';
  widget.style.maxHeight = '500px';
  widget.style.border = '1px solid #ccc';
  widget.style.borderRadius = '10px';
  widget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
  widget.style.background = '#fff';
  widget.style.zIndex = '99999';
  widget.style.display = 'flex';
  widget.style.flexDirection = 'column';
  widget.style.overflow = 'hidden';
  widget.style.fontFamily = 'Arial, sans-serif';
  
  // Header
  const header = document.createElement('div');
  header.style.background = '#4f46e5';
  header.style.color = '#fff';
  header.style.padding = '10px';
  header.style.textAlign = 'center';
  header.style.fontWeight = 'bold';
  header.innerText = 'Chat with us';
  widget.appendChild(header);

  // Message container
  const messages = document.createElement('div');
  messages.style.flex = '1';
  messages.style.padding = '10px';
  messages.style.overflowY = 'auto';
  messages.style.background = '#f9f9f9';
  widget.appendChild(messages);

  // Input container
  const inputContainer = document.createElement('div');
  inputContainer.style.display = 'flex';
  inputContainer.style.borderTop = '1px solid #ccc';
  
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Type your message...';
  input.style.flex = '1';
  input.style.padding = '10px';
  input.style.border = 'none';
  input.style.outline = 'none';
  
  const sendBtn = document.createElement('button');
  sendBtn.innerText = 'Send';
  sendBtn.style.padding = '10px';
  sendBtn.style.background = '#4f46e5';
  sendBtn.style.color = '#fff';
  sendBtn.style.border = 'none';
  sendBtn.style.cursor = 'pointer';

  inputContainer.appendChild(input);
  inputContainer.appendChild(sendBtn);
  widget.appendChild(inputContainer);

  document.body.appendChild(widget);

  // Firebase init
  if (!window.firebaseApp) {
    const firebaseScript = document.createElement('script');
    firebaseScript.src = 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js';
    firebaseScript.onload = () => initFirebase();
    document.head.appendChild(firebaseScript);
  } else {
    initFirebase();
  }

  function initFirebase() {
    const authScript = document.createElement('script');
    authScript.src = 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js';
    authScript.onload = () => {
      // Initialize Firebase
      const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_PROJECT_ID.appspot.com",
        messagingSenderId: "YOUR_SENDER_ID",
        appId: "YOUR_APP_ID"
      };
      if (!window.firebaseApp) {
        window.firebaseApp = firebase.initializeApp(firebaseConfig);
        window.db = firebase.firestore();
      }
    };
    document.head.appendChild(authScript);
  }

  // Send message
  async function sendMessage(msg) {
    if (!msg) return;
    addMessage(msg, 'user');
    input.value = '';
    
    // Save message to Firebase
    await window.db.collection('messages').add({
      businessId,
      message: msg,
      sender: 'customer',
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    // Call AI API
    fetch(`https://your-saas.com/api/ai?businessId=${businessId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg })
    })
    .then(res => res.json())
    .then(data => {
      addMessage(data.reply, 'ai');
      // Save AI response to Firebase
      window.db.collection('messages').add({
        businessId,
        message: data.reply,
        sender: 'ai',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    });
  }

  function addMessage(msg, sender) {
    const msgEl = document.createElement('div');
    msgEl.innerText = msg;
    msgEl.style.margin = '5px 0';
    msgEl.style.padding = '8px';
    msgEl.style.borderRadius = '6px';
    msgEl.style.background = sender === 'ai' ? '#e5e7eb' : '#4f46e5';
    msgEl.style.color = sender === 'ai' ? '#000' : '#fff';
    msgEl.style.alignSelf = sender === 'ai' ? 'flex-start' : 'flex-end';
    messages.appendChild(msgEl);
    messages.scrollTop = messages.scrollHeight;
  }

  sendBtn.addEventListener('click', () => sendMessage(input.value));
  input.addEventListener('keypress', e => { if (e.key === 'Enter') sendMessage(input.value) });
})();
