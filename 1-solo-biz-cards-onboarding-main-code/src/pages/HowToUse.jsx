import React from "react";
import {
  ArrowLeft,
  Star,
  Layers,
  Settings,
  Zap,
  Shield,
  Smartphone,
  HelpCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useState } from "react";
import SignInModal from "../components/SignInModal";
import SignUpModal from "../components/SignUpModal";

const HowToUse = () => {
  const navigate = useNavigate();
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gray-50">
      <Header onShowSignIn={() => setIsSignInOpen(true)} />
      <nav className="bg-white border-b-[0.8px] border-gray-200 z-40 top-0 sticky">
        <div className="px-4 sm:px-8 max-w-7xl mx-auto">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex">
                <Link
                  to="/how-to-use"
                  aria-current="page"
                  className="flex items-center text-gray-900 font-medium text-sm leading-5 pt-1 pl-1 pr-1 border-b-[1.6px] border-blue-500 no-underline"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4 mr-2 block align-middle"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <path d="M12 17h.01" />
                  </svg>
                  How to Use
                </Link>
                <Link
                  to="/privacy-policy"
                  className="flex items-center text-gray-500 font-medium text-sm leading-5 pt-1 pl-1 pr-1 border-b-[1.6px] border-transparent ml-4 sm:ml-8 no-underline"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4 mr-2 block align-middle"
                  >
                    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                  </svg>
                  Privacy Policy
                </Link>
                <Link
                  to="/terms-of-service"
                  className="flex items-center text-gray-500 font-medium text-sm leading-5 pt-1 pl-1 pr-1 border-b-[1.6px] border-transparent ml-4 sm:ml-8 no-underline"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4 mr-2 block align-middle"
                  >
                    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                    <path d="M10 9H8" />
                    <path d="M16 13H8" />
                    <path d="M16 17H8" />
                  </svg>
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="py-4 border-b border-gray-200 flex items-center ">
              <button
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                onClick={() => navigate(-1)}
              >
               <button
                  aria-label="Go back"
                  className="transition-colors duration-150 p-2.5 rounded-lg hover:bg-gray-100"
                  onClick={() => window.history.back()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              </button>
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">
                  📖 How to Use
                </h1>
              </div>
            </div>

            <div className="p-3 sm:p-8 ">
              <h2 className="text-lg mb-6">
                📱 How to Use Your Digital Business Card
              </h2>

              {/* Section 1: Getting Started */}
              <Section
                icon={<Star className="text-blue-600 w-6 h-6" />}
                title="1. Getting Started"
                subtitle="Quick Start Guide"
              >
                <ol className="list-decimal pl-6">
                  <li>Visit the homepage and click "Create Card"</li>
                  <li className="mt-2">
                    Fill in your basic information:
                    <ul className="list-disc pl-6 mt-2">
                      <li>Card Name (for your unique URL)</li>
                      <li>Business Category</li>
                      <li>Upload a profile photo (optional)</li>
                      <li>Choose your brand color</li>
                    </ul>
                  </li>
                </ol>
                <WarningNote
                  title="Required Information"
                  items={[
                    "First and Last Name",
                    "Business Category",
                    "Email Address (for account creation)",
                  ]}
                />
              </Section>

              {/* Section 2: Card Sections */}
              <Section
                icon={<Layers className="text-blue-600 w-6 h-6" />}
                title="2. Card Sections"
                subtitle="Profile, Business Information & About Section"
              >
                <div className="mb-4">
                  <h4 className="font-medium mb-2">
                    Profile Section – Professional Details
                  </h4>
                  <ul className="list-disc pl-6">
                    <li>First and Last Name</li>
                    <li>Job Title</li>
                    <li>Company Name</li>
                    <li>Department (optional)</li>
                    <li>Professional Accreditations</li>
                    <li>Company Slogan</li>
                  </ul>
                </div>
                <div className="mb-4">
                  <h4 className="font-medium mb-2">
                    Business Information – Contact Details
                  </h4>
                  <ul className="list-disc pl-6">
                    <li>Phone Number</li>
                    <li>Email Address</li>
                    <li>Website URL</li>
                  </ul>
                  <div className="mt-2">
                    <h5 className="font-medium">Business Address</h5>
                    <ul className="list-disc pl-6">
                      <li>Street Address</li>
                      <li>City</li>
                      <li>State/Province</li>
                      <li>ZIP/Postal Code</li>
                      <li>Country</li>
                    </ul>
                  </div>
                  <div className="mt-2">
                    <h5 className="font-medium">
                      Social Media Links (Supported Platforms)
                    </h5>
                    <ul className="list-disc pl-6">
                      <li>LinkedIn</li>
                      <li>Twitter</li>
                      <li>Facebook</li>
                      <li>Instagram</li>
                      <li>YouTube</li>
                      <li>
                        TikTok (simply enter your username; URLs are
                        automatically formatted)
                      </li>
                    </ul>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">About Section</h4>
                  <ul className="list-disc pl-6">
                    <li>Bio (250 characters max)</li>
                    <li>
                      Section Title Options:
                      <ul className="list-disc pl-6">
                        <li>Default: "About Me"</li>
                        <li>Custom Title (Premium Feature)</li>
                      </ul>
                    </li>
                    <li>
                      Call-to-Action (CTA) – Choose from three options:
                      <ul className="list-disc pl-6">
                        <li>Booking Link (Calendly)</li>
                        <li>Custom CTA (Premium)</li>
                        <li>
                          Direct Ads (Premium):
                          <ul className="list-disc pl-6">
                            <li>Product Showcase</li>
                            <li>Service Promotion</li>
                            <li>Event Advertisement</li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </Section>

              {/* Section 3: Card Management */}
              <Section
                icon={<Settings className="text-blue-600 w-6 h-6" />}
                title="3. Card Management"
                subtitle="Saving and Sharing Your Card"
              >
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Saving Your Card</h4>
                  <ul className="list-disc pl-6">
                    <li>Click "Save Card" to store your creation</li>
                    <li>
                      Options for visibility:
                      <ul className="list-disc pl-6">
                        <li>Private (only accessible via direct link)</li>
                        <li>Public (appears in directory)</li>back
                      </ul>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">
                    Sharing Options & Card Dashboard
                  </h4>
                  <ul className="list-disc pl-6">
                    <li>
                      Sharing Options:
                      <ul className="list-disc pl-6">
                        <li>Direct Link</li>
                        <li>QR Code</li>
                        <li>Social Media Share</li>
                        <li>Email Share</li>
                        <li>Download as Image</li>
                        <li>Save as Contact (vCard)</li>
                      </ul>
                    </li>
                    <li>
                      Card Dashboard – Access to:
                      <ul className="list-disc pl-6">
                        <li>View all your cards</li>
                        <li>Edit existing cards</li>
                        <li>Track analytics (Premium)</li>
                        <li>Manage visibility settings</li>
                        <li>Delete cards</li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </Section>

              {/* Section 4: Premium Features */}
              <Section
                icon={<Zap className="text-blue-600 w-6 h-6" />}
                title="4. Premium Features"
                subtitle="Enhanced Tools for Your Card"
              >
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Direct Ads</h4>
                  <ul className="list-disc pl-6">
                    <li>Upload product/service images</li>
                    <li>Create event flyers</li>
                    <li>Portrait orientation recommended</li>
                    <li>Max file size: 5MB</li>
                    <li>Supported formats: JPG, PNG, GIF</li>
                  </ul>
                </div>
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Analytics</h4>
                  <ul className="list-disc pl-6">
                    <li>View card performance</li>
                    <li>Track visitor statistics</li>
                    <li>Monitor engagement</li>
                    <li>Export analytics data</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Custom Features</h4>
                  <ul className="list-disc pl-6">
                    <li>Custom CTA buttons</li>
                    <li>Custom section titles</li>
                    <li>Advanced branding options</li>
                  </ul>
                </div>
              </Section>

              {/* Section 5: Best Practices */}
              <Section
                icon={<Shield className="text-blue-600 w-6 h-6" />}
                title="5. Best Practices"
                subtitle="Tips for a Professional Card"
              >
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Profile Photo</h4>
                  <ul className="list-disc pl-6">
                    <li>Use a professional headshot</li>
                    <li>Clear, high-quality image</li>
                    <li>Well-lit, simple background</li>
                    <li>Professional attire</li>
                  </ul>
                </div>
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Content Tips</h4>
                  <ul className="list-disc pl-6">
                    <li>Keep information current</li>
                    <li>Use concise, professional language</li>
                    <li>Include relevant contact methods</li>
                    <li>Regularly update your details</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Sharing Strategy</h4>
                  <ul className="list-disc pl-6">
                    <li>
                      Include your card link in:
                      <ul className="list-disc pl-6">
                        <li>Email signatures</li>
                        <li>Social media profiles</li>
                        <li>Marketing materials</li>
                        <li>Business presentations</li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </Section>

              {/* Section 6: Technical Requirements */}
              <Section
                icon={<Smartphone className="text-blue-600 w-6 h-6" />}
                title="6. Technical Requirements"
                subtitle="Supported Platforms and Guidelines"
              >
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Supported Browsers</h4>
                  <ul className="list-disc pl-6">
                    <li>Chrome</li>
                    <li>Firefox</li>
                    <li>Safari</li>
                    <li>Edge</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Image Guidelines</h4>
                  <ul className="list-disc pl-6">
                    <li>Profile Photo: Max 5MB</li>
                    <li>Supported formats: JPG, PNG, GIF, WebP</li>
                    <li>Direct Ads: Portrait orientation recommended</li>
                  </ul>
                </div>
              </Section>

              {/* Section 7: Support */}
              <Section
                icon={<HelpCircle className="text-blue-600 w-6 h-6" />}
                title="7. Support"
                subtitle="Help and Troubleshooting"
              >
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Common Actions</h4>
                  <ul className="list-disc pl-6">
                    <li>Password reset</li>
                    <li>Account recovery</li>
                    <li>Card updates</li>
                    <li>Privacy settings</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Help Resources</h4>
                  <ul className="list-disc pl-6">
                    <li>FAQ section</li>
                    <li>Video tutorials</li>
                    <li>Email support</li>
                    <li>Troubleshooting guide</li>
                  </ul>
                </div>
              </Section>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-blue-900 font-medium mb-2">
                  ❓ Need Additional Help?
                </h3>
                <p className="text-blue-700">
                  If you have any questions or need assistance, please visit our{" "}
                  <Link
                    to="/troubleshooting"
                    className="text-blue-600 hover:underline"
                  >
                    troubleshooting guide
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        onShowSignUp={() => {
          setIsSignInOpen(false);
          setIsSignUpOpen(true);
        }}
      />
      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
        onShowSignIn={() => {
          setIsSignUpOpen(false);
          setIsSignInOpen(true);
        }}
      />
    </div>
  );
};

const Section = ({ icon, title, subtitle, children }) => (
  <section className="mb-8">
    <div className="flex items-center space-x-2 mb-4">
      {icon}
      <h3 className="text-lg font-medium">{title}</h3>
    </div>
    {subtitle && <h4 className="mb-2">{subtitle}</h4>}
    {children}
  </section>
);

const WarningNote = ({ title, items }) => (
  <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 mt-4">
    <div className="flex">
      <svg
        className="flex-shrink-0 text-yellow-500 w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <div className="ml-3">
        <h3 className="text-sm font-medium text-yellow-800">{title}</h3>
        <div className="mt-2 text-sm text-yellow-700">
          <ul className="list-disc pl-5">
            {items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export default HowToUse;
