# ECDSA TypeScript

This is a simple tool for ECDSA (secp256k1) signatures verification.

## Install

Install dependencies with `npm install` or `yarn install`.

## Usage

```
Usage: ecdsa verify [options] <public-key> <message> <r> <s> <recovery-id>

verify ECDSA signature (secp256k1)

Arguments:
  public-key   public key (hex)
  message      message (hex)
  r            signature r (hex)
  s            signature s (hex)
  recovery-id  signature recovery ID (choice: 0,1,2,3)

Options:
  -h, --help   display help for command
```

## Example

Command:
```sh
./ecdsa.ts \
  verify \
  0x04f863124437b72fe0ec0359592053b281c6ca625194073418c35fb28435cf3a8c74d45b17cf60541eeef4f52786670da9710ed804ccb45e93a8d4cc7e15a5fee0 \
  0x456b7cdc2286b84a63d1b2edcde99f245f339cf5aea470e4f21ae4c04da190b0 \
  0x03ca7eb0ff319a225fc5d1eb03c53632014831f1310f43dbfed325022c823ccd \
  0x5e57f4ccf964ce7ec13929146bc8c1840bc726fb59f7be6c266b61373501935e \
  1
```

Output:
```
verifying ECDSA signature on secp256k1 curve
uncompressed public key: 04f863124437b72fe0ec0359592053b281c6ca625194073418c35fb28435cf3a8c74d45b17cf60541eeef4f52786670da9710ed804ccb45e93a8d4cc7e15a5fee0
message: 456b7cdc2286b84a63d1b2edcde99f245f339cf5aea470e4f21ae4c04da190b0
signature:
r          : 03ca7eb0ff319a225fc5d1eb03c53632014831f1310f43dbfed325022c823ccd
s          : 5e57f4ccf964ce7ec13929146bc8c1840bc726fb59f7be6c266b61373501935e
recovery ID: 1

SIGNATURE IS VALID!
```
