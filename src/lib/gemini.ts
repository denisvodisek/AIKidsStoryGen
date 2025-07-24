import {
  StoryGenerationParams,
  StoryPage,
  GeneratedStory,
  CharacterGenerationParams,
  CharacterAnalysis,
  ArtStyle,
} from '@/types';

import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
  Modality,
} from '@google/genai';
import { storeStoryImage } from './supabase';

const genAI = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY!,
});

const config = {
  thinkingConfig: {
    thinkingBudget: -1,
  },
  responseMimeType: 'text/plain',
};

const model = 'gemini-2.5-pro';

// Retry configuration for rate limiting
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 30000, // 30 seconds
  backoffMultiplier: 2,
};

// Helper function to handle API calls with retry logic
const withRetry = async <T>(
  apiCall: () => Promise<T>,
  operation: string,
  retryCount = 0
): Promise<T> => {
  try {
    return await apiCall();
  } catch (error: any) {
    const isRateLimit =
      error?.message?.includes('429') ||
      error?.message?.includes('quota') ||
      error?.message?.includes('RESOURCE_EXHAUSTED');

    if (isRateLimit && retryCount < RETRY_CONFIG.maxRetries) {
      const delay = Math.min(
        RETRY_CONFIG.baseDelay *
          Math.pow(RETRY_CONFIG.backoffMultiplier, retryCount),
        RETRY_CONFIG.maxDelay
      );

      console.log(
        `Rate limited for ${operation}. Retrying in ${delay}ms (attempt ${retryCount + 1}/${RETRY_CONFIG.maxRetries})`
      );

      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(apiCall, operation, retryCount + 1);
    }

    // Re-throw the error if it's not rate limiting or max retries exceeded
    throw error;
  }
};

export const generateStory = async (
  params: StoryGenerationParams
): Promise<GeneratedStory> => {
  /*
   * SUPER PROMPT: AI Bedtime Story Generator
   * Generates personalized children's stories with detailed image descriptions
   * for integration with Leonardo AI and a custom platform.
   *
   * This prompt is designed for a target audience of children aged 1-7.
   * It ensures age-appropriate content, strict page count adherence,
   * and robust handling of vague parent input.
   */

  const prompt = `
/**
 * Task: Generate a complete children's bedtime story in JSON format.
 * The story must be highly visual, age-appropriate, and adhere to strict page limits.
 */

User variables:
${Object.entries(params)
  .map(([key, value]) => `${key}: ${value}`)
  .join('\n')}

//  **Language Rules:**
//    - The story MUST be generated in the language specified by the 'story_language' variable.
//    - The following JSON fields MUST be translated into the target language: "story_title", "content", and "chapter_title".
//    - ALL other JSON keys and values MUST remain in English. This is critical for system compatibility.
//    - Specifically, "photo_description" and "reasoning" MUST ALWAYS be in English.
//    - When using other language than English for the story, make sure the grammar is correct, usage of words is correct (VERY IMPORTANT) and that the story makes sense.


// 1. **Story Planning & Guardrails:**
//    - Analyze parentStoryIdea.
//    - If parentStoryIdea is minimal or vague (e.g., just a lesson like "loyalty"), you MUST autonomously expand it.
//      - **If Location is missing:** Choose a classic children's story setting, be creative. (e.g., Enchanted Forest, Cozy Farm, Sparkly Underwater World).
//      - **If Core Adventure/Challenge is missing:** Create a simple, positive adventure (e.g., finding a lost toy, helping a small animal, exploring a new place, solving a simple mystery).
//      - **If Lessons are missing/vague:** Choose 1-2 positive, age-appropriate lessons (e.g., kindness, sharing, bravery, curiosity, friendship).
//      - **If Characters are missing (besides the main character (${params.kidCharacterName})):** Introduce 1-2 simple, friendly supporting characters (e.g., a talking animal, a friendly gnome, a magical sprite). **You MUST generate a detailed visual description for each new supporting character and add it to the 'other_characters' array at the story's root.**
//    - The story MUST always have a gentle, positive arc, culminating in a comforting resolution that reinforces the lesson(s). Avoid any scary or overly complex themes.
//    - Determine the story's main title based on the generated plot.
//    - Avoid violence or any other topic that could affect the kids.

// 2. **Page Count Adherence:**
//    - **Strictly adhere to desiredPageCount.** If desiredPageCount is not 5, 10, or 15, default to 10 pages for the entire story.
//    - The pages array in the JSON output MUST contain exactly desiredPageCount objects.
//    - **Page Distribution:**
//      - Page 1: Always the cover.
//      - Remaining pages: story_pages, evenly distributing the narrative. The final page must be the story's conclusion.

// 3. **Age-Appropriate Content and Style:**
//    - **For kidAge 1-3 (Early Childhood):**
//      - **Content:** Very simple plots, focus on basic actions, colors, animals, and immediate surroundings. Repetitive, comforting, and visually driven. Minimal conflict.
//      - **Sentence Length:** Extremely short and simple (1-2 clauses per sentence).
//      - **Vocabulary:** Only very basic and common words.
//      - **Story Pacing:** Slow, gentle.
//      - **Character Mentions:** Refer to the child by kidCharacterName but keep their in-story physical description minimal. Rely on photo_description for visual details.
//    - **For kidAge 4-5 (Preschool/Early Elementary):**
//      - **Content:** Simple narratives with a clear beginning, a mild, solvable challenge, and a happy resolution. Introduces basic problem-solving.
//      - **Sentence Length:** Short to medium sentences (2-4 clauses), simple compound sentences.
//      - **Vocabulary:** Growing, but still easily understandable words.
//      - **Story Pacing:** Gentle, flowing.
//      - **Character Mentions:** Use kidCharacterName naturally.
//    - **For kidAge 6-7 (Early Elementary):**
//      - **Content:** More developed plots with a discernible arc, slightly more complex challenges (overcome through perseverance/teamwork), and clearer moral lessons. Can introduce simple supporting characters or minor plot twists.
//      - **Sentence Length:** Varied sentence structures, including some complex sentences.
//      - **Vocabulary:** Wider range, including more descriptive adjectives and adverbs.
//      - **Story Pacing:** Moderate.
//      - **Chapter Titles:** For these ages, divide the story into 2-4 logical "chapters." Each chapter's first story_page should include a chapter_title.
//      - **Character Mentions:** Use kidCharacterName naturally, can include slightly more descriptive language if relevant to the plot, but avoid repeating kidCharacterDescription in the story text.

// 4. **JSON Output Structure:**
//    - Return a single JSON object with the following structure.
//    - Ensure all fields are populated correctly.

Return the story in this exact JSON format:
{
  "story_title": "Generated Story Title based on the plot", // MUST be in the target 'story_language'.
  "story_language": "${languagePromptEnhancer(params.language)}",
  "story_art_style": "${params.storyArtStyle}",
  "story_art_style_description": "${params.storyArtStyleDescription}",
    "characters": [
    {
      "name": "${params.kidCharacterName}",
      "description": "${params.kidCharacterDescription}" // Describe their physical appearance, clothes, and accessories, make sure they are consitent across the story.
    },
    {
      "name": "Sparky",
      "description": "Sparky, a tiny, glowing fairy with iridescent wings, wearing a dress made of dewdrops and leaves, with long, flowing silver hair and mischievous green eyes." // Describe their physical appearance, clothes, and accessories, make sure they are consitent across the story.
    },
    {
      "name": "Dino",
      "description": "Dino, a friendly, plump green dinosaur, short and stout, with large, curious eyes and small, stubby arms, always smiling." // Describe their physical appearance, clothes, and accessories, make sure they are consitent across the story.
    }
    // Add more objects for each new character introduced 
  ],
  "pages": [
    {
      "page_number": 1,
      "page_type": "cover",
      "chapter_title": null, // Cover page does not have a chapter title
      "content": "[INSERT STORY TITLE HERE]", // MUST be in the target 'story_language'.
      "reasoning": "This page serves as the cover, introducing the story's title and primary protagonist.",
      "photo_description": "Art Style: ${params.storyArtStyleDescription}. " +
                           "Photo description for this page: [Describe the scene, including specific actions, emotions, objects, and setting details (e.g., 'a glowing mushroom in a magical forest'), time of day, lighting, and perspective]. " +
                           "The image should be significantly zoomed out, showing the broader environment and all key elements. " +
                           "IMPORTANT: This image serves as the cover, introducing the story's title and primary protagonist. It should clearly hint at the story's main setting and include all the characters in the story. It should be inspirational. " +
                           "Characters present: [Dynamically generate character descriptions here based on 'characters_on_page' using the detailed format below].",
      "characters_on_page": ["${params.kidCharacterName}"] // Example: ["${params.kidCharacterName}", "Dino", "Sparky"]
    },
    // Each story page should follow this structure:
    {
      "page_number": /* Incrementing number, e.g., 2 or 3 */,
      "page_type": "story_page",
      "chapter_title": "Optional Chapter Title for the start of each new chapter (null if not applicable for this age/page)", // MUST be in the target 'story_language'.
      "content": "Story text for this page. Keep sentences concise and appropriate for the kidAge.", // MUST be in the target 'story_language'.
      "reasoning": "Brief explanation of this page's narrative purpose", // MUST be in the target 'story_language'.
      "photo_description": "Art Style: ${params.storyArtStyleDescription}. " +
                           "Photo description for this page: [Describe the specific scene for this page, including actions, emotions, objects, and setting details (e.g., 'a glowing mushroom in a magical forest'), time of day, lighting, and perspective]. " +
                           "The image should be slightly zoomed out, showing more of the environment. " +
                           "Characters present: [Dynamically generate character descriptions here based on 'characters_on_page' using the detailed format below].",
      "characters_on_page": ["Dino"] // Example: add character names as they appear on this page, it could also be empty if no characters are appearing on this page (if only landscape or background is being generated)
    }
    // ... continue generating pages up to desiredPageCount, ensuring story flow and resolution.
  ]
}

IMPORTANT: Ensure the pages array contains exactly ${params.desiredPageCount} pages. The final page must conclude the story and reinforce the lesson.

// IMPORTANT INSTRUCTION FOR GENERATING PHOTO_DESCRIPTION FOR COVER AND STORY PAGES:
// For each 'photo_description', construct the string using the following steps:
// 1. Start with the "Art Style" using '${params.storyArtStyleDescription}'.
// 2. Add the main scene description: "[Describe the specific scene for this page, including actions, emotions, objects, and setting details (e.g., 'a glowing mushroom in a magical forest'), time of day, lighting, and perspective]."
// 3. Add the fixed composition details:
//    - For 'cover' pages: "The image should be significantly zoomed out, showing the broader environment and all key elements. IMPORTANT: This image serves as the cover, introducing the story's title and primary protagonist. It should clearly hint at the story's main setting and include all the characters in the story. It should be inspirational."
//    - For 'story_page' pages: "The image should be slightly zoomed out, showing more of the environment."
// 4. Add the character descriptions based on the 'characters_on_page' array for this specific page. 
// How to dynamically generate character descriptions:
//    - Prepend the art style instruction to each character's detailed description. 
//    - If '${params.kidCharacterName}' is in 'characters_on_page': "A character must follow the ${params.storyArtStyle} art style: ${params.kidCharacterDescription}."
//    - If any other character name (e.g., "Dino") is in 'characters_on_page', retrieve its full description from the top-level 'other_characters' array. Prepend the art style: "A character must follow the ${params.storyArtStyle} art style: [CharacterName], [CharacterDescription]."
//    - Combine all relevant character descriptions into a single, cohesive "Characters present:" section at the end of the 'photo_description' string. Ensure characters consistency throughout the story.
`;

  const apiCall = async () => {
    const response = await genAI.models.generateContent({
      model,
      config,
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
    });
    const text = response.text || '';

    // Parse JSON response
    const story = JSON.parse(text.replace(/```json\n?|\n?```/g, ''));
    return story;
  };

  try {
    return await withRetry(apiCall, 'story generation');
  } catch (error) {
    console.error('Error generating story:', error);
    throw new Error('Failed to generate story');
  }
};

export const analyzeCharacterImage = async (
  imageUrl: string,
  params: CharacterGenerationParams
): Promise<CharacterAnalysis> => {
  const prompt = `
## Step 1: Customizable Parameters
**Using the image and info below, I want you to fill in the data wherever it's blank after the colon. Write your answer in brackets. When describing features, focus on their inherent structure and appearance, not the character's temporary expression.**
Character Name: ${params.character_name}
Character Age: ${params.character_age}
Character Gender: ${params.character_gender}
Body Type/Build (Choose from: Slim, Average, Stocky, Muscular, Petite, Tall & Slender, Short & Round, Athletic, Delicate):
Height Perception (e.g., Appears shorter than average for their age, or surprisingly tall):
Hairstyle (Choose from: Pixie Cut, Buzz Cut, Crew Cut, Bob Cut, Shag, Lob, Layered Cut, Undercut, French Bob, V-Cut, U-Cut, Feathered Cut, Curly Bob, Beach Waves, Afro, Ringlets, Spiral Curls, Classic Bun, Top Knot, Chignon, Braided Bun, Messy Bun, Classic Braid, French Braid, Dutch Braid, Fishtail Braid, Cornrows, High Ponytail, Low Ponytail, Side Ponytail, Braided Ponytail, Bubble Ponytail, Pompadour, Quiff, Slick Back, Side Part, Mohawk, Dreadlocks, Man Bun, Emo Cut, Mullet, Straight Across Bangs, Side-Swept Bangs, Curtain Bangs, Wispy Bangs, Blunt Bangs, or others if you cannot pick from the above; also add a very descriptive adjectives like "tousled," "neatly combed," "wild and curly," "sleek," "braided elaborately," "short and spiky"):
Hair Color (Choose from: Black, Brown, Blonde, Auburn, Red, Gray, White, Silver, Platinum Blonde, Golden Blonde, Strawberry Blonde, Light Brown, Dark Brown, Chestnut, Burgundy, Blue, Green, Pink, Purple, Orange, Multicolored; adding nuance like "sun-kissed blonde," "deep auburn," "jet black with blue undertones"):
Eye Color (Choose from: Blue, Green, Brown, Hazel, Gray, Amber, Black; add a descriptive adjective like "sparkling," "observant," "mischievous," "calm," "wide-eyed," "narrowed"):
Nose Shape (Choose from: Button, Roman, Aquiline, Snub, Greek/Straight, Celestial, Nubian, Hawk; add descriptive adjectives like "small and delicate," "prominent," "upturned," "slender," "broad," "pointed," "subtle"):
Eyebrow Style (Choose from: Straight, Arched, S-shaped, Rounded, Bushy, Thin, Angled; add descriptive adjectives like "neatly groomed," "wild and unruly," "lightly feathered," "dark and prominent," "expressive," "subtle," "high-set," "low-set"):
Chin Shape (Choose from: Rounded, Square, Pointed/V-shaped, Cleft, Receding, Prominent; add descriptive adjectives like "soft," "strong," "delicate," "defined," "gentle curve," "sharp point"):
Jawline (Choose from: Soft, Defined, Strong/Angular, Rounded, Narrow; add descriptive adjectives like "smooth," "sharp," "broad," "tapered," "youthful," "mature"):
Cheek Shape (Choose from: Full/Puffy, High Cheekbones, Sunken, Rounded, Sculpted; add descriptive adjectives like "chubby," "rosy," "defined," "smooth"):
Ear Shape & Placement (Choose from: Attached Lobes, Detached Lobes, Pointed/Elfin, Flat, Protruding; add descriptive adjectives like "small and neat," "average size," "slightly prominent," "tucked close to the head," "rounded," "elongated"):
Distinctive Facial Features (e.g., Freckles across the nose, a dimple, a small scar above the eyebrow, prominent cheekbones, a button nose, full lips, expressive eyebrows - *do NOT describe the current expression like 'in a pout, crying, open mouth etc'*):
Facial Proportions/Symmetry: (e.g., generally symmetrical, slightly asymmetrical in an endearing way, high forehead, narrow chin):
Skin Tone (Choose from: Fair, Light, Medium, Olive, Tan, Bronze, Dark, Deep, Alabaster, Porcelain, Ivory, Beige, Sand, Golden, Caramel, Honey, Chestnut, Espresso, Cocoa, Chocolate, Ebony, Almond, Warm Beige; adding a descriptor like "rosy cheeks," "slightly tanned," "smooth and unblemished," "warm glow"):
Accessories (Be highly specific. For each, describe its appearance, placement, and any notable wear/tear or significance. E.g., "A pair of round, tortoiseshell glasses perched on their nose, slightly askew," "A worn leather backpack slung casually over one shoulder, adorned with a single brightly colored patch," "A delicate silver locket worn around their neck, hidden beneath their shirt collar," "A wide-brimmed straw hat with a frayed edge," "Bright red sneakers with untied laces."):

## Step 2: Essential Guidelines
**Generate a character description based on the data from Step 1. Ensure the description flows naturally and vividly paints a picture of the character.**. Do not mention child, kid in the description, just age and gender. No need to focus on the current expression of the character and clothes as I will be generating character in different situations wearing different clothes.

**Return all the information from Step 1 and the generated description from Step 2 in JSON format.** 
//    - Return a single JSON object with the following structure.
//    - Ensure all fields are populated correctly.

The JSON structure should be as follows:
{
  "character_name": "",
  "character_age": "",
  "character_gender": "",
  "body_type_build": "",
  "height_perception": "",
  "hairstyle": "",
  "hair_color": "",
  "eye_color": "",
  "nose_shape": "",
  "eyebrow_style": "",
  "chin_shape": "",
  "jawline": "",
  "cheek_shape": "",
  "ear_shape_placement": "",
  "distinctive_facial_features": "",
  "facial_proportions_symmetry": "",
  "skin_tone": "",
  "accessories": "",
  "description": ""
}
  `;

  const apiCall = async () => {
    const response = await fetch(imageUrl);
    const imageArrayBuffer = await response.arrayBuffer();
    const base64ImageData = Buffer.from(imageArrayBuffer).toString('base64');

    const result = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64ImageData,
          },
        },
        { text: prompt },
      ],
    });

    const text = result.text || '';

    // Parse JSON response, removing any markdown formatting
    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
    const characterAnalysis = JSON.parse(cleanText);

    console.log('Analysis', characterAnalysis);
    return characterAnalysis;
  };

  try {
    return await withRetry(apiCall, 'character image analysis');
  } catch (error) {
    console.error('Error analyzing character image:', error);
    throw new Error('Failed to analyze character image');
  }
};

export const generateImages = async (
  story: GeneratedStory,
  onProgress?: (completed: number, total: number) => void
) => {
  const totalImages = story.pages.length;

  console.log(`Generating ${totalImages} images for story pages...`);

  // Batch size for parallel processing (to avoid rate limits)
  const BATCH_SIZE = 3;
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000; // 1 second base delay

  // Helper function to generate a single image with retry logic
  const generateSingleImage = async (
    storyId: string,
    page: StoryPage,
    retryCount = 0
  ): Promise<{ pageNumber: number; photoUrl: string | null }> => {
    try {
      const imagePrompt = page.photo_description;

      const response = await genAI.models.generateImages({
        model: 'models/imagen-3.0-generate-002',
        prompt: imagePrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '16:9',
        },
      });

      if (!response?.generatedImages) {
        throw new Error('No image data received');
      }
      if (!response.generatedImages?.[0]?.image?.imageBytes) {
        throw new Error('No image data received');
      }
      const imageData = response.generatedImages[0].image.imageBytes;

      const result = await storeStoryImage(
        imageData,
        storyId,
        page.page_number
      );
      if (result.error) {
        console.error('Failed to store image:', result.error);
      } else {
        console.log('Image stored:', result.data?.publicUrl);
      }

      return {
        pageNumber: page.page_number,
        photoUrl: result.data?.publicUrl || null,
      };
    } catch (error) {
      console.error(
        `❌ Failed to generate image for page ${page.page_number}:`,
        error
      );

      // Retry logic with exponential backoff
      if (retryCount < MAX_RETRIES) {
        const delay = RETRY_DELAY * Math.pow(2, retryCount);
        console.log(
          `🔄 Retrying page ${page.page_number} in ${delay}ms (attempt ${retryCount + 1}/${MAX_RETRIES})`
        );

        await new Promise(resolve => setTimeout(resolve, delay));
        return generateSingleImage(storyId, page, retryCount + 1);
      }

      console.error(`💥 Max retries exceeded for page ${page.page_number}`);
      return { pageNumber: page.page_number, photoUrl: null };
    }
  };

  // Process images in batches
  const results: Array<{ pageNumber: number; photoUrl: string | null }> = [];
  let completedCount = 0;

  for (let i = 0; i < story.pages.length; i += BATCH_SIZE) {
    const batch = story.pages.slice(i, i + BATCH_SIZE);
    console.log(
      `📦 Processing batch ${Math.floor(i / BATCH_SIZE) + 1} (pages ${batch.map(p => p.page_number).join(', ')})`
    );

    // Generate images for current batch in parallel
    const batchPromises = batch.map(page =>
      generateSingleImage(story.id, page)
    );
    const batchResults = await Promise.all(batchPromises);

    results.push(...batchResults);
    completedCount += batch.length;

    // Report progress
    onProgress?.(completedCount, totalImages);
    console.log(
      `📈 Progress: ${completedCount}/${totalImages} images generated`
    );

    // Small delay between batches to be respectful to the API
    if (i + BATCH_SIZE < story.pages.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // Update story pages with image data
  const updatedPages = story.pages.map(page => {
    // Update ALL pages (including cover pages) that had images generated
    const result = results.find(r => r.pageNumber === page.page_number);
    if (result) {
      return {
        ...page,
        photo_url: result.photoUrl || null,
      };
    }
    return page;
  });

  const successCount = results.filter(r => r.photoUrl !== null).length;
  const failCount = totalImages - successCount;

  console.log(
    `🎉 Image generation complete: ${successCount}/${totalImages} successful, ${failCount} failed`
  );

  return {
    ...story,
    pages: updatedPages,
    photo_generation_stats: {
      total: totalImages,
      successful: successCount,
      failed: failCount,
    },
  };
};

export const artStylePromptEnhancer = (style: string) => {
  const defaultStyle =
    "A modern 3D animated movie style, characterized by realistic textures, expressive character designs with slightly exaggerated features, detailed environments, and dynamic lighting. Think the visual richness of 'Frozen', 'Shrek', or 'Toy Story'. Characters have soft, rounded edges, and environments are lush and immersive.";
  if (style === 'disney-pixar') {
    return defaultStyle;
  } else if (style === 'paw-patrol') {
    return "A bright, bold, and energetic 3D cartoon style designed for young children. It features chunky, rounded characters with oversized heads and expressive eyes, vibrant primary and secondary colors, and clear, action-oriented compositions. Environments are simplified but colorful, emphasizing a sense of fun, teamwork, and friendly adventure, similar to the animated 'Paw Patrol' series.";
  } else if (style === 'lego') {
    return "A stylized, block-based 3D cartoon style, less detailed, where all characters, objects, and environments are constructed from interlocking LEGO bricks and elements. Features include simplistic, often smiling, 'minifigure' faces, primary color palettes, and a distinct, angular, playful aesthetic. Everything appears as if built from real LEGO pieces, even if complex structures are depicted.";
  } else if (style === 'classic-disney') {
    return "A traditional 2D hand-drawn animation style with fluid lines, lush watercolor-like backgrounds, and iconic, graceful character designs. The aesthetic emphasizes soft colors, intricate details in fantastical settings, and a timeless, illustrative quality, reminiscent of 'Snow White', 'Cinderella', or 'Beauty and the Beast'.";
  }
  return defaultStyle;
};

export const languagePromptEnhancer = (language: string) => {
  const defaultLanguage = 'en';
  if (language === 'en') {
    return defaultLanguage;
  } else if (language === 'sl') {
    return 'Slovenian language';
  }
  return defaultLanguage;
};
