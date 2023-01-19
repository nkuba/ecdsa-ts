#!/usr/bin/env npx ts-node

import { program } from "commander"
import { curve, ec } from "elliptic"

const CURVE_NAME: string = "secp256k1"

program
  .description("ECDSA")
  .command("verify")
  .description(`verify ECDSA signature (${CURVE_NAME})`)
  .argument("<public-key>", "public key (hex)")
  .argument("<message>", "message (hex)")
  .argument("<r>", "signature r (hex)")
  .argument("<s>", "signature s (hex)")
  .argument("<recovery-id>", "signature recovery ID (choice: 0,1,2,3)")
  .action((publicKeyArg, messageArg, rArg, sArg, recoveryIdArg, options) => {
    const secp256k1 = new ec(CURVE_NAME)

    const key = secp256k1.keyFromPublic(decodeHex(publicKeyArg))
    const message: Buffer = decodeHex(messageArg)
    const signatureR: Buffer = decodeHex(rArg)
    const signatureS: Buffer = decodeHex(sArg)
    const signatureRecoveryID: number = parseInt(recoveryIdArg)
    if (signatureRecoveryID < 0 || signatureRecoveryID > 3) {
      throw new Error("recovery id should be one of: [0,1,2,3]")
    }

    const signature: ec.SignatureOptions = {
      r: signatureR,
      s: signatureS,
      recoveryParam: signatureRecoveryID,
    }

    console.log(`verifying ECDSA signature on ${CURVE_NAME} curve`)
    console.log(
      "uncompressed public key:",
      key.getPublic().encode("hex", false)
    )
    console.log("message:", message.toString("hex"))
    console.log("signature:")

    console.log("r          :", signatureR.toString("hex"))
    console.log("s          :", signatureS.toString("hex"))
    console.log("recovery ID:", signatureRecoveryID)

    // Verify Signature.
    const isSignatureValid: boolean = secp256k1.verify(message, signature, key)
    if (!isSignatureValid) {
      program.error("\n\x1b[31mSIGNATURE VERIFICATION FAILED!\x1b[0m")
    }

    // Verify Recovery ID.
    // `secp256k1.verify` is not verifying the Recovery ID against the Public Key
    // so it has to be done separately.
    let recoveredPublicKey: curve.base.BasePoint
    try {
     recoveredPublicKey = secp256k1.recoverPubKey(
      message,
      { r: signatureR, s: signatureS },
      signatureRecoveryID,
      "hex"
     )
    } catch (err) {
      program.error(`"\n\x1b[31mfailed to recover public key from the signature: ${err}\x1b[0m`)
    }

    if (!key.getPublic().eq(recoveredPublicKey)) {
      program.error("\n\x1b[31mRECOVERY ID IS NOT VALID!\x1b[0m")
    }

    console.log("\n\x1b[32mSIGNATURE IS VALID!\x1b[0m")
  })

function decodeHex(value: string): Buffer {
  if (value.length % 2 != 0) {
    throw new Error(`hex value length is not even: ${value}`)
  }

  return Buffer.from(value.replace(/^(0x|0X)/, ""), "hex")
}

program.parse(process.argv)
