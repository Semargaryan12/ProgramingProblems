import { useEffect, useState, useRef } from "react";
import { api } from "../../api/api";
import "./styles/UserQuizes.css";

function UserQuizesAnswers({ userId }) {
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!userId || hasFetched.current) return;
    hasFetched.current = true;

    const fetchAnswers = async () => {
      try {
        const res = await api.get(`/quiz/quizuser/${userId}`);
        setAnswers(res.data.data || []);
      } catch (err) {
        console.error("Error fetching quiz answers:", err);
        setError("Չհաջողվեց բեռնել");
      } finally {
        setLoading(false);
      }
    };

    fetchAnswers();
  }, [userId]);

  if (loading) return <p className="code-loading">Բեռնվում է պատասխանները...</p>;
  if (error) return <p className="code-error-message">{error}</p>;

  return (
    <div className="code-lab-answers-section">
      {answers.length === 0 ? (
        <p className="code-no-quizzes">Թեստեր չկան</p>
      ) : (
        <ul>
          {answers.map((answer) => (
            <li key={answer._id} className="code-lab-answer-item">
              <p><strong>Մուտքագրման ամսաթիվ:</strong> {new Date(answer.submittedAt).toLocaleString()}</p>
              <p><strong>Թեստ:</strong> {answer.quizTitle}</p>
              <p><strong>Ճիշտ պատասխան:</strong> {answer.score}/{answer.from}</p>

              {/* ✅ Մանրամասների բացում/փակում */}
              <button
                className="code-toggle-btn"
                onClick={() => setExpandedId(expandedId === answer._id ? null : answer._id)}
              >
                {expandedId === answer._id ? "Փակել" : "Տեսնել մանրամասները"}
              </button>

              {expandedId === answer._id && answer.questions && (
                <ul className="code-questions-list">
                  {answer.questions.map((q, idx) => {
                    const isCorrect = q.selectedAnswerIndex === q.correctAnswerIndex;
                    return (
                      <li key={idx} className={`code-question-result ${isCorrect ? "correct" : "wrong"}`}>
                        <p className="code-question-text">
                          <strong>{idx + 1}. {q.text}</strong>
                        </p>
                        <ul className="code-options-list">
                          {q.options.map((opt, oIdx) => {
                            const isSelected = oIdx === q.selectedAnswerIndex;
                            const isRight = oIdx === q.correctAnswerIndex;
                            return (
                              <li
                                key={oIdx}
                                className={`code-option 
                                  ${isRight ? "option-correct" : ""}
                                  ${isSelected && !isRight ? "option-wrong" : ""}
                                `}
                              >
                                {String.fromCharCode(65 + oIdx)}. {opt}
                                {isRight && " ✓"}
                                {isSelected && !isRight && " ✗"}
                              </li>
                            );
                          })}
                        </ul>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserQuizesAnswers;