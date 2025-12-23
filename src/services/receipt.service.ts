/**
 * Receipt Service - Story 3.7 Task 4
 * 
 * PDF receipt generation for farmer transaction history.
 * Generates branded receipts with QR code for verification.
 * 
 * AC5: Receipt Generation
 * - CropFresh header and logo
 * - Transaction ID, farmer name (masked), crop details
 * - Amount breakdown, payment confirmation
 * - QR code linking to digital verification
 * - Receipts available for 90 days only
 */

import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { TransactionDetails, PaymentBreakdown } from '../types/order-status.types';
import { logger } from '../utils/logger';

export interface ReceiptData {
    transactionId: string;
    farmerName: string;        // Will be partially masked
    farmerId: number;
    transaction: TransactionDetails;
    generatedAt: Date;
}

export interface ReceiptOptions {
    includeQrCode?: boolean;
    verificationBaseUrl?: string;
}

const DEFAULT_OPTIONS: ReceiptOptions = {
    includeQrCode: true,
    verificationBaseUrl: 'https://cropfresh.in/verify'
};

export class ReceiptService {
    private options: ReceiptOptions;

    constructor(options: ReceiptOptions = {}) {
        this.options = { ...DEFAULT_OPTIONS, ...options };
    }

    /**
     * Generate PDF receipt as Buffer.
     * AC5: Full receipt with branding, QR code, all details.
     */
    async generateReceipt(data: ReceiptData): Promise<Buffer> {
        // Check 90-day availability
        if (!data.transaction.canDownloadReceipt) {
            throw new Error('Receipt no longer available (beyond 90 days)');
        }

        const doc = new PDFDocument({
            size: 'A4',
            margin: 50,
            info: {
                Title: `CropFresh Receipt - ${data.transactionId}`,
                Author: 'CropFresh',
                Subject: 'Transaction Receipt'
            }
        });

        const chunks: Buffer[] = [];

        return new Promise<Buffer>(async (resolve, reject) => {
            doc.on('data', (chunk: Buffer) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            try {
                // Header
                this.addHeader(doc, data);

                // Transaction Info
                this.addTransactionInfo(doc, data);

                // Order Details
                this.addOrderDetails(doc, data.transaction);

                // Payment Breakdown
                this.addPaymentBreakdown(doc, data.transaction.payment);

                // QR Code
                if (this.options.includeQrCode) {
                    await this.addQrCode(doc, data);
                }

                // Footer
                this.addFooter(doc, data);

                doc.end();

                logger.info({
                    transactionId: data.transactionId,
                    farmerId: data.farmerId
                }, 'Receipt generated successfully');
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Add CropFresh header with logo placeholder.
     */
    private addHeader(doc: PDFKit.PDFDocument, data: ReceiptData): void {
        // Logo placeholder (green box with text)
        doc.rect(50, 50, 60, 40)
            .fillColor('#2E7D32')
            .fill();

        doc.fillColor('#FFFFFF')
            .fontSize(14)
            .font('Helvetica-Bold')
            .text('🌾', 65, 60);

        // Company name
        doc.fillColor('#2E7D32')
            .fontSize(24)
            .font('Helvetica-Bold')
            .text('CropFresh', 120, 55);

        doc.fillColor('#666666')
            .fontSize(10)
            .font('Helvetica')
            .text('Farm-to-Market Platform', 120, 80);

        // Receipt title
        doc.fillColor('#333333')
            .fontSize(18)
            .font('Helvetica-Bold')
            .text('TRANSACTION RECEIPT', 50, 120, { align: 'center' });

        // Divider
        doc.moveTo(50, 150)
            .lineTo(545, 150)
            .strokeColor('#CCCCCC')
            .stroke();
    }

    /**
     * Add transaction and farmer info.
     */
    private addTransactionInfo(doc: PDFKit.PDFDocument, data: ReceiptData): void {
        const startY = 170;

        doc.font('Helvetica-Bold').fontSize(11).fillColor('#333333');

        // Left column
        doc.text('Transaction ID:', 50, startY);
        doc.font('Helvetica').text(data.transactionId, 150, startY);

        doc.font('Helvetica-Bold').text('Date:', 50, startY + 20);
        doc.font('Helvetica').text(
            this.formatDate(data.transaction.createdAt),
            150,
            startY + 20
        );

        doc.font('Helvetica-Bold').text('Farmer:', 50, startY + 40);
        doc.font('Helvetica').text(
            this.maskName(data.farmerName),
            150,
            startY + 40
        );

        // Right column - Receipt info
        doc.font('Helvetica-Bold').text('Receipt Generated:', 350, startY);
        doc.font('Helvetica').text(
            this.formatDate(data.generatedAt),
            450,
            startY
        );

        doc.font('Helvetica-Bold').text('Status:', 350, startY + 20);
        doc.fillColor('#2E7D32')
            .font('Helvetica-Bold')
            .text('✓ PAID', 450, startY + 20);

        // Reset color
        doc.fillColor('#333333');
    }

    /**
     * Add order/crop details.
     */
    private addOrderDetails(doc: PDFKit.PDFDocument, tx: TransactionDetails): void {
        const startY = 260;

        // Section title
        doc.font('Helvetica-Bold')
            .fontSize(12)
            .fillColor('#2E7D32')
            .text('ORDER DETAILS', 50, startY);

        // Divider
        doc.moveTo(50, startY + 15)
            .lineTo(545, startY + 15)
            .strokeColor('#CCCCCC')
            .stroke();

        const detailsY = startY + 30;
        doc.font('Helvetica').fontSize(10).fillColor('#333333');

        // Crop info
        doc.font('Helvetica-Bold').text('Crop:', 50, detailsY);
        doc.font('Helvetica').text(
            `${tx.listing.cropEmoji} ${tx.listing.cropType}`,
            150,
            detailsY
        );

        doc.font('Helvetica-Bold').text('Quantity:', 50, detailsY + 18);
        doc.font('Helvetica').text(`${tx.listing.quantityKg} kg`, 150, detailsY + 18);

        doc.font('Helvetica-Bold').text('Quality Grade:', 50, detailsY + 36);
        doc.font('Helvetica').text('A', 150, detailsY + 36);

        // Buyer info (masked)
        doc.font('Helvetica-Bold').text('Buyer Type:', 300, detailsY);
        doc.font('Helvetica').text(tx.buyer.businessType, 400, detailsY);

        doc.font('Helvetica-Bold').text('Location:', 300, detailsY + 18);
        doc.font('Helvetica').text(tx.buyer.city, 400, detailsY + 18);

        // Drop point
        if (tx.dropPoint) {
            doc.font('Helvetica-Bold').text('Drop Point:', 300, detailsY + 36);
            doc.font('Helvetica').text(tx.dropPoint.name, 400, detailsY + 36);
        }
    }

    /**
     * Add payment breakdown table.
     */
    private addPaymentBreakdown(doc: PDFKit.PDFDocument, payment: PaymentBreakdown): void {
        const startY = 380;

        // Section title
        doc.font('Helvetica-Bold')
            .fontSize(12)
            .fillColor('#2E7D32')
            .text('PAYMENT BREAKDOWN', 50, startY);

        // Table
        const tableY = startY + 25;
        const colX = [50, 350, 450];

        // Header row
        doc.rect(50, tableY, 495, 25).fillColor('#F5F5F5').fill();
        doc.fillColor('#333333').font('Helvetica-Bold').fontSize(10);
        doc.text('Description', colX[0] + 10, tableY + 7);
        doc.text('Amount (₹)', colX[2], tableY + 7, { align: 'right', width: 85 });

        // Data rows
        const rows = [
            ['Base Amount (Price × Quantity)', this.formatCurrency(payment.baseAmount)],
            ['Quality Bonus', this.formatCurrency(payment.qualityBonus)],
            ['Platform Fee (Farmer)', '₹0.00'],
        ];

        doc.font('Helvetica').fontSize(10);
        rows.forEach((row, i) => {
            const y = tableY + 30 + (i * 22);
            doc.fillColor('#333333').text(row[0], colX[0] + 10, y);
            doc.text(row[1], colX[2], y, { align: 'right', width: 85 });
        });

        // Total row
        const totalY = tableY + 30 + (rows.length * 22);
        doc.rect(50, totalY, 495, 28).fillColor('#2E7D32').fill();
        doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(12);
        doc.text('NET AMOUNT RECEIVED', colX[0] + 10, totalY + 8);
        doc.text(this.formatCurrency(payment.netAmount), colX[2], totalY + 8, { align: 'right', width: 85 });

        // Payment details below
        doc.fillColor('#666666').font('Helvetica').fontSize(9);
        const infoY = totalY + 40;
        doc.text(`Payment Method: UPI`, 50, infoY);
        doc.text(`UPI Transaction ID: ${payment.upiTxnId}`, 50, infoY + 14);
        if (payment.paidAt) {
            doc.text(`Payment Date: ${this.formatDate(payment.paidAt)}`, 50, infoY + 28);
        }
    }

    /**
     * Add QR code for verification.
     */
    private async addQrCode(doc: PDFKit.PDFDocument, data: ReceiptData): Promise<void> {
        const verifyUrl = `${this.options.verificationBaseUrl}/${data.transactionId}`;

        try {
            const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
                width: 80,
                margin: 1,
                color: {
                    dark: '#2E7D32',
                    light: '#FFFFFF'
                }
            });

            // Convert data URL to buffer
            const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, '');
            const qrBuffer = Buffer.from(base64Data, 'base64');

            // Position QR code
            doc.image(qrBuffer, 460, 530, { width: 80 });

            doc.fillColor('#666666')
                .font('Helvetica')
                .fontSize(8)
                .text('Scan to verify', 460, 615, { width: 80, align: 'center' });
        } catch (error) {
            logger.warn({ error }, 'Failed to generate QR code');
        }
    }

    /**
     * Add footer with disclaimer.
     */
    private addFooter(doc: PDFKit.PDFDocument, data: ReceiptData): void {
        const footerY = 700;

        // Divider
        doc.moveTo(50, footerY)
            .lineTo(545, footerY)
            .strokeColor('#CCCCCC')
            .stroke();

        doc.fillColor('#999999')
            .font('Helvetica')
            .fontSize(8)
            .text(
                'This is a computer-generated receipt and does not require a signature.',
                50,
                footerY + 15,
                { align: 'center' }
            );

        doc.text(
            'For queries, contact support@cropfresh.in | Toll-free: 1800-XXX-XXXX',
            50,
            footerY + 28,
            { align: 'center' }
        );

        doc.text(
            `© ${new Date().getFullYear()} CropFresh Technologies Pvt. Ltd. All rights reserved.`,
            50,
            footerY + 41,
            { align: 'center' }
        );
    }

    // ============================================
    // HELPER METHODS
    // ============================================

    private formatDate(date: Date): string {
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    private formatCurrency(amount: number): string {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount);
    }

    private maskName(name: string): string {
        if (name.length <= 4) return name;
        const firstTwo = name.substring(0, 2);
        const lastTwo = name.substring(name.length - 2);
        return `${firstTwo}${'*'.repeat(name.length - 4)}${lastTwo}`;
    }
}
