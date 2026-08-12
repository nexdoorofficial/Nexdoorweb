// Vercel Serverless API Route for sending Resend email notifications securely
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY;
  if (!apiKey) {
    return res.status(200).json({
      success: false,
      message: 'RESEND_API_KEY is not configured in Vercel Environment Variables.'
    });
  }

  const { booking } = req.body;
  if (!booking) {
    return res.status(400).json({ error: 'Booking payload missing' });
  }

  try {
    const ADMIN_NOTIFICATION_EMAIL = 'nexdoorofficial@gmail.com';
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
          .header { background: linear-gradient(135deg, #1C2677 0%, #29C3BE 100%); color: #ffffff; padding: 28px 24px; text-align: center; }
          .header h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 0.5px; }
          .header p { margin: 6px 0 0 0; font-size: 14px; opacity: 0.9; }
          .content { padding: 24px; }
          .ref-badge { display: inline-block; background: #ccfbf1; color: #0f766e; font-weight: 800; font-size: 14px; padding: 6px 14px; border-radius: 20px; margin-bottom: 20px; }
          .section { margin-bottom: 22px; padding: 16px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; }
          .section-title { font-size: 13px; font-weight: 800; color: #1C2677; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
          .row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
          .label { color: #64748b; font-weight: 600; }
          .value { font-weight: 700; color: #0f172a; text-align: right; }
          .spec-pill { background: #ffffff; border: 1px solid #cbd5e1; padding: 6px 10px; border-radius: 8px; font-size: 13px; font-weight: 700; color: #1C2677; margin-top: 4px; }
          .total-box { background: #1C2677; color: #ffffff; padding: 18px; border-radius: 12px; margin-top: 20px; }
          .total-row { display: flex; justify-content: space-between; align-items: center; }
          .total-price { font-size: 24px; font-weight: 900; color: #29C3BE; }
          .footer { background: #f1f5f9; text-align: center; padding: 16px; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>NEXDOOR — New Order Notification</h1>
            <p>A new customer booking has been confirmed on the website.</p>
          </div>
          <div class="content">
            <div style="text-align: center;">
              <span class="ref-badge">Booking Ref: ${booking.referenceId || 'NEX-BOOKING'}</span>
            </div>

            <!-- Customer Details -->
            <div class="section">
              <div class="section-title">👤 Customer Information</div>
              <div class="row"><span class="label">Name:</span> <span class="value">${booking.customerName || 'Valued Customer'}</span></div>
              <div class="row"><span class="label">Phone:</span> <span class="value"><a href="tel:${booking.customerPhone}" style="color: #2563eb; text-decoration: none;">${booking.customerPhone}</a></span></div>
              ${booking.customerEmail ? `<div class="row"><span class="label">Email:</span> <span class="value">${booking.customerEmail}</span></div>` : ''}
              <div class="row"><span class="label">Area & Location:</span> <span class="value">${booking.area || 'Kakkanad'} (${booking.pincode || '682030'})</span></div>
              <div class="row"><span class="label">Street Address:</span> <span class="value">${booking.address || 'Doorstep Address'}</span></div>
            </div>

            <!-- Service Details -->
            <div class="section">
              <div class="section-title">🧹 Service & Specifications</div>
              <div class="row"><span class="label">Service Name:</span> <span class="value">${booking.serviceName || 'Cleaning Service'}</span></div>
              <div class="row"><span class="label">Scheduled Time:</span> <span class="value">${booking.scheduledDate} at ${booking.scheduledTime}</span></div>
              <div style="margin-top: 10px;">
                <span class="label" style="display: block; margin-bottom: 6px;">Order Options & Specifications:</span>
                <div class="spec-pill">
                  ${(booking.categoryOrPackage || '').replace(/\|/g, '<br/>• ')}
                </div>
              </div>
            </div>

            ${booking.notes ? `
            <div class="section">
              <div class="section-title">📝 Special Instructions & Coupon</div>
              <div style="font-size: 13px; color: #334155; line-height: 1.5;">${booking.notes}</div>
            </div>
            ` : ''}

            <!-- Financial Summary -->
            <div class="total-box">
              <div class="total-row">
                <div>
                  <span style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.8; display: block;">Net Invoice Total</span>
                  <span style="font-size: 13px; opacity: 0.9;">Includes Deposit Paid</span>
                </div>
                <span class="total-price">₹${booking.estimatedTotal || 0}</span>
              </div>
              <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.15); display: flex; justify-content: space-between; font-size: 13px; opacity: 0.9;">
                <span>Deposit Paid Online:</span>
                <strong style="color: #29C3BE;">₹${booking.depositPaid || 199}</strong>
              </div>
            </div>
          </div>
          <div class="footer">
            NEXDOOR Admin Order Notification System • Kakkanad, Kochi<br/>
            Log in to the Admin Dashboard to manage status and assign staff.
          </div>
        </div>
      </body>
      </html>
    `;

    const textContent = `
NEXDOOR - NEW ORDER CONFIRMED
---------------------------------
Booking Ref: ${booking.referenceId || 'NEX-BOOKING'}
Customer Name: ${booking.customerName || 'Valued Customer'}
Phone Number: ${booking.customerPhone}
Email: ${booking.customerEmail || 'N/A'}
Service Name: ${booking.serviceName || 'Cleaning Service'}
Schedule: ${booking.scheduledDate} at ${booking.scheduledTime}
Location: ${booking.address || 'Doorstep Address'}, ${booking.area || 'Kakkanad'} (${booking.pincode || '682030'})
Specifications: ${booking.categoryOrPackage || 'Standard'}
Estimated Total: ₹${booking.estimatedTotal || 0}
Deposit Paid: ₹${booking.depositPaid || 199}
Notes: ${booking.notes || 'None'}
`.trim();

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: 'NEXDOOR Orders <onboarding@resend.dev>',
        to: [ADMIN_NOTIFICATION_EMAIL],
        subject: `🚨 New Order Received! [${booking.referenceId}] - ${booking.serviceName} (${booking.area})`,
        html: htmlContent,
        text: textContent
      })
    });

    const data = await response.json();
    return res.status(200).json({ success: response.ok, data });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
