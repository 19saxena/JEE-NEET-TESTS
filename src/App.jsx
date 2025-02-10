import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home.jsx';
import TestPage from './pages/testpage.jsx';
import ExamTypeSelection from './pages/examtypeSelection.jsx';
import QuestionPage from "./pages/questionpage.jsx";
import ResultPage from "./pages/resultPage.jsx"
import AnalysisPage from './pages/analysisPage.jsx';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/examType" element={<ExamTypeSelection />} />
        <Route path="/exam" element={<QuestionPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/analysis" element={<AnalysisPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
