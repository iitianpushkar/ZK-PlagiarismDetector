import React, { useState } from "react";
import axios from "axios";
import ConnectWallet from "./components/ConnectWallet.jsx";
import {useContext} from "react"; 
import { UserContext } from "./components/Context.jsx";


export default function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [proof, setProof] = useState(null);
  const [generatingProof, setGeneratingProof] = useState(false);
  const [submittingProof, setSubmittingProof] = useState(false);
  const [proofDetails,setproofDetails] = useState(null);
  const [transaction,setTransaction]=useState(null)
  const [minting,setminting]=useState(false)

  const {account,contract} = useContext(UserContext)

  const checkPlagiarism = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("query", query);
      const response = await axios.post("http://127.0.0.1:8000/check_plagiarism/", formData);

      const filteredResults = response.data.results.filter(res => res.similarity_score > 0);
      setResults(filteredResults);
    } catch (error) {
      console.error("Error checking plagiarism:", error);
    }
    setLoading(false);
  };

  const uploadDocument = async () => {
    if (!file) {
      setUploadStatus("Please select a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploadStatus("Uploading...");

    try {
      const response = await axios.post("http://127.0.0.1:8000/upload_document/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadStatus(response.data.message);
    } catch (error) {
      setUploadStatus("Upload failed. Please try again.");
      console.error("Error uploading document:", error);
    }
  };

  const generateProof = async () => {
    if (averageSimilarity <= 0) return;
    
    setGeneratingProof(true);
    try {
      const response = await axios.post("http://localhost:3001/generate-proof", {
        input: averageSimilarity,
      });
      console.log(response)
      setProof(response.data);
    } catch (error) {
      console.error("Error generating proof:", error);
    }
    setGeneratingProof(false);
  };

  const submit = async () => {

    setSubmittingProof(true);
    try {
      const response = await axios.post("http://localhost:3000/zkverify", {
        proof: proof,
      });
      console.log(response.data)
      setproofDetails(response.data)
    } catch (error) {
      console.error("Error submitting proof:", error);
    }
    setSubmittingProof(false);
  };

  const mintNft= async () => {

    console.log("contract:",contract)
    console.log("_hash:",proof.pub_inputs)
    console.log("proofDetails:",proofDetails)

    setminting(true);
    try {
      const txResponse = await contract.checkHash(
        proof.pub_inputs,
        proofDetails.attestationId,
        proofDetails.proof,
        proofDetails.numberOfLeaves,
        proofDetails.leafIndex
    );
    const { hash } = await txResponse;
    console.log(`Tx sent to EDU, tx-hash ${hash}`);
    setTransaction(hash)
    } catch (error) {
      console.error("Error minting:", error);
    }
    setminting(false);
  };


  const downloadProof = () => {
    if (!proof) return;
    const blob = new Blob([JSON.stringify(proof, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "proof.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const averageSimilarity =
    results.length > 0
      ? results.reduce((sum, res) => sum + res.similarity_score, 0) / results.length
      : 0;

      return (
        <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black text-white flex flex-col items-center justify-center p-6 relative">
          <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-blue-300 bg-clip-text text-transparent drop-shadow-2xl">
            Plagiarism Detector
          </h1>
          <ConnectWallet />
    
          {/* Upload Section */}
          <div className="bg-black/50 backdrop-blur-sm p-8 rounded-2xl border border-purple-500/30 shadow-lg shadow-purple-500/20 w-full max-w-2xl mb-8 hover:border-purple-400/50 transition-all duration-300">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-300 to-blue-200 bg-clip-text text-transparent">
              📄 Upload Document
            </h2>
            <div className="flex flex-col gap-4">
              <input 
                type="file" 
                className="file:bg-purple-600/50 file:text-white file:border-0 file:px-4 file:py-2 file:rounded-lg hover:file:bg-purple-700/50 transition-colors cursor-pointer"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <button 
                onClick={uploadDocument}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 rounded-xl hover:from-purple-700 hover:to-purple-600 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-purple-500/20"
              >
                {uploadStatus ? "⏳ " + uploadStatus : "🚀 Upload Document"}
              </button>
            </div>
          </div>
    
          {/* Plagiarism Check Section */}
          <div className="bg-black/50 backdrop-blur-sm p-8 rounded-2xl border border-purple-500/30 shadow-lg shadow-purple-500/20 w-full max-w-2xl hover:border-purple-400/50 transition-all duration-300">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-300 to-blue-200 bg-clip-text text-transparent">
              🔍 Plagiarism Check
            </h2>
            
            <textarea 
              className="w-full h-40 p-4 bg-black/30 border border-purple-500/20 rounded-xl focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400/50 resize-none transition-all duration-300 placeholder-purple-300/50"
              placeholder="Enter text to analyze..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
    
            <button 
              onClick={checkPlagiarism} 
              className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-500 rounded-xl hover:from-blue-700 hover:to-purple-600 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-blue-500/20"
              disabled={loading}
            >
              {loading ? "🔮 Analyzing..." : "✨ Check Plagiarism"}
            </button>
    
            {/* Results Section */}
            {results.length > 0 && (
              <div className="mt-8 space-y-6 animate-fade-in">
                <div className="bg-black/30 p-6 rounded-xl border border-purple-500/20">
                  <h3 className="text-xl font-semibold mb-4">📊 Results</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 font-medium">
                      <div className="bg-purple-600/20 p-4 rounded-lg">
                        Average Similarity: <span className="text-purple-300">{averageSimilarity.toFixed(4)}</span>
                      </div>
                      <button 
                        onClick={generateProof}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-50"
                        disabled={generatingProof}
                      >
                        {generatingProof ? "🛠 Generating ZK Proof..." : "🔐 Generate Proof"}
                      </button>
                    </div>
    
                    <div className="overflow-x-auto rounded-lg border border-purple-500/20">
                      <table className="w-full [&_th]:bg-purple-900/20 [&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_th]:font-semibold [&_td]:px-4 [&_td]:py-3 [&_tr]:border-b [&_tr]:border-purple-500/10">
                        <thead>
                          <tr>
                            <th>Document</th>
                            <th>Similarity</th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.map((res, index) => (
                            <tr key={index} className="hover:bg-purple-900/10 transition-colors">
                              <td className="font-mono">{res.document}</td>
                              <td className="text-purple-300">{res.similarity_score.toFixed(4)}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
    
                {/* Proof Section */}
                {proof && (
                  <div className="bg-green-900/10 p-6 rounded-xl border border-green-500/30 animate-fade-in">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-2 text-green-300">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-semibold">Proof Generated Successfully!</span>
                      </div>
                      <div className="flex gap-4">
                        <button
                          onClick={downloadProof}
                          className="px-4 py-2 bg-green-600/30 rounded-lg hover:bg-green-600/40 transition-colors border border-green-500/30"
                        >
                          💾 Download Proof
                        </button>
                        <button
                          onClick={submit}
                          className="px-4 py-2 bg-blue-600/30 rounded-lg hover:bg-blue-600/40 transition-colors border border-blue-500/30"
                          disabled={submittingProof}
                        >
                           📮{submittingProof ? "⛓ submitting..." : "🖼 submit to zkverify"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
    
                {/* Mint Section */}
                {proofDetails && (
                  <div className="bg-blue-900/10 p-6 rounded-xl border border-blue-500/30 animate-fade-in">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-2 text-blue-300">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="font-semibold">Ready for Blockchain Minting!</span>
                      </div>
                      <button
                        onClick={mintNft}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-blue-500/20"
                        disabled={minting}
                      >
                        {minting ? "⛓ Minting..." : "🖼 Mint NFT"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
    
          {/* Background Effects */}
          <div className="absolute inset-0 -z-10 opacity-30">
            <div className="absolute top-[20%] left-[20%] w-64 h-64 bg-purple-500 rounded-full blur-3xl opacity-40 animate-pulse-slow"></div>
            <div className="absolute top-[60%] right-[20%] w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-30 animate-pulse-slow delay-1000"></div>
          </div>
        </div>
      );
}
