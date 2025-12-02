export interface AnimationSettings {
  mode: 'still' | 'lineWave' | 'blockSway' | 'colorCycle' | 'glitch' | 'frameCycle' | 'svgWave'
  palette: 'yellow' | 'green' | 'blue' | 'rainbow'
  speed: number
  amplitude: number
  gradient: boolean
  targetChar: string
  targetSet: string
}

export interface StoreResult {
  url: string
  cid?: string
  animationSettings?: AnimationSettings
}

export interface StorageProvider {
  put: (opts: { 
    bytes: Uint8Array
    filename: string
    contentType?: string
    animationSettings?: AnimationSettings
  }) => Promise<StoreResult>
}
