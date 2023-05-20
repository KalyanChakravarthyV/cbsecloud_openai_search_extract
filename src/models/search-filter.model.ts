// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/example-todo
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Entity, model, property} from '@loopback/repository';

@model()
export class SearchFilter extends Entity {
  // @property({
  //   type: 'number',
  //   id: true,
  //   generated: true,
  // })
  // id?: number;

  @property({
    type: 'number',
    required: true,
  })
  classNum: number;

  @property({
    type: 'string',
  })
  className?: string;

  @property({
    type: 'date',
  })
  date?: Date;




  constructor(data?: Partial<SearchFilter>) {
    super(data);
  }
}

@model()
export class SearchString {
  @property({
    type: 'string',
    description: 'search string',
    required: true,
  }) q: string;
}
