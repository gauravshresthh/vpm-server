import documentRepository from '../dbAccess/documentRepository';
import { IDocument } from '../models/documentModel';
import CustomError from '../utils/CustomError';

// Service to create a new document
const create = async (payload: IDocument) => {
  return await documentRepository.createDocument(payload);
};

// Service to find a document by ID
const findById = async (documentId: string) => {
  const document = await documentRepository.findDocumentById(documentId);
  if (!document) {
    throw new CustomError('Document not found', 400);
  }
  return document;
};

// Service to get all documents
const findAll = async () => {
  return await documentRepository.findAllDocuments();
};

// Service to get documents by parent ID (for folder contents)
const findByParentId = async (parentId: string | null) => {
  return await documentRepository.findDocumentsByParentId(parentId);
};

// Service to update a document by ID
const updateById = async (documentId: string, payload: Partial<IDocument>) => {
  const updatedDocument = await documentRepository.updateDocument(
    documentId,
    payload
  );
  if (!updatedDocument) {
    throw new CustomError('Document not found', 400);
  }
  return updatedDocument;
};

// Service to delete a document by ID
const deleteById = async (documentId: string) => {
  const deletedDocument = await documentRepository.deleteDocument(documentId);
  if (!deletedDocument) {
    throw new CustomError('Document not found', 400);
  }
  return deletedDocument;
};

// Service to add a version to a document
const addVersion = async (
  documentId: string,
  version: IDocument['versions'][0]
) => {
  const updatedDocument = await documentRepository.addVersion(
    documentId,
    version
  );
  if (!updatedDocument) {
    throw new CustomError('Document not found', 400);
  }
  return updatedDocument;
};

// Service to remove a version from a document
const removeVersion = async (documentId: string, versionId: string) => {
  const updatedDocument = await documentRepository.removeVersion(
    documentId,
    versionId
  );
  if (!updatedDocument) {
    throw new CustomError('Document not found', 400);
  }
  return updatedDocument;
};

// Service to set a specific version as the current one
const setCurrentVersion = async (documentId: string, versionId: string) => {
  const updatedDocument = await documentRepository.setCurrentVersion(
    documentId,
    versionId
  );
  if (!updatedDocument) {
    throw new CustomError('Document or version not found', 400);
  }
  return updatedDocument;
};

const documentService = {
  create,
  findById,
  findAll,
  findByParentId,
  updateById,
  deleteById,
  addVersion,
  removeVersion,
  setCurrentVersion,
};

export default documentService;
