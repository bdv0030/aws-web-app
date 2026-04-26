export function request(ctx) {
  const { ingredients = [] } = ctx.args;

  const prompt = `Generate a clear recipe using these ingredients: ${ingredients.join(", ")}. Include a title, ingredients list, and numbered steps.`;

  return {
    resourcePath: `/model/amazon.nova-micro-v1:0/invoke`,
    method: "POST",
    params: {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: [{ text: prompt }],
          },
        ],
        inferenceConfig: {
          max_new_tokens: 1000,
          temperature: 0.7,
          top_p: 0.9,
        },
      }),
    },
  };
}

export function response(ctx) {
  const parsedBody = JSON.parse(ctx.result.body);

  if (parsedBody.output && parsedBody.output.message && parsedBody.output.message.content && parsedBody.output.message.content[0]) {
    return {
      body: parsedBody.output.message.content[0].text,
    };
  }

  return {
    body: "Bedrock returned an unexpected response: " + JSON.stringify(parsedBody),
  };
}
