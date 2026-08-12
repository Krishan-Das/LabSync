import { Routes, Route } from "react-router-dom";

import AppLayout from "../layouts/AppLayout";

import HomePage from "../pages/HomePage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      {/* <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} /> */}

      {/* App Routes */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />

        {/* <Route
          path="/subject/:subjectId"
          element={<SubjectQuestions />}
        /> */}

        {/* <Route
          path="/question/:id"
          element={<QuestionDetails />}
        /> */}
      </Route>
    </Routes>
  );
};

export default AppRoutes;