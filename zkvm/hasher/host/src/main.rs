use axum::{routing::post, Router, Json};
use serde::{Deserialize, Serialize};
use tokio::net::TcpListener;
use tracing_subscriber;
use std::fs;
use methods::{HASHER_GUEST_ELF, HASHER_GUEST_ID};
use risc0_zkvm::{default_prover, ExecutorEnv};
use tower_http::cors::{CorsLayer};
use tower_http::cors::Any;

#[derive(Serialize, Deserialize)]
pub struct ProofOutput {
    pub proof: String,
    pub pub_inputs: String,
    pub image_id: String,
}

#[derive(Deserialize)]
struct InputData {
    input: f64,  // Changed from String to f64
}

async fn generate_proof(Json(payload): Json<InputData>) -> Json<ProofOutput> {
    let input = payload.input;
    println!("Received input: {}", input);

    // Convert f64 to bytes
    let input_bytes = input.to_le_bytes(); 

    let env = ExecutorEnv::builder()
        .write(&input_bytes) // Writing raw bytes
        .unwrap()
        .build()
        .unwrap();

    let prover = default_prover();
    let prove_info = prover.prove(env, HASHER_GUEST_ELF).unwrap();
    let receipt = prove_info.receipt;

    // Serialize proof into hexadecimal format
    let mut bin_receipt = Vec::new();
    ciborium::into_writer(&receipt, &mut bin_receipt).unwrap();
    let proof = hex::encode(&bin_receipt);

    fs::write("proof.txt", &proof).expect("Failed to write proof.txt");

    let pub_inputs = hex::encode(receipt.journal.bytes.as_slice());

    let image_id_hex = hex::encode(
        HASHER_GUEST_ID
            .into_iter()
            .flat_map(|v| v.to_le_bytes().into_iter())
            .collect::<Vec<_>>(),
    );

    let proof_output = ProofOutput {
        proof: format!("0x{}", proof),
        pub_inputs: format!("0x{}", pub_inputs),
        image_id: format!("0x{}", image_id_hex),
    };

    let proof_output_json = serde_json::to_string_pretty(&proof_output).unwrap();
    fs::write("proof.json", proof_output_json).expect("Failed to write proof.json");

    println!("Proof successfully stored in proof.json");

    receipt.verify(HASHER_GUEST_ID).expect("Verification failed");

    Json(proof_output)
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .init();

    let app = Router::new().route("/generate-proof", post(generate_proof))
                           .layer(
                            CorsLayer::new()
                            .allow_origin(Any)
                            .allow_methods(Any)
                            .allow_headers(Any)
                           );

    let listener = TcpListener::bind("127.0.0.1:3001").await.unwrap();
    println!("🚀 zkVM server running on http://127.0.0.1:3001");

    axum::serve(listener, app).await.unwrap();
}