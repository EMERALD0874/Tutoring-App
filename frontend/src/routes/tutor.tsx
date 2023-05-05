import styled from "styled-components";
import { useLoaderData } from "react-router-dom";
import { getTutor } from "../api";

export async function loader({ params }: { params: { id: string } }) {
  return await getTutor(params.id);
}

export default function Tutor() {
  const tutor: any = useLoaderData();

  return (
    <TutorContainer>
      {tutor && (
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
              Available at 9 PM
            </h3>
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
