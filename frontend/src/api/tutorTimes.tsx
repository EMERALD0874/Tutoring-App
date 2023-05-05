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
      return (await (res.json() as Promise<any[]>)).sort((a: any, b: any) => {
        return new Date(a.datetime).getTime() - new Date(b.datetime).getTime();
      });
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

export async function getAvailableTutorTimes(
  id: string
): Promise<void | any[]> {
  return await fetch(
    `${process.env.REACT_APP_API_URL}/api/tutors/${id}/times`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  ).then(async (times) => {
    if (times.status === 200) {
      const t: any[] = (await (times.json() as Promise<any[]>)).sort(
        (a: any, b: any) => {
          return (
            new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
          );
        }
      );
      // now get all sessions
      return await fetch(`${process.env.REACT_APP_API_URL}/api/sessions`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then(async (sessions) => {
        if (sessions.status === 200) {
          const s: any[] = await sessions.json();
          // delete all where sessions.appointment == times.id
          return t.filter((time: any) => {
            return (
              s.filter((session: any) => {
                return session.appointment === time.timeid;
              }).length === 0
            );
          });
        } else {
          throw new Error("Error getting sessions");
        }
      });
    } else {
      throw new Error("Error getting tutor times");
    }
  });
}

export async function getNearestTutorTime(id: string) {
  const times = await getAvailableTutorTimes(id);
  if (times === undefined) {
    return undefined;
  }

  return times[0];
}

export async function createSession(tutor_id: string, appointment: string) {
  if (localStorage.getItem("userId") === tutor_id)
    throw new Error("Cannot create session with yourself");

  return await fetch(`${process.env.REACT_APP_API_URL}/api/sessions`, {
    method: "POST",
    body: JSON.stringify({
      student_id: localStorage.getItem("userId"),
      tutor_id,
      appointment,
    }),
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  }).then(async (res) => {
    if (res.status === 201) {
      return await res.json();
    } else {
      throw new Error("Error creating session");
    }
  });
}
