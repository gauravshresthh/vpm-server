/* eslint-disable @typescript-eslint/no-explicit-any */
// import APIServices from "./apiServices";
import APIServices from './apiServices';
import catchAsync from './catchAsync';
import CustomError from './CustomError';

const deleteOne = (Model: any) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new CustomError('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

const updateOne = (Model: any) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new CustomError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

const createOne = (Model: any) =>
  catchAsync(async (req, res) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: doc,
    });
  });

const getOne = (Model: any, popOptions?: any) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;
  

    if (!doc) {
      return next(new CustomError('No document found with that ID', 404));
    }

    const strippedDoc = doc.toObject()

    res.status(200).json({
      status: 'success',
      data: strippedDoc,
    });
  });

const getAll = (Model: any) =>
  catchAsync(async (req, res) => {
    let query = {};
    if (req.params.id) query = { Model: req.params.id };

    const features = new APIServices(Model.find(query), req.query)
      .sort()
      .limitFields()
      .paginate();

    const doc = await features.query;

    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: doc,
    });
  });

const factory = {
  getOne,
  updateOne,
  deleteOne,
  createOne,
  getAll,
};

export default factory;
