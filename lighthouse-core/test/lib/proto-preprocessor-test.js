/**
 * @license Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const processForProto = require('../../lib/proto-preprocessor').processForProto;

/* eslint-env jest */
describe('processing for proto', () => {
  it('cleans up audits', () => {
    const input = {
      'audits': {
        'critical-request-chains': {
          'scoreDisplayMode': 'not-applicable',
          'rawValue': 14.3,
          'displayValue': ['hello %d', 123],
          'details': {
            'chains': {},
          },
        },
      },
    };
    const expectation = {
      'audits': {
        'critical-request-chains': {
          'scoreDisplayMode': 'not_applicable',
          'displayValue': 'hello %d | 123',
        },
      },
    };
    const output = processForProto(JSON.stringify(input));

    expect(JSON.parse(output)).toMatchObject(expectation);
  });

  it('removes crc request chains that are null', () => {
    const input = {
      'audits': {
        'critical-request-chains': {
          'details': {
            'chains': {
              '1': {
                'children': {},
              },
              '2': {
                'children': {
                  '3': {
                    'children': {},
                  },
                },
              },
            },
          },
        },
      },
    };
    const expectation = {
      'audits': {
        'critical-request-chains': {
          'details': {
            'chains': {
              '1': {
              },
              '2': {
                'children': {
                  '3': {},
                },
              },
            },
          },
        },
      },
    };
    const output = processForProto(JSON.stringify(input));

    expect(JSON.parse(output)).toMatchObject(expectation);
  });


  it('removes i18n icuMessagePaths', () => {
    const input = {
      'i18n': {
        'icuMessagePaths': {
          'content': 'paths',
        },
      },
    };
    const expectation = {
      'i18n': {},
    };
    const output = processForProto(JSON.stringify(input));

    expect(JSON.parse(output)).toMatchObject(expectation);
  });

  it('removes empty strings', () => {
    const input = {
      'audits': {
        'critical-request-chains': {
          'details': {
            'chains': {
              '1': '',
            },
          },
        },
      },
      'i18n': {
        'icuMessagePaths': {
          'content': 'paths',
        },
        '2': '',
      },
    };
    const expectation = {
      'audits': {
        'critical-request-chains': {
          'details': {
            'chains': {},
          },
        },
      },
      'i18n': {
      },
    };
    const output = processForProto(JSON.stringify(input));

    expect(JSON.parse(output)).toMatchObject(expectation);
  });
});
