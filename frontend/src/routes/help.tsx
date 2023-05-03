import styled from "styled-components";

export default function Help() {
  return (
    <HelpContainer>
      <h1>Contact Us</h1>
      <p>
        Please react out to the Erik Jonsson School of Engineering and Computer
        Science at The University of Texas at Dallas if you have any questions
        or concerns. Docere is not actively maintained by a development team.
      </p>
    </HelpContainer>
  );
}

const HelpContainer = styled.div`
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
