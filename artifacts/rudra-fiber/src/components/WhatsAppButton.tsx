import { motion } from "framer-motion";
import { SiWhatsapp } from "react-icons/si";

export default function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/919948046456"
      target="_blank"
      rel="noopener noreferrer"
      data-testid="whatsapp-float-btn"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl"
      style={{ background: "linear-gradient(135deg, #25D366, #128C7E)" }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
      animate={{ boxShadow: ["0 0 0 0 rgba(37,211,102,0.4)", "0 0 0 16px rgba(37,211,102,0)", "0 0 0 0 rgba(37,211,102,0)"] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <SiWhatsapp size={28} />
    </motion.a>
  );
}
