declare module 'pdfjs-dist/build/pdf.worker.entry' {
    // The worker entry module is typically used without any specific types.
    // We declare it as 'any' to bypass TypeScript errors.
    const worker: any;
    export default worker;
  }
  