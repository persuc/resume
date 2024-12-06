function encipher(key: string, plaintext: string): string {
  function validate(x: string, name: string) {
    if (x.split("").some(c => c.charCodeAt(0) < 65 || c.charCodeAt(0) > 90)) {
      throw Error(`expected uppercase alphabetic ${name} only, got ${plaintext}`)
    }
  }

  validate(key, "key")
  validate(plaintext, "plaintext")

  return plaintext.split("").map((c, i) => String.fromCharCode((c.charCodeAt(0) + key.charCodeAt(i % key.length) - 130) % 26 + 65)).join('')
}

function decipher(key: string, ciphertext: string): string {
  return ciphertext.split("").map((c, i) => String.fromCharCode((((c.charCodeAt(0) - key.charCodeAt(i % key.length)) % 26) + 26) % 26 + 65)).join('')
}

export default function createVignere(key: string) {
  return {
    encipher: (plaintext: string) => encipher(key, plaintext),
    decipher: (ciphertext: string) => decipher(key, ciphertext),
  }
}