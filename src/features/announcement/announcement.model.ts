import { Schema, model } from 'mongoose';
import { IAnnouncement } from './announcement.interface';

const announcementSchema = new Schema<IAnnouncement>(
  {
    text: {
      type: String,
      required: [true, 'Announcement text is required'],
      trim: true,
      minlength: [10, 'Announcement must be at least 10 characters'],
      maxlength: [500, 'Announcement cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  },
);

const Announcement = model<IAnnouncement>('Announcement', announcementSchema);
export default Announcement;
