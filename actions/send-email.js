import { Resend } from "resend";

export async function sendEmail({ to, subject, react }) {
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set");
    return { success: false, error: "API key missing" };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    console.log("Sending email with:", { to, subject, react });
    const data = await resend.emails.send({
      from: 'Tracknomy <onboarding@resend.dev>',
      to,
      subject,
      react,
    });

    console.log("Email sent successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email:", error.response?.data || error.message);
    return { success: false, error };
  }
}
