import ExploreBtn from "./../components/ExploreBtn";
import EventCard from "@/components/EventCard";
import { IEvent } from "@/database";
import { cacheLife } from "next/cache";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const page = async () => {
  'use cache'
  cacheLife({stale:60})
  const response = await fetch(`${BASE_URL}/api/events`);
  const { events } = await response.json();

  return (
    <section>
      <h1 className="text-center">
        The Hub for Every Dev <br /> Event You Can&apos;t Miss
      </h1>
      <p className="text-center mt-5">
        Hackatons, meetup, and Conference, All in One Place
      </p>
      <ExploreBtn />
      <div className="mt-20 space-y-7">
        <h3>Featured Event</h3>

        <ul className="events">
          {events &&
            events.length > 0 &&
            events.map((evnt: IEvent) => (
              <li className="list-none" key={evnt._id as string}> {/* Tip: MongoDB usually uses _id, not id */}
            <EventCard
              {...evnt} // Spread all properties
              date={new Date(evnt.date)} // <-- OVERWRITE the 'date' string with a new Date object
            />
          </li>
            ))}
        </ul>
      </div>
    </section>
  );
};

export default page;
