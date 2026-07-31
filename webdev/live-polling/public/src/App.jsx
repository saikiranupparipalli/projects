// import { useState } from "react";
// import "./App.css";
// import api from "./common/api.js";
// function App() {
//   const [error, setError] = useState(null);
//   const [options, setOptions] = useState(["", ""]);
//   const [question, setQuestion] = useState("");
//   const [success, setSuccess] = useState(null);

//   function handleOptionChange(index, value) {
//     let updated = [...options];
//     updated[index] = value;
//     setOptions(updated);
//   }
//   const addOption = () => setOptions([...options, ""]);

//   const removeOption = (index) => {
//     if (options.length <= 2) return;
//     setOptions(options.filter((t) => t !== index));
//   };
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);

//     try {
//       const formattedOptions = options.map((opt) => ({ text: opt }));

//       const res = await api.post("/me/poll", {
//         question,
//         options: formattedOptions,
//       });
//       setSuccess("poll created successfull");
//       setQuestion("");
//       setOptions(["", ""]);

//     } catch (error) {
//       const message = error.response?.data?.message || "Something went wrong";
//       setError(message);
//     }
//   };
//   return (
//     <>
//       <h2>hello from react</h2>
//       <form onSubmit={handleSubmit}>
//         <h2>Create Poll</h2>

//         <input
//           type="text"
//           placeholder="Poll question"
//           value={question}
//           onChange={(e) => setQuestion(e.target.value)}
//           required
//         />

//         {options.map((opt, index) => (
//           <div key={index}>
//             <input
//               type="text"
//               placeholder={`Option ${index + 1}`}
//               value={opt}
//               onChange={(e) => handleOptionChange(index, e.target.value)}
//               required
//             />
//             {options.length > 2 && (
//               <button type="button" onClick={() => removeOption(index)}>
//                 Remove
//               </button>
//             )}
//           </div>
//         ))}

//         <button type="button" onClick={addOption}>
//           + Add Option
//         </button>

//         <button type="submit">Create Poll</button>

//         {error && <p style={{ color: "red" }}>{error}</p>}
//         {success && <p style={{ color: "green" }}>{success}</p>}
//       </form>
//     </>
//   );
// }

// export default App;


import { useState } from "react";
import api from "./common/api";
import "./App.css";

function App() {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [options, setOptions] = useState(["", ""]);
  const [question, setQuestion] = useState("");

  function handleOptionChange(index, value) {
    let updated = [...options];
    updated[index] = value;
    setOptions(updated);
  }

  const addOption = () => setOptions([...options, ""]);

  const removeOption = (index) => {
    if (options.length <= 2) return;
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const formattedOptions = options.map((opt) => ({ text: opt }));
      await api.post("/me/poll", { question, options: formattedOptions });
      setSuccess("Poll created successfully");
      setQuestion("");
      setOptions(["", ""]);
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong";
      setError(message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-900 rounded-2xl shadow-xl p-8 border border-slate-800">
        <h1 className="text-2xl font-semibold text-slate-100 mb-1">Create a Poll</h1>
        <p className="text-slate-400 text-sm mb-6">Ask a question, add your options.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="What's your question?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            className="w-full bg-slate-800 text-slate-100 placeholder-slate-500 rounded-lg px-4 py-3 outline-none border border-slate-700 focus:border-indigo-500 transition-colors"
          />

          <div className="space-y-2">
            {options.map((opt, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={opt}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  required
                  className="flex-1 bg-slate-800 text-slate-100 placeholder-slate-500 rounded-lg px-4 py-2.5 outline-none border border-slate-700 focus:border-indigo-500 transition-colors"
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="text-slate-500 hover:text-red-400 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-800 transition-colors"
                    aria-label="Remove option"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addOption}
            className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
          >
            + Add option
          </button>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg py-3 transition-colors"
          >
            Create Poll
          </button>

          {error && (
            <p className="text-red-400 text-sm bg-red-950/40 border border-red-900 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          {success && (
            <p className="text-emerald-400 text-sm bg-emerald-950/40 border border-emerald-900 rounded-lg px-3 py-2">
              {success}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default App;