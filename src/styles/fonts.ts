export interface IFontData {
  atImport: string;
  cssFamily: string;
}

export type IFont =
  | 'architectsDaughter'
  | 'inknutAntiqua'
  | 'inter'
  | 'montserrat'
  | 'sourceSerifPro';

export type IFonts = { [name in IFont]: IFontData };

export const fonts: IFonts = {
  architectsDaughter: {
    atImport: `@import url('https://fonts.googleapis.com/css2?family=Architects+Daughter&display=swap');`,
    cssFamily: `font-family: 'Architects Daughter', cursive;`,
  },
  inknutAntiqua: {
    atImport: `@import url('https://fonts.googleapis.com/css2?family=Inknut+Antiqua:wght@600&display=swap');`,
    cssFamily: `font-family: 'Inknut Antiqua', serif;`,
  },
  inter: {
    atImport: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300&display=swap');`,
    cssFamily: `font-family: 'Inter', sans-serif;`,
  },
  montserrat: {
    atImport: `@import url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap');`,
    cssFamily: `font-family: 'Montserrat', sans-serif;`,
  },
  sourceSerifPro: {
    atImport: `@import url('https://fonts.googleapis.com/css2?family=Source+Serif+Pro&display=swap');`,
    cssFamily: `font-family: 'Source Serif Pro', serif;`,
  },
};
