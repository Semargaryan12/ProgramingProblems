import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { performance } from "perf_hooks";

export const codeEx = (code) => {
  return new Promise((resolve) => {
    const tempFile = path.join(process.cwd(), `temp_${Date.now()}.js`);

    fs.writeFileSync(tempFile, code);

    const start = performance.now();

    const processExec = exec(
      `node ${tempFile}`,
      { timeout: 3000, maxBuffer: 128 * 1024 * 1024 },
      (error, stdout, stderr) => {
        const end = performance.now();

        fs.unlinkSync(tempFile);

        resolve({
          output: stdout || "",
          error: error ? stderr || error.message : null,
          executionTime: Math.round(end - start),
          passed: !error,
        });
      },
    );
  });
};
