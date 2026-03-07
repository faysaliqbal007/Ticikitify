import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import type { Ticket, Event, TicketTier } from '@/types';

export async function generateTicketPDF(ticket: Ticket): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [210, 297] // A4 size
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let yPos = margin;

  // Title
  doc.setFontSize(24);
  doc.setTextColor(139, 92, 246); // Purple color
  doc.setFont('helvetica', 'bold');
  doc.text('TICIKIFY', pageWidth / 2, yPos, { align: 'center' });
  yPos += 8;

  // Subtitle
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.text('Event Ticket', pageWidth / 2, yPos, { align: 'center' });
  yPos += 12;

  // Event Title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(ticket.event.title, pageWidth / 2, yPos, { 
    align: 'center',
    maxWidth: pageWidth - (margin * 2)
  });
  yPos += 10;

  // Event Details Box
  doc.setDrawColor(200, 200, 200);
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(margin, yPos, pageWidth - (margin * 2), 40, 3, 3, 'FD');
  yPos += 8;

  // Date
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Date:', margin + 5, yPos);
  doc.setFont('helvetica', 'normal');
  const eventDate = new Date(ticket.event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  doc.text(eventDate, margin + 20, yPos);
  yPos += 6;

  // Time
  doc.setFont('helvetica', 'bold');
  doc.text('Time:', margin + 5, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(ticket.event.time, margin + 20, yPos);
  yPos += 6;

  // Venue
  doc.setFont('helvetica', 'bold');
  doc.text('Venue:', margin + 5, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(ticket.event.venue, margin + 20, yPos);
  yPos += 6;

  // City
  doc.setFont('helvetica', 'bold');
  doc.text('City:', margin + 5, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(ticket.event.city, margin + 20, yPos);
  yPos += 10;

  // Ticket Details Box
  doc.setDrawColor(139, 92, 246);
  doc.setFillColor(250, 245, 255);
  doc.roundedRect(margin, yPos, pageWidth - (margin * 2), 30, 3, 3, 'FD');
  yPos += 8;

  // Ticket Tier
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(139, 92, 246);
  doc.text('Ticket Type:', margin + 5, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(ticket.tier.name, margin + 35, yPos);
  yPos += 7;

  // Price
  doc.setFont('helvetica', 'bold');
  doc.text('Price:', margin + 5, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(`৳${ticket.tier.price}`, margin + 25, yPos);
  
  // Seat Number (if available)
  if (ticket.seatNumber) {
    doc.setFont('helvetica', 'bold');
    doc.text('Seat:', pageWidth - margin - 40, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(ticket.seatNumber, pageWidth - margin - 25, yPos);
  }
  yPos += 7;

  // Ticket ID
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`Ticket ID: ${ticket.id}`, margin + 5, yPos);
  yPos += 15;

  // QR Code
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(ticket.qrCode, {
      width: 80,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    const qrSize = 50;
    const qrX = (pageWidth - qrSize) / 2;
    doc.addImage(qrCodeDataUrl, 'PNG', qrX, yPos, qrSize, qrSize);
    yPos += qrSize + 5;

    // QR Code Label
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('QR Code', pageWidth / 2, yPos, { align: 'center' });
    yPos += 5;

    // QR Code Value
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(ticket.qrCode, pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;
  } catch (error) {
    console.error('Failed to generate QR code:', error);
    doc.setFontSize(10);
    doc.setTextColor(200, 0, 0);
    doc.text('QR Code: ' + ticket.qrCode, pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;
  }

  // Footer
  yPos = pageHeight - margin - 15;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 5;

  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.text('This ticket is valid only for the event date and time specified above.', pageWidth / 2, yPos, { align: 'center' });
  yPos += 4;
  doc.text('Please arrive on time. Tickets are non-refundable.', pageWidth / 2, yPos, { align: 'center' });
  yPos += 4;
  doc.text('For support, contact: support@ticikify.com', pageWidth / 2, yPos, { align: 'center' });

  // Download PDF
  const fileName = `Ticket-${ticket.event.title.substring(0, 20).replace(/[^a-z0-9]/gi, '_')}-${ticket.id.substring(7, 15)}.pdf`;
  doc.save(fileName);
}

export async function generateAllTicketsPDF(tickets: Ticket[]): Promise<void> {
  if (tickets.length === 0) return;

  // Generate PDF for each ticket
  for (let i = 0; i < tickets.length; i++) {
    await generateTicketPDF(tickets[i]);
    // Small delay between downloads to prevent browser blocking
    if (i < tickets.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
}

// Generate PDFs from event and ticket selections (for payment success page)
export async function generateTicketsFromPurchase(
  event: Event,
  ticketSelections: { [tierId: string]: number },
  purchaseDate: string = new Date().toISOString()
): Promise<void> {
  const ticketsToGenerate: Array<{
    event: Event;
    tier: TicketTier;
    qrCode: string;
    ticketId: string;
    seatNumber?: string;
  }> = [];

  const baseTimestamp = Date.now();
  let ticketIndex = 0;

  event.ticketTiers.forEach((tier) => {
    const quantity = ticketSelections[tier.id] || 0;
    if (quantity > 0) {
      for (let i = 0; i < quantity; i++) {
        const uniqueId = `${baseTimestamp}-${ticketIndex}-${Math.random().toString(36).substr(2, 9)}`;
        const ticketId = `ticket-${uniqueId}`;
        const eventPrefix = event.id.length >= 4 ? event.id.substring(0, 4).toUpperCase() : event.id.toUpperCase().padEnd(4, 'X');
        const tierPrefix = tier.name.substring(0, 3).toUpperCase().padEnd(3, 'X');
        const qrCode = `TICIKIFY-${eventPrefix}-${uniqueId.substring(7, 15).toUpperCase()}-${tierPrefix}`;

        ticketsToGenerate.push({
          event,
          tier,
          qrCode,
          ticketId,
          seatNumber: event.isSeatBased && event.seats 
            ? event.seats[ticketIndex]?.number || undefined 
            : undefined,
        });
        ticketIndex++;
      }
    }
  });

  // Generate PDF for each ticket
  for (let i = 0; i < ticketsToGenerate.length; i++) {
    const ticketData = ticketsToGenerate[i];
    const ticket: Ticket = {
      id: ticketData.ticketId,
      eventId: event.id,
      event: ticketData.event,
      tier: ticketData.tier,
      qrCode: ticketData.qrCode,
      status: 'valid',
      seatNumber: ticketData.seatNumber,
      purchaseDate: purchaseDate,
    };
    await generateTicketPDF(ticket);
    // Small delay between downloads to prevent browser blocking
    if (i < ticketsToGenerate.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
}
