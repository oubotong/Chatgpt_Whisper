const FormData = require('form-data');
import { withFileUpload } from 'next-multiparty';
import { createReadStream } from 'fs';

export const config = {
  api: {
    bodyParser: false,
  }
};


export default withFileUpload(async (req, res) => {
  const file = req.file;
  if (!file) {
    res.status(400).send('No file uploaded');
    return;
  }

  console.log(file.filepath);

  const formData = new FormData();
  formData.append('file', createReadStream(file.filepath), 'audio.webm');
  formData.append('model', 'whisper-1');
  formData.append('language', 'en');
  const response = await fetch(
    'https://api.openai.com/v1/audio/transcriptions',
    {
      method: 'POST',
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: formData,
    }
  );

  const {text} = await response.json();
  if (response.ok) {
    res.status(200).json({ text: text });
  } else {
    res.status(400).send(new Error());
  }
});