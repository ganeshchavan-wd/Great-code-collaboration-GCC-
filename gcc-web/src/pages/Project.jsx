import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import Editor from "@monaco-editor/react";

export default function Project() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [code, setCode] = useState("");

  useEffect(() => {
    fetchProject();
  }, []);

  const fetchProject = async () => {
    try {
      const res = await API.get(`/projects/project/${id}`);

      setProject(res.data);

      const firstFile = res.data.files.find(
        (f) => f.type === "file"
      );

      if (firstFile) {
        setSelectedFile(firstFile);
        setCode(firstFile.content);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addFile = async () => {
    const name = prompt("Enter file name");

    if (!name) return;

    try {
      await API.post("/projects/add-file", {
        projectId: id,
        name,
        type: "file",
      });

      fetchProject();
    } catch (error) {
      console.log(error);
    }
  };

  const saveFile = async () => {
    if (!selectedFile) return;

    try {
      await API.put("/projects/update-file", {
        projectId: id,
        fileName: selectedFile.name,
        content: code,
      });

      alert("Saved");
    } catch (error) {
      console.log(error);
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
          width: "250px",
          background: "#1E293B",
          padding: "20px",
          color: "white",
        }}
      >
        <h2>Files</h2>

        <button
          onClick={addFile}
          style={{
            width: "100%",
            marginBottom: "20px",
            padding: "10px",
          }}
        >
          Add File
        </button>

        {project?.files.map((file) => (
          <div
            key={file.name}
            style={{
              padding: "10px",
              cursor: "pointer",
            }}
            onClick={() => {
              setSelectedFile(file);
              setCode(file.content);
            }}
          >
            📄 {file.name}
          </div>
        ))}
      </div>

      {/* Editor */}

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            background: "#111827",
            color: "white",
            padding: "15px",
          }}
        >
          {selectedFile
            ? selectedFile.name
            : "No file selected"}

          <button
            onClick={saveFile}
            style={{
              float: "right",
              padding: "8px 15px",
            }}
          >
            Save
          </button>
        </div>

        <Editor
          height="100%"
          theme="vs-dark"
          language="javascript"
          value={code}
          onChange={(value) =>
            setCode(value || "")
          }
        />
      </div>
    </div>
  );
}