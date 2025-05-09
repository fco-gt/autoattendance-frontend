interface RequestInit {
  /**
   * Required for streaming request bodies in Node.js/Next.js fetch.
   * See: https://github.com/nodejs/node/issues/46221
   */
  duplex?: "half";
}
