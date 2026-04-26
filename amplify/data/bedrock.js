export function request(ctx) {
  const { ingredients = [] } = ctx.args;

  const prompt = `Generate a clear recipe using these ingredients: ${ingredients.join(", ")}. Include a title, ingredients list, and numbered steps.`;

  return {
    resourcePath: `/model/amazon.titan-text-express-v1/invoke`,
    method: "POST",
    params: {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputText: prompt,
        textGenerationConfig: {
          maxTokenCount: 1000,
          temperature: 0.7,
          topP: 0.9,
        },
      }),
    },
  };
}

export function response(ctx) {
  const parsedBody = JSON.parse(ctx.result.body);

  if (parsedBody.results && parsedBody.results[0] && parsedBody.results[0].outputText) {
    return {
      body: parsedBody.results[0].outputText,
    };
  }

  return {
    body: "Bedrock returned an unexpected response: " + JSON.stringify(parsedBody),
  };
}
