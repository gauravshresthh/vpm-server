export default {
  type: 'object',
  properties: {
    filename: { type: 'string' },
    file_type: {
      type: 'string',
      enum: ['pdf', 'csv', 'doc', 'docx', 'image', 'other'],
    },
    parent_id: { type: 'string' },
    category: { type: 'string' },
    is_folder: { type: 'boolean' },
    size: { type: 'number' },
    visibility: { type: 'string', enum: ['public', 'private'] },
    is_archived: { type: 'boolean' },
    starred: { type: 'boolean' },
    recent: { type: 'boolean' },
    versions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          filename: { type: 'string' },
          uploaded_by: { type: 'string' },
          upload_date: { type: 'string', format: 'date-time' },
          size: { type: 'number' },
          is_current: { type: 'boolean' },
        },
        required: [
          'filename',
          'uploaded_by',
          'upload_date',
          'size',
          'is_current',
        ],
      },
    },
  },
  required: ['filename', 'file_type', 'size', 'visibility'],
};
