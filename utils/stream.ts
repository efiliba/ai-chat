export const iteratorToStream = <T>(iterator: { [Symbol.asyncIterator](): AsyncGenerator<T> }) =>
  new ReadableStream<T>({
    async pull(controller) {
      for await (const data of iterator) {
        controller.enqueue(data);
      }
      controller.close();
    }
  });

export const streamAsyncIterator = (
  reader: ReadableStreamDefaultReader<Uint8Array>,
  transform = (x: string) => x
) => ({
  async *[Symbol.asyncIterator]() {
    const decoder = new TextDecoder('utf-8');
    try {
      let { done, value } = await reader.read();
      while (!done) {
        yield transform(decoder.decode(value));
        ({ done, value } = await reader.read());
      }
    } finally {
      reader.releaseLock();
    }
  }
});
