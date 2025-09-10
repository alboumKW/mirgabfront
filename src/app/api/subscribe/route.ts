import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export const runtime = 'edge';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Add contact to Resend audience (if you have an audience set up)
    if (process.env.AUDIENCE_ID) {
      try {
        await resend.contacts.create({
          email: email,
          audienceId: process.env.AUDIENCE_ID,
        });
      } catch (audienceError) {
        console.log('Audience add failed, continuing with welcome email:', audienceError);
      }
    }

    // Send welcome email
    const welcomeEmail = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
      to: [email],
      subject: 'Welcome to Mirgab Studio',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Mirgab Studio</title>
        </head>
        <body style="font-family: Inter, system-ui, -apple-system, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 10px; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 2.5em; font-weight: bold;">✨ Welcome to Mirgab Studio!</h1>
            <p style="color: rgba(255,255,255,0.9); font-size: 1.2em; margin: 10px 0 0 0;">Something amazing is brewing...</p>
          </div>
          
          <div style="padding: 0 20px;">
            <h2 style="color: #4a5568; font-size: 1.5em;">Thank you for joining our journey! 🚀</h2>
            
            <p>We're thrilled to have you on board as we prepare to launch something incredible. Here's what you can expect:</p>
            
            <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <h3 style="color: #2d3748; margin-top: 0;">🎯 What's Coming:</h3>
              <ul style="color: #4a5568; padding-left: 20px;">
                <li>Exclusive early access to our platform</li>
                <li>Behind-the-scenes updates</li>
                <li>Special launch offers</li>
                <li>Creative tools and resources</li>
              </ul>
            </div>
            
            <p>We'll keep you updated with our progress and notify you the moment we're ready to launch!</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="background: linear-gradient(45deg, #667eea, #764ba2); color: white; padding: 15px 30px; border-radius: 25px; display: inline-block; font-weight: bold;">
                🎨 Stay Creative!
              </div>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
            
            <div style="text-align: center; color: #718096; font-size: 0.9em;">
              <p>Mirgab Studio Team<br>
              Building the future of creativity</p>
              
              <div style="margin-top: 20px;">
                <span style="background: #f1f1f1; padding: 8px 12px; border-radius: 20px; margin: 0 5px; display: inline-block;">🎨</span>
                <span style="background: #f1f1f1; padding: 8px 12px; border-radius: 20px; margin: 0 5px; display: inline-block;">✨</span>
                <span style="background: #f1f1f1; padding: 8px 12px; border-radius: 20px; margin: 0 5px; display: inline-block;">🚀</span>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Welcome to Mirgab Studio! ✨

Thank you for joining our journey! We're thrilled to have you on board as we prepare to launch something incredible.

What's Coming:
• Exclusive early access to our platform
• Behind-the-scenes updates  
• Special launch offers
• Creative tools and resources

We'll keep you updated with our progress and notify you the moment we're ready to launch!

Stay Creative!
The Mirgab Studio Team
      `,
    });

    console.log('Welcome email sent:', welcomeEmail);

    return NextResponse.json(
      { 
        message: 'Successfully subscribed! Check your email for a welcome message.',
        success: true 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Subscription error:', error);
    
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    );
  }
}
