export const iteratorToStream = <T>(iterator: {
  [Symbol.asyncIterator](): AsyncGenerator<T>;
}) =>
  new ReadableStream<T>({
    async pull(controller) {
      for await (const data of iterator) {
        controller.enqueue(data);
      }
      controller.close();
    },
  });

const containsErrorObject = (data: string) => {
  try {
    return !!JSON.parse(data).error;
  } catch {
    return false;
  }
};

export const streamToAsyncGenerator = (
  reader: ReadableStreamDefaultReader<Uint8Array>,
  transform = (x: string) => x,
  onDone: (x: string) => string | Promise<void> = (x: string) => x
) => ({
  async *[Symbol.asyncIterator]() {
    let stringBuilder = "";

    const decoder = new TextDecoder("utf-8");
    try {
      let { done, value } = await reader.read();
      while (!done) {
        const decoded = decoder.decode(value);
        if (containsErrorObject(decoded)) {
          yield "_*_error_*_";
          await new Promise((resolve) => setTimeout(resolve, 10));
          yield JSON.parse(decoded).error;
          done = true;
        } else {
          const transformed = transform(decoded);
          stringBuilder += transformed;
          yield transformed;
          ({ done, value } = await reader.read());
        }
      }
      onDone(stringBuilder);
    } finally {
      reader.releaseLock();
    }
  },
});
