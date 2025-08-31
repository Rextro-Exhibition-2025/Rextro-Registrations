import React, { useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    type: "",
    title: "",
    shortDescription: "",
    longDescription: "",
    registrationOpenDate: "",
    registrationCloseDate: "",
    eventDate: "",
    society: "",
    department: "",
    image: "",
    googleSheetLink: "",
    questions: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showQuestionManager, setShowQuestionManager] = useState(false);

  // Question templates for each event type
  const questionTemplates = {
    Session: [
      { id: "name", order: 1, type: "text", label: "Full Name", required: true, conditional: null, options: [] },
      { id: "email", order: 2, type: "email", label: "Email Address", required: true, conditional: null, options: [] },
      { id: "department", order: 3, type: "select", label: "Department", required: true, conditional: null, options: ["CSE", "Mechanical", "Electrical", "Civil", "Marine"] },
      { id: "year", order: 4, type: "select", label: "Year of Study", required: true, conditional: null, options: ["1st Year", "2nd Year", "3rd Year", "4th Year"] },
      { id: "experience", order: 5, type: "radio", label: "Previous Session Experience", required: false, conditional: null, options: ["None", "Beginner", "Intermediate", "Advanced"] },
      { id: "topics", order: 6, type: "textarea", label: "Specific Topics of Interest", required: false, conditional: null, options: [] }
    ],
    Workshop: [
      { id: "name", order: 1, type: "text", label: "Full Name", required: true, conditional: null, options: [] },
      { id: "email", order: 2, type: "email", label: "Email Address", required: true, conditional: null, options: [] },
      { id: "department", order: 3, type: "select", label: "Department", required: true, conditional: null, options: ["CSE", "Mechanical", "Electrical", "Civil", "Marine"] },
      { id: "experience", order: 4, type: "select", label: "Experience Level", required: true, conditional: null, options: ["Beginner", "Intermediate", "Advanced"] },
      { id: "laptop", order: 5, type: "radio", label: "Will you bring your laptop?", required: true, conditional: { questionId: "experience", value: "Intermediate", operator: "equals" }, options: ["Yes", "No"] },
      { id: "timeslot", order: 6, type: "select", label: "Preferred Time Slot", required: false, conditional: null, options: ["Morning (9 AM - 12 PM)", "Afternoon (2 PM - 5 PM)", "Evening (6 PM - 9 PM)"] }
    ],
    Competition: [
      { id: "name", order: 1, type: "text", label: "Full Name", required: true, conditional: null, options: [] },
      { id: "email", order: 2, type: "email", label: "Email Address", required: true, conditional: null, options: [] },
      { id: "department", order: 3, type: "select", label: "Department", required: true, conditional: null, options: ["CSE", "Mechanical", "Electrical", "Civil", "Marine"] },
      { id: "teamname", order: 4, type: "text", label: "Team Name", required: true, conditional: null, options: [] },
      { id: "teamsize", order: 5, type: "select", label: "Team Size", required: true, conditional: null, options: ["Individual", "2 Members", "3 Members", "4 Members", "5+ Members"] },
      { id: "experience", order: 6, type: "radio", label: "Previous Competition Experience", required: false, conditional: null, options: ["None", "1-2 Competitions", "3-5 Competitions", "5+ Competitions"] },
      { id: "project", order: 7, type: "textarea", label: "Project Description", required: true, conditional: null, options: [] }
    ]
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // If event type changes, load the corresponding question template
    if (e.target.name === "type" && e.target.value) {
      const template = questionTemplates[e.target.value];
      if (template) {
        setFormData(prev => ({
          ...prev,
          type: e.target.value,
          questions: template.map(q => ({ ...q, id: `${q.id}_${Date.now()}` }))
        }));
      }
    }
  };

  const addQuestion = () => {
    const newQuestion = {
      id: `custom_${Date.now()}`,
      order: formData.questions.length + 1,
      type: "text",
      label: "",
      required: false,
      conditional: null,
      options: []
    };
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  const updateQuestion = (questionId, field, value) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId ? { ...q, [field]: value } : q
      )
    }));
  };

  const removeQuestion = (questionId) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
  };

  const moveQuestion = (questionId, direction) => {
    setFormData(prev => {
      const questions = [...prev.questions];
      const index = questions.findIndex(q => q.id === questionId);
      
      if (direction === "up" && index > 0) {
        [questions[index], questions[index - 1]] = [questions[index - 1], questions[index]];
      } else if (direction === "down" && index < questions.length - 1) {
        [questions[index], questions[index + 1]] = [questions[index + 1], questions[index]];
      }
      
      // Update order numbers
      questions.forEach((q, i) => {
        q.order = i + 1;
      });
      
      return { ...prev, questions };
    });
  };

  const resetForm = () => {
    setFormData({
      type: "",
      title: "",
      shortDescription: "",
      longDescription: "",
      registrationOpenDate: "",
      registrationCloseDate: "",
      eventDate: "",
      society: "",
      department: "",
      image: "",
      googleSheetLink: "",
      questions: []
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.type || !formData.title || !formData.shortDescription || !formData.registrationOpenDate || !formData.registrationCloseDate || !formData.eventDate || !formData.society || !formData.department || !formData.googleSheetLink) {
      setMessage({ text: "Please fill in all required fields", type: "error" });
      return;
    }

    // Validate Google Sheet Link format (accepts both Google Sheets links and Apps Script URLs)
    if (!formData.googleSheetLink.includes("docs.google.com/spreadsheets") && 
        !formData.googleSheetLink.includes("script.google.com/macros")) {
      setMessage({ text: "Please enter a valid Google Sheets link or Google Apps Script URL", type: "error" });
      return;
    }

    // Validate questions
    if (formData.questions.length === 0) {
      setMessage({ text: "Please add at least one registration question", type: "error" });
      return;
    }

    // Validate question fields
    for (let question of formData.questions) {
      if (!question.label.trim()) {
        setMessage({ text: `Question ${question.order}: Label is required`, type: "error" });
        return;
      }
      if (["select", "radio", "checkbox"].includes(question.type) && question.options.length === 0) {
        setMessage({ text: `Question ${question.order}: Options are required for ${question.type} questions`, type: "error" });
        return;
      }
    }

    setIsSubmitting(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch("http://localhost:5000/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          id: Date.now().toString(),
        }),
      });

      if (response.ok) {
        const savedEvent = await response.json();
        setMessage({ text: "Event saved successfully!", type: "success" });
        resetForm();
      } else {
        throw new Error("Failed to save event");
      }
    } catch (error) {
      console.error("Error saving event:", error);
      setMessage({ 
        text: "Failed to save event. Please check if the JSON server is running on port 5000.", 
        type: "error" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>
      <h2>Add New Event</h2>

      <form onSubmit={handleSubmit}>
        <label>
          Type
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="">Select Event Type</option>
            <option value="Session">Session</option>
            <option value="Workshop">Workshop</option>
            <option value="Competition">Competition</option>
          </select>
        </label>

        <label>
          Title
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </label>

        <label style={{ gridColumn: "span 2" }}>
          Short Description
          <textarea
            name="shortDescription"
            rows="2"
            value={formData.shortDescription}
            onChange={handleChange}
            required
            placeholder="Brief description for event cards (max 150 characters)"
            maxLength="150"
          />
        </label>

        <label style={{ gridColumn: "span 2" }}>
          Long Description
          <textarea
            name="longDescription"
            rows="4"
            value={formData.longDescription}
            onChange={handleChange}
          />
        </label>

        <label>
          Registration Open Date
          <input
            type="date"
            name="registrationOpenDate"
            value={formData.registrationOpenDate}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Registration Close Date
          <input
            type="date"
            name="registrationCloseDate"
            value={formData.registrationCloseDate}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Event Date
          <input
            type="date"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Society
          <select name="society" value={formData.society} onChange={handleChange} required>
            <option value="">Select Society</option>
            <option value="IEEE">IEEE</option>
            <option value="Robotics Club">Robotics Club</option>
            <option value="AI Society">AI Society</option>
            <option value="CSE Society">CSE Society</option>
            <option value="Mechanical Society">Mechanical Society</option>
            <option value="Biomedical Society">Biomedical Society</option>
          </select>
        </label>

        <label>
          Department
          <select name="department" value={formData.department} onChange={handleChange} required>
            <option value="">Select Department</option>
            <option value="Department of Electrical and Information Engineering">Department of Electrical and Information Engineering</option>
            <option value="Computer Engineering">Computer Engineering</option>
            <option value="Department of Mechanical and Manufacturing Engineering">Department of Mechanical and Manufacturing Engineering</option>
            <option value="Department of Civil and Environmental Engineering">Department of Civil and Environmental Engineering</option>
            <option value="Department of Marine and Naval Architecture">Department of Marine and Naval Architecture</option>
          </select>
        </label>

        <label style={{ gridColumn: "span 2" }}>
          Image URL
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
          />
        </label>

        <label style={{ gridColumn: "span 2" }}>
          Google Sheet Link
          <input
            type="url"
            name="googleSheetLink"
            value={formData.googleSheetLink}
            onChange={handleChange}
            placeholder="https://script.google.com/macros/s/... or Google Sheets link"
            required
          />
          <small style={{ color: "#888", fontSize: "0.8rem", marginTop: "4px" }}>
            Use your Google Apps Script Web App URL (https://script.google.com/macros/s/...) or Google Sheets link
          </small>
        </label>

        <button type="button" onClick={() => setShowQuestionManager(!showQuestionManager)}>
          {showQuestionManager ? "Hide Question Manager" : "Manage Questions"}
        </button>

        {showQuestionManager && (
          <div className="question-manager">
            <h3>Manage Questions for {formData.title}</h3>
            <button type="button" onClick={addQuestion}>Add New Question</button>
            <div className="questions-list">
              {formData.questions.map((question, index) => (
                <div key={question.id} className="question-item">
                  <span>Question {question.order}: {question.label}</span>
                  <select value={question.type} onChange={(e) => updateQuestion(question.id, "type", e.target.value)}>
                    <option value="text">Text</option>
                    <option value="email">Email</option>
                    <option value="select">Select</option>
                    <option value="radio">Radio</option>
                    <option value="checkbox">Checkbox</option>
                    <option value="textarea">Textarea</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Label"
                    value={question.label}
                    onChange={(e) => updateQuestion(question.id, "label", e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Order"
                    value={question.order}
                    onChange={(e) => updateQuestion(question.id, "order", parseInt(e.target.value))}
                  />
                  <select onChange={(e) => updateQuestion(question.id, "required", e.target.value === "true")}>
                    <option value="false">Not Required</option>
                    <option value="true">Required</option>
                  </select>
                  {question.conditional && (
                    <div className="conditional-logic">
                      <span>Conditional on: {question.conditional.questionId}</span>
                      <select onChange={(e) => updateQuestion(question.id, "conditional.operator", e.target.value)}>
                        <option value="equals">Equals</option>
                        <option value="notEquals">Not Equals</option>
                        <option value="contains">Contains</option>
                        <option value="notContains">Does Not Contain</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Value"
                        value={question.conditional.value}
                        onChange={(e) => updateQuestion(question.id, "conditional.value", e.target.value)}
                      />
                    </div>
                  )}
                  {["select", "radio", "checkbox"].includes(question.type) && (
                    <div className="options-list">
                      <h4>Options</h4>
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} className="option-item">
                          <input
                            type="text"
                            placeholder="Option"
                            value={option}
                            onChange={(e) => updateQuestion(question.id, "options", question.options.map((o, i) => i === optIndex ? e.target.value : o))}
                          />
                          <button type="button" onClick={() => updateQuestion(question.id, "options", question.options.filter((_, i) => i !== optIndex))}>X</button>
                        </div>
                      ))}
                      <button type="button" onClick={() => updateQuestion(question.id, "options", [...question.options, ""])}>Add Option</button>
                    </div>
                  )}
                  <button type="button" onClick={() => removeQuestion(question.id)}>Remove Question</button>
                  <button type="button" onClick={() => moveQuestion(question.id, "up")}>Up</button>
                  <button type="button" onClick={() => moveQuestion(question.id, "down")}>Down</button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Event"}
        </button>
        {message.text && <p className={`message ${message.type}`}>{message.text}</p>}
      </form>
    </div>
  );
}

export default App;

