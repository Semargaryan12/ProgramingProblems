import React from "react";
import AdminQuestionsList from "./AdminQuestionsList";
import UserQuestionsList from "./UserQuestionsList";

const QuestionsList = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user?.role?.toLowerCase() === "admin") {
    return <AdminQuestionsList />;
  } else {
    return <UserQuestionsList />;
  }
};

export default QuestionsList;
