const { Resend } = require('resend');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, title, date, proposalTitle, clientCompany, investment } = req.body;

  if (!name) return res.status(400).json({ error: 'Name is required' });

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: 'Guide MKTG Proposals <proposals@guidemktg.com>',
      to: 'josh@guidemktg.com',
      subject: `Signed: ${proposalTitle}`,
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;">
          <div style="background:#111;padding:20px 24px;border-radius:8px 8px 0 0;">
            <p style="color:#e87c26;font-weight:800;font-size:18px;margin:0;">Guide MKTG Proposals</p>
          </div>
          <div style="background:#fff;border:1px solid #e8e8e8;border-top:none;border-radius:0 0 8px 8px;padding:32px 24px;">
            <h2 style="margin:0 0 8px;font-size:22px;color:#111;">New Agreement Signed</h2>
            <p style="color:#666;margin:0 0 28px;font-size:15px;">Someone just signed a proposal on <strong>proposal.guidemktg.com</strong>.</p>

            <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:13px;color:#999;font-weight:700;text-transform:uppercase;letter-spacing:.5px;width:140px;">Proposal</td>
                <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:15px;color:#111;">${proposalTitle}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:13px;color:#999;font-weight:700;text-transform:uppercase;letter-spacing:.5px;">Client</td>
                <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:15px;color:#111;">${clientCompany}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:13px;color:#999;font-weight:700;text-transform:uppercase;letter-spacing:.5px;">Investment</td>
                <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:15px;color:#111;font-weight:700;">${investment}</td>
              </tr>
            </table>

            <div style="background:#f8f8f8;border-radius:8px;padding:20px 22px;border-left:4px solid #e87c26;">
              <p style="margin:0 0 4px;font-size:13px;color:#999;font-weight:700;text-transform:uppercase;letter-spacing:.5px;">Signed By</p>
              <p style="margin:0;font-size:20px;color:#111;font-style:italic;">${name}</p>
              <p style="margin:6px 0 0;font-size:14px;color:#555;">${title}</p>
              <p style="margin:4px 0 0;font-size:13px;color:#888;">${date}</p>
            </div>

            <p style="margin:28px 0 0;font-size:13px;color:#aaa;">The signer confirmed they read and agreed to the scope, deliverables, and payment terms outlined in the proposal.</p>
          </div>
        </div>
      `
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Resend error:', err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
};
