import { IAnnouncement } from './announcement.interface';
import Announcement from './announcement.model';

const createAnnouncement = async (payload: IAnnouncement) => {
  const result = await Announcement.create(payload);
  return result;
};

const getAllAnnouncements = async () => {
  const result = await Announcement.find();
  return result;
}

const getAnnouncementById = async (announcementId: string) => {
  const result = await Announcement.findById(announcementId);
  return result;
}

const updateAnnouncement = async (announcementId: string, payload: Partial<IAnnouncement>) => {
  const result = await Announcement.findByIdAndUpdate(announcementId, payload, { new: true });
  return result;
}

const deleteAnnouncement = async (announcementId: string) => {
  const result = await Announcement.findByIdAndDelete(announcementId);
  return result;
}

export const announcementService = {
  createAnnouncement,
  getAllAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
};

