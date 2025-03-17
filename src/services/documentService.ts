import documentRepository from '../dbAccess/documentRepository';
import userRepository from '../dbAccess/userRepository';
import { ChangeDocumentStatusEmailTemplate } from '../emails/MessageAndReplyEmailTemplate';
import { IDocument } from '../models/documentModel';
import CustomError from '../utils/CustomError';
import emailService from './emailService';

// Service to create a new document
const create = async (payload: IDocument) => {
  return await documentRepository.createDocument(payload);
};

const createMany = async (documents: IDocument[]) => {
  return await documentRepository.createManyDocuments(documents);
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
const findAll = async (
  page: number,
  limit: number,
  search: string,
  category_id?: string
) => {
  return await documentRepository.findAllDocuments(
    page,
    limit,
    search,
    category_id
  );
};

const findAllDocumentsByUserSpecific = async (
  page: number,
  limit: number,
  search: string,
  category_id?: string
) => {
  return await documentRepository.findAllDocumentsByUserSpecific(
    page,
    limit,
    search,
    category_id
  );
};

// Service to get documents by parent ID (for folder contents)
const findByParentId = async (parentId: string | null) => {
  return await documentRepository.findDocumentsByParentId(parentId);
};

// Service to update a document by ID
const updateById = async (documentId: string, payload: Partial<IDocument>) => {
  const document = await documentRepository.findDocumentById(documentId);
  if (!document) {
    throw new CustomError('Document not found', 400);
  }
  const updatedDocument = await documentRepository.updateDocument(
    documentId,
    payload
  );

  return updatedDocument;
};

const changeDocumentStatus = async (
  documentId: string,
  payload: Partial<IDocument>
) => {
  const status = payload.status;
  const document = await documentRepository.findDocumentById(documentId);
  if (!document) {
    throw new CustomError('Document not found', 400);
  }
  const updatedDocument = await documentRepository.updateDocument(
    documentId,
    payload
  );
  const userId = document.uploaded_by;
  const user = await userRepository.findById(userId);
  if (user) {
    const email = user.email;
    const inviteLink = `${process.env.FRONTEND_URL}/student/dashboard/placement/my-placement`;

    const emailPayload = {
      email,
      subject: `You document has been ${status} !`,
      message: 'Your document has some updates.',
      htmlContent: ChangeDocumentStatusEmailTemplate(
        `You document has been ${status}`,
        inviteLink
      ),
    };

    await emailService.sendEmail(emailPayload);
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
  version: IDocument['versions'] | undefined
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

const findMyDocuments = async (userId: string) => {
  return await documentRepository.findMyDocuments(userId);
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
  findMyDocuments,
  createMany,
  changeDocumentStatus,
  findAllDocumentsByUserSpecific,
};

export default documentService;
