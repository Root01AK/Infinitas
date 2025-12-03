// In your Strapi project:
// src/api/contact/controllers/contact.js

'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::contact.contact', ({ strapi }) => ({
  async find(ctx) {
    // Force deep population of nested components
    const entity = await strapi.db.query('api::contact.contact').findOne({
      populate: {
        ContactTitle: true,
        FaqTitle: true,
        SEO: true,
        Faqstitle: {
          populate: {
            FaqContent: {
              populate: ['Question', 'Anwser']
            }
          }
        }
      }
    });

    // Return in expected format
    return {
      data: entity ? [entity] : [],
      meta: {
        pagination: {
          page: 1,
          pageSize: 25,
          pageCount: 1,
          total: entity ? 1 : 0
        }
      }
    };
  }
}));