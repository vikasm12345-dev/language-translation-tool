// Load voices when page loads
let voices = [];
function loadVoices() {
  voices = window.speechSynthesis.getVoices();
}
loadVoices();
if (window.speechSynthesis.onvoiceschanged !== undefined) {
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

async function translateText() {
  const text = document.getElementById("inputText").value;
  const source = document.getElementById("sourceLang").value;
  const target = document.getElementById("targetLang").value;

  if (!text.trim()) {
    alert("Please enter some text to translate.");
    return;
  }

  document.getElementById("outputText").value = "Translating...";

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;
    
    const res = await fetch(url);
    const data = await res.json();
    
    let translatedText = "";
    data[0].forEach(item => {
      if (item[0]) translatedText += item[0];
    });
    
    document.getElementById("outputText").value = translatedText;
  } catch (err) {
    document.getElementById("outputText").value = "";
    alert("Translation failed. Please check your internet connection and try again.");
    console.error(err);
  }
}

function copyText() {
  const output = document.getElementById("outputText");
  if (!output.value) return alert("Nothing to copy!");
  output.select();
  document.execCommand("copy");
  alert("Copied to clipboard!");
}

function speakText() {
  const text = document.getElementById("outputText").value;
  if (!text) {
    alert("Nothing to speak! Please translate something first.");
    return;
  }

  // Check if browser supports speech
  if (!('speechSynthesis' in window)) {
    alert("Sorry, your browser doesn't support text-to-speech.");
    return;
  }

  // Stop any ongoing speech
  window.speechSynthesis.cancel();

  const target = document.getElementById("targetLang").value;
  const speech = new SpeechSynthesisUtterance(text);
  
  // Try to find a matching voice for the target language
  const availableVoices = window.speechSynthesis.getVoices();
  const matchingVoice = availableVoices.find(voice => 
    voice.lang.toLowerCase().startsWith(target.toLowerCase())
  );
  
  if (matchingVoice) {
    speech.voice = matchingVoice;
    speech.lang = matchingVoice.lang;
  } else {
    speech.lang = target;
    console.warn(`No voice found for ${target}. Using default.`);
  }
  
  speech.rate = 0.9;
  speech.pitch = 1;
  speech.volume = 1;

  speech.onerror = (e) => {
    console.error("Speech error:", e);
    alert("Speech error occurred. Try a different language or browser.");
  };

  window.speechSynthesis.speak(speech);
}
