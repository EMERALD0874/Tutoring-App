import styled from "styled-components";

export default function About() {
  return (
    <AboutContainer>
      <h1>What is Docere?</h1>
      <p>
        Docere is a general tutoring application intended for use at The
        University of Texas at Dallas, though it can be adapted to work with the
        curriculum of any educational program or company that wants to offer
        tutoring services.
      </p>
      <h1>Is Docere free?</h1>
      <p>
        Docere is intended for use by tutors who want to offer their services to
        students across the world for free. We do not have any plans to include
        a payment system in the future.
      </p>
      <h1>How was Docere created?</h1>
      <p>
        Docere is a senior design project for The University of Texas at Dallas
        created by Adem Odza, Aidan Case, Andrew Godipelly, Ethan Hall, Hudson
        Samuels, and Will Pearl per the requirements of Dr. Nurcan Yuruk. It
        uses React and Express for the frontend and backend, respectively, and
        PostgreSQL for database management.
      </p>
    </AboutContainer>
  );
}

const AboutContainer = styled.div`
  padding: 4rem;
  width: 100%;
  min-height: 100%;

  h1 {
    margin-bottom: 0.5rem;
  }

  p {
    margin-bottom: 3rem;
  }
`;
