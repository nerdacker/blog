module.exports = {
  plugins: [
    require('postcss-nested'),
    require(`tailwindcss`)(`./tailwind.config.js`),
    require(`autoprefixer`),
    ...(process.env.NODE_ENV === "production"
      ? [
          require(`cssnano`)({
            preset: "default",
          }),
        ]
      : []),
  ],
};
