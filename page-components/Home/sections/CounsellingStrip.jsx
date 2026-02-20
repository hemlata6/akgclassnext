import React from "react";
import { LAYOUT_PADDING, BRAND_GREEN_CLASS, TEXT_GREEN } from "../../../constants/Icons";

// ✅ MUI Icons
import CallIcon from "@mui/icons-material/Call";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TelegramIcon from "@mui/icons-material/Telegram";

export const CounsellingStrip = () => {

  const ICON_BOX =
    "w-10 h-10 flex items-center justify-center \
     rounded-lg bg-white shadow-sm hover:shadow-lg \
     transition-all duration-300";

  const ICON_STYLE = { fontSize: 22 }; // ✅ SAME SIZE ALL ICONS

  return (
    <section className={`py-8 ${BRAND_GREEN_CLASS} text-white`}>
      <div className={LAYOUT_PADDING}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">

          {/* TEXT */}
          <div>
            <h2 className="text-lg font-bold">
              Confused about CA preparation?
            </h2>
            <p className="text-indigo-100 text-xs">
              Talk to our counselors for a personalized study plan.
            </p>
          </div>

          {/* ICONS */}
          <div className="flex flex-wrap gap-3 justify-center md:justify-end">

            {/* CALL */}
            <a href="tel:+918949190985" className={ICON_BOX}>
              <CallIcon color="info" sx={{ ...ICON_STYLE }} className="text-indigo-600" />
            </a>

            {/* WHATSAPP */}
            <a
              href="https://wa.me/918949190985"
              target="_blank"
              rel="noopener noreferrer"
              className={ICON_BOX}
            >
              <WhatsAppIcon color="info" sx={{ ...ICON_STYLE }} className="text-indigo-600" />
            </a>

            {/* TELEGRAM */}
            <a
              href="https://t.me/capankajinter"
              target="_blank"
              rel="noopener noreferrer"
              className={ICON_BOX}
            >
              <TelegramIcon color="info" sx={{ ...ICON_STYLE }} className="text-indigo-600" />
            </a>

            {/* YOUTUBE */}
            <a
              href="https://youtube.com/@capankajaswaniair10"
              target="_blank"
              rel="noopener noreferrer"
              className={ICON_BOX}
            >
              <YouTubeIcon color="info" sx={{ ...ICON_STYLE }} className="text-indigo-600" />
            </a>

            {/* INSTAGRAM */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className={ICON_BOX}
            >
              <InstagramIcon color="info" sx={{ ...ICON_STYLE }} className="text-indigo-600" />
            </a>
            {/* LINKEDIN */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className={ICON_BOX}
            >
              <LinkedInIcon color="info" sx={{ ...ICON_STYLE }} className="text-indigo-600" />
            </a>

          </div>
        </div>
      </div>
    </section>
  );
};