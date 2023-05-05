import styled from "styled-components";
import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";
import { useEffect, useState } from "react";
import { getSessionsByUser } from "../api";

export default function Calendar() {
  const [dates, setDates] = useState<any[] | undefined>(undefined);

  useEffect(() => {
    getSessionsByUser().then((res) => {
      if (!res) return;
      setDates(
        res.map((session: any) => {
          return {
            id: session.id,
            title: session.isTutor
              ? `Tutoring ${session.other_user.first_name} ${session.other_user.last_name} (${session.other_user.email})`
              : `Appointment with ${session.other_user.first_name} ${session.other_user.last_name} (${session.other_user.email})`,
            start: new Date(session.datetime),
            end: new Date(
              new Date(session.datetime).getTime() + 60 * 60 * 1000
            ),
            color: session.isTutor ? "" : "#f77f00",
          };
        })
      );
    });
  }, []);

  return (
    <CalContainer>
      {dates && (
        <div>
          <FullCalendar
            plugins={[listPlugin]}
            initialView="listWeek"
            height="auto"
            events={dates}
          />

          <p
            style={{
              textAlign: "center",
              marginTop: "1rem",
              color: "#777",
              fontStyle: "italic",
              fontSize: "0.8rem",
            }}
          >
            To cancel an appointment, contact the other party and let them know
            you can't make it. Too many cancellations may result in a ban by the
            site admin.
          </p>
        </div>
      )}
    </CalContainer>
  );
}

const CalContainer = styled.div`
  padding: 4rem;
  width: 100%;
  min-height: 100%;
  display: block;
`;
