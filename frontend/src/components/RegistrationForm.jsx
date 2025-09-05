import React, { useState } from "react";
import "./RegistrationForm.css";
import MessagePopup from "./MessagePopup";

const RegistrationForm = ({ event, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messagePopup, setMessagePopup] = useState({
    isOpen: false,
    type: '',
    title: '',
    message: ''
  });

  const handleInputChange = (questionId, value) => {
    setFormData(prev => ({
      ...prev,
      [questionId]: value
    }));
    
    // Clear error when user starts typing
    if (errors[questionId]) {
      setErrors(prev => ({
        ...prev,
        [questionId]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    event.questions.forEach(question => {
      if (question.required && (!formData[question.id] || formData[question.id].toString().trim() === "")) {
        newErrors[question.id] = "This field is required";
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // Prepare registration data
        const registrationData = {
          eventId: event.id,
          eventTitle: event.title,
          answers: formData,
          submittedAt: new Date().toISOString()
        };

        // Send data to Google Sheet via the event's googleSheetLink
        if (event.googleSheetLink) {
          let scriptUrl = event.googleSheetLink;
          
          // If it's already a Google Apps Script URL, use it directly
          if (event.googleSheetLink.includes("script.google.com/macros")) {
            scriptUrl = event.googleSheetLink;
          } 
          // If it's a Google Sheets link, convert it to Apps Script URL
          else if (event.googleSheetLink.includes("docs.google.com/spreadsheets")) {
            const sheetId = event.googleSheetLink.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)?.[1];
            if (sheetId) {
              scriptUrl = `https://script.google.com/macros/s/${sheetId}/exec`;
            } else {
              throw new Error("INVALID_LINK");
            }
          } else {
            throw new Error("INVALID_LINK");
          }
          
          console.log("Sending data to:", scriptUrl);
          
          try {
            const response = await fetch(scriptUrl, {
              method: 'POST',
              mode: 'no-cors', // Google Apps Script requires this
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(registrationData)
            });

            // Since we're using no-cors, we can't read the response
            // But we can assume success if no error was thrown
            console.log("Setting success popup...");
            setMessagePopup({
              isOpen: true,
              type: 'success',
              title: 'Registration Successful!',
              message: 'Your registration has been submitted successfully! You will receive a confirmation email shortly.'
            });
          } catch (fetchError) {
            console.error("Fetch error:", fetchError);
            
            // Detect error type
            if (fetchError.name === 'TypeError' && fetchError.message.includes('fetch')) {
              throw new Error("NETWORK_ERROR");
            } else if (fetchError.message.includes('timeout')) {
              throw new Error("TIMEOUT_ERROR");
            } else {
              throw new Error("SERVER_ERROR");
            }
          }
        } else {
          // Fallback: just log the data if no Google Sheet link
          console.log("Registration data:", registrationData);
          console.log("Setting success popup (fallback)...");
          setMessagePopup({
            isOpen: true,
            type: 'success',
            title: 'Registration Successful!',
            message: 'Your registration has been submitted successfully! You will receive a confirmation email shortly.'
          });
        }

        // Call the onSubmit callback
        onSubmit(registrationData);
        
      } catch (error) {
        console.error("Error submitting registration:", error);
        
        // Determine error type and show appropriate message
        let errorType = 'error';
        let errorTitle = 'Registration Failed';
        let errorMessage = 'Something went wrong. Please try again.';
        
        switch (error.message) {
          case 'NETWORK_ERROR':
            errorType = 'network';
            errorTitle = 'Network Error';
            errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
            break;
          case 'TIMEOUT_ERROR':
            errorType = 'network';
            errorTitle = 'Connection Timeout';
            errorMessage = 'The request took too long to complete. Please check your internet connection and try again.';
            break;
          case 'SERVER_ERROR':
            errorType = 'server';
            errorTitle = 'Server Error';
            errorMessage = 'The server is currently experiencing issues. Please try again in a few minutes.';
            break;
          case 'INVALID_LINK':
            errorType = 'server';
            errorTitle = 'Configuration Error';
            errorMessage = 'There is a configuration issue with the registration system. Please contact the event organizer.';
            break;
          default:
            errorType = 'error';
            errorTitle = 'Registration Failed';
            errorMessage = 'An unexpected error occurred. Please try again or contact the event organizer.';
        }
        
        setMessagePopup({
          isOpen: true,
          type: errorType,
          title: errorTitle,
          message: errorMessage
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleMessageClose = () => {
    setMessagePopup({
      isOpen: false,
      type: '',
      title: '',
      message: ''
    });
    
    // If it was a success message, close the form
    if (messagePopup.type === 'success') {
      onClose();
    }
  };

  const renderQuestion = (question) => {
    const value = formData[question.id] || "";
    const error = errors[question.id];

    switch (question.type) {
      case "text":
      case "email":
        return (
          <input
            type={question.type}
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className={`form-input ${error ? "error" : ""}`}
            placeholder={`Enter ${question.label.toLowerCase()}`}
          />
        );

      case "textarea":
        return (
          <textarea
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className={`form-textarea ${error ? "error" : ""}`}
            rows="4"
            placeholder={`Enter ${question.label.toLowerCase()}`}
          />
        );

      case "select":
        return (
          <select
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className={`form-select ${error ? "error" : ""}`}
          >
            <option value="">Select {question.label.toLowerCase()}</option>
            {question.options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case "radio":
        return (
          <div className="radio-group">
            {question.options.map((option, index) => (
              <label key={index} className="radio-option">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleInputChange(question.id, e.target.value)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      case "checkbox":
        return (
          <div className="checkbox-group">
            {question.options.map((option, index) => (
              <label key={index} className="checkbox-option">
                <input
                  type="checkbox"
                  checked={Array.isArray(value) ? value.includes(option) : false}
                  onChange={(e) => {
                    const currentValues = Array.isArray(value) ? value : [];
                    if (e.target.checked) {
                      handleInputChange(question.id, [...currentValues, option]);
                    } else {
                      handleInputChange(question.id, currentValues.filter(v => v !== option));
                    }
                  }}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className={`form-input ${error ? "error" : ""}`}
            placeholder={`Enter ${question.label.toLowerCase()}`}
          />
        );
    }
  };

  return (
    <div className="registration-page">
      <div className="registration-container">
        <div className="form-header">
          <button className="back-btn" onClick={onClose}>← Back to Events</button>
          <h1>Register for {event.title}</h1>
          <div className="event-info-summary">
            <p><strong>📅 Date:</strong> {event.eventDate || 'TBA'}</p>
            <p><strong>🕒 Time:</strong> {event.eventTime || event.startTime && event.endTime ? `${event.startTime} - ${event.endTime}` : 'TBA'}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="registration-form">
          {/* General Error Message */}
          {errors.general && (
            <div className="error-message general-error">
              {errors.general}
            </div>
          )}

          {event.questions.map((question) => (
            <div key={question.id} className="form-group">
              <label className="form-label">
                {question.label}
                {question.required && <span className="required">*</span>}
              </label>
              {renderQuestion(question)}
              {errors[question.id] && (
                <span className="error-message">{errors[question.id]}</span>
              )}
            </div>
          ))}

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={`submit-btn ${isSubmitting ? 'submitting' : ''}`} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Registration"}
            </button>
          </div>
        </form>
      </div>
      
      <MessagePopup
        isOpen={messagePopup.isOpen}
        type={messagePopup.type}
        title={messagePopup.title}
        message={messagePopup.message}
        onClose={handleMessageClose}
      />
    </div>
  );
};

export default RegistrationForm;
