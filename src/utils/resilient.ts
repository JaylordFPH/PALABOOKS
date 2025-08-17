import pRetry from "p-retry"

export async function resilient<T>(
    fn: () => Promise<T>,
    options: {
        retries?: number
        fallback?: () => Promise<T> | T
    }
): Promise<T | null> {
    const {retries = 3, fallback} = options;
    try {
        return pRetry(() => fn(), {retries})
    } catch (err) {

        if(fallback) {
            return await fn();
        }
        console.error(`No fallback given in resilient. Error:`, err)
        return null
    }
}