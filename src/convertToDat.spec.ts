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

     AE20LRUD         AE20    0.00 -999.00 -999.00    1.00    3.00    0.00    2.00 -999.00 -999.00
         AE20         AE19    9.30   60.00  -36.00    2.00   12.00    0.00   20.00  240.00 -999.00 AE20     0        0        0        Bug-can't put before so put after-so can't m
         AE19         AE18   24.50    0.00  -90.00    6.00   10.00   25.00    0.00  180.00 -999.00
         AE18         AE17    8.00  350.50   17.00    3.00    5.00    0.00    0.00  170.50 -999.00
         AE17         AE16    6.70    0.00  -90.00    3.00    5.00    6.00    1.00  180.00 -999.00
         AE16         AE15   12.60   70.50  -18.00    4.00    0.00    2.00    1.00  251.00 -999.00
         AE15         AE14   10.00   21.50    6.00    5.00    5.00    0.00    3.00  200.00 -999.00
         AE14         AE13   26.80  288.00  -50.00    0.00    7.00   20.00    5.00  106.00 -999.00
         AE13         AE12   20.70  236.00   34.00    3.00    5.00    4.00    4.00   56.00 -999.00 SHORT CANYON AT THE BASE OF THE SECOND DROP
         AE12         AE11   26.80    0.00  -90.00    0.00    7.00   20.00    5.00 -999.00 -999.00
\f
Fisher Ridge Cave System
SURVEY NAME: 2
SURVEY DATE: 2 14 1981  COMMENT:TRICKY TRAVERSE AND THEN FIRST SURVEY IN UPPER CROWLWAY
SURVEY TEAM:
Dan Crowl;Keith Ortiz;Chip Hopper;Peter Quick;Larry Bean
DECLINATION: 0.00  FORMAT: DIIDLRUDLADadBT

FROM         TO           LEN     BEAR    INC     LEFT    RIGHT   UP      DOWN    AZM2    INC2    FLAGS COMMENTS

       A1LRUD           A1    0.00 -999.00 -999.00    2.00    7.00    3.00    4.50 -999.00 -999.00
           A1           A2   48.83  292.00  -42.00    5.00   10.00   35.00    5.00  110.00 -999.00
           A2           A3   12.42  333.50   35.00    3.00    1.00   15.00    5.00  153.50 -999.00
           A3           A4    4.17    0.00   90.00    3.00    1.00   10.00   10.00    0.00 -999.00
\f
Fisher Ridge Cave System
SURVEY NAME: 3
SURVEY DATE: 3 6 1981  COMMENT:DOUG'S DEMISE (50 FT DROP), CHRIS CROSS, CRAWL ABOVE DROP
SURVEY TEAM:
Peter Quick;Chris Gerace;Phil Oden;Chip Hopper
DECLINATION: 0.00  FORMAT: DDDDLRUDLADadBT

FROM         TO           LEN     BEAR    INC     LEFT    RIGHT   UP      DOWN    AZM2    INC2    FLAGS COMMENTS

           J6         ML$1   50.00  124.00   11.00   12.00   12.00   35.00   15.00  303.50  -11.00
         ML$1         ML$2   32.00  157.00   53.00   30.00    2.00   16.00    5.00  337.00  -53.00
         ML$2         ML$3   25.10  142.50   -5.00    0.00    4.00    5.00    7.00  324.00    5.00
         ML$3         ML$4    6.00    0.00  -90.00    0.00    4.00   11.00    1.00 -999.00   90.00
\f
Fisher Ridge Cave System
SURVEY NAME: 4
SURVEY DATE: 3 5 1983  COMMENT:Hunky-Dory Mopup:  Q19-PD7 loop (Quap Passage), Q1 Side Lead, Others.
SURVEY TEAM:
PETER QUICK;CHIP HOPPER
DECLINATION: 0.00  FORMAT: DDDDLRUDLADadBT

FROM         TO           LEN     BEAR    INC     LEFT    RIGHT   UP      DOWN    AZM2    INC2    FLAGS COMMENTS

          Q19         QAP1   25.00   49.50  -12.00    3.00    3.00    1.00    7.00  229.50   11.00 Quap Passage short cut from the Hunky-Dory access crawl.
         QAP1         QAP2   27.20  100.50    2.50    2.00    3.00    0.00   10.00  280.00   -2.50
         QAP2         QAP3   14.80   39.50  -11.00    1.00    4.00    1.00   12.00  219.50   10.50
         QAP3         QAP4   21.10  355.00    2.00    4.00    4.00    2.00   12.00  174.00   -2.50
         QAP4         QAP5   43.60  343.00   -5.00    2.00    7.00    5.00   12.00  161.50    4.50
         QAP5         QAP6   23.00   39.50    9.00    3.00    4.00    0.00   15.00  219.00   -9.50
         QAP6         QAP7   35.10   11.50    0.50    3.00    6.00    1.00   25.00  191.00   -1.00
         QAP7         QAP8    5.80    0.00  -90.00    2.00    4.00    6.00   20.00 -999.00   90.00
\f
Fisher Ridge Cave System
SURVEY NAME: 5
SURVEY DATE: 3 5 1983  COMMENT:DOUG'S DEMISE (50 FT DROP), CHRIS CROSS, CRAWL ABOVE DROP
SURVEY TEAM:
PETER QUICK;CHIP HOPPER
DECLINATION: 0.00  FORMAT: DDDDLRUDLADadBT

FROM         TO           LEN     BEAR    INC     LEFT    RIGHT   UP      DOWN    AZM2    INC2    FLAGS COMMENTS

          B29          B30   29.50  320.00    0.97    2.00    3.00    4.00    2.00  141.00 -999.00
          B30          B31   13.70    0.00   40.00    2.00    4.00    6.00    9.00  180.00 -999.00
          B30        B30sp   13.70    0.00   40.00    2.00    4.00    6.00    0.00  180.00 -999.00 #|L#
\f
`.replace(/\n/gm, '\r\n')
    )
  })
})
