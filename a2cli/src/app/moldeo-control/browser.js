function LaunchProject(event) {

	if (moCI && moCI.Browser) {
		moCI.Browser.OpenFile( event );
	}

}

$(function() {

	$(".x_minimize").on("click", function(event) { win.minimize(); /*gui.App.quit();*/ });
	$(".x_maximize").on("click", function(event) { win.maximize(); /*gui.App.quit();*/ });
	$(".x_debug").on("click", function(event) { win.showDevTools(); /*gui.App.quit();*/ });
	$(".x_close").on("click", function(event) { win.close(); /*gui.App.quit();*/ });
	
});