import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle, Wifi, ChevronRight, ChevronLeft, User, Phone, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useCreateConnection, useListPlans } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

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
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  const { data: plans } = useListPlans();
  const createConnection = useCreateConnection();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "", mobile: "", whatsapp: "", address: "", village: "", pinCode: "",
      connectionType: "home", planId: "", installationDate: "",
    },
  });

  const onNext = async () => {
    const fields = steps[step].fields as (keyof FormValues)[];
    const valid = await form.trigger(fields);
    if (valid) setStep(s => s + 1);
  };

  const onSubmit = (values: FormValues) => {
    createConnection.mutate({
      data: {
        fullName: values.fullName,
        mobile: values.mobile,
        whatsapp: values.whatsapp || "",
        address: values.address,
        village: values.village,
        pinCode: values.pinCode,
        planId: values.planId ? Number(values.planId) : undefined,
        connectionType: values.connectionType,
        installationDate: values.installationDate || undefined,
      },
    }, {
      onSuccess: () => setSubmitted(true),
      onError: () => toast({ title: "Error", description: "Failed to submit request. Please try again.", variant: "destructive" }),
    });
  };

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <motion.div
          className="glass rounded-3xl p-10 sm:p-16 text-center max-w-lg w-full relative overflow-hidden"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.4 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 pointer-events-none" />
          <motion.div
            className="w-20 h-20 rounded-full gradient-gold mx-auto mb-6 flex items-center justify-center neon-gold"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <CheckCircle className="w-10 h-10 text-background" />
          </motion.div>
          <h2 className="font-display text-2xl font-black gradient-text mb-3">Booking Confirmed!</h2>
          <p className="text-muted-foreground mb-2">Your connection request has been submitted successfully.</p>
          <p className="text-sm text-muted-foreground mb-8">Our team will contact you within 24 hours to schedule installation.</p>
          <div className="bg-primary/10 rounded-xl p-4 mb-8 text-left space-y-2">
            <p className="text-sm font-semibold text-foreground">Confirmation Details:</p>
            <p className="text-sm text-muted-foreground">Name: {form.getValues("fullName")}</p>
            <p className="text-sm text-muted-foreground">Mobile: {form.getValues("mobile")}</p>
            <p className="text-sm text-muted-foreground">Village: {form.getValues("village")}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="tel:+919948046456" className="flex-1">
              <Button variant="outline" className="w-full border-primary/40 text-primary hover:bg-primary/10">
                Call Support
              </Button>
            </a>
            <Button onClick={() => { setSubmitted(false); form.reset(); setStep(0); }} className="flex-1 gradient-gold border-0 text-background font-semibold">
              New Booking
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      {/* Header */}
      <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Badge className="mb-4 gradient-gold border-0 text-background font-display tracking-wider">BOOK CONNECTION</Badge>
        <h1 className="font-display text-3xl sm:text-4xl font-black text-foreground mb-3">
          Get <span className="gradient-text">Connected Today</span>
        </h1>
        <p className="text-muted-foreground">Fill in your details and we'll get you set up in no time</p>
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

      {/* Form */}
      <motion.div
        className="glass rounded-3xl p-6 sm:p-8"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        key={step}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <AnimatePresence mode="wait">
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
                      <FormLabel className="text-foreground font-semibold">WhatsApp Number</FormLabel>
                      <FormControl><Input placeholder="WhatsApp number (if different)" {...field} data-testid="input-whatsapp" className="bg-muted/30 border-border/50 focus:border-primary" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </motion.div>
              )}
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
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                  <FormField control={form.control} name="planId" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-semibold">Select Plan</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-plan" className="bg-muted/30 border-border/50">
                            <SelectValue placeholder="Choose a broadband plan" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {plans && plans.length > 0 ? plans.map(p => (
                            <SelectItem key={p.id} value={String(p.id)}>
                              {p.name} — {p.speed} Mbps — ₹{p.price}/mo
                            </SelectItem>
                          )) : (
                            <>
                              <SelectItem value="1">SD 20 Mbps — ₹530/mo</SelectItem>
                              <SelectItem value="2">HD 30 Mbps — ₹540/mo</SelectItem>
                              <SelectItem value="3">Net 50 Mbps — ₹390/mo</SelectItem>
                            </>
                          )}
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
                            {type === "home" ? "Home" : "Business"}
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
                </motion.div>
              )}
            </AnimatePresence>

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
                <Button type="submit" disabled={createConnection.isPending} className="flex-1 gradient-gold border-0 text-background font-bold" data-testid="btn-submit-booking">
                  {createConnection.isPending ? "Submitting..." : "Book Connection"}
                  <Wifi className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          </form>
        </Form>
      </motion.div>
    </div>
  );
}
