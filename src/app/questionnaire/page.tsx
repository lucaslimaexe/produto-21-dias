
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QuestionnaireScreen, questions } from '@/components/questionnaire-screen'; // Import questions array

export default function QuestionnairePage() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // const [answers, setAnswers] = useState<string[]>([]); // If you need to store answers

  const handleAnswer = (answer: string) => {
    // Store answer if needed:
    // setAnswers(prev => [...prev, answer]);

    // The QuestionnaireScreen component now handles showing feedback.
    // The parent page just needs to advance the question or complete the quiz
    // when the "PRÓXIMA PERGUNTA" or "VER MEU DIAGNÓSTICO" button (inside QuestionnaireScreen) is clicked.
    // This is now handled by onComplete for the last question, 
    // or implicitly by the user clicking "PRÓXIMA PERGUNTA" which triggers re-render if currentQuestionIndex changes.
    // So, we only need to advance the question index *after* feedback is shown and "next" is clicked from child.
    // For simplicity, let's advance directly for now, assuming the child's onAnswer is for final confirmation of an answer.
    // And onComplete is for quiz end.

    // If not the last question, advance. The child component's "PRÓXIMA PERGUNTA" button will trigger this.
    // For now, the child calls onAnswer for each confirmed answer.
    // The child component will call onComplete when the last question's feedback button is clicked.
    if (currentQuestionIndex < questions.length - 1) {
        // This will be called by the child component after its internal "next" or "complete" logic
        // For now, let's assume handleAnswer is just to record it,
        // and advancement happens after "PRÓXIMA PERGUNTA"
    }
  };

  const advanceQuestion = () => {
     if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
     }
  }
  
  const handleCompleteQuiz = () => {
    // In a real app, you'd send answers to your Genkit flow
    // console.log('Questionnaire Answers:', answers);
    router.push('/analysis');
  };

  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
  const currentQuestionData = questions[currentQuestionIndex];
  const isLast = currentQuestionIndex === questions.length - 1;

  // The child QuestionnaireScreen now has its own "PRÓXIMA PERGUNTA" button.
  // The 'onAnswer' prop is for when the user CONFIRMS an answer to a question.
  // The 'onComplete' prop is for when the user clicks "VER MEU DIAGNÓSTICO" on the last question.
  // We need to adjust the logic here.
  // `handleAnswer` can still be used to log or store the answer.
  // The advancement to the next question or completion is now primarily driven by user interaction
  // with buttons *within* QuestionnaireScreen after feedback.
  // So, `QuestionnaireScreen` needs to call `advanceQuestion` or `handleCompleteQuiz`
  // We can pass these as props or make `onAnswer` more versatile.

  // Simpler approach: child calls `onAnswer` when option selected and confirmed.
  // Child calls `onComplete` when feedback for last question is acknowledged.
  // Child calls a new prop like `onNextQuestion` for other questions.

  // Let's make QuestionnaireScreen responsible for calling onComplete or a new onNextQuestion.
  // The `onAnswer` prop in the child is when an option is selected *and confirmed*.
  // After feedback, the child will either call `onNextQuestion` or `onComplete`.

  const handleNextQuestionInternal = () => {
    if (!isLast) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };
  
  // Pass currentQuestionData to the child component
  // The child's `onAnswer` prop in its props definition should be `(answer: string) => void;`
  // The child's `onComplete` prop in its props definition should be `() => void;`
  // Let's give the child a single `onQuestionProceed` prop that it calls after feedback.
  // The parent will then decide to go next or complete.

  const handleQuestionProceed = () => {
    if (isLast) {
      handleCompleteQuiz();
    } else {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    }
  };


  return (
    <QuestionnaireScreen
      question={currentQuestionData}
      onAnswer={handleAnswer} // This is when an answer is *selected and confirmed*
      progress={progressPercentage}
      isLastQuestion={isLast}
      onComplete={handleQuestionProceed} // This is called after feedback is shown (for next or complete)
    />
  );
}
