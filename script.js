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
  if (!text) return alert("Nothing to speak!");
  
  const target = document.getElementById("targetLang").value;
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = target;
  window.speechSynthesis.speak(speech);
}
