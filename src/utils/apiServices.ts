/* eslint-disable @typescript-eslint/no-explicit-any */
import { Document, Query } from 'mongoose';

interface QueryString {
    page?: string;
    sort?: string;
    limit?: string;
    fields?: string;
    [key: string]: any; // Allows additional filtering parameters like gte, lte, etc.
}

interface PreDefinedFilter {
    [key: string]: any;
}

class APIServices<T extends Document> {
    public query: Query<T[], T>;
    private queryString: QueryString;

    constructor(query: Query<T[], T>, queryString: QueryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter(preDefinedFilter: PreDefinedFilter): this {
        const queryObj = { ...this.queryString };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach((el) => delete queryObj[el]);

        // 1B) Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

        this.query = this.query.find({
            ...JSON.parse(queryStr),
            ...preDefinedFilter,
        });

        return this;
    }

    sort(): this {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        }

        return this;
    }

    limitFields(): this {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }

        return this;
    }

    paginate(): this {
        const page = parseInt(this.queryString.page || '1', 10);
        const limit = parseInt(this.queryString.limit || '10', 10);
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}

export default APIServices;