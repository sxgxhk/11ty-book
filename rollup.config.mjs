import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import postcss from "rollup-plugin-postcss";
import babel from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";
import atImport from "postcss-import";
import postcssPresetEnv from "postcss-preset-env";
import { resolve } from "path";
import livereload from "rollup-plugin-livereload";
import copy from "rollup-plugin-copy";

export default {
    input: "src/assets/js/main.js",
    output: { dir: "dist/assets/", sourcemap: true, format: "es" },
    plugins: [
        nodeResolve(),
        commonjs(),
        babel({ babelHelpers: "bundled" }),
        postcss({
            extract: true,
            sourceMap: true,
            extensions: ["css", "scss"],
            plugins: [
                atImport(),
                postcssPresetEnv({
                    features: {
                        "custom-properties": false,
                        "logical-properties-and-values": false,
                    },
                }),
            ],
            //minimize: true,
        }),
        // livereload({
        //     watch: resolve("."),
        //     extraExts: ["hbs"],
        //     exclusions: [resolve("node_modules")],
        // }),
        copy({
            targets: [
                { src: "src/assets/fonts", dest: "dist/assets/" },
                { src: "src/assets/img", dest: "dist/assets/" },
                { src: "src/assets/svg", dest: "dist/assets/" },
            ],
        }),
        //terser(),
    ],
};
