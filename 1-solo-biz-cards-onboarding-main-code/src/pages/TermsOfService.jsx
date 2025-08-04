import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SignInModal from "../components/SignInModal";
import SignUpModal from "../components/SignUpModal";
import Header from "../components/Header";

export default function TermsOfService() {
  const navigate = useNavigate();
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Fixed Sign In Button */}
      <div className="fixed top-5 right-5 z-50">
        <Header onShowSignIn={() => setIsSignInOpen(true)} />
      </div>

      {/* Header (Sticky Navigation) */}
      <nav className="bg-white border-b-[0.8px] border-gray-200 z-40 top-0 sticky">
        <div className="px-4 sm:px-8 max-w-7xl mx-auto">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex">
                <Link
                  to="/how-to-use"
                  className="flex items-center text-gray-500 font-medium text-sm leading-5 pt-1 pl-1 pr-1 border-b-[1.6px] border-transparent no-underline"
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
                  className="flex items-center text-gray-900 font-medium text-sm leading-5 pt-1 pl-1 pr-1 border-b-[1.6px] border-blue-500 ml-4 sm:ml-8 no-underline"
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

      {/* Main Content */}
      <main className="flex-1">
        <div className="py-10 px-4">
          {/* Terms of Service Banner */}
          <div className="max-w-4xl mx-auto mb-5">
            <div className="flex flex-col md:flex-row items-start gap-4 p-5 bg-yellow-50 border border-yellow-300 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-6 text-yellow-600 mt-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <div>
                <h2 className="text-sm text-yellow-700 font-medium">
                  Having trouble accessing this page?
                </h2>
                <p className="text-sm text-yellow-600 mt-1">
                  If you see a connection error, visit our{" "}
                  <Link
                    to="/troubleshooting"
                    className="underline font-medium text-yellow-700"
                  >
                    troubleshooting guide
                  </Link>{" "}
                  for step-by-step solutions.
                </p>
              </div>
            </div>
          </div>

          {/* Terms of Service Content */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
              {/* Content Header */}
              <div className="flex items-center px-8 py-5 border-b border-gray-200">
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
                <div className="flex items-center gap-4">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Terms of Service
                  </h1>
                </div>
              </div>
              {/* Content Body */}
              <div className="p-8 space-y-6">
                <h2 className="text-lg font-normal">Terms of Service</h2>
                <p className="text-sm text-gray-500">
                  Last updated: March 15, 2025
                </p>
                <div className="mt-6 space-y-6">
                  {/* Section 1 */}
                  <section>
                    <h3 className="text-lg font-medium text-gray-800">
                      1. Acceptance of Terms
                    </h3>
                    <p className="text-sm text-gray-600">
                      By accessing and using our digital business card service,
                      you agree to be bound by these Terms of Service and all
                      applicable laws and regulations.
                    </p>
                  </section>
                  {/* Section 2 */}
                  <section>
                    <h3 className="text-lg font-medium text-gray-800">
                      2. User Accounts
                    </h3>
                    <p className="text-sm text-gray-600">
                      You are responsible for:
                    </p>
                    <ul className="list-disc ml-6 mt-2 text-sm text-gray-600 space-y-1">
                      <li>Maintaining the confidentiality of your account</li>
                      <li>All activities that occur under your account</li>
                      <li>
                        Ensuring your information is accurate and up-to-date
                      </li>
                    </ul>
                  </section>
                  {/* Section 3 */}
                  <section>
                    <h3 className="text-lg font-medium text-gray-800">
                      3. Acceptable Use
                    </h3>
                    <p className="text-sm text-gray-600">You agree not to:</p>
                    <ul className="list-disc ml-6 mt-2 text-sm text-gray-600 space-y-1">
                      <li>Use the service for any illegal purpose</li>
                      <li>Share inappropriate or offensive content</li>
                      <li>
                        Attempt to gain unauthorized access to our systems
                      </li>
                      <li>Interfere with other users' access to the service</li>
                    </ul>
                  </section>
                  {/* Section 4 */}
                  <section>
                    <h3 className="text-lg font-medium text-gray-800">
                      4. Data Security
                    </h3>
                    <p className="text-sm text-gray-600">
                      We implement appropriate technical and organizational
                      measures to protect your personal information against
                      unauthorized access, alteration, disclosure, or
                      destruction.
                    </p>
                  </section>
                  {/* Section 5 */}
                  <section>
                    <h3 className="text-lg font-medium text-gray-800">
                      5. Your Rights
                    </h3>
                    <p className="text-sm text-gray-600">
                      You have the right to:
                    </p>
                    <ul className="list-disc ml-6 mt-2 text-sm text-gray-600 space-y-1">
                      <li>Access your personal information</li>
                      <li>Correct inaccurate data</li>
                      <li>Request deletion of your data</li>
                      <li>Object to data processing</li>
                      <li>Request data portability</li>
                    </ul>
                  </section>
                  {/* Section 6 */}
                  <section>
                    <h3 className="text-lg font-medium text-gray-800">
                      6. Contact
                    </h3>
                    <p className="text-sm text-gray-600">
                      For questions about these Terms of Service, please contact
                      us at{" "}
                      <a
                        href="mailto:contact@bizcardnow.com"
                        className="underline text-blue-600"
                      >
                        contact@bizcardnow.com
                      </a>
                    </p>
                  </section>
                </div>
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
}
