import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import Editor from "@monaco-editor/react";
import socket from "../services/socket";
import "../styles/project.css";

export default function Project() {
  const { id } = useParams();
  const [history, setHistory] = useState([]);

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

  const runCode = () => {
    try {
      if (
        selectedFile &&
        selectedFile.name.endsWith(".js")
      ) {
        let logs = [];

        const originalLog = console.log;

        console.log = (...args) => {
          logs.push(args.join(" "));
        };

        const result = eval(code);

        console.log = originalLog;

        if (logs.length > 0) {
          setOutput(logs.join("\n"));
        } else if (result !== undefined) {
          setOutput(String(result));
        } else {
          setOutput("Code Executed Successfully");
        }
      } else {
        setOutput(
          "Execution currently supported for JavaScript files only."
        );
      }
    } catch (error) {
      setOutput(error.message);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#0F172A",
      }}
    >
      {/* Sidebar */}

      <div
        style={{
          width: "260px",
          background: "#1E293B",
          color: "white",
          padding: "20px",
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
          ? "#334155"
          : "transparent",
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
            background: "#111827",
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
                background: "#22C55E",
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
                background: "#38BDF8",
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
            language="javascript"
            value={code}
onChange={(value) => {
  const newCode = value || "";

  setCode(newCode);

  if (selectedFile) {
    socket.emit("code-change", {
      fileId: selectedFile.name,
      content: newCode,
    });
  }
}}
          />
        </div>

        {/* Output Console */}

        <div
          style={{
            height: "180px",
            background: "#111827",
            color: "#22C55E",
            padding: "15px",
            overflow: "auto",
            borderTop: "1px solid #374151",
          }}
        >
          <h3>🖥 Output Console</h3>

        <pre>{output}</pre>
</div>

{/* Activity History Panel */}

<div
  style={{
    width: "320px",
    background: "#111827",
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
            background: "#1E293B",
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