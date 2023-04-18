export async function getTutors() {
  return await fetch(`${process.env.REACT_APP_API_URL}/api/users`).then((res) =>
    res.json()
  );
}
