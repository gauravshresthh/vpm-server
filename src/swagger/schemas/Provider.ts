export default {
    type: 'object',
    properties: {
      name: { type: 'string' },
      legal_name: { type: 'string' },
      website: { type: 'string', format: 'uri' },
      training_organization_type: { type: 'string' },
      rto_code: { type: 'string' },
      is_public_rto: { type: 'boolean' },
      cricos_code: { type: 'string' },
      abn: { type: 'string' },
      head_office_address: {
        type: 'object',
        properties: {
          street_line1: { type: 'string' },
          street_line2: { type: 'string' },
          city: { type: 'string' },
          state: { type: 'string' },
          postal_code: { type: 'string' },
          country: { type: 'string' },
        },
        required: ['street_line1', 'city', 'state', 'postal_code', 'country'],
      },
      postal_same_as_office: { type: 'boolean' },
      contact_person: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          title: { type: 'string' },
          email: { type: 'string', format: 'email' },
          phone: { type: 'string' },
          fax: { type: 'string' },
        },
        required: ['name', 'email', 'phone'],
      },
      campuses: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            address: {
              type: 'object',
              properties: {
                street_line1: { type: 'string' },
                street_line2: { type: 'string' },
                city: { type: 'string' },
                state: { type: 'string' },
                postal_code: { type: 'string' },
                country: { type: 'string' },
              },
              required: ['street_line1', 'city', 'state', 'postal_code', 'country'],
            },
          },
          required: ['name', 'address'],
        },
      },
    },
    required: ['name', 'legal_name', 'head_office_address', 'contact_person'],
  };
  