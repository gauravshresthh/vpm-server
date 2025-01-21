import mongoose, { Schema, Document, Model } from 'mongoose';

const CampusSchema: Schema<ICampus> = new Schema({
  name: { type: String, required: true },
  address: {
    street_line1: { type: String, required: true },
    street_line2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postal_code: { type: String, required: true },
    country: { type: String, required: true },
  },
});

const ProviderSchema: Schema<IProvider> = new Schema(
  {
    name: { type: String, required: true },
    legal_name: { type: String, required: true },
    website: { type: String },
    training_organization_type: { type: String },
    rto_code: { type: String },
    is_public_rto: { type: Boolean, default: false },
    cricos_code: { type: String },
    abn: { type: String },
    head_office_address: {
      street_line1: { type: String, required: true },
      street_line2: { type: String },
      city: { type: String },
      state: { type: String, required: true },
      postal_code: { type: String, required: true },
      country: { type: String, required: true },
    },
    postal_same_as_office: { type: Boolean, default: true },
    contact_person: {
      name: { type: String, required: true },
      title: { type: String },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      fax: { type: String },
    },
    campuses: [CampusSchema],
  },
  { timestamps: true }
);

export const Provider: Model<IProvider> = mongoose.model<IProvider>(
  'Provider',
  ProviderSchema
);

export interface ICampus {
  name: string;
  address: {
    street_line1: string;
    street_line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

export interface IProvider extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  legal_name: string;
  website?: string;
  training_organization_type?: string;
  rto_code?: string;
  is_public_rto?: boolean;
  cricos_code?: string;
  abn?: string;
  head_office_address: {
    street_line1: string;
    street_line2?: string;
    city?: string;
    state: string;
    postal_code: string;
    country: string;
  };
  postal_same_as_office?: boolean;
  contact_person: {
    name: string;
    title?: string;
    email: string;
    phone: string;
    fax?: string;
  };
  campuses: ICampus[];
  createdAt?: Date;
  updatedAt?: Date;
}
