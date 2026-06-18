async function translateText() {
  const text = document.getElementById("inputText").value;
  const source = document.getElementById("sourceLang").value;
  const target = document.getElementById("targetLang").value;

  if (!text.trim()) {
    alert("Please enter some text to translate.");
    return;
  }

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${target}`;
    const res = await fetch(url);
    const data = await res.json();
    document.getElementById("outputText").value = data.responseData.translatedText;
  } catch (err) {
    alert("Translation failed. Please try again.");
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
  if (!text) return alert("Nothing to speak!");
  const speech = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(speech);
}