import { StatusCodes } from "http-status-codes";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import { Request, Response } from "express";
import { faqService } from "./faq.service";

const createFaq = catchAsync(async (req: Request, res: Response) => {
  const result = await faqService.createFaq(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: 'FAQ created successfully',
    data: result,
  });
});

const getAllFaqs = catchAsync(async (req: Request, res: Response) => {
  const result = await faqService.getAllFaqs();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'FAQs retrieved successfully',
    data: result,
  });
});

const getFaqById = catchAsync(async (req: Request, res: Response) => {
  const { faqId } = req.params;
  const result = await faqService.getFaqById(faqId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'FAQ retrieved successfully',
    data: result,
  });
});

const updateFaq = catchAsync(async (req: Request, res: Response) => {
  const { faqId } = req.params;
  const result = await faqService.updateFaq(faqId, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'FAQ updated successfully',
    data: result,
  });
});

const deleteFaq = catchAsync(async (req: Request, res: Response) => {
  const { faqId } = req.params;
  const result = await faqService.deleteFaq(faqId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'FAQ deleted successfully',
    data: result,
  });
});

export const faqController = {
    createFaq,
    getAllFaqs,
    getFaqById,
    updateFaq,
    deleteFaq,
};