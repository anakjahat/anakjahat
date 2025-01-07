const express = require('express');
const multer = require('multer');
const app = express();

const upload = multer({ dest: 'uploads/' }); // Simpan file audio di folder "uploads"

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint untuk menerima pesan
app.post('/send-message', upload.single('audio'), (req, res) => {
  const { sender, recipient, message } = req.body;
  const audioUrl = req.file ? `/uploads/${req.file.filename}` : null;

  console.log("Pesan diterima:", { sender, recipient, message, audioUrl });
  res.json({ success: true, message: "Pesan berhasil disimpan!" });
});

// Menyediakan file audio
app.use('/uploads', express.static('uploads'));

app.listen(3000, () => console.log("Server berjalan di http://localhost:3000"));
