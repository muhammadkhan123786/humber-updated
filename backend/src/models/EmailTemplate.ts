// models/EmailTemplate.ts
import mongoose from 'mongoose';

const EmailHeaderSchema = new mongoose.Schema({
  logo: { type: String, required: true },
  companyName: { type: String, required: true },
  headerColor: { type: String, default: '#1E1F4B' },
  showSocialLinks: { type: Boolean, default: true },
  alignment: { type: String, enum: ['left', 'center', 'right'], default: 'center' }
});

const EmailFooterSchema = new mongoose.Schema({
  signature: { type: String, required: true },
  signatureImage: { type: String },
  companyAddress: { type: String },
  phoneNumber: { type: String },
  emailAddress: { type: String },
  website: { type: String },
  socialLinks: {
    facebook: { type: String },
    twitter: { type: String },
    linkedin: { type: String },
    instagram: { type: String }
  },
  unsubscribeLink: { type: String },
  privacyPolicyLink: { type: String }
});

const EmailTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  subject: { type: String, required: true },
  templateBody: { type: String, required: true },
  header: { type: EmailHeaderSchema, required: true },
  footer: { type: EmailFooterSchema, required: true },
  variables: [{ type: String }],
  category: { 
    type: String, 
    enum: ['welcome', 'notification', 'promotional', 'transactional', 'custom'],
    default: 'custom'
  },
  isActive: { type: Boolean, default: true },
  isDefault: { type: Boolean, default: false },
  thumbnail: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  usageCount: { type: Number, default: 0 }
}, { timestamps: true });

export const EmailTemplate = mongoose.models.EmailTemplate || mongoose.model('EmailTemplate', EmailTemplateSchema);