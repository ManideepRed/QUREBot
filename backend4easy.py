import os
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
from together import Together

QUERY_FILE = "./Frontend/public/input.txt"
ANSWER_FILE = "./Frontend/public/output.txt"

def read_question():
     with open(QUERY_FILE, 'r', encoding='utf-8') as f:
            question = f.readlines()
     with open(QUERY_FILE, 'w', encoding='utf-8') as f:
                    f.writelines("")
     return question
 
def save_answer(answer):
        with open(ANSWER_FILE, 'w', encoding='utf-8') as f:
            f.write(f"\n{answer}\n") 
            


def load_documents_from_directory(directory_path):
    documents = []
    for filename in os.listdir(directory_path):
        if filename.endswith(".txt"):
            with open(os.path.join(directory_path, filename), "r", encoding="utf-8") as file:
                documents.append({"id": filename, "text": file.read()})
    return documents

def split_text(text, chunk_size=500, chunk_overlap=40):
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start = end - chunk_overlap
    return chunks


def make_chunks(documents):
    final_chunks=[]
    for doc in documents:
        chunks = split_text(doc["text"])
        for i, chunk in enumerate(chunks):
            final_chunks.append(chunk)
    return final_chunks

model = SentenceTransformer("sentence-transformers/multi-qa-MiniLM-L6-cos-v1")

def get_embeddings(final_chunks):
    embeddings = np.array([model.encode(each) for each in final_chunks], dtype=np.float32)
    return embeddings

def store_in_vecdb(embeddings):
    dimension = embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)  
    index.add(embeddings)
    return index

def main():
    documents=load_documents_from_directory("./documents")
    chunks=make_chunks(documents)
    embeddings=get_embeddings(chunks)
    database=store_in_vecdb(embeddings)
    print("Ready\n")
    while True:
        query = read_question()
        if query:
            print("===Processing===")
            query_embedding = np.array([model.encode(query)], dtype=np.float32)
            query_embedding = query_embedding.reshape(1, -1)
            distances, indices = database.search(query_embedding, k=5)
            most_similar_text=[]
            for i in range(5):
                most_similar_text.append(chunks[indices[0][i]])
            full_prompt = f"Answer this question:{query} using information from:{most_similar_text}" 
            client = Together(api_key="83144e3ce86dca0a0a640e9969876388e08e50a81a35a3a3f9e5e9cb1d539427")

            response = client.chat.completions.create(
                model="meta-llama/Llama-3.3-70B-Instruct-Turbo",
                messages=[{"role":"user","content":full_prompt}],
            )
            save_answer(response.choices[0].message.content)
    
main()

