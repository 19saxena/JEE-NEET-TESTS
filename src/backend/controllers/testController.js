import User from '../models/User.js';

// Store Test Results
const storeTestResults = async (req, res) => {
  const { examType, score } = req.body;
  const userId = req.user.id; // Assuming JWT middleware sets req.user

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.tests.push({ examType, score });
    await user.save();

    res.status(200).json({ message: 'Test results saved successfully', tests: user.tests });
  } catch (error) {
    res.status(500).json({ message: 'Error saving test results', error });
  }
};

// Retrieve Test Results
const getTestResults = async (req, res) => {
  const userId = req.user.id; // Assuming JWT middleware sets req.user

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user.tests);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving test results', error });
  }
};

export { storeTestResults, getTestResults };
