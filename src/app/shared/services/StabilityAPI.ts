import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { Recipe } from "../classes/Recipe";

/**
 * This interface represents the generation response of the stability API
 */
export interface GenerationResponse {
    /** Array of attributes */
    artifacts: Array<{
        base64: string;
        seed: number;
        finishReason: string;
    }>
}

/**
 * This class is responsible for generating new and unique recipes
 */
@Injectable({
    providedIn: "root"
})
export class StabilityAPI {

    /**
     * Returns the image of a given recipe
     * @param prompt The propmt aka. title of the recipe
     * @returns A promise containing the interface GenerationResponse
     */
    public async getImage(prompt: string): Promise<GenerationResponse> {
        prompt += " recipe"

        const engineId = 'stable-diffusion-512-v2-0';
        const apiHost = 'https://api.stability.ai';
        const apiKey = environment.STABILITY_API_KEY;

        const response = await fetch(
            `${apiHost}/v1beta/generation/${engineId}/text-to-image`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    text_prompts: [
                        {
                            text: prompt
                        }
                    ],
                    cfg_scale: 7,
                    clip_guidance_preset: 'FAST_BLUE',
                    height: 512,
                    width: 1024,
                    samples: 1,
                    steps: 50,
                })
            }
        );

        if (!response.ok) {
            throw new Error(`Non-200 response: ${await response.text()}`);
        }

        return await response.json() as GenerationResponse

    }

    /**
     * Generates the text for a recipe from a given prompt or title
     * @param req The prompt or title for a recipe
     * @returns A Promise containing a response object
     */
    public generateRecipe(req: string) {

        const apiKey = environment.CS_API_KEY;
        const options = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                'X-API-KEY': apiKey
            },
            body: JSON.stringify({
                enable_google_results: 'true',
                enable_memory: false,
                input_text: 'recipe with only ingrediens, instructions and cooking time in this format(hh:mm) as titles for ' + req
            })
        };

        return fetch('https://api.writesonic.com/v2/business/content/chatsonic?engine=premium', options)
    }

    /**
     * Parses a given string to a Recipe object
     * @param dirty_text String you want to parse
     * @returns An Recipe object
     */
    public parseRecipe(dirty_text: string): Recipe {
        const recipe = new Recipe();
        let is_malformed = false;

        try {
            // Remove all # from the string to have an uniform result
            dirty_text = dirty_text.split('#').join('');

            // Extract the recipe title
            const titleRegex = /^(.+)\n/m;
            const titleMatch = dirty_text.match(titleRegex);
            recipe.titles['en'] = titleMatch ? titleMatch[1]?.trim() : 'Broken';

            // Extract the ingredients
            const ingredientsRegex = /Ingredients[\s\S]*?(?=Instructions)/ms;
            const ingredientsMatch = dirty_text.match(ingredientsRegex);
            recipe.ingredients['en'] = ingredientsMatch
                ? ingredientsMatch[0]
                    .split('\n')
                    .filter((line) => line.trim() !== '')
                    .map((line) => line.trim().replace('- ', ''))
                : [];
            recipe.ingredients['en'].shift();

            // Extract the preparation text
            const preparationRegex = /Instructions[\s\S]*?(?=Cooking)/m;
            const preparationMatch = dirty_text.match(preparationRegex);
            recipe.preparation_text['en'] = preparationMatch
                ? preparationMatch[0].replace('Instructions\n', '')
                : '';

            // Extract the preparation time
            const timeRegex = /Cooking Time[\s\S]*/m;
            const timeMatch = dirty_text.match(timeRegex);
            recipe.preparation_time = timeMatch ? timeMatch[0].replace('Cooking Time\n', '').replace('- ', '') : '';
        } catch (err) {
            console.error(`The generated recipe could not be parsed`, err);
            is_malformed = true;
        }
        return is_malformed ? new Recipe() : recipe;
    }

    // public imageRequest(prompt: string) {
    // 	// Set up image parameters
    // 	const imageParams = new Generation.ImageParameters();
    // 	imageParams.setWidth(512);
    // 	imageParams.setHeight(512);
    // 	imageParams.addSeed(1234);
    // 	imageParams.setSamples(1);
    // 	imageParams.setSteps(50);

    // 	// Use the `k-dpmpp-2` sampler
    // 	const transformType = new Generation.TransformType();
    // 	transformType.setDiffusion(Generation.DiffusionSampler.SAMPLER_K_DPMPP_2M);
    // 	imageParams.setTransform(transformType);

    // 	// Use Stable Diffusion 2.0
    // 	const request = new Generation.Request();
    // 	request.setEngineId("stable-diffusion-512-v2-1");
    // 	request.setRequestedType(Generation.ArtifactType.ARTIFACT_IMAGE);
    // 	request.setClassifier(new Generation.ClassifierParameters());

    // 	// Use a CFG scale of `13`
    // 	const samplerParams = new Generation.SamplerParameters();
    // 	samplerParams.setCfgScale(13);

    // 	const stepParams = new Generation.StepParameter();
    // 	const scheduleParameters = new Generation.ScheduleParameters();

    // 	// Set the schedule to `0`, this changes when doing an initial image generation
    // 	stepParams.setScaledStep(0);
    // 	stepParams.setSampler(samplerParams);
    // 	stepParams.setSchedule(scheduleParameters);

    // 	imageParams.addParameters(stepParams);
    // 	request.setImage(imageParams);

    // 	// Set our text prompt
    // 	const promptText = new Generation.Prompt();
    // 	promptText.setText(prompt);

    // 	request.addPrompt(promptText);

    // 	// Authenticate using your API key, don't commit your key to a public repository!
    // 	const metadata = new grpc.Metadata();
    // 	metadata.set("Authorization", "Bearer " + "sk-ADY2WuQIfzTHl3CYqu3REAtlFvxkRAWxyYw07pmUBQLOStxK");

    // 	// Create a generation client
    // 	const generationClient = new GenerationService.GenerationServiceClient(
    // 	"https://grpc.stability.ai",
    // 	{}
    // 	);
    // 	// Send the request using the `metadata` with our key from earlier
    // 	const generation = generationClient.generate(request, metadata);

    // 	// Set up a callback to handle data being returned
    // 	generation.on("data", (data) => {
    // 		data.getArtifactsList().forEach((artifact) => {
    // 			// Oh no! We were filtered by the NSFW classifier!
    // 			if (
    // 				artifact.getType() === Generation.ArtifactType.ARTIFACT_TEXT &&
    // 				artifact.getFinishReason() === Generation.FinishReason.FILTER
    // 			) {
    // 			return console.error("Your image was filtered by the NSFW classifier.");
    // 			}

    // 			// Make sure we have an image
    // 			if (artifact.getType() !== Generation.ArtifactType.ARTIFACT_IMAGE) return;

    // 			// You can convert the raw binary into a base64 string
    // 			const base64Image = btoa(
    // 			new Uint8Array(artifact.getBinary_asU8()).reduce(
    // 				(data, byte) => data + String.fromCodePoint(byte),
    // 				""
    // 			)
    // 			);

    // 			// Here's how you get the seed back if you set it to `0` (random)
    // 			const seed = artifact.getSeed();

    // 			// We're done!
    // 			someFunctionToCallWhenFinished({ seed, base64Image });
    // 		});

    // 		function someFunctionToCallWhenFinished({ seed, base64Image }: any) {
    // 			const image = document.createElement("img");
    // 			image.src = `data:image/png;base64,${base64Image}`;
    // 			document.body.appendChild(image);
    // 		  }
    // 	});

    // 	// Anything other than `status.code === 0` is an error
    // 	generation.on("status", (status) => {
    // 		if (status.code === 0) return;
    // 			console.error(
    // 				"Your image could not be generated. You might not have enough credits."
    // 			);
    // 	});
    // }

}
