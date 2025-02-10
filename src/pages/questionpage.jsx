import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./questionpage.css";

const QuestionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const examType = searchParams.get("examType") || "JEE";
  const initialSubject = searchParams.get("subject") || "Physics";

  const [questions, setQuestions] = useState([]);
  const [questionStatus, setQuestionStatus] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [subject, setSubject] = useState(initialSubject);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [timeLeft, setTimeLeft] = useState(3 * 60 * 60); // 3 hours in seconds
  const [startTime, setStartTime] = useState(Date.now());
  const [timeSpentPerQuestion, setTimeSpentPerQuestion] = useState([]);
  const [results, setResults] = useState([]);
  const [topicAnalysis, setTopicAnalysis]=useState([]);

  const subtopics = {
    Physics: ["elasticity", "capacitor", "gravitation"],
    Chemistry: ["thermodynamics", "periodic-table", "chemical-bonding"],
    Math: ["system-of-linear-equations", "mathematical-reasoning"],
    Biology: ["genetics", "ecology", "cell"],
  };

  const subjects = examType === "JEE" ? ["Physics", "Chemistry", "Math"] : ["Physics", "Chemistry", "Biology"];
  const MAX_QUESTIONS = {
    JEE: 10,
    NEET: subject === "Biology" ? 15 : 15,
  };

  const fetchQuestions = async (subject, topic) => {
    try {
      const response = await axios.get(`/exam`, {
        params: {
          examType,
          subject,
          topic,
        },
      });
      

      console.log("Exam Type:", examType);
      console.log("Subject:", subject);
      console.log("Topic:", topic);

      const limitedQuestions = (response.data?.questions || []).slice(0, MAX_QUESTIONS[examType]);
      if (limitedQuestions.length === 0) {
        alert("No questions found for this topic.");
      }
      setQuestions(limitedQuestions);
      setQuestionStatus(Array(limitedQuestions.length).fill("not-attempted"));
      if (response.data?.topicAnalysis && Array.isArray(response.data.topicAnalysis)) {
        const filteredData = response.data.topicAnalysis.map((topic) => ({
          ...topic,
          subject, // Track which subject the topic belongs to
        }));
        setTopicAnalysis(filteredData); // Reset instead of appending to avoid mixing subjects
      } else {
        console.error("Unexpected topicAnalysis format:", response.data);
      } } catch (error) {
      console.error("Error fetching questions:", error);
      alert("Failed to fetch questions. Please try again.");
    }
  };
  const fetchAllSubtopicsQuestions = async (subject) => {
    let allQuestions = [];
    let allTopicAnalysis = [];
    
    for (const topic of subtopics[subject]) {
      try {
        const response = await axios.get("/exam", {
          params: { examType, subject, topic },
        });
  
        if (response.data?.questions?.length > 0) {
          allQuestions = allQuestions.concat(response.data.questions.map(q => ({ ...q, topic })));
        }
        
        if (response.data?.topicAnalysis) {
          allTopicAnalysis = allTopicAnalysis.concat(
            response.data.topicAnalysis.map(analysis => ({
              ...analysis,
              topic, // Track subtopic details
              subject
            }))
          );
        }
      } catch (error) {
        console.error(`Error fetching questions for ${topic}:`, error);
      }
    }
  
    setQuestions(allQuestions.slice(0, MAX_QUESTIONS[examType]));
    setTopicAnalysis(allTopicAnalysis);
    setQuestionStatus(Array(allQuestions.length).fill("not-attempted"));
  };
  
  useEffect(() => {
    fetchAllSubtopicsQuestions(subject);
  }, [subject]);
  
  
  useEffect(() => {
    setSelectedTopic(subtopics[subject][0]);
    fetchQuestions(subject, subtopics[subject][0]);
  }, [subject]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };
  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[currentQuestionIndex] = {
        ...updatedQuestions[currentQuestionIndex],
        userSelectedAnswer: answer,
      };
      return updatedQuestions;
    });
  };
  
  const handleNextQuestion = () => {
    const currentTime = Date.now();
    const timeSpent = Math.floor((currentTime - startTime) / 1000);
    updateTimeSpent(timeSpent);
    setStartTime(Date.now());

    if (questionStatus[currentQuestionIndex] === "marked") {
      // Keep purple if marked for review
      updateQuestionStatus("marked");
    } else if (selectedAnswer !== null) {
      updateQuestionStatus("attempted");
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      handleTopicSwitch();
    }
  };

  const updateTimeSpent = (timeSpent) => {
    setTimeSpentPerQuestion((prevTimes) => {
      const updatedTimes = [...prevTimes];
      updatedTimes[currentQuestionIndex] = timeSpent;
      return updatedTimes;
    });
  };

  const handleTopicSwitch = () => {
    const currentTopicIndex = subtopics[subject].indexOf(selectedTopic);
    const nextTopicIndex = currentTopicIndex + 1;
    if (nextTopicIndex < subtopics[subject].length) {
      const nextTopic = subtopics[subject][nextTopicIndex];
      setSelectedTopic(nextTopic);
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      fetchQuestions(subject, nextTopic);
    } else {
      console.log("All topics covered");
    }
  };

  const updateQuestionStatus = (status) => {
    setQuestionStatus((prevStatus) => {
      const updatedStatus = [...prevStatus];
      updatedStatus[currentQuestionIndex] = status;
      return updatedStatus;
    });
  };

  const handleMarkQuestion = () => {
    updateQuestionStatus("marked");
  };

  const handleQuestionNavigation = (index) => {
    if (questions[newIndex]) {
      questions[newIndex].visited = true; // Set visited only if valid
      setCurrentQuestionIndex(newIndex);
      setStartTime(Date.now()); // Optional if tracking time per question
    } else {
      console.warn("Invalid question index:", newIndex);
    }
    setCurrentQuestionIndex(index);
    setSelectedAnswer(questions[index]?.userSelectedAnswer || null);
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[index].visited = true;
      return updatedQuestions;
    });
  };
  

  const handleSubjectChange = (event) => {
    setSubject(event.target.value);
    setSelectedTopic(subtopics[event.target.value][0]);
    setCurrentQuestionIndex(0);
  };

 
  
  const handleSubmitTest = () => {
    
    const subjectResults = {};
    const topicAnalysis = []; // Move this outside the loop
  
    console.log("Handling test submission...");
  
    subjects.forEach((subject) => {
      let score = 0;
      let correctCount = 0;
  
      console.log(`Processing subject: ${subject}`);
      const subjectQuestions = questions
        .map((q) => ({
          ...q,
          subject: q.subject || subject, // Ensure subject is attached
        }))
        .filter((q) => q.subject === subject);
  
      if (subjectQuestions.length === 0) {
        console.warn(`No questions found for subject: ${subject}`);
      }
  
      const questionResults = subjectQuestions.map((q) => {
        const userAnswer = q.userSelectedAnswer;
        const correctAnswer = q.correctAnswer;
  
        let status;
        
        if (!q) return {};
        if (userAnswer) {
          q.visited = true;
        }
  
        if (!q.visited) {
          status = "Not Visited";
        } else if (!userAnswer) {
          status = "Not Answered";
        } else if (
          userAnswer &&
          correctAnswer &&
          userAnswer[0]?.toLowerCase() === correctAnswer[1]?.toLowerCase()
        ) {
          status = "Correct";
          q.isCorrect = true;
          score += 4;
          correctCount++;
        } else {
          status = "Incorrect";
          q.isCorrect = false;
          score -= 1;
        }
        
  
        // Collect topic-specific analysis
        topicAnalysis.push({
          question: q.question,
          correctAnswer,
          userAnswer: userAnswer || "Not Answered",
          status,
          topic: q.topic || "General",
          subject,
        });
  
        return {
          question: q.question,
          correctAnswer,
          userAnswer,
          status,
        };
      });
  
      console.log(`Score for ${subject}: ${score}, Correct Count: ${correctCount}`);
  
      subjectResults[subject] = {
        examType,
        score,
        correct: correctCount,
        total: subjectQuestions.length,
        accuracy:
          subjectQuestions.length > 0
            ? ((correctCount / subjectQuestions.length) * 100).toFixed(2)
            : 0,
        questionResults,
      };
    });
  
    console.log("Final Subject Results:", subjectResults);
    navigate("/result", { state: { subjectResults, topicAnalysis } });
  };
  
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">
        {examType} Test - {subject} ({selectedTopic})
      </h1>

      {/* Subject Dropdown */}
      <div className="mt-4">
        <label htmlFor="subject-select">Select Subject:</label>
        <select
          id="subject-select"
          value={subject}
          onChange={handleSubjectChange}
        >
          {subjects.map((subj) => (
            <option key={subj} value={subj}>
              {subj}
            </option>
          ))}
        </select>
      </div>

      {/* Timer */}
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Time Left: {formatTime(timeLeft)}</h2>
      </div>

      <div className="mt-4">
        <div>
          <h2>Navigation Panel</h2>
          <div className="flex flex-wrap">
            {questionStatus.map((status, index) => (
              <button
                key={index}
                onClick={() => handleQuestionNavigation(index)}
                className={`button ${status}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {questions.length > 0 && (
          <div>
            <h2>{questions[currentQuestionIndex]?.question}</h2>
            {questions[currentQuestionIndex]?.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
               
                className={`option-button ${
                  selectedAnswer === option ? "selected" : ""
                }`}
              >
                {option}
              </button>
            ))}

            <div className="mt-4">
              <button onClick={handleMarkQuestion} className="mark-review">
                Mark for Review
              </button>
              <button onClick={handleNextQuestion} className="next-button">
                Next
              </button>
              <button onClick={handleSubmitTest} className="submit-button">
                Submit Test
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  ); 
};

export default QuestionPage;
