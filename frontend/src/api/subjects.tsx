export async function getDepartments() {
  return await fetch(`${process.env.REACT_APP_API_URL}/api/departments`).then(
    (res) => res.json()
  );
}

export async function getSubjects() {
  return await fetch(`${process.env.REACT_APP_API_URL}/api/subjects`).then(
    (res) => res.json()
  );
}
