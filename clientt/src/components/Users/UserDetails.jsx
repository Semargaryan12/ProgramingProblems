import QuestionsSuBmisions from "../question/QuestionsSumbisions";
import UserQuizesAnswers from "../quiz/UserQuizesAnswers";
import UserLaboratorAnswers from "../labs/LabSubmissions";
import CollapsibleSection from "./CollapsibleSection";
import { useState } from "react";
const UserDetails = ({ user, onBack }) => {
  const [sections, setSections] = useState({ q: false, quiz: false, lab: false });

  const toggle = (key) => setSections(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="user-details-container">
      <button className="back-button" onClick={onBack}>← Հետ</button>
      <h2>Ուսանողի Տվյալներն ու արդյունքները</h2>
      <div className="user-info">
        <p><strong>Անուն Ազգանուն:</strong> {user.name} {user.surname}</p>
        <p><strong>Մուտքանուն:</strong> {user.username}</p>
        <p><strong>Էլ. հասցե:</strong> {user.email}</p>
        {/* <p><strong>Ֆակուլտետ:</strong> {user.faculty}</p>
        <p><strong>Կուրս:</strong> {user.course}</p> */}
      </div>

      <CollapsibleSection title="Առաջադրանքներ" isOpen={sections.q} onToggle={() => toggle('q')}>
        <QuestionsSuBmisions userId={user._id} />
      </CollapsibleSection>

      <CollapsibleSection title="Հանձնված թեստեր" isOpen={sections.quiz} onToggle={() => toggle('quiz')}>
        <UserQuizesAnswers userId={user._id} />
      </CollapsibleSection>

      {/* <CollapsibleSection title=" Գործնականներ" isOpen={sections.lab} onToggle={() => toggle('lab')}>
        <UserLaboratorAnswers userId={user._id} />
      </CollapsibleSection> */}
    </div>
  );
};

export default UserDetails