export const EditorController = {
  // Saves user progress to browser storage
  saveLocalCode: (questionId, code) => {
    try {
      localStorage.setItem(`editor_code_${questionId}`, code);
    } catch (err) {
      console.warn("Failed to save code to localStorage:", err);
    }
  },

  // Retrieves saved progress
  getLocalCode: (questionId, defaultCode = "// Start coding here...") => {
    try {
      return localStorage.getItem(`editor_code_${questionId}`) || defaultCode;
    } catch (err) {
      console.warn("Failed to read from localStorage:", err);
      return defaultCode;
    }
  },

  /**
   * MISSING FUNCTION: generateFile
   * Converts the string code into a File object for Multer/Backend processing
   */
  generateFile: (code, language, questionText) => {
    const extensionMap = {
      cpp: "cpp",
      python: "py",
      javascript: "js",
      java: "java",
    };

    const ext = extensionMap[language?.toLowerCase()] || "txt";

    let safeName = (questionText || "")
      .replace(/[^a-zA-Z0-9\s_-]/g, "")
      .trim()
      .replace(/\s+/g, "_")
      .slice(0, 50);

    // 🔥 CRITICAL FIX
    if (!safeName || safeName.length < 3) {
      safeName = "solution";
    }

    const fileName = `${safeName}.${ext}`;

    console.log("📁 GENERATED FILE NAME:", fileName); // DEBUG

    return new File([code], fileName, { type: "text/plain" });
  },

  // Standard download utility
  downloadCode: (code, language, questionText = "solution") => {
    if (!code) return;

    const extensionMap = {
      cpp: "cpp",
      python: "py",
      javascript: "js",
      java: "java",
    };
    const ext = extensionMap[language?.toLowerCase()] || "txt";

    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${questionText.replace(/\s+/g, "_").toLowerCase()}.${ext}`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
};
