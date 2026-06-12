import path from 'path';

// Workaround: Turbopack doesn't pass `from` in PostCSS opts, so @tailwindcss/postcss
// falls back to dirname(process.cwd()) as the resolution base (the parent directory),
// which has no node_modules. Override the resolver to use the actual project root.
const tailwindcssPath = path.join(process.cwd(), 'node_modules/tailwindcss/index.css');

globalThis.__tw_resolve = (id) => {
  if (id === 'tailwindcss') {
    return tailwindcssPath;
  }
  return null;
};

const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
