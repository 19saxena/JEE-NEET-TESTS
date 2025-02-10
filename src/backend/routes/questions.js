import express from 'express';
import Question from '../models/question.js';

const router = express.Router();

// Fetch question papers based on exam type
router.get('/', async (req, res) => {
  const { examType } = req.query;
  try {
    const questions = await Question.find({ examType });
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching question papers', error });
  }
});

// Add a new question paper (admin only)
router.post('/', async (req, res) => {
  const { examType, year, title, link } = req.body;

  try {
    const newQuestion = new Question({ examType, year, title, link });
    await newQuestion.save();
    res.status(201).json({ message: 'Question paper added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding question paper', error });
  }
});

export default router;