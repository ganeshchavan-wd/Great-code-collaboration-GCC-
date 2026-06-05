import { Link } from "react-router-dom";

export default function ProjectCard({ project }) {
  return (
    <Link
      to={`/project/${project._id}`}
      style={{
        textDecoration: "none",
      }}
    >
      <div
        style={{
          background: "#1E293B",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "15px",
          color: "white",
        }}
      >
        <h3>{project.name}</h3>
      </div>
    </Link>
  );
}