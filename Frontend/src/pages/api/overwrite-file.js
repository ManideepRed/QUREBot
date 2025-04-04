import fs from "fs";
import path from "path";

export default function handler(req, res) {
  
  if (req.method === "POST") {
    const { newContent } = req.body;
    
    const filePath = path.join(process.cwd(), "public", "input.txt");

    try {
      fs.writeFileSync(filePath, newContent, "utf8");
      return res.status(200).end();  // Added response for successful POST
    } catch (error) {
      return res.status(500).json({ error: "Error writing to file" });
    }
  }
  
  else {
    const filePath = path.join(process.cwd(), "public", "output.txt");

    fs.readFile(filePath, "utf8", (err, content) => {
      if (err) {
        return res.status(500).json({ error: "Error reading file" });
      }
      
      return res.status(200).json({ content: content });
    });
  } 
}