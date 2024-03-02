export class MaxNumberOfCheckInsError extends Error {
  constructor() {
    super("Multiple check-in on the same day.");
  }
}
