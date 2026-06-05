import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import "../styles/dashboard.css";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [teams, setTeams] = useState([]);
  const [teamName, setTeamName] = useState("");

  const [activities, setActivities] =
  useState([
    {
      id: 1,
      text: "Project created",
      icon: "📁",
    },
    {
      id: 2,
      text: "Team created",
      icon: "👥",
    },
    {
      id: 3,
      text: "Code updated",
      icon: "⚡",
    },
  ]);

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  useEffect(() => {
    if (user?.id) {
      fetchProjects();
    }
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await API.get(
        `/projects/${user.id}`
      );

      setProjects(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const createProject = async () => {
    const createTeam = () => {
  if (!teamName.trim()) {
    alert("Enter team name");
    return;
  }

  const newTeam = {
    id: Date.now(),
    name: teamName,
    members: 1,
  };

  setTeams([...teams, newTeam]);
  setTeamName("");

  alert("Team Created Successfully");
};
    if (!projectName.trim()) {
      alert("Enter project name");
      const createTeam = () => {
  if (!teamName.trim()) {
    alert("Enter team name");
    return;
  }

  const newTeam = {
    id: Date.now(),
    name: teamName,
    members: 1,
  };

  setTeams((prevTeams) => [
    ...prevTeams,
    newTeam,
  ]);

  setTeamName("");

  alert("Team Created Successfully");
};
      return;
    }

    try {
      await API.post("/projects/create", {
        name: projectName,
        ownerId: user.id,
      });

      setProjectName("");

      fetchProjects();

      alert("Project Created Successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to create project");
    }
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}

      <aside className="sidebar">
        <div className="logo-section">
          <h1>🚀 GCC</h1>
          <p>Great Code Collaboration</p>
        </div>

      <nav className="sidebar-menu">
  <button
    className={
      activeTab === "dashboard"
        ? "active-menu"
        : ""
    }
    onClick={() =>
      setActiveTab("dashboard")
    }
  >
    🏠 Dashboard
  </button>

  <button
    className={
      activeTab === "projects"
        ? "active-menu"
        : ""
    }
    onClick={() =>
      setActiveTab("projects")
    }
  >
    📁 Projects
  </button>

  <button
  className={
    activeTab === "teams"
      ? "active-menu"
      : ""
  }
  onClick={() =>
    setActiveTab("teams")
  }
>
  👥 Teams
</button>
 <button
  className={
    activeTab === "activity"
      ? "active-menu"
      : ""
  }
  onClick={() =>
    setActiveTab("activity")
  }
>
  ⚡ Activity
</button>
  <button>⭐ Starred</button>
  <button>⚙ Settings</button>
</nav>

        <div className="upgrade-card">
          <h3>👑 Upgrade Pro</h3>

          <p>
            Unlock unlimited projects and
            advanced collaboration tools.
          </p>

          <button>
            Upgrade Now →
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}

      <main className="main-content">
        <div className="top-bar">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
            />
          </div>

          <div className="profile-card">
            <h3>{user?.name}</h3>
            <p>{user?.email}</p>
          </div>
        </div>

      
{/* DASHBOARD TAB */}
{activeTab === "dashboard" && (
  <>
  <div className="hero-section">
          <div className="hero-left">
            <h1 className="hero-title">
              Welcome back, {user?.name} 👋
            </h1>

            <p className="hero-subtitle">
              Let's build something amazing
              today.
            </p>
          </div>

          <div className="hero-illustration">
            💻
          </div>
        </div>

        {/* STATS */}

        <div className="stats-grid">
          <div className="stat-card purple">
            <h2>{projects.length}</h2>
            <p>Total Projects</p>
          </div>

          <div className="stat-card green">
            <h2>∞</h2>
            <p>Collaboration</p>
          </div>

          <div className="stat-card blue">
            <h2>24/7</h2>
            <p>Workspace</p>
          </div>

          <div className="stat-card orange">
            <h2>⚡</h2>
            <p>Realtime Coding</p>
          </div>
        </div>

        {/* CREATE PROJECT */}
        

        <div className="create-project-card">
          <h2>
            ✨ Create New Project
          </h2>
  
          <div className="create-project-row">
            <input
              type="text"
              placeholder="Enter project name..."
              value={projectName}
              onChange={(e) =>
                setProjectName(
                  e.target.value
                )
              }
            />

            <button
              onClick={createProject}
            >
              + Create Project
            </button>
          </div>
        </div>
  
    <div className="projects-header">
      <h2>📁 My Projects</h2>
    </div>

    <div className="projects-grid">
      {filteredProjects.length === 0 ? (
        <div className="empty-projects">
          {searchTerm
            ? "No matching projects found 🔍"
            : "No Projects Yet"}
        </div>
      ) : (
        filteredProjects.map((project) => (
          <Link
            key={project._id}
            to={`/project/${project._id}`}
            className="project-link"
          >
            <div className="project-card">
              <div className="project-icon">
                📁
              </div>

              <h3>{project.name}</h3>

              <p>
                Collaborative coding workspace
              </p>

              <div className="project-footer">
                <span>👥 Team Project</span>

                <button>
                  Open →
                </button>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>

  </>
)}
        

        {/* PROJECTS */}

        <div className="projects-header">
          <h2>My Projects</h2>
        </div>

        <div className="projects-grid">
          {filteredProjects.length ===
          0 ? (
            <div className="empty-projects">
              {searchTerm
                ? "No matching projects found 🔍"
                : "No Projects Yet"}
            </div>
          ) : (
            filteredProjects.map(
              (project) => (
                <Link
                  key={project._id}
                  to={`/project/${project._id}`}
                  className="project-link"
                >
                  <div className="project-card">
                    <div className="project-icon">
                      📁
                    </div>

                    <h3>
                      {project.name}
                    </h3>

                    <p>
                      Collaborative coding
                      workspace
                    </p>

                    <div className="project-footer">
                      <span>
                        👥 Team Project
                      </span>

                      <button>
                        Open →
                      </button>
                    </div>
                  </div>
                </Link>
              )
            )
          )}
        </div>
      </main>

      {/* RIGHT PANEL */}

      <aside className="right-panel">
        <div className="activity-card">
          <h2>Recent Activity</h2>

          <div className="activity-item">
            ✅ Project created
          </div>

          <div className="activity-item">
            👥 New member joined
          </div>

          <div className="activity-item">
            ⚡ Code updated
          </div>

          <div className="activity-item">
            ⭐ Project starred
          </div>
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>

          <button>
            👥 Invite Members
          </button>

          <button>
            🚀 Create Team
          </button>

          <button>
            📂 Import Repository
          </button>

          <button>
            📖 Documentation
          </button>
        </div>
      </aside>
    </div>
  );
}

