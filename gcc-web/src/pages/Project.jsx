import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import Editor from "@monaco-editor/react";
import socket from "../services/socket";
import "../styles/project.css";

export default function Project() {
  const { id } = useParams();
  const [history, setHistory] = useState([]);

  const [memberRole, setMemberRole] =
  useState("Viewer");

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [project, setProject] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");

  useEffect(() => {
    loadProject();

    socket.on("receive-code", (newCode) => {
      setCode(newCode);
    });

    return () => {
      socket.off("receive-code");
    };
  }, []);

  const loadProject = async () => {
    try {
      const res = await API.get(`/projects/project/${id}`);

      setProject(res.data);
      setHistory(res.data.history || []);

      if (res.data.files?.length > 0) {
        setSelectedFile(res.data.files[0]);
        setCode(res.data.files[0].content || "");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const addFile = async () => {
    const fileName = prompt("Enter file name");

    if (!fileName) return;

    try {
      const user = JSON.parse(
        localStorage.getItem("user")
      );

      await API.post("/projects/add-file", {
        projectId: id,
        name: fileName,
        type: "file",
        userName: user?.name,
      });
      loadProject();
    } catch (err) {
      console.log(err);
    }
  };


  const saveFile = async () => {
    if (!selectedFile) return;

    try {
      const user = JSON.parse(
        localStorage.getItem("user")
      );

      await API.put("/projects/update-file", {
        projectId: id,
        fileName: selectedFile.name,
        content: code,
        userName: user?.name,
      });

      loadProject();
      alert("File Saved Successfully");
    } catch (err) {
      console.log(err);
    }
  };

  const deleteFile = async (fileName) => {
    const confirmDelete = window.confirm(
      `Delete ${fileName}?`
    );

    if (!confirmDelete) return;

    try {
      const user = JSON.parse(
        localStorage.getItem("user")
      );

      await API.delete(
        "/projects/delete-file",
        {
          data: {
            projectId: id,
            fileName,
            userName: user?.name,
          },
        }
      );

      if (
        selectedFile?.name === fileName
      ) {
        setSelectedFile(null);
        setCode("");
      }

      loadProject();

      alert("File deleted successfully");
    } catch (err) {
      console.log(err);
      alert("Failed to delete file");
    }
  };
  const rollbackFile = async (versionId) => {
  try {
    await API.post(
      "/projects/rollback-file",
      {
        projectId: id,
        fileName: selectedFile.name,
        versionId,
      }
    );

    await loadProject();

    const updated = await API.get(
      `/projects/project/${id}`
    );

    const file =
      updated.data.files.find(
        (f) =>
          f.name === selectedFile.name
      );

    if (file) {
      setCode(file.content);
    }

    alert("Rollback Successful");
  } catch (err) {
    console.log(err);
    alert("Rollback Failed");
  }
};
  const inviteMember = async () => {
    if (!inviteEmail.trim()) {
      alert("Enter email");
      return;
    }

    try {
      const res = await API.post("/projects/invite", {
        projectId: id,
        email: inviteEmail,
        userName: user?.name,
      });
      alert(res.data.message);
      setInviteEmail("");
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to invite member"
      );
    }
  };

  const runCode = async () => {
  try {
    console.log("CODE SENT:", code);
    if (!selectedFile) return;

    let language = "javascript";

    if (selectedFile.name.endsWith(".py")) {
      language = "python";
    } else if (
      selectedFile.name.endsWith(".cpp")
    ) {
      language = "cpp";
    } else if (
      selectedFile.name.endsWith(".java")
    ) {
      language = "java";
    }

    const res = await API.post(
      "/code/run",
      {
        language,
        code,
      }
    );

    setOutput(res.data.output);
  } catch (error) {
    console.log(error);
    setOutput("Execution Failed");
  }
};

  return (

    <div
      style={{
        display: "flex",
        height: "100vh",
        background:
          "linear-gradient(135deg,#020617,#0f172a,#111827)",
      }}
    >
      {/* Sidebar */}

      <div
        style={{
          width: "260px",
          background: "rgba(15,23,42,0.85)",
          backdropFilter: "blur(20px)",
          borderRight: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 0 30px rgba(0,0,0,0.4)",
          color: "white",
          padding: "20px",
          animation:"float 3s ease infinite"
        }}
      >
        <h2>📁 Files</h2>

        <button
          onClick={addFile}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Add File
        </button>

        {project?.files?.map((file) => (
          <div
            key={file.name}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px",
              marginBottom: "8px",
              borderRadius: "8px",
              background:
                selectedFile?.name === file.name
                  ? "linear-gradient(135deg,#2563eb,#3b82f6)"
                  : "rgba(255,255,255,0.03)",

              transition: "all .3s ease",
              border:
                selectedFile?.name === file.name
                  ? "1px solid #60a5fa"
                  : "1px solid rgba(255,255,255,.05)",

              boxShadow:
                selectedFile?.name === file.name
                  ? "0 0 20px rgba(59,130,246,.4)"
                  : "none",
            }}
          >
            <div
              onClick={() => {
                setSelectedFile(file);
                setCode(file.content || "");

                socket.emit(
                  "join-file",
                  file.name
                );
              }}
              style={{
                flex: 1,
                cursor: "pointer",
              }}
            >
              📄 {file.name}
            </div>

            <button
              onClick={() =>
                deleteFile(file.name)
                
              }
              
              style={{
                background: "#ef4444",
                border: "none",
                color: "white",
                borderRadius: "6px",
                padding: "5px 8px",
                cursor: "pointer",
              }}
            >
              🗑
            </button>
          </div>
        ))}
      </div>
      
      

      {/* Editor */}

      <div
        style={{
          flex: 1,
          display: "flex",
          height: "100%",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}

        >
          {/* Top Bar */}

          <div
            style={{
              background:
                "rgba(2,6,23,.85)",
              backdropFilter: "blur(18px)",
              borderBottom:
                "1px solid rgba(255,255,255,.08)",
              color: "white",
              padding: "12px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3>
              {selectedFile
                ? selectedFile.name
                : "No File Selected"}
            </h3>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <input
                type="email"
                placeholder="Invite member email"
                value={inviteEmail}
                onChange={(e) =>
                  setInviteEmail(e.target.value)
                }
                style={{
                  padding: "8px",
                  borderRadius: "5px",
                  border: "none",
                }}
              />
              <select
  value={memberRole}
  onChange={(e) =>
    setMemberRole(e.target.value)
  }
  style={{
    padding: "8px",
    borderRadius: "8px",
    border: "none",
    background: "#1E293B",
    color: "white",
  }}
>
  <option value="Admin">
    Admin
  </option>

  <option value="Editor">
    Editor
  </option>

  <option value="Viewer">
    Viewer
  </option>
</select>

              <button
                onClick={inviteMember}
                style={{
                  padding: "8px 15px",
                  background: "#F59E0B",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  color: "white",
                }}
              >
                Invite
              </button>

              <button
                onClick={runCode}
                style={{
                  padding: "8px 15px",
                  background:
                    "linear-gradient(135deg,#22c55e,#16a34a)",
                  boxShadow:
                    "0 0 20px rgba(34,197,94,.35)",
                  transition: "all .3s ease",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  color: "white",
                }}
              >
                ▶ Run
              </button>

              <button
                onClick={saveFile}
                style={{
                  padding: "8px 15px",
                  background:
                    "linear-gradient(135deg,#38bdf8,#2563eb)",
                  boxShadow:
                    "0 0 20px rgba(56,189,248,.35)",
                  transition: "all .3s ease",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  color: "white",
                }}
              >
                💾 Save
              </button>
            </div>
          </div>

          {/* Monaco Editor */}

          <div style={{ flex: 1 }}>
         <Editor
  height="100%"
  theme="vs-dark"
  language={
    selectedFile?.name.endsWith(".py")
      ? "python"
      : selectedFile?.name.endsWith(".cpp")
      ? "cpp"
      : selectedFile?.name.endsWith(".java")
      ? "java"
      : "javascript"
  }
  value={code}
  onChange={(value) => {
    setCode(value || "");

    if (selectedFile) {
      socket.emit("send-code", {
        room: selectedFile.name,
        code: value || "",
      });
    }
  }}
/>
          </div>

          {/* Output Console */}

          <div
            style={{
              height: "180px",
              background:
                "linear-gradient(180deg,#020617,#0f172a)",
              borderTop:
                "1px solid rgba(255,255,255,.08)",
              color: "#22C55E",
              padding: "15px",
              overflow: "auto",
              borderTop: "1px solid #374151",
            }}
          >
          <h3
  style={{
    color: "#22c55e",
    fontSize: "24px",
    fontWeight: "700",
  }}
>
  🖥 Live Output Console
</h3>


            <pre>{output}</pre>
          </div>

        </div>

        {/* Activity History Panel */}

        <div
          style={{
            width: "320px",
            background:
"rgba(15,23,42,.85)",
backdropFilter:"blur(20px)",
borderLeft:
"1px solid rgba(255,255,255,.08)",
            borderLeft: "1px solid #334155",
            color: "white",
            overflowY: "auto",
            padding: "20px",
          }}
        >
          <h2
            style={{
              marginBottom: "20px",
              color: "#38BDF8",
            }}
          >
            📜 Activity History
          </h2>
          <h2
  style={{
    marginTop: "30px",
    marginBottom: "20px",
    color: "#22c55e",
  }}
>
  ⏪ Version History
</h2>

{project?.versions
  ?.slice()
  .reverse()
  .filter(
    (version) =>
      version.fileName ===
      selectedFile?.name
  )
  .map((version) => (
    <div
      key={version._id}
      style={{
        padding: "12px",
        marginBottom: "12px",
        borderRadius: "12px",
        background:
          "linear-gradient(135deg,#1e293b,#0f172a)",
        border:
          "1px solid #334155",
      }}
    >
      <div
        style={{
          color: "#60A5FA",
          fontWeight: "bold",
        }}
      >
        {version.userName}
      </div>

      <div
        style={{
          color: "#94A3B8",
          fontSize: "12px",
          marginTop: "5px",
        }}
      >
        {new Date(
          version.timestamp
        ).toLocaleString()}
      </div>

      <button
        onClick={() =>
          rollbackFile(version._id)
        }
        style={{
          marginTop: "10px",
          width: "100%",
          padding: "8px",
          background: "#f59e0b",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        ⏪ Rollback
      </button>
    </div>
  ))}

          {history.length === 0 ? (
            <p>No activity yet</p>
          ) : (
            history
              .slice()
              .reverse()
              .map((item, index) => (
                <div
                  key={index}
                  style={{
                    padding: "12px",
                    marginBottom: "12px",
                    borderRadius: "12px",
                    background:
"linear-gradient(135deg,#1e293b,#0f172a)",
boxShadow:
"0 0 20px rgba(0,0,0,.2)",
transition:"all .3s ease",
                    border: "1px solid #334155",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "bold",
                      color: "#60A5FA",
                    }}
                  >
                    {item.userName}
                  </div>

                  <div style={{ marginTop: "5px" }}>
                    {item.action}
                  </div>

                  <div
                    style={{
                      color: "#94A3B8",
                      fontSize: "12px",
                      marginTop: "5px",
                    }}
                  >
                    {item.fileName}
                  </div>

                  <div
                    style={{
                      color: "#64748B",
                      fontSize: "11px",
                      marginTop: "6px",
                    }}
                  >
                    {new Date(
                      item.timestamp
                    ).toLocaleString()}
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );

}