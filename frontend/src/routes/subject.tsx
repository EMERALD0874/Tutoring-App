import { useState, useEffect } from "react";
import { FaChevronRight } from "react-icons/fa";
import { Link, useLoaderData } from "react-router-dom";
import styled from "styled-components";
import { getSubject, getTutors, isLoggedIn } from "../api";

export async function loader({ params }: { params: { id: string } }) {
  return await getSubject(params.id);
}

export default function Subject() {
  const subject: any = useLoaderData();

  const [tutors, setTutors] = useState<any[] | undefined>(undefined);
  useEffect(() => {
    getTutors().then((res) => setTutors(res));
  }, []);

  console.log(tutors);
  console.log(subject);

  return (
    <TutorList>
      <h1
        style={{
          marginBottom: "2rem",
        }}
      >
        {subject.name} Tutors
      </h1>
      {typeof tutors !== "undefined" ? (
        tutors.filter((tutor: any) => tutor.subjects.includes(subject.id))
          .length ?? 0 > 0 ? (
          tutors
            .sort(
              (a: any, b: any) =>
                a.first_name.localeCompare(b.first_name) ||
                a.last_name.localeCompare(b.last_name)
            )
            .filter((tutor: any) => tutor.subjects.includes(subject.id))
            .map((tutor: any) => (
              <TutorElement
                id={tutor.id}
                key={tutor.id}
                name={`${tutor.first_name} ${tutor.last_name}`}
                about={tutor.about}
              />
            ))
        ) : (
          <p>
            No tutors teaching {subject.name} found. Please contact a site
            administrator if you believe this is an error.
          </p>
        )
      ) : (
        <div />
      )}
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
