// Farcaster Mini App SDK integration
import { sdk } from '@farcaster/miniapp-sdk'

export async function initFarcasterSDK() {
  try {
    // Signal to Farcaster that the app is ready to display
    await sdk.actions.ready()
    console.log('Farcaster Mini App SDK initialized')
    return true
  } catch (error) {
    console.log('Not running in Farcaster context:', error)
    return false
  }
}

export async function composeCast(text: string) {
  try {
    await sdk.actions.composeCast({
      text
    })
  } catch (error) {
    console.error('Failed to compose cast:', error)
  }
}

export async function closeApp() {
  try {
    await sdk.actions.close()
  } catch (error) {
    console.error('Failed to close app:', error)
  }
}

export { sdk }
