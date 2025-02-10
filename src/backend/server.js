const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const path = require("path");
const cors = require("cors");
const app = express();
const port = 5000;

app.use(cors());

const subjectBaseUrls = {
  JEE: {
    Physics: `https://byjus.com/jee/jee-main-{topic}-previous-year-questions-with-solutions/`,
    Chemistry: `https://byjus.com/jee/jee-main-{topic}-previous-year-questions-with-solutions/`,
    Math: `https://byjus.com/jee/jee-main-{topic}-previous-year-questions-with-solutions/`,
  },
  NEET: {
    Biology: `https://byjus.com/neet/neet-previous-year-questions/{topic}/`,
  },
};

function extractPhysicsQuestions($) {
  const questions = [];
  let questionCount = 0;

  $("p strong").each((index, element) => {
    const questionText = $(element).parent().text().trim();

    if (index % 3 === 0) {
      const options = [];
      let current = $(element).parent().next();
      while (current.length && !current.find("strong").length) {
        if (current.is("p")) {
          options.push(current.text().trim());
        }
        current = current.next();
      }
      questions.push({ question: questionText, options: options, correctAnswer: "" });
      questionCount++;
    }

    if (index % 3 === 2) {
      const answerText = $(element).parent().text().trim();
      const correctAnswer = answerText.match(/\(.*\)/) ? answerText.match(/\(.*\)/)[0] : null;

      if (correctAnswer) {
        questions[questionCount - 1].correctAnswer = correctAnswer;
      }
    }
  });

  return questions;
}

function extractChemistryQuestions($) {
  const questions = [];
  let questionCount = 0;

  $("p strong").each((index, element) => {
    const questionText = $(element).parent().text().trim();

    if (index % 2 === 0) {
      const options = [];
      let current = $(element).parent().next();

      while (current.length && !current.find("strong").length) {
        if (current.is("p")) {
          options.push(current.text().trim());
        }
        current = current.next();
      }

      questions.push({ question: questionText, options: options, correctAnswer: "" });
      questionCount++;
    }

    if (index % 2 === 0) {
      let current = $(element).parent().next();
      while (current.length) {
        const answerText = current.text().trim();
        const correctAnswerMatch = answerText.match(/Hence option\s*\((\d)\)/i);

        if (correctAnswerMatch) {
          questions[questionCount - 1].correctAnswer = `(${correctAnswerMatch[1]})`;
          break;
        }

        current = current.next();
      }
    }
  });

  return questions;
}

function extractMathQuestions($) {
  const questions = [];
  let questionCount = 0;

  $("p strong").each((index, element) => {
    const questionText = $(element).parent().text().trim();

    if (index % 3 === 0) {
      const options = [];
      let current = $(element).parent().next();

      while (current.length && !current.find("strong").length) {
        if (current.is("p")) {
          options.push(current.text().trim());
        }
        current = current.next();
      }

      questions.push({ question: questionText, options: options, correctAnswer: "" });
      questionCount++;
    }

    if (index % 3 === 1) {
      const answerText = $(element).parent().text().trim();
      const correctAnswer = answerText.match(/\(.*\)/) ? answerText.match(/\(.*\)/)[0] : null;

      if (correctAnswer) {
        questions[questionCount - 1].correctAnswer = correctAnswer;
      }
    }
  });

  return questions;
}

app.get("/exam", async (req, res) => {
  try {
    const { examType, subject, topic } = req.query;

    if (!examType || !subject || !topic) {
      return res.status(400).json({ error: "Missing examType, subject, or topic." });
    }

    if (!subjectBaseUrls[examType] || !subjectBaseUrls[examType][subject]) {
      return res.status(400).json({ error: "Invalid subject or exam type." });
    }

    const formattedTopic = topic.replace(/\s+/g, "-").toLowerCase();
    const url = subjectBaseUrls[examType][subject].replace("{topic}", formattedTopic);

    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    let questions = [];
    switch (subject) {
      case "Physics":
        questions = extractPhysicsQuestions($);
        break;
      case "Chemistry":
        questions = extractChemistryQuestions($);
        break;
      case "Math":
        questions = extractMathQuestions($);
        break;
      default:
        return res.status(400).json({ error: "Invalid subject." });
    }

    // Mock logic to determine correct answers
    let correctCount = 0;
    questions.forEach((question, index) => {
      // Example placeholder: assume every alternate question is correct
       // Mock correctness logic
      if (question.isCorrect) correctCount++;
    });

    const totalQuestions = questions.length;
    const accuracy = totalQuestions > 0 ? ((correctCount / totalQuestions) * 100).toFixed(2) : 0;

    if (totalQuestions > 0) {
      return res.json({
        questions,
        topicAnalysis: [{
          subject,
          topic,
          correct: correctCount,
          total: totalQuestions,
          accuracy,
          timeSpent: totalQuestions * 10, // Mocking 10 seconds per question
        }],
      });
    }

    res.status(404).json({ error: "No valid questions found." });
  } catch (error) {
    console.error("Error scraping questions:", error.message);
    res.status(500).json({ error: "Failed to scrape questions." });
  }
});


app.post("/submit-results", express.json(), (req, res) => {
  try {
    const { subject, questions } = req.body;

    if (!subject || !questions) {
      return res.status(400).json({ error: "Missing required data for analysis." });
    }

    const topicAnalysis = {};
    let correctCount = 0;

    const detailedResults = questions.map((question, index) => {
      const isCorrect = question.userSelectedAnswer === question.correctAnswer;
      if (isCorrect) correctCount++;

      if (!topicAnalysis[question.topic]) {
        topicAnalysis[question.topic] = {
          correct: 0,
          total: 0,
        };
      }

      topicAnalysis[question.topic].correct += isCorrect ? 1 : 0;
      topicAnalysis[question.topic].total++;

      return {
        question: question.question,
        correctAnswer: question.correctAnswer,
        userAnswer: question.userSelectedAnswer,
        isCorrect,
        topic: question.topic,
      };
    });

    const accuracy = ((correctCount / questions.length) * 100).toFixed(2);

    return res.json({
      subject,
      accuracy,
      detailedResults,
      topicAnalysis,
    });
  } catch (error) {
    console.error("Error processing results:", error.message);
    res.status(500).json({ error: "Server error." });
  }
});

app.get("/result-subtopics", (req, res) => {
  try {
    const { subject } = req.query;

    if (!subject) {
      return res.status(400).json({ error: "Subject parameter is required." });
    }

    const subtopics = {
      Physics: ["elasticity", "capacitor", "gravitation"],
      Chemistry: ["thermodynamics", "periodic-table", "chemical-bonding"],
      Math: ["system-of-linear-equations", "mathematical-reasoning"],
      Biology: ["genetics", "ecology", "cell"],
    };

    if (!subtopics[subject]) {
      return res.status(400).json({ error: "Invalid subject." });
    }

    return res.json({ subject, subtopics: subtopics[subject] });
  } catch (error) {
    console.error("Error fetching subtopics:", error.message);
    res.status(500).json({ error: "Server error." });
  }
});

app.use(express.static(path.join(__dirname, "../../dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../dist/index.html"));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
