import { getUser } from "./tutors";

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

export async function getSessionsByUser() {
  return await fetch(`${process.env.REACT_APP_API_URL}/api/sessions`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }).then(async (res) => {
    if (res.status === 200) {
      const json = await res.json();
      let dates = json
        .filter((session: any) => {
          return (
            session.student_id === localStorage.getItem("userId") ||
            session.tutor_id === localStorage.getItem("userId")
          );
        })
        .map((session: any) => {
          return {
            ...session,
            isTutor: session.tutor_id === localStorage.getItem("userId"),
          };
        });

      for (let i = 0; i < dates.length; i++) {
        const tutorTime = await getTutorTimeById(
          dates[i].tutor_id,
          dates[i].appointment
        );
        dates[i].datetime = tutorTime.datetime;
        const other_user = await getUser(
          dates[i].isTutor ? dates[i].student_id : dates[i].tutor_id
        );
        dates[i].other_user = other_user;
      }

      return dates;
    } else {
      throw new Error("Error getting sessions");
    }
  });
}

export async function getTutorTimeById(tutor: string, id: string) {
  return await fetch(
    `${process.env.REACT_APP_API_URL}/api/tutors/${tutor}/times/${id}`,
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
      throw new Error("Error getting session");
    }
  });
}
