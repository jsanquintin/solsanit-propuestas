tailwind.config = {
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#0A3DA7',
          bluedark: '#082F75',
          green: '#36A936',
          greendark: '#237A28',
          navy: '#071B3D',
          ink: '#182B45',
          muted: '#5B6B82',
          bg: '#F7F6F2',
          line: '#E4E1D8',
        },
      },
      fontFamily: {
        serif: ['"Roboto Serif"', 'Georgia', 'serif'],
        sans: ['Rubik', 'Arial', 'Helvetica', 'sans-serif'],
      },
      borderRadius: {
        none: '0px',
        DEFAULT: '0px',
        sm: '0px',
        md: '0px',
        lg: '0px',
        xl: '0px',
        '2xl': '0px',
        full: '9999px',
      },
      backgroundImage: {
        'brand-bar': 'linear-gradient(90deg, #0A3DA7 0%, #36A936 50%, #082F75 100%)',
      },
      spacing: {
        18: '4.5rem',
      },
    },
  },
};
