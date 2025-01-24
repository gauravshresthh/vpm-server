export default {
  type: 'object',
  properties: {
    filename: { type: 'string' },
    uploaded_by: { type: 'string' },
    upload_date: { type: 'string', format: 'date-time' },
    size: { type: 'number' },
    is_current: { type: 'boolean' },
  },
  required: ['filename', 'uploaded_by', 'upload_date', 'size', 'is_current'],
};
