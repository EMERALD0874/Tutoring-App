import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { becomeTutor, getTutor, getUser, isLoggedIn, logout } from "../api";
import { useEffect, useRef, useState } from "react";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<null | any>(null);
  const [isTutor, setIsTutor] = useState<null | Boolean>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let userId = localStorage.getItem("userId");
    if (isLoggedIn() && userId != null) {
      getUser(userId).then((res) => setUser(res));
      getTutor(userId).then((rsp) => setIsTutor(rsp.error ? false : true));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // Pfp upload
  const hiddenFileInput = useRef<any | null>(null);
  const handleClick = (event: any) => {
    if (hiddenFileInput.current) hiddenFileInput.current.click();
  };
  const handleChange = (event: any) => {
    const fileUploaded = event.target.files[0];
    const formData = new FormData();
    formData.append("file", fileUploaded);
    fetch(`${process.env.REACT_APP_API_URL}/api/profile-pictures/${user.id}`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      if (res.status === 201) {
        window.location.reload();
      } else {
        setError(
          "Error uploading profile picture. Make sure it is a PNG or JPG that is less than 1 MB."
        );
        console.log("Error uploading profile picture");
      }
    });
  };

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
          <div>
            <button
              type="button"
              style={{
                width: "300px",
                display: "block",
                margin: "auto",
                marginTop: "2rem",
              }}
              onClick={(e) => {
                e.preventDefault();
                handleClick(e);
              }}
            >
              Change Profile Picture
            </button>
            <input
              type="file"
              ref={hiddenFileInput}
              onChange={handleChange}
              style={{ display: "none" }}
            />
            {isTutor === false && (
              <button
                type="button"
                style={{
                  width: "300px",
                  display: "block",
                  margin: "auto",
                  marginTop: ".5rem",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  becomeTutor()
                    .then((res) => {
                      setIsTutor(true);
                    })
                    .catch((err) => {
                      setError(
                        "Error becoming a tutor. Please try again later."
                      );
                    });
                }}
              >
                Become a Tutor
              </button>
            )}
            {isTutor === true && (
              <div>
                <button
                  type="button"
                  style={{
                    width: "300px",
                    display: "block",
                    margin: "auto",
                    marginTop: ".5rem",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/profile/subjects");
                  }}
                >
                  Change Subjects
                </button>
                <button
                  type="button"
                  style={{
                    width: "300px",
                    display: "block",
                    margin: "auto",
                    marginTop: ".5rem",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/profile/schedule");
                  }}
                >
                  Modify Tutoring Schedule
                </button>
              </div>
            )}
            <button
              type="button"
              style={{
                width: "300px",
                display: "block",
                margin: "auto",
                marginTop: ".5rem",
                backgroundColor: "#b22",
              }}
              onClick={(e) => {
                e.preventDefault();
                logout();
                navigate("/");
              }}
            >
              Log Out
            </button>
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
