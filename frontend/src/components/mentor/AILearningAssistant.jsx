import React, { useState } from 'react';
import { sendAIChatMessage, generateAIQuiz, generateAIStudyPlan } from '../../services/aiService';

export default function AILearningAssistant({ programId, lessonId }) {
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [studyPlan, setStudyPlan] = useState(null);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await sendAIChatMessage(userMsg, programId, lessonId);
      setMessages(prev => [...prev, { sender: 'ai', text: res.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'ai', text: 'Error: Unable to fetch AI response.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizGen = async () => {
    setLoading(true);
    try {
      const res = await generateAIQuiz({ topic: 'Current Lesson', difficulty: 'medium', count: 5 });
      setQuiz(res.quiz);
    } catch (err) {
      alert('Failed to generate practice quiz.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 max-w-4xl mx-auto mt-4">
      <div className="flex border-b mb-4 pb-2 space-x-4">
        <button className={`font-semibold ${activeTab === 'chat' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`} onClick={() => setActiveTab('chat')}>AI Tutor Chat</button>
        <button className={`font-semibold ${activeTab === 'quiz' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`} onClick={() => setActiveTab('quiz')}>Practice Quiz Generator</button>
        <button className={`font-semibold ${activeTab === 'plan' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`} onClick={() => setActiveTab('plan')}>Study Plan</button>
      </div>

      {activeTab === 'chat' && (
        <div>
          <div className="h-80 overflow-y-auto border p-4 rounded mb-4 bg-gray-50 flex flex-col space-y-2">
            {messages.length === 0 && <p className="text-gray-400 text-center">Ask me anything about your lesson, e.g., "Explain this concept simply."</p>}
            {messages.map((m, idx) => (
              <div key={idx} className={`p-3 rounded max-w-lg ${m.sender === 'user' ? 'bg-blue-600 text-white self-end' : 'bg-gray-200 text-gray-800 self-start'}`}>
                {m.text}
              </div>
            ))}
            {loading && <p className="text-sm text-gray-500 italic">AI is thinking...</p>}
          </div>
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input 
              type="text" 
              className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Type your question..." 
              value={input} 
              onChange={e => setInput(e.target.value)} 
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Send</button>
          </form>
        </div>
      )}

      {activeTab === 'quiz' && (
        <div>
          <button onClick={handleQuizGen} className="bg-green-600 text-white px-4 py-2 rounded mb-4 hover:bg-green-700">Generate Practice Quiz</button>
          {loading && <p>Generating practice questions...</p>}
          {quiz && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg">{quiz.title}</h3>
              <p className="text-xs text-orange-600">Note: AI-generated practice only. Not an official exam.</p>
              {quiz.questions?.map((q, i) => (
                <div key={i} className="border p-3 rounded">
                  <p className="font-medium">{i + 1}. {q.question}</p>
                  <ul className="list-disc pl-5 mt-2">
                    {q.options?.map((opt, oi) => <li key={oi}>{opt}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'plan' && (
        <div>
          <button onClick={async () => {
            setLoading(true);
            try {
              const res = await generateAIStudyPlan("Master full-stack modules");
              setStudyPlan(res.studyPlan);
            } finally { setLoading(false); }
          }} className="bg-purple-600 text-white px-4 py-2 rounded mb-4">Generate Study Plan</button>
          {studyPlan && <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">{JSON.stringify(studyPlan, null, 2)}</pre>}
        </div>
      )}
    </div>
  );
}