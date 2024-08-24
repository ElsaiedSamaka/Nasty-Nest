import { Document, Types } from 'mongoose';

export interface IProductDocument extends Document {
  name: string;
  slug: string;
  description: string;
  seller: Types.ObjectId;
  price: number;
  currency: string;
  priceDiscount: number;
  quantity: number;
  sold: number;
  isOutOfStock: boolean;
  ratingsAverage: number;
  ratingsQuantity: number;
  details: object;
}
