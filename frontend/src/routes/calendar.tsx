import styled from "styled-components";

export default function Calendar() {
  return (
    <CalContainer>
      <h1>Placeholder</h1>
      <p>
        If the user is not signed in, they should be redirected to the sign-in
        page. If they are, show their upcoming tutoring sessions.
      </p>
    </CalContainer>
  );
}

const CalContainer = styled.div`
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
