import mongoose, { Schema, Document } from 'mongoose';

export interface ICourse extends Document {
  course_name: string;
  course_code: string;
}

const CourseSchema: Schema<ICourse> = new Schema(
  {
    course_name: { type: String, required: true, maxlength: 255 },
    course_code: {
      type: String,
      required: true,
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export const CourseModel = mongoose.model<ICourse>('Course', CourseSchema);
