import sanityClient from '@sanity/client'

export const client = sanityClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: 'production',
    apeVersion: 'v1',
    token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
    userCdn: false,
    
})