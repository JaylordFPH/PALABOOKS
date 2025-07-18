export function slugify(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // remove special characters
        .trim()
        .replace(/\s+/g, '-')         // replace spaces with hyphens
        .replace(/-+/g, '-');         // collapse multiple hyphens
}