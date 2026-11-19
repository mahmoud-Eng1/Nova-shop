const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

// إضافة قاعدة تنظيف النصوص إلى Joi
const extension = (joi) => ({
  type: 'string',
  base: joi.string(),
  messages: {
    'string.escapeHTML': 'الحقل {{#label}} لا يجب أن يحتوي على أكواد HTML أو نصوص برمجية'
  },
  rules: {
    // الخيار الأول: تنظيف النص تلقائياً وحذف أي وسوم خطيرة
    sanitize: {
      validate(value) {
        return sanitizeHtml(value, {
          allowedTags: [], // منع جميع وسوم HTML مثل <script> أو <img>
          allowedAttributes: {} // منع جميع الخصائص مثل onclick أو onerror
        });
      }
    },
    // الخيار الثاني (اختياري): رفض الطلب تماماً وإرجاع خطأ إذا احتوى على HTML
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {}
        });
        if (clean !== value) {
          return helpers.error('string.escapeHTML', { value });
        }
        return clean;
      }
    }
  }
});

const joi = BaseJoi.extend(extension);
module.exports = joi;
