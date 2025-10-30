import { Schema, model, models, Document } from 'mongoose';

// TypeScript interface for Event document
export interface IEvent extends Document {
  title: string;
  slug: string;
  description?: string;
  image: string;
  location: string;
  date: Date;
  time: string;
  category?: string;
  price?: number;
  capacity?: number;
  availableSeats?: number;
  organizer?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema for Event
const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Event slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    image: {
      type: String,
      required: [true, 'Event image is required'],
    },
    location: {
      type: String,
      required: [true, 'Event location is required'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    time: {
      type: String,
      required: [true, 'Event time is required'],
    },
    category: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      default: 0,
      min: [0, 'Price cannot be negative'],
    },
    capacity: {
      type: Number,
      min: [1, 'Capacity must be at least 1'],
    },
    availableSeats: {
      type: Number,
      min: [0, 'Available seats cannot be negative'],
    },
    organizer: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
EventSchema.index({ slug: 1 });
EventSchema.index({ date: 1 });
EventSchema.index({ category: 1 });

// Prevent model recompilation in Next.js hot reload
const Event = models.Event || model<IEvent>('Event', EventSchema);

export default Event;
