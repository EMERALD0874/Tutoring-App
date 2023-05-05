import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  getSubjects,
  getTutor,
  getUser,
  isLoggedIn,
  setTutorSubjects,
} from "../api";
import { useEffect, useState } from "react";

export default function ChangeSubjects() {
  const navigate = useNavigate();
  const [user, setUser] = useState<null | any>(null);
  const [subjects, setSubjects] = useState<null | any[]>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<null | string[]>(
    null
  );
  const [isTutor, setIsTutor] = useState<null | Boolean>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let userId = localStorage.getItem("userId");
    if (isLoggedIn() && userId != null) {
      getUser(userId).then((res) => setUser(res));
      getSubjects().then((res) => setSubjects(res));
      getTutor(userId).then((rsp) => {
        setIsTutor(rsp.error ? false : true);
        if (rsp.error) {
          navigate("/profile");
        } else {
          setSelectedSubjects(rsp.subjects);
        }
      });
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <TutorContainer>
      {user != null && subjects != null && selectedSubjects != null && (
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "auto",
            }}
          >
            <img
              src={`${process.env.REACT_APP_API_URL}/api/profile-pictures/${user.id}`}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://i.imgur.com/AIkx1b2.png";
              }}
              alt="profile"
              style={{
                width: 100,
                height: 100,
                borderRadius: 9999,
              }}
            />
            <div
              style={{
                marginLeft: "2rem",
              }}
            >
              <h1>
                {user.first_name} {user.last_name}
              </h1>
              <h2>{user.email}</h2>
              {isTutor !== null && (
                <h3
                  style={{
                    textTransform: "uppercase",
                  }}
                >
                  {isTutor ? "Tutor" : "Student"}
                </h3>
              )}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <label
              htmlFor="subjects"
              style={{
                display: "block",
                margin: "auto",
                marginTop: "2rem",
              }}
            >
              <h3>Subjects You Can Tutor</h3>
            </label>
            <select
              name="subjects"
              id="subjects"
              multiple
              style={{
                width: "300px",
                display: "block",
                marginTop: "1rem",
                padding: "0.5rem",
              }}
              size={subjects.length}
              value={selectedSubjects}
              onChange={(e) => {
                let options = e.target.options;
                let value = [];
                for (let i = 0; i < options.length; i++) {
                  if (options[i].selected) {
                    value.push(options[i].value);
                  }
                }
                setSelectedSubjects(value);
              }}
            >
              {subjects
                .sort((a, b) => {
                  if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
                  else return -1;
                })
                .map((subject) => {
                  return <option value={subject.id}>{subject.name}</option>;
                })}
            </select>
            <p
              style={{
                textAlign: "center",
                marginTop: "1rem",
                color: "#777",
                fontStyle: "italic",
                fontSize: "0.8rem",
              }}
            >
              Use Ctrl + Click or Command + Click to select multiple subjects
            </p>
          </div>
          <div>
            <button
              type="submit"
              style={{
                width: "300px",
                display: "block",
                margin: "auto",
                marginTop: "2rem",
              }}
              onClick={(e) => {
                e.preventDefault();
                if (selectedSubjects !== null) {
                  setTutorSubjects(selectedSubjects)
                    .then((res) => {
                      navigate("/profile");
                    })
                    .catch((err) => {
                      setError(err);
                    });
                }
              }}
            >
              Submit Changes
            </button>
            {error !== "" && (
              <p
                style={{
                  textAlign: "center",
                  marginTop: "2rem",
                  color: "red",
                }}
              >
                {error.toString()}
              </p>
            )}
          </div>
        </div>
      )}
    </TutorContainer>
  );
}

const TutorContainer = styled.div`
  padding: 4rem;
  width: 100%;
  min-height: 100%;

  h2 {
    font-weight: 400;
  }

  h3 {
    font-weight: 400;
  }
`;
