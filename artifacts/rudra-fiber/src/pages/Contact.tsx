import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { SiWhatsapp, SiTelegram } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { useCreateComplaint } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  mobile: z.string().length(10, "Enter 10-digit mobile number"),
  subject: z.string().min(3, "Subject is required"),
  description: z.string().min(10, "Please describe your issue"),
});

const contactMethods = [
  {
    icon: Phone,
    title: "Call Us",
    value: "9640840216",
    href: "tel:9640840216",
    desc: "Available 24x7 for support",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: SiWhatsapp,
    title: "WhatsApp",
    value: "+91 9640840216",
    href: "https://wa.me/919640840216",
    desc: "Quick support on WhatsApp",
    color: "text-[#25D366]",
    bg: "bg-green-500/10",
  },
  {
    icon: Mail,
    title: "Email Us",
    value: "support@rudrafibernet.in",
    href: "mailto:support@rudrafibernet.in",
    desc: "Response within 24 hours",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: SiTelegram,
    title: "Telegram",
    value: "@RudraFiberNet",
    href: "https://t.me/RudraFiberNet",
    desc: "Get updates and support",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
];

export default function Contact() {
  const { toast } = useToast();
  const createComplaint = useCreateComplaint();

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", mobile: "", subject: "", description: "" },
  });

  const onSubmit = (values: z.infer<typeof contactSchema>) => {
    createComplaint.mutate({ data: { ...values, priority: "medium" } }, {
      onSuccess: () => {
        toast({ title: "Message Sent!", description: "We'll get back to you within 24 hours." });
        form.reset();
      },
      onError: () => toast({ title: "Error", description: "Failed to send message. Please call us directly.", variant: "destructive" }),
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Badge className="mb-4 gradient-gold border-0 text-background font-display tracking-wider">CONTACT US</Badge>
        <h1 className="font-display text-3xl sm:text-4xl font-black text-foreground mb-3">
          We're Here to <span className="gradient-text">Help You</span>
        </h1>
        <p className="text-muted-foreground">Reach us through any channel — 24x7 customer support</p>
      </motion.div>

      {/* Big phone number */}
      <motion.div
        className="glass rounded-3xl p-8 text-center mb-10 relative overflow-hidden"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.01 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 pointer-events-none" />
        <p className="text-sm text-muted-foreground mb-2 font-semibold tracking-widest font-display">HELPLINE NUMBER</p>
        <a href="tel:9640840216" className="font-display text-4xl sm:text-6xl font-black gradient-text neon-text-gold block hover:opacity-80 transition-opacity" data-testid="contact-phone">
          9640840216
        </a>
        <p className="text-muted-foreground mt-2 flex items-center justify-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          Available 24 hours, 7 days a week
        </p>
      </motion.div>

      {/* Contact methods grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {contactMethods.map((method, i) => (
          <motion.a
            key={method.title}
            href={method.href}
            target={method.href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="glass rounded-2xl p-5 flex flex-col gap-3 hover:scale-[1.03] transition-all cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            data-testid={`contact-method-${method.title.toLowerCase().replace(/ /g, "-")}`}
          >
            <div className={`w-12 h-12 rounded-xl ${method.bg} flex items-center justify-center ${method.color}`}>
              <method.icon size={22} />
            </div>
            <div>
              <p className="font-semibold text-foreground">{method.title}</p>
              <p className={`text-sm font-medium ${method.color}`}>{method.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{method.desc}</p>
            </div>
          </motion.a>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact form */}
        <motion.div className="glass rounded-3xl p-6 sm:p-8" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="font-display text-xl font-bold text-foreground mb-6">Send a Message</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-semibold text-sm">Your Name</FormLabel>
                    <FormControl><Input {...field} placeholder="Full name" data-testid="input-contact-name" className="bg-muted/30 border-border/50" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="mobile" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-semibold text-sm">Mobile</FormLabel>
                    <FormControl><Input {...field} placeholder="10 digits" maxLength={10} data-testid="input-contact-mobile" className="bg-muted/30 border-border/50" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="subject" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-semibold text-sm">Subject</FormLabel>
                  <FormControl><Input {...field} placeholder="What's this about?" data-testid="input-contact-subject" className="bg-muted/30 border-border/50" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-semibold text-sm">Message</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Describe your issue or query..." rows={4} data-testid="input-contact-message" className="bg-muted/30 border-border/50 resize-none" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" disabled={createComplaint.isPending} className="w-full gradient-gold border-0 text-background font-bold neon-gold" data-testid="btn-send-message">
                {createComplaint.isPending ? "Sending..." : "Send Message"}
                <Send className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </Form>
        </motion.div>

        {/* Info + map */}
        <motion.div className="space-y-5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="glass rounded-2xl p-6 space-y-4">
            <h3 className="font-display text-lg font-bold text-foreground">Office Information</h3>
            <div className="flex gap-3">
              <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground text-sm">Head Office</p>
                <p className="text-sm text-muted-foreground">Rudra Fiber Net Pvt. Ltd.<br />Andhra Pradesh & Telangana, India</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Clock className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground text-sm">Support Hours</p>
                <p className="text-sm text-muted-foreground">24 hours / 7 days a week<br />Including holidays</p>
              </div>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="glass rounded-2xl overflow-hidden h-64 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-card to-muted flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-primary mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground text-sm">Andhra Pradesh & Telangana</p>
                <p className="text-xs text-muted-foreground mt-1">Service Coverage Area</p>
              </div>
            </div>
            {/* Grid lines for map effect */}
            <div className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: "linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
          </div>

          {/* Coverage areas */}
          <div className="glass rounded-2xl p-5">
            <h3 className="font-semibold text-foreground mb-3">Service Coverage</h3>
            <div className="flex flex-wrap gap-2">
              {["Hyderabad", "Vijayawada", "Visakhapatnam", "Guntur", "Kurnool", "Warangal", "Nellore", "Tirupati", "Karimnagar", "Rajahmundry"].map(area => (
                <span key={area} className="glass px-3 py-1 rounded-full text-xs text-muted-foreground flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                  {area}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
