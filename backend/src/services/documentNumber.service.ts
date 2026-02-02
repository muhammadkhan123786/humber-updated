import { DOCUMENT_NUMBER_CONFIG, DocumentType } from "../config/documentNumbers";

export const generateNextDocumentNumber = async (type: DocumentType) => {
  const config = DOCUMENT_NUMBER_CONFIG[type];

  const currentYear = new Date().getFullYear();

  const regex = new RegExp(`^${config.prefix}-${currentYear}-`);

  const latestDoc = await config.model
    .findOne({
      [config.field]: regex,
      isDeleted: false,
    })
    .sort({ createdAt: -1 })
    .lean();

  let nextNumber = 1;

  if (latestDoc?.[config.field]) {
    const match = (latestDoc[config.field] as string).match(
      new RegExp(`${config.prefix}-\\d{4}-(\\d+)`)
    );
    if (match) {
      nextNumber = Number(match[1]) + 1;
    }
  }

  return `${config.prefix}-${currentYear}-${String(nextNumber).padStart(3, "0")}`;
};
