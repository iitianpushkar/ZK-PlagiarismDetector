use risc0_zkvm::guest::env;
use sha2::{Digest, Sha256};

fn main() {
    // Read the input as f64 bytes
    let input_bytes: [u8; 8] = env::read();
    let input = f64::from_le_bytes(input_bytes);

    // Threshold check
    if input > 0.5 {
        panic!("high plagiarism detected");
    }

    let mut hasher = Sha256::new();
    hasher.update(input.to_le_bytes()); // Hash the floating-point number
    let result = hasher.finalize();
    let output = format!("{:x}", result); // Convert hash to hexadecimal string

    // Write public output to the journal
    env::commit(&output);
}
