export function getApiModel(): string {
  return `
    interface Reducers {}

    class api {
      static reducer<Name extends keyof Reducers>(
        name: Name, 
        reducer: (
          state: Reducers[Name]["State"], 
          event: Reducers[Name]["Event"]
        ) => Reducers[Name]["State"]
      ): void {}
    }
  `;
}
