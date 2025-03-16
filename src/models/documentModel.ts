import mongoose, { Schema, Document, Model } from 'mongoose';
export interface IVersion {
  filename: string;
  uploaded_by: string;
  upload_date: Date;
  size: number;
  is_current: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface IDocument extends Document {
  _id: mongoose.Types.ObjectId;
  filename: string;
  file_type: string;
  parent_id?: mongoose.Types.ObjectId | null;
  category_id?: mongoose.Types.ObjectId | null;
  uploaded_by?: mongoose.Types.ObjectId;
  is_folder: boolean;
  size?: number;
  versions?: IVersion[];
  starred?: boolean;
  recent?: boolean;
  visibility: 'public' | 'private';
  is_archived: boolean;
  url: string;
  status: string;
  created_at?: Date;
  updated_at?: Date;
}

const version_schema: Schema<IVersion> = new Schema<IVersion>(
  {
    filename: {
      type: String,
      required: true,
    },
    uploaded_by: {
      type: String,
      required: true,
    },
    upload_date: {
      type: Date,
      default: Date.now,
    },
    size: {
      type: Number,
      required: true,
    },
    is_current: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

const document_schema: Schema<IDocument> = new Schema<IDocument>(
  {
    filename: {
      type: String,
      required: true,
    },
    file_type: {
      type: String,
      enum: ['pdf', 'csv', 'doc', 'docx', 'image', 'other'],
      default: null,
    },
    url: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'on-hold'],
      default: null,
    },
    parent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      default: null,
    },
    uploaded_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DocumentCategory',
      default: null,
    },
    is_folder: {
      type: Boolean,
      default: false,
    },
    size: {
      type: Number,
      default: 0,
    },
    versions: [version_schema],
    starred: {
      type: Boolean,
      default: false,
    },
    recent: {
      type: Boolean,
      default: false,
    },
    visibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'private',
    },
    is_archived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

export const DocumentModel: Model<IDocument> = mongoose.model<IDocument>(
  'Document',
  document_schema
);
