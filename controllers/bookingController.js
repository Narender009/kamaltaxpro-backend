const Booking = require('../models/Booking');
const { sendMail } = require('../utils/sendBookingEmail');

exports.createBooking = async (req, res) => {
  try {
    const { name, email, phone, service, date, time, message } = req.body;

    if (!name || !email || !phone || !service || !date || !time) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    const booking = new Booking({ name, email, phone, service, date, time, message });
    await booking.save();

    const bookingDetailsHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background: linear-gradient(135deg, #7c3aed 0%, #c2410c 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Booking Confirmation</h1>
        <p style="color: #e5e7eb; margin: 10px 0 0 0;">Your consultation has been scheduled!</p>
      </div>
      
      <div style="background: white; padding: 30px; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #374151; margin-top: 0;">Hello ${booking.name},</h2>
        <p style="color: #6b7280; line-height: 1.6;">Thank you for scheduling a consultation with us. We're excited to help you with your business needs!</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Booking Details:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #6b7280;"><strong>BookingID:</strong></td><td style="padding: 8px 0; color: #374151;">${booking.id}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;"><strong>Service:</strong></td><td style="padding: 8px 0; color: #374151;">${booking.service}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;"><strong>Date:</strong></td><td style="padding: 8px 0; color: #374151;">${new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;"><strong>Time:</strong></td><td style="padding: 8px 0; color: #374151;">${booking.time}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;"><strong>Status:</strong></td><td style="padding: 8px 0; color: #059669;">Confirmed</td></tr>
          </table>
        </div>
        
        <h3 style="color: #374151;">What happens next?</h3>
        <ul style="color: #6b7280; line-height: 1.6;">
          <li>We'll call you at <strong>${booking.phone}</strong> at the scheduled time</li>
          <li>The consultation will last approximately 30 minutes</li>
          <li>Please have any relevant documents ready</li>
          <li>We'll discuss your requirements and provide recommendations</li>
        </ul>
        
        <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
          <p style="margin: 0; color: #1e40af;"><strong>Need to reschedule?</strong> Contact us at least 24 hours in advance.</p>
        </div>
      </div>
      
      <div style="background: white; padding: 20px; border-radius: 10px; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h3 style="color: #374151; margin-top: 0;">Contact Information</h3>
        <p style="color: #6b7280; margin: 5px 0;">📞 +91 9990778501</p>
        <p style="color: #6b7280; margin: 5px 0;">📧 kamalray.1992@gmail.com</p>
      </div>
      
      <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 20px;">
        This is an automated message. Please do not reply to this email.
      </p>
    </div>
    `;

    // Send email to user
    await sendMail({
      to: email,
      subject: 'Booking Confirmation - Kamal Legal FinTax',
      html: bookingDetailsHtml
    });

    // Send email to admin
    await sendMail({
      to: process.env.ADMIN_EMAIL,
      subject: `New Booking from ${name}`,
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #374151;">New Booking Request</h2>
      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
        <h3 style="color: #374151; margin-top: 0;">Client Details:</h3>
        <p><strong>Name:</strong> ${booking.name}</p>
        <p><strong>Email:</strong> ${booking.email}</p>
        <p><strong>Phone:</strong> ${booking.phone}</p>
        <p><strong>Service:</strong> ${booking.service}</p>
        <p><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <p><strong>Time:</strong> ${booking.time}</p>
        <p><strong>Booking ID:</strong> ${booking.id}</p>
        ${booking.message ? `<p><strong>Message:</strong> ${booking.message}</p>` : ''}
        <p><strong>Booked At:</strong> ${booking.createdAt}</p>
      </div>
    </div>
      `
    });

    res.status(201).json({ message: 'Booking created and emails sent successfully', booking });
  } catch (err) {
    console.error('Booking Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
