import { StatusCodes } from "http-status-codes";
import { announcementService } from "./announcement.service";
import { Request, Response } from "express";
import sendResponse from "../../../utils/sendResponse";
import catchAsync from "../../../utils/catchAsync";

const createAnnouncement = catchAsync(async (req: Request, res: Response) => {
  const result = await announcementService.createAnnouncement(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: 'Announcement created successfully',
    data: result,
  });
});

const getAllAnnouncements = catchAsync(async (req: Request, res: Response) => {
  const result = await announcementService.getAllAnnouncements();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Announcements retrieved successfully',
    data: result,
  });
});

const getAnnouncementById = catchAsync(async (req: Request, res: Response) => {
  const { announcementId } = req.params;
  const result = await announcementService.getAnnouncementById(announcementId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Announcement retrieved successfully',
    data: result,
  });
});

const updateAnnouncement = catchAsync(async (req: Request, res: Response) => {
  const { announcementId } = req.params;
  const result = await announcementService.updateAnnouncement(announcementId, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Announcement updated successfully',
    data: result,
  });
});

const deleteAnnouncement = catchAsync(async (req: Request, res: Response) => {
  const { announcementId } = req.params;
  const result = await announcementService.deleteAnnouncement(announcementId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Announcement deleted successfully',
    data: result,
  });
});

export const announcementController = {
    createAnnouncement,
    getAllAnnouncements,
    getAnnouncementById,
    updateAnnouncement,
    deleteAnnouncement,
};