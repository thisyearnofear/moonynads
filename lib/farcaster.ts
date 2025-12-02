// Farcaster Mini App SDK integration
// Type-safe wrapper around @farcaster/miniapp-sdk

let sdkReady = false

export async function initFarcasterSDK() {
  try {
    // Dynamically import SDK to avoid errors in non-Farcaster contexts
    const { sdk } = await import('@farcaster/miniapp-sdk')
    
    // Signal to Farcaster that the app is ready to display
    await sdk.actions.ready()
    sdkReady = true
    console.log('Farcaster Mini App SDK initialized')
    return true
  } catch (error) {
    console.log('Not running in Farcaster context')
    return false
  }
}

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
