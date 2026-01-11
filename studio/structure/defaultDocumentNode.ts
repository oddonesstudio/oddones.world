import type { DefaultDocumentNodeResolver } from "sanity/structure";

import { DocumentPreview } from "../components/DocumentPreview";

const previewableTypes = new Set(["page", "article"]);

export const defaultDocumentNode: DefaultDocumentNodeResolver = (S, { schemaType }) => {
  if (!previewableTypes.has(schemaType)) {
    return S.document().views([S.view.form()]);
  }

  return S.document().views([S.view.form(), S.view.component(DocumentPreview).title("Preview")]);
};
