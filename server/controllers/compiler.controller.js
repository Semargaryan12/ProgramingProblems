const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const getUUID = async () => {
  const { v4: uuidv4 } = await import("uuid");
  return uuidv4();
};

// Ensure temp directory exists and is absolute
const tempDir = path.resolve(__dirname, "../temp_codes");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const RUN_CONFIG = {
  python: {
    ext: "py",
    image: "python:3.10-slim",
    cmd: (f) => `python /app/${f}`,
  },
  javascript: {
    ext: "js",
    image: "node:18-slim",
    cmd: (f) => `node /app/${f}`,
  },
  cpp: {
    ext: "cpp",
    image: "gcc:latest",
    cmd: (f) => `g++ /app/${f} -o /app/out && /app/out`,
  },
};

exports.executeCode = async (req, res) => {
  const { code, language } = req.body;
  const config = RUN_CONFIG[language?.toLowerCase()];

  if (!config) {
    return res.status(400).json({ error: "Unsupported language" });
  }

const id = await getUUID();
  const fileName = `${id}.${config.ext}`;
  const filePath = path.join(tempDir, fileName);

  // Normalize path for Docker volume compatibility (Windows fix)
  const dockerPath = tempDir.replace(/\\/g, "/");

  try {
    fs.writeFileSync(filePath, code);

    const dockerCmd = `docker run --rm -v "${dockerPath}":/app --memory="128m" --network none ${config.image} sh -c "${config.cmd(fileName)}"`;

    exec(dockerCmd, { timeout: 10000 }, (error, stdout, stderr) => {
      // Cleanup files
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      const outPath = path.join(tempDir, "out");
      if (fs.existsSync(outPath)) fs.unlinkSync(outPath);

      if (error && error.killed) {
        return res.json({
          output: "",
          error: "Execution Timeout (10s limit)",
          exitCode: 124,
        });
      }

      res.json({
        output: stdout,
        error: stderr || (error ? error.message : null),
        exitCode: error ? error.code : 0,
      });
    });
  } catch (err) {
    console.error("Compiler Error:", err);
    res.status(500).json({ error: "System error during execution" });
  }
};
