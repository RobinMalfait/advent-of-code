export default function (blob) {
  let [cardPublicKey, doorPublicKey] = blob.trim().split('\n').map(Number)
  let magic = 20201227

  let subjectNumber = 1
  let encryptionKey = 1

  while (subjectNumber !== cardPublicKey) {
    subjectNumber = (subjectNumber * 7) % magic
    encryptionKey = (encryptionKey * doorPublicKey) % magic
  }

  return encryptionKey
}
