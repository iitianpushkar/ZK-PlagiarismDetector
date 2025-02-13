import os
import fitz  # PyMuPDF for PDF extraction
import faiss
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from fastapi import FastAPI, File, UploadFile, Form
from sentence_transformers import SentenceTransformer

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Load embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")

# FAISS index setup (128-dimensional embedding space)
D = 384  # Embedding dimension for MiniLM
index = faiss.IndexFlatL2(D)  # L2 distance metric
doc_embeddings = []  # Store document embeddings
doc_filenames = []  # Store document names

# Ensure storage directory exists
UPLOAD_DIR = "uploaded_docs"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.post("/upload_document/")
async def upload_document(file: UploadFile = File(...)):
    """Uploads a PDF, extracts text, converts to embeddings, and stores in FAISS."""
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        buffer.write(file.file.read())

    # Extract text from PDF
    doc = fitz.open(file_path)
    text = " ".join([page.get_text("text") for page in doc])

    # Convert to embeddings
    embedding = model.encode(text).astype(np.float32)

    # Store in FAISS
    index.add(np.array([embedding]))  # Add embedding
    doc_embeddings.append(embedding)
    doc_filenames.append(file.filename)

    return {"message": f"Document '{file.filename}' uploaded and indexed."}


@app.post("/check_plagiarism/")
async def check_plagiarism(query: str = Form(...)):
    """Checks plagiarism by comparing input text with stored embeddings."""
    if not doc_embeddings:
        return {"message": "No documents have been uploaded yet."}

    # Convert query to embeddings
    query_embedding = model.encode(query).astype(np.float32)
    query_embedding = np.expand_dims(query_embedding, axis=0)  # Reshape for FAISS

    # Perform similarity search in FAISS
    distances, indices = index.search(query_embedding, k=3)  # Top-3 similar results

    results = []
    for i in range(len(indices[0])):
        doc_index = indices[0][i]
        if doc_index < len(doc_filenames):  # Ensure valid index
            results.append(
                {
                    "document": doc_filenames[doc_index],
                    "similarity_score": round(1 / (1 + float(distances[0][i])), 4)  # Lower is better (L2 distance)
                }
            )

    return {"query": query, "results": results}
