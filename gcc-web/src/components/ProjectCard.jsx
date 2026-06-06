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
          background:
            "linear-gradient(135deg, #1e293b, #0f172a)",
          padding: "22px",
          borderRadius: "18px",
          marginBottom: "18px",
          color: "white",
          border:
            "1px solid rgba(255,255,255,0.08)",
          boxShadow:
            "0 10px 30px rgba(0,0,0,0.25)",
          transition: "all 0.3s ease",
          cursor: "pointer",
          position: "relative",
          overflow: "hidden",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform =
            "translateY(-6px)";
          e.currentTarget.style.boxShadow =
            "0 15px 40px rgba(59,130,246,0.35)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform =
            "translateY(0)";
          e.currentTarget.style.boxShadow =
            "0 10px 30px rgba(0,0,0,0.25)";
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-20px",
            right: "-20px",
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            background:
              "rgba(59,130,246,0.12)",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: "22px",
                fontWeight: "700",
              }}
            >
              📁 {project.name}
            </h3>

            <p
              style={{
                marginTop: "10px",
                color: "#94A3B8",
                fontSize: "14px",
              }}
            >
              Collaborative coding workspace
            </p>
          </div>

          <div
            style={{
              background:
                "rgba(59,130,246,0.15)",
              color: "#60A5FA",
              padding: "8px 14px",
              borderRadius: "999px",
              fontSize: "13px",
              fontWeight: "600",
            }}
          >
            Active
          </div>
        </div>

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              color: "#CBD5E1",
              fontSize: "13px",
            }}
          >
            🚀 Great Code Collaboration
          </span>

          <div
            style={{
              color: "#38BDF8",
              fontWeight: "600",
            }}
          >
            Open →
          </div>
        </div>
      </div>
    </Link>
  );
}