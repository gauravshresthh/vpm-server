import mongoose from 'mongoose';
import { IProvider, Provider } from '../models/providerModel';

// Create a new provider
const createProvider = async (payload: IProvider) => {
  const provider = new Provider(payload);
  return await provider.save();
};

// Find a provider by ID
const findProviderById = async (
  providerId: mongoose.Types.ObjectId | string
) => {
  return await Provider.findById(providerId);
};

// Find all providers
const findAllProviders = async () => {
  return await Provider.find();
};

// Update a provider by ID
const updateProvider = async (
  providerId: string,
  payload: Partial<IProvider>
) => {
  return await Provider.findByIdAndUpdate(providerId, payload, { new: true });
};

// Delete a provider
const deleteProvider = async (providerId: string) => {
  return await Provider.findByIdAndDelete(providerId);
};

// Add a campus to a provider
const addCampus = async (
  providerId: string,
  campus: IProvider['campuses'][0]
) => {
  return await Provider.findByIdAndUpdate(
    providerId,
    { $push: { campuses: campus } },
    { new: true }
  );
};

// Remove a campus from a provider
const removeCampus = async (providerId: string, campusId: string) => {
  return await Provider.findByIdAndUpdate(
    providerId,
    { $pull: { campuses: { _id: campusId } } },
    { new: true }
  );
};

const providerRepository = {
  createProvider,
  findProviderById,
  findAllProviders,
  updateProvider,
  deleteProvider,
  addCampus,
  removeCampus,
};

export default providerRepository;
