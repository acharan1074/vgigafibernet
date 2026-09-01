import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MessageCircle, Wifi, ChevronRight, ChevronLeft, User, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useListPlans } from "@workspace/api-client-react";

// ─── Config ──────────────────────────────────────────────────────────────────
const WHATSAPP_NUMBER = "919948046456"; // service-provider WhatsApp (no + or spaces)

// Fallback plans used when API is unavailable
const FALLBACK_PLANS = [
  { id: 1,   name: "SD 20 Mbps",              speed: 20,  price: 530  },
  { id: 2,   name: "SD 30 Mbps",              speed: 30,  price: 520  },
  { id: 3,   name: "SD 50 Mbps",              speed: 50,  price: 560  },
  { id: 4,   name: "HD 20 Mbps",              speed: 20,  price: 550  },
  { id: 5,   name: "HD 30 Mbps",              speed: 30,  price: 540  },
  { id: 6,   name: "HD 50 Mbps",              speed: 50,  price: 580  },
  { id: 7,   name: "Net 20 Mbps",             speed: 20,  price: 360  },
  { id: 8,   name: "Net 30 Mbps",             speed: 30,  price: 350  },
  { id: 9,   name: "Net 50 Mbps",             speed: 50,  price: 390  },
  { id: 101, name: "BSNL FIBER HOME",         speed: 40,  price: 399  },
  { id: 102, name: "BSNL FIBER BASIC",        speed: 60,  price: 499  },
  { id: 103, name: "BSNL FIBER BASIC PLUS",   speed: 100, price: 599  },
  { id: 104, name: "BSNL FIBER TB",           speed: 150, price: 799  },
  { id: 105, name: "BSNL SUPER STAR PREMIUM", speed: 200, price: 999  },
  { id: 106, name: "BSNL FIBER PREMIUM PLUS", speed: 250, price: 1499 },
  { id: 107, name: "BSNL FIBER ULTRA",        speed: 300, price: 1799 },
];

// Build a pre-filled WhatsApp URL with all booking details
function buildWhatsAppUrl(values: FormValues, planLabel: string): string {
  const date = values.installationDate
    ? new Date(values.installationDate).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })
    : "Not specified";

  const message = [
    "🌐 *New Connection Request — VGIGA FIBER NET*",
    "",
    "👤 *Personal Details*",
    `• Name       : ${values.fullName}`,
    `• Mobile     : +91 ${values.mobile}`,
    `• WhatsApp   : ${values.whatsapp ? "+91 " + values.whatsapp : "Same as mobile"}`,
    "",
    "📍 *Address*",
    `• Address    : ${values.address}`,
    `• Village    : ${values.village}`,
    `• PIN Code   : ${values.pinCode}`,
    "",
    "📦 *Plan & Connection*",
    `• Plan       : ${planLabel}`,
    `• Type       : ${values.connectionType === "home" ? "Home Connection" : "Business Connection"}`,
    `• Install On : ${date}`,
    "",
    "Please confirm availability and contact me to proceed. Thank you! 🙏",
  ].join("\n");

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

const schema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  mobile: z.string().min(10, "Enter valid 10-digit mobile number").max(10),
  whatsapp: z.string().optional(),
  address: z.string().min(5, "Enter full address"),
  village: z.string().min(2, "Enter village/area name"),
  pinCode: z.string().min(6, "Enter valid 6-digit PIN code").max(6),
  planId: z.string().optional(),
  connectionType: z.enum(["home", "business"]),
  installationDate: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const steps = [
  { title: "Personal Info", icon: User, fields: ["fullName", "mobile", "whatsapp"] },
  { title: "Address", icon: MapPin, fields: ["address", "village", "pinCode"] },
  { title: "Plan & Date", icon: Calendar, fields: ["planId", "connectionType", "installationDate"] },
];

export default function BookConnection() {
  const [step, setStep] = useState(0);
  const { data: apiPlans } = useListPlans();

  // Merge API plans with hardcoded fallback list
  const plans = (apiPlans && apiPlans.length > 0)
    ? apiPlans.map((p: any) => ({ id: p.id, name: p.name, speed: p.speed, price: p.price }))
    : FALLBACK_PLANS;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "", mobile: "", whatsapp: "", address: "", village: "", pinCode: "",
      connectionType: "home", planId: "", installationDate: "",
    },
  });

  // Pre-fill plan when navigated from Plans page via ?plan=<id>
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const planId = params.get("plan");
    if (planId) form.setValue("planId", planId);
  }, [form]);

  const onNext = async () => {
    const fields = steps[step].fields as (keyof FormValues)[];
    const valid = await form.trigger(fields);
    if (valid) setStep(s => s + 1);
  };

  const onSubmit = (values: FormValues) => {
    const selectedPlan = plans.find(p => String(p.id) === values.planId);
    const planLabel = selectedPlan
      ? `${selectedPlan.name} — ${selectedPlan.speed} Mbps — ₹${selectedPlan.price}/mo`
      : values.planId ? `Plan ID ${values.planId}` : "Not selected";

    // Open WhatsApp with pre-filled message in new tab, then show success screen
    window.open(buildWhatsAppUrl(values, planLabel), "_blank", "noopener,noreferrer");
    setStep(-1);
  };

  // ── Success screen ──────────────────────────────────────────────────────────
  if (step === -1) {
    const values = form.getValues();
    const selectedPlan = plans.find(p => String(p.id) === values.planId);
    const planLabel = selectedPlan
      ? `${selectedPlan.name} — ${selectedPlan.speed} Mbps — ₹${selectedPlan.price}/mo`
      : "Not selected";

    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <motion.div
          className="glass rounded-3xl p-10 sm:p-14 text-center max-w-lg w-full relative overflow-hidden"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.4 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 pointer-events-none" />

          <motion.div
            className="w-20 h-20 rounded-full bg-[#25D366] mx-auto mb-6 flex items-center justify-center shadow-lg"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <MessageCircle className="w-10 h-10 text-white" />
          </motion.div>

          <h2 className="font-display text-2xl font-black gradient-text mb-2">Sent to WhatsApp!</h2>
          <p className="text-muted-foreground mb-1">Your booking details have been sent to our team on WhatsApp.</p>
          <p className="text-sm text-muted-foreground mb-6">If WhatsApp didn't open, tap the button below.</p>

          <div className="bg-primary/10 rounded-xl p-4 mb-7 text-left space-y-1.5">
            <p className="text-sm font-semibold text-foreground mb-2">Booking Summary</p>
            <p className="text-sm text-muted-foreground">👤 {values.fullName}</p>
            <p className="text-sm text-muted-foreground">📱 +91 {values.mobile}</p>
            <p className="text-sm text-muted-foreground">📍 {values.village}, {values.pinCode}</p>
            <p className="text-sm text-muted-foreground">📦 {planLabel}</p>
            <p className="text-sm text-muted-foreground">{values.connectionType === "home" ? "🏠 Home" : "🏢 Business"} Connection</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={buildWhatsAppUrl(values, planLabel)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button className="w-full bg-[#25D366] hover:bg-[#20b958] border-0 text-white font-bold gap-2">
                <MessageCircle className="w-4 h-4" /> Open WhatsApp
              </Button>
            </a>
            <Button
              variant="outline"
              onClick={() => { form.reset(); setStep(0); }}
              className="flex-1 border-border/50"
            >
              New Booking
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Booking form ────────────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      {/* Header */}
      <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Badge className="mb-4 gradient-gold border-0 text-background font-display tracking-wider">BOOK CONNECTION</Badge>
        <h1 className="font-display text-3xl sm:text-4xl font-black text-foreground mb-3">
          Get <span className="gradient-text">Connected Today</span>
        </h1>
        <p className="text-muted-foreground">Fill in your details — we'll send them directly to our team on WhatsApp</p>
      </motion.div>

      {/* Progress steps */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {steps.map((s, i) => (
          <div key={s.title} className="flex items-center gap-2">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              i === step ? "gradient-gold text-background neon-gold" : i < step ? "bg-primary/20 text-primary" : "glass text-muted-foreground"
            }`}>
              <s.icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{s.title}</span>
              <span className="sm:hidden">{i + 1}</span>
            </div>
            {i < steps.length - 1 && <div className={`w-6 h-px ${i < step ? "bg-primary" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      {/* Form card */}
      <motion.div
        className="glass rounded-3xl p-6 sm:p-8"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        key={step}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <AnimatePresence mode="wait">
              {/* Step 0 — Personal Info */}
              {step === 0 && (
                <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                  <FormField control={form.control} name="fullName" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-semibold">Full Name *</FormLabel>
                      <FormControl><Input placeholder="Enter your full name" {...field} data-testid="input-fullname" className="bg-muted/30 border-border/50 focus:border-primary" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="mobile" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-semibold">Mobile Number *</FormLabel>
                      <FormControl><Input placeholder="10-digit mobile number" maxLength={10} {...field} data-testid="input-mobile" className="bg-muted/30 border-border/50 focus:border-primary" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="whatsapp" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-semibold">WhatsApp Number <span className="text-muted-foreground font-normal">(if different)</span></FormLabel>
                      <FormControl><Input placeholder="WhatsApp number" {...field} data-testid="input-whatsapp" className="bg-muted/30 border-border/50 focus:border-primary" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </motion.div>
              )}

              {/* Step 1 — Address */}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                  <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-semibold">Full Address *</FormLabel>
                      <FormControl><Input placeholder="Door no, Street, Colony" {...field} data-testid="input-address" className="bg-muted/30 border-border/50 focus:border-primary" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="village" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-semibold">Village / Area *</FormLabel>
                      <FormControl><Input placeholder="Village or locality name" {...field} data-testid="input-village" className="bg-muted/30 border-border/50 focus:border-primary" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="pinCode" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-semibold">PIN Code *</FormLabel>
                      <FormControl><Input placeholder="6-digit PIN code" maxLength={6} {...field} data-testid="input-pincode" className="bg-muted/30 border-border/50 focus:border-primary" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </motion.div>
              )}

              {/* Step 2 — Plan & Date */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                  <FormField control={form.control} name="planId" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-semibold">Select Plan</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-plan" className="bg-muted/30 border-border/50">
                            <SelectValue placeholder="Choose a broadband plan" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {plans.map(p => (
                            <SelectItem key={p.id} value={String(p.id)}>
                              {p.name} — {p.speed} Mbps — ₹{p.price}/mo
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="connectionType" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-semibold">Connection Type *</FormLabel>
                      <div className="flex gap-3">
                        {["home", "business"].map(type => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => field.onChange(type)}
                            data-testid={`connection-type-${type}`}
                            className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all border ${
                              field.value === type ? "gradient-gold border-0 text-background neon-gold" : "glass border-border/50 text-muted-foreground"
                            }`}
                          >
                            {type === "home" ? "🏠 Home" : "🏢 Business"}
                          </button>
                        ))}
                      </div>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="installationDate" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-semibold">Preferred Installation Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} data-testid="input-install-date" className="bg-muted/30 border-border/50 focus:border-primary" min={new Date().toISOString().split("T")[0]} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  {/* WhatsApp notice */}
                  <div className="flex items-start gap-3 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 px-4 py-3">
                    <MessageCircle className="w-5 h-5 text-[#25D366] shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                      Tapping <strong className="text-foreground">Book via WhatsApp</strong> will open WhatsApp with your details pre-filled and send them directly to our team.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex gap-3 pt-2">
              {step > 0 && (
                <Button type="button" variant="outline" onClick={() => setStep(s => s - 1)} className="flex-1 border-border/50" data-testid="btn-prev-step">
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </Button>
              )}
              {step < steps.length - 1 ? (
                <Button type="button" onClick={onNext} className="flex-1 gradient-gold border-0 text-background font-semibold" data-testid="btn-next-step">
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button type="submit" className="flex-1 bg-[#25D366] hover:bg-[#20b958] border-0 text-white font-bold gap-2" data-testid="btn-submit-booking">
                  <MessageCircle className="w-4 h-4" />
                  Book via WhatsApp
                  <Wifi className="w-4 h-4" />
                </Button>
              )}
            </div>
          </form>
        </Form>
      </motion.div>
    </div>
  );
}
