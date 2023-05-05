import styled from "styled-components";
import { useLoaderData, useNavigate } from "react-router-dom";
import { createSession, getAvailableTutorTimes, getTutor } from "../api";
import { useEffect, useState } from "react";

export async function loader({ params }: { params: { id: string } }) {
  return await getTutor(params.id);
}

export default function Tutor() {
  const tutor: any = useLoaderData();

  const [error, setError] = useState("");
  const [availableTimes, setAvailableTimes] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAvailableTutorTimes(tutor.id).then((res) => {
      if (!res) return;
      setAvailableTimes(res);
    });
  }, [tutor.id]);

  return (
    <TutorContainer>
      {tutor && (
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
              src={`${process.env.REACT_APP_API_URL}/api/profile-pictures/${tutor.id}`}
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
                {tutor.first_name} {tutor.last_name}
              </h1>
              <h3
                style={{
                  textTransform: "uppercase",
                }}
              >
                SCHEDULING A SESSION
              </h3>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <label
              htmlFor="time"
              style={{
                marginTop: "2rem",
              }}
            >
              <p>What time would you like to meet?</p>
            </label>
            <select
              name="time"
              id="time"
              style={{
                width: "300px",
                marginTop: ".5rem",
              }}
            >
              {availableTimes.map((time) => {
                return (
                  <option value={time.timeid}>
                    {new Date(time.datetime).toLocaleString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })}
                  </option>
                );
              })}
            </select>
            <label
              htmlFor="consent"
              style={{
                marginTop: "2rem",
              }}
            >
              <p>
                I consent to giving {tutor.first_name} {tutor.last_name} my
                email address so they may contact me.
              </p>
            </label>
            <input
              type="checkbox"
              name="consent"
              id="consent"
              style={{
                marginTop: ".5rem",
              }}
            />
            <button
              type="button"
              style={{
                width: "300px",
                marginTop: "2rem",
              }}
              onClick={async (e) => {
                e.preventDefault();
                if (
                  (document.getElementById("consent") as HTMLInputElement)
                    .checked
                ) {
                  setError("");
                  await createSession(
                    tutor.id,
                    (document.getElementById("time") as HTMLSelectElement).value
                  )
                    .then((rsp) => {
                      navigate("/calendar");
                    })
                    .catch((err) => {
                      setError(err.message);
                    });
                } else {
                  setError("You must consent to giving your email address.");
                }
              }}
            >
              Schedule Session
            </button>
          </div>
          {error !== "" && (
            <p
              style={{
                textAlign: "center",
                marginTop: "2rem",
                color: "red",
              }}
            >
              {error}
            </p>
          )}
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
