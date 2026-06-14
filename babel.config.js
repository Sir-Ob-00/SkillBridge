module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel"
    ],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@app": "./src/app",
            "@features": "./src/features",
            "@shared": "./src/shared",
            "@services": "./src/services",
            "@store": "./src/store",
            "@hooks": "./src/hooks",
            "@utils": "./src/utils",
            "@constants": "./src/constants",
            "@types": "./src/types",
            "@config": "./src/config",
          },
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};