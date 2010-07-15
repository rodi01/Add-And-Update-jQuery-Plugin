/* --
http://github.com/oncemade/Add-And-Update-jQuery-Plugin
Add and Update for jQuery.
Written by Rodrigo Soares (oncemade{at}gmail.com) Jul 2010.
jQuery Plugin Framework by Keith Wood (http://keith-wood.name/pluginFramework.html)

Dual licensed under the GPL (http://dev.jquery.com/browser/trunk/jquery/GPL-LICENSE.txt) and 
MIT (http://dev.jquery.com/browser/trunk/jquery/MIT-LICENSE.txt) licenses. 
Please attribute the author if you use it. 
-- */

;(function($) {
var PROP_NAME = 'addAndUpdate';

/* Attach the "add and update" functionality to a jQuery selection.
   @param  options  (object) the new settings to use for these instances (optional)
   @return  (jQuery) for chaining further calls */

$.fn.addAndUpdate = function(options) {
	var opts = $.extend({}, $.fn.addAndUpdate.defaults, options);

	return this.each(function() {
		var target = $(this);
		
		//save settings to element's data
		target.data(PROP_NAME, opts);
		var inst = target.data(PROP_NAME),
			inputs = target.find('input, button, textarea');
		
		//submit form
		target.submit(function() {
			$.ajax({
				url: target.attr('action'),
				type: 'POST',
				data: target.serialize(),
				beforeSend: function(data){
					//add sending class to target
					target.addClass(inst.loadingClass);
					
					//set forms elements to disabled
					inputs.attr('disabled', 'disabled');
					
					//fire custom event
					inst.beforeSend(data);
				},
	  			success: function(data) {
					//remove sending class from target
					target.removeClass(inst.loadingClass);
					if (inst.defaultUpdate) {
						// replace all instance of {data}
						var markup = inst.updateMarkup.replace(/{data}/g, data);
						
						//prepend data
						$(markup)
							.prependTo(inst.update)
							.hide()
							.slideDown();
					}
					inputs.attr('disabled', '');
					inst.success(data);
	 			}
			});
			return false;
		});
	});
};

// default options
$.fn.addAndUpdate.defaults = {
	beforeSend: function(data){},
	success: function(data){},
	update: '.activityList',
	defaultUpdate: true,
	updateMarkup: '<li>{data}</li>',
	loadingClass: 'loading'
};

})(jQuery);
