import React, { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const Home = () => {
  const [projects, setProjects] = useState([]);
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  function navigateToProject(id) {
    navigate(`/project/${id}`);
  }

  useEffect(() => {
    axios
      .get(
        "https://code-reviewer-backend-iu4m.onrender.com/project/getAllProjects"
      )
      .then((res) => {
        setProjects(res.data.data);
      });
  }, []);

  return (
    <main className="home">
      <section className="home-section">
        <button
          onClick={() => {
            navigate("./create-project");
          }}
        >
          new Project
        </button>

        {projects.length == 0 ? (
          <div>
            <p className="noprojects">No Project Created</p>
          </div>
        ) : (
          <div className="projects">
            {projects.map((project, i) => (
              <div
                key={i}
                onClick={() => {
                  navigateToProject(project._id);
                }}
                className="project"
              >
                {project.name}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Home;
