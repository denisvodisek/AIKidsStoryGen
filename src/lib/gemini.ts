import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export interface StoryGenerationParams {
  character: string
  setting: string
  lesson: string
  ageGroup: '3-5' | '6-8' | '9-12'
  language: string
  storyLength: 'short' | 'medium' | 'long'
}

export interface GeneratedStory {
  title: string
  content: string
  pages: Array<{
    text: string
    imagePrompt: string
  }>
}

export const generateStory = async (params: StoryGenerationParams): Promise<GeneratedStory> => {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

  const lengthInstructions = {
    'short': '2-3 pages, simple sentences',
    'medium': '4-6 pages, moderate complexity',
    'long': '8-12 pages, detailed narrative'
  }

  const ageInstructions = {
    '3-5': 'Very simple words, short sentences, basic concepts',
    '6-8': 'Elementary vocabulary, clear storyline, educational elements',
    '9-12': 'Rich vocabulary, complex themes, character development'
  }

  const prompt = `
    Create a children's story with the following parameters:
    - Main character: ${params.character}
    - Setting: ${params.setting}
    - Moral lesson: ${params.lesson}
    - Age group: ${params.ageGroup} (${ageInstructions[params.ageGroup]})
    - Length: ${params.storyLength} (${lengthInstructions[params.storyLength]})
    - Language: ${params.language}

    Format the response as JSON with this structure:
    {
      "title": "Story title",
      "content": "Full story text",
      "pages": [
        {
          "text": "Text for this page",
          "imagePrompt": "Detailed description for image generation (in English, regardless of story language)"
        }
      ]
    }

    Requirements:
    - Age-appropriate content
    - Clear moral lesson integration
    - Engaging narrative
    - Each page should have 1-3 sentences for the specified age group
    - Image prompts should be detailed, child-friendly, and consistent in style
    - If language is not English, write the story in that language but keep image prompts in English
  `

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // Parse JSON response
    const story = JSON.parse(text.replace(/```json\n?|\n?```/g, ''))
    
    return story
  } catch (error) {
    console.error('Error generating story:', error)
    throw new Error('Failed to generate story')
  }
}

export const generateStoryVariation = async (
  originalStory: string,
  changes: string
): Promise<GeneratedStory> => {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

  const prompt = `
    Take this existing story and modify it based on the requested changes:
    
    Original Story: ${originalStory}
    
    Requested Changes: ${changes}
    
    Return the modified story in the same JSON format:
    {
      "title": "Modified story title",
      "content": "Full modified story text",
      "pages": [
        {
          "text": "Text for this page",
          "imagePrompt": "Detailed description for image generation"
        }
      ]
    }
  `

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    const story = JSON.parse(text.replace(/```json\n?|\n?```/g, ''))
    return story
  } catch (error) {
    console.error('Error generating story variation:', error)
    throw new Error('Failed to generate story variation')
  }
} 