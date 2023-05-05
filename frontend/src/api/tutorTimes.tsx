export async function addTutorTime(date: Date) {
  return await fetch(
    `${process.env.REACT_APP_API_URL}/api/tutors/${localStorage.getItem(
      "userId"
    )}/times`,
    {
      method: "POST",
      body: JSON.stringify({
        userId: localStorage.getItem("userId"),
        datetime: date,
        durationHours: 1,
      }),
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    }
  ).then(async (res) => {
    if (res.status === 201) {
      return await res.json();
    } else {
      console.log(await res.json());
      throw new Error("Error creating time");
    }
  });
}

export async function getTutorTimes() {
  return await fetch(
    `${process.env.REACT_APP_API_URL}/api/tutors/${localStorage.getItem(
      "userId"
    )}/times`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  ).then(async (res) => {
    if (res.status === 200) {
      return await res.json();
    } else {
      throw new Error("Error getting times");
    }
  });
}

export async function deleteTutorTime(id: string) {
  return await fetch(
    `${process.env.REACT_APP_API_URL}/api/tutors/${localStorage.getItem(
      "userId"
    )}/times/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  ).then(async (res) => {
    if (res.status === 200) {
      return await res.json();
    } else {
      throw new Error("Error deleting time");
    }
  });
}
