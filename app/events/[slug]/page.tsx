import { notFound } from "next/navigation";
import Image from "next/image";
import BookEvent from "@/components/BookEvent";
import { IEvent } from "@/database/index";
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions";
import EventCard from "@/components/EventCard";

// Function to fetch event data
async function getEvent(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/events/${slug}`,
    {
      cache: "no-store", // or 'force-cache' for SSG-like behavior
    }
  );

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error("Failed to fetch event");
  }

  return res.json();
}

//component
const EventDetailsItems = ({
  icon,
  alt,
  label,
}: {
  icon: string;
  alt: string;
  label: string;
}) => (
  <div className="flex-row-gap-2 items-center">
    <Image src={icon} alt={alt} width={17} height={17} />
    <p>{label}</p>
  </div>
);

const EventTags = ({tags}: {tags: string[]})=>(
    <div className="flex flex-row gap-1.5 flex-wrap">
      {tags.map((tag)=>(
        <div className="pill" key={tag}>{tag}</div>
      ))}
    </div>
)


// Page Component
export default async function EventPage({
  params,
}: {
  params: { slug: string };
}) {
  const resolvedParams = await params;
  const data = await getEvent(resolvedParams.slug);
  console.log("Event ID:", data);

  if (!data || !data.event) {
    notFound(); // specific Next.js function to show 404 page
  }

  const { event } = data;
  const bookings = 10;

  
  const similarEvents: IEvent[] = await getSimilarEventsBySlug(resolvedParams.slug);
  console.log('similar events',similarEvents);
  


  return (
    <section id="event">
      <div className="header">
        <h1>Event Description</h1>
        <p className="">{event.description}</p>
      </div>
      <div className="details">
        {/* left side */}
        <div className="content">
          <Image
            src={event.image}
            alt="Event Banner"
            width={800}
            height={800}
            className="banner"
          />
          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{event.organizer}</p>
          </section>
          <section className="flex-col gap-2">
            <h2>Event Details</h2>
            <EventDetailsItems
              icon="/icons/calendar.svg"
              alt="calendar"
              label={event.date}
            />
            <EventDetailsItems
              icon="/icons/clock.svg"
              alt="time"
              label={event.time}
            />
            <EventDetailsItems
              icon="/icons/pin.svg"
              alt="location"
              label={event.location}
            />
            <EventDetailsItems
              icon="/icons/audience.svg"
              alt="audience"
              label={event.organizer}
            />
            {event.tags && event.tags.length > 0 && (
              <EventTags tags={event.tags} />
            )}
          </section>
        </div>

        {/* right side */}
        <aside className="booking">
          <div className="signup-card">
            <h2>Book Your Spot</h2>
            {bookings > 0 ? (
              <p className="text-sm">
                Join {bookings} people who have already booked their spot!
              </p>
            ) : (
              <p className="text-sm">Be the first to book your spot</p>
            )}

            <BookEvent />
          </div>
        </aside>
      </div>

      <div className="flex w-full flex-col gap-4 pt-20">
        <h2>Similar Events</h2>
        <div className="events">
          {similarEvents.length === 0 ? (
            <p>No similar events found.</p>
          ) : (
            similarEvents.map((similarEvent: IEvent) => (
              <EventCard key={similarEvent.title} {...similarEvent} />

  

            ))
          )}
        </div>
      </div>
    </section>
  );
}
