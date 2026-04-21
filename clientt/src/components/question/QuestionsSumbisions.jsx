import { useEffect, useState } from "react";
import { api } from "../../api/api";
import GradeEditor from "../Users/GradeEditor"; // Համոզվիր, որ ուղին ճիշտ է
// import "./styles/UserLaboratorAnswers.css";

function QuestionsSuBmisions({ userId }) {
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const res = await api.get(`/questions/userq/${userId}`);
        setAnswers(res.data.data || []);
        console.log(res.data.data);
        
      } catch (err) {
        console.error("Error fetching answers:", err);
        setError("Չհաջողվեց բեռնել");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchAnswers();
  }, [userId]);

  if (loading) return <p>Բեռնվում են պատասխանները...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="lab-answers-section">
      {answers.length === 0 ? (
        <p>Չկան պատասխաններ։</p>
      ) : (
        <ul className="lab-answer-list">
          {answers.map((answer) => (
            <li key={answer._id} className="lab-answer-item" style={{ borderBottom: '1px solid #ddd', padding: '15px 0' }}>
              <div className="answer-info">
                {/* <p><strong>Ամսաթիվ:</strong> {new Date(answer.submittedAt).toLocaleString()}</p> */}
                <p><strong>Հարց:</strong> {answer.question || "Տեքստը բացակայում է"}</p>
                
                <a
                  href={`http://localhost:5000/uploads/questions/${answer.filename}`}
                  download
                  className="download-link"
                >
                  📥 Ներբեռնել ֆայլը
                </a>
              </div>

              {/* Գնահատման բաժինը */}
              <GradeEditor 
                answerId={answer._id} 
                initialGrade={answer.grade} 
                type="question" 
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default QuestionsSuBmisions;