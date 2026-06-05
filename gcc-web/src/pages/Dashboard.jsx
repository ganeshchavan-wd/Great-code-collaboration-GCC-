import { useEffect, useState } from "react";
import API from "../services/api";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  console.log("USER =", user);

  useEffect(() => {
    if (user && user._id) {
      fetchProjects();
    }
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await API.get(`/projects/${user._id}`);
      setProjects(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const createProject = async () => {
    try {
      await API.post("/projects/create", {
        name: projectName,
        ownerId: user._id,
      });

      alert("Project Created");
      fetchProjects();
    } catch (error) {
      console.log(error);
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
      <h1>GCC Dashboard</h1>

      <h3>User Data</h3>

      <pre>
        {JSON.stringify(user, null, 2)}
      </pre>

      <div
        style={{
          marginTop: "20px",
          background: "#1E293B",
          padding: "20px",
          borderRadius: "10px",
          maxWidth: "500px",
        }}
      >
        <h2>Create Project</h2>

        <input
          type="text"
          placeholder="Project Name"
          value={projectName}
          onChange={(e) =>
            setProjectName(e.target.value)
          }
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
          }}
        />

        <button onClick={createProject}>
          Create Project
        </button>
      </div>

      <div style={{ marginTop: "30px" }}>
        <h2>Projects</h2>

        {projects.map((project) => (
          <div
            key={project._id}
            style={{
              background: "#1E293B",
              padding: "15px",
              marginTop: "10px",
            }}
          >
            {project.name}
          </div>
        ))}
      </div>
    </div>
  );
}