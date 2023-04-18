import { useState, useEffect } from "react";
import { FaChevronRight } from "react-icons/fa";
import styled from "styled-components";
import { getTutors } from "../api";

export default function Tutors() {
  const [tutors, setTutors] = useState([]);
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
    <TutorContainer>
      <img
        src="https://media.tenor.com/1y8zDc-ll-EAAAAd/3d-saul-saul-goodman.gif"
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
        <h3
          style={{
            fontWeight: "normal",
          }}
        >
          {about}
        </h3>
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

const TutorContainer = styled.div`
  width: 100%;
  padding: 1rem;
  background-color: #fff;
  border-radius: 10px;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: row;
  align-items: center;
`;
