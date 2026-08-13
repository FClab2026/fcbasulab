export const getFullImageUrl = (url: string | null | undefined) => {
    if (!url) return ''
    if (url.startsWith('http') || url.startsWith('/')) return url
    return ''
}