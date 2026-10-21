const chatForm = document.getElementById("chat-form");
const messageInput = document.getElementById("message");
const modelSelect = document.getElementById("model");
const messages = document.getElementById("messages");
const sendButton = chatForm.querySelector("button");

let busy = false;

// Display messages in the chat
function addMessage(text, sender) {
  const messageRow = document.createElement("div");
  messageRow.className = `message-row ${sender}`;

  // Fix the message row layout
  messageRow.style.display = "flex";
  messageRow.style.flexDirection = "row";
  messageRow.style.alignItems = "flex-end";
  messageRow.style.gap = "10px";
  messageRow.style.marginBottom = "12px";
  messageRow.style.background = "transparent";

  if (sender === "user") {
    messageRow.style.justifyContent = "flex-end";
  } else {
    messageRow.style.justifyContent = "flex-start";
  }

  // Create message bubble
  const bubble = document.createElement("div");
  bubble.className = `bubble ${sender}`;
  bubble.textContent = text;

  // Fix bubble appearance
  bubble.style.padding = "12px 15px";
  bubble.style.borderRadius = "12px";
  bubble.style.maxWidth = "75%";
  bubble.style.margin = "0";
  bubble.style.lineHeight = "1.5";
  bubble.style.whiteSpace = "pre-wrap";
  bubble.style.overflowWrap = "anywhere";

  if (sender === "bot") {
    bubble.style.background = "#343943";

    const avatar = document.createElement("img");

    const model = modelSelect.value;

    const profilePics = {
      Castiel: "/static/images/Castiel.png",
      Sam: "/static/images/Sam.jpg",
      Dean: "/static/images/Dean.png",
    };

    avatar.src = profilePics[model];
    avatar.className = "avatar";
    avatar.alt = model;

    // Fix avatar appearance
    avatar.style.width = "50px";
    avatar.style.height = "50px";
    avatar.style.minWidth = "40px";
    avatar.style.objectFit = "cover";
    avatar.style.borderRadius = "50%";
    avatar.style.flexShrink = "0";

    messageRow.appendChild(avatar);
  } else {
    bubble.style.background = "#3d5477";
  }

  messageRow.appendChild(bubble);
  messages.appendChild(messageRow);

  messages.scrollTop = messages.scrollHeight;
}

// Send a message to FastAPI
chatForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  if (busy) {
    return;
  }

  const message = messageInput.value.trim();
  const model = modelSelect.value;

  if (!message) {
    return;
  }

  addMessage(message, "user");
  messageInput.value = "";

  busy = true;
  sendButton.disabled = true;
  modelSelect.disabled = true;

  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        message: message,
      }),
    });

    if (!response.ok) {
      throw new Error("Unable to get a response");
    }

    const data = await response.json();

    addMessage(data.response, "bot");
  } catch (error) {
    console.error(error);
    addMessage("Sorry, something went wrong.", "bot");
  } finally {
    busy = false;
    sendButton.disabled = false;
    modelSelect.disabled = false;
    messageInput.focus();
  }
});

// Reset conversation when switching characters
modelSelect.addEventListener("change", async function () {
  const model = modelSelect.value;

  messages.innerHTML = "";

  busy = true;
  sendButton.disabled = true;
  modelSelect.disabled = true;

  try {
    const response = await fetch("/reset-chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model: model }),
    });

    if (!response.ok) {
      throw new Error("Unable to reset conversation");
    }

    messages.innerHTML =
      '<p class="welcome">Conversation cleared. Say hello!</p>';
  } catch (error) {
    console.error(error);
    addMessage("Could not reset the conversation.", "bot");
  } finally {
    busy = false;
    sendButton.disabled = false;
    modelSelect.disabled = false;
  }
});
