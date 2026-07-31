import { useState } from "react";
import "./App.css";
import api from "./common/api.js";
function App() {
  const [error, setError] = useState(null);
  const [options, setOptions] = useState(["", ""]);
  const [question, setQuestion] = useState("");
  const [success, setSuccess] = useState(null);

  function handleOptionChange(index, value) {
    let updated = [...options];
    updated[index] = value;
    setOptions(updated);
  }
  const addOption = () => setOptions([...options, ""]);

  const removeOption = (index) => {
    if (options.length <= 2) return;
    setOptions(options.filter((t) => t !== index));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const formattedOptions = options.map((opt) => ({ text: opt }));

      const res = await api.post("/me/poll", {
        question,
        options: formattedOptions,
      });
      setSuccess("poll created successfull");
      setQuestion("");
      setOptions(["", ""]);

    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong";
      setError(message);
    }
  };
  return (
    <>
      <h2>hello from react</h2>
      <form onSubmit={handleSubmit}>
        <h2>Create Poll</h2>

        <input
          type="text"
          placeholder="Poll question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />

        {options.map((opt, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder={`Option ${index + 1}`}
              value={opt}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              required
            />
            {options.length > 2 && (
              <button type="button" onClick={() => removeOption(index)}>
                Remove
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={addOption}>
          + Add Option
        </button>

        <button type="submit">Create Poll</button>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
      </form>
    </>
  );
}

export default App;
