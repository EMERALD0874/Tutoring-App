import { useState, useEffect } from "react";
import { FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { getTutors, isLoggedIn } from "../api";

export default function Tutors() {
  const [tutors, setTutors] = useState([] as any[]);
  useEffect(() => {
    getTutors().then((res) => setTutors(res));
  }, []);

  return (
    <TutorList>
      <h1
        style={{
          marginBottom: "2rem",
        }}
      >
        All Tutors
      </h1>
      {tutors
        .sort(
          (a: any, b: any) =>
            a.first_name.localeCompare(b.first_name) ||
            a.last_name.localeCompare(b.last_name)
        )
        .map((tutor: any) => (
          <TutorElement
            id={tutor.id}
            key={tutor.id}
            name={`${tutor.first_name} ${tutor.last_name}`}
            about={tutor.about}
          />
        ))}
    </TutorList>
  );
}

interface TutorProps {
  id: string;
  name: string;
  about?: string;
}

function TutorElement({ id, name, about }: TutorProps) {
  return (
    <TutorContainer to={isLoggedIn() ? `/tutors/${id}` : "/login"}>
      <img
        src={`${process.env.REACT_APP_API_URL}/api/profile-pictures/${id}`}
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
        <h2>{name}</h2>
        <h4
          style={{
            fontWeight: "normal",
          }}
        >
          AVAILABLE AT 9 PM
        </h4>
      </div>
      <FaChevronRight
        style={{
          marginLeft: "auto",
        }}
        size={24}
      />
    </TutorContainer>
  );
}

const TutorList = styled.div`
  padding: 4rem;
  width: 100%;
  min-height: 100%;
`;

const TutorContainer = styled(Link)`
  width: 100%;
  padding: 1rem;
  background-color: #fff;
  border-radius: 10px;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: row;
  align-items: center;

  text-decoration: none;
  color: #000;
`;
