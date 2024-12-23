export let assert = (condition: any, message?: string) => {
    if (!condition) {
        throw new Error(message || "Assertion failed");
    }
}

export let unreachable = (message?: string): never => {
    throw new Error(message || "Unreachable code reached");
}