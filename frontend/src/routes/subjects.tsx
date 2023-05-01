import { useState, useEffect } from "react";
import { FaChevronRight } from "react-icons/fa";
import styled from "styled-components";
import { getDepartments, getSubjects } from "../api";

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  useEffect(() => {
    getSubjects().then((res) => setSubjects(res));
  }, []);

  const [departments, setDepartments] = useState([]);
  useEffect(() => {
    getDepartments().then((res) => setDepartments(res));
  }, []);

  // group subjects by departments
  return (
    <DepartmentList>
      {departments
        .sort((a: any, b: any) => a.name.localeCompare(b.name))
        .map((d: any) => (
          <div
            style={{
              marginBottom: "3rem",
            }}
          >
            <h1
              style={{
                marginBottom: "1rem",
              }}
            >
              {d.name}
            </h1>
            {subjects
              .sort((a: any, b: any) => a.name.localeCompare(b.name))
              .filter((s: any) => s.department === d.name)
              .map((s: any) => (
                <SubjectElement id={s.name} key={s.name} name={`${s.name}`} />
              ))}
          </div>
        ))}
    </DepartmentList>
  );
}

interface SubjectProps {
  id: string;
  name: string;
}

function SubjectElement({ name }: SubjectProps) {
  return (
    <SubjectContainer>
      <h2>{name}</h2>
      <FaChevronRight
        style={{
          marginLeft: "auto",
        }}
        size={24}
      />
    </SubjectContainer>
  );
}

const DepartmentList = styled.div`
  padding: 4rem;
  width: 100%;
  min-height: 100%;
`;

const SubjectContainer = styled.div`
  width: 100%;
  padding: 1rem;
  background-color: #fff;
  border-radius: 10px;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: row;
  align-items: center;
`;
