import { Dialog } from '@headlessui/react';
import { X, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { generatePDF } from '../../utils/pdf'; // Updated import path
import { InvoicePreview } from './invoice/InvoicePreview';
import { QuotationPreview } from './quotation/QuotationPreview';
import { ReceiptPreview } from './receipt/ReceiptPreview';
import type { Document, VehicleItem } from '../../types';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document;
  items: VehicleItem[];
  allowEdit?: boolean;
}

export function PreviewModal({ 
  isOpen, 
  onClose, 
  document, 
  items,
  allowEdit = true
}: PreviewModalProps) {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/${document.type}s/${document.id}`);
    onClose();
  };

  const handleDownload = () => {
    try {
      const pdf = generatePDF({ document, items });
      pdf.save(`${document.type}-${document.id}.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const PreviewComponent = {
    invoice: InvoicePreview,
    quotation: QuotationPreview,
    receipt: ReceiptPreview
  }[document.type];

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
        <Dialog.Panel className="mx-auto max-w-4xl w-full bg-white rounded-lg shadow-xl">
          <div className="flex justify-between items-center p-4 border-b">
            <Dialog.Title className="text-lg font-semibold capitalize">
              {document.type} Preview
            </Dialog.Title>
            <div className="flex items-center gap-4">
              {allowEdit && (
                <Button 
                  onClick={handleEdit}
                  className="flex items-center gap-2"
                >
                  <Edit size={18} />
                  Edit
                </Button>
              )}
              <Button onClick={handleDownload}>
                Download PDF
              </Button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          
          <div className="max-h-[80vh] overflow-y-auto">
            <PreviewComponent document={document} items={items} />
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}