'use client'

import { useState } from 'react'
import { useAccount, useWriteContract } from 'wagmi'
import { MOONYNADS_CONTRACT } from '@/lib/contracts'

interface AllowlistEntry {
  address: string
  tier: 0 | 1 | 2
}

const TIER_LABELS = {
  0: 'Remove',
  1: 'Discount (50M m00nad)',
  2: 'Free'
}

export function AllowlistManager() {
  const { address, isConnected } = useAccount()
  const { writeContract, isPending } = useWriteContract()
  
  const [entries, setEntries] = useState<AllowlistEntry[]>([])
  const [csvInput, setCsvInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const parseCSV = (csv: string) => {
    try {
      setError(null)
      const lines = csv.trim().split('\n').filter(line => line.trim())
      const parsed: AllowlistEntry[] = []

      for (const line of lines) {
        const [addr, tierStr] = line.split(',').map(s => s.trim())
        
        if (!addr || !tierStr) {
          throw new Error('Invalid format. Use: address,tier')
        }

        if (!addr.startsWith('0x') || addr.length !== 42) {
          throw new Error(`Invalid address: ${addr}`)
        }

        const tier = parseInt(tierStr)
        if (![0, 1, 2].includes(tier)) {
          throw new Error(`Invalid tier ${tier}. Must be 0, 1, or 2`)
        }

        parsed.push({ address: addr, tier: tier as 0 | 1 | 2 })
      }

      setEntries(parsed)
      setSuccess(`Parsed ${parsed.length} entries`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Parse error')
    }
  }

  const handleSubmit = async () => {
    if (entries.length === 0) {
      setError('No entries to submit')
      return
    }

    try {
      const addresses = entries.map(e => e.address)
      const tiers = entries.map(e => e.tier)

      writeContract({
        address: MOONYNADS_CONTRACT.address,
        abi: MOONYNADS_CONTRACT.abi,
        functionName: 'setAllowlist',
        args: [addresses, tiers]
      })

      setSuccess(`Submitted ${entries.length} allowlist entries`)
      setCsvInput('')
      setEntries([])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission error')
    }
  }

  if (!isConnected) {
    return (
      <div className="text-center py-8">
        <p className="text-foreground/50">Connect wallet to manage allowlist</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6 border border-yellow-600/30 rounded-lg space-y-4">
      <h2 className="text-xl font-mono font-bold text-yellow-600">Allowlist Manager</h2>
      
      <div className="space-y-2">
        <label className="block text-sm font-mono text-foreground/70">
          CSV Format: address,tier (each line)
        </label>
        <p className="text-xs text-foreground/50">
          Tier: 0 = Remove, 1 = Discount (50M m00nad), 2 = Free
        </p>
        <textarea
          value={csvInput}
          onChange={(e) => {
            setCsvInput(e.target.value)
            setSuccess(null)
          }}
          placeholder="0x1234567890123456789012345678901234567890,1&#10;0xabcdefabcdefabcdefabcdefabcdefabcdefabcd,2"
          className="w-full h-32 p-3 bg-background border border-yellow-600/30 rounded font-mono text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-yellow-600"
        />
      </div>

      <button
        onClick={() => parseCSV(csvInput)}
        className="px-4 py-2 bg-yellow-600/30 hover:bg-yellow-600/50 text-yellow-600 font-mono text-sm rounded transition-colors"
      >
        Parse CSV
      </button>

      {entries.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-mono text-yellow-600">
            {entries.length} entries ready to submit
          </p>
          <div className="max-h-48 overflow-y-auto border border-yellow-600/20 rounded p-3 space-y-1">
            {entries.map((entry, i) => (
              <div key={i} className="text-xs font-mono text-foreground/70">
                <span className="text-yellow-600">{entry.address.slice(0, 6)}...{entry.address.slice(-4)}</span>
                {' → '}
                <span className="text-foreground/50">{TIER_LABELS[entry.tier]}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white font-mono text-sm rounded transition-colors"
          >
            {isPending ? 'Submitting...' : `Submit ${entries.length} Entries`}
          </button>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-sm font-mono">
          ❌ {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-500/10 border border-green-500/30 rounded text-green-400 text-sm font-mono">
          ✓ {success}
        </div>
      )}
    </div>
  )
}
