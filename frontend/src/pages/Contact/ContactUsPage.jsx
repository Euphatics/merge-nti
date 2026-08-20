import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { PageContainer, Input, TextArea, Button } from '../../components/ui';

/* ═══════════════════════════════════════════════════════════
   DESIGN TOKENS  (matches site-wide theme)
   ═══════════════════════════════════════════════════════════
   Primary Blue   : #007BFF  (buttons, accent bars, focus rings)
   Hover Blue     : #0069D9  (button hover)
   Royal Navy     : #1E3A8A  (hero gradient stop)
   Royal Deep     : #172554  (hero gradient stop)
   Label Green    : #0D9488  (section label text – teal-green)
   Heading        : #1F2937  (text-gray-800)
   Body           : #4B5563  (text-gray-600)
   Muted          : #9CA3AF  (text-gray-400)
   Border         : #E5E7EB  (border-gray-200)
   Bg Section     : #F9FAFB  (bg-gray-50)
   Bg White       : #FFFFFF
*/

const LABEL_COLOR  = '#0D9488';   // teal-green – OUR LOCATION, PHONE, EMAIL, etc.
const PRIMARY_BLUE = '#007BFF';
const HEADING_COL  = '#1F2937';
const BODY_COL     = '#4B5563';
const MUTED_COL    = '#9CA3AF';
const BORDER_COL   = '#E5E7EB';
const BG_SECTION   = '#F9FAFB';
const ICON_BG      = '#EFF6FF';
const ICON_COL     = '#1D4ED8';

/* ─── Contact Info rows ─────────────────────────────────── */
const INFO_ITEMS = [
  {
    icon: MapPin,
    label: 'OUR LOCATION',
    content: (
      <>
        NTI Olympiad Centre,<br />
        Shop No.4, LBS Marg, Kurla West,<br />
        Mumbai – 400 070, Maharashtra
      </>
    ),
  },
  {
    icon: Phone,
    label: 'PHONE',
    content: '+91 7972621561',
  },
  {
    icon: Mail,
    label: 'EMAIL',
    content: (
      <a
        href="mailto:info@ntiolympiad.in"
        className="hover:underline break-all"
        style={{ color: PRIMARY_BLUE }}
      >
        info@ntiolympiad.in
      </a>
    ),
  },
  {
    icon: Clock,
    label: 'OPENING HOURS',
    content: 'Mon–Fri: 10.00 am – 7.00 pm',
  },
];

/* ─── Component ─────────────────────────────────────────── */
export default function ContactUs() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire to backend / email service
  };

  return (
    <>
      <Helmet>
        <title>Contact Us – NTI Olympiad Support</title>
        <meta name="description" content="Get in touch with NTI Olympiad support. We are here to answer questions about registrations, exam syllabus, dates, and results." />
        <link rel="canonical" href="https://ntiolympiad.in/contact" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Contact Us – NTI Olympiad Support" />
        <meta property="og:description" content="Get in touch with NTI Olympiad support. We are here to answer questions about registrations, exam syllabus, dates, and results." />
        <meta property="og:site_name" content="NTI Olympiad" />
        <meta property="og:image" content="https://ntiolympiad.in/about_nti_banner.png" />
        <meta property="og:url" content="https://ntiolympiad.in/contact" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Us – NTI Olympiad Support" />
        <meta name="twitter:description" content="Get in touch with NTI Olympiad support. We are here to answer questions about registrations, exam syllabus, dates, and results." />
        <meta name="twitter:image" content="https://ntiolympiad.in/about_nti_banner.png" />
      </Helmet>
      {/* ════════════════════════════════════════════════════
          HERO BANNER
          ════════════════════════════════════════════════════ */}
      <section
        id="contact-hero"
        className="w-full py-20 flex flex-col items-center justify-center text-center relative overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, #1D4ED8 0%, #1E3A8A 60%, #172554 100%)',
        }}
      >
        {/* decorative circles */}
        <div
          className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-10 pointer-events-none"
          style={{ background: '#60A5FA' }}
        />
        <div
          className="absolute -bottom-24 -right-16 w-96 h-96 rounded-full opacity-10 pointer-events-none"
          style={{ background: '#3B82F6' }}
        />

        <p
          className="relative z-10 text-xs font-semibold tracking-[0.25em] uppercase mb-4"
          style={{ color: '#93C5FD' }}
        >
          Get in Touch
        </p>
        <h1
          className="relative z-10 text-4xl sm:text-5xl font-extrabold text-white tracking-tight"
        >
          Contact Us
        </h1>
        <div
          className="relative z-10 mt-5 h-1 w-16 rounded-full"
          style={{ background: '#60A5FA' }}
        />
      </section>

      {/* ════════════════════════════════════════════════════
          CONTACT BODY  —  info (left)  +  form (right)
          ════════════════════════════════════════════════════ */}
      <section
        id="contact-body"
        className="w-full py-16 border-b"
        style={{ background: '#FFFFFF', borderColor: BORDER_COL }}
      >
        <PageContainer className="max-w-[1280px] mx-auto">
          {/*
            Two columns, vertically aligned at the TOP of each column.
            Column widths: 5/12 info | 7/12 form — gives form more breathing room.
          */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

            {/* ── LEFT: Contact Info ────────────────────── */}
            <div className="lg:col-span-5">

              {/* Section heading */}
              <div
                className="text-[22px] font-extrabold tracking-tight leading-none mb-2"
                style={{ color: HEADING_COL }}
              >
                NTI OLYMPIAD
              </div>
              {/* #007BFF accent bar */}
              <div
                className="h-[3px] w-11 rounded-full mb-8"
                style={{ background: PRIMARY_BLUE }}
              />

              {/* Info rows */}
              <ul className="space-y-7">
                {INFO_ITEMS.map(({ icon: Icon, label, content }) => (
                  <li key={label} className="flex items-start gap-4">
                    {/* icon bubble */}
                    <div
                      className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center mt-0.5"
                      style={{ background: ICON_BG }}
                    >
                      <Icon size={17} style={{ color: ICON_COL }} strokeWidth={2} />
                    </div>

                    <div>
                      {/* label — teal-green accent */}
                      <p
                        className="text-[10px] font-bold uppercase tracking-widest mb-1"
                        style={{ color: LABEL_COLOR }}
                      >
                        {label}
                      </p>
                      {/* value */}
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: BODY_COL }}
                      >
                        {content}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Divider */}
              <hr className="my-8" style={{ borderColor: BORDER_COL }} />

              {/* Response time note */}
              <p className="text-xs italic" style={{ color: MUTED_COL }}>
                We endeavour to respond to all queries within 24 working hours.
              </p>
            </div>

            {/* ── RIGHT: Contact Form (NO card/shadow/border) ── */}
            <div className="lg:col-span-7">

              {/* Heading — identical markup to left column for pixel-perfect alignment */}
              <div
                className="text-[22px] font-extrabold tracking-tight leading-none mb-2"
                style={{ color: HEADING_COL }}
              >
                Have a Question?
              </div>
              {/* #007BFF accent bar */}
              <div
                className="h-[3px] w-11 rounded-full mb-8"
                style={{ background: PRIMARY_BLUE }}
              />

              <form
                id="contact-form"
                className="space-y-4"
                onSubmit={handleSubmit}
              >
                {/* Name */}
                <Input
                  id="contact-name"
                  type="text"
                  name="name"
                  placeholder="Name"
                  required
                  style={{ borderColor: BORDER_COL }}
                />

                {/* Email */}
                <Input
                  id="contact-email"
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  required
                  style={{ borderColor: BORDER_COL }}
                />

                {/* Subject */}
                <Input
                  id="contact-subject"
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  style={{ borderColor: BORDER_COL }}
                />

                {/* Message — resize-y so user can drag to resize */}
                <TextArea
                  id="contact-message"
                  name="message"
                  placeholder="Your Message"
                  rows={6}
                  className="resize-y custom-scroll"
                  style={{ borderColor: BORDER_COL, minHeight: '120px' }}
                />

                {/* Submit */}
                <div className="pt-1">
                  <Button
                    id="contact-submit"
                    type="submit"
                    style={{
                      boxShadow: '0 2px 8px rgba(30,58,138,0.20)',
                    }}
                  >
                    Send Message
                  </Button>
                </div>
              </form>
            </div>

          </div>
        </PageContainer>
      </section>
      {/* ════════════════════════════════════════════════════
          MAP  —  Kurla, Mumbai
          ════════════════════════════════════════════════════ */}
      <section id="contact-map" className="w-full border-b" style={{ borderColor: BORDER_COL }}>
        {/* Map label strip — teal-green label text */}
        <PageContainer
          className="py-5 flex items-center gap-3"
          style={{ background: BG_SECTION }}
        >
          <MapPin size={17} style={{ color: LABEL_COLOR }} strokeWidth={2.5} />
          <p
            className="text-sm font-semibold tracking-wide"
            style={{ color: LABEL_COLOR }}
          >
            Find us on the map — Kurla, Mumbai
          </p>
        </PageContainer>

        {/* Google Maps iframe */}
        <div className="w-full h-[420px]">
          <iframe
            id="contact-map-embed"
            title="NTI Olympiad Location – Kurla"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.1245678901234!2d72.8793!3d19.0668!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c8e4f7b8e8e1%3A0xd9bfc7b3f8a4b2e1!2sKurla%2C%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1718500000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0, display: 'block' }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

    </>
  );
}
