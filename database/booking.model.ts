import { Schema, model, models, Document, Types } from 'mongoose';

// TypeScript interface for Booking document
export interface IBooking extends Document {
  event: Types.ObjectId;
  userName: string;
  userEmail: string;
  userPhone?: string;
  numberOfSeats: number;
  totalPrice: number;
  bookingDate: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentId?: string;
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema for Booking
const BookingSchema = new Schema<IBooking>(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event reference is required'],
    },
    userName: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    userEmail: {
      type: String,
      required: [true, 'User email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    userPhone: {
      type: String,
      trim: true,
    },
    numberOfSeats: {
      type: Number,
      required: [true, 'Number of seats is required'],
      min: [1, 'Must book at least 1 seat'],
    },
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required'],
      min: [0, 'Price cannot be negative'],
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentId: {
      type: String,
      trim: true,
    },
    specialRequests: {
      type: String,
      trim: true,
      maxlength: [500, 'Special requests cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
BookingSchema.index({ event: 1 });
BookingSchema.index({ userEmail: 1 });
BookingSchema.index({ bookingDate: -1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ paymentStatus: 1 });

// Prevent model recompilation in Next.js hot reload
const Booking = models.Booking || model<IBooking>('Booking', BookingSchema);

export default Booking;