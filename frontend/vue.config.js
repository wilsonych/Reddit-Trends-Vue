module.exports = {
    configureWebpack: {
        devServer: {
            disableHostCheck: true,
            watchOptions: {
                ignored: "**/node_modules",
            },
        },
    },
    lintOnSave: true,
    transpileDependencies: ["vuetify"],
};
