import styled from "styled-components";
import {
  FaGraduationCap,
  FaBook,
  FaCalendar,
  FaInfoCircle,
  FaQuestionCircle,
  FaSignInAlt,
} from "react-icons/fa";
import "./App.css";
import { Link, Outlet, useLocation } from "react-router-dom";
import { isLoggedIn } from "./api";
import { useEffect, useState } from "react";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const location = useLocation();
  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, [location.key]);

  return (
    <AppContainer>
      <Navbar>
        <Link
          to="/"
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
        </Link>
        {/* <div
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
        </div> */}
        <Link
          to={loggedIn ? "/profile" : "/login"}
          style={{
            width: 50,
            height: 50,
            borderRadius: 9999,
            marginLeft: "auto",
            marginRight: 20,
            backgroundColor: "#31572c",
            display: "flex",
            overflow: "hidden",
            color: "#fff",
          }}
        >
          {loggedIn ? (
            <img
              src={`${
                process.env.REACT_APP_API_URL
              }/api/profile-pictures/${localStorage.getItem("userId")}`}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://i.imgur.com/AIkx1b2.png";
              }}
              alt="profile"
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          ) : (
            <FaSignInAlt
              style={{
                margin: "auto",
              }}
              size={24}
            />
          )}
        </Link>
      </Navbar>
      <ContentContainer>
        <Sidebar>
          <SidebarItem to={loggedIn ? "/subjects" : "/login"}>
            <FaBook size={30} />
            <span
              style={{
                marginTop: 8,
              }}
            >
              Subjects
            </span>
          </SidebarItem>
          <SidebarItem to={loggedIn ? "/calendar" : "/login"}>
            <FaCalendar size={30} />
            <span
              style={{
                marginTop: 8,
              }}
            >
              Calendar
            </span>
          </SidebarItem>
          <SidebarItem to="/about">
            <FaInfoCircle size={30} />
            <span
              style={{
                marginTop: 8,
              }}
            >
              About
            </span>
          </SidebarItem>
          <SidebarItem to="/help">
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

const SidebarItem = styled(Link)`
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
