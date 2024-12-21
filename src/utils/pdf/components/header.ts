import { jsPDF } from 'jspdf';

export function addCompanyHeader(pdf: jsPDF) {
  // Left column
  pdf.setFontSize(10);
  pdf.setTextColor(100);
  pdf.text('Kefan Building, Woodavenue Road', 20, 20);
  pdf.text('(254) 728 309 380', 20, 25);

  // Center logo
  try {
    pdf.addImage('https://ladinatravelsafaris.com/logo.png', 'PNG', 85, 15, 40, 40);
  } catch (error) {
    console.warn('Failed to load logo:', error);
  }

  // Right column
  pdf.text('info@ladinatravelsafaris.com', pdf.internal.pageSize.width - 20, 20, { align: 'right' });
  pdf.text('ladinatravelsafaris.com', pdf.internal.pageSize.width - 20, 25, { align: 'right' });
}