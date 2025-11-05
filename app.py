from flask import Flask, render_template, request, jsonify, Response
from dotenv import load_dotenv
import os
import google.generativeai as genai

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

# simple (non-streaming) endpoint (handy for debugging)
@app.post("/ask")
def ask():
    try:
        data = request.get_json(force=True) or {}
        prompt = (data.get("prompt") or "").strip()
        if not prompt:
            return jsonify({"reply": "Please type a question."})
        model = genai.GenerativeModel("gemini-2.5-flash")
        resp = model.generate_content(prompt)
        return jsonify({"reply": resp.text})
    except Exception as e:
        return jsonify({"reply": f"Error: {e}"}), 200

# streaming endpoint for live typing effect
from flask import stream_with_context

@app.post("/ask_stream")
def ask_stream():
    @stream_with_context
    def generate():
        data = request.get_json(force=True) or {}
        prompt = (data.get("prompt") or "").strip()
        if not prompt:
            yield "Please type something."
            return
        try:
            model = genai.GenerativeModel("gemini-2.5-flash-lite")
            stream = model.generate_content(prompt, stream=True)
            for chunk in stream:
                if chunk.text:
                    yield chunk.text
        except Exception as e:
            yield f"[error] {str(e)}"
    return Response(generate(), mimetype="text/plain")


if __name__ == "__main__":
    app.run(debug=True)
