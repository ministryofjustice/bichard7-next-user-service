import { URL } from "url"

export default function getBaseUrl(inputUrl?: string): string | null {
  if (!inputUrl) {
    return null
  }
  try {
    const parsedUrl = new URL(inputUrl)
    return `${parsedUrl.protocol}//${parsedUrl.host}`
  } catch (e) {
    return null
  }
}
