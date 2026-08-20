import {
  MapPin,
  Mail,
  Phone,
  Clock,
  Lock,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full bg-[#2a2a2a] text-[#b5b5b5] text-[13px] font-sans border-t border-[#333]">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-7 py-5 lg:py-9">
        
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 justify-between">
          
          {/* Left Column: Contact Us */}
          <div className="w-full lg:w-[60%]">
            <h3 className="text-white text-[15px] font-bold uppercase mb-6 tracking-wide">Contact Us</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-8">
              
              {/* Col 1 */}
              <div className="flex flex-col gap-8">
                {/* Address */}
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-[#3a3a3a] flex items-center justify-center flex-shrink-0 text-white mt-0.5 shadow-sm">
                    <MapPin size={16} />
                  </div>
                  <div className="leading-relaxed">
                    NTI Olympiad Centre <br/>
                    Shop No.4, LBS Marg, Kurla West,<br/>
                    Mumbai, Maharashtra, India. Pin - 400070
                    <br/><br/>
                    <span className="font-bold text-white">Regd Office:</span> Shop No.4, LBS Marg, Kurla West,<br/>
                    Mumbai, Maharashtra, <br/>
                    India. Pin – 400070
                  </div>
                </div>
                
                {/* Email */}
                <div className="flex gap-4 items-center">
                  <div className="w-8 h-8 rounded-full bg-[#3a3a3a] flex items-center justify-center flex-shrink-0 text-white shadow-sm">
                    <Mail size={16} />
                  </div>
                  <a href="mailto:info@ntiolympiad.in" className="hover:text-white transition-colors">info@ntiolympiad.in</a>
                </div>
              </div>

              {/* Col 2 */}
              <div className="flex flex-col gap-8">
                {/* Phones */}
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-[#3a3a3a] flex items-center justify-center flex-shrink-0 text-white mt-0.5 shadow-sm">
                    <Phone size={16} />
                  </div>
                  <div className="leading-relaxed">
                    Mobile: +91 7972621561
                  </div>
                </div>

                {/* Timings */}
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-[#3a3a3a] flex items-center justify-center flex-shrink-0 text-white mt-0.5 shadow-sm">
                    <Clock size={16} />
                  </div>
                  <div className="leading-relaxed">
                    All working Days From <br/>
                    Monday - Friday<br/>
                    10:00 AM - 7:00 PM
                  </div>
                </div>

                {/* Privacy Policy */}
                <div className="flex gap-4 items-center">
                  <div className="w-8 h-8 rounded-full bg-[#3a3a3a] flex items-center justify-center flex-shrink-0 text-white shadow-sm">
                    <Lock size={16} />
                  </div>
                  <Link to="/privacy-policy" className="hover:text-white transition-colors font-bold text-white">Privacy Policy</Link>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Facebook Widget */}
          <div className="w-full lg:w-[40%] flex justify-start lg:justify-end">
            <div className="bg-white rounded-sm overflow-hidden w-full max-w-[500px] border border-gray-200">
              <iframe 
                name="f488841e3ecb939e0" 
                title="fb:page Facebook Social Plugin" 
                frameBorder="0" 
                allowtransparency="true" 
                allowFullScreen={true} 
                scrolling="no" 
                allow="encrypted-media" 
                src="https://www.facebook.com/v2.3/plugins/page.php?adapt_container_width=true&amp;app_id=&amp;channel=https%3A%2F%2Fstaticxx.facebook.com%2Fx%2Fconnect%2Fxd_arbiter%2F%3Fversion%3D46%23cb%3Dffef7c6e0b9543a37%26domain%3Dntiolympiad.in%26is_canvas%3Dfalse%26origin%3Dhttps%253A%252F%252Fntiolympiad.in%252Ff8a2c00b1a02934f8%26relation%3Dparent.parent&amp;container_width=500&amp;height=210&amp;hide_cover=false&amp;hide_cta=false&amp;href=https%3A%2F%2Fwww.facebook.com%2Fntiolympiad&amp;locale=en_US&amp;sdk=joey&amp;show_facepile=true&amp;small_header=false&amp;tabs=timeline&amp;width=500" 
                loading="lazy"
                style={{border: 'none', visibility: 'visible', width: '100%', height: '212px'}} 
              ></iframe>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="w-full bg-[#1e1e1e] border-t border-[#333]">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-7 py-4">
          <div className="flex flex-col gap-5">
            <p className="text-[12px] text-[#888] leading-relaxed">
              Copyright © 2026 <span className="font-bold text-white">NTI OLYMPIAD FOUNDATION</span> | All Rights Reserved | No part of this site including content and/or logo, may be copied and/or used in any manner without prior written consent of NTI
            </p>
            <div className="flex items-center gap-4">
              <span className="text-[12px] text-[#888]">Connect with us</span>
              <div className="flex items-center gap-2.5">
                {/* Facebook */}
                <a href="https://www.facebook.com/ntiolympiad" target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:opacity-90 shadow-sm">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1V12h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z"/>
                  </svg>
                </a>
                {/* Instagram */}
                <a href="https://www.instagram.com/ntiolympiad" target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white flex items-center justify-center hover:opacity-90 shadow-sm">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </a>
                {/* LinkedIn */}
                <a href="https://www.linkedin.com/company/ntiolympiad" target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-full bg-[#0A66C2] text-white flex items-center justify-center hover:opacity-90 shadow-sm">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
