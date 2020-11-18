/*
 * Themes are specific to either light or dark mode.
 * The first theme of each type is the "default" for that mode.
 * Duplicate and change these as necessary to
 * build out your own custom collection of themes.
 */
export const themes = [
  // Light themes
  {
    name: 'quasarish',
    isDark: false,
    colors: {
      primary: 'blue-grey-6',
      secondary: 'brown-4',
      accent: 'grey-7',
      info: 'grey-5',
      warning: 'amber-6',
      positive: 'green-14',
      negative: 'red-10',
      background: 'grey-2'
    }
  },
  {
    name: 'sunset',
    isDark: false,
    colors: {
      primary: 'deep-purple-9',
      secondary: 'orange-10',
      accent: 'light-green-7',
      info: 'cyan-9',
      warning: 'yellow-9',
      positive: 'green-9',
      negative: 'red-10',
      background: 'grey-1'
    }
  },

  // Dark themes
  {
    name: 'pastels',
    isDark: true,
    colors: {
      primary: 'blue-grey-9',
      secondary: 'brown-14',
      accent: 'grey-13',
      info: 'grey-10',
      warning: 'orange-3',
      positive: 'green-13',
      negative: 'red-3',
      background: 'grey-10',
    }
  },
  {
    name: 'ocean',
    isDark: true,
    colors: {
      primary: 'green-2',
      secondary: 'teal-2',
      accent: 'purple-2',
      info: 'blue-3',
      warning: 'yellow-3',
      positive: 'light-green-3',
      negative: 'orange-3',
      background: 'grey-10',

    }
  }
]
