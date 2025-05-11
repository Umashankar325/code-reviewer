import { exec } from "child_process";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import os from "os";

const TEMP_DIR = path.join(os.tmpdir(), "code-executor");

// Create temp directory if it doesn't exist
try {
  await fs.mkdir(TEMP_DIR, { recursive: true });
} catch (error) {
  console.error("Error creating temp directory:", error);
}

const FILE_EXTENSIONS = {
  python: "py",
  javascript: "js",
  typescript: "ts",
  java: "java",
  cpp: "cpp",
  csharp: "cs",
  go: "go",
  rust: "rs",
  ruby: "rb",
  php: "php",
};

const LANGUAGE_COMMANDS = {
  python: (filepath) => `python "${filepath}"`,
  javascript: (filepath) => `node "${filepath}"`,
  typescript: (filepath) => `ts-node "${filepath}"`,
  java: (filepath) => {
    const className = path.basename(filepath, ".java");
    const dir = path.dirname(filepath);
    return `javac "${filepath}" && java -cp "${dir}" ${className}`;
  },
  cpp: (filepath) => {
    const outputFile = filepath.replace(".cpp", ".exe");
    return `g++ "${filepath}" -o "${outputFile}" && "${outputFile}"`;
  },
  csharp: (filepath) => `dotnet run "${filepath}"`,
  go: (filepath) => `go run "${filepath}"`,
  rust: (filepath) => {
    const outputFile = filepath.replace(".rs", ".exe");
    return `rustc "${filepath}" -o "${outputFile}" && "${outputFile}"`;
  },
  ruby: (filepath) => `ruby "${filepath}"`,
  php: (filepath) => `php "${filepath}"`,
};

export async function executeCode(code, language) {
  const extension = FILE_EXTENSIONS[language];
  if (!extension) {
    throw new Error(`Unsupported language: ${language}`);
  }

  const filename = `${uuidv4()}.${extension}`;
  const filepath = path.join(TEMP_DIR, filename);

  try {
    // Write code to temp file
    await fs.writeFile(filepath, code);

    // Execute code
    const command = LANGUAGE_COMMANDS[language](filepath);
    return new Promise((resolve, reject) => {
      exec(
        command,
        {
          timeout: 10000, // 10 second timeout
          maxBuffer: 1024 * 1024, // 1MB output limit
        },
        (error, stdout, stderr) => {
          // Clean up temp file
          fs.unlink(filepath).catch(console.error);

          if (error && error.killed) {
            reject(new Error("Execution timed out"));
          } else if (error) {
            reject(new Error(stderr || error.message));
          } else {
            resolve(stdout);
          }
        }
      );
    });
  } catch (error) {
    // Clean up temp file
    await fs.unlink(filepath).catch(console.error);
    throw error;
  }
}
