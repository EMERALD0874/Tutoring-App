import React from "react";
import styled from "styled-components";
import {
  FaGraduationCap,
  FaBook,
  FaCalendar,
  FaInfoCircle,
  FaQuestionCircle,
  FaChevronRight,
} from "react-icons/fa";
import "./App.css";

function App() {
  return (
    <AppContainer>
      <Navbar>
        <FaGraduationCap
          size={30}
          style={{
            marginLeft: 20,
            marginRight: 10,
          }}
        />
        <h1
          style={{
            marginRight: 20,
          }}
        >
          DOCERE
        </h1>
        <div
          style={{
            width: "100%",
            height: "60%",
            borderRadius: 10,
            backgroundColor: "#31572C",
            marginRight: "auto",
            maxWidth: 500,
            display: "flex",
            alignItems: "center",
          }}
        >
          <i
            style={{
              marginLeft: 10,
              color: "#fff5",
            }}
          >
            Search subjects...
          </i>
        </div>
        <img
          src="https://i.imgur.com/hBR6fQH.png"
          alt="profile"
          style={{
            width: 50,
            height: 50,
            borderRadius: 9999,
            marginRight: 20,
          }}
        />
      </Navbar>
      <ContentContainer>
        <Sidebar>
          <SidebarItem>
            <FaBook size={30} />
            <span
              style={{
                marginTop: 8,
              }}
            >
              Subjects
            </span>
          </SidebarItem>
          <SidebarItem>
            <FaCalendar size={30} />
            <span
              style={{
                marginTop: 8,
              }}
            >
              Calendar
            </span>
          </SidebarItem>
          <SidebarItem>
            <FaInfoCircle size={30} />
            <span
              style={{
                marginTop: 8,
              }}
            >
              About
            </span>
          </SidebarItem>
          <SidebarItem>
            <FaQuestionCircle size={30} />
            <span
              style={{
                marginTop: 8,
              }}
            >
              Help
            </span>
          </SidebarItem>
        </Sidebar>
        <Content>
          <TutorList>
            <h1
              style={{
                marginBottom: "2rem",
              }}
            >
              Computer Science — C# Tutors
            </h1>
            <TutorContainer>
              <img
                src="https://i.imgur.com/hBR6fQH.png"
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
                <h2>Hudson Samuels</h2>
                <h3
                  style={{
                    fontWeight: "normal",
                  }}
                >
                  Undergraduate CS student at UT Dallas
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
            <TutorContainer>
              <img
                src="https://i.imgur.com/hBR6fQH.png"
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
                <h2>Hudson Samuels II</h2>
                <h3
                  style={{
                    fontWeight: "normal",
                  }}
                >
                  Graduate SE student at UT Dallas
                </h3>
                <h4
                  style={{
                    fontWeight: "normal",
                  }}
                >
                  AVAILABLE ON WEDNESDAY
                </h4>
              </div>
              <FaChevronRight
                style={{
                  marginLeft: "auto",
                }}
                size={24}
              />
            </TutorContainer>
            <TutorContainer>
              <img
                src="https://i.imgur.com/hBR6fQH.png"
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
                <h2>Hudson Samuels Jr.</h2>
                <h3
                  style={{
                    fontWeight: "normal",
                  }}
                >
                  Student at Allen High School
                </h3>
                <h4
                  style={{
                    fontWeight: "normal",
                  }}
                >
                  AVAILABLE NEXT THURSDAY
                </h4>
              </div>
              <FaChevronRight
                style={{
                  marginLeft: "auto",
                }}
                size={24}
              />
            </TutorContainer>
            <TutorContainer>
              <img
                src="https://i.imgur.com/hBR6fQH.png"
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
                <h2>Hudson Samuels Sr.</h2>
                <h3
                  style={{
                    fontWeight: "normal",
                  }}
                >
                  Supermegaultragraduate ATEC student at UT Dallas
                </h3>
                <h4
                  style={{
                    fontWeight: "normal",
                  }}
                >
                  AVAILABLE STARTING 6/12
                </h4>
              </div>
              <FaChevronRight
                style={{
                  marginLeft: "auto",
                }}
                size={24}
              />
            </TutorContainer>
          </TutorList>
          <Footer>©️ Team Docere, 2023</Footer>
        </Content>
      </ContentContainer>
    </AppContainer>
  );
}

export default App;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  color: #fff;
`;

const Navbar = styled.div`
  width: 100vw;
  height: 70px;
  background-color: #4f772d;
  display: flex;
  align-items: center;
`;

const ContentContainer = styled.div`
  width: 100vw;
  height: 100%;
  display: flex;
  background-color: #aaa;
`;

const Sidebar = styled.div`
  width: 100px;
  height: 100%;
  background-color: #132a13;
  display: flex;
  flex-direction: column;
`;

const SidebarItem = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  width: 100%;
  min-height: 100%;
  background-color: #e9f5ee;
  color: #000;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 1em;
  }

  &::-webkit-scrollbar-track {
    background-color: #000;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #aaaaaa;
    border: 4px solid transparent;
    border-radius: 100vw;
    background-clip: content-box;
  }
`;

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

const Footer = styled.div`
  width: 100%;
  padding: 1rem;
  background-color: #121212;
  text-align: center;
  color: #aaa;
`;
