# Chatbot+Whisper

This repo is originally from the repo [chatbot-ui](https://github.com/mckaywrigley/chatbot-ui) but with Whisper integration.

You can use the same `OPENAI_API_KEY` to automatically turn your voice into queries for Chatgpt.

![Chatbot UI](./public/screenshots/screenshot-0402023.jpg)

## Updates

The repo will keep updated with the original Chatbot-UI repo (I'm not good at designing frontend tbh).

Other updates:
- [ ] Transcribing system audio (such as voice made by other people in a meeting)
- [ ] Langchain (such as answering questions according to a pdf)
- [ ] TBD

## Deploy

**Vercel**

Host your own live version of Chatbot UI with Vercel.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmckaywrigley%2Fchatbot-ui)

**Docker Build**

```shell
docker build -t Chatgpt_Whisper
docker run -e OPENAI_API_KEY=xxxxxxxx -p 3000:3000 Chatgpt_Whisper
```

## Running Locally

**1. Clone Repo**

```bash
git clone https://github.com/oubotong/Chatgpt_Whisper.git
```

**2. Install Dependencies**

Make sure you are using `node --version <= v16.20.1 `. Otherwise, you will suffer from `OPEN AI: Can not parse multipart form` error (Took me a whole night).
```bash
npm i
```

**3. Provide OpenAI API Key**

Overwrite `.env` file in the root of the repo with your OpenAI API Key:

```bash
OPENAI_API_KEY=YOUR_OPENAI_KEY
```

> You can set `OPENAI_API_HOST` where access to the official OpenAI host is restricted or unavailable, allowing users to configure an alternative host for their specific needs.

> Additionally, if you have multiple OpenAI Organizations, you can set `OPENAI_ORGANIZATION` to specify one.

**4. Run App**

By default, it will be `localhost:3000`
```bash
npm run dev
```

**5. Use It**

You should be able to start chatting ( using your voice :kissing: ).

To be specific:
  1. Click :headphones: to get microphone permission
  2. Click :small_red_triangle_down: to start speaking
  3. Click :white_circle: to stop speaking. It will automatically send the transcribed text to chatgpt.

## Configuration

When deploying the application, the following environment variables can be set:

| Environment Variable              | Default value                  | Description                                                                                                                               |
| --------------------------------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| OPENAI_API_KEY                    |                                | The default API key used for authentication with OpenAI                                                                                   |
| OPENAI_API_HOST                   | `https://api.openai.com`       | The base url, for Azure use `https://<endpoint>.openai.azure.com`                                                                         |
| OPENAI_API_TYPE                   | `openai`                       | The API type, options are `openai` or `azure`                                                                                             |
| OPENAI_API_VERSION                | `2023-03-15-preview`           | Only applicable for Azure OpenAI                                                                                                          |
| AZURE_DEPLOYMENT_ID               |                                | Needed when Azure OpenAI, Ref [Azure OpenAI API](https://learn.microsoft.com/zh-cn/azure/cognitive-services/openai/reference#completions) |
| OPENAI_ORGANIZATION               |                                | Your OpenAI organization ID                                                                                                               |
| DEFAULT_MODEL                     | `gpt-3.5-turbo`                | The default model to use on new conversations, for Azure use `gpt-35-turbo`                                                               |
| NEXT_PUBLIC_DEFAULT_SYSTEM_PROMPT | [see here](utils/app/const.ts) | The default system prompt to use on new conversations                                                                                     |
| NEXT_PUBLIC_DEFAULT_TEMPERATURE   | 1                              | The default temperature to use on new conversations                                                                                       |
| GOOGLE_API_KEY                    |                                | See [Custom Search JSON API documentation][GCSE]                                                                                          |
| GOOGLE_CSE_ID                     |                                | See [Custom Search JSON API documentation][GCSE]                                                                                          |

If you do not provide an OpenAI API key with `OPENAI_API_KEY`, users will have to provide their own key.

If you don't have an OpenAI API key, you can get one [here](https://platform.openai.com/account/api-keys).

If you want to switch languages:

  1. For display languages: change `defaultLocale:` in file `next-i18next.config.js`

  2. For voice transcribing language: `formData.append('language', 'en');` in file `whisper.ts`


## Contact

If you have any questions, feel free to reach out to Mckay on [Twitter](https://twitter.com/mckaywrigley).

[GCSE]: https://developers.google.com/custom-search/v1/overview
