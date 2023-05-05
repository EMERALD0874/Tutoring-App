import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  addTutorTime,
  getTutor,
  getTutorTimes,
  getUser,
  isLoggedIn,
  deleteTutorTime,
} from "../api";
import { useEffect, useState } from "react";

export default function Schedule() {
  const navigate = useNavigate();
  const [user, setUser] = useState<null | any>(null);
  const [dates, setDates] = useState<any[]>([]);
  const [isTutor, setIsTutor] = useState<null | Boolean>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let userId = localStorage.getItem("userId");
    if (isLoggedIn() && userId != null) {
      getUser(userId).then((res) => setUser(res));
      getTutor(userId).then((rsp) => {
        setIsTutor(rsp.error ? false : true);
        if (rsp.error) {
          navigate("/profile");
        }
      });
      getTutorTimes().then((res) => {
        setDates(res);
      });
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <TutorContainer>
      {user != null && (
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
              justifyContent: "center",
              gap: "2rem",
              marginTop: "2rem",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "300px",
              }}
            >
              <h3>Add Tutoring Times</h3>
              <div
                style={{
                  display: "flex",
                  marginTop: "1rem",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  name="date"
                  id="date"
                  defaultValue={new Date().toISOString().slice(0, 10)}
                  style={{
                    width: "150px",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  marginTop: ".5rem",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <label htmlFor="time">Time</label>
                <select
                  name="time"
                  id="time"
                  style={{
                    width: "150px",
                  }}
                >
                  <option value="09:00">9:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="13:00">1:00 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                  <option value="17:00">5:00 PM</option>
                  <option value="18:00">6:00 PM</option>
                  <option value="19:00">7:00 PM</option>
                  <option value="20:00">8:00 PM</option>
                  <option value="21:00">9:00 PM</option>
                  <option value="22:00">10:00 PM</option>
                  <option value="23:00">11:00 PM</option>
                </select>
              </div>
              <div
                style={{
                  display: "flex",
                  marginTop: ".5rem",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <label htmlFor="hours">Hours in a Row</label>
                <select
                  name="hours"
                  id="hours"
                  style={{
                    width: "150px",
                  }}
                >
                  <option value="1">1 hour (no repeats)</option>
                  <option value="2">2 hours</option>
                  <option value="3">3 hours</option>
                  <option value="4">4 hours</option>
                  <option value="5">5 hours</option>
                  <option value="6">6 hours</option>
                  <option value="7">7 hours</option>
                  <option value="8">8 hours</option>
                </select>
              </div>
              <button
                type="submit"
                style={{
                  width: "300px",
                  display: "block",
                  margin: "auto",
                  marginTop: "2rem",
                }}
                onClick={async (e) => {
                  e.preventDefault();

                  const date = new Date(
                    `${
                      (document.getElementById("date") as HTMLInputElement)
                        .value
                    } ${
                      (document.getElementById("time") as HTMLInputElement)
                        .value
                    }`
                  );
                  let hours = parseInt(
                    (document.getElementById("hours") as HTMLInputElement).value
                  );

                  if (date.getTime() < new Date().getTime()) {
                    // If date is in the past
                    setError(
                      "You cannot tutor in the past. That would violate a few laws of physics."
                    );
                    return;
                  } else if (hours > 1) {
                    // If hours is greater than 1, check the last hour would be before or equal to 11pm
                    if (
                      date.getHours() + hours - 1 >
                      new Date(
                        date.getFullYear(),
                        date.getMonth(),
                        date.getDate(),
                        23
                      ).getHours()
                    ) {
                      setError("You must be done tutoring before midnight.");
                      return;
                    }
                  } else {
                    // Make sure date is not more than two weeks in the future
                    if (
                      date.getTime() >
                      new Date(
                        new Date().getFullYear(),
                        new Date().getMonth(),
                        new Date().getDate() + 14
                      ).getTime()
                    ) {
                      setError(
                        "You cannot tutor more than two weeks in the future."
                      );
                      return;
                    }
                  }

                  setError("");

                  const times = [];
                  for (let i = 0; i < hours; i++) {
                    times.push(
                      new Date(
                        date.getFullYear(),
                        date.getMonth(),
                        date.getDate(),
                        date.getHours() + i
                      )
                    );
                  }
                  for (let i = 0; i < times.length; i++) {
                    await addTutorTime(times[i]);
                  }

                  navigate(0);
                }}
              >
                Add Time(s)
              </button>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "300px",
              }}
            >
              <h3
                style={{
                  margin: "0 auto",
                  marginBottom: ".5rem",
                }}
              >
                Existing Tutoring Times
              </h3>
              {dates.length !== 0 &&
                dates.map((date) => (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                      marginTop: ".5rem",
                    }}
                  >
                    <p
                      style={{
                        margin: "0",
                      }}
                    >
                      {new Date(date.datetime).toLocaleDateString()}{" "}
                      {new Date(date.datetime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <button
                      style={{
                        background: "#b22",
                      }}
                      onClick={async (e) => {
                        e.preventDefault();
                        await deleteTutorTime(date.timeid);
                        navigate(0);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
            </div>
          </div>
          <div>
            <p
              style={{
                textAlign: "center",
                margin: "1rem auto",
                color: "#777",
                fontStyle: "italic",
                fontSize: "0.8rem",
                maxWidth: "650px",
              }}
            >
              Each tutoring session is one hour long to ensure student success,
              you can add as many tutoring times as you want up to two weeks in
              advance, note that added times are final if a student books a
              session
            </p>
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
