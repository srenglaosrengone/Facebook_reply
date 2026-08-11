export async function validatePageToken(token: string) {
  try {
    const res = await fetch(`https://graph.facebook.com/me?fields=id,name,username,picture{url}&access_token=${token}`)
    const data = await res.json()

    if (data.error) {
      throw new Error(data.error.message || 'Invalid access token')
    }

    if (!data.id || !data.name) {
      throw new Error('Invalid token: Could not fetch page information')
    }

    return {
      page_id: data.id,
      page_name: data.name,
      page_username: data.username || null,
      page_picture_url: data.picture?.data?.url || null,
    }
  } catch (error: any) {
    throw new Error(error.message || 'Failed to validate Facebook token')
  }
}
