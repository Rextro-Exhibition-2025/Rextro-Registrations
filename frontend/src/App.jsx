import React, { useState, useEffect } from "react";
import FilterBar from "./components/FilterBar";
import CategorySection from "./components/CategorySection";
import RegistrationModal from "./components/RegistrationModal";
import RegistrationForm from "./components/RegistrationForm";

function App() {
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({
    department: "",
    society: "",
    date: "",
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/events")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error(err));
  }, []);

  const filteredEvents = events.filter((ev) => {
    return (
      (filters.department === "" || ev.department === filters.department) &&
      (filters.society === "" || ev.society === filters.society) &&
      (filters.date === "" || ev.eventDate === filters.date)
    );
  });

  const sessions = filteredEvents.filter(
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
    setShowModal(false);
    setShowRegistrationForm(true);
  };

  const handleRegistrationFormClose = () => {
    setShowRegistrationForm(false);
    setSelectedEvent(null);
  };

  const handleRegistrationSubmit = (registrationData) => {
    console.log("Registration submitted:", registrationData);
    
    // Here you can send the registration data to your backend
    // For now, we'll just show an alert and close the form
    alert("Registration submitted successfully!");
    handleRegistrationFormClose();
  };

  return (
    <div>
      <h1 className="events-page-title">Engineering Faculty Events</h1>
      <FilterBar filters={filters} setFilters={setFilters} />
      <CategorySection 
        title="Sessions" 
        events={sessions} 
        onRegisterClick={handleRegisterClick}
      />
      <CategorySection 
        title="Workshops" 
        events={workshops} 
        onRegisterClick={handleRegisterClick}
      />
      <CategorySection 
        title="Competitions" 
        events={competitions} 
        onRegisterClick={handleRegisterClick}
      />

      {/* Registration Modal */}
      {selectedEvent && (
        <RegistrationModal
          event={selectedEvent}
          isOpen={showModal}
          onClose={handleModalClose}
          onRegister={handleProceedToRegistration}
        />
      )}

      {/* Registration Form */}
      {selectedEvent && showRegistrationForm && (
        <RegistrationForm
          event={selectedEvent}
          onClose={handleRegistrationFormClose}
          onSubmit={handleRegistrationSubmit}
        />
      )}
    </div>
  );
}

export default App;
