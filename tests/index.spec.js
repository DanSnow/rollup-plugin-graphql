const rollup = require('rollup');
const graphql = require('..');

process.chdir(__dirname);

describe('plugin', () => {
  it('should parse a simple graphql file', async() => {
    const bundle = await rollup.rollup({
      input: 'samples/basic/index.js',
      plugins: [graphql()]
    });
    const generated = await bundle.generate({
      format: 'cjs'
    });
    const code = generated.code;
    const exports = {};
    const fn = new Function('exports', code);

    fn(exports);

    expect(exports.doc).toBeDefined();
    expect(exports.doc.kind).toBe('Document');
  });

  it('should include a fragment', async() => {
    const bundle = await rollup.rollup({
      input: 'samples/fragments/index.js',
      plugins: [graphql()]
    });
    const generated = await bundle.generate({
      format: 'cjs'
    });
    const code = generated.code;
    const exports = {};
    const fn = new Function('exports', code);

    fn(exports);

    expect(exports.doc).toBeDefined();
    expect(exports.doc.kind).toBe('Document');
    expect(exports.doc.definitions[1].name.value).toBe('HeroFragment');
  });

  it('should export all operations', async() => {
    const bundle = await rollup.rollup({
      input: 'samples/multi-operations/index.js',
      plugins: [graphql()]
    });
    const generated = await bundle.generate({
      format: 'cjs'
    });
    const code = generated.code;
    const exports = {};
    const fn = new Function('exports', code);

    fn(exports);

    expect(exports.GetHero).toBeDefined();
    expect(exports.GetHero.kind).toBe('Document');
    expect(exports.GetAllHeros).toBeDefined();
    expect(exports.GetAllHeros.kind).toBe('Document');
  });
});
