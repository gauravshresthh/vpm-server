import documentCategoryRepository from '../dbAccess/documentCategoryRepository';
import { IDocumentCategory } from '../models/documentCategoryModel';
import CustomError from '../utils/CustomError';

// Service to create a new document category
const create = async (payload: IDocumentCategory) => {
  return await documentCategoryRepository.createDocumentCategory(payload);
};

// Service to find a document category by ID
const findById = async (categoryId: string) => {
  const documentCategory =
    await documentCategoryRepository.findDocumentCategoryById(categoryId);
  if (!documentCategory) {
    throw new CustomError('Document category not found', 400);
  }
  return documentCategory;
};

// Service to get all document categories
const findAll = async () => {
  return await documentCategoryRepository.findAllDocumentCategories();
};

// Service to update a document category by ID
const updateById = async (
  categoryId: string,
  payload: Partial<IDocumentCategory>
) => {
  const updatedDocumentCategory =
    await documentCategoryRepository.updateDocumentCategory(
      categoryId,
      payload
    );
  if (!updatedDocumentCategory) {
    throw new CustomError('Document category not found', 400);
  }
  return updatedDocumentCategory;
};

// Service to delete a document category by ID
const deleteById = async (categoryId: string) => {
  const deletedDocumentCategory =
    await documentCategoryRepository.deleteDocumentCategory(categoryId);
  if (!deletedDocumentCategory) {
    throw new CustomError('Document category not found', 400);
  }
  return deletedDocumentCategory;
};

const documentCategoryService = {
  create,
  findById,
  findAll,
  updateById,
  deleteById,
};

export default documentCategoryService;
