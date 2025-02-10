import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  examType: { type: String, required: true }, // "JEE" or "NEET"
  year: { type: Number, required: true },
  title: { type: String, required: true },
  link: { type: String, required: true }, // URL to download the paper
});

export default ('Question', questionSchema);
