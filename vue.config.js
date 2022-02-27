module.exports = {
	outputDir: "../wot_backend/public",
	devServer: {
		proxy: {
			"^/api": {
				target: "http://localhost:3001",
				ws: true,
				logLevel: "debug",
				pathRewrite: { "^/api/": "/api/" },
			},
		},
	},
};
