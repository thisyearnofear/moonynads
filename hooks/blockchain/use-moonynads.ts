'use client'

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { MOONYNADS_CONTRACT } from '@/lib/contracts'
import { parseEther } from 'viem'

// Single hook for all Moonynads contract interactions
export function useMoonynads() {
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  // Read functions
  const useTokenURI = (tokenId: number) => {
    return useReadContract({
      address: MOONYNADS_CONTRACT.address as `0x${string}`,
      abi: MOONYNADS_CONTRACT.abi,
      functionName: 'tokenURI',
      args: [BigInt(tokenId)],
    })
  }

  const useOwnerOf = (tokenId: number) => {
    return useReadContract({
      address: MOONYNADS_CONTRACT.address as `0x${string}`,
      abi: MOONYNADS_CONTRACT.abi,
      functionName: 'ownerOf',
      args: [BigInt(tokenId)],
    })
  }

  const useBalanceOf = (address: string) => {
    return useReadContract({
      address: MOONYNADS_CONTRACT.address as `0x${string}`,
      abi: MOONYNADS_CONTRACT.abi,
      functionName: 'balanceOf',
      args: [address as `0x${string}`],
    })
  }

  const useTotalSupply = () => {
    return useReadContract({
      address: MOONYNADS_CONTRACT.address as `0x${string}`,
      abi: MOONYNADS_CONTRACT.abi,
      functionName: 'totalSupply',
    })
  }

  const useTokenRarity = (tokenId: number) => {
    return useReadContract({
      address: MOONYNADS_CONTRACT.address as `0x${string}`,
      abi: MOONYNADS_CONTRACT.abi,
      functionName: 'getTokenRarity',
      args: [BigInt(tokenId)],
    })
  }

  const useIsAdventTokenMinted = (day: number, userAddress: string) => {
    return useReadContract({
      address: MOONYNADS_CONTRACT.address as `0x${string}`,
      abi: MOONYNADS_CONTRACT.abi,
      functionName: 'isAdventTokenMinted',
      args: [BigInt(day), userAddress as `0x${string}`],
    })
  }

  // Write functions
  const mintAdventToken = async (day: number) => {
    writeContract({
      address: MOONYNADS_CONTRACT.address as `0x${string}`,
      abi: MOONYNADS_CONTRACT.abi,
      functionName: 'mintAdventToken',
      args: [BigInt(day)],
      value: parseEther('0.001'), // 0.001 MON
    })
  }

  const safeMint = async (to: string, tokenId: number) => {
    writeContract({
      address: MOONYNADS_CONTRACT.address as `0x${string}`,
      abi: MOONYNADS_CONTRACT.abi,
      functionName: 'safeMint',
      args: [to as `0x${string}`, BigInt(tokenId)],
    })
  }

  return {
    // Read hooks
    useTokenURI,
    useOwnerOf,
    useBalanceOf,
    useTotalSupply,
    useTokenRarity,
    useIsAdventTokenMinted,
    
    // Write functions
    mintAdventToken,
    safeMint,
    
    // Transaction state
    isPending,
    isConfirming,
    isSuccess,
    hash
  }
}