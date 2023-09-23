import { format } from 'date-fns';
import { GetStaticProps } from 'next';
import React, { useState } from 'react';
import EventCard from '../components/EventCard';
import MainLayout from '../components/MainLayout';
import getAllEvents from '../scripts/event-generator-sheets.mjs';
import styles from '../styles/Events.module.scss';
import vars from '../styles/global_variables.module.scss';

interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  start: string;
  end: string;
  committee: string;
  event_type: string;
  registration_link: string;
  max_capacity: number;
  banner: string;
}

// interface EventClass {
//   className?: string;
// }

// const getEventClassByEvent = (event: Event): EventClass => {
//   if (!event) {
//     return {};
//   }
//   let modifierStr = '';
//   if (event.committee) {
//     modifierStr = `rbc-override-${event.committee}`;
//   }
//   return ({
//     className: `rbc-override-event ${modifierStr}`,
//   });
// };

interface Props {
  events: Event[];
  committee: string;
}

export default function Events({ events }: Props): JSX.Element {
  // const [activeEvent, setActiveEvent] = useState<Event | null>(null);
  const [indexedEvents] = useState<Event[]>( // wasn't using setindexedEvents so was getting linting errors </3
    events.map((event, index) => ({ ...event, id: index })),
  );
  //replace committee below
  const committee = vars.committee.toLowerCase();

  //get today's unix timestamp
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const todayUnixTime = Math.floor(now.getTime() / 1000);

  //filter by committee and if event is upcoming
  const filteredEvents = indexedEvents.filter((event) => {
    return (
      event.committee === committee &&
      parseInt(event.start) / 1000 >= todayUnixTime
    );
  });

  if (committee === 'board') {
    filteredEvents.shift();
  }

  return (
    <MainLayout>
      <div className={styles.main}>
        <h1 className={styles.title}>Events</h1>
        {/* <p className={styles.description}>
          Event descriptions Event descriptionsEvent descriptionsEvent
          descriptionsEvent descriptionsEvent descriptions Event
          descriptionsEvent descriptionsEvent descriptions
        </p> */}
        <div>
          <h2 className={styles.subtitle}>Upcoming Events</h2>
          {filteredEvents.map((event, index) => {
            const start = format(new Date(event.start), 'h:mma');
            const end = format(new Date(event.end), 'h:mma');
            const startDate = format(new Date(event.start), 'E MMM d');
            const endDate = format(new Date(event.end), 'E MMM d');
            let time = start + ' - ' + end;
            {
              startDate === endDate
                ? (time = startDate + ' ' + time)
                : (time =
                    startDate + ' ' + start + ' - ' + endDate + ' ' + end);
            }

            return (
              <div key={index} className={styles.card}>
                <EventCard
                  header={event.title}
                  body={event.description}
                  time={time}
                  img={event.banner}
                />
              </div>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const events = await getAllEvents();
  // Attempt to replace new lines with <br/>, doesn't work
  // const processedEvents = events.map((event) => (
  //  {...event, description: <>{event.description.replace(/\n/g, '<br/>')}</>}));
  // console.log(processedEvents);
  for (const event of events) {
    event.banner = await event.banner;
  }

  return {
    props: {
      events: events,
    },
    revalidate: 3600,
  };
};
