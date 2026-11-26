/**
 * Helper sentral untuk resolusi URL aset statis
 * Menggunakan env ASSET_BASE_URL (default: /images/)
 */
export function assetUrl(relativePath: string | null | undefined): string | null {
  if (!relativePath) return null;
  // Jika sudah URL lengkap http(s) atau diawali /, return langsung
  if (relativePath.startsWith("http://") || relativePath.startsWith("https://") || relativePath.startsWith("/")) {
    return relativePath;
  }
  const baseUrl = process.env.NEXT_PUBLIC_ASSET_BASE_URL || "/images/";
  const cleanBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const cleanPath = relativePath.startsWith("/") ? relativePath.slice(1) : relativePath;
  return `${cleanBase}${cleanPath}`;
}
