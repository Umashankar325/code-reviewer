import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io as soketIo } from "socket.io-client";
import Editor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import "./project.css";

const Project = () => {
  const params = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [soket, setSoket] = useState(null);
  const [code, setCode] = useState("// Write your code here...");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [review, setReview] = useState(""); 

  const supportedLanguages = [
    { id: "javascript", name: "JavaScript" },
    { id: "typescript", name: "TypeScript" },
    { id: "python", name: "Python" },
    { id: "java", name: "Java" },
    { id: "csharp", name: "C#" },
    { id: "cpp", name: "C++" },
    { id: "php", name: "PHP" },
    { id: "ruby", name: "Ruby" },
    { id: "go", name: "Go" },
    { id: "rust", name: "Rust" },
  ];

  function handelUserInput(e) {
    e.preventDefault();
    setMessages((prev) => [...prev, input]);
    soket.emit("chat-message", input);
    setInput("");
  }

  function handleEditorChange(value) {
    setCode(value);
    soket.emit("code-change", value);
  }

  // function handleLanguageChange(e) {
  //   setLanguage(e.target.value);
  // }

  const handleCopyCode = () => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        alert("Code copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy code:", err);
        alert("Failed to copy code");
      });
  };

  const handleRunCode = async () => {
    try {
      setIsExecuting(true);
      setOutput("Executing code...");

      const response = await axios.post("http://localhost:3000/code/execute", {
        code,
        language,
      });

      setOutput(response.data.data.output || "No output");
    } catch (error) {
      setOutput(error.response?.data?.message || error.message);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCopyReview = () => {
    navigator.clipboard
      .writeText(review)
      .then(() => {
        alert("Review copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy review:", err);
        alert("Failed to copy review");
      });
  };

  function getReview() {
    soket.emit("get-review", code);
  }

  useEffect(() => {
    const io = soketIo("http://localhost:3000", {
      query: {
        Project: params.id,
      },
    });
    io.emit("chat-history");
    io.on("chat-history", (messages) => {
      setMessages(messages.map((message) => message.text));
    });
    io.on("chat-res", (message) => {
      setMessages((prev) => [...prev, message]);
    });
    io.on("code-review", (review) => {
      setReview(review);
    });
    io.on("code-update", (code) => {
      setCode(code);
    });
    setSoket(io);
  }, []);

  return (
    <main className="project-main">
      <section className="project-section">
        <div className="chat">
          <div className="messages">
            {messages.map((message, id) => {
              return (
                <div key={id} className="message">
                  <span> {message}</span>
                </div>
              );
            })}
          </div>
          <form className="input-aria" onSubmit={handelUserInput}>
            <input
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
              }}
              type="text"
              placeholder="Enter message"
            />
            <button type="submit">
              <i className="ri-send-plane-2-fill"></i>
            </button>
          </form>
        </div>
        <div className="code">
          <div className="code-header">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="language-select"
            >
              {supportedLanguages.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleCopyCode}
              className="copy-button"
              title="Copy code"
            >
              <i className="ri-file-copy-line"></i>
            </button>
          </div>
          <Editor
            height="50%"
            defaultLanguage={language}
            language={language}
            theme="vs-dark"
            value={code}
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: true },
              fontSize: 14,
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
          <div className="code-output">
            <div className="output-header">
              <h3>Output</h3>
              <button
                onClick={handleRunCode}
                className="run-button"
                disabled={isExecuting}
              >
                <i className="ri-play-fill"></i>{" "}
                {isExecuting ? "Running..." : "Run"}
              </button>
            </div>
            <div className="output-content">
              <pre>{output}</pre>
            </div>
          </div>
        </div>
        <div className="review">
          <button className="get-review" onClick={getReview}>
            get-review
          </button>
          <button className="copy-review" onClick={handleCopyReview}>
            <i className="ri-file-copy-line"></i>
          </button>
          <div className="review-content">
            <ReactMarkdown>{review}</ReactMarkdown>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Project;
