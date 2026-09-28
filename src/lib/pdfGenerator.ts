import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Order } from '@/types';

export async function generateInvoicePdf(order: Order, elementId: string): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    window.print();
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210; // A4 size width in mm
    const pageHeight = 297; // A4 size height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`Jesha_Studio_Invoice_${order.orderNumber}.pdf`);
  } catch (err) {
    console.error('Error generating PDF with jsPDF:', err);
    // Graceful fallback to browser print dialog
    window.print();
  }
}

export async function generateShippingLabelPdf(order: Order, elementId: string): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    window.print();
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [100, 150], // 4x6 inch standard shipping label
    });

    const labelWidth = 100;
    const labelHeight = (canvas.height * labelWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, labelWidth, labelHeight);
    pdf.save(`Jesha_Studio_ShippingLabel_${order.orderNumber}.pdf`);
  } catch (err) {
    console.error('Error generating Shipping Label PDF:', err);
    window.print();
  }
}
