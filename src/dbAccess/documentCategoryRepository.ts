import mongoose from 'mongoose';
import { DocumentCategoryModel, IDocumentCategory } from '../models/documentCategoryModel';

// Create a new document category
const createDocumentCategory = async (payload: IDocumentCategory) => {
  const documentCategory = new DocumentCategoryModel(payload);
  return await documentCategory.save();
};

// Find a document category by ID
const findDocumentCategoryById = async (
  categoryId: mongoose.Types.ObjectId | string
) => {
  return await DocumentCategoryModel.findById(categoryId);
};

// Find all document categories
const findAllDocumentCategories = async () => {
  return await DocumentCategoryModel.find();
};

// Update a document category by ID
const updateDocumentCategory = async (
  categoryId: string,
  payload: Partial<IDocumentCategory>
) => {
  return await DocumentCategoryModel.findByIdAndUpdate(categoryId, payload, { new: true });
};

// Delete a document category by ID
const deleteDocumentCategory = async (categoryId: string) => {
  return await DocumentCategoryModel.findByIdAndDelete(categoryId);
};

const documentCategoryRepository = {
  createDocumentCategory,
  findDocumentCategoryById,
  findAllDocumentCategories,
  updateDocumentCategory,
  deleteDocumentCategory,
};

export default documentCategoryRepository;
