export async function getDepartments() {
  return await fetch(`${process.env.REACT_APP_API_URL}/api/departments`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }).then((res) => {
    return res.json();
  });
}

export async function getSubjects() {
  return await fetch(`${process.env.REACT_APP_API_URL}/api/subjects`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }).then((res) => res.json());
}

export async function getSubject(id: string) {
  return await fetch(`${process.env.REACT_APP_API_URL}/api/subjects/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }).then((res) => res.json());
}
