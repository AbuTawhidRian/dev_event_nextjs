import Event, { IEvent } from "@/database/event.model";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";


type RouteParams = {
  params:Promise<{slug:string}>
}

export async function GET(
  req: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  try {
    await connectDB();
    const { slug } = await params;

    const sanitizedSlug = slug.trim().toLowerCase()

    const event =  await Event.findOne({ slug: sanitizedSlug }).lean();

    if (!event) {
      return NextResponse.json(
        { message: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Event fetched successfully", event },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { message: "Failed to fetch event", error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}