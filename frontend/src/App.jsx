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
    eventStatus: "",
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [route, setRoute] = useState(window.location.hash || "");
  const [meetingModal, setMeetingModal] = useState({ open: false, title: "", link: "" });
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
    return statusOk;
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

  const closeMeetingModal = () => setMeetingModal({ open: false, title: "", link: "" });

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  if (route.startsWith("#/register/") && selectedEvent && showRegistrationForm) {
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
        <div className="floating-circle"></div>
        <div className="floating-circle"></div>
        <div className="floating-circle"></div>
      </div>

      {/* Header with Logo */}
      <div className="app-header">
        <img src="/RextroLogo.png" alt="Rextro" className="app-logo" />
        <h1 className="events-page-title">
          Engineering Faculty Events
        </h1>
        <p className="app-subtitle">Discover, Register & Participate in Academic Excellence</p>
      </div>
      
      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === "webinar" ? "active" : ""}`}
          onClick={() => handleTabClick("webinar")}
        >
          Webinars
        </button>
        <button 
          className={`tab-button ${activeTab === "workshop" ? "active" : ""}`}
          onClick={() => handleTabClick("workshop")}
        >
          Workshops
        </button>
        <button 
          className={`tab-button ${activeTab === "competition" ? "active" : ""}`}
          onClick={() => handleTabClick("competition")}
        >
          Competitions
        </button>
      </div>

      {/* Content Container */}
      <div className="content-container">
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
            title={getCurrentTitle()} 
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