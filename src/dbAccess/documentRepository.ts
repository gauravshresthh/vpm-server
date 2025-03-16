/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import { IDocument, DocumentModel } from '../models/documentModel';

// Create a new document
const createDocument = async (payload: IDocument) => {
  const document = new DocumentModel(payload);
  return await document.save();
};

const createManyDocuments = async (payload: IDocument[]) => {
  return await DocumentModel.insertMany(payload);
};

// Find a document by ID
const findDocumentById = async (
  documentId: mongoose.Types.ObjectId | string
) => {
  const query = DocumentModel.findById(documentId);
  const document: any = await query.exec();

  if (document && document.category) {
    await document.populate('category');
  }

  return document;
};

// Find all documents
const findAllDocuments = async (
  page: number = 1,
  limit: number = 10,
  search: string = ''
) => {
  const skip = (page - 1) * limit;

  const searchFilter = search
    ? {
        $or: [
          { filename: { $regex: search, $options: 'i' } },
          { name: { $regex: search, $options: 'i' } },
        ],
      }
    : {};
  const totalCount = await DocumentModel.countDocuments(searchFilter);
  const result = await DocumentModel.find(searchFilter)
    .skip(skip)
    .limit(limit)
    .sort({ updated_at: -1 })
    .populate('category_id')
    .exec();

  return {
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
    result,
  };
};

const findMyDocuments = async (userId: string) => {
  return await DocumentModel.find({ uploaded_by: userId });
};

// Find all documents by parent ID (e.g., files within a folder)
const findDocumentsByParentId = async (
  parentId: mongoose.Types.ObjectId | string | null
) => {
  return await DocumentModel.find({ parent_id: parentId }).populate('category');
};

// Update a document by ID
const updateDocument = async (
  documentId: string,
  payload: Partial<IDocument>
) => {
  return await DocumentModel.findByIdAndUpdate(documentId, payload, {
    new: true,
  });
};

// Delete a document
const deleteDocument = async (documentId: string) => {
  return await DocumentModel.findByIdAndDelete(documentId);
};

// Add a new version to a document
const addVersion = async (
  documentId: string,
  version: IDocument['versions'] | undefined
) => {
  return await DocumentModel.findByIdAndUpdate(
    documentId,
    { $push: { versions: version } },
    { new: true }
  );
};

// Remove a specific version from a document
const removeVersion = async (documentId: string, versionId: string) => {
  return await DocumentModel.findByIdAndUpdate(
    documentId,
    { $pull: { versions: { _id: versionId } } },
    { new: true }
  );
};

// Mark a specific version as the current one
const setCurrentVersion = async (documentId: string, versionId: string) => {
  // Unset the current flag for all versions
  await DocumentModel.findByIdAndUpdate(documentId, {
    $set: { 'versions.$[].is_current': false },
  });

  // Set the current flag for the specified version
  return await DocumentModel.findOneAndUpdate(
    { _id: documentId, 'versions._id': versionId },
    { $set: { 'versions.$.is_current': true } },
    { new: true }
  );
};

const documentRepository = {
  createDocument,
  findDocumentById,
  findAllDocuments,
  findDocumentsByParentId,
  updateDocument,
  deleteDocument,
  addVersion,
  removeVersion,
  setCurrentVersion,
  findMyDocuments,
  createManyDocuments,
};

export default documentRepository;
