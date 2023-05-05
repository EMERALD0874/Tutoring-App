export async function getTutors() {
  return await fetch(`${process.env.REACT_APP_API_URL}/api/tutors`).then(
    (res) =>
      // Convert response into an array, take the "id" from each and check /api/users/:id
      res.json().then((tutors) =>
        Promise.all(
          tutors.map(async (tutor: any) => {
            let user: any = await getUser(tutor.id);
            // add "subjects" field from tutor to user
            user.subjects = tutor.subjects;
            return user;
          })
        )
      )
  );
}

export async function getTutor(id: string) {
  return await fetch(`${process.env.REACT_APP_API_URL}/api/tutors/${id}`).then(
    async (res) => {
      const json = await res.json();
      if (json.id) {
        let user: any = await getUser(json.id);
        user.subjects = json.subjects;
        return user;
      } else {
        return json;
      }
    }
  );
}

export async function getUser(id: string) {
  return await fetch(`${process.env.REACT_APP_API_URL}/api/users/${id}`).then(
    (res) => res.json()
  );
}

export async function setTutorSubjects(subjectIds: string[]) {
  return await fetch(
    `${process.env.REACT_APP_API_URL}/api/tutors/${localStorage.getItem(
      "userId"
    )}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ subjects: subjectIds }),
    }
  ).then((res) => {
    if (res.status === 200) {
      return res.json();
    } else {
      throw new Error("Error setting tutor subjects");
    }
  });
}

export async function becomeTutor() {
  return await fetch(`${process.env.REACT_APP_API_URL}/api/tutors`, {
    method: "POST",
    body: JSON.stringify({
      tutorId: localStorage.getItem("userId"),
      subjects: [],
      times: [],
    }),
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  }).then(async (res) => {
    if (res.status === 201) {
      return await res.json();
    } else {
      throw new Error("Error becoming tutor");
    }
  });
}
