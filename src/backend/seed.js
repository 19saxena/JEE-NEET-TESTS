const mongoose = require('mongoose');
const Question = require('./models/question');

mongoose.connect('mongodb://localhost:27017/jee-neet-tests', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedData = [
  {
    examType: 'JEE',
    year: 2023,
    title: 'JEE Main 2023 Paper',
    link: 'https://example.com/jee-main-2023.pdf',
  },
  {
    examType: 'NEET',
    year: 2023,
    title: 'NEET 2023 Paper',
    link: 'https://example.com/neet-2023.pdf',
  },
];

const seedDatabase = async () => {
  await Question.deleteMany({});
  await Question.insertMany(seedData);
  console.log('Database seeded successfully');
  mongoose.connection.close();
};

seedDatabase();
