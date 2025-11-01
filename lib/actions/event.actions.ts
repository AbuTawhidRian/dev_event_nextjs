"use server";
import Event from "@/database/event.model";
import connectDB from "@/lib/mongodb";

export const getSimilarEventsBySlug = async (slug: string) => {
  try {
    await connectDB();
    const event = await Event.findOne({ slug });

    if (!event || !event.tags || event.tags.length === 0) {
      return []; // no tags, no similar events
    }

    const similarEvents = await Event.find({
      _id: { $ne: event._id },
      tags: { $in: event.tags },
    })
      .lean()
      .limit(5) // optional
      .exec()
      
    return similarEvents;
  } catch (err) {
    console.error("Error fetching similar events:", err);
    return [];
  }
};
