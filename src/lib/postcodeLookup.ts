/**
 * Postcodes.io API integration for UK postcode lookup
 */

export interface PostcodeResult {
  postcode: string
  latitude: number
  longitude: number
  admin_district?: string
  parish?: string
  region?: string
  country?: string
  formattedAddress: string
}

const POSTCODE_REGEX = /^[A-Z]{1,2}[0-9][0-9A-Z]?\s*[0-9][A-Z]{2}$/i

export async function lookupPostcode(postcode: string): Promise<PostcodeResult | null> {
  // Clean the postcode
  const cleaned = postcode.replace(/\s+/g, '').toUpperCase()

  // Validate format
  if (!POSTCODE_REGEX.test(cleaned)) {
    return null
  }

  try {
    const response = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(cleaned)}`, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()

    if (data.status !== 200 || !data.result) {
      return null
    }

    const result = data.result

    // Build formatted address from available parts
    const addressParts = [
      result.parish,
      result.admin_district,
      result.region,
      result.country,
    ].filter(Boolean)

    return {
      postcode: result.postcode,
      latitude: result.latitude,
      longitude: result.longitude,
      admin_district: result.admin_district,
      parish: result.parish,
      region: result.region,
      country: result.country,
      formattedAddress: addressParts.length > 0
        ? `${result.postcode}, ${addressParts.join(', ')}`
        : result.postcode,
    }
  } catch (error) {
    console.error('Postcode lookup failed:', error)
    return null
  }
}

export async function validatePostcode(postcode: string): Promise<boolean> {
  const result = await lookupPostcode(postcode)
  return result !== null
}
