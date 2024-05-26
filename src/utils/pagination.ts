import { Model, Document } from 'mongoose';

export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export async function paginate<T extends Document>(
    model: Model<T>,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginationResult<T>> {
    const offset = (page - 1) * limit;
    const [data, total] = await Promise.all([
      model.find().skip(offset).limit(limit).exec(),
      model.countDocuments(),
    ]);
    return { data: data as T[], total, page, limit };
  }