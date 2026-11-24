(function (root) {
'use strict';
var MG = root.MG = root.MG || {};
MG.brand = {
mascot: 'data:image/png;base64,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',
titleSvg: '<svg class="mg-brand__title" xmlns="http://www.w3.org/2000/svg" viewBox="-14 -22 672 168" aria-hidden="true" focusable="false"><defs><path id="mgb-all" d="M12.6 100.8Q8.1 100.8 6.2 99.4Q4.3 98.1 3.9 95.9Q3.5 93.8 3.5 91.6V40Q3.5 37.8 3.9 35.7Q4.3 33.6 6.2 32.2Q8.1 30.9 12.7 30.9H32.6Q36.4 30.9 40.8 32.4Q45.2 34 49.2 37.2Q53.1 40.4 55.6 45.2Q58.1 50 58.1 56.6Q58.1 63.1 55.6 67.9Q53.1 72.7 49.2 75.8Q45.2 79 40.8 80.5Q36.4 82.1 32.5 82.1H21.8V91.7Q21.8 93.9 21.4 96Q21 98.1 19.1 99.4Q17.2 100.8 12.6 100.8ZM21.8 63.8H32.6Q33.9 63.8 35.6 63.1Q37.3 62.5 38.6 60.9Q39.9 59.3 39.9 56.5Q39.9 54.4 38.9 52.8Q37.9 51.1 36.2 50.1Q34.6 49.2 32.5 49.2H21.8ZM103.1 100.7Q98.6 100.7 96.5 99.2Q95 98.2 94.6 97Q94.3 97.3 93.9 97.6Q92.4 98.8 90 99.8Q87.6 100.7 84.1 100.7Q79.6 100.7 75.4 98.7Q71.3 96.6 68 93Q64.8 89.4 62.9 84.8Q61 80.3 61 75.3Q61 70.4 62.9 65.9Q64.8 61.4 68.1 57.8Q71.4 54.3 75.5 52.2Q79.6 50.2 84.1 50.2Q87.5 50.2 89.8 51.2Q92.2 52.2 93.7 53.4Q94.2 53.8 94.6 54.2Q94.9 52.6 96.6 51.5Q98.7 50.1 103.2 50.1Q107.7 50.1 109.6 51.4Q111.4 52.8 111.8 54.9Q112.2 57 112.2 59.2V91.7Q112.2 93.9 111.8 96Q111.4 98.1 109.6 99.4Q107.7 100.7 103.1 100.7ZM86.6 82.6Q88.5 82.6 90 81.6Q91.6 80.6 92.5 78.9Q93.5 77.3 93.5 75.4Q93.5 73.4 92.5 71.8Q91.6 70.2 90 69.2Q88.4 68.2 86.4 68.2Q84.4 68.2 82.8 69.2Q81.1 70.2 80.1 71.8Q79.1 73.5 79.1 75.5Q79.1 77.4 80.2 79Q81.2 80.6 82.9 81.6Q84.6 82.6 86.6 82.6ZM145.4 100.9Q140.1 100.9 136.2 99.7Q132.3 98.5 129.8 96Q127.2 93.5 126 89.7Q124.7 85.9 124.7 80.8V68.1H122.2Q118.8 67.9 117.5 65.9Q116.2 63.9 116.2 59.3Q116.2 55 117.8 52.8Q119.4 50.7 122.6 50.7H124.7V42Q124.7 39.7 125.1 37.8Q125.5 35.8 127.4 34.5Q129.3 33.3 133.8 33.3Q138.2 33.3 140.1 34.6Q142 36 142.4 38.1Q142.8 40.2 142.8 42.4V50.4L148.1 50.2Q150.3 50.2 152.4 50.6Q154.4 51 155.8 52.9Q157.1 54.8 157.1 59.4Q157.1 63.6 155.8 65.5Q154.4 67.4 152.4 67.9Q150.3 68.4 148 68.4L142.8 68.3V79.9Q142.8 81 142.9 81.8Q143.1 82.5 143.4 82.9Q143.7 83.3 144.2 83.5Q144.7 83.7 145.5 83.7Q148.1 83.7 150.1 84.1Q152.2 84.5 153.3 86.2Q154.5 87.9 154.5 91.9Q154.5 96.4 153.1 98.3Q151.7 100.2 149.6 100.6Q147.5 100.9 145.4 100.9ZM169.9 100.9Q165.4 100.9 163.5 99.6Q161.6 98.2 161.3 96.1Q160.9 94 160.9 91.8V36.2Q160.9 33.9 161.3 31.8Q161.7 29.8 163.6 28.5Q165.5 27.2 170 27.2Q174.5 27.2 176.4 28.5Q178.2 29.9 178.6 31.9Q179 34 179 36.3V54.5Q180.5 53.1 183.1 51.6Q185.6 50.2 189 50.2Q195.4 50.2 200.5 53.5Q205.6 56.9 208.6 62.6Q211.6 68.3 211.6 75.5V91.9Q211.6 94.1 211.2 96.2Q210.8 98.2 209 99.6Q207.1 100.9 202.5 100.9Q198.1 100.9 196.2 99.6Q194.2 98.3 193.8 96.2Q193.4 94.1 193.4 91.7V75.4Q193.4 73.2 192.6 71.7Q191.8 70.1 190.3 69.2Q188.8 68.3 186.7 68.3Q184 68.3 181.7 70Q179.4 71.7 179 73.9V91.9Q179 94.1 178.6 96.2Q178.2 98.3 176.4 99.6Q174.5 100.9 169.9 100.9ZM237.9 101.2Q234.7 101.2 233 99.9Q231.2 98.6 230.4 96.9Q229.6 95.2 229.1 94.1L215.8 61.4Q215 58.6 215.1 56.6Q215.1 54.7 216.5 53.3Q217.8 51.9 220.7 50.8Q225.3 48.8 228.3 49.6Q231.2 50.5 232.5 54.5L237.9 69.4L242.6 56.5Q243 55.5 243.8 54Q244.6 52.5 246.4 51.2Q248.1 50 251.1 50Q254.4 50 256.2 51.2Q258 52.5 258.9 54Q259.8 55.6 260.1 56.6L264.7 69.4L269.5 56.1Q271.2 51.7 274 50.1Q276.7 48.5 281.2 50.5Q285.4 52.4 287 55Q288.6 57.7 286.8 61.6L273.4 94.1Q272.9 95.3 272.1 97Q271.3 98.7 269.6 100Q267.9 101.2 264.8 101.2Q261.6 101.2 259.9 100.1Q258.2 99 257.4 97.3Q256.5 95.7 255.9 94.1L251.3 81.8L246.7 94.1Q245.9 96.2 245.2 97.8Q244.5 99.4 242.9 100.3Q241.3 101.2 237.9 101.2ZM331.7 100.7Q327.2 100.7 325.1 99.2Q323.6 98.2 323.2 97Q322.9 97.3 322.5 97.6Q321 98.8 318.6 99.8Q316.2 100.7 312.7 100.7Q308.2 100.7 304.1 98.7Q299.9 96.6 296.7 93Q293.4 89.4 291.5 84.8Q289.6 80.3 289.6 75.3Q289.6 70.4 291.5 65.9Q293.4 61.4 296.7 57.8Q300 54.3 304.1 52.2Q308.2 50.2 312.7 50.2Q316.1 50.2 318.5 51.2Q320.8 52.2 322.3 53.4Q322.8 53.8 323.2 54.2Q323.5 52.6 325.2 51.5Q327.3 50.1 331.8 50.1Q336.3 50.1 338.1 51.4Q340 52.8 340.4 54.9Q340.8 57 340.8 59.2V91.7Q340.8 93.9 340.4 96Q340 98.1 338.1 99.4Q336.3 100.7 331.7 100.7ZM315.2 82.6Q317.1 82.6 318.7 81.6Q320.2 80.6 321.2 78.9Q322.1 77.3 322.1 75.4Q322.1 73.4 321.2 71.8Q320.2 70.2 318.6 69.2Q317 68.2 315 68.2Q313 68.2 311.4 69.2Q309.7 70.2 308.7 71.8Q307.7 73.5 307.7 75.5Q307.7 77.4 308.8 79Q309.8 80.6 311.5 81.6Q313.2 82.6 315.2 82.6ZM362.7 121.4Q357.8 119.2 357 116.6Q356.2 113.9 358.3 109.6L366.1 92.2L347 63.4Q344.4 59.4 344.9 56.8Q345.4 54.1 349.7 51.4Q354.4 48.5 357 49.1Q359.5 49.8 362.2 53.9L374.7 72.8L382.6 55.2Q384.7 50.5 387.1 49.6Q389.5 48.7 394.5 50.7Q399.3 52.9 400.1 55.4Q401 57.9 399.1 62.1L374.6 117Q372.6 121.7 370.1 122.7Q367.7 123.6 362.7 121.4Z M501.3 84.2Q505.6 87 506.1 89.8Q506.6 92.5 503.5 96.9Q501.3 100 499.5 101.1Q497.7 102.2 495.7 101.6Q493.6 101 490.8 99.2L485.2 95.6Q481.1 98.6 476.2 100.3Q471.3 102 465.9 102Q458.6 102 452.2 99.2Q445.9 96.5 441.1 91.6Q436.3 86.7 433.6 80.2Q430.8 73.8 430.8 66.5Q430.8 58.9 433.5 52.3Q436.1 45.7 440.8 40.7Q445.5 35.7 451.8 32.9Q458 30.1 465.1 30.1Q472.4 30.1 478.8 32.8Q485.1 35.6 489.9 40.5Q494.7 45.4 497.4 52Q500.1 58.5 500.1 66.1Q500.1 70.1 499.2 73.9Q498.4 77.7 496.8 81.2ZM465.4 83.7Q468.8 83.7 471.8 82.3Q474.8 81 477.1 78.7Q479.3 76.3 480.6 73Q481.8 69.8 481.8 66.1Q481.8 62.4 480.5 59.2Q479.2 56 477 53.5Q474.7 51.1 471.8 49.8Q468.8 48.4 465.5 48.4Q462.1 48.4 459.1 49.8Q456.1 51.1 453.9 53.5Q451.6 56 450.4 59.2Q449.1 62.4 449.1 66.1Q449.1 69.8 450.4 73Q451.7 76.2 454 78.6Q456.2 81 459.2 82.3Q462.1 83.7 465.4 83.7ZM533.3 100.7Q528.5 100.7 524.4 98.8Q520.2 96.9 517.1 93.5Q514 90 512.3 85.4Q510.6 80.8 510.6 75.4V59.1Q510.6 56.8 511 54.8Q511.4 52.7 513.3 51.3Q515.2 50 519.7 50Q524.3 50 526.2 51.3Q528 52.7 528.4 54.8Q528.8 56.9 528.8 59.2V75.4Q528.8 77.7 529.7 79.3Q530.5 80.9 532.2 81.8Q533.8 82.6 536 82.6Q538.2 82.6 539.8 81.7Q541.4 80.8 542.3 79.2Q543.2 77.6 543.2 75.4V59Q543.2 56.7 543.6 54.6Q544 52.6 545.9 51.3Q547.8 50 552.3 50Q556.9 50 558.8 51.3Q560.6 52.7 561 54.8Q561.4 56.9 561.4 59.1V92Q561.4 94.2 561 96.2Q560.6 98.2 558.7 99.5Q556.8 100.8 552.3 100.8Q549 100.8 547.2 100Q545.3 99.3 544.5 98.1Q543.8 97.1 543.6 96.1Q542.9 96.8 542 97.5Q540.4 98.8 538.2 99.8Q536.1 100.7 533.3 100.7ZM576.9 100.9Q572.4 100.9 570.5 99.6Q568.6 98.2 568.2 96.1Q567.9 94 567.9 91.8V59.2Q567.9 57 568.3 55Q568.7 52.9 570.6 51.5Q572.5 50.2 577 50.2Q581.5 50.2 583.3 51.5Q585.2 52.9 585.6 55Q586 57.1 586 59.4V91.9Q586 94.1 585.6 96.2Q585.2 98.3 583.3 99.6Q581.5 100.9 576.9 100.9ZM576.9 45.3Q572.4 45.3 570.5 43.9Q568.6 42.6 568.2 40.5Q567.9 38.4 567.9 36.2Q567.9 33.9 568.3 31.8Q568.7 29.8 570.6 28.5Q572.5 27.2 577 27.2Q581.5 27.2 583.3 28.5Q585.2 29.9 585.6 32Q586 34.1 586 36.3Q586 38.5 585.6 40.6Q585.2 42.7 583.3 44Q581.5 45.3 576.9 45.3ZM599.9 100.9Q596.2 100.9 593.5 98.2Q590.9 95.5 590.9 91.8Q590.9 90 591.5 88.3Q592.2 86.7 593.6 85.4L612.8 68.2H602.1Q599.9 68.2 597.8 67.8Q595.7 67.4 594.3 65.5Q592.9 63.6 592.9 59.1Q592.9 54.6 594.3 52.8Q595.7 50.9 597.8 50.5Q599.9 50.1 602.1 50.1H632.4Q636.1 50.1 638.8 52.7Q641.4 55.3 641.4 59Q641.4 60.9 640.7 62.7Q640 64.4 638.8 65.5L620.1 82.7H633.6Q635.9 82.7 638 83.1Q640 83.5 641.3 85.5Q642.6 87.4 642.6 91.9Q642.6 96.4 641.2 98.3Q639.9 100.2 637.8 100.6Q635.8 100.9 633.5 100.9Z"/><path id="mgb-a" d="M12.6 100.8Q8.1 100.8 6.2 99.4Q4.3 98.1 3.9 95.9Q3.5 93.8 3.5 91.6V40Q3.5 37.8 3.9 35.7Q4.3 33.6 6.2 32.2Q8.1 30.9 12.7 30.9H32.6Q36.4 30.9 40.8 32.4Q45.2 34 49.2 37.2Q53.1 40.4 55.6 45.2Q58.1 50 58.1 56.6Q58.1 63.1 55.6 67.9Q53.1 72.7 49.2 75.8Q45.2 79 40.8 80.5Q36.4 82.1 32.5 82.1H21.8V91.7Q21.8 93.9 21.4 96Q21 98.1 19.1 99.4Q17.2 100.8 12.6 100.8ZM21.8 63.8H32.6Q33.9 63.8 35.6 63.1Q37.3 62.5 38.6 60.9Q39.9 59.3 39.9 56.5Q39.9 54.4 38.9 52.8Q37.9 51.1 36.2 50.1Q34.6 49.2 32.5 49.2H21.8ZM103.1 100.7Q98.6 100.7 96.5 99.2Q95 98.2 94.6 97Q94.3 97.3 93.9 97.6Q92.4 98.8 90 99.8Q87.6 100.7 84.1 100.7Q79.6 100.7 75.4 98.7Q71.3 96.6 68 93Q64.8 89.4 62.9 84.8Q61 80.3 61 75.3Q61 70.4 62.9 65.9Q64.8 61.4 68.1 57.8Q71.4 54.3 75.5 52.2Q79.6 50.2 84.1 50.2Q87.5 50.2 89.8 51.2Q92.2 52.2 93.7 53.4Q94.2 53.8 94.6 54.2Q94.9 52.6 96.6 51.5Q98.7 50.1 103.2 50.1Q107.7 50.1 109.6 51.4Q111.4 52.8 111.8 54.9Q112.2 57 112.2 59.2V91.7Q112.2 93.9 111.8 96Q111.4 98.1 109.6 99.4Q107.7 100.7 103.1 100.7ZM86.6 82.6Q88.5 82.6 90 81.6Q91.6 80.6 92.5 78.9Q93.5 77.3 93.5 75.4Q93.5 73.4 92.5 71.8Q91.6 70.2 90 69.2Q88.4 68.2 86.4 68.2Q84.4 68.2 82.8 69.2Q81.1 70.2 80.1 71.8Q79.1 73.5 79.1 75.5Q79.1 77.4 80.2 79Q81.2 80.6 82.9 81.6Q84.6 82.6 86.6 82.6ZM145.4 100.9Q140.1 100.9 136.2 99.7Q132.3 98.5 129.8 96Q127.2 93.5 126 89.7Q124.7 85.9 124.7 80.8V68.1H122.2Q118.8 67.9 117.5 65.9Q116.2 63.9 116.2 59.3Q116.2 55 117.8 52.8Q119.4 50.7 122.6 50.7H124.7V42Q124.7 39.7 125.1 37.8Q125.5 35.8 127.4 34.5Q129.3 33.3 133.8 33.3Q138.2 33.3 140.1 34.6Q142 36 142.4 38.1Q142.8 40.2 142.8 42.4V50.4L148.1 50.2Q150.3 50.2 152.4 50.6Q154.4 51 155.8 52.9Q157.1 54.8 157.1 59.4Q157.1 63.6 155.8 65.5Q154.4 67.4 152.4 67.9Q150.3 68.4 148 68.4L142.8 68.3V79.9Q142.8 81 142.9 81.8Q143.1 82.5 143.4 82.9Q143.7 83.3 144.2 83.5Q144.7 83.7 145.5 83.7Q148.1 83.7 150.1 84.1Q152.2 84.5 153.3 86.2Q154.5 87.9 154.5 91.9Q154.5 96.4 153.1 98.3Q151.7 100.2 149.6 100.6Q147.5 100.9 145.4 100.9ZM169.9 100.9Q165.4 100.9 163.5 99.6Q161.6 98.2 161.3 96.1Q160.9 94 160.9 91.8V36.2Q160.9 33.9 161.3 31.8Q161.7 29.8 163.6 28.5Q165.5 27.2 170 27.2Q174.5 27.2 176.4 28.5Q178.2 29.9 178.6 31.9Q179 34 179 36.3V54.5Q180.5 53.1 183.1 51.6Q185.6 50.2 189 50.2Q195.4 50.2 200.5 53.5Q205.6 56.9 208.6 62.6Q211.6 68.3 211.6 75.5V91.9Q211.6 94.1 211.2 96.2Q210.8 98.2 209 99.6Q207.1 100.9 202.5 100.9Q198.1 100.9 196.2 99.6Q194.2 98.3 193.8 96.2Q193.4 94.1 193.4 91.7V75.4Q193.4 73.2 192.6 71.7Q191.8 70.1 190.3 69.2Q188.8 68.3 186.7 68.3Q184 68.3 181.7 70Q179.4 71.7 179 73.9V91.9Q179 94.1 178.6 96.2Q178.2 98.3 176.4 99.6Q174.5 100.9 169.9 100.9ZM237.9 101.2Q234.7 101.2 233 99.9Q231.2 98.6 230.4 96.9Q229.6 95.2 229.1 94.1L215.8 61.4Q215 58.6 215.1 56.6Q215.1 54.7 216.5 53.3Q217.8 51.9 220.7 50.8Q225.3 48.8 228.3 49.6Q231.2 50.5 232.5 54.5L237.9 69.4L242.6 56.5Q243 55.5 243.8 54Q244.6 52.5 246.4 51.2Q248.1 50 251.1 50Q254.4 50 256.2 51.2Q258 52.5 258.9 54Q259.8 55.6 260.1 56.6L264.7 69.4L269.5 56.1Q271.2 51.7 274 50.1Q276.7 48.5 281.2 50.5Q285.4 52.4 287 55Q288.6 57.7 286.8 61.6L273.4 94.1Q272.9 95.3 272.1 97Q271.3 98.7 269.6 100Q267.9 101.2 264.8 101.2Q261.6 101.2 259.9 100.1Q258.2 99 257.4 97.3Q256.5 95.7 255.9 94.1L251.3 81.8L246.7 94.1Q245.9 96.2 245.2 97.8Q244.5 99.4 242.9 100.3Q241.3 101.2 237.9 101.2ZM331.7 100.7Q327.2 100.7 325.1 99.2Q323.6 98.2 323.2 97Q322.9 97.3 322.5 97.6Q321 98.8 318.6 99.8Q316.2 100.7 312.7 100.7Q308.2 100.7 304.1 98.7Q299.9 96.6 296.7 93Q293.4 89.4 291.5 84.8Q289.6 80.3 289.6 75.3Q289.6 70.4 291.5 65.9Q293.4 61.4 296.7 57.8Q300 54.3 304.1 52.2Q308.2 50.2 312.7 50.2Q316.1 50.2 318.5 51.2Q320.8 52.2 322.3 53.4Q322.8 53.8 323.2 54.2Q323.5 52.6 325.2 51.5Q327.3 50.1 331.8 50.1Q336.3 50.1 338.1 51.4Q340 52.8 340.4 54.9Q340.8 57 340.8 59.2V91.7Q340.8 93.9 340.4 96Q340 98.1 338.1 99.4Q336.3 100.7 331.7 100.7ZM315.2 82.6Q317.1 82.6 318.7 81.6Q320.2 80.6 321.2 78.9Q322.1 77.3 322.1 75.4Q322.1 73.4 321.2 71.8Q320.2 70.2 318.6 69.2Q317 68.2 315 68.2Q313 68.2 311.4 69.2Q309.7 70.2 308.7 71.8Q307.7 73.5 307.7 75.5Q307.7 77.4 308.8 79Q309.8 80.6 311.5 81.6Q313.2 82.6 315.2 82.6ZM362.7 121.4Q357.8 119.2 357 116.6Q356.2 113.9 358.3 109.6L366.1 92.2L347 63.4Q344.4 59.4 344.9 56.8Q345.4 54.1 349.7 51.4Q354.4 48.5 357 49.1Q359.5 49.8 362.2 53.9L374.7 72.8L382.6 55.2Q384.7 50.5 387.1 49.6Q389.5 48.7 394.5 50.7Q399.3 52.9 400.1 55.4Q401 57.9 399.1 62.1L374.6 117Q372.6 121.7 370.1 122.7Q367.7 123.6 362.7 121.4Z"/><path id="mgb-b" d="M501.3 84.2Q505.6 87 506.1 89.8Q506.6 92.5 503.5 96.9Q501.3 100 499.5 101.1Q497.7 102.2 495.7 101.6Q493.6 101 490.8 99.2L485.2 95.6Q481.1 98.6 476.2 100.3Q471.3 102 465.9 102Q458.6 102 452.2 99.2Q445.9 96.5 441.1 91.6Q436.3 86.7 433.6 80.2Q430.8 73.8 430.8 66.5Q430.8 58.9 433.5 52.3Q436.1 45.7 440.8 40.7Q445.5 35.7 451.8 32.9Q458 30.1 465.1 30.1Q472.4 30.1 478.8 32.8Q485.1 35.6 489.9 40.5Q494.7 45.4 497.4 52Q500.1 58.5 500.1 66.1Q500.1 70.1 499.2 73.9Q498.4 77.7 496.8 81.2ZM465.4 83.7Q468.8 83.7 471.8 82.3Q474.8 81 477.1 78.7Q479.3 76.3 480.6 73Q481.8 69.8 481.8 66.1Q481.8 62.4 480.5 59.2Q479.2 56 477 53.5Q474.7 51.1 471.8 49.8Q468.8 48.4 465.5 48.4Q462.1 48.4 459.1 49.8Q456.1 51.1 453.9 53.5Q451.6 56 450.4 59.2Q449.1 62.4 449.1 66.1Q449.1 69.8 450.4 73Q451.7 76.2 454 78.6Q456.2 81 459.2 82.3Q462.1 83.7 465.4 83.7ZM533.3 100.7Q528.5 100.7 524.4 98.8Q520.2 96.9 517.1 93.5Q514 90 512.3 85.4Q510.6 80.8 510.6 75.4V59.1Q510.6 56.8 511 54.8Q511.4 52.7 513.3 51.3Q515.2 50 519.7 50Q524.3 50 526.2 51.3Q528 52.7 528.4 54.8Q528.8 56.9 528.8 59.2V75.4Q528.8 77.7 529.7 79.3Q530.5 80.9 532.2 81.8Q533.8 82.6 536 82.6Q538.2 82.6 539.8 81.7Q541.4 80.8 542.3 79.2Q543.2 77.6 543.2 75.4V59Q543.2 56.7 543.6 54.6Q544 52.6 545.9 51.3Q547.8 50 552.3 50Q556.9 50 558.8 51.3Q560.6 52.7 561 54.8Q561.4 56.9 561.4 59.1V92Q561.4 94.2 561 96.2Q560.6 98.2 558.7 99.5Q556.8 100.8 552.3 100.8Q549 100.8 547.2 100Q545.3 99.3 544.5 98.1Q543.8 97.1 543.6 96.1Q542.9 96.8 542 97.5Q540.4 98.8 538.2 99.8Q536.1 100.7 533.3 100.7ZM576.9 100.9Q572.4 100.9 570.5 99.6Q568.6 98.2 568.2 96.1Q567.9 94 567.9 91.8V59.2Q567.9 57 568.3 55Q568.7 52.9 570.6 51.5Q572.5 50.2 577 50.2Q581.5 50.2 583.3 51.5Q585.2 52.9 585.6 55Q586 57.1 586 59.4V91.9Q586 94.1 585.6 96.2Q585.2 98.3 583.3 99.6Q581.5 100.9 576.9 100.9ZM576.9 45.3Q572.4 45.3 570.5 43.9Q568.6 42.6 568.2 40.5Q567.9 38.4 567.9 36.2Q567.9 33.9 568.3 31.8Q568.7 29.8 570.6 28.5Q572.5 27.2 577 27.2Q581.5 27.2 583.3 28.5Q585.2 29.9 585.6 32Q586 34.1 586 36.3Q586 38.5 585.6 40.6Q585.2 42.7 583.3 44Q581.5 45.3 576.9 45.3ZM599.9 100.9Q596.2 100.9 593.5 98.2Q590.9 95.5 590.9 91.8Q590.9 90 591.5 88.3Q592.2 86.7 593.6 85.4L612.8 68.2H602.1Q599.9 68.2 597.8 67.8Q595.7 67.4 594.3 65.5Q592.9 63.6 592.9 59.1Q592.9 54.6 594.3 52.8Q595.7 50.9 597.8 50.5Q599.9 50.1 602.1 50.1H632.4Q636.1 50.1 638.8 52.7Q641.4 55.3 641.4 59Q641.4 60.9 640.7 62.7Q640 64.4 638.8 65.5L620.1 82.7H633.6Q635.9 82.7 638 83.1Q640 83.5 641.3 85.5Q642.6 87.4 642.6 91.9Q642.6 96.4 641.2 98.3Q639.9 100.2 637.8 100.6Q635.8 100.9 633.5 100.9Z"/><clipPath id="mgb-clip"><use href="#mgb-all"/></clipPath></defs><use href="#mgb-all" transform="translate(4 6)" style="fill:var(--mg-line);stroke:var(--mg-line);stroke-width:16;stroke-linejoin:round"/><use href="#mgb-all" style="fill:var(--mg-line);stroke:var(--mg-line);stroke-width:16;stroke-linejoin:round"/><use href="#mgb-all" style="fill:#fff;stroke:#fff;stroke-width:8;stroke-linejoin:round"/><use href="#mgb-a" style="fill:#FFD95A"/><use href="#mgb-b" style="fill:#8EDC82"/><g clip-path="url(#mgb-clip)"><use href="#mgb-all" transform="translate(3 4)" style="fill:none;stroke:#fff;stroke-opacity:.6;stroke-width:7;stroke-linejoin:round"/></g></svg>'
};
})(typeof window !== 'undefined' ? window : globalThis);

(function (root) {
'use strict';
var MG = root.MG = root.MG || {};
var RAMP = [
{ at: 0, rgb: [254, 226, 226] },
{ at: 33, rgb: [255, 176, 112] },
{ at: 66, rgb: [246, 242, 106] },
{ at: 100, rgb: [141, 235, 106] }
];
var NO_DATA = '#E6E3D8';
var MODES = [
{ id: 'build', title: 'Dựng từng bước', text: 'Dựng bản đồ từng bước, mỗi lần một câu hỏi.' },
{ id: 'pick', title: 'Chọn đáp án', text: 'Bản đồ khuyết, chọn 1 trong 6 đáp án cho mỗi ô.' },
{ id: 'type', title: 'Tự gõ', text: 'Bản đồ khuyết, tự gõ chính xác tên chất.' }
];
var MODE_NAME = { build: 'Dựng từng bước', pick: 'Chọn đáp án', type: 'Tự gõ' };
var HARDER = { build: 'pick', pick: 'type' };
var FORMATS = [
{ id: 'names', label: 'Tên chất' },
{ id: 'structures', label: 'Cấu trúc' },
{ id: 'mixed', label: 'Kết hợp' }
];
var FORMAT_NAME = { names: 'tên chất', structures: 'cấu trúc', mixed: 'kết hợp' };
var DEFAULTS = {
format: 'mixed', showSlotLabels: true, givenStart: false, cofactors: true, sound: true, introSeen: false, theme: 'light', advanced: false,
pathwayId: 'glycolysis', mode: 'build', excluded: {}
};
var NONE = '';
var THEMES = ['light', 'dark', 'auto'];
var THEME_COLOR = { light: '#FBF8EA', dark: '#282A36' };
var DETAIL_KIND = { enz: 'enzyme', node: 'molecule', 'in': 'cofactor', out: 'cofactor' };
var KIND_WORD = { enz: 'enzyme', node: 'molecule', 'in': 'consumed', out: 'produced' };
var EC_CLASS = {
'1': 'Oxidoreductase (Oxi hóa - khử)', '2': 'Transferase (Chuyển nhóm)', '3': 'Hydrolase (Thủy phân)', '4': 'Lyase (Phân cắt)',
'5': 'Isomerase (Đồng phân hóa)', '6': 'Ligase (Tổng hợp / Nối)', '7': 'Translocase (Vận chuyển màng)'
};
var CLASS_LABEL = {
kinase: 'Kinase', isomerase: 'Isomerase', lyase: 'Lyase', dehydrogenase: 'Dehydrogenase',
ligase: 'Ligase', phosphatase: 'Phosphatase', transferase: 'Transferase', hydrolase: 'Hydrolase',
etc: 'Chuỗi vận chuyển electron', translocase: 'Translocase', lipid: 'Chuyển hóa lipid',
channel: 'Kênh', symporter: 'Symporter', gtpase: 'GTPase', poreformer: 'Protein tạo lỗ', platform: 'Phức hợp protein',
adaptor: 'Protein nối (adaptor)', protease: 'Protease (caspase)', receptor: 'Thụ thể (receptor)',
gprotein: 'Protein G', sigprotein: 'Protein truyền tín hiệu', transporter: 'Chất vận chuyển', photocomplex: 'Phức hợp quang hợp', process: 'Toàn bộ quá trình',
nprocess: 'Toàn bộ quá trình', cellmachine: 'Bộ máy tế bào'
};
var FAMILY_LABEL = {
adenylate: 'Nucleotide adenylate', redox: 'Chất mang oxy hóa-khử', carrier: 'Nhóm chất mang', small: 'Phân tử nhỏ',
etc: 'Chuỗi vận chuyển electron', lipid: 'Chuyển hóa lipid', sugar: 'Đường', acid: 'Axit cacboxylic',
c3: 'Hợp chất ba carbon', coa: 'Acyl-CoA', aminoacid: 'Axit amin', messenger: 'Hormone hoặc chất truyền tin', sigstate: 'Trạng thái protein',
siglipid: 'Lipid màng', nucleotide: 'Nucleotide', photocarrier: 'Chất mang electron hoặc sắc tố', photon: 'Ánh sáng',
b6: 'Coenzyme vitamin B6', plpint: 'Chất trung gian PLP', nucint: 'Chất trung gian nucleotide', tissuepool: 'Nhóm phân tử', folate: 'Coenzyme folate'
};
var CHIP_CLASS = {
adenylate: 'mg-chip--adenylate', redox: 'mg-chip--redox', carrier: 'mg-chip--carrier', small: 'mg-chip--small'
};
var ARROW_SVG = '<svg class="mg-eq__line" viewBox="0 0 16 34" aria-hidden="true" focusable="false"><path d="M8 2v26M2.5 22.5 8 30l5.5-7.5"/></svg>';
var BACKDROP_SEED = 20260711;
var CPK = {
C: ['#B5B5B5', '#5C5C5C'], O: ['#FF6B5E', '#B01E1A'], N: ['#7490FF', '#2B43B5'],
H: ['#FFFFFF', '#B4B4B4'], S: ['#FFF27A', '#B09A12'], P: ['#FFB55C', '#BF6512']
};
var CPK_POOL = 'OOOONNNSSSPPCH';
var COURSE_KEY = 'mg.app.course';
var RUNS_KEY = 'mg.app.runs';
function gearPath() {
var cx = 12, cy = 12, rOut = 10, rIn = 7.6, rHole = 3.3, teeth = 8;
var step = (Math.PI * 2) / teeth;
var pts = [];
for (var t = 0; t < teeth; t++) {
var a = t * step - Math.PI / 2;
pts.push([rIn, a], [rOut, a + step * 0.2], [rOut, a + step * 0.42], [rIn, a + step * 0.5]);
}
var d = pts.map(function (p, i) {
return (i ? 'L' : 'M') + (cx + p[0] * Math.cos(p[1])).toFixed(2) + ' ' + (cy + p[0] * Math.sin(p[1])).toFixed(2);
}).join('') + 'Z';
var hole = 'M' + (cx - rHole).toFixed(2) + ' ' + cy +
'a' + rHole + ' ' + rHole + ' 0 1 0 ' + (2 * rHole) + ' 0' +
'a' + rHole + ' ' + rHole + ' 0 1 0 ' + (-2 * rHole) + ' 0Z';
return d + hole;
}
var ICON_BODY = {
check: '<path d="M5 12.6 9.9 17.4 19 6.8"/>',
cross: '<path d="M6.5 6.5 17.5 17.5M17.5 6.5 6.5 17.5"/>',
plus: '<path d="M12 5.5v13M5.5 12h13"/>',
close: '<path d="M6.5 6.5 17.5 17.5M17.5 6.5 6.5 17.5"/>',
undo: '<path d="M9.5 5.5 4.5 10.5l5 5"/><path d="M4.5 10.5H14a6 6 0 0 1 0 12H9"/>',
'badge-check': '<circle class="mg-icon__disc" cx="12" cy="12" r="9.3"/><path d="M7.4 12.4 10.6 15.6 16.7 9.2"/>',
'badge-cross': '<circle class="mg-icon__disc" cx="12" cy="12" r="9.3"/><path d="M8.7 8.7 15.3 15.3M15.3 8.7 8.7 15.3"/>',
gear: '<path class="mg-icon__disc" fill-rule="evenodd" d="' + gearPath() + '"/>'
};
function el(tag, attrs) {
var node = document.createElement(tag);
var a = attrs || {};
Object.keys(a).forEach(function (key) {
var value = a[key];
if (key.indexOf('aria-') === 0 || key.indexOf('data-') === 0) {
if (value !== null && value !== undefined) { node.setAttribute(key, String(value)); }
return;
}
if (value === null || value === undefined || value === false) { return; }
if (key === 'class') { node.className = String(value); }
else if (key === 'text') { node.textContent = String(value); }
else if (key === 'html') { node.innerHTML = String(value); }
else if (key === 'on') {
Object.keys(value).forEach(function (ev) {
if (typeof value[ev] === 'function') { node.addEventListener(ev, value[ev]); }
});
}
else if (key === 'style') { applyStyle(node, value); }
else if (key === 'value' || key === 'checked') { node[key] = value; }
else if (value === true) { node.setAttribute(key, ''); }
else { node.setAttribute(key, String(value)); }
});
for (var i = 2; i < arguments.length; i++) { append(node, arguments[i]); }
return node;
}
function applyStyle(node, style) {
if (typeof style === 'string') { node.setAttribute('style', style); return; }
Object.keys(style || {}).forEach(function (prop) {
if (prop.indexOf('--') === 0) { node.style.setProperty(prop, String(style[prop])); }
else { node.style[prop] = style[prop]; }
});
}
function append(node, child) {
if (child === null || child === undefined || typeof child === 'boolean') { return; }
if (Array.isArray(child)) { child.forEach(function (c) { append(node, c); }); return; }
if (child.nodeType) { node.appendChild(child); return; }
node.appendChild(document.createTextNode(String(child)));
}
function icon(name) {
var holder = document.createElement('span');
holder.innerHTML = '<svg class="mg-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
(ICON_BODY[name] || '') + '</svg>';
return holder.firstChild;
}
function assign(target, src) {
Object.keys(src || {}).forEach(function (k) { target[k] = src[k]; });
return target;
}
function copy(value) { return JSON.parse(JSON.stringify(value)); }
function num(v) { return typeof v === 'number' && isFinite(v) ? v : 0; }
function randomSeed() { return Math.floor(Math.random() * 2000000000) + 1; }
function hex2(n) {
var s = Math.round(n).toString(16);
return s.length < 2 ? '0' + s : s;
}
function clock(ms) {
var s = Math.max(0, Math.round(num(ms) / 1000));
var m = Math.floor(s / 60), r = s % 60;
return m + ':' + (r < 10 ? '0' : '') + r;
}
function chargeText(c) {
if (!c) { return 'Trung hòa điện'; }
return (Math.abs(c) === 1 ? '' : String(Math.abs(c))) + (c < 0 ? '−' : '+');
}
function humanize(id) {
var words = String(id || '').replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();
return words ? words.charAt(0).toUpperCase() + words.slice(1) : '';
}
function mulberry32(seed) {
var a = seed >>> 0;
return function () {
a = (a + 0x6D2B79F5) >>> 0;
var t = a;
t = Math.imul(t ^ (t >>> 15), t | 1);
t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
}
function storeGet(key) {
try { return root.sessionStorage ? root.sessionStorage.getItem(key) : null; }
catch (err) { return null; }
}
function storeSet(key, value) {
try { if (root.sessionStorage) { root.sessionStorage.setItem(key, value); } }
catch (err) { return; }
}
function masteryColor(pct) {
if (typeof pct !== 'number' || isNaN(pct)) { return NO_DATA; }
var v = Math.max(0, Math.min(100, pct));
for (var i = 1; i < RAMP.length; i++) {
if (v <= RAMP[i].at) {
var a = RAMP[i - 1], b = RAMP[i];
var t = (v - a.at) / (b.at - a.at);
var parts = [];
for (var k = 0; k < 3; k++) {
parts.push(hex2(a.rgb[k] + (b.rgb[k] - a.rgb[k]) * t));
}
return '#' + parts.join('');
}
}
return '#8DEB6A';
}
function ent(kind, id) {
var table = MG.entities && MG.entities[kind];
return table && id ? (table[id] || null) : null;
}
function pathwayById(id) {
if (!MG.pathways || !id) { return null; }
if (MG.pathways[id]) { return MG.pathways[id]; }
return MG.custom && MG.custom.isMix(id) ? MG.custom.resolve(id) : null;
}
function viewOf(id) {
return pathwayById(id);
}
function reactionById(pathway, rxnId) {
var list = pathway && pathway.reactions ? pathway.reactions : [];
for (var i = 0; i < list.length; i++) {
if (list[i].id === rxnId) { return list[i]; }
}
return null;
}
function findReaction(rxnId, pathwayId) {
var ids = [pathwayId, 'full', 'glycolysis', 'tca'];
for (var i = 0; i < ids.length; i++) {
var p = pathwayById(ids[i]);
var r = p ? reactionById(p, rxnId) : null;
if (r) { return { rxn: r, pathway: p }; }
}
return null;
}
function stepText(r, pathway) {
if (r.short) { return r.short; }
if (typeof r.step !== 'number') { return String(r.step); }
if (pathway && pathway.id === 'full' && reactionById(pathwayById('tca'), r.id)) { return 'TCA ' + r.step; }
return 'Bước ' + r.step;
}
function masteryOf(pathwayId, rxnId) {
if (!MG.store || typeof MG.store.mastery !== 'function') { return null; }
try {
var v = MG.store.mastery(pathwayId, rxnId);
return typeof v === 'number' ? v : null;
} catch (err) {
console.error(err);
return null;
}
}
function masteryMap(pathway) {
if (MG.store && typeof MG.store.masteryAll === 'function') {
try { return MG.store.masteryAll(pathway.id) || {}; }
catch (err) { console.error(err); }
}
return {};
}
function renderStructure(molId, w, h, hl, title, maxBond) {
if (!molId || !MG.renderMolecule || !MG.geometry || !MG.geometry[molId]) { return null; }
try {
return MG.renderMolecule(MG.geometry[molId], {
width: w, height: h, maxBond: maxBond || 40, hl: hl || [], title: title || molId
});
} catch (err) {
console.error(err);
return null;
}
}
function highlightFor(rxn, molId, pathway) {
var groups = [];
if (!rxn || !pathway || !pathway.nodes) { return groups; }
[['substrates', 'sub'], ['products', 'prod']].forEach(function (pair) {
(rxn[pair[0]] || []).forEach(function (nodeId) {
var n = pathway.nodes[nodeId];
var marks = rxn.hl && rxn.hl[pair[1]] ? rxn.hl[pair[1]][nodeId] : null;
if (n && n.mol === molId && marks) { groups = groups.concat(marks); }
});
});
return groups;
}
function courseById(id) {
var c = id && MG.courses ? MG.courses[id] : null;
if (!c || !Array.isArray(c.sections)) { return null; }
var sections = c.sections.filter(function (pid) { return !!pathwayById(pid); });
var every = c.everything && pathwayById(c.everything) ? c.everything : null;
if (!every && c.everythingPick === true && MG.custom && sections.length > 1) { every = everythingTarget() || null; }
return {
id: c.id || id,
title: c.title || id,
subtitle: c.subtitle || '',
color: typeof c.color === 'string' ? c.color : null,
everything: every,
sections: sections
};
}
function courseList() {
return Object.keys(MG.courses || {}).map(courseById).filter(function (c) { return !!c && c.sections.length > 0; });
}
function courseContext(course, pathwayId) {
if (!course) { return null; }
if (course.everything && pathwayId === course.everything) { return { id: course.id, index: -1, all: true }; }
var index = course.sections.indexOf(pathwayId);
return index < 0 ? null : { id: course.id, index: index };
}
function isCourseEverything(pathwayId) {
var p = pathwayById(pathwayId);
return !!p && !!p.scope && p.scope.type === 'course';
}
function sectionAverage(pathwayId) {
var p = pathwayById(pathwayId);
if (!p) { return { pct: 0, started: false }; }
var m = masteryMap(p);
var values = p.order.map(function (rid) { return typeof m[rid] === 'number' ? m[rid] : null; });
var started = values.some(function (v) { return v !== null; });
var sum = values.reduce(function (acc, v) { return acc + (v === null ? 0 : v); }, 0);
return { pct: values.length ? sum / values.length : 0, started: started };
}
function pathwayGroups() {
var seen = {};
var cats = Array.isArray(MG.categories) ? MG.categories : [];
var groups = cats.map(function (g) {
var list = (g.pathways || []).filter(function (id) { return !!pathwayById(id); }).map(pathwayById);
list.forEach(function (p) { seen[p.id] = true; });
return { id: g.id, title: g.title, color: g.color || null, pathways: list, presets: Array.isArray(g.presets) ? g.presets : [], everything: pathwayById(g.everything) };
}).filter(function (g) { return g.pathways.length > 0; });
var rest = Object.keys(MG.pathways || {}).filter(function (id) { return !seen[id] && !MG.pathways[id].courseOnly; }).map(pathwayById);
if (rest.length) { groups.push({ id: 'other', title: 'Các con đường khác', pathways: rest, everything: null }); }
return groups;
}
function hasDrawnMolecules(pathway) {
return !!pathway && Object.keys(pathway.nodes).some(function (n) {
var m = MG.entities.molecule[pathway.nodes[n].mol];
return !!m && !m.noStructure;
});
}
function ecClassName(ec) {
var first = String(ec || '').split('.')[0];
return EC_CLASS[first] || null;
}
function classLabel(family) {
return CLASS_LABEL[family] || humanize(family);
}
function familyLabel(family) {
return FAMILY_LABEL[family] || humanize(family);
}
var RXN_TYPE_LABEL = {
  "rect": "rect (từ khóa kỹ thuật — giữ nguyên)",
  "ledger": "ledger (từ khóa kỹ thuật — giữ nguyên)",
  "Electron transfer": "Truyền electron",
  "Phosphoryl transfer": "Chuyển nhóm phosphoryl",
  "category": "category (từ khóa kỹ thuật — giữ nguyên)",
  "Isomerization": "Đồng phân hóa",
  "Hydrolysis": "Thủy phân",
  "Oxidative decarboxylation": "Khử carboxyl oxi hóa",
  "Oxidation (FAD)": "Oxi hóa (dùng FAD)",
  "Oxidation (NAD⁺)": "Oxi hóa (dùng NAD⁺)",
  "Reduction (NADH)": "Khử (dùng NADH)",
  "Electron transfer and proton pumping": "Truyền electron kèm bơm proton",
  "Antiport (exchange)": "Vận chuyển đối vận (trao đổi)",
  "Transamination": "Chuyển amin",
  "Substrate-level phosphorylation": "Phosphoryl hóa ở mức cơ chất",
  "Hydration": "Cộng nước (Hydrat hóa)",
  "ATP synthesis (chemiosmosis)": "Tổng hợp ATP (hóa thẩm thấu)",
  "Electron transfer (heme to heme)": "Truyền electron (từ heme sang heme)",
  "Amidation (spends ATP)": "Amid hóa (tiêu tốn ATP)",
  "Synthesis of the second messenger": "Tổng hợp chất truyền tin thứ hai",
  "Phosphorylation": "Phosphoryl hóa",
  "Phosphoryl shift": "Chuyển vị nhóm phosphoryl",
  "circle": "circle (từ khóa kỹ thuật — giữ nguyên)",
  "Electron transfer (no proton pumping)": "Truyền electron (không bơm proton)",
  "Electron transfer to O₂ and proton pumping": "Truyền electron tới O₂ kèm bơm proton",
  "Isomerization (reverse of glycolysis)": "Đồng phân hóa (ngược đường phân)",
  "Decarboxylation": "Khử carboxyl",
  "Activation (thioester formation)": "Hoạt hóa (tạo thioester)",
  "Electron transfer (2 e⁻ and 2 H⁺)": "Truyền electron (2 e⁻ và 2 H⁺)",
  "Carbamoyl transfer": "Chuyển nhóm carbamoyl",
  "Reductive amination": "Amin hóa khử",
  "Oxidative deamination": "Khử amin oxi hóa",
  "Proteolytic activation": "Hoạt hóa bằng phân giải protein",
  "Proteolysis of cell proteins": "Phân giải các protein tế bào",
  "Photoexcitation": "Kích thích quang học",
  "Electron transfer (charge separation)": "Truyền electron (phân tách điện tích)",
  "Reduction of NADP⁺": "Khử NADP⁺",
  "Reduction (NADPH)": "Khử (dùng NADPH)",
  "Aldol condensation": "Ngưng tụ aldol",
  "Two-carbon transfer": "Chuyển 2 carbon",
  "Carboxylation": "Carboxyl hóa",
  "Hydrolysis of the ring": "Thủy phân vòng",
  "GDP replaced by GTP": "Thay thế GDP bằng GTP",
  "Release of the catalytic subunits": "Giải phóng các tiểu đơn vị xúc tác",
  "Dimerization": "Dimer hóa (nhị hợp hóa)",
  "Autophosphorylation of tyrosines": "Tự phosphoryl hóa các gốc tyrosine",
  "Assembly of the signaling complex": "Lắp ráp phức hợp truyền tín hiệu",
  "Breakdown of the sugar (in the muscle)": "Phân giải đường (ở cơ)",
  "Transport from the muscle to the liver": "Vận chuyển từ cơ đến gan",
  "Synthesis of the sugar (in the liver)": "Tổng hợp đường (ở gan)",
  "Transport from the liver to the muscle": "Vận chuyển từ gan đến cơ",
  "Transfer of two carbons": "Chuyển 2 carbon",
  "Amide bond formation (spends ATP)": "Tạo liên kết amid (tiêu tốn ATP)",
  "Transfer of a formyl group": "Chuyển nhóm formyl",
  "Elimination (a lyase removes the carbon skeleton)": "Phản ứng tách (lyase loại bỏ bộ khung carbon)",
  "Aldol cleavage": "Phân cắt aldol",
  "Oxidation + phosphorylation": "Oxi hóa kèm phosphoryl hóa",
  "Dehydration": "Tách nước",
  "Condensation": "Ngưng tụ",
  "Isomerization (dehydration, then rehydration)": "Đồng phân hóa (tách nước, sau đó cộng nước lại)",
  "Electron transfer and proton pumping (quinone cycle)": "Truyền electron và bơm proton (chu trình quinone)",
  "Nucleotidyl transfer (activation)": "Chuyển nhóm nucleotidyl (hoạt hóa)",
  "Glycosyl transfer": "Chuyển nhóm glycosyl",
  "Phosphorolysis": "Phân giải bằng phosphat (Phosphorolysis)",
  "Carboxylation (bypass of pyruvate kinase)": "Carboxyl hóa (vượt qua pyruvate kinase)",
  "Decarboxylation and phosphorylation (bypass of pyruvate kinase)": "Khử carboxyl kèm phosphoryl hóa",
  "Hydration (reverse of glycolysis)": "Cộng nước (ngược đường phân)",
  "Phosphoryl shift (reverse of glycolysis)": "Chuyển vị nhóm phosphoryl (ngược đường phân)",
  "Phosphoryl transfer (reverse of glycolysis)": "Chuyển nhóm phosphoryl (ngược đường phân)",
  "Reduction (reverse of glycolysis)": "Khử (ngược đường phân)",
  "Aldol condensation (reverse of glycolysis)": "Ngưng tụ aldol (ngược đường phân)",
  "Hydrolysis (bypass of phosphofructokinase)": "Thủy phân (vượt qua PFK-1)",
  "Hydrolysis (bypass of hexokinase)": "Thủy phân (vượt qua hexokinase)",
  "Thiolysis": "Phân cắt bằng thiol (Thiolysis)",
  "Cleavage (thiolysis)": "Phân cắt (thiolysis)",
  "Electron transfer (1 e⁻ at a time)": "Truyền electron (từng 1 e⁻ một)",
  "Electron transfer (heme iron Fe³⁺ to Fe²⁺)": "Truyền electron (sắt của heme từ Fe³⁺ thành Fe²⁺)",
  "Electron transfer (copper and heme)": "Truyền electron (qua trung tâm đồng và heme)",
  "Reduction of O₂ (4 e⁻)": "Khử O₂ (4 e⁻)",
  "ATP synthesis (binding change)": "Tổng hợp ATP (cơ chế thay đổi ái lực liên kết)",
  "Carboxylation and phosphorylation (committed step)": "Carboxyl hóa kèm phosphoryl hóa (bước quyết định)",
  "Condensation (activated by ATP)": "Ngưng tụ (hoạt hóa bởi ATP)",
  "Elimination (lyase)": "Phản ứng tách (lyase)",
  "Hydrolysis of an amide": "Thủy phân liên kết amid",
  "Facilitated diffusion through a channel": "Khuếch tán tăng cường qua kênh",
  "Symport with H\\u207a": "Đồng vận chuyển cùng H⁺",
  "Fission, spends GTP": "Phân hạch ty thể, tiêu tốn GTP",
  "Outer membrane fusion, spends GTP": "Hợp nhất màng ngoài, tiêu tốn GTP",
  "Inner membrane fusion, spends GTP": "Hợp nhất màng trong, tiêu tốn GTP",
  "Pore formation and release": "Tạo lỗ màng và giải phóng",
  "Complex assembly": "Lắp ráp phức hợp",
  "Activation of a precursor by proximity": "Hoạt hóa tiền chất nhờ tiếp cận gần (proximity)",
  "Receptor activation": "Hoạt hóa thụ thể",
  "Recruitment and activation of a precursor": "Tuyển mộ và hoạt hóa tiền chất",
  "all": "Tất cả (hoặc giữ nguyên khóa kỹ thuật: all)",
  "custom": "Tùy chỉnh (hoặc giữ nguyên khóa kỹ thuật: custom)",
  "facts": "Kiến thức / Sự kiện (hoặc giữ nguyên khóa kỹ thuật: facts)",
  "structure": "Cấu trúc (hoặc giữ nguyên khóa kỹ thuật: structure)",
  "Water oxidation (4 e⁻)": "Oxi hóa nước (4 e⁻)",
  "Release into the quinone pool": "Giải phóng vào bể quinone",
  "Electron transfer and proton release": "Truyền electron và giải phóng proton",
  "Water oxidation and quinone reduction": "Oxi hóa nước và khử quinone",
  "Photoexcitation and electron transfer": "Kích thích quang học và truyền electron",
  "Light reactions: NADP⁺ reduced, water oxidized": "Pha sáng: khử NADP⁺, oxi hóa nước",
  "Photophosphorylation": "Quang phosphoryl hóa",
  "Carbon fixation (net equation of the Calvin cycle)": "Cố định carbon (phương trình tổng của chu trình Calvin)",
  "Electron transfer out of the reaction center": "Truyền electron ra khỏi trung tâm phản ứng",
  "Electron return and proton pumping": "Hoàn trả electron và bơm proton",
  "The ring closes: the hole is refilled and the pair is excited again": "Khép kín vòng: lấp đầy lỗ trống điện tử và kích thích lại cặp sắc tố",
  "ATP synthesis (the only product of the loop)": "Tổng hợp ATP (sản phẩm duy nhất của vòng)",
  "Carboxylation (carbon fixation)": "Carboxyl hóa (cố định carbon)",
  "Epimerization": "Epimer hóa",
  "Stage 1: carbon fixation": "Giai đoạn 1: cố định carbon",
  "Stage 2: reduction": "Giai đoạn 2: khử",
  "Stage 3: regeneration": "Giai đoạn 3: tái tạo chất nhận",
  "Carboxylation (the Calvin cycle starts)": "Carboxyl hóa (khởi đầu chu trình Calvin)",
  "Phosphorylation (regenerates PEP)": "Phosphoryl hóa (tái tạo PEP)",
  "Binding of the hormone": "Gắn kết hormone",
  "Structural change of the receptor": "Biến đổi cấu hình của thụ thể",
  "Replacement of GDP by GTP": "Thay thế GDP bằng GTP",
  "Dissociation and activation of an enzyme": "Phân ly và hoạt hóa enzyme",
  "GTPase action": "Hoạt tính GTPase",
  "Return to the original state": "Trở về trạng thái ban đầu",
  "Cyclization": "Đóng vòng",
  "Binding of cAMP to the regulatory subunits": "Gắn cAMP vào các tiểu đơn vị điều hòa",
  "Phosphorylation of a Ser/Thr protein": "Phosphoryl hóa protein tại gốc Ser/Thr",
  "Dephosphorylation": "Khử phosphat",
  "Reassembly of inactive PKA": "Tái lắp ráp PKA bất hoạt",
  "Hormone stimulation": "Kích thích bởi hormone",
  "Phosphorolysis of glycogen": "Phân giải glycogen bằng phosphat",
  "Hormone binding and activation of a G protein": "Gắn hormone và hoạt hóa protein G",
  "Activation of an enzyme by the G protein": "Hoạt hóa enzyme bởi protein G",
  "Hydrolysis of a phospholipid": "Thủy phân phospholipid",
  "Release of Ca²⁺ from the endoplasmic reticulum": "Giải phóng Ca²⁺ từ lưới nội chất",
  "Binding of Ca²⁺": "Gắn kết Ca²⁺",
  "Phosphorylation of a target enzyme": "Phosphoryl hóa enzyme đích",
  "Activation of a membrane kinase": "Hoạt hóa kinase màng",
  "Phosphorylation of channels": "Phosphoryl hóa các kênh ion",
  "Binding of the ligand": "Gắn kết phối tử (ligand)",
  "The message is passed on": "Tín hiệu được truyền tiếp",
  "Binding of insulin": "Gắn kết insulin",
  "Autophosphorylation": "Tự phosphoryl hóa",
  "Activation of the docking protein": "Hoạt hóa protein neo (docking protein)",
  "Activation of a lipid kinase": "Hoạt hóa lipid kinase",
  "Phosphorylation of a lipid": "Phosphoryl hóa lipid",
  "Activation of PDK1": "Hoạt hóa PDK1",
  "Activation of Akt": "Hoạt hóa Akt",
  "Movement of GLUT4 to the plasma membrane": "Di chuyển GLUT4 ra màng sinh chất",
  "Uptake of glucose": "Hấp thu glucose",
  "Activation of phosphoprotein phosphatase": "Hoạt hóa phosphoprotein phosphatase",
  "Binding of the effector to the stimulatory receptor": "Gắn chất tác động vào thụ thể kích thích",
  "GTP-GDP exchange on Gs": "Trao đổi GTP–GDP trên Gs",
  "Stimulation of adenylate cyclase (the green plus)": "Kích thích adenylate cyclase (dấu cộng màu xanh)",
  "Binding of the effector to the inhibitory receptor": "Gắn chất tác động vào thụ thể ức chế",
  "GTP-GDP exchange on Gi": "Trao đổi GTP–GDP trên Gi",
  "Inhibition of the enzyme": "Ức chế enzyme",
  "Inhibition of the stimulatory arm": "Ức chế nhánh kích thích",
  "Phosphorylation of the receptor tail": "Phosphoryl hóa đuôi thụ thể",
  "Binding to the phosphorylated tail (blocks and favors endocytosis)": "Gắn vào đuôi đã phosphoryl hóa (chặn tín hiệu và thúc đẩy nội thực bào)",
  "GTPase action (the switch turns itself off)": "Hoạt tính GTPase (công tắc tự tắt)",
  "Return to the resting state": "Trở về trạng thái nghỉ",
  "Reassembly of the inactive kinase": "Tái lắp ráp kinase bất hoạt",
  "Binding of glucagon": "Gắn kết glucagon",
  "Phosphorylation (activity decreased)": "Phosphoryl hóa (giảm hoạt tính)",
  "Phosphorylation (activity increased)": "Phosphoryl hóa (tăng hoạt tính)",
  "Fall of the regulator": "Giảm nồng độ chất điều hòa",
  "Lack of allosteric activation": "Mất hoạt hóa dị lập thể",
  "Release of the brake": "Giải phóng phanh ức chế",
  "Binding of EGF and dimerization": "Gắn EGF và dimer hóa",
  "Exchange of GDP for GTP on RAS": "Trao đổi GDP lấy GTP trên RAS",
  "Activation of the first kinase of the chain": "Hoạt hóa kinase đầu tiên của chuỗi",
  "Phosphorylation (activation of the second kinase)": "Phosphoryl hóa (hoạt hóa kinase thứ hai)",
  "Phosphorylation (activation of the third kinase)": "Phosphoryl hóa (hoạt hóa kinase thứ ba)",
  "Phosphorylation of a kinase one level down": "Phosphoryl hóa kinase ở tầng dưới kế tiếp",
  "Phosphorylation of a second kinase at that level": "Phosphoryl hóa kinase thứ hai ở tầng đó",
  "Phosphorylation of a transcription factor": "Phosphoryl hóa yếu tố phiên mã",
  "Phosphorylation of a second transcription factor": "Phosphoryl hóa yếu tố phiên mã thứ hai",
  "Phosphorylation of a ribosomal protein": "Phosphoryl hóa protein ribosome",
  "Activation of the target genes": "Hoạt hóa các gen đích",
  "Binding of GTP switches the protein on": "Gắn GTP bật công tắc protein",
  "Slow GTPase action switches it off": "Hoạt tính GTPase chậm tắt công tắc",
  "The active switch stimulates the next event": "Công tắc hoạt động kích thích bước tiếp theo",
  "A mutation at codon 12, 13 or 61 slows the GTPase": "Đột biến tại codon 12, 13 hoặc 61 làm chậm hoạt tính GTPase",
  "Hormone entry across the lipid bilayer": "Hormone đi xuyên qua lớp kép lipid",
  "Binding of the hormone to the receptor": "Gắn hormone vào thụ thể",
  "Release from the resting complex": "Giải phóng khỏi phức hợp ở trạng thái nghỉ",
  "Movement to the nucleus": "Di chuyển vào nhân tế bào",
  "Binding to the HRE with a coactivator and RNA polymerase": "Gắn vào HRE cùng đồng hoạt hóa và RNA polymerase",
  "Transcription activation": "Hoạt hóa phiên mã",
  "Movement of the mRNA to the cytoplasm": "Di chuyển mRNA ra tế bào chất",
  "Translation and changed cell function": "Dịch mã và thay đổi chức năng tế bào",
  "Reduction (the carrier of glycolysis is regenerated)": "Khử (tái tạo chất mang của đường phân)",
  "Oxidation (the muscle step run backwards)": "Oxi hóa (đảo ngược bước xảy ra ở cơ)",
  "Hydrolysis of peptide bonds": "Thủy phân liên kết peptide",
  "Removal of the nitrogen group": "Tách nhóm chứa nitơ",
  "Transamination (in the muscle)": "Chuyển amin (ở cơ)",
  "Transamination (in the liver)": "Chuyển amin (ở gan)",
  "Nitrogen disposal (in the liver)": "Đào thải nitơ (ở gan)",
  "Condensation of an aldehyde with an amine (steps 1a and 1b)": "Ngưng tụ aldehyde với amine (bước 1a và 1b)",
  "Transaldimination (steps 2a to 2c)": "Chuyển aldimine / Transaldimination (bước 2a đến 2c)",
  "Loss of the α-proton (step 3)": "Tách proton α (bước 3)",
  "Protonation at C4′ (step 4)": "Proton hóa tại C4′ (bước 4)",
  "Hydrolysis of a C=N bond (step 5)": "Thủy phân liên kết C=N (bước 5)",
  "Second half-reaction (the first half run backwards)": "Nửa phản ứng thứ hai (nửa đầu chạy ngược lại)",
  "Oxidation (the committed step, NADPH made)": "Oxi hóa (bước quyết định, tạo NADPH)",
  "Hydrolysis of the ring ester": "Thủy phân ester vòng",
  "Oxidative decarboxylation (NADPH and CO₂)": "Khử carboxyl oxi hóa (tạo NADPH và CO₂)",
  "Isomerization (ketose to aldose)": "Đồng phân hóa (cetose sang aldose)",
  "Epimerization at carbon 3": "Epimer hóa tại carbon 3",
  "Transfer of three carbons": "Chuyển 3 carbon",
  "Pyrophosphoryl transfer (the sugar is activated)": "Chuyển nhóm pyrophosphoryl (hoạt hóa đường)",
  "Amidotransfer (the rate-limiting step)": "Chuyển nhóm amid (bước giới hạn tốc độ)",
  "Ring closure (the imidazole ring)": "Đóng vòng (vòng imidazole)",
  "Ring closure (the second ring)": "Đóng vòng (vòng thứ hai)",
  "Carboxylation and phosphorylation (the rate-limiting step)": "Carboxyl hóa kèm phosphoryl hóa (bước giới hạn tốc độ)",
  "Ring closure (a condensation)": "Đóng vòng (phản ứng ngưng tụ)",
  "Oxidation (the ring gets its double bond)": "Oxi hóa (vòng hình thành liên kết đôi)",
  "Transfer of the ribose phosphate (N-glycosidic bond)": "Chuyển ribose phosphate (liên kết N-glycosidic)",
  "Amide bond formation (spends GTP)": "Tạo liên kết amid (tiêu tốn GTP)",
  "Oxidation (the committed step of its branch)": "Oxi hóa (bước quyết định của nhánh)",
  "Amidation (spends ATP to AMP and PPᵢ)": "Amid hóa (tiêu tốn ATP thành AMP và PPᵢ)",
  "Methyl transfer (the one route to thymidylate)": "Chuyển nhóm methyl (con đường duy nhất tạo thymidylate)",
  "Reduction (the coenzyme is restored)": "Khử (tái tạo coenzyme)"
};
function rxnTypeLabel(type) {
return RXN_TYPE_LABEL[type] || type;
}

var modalStack = [];
function closeAllModals() {
while (modalStack.length) {
var rec = modalStack[modalStack.length - 1];
if (rec && typeof rec.close === 'function') { rec.close(); }
else { modalStack.pop(); }
}
if (typeof document !== 'undefined' && document.documentElement) {
document.documentElement.classList.remove('mg-lock');
}
}
function focusables(scope) {
return Array.prototype.slice.call(
scope.querySelectorAll('button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])')
).filter(function (n) { return !n.disabled; });
}
function trapTab(e, panel) {
var items = focusables(panel);
if (!items.length) { e.preventDefault(); panel.focus(); return; }
var first = items[0], last = items[items.length - 1], active = document.activeElement;
if (e.shiftKey && (active === first || !panel.contains(active))) { e.preventDefault(); last.focus(); }
else if (!e.shiftKey && (active === last || !panel.contains(active))) { e.preventDefault(); first.focus(); }
}
function modal(opts) {
var o = opts || {};
var returnTo = document.activeElement;
var closed = false;
var pressedOnBackdrop = false;
var record = { close: close, element: null };
var closeBtn = el('button', {
type: 'button', class: 'mg-btn mg-btn--icon mg-modal__close', 'aria-label': 'Đóng',
on: { click: function () { close(); } }
}, icon('close'));
var panel = el('div', {
class: 'mg-modal__panel' + (o.wide ? ' mg-modal__panel--wide' : '') + (o.panelClass ? ' ' + o.panelClass : ''),
role: 'dialog', 'aria-modal': 'true', 'aria-label': o.label || o.title || 'Đối thoại', tabindex: '-1'
}, closeBtn, o.title ? el('h2', { class: 'mg-modal__title', text: o.title }) : null, o.body || null);
var overlay = el('div', { class: 'mg-modal' }, panel);
record.element = panel;
overlay.addEventListener('pointerdown', function (e) { pressedOnBackdrop = e.target === overlay; });
overlay.addEventListener('click', function (e) {
var inside = pressedOnBackdrop && e.target === overlay;
pressedOnBackdrop = false;
if (inside) { close(); }
});
function onKey(e) {
if (modalStack[modalStack.length - 1] !== record) { return; }
if (e.key === 'Escape' || e.key === 'Esc') { e.preventDefault(); close(); }
else if (e.key === 'Tab') { trapTab(e, panel); }
}
function close() {
if (closed) { return; }
closed = true;
document.removeEventListener('keydown', onKey, true);
var at = modalStack.indexOf(record);
if (at >= 0) { modalStack.splice(at, 1); }
if (overlay.parentNode) { overlay.parentNode.removeChild(overlay); }
if (!modalStack.length) { document.documentElement.classList.remove('mg-lock'); }
if (returnTo && typeof returnTo.focus === 'function' && document.body.contains(returnTo)) {
returnTo.focus({ preventScroll: true });
}
if (typeof o.onClose === 'function') { o.onClose(); }
}
modalStack.push(record);
document.addEventListener('keydown', onKey, true);
document.documentElement.classList.add('mg-lock');
document.body.appendChild(overlay);
(focusables(panel)[0] || panel).focus({ preventScroll: true });
return { close: close, element: panel };
}
var toastLayer = null;
function toast(text, ms) {
if (!toastLayer) { toastLayer = el('div', { class: 'mg-toasts', 'aria-live': 'polite' }); }
if (!toastLayer.parentNode) { document.body.appendChild(toastLayer); }
while (toastLayer.firstChild) { toastLayer.removeChild(toastLayer.firstChild); }
var node = el('div', { class: 'mg-toast', role: 'status' }, String(text));
toastLayer.appendChild(node);
setTimeout(function () {
node.classList.add('is-leaving');
setTimeout(function () {
if (node.parentNode) { node.parentNode.removeChild(node); }
}, 220);
}, ms || 2400);
}
var memory = {};
var courseSel = null;
var courseRuns = {};
function readSettings() {
var out = copy(DEFAULTS);
assign(out, copy(memory));
if (MG.store && typeof MG.store.getSettings === 'function') {
try { assign(out, MG.store.getSettings() || {}); }
catch (err) { console.error(err); }
}
if (out.pathwayId === 'lipidssynth' || out.pathwayId === 'faoverview') {
  out.pathwayId = 'mix:fas+faelong+desatmech+tag+lipidsreg';
}
if (out.pathwayId !== NONE && !pathwayById(out.pathwayId)) {
var kept = MG.custom && typeof MG.custom.prune === 'function' ? MG.custom.prune(out.pathwayId) : null;
out.pathwayId = kept && pathwayById(kept) ? kept : DEFAULTS.pathwayId;
}
if (!MODE_NAME[out.mode]) { out.mode = DEFAULTS.mode; }
if (!FORMAT_NAME[out.format]) { out.format = DEFAULTS.format; }
if (!out.excluded || typeof out.excluded !== 'object') { out.excluded = {}; }
out.sound = out.sound !== false;
out.cofactors = out.cofactors !== false;
if (THEMES.indexOf(out.theme) < 0) { out.theme = DEFAULTS.theme; }
return out;
}
function writeSettings(patch) {
assign(memory, copy(patch));
if (MG.store && typeof MG.store.setSettings === 'function') {
try { MG.store.setSettings(patch); }
catch (err) { console.error(err); }
}
}
function resetProgress(target) {
if (MG.store && typeof MG.store.reset === 'function') {
try { MG.store.reset(target); }
catch (err) { console.error(err); }
}
}
function clearHistory(pathwayId) {
var p = pathwayId ? viewOf(pathwayId) : null;
if (!p) {
resetProgress();
courseRuns = {};
storeSet(RUNS_KEY, '{}');
if (MG.atpUi && typeof MG.atpUi.clearBest === 'function') { MG.atpUi.clearBest(); }
if (MG.gamesUi && typeof MG.gamesUi.clearBest === 'function') { MG.gamesUi.clearBest(); }
if (MG.drawUi && typeof MG.drawUi.clearBest === 'function') { MG.drawUi.clearBest(); }
return;
}
var cleared = (pathwayById(p.id) || p).order || [];
resetProgress(cleared.slice());
Object.keys(MG.pathways || {}).forEach(function (pid) {
var q = MG.pathways[pid];
var shared = (q.order || []).some(function (rid) { return cleared.indexOf(rid) >= 0; });
if (!shared) { return; }
Object.keys(courseRuns).forEach(function (cid) {
if (courseRuns[cid] && typeof courseRuns[cid] === 'object') { delete courseRuns[cid][pid]; }
});
});
storeSet(RUNS_KEY, JSON.stringify(courseRuns));
}
function hasHistory(pathway) {
var m = masteryMap(pathway);
return pathway.order.some(function (rid) { return typeof m[rid] === 'number'; });
}
var PRACTICE_MAX = 10;
var PRACTICE_MIN = 3;
function weakPractice() {
if (!MG.store || typeof MG.store.weak !== 'function') { return null; }
var ranked;
try { ranked = MG.store.weak() || []; }
catch (err) { console.error(err); return null; }
var homes = {};
var menu = menuPathwayIds();
menu.forEach(function (pid) {
var p = pathwayById(pid);
(p ? p.order : []).forEach(function (rid) { (homes[rid] = homes[rid] || []).push(pid); });
});
var weak = ranked.map(function (r) { return r.id; }).filter(function (rid) { return !!homes[rid]; }).slice(0, PRACTICE_MAX);
if (weak.length < PRACTICE_MIN) { return null; }
var left = weak.slice();
var cover = [];
while (left.length) {
var best = null, bestN = 0;
menu.forEach(function (pid) {
var n = left.filter(function (rid) { return homes[rid].indexOf(pid) >= 0; }).length;
if (n > bestN) { best = pid; bestN = n; }
});
if (!best) { break; }
cover.push(best);
left = left.filter(function (rid) { return homes[rid].indexOf(best) < 0; });
}
var mapId = MG.custom && cover.length > 1 ? MG.custom.idFor(cover) : cover[0];
var map = mapId ? pathwayById(mapId) : null;
if (!map) { return null; }
var steps = weak.filter(function (rid) { return map.order.indexOf(rid) >= 0; });
return steps.length >= PRACTICE_MIN ? { pathwayId: map.id, steps: steps } : null;
}
function missedSteps(sum) {
var p = sum && sum.pathwayId ? pathwayById(sum.pathwayId) : null;
if (!p) { return []; }
var ids = {};
(Array.isArray(sum.missed) ? sum.missed : []).concat(Array.isArray(sum.retried) ? sum.retried : []).forEach(function (m) {
if (m && typeof m.rxnId === 'string') { ids[m.rxnId] = true; }
});
return p.order.filter(function (rid) { return ids[rid] === true; });
}
function startPractice(practice) {
if (!practice || !practice.steps.length) { return; }
if (!quizReady()) { toast('Chưa tải được phần quiz, hãy tải lại trang'); return; }
var cfg = quizConfig(readSettings(), null, practice);
if (!cfg.steps || !cfg.steps.length) { return; }
startQuiz(cfg, { course: null, practice: { pathwayId: cfg.pathwayId, steps: cfg.steps.slice() } });
}
function confirmButton(cls, label, armedLabel, onConfirm) {
var armed = false, timer = null;
var node = el('button', { type: 'button', class: cls }, label);
function disarm() {
armed = false;
clearTimeout(timer);
node.textContent = label;
node.classList.remove('is-armed');
}
node.addEventListener('click', function () {
if (!armed) {
armed = true;
node.textContent = armedLabel;
node.classList.add('is-armed');
timer = setTimeout(disarm, 4000);
return;
}
disarm();
onConfirm();
});
return { node: node, disarm: disarm };
}
function setCourseSelection(id) {
courseSel = id && MG.courses && MG.courses[id] ? id : null;
storeSet(COURSE_KEY, courseSel || '');
}
function loadCourseState() {
var saved = storeGet(COURSE_KEY);
courseSel = saved && MG.courses && MG.courses[saved] ? saved : null;
if (saved && !courseSel) { storeSet(COURSE_KEY, ''); }   // a course of a pack that is switched off does not reopen by itself later
try {
var runs = JSON.parse(storeGet(RUNS_KEY) || '{}');
courseRuns = runs && typeof runs === 'object' ? runs : {};
} catch (err) {
courseRuns = {};
}
}
function recordRun(courseId, pathwayId, pct) {
if (!courseId || !pathwayId) { return; }
courseRuns[courseId] = courseRuns[courseId] || {};
courseRuns[courseId][pathwayId] = Math.round(pct);
storeSet(RUNS_KEY, JSON.stringify(courseRuns));
}
function runPct(courseId, pathwayId) {
var run = courseRuns[courseId];
return run && typeof run[pathwayId] === 'number' ? run[pathwayId] : null;
}
function resolveTheme(pref) {
if (pref === 'dark') { return 'dark'; }
if (pref === 'auto') {
try { return root.matchMedia && root.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; }
catch (err) { return 'light'; }
}
return 'light';
}
var themeWatched = false;
function applyTheme() {
var theme = resolveTheme(readSettings().theme);
var html = document.documentElement;
if (html && typeof html.setAttribute === 'function') { html.setAttribute('data-theme', theme); }
if (typeof document.querySelector === 'function') {
var meta = document.querySelector('meta[name="theme-color"]');
if (meta) { meta.setAttribute('content', THEME_COLOR[theme]); }
}
if (!themeWatched) {
themeWatched = true;
try {
var query = root.matchMedia ? root.matchMedia('(prefers-color-scheme: dark)') : null;
if (query && typeof query.addEventListener === 'function') {
query.addEventListener('change', function () { if (readSettings().theme === 'auto') { applyTheme(); } });
}
} catch (err) { /* no media queries here: Auto stays as it was applied */ }
}
}
function setTheme(value) {
if (THEMES.indexOf(value) < 0) { return; }
writeSettings({ theme: value });
applyTheme();
}
function quizReady() {
return !!(MG.quiz && typeof MG.quiz.mount === 'function');
}
function quizConfig(s, ctx, practice) {
var pathway = practice ? viewOf(practice.pathwayId) : (viewOf(s.pathwayId) || viewOf(DEFAULTS.pathwayId));
var out = s.excluded[pathway.id] || [];
var steps = null;
if (practice) {
steps = practice.steps.filter(function (id) { return pathway.order.indexOf(id) >= 0; });
} else if (s.mode === 'build' && out.length) {
steps = pathway.order.filter(function (id) { return out.indexOf(id) < 0; });
}
var cfg = {
pathwayId: pathway.id,
mode: s.mode,
format: s.format,
steps: steps,
givenStart: !!s.givenStart,
cofactors: s.cofactors !== false,
seed: randomSeed(),
store: MG.store || null,
now: function () { return Date.now(); },
settings: { format: s.format, showSlotLabels: !!s.showSlotLabels, givenStart: !!s.givenStart, cofactors: s.cofactors !== false, sound: s.sound !== false }
};
return cfg;
}
function resolveTarget(kind, id, o) {
var k = kind, molId = null;
if (k === 'node') {
var p = pathwayById(o.pathwayId) || pathwayById('full');
var node = p && p.nodes ? p.nodes[id] : null;
if (!node) { return null; }
molId = node.mol;
k = 'molecule';
} else if (k === 'molecule') {
molId = id;
}
var entity = ent(k, k === 'molecule' ? molId : id);
if (!entity) { return null; }
var found = o.rxnId ? findReaction(o.rxnId, o.pathwayId) : null;
return {
kind: k, entity: entity, molId: molId,
rxn: found ? found.rxn : null, pathway: found ? found.pathway : null
};
}
function detailCard(kind, id, opts) {
var o = opts || {};
var t = resolveTarget(kind, id, o);
if (!t) {
toast('Chưa có dữ liệu để hiển thị');
return null;
}
return modal({
label: t.entity.name, body: detailBody(t, o), wide: !!t.rxn,
panelClass: 'mg-card--option mg-detail-card', onClose: o.onClose
});
}
function cofactorChip(c, text, extraClass) {
return el('span', { class: 'mg-chip ' + (CHIP_CLASS[c.family] || '') + (extraClass ? ' ' + extraClass : ''), text: text });
}
function detailBody(t, o) {
var e = t.entity, rxn = t.rxn, pathway = t.pathway;
var geom = t.molId && MG.geometry ? MG.geometry[t.molId] : null;
var pathwayId = pathway ? pathway.id : (o.pathwayId || 'full');
var code = null;
if (t.kind === 'cofactor' && e.display !== e.name) {
code = cofactorChip(e, e.display || e.name, 'mg-detail__chip');
} else if (t.kind !== 'cofactor' && e.short && e.short !== e.name) {
code = el('span', { class: 'mg-detail__code', text: e.short });
}
var longClass = e.name.length > 34 ? ' is-xlong' : (e.name.length > 24 ? ' is-long' : '');
var title = el('h2', { class: 'mg-detail__title mg-outlined' + longClass, text: e.name });
var head = el('div', { class: 'mg-detail__head' + (code ? '' : ' mg-detail__head--solo') }, code, title);
var struct = null;
if (t.kind === 'molecule') {
var drawable = !e.noStructure && !!geom && Array.isArray(geom.atoms) && geom.atoms.length > 0;
if (drawable) {
var svg = renderStructure(t.molId, 300, 180, highlightFor(rxn, t.molId, pathway), e.name, 40);
if (svg) { struct = el('div', { class: 'mg-detail__struct', html: svg }); }
}
if (!struct) {
struct = el('div', { class: 'mg-detail__struct mg-detail__struct--label' }, el('span', { text: e.short || e.name }));
}
}
var rows = [];
if (t.kind === 'molecule') {
var formula = (geom && geom.formula) || e.formula;
if (formula) { rows.push(['Công thức', formula]); }
if (geom && typeof geom.charge === 'number') { rows.push(['Điện tích', chargeText(geom.charge)]); }
} else if (t.kind === 'enzyme') {
if (e.ec) {
var ecClass = ecClassName(e.ec);
rows.push(['Mã số EC', ecClass ? e.ec + ' (' + ecClass + ')' : e.ec]);
}
if (e.family) { rows.push(['Lớp enzyme', classLabel(e.family)]); }
} else if (t.kind === 'cofactor') {
if (e.family) { rows.push(['Họ', familyLabel(e.family)]); }
if (e.acceptAlso && e.acceptAlso.length) {
rows.push(['Chấp nhận cả', e.acceptAlso.map(function (id) {
var other = ent('cofactor', id);
return other ? other.name : humanize(id);
}).join(', ')]);
}
}
if (rxn) { rows.push(['Phản ứng', stepText(rxn, pathway) + ' (' + rxnTypeLabel(rxn.type) + ')']); }
var info = rows.length ? el('dl', { class: 'mg-info' }, rows.map(function (row) {
return el('div', { class: 'mg-info__row' }, el('dt', { text: row[0] }), el('dd', { text: row[1] }));
})) : null;
var eq = rxn ? el('div', { class: 'mg-detail__eq' }, equationStrip(rxn, pathway), el('p', { class: 'mg-eq__text', text: rxn.equation })) : null;
var noteText = (pathway && pathway.entityNotes && pathway.entityNotes[e.id]) || e.note;
var note = noteText ? el('p', { class: 'mg-detail__note', text: noteText }) : null;
var mastery = rxn ? masteryRow(pathwayId, rxn.id) : null;
return el('div', { class: 'mg-detail' }, head, struct, info, eq, note, mastery);
}
function equationStrip(rxn, pathway) {
var nodes = pathway && pathway.nodes ? pathway.nodes : {};
var hl = rxn.hl || {};
function molItem(nodeId, group) {
var n = nodes[nodeId];
var m = n ? ent('molecule', n.mol) : null;
var name = m ? (m.short || m.name) : nodeId;
var marks = hl[group] && hl[group][nodeId] ? hl[group][nodeId] : [];
var svg = n && !(m && m.noStructure) ? renderStructure(n.mol, 96, 70, marks, m ? m.name : name, 34) : null;
var box = el('div', { class: 'mg-eq__mol' + (svg ? '' : ' mg-eq__mol--text'), html: svg });
if (!svg) { box.textContent = name; }
return el('div', { class: 'mg-eq__item' }, box, svg ? el('span', { class: 'mg-eq__name', text: name }) : null);
}
function cofItem(cid) {
var c = ent('cofactor', cid);
return c ? cofactorChip(c, c.display || c.name, 'mg-eq__chip') : el('span', { class: 'mg-chip', text: humanize(cid) });
}
function side(parts) {
var out = [];
parts.forEach(function (p, i) {
if (i) { out.push(el('span', { class: 'mg-eq__op', text: '+' })); }
out.push(p);
});
return el('div', { class: 'mg-eq__side' }, out);
}
var left = (rxn.substrates || []).map(function (n) { return molItem(n, 'sub'); })
.concat((rxn.ins || []).map(cofItem));
var right = (rxn.products || []).map(function (n) { return molItem(n, 'prod'); })
.concat((rxn.outs || []).map(cofItem));
var enz = ent('enzyme', rxn.enzyme);
var arrow = el('div', { class: 'mg-eq__arrow' },
el('span', { class: 'mg-eq__enz', text: enz ? (enz.short || enz.name) : rxn.enzyme }),
el('div', { html: ARROW_SVG }));
return el('div', { class: 'mg-eq' }, side(left), arrow, side(right));
}
function masteryRow(pathwayId, rxnId) {
var pct = masteryOf(pathwayId, rxnId);
if (pct === null) { return el('p', { class: 'mg-mastery mg-mastery--empty', text: 'Chưa có câu trả lời nào cho bước này.' }); }
return el('div', { class: 'mg-mastery' },
el('span', { text: 'Độ thuần thục' }),
el('div', {
class: 'mg-progress', role: 'progressbar', 'aria-label': 'Độ thuần thục',
'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': Math.round(pct)
}, el('span', { style: { width: Math.round(pct) + '%', background: masteryColor(pct) } })),
el('span', { class: 'mg-mastery__pct', text: Math.round(pct) + ' %' }));
}
function backdropSVG(w, h) {
var rnd = mulberry32(BACKDROP_SEED);
var count = 16 + Math.floor(rnd() * 5);
var unit = Math.max(1, Math.min(w, h));
var used = {}, shapes = [];
for (var i = 0; i < count; i++) {
var kind = CPK_POOL.charAt(Math.floor(rnd() * CPK_POOL.length));
used[kind] = true;
var r = unit * (0.075 + rnd() * 0.075);
var x = rnd() * w, y = rnd() * h;
shapes.push('<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + r.toFixed(1) +
'" fill="url(#mg-sph-' + kind + ')"/>');
}
var defs = Object.keys(used).map(function (k) {
return '<radialGradient id="mg-sph-' + k + '" cx="0.36" cy="0.32" r="0.7">' +
'<stop offset="0" stop-color="#FFFFFF"/>' +
'<stop offset="0.28" stop-color="' + CPK[k][0] + '"/>' +
'<stop offset="1" stop-color="' + CPK[k][1] + '"/></radialGradient>';
}).join('');
return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h +
'" preserveAspectRatio="xMidYMid slice"><defs>' + defs + '</defs>' + shapes.join('') + '</svg>';
}
var app = null, stage = null, backdrop = null, backdropTimer = null;
var current = null;          // 'select' | 'quiz' | 'results'
var lastConfig = null;       // the config of the last quiz started
var lastStart = null;        // { config, course } of the last quiz started (Play Again uses it)
var activeQuiz = null;       // { token, ctl, course, returnTo } for the mounted quiz
var quizToken = 0;           // bumped per quiz, so hooks from an old quiz do nothing
function destroyCtl(ctl) {
if (ctl && typeof ctl.destroy === 'function') {
try { ctl.destroy(); }
catch (err) { console.error(err); }
}
}
function leaveQuiz() {
var entry = activeQuiz;
activeQuiz = null;
if (entry) { destroyCtl(entry.ctl); }
}
var navStack = [];
var lastResult = null;
var routingFromHash = false;
var hashBound = false;

function normalizeHash(h) {
return String(h || '').replace(/^#/, '');
}
function setHash(route, replace) {
if (typeof window === 'undefined' || !window.location) { return; }
var target = '#' + route;
if (window.location.hash === target) { return; }
if (replace && window.history && typeof window.history.replaceState === 'function') {
try {
window.history.replaceState(null, '', target);
return;
} catch (err) {}
}
window.location.hash = target;
}
function pushNavEntry(name, route, extra) {
var r = route || name;
var entry = {
screen: name,
route: r,
summary: extra && extra.summary ? extra.summary : null,
course: extra && extra.course ? extra.course : null
};
if (name === 'select') {
navStack = [entry];
} else if (routingFromHash) {
var found = -1;
for (var idx = navStack.length - 1; idx >= 0; idx--) {
if (navStack[idx].route === entry.route) { found = idx; break; }
}
if (found >= 0) {
navStack = navStack.slice(0, found + 1);
navStack[found] = entry;
} else {
navStack.push(entry);
}
} else {
var top = navStack[navStack.length - 1];
if (!top || top.route !== entry.route) {
navStack.push(entry);
} else {
navStack[navStack.length - 1] = entry;
}
}
if (!routingFromHash && r) {
var isInitialSelect = (name === 'select' && (!window.location || !window.location.hash));
setHash(r, isInitialSelect);
}
}
function applyRoute(route) {
var r = normalizeHash(route);
var wasRouting = routingFromHash;
routingFromHash = true;
try {
if (!r || r === 'select') {
if (current !== 'select') { showSelect(); }
return;
}
if (r === 'atp') {
if (current !== 'atp') { showAtp(); }
return;
}
if (r === 'games') {
if (current !== 'games') { showGames(); }
return;
}
if (r === 'draw') {
if (current !== 'draw') { showDraw(); }
return;
}
if (r.indexOf('quiz/') === 0) {
var pid = decodeURIComponent(r.slice(5));
if (pathwayById(pid)) {
if (current !== 'quiz' || !lastConfig || lastConfig.pathwayId !== pid) {
writeSettings({ pathwayId: pid });
startQuiz(quizConfig(readSettings(), null), {});
}
return;
}
}
if (r === 'results' && lastResult) {
if (current !== 'results') { showResults(lastResult.summary, lastResult.course); }
return;
}
if (current !== 'select') { showSelect(); }
} finally {
routingFromHash = wasRouting;
}
}
function onHashChange() {
if (typeof window === 'undefined' || !window.location) { return; }
applyRoute(window.location.hash);
}
function goBack() {
if (modalStack.length > 0) {
var topModal = modalStack[modalStack.length - 1];
if (topModal && typeof topModal.close === 'function') { topModal.close(); }
return;
}
if (navStack.length > 1) {
navStack.pop();
var prev = navStack[navStack.length - 1];
if (prev.screen === 'results' && prev.summary) {
showResults(prev.summary, prev.course || null);
return;
}
if (prev.screen === 'atp') { showAtp(); return; }
if (prev.screen === 'games') { showGames(); return; }
if (prev.screen === 'draw') { showDraw(); return; }
if (prev.screen === 'quiz' && prev.route && prev.route.indexOf('quiz/') === 0) {
var pid = decodeURIComponent(prev.route.slice(5));
if (pathwayById(pid)) {
writeSettings({ pathwayId: pid });
startQuiz(quizConfig(readSettings(), null), {});
return;
}
}
}
showSelect();
}
function setStage(node, name, keepScroll, routeMeta) {
closeAllModals();
leaveQuiz();
while (stage.firstChild) { stage.removeChild(stage.firstChild); }
stage.appendChild(node);
current = name;
app.setAttribute('data-screen', name);
pushNavEntry(name, routeMeta && routeMeta.route ? routeMeta.route : name, routeMeta);
if (!keepScroll) { window.scrollTo(0, 0); }
}
function paintBackdrop() {
if (backdrop) { backdrop.innerHTML = backdropSVG(window.innerWidth || 390, window.innerHeight || 780); }
}
function scheduleBackdrop() {
clearTimeout(backdropTimer);
backdropTimer = setTimeout(paintBackdrop, 180);
}
function start(rootEl) {
if (app) { return; }
var host = rootEl || document.getElementById('app') || document.body;
var packBootError = false;
if (MG.packs && typeof MG.packs.apply === 'function') {
try {
MG.packs.apply(MG.packs.savedFlag());
} catch (err) {
console.error(err);
packBootError = true;
writeSettings({ advanced: false });
}
}
applyTheme();
loadCourseState();
backdrop = el('div', { class: 'mg-backdrop', 'aria-hidden': 'true' });
stage = el('div', { class: 'mg-stage' });
var back = el('button', {
type: 'button', class: 'mg-btn mg-btn--icon mg-corner__back', 'aria-label': 'Quay lại', title: 'Quay lại',
on: { click: function () { goBack(); } }
}, icon('undo'));
var gear = el('button', {
type: 'button', class: 'mg-btn mg-btn--icon mg-corner__gear', 'data-key': 'settings:open', 'aria-label': 'Cài đặt', title: 'Cài đặt',
on: { click: function () { openSettings(); } }
}, icon('gear'));
app = el('div', { class: 'mg-app', 'data-screen': 'select' }, backdrop, stage, el('div', { class: 'mg-corner' }, back, gear));
host.appendChild(app);
paintBackdrop();
window.addEventListener('resize', scheduleBackdrop);
if (!hashBound) {
hashBound = true;
window.addEventListener('hashchange', onHashChange);
}
var initRoute = normalizeHash(window.location ? window.location.hash : '');
if (initRoute && initRoute !== 'select') {
navStack = [{ screen: 'select', route: 'select', summary: null, course: null }];
applyRoute(initRoute);
} else {
showSelect();
}
if (packBootError) {
toast('Không thể bật chế độ Nâng cao; đã quay về chế độ cơ bản');
}
}
function ensure() {
if (!app) { start(document.getElementById('app') || document.body); }
}
var openTabs = null;
function openGroupIds(groups, s, picked) {
if (openTabs !== null) { return openTabs.slice(); }
if (isEverythingPicked(s) || (MG.everythingAll && s.pathwayId === MG.everythingAll)) { return []; }
return groups.filter(function (g) {
return (!!g.everything && g.everything.id === s.pathwayId) || g.pathways.some(function (p) { return picked.indexOf(p.id) >= 0; });
}).map(function (g) { return g.id; });
}
function toggleTab(group) {
var s = readSettings();
var open = openGroupIds(pathwayGroups(), s, pickedPathways(s));
var isOpen = open.indexOf(group.id) >= 0;
openTabs = isOpen ? [] : [group.id];
rerender('tab:' + group.id);
}
function menuPathwayIds() {
var out = [];
pathwayGroups().forEach(function (g) { g.pathways.forEach(function (p) { if (out.indexOf(p.id) < 0) { out.push(p.id); } }); });
return MG.custom ? MG.custom.normalize(out) : out;
}
function everythingTarget() {
var ids = menuPathwayIds();
var base = ids.every(function (id) { return !MG.pathways[id] || !MG.pathways[id].pack; });
if (base && MG.everythingAll && pathwayById(MG.everythingAll)) { return MG.everythingAll; }
return MG.custom ? (MG.custom.idFor(ids) || MG.everythingAll) : MG.everythingAll;
}
function isEverythingPicked(s) {
return !!s && s.pathwayId === everythingTarget();
}
function pickedPathways(s) {
if (isEverythingPicked(s)) { return menuPathwayIds(); }
if (MG.custom && MG.custom.isMix(s.pathwayId)) { return MG.custom.parse(s.pathwayId) || []; }
if (MG.everythingAll && s.pathwayId === MG.everythingAll) {
return menuPathwayIds().filter(function (id) { return !MG.pathways[id].pack; });
}
var p = pathwayById(s.pathwayId);
return p && !p.hidden ? [p.id] : [];
}
function keepTabsOpen() {
var s = readSettings();
openTabs = openGroupIds(pathwayGroups(), s, pickedPathways(s));
}
function setPicked(list, focusKey) {
var ids = MG.custom ? MG.custom.normalize(list) : list.slice(0, 1);
keepTabsOpen();
var pid = !ids.length ? NONE : (ids.length === 1 ? ids[0] : MG.custom.idFor(ids));
var patch = { pathwayId: pid };
if (ids.length > 1 && ids.length === menuPathwayIds().length) {
patch.pathwayId = everythingTarget();
patch.excluded = withoutSteps(readSettings().excluded, patch.pathwayId);
}
writeSettings(patch);
rerender(focusKey);
}
function withoutSteps(excluded, pathwayId) {
var out = copy(excluded);
delete out[pathwayId];
return out;
}
function choosePathway(id) {
var list = pickedPathways(readSettings());
var at = list.indexOf(id);
if (at >= 0) { list.splice(at, 1); } else { list.push(id); }
setPicked(list, 'pathway:' + id);
}
function toggleGroup(group) {
var list = pickedPathways(readSettings());
var ids = group.pathways.map(function (p) { return p.id; });
var all = ids.every(function (id) { return list.indexOf(id) >= 0; });
var next = all ? list.filter(function (id) { return ids.indexOf(id) < 0; }) : list.concat(ids.filter(function (id) { return list.indexOf(id) < 0; }));
setPicked(next, 'group:' + group.id);
}
function chooseEverything(id) {
var s = readSettings();
var target = id === MG.everythingAll ? everythingTarget() : id;
var off = s.pathwayId === target;
if (off) { keepTabsOpen(); }
var patch = { pathwayId: off ? NONE : target };
if (!off) { patch.excluded = withoutSteps(s.excluded, target); }
writeSettings(patch);
rerender('everything:' + id);
}
function chooseMode(id) {
writeSettings({ mode: id });
rerender('mode:' + id);
}
function chooseFormat(id) {
writeSettings({ format: id });
rerender('format:' + id);
}
function toggleCofactors() {
writeSettings({ cofactors: readSettings().cofactors === false });
rerender('cofactors:toggle');
}
function chooseCourse(id) {
var previous = courseSel;
setCourseSelection(id);
var c = id ? courseById(id) : null;
var now = readSettings().pathwayId;
if (c && c.sections.length && (previous !== c.id || (now !== NONE && c.sections.indexOf(now) < 0))) {
writeSettings({ pathwayId: c.sections[0] });
}
rerender('course:' + (c ? c.id : 'free'));
}
function chooseSection(pathwayId) {
writeSettings({ pathwayId: readSettings().pathwayId === pathwayId ? NONE : pathwayId });
rerender('section:' + pathwayId);
}
function toggleStep(pathwayId, rxnId) {
var s = readSettings();
var pathway = pathwayById(pathwayId);
var all = copy(s.excluded);
var list = (all[pathwayId] || []).slice();
var at = list.indexOf(rxnId);
if (at >= 0) {
list.splice(at, 1);
} else {
if (pathway && list.length + 1 >= pathway.order.length) {
toast('Cần giữ ít nhất một bước trong bài');
return;
}
list.push(rxnId);
}
all[pathwayId] = list;
writeSettings({ excluded: all });
rerender('toggle:' + rxnId);
}
function pctLabel(pct) {
if (pct === null) { return null; }
var roundPct = Math.round(pct);
if (roundPct >= 80) {
return el('span', { class: 'mg-tile__pct is-mastered' }, icon('check'), el('span', { text: roundPct + ' %' }));
} else {
return el('span', { class: 'mg-tile__pct is-learning' }, el('span', { text: roundPct + ' %' }));
}
}
function tileFor(r, pathway, mastery, blank, excluded) {
var enzyme = ent('enzyme', r.enzyme) || { name: r.enzyme, short: r.enzyme };
var label = r.tile || enzyme.short || enzyme.name;
var off = !blank && excluded.indexOf(r.id) >= 0;
var pct = typeof mastery[r.id] === 'number' ? mastery[r.id] : null;
var where = stepText(r, pathway);
var state = off ? ', đã bỏ khỏi bài' : (pct === null ? ', chưa có điểm' : ', độ thuần thục ' + Math.round(pct) + '%');
var body = el('button', {
type: 'button', class: 'mg-tile__body', 'data-key': 'tile:' + r.id,
'aria-label': where + ': ' + enzyme.name + state,
on: { click: function () { detailCard('enzyme', r.enzyme, { rxnId: r.id, pathwayId: pathway.id }); } }
},
el('span', { class: 'mg-tile__step', text: where }),
el('span', { class: 'mg-tile__name' + (label.length > 6 ? ' is-xlong' : (label.length > 3 ? ' is-long' : '')), style: label.length > 6 ? { '--n': String(label.length) } : null, text: label }),
off ? null : pctLabel(pct));
var style = {};
if (!off && pct !== null) { style.background = masteryColor(pct); }
style['--mastery'] = pct === null ? '' : String(Math.round(pct));
var toggle = blank ? null : el('button', {
type: 'button', class: 'mg-tile__toggle' + (off ? ' is-off' : ' is-on'), 'data-key': 'toggle:' + r.id,
'aria-label': (off ? 'Đưa ' + where + ' trở lại' : 'Bỏ ' + where + ' khỏi bài'),
title: off ? 'Đưa ' + where + ' trở lại bài thi' : 'Bỏ ' + where + ' khỏi bài thi',
on: { click: function () { toggleStep(pathway.id, r.id); } }
});
return el('div', { class: 'mg-tile' + (off ? ' is-excluded' : '') + (!off && pct !== null ? ' is-scored' : ''), style: style }, body, toggle);
}
function section(label, content) {
return el('div', { class: 'mg-section' }, el('p', { class: 'mg-label', text: label }), content);
}
function courseStrip(course) {
var free = el('button', {
type: 'button', class: 'mg-choice mg-choice--course' + (course ? '' : ' is-selected'),
'aria-pressed': !course, 'data-key': 'course:free', title: 'Chọn bất kỳ con đường nào, theo thứ tự tùy ý',
on: { click: function () { chooseCourse(null); } }
},
el('span', { class: 'mg-choice__dot', style: { background: NO_DATA } }),
el('span', { class: 'mg-choice__title', text: 'Chơi tự do' }));
var cards = courseList().map(function (c) {
var on = !!course && course.id === c.id;
return el('button', {
type: 'button', class: 'mg-choice mg-choice--course mg-choice--small' + (on ? ' is-selected' : ''),
'aria-pressed': on, 'data-key': 'course:' + c.id, 'aria-label': c.title + '. ' + c.subtitle,
title: c.sections.length + ' các phần, theo thứ tự',
on: { click: function () { chooseCourse(c.id); } }
},
el('span', { class: 'mg-choice__face' },
el('span', { class: 'mg-choice__dot', style: { background: c.color || '#FFD166' } }),
el('span', { class: 'mg-choice__title', text: c.title })));
});
return el('div', { class: 'mg-courses', role: 'group', 'aria-label': 'Khóa học' },
[free].concat(cards.length ? [el('div', { class: 'mg-course-pills' }, cards)] : []));
}
function pathwayShortTitle(p) {
if (!p || !p.title) { return ''; }
var m = p.title.match(/^(.*?)\s*\((.*?)\)$/);
return m ? m[1].trim() : p.title;
}
function groupShortTitle(title) {
if (!title) { return ''; }
var m = title.match(/^(.*?)\s*\((.*?)\)$/);
return m ? m[1].trim() : title;
}
function pathwayTile(p, picked) {
var on = picked.indexOf(p.id) >= 0;
var several = picked.length >= 2;
return el('button', {
type: 'button', class: 'mg-ptile' + (on ? ' is-selected' : '') + (several ? ' mg-ptile--pick' : ''), 'aria-pressed': on,
'aria-label': p.title + '. ' + p.subtitle, title: p.title + '. ' + p.subtitle,
'data-key': 'pathway:' + p.id, on: { click: function () { choosePathway(p.id); } }
},
el('span', { class: 'mg-ptile__head' },
several ? el('span', { class: 'mg-ptile__check', 'aria-hidden': 'true' }) : null,
el('span', { class: 'mg-ptile__dot', style: { background: p.color } }),
el('span', { class: 'mg-ptile__title', text: pathwayShortTitle(p) })));
}
function everythingButton(p, selectedId, where, small) {
var on = p.id === selectedId;
var steps = p.order.length;
var all = where === null;
var counted = !all || everythingTarget() === p.id;
var labelText = small ? 'Gộp cả khóa' : 'Gộp tất cả vào 1 bản đồ';
var face = small ? el('span', { class: 'mg-everything__pill', text: labelText }) : labelText;
return el('button', {
type: 'button', class: 'mg-btn mg-everything' + (small ? ' mg-everything--small' : '') + (all ? ' mg-everything--all' : '') + (on ? ' is-selected' : ''),
'aria-pressed': on, 'data-key': 'everything:' + p.id,
'aria-label': labelText + (counted ? ': toàn bộ ' + steps + ' bước trên một bản đồ' : ': mọi con đường trên một bản đồ'),
title: labelText + (counted ? ' (' + steps + ' bước trên một bản đồ)' : ' (mọi con đường trên một bản đồ)'),
on: { click: function () { chooseEverything(p.id); } }
}, face);
}
function pathwayBlock(s) {
var all = MG.everythingAll ? pathwayById(MG.everythingAll) : null;
var picked = pickedPathways(s);
var chips = null;
if (picked.length === 1) {
var p0 = pathwayById(picked[0]);
if (p0) {
chips = el('div', { class: 'mg-picked-summary', 'aria-live': 'polite' },
el('span', { class: 'mg-picked-summary__badge', text: 'Đã chọn' }),
el('span', { class: 'mg-picked-summary__name', text: pathwayShortTitle(p0) }),
el('span', { class: 'mg-picked-summary__dot', text: '·' }),
el('span', { class: 'mg-picked-summary__count', text: (p0.order ? p0.order.length : 0) + ' bước' }));
}
} else if (picked.length > 1) {
var chipList = picked.map(function (pid) {
var p = pathwayById(pid);
if (!p) { return null; }
return el('span', { class: 'mg-chip mg-chip--picked', 'data-key': 'picked:' + p.id, title: p.title },
el('span', { text: pathwayShortTitle(p) }),
el('button', {
type: 'button', class: 'mg-chip__remove', 'aria-label': 'Bỏ ' + p.title,
on: { click: function (e) { e.stopPropagation(); choosePathway(p.id); } }
}, '×'));
}).filter(Boolean);
if (chipList.length > 0) {
chips = el('div', { class: 'mg-picked-chips', role: 'group', 'aria-label': 'Con đường đã chọn' }, chipList);
}
}
return el('div', { class: 'mg-section' },
el('p', { class: 'mg-label', text: 'Con đường' }),
picked.length <= 1 ? el('p', { class: 'mg-label-hint', text: 'Chạm nhiều con đường để học chung.' }) : null,
chips,
all ? everythingButton(all, isEverythingPicked(s) ? all.id : s.pathwayId, null, false) : null,
pathwayPicker(s));
}
function pathwayPicker(s) {
var picked = pickedPathways(s);
var several = picked.length >= 2;
var groups = pathwayGroups();
var open = openGroupIds(groups, s, picked);
return el('div', { class: 'mg-groups' }, groups.map(function (g) {
var isOpen = open.indexOf(g.id) >= 0;
var dot = g.color ? el('span', { class: 'mg-group__dot', style: { background: g.color }, 'aria-hidden': 'true' }) : null;
var inPick = g.pathways.filter(function (p) { return picked.indexOf(p.id) >= 0; }).length;
var mapOn = !!g.everything && g.everything.id === s.pathwayId;
var badge = mapOn ? 'Bản đồ' : (inPick ? String(inPick) : '');
var panelId = 'mg-tab-' + g.id;
var tab = el('button', {
type: 'button', class: 'mg-group__tab' + (isOpen ? ' is-open' : '') + (badge ? ' has-pick' : ''),
'aria-expanded': isOpen, 'aria-controls': panelId, 'data-key': 'tab:' + g.id,
'aria-label': g.title + ', ' + g.pathways.length + ' con đường' + (mapOn ? ', bản đồ Tất cả đã được chọn' : (inPick ? ', đã chọn ' + inPick : '')),
on: { click: function () { toggleTab(g); } }
},
dot,
el('span', { class: 'mg-group__name', text: groupShortTitle(g.title), title: g.title }),
badge ? el('span', { class: 'mg-group__badge', text: badge }) : null,
el('span', { class: 'mg-group__chev', 'aria-hidden': 'true' }));
var all = inPick === g.pathways.length;
var pickAll = el('button', {
type: 'button', class: 'mg-group__pickall' + (several ? (all ? ' is-all' : (inPick ? ' is-some' : '')) : ''),
'aria-pressed': all, 'data-key': 'group:' + g.id,
'aria-label': (all ? 'Bỏ chọn nhóm ' : 'Chọn cả nhóm ') + g.title,
title: all ? 'Bỏ chọn nhóm ' + g.title : 'Chọn cả nhóm ' + g.title,
on: { click: function () { toggleGroup(g); } }
}, el('span', { class: 'mg-group__box', 'aria-hidden': 'true' }), el('span', { text: all ? 'Bỏ chọn nhóm' : 'Chọn cả nhóm' }));
var presetBtns = (g.presets || []).map(function (pr) {
  var normPr = MG.custom ? MG.custom.normalize(pr.ids) : pr.ids.slice();
  var normPicked = MG.custom ? MG.custom.normalize(picked) : picked.slice();
  var prOn = normPr.length > 0 && normPr.length === normPicked.length && normPr.every(function (id, idx) { return normPicked[idx] === id; });
  return el('button', {
    type: 'button',
    class: 'mg-group__preset' + (prOn ? ' is-selected' : ''),
    'aria-pressed': prOn,
    'data-key': 'preset:' + pr.id,
    title: 'Chọn nhanh: ' + pr.label,
    on: { click: function () { setPicked(prOn ? [] : pr.ids, 'preset:' + pr.id); } }
  }, pr.label);
});
return el('div', { class: 'mg-group' + (isOpen ? ' is-open' : '') },
tab,
el('div', { class: 'mg-group__panel', id: panelId, hidden: !isOpen },
el('div', { class: 'mg-group__tools' }, [pickAll].concat(presetBtns)),
el('div', { class: 'mg-ptiles', role: 'group', 'aria-label': g.title },
g.pathways.map(function (p) { return pathwayTile(p, picked); }))));
}));
}
function sectionTile(course, pathwayId, index, selectedId) {
var p = pathwayById(pathwayId);
var stat = sectionAverage(pathwayId);
var on = pathwayId === selectedId;
return el('button', {
type: 'button', class: 'mg-section-tile' + (on ? ' is-selected' : '') + (stat.started ? ' is-scored' : ''), 'aria-pressed': on,
'data-key': 'section:' + pathwayId,
style: stat.started ? { background: masteryColor(stat.pct) } : null,
'aria-label': 'Phần ' + (index + 1) + ', ' + p.title + ', ' + (stat.started ? Math.round(stat.pct) + ' phần trăm' : 'chưa bắt đầu'),
title: p.title + (p.subtitle ? '. ' + p.subtitle : ''),
on: { click: function () { chooseSection(pathwayId); } }
},
el('span', { class: 'mg-section-tile__num', text: String(index + 1) }),
el('span', { class: 'mg-section-tile__text' },
el('span', { class: 'mg-section-tile__title', text: pathwayShortTitle(p) })),
stat.started ? el('span', { class: 'mg-section-tile__pct', text: Math.round(stat.pct) + ' %' }) : null);
}
function sectionsBlock(course, s) {
var every = course.everything ? viewOf(course.everything) : null;
return el('div', { class: 'mg-section' },
el('div', { class: 'mg-label-row' },
el('p', { class: 'mg-label', text: 'Chặng' }),
el('div', { class: 'mg-label-actions' }, every ? everythingButton(every, s.pathwayId, course.title, true) : null)),
sectionList(course, s));
}
function sectionList(course, s) {
return el('div', { class: 'mg-sections', role: 'group', 'aria-label': course.title + ' các phần' },
course.sections.map(function (pid, i) { return sectionTile(course, pid, i, s.pathwayId); }));
}
function selectScreen(fresh) {
var s = readSettings();
var course = courseById(courseSel);
if (course && course.sections.length && s.pathwayId !== NONE && course.sections.indexOf(s.pathwayId) < 0 && s.pathwayId !== course.everything) {
s.pathwayId = course.sections[0];
writeSettings({ pathwayId: s.pathwayId });
} else if (!course && isCourseEverything(s.pathwayId)) {
s.pathwayId = DEFAULTS.pathwayId;
writeSettings({ pathwayId: s.pathwayId });
}
var none = s.pathwayId === NONE;
var pathway = none ? null : (viewOf(s.pathwayId) || viewOf(DEFAULTS.pathwayId));
var blank = s.mode !== 'build';
var excluded = pathway ? (s.excluded[pathway.id] || []) : [];
var mastery = pathway ? masteryMap(pathway) : {};
var total = pathway ? pathway.order.length : 0;
var ctx = course && pathway ? courseContext(course, pathway.id) : null;
var modes = el('div', { class: 'mg-choices', role: 'group', 'aria-label': 'Chế độ chơi' },
MODES.map(function (m) {
var on = m.id === s.mode;
return el('button', {
type: 'button', class: 'mg-choice mg-choice--mode' + (on ? ' is-selected' : ''),
'aria-pressed': on, 'data-key': 'mode:' + m.id, title: m.text,
on: { click: function () { chooseMode(m.id); } }
},
el('span', { class: 'mg-choice__title', text: m.title }),
el('span', { class: 'mg-choice__text', text: m.text }));
}));
var formats = s.mode === 'type' || (pathway && !hasDrawnMolecules(pathway)) ? null : el('div', { class: 'mg-segmented', role: 'group', 'aria-label': 'Hiển thị các phân tử như sau:' },
FORMATS.map(function (f) {
var on = f.id === s.format;
return el('button', {
type: 'button', class: on ? 'is-active' : '', 'aria-pressed': on,
'data-key': 'format:' + f.id, on: { click: function () { chooseFormat(f.id); } }
}, f.label);
}));
var cofOn = s.cofactors !== false;
var cofToggle = el('button', {
type: 'button', class: 'mg-cof' + (cofOn ? ' is-on' : ''), 'aria-pressed': cofOn, 'data-key': 'cofactors:toggle',
'aria-label': 'Hỏi cả ATP, H₂O, NADH…: ' + (cofOn ? 'đang bật (sẽ hỏi trong quiz)' : 'đang tắt (chỉ hiển thị sẵn)'),
title: 'Hỏi cả ATP, H₂O, NADH… (Bật = app sẽ hỏi trong bài thi, Tắt = chỉ hiển thị sẵn trên bản đồ)',
on: { click: toggleCofactors }
}, el('span', { class: 'mg-cof__label', text: 'Hỏi cả ATP, H₂O, NADH…' }), el('span', { class: 'mg-cof__badge', text: cofOn ? 'Bật' : 'Tắt' }));
var tiles = pathway ? pathway.order.map(function (rid) {
var r = reactionById(pathway, rid);
return r ? tileFor(r, pathway, mastery, blank, excluded) : null;
}) : [];
var cols = tiles.length === 8 || tiles.length === 4 ? 4 : 5;
var grid = pathway
? el('div', { class: 'mg-tiles', style: { '--mg-cols': cols } }, tiles)
: el('div', { class: 'mg-empty', 'data-key': 'empty' },
el('p', { class: 'mg-empty__title', text: course ? 'Chưa chọn chặng nào' : 'Chưa chọn con đường nào' }),
el('p', { class: 'mg-empty__text', text: course ? 'Chạm vào một chặng để xem các bước.' : 'Chạm vào một con đường để xem các bước, hoặc chọn nhiều con đường để chơi chung một bản đồ.' }));
var isMix = !!pathway && !!MG.custom && MG.custom.isMix(pathway.id);
var everything = (!!pathway && !!pathway.hidden && !isMix) || isEverythingPicked(s) || (!!course && !!course.everything && s.pathwayId === course.everything);
var hint = pathway ? 'Mỗi thẻ dưới đây là một bước chuyển hóa, ấn vào để tìm hiểu thông tin về các bước chuyển hóa' : null;
var startLabel = none ? (course ? 'Chọn một chặng' : 'Chọn một con đường') : (everything ? 'Bắt đầu tất cả' : (ctx ? 'Bắt đầu chặng ' + (ctx.index + 1) : 'Bắt đầu Quiz'));
var scored = pathway ? hasHistory(pathway) : false;
var wipe = confirmButton('mg-history__link', 'Xóa lịch sử bước này', 'Chạm lần nữa để xác nhận xóa', function () {
if (!pathway) { return; }
clearHistory(pathway.id);
toast('Đã xóa lịch sử con đường này');
rerender('start');
});
wipe.node.setAttribute('data-key', 'history');
wipe.node.setAttribute('title', !pathway ? 'Chưa chọn con đường nào' : (scored ? 'Xóa điểm đã lưu của ' + total + ' bước ở trên' : 'Chưa có điểm nào được lưu cho các bước này'));
if (!scored) { wipe.node.disabled = true; }
var practice = weakPractice();
var practiceBtn = practice ? el('button', {
type: 'button', class: 'mg-btn mg-practice__btn', 'data-key': 'practice',
title: 'Một vòng ' + MODE_NAME[s.mode] + ' gồm ' + practice.steps.length + ' bước bạn hay làm sai nhất, từ mọi con đường',
on: { click: function () { startPractice(practice); } }
}, '⚡ Luyện tập các bước còn yếu (' + practice.steps.length + ')') : null;
var picks = pathway && (isMix || isEverythingPicked(s)) ? pickedPathways(s).length : 0;
var inQuiz = total - excluded.length;
var totalLine = picks > 1
? el('p', { class: 'mg-dock__total', 'data-key': 'total', 'aria-live': 'polite', text: picks + ' con đường, ' + inQuiz + ' bước' })
: null;
var dock = el('div', { class: 'mg-dock' },
totalLine,
el('div', { class: 'mg-dock__bar' },
el('button', { type: 'button', class: 'mg-btn mg-btn--primary', 'data-key': 'start', disabled: none, on: { click: startFromSelect } }, startLabel)));
var left = el('div', { class: 'mg-select__col' },
courseList().length ? el('div', { class: 'mg-section mg-section--course' }, el('p', { class: 'mg-label', text: 'Khóa học' }), courseStrip(course)) : null,
el('div', { class: 'mg-section mg-section--pathway' }, course ? sectionsBlock(course, s) : pathwayBlock(s)));
var modeDescriptions = {
build: 'Dựng từng bước: Dựng bản đồ từng bước, mỗi lần một câu hỏi.',
pick: 'Chọn đáp án: Bản đồ khuyết, chọn 1 trong 6 đáp án cho mỗi ô.',
type: 'Tự gõ: Bản đồ khuyết, tự gõ chính xác tên chất.'
};
var modeDesc = el('p', { class: 'mg-mode-desc', text: modeDescriptions[s.mode] || '' });
var right = el('div', { class: 'mg-select__col' },
el('div', { class: 'mg-section mg-section--mode' }, el('p', { class: 'mg-label', text: 'Chế độ' }), modes),
formats
? el('div', { class: 'mg-section mg-section--format' }, el('div', { class: 'mg-label-row' }, el('p', { class: 'mg-label', text: 'Hiển thị phân tử' }), cofToggle), formats)
: el('div', { class: 'mg-section mg-section--format' }, el('div', { class: 'mg-label-row mg-label-row--end' }, cofToggle)),
el('div', { class: 'mg-panel mg-panel--steps' },
hint ? el('p', { class: 'mg-hint mg-hint--top', text: hint }) : null,
grid),
practiceBtn,
dock,
el('div', { class: 'mg-history' }, wipe.node));
return el('section', { class: 'mg-screen mg-select' + (fresh ? ' is-entering' : '') },
el('header', { class: 'mg-select__head' }, brandTitle(), helpHeaderButton()),
el('div', { class: 'mg-select__body' }, left, right),
el('footer', { class: 'mg-select__foot' }, menuTools()));
}
function rerender(focusKey) {
if (current !== 'select') { return; }
var node = selectScreen(false);
setStage(node, 'select', true);
if (focusKey) {
var target = node.querySelector('[data-key="' + focusKey + '"]');
if (target) { target.focus({ preventScroll: true }); }
}
}
function startFromSelect() {
var s = readSettings();
if (s.pathwayId === NONE) {
toast(courseById(courseSel) ? 'Hãy chọn một chặng trước' : 'Hãy chọn một con đường trước');
return;
}
if (!quizReady()) {
toast('Chưa tải được phần quiz, hãy tải lại trang');
return;
}
var pathway = viewOf(s.pathwayId) || viewOf(DEFAULTS.pathwayId);
var out = s.excluded[pathway.id] || [];
var inQuiz = pathway.order.filter(function (id) { return out.indexOf(id) < 0; }).length;
if (s.mode === 'build' && inQuiz === 0) {
toast('Cần giữ ít nhất một bước trong bài');
return;
}
var course = courseById(courseSel);
var ctx = course ? courseContext(course, pathway.id) : null;
startQuiz(quizConfig(s, ctx), { course: ctx });
}
function settingRow(title, text, key) {
var on = !!readSettings()[key];
var sw = el('button', { type: 'button', class: 'mg-switch', role: 'switch', 'aria-checked': on, 'aria-label': title });
sw.addEventListener('click', function () {
on = !on;
sw.setAttribute('aria-checked', on ? 'true' : 'false');
var patch = {};
patch[key] = on;
writeSettings(patch);
if (key === 'sound' && on && MG.sound && typeof MG.sound.correct === 'function') { MG.sound.correct(); }
});
sw.setAttribute('title', text);
return el('div', { class: 'mg-setting', title: text },
el('div', {}, el('div', { class: 'mg-setting__title', text: title })),
sw);
}
function themeRow() {
var current = readSettings().theme;
var group = el('div', { class: 'mg-segmented mg-setting__seg', role: 'group', 'aria-label': 'Vẻ bề ngoài' });
[['light', 'Sáng'], ['dark', 'Tối'], ['auto', 'Tự động']].forEach(function (b) {
var btn = el('button', {
type: 'button', class: current === b[0] ? 'is-active' : '', 'aria-pressed': current === b[0], 'data-key': 'theme:' + b[0], text: b[1]
});
btn.addEventListener('click', function () {
setTheme(b[0]);
Array.prototype.forEach.call(group.childNodes, function (n) {
var on = n === btn;
n.className = on ? 'is-active' : '';
n.setAttribute('aria-pressed', on ? 'true' : 'false');
});
});
group.appendChild(btn);
});
return el('div', { class: 'mg-setting mg-setting--stack', title: 'Giao diện sáng hoặc tối. Tự động theo thiết bị.' },
el('div', {}, el('div', { class: 'mg-setting__title', text: 'Giao diện' })),
group);
}
function packAvailable() {
if (!MG.packs || typeof MG.packs.hasContent !== 'function' || !MG.packs.hasContent()) { return false; }
return !(MG.store && typeof MG.store.persists === 'function' && !MG.store.persists());
}
function packRow() {
if (!packAvailable()) { return null; }
return settingRow('Chế độ nâng cao', 'Thêm cell signaling, photosynthesis, nitrogen và nucleotides, kèm các games và kịch bản ATP. Trang sẽ tải lại khi thay đổi.', 'advanced');
}
function openSettings(o) {
ensure();
var inQuiz = !!(o && o.inQuiz);
var handle = null;
var packAtOpen = !!readSettings().advanced;
var wipe = confirmButton('mg-btn mg-btn--danger mg-btn--block', 'Xóa tất cả lịch sử', 'Chạm lần nữa để xóa toàn bộ điểm', function () {
clearHistory(null);
toast('Đã xóa lịch sử');
if (handle) { handle.close(); }
});
var body = el('div', { class: 'mg-settings' },
inQuiz ? el('p', { class: 'mg-settings__note', text: 'Một số thay đổi sẽ áp dụng từ bài quiz tiếp theo.' }) : null,
themeRow(),
settingRow('Hiện nhãn ô khuyết', 'Hiển thị chú thích nhỏ như enzyme, in và out trên các ô khuyết.', 'showSlotLabels'),
settingRow('Cho trước phân tử đầu tiên', 'Các chế độ bản đồ trống sẽ điền sẵn phân tử đầu tiên.', 'givenStart'),
settingRow('Âm thanh', 'Âm báo nhẹ khi trả lời đúng và nhạc kết thúc khi hoàn thành pathway.', 'sound'),
inQuiz ? null : packRow(),
el('div', { class: 'mg-setting mg-setting--stack', title: 'Xóa mọi điểm số và kết quả khóa học trên thiết bị này. Xóa lịch sử dưới các bước chỉ xóa một con đường.' },
el('div', {}, el('div', { class: 'mg-setting__title', text: 'Xóa tất cả lịch sử' })),
wipe.node));
handle = modal({
title: 'Cài đặt', body: body,
onClose: function () {
wipe.disarm();
if (!inQuiz && !!readSettings().advanced !== packAtOpen && root.location && typeof root.location.reload === 'function') {
root.location.reload();
return;
}
if (current === 'select') { rerender(); }
if (o && typeof o.onClose === 'function') { o.onClose(readSettings()); }
}
});
return handle;
}
function startQuiz(config, opts) {
ensure();
if (!quizReady()) {
toast('Chưa tải được phần quiz, hãy tải lại trang');
return;
}
var o = opts || {};
lastConfig = config;
lastStart = { config: config, course: o.course || null, practice: o.practice || null };
quizToken += 1;
var token = quizToken;
var section = el('section', { class: 'mg-screen mg-screen--quiz' });
setStage(section, 'quiz', false, { route: 'quiz/' + encodeURIComponent(config.pathwayId || '') });
var entry = { token: token, ctl: null, course: o.course || null, returnTo: o.returnTo || null };
activeQuiz = entry;
var hooks = {
onExit: function () {
if (token !== quizToken) { return; }
if (config.review && entry.returnTo) { showResults(entry.returnTo.summary, entry.returnTo.course); }
else { showSelect(); }
},
onSettings: function (done) { openSettings({ inQuiz: true, onClose: done }); },
onFinish: function (summary) { if (token === quizToken) { showResults(summary, entry.course); } },
onReview: function () {
if (token !== quizToken) { return; }
var back = entry.returnTo;
reviewMap(back ? back.summary : null, back ? back.course : null);
}
};
try {
entry.ctl = MG.quiz.mount(section, config, hooks) || null;
} catch (err) {
console.error(err);
toast('Không thể bắt đầu quiz');
showSelect();
return;
}
if (activeQuiz !== entry) { destroyCtl(entry.ctl); }
}
function showSelect() {
ensure();
setStage(selectScreen(true), 'select');
}
function showCourse(courseId, pathwayId) {
ensure();
var c = courseById(courseId);
if (!c) { showSelect(); return; }
setCourseSelection(c.id);
if (pathwayId && c.sections.indexOf(pathwayId) >= 0) { writeSettings({ pathwayId: pathwayId }); }
showSelect();
}
function showAtp() {
ensure();
if (!MG.atpUi || !MG.atp) {
toast('Chưa tải được Bộ tính ATP');
return;
}
var section = el('section', { class: 'mg-screen mg-screen--atp' });
setStage(section, 'atp');
quizToken += 1;
var entry = { token: quizToken, ctl: null, course: null, returnTo: null };
activeQuiz = entry;
entry.ctl = MG.atpUi.mount(section, {
onExit: function () { if (entry.token === quizToken) { showSelect(); } }
});
if (activeQuiz !== entry) { destroyCtl(entry.ctl); }
}
function showGames() {
ensure();
if (!MG.gamesUi || !MG.gameEngine || !MG.gameEngine.games().length) {
toast('Chưa tải được bài trắc nghiệm');
return;
}
var section = el('section', { class: 'mg-screen mg-screen--games' });
setStage(section, 'games');
quizToken += 1;
var entry = { token: quizToken, ctl: null, course: null, returnTo: null };
activeQuiz = entry;
entry.ctl = MG.gamesUi.mount(section, {
onExit: function () { if (entry.token === quizToken) { showSelect(); } }
});
if (activeQuiz !== entry) { destroyCtl(entry.ctl); }
}
function showDraw() {
ensure();
if (!MG.drawUi || !MG.draw || !MG.renderMoleculeEx || !MG.draw.molecules().length) {
toast('Chưa tải được mô-đun Vẽ phân tử');
return;
}
var section = el('section', { class: 'mg-screen mg-screen--draw' });
setStage(section, 'draw');
quizToken += 1;
var entry = { token: quizToken, ctl: null, course: null, returnTo: null };
activeQuiz = entry;
entry.ctl = MG.drawUi.mount(section, {
onExit: function () { if (entry.token === quizToken) { showSelect(); } }
});
if (activeQuiz !== entry) { destroyCtl(entry.ctl); }
}
function drawOpenButton() {
if (!MG.drawUi || !MG.draw || !MG.renderMoleculeEx || !MG.draw.molecules().length) { return null; }
return el('button', {
type: 'button', class: 'mg-btn mg-btn--ghost mg-draw-open', 'data-key': 'draw:open', on: { click: showDraw }
}, 'Vẽ phân tử');
}
function gamesOpenButton() {
if (!MG.gamesUi || !MG.gameEngine || !MG.gameEngine.games().length) { return null; }
return el('button', {
type: 'button', class: 'mg-btn mg-btn--ghost mg-games-open', 'data-key': 'games:open', on: { click: showGames }
}, 'So sánh & Cơ chế');
}
function howToPlay() {
var points = [
['Chọn một con đường', 'Mở một nhóm, chạm vào một con đường, sau đó nhấn Bắt đầu Quiz.'],
['Điền vào ô trống', 'Mỗi ô nét đứt trên bản đồ là một ô trống: một phân tử, một enzyme hoặc một cofactor. Thẻ màu vàng hỏi từng ô một.'],
['Bí câu hỏi?', 'Gợi ý đưa ra manh mối mà không làm lộ đáp án. Hiện đáp án sẽ hiển thị đáp án và tính là một lỗi sai.'],
['Ba cách chơi', 'Xây dựng (Build) dựng dần bản đồ khi bạn trả lời. Điền vào bản đồ và Điền vào chỗ trống bắt đầu với bản đồ trống; trong Điền vào chỗ trống bạn tự gõ từng câu trả lời.']
];
return modal({
title: 'Cách chơi',
body: el('ol', { class: 'mg-howto' }, points.map(function (p) {
return el('li', {}, el('strong', { text: p[0] }), el('span', { text: p[1] }));
}))
});
}
var BOB_MS = 3400;
var bobStart = 0;
function brandTitle() {
var b = MG.brand;
if (!b || !b.mascot || !b.titleSvg) { return el('h1', { class: 'mg-title', text: 'Bài kiểm tra lộ trình' }); }
if (!bobStart) { bobStart = Date.now(); }
var mascot = el('img', { class: 'mg-brand__mascot', src: b.mascot, alt: '', 'aria-hidden': 'true', width: 96, height: 95, draggable: 'false' });
mascot.style.animationDelay = '-' + ((Date.now() - bobStart) % BOB_MS) + 'ms';
return el('h1', { class: 'mg-title mg-brand' },
mascot,
el('span', { class: 'mg-brand__text', html: b.titleSvg }),
el('span', { class: 'mg-brand__sr', text: 'Bài kiểm tra lộ trình' }));
}
function introStrip() {
return null;
}
function helpHeaderButton() {
return el('button', {
type: 'button', class: 'mg-btn mg-btn--icon mg-help-icon', 'data-key': 'help:open',
'aria-label': 'Cách chơi', title: 'Cách chơi', on: { click: howToPlay }
}, '?');
}
function helpButton() {
return el('button', {
type: 'button', class: 'mg-btn mg-btn--ghost mg-help-open', 'data-key': 'help:open', on: { click: howToPlay }
}, 'Cách chơi');
}
function advancedButton() {
if (!packAvailable()) { return null; }
var on = !!readSettings().advanced;
return el('button', {
type: 'button', class: 'mg-btn mg-btn--ghost mg-advanced-open' + (on ? ' is-on' : ''), 'aria-pressed': on ? 'true' : 'false',
'data-key': 'advanced:open', on: { click: advancedDialog }
}, on ? 'Nâng cao: bật' : 'Nâng cao');
}
function advancedDialog() {
var on = !!readSettings().advanced;
var handle = modal({
title: 'Chế độ nâng cao',
body: el('div', { class: 'mg-advanced' },
el('p', { class: 'mg-advanced__text', text: 'Quang hợp, truyền tín hiệu tế bào và nucleotide có các bài quiz riêng; mục “Tất cả” tập hợp mọi con đường chuyển hóa.' }),
el('button', {
type: 'button', class: 'mg-btn mg-btn--primary', 'data-key': 'advanced:toggle',
on: { click: function () {
writeSettings({ advanced: !on });
handle.close();
if (root.location && typeof root.location.reload === 'function') { root.location.reload(); }
} }
}, on ? 'Tắt' : 'Bật'))
});
return handle;
}
function menuTools() {
return el('div', { class: 'mg-select__tools' }, atpOpenButton(), drawOpenButton(), gamesOpenButton(), advancedButton());
}
function atpOpenButton() {
if (!MG.atpUi || !MG.atp) { return null; }
return el('button', {
type: 'button', class: 'mg-btn mg-btn--ghost mg-atp-open', 'data-key': 'atp:open', on: { click: showAtp }
}, 'Bộ tính ATP');
}
function percentOf(sum) {
var right = num(sum.right), wrong = num(sum.wrong), answered = right + wrong;
return answered ? Math.round((100 * right) / answered) : 100;
}
function ring(pct) {
var r = 46, c = 2 * Math.PI * r;
var svg = '<svg viewBox="0 0 120 120" aria-hidden="true" focusable="false">' +
'<circle class="mg-ring__edge" cx="60" cy="60" r="' + r + '" fill="none" stroke-width="24"/>' +
'<circle class="mg-ring__track" cx="60" cy="60" r="' + r + '" fill="none" stroke-width="16"/>' +
'<circle class="mg-ring__arc" cx="60" cy="60" r="' + r + '" fill="none" stroke="' + masteryColor(pct) + '" stroke-width="16"' +
' stroke-dasharray="' + (c * pct / 100).toFixed(2) + ' ' + c.toFixed(2) + '"' +
' transform="rotate(-90 60 60)"/></svg>';
return el('div', { class: 'mg-ring', role: 'img', 'aria-label': 'Sự chính xác ' + pct + ' phần trăm' },
el('div', { class: 'mg-ring__art', html: svg }),
el('span', { class: 'mg-ring__value', text: pct + '%' }));
}
function stat(iconName, value, label, cls) {
return el('div', { class: 'mg-stat' + (cls ? ' ' + cls : '') },
el('span', { class: 'mg-stat__value' }, iconName ? icon(iconName) : null, el('span', { text: value })),
el('span', { class: 'mg-stat__label', text: label }));
}
function missedText(m, pathwayId) {
var name = m.answerLabel || m.answerId || '?';
var word = KIND_WORD[m.kind] || 'item';
var rec = pathwayId && MG.pathways ? MG.pathways[pathwayId] : null;
var rx = rec && m.rxnId ? rec.reactions.filter(function (r) { return r.id === m.rxnId; })[0] : null;
if (m.kind === 'enz' && rx && rx.terms && rx.terms.enz) { word = rx.terms.enz; }
else if (m.kind === 'enz' && rec && rec.terms && rec.terms.enz) { word = rec.terms.enz; }
var noReaction = m.rxnId === null || m.rxnId === undefined;
if (typeof m.stepLabel === 'string' && m.stepLabel.trim() !== '') {
return noReaction ? m.stepLabel + ': ' + name : m.stepLabel + ' ' + word + ': ' + name;
}
var where;
if (noReaction) { where = 'Bắt đầu'; }
else if (typeof m.step === 'number') { where = 'Bước ' + m.step; }
else if (m.step === 'Link') { where = 'Phản ứng nối'; }
else { where = 'Bước'; }
return where + ' ' + word + ': ' + name;
}
function missedRow(m, pathwayId) {
var kind = DETAIL_KIND[m.kind] || 'molecule';
return el('li', {},
el('button', {
type: 'button', class: 'mg-missed__item',
on: { click: function () { detailCard(kind, m.answerId, { rxnId: m.rxnId, pathwayId: pathwayId }); } }
}, icon('badge-cross'), el('span', { text: missedText(m, pathwayId) })));
}
function courseDoneCard(course) {
var rows = course.sections.map(function (pid, i) {
var p = pathwayById(pid);
var pct = runPct(course.id, pid);
return el('li', { class: 'mg-course-done__row' },
el('span', { text: (i + 1) + '. ' + (p ? p.title : humanize(pid)) }),
el('span', { class: 'mg-course-done__pct', text: pct === null ? 'chưa học' : pct + ' %' }));
});
return el('section', { class: 'mg-card mg-card--question mg-results__card' },
el('h2', { class: 'mg-results__heading', text: 'Hoàn thành khóa học' }),
el('p', { class: 'mg-results__hint', text: course.title + ': độ chính xác ở từng phần.' }),
el('ul', { class: 'mg-course-done' }, rows));
}
function resultsScreen(sum, course) {
var right = num(sum.right), wrong = num(sum.wrong);
var pct = percentOf(sum);
var pathway = pathwayById(sum.pathwayId);
var courseObj = course ? courseById(course.id) : null;
var all = !!course && course.all === true;
var last = !!courseObj && !all && course.index >= courseObj.sections.length - 1;
var nextId = courseObj && !last && !all ? courseObj.sections[course.index + 1] : null;
var nextPath = nextId ? pathwayById(nextId) : null;
var secTitle = sum.title || (pathway && pathway.title) || 'Trắc nghiệm';
var mode = MODE_NAME[sum.mode] ? sum.mode : (lastConfig && MODE_NAME[lastConfig.mode] ? lastConfig.mode : 'build');
var format = lastConfig && FORMAT_NAME[lastConfig.format] ? lastConfig.format : readSettings().format;
var formatLabel = FORMATS.filter(function (f) { return f.id === format; })[0];
var modeText = 'Chế độ: ' + MODE_NAME[mode] + (mode === 'type' || (pathway && !hasDrawnMolecules(pathway)) || !formatLabel ? '' : ', ' + formatLabel.label);
var title = last ? courseObj.title + ' hoàn thành' : secTitle + ' hoàn thành';
var sub = !courseObj ? modeText
: (all ? 'Toàn bộ các phần của ' + courseObj.title + '. ' : last ? 'Phần cuối cùng: ' + secTitle + '. ' : 'Phần ' + (course.index + 1) + ' trên ' + courseObj.sections.length + ' trong ' + courseObj.title + '. ') + modeText;
var verdict = pct >= 90 ? 'Làm tốt lắm!' : (pct >= 70 ? 'Tiến bộ tốt.' : 'Hãy tiếp tục cố gắng. Những bước làm sai sẽ là bài học tiếp theo của bạn.');
var missed = (Array.isArray(sum.missed) ? sum.missed : []).concat(Array.isArray(sum.retried) ? sum.retried : []);
var missedCard = el('section', { class: 'mg-card mg-card--option' },
el('h2', { class: 'mg-results__heading', text: 'Cần xem lại' }),
missed.length
? [el('p', { class: 'mg-results__hint', text: 'Chạm vào một mục để xem thông tin chi tiết.' }),
el('ul', { class: 'mg-missed' }, missed.map(function (m) { return missedRow(m, sum.pathwayId); }))]
: el('p', { class: 'mg-results__none', text: 'Không còn gì cần xem lại. Làm tốt lắm!' }));
var lines = Array.isArray(sum.lines) ? sum.lines : (pathway && Array.isArray(pathway.summary) ? pathway.summary : []);
var linesCard = lines.length ? el('section', { class: 'mg-card mg-card--question' },
el('h2', { class: 'mg-results__heading', text: 'Ghi nhớ' }),
el('ul', { class: 'mg-bullets' }, lines.map(function (t) { return el('li', { text: t }); }))) : null;
var sideCards = [linesCard, last ? courseDoneCard(courseObj) : null, missedCard];
var lead;
if (nextPath) {
lead = el('button', { type: 'button', class: 'mg-btn mg-btn--primary', on: { click: function () { nextSection(course, mode); } } },
'Chặng tiếp theo: ' + nextPath.title);
} else if (last) {
lead = el('button', { type: 'button', class: 'mg-btn mg-btn--primary', on: { click: function () { showCourse(courseObj.id, sum.pathwayId); } } },
'Tổng quan khóa học');
} else {
lead = el('button', { type: 'button', class: 'mg-btn mg-btn--primary', on: { click: playAgain } }, 'Chơi lại');
}
var againBtn = nextPath || last ? el('button', { type: 'button', class: 'mg-btn', on: { click: playAgain } }, 'Chơi lại') : null;
var harder = HARDER[mode] ? el('button', {
type: 'button', class: 'mg-btn',
on: { click: function () { harderMode(mode, course, sum.pathwayId); } }
}, 'Thử chế độ khó hơn') : null;
var again = missedSteps(sum);
var practiceBtn = again.length ? el('button', {
type: 'button', class: 'mg-btn mg-practice__btn', 'data-key': 'practice',
title: 'Vòng luyện tập ' + MODE_NAME[mode] + ' gồm ' + again.length + ' bước bạn đã làm sai',
on: { click: function () { startPractice({ pathwayId: sum.pathwayId, steps: again }); } }
}, 'Luyện tập các bước đã sai') : null;
var reviewBtn = el('button', { type: 'button', class: 'mg-btn mg-btn--ghost', on: { click: function () { reviewMap(sum, course); } } }, 'Xem lại bản đồ');
var overview = courseObj && !last ? el('button', {
type: 'button', class: 'mg-btn mg-btn--ghost',
on: { click: function () { showCourse(courseObj.id, sum.pathwayId); } }
}, 'Tổng quan khóa học') : null;
var back = el('button', { type: 'button', class: 'mg-btn mg-btn--ghost mg-btn--wide', on: { click: function () { showSelect(); } } }, 'Về menu');
var actions = el('div', { class: 'mg-results__actions' }, lead, againBtn, harder, practiceBtn, reviewBtn, overview, back);
var score = el('section', { class: 'mg-card mg-card--option mg-score', 'aria-label': 'Điểm' },
ring(pct),
el('div', { class: 'mg-stats' },
stat('badge-check', String(right), 'đúng', 'mg-stat--right'),
stat('badge-cross', String(wrong), 'sai', 'mg-stat--wrong'),
stat(null, clock(sum.elapsed), 'thời gian'),
stat(null, String(num(sum.hints)), 'gợi ý'),
num(sum.revealed) ? stat(null, String(num(sum.revealed)), 'đã hiện đáp án') : null));
return el('section', { class: 'mg-screen mg-results is-entering' },
el('header', { class: 'mg-results__head' },
el('h1', { class: 'mg-title', text: title }),
el('p', { class: 'mg-subtitle', text: sub }),
el('p', { class: 'mg-results__verdict', text: verdict })),
el('div', { class: 'mg-results__body' },
el('div', { class: 'mg-results__main' }, score, actions),
el('div', { class: 'mg-results__side' }, sideCards)));
}
function showResults(summary, course) {
ensure();
var sum = summary || {};
if (course && !course.all && sum.pathwayId) { recordRun(course.id, sum.pathwayId, percentOf(sum)); }
lastResult = { summary: sum, course: course || null };
setStage(resultsScreen(sum, course || null), 'results', false, { route: 'results', summary: sum, course: course || null });
}
function playAgain() {
var base = lastStart ? lastStart.config : quizConfig(readSettings(), null);
var ctx = lastStart ? lastStart.course : null;
startQuiz(assign(assign({}, base), { seed: randomSeed(), review: false }), { course: ctx });
}
function harderMode(fromMode, course, pathwayId) {
var next = HARDER[fromMode];
if (!next) { return; }
var patch = { mode: next };
var practice = lastStart && lastStart.practice && lastStart.practice.pathwayId === pathwayId ? lastStart.practice : null;
if (!practice && pathwayId && pathwayById(pathwayId)) { patch.pathwayId = pathwayId; }
writeSettings(patch);
startQuiz(quizConfig(readSettings(), course || null, practice), { course: course || null, practice: practice });
}
function nextSection(course, mode) {
var c = course ? courseById(course.id) : null;
if (!c || course.index + 1 >= c.sections.length) { return; }
var pid = c.sections[course.index + 1];
var fmt = lastConfig && FORMAT_NAME[lastConfig.format] ? lastConfig.format : readSettings().format;
var mo = MODE_NAME[mode] ? mode : readSettings().mode;
setCourseSelection(c.id);
writeSettings({ pathwayId: pid, mode: mo, format: fmt });
var ctx = { id: c.id, index: course.index + 1 };
startQuiz(quizConfig(readSettings(), ctx), { course: ctx });
}
function reviewMap(summary, course) {
var base = lastStart ? lastStart.config : quizConfig(readSettings(), null);
var ctx = course || (lastStart ? lastStart.course : null);
var returnTo = summary ? { summary: summary, course: course || null } : null;
startQuiz(assign(assign({}, base), { review: true, seed: randomSeed() }), { course: ctx, returnTo: returnTo });
}
MG.ui = {
el: el,
icon: icon,
modal: modal,
toast: toast,
detailCard: detailCard,
masteryColor: masteryColor
};
MG.app = {
start: start,
showSelect: showSelect,
showCourse: function (courseId) { showCourse(courseId, null); },
showAtp: showAtp,
showGames: showGames,
showDraw: showDraw,
showResults: showResults,
startQuiz: startQuiz,
openSettings: openSettings,
_test: {
pathwayGroups: pathwayGroups,
sectionAverage: sectionAverage,
ecClassName: ecClassName,
classLabel: classLabel,
familyLabel: familyLabel,
humanize: humanize,
courseById: courseById,
courseList: courseList,
courseContext: courseContext,
isCourseEverything: isCourseEverything,
missedText: missedText,
clearHistory: clearHistory,
hasHistory: hasHistory,
weakPractice: weakPractice,
missedSteps: missedSteps,
quizConfig: quizConfig,
recordRun: recordRun,
runPct: runPct,
viewOf: viewOf,
setCourseSelection: setCourseSelection,
pickedPathways: pickedPathways,
menuPathwayIds: menuPathwayIds,
everythingTarget: everythingTarget,
isEverythingPicked: isEverythingPicked,
setPicked: setPicked,
choosePathway: choosePathway,
chooseEverything: chooseEverything,
chooseSection: chooseSection,
chooseCourse: chooseCourse,
startFromSelect: startFromSelect,
toggleGroup: toggleGroup,
toggleTab: toggleTab,
resolveTheme: resolveTheme,
applyTheme: applyTheme,
setTheme: setTheme,
openTabs: function (value) { if (value !== undefined) { openTabs = value; } return openTabs; },
closeAllModals: closeAllModals,
goBack: goBack,
navStack: function () { return navStack.slice(); }
}
};
})(typeof window !== 'undefined' ? window : globalThis);

(function (root) {
'use strict';
if (root && root.__MG_NO_BOOT__) { return; }
if (window.MG && MG.app) { MG.app.start(document.getElementById('app')); }
		if (window.MG && MG.brand) {
			var icon = document.createElement('link');
			icon.rel = 'icon';
			icon.href = MG.brand.mascot;
			document.head.appendChild(icon);
		}
})(typeof window !== 'undefined' ? window : globalThis);
