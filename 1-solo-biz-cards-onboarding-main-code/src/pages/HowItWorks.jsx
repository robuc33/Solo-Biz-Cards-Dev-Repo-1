import React, { useState } from "react";
import Header from "../components/Header";
import { Link, useNavigate } from "react-router-dom";
import SignUpModal from "../components/SignUpModal";
import SignInModal from "../components/SignInModal";

export default function HowItWorks() {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="cursor-auto m-0 leading-6">
      <div>
        <div className="flex flex-col min-h-[695.2px]">
          <Header onShowSignIn={() => setIsSignInOpen(true)} />

          <main className="flex-1">
            <div className="py-10 px-4 bg-gray-50 min-h-[695.2px]">
              <div className="max-w-4xl mx-auto">
                <div className="shadow-sm bg-white border border-gray-200 rounded-lg overflow-hidden">
                  {/* Header Section */}
                  <div className="py-4 px-6 border-b border-gray-200 flex items-center gap-4">
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
                    <div className="flex items-center gap-3">
                      <h1 className="text-gray-900 font-bold text-2xl">
                        ✨ How It Works
                      </h1>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-3 sm:p-8">
                    <h2 className="text-base font-normal mb-8">
                      🌟 How It Works: Digital Business Card Platform
                    </h2>

                    {/* Sections */}
                    {sections.map((section, index) => (
                      <Section key={index} {...section} />
                    ))}

                    {/* Help Section */}
                    <div className="p-4 bg-blue-50 rounded-lg mt-8">
                      <h3 className="text-blue-800 mb-2">❓ Need Help?</h3>
                      <p className="text-blue-600">
                        If you have any questions or need assistance, please
                        visit our{" "}
                        <Link
                          to="/troubleshooting"
                          className="text-blue-600 hover:underline"
                        >
                          troubleshooting guide
                        </Link>{" "}
                        or contact our support team.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
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

const Section = ({ icon, title, items }) => (
  <section className="mb-8">
    <div className="flex items-center gap-2">
      {icon}
      <h3 className="text-base font-normal">{title}</h3>
    </div>
    {items.map((item, index) => (
      <div key={index}>
        <h4 className="text-base font-normal mt-4">{item.subtitle}</h4>
        <ul className="list-disc list-inside pl-6 mt-2">
          {item.points.map((point, idx) => (
            <li key={idx} className="mb-1">
              {point}
            </li>
          ))}
        </ul>
      </div>
    ))}
  </section>
);

const sections = [
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-blue-600 w-6 h-6"
      >
        <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
        <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
        <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
        <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
      </svg>
    ),
    title: "1. Card Creation Process",
    items: [
      {
        subtitle: "Instant Digital Card Creation",
        points: [
          "Create professional digital business cards in minutes",
          "No design experience needed",
          "Mobile-friendly and responsive design",
          "Real-time preview as you build",
        ],
      },
      // Add other items similarly...
    ],
  },
  {
    icon: (
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
        style={{
          color: "rgb(37, 99, 235)",
          width: "1.5rem",
          height: "24px",
          display: "block",
          verticalAlign: "middle",
          boxSizing: "border-box",
          borderWidth: "0px",
          borderStyle: "solid",
          borderColor: "rgb(229, 231, 235)",
        }}
      >
        <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
        <path d="M3 5V19A9 3 0 0 0 21 19V5"></path>
        <path d="M3 12A9 3 0 0 0 21 12"></path>
      </svg>
    ),
    title: "2. Storage & Access",
    items: [
      {
        subtitle: "Cloud Storage",
        points: [
          "Cards stored securely in the cloud",
          "Accessible from any device",
          "Automatic syncing across platforms",
          "No local installation required",
        ],
      },
      {
        subtitle: "Privacy Controls",
        points: [
          "Choose between public and private cards",
          "Public cards appear in searchable directory",
          "Private cards accessible only via direct link",
          "Granular sharing permissions",
        ],
      },
    ],
  },
  {
    icon: (
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
        style={{
          color: "rgb(37, 99, 235)",
          width: "1.5rem",
          height: "24px",
          display: "block",
          verticalAlign: "middle",
          boxSizing: "border-box",
          borderWidth: "0px",
          borderStyle: "solid",
          borderColor: "rgb(229, 231, 235)",
        }}
      >
        <circle cx="18" cy="5" r="3"></circle>
        <circle cx="6" cy="12" r="3"></circle>
        <circle cx="18" cy="19" r="3"></circle>
        <line x1="8.59" x2="15.42" y1="13.51" y2="17.49"></line>
        <line x1="15.41" x2="8.59" y1="6.51" y2="10.49"></line>
      </svg>
    ),
    title: "3. Sharing Mechanisms",
    items: [
      {
        subtitle: "Multiple Sharing Options",
        points: [
          "Direct URL sharing",
          "QR code generation",
          "Social media integration",
          "Email sharing capability",
          "Download as image",
          "vCard format support",
        ],
      },
      {
        subtitle: "Dynamic Updates",
        points: [
          "Changes reflect immediately",
          "All shared links stay current",
          "No need to reshare after updates",
          "Real-time synchronization",
        ],
      },
    ],
  },
  {
    icon: (
      // Placeholder SVG - replace with your own icon
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
        style={{
          color: "rgb(37, 99, 235)",
          width: "1.5rem",
          height: "24px",
          display: "block",
          verticalAlign: "middle",
          boxSizing: "border-box",
          borderWidth: "0px",
          borderStyle: "solid",
          borderColor: "rgb(229, 231, 235)",
        }}
      >
        <rect
          width="20"
          height="8"
          x="2"
          y="2"
          rx="2"
          ry="2"
          style={{
            boxSizing: "border-box",
            borderWidth: "0px",
            borderStyle: "solid",
            borderColor: "rgb(229, 231, 235)",
          }}
        ></rect>
        <rect
          width="20"
          height="8"
          x="2"
          y="14"
          rx="2"
          ry="2"
          style={{
            boxSizing: "border-box",
            borderWidth: "0px",
            borderStyle: "solid",
            borderColor: "rgb(229, 231, 235)",
          }}
        ></rect>
        <line
          x1="6"
          x2="6.01"
          y1="6"
          y2="6"
          style={{
            boxSizing: "border-box",
            borderWidth: "0px",
            borderStyle: "solid",
            borderColor: "rgb(229, 231, 235)",
          }}
        ></line>
        <line
          x1="6"
          x2="6.01"
          y1="18"
          y2="18"
          style={{
            boxSizing: "border-box",
            borderWidth: "0px",
            borderStyle: "solid",
            borderColor: "rgb(229, 231, 235)",
          }}
        ></line>
      </svg>
    ),
    title: "4. Technical Infrastructure",
    items: [
      {
        subtitle: "Cloud-Based Platform",
        points: [
          "Built on Supabase infrastructure",
          "Real-time database updates",
          "Secure authentication system",
          "CDN-powered image delivery",
        ],
      },
      {
        subtitle: "Data Security",
        points: [
          "End-to-end encryption",
          "Secure data transmission",
          "Regular backups",
          "GDPR compliant",
        ],
      },
    ],
  },
  {
    icon: (
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
        style={{
          color: "rgb(37, 99, 235)",
          width: "1.5rem",
          height: "24px",
          display: "block",
          verticalAlign: "middle",
          boxSizing: "border-box",
          borderWidth: "0px",
          borderStyle: "solid",
          borderColor: "rgb(229, 231, 235)",
        }}
      >
        <path
          d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"
          style={{
            boxSizing: "border-box",
            borderWidth: "0px",
            borderStyle: "solid",
            borderColor: "rgb(229, 231, 235)",
          }}
        ></path>
      </svg>
    ),
    title: "5. Premium Features",
    items: [
      {
        subtitle: "Analytics & Insights",
        points: [
          "View card performance",
          "Track visitor statistics",
          "Monitor engagement",
          "Download analytics reports",
        ],
      },
      {
        subtitle: "Advanced Customization",
        points: [
          "Custom CTAs",
          "Direct ads integration",
          "Advanced branding options",
          "Priority support",
        ],
      },
    ],
  },
  {
    icon: (
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
        style={{
          color: "rgb(37, 99, 235)",
          width: "1.5rem",
          height: "24px",
          display: "block",
          verticalAlign: "middle",
          boxSizing: "border-box",
          borderWidth: "0px",
          borderStyle: "solid",
          borderColor: "rgb(229, 231, 235)",
        }}
      >
        <polyline
          points="16 18 22 12 16 6"
          style={{
            boxSizing: "border-box",
            borderWidth: "0px",
            borderStyle: "solid",
            borderColor: "rgb(229, 231, 235)",
          }}
        ></polyline>
        <polyline
          points="8 6 2 12 8 18"
          style={{
            boxSizing: "border-box",
            borderWidth: "0px",
            borderStyle: "solid",
            borderColor: "rgb(229, 231, 235)",
          }}
        ></polyline>
      </svg>
    ),
    title: "6. System Architecture",
    items: [
      {
        subtitle: "Frontend",
        points: [
          "React-based interface",
          "Real-time updates",
          "Responsive design",
          "Progressive web app capabilities",
        ],
      },
      {
        subtitle: "Backend",
        points: [
          "Serverless architecture",
          "Automatic scaling",
          "High availability",
          "Low latency access",
        ],
      },
    ],
  },
  {
    icon: (
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
        style={{
          color: "rgb(37, 99, 235)",
          width: "1.5rem",
          height: "24px",
          display: "block",
          verticalAlign: "middle",
          boxSizing: "border-box",
          borderWidth: "0px",
          borderStyle: "solid",
          borderColor: "rgb(229, 231, 235)",
        }}
      >
        <path
          d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
          style={{
            boxSizing: "border-box",
            borderWidth: "0px",
            borderStyle: "solid",
            borderColor: "rgb(229, 231, 235)",
          }}
        ></path>
        <path
          d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
          style={{
            boxSizing: "border-box",
            borderWidth: "0px",
            borderStyle: "solid",
            borderColor: "rgb(229, 231, 235)",
          }}
        ></path>
      </svg>
    ),
    title: "7. Integration Capabilities",
    items: [
      {
        subtitle: "External Services",
        points: [
          "Calendar integration (Calendly)",
          "Social media platforms",
          "Contact management systems",
          "Marketing tools",
        ],
      },
      {
        subtitle: "API Access",
        points: [
          "RESTful API endpoints",
          "Webhook support",
          "Custom integration options",
          "Developer documentation",
        ],
      },
    ],
  },
  {
    icon: (
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
        style={{
          color: "rgb(37, 99, 235)",
          width: "1.5rem",
          height: "24px",
          display: "block",
          verticalAlign: "middle",
          boxSizing: "border-box",
          borderWidth: "0px",
          borderStyle: "solid",
          borderColor: "rgb(229, 231, 235)",
        }}
      >
        <polygon
          points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"
          style={{
            boxSizing: "border-box",
            borderWidth: "0px",
            borderStyle: "solid",
            borderColor: "rgb(229, 231, 235)",
          }}
        ></polygon>
      </svg>
    ),
    title: "8. Performance Optimization",
    items: [
      {
        subtitle: "Image Processing",
        points: [
          "Automatic image optimization",
          "Responsive image delivery",
          "Format conversion",
          "Size limitations enforced",
        ],
      },
      {
        subtitle: "Caching Strategy",
        points: [
          "CDN caching",
          "Browser caching",
          "API response caching",
          "Optimized load times",
        ],
      },
    ],
  },
  {
    icon: (
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
        style={{
          color: "rgb(37, 99, 235)",
          width: "1.5rem",
          height: "24px",
          display: "block",
          verticalAlign: "middle",
          boxSizing: "border-box",
          borderWidth: "0px",
          borderStyle: "solid",
          borderColor: "rgb(229, 231, 235)",
        }}
      >
        <path
          d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
          style={{
            boxSizing: "border-box",
            borderWidth: "0px",
            borderStyle: "solid",
            borderColor: "rgb(229, 231, 235)",
          }}
        ></path>
        <circle
          cx="9"
          cy="7"
          r="4"
          style={{
            boxSizing: "border-box",
            borderWidth: "0px",
            borderStyle: "solid",
            borderColor: "rgb(229, 231, 235)",
          }}
        ></circle>
        <path
          d="M22 21v-2a4 4 0 0 0-3-3.87"
          style={{
            boxSizing: "border-box",
            borderWidth: "0px",
            borderStyle: "solid",
            borderColor: "rgb(229, 231, 235)",
          }}
        ></path>
        <path
          d="M16 3.13a4 4 0 0 1 0 7.75"
          style={{
            boxSizing: "border-box",
            borderWidth: "0px",
            borderStyle: "solid",
            borderColor: "rgb(229, 231, 235)",
          }}
        ></path>
      </svg>
    ),
    title: "9. User Experience",
    items: [
      {
        subtitle: "Intuitive Interface",
        points: [
          "Step-by-step creation",
          "Drag-and-drop functionality",
          "Real-time validation",
          "Helpful tooltips",
        ],
      },
      {
        subtitle: "Mobile Optimization",
        points: [
          "Touch-friendly interface",
          "Mobile-first design",
          "Offline capabilities",
          "Fast loading times",
        ],
      },
    ],
  },
  {
    icon: (
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
        style={{
          color: "rgb(37, 99, 235)",
          width: "1.5rem",
          height: "24px",
          display: "block",
          verticalAlign: "middle",
          boxSizing: "border-box",
          borderWidth: "0px",
          borderStyle: "solid",
          borderColor: "rgb(229, 231, 235)",
        }}
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          style={{
            boxSizing: "border-box",
            borderWidth: "0px",
            borderStyle: "solid",
            borderColor: "rgb(229, 231, 235)",
          }}
        ></circle>
        <path
          d="m4.93 4.93 4.24 4.24"
          style={{
            boxSizing: "border-box",
            borderWidth: "0px",
            borderStyle: "solid",
            borderColor: "rgb(229, 231, 235)",
          }}
        ></path>
        <path
          d="m14.83 9.17 4.24-4.24"
          style={{
            boxSizing: "border-box",
            borderWidth: "0px",
            borderStyle: "solid",
            borderColor: "rgb(229, 231, 235)",
          }}
        ></path>
        <path
          d="m14.83 14.83 4.24 4.24"
          style={{
            boxSizing: "border-box",
            borderWidth: "0px",
            borderStyle: "solid",
            borderColor: "rgb(229, 231, 235)",
          }}
        ></path>
        <path
          d="m9.17 14.83-4.24 4.24"
          style={{
            boxSizing: "border-box",
            borderWidth: "0px",
            borderStyle: "solid",
            borderColor: "rgb(229, 231, 235)",
          }}
        ></path>
        <circle
          cx="12"
          cy="12"
          r="4"
          style={{
            boxSizing: "border-box",
            borderWidth: "0px",
            borderStyle: "solid",
            borderColor: "rgb(229, 231, 235)",
          }}
        ></circle>
      </svg>
    ),
    title: "10. Support System",
    items: [
      {
        subtitle: "Documentation",
        points: [
          "Comprehensive guides",
          "Video tutorials",
          "FAQ section",
          "Troubleshooting help",
        ],
      },
      {
        subtitle: "Customer Support",
        points: [
          "Email support",
          "Help center",
          "Community forums",
          "Priority support for premium users",
        ],
      },
    ],
  },
];

export { sections };
