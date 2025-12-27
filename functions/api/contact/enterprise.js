// HTML escape function to prevent XSS
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const { name, email, description, source } = body;

    // Validate required fields
    if (!name || !email || !description) {
      return new Response(
        JSON.stringify({ error: 'All fields are required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Input length validation (prevent abuse)
    if (name.length > 200 || email.length > 254 || description.length > 5000) {
      return new Response(
        JSON.stringify({ error: 'Input too long' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Check if Resend API key is configured
    if (!env.RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Sanitize inputs for HTML email
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSource = escapeHtml(source);
    const safeDescription = escapeHtml(description);

    // Prepare email content (using sanitized values in HTML)
    const emailSubject = `CalendarMap Enterprise Inquiry from ${safeName}`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New Enterprise Contact Form Submission</h2>

        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 10px 0;"><strong>Name:</strong> ${safeName}</p>
          <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
          <p style="margin: 10px 0;"><strong>Source:</strong> ${safeSource || 'Not specified'}</p>
        </div>

        <div style="margin: 20px 0;">
          <h3 style="color: #374151;">How they use calendars:</h3>
          <p style="white-space: pre-wrap; background-color: #f9fafb; padding: 15px; border-left: 4px solid #2563eb; border-radius: 4px;">
            ${safeDescription}
          </p>
        </div>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

        <p style="color: #6b7280; font-size: 12px;">
          Submitted from CalendarMap.app at ${new Date().toISOString()}
        </p>
      </div>
    `;

    // Plain text version (no HTML escaping needed)
    const emailText = `
New Enterprise Contact Form Submission

Name: ${name}
Email: ${email}
Source: ${source || 'Not specified'}

How they use calendars:
${description}

---
Submitted from CalendarMap.app at ${new Date().toISOString()}
    `;

    // Send email via Resend API
    const emailApiResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'CalendarMap <hello+calendarmap@codebru.com>',
        to: ['support@codebru.com'],
        reply_to: email,
        subject: emailSubject,
        html: emailHtml,
        text: emailText
      }),
    });

    if (!emailApiResponse.ok) {
      return new Response(
        JSON.stringify({ error: 'Failed to send message' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Form submitted successfully'
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to process form submission' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
