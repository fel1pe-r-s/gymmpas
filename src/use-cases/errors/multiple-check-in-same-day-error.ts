export class multipleCheckInSameDayError extends Error {
  constructor() {
    super("Multiple check-in on the same day.");
  }
}
