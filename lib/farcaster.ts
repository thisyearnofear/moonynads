// Farcaster Mini App SDK integration
// Type-safe wrapper around @farcaster/miniapp-sdk

export async function composeCast(text: string) {
  try {
    const { sdk } = await import('@farcaster/miniapp-sdk')
    await sdk.actions.composeCast({
      text
    })
  } catch (error) {
    console.error('Failed to compose cast:', error)
  }
}

export async function closeApp() {
  try {
    const { sdk } = await import('@farcaster/miniapp-sdk')
    await sdk.actions.close()
  } catch (error) {
    console.error('Failed to close app:', error)
  }
}
