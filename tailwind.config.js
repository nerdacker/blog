module.exports = {
  content: ["./**/*.html"],
  theme: {
    container: {
      center: true,
    },
    fontFamily: {
      sans: ['sans-serif'],
      serif: ['serif'],
    },
    extend: {
      keyframes: {
        slideInUp: {
          'from': { transform: 'translate3d(0, 100%, 0)', visibility: 'visible' },
          'to': { transform: 'translate3d(0, 0, 0)' }
        },
        slideOutDown: {
          'from': { transform: 'translate3d(0, 0, 0)' },
          'to': { transform: 'translate3d(0, 100%, 0)', visibility: 'hidden' }
        },
        slideOutRight: {
          'from': { transform: 'translate3d(0, 0, 0)' },
          'to': { transform: 'translate3d(100%, 0, 0)', visibility: 'hidden' }
        },
        slideInRight: {
          'from': { transform: 'translate3d(100%, 0, 0)', visibility: 'visible' },
          'to': { transform: 'translate3d(0, 0, 0)' }
        }
      },
      animation: {
        slideInUp: 'slideInUp 0.5s linear both',
        slideOutDown: 'slideOutDown 0.5s linear both',
        slideInRight: 'slideInRight 0.5s linear both',
        slideOutRight: 'slideOutRight 0.5s linear both'
      }
    }
  },
  variants: {},
  plugins: [require("@tailwindcss/typography")],
};
