let mediaRecorder;
let audioChunks = [];

document.getElementById("startRecording").addEventListener("click", () => {
  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();
    audioChunks = [];

    document.getElementById("startRecording").disabled = true;
    document.getElementById("stopRecording").disabled = false;

    mediaRecorder.ondataavailable = event => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      document.getElementById("audioPlayback").src = audioUrl;

      // Simpan file audio (kita akan kirim ke server nanti)
      console.log("Audio direkam:", audioBlob);
    };
  });
});

document.getElementById("stopRecording").addEventListener("click", () => {
  mediaRecorder.stop();
  document.getElementById("startRecording").disabled = false;
  document.getElementById("stopRecording").disabled = true;
});

document.getElementById("messageForm").addEventListener("submit", (event) => {
  event.preventDefault();
  alert("Pesan Anda berhasil dikirim!");
});
document.getElementById("messageForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const sender = document.getElementById("sender").value;
  const recipient = document.getElementById("recipient").value;
  const message = document.getElementById("message").value;
  const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });

  const formData = new FormData();
  formData.append("sender", sender);
  formData.append("recipient", recipient);
  formData.append("message", message);
  formData.append("audio", audioBlob);

  fetch('/send-message', {
    method: 'POST',
    body: formData,
  }).then(response => response.json()).then(data => {
    alert(data.message);
  });
});
