const express = require('express');
const cors = require('cors');
const {zkVerifySession, Library, CurveType, ZkVerifyEvents} = require("zkverifyjs");
const ethers=require("ethers")
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Routes
app.post('/zkverify', async (req, res) => {

    console.log("got request")
         
    const {proof} =req.body

const session = await zkVerifySession.start().Testnet().withAccount("")

const {events, transactionResult} = await session.verify().risc0().waitForPublishedAttestation()
.execute({proofData:{
    proof: proof.proof,
    vk: proof.image_id,
    publicSignals: proof.pub_inputs,
    version: "V1_2" // Mention the R0 version
}})

events.on(ZkVerifyEvents.IncludedInBlock, (eventData) => {
    console.log('Transaction included in block:', eventData);
});

events.on(ZkVerifyEvents.Finalized, (eventData) => {
    console.log('Transaction finalized:', eventData);
});



events.on(ZkVerifyEvents.AttestationConfirmed, async(eventData) => {
    console.log('Attestation Confirmed', eventData);
    let attestationId, leafDigest;
try {
    ({ attestationId, leafDigest } = await transactionResult);
    console.log(`Attestation published on zkVerify`)
    console.log(`\tattestationId: ${attestationId}`);
    console.log(`\tleafDigest: ${leafDigest}`);
} catch (error) {
    console.error('Transaction failed:', error);
}
    const proofDetails = await session.poe(attestationId, leafDigest);
    proofDetails.attestationId = eventData.id;
    console.log("proofDetails", proofDetails);
    res.json(proofDetails);
})
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
