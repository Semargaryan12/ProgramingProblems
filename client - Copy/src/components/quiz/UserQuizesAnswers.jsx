import { useEffect, useState, useRef } from "react";
import { api } from "../../api/api";
import "./styles/UserQuizes.css";

function UserQuizesAnswers({ userId }) {
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


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
              <p>
                <strong>Մուտքագրման ամսաթիվ:</strong>{" "}
                {new Date(answer.submittedAt).toLocaleString()}
              </p>
              <p>
                <strong>Թեստ:</strong> {answer.quizTitle}
              </p>
              <p>
                <strong>Ճիշտ պատասխան:</strong> {answer.score}/{answer.from}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserQuizesAnswers;
