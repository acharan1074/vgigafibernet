import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Wifi, Phone, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { useSendOtp, useVerifyOtp } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

const mobileSchema = z.object({ mobile: z.string().length(10, "Enter 10-digit mobile number") });
const otpSchema = z.object({ otp: z.string().length(6, "Enter 6-digit OTP") });

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [stage, setStage] = useState<"mobile" | "otp">("mobile");
  const [mobile, setMobile] = useState("");
  const sendOtp = useSendOtp();
  const verifyOtp = useVerifyOtp();

  const mobileForm = useForm<{ mobile: string }>({
    resolver: zodResolver(mobileSchema),
    defaultValues: { mobile: "" },
  });
  const otpForm = useForm<{ otp: string }>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const onSendOtp = (vals: { mobile: string }) => {
    setMobile(vals.mobile);
    sendOtp.mutate({ data: { mobile: vals.mobile } }, {
      onSuccess: (data) => {
        toast({ title: "OTP Sent", description: data.message });
        setStage("otp");
      },
      onError: () => toast({ title: "Error", description: "Could not send OTP. Try again.", variant: "destructive" }),
    });
  };

  const onVerifyOtp = (vals: { otp: string }) => {
    verifyOtp.mutate({ data: { mobile, otp: vals.otp } }, {
      onSuccess: (data) => {
        localStorage.setItem("rudra_token", data.token);
        localStorage.setItem("rudra_customer", JSON.stringify(data.customer));
        toast({ title: "Login Successful", description: `Welcome, ${data.customer.fullName}!` });
        setLocation("/portal");
      },
      onError: () => toast({ title: "Invalid OTP", description: "Please check the OTP and try again.", variant: "destructive" }),
    });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-px"
            style={{ left: `${15 + i * 14}%`, top: 0, bottom: 0, background: `linear-gradient(180deg, transparent, hsl(${i % 2 === 0 ? "38 92% 50%" : "185 100% 50%"} / 0.3), transparent)` }}
            animate={{ opacity: [0.2, 0.7, 0.2] }}
            transition={{ duration: 2 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
      </div>

      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            className="w-20 h-20 rounded-2xl gradient-gold mx-auto mb-4 flex items-center justify-center neon-gold"
            animate={{ boxShadow: ["0 0 20px hsl(38 92% 50% / 0.3)", "0 0 40px hsl(38 92% 50% / 0.6)", "0 0 20px hsl(38 92% 50% / 0.3)"] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Wifi className="w-10 h-10 text-background" />
          </motion.div>
          <h1 className="font-display text-2xl font-black gradient-text">RUDRA FIBER NET</h1>
          <p className="text-sm text-muted-foreground mt-1">Customer Portal Login</p>
        </div>

        <div className="glass rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 pointer-events-none" />

          <AnimatePresence mode="wait">
            {stage === "mobile" ? (
              <motion.div
                key="mobile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="relative z-10"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl glass flex items-center justify-center">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground">Enter Mobile Number</h2>
                    <p className="text-xs text-muted-foreground">We'll send an OTP to verify your identity</p>
                  </div>
                </div>
                <Form {...mobileForm}>
                  <form onSubmit={mobileForm.handleSubmit(onSendOtp)} className="space-y-5">
                    <FormField control={mobileForm.control} name="mobile" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-semibold">Mobile Number</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">+91</span>
                            <Input
                              {...field}
                              placeholder="Enter 10-digit number"
                              maxLength={10}
                              data-testid="input-login-mobile"
                              className="bg-muted/30 border-border/50 focus:border-primary pl-12"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <Button
                      type="submit"
                      disabled={sendOtp.isPending}
                      className="w-full gradient-gold border-0 text-background font-bold neon-gold"
                      data-testid="btn-send-otp"
                    >
                      {sendOtp.isPending ? "Sending..." : "Send OTP"}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                </Form>
                <p className="text-xs text-muted-foreground text-center mt-4">
                  Demo OTP is <span className="text-primary font-semibold">123456</span>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="relative z-10"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl glass flex items-center justify-center">
                    <Shield className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground">Enter OTP</h2>
                    <p className="text-xs text-muted-foreground">Sent to +91 {mobile}</p>
                  </div>
                </div>
                <Form {...otpForm}>
                  <form onSubmit={otpForm.handleSubmit(onVerifyOtp)} className="space-y-5">
                    <FormField control={otpForm.control} name="otp" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-semibold">6-digit OTP</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter OTP"
                            maxLength={6}
                            data-testid="input-otp"
                            className="bg-muted/30 border-border/50 focus:border-primary text-center text-2xl font-display tracking-widest"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <Button
                      type="submit"
                      disabled={verifyOtp.isPending}
                      className="w-full gradient-gold border-0 text-background font-bold neon-gold"
                      data-testid="btn-verify-otp"
                    >
                      {verifyOtp.isPending ? "Verifying..." : "Verify & Login"}
                    </Button>
                    <Button type="button" variant="ghost" className="w-full text-muted-foreground" onClick={() => setStage("mobile")}>
                      Change number
                    </Button>
                  </form>
                </Form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Features */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            { label: "View Plans", icon: "📶" },
            { label: "Pay Bills", icon: "💳" },
            { label: "Raise Ticket", icon: "🎫" },
          ].map(f => (
            <div key={f.label} className="glass rounded-xl p-3 text-center">
              <div className="text-xl mb-1">{f.icon}</div>
              <p className="text-xs text-muted-foreground">{f.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
