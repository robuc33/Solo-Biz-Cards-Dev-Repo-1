import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import SignInModal from "../components/SignInModal";
import SignUpModal from "../components/SignUpModal";

export default function PassiveIncome() {
  const navigate = useNavigate();
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  return (
    <div className="text-base leading-[30px] box-border border-0 border-solid border-gray-200">
      <Header onShowSignIn={() => setIsSignInOpen(true)} />
      <main className="flex-1">
        <div className="py-10 px-4 bg-gray-50 min-h-screen">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white border-1 border-gray-200 rounded-[10px] shadow-sm overflow-hidden">
              <div className="flex items-center gap-5 px-[30px] py-5 border-b-1 border-gray-200">
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
                <div className="flex items-center gap-[15px]">
                  <h1 className="text-[30px] font-bold leading-[40px] text-gray-900">
                    💰 Earn Passive Income
                  </h1>
                </div>
              </div>
              <div className="p-3 sm:p-8">
                {/* Header Section */}
                <section className="p-6 bg-gradient-to-r from-[rgb(239,246,255)] to-[rgb(238,242,255)] border border-[rgb(219,234,254)] rounded-lg">
                  <h2 className="text-blue-900 font-bold text-2xl leading-10 mb-5">
                    Why Settle for Ordinary Business Cards When You Can Earn
                    While You Connect?
                  </h2>
                  <h3 className="text-blue-800 font-semibold text-xl leading-9 mb-5">
                    Unlock the Power of Your Business Card, Earn Passive Income
                    for Free! with BizCardNow.com
                  </h3>
                  <p className="text-blue-700 leading-8">
                    Imagine turning a simple everyday action—sharing your
                    business card—into a source of passive income. With our free
                    digital business card service, you can do just that! Not
                    only do you get a modern, professional way to share your
                    contact information, but you also unlock the opportunity to
                    earn money effortlessly by sharing it with others. Ready to
                    make your business card work harder for you? Let's dive in!
                  </p>
                </section>

                {/* Revenue Stream Section */}
                <section className="mt-10">
                  <h2 className="text-gray-900 font-semibold text-xl leading-9 mb-5">
                    📈 Turn Your Digital Business Card into a Revenue Stream
                  </h2>
                  <p className="text-gray-700 leading-8">
                    Transform your digital business card into a powerful
                    income-generating tool. Our platform offers multiple ways to
                    monetize your professional network and create passive income
                    streams.
                  </p>
                </section>

                {/* Income Opportunities Section */}
                <section className="mt-10">
                  <h2 className="text-gray-900 font-semibold text-xl leading-9 mb-5">
                    ⭐ Income Opportunities
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                    {/* Referral Program */}
                    <div className="p-7 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <h3 className="text-gray-900 font-medium text-lg leading-9 mb-4">
                        ✅ Referral Program
                      </h3>
                      <ul className="text-gray-700">
                        <li>• Earn commission for each new user you refer</li>
                        <li className="mt-2">
                          • Get paid when referrals upgrade to premium
                        </li>
                        <li className="mt-2">
                          • Lifetime commission on recurring subscriptions
                        </li>
                      </ul>
                    </div>
                    {/* Affiliate Marketing */}
                    <div className="p-7 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <h3 className="text-gray-900 font-medium text-lg leading-9 mb-4">
                        ✅ Affiliate Marketing
                      </h3>
                      <ul className="text-gray-700">
                        <li>• Promote relevant products and services</li>
                        <li className="mt-2">
                          • Earn commission on successful referrals
                        </li>
                        <li className="mt-2">
                          • Track performance in real-time
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* How It Works Section */}
                <section className="mt-10">
                  <h2 className="text-gray-900 font-semibold text-xl leading-9 mb-5">
                    📱 How It Works
                  </h2>
                  <div className="p-1 sm:p-7 bg-gray-50 rounded-lg">
                    <ol className="list-decimal pl-5">
                      <li className="flex gap-4">
                        <span className="text-blue-600 font-bold">1.</span>
                        <div>
                          <h4 className="text-gray-900 font-medium text-lg">
                            Create Your Card
                          </h4>
                          <p className="text-gray-700">
                            Design your professional digital business card with
                            our easy-to-use tools.
                          </p>
                        </div>
                      </li>
                      <li className="flex gap-4 mt-5">
                        <span className="text-blue-600 font-bold">2.</span>
                        <div>
                          <h4 className="text-gray-900 font-medium text-lg">
                            Share &amp; Promote
                          </h4>
                          <p className="text-gray-700">
                            Share your card across your network and social media
                            platforms.
                          </p>
                        </div>
                      </li>
                      <li className="flex gap-4 mt-5">
                        <span className="text-blue-600 font-bold">3.</span>
                        <div>
                          <h4 className="text-gray-900 font-medium text-lg">
                            Track &amp; Earn
                          </h4>
                          <p className="text-gray-700">
                            Monitor your earnings and performance through our
                            analytics dashboard.
                          </p>
                        </div>
                      </li>
                    </ol>
                  </div>
                </section>

                {/* Benefits Section */}
                <section className="mt-10">
                  <h2 className="text-gray-900 font-semibold text-xl leading-9 mb-5">
                    💰 Benefits
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
                    <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <h3 className="text-gray-900 font-medium text-lg mb-2">
                        Passive Income
                      </h3>
                      <p className="text-gray-700">
                        Earn money while you focus on your business
                      </p>
                    </div>
                    <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <h3 className="text-gray-900 font-medium text-lg mb-2">
                        No Extra Work
                      </h3>
                      <p className="text-gray-700">
                        Your card works for you 24/7
                      </p>
                    </div>
                    <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <h3 className="text-gray-900 font-medium text-lg mb-2">
                        Scalable Income
                      </h3>
                      <p className="text-gray-700">
                        Earnings grow with your network
                      </p>
                    </div>
                  </div>
                </section>

                {/* Call-to-Action Section */}
                <section className="p-8 bg-blue-50 rounded-lg mt-10">
                  <h2 className="text-blue-900 font-semibold text-xl leading-9 mb-4">
                    ⭐ Start Earning Today
                  </h2>
                  <p className="text-blue-700 mb-6">
                    Join our community of successful entrepreneurs who are
                    already earning passive income with their digital business
                    cards.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                      onClick={() => navigate("/new-card")}
                    >
                      Create Your Card
                    </button>
                    <button
                      className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                      onClick={() => navigate("/how-to-use")}
                    >
                      Learn More
                    </button>
                  </div>
                </section>

                {/* Earning Potential Section */}
                <section className="mt-10">
                  <h2 className="text-gray-900 font-semibold text-xl leading-9 mb-5">
                    💎 Your Earning Potential, Unleashed
                  </h2>
                  <p className="text-gray-700 mb-7">
                    We've created three levels to help you maximize your
                    earnings—whether you're an individual, a small business, or
                    a bustling retailer. Pick your level and watch the income
                    roll in:
                  </p>
                  <div>
                    {/* Gold-Volume Affiliate */}
                    <div className="p-7 bg-gradient-to-r from-[rgb(254,252,232)] to-[rgb(254,249,195)] border border-[rgb(254,240,138)] rounded-lg">
                      <h3 className="text-yellow-800 font-semibold text-lg mb-4">
                        🏆 Gold-Volume Affiliate
                      </h3>
                      <ul className="text-yellow-900">
                        <li>
                          • Recruit 250–500 free card users (minimum 200
                          required)
                        </li>
                        <li className="mt-2">
                          • Then, 200 of your recruits must each recruit at
                          least 50 free card users
                        </li>
                        <li className="mt-2">
                          • Potential Earnings: $5,000–$10,000 Monthly Recurring
                          Revenue (MRR)
                        </li>
                        <li className="mt-2">
                          • Perfect for high-traffic spots like take-out
                          restaurants or grocery stores
                        </li>
                      </ul>
                    </div>
                    {/* Silver-Volume Affiliate */}
                    <div className="p-7 bg-gradient-to-r from-[rgb(249,250,251)] to-[rgb(243,244,246)] border border-gray-200 rounded-lg mt-7">
                      <h3 className="text-gray-900 font-semibold text-lg mb-4">
                        🥈 Silver-Volume Affiliate
                      </h3>
                      <ul className="text-gray-800">
                        <li>
                          • Recruit 150–250 free card users (minimum 100
                          required)
                        </li>
                        <li className="mt-2">
                          • Then, 100 of your recruits must each recruit at
                          least 50 free card users
                        </li>
                        <li className="mt-2">
                          • Potential Earnings: $2,000–$5,000 MRR
                        </li>
                        <li className="mt-2">
                          • Great for medium-traffic businesses like dry
                          cleaners, barber shops, accountants, or lawyers
                        </li>
                      </ul>
                    </div>
                    {/* Bronze-Volume Affiliate */}
                    <div className="p-7 bg-gradient-to-r from-[rgb(255,247,237)] to-[rgb(255,237,213)] border border-[rgb(254,215,170)] rounded-lg mt-7">
                      <h3 className="text-orange-700 font-semibold text-lg mb-4">
                        🥉 Bronze-Volume Affiliate
                      </h3>
                      <ul className="text-orange-800">
                        <li>
                          • Recruit 75–125 free card users (minimum 50 required)
                        </li>
                        <li className="mt-2">
                          • Then, 50 of your recruits must each recruit at least
                          50 free card users
                        </li>
                        <li className="mt-2">
                          • Potential Earnings: $1,000–$2,750 MRR
                        </li>
                        <li className="mt-2">
                          • Ideal for low-traffic businesses, individuals, or
                          entrepreneurs
                        </li>
                      </ul>
                    </div>
                    <p className="text-gray-700 italic mt-5">
                      Start small or aim big—your earnings grow as your network
                      does!
                    </p>
                  </div>
                </section>

                {/* Final Call-to-Action Section */}
                <section className="p-7 bg-green-50 border border-green-200 rounded-lg mt-10">
                  <h2 className="text-green-800 font-semibold text-xl leading-9 mb-5">
                    🚀 Start Earning Today!
                  </h2>
                  <p className="text-green-700 mb-7">
                    Why wait? With our free digital business card service, you
                    can start building passive income right now. It's:
                  </p>
                  <ul className="text-green-800 list-disc pl-5">
                    <li>✨ Free: No cost to get started</li>
                    <li className="mt-2">
                      🎯 Effortless: Just share your card like always
                    </li>
                    <li className="mt-2">
                      💰 Rewarding: Earn $1,000–$10,000 a month, depending on
                      your level
                    </li>
                  </ul>
                  <p className="text-green-700 mt-5">
                    Sign up today at{" "}
                    <a
                      href="https://bizcardnow.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-800 font-semibold"
                    >
                      BizCardNow.com
                    </a>{" "}
                    and turn your business card into a money-making machine.
                    It's quick, easy, and could be the start of something big.
                    Don't miss out—join the thousands already earning with us!
                  </p>
                </section>

                {/* Final Sign Up Section */}
                <section className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h2 className="text-gray-900 font-semibold text-xl leading-9 mb-5">
                    🎯 Take the First Step Now!
                  </h2>
                  <p className="text-blue-700">
                    Every card you share is a step toward financial freedom.
                    Sign up for your free digital business card at{" "}
                    <a
                      href="https://bizcardnow.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-900 font-semibold"
                    >
                      BizCardNow.com
                    </a>{" "}
                    and start earning passive income today. Your network is your
                    net worth—make it count!
                  </p>
                </section>
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
