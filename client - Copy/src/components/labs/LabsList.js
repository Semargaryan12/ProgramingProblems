import React from "react";
import AdminLabsList from "./AdminLabsList";
import UserLabsList from "./UserLabsLIst";

const LabsList = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user?.role?.toLowerCase() === "admin") {
    return <AdminLabsList />;
  } else {
    return <UserLabsList />;
  }
};

export default LabsList;
