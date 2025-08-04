import { useState, useEffect, useRef } from "react";
import {
  fetchCardById,
  fetchPublicCards,
  fetchCardByNameOrCompany,
  fetchPublicCardsCount, // imported count function
} from "../utils/fetchCards";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircleIcon, CopyIcon } from "lucide-react";
import CircularIndeterminate from "../components/common/Loader";
import useTitle from "../hooks/useTitle";

const Public = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // State for infinite scroll / initial cards
  const [publicCards, setPublicCards] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingUniversal, setLoadingUniversal] = useState(false);

  // State for total count of public cards
  const [totalCardsCount, setTotalCardsCount] = useState(0);

  // State for search
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  // Track whether a search API call is active
  const [isSearching, setIsSearching] = useState(false);

  // Other states
  const [view, setView] = useState("grid");
  const [sortBy, setSortBy] = useState("name");
  const [copiedStates, setCopiedStates] = useState({});

  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const observerRef = useRef(null);
  const sentinelRef = useRef(null);
  const hasFetchedRef = useRef(false);

  // Debounce search term (1000ms delay)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Function to load public cards (for infinite scroll)
  const loadPublicCards = async (isInitial = false) => {
    // Only load more if no search term is active
    if (searchTerm.trim() !== "") return;
    if (loadingUniversal) return;
    setLoadingUniversal(true);
    try {
      const pageSize = 12;
      const { cards, lastVisible: newLastVisible } = await fetchPublicCards(
        isInitial ? null : lastVisible,
        pageSize
      );
      setPublicCards((prevCards) =>
        isInitial ? cards : [...prevCards, ...cards]
      );
      setLastVisible(newLastVisible);
      if (cards.length < pageSize) {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error fetching public cards:", err);
    } finally {
      setLoadingUniversal(false);
    }
  };

  // On mount, if no search term, load public cards
  useEffect(() => {
    if (searchTerm.trim() === "") {
      loadPublicCards(true).then(() => {
        setInitialLoadDone(true);
      });
    }
  }, []); // Runs only once on mount

  // Intersection Observer for infinite scroll (only active when search term is empty)
  useEffect(() => {
    if (searchTerm.trim() !== "") return; // disable infinite scroll when searching
    if (!initialLoadDone || !hasMore) return; // only run if initial load is finished and there's more to load

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingUniversal) {
          loadPublicCards(false);
        }
      },
      { rootMargin: "100px" }
    );
    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [initialLoadDone, hasMore, loadingUniversal, lastVisible, searchTerm]);

  // Debounced search effect:
  // When a search term is present, filter the already fetched cards.
  // If none match, call the search API.
  useEffect(() => {
    if (!debouncedSearchTerm) return;

    const term = debouncedSearchTerm.toLowerCase();

    // Filter already fetched cards
    const filtered = publicCards.filter((card) => {
      const fullName =
        `${card.business.first || ""} ${card.business.last || ""}`.toLowerCase();
      const companyName = (card.business.name || "").toLowerCase();
      return fullName.includes(term) || companyName.includes(term);
    });

    if (filtered.length === 0) {
      setIsSearching(true);
      (async () => {
        try {
          const additionalCards =
            await fetchCardByNameOrCompany(debouncedSearchTerm);
          if (additionalCards.length > 0) {
            setPublicCards((prevCards) => [...prevCards, ...additionalCards]);
            // Optionally disable infinite scroll after a search
            setHasMore(false);
          }
        } catch (error) {
          console.error("Error fetching card by name:", error);
        } finally {
          setIsSearching(false);
        }
      })();
    } else {
      setIsSearching(false);
    }
  }, [debouncedSearchTerm, publicCards]);

  // Fetch total public cards count on mount
  useEffect(() => {
    (async () => {
      try {
        const count = await fetchPublicCardsCount();
        setTotalCardsCount(count);
      } catch (error) {
        console.error("Error fetching public cards count:", error);
      }
    })();
  }, []);

  async function handleCopy(shareableLink, cardId) {
    try {
      await navigator.clipboard.writeText(shareableLink);
      setCopiedStates((prev) => ({ ...prev, [cardId]: true }));
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [cardId]: false }));
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }

  async function handleView(cardId) {
    const { data } = await fetchCardById(cardId);
    navigate(`/view?cardId=${data._id}`, { state: { cardData: data } });
  }

  const truncate = (str, maxLength) => {
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength - 1) + "…";
  };

  // Map public cards for display
  const mappedPublicCards = publicCards.map((card) => ({
    visibility: card.visibility,
    profile: {
      profilePic: card.profile?.profilePic || null,
      cardName: card.profile?.cardName || "",
      businessCategory: card.profile?.businessCategory || "",
    },
    theme: card.theme,
    business: {
      first: card.business?.first || "",
      last: card.business?.last || "",
      jobTitle: card.business?.jobTitle || "",
      name: card.business?.name || "",
      email: card.business?.email || "",
      phone: card.business?.phone || "",
      website: card.business?.website || "",
      accreditations: card.business?.accreditations || "",
      address: card.business?.address || {},
      slogan: card.business?.slogan || "",
      department: card.business?.department || "",
    },
    social: card.social || {},
    about: card.about || {},
    cta: card.cta || {},
    uid: card.uid || "",
    _id: card._id,
    created: card?.createdAt,
  }));

  // For display filtering, use the live search term
  const filteredCards = mappedPublicCards.filter((card) => {
    const fullName =
      `${card.business.first || ""} ${card.business.last || ""}`.toLowerCase();
    const companyName = (card.business.name || "").toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      companyName.includes(searchTerm.toLowerCase())
    );
  });

  const sortedCards = [...filteredCards].sort((a, b) => {
    if (sortBy === "name") {
      const nameA = `${a.business.first} ${a.business.last}`.toLowerCase();
      const nameB = `${b.business.first} ${b.business.last}`.toLowerCase();
      return nameA.localeCompare(nameB);
    }
    if (sortBy === "company") {
      const compA = (a.business.name || "").toLowerCase();
      const compB = (b.business.name || "").toLowerCase();
      return compA.localeCompare(compB);
    }
    if (sortBy === "date") {
      return new Date(b.created).getTime() - new Date(a.created).getTime();
    }
    return 0;
  });

  // Rendering functions
  const renderGridView = (cardsArray) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
      {cardsArray.map((card, idx) => (
        <div
          key={idx}
          className="cursor-pointer bg-white border border-gray-200 rounded-lg shadow p-2"
          onClick={() => handleView(card._id)}
        >
          <div className="relative h-32">
            {card.profile.profilePic ? (
              <img
                src={card.profile.profilePic}
                alt="Profile"
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full"
              style={{backgroundColor: card.theme}}
              >
                
              </div>
            )}
            <div className="absolute inset-0 "></div>
            <div
              className="absolute bottom-0 left-0 right-0 h-1"
              style={{ backgroundColor: card.theme }}
            ></div>
          </div>
          <div className="p-2">
            <h3 className="text-gray-900 font-semibold text-base">
              {card.business.first} {card.business.last}
            </h3>
            <p className="text-sm mt-1">
              <span style={{ color: card.theme }}>
                {card.business.jobTitle || "Role"}
              </span>
              <span className="mx-1">•</span>
              <span className="font-medium">
                {card.business.name || "Company"}
              </span>
            </p>
            <div className="mt-4">
              <p className="text-sm text-gray-600 truncate">
                {card.business.email || "Email not provided"}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                {card.business.phone || "Phone not provided"}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderListView = (cardsArray) => (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          minWidth: "100%",
          textIndent: "0px",
          borderColor: "rgb(229, 231, 235)",
          borderCollapse: "collapse",
          boxSizing: "border-box",
          borderWidth: "0px",
          borderStyle: "solid",
        }}
      >
        <thead
          style={{
            backgroundColor: "rgb(249, 250, 251)",
            boxSizing: "border-box",
            borderWidth: "0px",
            borderStyle: "solid",
            borderColor: "rgb(229, 231, 235)",
          }}
        >
          <tr
            style={{
              boxSizing: "border-box",
              borderWidth: "0px",
              borderStyle: "solid",
              borderColor: "rgb(229, 231, 235)",
            }}
          >
            <th
              scope="col"
              style={{
                color: "rgb(107, 114, 128)",
                letterSpacing: "0.6px",
                textTransform: "uppercase",
                fontWeight: 500,
                fontSize: "12px",
                lineHeight: "16px",
                textAlign: "left",
                padding: "12px 24px",
                boxSizing: "border-box",
                borderStyle: "solid",
                borderColor: "rgb(229, 231, 235)",
              }}
            >
              Name
            </th>
            <th
              scope="col"
              style={{
                color: "rgb(107, 114, 128)",
                letterSpacing: "0.6px",
                textTransform: "uppercase",
                fontWeight: 500,
                fontSize: "12px",
                lineHeight: "16px",
                textAlign: "left",
                padding: "12px 24px",
                boxSizing: "border-box",
                borderStyle: "solid",
                borderColor: "rgb(229, 231, 235)",
              }}
            >
              Company
            </th>
            
            <th
              scope="col"
              style={{
                color: "rgb(107, 114, 128)",
                letterSpacing: "0.6px",
                textTransform: "uppercase",
                fontWeight: 500,
                fontSize: "12px",
                lineHeight: "16px",
                textAlign: "left",
                padding: "12px 24px",
                boxSizing: "border-box",
                borderStyle: "solid",
                borderColor: "rgb(229, 231, 235)",
              }}
            >
              URL
            </th>
          </tr>
        </thead>
        <tbody
          style={{
            backgroundColor: "rgb(255, 255, 255)",
            boxSizing: "border-box",
          }}
        >
          {cardsArray.map((card, idx) => (
            <tr
              onClick={() => handleView(card._id)}
              key={idx}
              style={{
                borderLeft: `4px solid ${card.theme}`,
                cursor: "pointer",
                boxSizing: "border-box",
                borderWidth: "0px 0px 1px 4px",
                borderStyle: "solid",
                borderColor: `rgb(229, 231, 235) rgb(229, 231, 235) rgb(229, 231, 235) ${card.theme}`,
              }}
            >
              <td
                style={{
                  padding: "16px 24px",
                  whiteSpace: "nowrap",
                  boxSizing: "border-box",
                  borderStyle: "solid",
                  borderColor: "rgb(229, 231, 235)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    boxSizing: "border-box",
                  }}
                >
                  {card.profile.profilePic ? (
                    <img
                      src={card.profile.profilePic}
                      alt=""
                      style={{
                        objectFit: "cover",
                        borderRadius: "9999px",
                        width: "2.5rem",
                        height: "40px",
                        display: "block",
                        verticalAlign: "middle",
                        boxSizing: "border-box",
                      }}
                    />
                  ) : (
                    <div
                      className="text-gray-500"
                      style={{
                        width: "2.8rem",
                        height: "45px",
                        borderRadius: "9999px",
                        backgroundColor: "rgb(229, 231, 235)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        fontSize: "0.6rem",
                      }}
                    >
                      No Image
                    </div>
                  )}
                  <div style={{ marginLeft: "16px", boxSizing: "border-box" }}>
                    <div
                      style={{
                        color: "rgb(17, 24, 39)",
                        fontWeight: 500,
                        fontSize: "14px",
                        lineHeight: "20px",
                        boxSizing: "border-box",
                      }}
                    >
                      {card.business.first} {card.business.last}
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        lineHeight: "20px",
                        boxSizing: "border-box",
                      }}
                    >
                      <span style={{ color: card.theme }}>
                        {card.business.jobTitle || "Role"}
                      </span>
                    </div>
                  </div>
                </div>
              </td>
              <td
                style={{
                  padding: "16px 24px",
                  whiteSpace: "nowrap",
                  boxSizing: "border-box",
                  borderStyle: "solid",
                  borderColor: "rgb(229, 231, 235)",
                }}
              >
                <div
                  style={{
                    color: "rgb(17, 24, 39)",
                    fontSize: "14px",
                    lineHeight: "20px",
                    boxSizing: "border-box",
                  }}
                >
                  {card.business.name || "Company"}
                </div>
              </td>
              
              <td
                style={{
                  padding: "16px 24px",
                  boxSizing: "border-box",
                  fontSize: "14px",
                  borderStyle: "solid",
                  borderColor: "rgb(229, 231, 235)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <a
                    href={`${window.location.origin}/view?cardId=${card._id}`}
                    rel="noopener noreferrer"
                    className="text-blue-600 no-underline overflow-hidden whitespace-nowrap text-ellipsis"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {truncate(
                      `${window.location.origin}/view?cardId=${card._id}`,
                      40
                    )}
                  </a>
                  <button
                    title="Copy URL"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(
                        `${window.location.origin}/view?cardId=${card._id}`,
                        card._id
                      );
                    }}
                    className={`transition-all duration-200 p-1 rounded-full cursor-pointer bg-transparent border-none flex items-center gap-1 ${
                      copiedStates[card._id]
                        ? "text-green-500"
                        : "text-gray-400"
                    }`}
                  >
                    {copiedStates[card._id] ? (
                      <CheckCircleIcon
                        width={20}
                        height={20}
                        className="text-green-500"
                      />
                    ) : (
                      <CopyIcon
                        width={20}
                        height={20}
                        className="text-gray-400"
                      />
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  useTitle("Members Directory | BizCardNow");

  return (
    <div className="bg-gray-50 min-h-[700px] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <span role="img" aria-label="Home" className="text-2xl">
                <button
                  className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                  onClick={() => navigate(-1)}
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 m-0">
                Members Directory
              </h1>
            </div>
            <p className="text-gray-500 mt-1 mx-14">
              {totalCardsCount} cards available
            </p>
          </div>
        </div>

        {/* Search & Controls */}
        <div className="shadow-sm p-6 bg-white border border-gray-200 rounded-lg mt-6">
  <div className="flex flex-col md:flex-row gap-4">
    {/* Search Bar */}
    <div className="relative flex-1">
      <svg
        className="w-5 h-5 text-gray-400 absolute top-2 left-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        type="text"
        placeholder="Search by name or company..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="
          w-full 
          pl-8 pr-4 py-2
          border border-gray-300 
          rounded-lg
          focus:outline-none focus:ring-2 focus:ring-blue-500
        "
      />
    </div>

    {/* View Toggle & Sort */}
    <div className="flex items-center gap-4 w-full md:w-auto">
      {/* Grid/List Toggle */}
      <div>
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setView("grid")}
            className={`p-2 rounded-md transition-colors ${
              view === "grid"
                ? "bg-white shadow-sm"
                : "text-gray-500 hover:bg-white hover:shadow-sm"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="block"
            >
              <rect x="3" y="3" width="18" height="18" rx="2"></rect>
              <path d="M3 9h18"></path>
              <path d="M3 15h18"></path>
              <path d="M9 3v18"></path>
              <path d="M15 3v18"></path>
            </svg>
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-2 rounded-md transition-colors ${
              view === "list"
                ? "bg-white shadow-sm"
                : "text-gray-500 hover:bg-white hover:shadow-sm"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="block"
            >
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Sort Dropdown */}
      <div className="flex-1">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <option value="name">Sort by Name</option>
          <option value="company">Sort by Company</option>
          <option value="date">Sort by Date</option>
        </select>
      </div>
    </div>
  </div>
</div>





        {/* Render Cards */}
        {loadingUniversal && publicCards.length === 0 ? (
          <CircularIndeterminate variant="small" className="mt-6" />
        ) : !loadingUniversal && sortedCards.length === 0 ? (
          // When no cards are found after loading:
          <div className="shadow-sm text-center py-12 bg-white border border-gray-200 rounded-lg mt-6">
            <p className="text-gray-500 m-0">
              {searchTerm.trim() !== ""
                ? isSearching
                  ? "Loading..."
                  : isAuthenticated
                    ? "No cards found. Create your first card!"
                    : "No public cards found"
                : "No public cards found"}
            </p>
          </div>
        ) : view === "grid" ? (
          renderGridView(sortedCards)
        ) : (
          renderListView(sortedCards)
        )}

        {/* Sentinel element for triggering infinite scroll */}
        <div ref={sentinelRef} />

        {/* Loader for additional pages */}
        {loadingUniversal && hasMore && publicCards.length > 0 && (
          <div className="flex justify-center mt-6">
            <CircularIndeterminate variant="small" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Public;
