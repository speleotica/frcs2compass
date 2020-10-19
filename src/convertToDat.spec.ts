/* eslint-env node */

import { describe, it } from 'mocha'
import { expect } from 'chai'
import convertToDat from './convertToDat'
import {
  parseFrcsSurveyFile,
  parseFrcsTripSummaryFile,
} from '@speleotica/frcsdata/node'
import { formatCompassDatFile } from '@speleotica/compass/dat'

describe('convertToDat', function() {
  it('basic test', async function() {
    const survey = await parseFrcsSurveyFile(require.resolve('./cdata.fr'))
    const summaries = await parseFrcsTripSummaryFile(
      require.resolve('./STAT_sum.txt')
    )
    const dat = convertToDat({ survey, summaries })
    expect(formatCompassDatFile(dat)).to.equal(
      `Fisher Ridge Cave System
SURVEY NAME: 1
SURVEY DATE: 2 15 1981  COMMENT:ENTRANCE DROPS, JOE'S "I LOVE MY WIFE TRAVERSE", TRICKY TRAVERSE
SURVEY TEAM:
Peter Quick;Keith Ortiz
DECLINATION: 0.00  FORMAT: DDDDLRUDLADadBT

FROM         TO           LEN     BEAR    INC     LEFT    RIGHT   UP      DOWN    AZM2    INC2    FLAGS COMMENTS

     AE20LRUD         AE20    0.00    0.00    0.00    1.00    3.00    0.00    2.00    0.00    0.00 #|L#
         AE20         AE19    9.30   60.00  -36.00    2.00   12.00    0.00   20.00  240.00 -999.00 AE20     0        0        0        Bug-can't put before so put after-so can't m
         AE19         AE18   24.50    0.00  -90.00    6.00   10.00   25.00    0.00  180.00 -999.00
         AE18         AE17    8.00  350.50   17.00    3.00    5.00    0.00    0.00  170.50 -999.00
         AE17         AE16    6.70    0.00  -90.00    3.00    5.00    6.00    1.00  180.00 -999.00
         AE16         AE15   12.60   70.50  -18.00    4.00    0.00    2.00    1.00  251.00 -999.00
         AE15         AE14   10.00   21.50    6.00    5.00    5.00    0.00    3.00  200.00 -999.00
         AE14         AE13   26.80  288.00  -50.00    0.00    7.00   20.00    5.00  106.00 -999.00
         AE13         AE12   20.70  236.00   34.00    3.00    5.00    4.00    4.00   56.00 -999.00 SHORT CANYON AT THE BASE OF THE SECOND DROP
         AE12         AE11   26.80    0.00  -90.00    0.00    7.00   20.00    5.00    0.00 -999.00
\f
Fisher Ridge Cave System
SURVEY NAME: 2
SURVEY DATE: 2 14 1981  COMMENT:TRICKY TRAVERSE AND THEN FIRST SURVEY IN UPPER CROWLWAY
SURVEY TEAM:
Dan Crowl;Keith Ortiz;Chip Hopper;Peter Quick;Larry Bean
DECLINATION: 0.00  FORMAT: DIIDLRUDLADadBT

FROM         TO           LEN     BEAR    INC     LEFT    RIGHT   UP      DOWN    AZM2    INC2    FLAGS COMMENTS

           A1           A2   48.83  292.00  -42.00    5.00   10.00   35.00    5.00  110.00 -999.00
           A2           A3   12.42  333.50   35.00    3.00    1.00   15.00    5.00  153.50 -999.00
           A3           A4    4.17    0.00   90.00    3.00    1.00   10.00   10.00    0.00 -999.00
\f
`.replace(/\n/gm, '\r\n')
    )
  })
})
