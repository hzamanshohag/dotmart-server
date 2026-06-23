import { IFaq } from "./faq.interface";
import Faq from "./faq.model";


const createFaq = async (payload: IFaq) => {
  const result = await Faq.create(payload);
  return result;
};

const getAllFaqs = async () => {
  const result = await Faq.find();
  return result;
}

const getFaqById = async (faqId: string) => {
  const result = await Faq.findById(faqId);
  return result;
}

const updateFaq = async (faqId: string, payload: Partial<IFaq>) => {
  const result = await Faq.findByIdAndUpdate(faqId, payload, { new: true });
  return result;
}

const deleteFaq = async (faqId: string) => {
  const result = await Faq.findByIdAndDelete(faqId);
  return result;
}

export const faqService = {
  createFaq,
  getAllFaqs,
  getFaqById,
  updateFaq,
  deleteFaq,
};

