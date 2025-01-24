import mongoose, { Schema, Document, Model } from 'mongoose';

// Document Category Interface
export interface IDocumentCategory extends Document {
  name: string;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
}

// Document Category Schema
const documentCategorySchema: Schema<IDocumentCategory> = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// Export the DocumentCategory Model
export const DocumentCategoryModel: Model<IDocumentCategory> =
  mongoose.model<IDocumentCategory>('DocumentCategory', documentCategorySchema);
