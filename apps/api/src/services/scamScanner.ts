/**
 * Real-Time Anti-Scam Pattern Scanner for Messaging
 *
 * Flags rampant Indian marketplace scam triggers:
 * 1. Fake UPI QR codes ("scan QR to receive payment")
 * 2. Advance courier / shipping fee scams
 * 3. Defence / Army officer transfer impersonation
 * 4. Premature phone number / off-platform migration before pickup consent
 */

export interface ScamScanResult {
  isScamFlagged: boolean;
  scamWarningReason: string | null;
}

const SCAM_PATTERNS: { regex: RegExp; reason: string }[] = [
  {
    regex: /(scan\s*(this)?\s*qr|qr\s*code\s*(to\s*receive|send|pay)|receive\s*money\s*by\s*scanning)/i,
    reason: 'UPI Safety Alert: You NEVER need to scan a QR code or enter your UPI PIN to RECEIVE money. This is a known scam.',
  },
  {
    regex: /(army\s*(officer|camp|cantt|personnel)|defence\s*(officer|quota|personnel)|military\s*transfer|posted\s*in\s*cantt)/i,
    reason: 'Impersonation Alert: Scammers frequently impersonate Indian Armed Forces personnel to build fake trust.',
  },
  {
    regex: /(advance\s*(courier|delivery|transport|shipping|token)\s*(charge|fee|amount|payment)|customs\s*clearance\s*fee)/i,
    reason: 'Advance Fee Warning: Never send advance courier or deposit charges before meeting in person.',
  },
  {
    regex: /(call\s*me\s*at|whatsapp\s*me\s*(at|on)|contact\s*on\s*whatsapp)\s*[:\s]*([6-9]\d{9})/i,
    reason: 'Off-Platform Alert: Moving off-platform prematurely bypasses buyer protection and fraud monitoring.',
  },
];

export function scanMessageForScams(body: string): ScamScanResult {
  for (const pattern of SCAM_PATTERNS) {
    if (pattern.regex.test(body)) {
      return {
        isScamFlagged: true,
        scamWarningReason: pattern.reason,
      };
    }
  }

  return {
    isScamFlagged: false,
    scamWarningReason: null,
  };
}
