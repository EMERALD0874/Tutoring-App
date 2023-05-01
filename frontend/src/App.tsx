import styled from "styled-components";
import {
  FaGraduationCap,
  FaBook,
  FaCalendar,
  FaInfoCircle,
  FaQuestionCircle,
} from "react-icons/fa";
import "./App.css";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <AppContainer>
      <Navbar>
        <a
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            color: "#fff",
            textDecoration: "none",
          }}
        >
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
        </a>
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
          src="https://media.tenor.com/1y8zDc-ll-EAAAAd/3d-saul-saul-goodman.gif"
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
          <SidebarItem href="/subjects">
            <FaBook size={30} />
            <span
              style={{
                marginTop: 8,
              }}
            >
              Subjects
            </span>
          </SidebarItem>
          <SidebarItem href="/calendar">
            <FaCalendar size={30} />
            <span
              style={{
                marginTop: 8,
              }}
            >
              Calendar
            </span>
          </SidebarItem>
          <SidebarItem href="/about">
            <FaInfoCircle size={30} />
            <span
              style={{
                marginTop: 8,
              }}
            >
              About
            </span>
          </SidebarItem>
          <SidebarItem href="/help">
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
          <Outlet />
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
  height: calc(100vh - 70px);
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

const SidebarItem = styled.a`
  width: 100%;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  color: #fff;
  text-decoration: none;
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

const Footer = styled.div`
  width: 100%;
  padding: 1rem;
  background-color: #121212;
  text-align: center;
  color: #aaa;
  box-shadow: 0 50vh 0 50vh #121212;
`;
