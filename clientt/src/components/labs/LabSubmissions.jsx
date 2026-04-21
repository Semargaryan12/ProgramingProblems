import { useEffect, useState } from "react";
import { api } from "../../api/api";
import GradeEditor from "../Users/GradeEditor";
import "./styles/UserLaboratorAnswers";

function UserLaboratorAnswers({ userId }) {
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const res = await api.get(`/labs/user/${userId}`);
        setAnswers(res.data.data || []);
      } catch (err) {
        console.error("Error fetching laborator answers:", err);
        setError("Չհաջողվեց բեռնել  պատասխանները։");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchAnswers();
    }
  }, [userId]);

  if (loading) return <p>Բեռնվում են  պատասխանները...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="lab-answers-section">
      <h3> Պատասխաններ</h3>
      {answers.length === 0 ? (
        <p>Չկան  պատասխաններ։</p>
      ) : (
        <ul className="lab-answer-list">
          {answers.map((answer) => (
            <li key={answer._id} className="lab-answer-item">
              <div className="answer-details">
                <p>
                  <strong>Մուտքագրման ամսաթիվ:</strong>{" "}
                  {new Date(answer.submittedAt).toLocaleString()}
                </p>
                <p>
                  <strong>Վերնագիր:</strong> {answer.laboratorTitle}
                </p>
              </div>

              {/* Սա այն տողն է, որտեղ կոճակներն ու դաշտը կողք-կողքի են */}
              <div className="action-row">
                <a
                  href={`http://localhost:5000/uploads/labs/${answer.filename}`}
                  download
                  className="download-btn"
                >
                  📥 Ներբեռնել
                </a>

                <GradeEditor 
                  answerId={answer._id} 
                  initialGrade={answer.grade} 
                  type="lab" 
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserLaboratorAnswers;