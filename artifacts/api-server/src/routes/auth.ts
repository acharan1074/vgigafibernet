import { Router } from "express";
import { Customer } from "@workspace/db";
import { SendOtpBody, VerifyOtpBody } from "@workspace/api-zod";

const router = Router();

// In-memory OTP store (for demo purposes)
const otpStore = new Map<string, { otp: string; expiry: number }>();

router.post("/auth/otp/send", async (req, res) => {
  try {
    const parsed = SendOtpBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid mobile number" });

    // Generate a demo OTP (in production, integrate SMS gateway)
    const otp = "123456"; // Demo OTP
    otpStore.set(parsed.data.mobile, { otp, expiry: Date.now() + 5 * 60 * 1000 });

    req.log.info({ mobile: parsed.data.mobile }, "OTP sent");
    res.json({ success: true, message: `OTP sent to ${parsed.data.mobile}. Demo OTP: 123456` });
  } catch (err) {
    req.log.error({ err }, "Failed to send OTP");
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

router.post("/auth/otp/verify", async (req, res) => {
  try {
    const parsed = VerifyOtpBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

    const stored = otpStore.get(parsed.data.mobile);
    if (!stored || stored.otp !== parsed.data.otp || Date.now() > stored.expiry) {
      return res.status(401).json({ error: "Invalid or expired OTP" });
    }

    otpStore.delete(parsed.data.mobile);

    // Find or create customer
    let customer = await Customer.findOne({ mobile: parsed.data.mobile });
    if (!customer) {
      customer = await Customer.create({
        fullName: "New Customer",
        mobile: parsed.data.mobile,
        address: "",
        village: "",
        pinCode: "",
        status: "active",
        dataUsedGB: 0,
        dataLimitGB: 100,
      });
    }

    const customerJson = customer.toJSON();
    const token = Buffer.from(`${customerJson.id}:${customerJson.mobile}:${Date.now()}`).toString("base64");
    res.json({ token, customer: customerJson });
  } catch (err) {
    req.log.error({ err }, "Failed to verify OTP");
    res.status(500).json({ error: "Failed to verify OTP" });
  }
});

export default router;
