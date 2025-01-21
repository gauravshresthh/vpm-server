import providerRepository from '../dbAccess/providerRepository';
import { IProvider } from '../models/providerModel';
import CustomError from '../utils/CustomError';

// Service to create a new provider
const create = async (payload: IProvider) => {
  return await providerRepository.createProvider(payload);
};

// Service to find a provider by ID
const findById = async (providerId: string) => {
  const provider = await providerRepository.findProviderById(providerId);
  if (!provider) {
    throw new CustomError('Provider not found', 400);
  }
  return provider;
};

// Service to get all providers
const findAll = async () => {
  return await providerRepository.findAllProviders();
};

// Service to update provider details
const updateById = async (providerId: string, payload: Partial<IProvider>) => {
  const updatedProvider = await providerRepository.updateProvider(
    providerId,
    payload
  );
  if (!updatedProvider) {
    throw new CustomError('Provider not found', 400);
  }
  return updatedProvider;
};

// Service to delete a provider
const deleteById = async (providerId: string) => {
  const deletedProvider = await providerRepository.deleteProvider(providerId);
  if (!deletedProvider) {
    throw new CustomError('Provider not found', 400);
  }
  return deletedProvider;
};

// Service to add a campus to a provider
const addCampus = async (
  providerId: string,
  campus: IProvider['campuses'][0]
) => {
  const updatedProvider = await providerRepository.addCampus(
    providerId,
    campus
  );
  if (!updatedProvider) {
    throw new CustomError('Provider not found', 400);
  }
  return updatedProvider;
};

// Service to remove a campus from a provider
const removeCampus = async (providerId: string, campusId: string) => {
  const updatedProvider = await providerRepository.removeCampus(
    providerId,
    campusId
  );
  if (!updatedProvider) {
    throw new CustomError('Provider not found', 400);
  }
  return updatedProvider;
};

const providerService = {
  create,
  findById,
  findAll,
  updateById,
  deleteById,
  addCampus,
  removeCampus,
};

export default providerService;
