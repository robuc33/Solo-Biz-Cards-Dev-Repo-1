import React from "react";

const ContactModal = ({
  showContactModal,
  handleCloseContactModal,
  contactModalAnimateClass,
  username,
  onSubmitContact,
  isSubmitting,
  receivedCardData,
  theme,
}) => {
  const themeColor = theme || "#2871FA";
  return (
    <>
      {showContactModal && (
        <div
          className="fixed inset-0 flex items-end justify-center bg-black/30"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseContactModal();
          }}
        >
          {/* Outer Container */}
          <div className="relative">
            {/* Modal Container */}
            <div
              className={`
                relative 
                bg-white 
                w-[97%]   
                max-w-[28rem]  
                mx-2                 
                max-h-[98dvh] 
                rounded-t-3xl 
                shadow-2xl 
                overflow-visible 
                transform 
                transition-transform 
                duration-700 
                ${contactModalAnimateClass}
              `}
              role="dialog"
              aria-modal="true"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={handleCloseContactModal}
                className="absolute top-4 right-4 p-2 bg-white z-10 cursor-pointer rounded-full hover:scale-110 transition-transform"
                aria-label="Close"
              >
                <svg
                  style={{
                    fill: "rgb(0, 0, 0)",
                    height: "24px",
                    width: "24px",
                  }}
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </button>

              {/* Profile Picture Overlap */}
              <div className="absolute left-1/2 transform -translate-x-1/2 -top-13 z-10">
                {/** Profile image remains the same **/}
                {receivedCardData.profile?.profilePic ? (
                  <img
                    src={receivedCardData.profile.profilePic}
                    alt="Profile"
                    className="w-26 h-26 rounded-full border-4 border-white object-cover"
                  />
                ) : (
                  <div className="w-26 h-26 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center text-sm text-gray-600">
                    No image
                  </div>
                )}
              </div>

              {/* Scrollable Content Area with rounded clipping */}
              <div className="rounded-t-3xl overflow-hidden">
                <div className="overflow-y-auto max-h-[calc(98dvh-4rem)] pt-16 pb-6 px-6">
                  <h2 className="text-xl font-bold text-gray-900 text-center mb-6">
                    Send your contact information to "{username}"
                  </h2>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      // Collect form data and pass to onSubmitContact
                      const formData = new FormData(e.target);
                      const data = Object.fromEntries(formData.entries());
                      onSubmitContact(data);
                    }}
                    className="space-y-4"
                  >
                    {/* First Name & Last Name */}

                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      required
                      className="w-full border-b border-gray-200 p-2 focus:outline-none focus:border-blue-300"
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      required
                      className="w-full border-b border-gray-200 p-2 focus:outline-none focus:border-blue-300"
                    />
                    {/* Email */}
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      required
                      className="w-full border-b border-gray-200 p-2 focus:outline-none focus:border-blue-300"
                    />

                    {/* Phone Number */}
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      required
                      className="w-full border-b border-gray-200 p-2 focus:outline-none focus:border-blue-300"
                    />

                    {/* Job Title & Company Name */}

                    <input
                      type="text"
                      name="jobTitle"
                      placeholder="Job Title"
                      className="w-full border-b border-gray-200 p-2 focus:outline-none focus:border-blue-300"
                    />
                    <input
                      type="text"
                      name="companyName"
                      placeholder="Company Name"
                      className="w-full border-b border-gray-200 p-2 focus:outline-none focus:border-blue-300"
                    />

                    {/* Notes (max 80 characters) */}
                    <textarea
                      name="notes"
                      placeholder="Notes…"
                      maxLength="80"
                      className="w-full border-b border-gray-200 p-2 focus:outline-none focus:border-blue-300 resize-none"
                    ></textarea>
                    <div className="-mt-5 text-gray-400 ml-1 text-xs">
                      max 80 characters
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full  text-white rounded-lg py-2 font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 cursor-pointer"
                      style={{ background: themeColor }}
                    >
                      {!isSubmitting
                        ? `Send contact information`
                        : "Sending..."}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContactModal;
