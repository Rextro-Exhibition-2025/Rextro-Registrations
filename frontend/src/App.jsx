import React, { useState, useEffect } from "react";
import "./App.css";
import FilterBar from "./components/FilterBar";
import CategorySection from "./components/CategorySection";
import RegistrationModal from "./components/RegistrationModal";
import RegistrationForm from "./components/RegistrationForm";
import MeetingLinkModal from "./components/MeetingLinkModal";

function App() {
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("webinar");
  const [filters, setFilters] = useState({
    society: "",
    eventStatus: "",
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [route, setRoute] = useState(window.location.hash || "");
  const [meetingModal, setMeetingModal] = useState({
    open: false,
    title: "",
    link: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:5000/events")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  // Enhanced smooth scrolling for better browser compatibility
  useEffect(() => {
    const smoothScrollTo = (target, duration = 800) => {
      const targetElement =
        typeof target === "string" ? document.querySelector(target) : target;
      if (!targetElement) return;

      const targetPosition = targetElement.offsetTop;
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      let startTime = null;

      const animation = (currentTime) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
      };

      const ease = (t, b, c, d) => {
        t /= d / 2;
        if (t < 1) return (c / 2) * t * t + b;
        t--;
        return (-c / 2) * (t * (t - 2) - 1) + b;
      };

      requestAnimationFrame(animation);
    };

    // Add smooth scroll to all anchor links
    const handleAnchorClick = (e) => {
      const href = e.target.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        smoothScrollTo(href);
      }
    };

    // Add event listeners to all anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach((link) => {
      link.addEventListener("click", handleAnchorClick);
    });

    // Cleanup
    return () => {
      anchorLinks.forEach((link) => {
        link.removeEventListener("click", handleAnchorClick);
      });
    };
  }, []);

  // Simple hash-based routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      setRoute(hash);
      // Expecting format: #/register/<eventId>
      const match = hash.match(/^#\/register\/(.+)$/);
      if (match && match[1]) {
        const ev = events.find((e) => String(e.id) === String(match[1]));
        if (ev) {
          setSelectedEvent(ev);
          setShowRegistrationForm(true);
          setShowModal(false);
        }
      } else {
        setShowRegistrationForm(false);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange();
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [events]);

  const filteredEvents = events.filter((ev) => {
    const societyOk = filters.society === "" || ev.society === filters.society;
    const statusOk = (() => {
      if (!filters.eventStatus) return true;
      if (!ev.eventDate) return false;
      try {
        const today = new Date();
        const evDate = new Date(ev.eventDate);
        today.setHours(0, 0, 0, 0);
        evDate.setHours(0, 0, 0, 0);

        if (filters.eventStatus === "upcoming") {
          return evDate >= today;
        } else if (filters.eventStatus === "ended") {
          return evDate < today;
        }
        return true;
      } catch {
        return false;
      }
    })();
    return societyOk && statusOk;
  });

  const webinars = filteredEvents.filter(
    (ev) => ev.type.toLowerCase() === "session"
  );
  const workshops = filteredEvents.filter(
    (ev) => ev.type.toLowerCase() === "workshop"
  );
  const competitions = filteredEvents.filter(
    (ev) => ev.type.toLowerCase() === "competition"
  );

  const handleRegisterClick = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  const handleProceedToRegistration = () => {
    if (!selectedEvent) return;
    window.location.hash = `#/register/${selectedEvent.id}`;
  };

  const handleRegistrationFormClose = () => {
    setShowRegistrationForm(false);
    setSelectedEvent(null);
    window.location.hash = "";
  };

  const handleRegistrationSubmit = (registrationData) => {
    console.log("Registration submitted:", registrationData);
    alert("Registration submitted successfully!");
    handleRegistrationFormClose();
  };

  const handleMeetingLinkClick = (ev, payload) => {
    setMeetingModal({ open: true, title: ev.title, link: payload?.link || "" });
  };

  const closeMeetingModal = () =>
    setMeetingModal({ open: false, title: "", link: "" });

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleLogoClick = () => {
    // Navigate to home page (reset to default state)
    setActiveTab("webinar");
    setFilters({ society: "", eventStatus: "" });
    window.location.hash = "";
  };

  if (
    route.startsWith("#/register/") &&
    selectedEvent &&
    showRegistrationForm
  ) {
    return (
      <div className="app-container">
        <RegistrationForm
          event={selectedEvent}
          onClose={handleRegistrationFormClose}
          onSubmit={handleRegistrationSubmit}
        />
      </div>
    );
  }

  const getCurrentEvents = () => {
    switch (activeTab) {
      case "webinar":
        return webinars;
      case "workshop":
        return workshops;
      case "competition":
        return competitions;
      default:
        return webinars;
    }
  };

  const getCurrentTitle = () => {
    switch (activeTab) {
      case "webinar":
        return "Webinars & Sessions";
      case "workshop":
        return "Workshops";
      case "competition":
        return "Competitions";
      default:
        return "Webinars & Sessions";
    }
  };

  return (
    <div className="app-container">
      {/* Floating Background Elements */}
      <div className="floating-elements">
        <div className="floating-circle floating-circle-1"></div>
        <div className="floating-circle floating-circle-2"></div>
        <div className="floating-circle floating-circle-3"></div>
        <div className="floating-circle floating-circle-4"></div>
        <div className="floating-circle floating-circle-5"></div>
        <div className="floating-circle floating-circle-6"></div>
        <div className="floating-bubble floating-bubble-1"></div>
        <div className="floating-bubble floating-bubble-2"></div>
        <div className="floating-bubble floating-bubble-3"></div>
        <div className="floating-bubble floating-bubble-4"></div>
        <div className="floating-star floating-star-1"></div>
        <div className="floating-star floating-star-2"></div>
        <div className="floating-star floating-star-3"></div>
        <div className="floating-hexagon floating-hexagon-1"></div>
        <div className="floating-hexagon floating-hexagon-2"></div>
      </div>

      {/* Top Navigation Bar */}
      <div className="top-navigation">
        {/* Retro Logo - Left Corner */}
        <div className="nav-logo" onClick={handleLogoClick}>
          <img src="/RextroLogo.png" alt="Rextro" className="retro-logo" />
        </div>

        {/* Tab Navigation - Right Side */}
        <div className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === "webinar" ? "active" : ""}`}
            onClick={() => handleTabClick("webinar")}
          >
            Webinars
          </button>
          <button
            className={`nav-tab ${activeTab === "workshop" ? "active" : ""}`}
            onClick={() => handleTabClick("workshop")}
          >
            Workshops
          </button>
          <button
            className={`nav-tab ${activeTab === "competition" ? "active" : ""}`}
            onClick={() => handleTabClick("competition")}
          >
            Competitions
          </button>
        </div>
      </div>

      {/* Header with Title */}
      <div className="app-header">
        <h1 className="events-page-title">Engineering Faculty Events</h1>
        <p className="app-subtitle">
          Discover, Register & Participate in Academic Excellence
        </p>
      </div>

      {/* Content Container */}
      <div className="content-container">
        {/* Category Title */}
        <div className="category-title-wrapper">
          <h2 className="category-title">{getCurrentTitle()}</h2>
        </div>

        {/* Filter Bar */}
        <FilterBar filters={filters} setFilters={setFilters} />

        {/* Loading State */}
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <div className="loading-text">Loading events...</div>
          </div>
        ) : (
          /* Current Tab Content */
          <CategorySection
            events={getCurrentEvents()}
            onRegisterClick={handleRegisterClick}
            onMeetingLinkClick={handleMeetingLinkClick}
          />
        )}
      </div>

      {/* Modals */}
      {selectedEvent && (
        <RegistrationModal
          event={selectedEvent}
          isOpen={showModal}
          onClose={handleModalClose}
          onRegister={handleProceedToRegistration}
        />
      )}

      <MeetingLinkModal
        isOpen={meetingModal.open}
        onClose={closeMeetingModal}
        title={meetingModal.title}
        link={meetingModal.link}
      />
    </div>
  );
}

export default App;
