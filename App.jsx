import React, { useState } from "react";
import axios from "axios";
import "./App.css"; // Make sure you have this CSS file or style block

export default function App() {
  const [skills, setSkills] = useState("");
  const [role, setRole] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/generate`, {
        current_skills: skills.split(",").map((s) => s.trim()),
        target_role: role,
      });

      const parsed =
        typeof response.data.result === "string"
          ? JSON.parse(response.data.result)
          : response.data.result;

      console.log("🎯 Parsed Response:", parsed);
      setResult(parsed);
    } catch (error) {
      console.error("Error generating skill tree:", error);
      setResult({ error: "Something went wrong. Try again." });
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>Skill Craft</h1>
      <h3>Craft your career like a skilled artisan!</h3>
      <input
        placeholder="Your current skills (comma separated)"
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
      />
      <input
        placeholder="Target Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "Generate"}
      </button>

      {result && result.missing_skills && (
        <div className="tree">
          <h2>🔎 Target Role: {result.target_role}</h2>
          {result.missing_skills.map((category, index) => (
            <div className="branch" key={index}>
              <h3>📂 {category.category}</h3>
              <p><strong>Skills:</strong> {category.skills.join(", ")}</p>

              <div>
                <strong>📘 Courses:</strong>
                <ul>
                  {category.courses.map((course, idx) => (
                    <li key={idx}>
                      <a href={Object.values(course)[2]} target="_blank" rel="noreferrer">
                        {course.name} ({course.platform})
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <strong>🧪 Projects:</strong>
                <ul>
                  {category.projects.map((proj, idx) => (
                    <li key={idx}>{proj}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {result && result.error && <p className="error">{result.error}</p>}
    </div>
  );
}
