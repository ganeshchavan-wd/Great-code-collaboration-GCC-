import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user && user.id) {
      fetchProjects();
    }
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await API.get(`/projects/${user.id}`);
      setProjects(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const createProject = async () => {
    if (!projectName.trim()) {
      alert("Enter project name");
      return;
    }

    try {
      await API.post("/projects/create", {
        name: projectName,
        ownerId: user.id,
      });

      setProjectName("");

      alert("Project Created Successfully");

      fetchProjects();
    } catch (error) {
      console.log(error);
      alert("Failed to create project");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0F172A",
        color: "white",
        padding: "30px",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        GCC Dashboard
      </h1>

      <div
        style={{
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        <h2>Welcome, {user.name} 👋</h2>

        <p
          style={{
            color: "#94A3B8",
          }}
        >
          {user.email}
        </p>
      </div>

      <div
        style={{
          background: "#1E293B",
          padding: "20px",
          borderRadius: "10px",
          maxWidth: "600px",
          margin: "auto",
        }}
      >
        <h2
          style={{
            textAlign: "center",
          }}
        >
          Create Project
        </h2>

        <input
          type="text"
          placeholder="Project Name"
          value={projectName}
          onChange={(e) =>
            setProjectName(e.target.value)
          }
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "15px",
            marginBottom: "15px",
            borderRadius: "8px",
            border: "none",
          }}
        />

        <button
          onClick={createProject}
          style={{
            width: "100%",
            padding: "12px",
            background: "#38BDF8",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Create Project
        </button>
      </div>

      <div
        style={{
          marginTop: "40px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
          }}
        >
          My Projects
        </h2>

        {projects.length === 0 ? (
          <p
            style={{
              textAlign: "center",
            }}
          >
            No Projects Yet
          </p>
        ) : (
          projects.map((project) => (
            <Link
              key={project._id}
              to={`/project/${project._id}`}
              style={{
                textDecoration: "none",
                color: "white",
              }}
            >
              <div
                style={{
                  background: "#1E293B",
                  padding: "15px",
                  marginTop: "15px",
                  borderRadius: "8px",
                }}
              >
                📁 {project.name}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}