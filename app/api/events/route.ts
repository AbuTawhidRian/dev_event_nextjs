import Event from "@/database/event.model";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from "stream";

// Make sure to configure Cloudinary with your credentials
// (This is usually done in a separate config file or at the root of your app)
// cloudinary.config({ 
//   cloud_name: 'YOUR_CLOUD_NAME', 
//   api_key: 'YOUR_API_KEY', 
//   api_secret: 'YOUR_API_SECRET' 
// });

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const formData = await req.formData();

        // --- 1. File Handling ---
        const file = formData.get('image') as File;
        if (!file) {
            return NextResponse.json({ message: 'Image file is required' }, { status: 400 });
        }

        // --- 2. Explicitly Get All Fields ---
        const title = formData.get('title') as string; // <-- ADDED
        const slug = formData.get('slug') as string;
        const description = formData.get('description') as string;
        const location = formData.get('location') as string;
        const date = formData.get('date') as string;
        const time = formData.get('time') as string;
        const category = formData.get('category') as string;
        const organizer = formData.get('organizer') as string;
        
        // Handle numbers
        const price = Number(formData.get('price'));
        const capacity = Number(formData.get('capacity'));
        const availableSeats = Number(formData.get('availableSeats'));

        // Handle JSON parsing for tags with its own error check
        let tags;
        try {
            const tagsString = formData.get('tags') as string;
            
            if (tagsString) {
                tags = JSON.parse(tagsString);
                
            } else {
                tags = []; // Default to empty array if no tags provided
            }
        } catch (jsonError) {
            return NextResponse.json({
                message: 'Invalid JSON format for tags',
                error: jsonError instanceof Error ? jsonError.message : 'Unknown JSON parse error'
            }, { status: 400 });
        }
        
        // --- 3. Image Upload to Cloudinary ---
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { resource_type: 'image', folder: 'DevEvent' },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
            Readable.from(buffer).pipe(stream);
        });
        
        const imageUrl = (uploadResult as { secure_url: string }).secure_url;

        // --- 4. Build Final Object for Database ---
        const eventData = {
            title, // <-- ADDED
            slug,
            description,
            location,
            date: new Date(date), // Convert date string to Date object
            time,
            category,
            price,
            capacity,
            availableSeats,
            organizer,
            tags,
            image: imageUrl // Use the Cloudinary URL
        };

        
      
        // --- 5. Create Event in Database ---
        const createdEvent = await Event.create(eventData);

        return NextResponse.json({
            message: 'Event created Successfully',
            event: createdEvent
        }, { status: 201 });

    } catch (err) {
        console.error(err);
        // Provide more specific error details if it's a validation error
        if (err instanceof Error && err.name === 'ValidationError') {
             return NextResponse.json({
                message: 'Event creation failed. Please check your data.',
                error: err.message
            }, { status: 400 });
        }
        
        return NextResponse.json({
            message: 'Event creation failed',
            error: err instanceof Error ? err.message : 'Unknown error'
        }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectDB();
        const events = await Event.find().sort({
            createdAt: -1
        });
        return NextResponse.json({
            message: 'Events fetched successfully',
            events
        }, { status: 200 });
    } catch (err) {
        return NextResponse.json({
            message: 'Event fetching failed',
            error: err instanceof Error ? err.message : 'Unknown error'
        }, { status: 500 });
    }
}