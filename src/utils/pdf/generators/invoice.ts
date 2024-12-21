import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import type { PDFGeneratorOptions } from '../types';
import { formatCurrency } from '../../currency';
import { formatDate } from '../../date';

export function generateInvoicePDF({ document, items }: PDFGeneratorOptions) {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.width;
  const margin = 20;
  let yPos = margin;

  // Company Header
  const headerHeight = 50;
  pdf.setFontSize(10);
  pdf.setTextColor(100);
  pdf.text('Kefan Building, Woodavenue Road', margin, yPos);
  pdf.text('(254) 728 309 380', margin, yPos + 5);

  // Try to add logo
  try {
    pdf.addImage('https://ladinatravelsafaris.com/logo.png', 'PNG', 
      pageWidth/2 - 12, yPos - 5, 24, 24);
  } catch (error) {
    console.warn('Failed to load logo:', error);
  }

  pdf.text('info@ladinatravelsafaris.com', pageWidth - margin, yPos, { align: 'right' });
  pdf.text('ladinatravelsafaris.com', pageWidth - margin, yPos + 5, { align: 'right' });

  yPos += headerHeight;

  // Document Box
  pdf.setDrawColor(254, 223, 202); // #FEDFCA
  pdf.setFillColor(255, 244, 238); // #FFF4EE
  pdf.roundedRect(margin, yPos, pageWidth - (margin * 2), 40, 3, 3, 'FD');

  pdf.setTextColor(255, 119, 31); // #FF771F
  pdf.setFontSize(20);
  pdf.text('INVOICE', margin + 10, yPos + 15);

  pdf.setTextColor(0);
  pdf.setFontSize(12);
  pdf.text(document.client_name, margin + 10, yPos + 25);
  pdf.setFontSize(10);
  pdf.text(`Invoice Date: ${formatDate(document.created_at)}`, margin + 10, yPos + 32);
  if (document.due_date) {
    pdf.text(`Due Date: ${formatDate(document.due_date)}`, margin + 10, yPos + 38);
  }

  yPos += 50;

  // Items Table
  const tableData = items.map((item, index) => [
    index + 1,
    {
      content: [
        { text: item.vehicle_type, styles: { textColor: [0, 166, 81], fontStyle: 'bold' } },
        { text: `${formatDate(item.from_date)} - ${formatDate(item.to_date)}`, fontSize: 8 },
        item.additional_info ? { text: item.additional_info, fontSize: 9, textColor: [100, 100, 100] } : ''
      ]
    },
    item.quantity,
    formatCurrency(item.price, document.currency),
    formatCurrency(item.quantity * item.price, document.currency)
  ]);

  const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  (pdf as any).autoTable({
    startY: yPos,
    head: [['#', 'Service Details', 'Qty', 'Rate', 'Amount']],
    body: tableData,
    foot: [[
      '',
      { content: 'Total:', styles: { halign: 'right', fontStyle: 'bold' } },
      '',
      '',
      { content: formatCurrency(totalAmount, document.currency), styles: { fontStyle: 'bold' } }
    ]],
    theme: 'grid',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [245, 245, 245], textColor: [0, 0, 0], fontStyle: 'bold' },
    footStyles: { fillColor: [245, 245, 245], textColor: [0, 0, 0] },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 30, halign: 'center' },
      3: { cellWidth: 40, halign: 'right' },
      4: { cellWidth: 40, halign: 'right' }
    }
  });

  yPos = (pdf as any).lastAutoTable.finalY + 20;

  // Payment Details
  pdf.setDrawColor(229, 231, 235);
  pdf.setFillColor(255, 255, 255);
  pdf.roundedRect(margin, yPos, pageWidth - (margin * 2), 60, 3, 3, 'FD');

  pdf.setTextColor(0, 166, 81);
  pdf.setFontSize(12);
  pdf.text('Payment Details', margin + 10, yPos + 15);

  // Bank Transfer
  pdf.setTextColor(255, 107, 0);
  pdf.setFontSize(11);
  pdf.text('Bank Transfer', margin + 10, yPos + 30);

  pdf.setTextColor(100);
  pdf.setFontSize(10);
  [
    'Bank Name: NCBA, Kenya, Code-07000',
    'Bank Branch: Kilimani, Code-129',
    'Account Name: Ladina Travel Safaris',
    'Bank Account: 1007205933',
    'Swift Code: CBAFKENX'
  ].forEach((line, index) => {
    pdf.text(line, margin + 10, yPos + 40 + (index * 5));
  });

  // M-PESA
  pdf.setTextColor(255, 107, 0);
  pdf.setFontSize(11);
  pdf.text('M-PESA', pageWidth/2 + 10, yPos + 30);

  pdf.setTextColor(100);
  pdf.setFontSize(10);
  [
    'MPESA Paybill: 880100',
    'Account Number: 1007205933'
  ].forEach((line, index) => {
    pdf.text(line, pageWidth/2 + 10, yPos + 40 + (index * 5));
  });

  yPos += 70;

  // Footer
  pdf.setDrawColor(229, 231, 235);
  pdf.setFillColor(255, 255, 255);
  pdf.roundedRect(margin, yPos, pageWidth - (margin * 2), 40, 3, 3, 'FD');

  pdf.setTextColor(0);
  pdf.setFontSize(14);
  pdf.text('Thank You for Your Business!', pageWidth/2, yPos + 15, { align: 'center' });
  
  pdf.setTextColor(100);
  pdf.setFontSize(10);
  pdf.text(
    'If you have any questions, please contact us at info@ladinatravelsafaris.com',
    pageWidth/2,
    yPos + 25,
    { align: 'center' }
  );

  return pdf;
}