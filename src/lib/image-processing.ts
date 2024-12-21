import { BlipApiResponse } from './types';

export async function processImage(imageData: string): Promise<string> {
  try {
    if (!imageData) {
      throw new Error('No image data provided');
    }

    // Remove the data URL prefix to get just the base64 data
    const base64Data = imageData.replace(/^data:image\/jpeg;base64,/, '');
    
    if (!base64Data) {
      throw new Error('Invalid image data format');
    }

    const binaryData = atob(base64Data);
    const bytes = new Uint8Array(binaryData.length);
    
    for (let i = 0; i < binaryData.length; i++) {
      bytes[i] = binaryData.charCodeAt(i);
    }

    const response = await fetch(
      "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large",
      {
        headers: {
          Authorization: "Bearer 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",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: bytes,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} ${errorText}`);
    }

    const result = await response.json() as BlipApiResponse[];
    
    if (!Array.isArray(result) || result.length === 0 || !result[0]?.generated_text) {
      throw new Error('Invalid API response format');
    }

    return result[0].generated_text;
  } catch (error) {
    // Log the full error for debugging
    console.error('Error processing image:', error instanceof Error ? error.message : 'Unknown error');
    return 'Sorry, there was an error processing the image. Please try again.';
  }
}