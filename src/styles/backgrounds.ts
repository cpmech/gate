const backgroundsArray = [
  `background-color: #fff;`,
  `background-color: #e8dbde; background-image: linear-gradient(225deg, #e8dbde 0%, #d0a7ec 50%, #9ccae8 100%);`,
  `background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);`,
  `background-image: linear-gradient(to top, #dfe9f3 0%, white 100%);`,
  `background-image: linear-gradient(to top, #fff1eb 0%, #ace0f9 100%);`,
  `background-image: linear-gradient(180deg, #2af598 0%, #009efd 100%);`,
  `background-image: linear-gradient(to top, #c1dfc4 0%, #deecdd 100%);`,
  `background-image: linear-gradient(-20deg, #00cdac 0%, #8ddad5 100%);`,
  `background-color: #4158D0; background-image: linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);`,
  `background-color: #0093E9; background-image: linear-gradient(160deg, #0093E9 0%, #80D0C7 100%);`,
  `background-color: #8EC5FC; background-image: linear-gradient(62deg, #8EC5FC 0%, #E0C3FC 100%);`,
  `background-color: #8BC6EC; background-image: linear-gradient(135deg, #8BC6EC 0%, #9599E2 100%);`,
  `background-color: #FFDEE9; background-image: linear-gradient(0deg, #FFDEE9 0%, #B5FFFC 100%);`,
  `background-color: #21D4FD; background-image: linear-gradient(19deg, #21D4FD 0%, #B721FF 100%);`,
  `background-color: #FA8BFF; background-image: linear-gradient(45deg, #FA8BFF 0%, #2BD2FF 52%, #2BFF88 90%);`,
];

export const backgrounds = {
  list: backgroundsArray,
  get: (index: number) => backgroundsArray[index % backgroundsArray.length],
};

// Reference:
//   https://cssgradient.io/gradient-backgrounds/
