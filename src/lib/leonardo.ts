import axios from 'axios'

const LEONARDO_API_URL = 'https://cloud.leonardo.ai/api/rest/v1'

const leonardoApi = axios.create({
  baseURL: LEONARDO_API_URL,
  headers: {
    'Authorization': `Bearer ${process.env.LEONARDO_API_KEY}`,
    'Content-Type': 'application/json'
  }
})

export interface ImageGenerationParams {
  prompt: string
  modelId?: string
  width?: number
  height?: number
  numImages?: number
  guidance?: number
  steps?: number
}

export interface GeneratedImage {
  id: string
  url: string
  likelyGens: number
  nsfw: boolean
}

// Child-friendly model configurations
const CHILD_FRIENDLY_MODELS = {
  'CUTE_ANIMAL_DIFFUSION': '1aa0f478-51be-4efd-94e8-76bfc8f533af',
  'CUTE_RICH_STYLE': 'ac614f96-1082-45bf-be9d-757f2d31c174',
  'CHILDREN_BOOK_ILLUSTRATION': '291be633-cb24-434f-898f-e662799936ad'
}

export const generateStoryImage = async (
  prompt: string,
  style: 'cute_animals' | 'illustration' | 'watercolor' = 'illustration'
): Promise<GeneratedImage[]> => {
  try {
    // Enhance prompt for child-friendly content
    const enhancedPrompt = `
      Children's book illustration style, ${prompt}, 
      colorful, friendly, safe for children, no scary elements, 
      soft lighting, cartoon style, adorable, family-friendly
    `

    const modelId = style === 'cute_animals' 
      ? CHILD_FRIENDLY_MODELS.CUTE_ANIMAL_DIFFUSION
      : CHILD_FRIENDLY_MODELS.CHILDREN_BOOK_ILLUSTRATION

    const generationParams = {
      prompt: enhancedPrompt,
      modelId,
      width: 512,
      height: 512,
      numImages: 1,
      guidance: 7,
      steps: 20,
      negativePrompt: 'scary, dark, violent, inappropriate, adult content, weapons, blood'
    }

    // Start image generation
    const generationResponse = await leonardoApi.post('/generations', generationParams)
    const generationId = generationResponse.data.sdGenerationJob.generationId

    // Poll for completion
    let attempts = 0
    const maxAttempts = 30 // 5 minutes max wait time
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 10000)) // Wait 10 seconds
      
      const statusResponse = await leonardoApi.get(`/generations/${generationId}`)
      const generation = statusResponse.data.generations_by_pk
      
      if (generation.status === 'COMPLETE') {
        return generation.generated_images.map((img: any) => ({
          id: img.id,
          url: img.url,
          likelyGens: img.likelyGens,
          nsfw: img.nsfw
        }))
      } else if (generation.status === 'FAILED') {
        throw new Error('Image generation failed')
      }
      
      attempts++
    }
    
    throw new Error('Image generation timed out')
  } catch (error) {
    console.error('Error generating image:', error)
    throw new Error('Failed to generate image')
  }
}

export const generateMultipleImages = async (
  prompts: string[],
  style: 'cute_animals' | 'illustration' | 'watercolor' = 'illustration'
): Promise<GeneratedImage[][]> => {
  const imagePromises = prompts.map(prompt => generateStoryImage(prompt, style))
  
  try {
    return await Promise.all(imagePromises)
  } catch (error) {
    console.error('Error generating multiple images:', error)
    throw new Error('Failed to generate images')
  }
}

export const getUserGenerations = async (): Promise<any[]> => {
  try {
    const response = await leonardoApi.get('/generations/user')
    return response.data.generations
  } catch (error) {
    console.error('Error fetching user generations:', error)
    throw new Error('Failed to fetch generations')
  }
}

export const deleteGeneration = async (generationId: string): Promise<boolean> => {
  try {
    await leonardoApi.delete(`/generations/${generationId}`)
    return true
  } catch (error) {
    console.error('Error deleting generation:', error)
    return false
  }
} 