
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QuestionnaireScreen, questions, type Question } from '@/components/questionnaire-screen';

interface Answer {
  questionId: number;
  questionText: string;
  answer: string;
}

export default function QuestionnairePage() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Answer[]>([]);

  const handleAnswer = (question: Question, answer: string) => {
    setUserAnswers(prev => [...prev, { questionId: question.id, questionText: question.question, answer }]);
  };
  
  const handleQuestionProceed = () => {
    const isLast = currentQuestionIndex === questions.length - 1;
    if (isLast) {
      // All questions answered, pass answers to analysis page
      const answersQueryParam = encodeURIComponent(JSON.stringify(userAnswers));
      router.push(`/analysis?answers=${answersQueryParam}`);
    } else {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    }
  };

  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
  const currentQuestionData = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <QuestionnaireScreen
      question={currentQuestionData}
      onAnswer={(answer) => handleAnswer(currentQuestionData, answer)}
      progress={progressPercentage}
      isLastQuestion={isLastQuestion}
      onComplete={handleQuestionProceed} 
    />
  );
}
