"use client";

import { PRE_DASHBOARD_MESSAGE } from "@/data/OnboardingQuestions";
import type { QuestionsStepProps } from "../types";
import styles from "../../OnboardingFlow.module.css";

const QuestionsStep = ({
  activeQuestions,
  questionAnswers,
  unansweredQuestions,
  fieldErrors,
  actionLoading,
  onSelectQuestion,
  onCustomValueChange,
  onFinish,
}: QuestionsStepProps) => (
  <>
    <div className={styles.messageBox}>{PRE_DASHBOARD_MESSAGE}</div>

    <div className={styles.questionList}>
      {activeQuestions.map((question, index) => {
        const answerState = questionAnswers[question.id] ?? {
          selectedOptions: [],
          customValue: "",
        };

        return (
          <div key={question.id} className={styles.questionCard}>
            <div className={styles.questionHeader}>
              <span className={styles.questionNumber}>{index + 1}</span>
              <div>
                <h3 className={styles.questionTitle}>{question.prompt}</h3>
                {(question.helperText || question.allowMultiple) && (
                  <p className={styles.questionHelper}>
                    {question.helperText ||
                      (question.allowMultiple ? "Select all that apply." : "")}
                  </p>
                )}
              </div>
            </div>

            <div className={styles.optionGrid}>
              {question.options.map((option,index) => {
                const isActive = answerState.selectedOptions.includes(option);

                return (
                  <button
                    key={index}
                    type="button"
                    className={`${styles.optionButton} ${
                      isActive ? styles.optionButtonActive : ""
                    }`}
                    onClick={() => onSelectQuestion(question, option)}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {question.customOptionLabel &&
              answerState.selectedOptions.includes(question.customOptionLabel) && (
                <div className={styles.questionCustomField}>
                  <input
                    className={styles.input}
                    value={answerState.customValue}
                    onChange={(event) =>
                      onCustomValueChange(question.id, event.target.value)
                    }
                    placeholder={
                      question.customInputPlaceholder || "Enter your answer"
                    }
                  />
                </div>
              )}

            <p className={styles.error}>{fieldErrors[question.id]}</p>
          </div>
        );
      })}
    </div>

    <p className={styles.helperText}>
      {unansweredQuestions.length === 0
        ? "All questions answered. You can finish onboarding."
        : `${unansweredQuestions.length} question${
            unansweredQuestions.length > 1 ? "s are" : " is"
          } still pending.`}
    </p>

    <div className={styles.actionRow}>
      <button
        type="button"
        className={styles.primaryButton}
        onClick={onFinish}
        disabled={actionLoading === "questions"}
      >
        {actionLoading === "questions"
          ? "Finalising..."
          : "Finish and open dashboard"}
      </button>
    </div>
  </>
);

export default QuestionsStep;
