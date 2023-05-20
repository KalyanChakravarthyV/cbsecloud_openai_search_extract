import {inject} from '@loopback/core';

import {ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi} from 'openai';


import {
  Request,
  ResponseObject,
  RestBindings,
  post,
  requestBody,
  response
} from '@loopback/rest';
import {SearchString} from '../models';

/**
 * OpenAPI response for filter()
 */
const OPENAI_RESPONSE: ResponseObject = {
  description: 'OpenAI Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'OpenAIResponse',
        properties: {
          classNum: {type: 'number'},
          date: {type: 'string'},
          className: {type: 'string'}
        },
      },
    }
  },
};

/**
 * A simple controller to bounce back http requests
 */
export class OpenAIController {

  private openAI: OpenAIApi;

  constructor(@inject(RestBindings.Http.REQUEST) private req: Request) {


    const configuration = new Configuration({
      apiKey: process.env["OPENAI_API_KEY"],
    });
    console.log(process.env.OPENAI_API_KEY)
    this.openAI = new OpenAIApi(configuration);
  }

  // Map to `GET /filter`
  @post('/filter')
  @response(200, OPENAI_RESPONSE)
  async filter(
    // @param.query.string('message') searchString: string): Promise<object> {
    @requestBody({
      required: true,
      description: 'aws object settings',
      content: {
        'application/json': {},
      },
    }) searchString: SearchString
  ) {
    try {

      const chatCompletionRequest = {
        model: "gpt-3.5-turbo",
        temperature: 0,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        max_tokens: 1024,
        messages: [{
          role: ChatCompletionRequestMessageRoleEnum.User,
          name: 'user',
          content:
            `Identify the following items from the search string \
- Class number with roman numerals converted to integers \
- Subject \n
For example if search string contains 'Trigonometry' the subject should be 'Mathematics'\
The search string is enclosed within pipe\
Format your response in JSON with classNum and subject as keys \
if the information isn't present use \"unknown\" as value          ||${searchString.q}||`
        }]
      };

      const completion = await this.openAI.createChatCompletion(chatCompletionRequest);

      // console.log(chatCompletionRequest.messages);

      console.log(completion.data.choices[0].message?.content);

      const completionResponse = completion.data.choices[0].message?.content + '';


      let responseJson = JSON.parse(completionResponse);

      if (responseJson === undefined)
        responseJson = {classNum: 'unknown', subject: 'unknown'};

      completion.data.choices.forEach(e => {console.log(e)});

      return responseJson;

    } catch (e) {
      console.error(e);

    }


    return {
      classNum: undefined,
      subject: undefined
    };
  };
}
