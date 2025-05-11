import React, { useState } from "react";
import "./CreateProject.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const CreateProject = () => {
  const [projectName, setProjectName] = useState("");
  const navigate = useNavigate();
  async function handelSubmitt(e) {
    e.preventDefault();
    const project = await axios.post(
      "https://code-reviewer-backend-cd2b.onrender.com/project/create",
      {
        projectName: projectName,
      }
    );
    navigate("/");
  }

  return (
    <main className="create-project">
      <section className="create-project-section">
        <form onSubmit={handelSubmitt}>
          <input
            type="text"
            name="projectName"
            placeholder="Project Name"
            required
            onChange={(e) => {
              setProjectName(e.target.value);
            }}
            value={projectName}
          />
          <input type="submit" value="Submitt" />
        </form>
      </section>
    </main>
  );
};

export default CreateProject;
