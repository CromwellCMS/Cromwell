module.exports = (api) => {
    api.cache(true);

    // adapt this to your setup
    const presets = [
        'next/babel',
        '@zeit/next-typescript/babel' // if you use TypeScript
    ];

    return {
        presets,
        plugins: [
            ["@babel/plugin-proposal-decorators", { "legacy": true }],
            ["@babel/plugin-proposal-class-properties", { "loose" : true }]
          ]
    };
}