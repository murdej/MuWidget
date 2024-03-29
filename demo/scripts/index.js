const MuWidget = require("../../src/MuWidget").MuWidget;
const MuBinder = require("../../src/MuBinder").MuBinder;

MuWidget.registerAll(
	require("./CharCounter"),
);

MuWidget.registerAs(require("./IMuWidget").IMuWidget, ".")

MuBinder.register(MuWidget);
MuWidget.startup();
