import { Helmet } from 'react-helmet-async';
import { Breadcrumb, PageContainer, SectionHeading } from '../../components/ui';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white pb-20 font-sans text-left">
      <Helmet>
        <title>Privacy Policy — NTI Olympiad Foundation</title>
        <meta name="description" content="Official Privacy Policy and Data Protection guidelines for NTI Olympiad Foundation." />
        <link rel="canonical" href="https://ntiolympiad.in/privacy-policy" />
      </Helmet>

      <Breadcrumb items={[
        { label: 'Home', path: '/' },
        { label: 'Privacy Policy' }
      ]} />

      <PageContainer className="py-8 max-w-4xl">
        <div className="border-b border-gray-300 pb-4 mb-8">
          <SectionHeading level="h1" className="font-normal text-gray-900">
            Privacy Policy
          </SectionHeading>
          <p className="text-xs text-gray-500 mt-2 font-mono uppercase tracking-wider">
            Last Updated: Academic Year 2026
          </p>
        </div>

        <div className="space-y-8 text-[14.5px] text-gray-700 leading-relaxed font-sans">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">
              1. Introduction
            </h2>
            <p>
              NTI Olympiad Foundation ("we", "our", or "us") is committed to protecting the privacy and personal data of all registered schools, coordinators, educators, and student participants. This Privacy Policy details how information is collected, stored, processed, and safeguarded when using our official website and services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">
              2. Information We Collect
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li><strong>School & Institutional Data:</strong> School Name, Registration Code, Affiliation Board, Official Postal Address, and Contact Details.</li>
              <li><strong>Coordinator Information:</strong> Principal / Teacher Coordinator Name, Designation, Official Email Address, and Contact Phone Number.</li>
              <li><strong>Student Registration Details:</strong> Student Roll Numbers, Grade Level, Subject Choices, and Examination Scores.</li>
              <li><strong>Payment Proofs:</strong> Transaction verification receipts uploaded by participating schools for enrollment verification.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">
              3. Purpose of Data Processing
            </h2>
            <p>
              We process personal and institutional data strictly for educational and administrative purposes, including:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 mt-2 text-gray-600">
              <li>Processing Olympiad registrations and hall tickets.</li>
              <li>Evaluating answer sheets and publishing verified examination results.</li>
              <li>Issuing physical workbooks, awards, certificates, and state-level ranker trophies.</li>
              <li>Communicating examination dates, schedule updates, and important announcements.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">
              4. Data Security & Storage
            </h2>
            <p>
              All participant records are safeguarded behind encrypted servers and protected access controls. We maintain strict organizational and technical measures to prevent unauthorized access, disclosure, alteration, or destruction of personal data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">
              5. Contact Us
            </h2>
            <p>
              For any questions or concerns regarding this Privacy Policy or your registered institutional data, please contact our helpline:
            </p>
            <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-none text-sm text-gray-800 space-y-1 font-mono">
              <p><strong>NTI Olympiad Foundation</strong></p>
              <p>Email: <a href="mailto:info@ntiolympiad.in" className="text-blue-600 hover:underline">info@ntiolympiad.in</a></p>
              <p>Helpline: +91 7972621561</p>
              <p>Address: Shop No.4, LBS Marg, Kurla West, Mumbai, Maharashtra 400070</p>
            </div>
          </section>
        </div>
      </PageContainer>
    </div>
  );
}
