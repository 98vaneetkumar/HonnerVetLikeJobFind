//  metismenu - v2.7.2
! function (n, i) {
	if ("function" == typeof define && define.amd) define(["jquery"], i);
	else if ("undefined" != typeof exports) i(require("jquery"));
	else { i(n.jquery), n.metisMenu = {}; }
}(this, function (n) {
	"use strict";
	var i;
	i = n, i && i.__esModule;
	var t = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (n) { return typeof n; } : function (n) { return n && "function" == typeof Symbol && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n; };
	var e = function (n) {
		var i = !1;

		function t(i) {
			var t = this,
				s = !1;
			return n(this).one(e.TRANSITION_END, function () { s = !0; }), setTimeout(function () { s || e.triggerTransitionEnd(t); }, i), this;
		}
		var e = { TRANSITION_END: "mmTransitionEnd", triggerTransitionEnd: function (t) { n(t).trigger(i.end); }, supportsTransitionEnd: function () { return Boolean(i); } };
		return i = !window.QUnit && { end: "transitionend" }, n.fn.mmEmulateTransitionEnd = t, e.supportsTransitionEnd() && (n.event.special[e.TRANSITION_END] = { bindType: i.end, delegateType: i.end, handle: function (i) { if (n(i.target).is(this)) return i.handleObj.handler.apply(this, arguments); } }), e;
	}(jQuequery);
	! function (n) {
		var i = "metisMenu",
			s = "metisMenu",
			o = "." + s,
			a = n.fn[i],
			r = { toggle: !0, preventDefault: !0, activeClass: "active", collapseClass: "collapse", collapseInClass: "in", collapsingClass: "collapsing", triggerElement: "a", parentTrigger: "li", subMenu: "ul" },
			l = { SHOW: "show" + o, SHOWN: "shown" + o, HIDE: "hide" + o, HIDDEN: "hidden" + o, CLICK_DATA_API: "click" + o + ".data-api" },
			c = function () {
				function i(n, t) { ! function (n, i) { if (!(n instanceof i)) throw new TypeError("Cannot call a class as a function"); }(this, i), this._element = n, this._config = this._getConfig(t), this._transitioning = null, this.init(); }
				return i.prototype.init = function () {
					var i = this;
					n(this._element).find(this._config.parentTrigger + "." + this._config.activeClass).has(this._config.subMenu).children(this._config.subMenu).attr("aria-expanded", !0).addClass(this._config.collapseClass + " " + this._config.collapseInClass), n(this._element).find(this._config.parentTrigger).not("." + this._config.activeClass).has(this._config.subMenu).children(this._config.subMenu).attr("aria-expanded", !1).addClass(this._config.collapseClass), n(this._element).find(this._config.parentTrigger).has(this._config.subMenu).children(this._config.triggerElement).on(l.CLICK_DATA_API, function (t) {
						var e = n(this),
							s = e.parent(i._config.parentTrigger),
							o = s.siblings(i._config.parentTrigger).children(i._config.triggerElement),
							a = s.children(i._config.subMenu);
						i._config.preventDefault && t.preventDefault(), "true" !== e.attr("aria-disabled") && (s.hasClass(i._config.activeClass) ? (e.attr("aria-expanded", !1), i._hide(a)) : (i._show(a), e.attr("aria-expanded", !0), i._config.toggle && o.attr("aria-expanded", !1)), i._config.onTransitionStart && i._config.onTransitionStart(t));
					});
				}, i.prototype._show = function (i) {
					if (!this._transitioning && !n(i).hasClass(this._config.collapsingClass)) {
						var t = this,
							s = n(i),
							o = n.Event(l.SHOW);
						if (s.trigger(o), !o.isDefaultPrevented()) {
							s.parent(this._config.parentTrigger).addClass(this._config.activeClass), this._config.toggle && this._hide(s.parent(this._config.parentTrigger).siblings().children(this._config.subMenu + "." + this._config.collapseInClass).attr("aria-expanded", !1)), s.removeClass(this._config.collapseClass).addClass(this._config.collapsingClass).height(0), this.setTransitioning(!0);
							var a = function () { t._config && t._element && (s.removeClass(t._config.collapsingClass).addClass(t._config.collapseClass + " " + t._config.collapseInClass).height("").attr("aria-expanded", !0), t.setTransitioning(!1), s.trigger(l.SHOWN)); };
							e.supportsTransitionEnd() ? s.height(s[0].scrollHeight).one(e.TRANSITION_END, a).mmEmulateTransitionEnd(350) : a();
						}
					}
				}, i.prototype._hide = function (i) {
					if (!this._transitioning && n(i).hasClass(this._config.collapseInClass)) {
						var t = this,
							s = n(i),
							o = n.Event(l.HIDE);
						if (s.trigger(o), !o.isDefaultPrevented()) {
							s.parent(this._config.parentTrigger).removeClass(this._config.activeClass), s.height(s.height())[0].offsetHeight, s.addClass(this._config.collapsingClass).removeClass(this._config.collapseClass).removeClass(this._config.collapseInClass), this.setTransitioning(!0);
							var a = function () { t._config && t._element && (t._transitioning && t._config.onTransitionEnd && t._config.onTransitionEnd(), t.setTransitioning(!1), s.trigger(l.HIDDEN), s.removeClass(t._config.collapsingClass).addClass(t._config.collapseClass).attr("aria-expanded", !1)); };
							e.supportsTransitionEnd() ? 0 === s.height() || "none" === s.css("display") ? a() : s.height(0).one(e.TRANSITION_END, a).mmEmulateTransitionEnd(350) : a();
						}
					}
				}, i.prototype.setTransitioning = function (n) { this._transitioning = n; }, i.prototype.dispose = function () { n.removeData(this._element, s), n(this._element).find(this._config.parentTrigger).has(this._config.subMenu).children(this._config.triggerElement).off("click"), this._transitioning = null, this._config = null, this._element = null; }, i.prototype._getConfig = function (i) { return i = n.extend({}, r, i); }, i._jQuequeryInterface = function (e) {
					return this.each(function () {
						var o = n(this),
							a = o.data(s),
							l = n.extend({}, r, o.data(), "object" === (void 0 === e ? "undefined" : t(e)) && e);
						if (!a && /dispose/.test(e) && this.dispose(), a || (a = new i(this, l), o.data(s, a)), "string" == typeof e) {
							if (void 0 === a[e]) throw new Error("No method named \"" + e + "\"");
							a[e]();
						}
					});
				}, i;
			}();
		n.fn[i] = c._jQuequeryInterface, n.fn[i].Constructor = c, n.fn[i].noConflict = function () { return n.fn[i] = a, c._jQuequeryInterface; };
	}(jQuequery);
});
//default app plugin
var APPS = function () {
	// PATHS
	// ======================
	//this.ASSETS_PATH = '../../assets/';
	this.ASSETS_PATH = "./assets/";
	this.SERVER_PATH = this.ASSETS_PATH + "demo/server/";
	// GLOBAL HELPERS
	// ======================
	this.is_touch_device = function () {
		return !!("ontouchstart" in window) || !!("onmsgesturechange" in window);
	};
};
var APP = new APPS();
// APP UI SETTINGS
// ======================
APP.UI = {
	scrollTop: 0, // Minimal scrolling to show scrollTop button
};
// 
// PAGE PRELOADING ANIMATION
$(window).on("load", function () {
	setTimeout(function () {
		$(".preloader-backdrop").fadeOut(200);
		$("body").addClass("has-animation");
	}, 0);
});
// Hide sidebar on small screen
$(window).on("load resize scroll", function () {
	if ($(this).width() < 992) {
		$("body").addClass("sidebar-mini");
	}
});
$(function () {
	// SIDEBAR ACTIVATE METISMENU
	$(".metismenu").metisMenu();
	// Activate Tooltips
	$("[data-toggle=\"tooltip\"]").tooltip();
	// Activate Popovers
	$("[data-toggle=\"popover\"]").popover();
	// LAYOUT SETTINGS
	// ======================
	// SIDEBAR TOGGLE ACTION
	$(".js-sidebar-toggler").click(function () {
		$("body").toggleClass("sidebar-mini");
	});
	// fixed layout
	$("#_fixedlayout").change(function () {
		if ($(this).is(":checked")) {
			$("body").addClass("fixed-layout");
			$("#sidebar-collapse").slimScroll({
				height: "100%",
				railOpacity: "0.9",
			});
		} else {
			$("#sidebar-collapse").slimScroll({ destroy: true }).css({ overflow: "visible", height: "auto" });
			$("body").removeClass("fixed-layout");
		}
	});
	// fixed navbar
	$("#_fixedNavbar").change(function () {
		if ($(this).is(":checked")) $("body").addClass("fixed-navbar");
		else $("body").removeClass("fixed-navbar");
	});
	// Boxed layout
	$("[name='layout-style']").change(function () {
		if (+$(this).val()) $("body").addClass("boxed-layout");
		else $("body").removeClass("boxed-layout");
	});
	// THEMES CHANGE
	// ======================
	$(".color-skin-box input:radio").change(function () {
		var val = $(this).val();
		if (val != "default") {
			if (!$("#theme-style").length) {
				$("head").append("<link href='assets/css/themes/" + val + ".css' rel='stylesheet' id='theme-style' >");
			} else $("#theme-style").attr("href", "assets/css/themes/" + val + ".css");
		} else $("#theme-style").remove();
	});
	// PANEL ACTIONS
	// ======================
	$(".ibox-collapse").click(function () {
		var ibox = $(this).closest("div.ibox");
		ibox.toggleClass("collapsed-mode").children(".ibox-body").slideToggle(200);
	});
	$(".ibox-remove").click(function () {
		$(this).closest("div.ibox").remove();
	});
	$(".fullscreen-link").click(function () {
		if ($("body").hasClass("fullscreen-mode")) {
			$("body").removeClass("fullscreen-mode");
			$(this).closest("div.ibox").removeClass("ibox-fullscreen");
			$(window).off("keydown", toggleFullscreen);
		} else {
			$("body").addClass("fullscreen-mode");
			$(this).closest("div.ibox").addClass("ibox-fullscreen");
			$(window).on("keydown", toggleFullscreen);
		}
	});

	function toggleFullscreen(e) {
		// pressing the ESC key - KEY_ESC = 27 
		if (e.which === 27) {
			$("body").removeClass("fullscreen-mode");
			$(".ibox-fullscreen").removeClass("ibox-fullscreen");
			$(window).off("keydown", toggleFullscreen);
		}
	}
	// Backdrop functional
	$.fn.backdrop = function () {
		$(this).toggleClass("shined");
		$("body").toggleClass("has-backdrop");
		return $(this);
	};
	$(".backdrop").click(closeShined);

	function closeShined() {
		$("body").removeClass("has-backdrop");
		$(".shined").removeClass("shined");
	}
});
//== VENDOR PLUGINS OPTIONS
$(function () {
	// Timepicker
	if ($.fn.timepicker) {
		$.fn.timepicker.defaults = $.extend(!0, {}, $.fn.timepicker.defaults, {
			icons: {
				up: "fa fa-angle-up",
				down: "fa fa-angle-down"
			}
		});
	}
});
/**custom code**/
/**country**/
$(".country-selection .dropdown-menu").click(function (event) {
	event.stopPropagation();
	// Do something
});
/**service surge**/
jQuequery(document).ready(function ($) {
	var surge_val = $("input[name=terms_policy]:checked").val();
	if (surge_val === 1) {
		if ($(".surge-yes:has(input:checked)")) {
			$(".surge-status-form").slideDown();
		}
	} else {
		if ($(".surge-no:has(input:checked)")) {
			$(".surge-status-form").slideUp();
		}
	}
});
$(".surge-yes").click(function () {
	if ($(".surge-yes:has(input:checked)")) {
		$(".surge-status-form").slideDown();
	}
});
$(".surge-no").click(function () {
	if ($(".surge-no:has(input:checked)")) {
		$(".surge-status-form").slideUp();
	}
});
/**ad multiple surge**/
/*
function add_more() {
		var count = parseInt($("#int_value").val(), 10);
		var new_count = count + 1;
		$("#int_value").val(new_count);
		html = "<div class=\"surge_div\" id=\"surge_" + new_count + `">
								<div class="remove-wrap">
										<div class="form-element repeatedrow col-12">
												<div class="action-wrap float-right add-more-btn"  onclick="remove(` + new_count + `)">
														<a href="javascript:;" data-toggle="modal" data-target="#myModal_disable" class="disable"><i class="ti-minus" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Delet Surge"></i></a>
												</div>
										</div>    
								</div>
								<div class="col-12">    
										<div class="form-element">
												<label>Surge Multiplier </label>
												<input name="multiplier_0" type="text" class="surge_multiplier form-control">
										</div>
								</div>
								<div class="col-12" id="date_5"> 
										<div class="form-element input-daterange">
												<label>Date</label>
												<div class="row">    
														<div class="input-group date col-6">
																<span class="input-group-addon bg-white"><i class="fa fa-calendar"></i></span>
																<input class="form-control" type="text" placeholder="From">
														</div> 
														<div class="input-group date col-6">
																<span class="input-group-addon bg-white"><i class="fa fa-calendar"></i></span>
																<input class="form-control" type="text" placeholder="To">
														</div>
												</div>
										</div>
								</div>  
								<div class="col-12"> 
										<div class="form-element text-left" >
												<label>Time</label>
												<div class="row">    
														<div class="input-group date col-6 select-bx">
																<span class="input-group-addon bg-white"><i class="ti-timer"></i></span>
																		<select class="selectpicker form-control">
																				<option value="00:00">00:00</option>
																				<option value="01:00">01:00</option>
																				<option value="02:00">02:00</option>
																				<option value="03:00">03:00</option>
																				<option value="04:00">04:00</option>
																				<option value="05:00">05:00</option>
																				<option value="06:00">06:00</option>
																				<option value="07:00">07:00</option>
																				<option value="08:00">08:00</option>
																				<option value="09:00">09:00</option>
																				<option value="10:00">10:00</option>
																				<option value="11:00">11:00</option>
																				<option value="12:00">12:00</option>
																				<option value="13:00">13:00</option>
																				<option value="14:00">14:00</option>
																				<option value="15:00">15:00</option>
																				<option value="16:00">16:00</option>
																				<option value="17:00">17:00</option>
																				<option value="18:00">18:00</option>
																				<option value="19:00">19:00</option>
																				<option value="20:00">20:00</option>
																				<option value="21:00">21:00</option>
																				<option value="22:00">22:00</option>
																				<option value="23:00">23:00</option>
																				<option value="23:59">23:59</option>
																		</select>
														</div> 
														<div class="input-group date col-6 select-bx">
																<span class="input-group-addon bg-white"><i class="ti-timer"></i></span>
																		<select class="selectpicker form-control">
																				<option value="00:00">00:00</option>
																				<option value="01:00">01:00</option>
																				<option value="02:00">02:00</option>
																				<option value="03:00">03:00</option>
																				<option value="04:00">04:00</option>
																				<option value="05:00">05:00</option>
																				<option value="06:00">06:00</option>
																				<option value="07:00">07:00</option>
																				<option value="08:00">08:00</option>
																				<option value="09:00">09:00</option>
																				<option value="10:00">10:00</option>
																				<option value="11:00">11:00</option>
																				<option value="12:00">12:00</option>
																				<option value="13:00">13:00</option>
																				<option value="14:00">14:00</option>
																				<option value="15:00">15:00</option>
																				<option value="16:00">16:00</option>
																				<option value="17:00">17:00</option>
																				<option value="18:00">18:00</option>
																				<option value="19:00">19:00</option>
																				<option value="20:00">20:00</option>
																				<option value="21:00">21:00</option>
																				<option value="22:00">22:00</option>
																				<option value="23:00">23:00</option>
																				<option value="23:59">23:59</option>
																		</select>
														</div>
												</div>
										</div>
								</div>
								<div class="col-12">
										<div class="form-element">
												<label>Select Weekdays</label>
												<ul class="col-custome4">
														<ul class="col-custome4">
																	<li><label class="checkbox leftlabel"><input type="checkbox" name="status"><i class="input-helper"></i>Monday</label></li>
																	<li><label class="checkbox leftlabel"><input type="checkbox" name="status"><i class="input-helper"></i>Tuesday</label></li>
																	<li><label class="checkbox leftlabel"><input type="checkbox" name="status"><i class="input-helper"></i>Wednesday</label></li>   
																	<li><label class="checkbox leftlabel"><input type="checkbox" name="status"><i class="input-helper"></i>Thursday</label></li>
																	<li><label class="checkbox leftlabel"><input type="checkbox" name="status"><i class="input-helper"></i>Friday</label></li>
																	<li><label class="checkbox leftlabel"><input type="checkbox" name="status"><i class="input-helper"></i>Saturday</label></li>
																	<li><label class="checkbox leftlabel"><input type="radio" name="status"><i class="input-helper"></i>Sunday</label></li>   
														</ul>  
												</ul>
										</div>    
								</div>
						</div>`;
		$("#service_form").append(html);
} */
// var id_arr = [];
/*
function remove(id, type) {
		$("#surge_" + id).remove();
		id_arr.push(type);
		console.log(id_arr);
} */
/**form plugin**/
/*
function close_country() {
		$(".country-selection").removeClass("show");
		$(".dropdown-menu").removeClass("show");
} */
/**hide year dashboard**/
$(".show-year").click(function () {
	$(".hide-year").addClass("show");
});

function isTouchDevice() {
	return true === ("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch);
}
if (isTouchDevice() === false) {
	$("[rel='tooltip']").tooltip();
}