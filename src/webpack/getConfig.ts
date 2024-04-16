import * as webpack from 'webpack';
import * as path from 'path';
import { getBaseConfig } from './getBaseConfig';
import { getTsRule } from './rules/getTsRule';
import { ModeType } from './types';
import * as CopyWebpackPlugin from 'copy-webpack-plugin';

export const getConfig = (
    configDirName: string,
    mode: ModeType,
): webpack.Configuration => {
    const baseConfig = getBaseConfig(mode);
    return {
        ...baseConfig,
        entry: {
            main: './src/main.tsx',
        },
        output: {
            filename: '[name].js',
            path: path.resolve(configDirName, 'build'),
        },
        module: {
            rules: [getTsRule()],
        },
        plugins: [
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: 'src/index.html',
                        to: 'index.html',
                    },
                ],
            }),
        ],
    };
};
