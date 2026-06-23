import { Schema, model } from 'mongoose';
import { IFaq } from './faq.interface';


const faqSchema = new Schema<IFaq>(
  {
    question: {
      type: String,
      required: [true, 'FAQ question is required'],
      trim: true,
      minlength: [10, 'FAQ question must be at least 10 characters'],
      maxlength: [200, 'FAQ question cannot exceed 200 characters'],
    },
    answer: {
      type: String,
      required: [true, 'FAQ answer is required'],
      trim: true,
      minlength: [20, 'FAQ answer must be at least 20 characters'],
      maxlength: [1000, 'FAQ answer cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
  },
);
const Faq = model<IFaq>('Faq', faqSchema);
export default Faq;
