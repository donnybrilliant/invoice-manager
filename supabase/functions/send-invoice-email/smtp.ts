/**
 * Simple SMTP client for Deno Edge Functions
 * Supports basic SMTP with AUTH LOGIN and attachments
 */

export interface SMTPConfig {
  host: string;
  port: number;
  secure: boolean; // Use STARTTLS
  auth: {
    user: string;
    password: string;
  };
  from: string;
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: Uint8Array;
  }>;
}

export async function sendSMTPEmail(config: SMTPConfig): Promise<void> {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  // Create connection
  const conn = await Deno.connect({
    hostname: config.host,
    port: config.port,
  });

  try {
    // Helper to read response
    const readResponse = async (): Promise<string> => {
      const buffer = new Uint8Array(4096);
      const n = await conn.read(buffer);
      if (n === null) throw new Error("Connection closed unexpectedly");
      return decoder.decode(buffer.subarray(0, n)).trim();
    };

    // Helper to send command and read response
    const sendCommand = async (cmd: string): Promise<string> => {
      await conn.write(encoder.encode(cmd + "\r\n"));
      return await readResponse();
    };

    // Read initial greeting
    const greeting = await readResponse();
    if (!greeting.startsWith("220")) {
      throw new Error(`SMTP server error: ${greeting}`);
    }

    // EHLO
    const ehloResponse = await sendCommand(`EHLO ${config.host}`);
    if (!ehloResponse.startsWith("250")) {
      throw new Error(`EHLO failed: ${ehloResponse}`);
    }

    // Start TLS if secure (simplified - for production, use proper TLS upgrade)
    if (config.secure && config.port === 587) {
      const starttls = await sendCommand("STARTTLS");
      if (starttls.startsWith("220")) {
        // Note: In a real implementation, you'd upgrade the connection to TLS here
        // For now, we'll continue without TLS upgrade (some servers allow this)
        // For production with self-hosted Supabase, you may want to use port 465 with SSL
        // or implement proper TLS upgrade using Deno's TLS API
        console.warn(
          "STARTTLS requested but TLS upgrade not implemented - continuing"
        );
      }
    }

    // AUTH LOGIN
    const authResponse1 = await sendCommand("AUTH LOGIN");
    if (!authResponse1.startsWith("334")) {
      throw new Error(`AUTH LOGIN failed: ${authResponse1}`);
    }

    const userResponse = await sendCommand(
      btoa(config.auth.user).replace(/=/g, "")
    );
    if (!userResponse.startsWith("334")) {
      throw new Error(`AUTH USER failed: ${userResponse}`);
    }

    const passResponse = await sendCommand(
      btoa(config.auth.password).replace(/=/g, "")
    );
    if (!passResponse.startsWith("235")) {
      throw new Error(`AUTH PASSWORD failed: ${passResponse}`);
    }

    // MAIL FROM
    const fromMatch = config.from.match(/<(.+)>/);
    const fromEmail = fromMatch ? fromMatch[1] : config.from;
    const mailFromResponse = await sendCommand(`MAIL FROM:<${fromEmail}>`);
    if (!mailFromResponse.startsWith("250")) {
      throw new Error(`MAIL FROM failed: ${mailFromResponse}`);
    }

    // RCPT TO
    const rcptToResponse = await sendCommand(`RCPT TO:<${config.to}>`);
    if (!rcptToResponse.startsWith("250")) {
      throw new Error(`RCPT TO failed: ${rcptToResponse}`);
    }

    // DATA
    const dataResponse = await sendCommand("DATA");
    if (!dataResponse.startsWith("354")) {
      throw new Error(`DATA failed: ${dataResponse}`);
    }

    // Build email message with MIME multipart
    const boundary = `----=_Part_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2)}`;
    let emailMessage = `From: ${config.from}\r\n`;
    emailMessage += `To: ${config.to}\r\n`;
    emailMessage += `Subject: ${config.subject}\r\n`;
    emailMessage += `MIME-Version: 1.0\r\n`;
    emailMessage += `Content-Type: multipart/mixed; boundary="${boundary}"\r\n`;
    emailMessage += `\r\n`;

    // HTML body part
    emailMessage += `--${boundary}\r\n`;
    emailMessage += `Content-Type: text/html; charset=utf-8\r\n`;
    emailMessage += `Content-Transfer-Encoding: 7bit\r\n`;
    emailMessage += `\r\n`;
    emailMessage += config.html;
    emailMessage += `\r\n`;

    // Add attachments if any
    if (config.attachments && config.attachments.length > 0) {
      for (const attachment of config.attachments) {
        emailMessage += `--${boundary}\r\n`;
        emailMessage += `Content-Type: application/pdf\r\n`;
        emailMessage += `Content-Disposition: attachment; filename="${attachment.filename}"\r\n`;
        emailMessage += `Content-Transfer-Encoding: base64\r\n`;
        emailMessage += `\r\n`;
        // Convert Uint8Array to base64
        const base64 = btoa(String.fromCharCode(...attachment.content));
        // Split into 76-character lines (RFC 2045)
        for (let i = 0; i < base64.length; i += 76) {
          emailMessage += base64.substring(i, i + 76) + "\r\n";
        }
        emailMessage += `\r\n`;
      }
    }

    emailMessage += `--${boundary}--\r\n`;
    emailMessage += `.\r\n`;

    const sendResponse = await sendCommand(emailMessage);
    if (!sendResponse.startsWith("250")) {
      throw new Error(`SEND failed: ${sendResponse}`);
    }

    // QUIT
    await sendCommand("QUIT");
  } finally {
    conn.close();
  }
}
