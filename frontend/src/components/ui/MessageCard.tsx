import Image, { StaticImageData } from "next/image";
import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";

interface MessageCardProps {
  image?: StaticImageData;      // optional – you can also use an icon
  subject: string;
  message: string;
  onClickBtn: () => void;
  btnText: string;
  type?: "success" | "error";   // to choose icon/color automatically
}

export default function MessageCard({
  image,
  subject,
  message,
  onClickBtn,
  btnText,
  type = "success",
}: MessageCardProps) {
  // If no custom image is provided, use a Lucide icon based on type
  const Icon = type === "success" ? CheckCircle : XCircle;
  const iconColor = type === "success" ? "text-emerald-500" : "text-red-500";
  const gradient = type === "success" 
    ? "from-emerald-500 to-teal-500" 
    : "from-red-500 to-rose-500";

  return (
    <div className=" flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="max-w-md w-full bg-white rounded-2xl shadow-2xl shadow-black/20 overflow-hidden relative"
      >
        {/* Top gradient bar – like in the signup form */}
        <div className={`h-1.5 bg-gradient-to-r ${gradient} w-full`} />

        <div className="p-8 flex flex-col items-center text-center gap-6">
          {/* Icon / Image */}
          <div className="flex justify-center">
            {image ? (
              <Image src={image} alt="message-icon" className="w-24 h-24 object-contain" />
            ) : (
              <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
                <Icon className="w-14 h-80 text-white" />
              </div>
            )}
          </div>

          {/* Subject */}
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {subject}
          </h2>

          {/* Message */}
          <p className="text-gray-600 text-sm leading-relaxed">
            {message}
          </p>

          {/* Button */}
          <button
            onClick={onClickBtn}
            className="mt-4 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-2.5 rounded-lg hover:shadow-lg transition disabled:opacity-50"
          >
            {btnText}
          </button>
        </div>
      </motion.div>
    </div>
  );
}