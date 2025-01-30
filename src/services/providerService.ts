import providerRepository from '../dbAccess/providerRepository';
import { IProvider } from '../models/providerModel';
import CustomError from '../utils/CustomError';

// Service to create a new provider
const create = async (payload: IProvider) => {
  return await providerRepository.createProvider(payload);
};

// Service to find a provider by ID
const findById = async (provider_id: string) => {
  const provider = await providerRepository.findProviderById(provider_id);
  if (!provider) {
    throw new CustomError('Provider not found', 404);
  }
  return provider;
};

// Service to get all providers
const findAll = async (page: number, limit: number, search: string) => {
  return await providerRepository.findAllProviders(page, limit, search);
};

// Service to update provider details
const updateById = async (provider_id: string, payload: Partial<IProvider>) => {
  const updatedProvider = await providerRepository.updateProvider(
    provider_id,
    payload
  );
  if (!updatedProvider) {
    throw new CustomError('Provider not found', 404);
  }
  return updatedProvider;
};

// Service to delete a provider
const deleteById = async (provider_id: string) => {
  const deletedProvider = await providerRepository.deleteProvider(provider_id);
  if (!deletedProvider) {
    throw new CustomError('Provider not found', 404);
  }
  return deletedProvider;
};

// Service to add a campus to a provider
const addCampus = async (
  provider_id: string,
  campus: IProvider['campuses'][0]
) => {
  const updatedProvider = await providerRepository.addCampus(
    provider_id,
    campus
  );
  if (!updatedProvider) {
    throw new CustomError('Provider not found', 404);
  }
  return updatedProvider;
};

// Service to remove a campus from a provider
const removeCampus = async (provider_id: string, campusId: string) => {
  const updatedProvider = await providerRepository.removeCampus(
    provider_id,
    campusId
  );
  if (!updatedProvider) {
    throw new CustomError('Provider not found', 404);
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
