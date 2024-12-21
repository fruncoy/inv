import { jsPDF } from 'jspdf';
import type { PDFGeneratorOptions } from '../types';
import { addCompanyHeader } from '../components/header';
import { addDocumentBox } from '../components/documentBox';
import { addItemsTable } from '../components/itemsTable';
import { addDocumentFooter } from '../components/footer';

export function generateQuotationPDF({ document, items }: PDFGeneratorOptions) {
  const pdf = new jsPDF();

  // Add components in sequence
  addCompanyHeader(pdf);
  addDocumentBox(pdf, document);
  const tableEndY = addItemsTable(pdf, document, items);
  addDocumentFooter(pdf, document, tableEndY + 20);

  return pdf;
}