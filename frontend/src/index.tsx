import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Tutors from "./routes/tutors";
import Subjects from "./routes/subjects";
import Calendar from "./routes/calendar";
import About from "./routes/about";
import Help from "./routes/help";
import Tutor, { loader as tutorLoader } from "./routes/tutor";
import Login from "./routes/login";
import Profile from "./routes/profile";
import Subject, { loader as subjectLoader } from "./routes/subject";
import Register from "./routes/register";
import ChangeSubjects from "./routes/change-subjects";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Tutors />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "profile/subjects",
        element: <ChangeSubjects />,
      },
      {
        path: "tutors",
        element: <Tutors />,
      },
      {
        path: "tutors/:id",
        element: <Tutor />,
        // @ts-ignore
        loader: tutorLoader,
      },
      {
        path: "subjects",
        element: <Subjects />,
      },
      {
        path: "subjects/:id",
        element: <Subject />,
        // @ts-ignore
        loader: subjectLoader,
      },
      {
        path: "calendar",
        element: <Calendar />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "help",
        element: <Help />,
      },
    ],
  },
]);
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
