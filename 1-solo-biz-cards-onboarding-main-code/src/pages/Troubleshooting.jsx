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
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Fixed Sign In Button */}
      <div className="fixed top-5 right-5 z-50">
        <Header onShowSignIn={() => setIsSignInOpen(true)} />
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-0">
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
              <h1 className="text-2xl font-bold text-gray-900">
                Connection Troubleshooting Guide
              </h1>
            </div>
            <p className="mt-2 text-gray-600">
              Follow these steps to resolve the "Connect to project" error
              message.
            </p>
          </div>

          <div className="p-6 space-y-8">
            <section>
              <h2 class="text-lg font-semibold text-gray-900 mb-4">
                Common Issues
              </h2>
              <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div class="flex items-center">
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
                    className="lucide lucide-alert-circle h-5 w-5 text-yellow-400"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" x2="12" y1="8" y2="12"></line>
                    <line x1="12" x2="12.01" y1="16" y2="16"></line>
                  </svg>
                  <p class="ml-3 text-sm text-yellow-700">
                    Error Message: "You're almost there! In order to see your
                    preview, you need to connect this tab to its project."
                  </p>
                </div>
              </div>
            </section>
            <section>
              <h2 class="text-lg font-semibold text-gray-900 mb-4">
                Quick Solutions
              </h2>
              <div class="space-y-4">
                <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-refresh-ccw w-5 h-5 text-blue-600 mt-0.5"
                  >
                    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                    <path d="M3 3v5h5"></path>
                    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
                    <path d="M16 16h5v5"></path>
                  </svg>
                  <div>
                    <h3 class="font-medium text-gray-900">Refresh the Page</h3>
                    <p class="text-sm text-gray-600">
                      Press Ctrl+R (Windows) or Cmd+R (Mac) to reload the
                      current page.
                    </p>
                  </div>
                </div>
                <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-globe w-5 h-5 text-blue-600 mt-0.5"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                    <path d="M2 12h20"></path>
                  </svg>
                  <div>
                    <h3 class="font-medium text-gray-900">Open in New Tab</h3>
                    <p class="text-sm text-gray-600">
                      Right-click the link and select "Open in new tab" or use
                      middle-click.
                    </p>
                  </div>
                </div>
                <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-link2 w-5 h-5 text-blue-600 mt-0.5"
                  >
                    <path d="M9 17H7A5 5 0 0 1 7 7h2"></path>
                    <path d="M15 7h2a5 5 0 1 1 0 10h-2"></path>
                    <line x1="8" x2="16" y1="12" y2="12"></line>
                  </svg>
                  <div>
                    <h3 class="font-medium text-gray-900">Direct URL Access</h3>
                    <p class="text-sm text-gray-600">
                      Copy and paste the URL directly into a new browser window.
                    </p>
                  </div>
                </div>
              </div>
            </section>
            <section>
              <h2 class="text-lg font-semibold text-gray-900 mb-4">
                Browser-Specific Solutions
              </h2>
              <div class="space-y-6">
                <div class="border border-gray-200 rounded-lg p-4">
                  <h3 class="font-medium text-gray-900 mb-2">Google Chrome</h3>
                  <ol class="list-decimal list-inside space-y-2 text-sm text-gray-600">
                    <li>
                      Clear browser cache: Settings → Privacy and security →
                      Clear browsing data
                    </li>
                    <li>
                      Disable cache: Open DevTools (F12) → Network tab → Check
                      "Disable cache"
                    </li>
                    <li>
                      Try Incognito Mode: Ctrl+Shift+N (Windows) or Cmd+Shift+N
                      (Mac)
                    </li>
                  </ol>
                </div>
                <div class="border border-gray-200 rounded-lg p-4">
                  <h3 class="font-medium text-gray-900 mb-2">
                    Mozilla Firefox
                  </h3>
                  <ol class="list-decimal list-inside space-y-2 text-sm text-gray-600">
                    <li>
                      Clear cache: Options → Privacy &amp; Security → Clear Data
                    </li>
                    <li>
                      Reload without cache: Ctrl+Shift+R (Windows) or
                      Cmd+Shift+R (Mac)
                    </li>
                    <li>
                      Try Private Window: Ctrl+Shift+P (Windows) or Cmd+Shift+P
                      (Mac)
                    </li>
                  </ol>
                </div>
                <div class="border border-gray-200 rounded-lg p-4">
                  <h3 class="font-medium text-gray-900 mb-2">Safari</h3>
                  <ol class="list-decimal list-inside space-y-2 text-sm text-gray-600">
                    <li>
                      Clear cache: Preferences → Privacy → Manage Website Data →
                      Remove All
                    </li>
                    <li>Reload without cache: Option+Cmd+R</li>
                    <li>Try Private Window: Cmd+Shift+N</li>
                  </ol>
                </div>
              </div>
            </section>

            <section>
              <h2 class="text-lg font-semibold text-gray-900 mb-4">
                For Developers
              </h2>
              <div class="bg-gray-900 rounded-lg p-4 text-white font-mono text-sm">
                <p class="mb-2"># Check if dev server is running</p>
                <code class="block mb-4">npm run dev</code>
                <p class="mb-2"># Verify route configuration</p>
                <code class="block mb-4">
                  &lt;Route path="/privacy-policy" element=&#123;&lt;
                  PrivacyPolicyPage /&gt;&#125; /&gt;
                </code>
                <p class="mb-2"># Ensure imports are correct</p>
                <code class="block">
                  import &#123; PrivacyPolicyPage &#125; from
                  './pages/PrivacyPolicyPage';
                </code>
              </div>
            </section>

            <section>
              <h2 class="text-lg font-semibold text-gray-900 mb-4">
                Still Having Issues?
              </h2>
              <div class="bg-blue-50 border-l-4 border-blue-400 p-4">
                <p class="text-sm text-blue-700">
                  If you're still experiencing connection issues:
                </p>
                <ul class="mt-2 space-y-1 text-sm text-blue-600">
                  <li>• Check your internet connection</li>
                  <li>• Verify the development server is running</li>
                  <li>• Try accessing the page from the main navigation</li>
                  <li>• Contact support if the issue persists</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>

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
