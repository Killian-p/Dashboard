import './index.css';

const AnimatedSvg = () => {
  
  return (
    <svg id='logo' width='1024' height='150' viewBox="-2 -2 1024 150" fill='none'>
      <path stroke='black' stroke-width={10} d="M4.96251 142C3.62917 142 2.49584 141.533 1.56251 140.6C0.629173 139.667 0.162506 138.533 0.162506 137.2V7.00001C0.162506 5.53333 0.562506 4.33333 1.36251 3.4C2.29584 2.46667 3.49584 2 4.96251 2H53.7625C92.9625 2 112.963 20.1333 113.763 56.4C114.029 64.1333 114.163 69.3333 114.163 72C114.163 74.5333 114.029 79.6667 113.763 87.4C113.229 106.067 108.229 119.867 98.7625 128.8C89.2958 137.6 74.6292 142 54.7625 142H4.96251ZM53.7625 119C64.9625 119 73.0292 116.533 77.9625 111.6C82.8958 106.533 85.4958 98.2667 85.7625 86.8C86.0292 78.8 86.1625 73.8 86.1625 71.8C86.1625 69.6667 86.0292 64.7333 85.7625 57C85.4958 46.0667 82.6958 38 77.3625 32.8C72.1625 27.6 63.9625 25 52.7625 25H27.9625V119H53.7625Z" fill="none"/>
      <path stroke='black' stroke-width={10} d="M168.588 144C161.788 144 155.521 142.667 149.788 140C144.188 137.2 139.721 133.467 136.388 128.8C133.188 124.133 131.588 119 131.588 113.4C131.588 104.333 135.254 97 142.588 91.4C149.921 85.8 159.988 82 172.788 80L200.188 76V71.8C200.188 65.9333 198.721 61.5333 195.788 58.6C192.854 55.6667 188.121 54.2 181.588 54.2C177.188 54.2 173.588 55.0667 170.788 56.8C168.121 58.4 165.988 60 164.388 61.6C162.788 63.3333 161.721 64.4667 161.188 65C160.654 66.6 159.654 67.4 158.188 67.4H142.788C141.588 67.4 140.521 67 139.588 66.2C138.788 65.4 138.388 64.3333 138.388 63C138.521 59.6667 140.121 55.8667 143.188 51.6C146.388 47.3333 151.254 43.6667 157.788 40.6C164.321 37.5333 172.321 36 181.788 36C197.521 36 208.988 39.5333 216.188 46.6C223.388 53.6667 226.988 62.9333 226.988 74.4V137.2C226.988 138.533 226.521 139.667 225.588 140.6C224.788 141.533 223.654 142 222.188 142H205.988C204.654 142 203.521 141.533 202.588 140.6C201.654 139.667 201.188 138.533 201.188 137.2V129.4C198.254 133.667 194.054 137.2 188.588 140C183.254 142.667 176.588 144 168.588 144ZM175.388 125C182.721 125 188.721 122.6 193.388 117.8C198.054 113 200.388 106 200.388 96.8V92.6L180.388 95.8C172.654 97 166.788 98.9333 162.788 101.6C158.921 104.267 156.988 107.533 156.988 111.4C156.988 115.667 158.788 119 162.388 121.4C165.988 123.8 170.321 125 175.388 125Z" fill="none"/>
      <path stroke='black' stroke-width={10} d="M292.045 144C282.045 144 273.645 142.533 266.845 139.6C260.045 136.533 254.979 133 251.645 129C248.445 124.867 246.845 121.333 246.845 118.4C246.845 117.067 247.312 116 248.245 115.2C249.179 114.4 250.245 114 251.445 114H267.245C268.445 114 269.445 114.467 270.245 115.4C270.779 115.8 272.179 117 274.445 119C276.712 121.133 279.379 122.8 282.445 124C285.512 125.2 288.912 125.8 292.645 125.8C297.979 125.8 302.379 124.733 305.845 122.6C309.312 120.467 311.045 117.533 311.045 113.8C311.045 111 310.245 108.733 308.645 107C307.179 105.267 304.445 103.733 300.445 102.4C296.445 100.933 290.512 99.4 282.645 97.8C271.312 95.4 262.912 91.7333 257.445 86.8C252.112 81.8667 249.445 75.3333 249.445 67.2C249.445 61.8667 251.045 56.8667 254.245 52.2C257.445 47.4 262.179 43.5333 268.445 40.6C274.845 37.5333 282.445 36 291.245 36C300.179 36 307.912 37.4667 314.445 40.4C320.979 43.2 325.912 46.6 329.245 50.6C332.712 54.4667 334.445 57.9333 334.445 61C334.445 62.2 333.979 63.2667 333.045 64.2C332.245 65 331.245 65.4 330.045 65.4H315.245C314.179 65.4 313.045 64.9333 311.845 64C310.912 63.3333 309.445 62.0667 307.445 60.2C305.445 58.3333 303.112 56.8667 300.445 55.8C297.779 54.7333 294.645 54.2 291.045 54.2C286.112 54.2 282.245 55.2667 279.445 57.4C276.779 59.5333 275.445 62.3333 275.445 65.8C275.445 68.3333 276.112 70.4 277.445 72C278.779 73.6 281.379 75.1333 285.245 76.6C289.112 78.0667 294.912 79.5333 302.645 81C315.445 83.5333 324.579 87.4667 330.045 92.8C335.645 98.1333 338.445 104.667 338.445 112.4C338.445 121.733 334.379 129.333 326.245 135.2C318.112 141.067 306.712 144 292.045 144Z" fill="none"/>
      <path stroke='black' stroke-width={10} d="M364.091 142C362.757 142 361.624 141.533 360.691 140.6C359.757 139.667 359.291 138.533 359.291 137.2V4.8C359.291 3.33333 359.757 2.2 360.691 1.40001C361.624 0.466669 362.757 0 364.091 0H381.891C383.357 0 384.491 0.466669 385.291 1.40001C386.224 2.2 386.691 3.33333 386.691 4.8V50.4C394.691 40.8 405.491 36 419.091 36C431.357 36 441.157 40.0667 448.491 48.2C455.824 56.2 459.491 67.1333 459.491 81V137.2C459.491 138.533 459.024 139.667 458.091 140.6C457.291 141.533 456.157 142 454.691 142H436.691C435.357 142 434.224 141.533 433.291 140.6C432.357 139.667 431.891 138.533 431.891 137.2V82.2C431.891 74.3333 429.957 68.2667 426.091 64C422.357 59.6 416.891 57.4 409.691 57.4C402.624 57.4 397.024 59.6 392.891 64C388.757 68.4 386.691 74.4667 386.691 82.2V137.2C386.691 138.533 386.224 139.667 385.291 140.6C384.491 141.533 383.357 142 381.891 142H364.091Z" fill="none"/>
      <path stroke='black' stroke-width={10} d="M542.472 144C528.739 144 518.072 139.267 510.472 129.8V137.2C510.472 138.533 510.005 139.667 509.072 140.6C508.272 141.533 507.139 142 505.672 142H489.872C488.539 142 487.405 141.533 486.472 140.6C485.539 139.667 485.072 138.533 485.072 137.2V4.8C485.072 3.33333 485.539 2.2 486.472 1.40001C487.405 0.466669 488.539 0 489.872 0H506.872C508.339 0 509.472 0.466669 510.272 1.40001C511.205 2.2 511.672 3.33333 511.672 4.8V49.2C519.272 40.4 529.539 36 542.472 36C555.939 36 566.272 40.4 573.472 49.2C580.672 58 584.539 69.4 585.072 83.4C585.205 85 585.272 87.1333 585.272 89.8C585.272 92.6 585.205 94.8 585.072 96.4C584.539 110.8 580.672 122.333 573.472 131C566.272 139.667 555.939 144 542.472 144ZM535.072 122.6C549.472 122.6 557.139 113.733 558.072 96C558.205 94.6667 558.272 92.6667 558.272 90C558.272 87.3333 558.205 85.3333 558.072 84C557.139 66.2667 549.472 57.4 535.072 57.4C527.605 57.4 521.872 59.8 517.872 64.6C514.005 69.2667 511.939 74.9333 511.672 81.6L511.472 89.2L511.672 97C512.072 104.2 514.139 110.267 517.872 115.2C521.605 120.133 527.339 122.6 535.072 122.6Z" fill="none"/>
      <path stroke='black' stroke-width={10} d="M653.528 144C637.928 144 625.861 140 617.328 132C608.795 123.867 604.195 112.8 603.528 98.8L603.328 90L603.528 81.2C604.195 67.3333 608.861 56.3333 617.528 48.2C626.195 40.0667 638.195 36 653.528 36C668.861 36 680.861 40.0667 689.528 48.2C698.195 56.3333 702.861 67.3333 703.528 81.2C703.661 82.8 703.728 85.7333 703.728 90C703.728 94.2667 703.661 97.2 703.528 98.8C702.861 112.8 698.261 123.867 689.728 132C681.195 140 669.128 144 653.528 144ZM653.528 124.2C660.595 124.2 666.061 122 669.928 117.6C673.795 113.067 675.928 106.467 676.328 97.8C676.461 96.4667 676.528 93.8667 676.528 90C676.528 86.1333 676.461 83.5333 676.328 82.2C675.928 73.5333 673.795 67 669.928 62.6C666.061 58.0667 660.595 55.8 653.528 55.8C646.461 55.8 640.995 58.0667 637.128 62.6C633.261 67 631.128 73.5333 630.728 82.2L630.528 90L630.728 97.8C631.128 106.467 633.261 113.067 637.128 117.6C640.995 122 646.461 124.2 653.528 124.2Z" fill="none"/>
      <path stroke='black' stroke-width={10} d="M756.087 144C749.287 144 743.021 142.667 737.288 140C731.688 137.2 727.221 133.467 723.887 128.8C720.687 124.133 719.087 119 719.087 113.4C719.087 104.333 722.754 97 730.087 91.4C737.421 85.8 747.488 82 760.288 80L787.688 76V71.8C787.688 65.9333 786.221 61.5333 783.288 58.6C780.354 55.6667 775.621 54.2 769.087 54.2C764.687 54.2 761.088 55.0667 758.288 56.8C755.621 58.4 753.487 60 751.887 61.6C750.287 63.3333 749.221 64.4667 748.688 65C748.154 66.6 747.154 67.4 745.688 67.4H730.288C729.088 67.4 728.021 67 727.087 66.2C726.287 65.4 725.887 64.3333 725.887 63C726.021 59.6667 727.621 55.8667 730.688 51.6C733.888 47.3333 738.754 43.6667 745.288 40.6C751.821 37.5333 759.821 36 769.288 36C785.021 36 796.488 39.5333 803.688 46.6C810.888 53.6667 814.488 62.9333 814.488 74.4V137.2C814.488 138.533 814.021 139.667 813.087 140.6C812.287 141.533 811.154 142 809.688 142H793.488C792.154 142 791.021 141.533 790.087 140.6C789.154 139.667 788.688 138.533 788.688 137.2V129.4C785.754 133.667 781.554 137.2 776.087 140C770.754 142.667 764.087 144 756.087 144ZM762.887 125C770.221 125 776.221 122.6 780.887 117.8C785.554 113 787.887 106 787.887 96.8V92.6L767.887 95.8C760.154 97 754.288 98.9333 750.288 101.6C746.421 104.267 744.488 107.533 744.488 111.4C744.488 115.667 746.287 119 749.887 121.4C753.487 123.8 757.821 125 762.887 125Z" fill="none"/>
      <path stroke='black' stroke-width={10} d="M844.945 142C843.612 142 842.479 141.533 841.545 140.6C840.612 139.667 840.145 138.533 840.145 137.2V43C840.145 41.6667 840.612 40.5333 841.545 39.6C842.479 38.5333 843.612 38 844.945 38H861.145C862.612 38 863.812 38.4667 864.745 39.4C865.679 40.3333 866.145 41.5333 866.145 43V51.2C869.345 46.9333 873.345 43.6667 878.145 41.4C883.079 39.1333 888.679 38 894.945 38H903.145C904.612 38 905.745 38.4667 906.545 39.4C907.479 40.2 907.945 41.3333 907.945 42.8V57.2C907.945 58.5333 907.479 59.6667 906.545 60.6C905.745 61.5333 904.612 62 903.145 62H887.545C881.279 62 876.345 63.8 872.745 67.4C869.145 71 867.345 75.9333 867.345 82.2V137.2C867.345 138.533 866.879 139.667 865.945 140.6C865.012 141.533 863.812 142 862.345 142H844.945Z" fill="none"/>
      <path stroke='black' stroke-width={10} d="M960.581 144C947.115 144 936.781 139.667 929.581 131C922.381 122.333 918.515 110.8 917.981 96.4L917.781 89.8L917.981 83.4C918.381 69.4 922.181 58 929.381 49.2C936.715 40.4 947.115 36 960.581 36C973.515 36 983.781 40.4 991.381 49.2V4.8C991.381 3.33333 991.848 2.2 992.781 1.40001C993.715 0.466669 994.848 0 996.181 0H1013.18C1014.65 0 1015.78 0.466669 1016.58 1.40001C1017.51 2.2 1017.98 3.33333 1017.98 4.8V137.2C1017.98 138.533 1017.51 139.667 1016.58 140.6C1015.78 141.533 1014.65 142 1013.18 142H997.381C996.048 142 994.915 141.533 993.981 140.6C993.048 139.667 992.581 138.533 992.581 137.2V129.8C984.981 139.267 974.315 144 960.581 144ZM967.981 122.6C975.715 122.6 981.448 120.133 985.181 115.2C988.915 110.267 990.981 104.2 991.381 97C991.515 95.4 991.581 92.8 991.581 89.2C991.581 85.7333 991.515 83.2 991.381 81.6C991.115 74.9333 988.981 69.2667 984.981 64.6C981.115 59.8 975.448 57.4 967.981 57.4C953.581 57.4 945.915 66.2667 944.981 84L944.781 90L944.981 96C945.915 113.733 953.581 122.6 967.981 122.6Z" fill="none"/>
    </svg>
  )
}

export default AnimatedSvg;