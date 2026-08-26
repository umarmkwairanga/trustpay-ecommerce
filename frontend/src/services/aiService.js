import API from './api'; // Reuse your configured Axios instance with auth headers

export const sendAIChatMessage = async (message, programId, lessonId) => {
  const { data } = await API.post('/mentor/ai/chat', { message, programId, lessonId });
  return data;
};

export const generateAIQuiz = async (options) => {
  const { data } = await API.post('/mentor/ai/quiz', options);
  return data;
};

export const generateAIStudyPlan = async (goal) => {
  const { data } = await API.post('/mentor/ai/study-plan', { goal });
  return data;
};