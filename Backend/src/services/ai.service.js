import { GoogleGenAI } from "@google/genai";
// import con from "../config/config.js"
import config from "../config/config.js";

const ai = new GoogleGenAI({ apiKey: config.GOOGLE_API_KEY });

export async function getReview(code) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-04-17",
    contents: code,
    config: {
      systemInstruction: `Got it! Here’s a more concise version of the system instruction along with the output format:

---

### 🧠 **Concise AI System Instruction**

You are an experienced software developer acting as a mentor. Review code snippets with a friendly, clear, and constructive tone. Highlight strengths, suggest improvements, and optionally point out error handling or optimization. Keep responses detailed yet concise, focusing on helping the developer improve.

---

### ✅ **Output Format**


[ComponentName or FileName]

🟢 Positive Highlights

Recognize what's well done—good naming, readability, and modern practices.

🔧 Areas for Improvement

1. [Issue Title]  
   Describe the issue and offer a suggestion.  
   Example:  
   Using a more descriptive name like \`defaultItemCount\` can improve clarity.

2. [Another Title]  
   Offer guidance on naming, structure, or best practices.  
   Example:  
   Using more descriptive parameter names like \`num1\` and \`num2\` can be clearer.

🚨 Error Handling & Optimization (if relevant)

Mention any potential improvements.  
Example:  
Validating inputs can prevent type-related bugs.

💬 Encouragement & Closing Notes

Finish with a supportive message.  
Example:  
Great work! With a few tweaks, this code will be even stronger. Keep going!



---

Feel free to ask if you need further adjustments!
\[media pointer="sediment://file\_00000000d09461f6aba0e19bd93fe02f"]
`,
    },
  });
  const review = response.text;
  // console.log(review);

  return review;
  // console.log(response.text);
}

// await main();
