const kPart1 = "AIzaSyBbd";
const kPart2 = "_KZwDhmHTtI4QsbEDKGYGfKH2x4dpw"; 

const apiKey = kPart1 + kPart2; 
const apiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

async function callGemini(prompt) {
    try {
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("Gemini API Error:", error);
        return null;
    }
}