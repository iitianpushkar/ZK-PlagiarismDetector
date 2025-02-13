# Plagiarism Detector with zk-Proofs & NFT Minting

## Overview

This project implements a **privacy-preserving plagiarism detector** that calculates a **similarity score** for text documents using **Euclidean distance**. The similarity score is then verified using **zk-proofs** via **RISC0**, submitted to **zkVerify**, and verified on **EduChain**. If the document meets originality criteria, an **NFT is minted** to certify authenticity.

![Architecture](frontend/public/WhatsApp Image 2025-02-14 at 01.47.26_becf9183.jpg)

## Features

✅ **Privacy-Preserving** – No need to reveal the full document; only the similarity score is proven.
✅ **Zero-Knowledge Proofs (zk-Proofs)** – Ensures trustless verification of plagiarism scores.
✅ **On-Chain Verification** – Uses EduChain for final proof verification.
✅ **NFT Certification** – Mints an NFT for original works as proof of authenticity.
✅ **Decentralized & Secure** – Leverages blockchain and zk-proofs to ensure data integrity.
✅ **Tamper-Proof Record** – The NFT serves as a publicly verifiable proof of originality.
✅ **Immutable Proof of Work** – Ensures authorship cannot be disputed.

## How It Works

1. **Plagiarism Detection**: The system calculates the similarity score between a given text and a reference dataset using **Euclidean distance**.
2. **zk-Proof Generation**: A zk-proof of the similarity score is generated using **RISC0**.
3. **zkVerify Submission**: The proof is submitted to **zkVerify** for validation.
4. **EduChain Verification**: The validated proof is then verified on **EduChain**.
5. **NFT Minting**: If the similarity score is below the plagiarism threshold, an **NFT is minted**, proving the document's originality.

## Benefits

🔹 **Data Privacy** – The document's content remains confidential; only the zk-proof is used for verification.
🔹 **Immutable Proof of Originality** – The minted NFT acts as verifiable proof that the work is original.
🔹 **Decentralized Trust** – No centralized entity determines originality; it's verified cryptographically on-chain.
🔹 **Scalability** – zk-proofs allow efficient verification without requiring the full document to be stored on-chain.
🔹 **Verifiable Authorship** – Establish a transparent and tamper-proof record of document originality.
🔹 **Blockchain-Backed Integrity** – Protect intellectual property rights through decentralized validation.

## Technologies Used

- **Plagiarism Detection** – Euclidean Distance Metric
- **Zero-Knowledge Proofs** – RISC0
- **On-Chain Verification** – zkVerify & EduChain
- **NFT Minting** – Smart contract on EduChain
- **Cryptographic Hashing** – Ensures document integrity without exposing content

## Setup & Usage

1. Clone the repository:
   ```sh
   git clone https://github.com/iitianpushkar/ZK-PlagiarismDetector.git
   cd plagiarism-detector
   ```
2. For frontend:
   ```sh
   cd frontend
   npm install
   npm run dev
   ```
3. For backend:
   ```sh
   cd backend
   uvicorn main:app --reload
   ```
4. For zkvm:
   ```sh
   cd zkvm
   cd hasher
   cargo run
   ```
5. For Nodejs-Server:
   ```sh
   cd Nodejs-Server
   npm install
   node server.js
   ```

## Use Cases

🎓 **Academic Integrity** – Universities can verify originality of research papers and theses.
✍️ **Content Creators** – Writers and bloggers can certify their work originality on-chain.
📜 **Legal Documentation** – Ensure authenticity of legal documents without exposing contents.
🔍 **Corporate Compliance** – Companies can verify originality of reports and presentations.
📚 **Publishing Industry** – Helps publishers protect intellectual property and verify original works.

---

✨ *Empowering originality with blockchain & zero-knowledge proofs!* 🚀

