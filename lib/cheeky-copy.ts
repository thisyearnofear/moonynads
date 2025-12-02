// Sophisticated wordplay and cheeky copy for Moonynads

export const CHEEKY_COPY = {
  // Loading states
  loading: [
    "Getting our ducks in a row...",
    "Positioning for optimal viewing...",
    "Checking the rear view...",
    "Mooning around with the data...",
    "Behind the scenes magic happening..."
  ],

  // Error messages  
  errors: {
    network: "Oops, we've hit a bump! Network seems to be dragging...",
    wallet: "Can't seem to connect the dots... or the wallet",
    balance: "Looks like your bag needs more cushioning",
    general: "Well, that's a pain in the assets!"
  },

  // Success messages
  success: {
    mint: "Boom! That's how you secure the bag(s)! 🍑",
    connect: "Connected! Now we're in the same boat... er, moon orbit",
    unlock: "Access granted! You're now part of the inner circle",
    purchase: "Transaction complete! That's some solid bottom-line investing"
  },

  // Feature descriptions
  features: {
    gallery: "A carefully curated collection where every piece has its place",
    advent: "12 days of reveals that'll keep you on the edge of your seat",
    tokenGating: "Exclusive access for those with serious backing",
    rarity: "Some positions are rarer than others - collect wisely",
    community: "Join a community that appreciates the finer... angles"
  },

  // Call-to-actions
  ctas: {
    explore: "Explore the Cheeks... er, Collection",
    mint: "Don't Be Cheeky - Mint Now",
    connect: "Get Behind This Project",
    discover: "Discover What's Behind the Art",
    join: "Join the Rear Guard",
    collect: "Collect 'Em All (Before They Moon)"
  },

  // Descriptions with subtle wordplay
  descriptions: {
    project: "A collection that shows cryptocurrency from a different angle",
    art: "ASCII art that knows how to make an impression",
    community: "For collectors who appreciate art with some... depth",
    rarity: "Each piece strategically positioned for maximum impact",
    value: "Investment opportunities that really bottom out the market"
  },

  // Easter egg messages
  secrets: {
    konami: "You've unlocked the cheeky code! Consider this your backstage pass",
    console: "Well hello there, you sly developer! Enjoying the view from behind the scenes?",
    clicks: "10 clicks! You're really committed to this relationship",
    shift: "Shift+Click reveals the hidden layers... there's always more than meets the eye",
    patience: "Your dedication has been... rear-markable! Welcome to the inner sanctum"
  },

  // Social sharing
  social: {
    twitter: "Just discovered the cheekiest NFT collection on @monad_xyz! These lunar assets are seriously collectible 🌙🍑 #Moonynads #CheekyArt",
    farcaster: "Found the most tastefully cheeky ASCII art on Monad! Don't let these moon phases slip behind you 🌙",
    discord: "Yo! Check out Moonynads - finally, art that knows how to make an... impression 😏"
  }
} as const

// Random cheeky phrase generator
export function getRandomCheekyPhrase(category: keyof typeof CHEEKY_COPY): string {
  const phrases = CHEEKY_COPY[category]
  if (Array.isArray(phrases)) {
    return phrases[Math.floor(Math.random() * phrases.length)]
  }
  return "Something cheeky this way comes..."
}

// Context-aware copy selection
export function getCheekyContext(context: 'professional' | 'playful' | 'insider'): {
  tone: string
  examples: string[]
} {
  switch (context) {
    case 'professional':
      return {
        tone: "Sophisticated with subtle hints",
        examples: [
          "Strategic positioning in the NFT market",
          "A collection with serious backing",
          "Art that makes a lasting impression",
          "Investment opportunities from every angle"
        ]
      }
    case 'playful': 
      return {
        tone: "Obvious wordplay but classy",
        examples: [
          "Don't get caught with your pants down - mint early!",
          "These collections have some serious junk in the trunk",
          "Bottom-tier prices for top-shelf art",
          "Getting behind the best ASCII art on Monad"
        ]
      }
    case 'insider':
      return {
        tone: "Full cheeky insider humor",
        examples: [
          "For those who appreciate the finer... assets",
          "Finally, art that knows how to moon properly",
          "This collection really knows how to make a statement... from behind",
          "Join the rear guard of digital art collectors"
        ]
      }
  }
}