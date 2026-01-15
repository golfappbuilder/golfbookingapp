import nodemailer from 'nodemailer';
import { BookingWithDetails } from '../models';

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private fromAddress: string = 'noreply@golfbooking.com';

  configure(config: EmailConfig): void {
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.auth,
    });
    this.fromAddress = config.from;
  }

  private formatDate(dateStr: string): string {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  private formatTime(timeStr: string): string {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }

  async sendBookingConfirmation(booking: BookingWithDetails): Promise<void> {
    const subject = `Booking Confirmed - ${booking.courseName} - ${booking.confirmationNumber}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2e7d32; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .details { background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
          .detail-label { font-weight: bold; color: #555; }
          .confirmation-number { font-size: 24px; font-weight: bold; color: #2e7d32; text-align: center; margin: 15px 0; }
          .total { font-size: 18px; font-weight: bold; color: #2e7d32; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Booking Confirmed!</h1>
          </div>
          <div class="content">
            <p>Dear ${booking.userFirstName},</p>
            <p>Your tee time has been successfully booked. Here are your booking details:</p>

            <div class="confirmation-number">
              Confirmation #: ${booking.confirmationNumber}
            </div>

            <div class="details">
              <div class="detail-row">
                <span class="detail-label">Course:</span>
                <span>${booking.courseName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Date:</span>
                <span>${this.formatDate(booking.date)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Tee Time:</span>
                <span>${this.formatTime(booking.teeTime)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Players:</span>
                <span>${booking.numberOfPlayers}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Golf Cart:</span>
                <span>${booking.includeCart ? 'Included' : 'Not Included'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label total">Total:</span>
                <span class="total">${this.formatCurrency(booking.totalPrice)}</span>
              </div>
            </div>

            ${booking.playerNames.length > 0 ? `
              <div class="details">
                <h3>Players:</h3>
                <ul>
                  ${booking.playerNames.map(name => `<li>${name}</li>`).join('')}
                </ul>
              </div>
            ` : ''}

            ${booking.notes ? `
              <div class="details">
                <h3>Notes:</h3>
                <p>${booking.notes}</p>
              </div>
            ` : ''}

            <p><strong>Important Reminders:</strong></p>
            <ul>
              <li>Please arrive at least 15 minutes before your tee time</li>
              <li>Proper golf attire is required</li>
              <li>Bring this confirmation number for check-in</li>
            </ul>

            <p>If you need to modify or cancel your booking, please contact us as soon as possible.</p>

            <p>See you on the course!</p>
          </div>
          <div class="footer">
            <p>This is an automated message from Golf Booking App.</p>
            <p>Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const textContent = `
Booking Confirmed!

Dear ${booking.userFirstName},

Your tee time has been successfully booked.

Confirmation #: ${booking.confirmationNumber}

Booking Details:
- Course: ${booking.courseName}
- Date: ${this.formatDate(booking.date)}
- Tee Time: ${this.formatTime(booking.teeTime)}
- Players: ${booking.numberOfPlayers}
- Golf Cart: ${booking.includeCart ? 'Included' : 'Not Included'}
- Total: ${this.formatCurrency(booking.totalPrice)}

${booking.playerNames.length > 0 ? `Players: ${booking.playerNames.join(', ')}` : ''}
${booking.notes ? `Notes: ${booking.notes}` : ''}

Important Reminders:
- Please arrive at least 15 minutes before your tee time
- Proper golf attire is required
- Bring this confirmation number for check-in

See you on the course!
    `;

    await this.sendEmail(booking.userEmail, subject, textContent, htmlContent);
  }

  async sendBookingUpdate(booking: BookingWithDetails): Promise<void> {
    const subject = `Booking Updated - ${booking.courseName} - ${booking.confirmationNumber}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1976d2; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .details { background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
          .detail-label { font-weight: bold; color: #555; }
          .confirmation-number { font-size: 24px; font-weight: bold; color: #1976d2; text-align: center; margin: 15px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Booking Updated</h1>
          </div>
          <div class="content">
            <p>Dear ${booking.userFirstName},</p>
            <p>Your booking has been updated. Here are your new booking details:</p>

            <div class="confirmation-number">
              Confirmation #: ${booking.confirmationNumber}
            </div>

            <div class="details">
              <div class="detail-row">
                <span class="detail-label">Course:</span>
                <span>${booking.courseName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Date:</span>
                <span>${this.formatDate(booking.date)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Tee Time:</span>
                <span>${this.formatTime(booking.teeTime)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Players:</span>
                <span>${booking.numberOfPlayers}</span>
              </div>
            </div>

            <p>If you did not request this change, please contact us immediately.</p>
          </div>
          <div class="footer">
            <p>This is an automated message from Golf Booking App.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const textContent = `
Booking Updated

Dear ${booking.userFirstName},

Your booking has been updated.

Confirmation #: ${booking.confirmationNumber}

Updated Details:
- Course: ${booking.courseName}
- Date: ${this.formatDate(booking.date)}
- Tee Time: ${this.formatTime(booking.teeTime)}
- Players: ${booking.numberOfPlayers}

If you did not request this change, please contact us immediately.
    `;

    await this.sendEmail(booking.userEmail, subject, textContent, htmlContent);
  }

  async sendBookingCancellation(booking: BookingWithDetails): Promise<void> {
    const subject = `Booking Cancelled - ${booking.courseName} - ${booking.confirmationNumber}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #c62828; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .details { background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
          .detail-label { font-weight: bold; color: #555; }
          .confirmation-number { font-size: 24px; font-weight: bold; color: #c62828; text-align: center; margin: 15px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Booking Cancelled</h1>
          </div>
          <div class="content">
            <p>Dear ${booking.userFirstName},</p>
            <p>Your booking has been cancelled as requested.</p>

            <div class="confirmation-number">
              Confirmation #: ${booking.confirmationNumber}
            </div>

            <div class="details">
              <div class="detail-row">
                <span class="detail-label">Course:</span>
                <span>${booking.courseName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Original Date:</span>
                <span>${this.formatDate(booking.date)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Original Tee Time:</span>
                <span>${this.formatTime(booking.teeTime)}</span>
              </div>
            </div>

            <p>We hope to see you again soon. Book your next tee time with us!</p>
          </div>
          <div class="footer">
            <p>This is an automated message from Golf Booking App.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const textContent = `
Booking Cancelled

Dear ${booking.userFirstName},

Your booking has been cancelled as requested.

Confirmation #: ${booking.confirmationNumber}

Cancelled Booking:
- Course: ${booking.courseName}
- Original Date: ${this.formatDate(booking.date)}
- Original Tee Time: ${this.formatTime(booking.teeTime)}

We hope to see you again soon. Book your next tee time with us!
    `;

    await this.sendEmail(booking.userEmail, subject, textContent, htmlContent);
  }

  async sendBookingReminder(booking: BookingWithDetails): Promise<void> {
    const subject = `Reminder: Tee Time Tomorrow at ${booking.courseName}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #ff9800; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .details { background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
          .detail-label { font-weight: bold; color: #555; }
          .highlight { font-size: 20px; font-weight: bold; color: #ff9800; text-align: center; margin: 15px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Tee Time Reminder</h1>
          </div>
          <div class="content">
            <p>Dear ${booking.userFirstName},</p>
            <p>This is a friendly reminder that you have a tee time scheduled for <strong>tomorrow</strong>!</p>

            <div class="highlight">
              Tomorrow at ${this.formatTime(booking.teeTime)}
            </div>

            <div class="details">
              <div class="detail-row">
                <span class="detail-label">Course:</span>
                <span>${booking.courseName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Date:</span>
                <span>${this.formatDate(booking.date)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Tee Time:</span>
                <span>${this.formatTime(booking.teeTime)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Players:</span>
                <span>${booking.numberOfPlayers}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Confirmation #:</span>
                <span>${booking.confirmationNumber}</span>
              </div>
            </div>

            <p><strong>Don't Forget:</strong></p>
            <ul>
              <li>Arrive at least 15 minutes early to check in</li>
              <li>Bring your confirmation number</li>
              <li>Check the weather forecast and dress appropriately</li>
              <li>Proper golf attire is required</li>
            </ul>

            <p>Have a great round!</p>
          </div>
          <div class="footer">
            <p>This is an automated reminder from Golf Booking App.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const textContent = `
Tee Time Reminder

Dear ${booking.userFirstName},

This is a friendly reminder that you have a tee time scheduled for tomorrow!

Booking Details:
- Course: ${booking.courseName}
- Date: ${this.formatDate(booking.date)}
- Tee Time: ${this.formatTime(booking.teeTime)}
- Players: ${booking.numberOfPlayers}
- Confirmation #: ${booking.confirmationNumber}

Don't Forget:
- Arrive at least 15 minutes early to check in
- Bring your confirmation number
- Check the weather forecast and dress appropriately
- Proper golf attire is required

Have a great round!
    `;

    await this.sendEmail(booking.userEmail, subject, textContent, htmlContent);
  }

  private async sendEmail(
    to: string,
    subject: string,
    text: string,
    html: string
  ): Promise<void> {
    if (!this.transporter) {
      console.log(`[Email Service] Email not configured. Would send to: ${to}`);
      console.log(`[Email Service] Subject: ${subject}`);
      console.log(`[Email Service] Body preview: ${text.substring(0, 200)}...`);
      return;
    }

    await this.transporter.sendMail({
      from: this.fromAddress,
      to,
      subject,
      text,
      html,
    });

    console.log(`[Email Service] Sent email to ${to}: ${subject}`);
  }
}

export const emailService = new EmailService();
