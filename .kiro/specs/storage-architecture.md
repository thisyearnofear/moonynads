# Storage Architecture Specification

## Overview
Multi-provider storage abstraction supporting Grove API and local fallback with automatic provider switching.

## Requirements

### Provider Support
1. **Grove Storage** (Primary)
   - Cloud-based storage
   - API authentication
   - Metadata persistence
   - Public URL generation

2. **Local Storage** (Fallback)
   - Browser localStorage
   - Base64 encoding
   - Limited capacity
   - No external dependencies

### Features
- Automatic provider detection
- Graceful fallback on failure
- Metadata capture with uploads
- Animation settings persistence
- File type support (PNG, WebM)

## Technical Architecture

### Provider Interface
```typescript
interface StorageProvider {
  name: string
  upload(file: File, metadata: UploadMetadata): Promise<UploadResult>
  isAvailable(): Promise<boolean>
}

interface UploadMetadata {
  designId: string
  animationSettings: AnimationSettings
  timestamp: number
  fileType: 'snapshot' | 'animation'
}

interface UploadResult {
  url: string
  provider: string
  metadata: UploadMetadata
}
```

### Provider Implementations

#### Grove Provider
```typescript
class GroveStorageProvider implements StorageProvider {
  private apiKey: string
  private endpoint: string
  
  async upload(file: File, metadata: UploadMetadata) {
    // 1. Convert file to base64
    // 2. POST to Grove API
    // 3. Return public URL
  }
  
  async isAvailable() {
    // Check API key and connectivity
  }
}
```

#### Local Provider
```typescript
class LocalStorageProvider implements StorageProvider {
  async upload(file: File, metadata: UploadMetadata) {
    // 1. Convert to base64
    // 2. Store in localStorage
    // 3. Return data URL
  }
  
  async isAvailable() {
    // Check localStorage quota
  }
}
```

### Storage Manager
```typescript
class StorageManager {
  private providers: StorageProvider[]
  
  async upload(file: File, metadata: UploadMetadata) {
    for (const provider of this.providers) {
      if (await provider.isAvailable()) {
        try {
          return await provider.upload(file, metadata)
        } catch (error) {
          console.warn(`${provider.name} failed, trying next`)
          continue
        }
      }
    }
    throw new Error('All storage providers failed')
  }
}
```

## API Integration

### Grove API Endpoint
```
POST /api/storage
Content-Type: application/json

{
  "file": "base64_encoded_data",
  "metadata": {
    "designId": "moon",
    "animationSettings": {...},
    "timestamp": 1234567890,
    "fileType": "snapshot"
  }
}

Response:
{
  "url": "https://grove.storage/...",
  "provider": "grove",
  "metadata": {...}
}
```

### Local Storage Schema
```typescript
// Key: `upload-${timestamp}-${designId}`
{
  dataUrl: string
  metadata: UploadMetadata
  provider: 'local'
}
```

## Implementation Details

### File Processing
1. Canvas → Blob (PNG/WebM)
2. Blob → File object
3. File → Base64 (for API)
4. Upload with metadata
5. Return public URL

### Metadata Capture
```typescript
interface CapturedMetadata {
  // Animation settings
  mode: string
  palette: string
  speed: number
  amplitude: number
  targetChars: string
  
  // Design info
  designId: string
  designName: string
  rarity: string
  
  // Upload info
  timestamp: number
  fileType: 'snapshot' | 'animation'
  fileSize: number
  dimensions: { width: number, height: number }
}
```

### Error Handling
- Provider unavailable → Try next provider
- Upload failed → Retry with exponential backoff
- All providers failed → Show user error
- Quota exceeded → Clear old uploads

## Success Criteria
- [ ] Grove uploads work when API key present
- [ ] Local fallback works without API key
- [ ] Metadata persists with uploads
- [ ] Provider switching is seamless
- [ ] Error messages are user-friendly
- [ ] Large files (>5MB) handled correctly
- [ ] Animation settings reproducible from metadata

## Kiro Implementation Notes
- Designed provider interface pattern through discussion
- Implemented Grove API integration with error handling
- Built automatic fallback mechanism
- Created metadata capture system
- Optimized file encoding for performance
