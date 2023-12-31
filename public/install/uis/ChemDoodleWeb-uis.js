//
// ChemDoodle Web Components 9.1.0
//
// https://web.chemdoodle.com
//
// Copyright 2009-2020 iChemLabs, LLC.  All rights reserved.
//
// The ChemDoodle Web Components library is licensed under version 3
// of the GNU GENERAL PUBLIC LICENSE.
//
// You may redistribute it and/or modify it under the terms of the
// GNU General Public License as published by the Free Software Foundation,
// either version 3 of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
//
// Please contact iChemLabs <https://www.ichemlabs.com/contact-us> for
// alternate licensing options.
//
/*
* http://jqueryui.com
* Includes: core.js, widget.js, mouse.js, position.js, draggable.js, droppable.js, resizable.js, selectable.js, sortable.js, accordion.js, autocomplete.js, button.js, datepicker.js, dialog.js, menu.js, progressbar.js, selectmenu.js, slider.js, spinner.js, tabs.js, tooltip.js
* Copyright jQuery Foundation and other contributors; Licensed MIT */
(function(jQuery) {
(function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define([ "jquery" ], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
}(function( $ ) {
/*
 * jQuery UI Core 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/category/ui-core/
 */


// $.ui might exist from components with no dependencies, e.g., $.ui.position
$.ui = $.ui || {};

$.extend( $.ui, {
	version: "1.11.4",

	keyCode: {
		BACKSPACE: 8,
		COMMA: 188,
		DELETE: 46,
		DOWN: 40,
		END: 35,
		ENTER: 13,
		ESCAPE: 27,
		HOME: 36,
		LEFT: 37,
		PAGE_DOWN: 34,
		PAGE_UP: 33,
		PERIOD: 190,
		RIGHT: 39,
		SPACE: 32,
		TAB: 9,
		UP: 38
	}
});

// plugins
$.fn.extend({
	scrollParent: function( includeHidden ) {
		var position = this.css( "position" ),
			excludeStaticParent = position === "absolute",
			overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/,
			scrollParent = this.parents().filter( function() {
				var parent = $( this );
				if ( excludeStaticParent && parent.css( "position" ) === "static" ) {
					return false;
				}
				return overflowRegex.test( parent.css( "overflow" ) + parent.css( "overflow-y" ) + parent.css( "overflow-x" ) );
			}).eq( 0 );

		return position === "fixed" || !scrollParent.length ? $( this[ 0 ].ownerDocument || document ) : scrollParent;
	},

	uniqueId: (function() {
		var uuid = 0;

		return function() {
			return this.each(function() {
				if ( !this.id ) {
					this.id = "ui-id-" + ( ++uuid );
				}
			});
		};
	})(),

	removeUniqueId: function() {
		return this.each(function() {
			if ( /^ui-id-\d+$/.test( this.id ) ) {
				$( this ).removeAttr( "id" );
			}
		});
	}
});

// selectors
function focusable( element, isTabIndexNotNaN ) {
	var map, mapName, img,
		nodeName = element.nodeName.toLowerCase();
	if ( "area" === nodeName ) {
		map = element.parentNode;
		mapName = map.name;
		if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
			return false;
		}
		img = $( "img[usemap='#" + mapName + "']" )[ 0 ];
		return !!img && visible( img );
	}
	return ( /^(input|select|textarea|button|object)$/.test( nodeName ) ?
		!element.disabled :
		"a" === nodeName ?
			element.href || isTabIndexNotNaN :
			isTabIndexNotNaN) &&
		// the element and all of its ancestors must be visible
		visible( element );
}

function visible( element ) {
	return $.expr.filters.visible( element ) &&
		!$( element ).parents().addBack().filter(function() {
			return $.css( this, "visibility" ) === "hidden";
		}).length;
}

$.extend( $.expr[ ":" ], {
	data: $.expr.createPseudo ?
		$.expr.createPseudo(function( dataName ) {
			return function( elem ) {
				return !!$.data( elem, dataName );
			};
		}) :
		// support: jQuery <1.8
		function( elem, i, match ) {
			return !!$.data( elem, match[ 3 ] );
		},

	focusable: function( element ) {
		return focusable( element, !isNaN( $.attr( element, "tabindex" ) ) );
	},

	tabbable: function( element ) {
		var tabIndex = $.attr( element, "tabindex" ),
			isTabIndexNaN = isNaN( tabIndex );
		return ( isTabIndexNaN || tabIndex >= 0 ) && focusable( element, !isTabIndexNaN );
	}
});

// support: jQuery <1.8
if ( !$( "<a>" ).outerWidth( 1 ).jquery ) {
	$.each( [ "Width", "Height" ], function( i, name ) {
		var side = name === "Width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ],
			type = name.toLowerCase(),
			orig = {
				innerWidth: $.fn.innerWidth,
				innerHeight: $.fn.innerHeight,
				outerWidth: $.fn.outerWidth,
				outerHeight: $.fn.outerHeight
			};

		function reduce( elem, size, border, margin ) {
			$.each( side, function() {
				size -= parseFloat( $.css( elem, "padding" + this ) ) || 0;
				if ( border ) {
					size -= parseFloat( $.css( elem, "border" + this + "Width" ) ) || 0;
				}
				if ( margin ) {
					size -= parseFloat( $.css( elem, "margin" + this ) ) || 0;
				}
			});
			return size;
		}

		$.fn[ "inner" + name ] = function( size ) {
			if ( size === undefined ) {
				return orig[ "inner" + name ].call( this );
			}

			return this.each(function() {
				$( this ).css( type, reduce( this, size ) + "px" );
			});
		};

		$.fn[ "outer" + name] = function( size, margin ) {
			if ( typeof size !== "number" ) {
				return orig[ "outer" + name ].call( this, size );
			}

			return this.each(function() {
				$( this).css( type, reduce( this, size, true, margin ) + "px" );
			});
		};
	});
}

// support: jQuery <1.8
if ( !$.fn.addBack ) {
	$.fn.addBack = function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	};
}

// support: jQuery 1.6.1, 1.6.2 (http://bugs.jquery.com/ticket/9413)
if ( $( "<a>" ).data( "a-b", "a" ).removeData( "a-b" ).data( "a-b" ) ) {
	$.fn.removeData = (function( removeData ) {
		return function( key ) {
			if ( arguments.length ) {
				return removeData.call( this, $.camelCase( key ) );
			} else {
				return removeData.call( this );
			}
		};
	})( $.fn.removeData );
}

// deprecated
$.ui.ie = !!/msie [\w.]+/.exec( navigator.userAgent.toLowerCase() );

$.fn.extend({
	focus: (function( orig ) {
		return function( delay, fn ) {
			return typeof delay === "number" ?
				this.each(function() {
					var elem = this;
					setTimeout(function() {
						$( elem ).focus();
						if ( fn ) {
							fn.call( elem );
						}
					}, delay );
				}) :
				orig.apply( this, arguments );
		};
	})( $.fn.focus ),

	disableSelection: (function() {
		var eventType = "onselectstart" in document.createElement( "div" ) ?
			"selectstart" :
			"mousedown";

		return function() {
			return this.bind( eventType + ".ui-disableSelection", function( event ) {
				event.preventDefault();
			});
		};
	})(),

	enableSelection: function() {
		return this.unbind( ".ui-disableSelection" );
	},

	zIndex: function( zIndex ) {
		if ( zIndex !== undefined ) {
			return this.css( "zIndex", zIndex );
		}

		if ( this.length ) {
			var elem = $( this[ 0 ] ), position, value;
			while ( elem.length && elem[ 0 ] !== document ) {
				// Ignore z-index if position is set to a value where z-index is ignored by the browser
				// This makes behavior of this function consistent across browsers
				// WebKit always returns auto if the element is positioned
				position = elem.css( "position" );
				if ( position === "absolute" || position === "relative" || position === "fixed" ) {
					// IE returns 0 when zIndex is not specified
					// other browsers return a string
					// we ignore the case of nested elements with an explicit value of 0
					// <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
					value = parseInt( elem.css( "zIndex" ), 10 );
					if ( !isNaN( value ) && value !== 0 ) {
						return value;
					}
				}
				elem = elem.parent();
			}
		}

		return 0;
	}
});

// $.ui.plugin is deprecated. Use $.widget() extensions instead.
$.ui.plugin = {
	add: function( module, option, set ) {
		var i,
			proto = $.ui[ module ].prototype;
		for ( i in set ) {
			proto.plugins[ i ] = proto.plugins[ i ] || [];
			proto.plugins[ i ].push( [ option, set[ i ] ] );
		}
	},
	call: function( instance, name, args, allowDisconnected ) {
		var i,
			set = instance.plugins[ name ];

		if ( !set ) {
			return;
		}

		if ( !allowDisconnected && ( !instance.element[ 0 ].parentNode || instance.element[ 0 ].parentNode.nodeType === 11 ) ) {
			return;
		}

		for ( i = 0; i < set.length; i++ ) {
			if ( instance.options[ set[ i ][ 0 ] ] ) {
				set[ i ][ 1 ].apply( instance.element, args );
			}
		}
	}
};


/*
 * jQuery UI Widget 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/jQuery.widget/
 */


var widget_uuid = 0,
	widget_slice = Array.prototype.slice;

$.cleanData = (function( orig ) {
	return function( elems ) {
		var events, elem, i;
		for ( i = 0; (elem = elems[i]) != null; i++ ) {
			try {

				// Only trigger remove when necessary to save time
				events = $._data( elem, "events" );
				if ( events && events.remove ) {
					$( elem ).triggerHandler( "remove" );
				}

			// http://bugs.jquery.com/ticket/8235
			} catch ( e ) {}
		}
		orig( elems );
	};
})( $.cleanData );

$.widget = function( name, base, prototype ) {
	var fullName, existingConstructor, constructor, basePrototype,
		// proxiedPrototype allows the provided prototype to remain unmodified
		// so that it can be used as a mixin for multiple widgets (#8876)
		proxiedPrototype = {},
		namespace = name.split( "." )[ 0 ];

	name = name.split( "." )[ 1 ];
	fullName = namespace + "-" + name;

	if ( !prototype ) {
		prototype = base;
		base = $.Widget;
	}

	// create selector for plugin
	$.expr[ ":" ][ fullName.toLowerCase() ] = function( elem ) {
		return !!$.data( elem, fullName );
	};

	$[ namespace ] = $[ namespace ] || {};
	existingConstructor = $[ namespace ][ name ];
	constructor = $[ namespace ][ name ] = function( options, element ) {
		// allow instantiation without "new" keyword
		if ( !this._createWidget ) {
			return new constructor( options, element );
		}

		// allow instantiation without initializing for simple inheritance
		// must use "new" keyword (the code above always passes args)
		if ( arguments.length ) {
			this._createWidget( options, element );
		}
	};
	// extend with the existing constructor to carry over any static properties
	$.extend( constructor, existingConstructor, {
		version: prototype.version,
		// copy the object used to create the prototype in case we need to
		// redefine the widget later
		_proto: $.extend( {}, prototype ),
		// track widgets that inherit from this widget in case this widget is
		// redefined after a widget inherits from it
		_childConstructors: []
	});

	basePrototype = new base();
	// we need to make the options hash a property directly on the new instance
	// otherwise we'll modify the options hash on the prototype that we're
	// inheriting from
	basePrototype.options = $.widget.extend( {}, basePrototype.options );
	$.each( prototype, function( prop, value ) {
		if ( !$.isFunction( value ) ) {
			proxiedPrototype[ prop ] = value;
			return;
		}
		proxiedPrototype[ prop ] = (function() {
			var _super = function() {
					return base.prototype[ prop ].apply( this, arguments );
				},
				_superApply = function( args ) {
					return base.prototype[ prop ].apply( this, args );
				};
			return function() {
				var __super = this._super,
					__superApply = this._superApply,
					returnValue;

				this._super = _super;
				this._superApply = _superApply;

				returnValue = value.apply( this, arguments );

				this._super = __super;
				this._superApply = __superApply;

				return returnValue;
			};
		})();
	});
	constructor.prototype = $.widget.extend( basePrototype, {
		// TODO: remove support for widgetEventPrefix
		// always use the name + a colon as the prefix, e.g., draggable:start
		// don't prefix for widgets that aren't DOM-based
		widgetEventPrefix: existingConstructor ? (basePrototype.widgetEventPrefix || name) : name
	}, proxiedPrototype, {
		constructor: constructor,
		namespace: namespace,
		widgetName: name,
		widgetFullName: fullName
	});

	// If this widget is being redefined then we need to find all widgets that
	// are inheriting from it and redefine all of them so that they inherit from
	// the new version of this widget. We're essentially trying to replace one
	// level in the prototype chain.
	if ( existingConstructor ) {
		$.each( existingConstructor._childConstructors, function( i, child ) {
			var childPrototype = child.prototype;

			// redefine the child widget using the same prototype that was
			// originally used, but inherit from the new version of the base
			$.widget( childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto );
		});
		// remove the list of existing child constructors from the old constructor
		// so the old child constructors can be garbage collected
		delete existingConstructor._childConstructors;
	} else {
		base._childConstructors.push( constructor );
	}

	$.widget.bridge( name, constructor );

	return constructor;
};

$.widget.extend = function( target ) {
	var input = widget_slice.call( arguments, 1 ),
		inputIndex = 0,
		inputLength = input.length,
		key,
		value;
	for ( ; inputIndex < inputLength; inputIndex++ ) {
		for ( key in input[ inputIndex ] ) {
			value = input[ inputIndex ][ key ];
			if ( input[ inputIndex ].hasOwnProperty( key ) && value !== undefined ) {
				// Clone objects
				if ( $.isPlainObject( value ) ) {
					target[ key ] = $.isPlainObject( target[ key ] ) ?
						$.widget.extend( {}, target[ key ], value ) :
						// Don't extend strings, arrays, etc. with objects
						$.widget.extend( {}, value );
				// Copy everything else by reference
				} else {
					target[ key ] = value;
				}
			}
		}
	}
	return target;
};

$.widget.bridge = function( name, object ) {
	var fullName = object.prototype.widgetFullName || name;
	$.fn[ name ] = function( options ) {
		var isMethodCall = typeof options === "string",
			args = widget_slice.call( arguments, 1 ),
			returnValue = this;

		if ( isMethodCall ) {
			this.each(function() {
				var methodValue,
					instance = $.data( this, fullName );
				if ( options === "instance" ) {
					returnValue = instance;
					return false;
				}
				if ( !instance ) {
					return $.error( "cannot call methods on " + name + " prior to initialization; " +
						"attempted to call method '" + options + "'" );
				}
				if ( !$.isFunction( instance[options] ) || options.charAt( 0 ) === "_" ) {
					return $.error( "no such method '" + options + "' for " + name + " widget instance" );
				}
				methodValue = instance[ options ].apply( instance, args );
				if ( methodValue !== instance && methodValue !== undefined ) {
					returnValue = methodValue && methodValue.jquery ?
						returnValue.pushStack( methodValue.get() ) :
						methodValue;
					return false;
				}
			});
		} else {

			// Allow multiple hashes to be passed on init
			if ( args.length ) {
				options = $.widget.extend.apply( null, [ options ].concat(args) );
			}

			this.each(function() {
				var instance = $.data( this, fullName );
				if ( instance ) {
					instance.option( options || {} );
					if ( instance._init ) {
						instance._init();
					}
				} else {
					$.data( this, fullName, new object( options, this ) );
				}
			});
		}

		return returnValue;
	};
};

$.Widget = function( /* options, element */ ) {};
$.Widget._childConstructors = [];

$.Widget.prototype = {
	widgetName: "widget",
	widgetEventPrefix: "",
	defaultElement: "<div>",
	options: {
		disabled: false,

		// callbacks
		create: null
	},
	_createWidget: function( options, element ) {
		element = $( element || this.defaultElement || this )[ 0 ];
		this.element = $( element );
		this.uuid = widget_uuid++;
		this.eventNamespace = "." + this.widgetName + this.uuid;

		this.bindings = $();
		this.hoverable = $();
		this.focusable = $();

		if ( element !== this ) {
			$.data( element, this.widgetFullName, this );
			this._on( true, this.element, {
				remove: function( event ) {
					if ( event.target === element ) {
						this.destroy();
					}
				}
			});
			this.document = $( element.style ?
				// element within the document
				element.ownerDocument :
				// element is window or document
				element.document || element );
			this.window = $( this.document[0].defaultView || this.document[0].parentWindow );
		}

		this.options = $.widget.extend( {},
			this.options,
			this._getCreateOptions(),
			options );

		this._create();
		this._trigger( "create", null, this._getCreateEventData() );
		this._init();
	},
	_getCreateOptions: $.noop,
	_getCreateEventData: $.noop,
	_create: $.noop,
	_init: $.noop,

	destroy: function() {
		this._destroy();
		// we can probably remove the unbind calls in 2.0
		// all event bindings should go through this._on()
		this.element
			.unbind( this.eventNamespace )
			.removeData( this.widgetFullName )
			// support: jquery <1.6.3
			// http://bugs.jquery.com/ticket/9413
			.removeData( $.camelCase( this.widgetFullName ) );
		this.widget()
			.unbind( this.eventNamespace )
			.removeAttr( "aria-disabled" )
			.removeClass(
				this.widgetFullName + "-disabled " +
				"ui-state-disabled" );

		// clean up events and states
		this.bindings.unbind( this.eventNamespace );
		this.hoverable.removeClass( "ui-state-hover" );
		this.focusable.removeClass( "ui-state-focus" );
	},
	_destroy: $.noop,

	widget: function() {
		return this.element;
	},

	option: function( key, value ) {
		var options = key,
			parts,
			curOption,
			i;

		if ( arguments.length === 0 ) {
			// don't return a reference to the internal hash
			return $.widget.extend( {}, this.options );
		}

		if ( typeof key === "string" ) {
			// handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
			options = {};
			parts = key.split( "." );
			key = parts.shift();
			if ( parts.length ) {
				curOption = options[ key ] = $.widget.extend( {}, this.options[ key ] );
				for ( i = 0; i < parts.length - 1; i++ ) {
					curOption[ parts[ i ] ] = curOption[ parts[ i ] ] || {};
					curOption = curOption[ parts[ i ] ];
				}
				key = parts.pop();
				if ( arguments.length === 1 ) {
					return curOption[ key ] === undefined ? null : curOption[ key ];
				}
				curOption[ key ] = value;
			} else {
				if ( arguments.length === 1 ) {
					return this.options[ key ] === undefined ? null : this.options[ key ];
				}
				options[ key ] = value;
			}
		}

		this._setOptions( options );

		return this;
	},
	_setOptions: function( options ) {
		var key;

		for ( key in options ) {
			this._setOption( key, options[ key ] );
		}

		return this;
	},
	_setOption: function( key, value ) {
		this.options[ key ] = value;

		if ( key === "disabled" ) {
			this.widget()
				.toggleClass( this.widgetFullName + "-disabled", !!value );

			// If the widget is becoming disabled, then nothing is interactive
			if ( value ) {
				this.hoverable.removeClass( "ui-state-hover" );
				this.focusable.removeClass( "ui-state-focus" );
			}
		}

		return this;
	},

	enable: function() {
		return this._setOptions({ disabled: false });
	},
	disable: function() {
		return this._setOptions({ disabled: true });
	},

	_on: function( suppressDisabledCheck, element, handlers ) {
		var delegateElement,
			instance = this;

		// no suppressDisabledCheck flag, shuffle arguments
		if ( typeof suppressDisabledCheck !== "boolean" ) {
			handlers = element;
			element = suppressDisabledCheck;
			suppressDisabledCheck = false;
		}

		// no element argument, shuffle and use this.element
		if ( !handlers ) {
			handlers = element;
			element = this.element;
			delegateElement = this.widget();
		} else {
			element = delegateElement = $( element );
			this.bindings = this.bindings.add( element );
		}

		$.each( handlers, function( event, handler ) {
			function handlerProxy() {
				// allow widgets to customize the disabled handling
				// - disabled as an array instead of boolean
				// - disabled class as method for disabling individual parts
				if ( !suppressDisabledCheck &&
						( instance.options.disabled === true ||
							$( this ).hasClass( "ui-state-disabled" ) ) ) {
					return;
				}
				return ( typeof handler === "string" ? instance[ handler ] : handler )
					.apply( instance, arguments );
			}

			// copy the guid so direct unbinding works
			if ( typeof handler !== "string" ) {
				handlerProxy.guid = handler.guid =
					handler.guid || handlerProxy.guid || $.guid++;
			}

			var match = event.match( /^([\w:-]*)\s*(.*)$/ ),
				eventName = match[1] + instance.eventNamespace,
				selector = match[2];
			if ( selector ) {
				delegateElement.delegate( selector, eventName, handlerProxy );
			} else {
				element.bind( eventName, handlerProxy );
			}
		});
	},

	_off: function( element, eventName ) {
		eventName = (eventName || "").split( " " ).join( this.eventNamespace + " " ) +
			this.eventNamespace;
		element.unbind( eventName ).undelegate( eventName );

		// Clear the stack to avoid memory leaks (#10056)
		this.bindings = $( this.bindings.not( element ).get() );
		this.focusable = $( this.focusable.not( element ).get() );
		this.hoverable = $( this.hoverable.not( element ).get() );
	},

	_delay: function( handler, delay ) {
		function handlerProxy() {
			return ( typeof handler === "string" ? instance[ handler ] : handler )
				.apply( instance, arguments );
		}
		var instance = this;
		return setTimeout( handlerProxy, delay || 0 );
	},

	_hoverable: function( element ) {
		this.hoverable = this.hoverable.add( element );
		this._on( element, {
			mouseenter: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-hover" );
			},
			mouseleave: function( event ) {
				$( event.currentTarget ).removeClass( "ui-state-hover" );
			}
		});
	},

	_focusable: function( element ) {
		this.focusable = this.focusable.add( element );
		this._on( element, {
			focusin: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-focus" );
			},
			focusout: function( event ) {
				$( event.currentTarget ).removeClass( "ui-state-focus" );
			}
		});
	},

	_trigger: function( type, event, data ) {
		var prop, orig,
			callback = this.options[ type ];

		data = data || {};
		event = $.Event( event );
		event.type = ( type === this.widgetEventPrefix ?
			type :
			this.widgetEventPrefix + type ).toLowerCase();
		// the original event may come from any element
		// so we need to reset the target on the new event
		event.target = this.element[ 0 ];

		// copy original event properties over to the new event
		orig = event.originalEvent;
		if ( orig ) {
			for ( prop in orig ) {
				if ( !( prop in event ) ) {
					event[ prop ] = orig[ prop ];
				}
			}
		}

		this.element.trigger( event, data );
		return !( $.isFunction( callback ) &&
			callback.apply( this.element[0], [ event ].concat( data ) ) === false ||
			event.isDefaultPrevented() );
	}
};

$.each( { show: "fadeIn", hide: "fadeOut" }, function( method, defaultEffect ) {
	$.Widget.prototype[ "_" + method ] = function( element, options, callback ) {
		if ( typeof options === "string" ) {
			options = { effect: options };
		}
		var hasOptions,
			effectName = !options ?
				method :
				options === true || typeof options === "number" ?
					defaultEffect :
					options.effect || defaultEffect;
		options = options || {};
		if ( typeof options === "number" ) {
			options = { duration: options };
		}
		hasOptions = !$.isEmptyObject( options );
		options.complete = callback;
		if ( options.delay ) {
			element.delay( options.delay );
		}
		if ( hasOptions && $.effects && $.effects.effect[ effectName ] ) {
			element[ method ]( options );
		} else if ( effectName !== method && element[ effectName ] ) {
			element[ effectName ]( options.duration, options.easing, callback );
		} else {
			element.queue(function( next ) {
				$( this )[ method ]();
				if ( callback ) {
					callback.call( element[ 0 ] );
				}
				next();
			});
		}
	};
});

var widget = $.widget;


/*
 * jQuery UI Mouse 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/mouse/
 */


var mouseHandled = false;
$( document ).mouseup( function() {
	mouseHandled = false;
});

var mouse = $.widget("ui.mouse", {
	version: "1.11.4",
	options: {
		cancel: "input,textarea,button,select,option",
		distance: 1,
		delay: 0
	},
	_mouseInit: function() {
		var that = this;

		this.element
			.bind("mousedown." + this.widgetName, function(event) {
				return that._mouseDown(event);
			})
			.bind("click." + this.widgetName, function(event) {
				if (true === $.data(event.target, that.widgetName + ".preventClickEvent")) {
					$.removeData(event.target, that.widgetName + ".preventClickEvent");
					event.stopImmediatePropagation();
					return false;
				}
			});

		this.started = false;
	},

	// TODO: make sure destroying one instance of mouse doesn't mess with
	// other instances of mouse
	_mouseDestroy: function() {
		this.element.unbind("." + this.widgetName);
		if ( this._mouseMoveDelegate ) {
			this.document
				.unbind("mousemove." + this.widgetName, this._mouseMoveDelegate)
				.unbind("mouseup." + this.widgetName, this._mouseUpDelegate);
		}
	},

	_mouseDown: function(event) {
		// don't let more than one widget handle mouseStart
		if ( mouseHandled ) {
			return;
		}

		this._mouseMoved = false;

		// we may have missed mouseup (out of window)
		(this._mouseStarted && this._mouseUp(event));

		this._mouseDownEvent = event;

		var that = this,
			btnIsLeft = (event.which === 1),
			// event.target.nodeName works around a bug in IE 8 with
			// disabled inputs (#7620)
			elIsCancel = (typeof this.options.cancel === "string" && event.target.nodeName ? $(event.target).closest(this.options.cancel).length : false);
		if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
			return true;
		}

		this.mouseDelayMet = !this.options.delay;
		if (!this.mouseDelayMet) {
			this._mouseDelayTimer = setTimeout(function() {
				that.mouseDelayMet = true;
			}, this.options.delay);
		}

		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
			this._mouseStarted = (this._mouseStart(event) !== false);
			if (!this._mouseStarted) {
				event.preventDefault();
				return true;
			}
		}

		// Click event may never have fired (Gecko & Opera)
		if (true === $.data(event.target, this.widgetName + ".preventClickEvent")) {
			$.removeData(event.target, this.widgetName + ".preventClickEvent");
		}

		// these delegates are required to keep context
		this._mouseMoveDelegate = function(event) {
			return that._mouseMove(event);
		};
		this._mouseUpDelegate = function(event) {
			return that._mouseUp(event);
		};

		this.document
			.bind( "mousemove." + this.widgetName, this._mouseMoveDelegate )
			.bind( "mouseup." + this.widgetName, this._mouseUpDelegate );

		event.preventDefault();

		mouseHandled = true;
		return true;
	},

	_mouseMove: function(event) {
		// Only check for mouseups outside the document if you've moved inside the document
		// at least once. This prevents the firing of mouseup in the case of IE<9, which will
		// fire a mousemove event if content is placed under the cursor. See #7778
		// Support: IE <9
		if ( this._mouseMoved ) {
			// IE mouseup check - mouseup happened when mouse was out of window
			if ($.ui.ie && ( !document.documentMode || document.documentMode < 9 ) && !event.button) {
				return this._mouseUp(event);

			// Iframe mouseup check - mouseup occurred in another document
			} else if ( !event.which ) {
				return this._mouseUp( event );
			}
		}

		if ( event.which || event.button ) {
			this._mouseMoved = true;
		}

		if (this._mouseStarted) {
			this._mouseDrag(event);
			return event.preventDefault();
		}

		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
			this._mouseStarted =
				(this._mouseStart(this._mouseDownEvent, event) !== false);
			(this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
		}

		return !this._mouseStarted;
	},

	_mouseUp: function(event) {
		this.document
			.unbind( "mousemove." + this.widgetName, this._mouseMoveDelegate )
			.unbind( "mouseup." + this.widgetName, this._mouseUpDelegate );

		if (this._mouseStarted) {
			this._mouseStarted = false;

			if (event.target === this._mouseDownEvent.target) {
				$.data(event.target, this.widgetName + ".preventClickEvent", true);
			}

			this._mouseStop(event);
		}

		mouseHandled = false;
		return false;
	},

	_mouseDistanceMet: function(event) {
		return (Math.max(
				Math.abs(this._mouseDownEvent.pageX - event.pageX),
				Math.abs(this._mouseDownEvent.pageY - event.pageY)
			) >= this.options.distance
		);
	},

	_mouseDelayMet: function(/* event */) {
		return this.mouseDelayMet;
	},

	// These are placeholder methods, to be overriden by extending plugin
	_mouseStart: function(/* event */) {},
	_mouseDrag: function(/* event */) {},
	_mouseStop: function(/* event */) {},
	_mouseCapture: function(/* event */) { return true; }
});


/*
 * jQuery UI Position 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/position/
 */

(function() {

$.ui = $.ui || {};

var cachedScrollbarWidth, supportsOffsetFractions,
	max = Math.max,
	abs = Math.abs,
	round = Math.round,
	rhorizontal = /left|center|right/,
	rvertical = /top|center|bottom/,
	roffset = /[\+\-]\d+(\.[\d]+)?%?/,
	rposition = /^\w+/,
	rpercent = /%$/,
	_position = $.fn.position;

function getOffsets( offsets, width, height ) {
	return [
		parseFloat( offsets[ 0 ] ) * ( rpercent.test( offsets[ 0 ] ) ? width / 100 : 1 ),
		parseFloat( offsets[ 1 ] ) * ( rpercent.test( offsets[ 1 ] ) ? height / 100 : 1 )
	];
}

function parseCss( element, property ) {
	return parseInt( $.css( element, property ), 10 ) || 0;
}

function getDimensions( elem ) {
	var raw = elem[0];
	if ( raw.nodeType === 9 ) {
		return {
			width: elem.width(),
			height: elem.height(),
			offset: { top: 0, left: 0 }
		};
	}
	if ( $.isWindow( raw ) ) {
		return {
			width: elem.width(),
			height: elem.height(),
			offset: { top: elem.scrollTop(), left: elem.scrollLeft() }
		};
	}
	if ( raw.preventDefault ) {
		return {
			width: 0,
			height: 0,
			offset: { top: raw.pageY, left: raw.pageX }
		};
	}
	return {
		width: elem.outerWidth(),
		height: elem.outerHeight(),
		offset: elem.offset()
	};
}

$.position = {
	scrollbarWidth: function() {
		if ( cachedScrollbarWidth !== undefined ) {
			return cachedScrollbarWidth;
		}
		var w1, w2,
			div = $( "<div style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>" ),
			innerDiv = div.children()[0];

		$( "body" ).append( div );
		w1 = innerDiv.offsetWidth;
		div.css( "overflow", "scroll" );

		w2 = innerDiv.offsetWidth;

		if ( w1 === w2 ) {
			w2 = div[0].clientWidth;
		}

		div.remove();

		return (cachedScrollbarWidth = w1 - w2);
	},
	getScrollInfo: function( within ) {
		var overflowX = within.isWindow || within.isDocument ? "" :
				within.element.css( "overflow-x" ),
			overflowY = within.isWindow || within.isDocument ? "" :
				within.element.css( "overflow-y" ),
			hasOverflowX = overflowX === "scroll" ||
				( overflowX === "auto" && within.width < within.element[0].scrollWidth ),
			hasOverflowY = overflowY === "scroll" ||
				( overflowY === "auto" && within.height < within.element[0].scrollHeight );
		return {
			width: hasOverflowY ? $.position.scrollbarWidth() : 0,
			height: hasOverflowX ? $.position.scrollbarWidth() : 0
		};
	},
	getWithinInfo: function( element ) {
		var withinElement = $( element || window ),
			isWindow = $.isWindow( withinElement[0] ),
			isDocument = !!withinElement[ 0 ] && withinElement[ 0 ].nodeType === 9;
		return {
			element: withinElement,
			isWindow: isWindow,
			isDocument: isDocument,
			offset: withinElement.offset() || { left: 0, top: 0 },
			scrollLeft: withinElement.scrollLeft(),
			scrollTop: withinElement.scrollTop(),

			// support: jQuery 1.6.x
			// jQuery 1.6 doesn't support .outerWidth/Height() on documents or windows
			width: isWindow || isDocument ? withinElement.width() : withinElement.outerWidth(),
			height: isWindow || isDocument ? withinElement.height() : withinElement.outerHeight()
		};
	}
};

$.fn.position = function( options ) {
	if ( !options || !options.of ) {
		return _position.apply( this, arguments );
	}

	// make a copy, we don't want to modify arguments
	options = $.extend( {}, options );

	var atOffset, targetWidth, targetHeight, targetOffset, basePosition, dimensions,
		target = $( options.of ),
		within = $.position.getWithinInfo( options.within ),
		scrollInfo = $.position.getScrollInfo( within ),
		collision = ( options.collision || "flip" ).split( " " ),
		offsets = {};

	dimensions = getDimensions( target );
	if ( target[0].preventDefault ) {
		// force left top to allow flipping
		options.at = "left top";
	}
	targetWidth = dimensions.width;
	targetHeight = dimensions.height;
	targetOffset = dimensions.offset;
	// clone to reuse original targetOffset later
	basePosition = $.extend( {}, targetOffset );

	// force my and at to have valid horizontal and vertical positions
	// if a value is missing or invalid, it will be converted to center
	$.each( [ "my", "at" ], function() {
		var pos = ( options[ this ] || "" ).split( " " ),
			horizontalOffset,
			verticalOffset;

		if ( pos.length === 1) {
			pos = rhorizontal.test( pos[ 0 ] ) ?
				pos.concat( [ "center" ] ) :
				rvertical.test( pos[ 0 ] ) ?
					[ "center" ].concat( pos ) :
					[ "center", "center" ];
		}
		pos[ 0 ] = rhorizontal.test( pos[ 0 ] ) ? pos[ 0 ] : "center";
		pos[ 1 ] = rvertical.test( pos[ 1 ] ) ? pos[ 1 ] : "center";

		// calculate offsets
		horizontalOffset = roffset.exec( pos[ 0 ] );
		verticalOffset = roffset.exec( pos[ 1 ] );
		offsets[ this ] = [
			horizontalOffset ? horizontalOffset[ 0 ] : 0,
			verticalOffset ? verticalOffset[ 0 ] : 0
		];

		// reduce to just the positions without the offsets
		options[ this ] = [
			rposition.exec( pos[ 0 ] )[ 0 ],
			rposition.exec( pos[ 1 ] )[ 0 ]
		];
	});

	// normalize collision option
	if ( collision.length === 1 ) {
		collision[ 1 ] = collision[ 0 ];
	}

	if ( options.at[ 0 ] === "right" ) {
		basePosition.left += targetWidth;
	} else if ( options.at[ 0 ] === "center" ) {
		basePosition.left += targetWidth / 2;
	}

	if ( options.at[ 1 ] === "bottom" ) {
		basePosition.top += targetHeight;
	} else if ( options.at[ 1 ] === "center" ) {
		basePosition.top += targetHeight / 2;
	}

	atOffset = getOffsets( offsets.at, targetWidth, targetHeight );
	basePosition.left += atOffset[ 0 ];
	basePosition.top += atOffset[ 1 ];

	return this.each(function() {
		var collisionPosition, using,
			elem = $( this ),
			elemWidth = elem.outerWidth(),
			elemHeight = elem.outerHeight(),
			marginLeft = parseCss( this, "marginLeft" ),
			marginTop = parseCss( this, "marginTop" ),
			collisionWidth = elemWidth + marginLeft + parseCss( this, "marginRight" ) + scrollInfo.width,
			collisionHeight = elemHeight + marginTop + parseCss( this, "marginBottom" ) + scrollInfo.height,
			position = $.extend( {}, basePosition ),
			myOffset = getOffsets( offsets.my, elem.outerWidth(), elem.outerHeight() );

		if ( options.my[ 0 ] === "right" ) {
			position.left -= elemWidth;
		} else if ( options.my[ 0 ] === "center" ) {
			position.left -= elemWidth / 2;
		}

		if ( options.my[ 1 ] === "bottom" ) {
			position.top -= elemHeight;
		} else if ( options.my[ 1 ] === "center" ) {
			position.top -= elemHeight / 2;
		}

		position.left += myOffset[ 0 ];
		position.top += myOffset[ 1 ];

		// if the browser doesn't support fractions, then round for consistent results
		if ( !supportsOffsetFractions ) {
			position.left = round( position.left );
			position.top = round( position.top );
		}

		collisionPosition = {
			marginLeft: marginLeft,
			marginTop: marginTop
		};

		$.each( [ "left", "top" ], function( i, dir ) {
			if ( $.ui.position[ collision[ i ] ] ) {
				$.ui.position[ collision[ i ] ][ dir ]( position, {
					targetWidth: targetWidth,
					targetHeight: targetHeight,
					elemWidth: elemWidth,
					elemHeight: elemHeight,
					collisionPosition: collisionPosition,
					collisionWidth: collisionWidth,
					collisionHeight: collisionHeight,
					offset: [ atOffset[ 0 ] + myOffset[ 0 ], atOffset [ 1 ] + myOffset[ 1 ] ],
					my: options.my,
					at: options.at,
					within: within,
					elem: elem
				});
			}
		});

		if ( options.using ) {
			// adds feedback as second argument to using callback, if present
			using = function( props ) {
				var left = targetOffset.left - position.left,
					right = left + targetWidth - elemWidth,
					top = targetOffset.top - position.top,
					bottom = top + targetHeight - elemHeight,
					feedback = {
						target: {
							element: target,
							left: targetOffset.left,
							top: targetOffset.top,
							width: targetWidth,
							height: targetHeight
						},
						element: {
							element: elem,
							left: position.left,
							top: position.top,
							width: elemWidth,
							height: elemHeight
						},
						horizontal: right < 0 ? "left" : left > 0 ? "right" : "center",
						vertical: bottom < 0 ? "top" : top > 0 ? "bottom" : "middle"
					};
				if ( targetWidth < elemWidth && abs( left + right ) < targetWidth ) {
					feedback.horizontal = "center";
				}
				if ( targetHeight < elemHeight && abs( top + bottom ) < targetHeight ) {
					feedback.vertical = "middle";
				}
				if ( max( abs( left ), abs( right ) ) > max( abs( top ), abs( bottom ) ) ) {
					feedback.important = "horizontal";
				} else {
					feedback.important = "vertical";
				}
				options.using.call( this, props, feedback );
			};
		}

		elem.offset( $.extend( position, { using: using } ) );
	});
};

$.ui.position = {
	fit: {
		left: function( position, data ) {
			var within = data.within,
				withinOffset = within.isWindow ? within.scrollLeft : within.offset.left,
				outerWidth = within.width,
				collisionPosLeft = position.left - data.collisionPosition.marginLeft,
				overLeft = withinOffset - collisionPosLeft,
				overRight = collisionPosLeft + data.collisionWidth - outerWidth - withinOffset,
				newOverRight;

			// element is wider than within
			if ( data.collisionWidth > outerWidth ) {
				// element is initially over the left side of within
				if ( overLeft > 0 && overRight <= 0 ) {
					newOverRight = position.left + overLeft + data.collisionWidth - outerWidth - withinOffset;
					position.left += overLeft - newOverRight;
				// element is initially over right side of within
				} else if ( overRight > 0 && overLeft <= 0 ) {
					position.left = withinOffset;
				// element is initially over both left and right sides of within
				} else {
					if ( overLeft > overRight ) {
						position.left = withinOffset + outerWidth - data.collisionWidth;
					} else {
						position.left = withinOffset;
					}
				}
			// too far left -> align with left edge
			} else if ( overLeft > 0 ) {
				position.left += overLeft;
			// too far right -> align with right edge
			} else if ( overRight > 0 ) {
				position.left -= overRight;
			// adjust based on position and margin
			} else {
				position.left = max( position.left - collisionPosLeft, position.left );
			}
		},
		top: function( position, data ) {
			var within = data.within,
				withinOffset = within.isWindow ? within.scrollTop : within.offset.top,
				outerHeight = data.within.height,
				collisionPosTop = position.top - data.collisionPosition.marginTop,
				overTop = withinOffset - collisionPosTop,
				overBottom = collisionPosTop + data.collisionHeight - outerHeight - withinOffset,
				newOverBottom;

			// element is taller than within
			if ( data.collisionHeight > outerHeight ) {
				// element is initially over the top of within
				if ( overTop > 0 && overBottom <= 0 ) {
					newOverBottom = position.top + overTop + data.collisionHeight - outerHeight - withinOffset;
					position.top += overTop - newOverBottom;
				// element is initially over bottom of within
				} else if ( overBottom > 0 && overTop <= 0 ) {
					position.top = withinOffset;
				// element is initially over both top and bottom of within
				} else {
					if ( overTop > overBottom ) {
						position.top = withinOffset + outerHeight - data.collisionHeight;
					} else {
						position.top = withinOffset;
					}
				}
			// too far up -> align with top
			} else if ( overTop > 0 ) {
				position.top += overTop;
			// too far down -> align with bottom edge
			} else if ( overBottom > 0 ) {
				position.top -= overBottom;
			// adjust based on position and margin
			} else {
				position.top = max( position.top - collisionPosTop, position.top );
			}
		}
	},
	flip: {
		left: function( position, data ) {
			var within = data.within,
				withinOffset = within.offset.left + within.scrollLeft,
				outerWidth = within.width,
				offsetLeft = within.isWindow ? within.scrollLeft : within.offset.left,
				collisionPosLeft = position.left - data.collisionPosition.marginLeft,
				overLeft = collisionPosLeft - offsetLeft,
				overRight = collisionPosLeft + data.collisionWidth - outerWidth - offsetLeft,
				myOffset = data.my[ 0 ] === "left" ?
					-data.elemWidth :
					data.my[ 0 ] === "right" ?
						data.elemWidth :
						0,
				atOffset = data.at[ 0 ] === "left" ?
					data.targetWidth :
					data.at[ 0 ] === "right" ?
						-data.targetWidth :
						0,
				offset = -2 * data.offset[ 0 ],
				newOverRight,
				newOverLeft;

			if ( overLeft < 0 ) {
				newOverRight = position.left + myOffset + atOffset + offset + data.collisionWidth - outerWidth - withinOffset;
				if ( newOverRight < 0 || newOverRight < abs( overLeft ) ) {
					position.left += myOffset + atOffset + offset;
				}
			} else if ( overRight > 0 ) {
				newOverLeft = position.left - data.collisionPosition.marginLeft + myOffset + atOffset + offset - offsetLeft;
				if ( newOverLeft > 0 || abs( newOverLeft ) < overRight ) {
					position.left += myOffset + atOffset + offset;
				}
			}
		},
		top: function( position, data ) {
			var within = data.within,
				withinOffset = within.offset.top + within.scrollTop,
				outerHeight = within.height,
				offsetTop = within.isWindow ? within.scrollTop : within.offset.top,
				collisionPosTop = position.top - data.collisionPosition.marginTop,
				overTop = collisionPosTop - offsetTop,
				overBottom = collisionPosTop + data.collisionHeight - outerHeight - offsetTop,
				top = data.my[ 1 ] === "top",
				myOffset = top ?
					-data.elemHeight :
					data.my[ 1 ] === "bottom" ?
						data.elemHeight :
						0,
				atOffset = data.at[ 1 ] === "top" ?
					data.targetHeight :
					data.at[ 1 ] === "bottom" ?
						-data.targetHeight :
						0,
				offset = -2 * data.offset[ 1 ],
				newOverTop,
				newOverBottom;
			if ( overTop < 0 ) {
				newOverBottom = position.top + myOffset + atOffset + offset + data.collisionHeight - outerHeight - withinOffset;
				if ( newOverBottom < 0 || newOverBottom < abs( overTop ) ) {
					position.top += myOffset + atOffset + offset;
				}
			} else if ( overBottom > 0 ) {
				newOverTop = position.top - data.collisionPosition.marginTop + myOffset + atOffset + offset - offsetTop;
				if ( newOverTop > 0 || abs( newOverTop ) < overBottom ) {
					position.top += myOffset + atOffset + offset;
				}
			}
		}
	},
	flipfit: {
		left: function() {
			$.ui.position.flip.left.apply( this, arguments );
			$.ui.position.fit.left.apply( this, arguments );
		},
		top: function() {
			$.ui.position.flip.top.apply( this, arguments );
			$.ui.position.fit.top.apply( this, arguments );
		}
	}
};

// fraction support test
(function() {
	var testElement, testElementParent, testElementStyle, offsetLeft, i,
		body = document.getElementsByTagName( "body" )[ 0 ],
		div = document.createElement( "div" );

	//Create a "fake body" for testing based on method used in jQuery.support
	testElement = document.createElement( body ? "div" : "body" );
	testElementStyle = {
		visibility: "hidden",
		width: 0,
		height: 0,
		border: 0,
		margin: 0,
		background: "none"
	};
	if ( body ) {
		$.extend( testElementStyle, {
			position: "absolute",
			left: "-1000px",
			top: "-1000px"
		});
	}
	for ( i in testElementStyle ) {
		testElement.style[ i ] = testElementStyle[ i ];
	}
	testElement.appendChild( div );
	testElementParent = body || document.documentElement;
	testElementParent.insertBefore( testElement, testElementParent.firstChild );

	div.style.cssText = "position: absolute; left: 10.7432222px;";

	offsetLeft = $( div ).offset().left;
	supportsOffsetFractions = offsetLeft > 10 && offsetLeft < 11;

	testElement.innerHTML = "";
	testElementParent.removeChild( testElement );
})();

})();

var position = $.ui.position;


/*
 * jQuery UI Draggable 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/draggable/
 */


$.widget("ui.draggable", $.ui.mouse, {
	version: "1.11.4",
	widgetEventPrefix: "drag",
	options: {
		addClasses: true,
		appendTo: "parent",
		axis: false,
		connectToSortable: false,
		containment: false,
		cursor: "auto",
		cursorAt: false,
		grid: false,
		handle: false,
		helper: "original",
		iframeFix: false,
		opacity: false,
		refreshPositions: false,
		revert: false,
		revertDuration: 500,
		scope: "default",
		scroll: true,
		scrollSensitivity: 20,
		scrollSpeed: 20,
		snap: false,
		snapMode: "both",
		snapTolerance: 20,
		stack: false,
		zIndex: false,

		// callbacks
		drag: null,
		start: null,
		stop: null
	},
	_create: function() {

		if ( this.options.helper === "original" ) {
			this._setPositionRelative();
		}
		if (this.options.addClasses){
			this.element.addClass("ui-draggable");
		}
		if (this.options.disabled){
			this.element.addClass("ui-draggable-disabled");
		}
		this._setHandleClassName();

		this._mouseInit();
	},

	_setOption: function( key, value ) {
		this._super( key, value );
		if ( key === "handle" ) {
			this._removeHandleClassName();
			this._setHandleClassName();
		}
	},

	_destroy: function() {
		if ( ( this.helper || this.element ).is( ".ui-draggable-dragging" ) ) {
			this.destroyOnClear = true;
			return;
		}
		this.element.removeClass( "ui-draggable ui-draggable-dragging ui-draggable-disabled" );
		this._removeHandleClassName();
		this._mouseDestroy();
	},

	_mouseCapture: function(event) {
		var o = this.options;

		this._blurActiveElement( event );

		// among others, prevent a drag on a resizable-handle
		if (this.helper || o.disabled || $(event.target).closest(".ui-resizable-handle").length > 0) {
			return false;
		}

		//Quit if we're not on a valid handle
		this.handle = this._getHandle(event);
		if (!this.handle) {
			return false;
		}

		this._blockFrames( o.iframeFix === true ? "iframe" : o.iframeFix );

		return true;

	},

	_blockFrames: function( selector ) {
		this.iframeBlocks = this.document.find( selector ).map(function() {
			var iframe = $( this );

			return $( "<div>" )
				.css( "position", "absolute" )
				.appendTo( iframe.parent() )
				.outerWidth( iframe.outerWidth() )
				.outerHeight( iframe.outerHeight() )
				.offset( iframe.offset() )[ 0 ];
		});
	},

	_unblockFrames: function() {
		if ( this.iframeBlocks ) {
			this.iframeBlocks.remove();
			delete this.iframeBlocks;
		}
	},

	_blurActiveElement: function( event ) {
		var document = this.document[ 0 ];

		// Only need to blur if the event occurred on the draggable itself, see #10527
		if ( !this.handleElement.is( event.target ) ) {
			return;
		}

		// support: IE9
		// IE9 throws an "Unspecified error" accessing document.activeElement from an <iframe>
		try {

			// Support: IE9, IE10
			// If the <body> is blurred, IE will switch windows, see #9520
			if ( document.activeElement && document.activeElement.nodeName.toLowerCase() !== "body" ) {

				// Blur any element that currently has focus, see #4261
				$( document.activeElement ).blur();
			}
		} catch ( error ) {}
	},

	_mouseStart: function(event) {

		var o = this.options;

		//Create and append the visible helper
		this.helper = this._createHelper(event);

		this.helper.addClass("ui-draggable-dragging");

		//Cache the helper size
		this._cacheHelperProportions();

		//If ddmanager is used for droppables, set the global draggable
		if ($.ui.ddmanager) {
			$.ui.ddmanager.current = this;
		}

		/*
		 * - Position generation -
		 * This block generates everything position related - it's the core of draggables.
		 */

		//Cache the margins of the original element
		this._cacheMargins();

		//Store the helper's css position
		this.cssPosition = this.helper.css( "position" );
		this.scrollParent = this.helper.scrollParent( true );
		this.offsetParent = this.helper.offsetParent();
		this.hasFixedAncestor = this.helper.parents().filter(function() {
				return $( this ).css( "position" ) === "fixed";
			}).length > 0;

		//The element's absolute position on the page minus margins
		this.positionAbs = this.element.offset();
		this._refreshOffsets( event );

		//Generate the original position
		this.originalPosition = this.position = this._generatePosition( event, false );
		this.originalPageX = event.pageX;
		this.originalPageY = event.pageY;

		//Adjust the mouse offset relative to the helper if "cursorAt" is supplied
		(o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt));

		//Set a containment if given in the options
		this._setContainment();

		//Trigger event + callbacks
		if (this._trigger("start", event) === false) {
			this._clear();
			return false;
		}

		//Recache the helper size
		this._cacheHelperProportions();

		//Prepare the droppable offsets
		if ($.ui.ddmanager && !o.dropBehaviour) {
			$.ui.ddmanager.prepareOffsets(this, event);
		}

		// Reset helper's right/bottom css if they're set and set explicit width/height instead
		// as this prevents resizing of elements with right/bottom set (see #7772)
		this._normalizeRightBottom();

		this._mouseDrag(event, true); //Execute the drag once - this causes the helper not to be visible before getting its correct position

		//If the ddmanager is used for droppables, inform the manager that dragging has started (see #5003)
		if ( $.ui.ddmanager ) {
			$.ui.ddmanager.dragStart(this, event);
		}

		return true;
	},

	_refreshOffsets: function( event ) {
		this.offset = {
			top: this.positionAbs.top - this.margins.top,
			left: this.positionAbs.left - this.margins.left,
			scroll: false,
			parent: this._getParentOffset(),
			relative: this._getRelativeOffset()
		};

		this.offset.click = {
			left: event.pageX - this.offset.left,
			top: event.pageY - this.offset.top
		};
	},

	_mouseDrag: function(event, noPropagation) {
		// reset any necessary cached properties (see #5009)
		if ( this.hasFixedAncestor ) {
			this.offset.parent = this._getParentOffset();
		}

		//Compute the helpers position
		this.position = this._generatePosition( event, true );
		this.positionAbs = this._convertPositionTo("absolute");

		//Call plugins and callbacks and use the resulting position if something is returned
		if (!noPropagation) {
			var ui = this._uiHash();
			if (this._trigger("drag", event, ui) === false) {
				this._mouseUp({});
				return false;
			}
			this.position = ui.position;
		}

		this.helper[ 0 ].style.left = this.position.left + "px";
		this.helper[ 0 ].style.top = this.position.top + "px";

		if ($.ui.ddmanager) {
			$.ui.ddmanager.drag(this, event);
		}

		return false;
	},

	_mouseStop: function(event) {

		//If we are using droppables, inform the manager about the drop
		var that = this,
			dropped = false;
		if ($.ui.ddmanager && !this.options.dropBehaviour) {
			dropped = $.ui.ddmanager.drop(this, event);
		}

		//if a drop comes from outside (a sortable)
		if (this.dropped) {
			dropped = this.dropped;
			this.dropped = false;
		}

		if ((this.options.revert === "invalid" && !dropped) || (this.options.revert === "valid" && dropped) || this.options.revert === true || ($.isFunction(this.options.revert) && this.options.revert.call(this.element, dropped))) {
			$(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function() {
				if (that._trigger("stop", event) !== false) {
					that._clear();
				}
			});
		} else {
			if (this._trigger("stop", event) !== false) {
				this._clear();
			}
		}

		return false;
	},

	_mouseUp: function( event ) {
		this._unblockFrames();

		//If the ddmanager is used for droppables, inform the manager that dragging has stopped (see #5003)
		if ( $.ui.ddmanager ) {
			$.ui.ddmanager.dragStop(this, event);
		}

		// Only need to focus if the event occurred on the draggable itself, see #10527
		if ( this.handleElement.is( event.target ) ) {
			// The interaction is over; whether or not the click resulted in a drag, focus the element
			this.element.focus();
		}

		return $.ui.mouse.prototype._mouseUp.call(this, event);
	},

	cancel: function() {

		if (this.helper.is(".ui-draggable-dragging")) {
			this._mouseUp({});
		} else {
			this._clear();
		}

		return this;

	},

	_getHandle: function(event) {
		return this.options.handle ?
			!!$( event.target ).closest( this.element.find( this.options.handle ) ).length :
			true;
	},

	_setHandleClassName: function() {
		this.handleElement = this.options.handle ?
			this.element.find( this.options.handle ) : this.element;
		this.handleElement.addClass( "ui-draggable-handle" );
	},

	_removeHandleClassName: function() {
		this.handleElement.removeClass( "ui-draggable-handle" );
	},

	_createHelper: function(event) {

		var o = this.options,
			helperIsFunction = $.isFunction( o.helper ),
			helper = helperIsFunction ?
				$( o.helper.apply( this.element[ 0 ], [ event ] ) ) :
				( o.helper === "clone" ?
					this.element.clone().removeAttr( "id" ) :
					this.element );

		if (!helper.parents("body").length) {
			helper.appendTo((o.appendTo === "parent" ? this.element[0].parentNode : o.appendTo));
		}

		// http://bugs.jqueryui.com/ticket/9446
		// a helper function can return the original element
		// which wouldn't have been set to relative in _create
		if ( helperIsFunction && helper[ 0 ] === this.element[ 0 ] ) {
			this._setPositionRelative();
		}

		if (helper[0] !== this.element[0] && !(/(fixed|absolute)/).test(helper.css("position"))) {
			helper.css("position", "absolute");
		}

		return helper;

	},

	_setPositionRelative: function() {
		if ( !( /^(?:r|a|f)/ ).test( this.element.css( "position" ) ) ) {
			this.element[ 0 ].style.position = "relative";
		}
	},

	_adjustOffsetFromHelper: function(obj) {
		if (typeof obj === "string") {
			obj = obj.split(" ");
		}
		if ($.isArray(obj)) {
			obj = { left: +obj[0], top: +obj[1] || 0 };
		}
		if ("left" in obj) {
			this.offset.click.left = obj.left + this.margins.left;
		}
		if ("right" in obj) {
			this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
		}
		if ("top" in obj) {
			this.offset.click.top = obj.top + this.margins.top;
		}
		if ("bottom" in obj) {
			this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
		}
	},

	_isRootNode: function( element ) {
		return ( /(html|body)/i ).test( element.tagName ) || element === this.document[ 0 ];
	},

	_getParentOffset: function() {

		//Get the offsetParent and cache its position
		var po = this.offsetParent.offset(),
			document = this.document[ 0 ];

		// This is a special case where we need to modify a offset calculated on start, since the following happened:
		// 1. The position of the helper is absolute, so it's position is calculated based on the next positioned parent
		// 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't the document, which means that
		//    the scroll is included in the initial calculation of the offset of the parent, and never recalculated upon drag
		if (this.cssPosition === "absolute" && this.scrollParent[0] !== document && $.contains(this.scrollParent[0], this.offsetParent[0])) {
			po.left += this.scrollParent.scrollLeft();
			po.top += this.scrollParent.scrollTop();
		}

		if ( this._isRootNode( this.offsetParent[ 0 ] ) ) {
			po = { top: 0, left: 0 };
		}

		return {
			top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
			left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
		};

	},

	_getRelativeOffset: function() {
		if ( this.cssPosition !== "relative" ) {
			return { top: 0, left: 0 };
		}

		var p = this.element.position(),
			scrollIsRootNode = this._isRootNode( this.scrollParent[ 0 ] );

		return {
			top: p.top - ( parseInt(this.helper.css( "top" ), 10) || 0 ) + ( !scrollIsRootNode ? this.scrollParent.scrollTop() : 0 ),
			left: p.left - ( parseInt(this.helper.css( "left" ), 10) || 0 ) + ( !scrollIsRootNode ? this.scrollParent.scrollLeft() : 0 )
		};

	},

	_cacheMargins: function() {
		this.margins = {
			left: (parseInt(this.element.css("marginLeft"), 10) || 0),
			top: (parseInt(this.element.css("marginTop"), 10) || 0),
			right: (parseInt(this.element.css("marginRight"), 10) || 0),
			bottom: (parseInt(this.element.css("marginBottom"), 10) || 0)
		};
	},

	_cacheHelperProportions: function() {
		this.helperProportions = {
			width: this.helper.outerWidth(),
			height: this.helper.outerHeight()
		};
	},

	_setContainment: function() {

		var isUserScrollable, c, ce,
			o = this.options,
			document = this.document[ 0 ];

		this.relativeContainer = null;

		if ( !o.containment ) {
			this.containment = null;
			return;
		}

		if ( o.containment === "window" ) {
			this.containment = [
				$( window ).scrollLeft() - this.offset.relative.left - this.offset.parent.left,
				$( window ).scrollTop() - this.offset.relative.top - this.offset.parent.top,
				$( window ).scrollLeft() + $( window ).width() - this.helperProportions.width - this.margins.left,
				$( window ).scrollTop() + ( $( window ).height() || document.body.parentNode.scrollHeight ) - this.helperProportions.height - this.margins.top
			];
			return;
		}

		if ( o.containment === "document") {
			this.containment = [
				0,
				0,
				$( document ).width() - this.helperProportions.width - this.margins.left,
				( $( document ).height() || document.body.parentNode.scrollHeight ) - this.helperProportions.height - this.margins.top
			];
			return;
		}

		if ( o.containment.constructor === Array ) {
			this.containment = o.containment;
			return;
		}

		if ( o.containment === "parent" ) {
			o.containment = this.helper[ 0 ].parentNode;
		}

		c = $( o.containment );
		ce = c[ 0 ];

		if ( !ce ) {
			return;
		}

		isUserScrollable = /(scroll|auto)/.test( c.css( "overflow" ) );

		this.containment = [
			( parseInt( c.css( "borderLeftWidth" ), 10 ) || 0 ) + ( parseInt( c.css( "paddingLeft" ), 10 ) || 0 ),
			( parseInt( c.css( "borderTopWidth" ), 10 ) || 0 ) + ( parseInt( c.css( "paddingTop" ), 10 ) || 0 ),
			( isUserScrollable ? Math.max( ce.scrollWidth, ce.offsetWidth ) : ce.offsetWidth ) -
				( parseInt( c.css( "borderRightWidth" ), 10 ) || 0 ) -
				( parseInt( c.css( "paddingRight" ), 10 ) || 0 ) -
				this.helperProportions.width -
				this.margins.left -
				this.margins.right,
			( isUserScrollable ? Math.max( ce.scrollHeight, ce.offsetHeight ) : ce.offsetHeight ) -
				( parseInt( c.css( "borderBottomWidth" ), 10 ) || 0 ) -
				( parseInt( c.css( "paddingBottom" ), 10 ) || 0 ) -
				this.helperProportions.height -
				this.margins.top -
				this.margins.bottom
		];
		this.relativeContainer = c;
	},

	_convertPositionTo: function(d, pos) {

		if (!pos) {
			pos = this.position;
		}

		var mod = d === "absolute" ? 1 : -1,
			scrollIsRootNode = this._isRootNode( this.scrollParent[ 0 ] );

		return {
			top: (
				pos.top	+																// The absolute mouse position
				this.offset.relative.top * mod +										// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.top * mod -										// The offsetParent's offset without borders (offset + border)
				( ( this.cssPosition === "fixed" ? -this.offset.scroll.top : ( scrollIsRootNode ? 0 : this.offset.scroll.top ) ) * mod)
			),
			left: (
				pos.left +																// The absolute mouse position
				this.offset.relative.left * mod +										// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.left * mod	-										// The offsetParent's offset without borders (offset + border)
				( ( this.cssPosition === "fixed" ? -this.offset.scroll.left : ( scrollIsRootNode ? 0 : this.offset.scroll.left ) ) * mod)
			)
		};

	},

	_generatePosition: function( event, constrainPosition ) {

		var containment, co, top, left,
			o = this.options,
			scrollIsRootNode = this._isRootNode( this.scrollParent[ 0 ] ),
			pageX = event.pageX,
			pageY = event.pageY;

		// Cache the scroll
		if ( !scrollIsRootNode || !this.offset.scroll ) {
			this.offset.scroll = {
				top: this.scrollParent.scrollTop(),
				left: this.scrollParent.scrollLeft()
			};
		}

		/*
		 * - Position constraining -
		 * Constrain the position to a mix of grid, containment.
		 */

		// If we are not dragging yet, we won't check for options
		if ( constrainPosition ) {
			if ( this.containment ) {
				if ( this.relativeContainer ){
					co = this.relativeContainer.offset();
					containment = [
						this.containment[ 0 ] + co.left,
						this.containment[ 1 ] + co.top,
						this.containment[ 2 ] + co.left,
						this.containment[ 3 ] + co.top
					];
				} else {
					containment = this.containment;
				}

				if (event.pageX - this.offset.click.left < containment[0]) {
					pageX = containment[0] + this.offset.click.left;
				}
				if (event.pageY - this.offset.click.top < containment[1]) {
					pageY = containment[1] + this.offset.click.top;
				}
				if (event.pageX - this.offset.click.left > containment[2]) {
					pageX = containment[2] + this.offset.click.left;
				}
				if (event.pageY - this.offset.click.top > containment[3]) {
					pageY = containment[3] + this.offset.click.top;
				}
			}

			if (o.grid) {
				//Check for grid elements set to 0 to prevent divide by 0 error causing invalid argument errors in IE (see ticket #6950)
				top = o.grid[1] ? this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1] : this.originalPageY;
				pageY = containment ? ((top - this.offset.click.top >= containment[1] || top - this.offset.click.top > containment[3]) ? top : ((top - this.offset.click.top >= containment[1]) ? top - o.grid[1] : top + o.grid[1])) : top;

				left = o.grid[0] ? this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0] : this.originalPageX;
				pageX = containment ? ((left - this.offset.click.left >= containment[0] || left - this.offset.click.left > containment[2]) ? left : ((left - this.offset.click.left >= containment[0]) ? left - o.grid[0] : left + o.grid[0])) : left;
			}

			if ( o.axis === "y" ) {
				pageX = this.originalPageX;
			}

			if ( o.axis === "x" ) {
				pageY = this.originalPageY;
			}
		}

		return {
			top: (
				pageY -																	// The absolute mouse position
				this.offset.click.top	-												// Click offset (relative to the element)
				this.offset.relative.top -												// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.top +												// The offsetParent's offset without borders (offset + border)
				( this.cssPosition === "fixed" ? -this.offset.scroll.top : ( scrollIsRootNode ? 0 : this.offset.scroll.top ) )
			),
			left: (
				pageX -																	// The absolute mouse position
				this.offset.click.left -												// Click offset (relative to the element)
				this.offset.relative.left -												// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.left +												// The offsetParent's offset without borders (offset + border)
				( this.cssPosition === "fixed" ? -this.offset.scroll.left : ( scrollIsRootNode ? 0 : this.offset.scroll.left ) )
			)
		};

	},

	_clear: function() {
		this.helper.removeClass("ui-draggable-dragging");
		if (this.helper[0] !== this.element[0] && !this.cancelHelperRemoval) {
			this.helper.remove();
		}
		this.helper = null;
		this.cancelHelperRemoval = false;
		if ( this.destroyOnClear ) {
			this.destroy();
		}
	},

	_normalizeRightBottom: function() {
		if ( this.options.axis !== "y" && this.helper.css( "right" ) !== "auto" ) {
			this.helper.width( this.helper.width() );
			this.helper.css( "right", "auto" );
		}
		if ( this.options.axis !== "x" && this.helper.css( "bottom" ) !== "auto" ) {
			this.helper.height( this.helper.height() );
			this.helper.css( "bottom", "auto" );
		}
	},

	// From now on bulk stuff - mainly helpers

	_trigger: function( type, event, ui ) {
		ui = ui || this._uiHash();
		$.ui.plugin.call( this, type, [ event, ui, this ], true );

		// Absolute position and offset (see #6884 ) have to be recalculated after plugins
		if ( /^(drag|start|stop)/.test( type ) ) {
			this.positionAbs = this._convertPositionTo( "absolute" );
			ui.offset = this.positionAbs;
		}
		return $.Widget.prototype._trigger.call( this, type, event, ui );
	},

	plugins: {},

	_uiHash: function() {
		return {
			helper: this.helper,
			position: this.position,
			originalPosition: this.originalPosition,
			offset: this.positionAbs
		};
	}

});

$.ui.plugin.add( "draggable", "connectToSortable", {
	start: function( event, ui, draggable ) {
		var uiSortable = $.extend( {}, ui, {
			item: draggable.element
		});

		draggable.sortables = [];
		$( draggable.options.connectToSortable ).each(function() {
			var sortable = $( this ).sortable( "instance" );

			if ( sortable && !sortable.options.disabled ) {
				draggable.sortables.push( sortable );

				// refreshPositions is called at drag start to refresh the containerCache
				// which is used in drag. This ensures it's initialized and synchronized
				// with any changes that might have happened on the page since initialization.
				sortable.refreshPositions();
				sortable._trigger("activate", event, uiSortable);
			}
		});
	},
	stop: function( event, ui, draggable ) {
		var uiSortable = $.extend( {}, ui, {
			item: draggable.element
		});

		draggable.cancelHelperRemoval = false;

		$.each( draggable.sortables, function() {
			var sortable = this;

			if ( sortable.isOver ) {
				sortable.isOver = 0;

				// Allow this sortable to handle removing the helper
				draggable.cancelHelperRemoval = true;
				sortable.cancelHelperRemoval = false;

				// Use _storedCSS To restore properties in the sortable,
				// as this also handles revert (#9675) since the draggable
				// may have modified them in unexpected ways (#8809)
				sortable._storedCSS = {
					position: sortable.placeholder.css( "position" ),
					top: sortable.placeholder.css( "top" ),
					left: sortable.placeholder.css( "left" )
				};

				sortable._mouseStop(event);

				// Once drag has ended, the sortable should return to using
				// its original helper, not the shared helper from draggable
				sortable.options.helper = sortable.options._helper;
			} else {
				// Prevent this Sortable from removing the helper.
				// However, don't set the draggable to remove the helper
				// either as another connected Sortable may yet handle the removal.
				sortable.cancelHelperRemoval = true;

				sortable._trigger( "deactivate", event, uiSortable );
			}
		});
	},
	drag: function( event, ui, draggable ) {
		$.each( draggable.sortables, function() {
			var innermostIntersecting = false,
				sortable = this;

			// Copy over variables that sortable's _intersectsWith uses
			sortable.positionAbs = draggable.positionAbs;
			sortable.helperProportions = draggable.helperProportions;
			sortable.offset.click = draggable.offset.click;

			if ( sortable._intersectsWith( sortable.containerCache ) ) {
				innermostIntersecting = true;

				$.each( draggable.sortables, function() {
					// Copy over variables that sortable's _intersectsWith uses
					this.positionAbs = draggable.positionAbs;
					this.helperProportions = draggable.helperProportions;
					this.offset.click = draggable.offset.click;

					if ( this !== sortable &&
							this._intersectsWith( this.containerCache ) &&
							$.contains( sortable.element[ 0 ], this.element[ 0 ] ) ) {
						innermostIntersecting = false;
					}

					return innermostIntersecting;
				});
			}

			if ( innermostIntersecting ) {
				// If it intersects, we use a little isOver variable and set it once,
				// so that the move-in stuff gets fired only once.
				if ( !sortable.isOver ) {
					sortable.isOver = 1;

					// Store draggable's parent in case we need to reappend to it later.
					draggable._parent = ui.helper.parent();

					sortable.currentItem = ui.helper
						.appendTo( sortable.element )
						.data( "ui-sortable-item", true );

					// Store helper option to later restore it
					sortable.options._helper = sortable.options.helper;

					sortable.options.helper = function() {
						return ui.helper[ 0 ];
					};

					// Fire the start events of the sortable with our passed browser event,
					// and our own helper (so it doesn't create a new one)
					event.target = sortable.currentItem[ 0 ];
					sortable._mouseCapture( event, true );
					sortable._mouseStart( event, true, true );

					// Because the browser event is way off the new appended portlet,
					// modify necessary variables to reflect the changes
					sortable.offset.click.top = draggable.offset.click.top;
					sortable.offset.click.left = draggable.offset.click.left;
					sortable.offset.parent.left -= draggable.offset.parent.left -
						sortable.offset.parent.left;
					sortable.offset.parent.top -= draggable.offset.parent.top -
						sortable.offset.parent.top;

					draggable._trigger( "toSortable", event );

					// Inform draggable that the helper is in a valid drop zone,
					// used solely in the revert option to handle "valid/invalid".
					draggable.dropped = sortable.element;

					// Need to refreshPositions of all sortables in the case that
					// adding to one sortable changes the location of the other sortables (#9675)
					$.each( draggable.sortables, function() {
						this.refreshPositions();
					});

					// hack so receive/update callbacks work (mostly)
					draggable.currentItem = draggable.element;
					sortable.fromOutside = draggable;
				}

				if ( sortable.currentItem ) {
					sortable._mouseDrag( event );
					// Copy the sortable's position because the draggable's can potentially reflect
					// a relative position, while sortable is always absolute, which the dragged
					// element has now become. (#8809)
					ui.position = sortable.position;
				}
			} else {
				// If it doesn't intersect with the sortable, and it intersected before,
				// we fake the drag stop of the sortable, but make sure it doesn't remove
				// the helper by using cancelHelperRemoval.
				if ( sortable.isOver ) {

					sortable.isOver = 0;
					sortable.cancelHelperRemoval = true;

					// Calling sortable's mouseStop would trigger a revert,
					// so revert must be temporarily false until after mouseStop is called.
					sortable.options._revert = sortable.options.revert;
					sortable.options.revert = false;

					sortable._trigger( "out", event, sortable._uiHash( sortable ) );
					sortable._mouseStop( event, true );

					// restore sortable behaviors that were modfied
					// when the draggable entered the sortable area (#9481)
					sortable.options.revert = sortable.options._revert;
					sortable.options.helper = sortable.options._helper;

					if ( sortable.placeholder ) {
						sortable.placeholder.remove();
					}

					// Restore and recalculate the draggable's offset considering the sortable
					// may have modified them in unexpected ways. (#8809, #10669)
					ui.helper.appendTo( draggable._parent );
					draggable._refreshOffsets( event );
					ui.position = draggable._generatePosition( event, true );

					draggable._trigger( "fromSortable", event );

					// Inform draggable that the helper is no longer in a valid drop zone
					draggable.dropped = false;

					// Need to refreshPositions of all sortables just in case removing
					// from one sortable changes the location of other sortables (#9675)
					$.each( draggable.sortables, function() {
						this.refreshPositions();
					});
				}
			}
		});
	}
});

$.ui.plugin.add("draggable", "cursor", {
	start: function( event, ui, instance ) {
		var t = $( "body" ),
			o = instance.options;

		if (t.css("cursor")) {
			o._cursor = t.css("cursor");
		}
		t.css("cursor", o.cursor);
	},
	stop: function( event, ui, instance ) {
		var o = instance.options;
		if (o._cursor) {
			$("body").css("cursor", o._cursor);
		}
	}
});

$.ui.plugin.add("draggable", "opacity", {
	start: function( event, ui, instance ) {
		var t = $( ui.helper ),
			o = instance.options;
		if (t.css("opacity")) {
			o._opacity = t.css("opacity");
		}
		t.css("opacity", o.opacity);
	},
	stop: function( event, ui, instance ) {
		var o = instance.options;
		if (o._opacity) {
			$(ui.helper).css("opacity", o._opacity);
		}
	}
});

$.ui.plugin.add("draggable", "scroll", {
	start: function( event, ui, i ) {
		if ( !i.scrollParentNotHidden ) {
			i.scrollParentNotHidden = i.helper.scrollParent( false );
		}

		if ( i.scrollParentNotHidden[ 0 ] !== i.document[ 0 ] && i.scrollParentNotHidden[ 0 ].tagName !== "HTML" ) {
			i.overflowOffset = i.scrollParentNotHidden.offset();
		}
	},
	drag: function( event, ui, i  ) {

		var o = i.options,
			scrolled = false,
			scrollParent = i.scrollParentNotHidden[ 0 ],
			document = i.document[ 0 ];

		if ( scrollParent !== document && scrollParent.tagName !== "HTML" ) {
			if ( !o.axis || o.axis !== "x" ) {
				if ( ( i.overflowOffset.top + scrollParent.offsetHeight ) - event.pageY < o.scrollSensitivity ) {
					scrollParent.scrollTop = scrolled = scrollParent.scrollTop + o.scrollSpeed;
				} else if ( event.pageY - i.overflowOffset.top < o.scrollSensitivity ) {
					scrollParent.scrollTop = scrolled = scrollParent.scrollTop - o.scrollSpeed;
				}
			}

			if ( !o.axis || o.axis !== "y" ) {
				if ( ( i.overflowOffset.left + scrollParent.offsetWidth ) - event.pageX < o.scrollSensitivity ) {
					scrollParent.scrollLeft = scrolled = scrollParent.scrollLeft + o.scrollSpeed;
				} else if ( event.pageX - i.overflowOffset.left < o.scrollSensitivity ) {
					scrollParent.scrollLeft = scrolled = scrollParent.scrollLeft - o.scrollSpeed;
				}
			}

		} else {

			if (!o.axis || o.axis !== "x") {
				if (event.pageY - $(document).scrollTop() < o.scrollSensitivity) {
					scrolled = $(document).scrollTop($(document).scrollTop() - o.scrollSpeed);
				} else if ($(window).height() - (event.pageY - $(document).scrollTop()) < o.scrollSensitivity) {
					scrolled = $(document).scrollTop($(document).scrollTop() + o.scrollSpeed);
				}
			}

			if (!o.axis || o.axis !== "y") {
				if (event.pageX - $(document).scrollLeft() < o.scrollSensitivity) {
					scrolled = $(document).scrollLeft($(document).scrollLeft() - o.scrollSpeed);
				} else if ($(window).width() - (event.pageX - $(document).scrollLeft()) < o.scrollSensitivity) {
					scrolled = $(document).scrollLeft($(document).scrollLeft() + o.scrollSpeed);
				}
			}

		}

		if (scrolled !== false && $.ui.ddmanager && !o.dropBehaviour) {
			$.ui.ddmanager.prepareOffsets(i, event);
		}

	}
});

$.ui.plugin.add("draggable", "snap", {
	start: function( event, ui, i ) {

		var o = i.options;

		i.snapElements = [];

		$(o.snap.constructor !== String ? ( o.snap.items || ":data(ui-draggable)" ) : o.snap).each(function() {
			var $t = $(this),
				$o = $t.offset();
			if (this !== i.element[0]) {
				i.snapElements.push({
					item: this,
					width: $t.outerWidth(), height: $t.outerHeight(),
					top: $o.top, left: $o.left
				});
			}
		});

	},
	drag: function( event, ui, inst ) {

		var ts, bs, ls, rs, l, r, t, b, i, first,
			o = inst.options,
			d = o.snapTolerance,
			x1 = ui.offset.left, x2 = x1 + inst.helperProportions.width,
			y1 = ui.offset.top, y2 = y1 + inst.helperProportions.height;

		for (i = inst.snapElements.length - 1; i >= 0; i--){

			l = inst.snapElements[i].left - inst.margins.left;
			r = l + inst.snapElements[i].width;
			t = inst.snapElements[i].top - inst.margins.top;
			b = t + inst.snapElements[i].height;

			if ( x2 < l - d || x1 > r + d || y2 < t - d || y1 > b + d || !$.contains( inst.snapElements[ i ].item.ownerDocument, inst.snapElements[ i ].item ) ) {
				if (inst.snapElements[i].snapping) {
					(inst.options.snap.release && inst.options.snap.release.call(inst.element, event, $.extend(inst._uiHash(), { snapItem: inst.snapElements[i].item })));
				}
				inst.snapElements[i].snapping = false;
				continue;
			}

			if (o.snapMode !== "inner") {
				ts = Math.abs(t - y2) <= d;
				bs = Math.abs(b - y1) <= d;
				ls = Math.abs(l - x2) <= d;
				rs = Math.abs(r - x1) <= d;
				if (ts) {
					ui.position.top = inst._convertPositionTo("relative", { top: t - inst.helperProportions.height, left: 0 }).top;
				}
				if (bs) {
					ui.position.top = inst._convertPositionTo("relative", { top: b, left: 0 }).top;
				}
				if (ls) {
					ui.position.left = inst._convertPositionTo("relative", { top: 0, left: l - inst.helperProportions.width }).left;
				}
				if (rs) {
					ui.position.left = inst._convertPositionTo("relative", { top: 0, left: r }).left;
				}
			}

			first = (ts || bs || ls || rs);

			if (o.snapMode !== "outer") {
				ts = Math.abs(t - y1) <= d;
				bs = Math.abs(b - y2) <= d;
				ls = Math.abs(l - x1) <= d;
				rs = Math.abs(r - x2) <= d;
				if (ts) {
					ui.position.top = inst._convertPositionTo("relative", { top: t, left: 0 }).top;
				}
				if (bs) {
					ui.position.top = inst._convertPositionTo("relative", { top: b - inst.helperProportions.height, left: 0 }).top;
				}
				if (ls) {
					ui.position.left = inst._convertPositionTo("relative", { top: 0, left: l }).left;
				}
				if (rs) {
					ui.position.left = inst._convertPositionTo("relative", { top: 0, left: r - inst.helperProportions.width }).left;
				}
			}

			if (!inst.snapElements[i].snapping && (ts || bs || ls || rs || first)) {
				(inst.options.snap.snap && inst.options.snap.snap.call(inst.element, event, $.extend(inst._uiHash(), { snapItem: inst.snapElements[i].item })));
			}
			inst.snapElements[i].snapping = (ts || bs || ls || rs || first);

		}

	}
});

$.ui.plugin.add("draggable", "stack", {
	start: function( event, ui, instance ) {
		var min,
			o = instance.options,
			group = $.makeArray($(o.stack)).sort(function(a, b) {
				return (parseInt($(a).css("zIndex"), 10) || 0) - (parseInt($(b).css("zIndex"), 10) || 0);
			});

		if (!group.length) { return; }

		min = parseInt($(group[0]).css("zIndex"), 10) || 0;
		$(group).each(function(i) {
			$(this).css("zIndex", min + i);
		});
		this.css("zIndex", (min + group.length));
	}
});

$.ui.plugin.add("draggable", "zIndex", {
	start: function( event, ui, instance ) {
		var t = $( ui.helper ),
			o = instance.options;

		if (t.css("zIndex")) {
			o._zIndex = t.css("zIndex");
		}
		t.css("zIndex", o.zIndex);
	},
	stop: function( event, ui, instance ) {
		var o = instance.options;

		if (o._zIndex) {
			$(ui.helper).css("zIndex", o._zIndex);
		}
	}
});

var draggable = $.ui.draggable;


/*
 * jQuery UI Droppable 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/droppable/
 */


$.widget( "ui.droppable", {
	version: "1.11.4",
	widgetEventPrefix: "drop",
	options: {
		accept: "*",
		activeClass: false,
		addClasses: true,
		greedy: false,
		hoverClass: false,
		scope: "default",
		tolerance: "intersect",

		// callbacks
		activate: null,
		deactivate: null,
		drop: null,
		out: null,
		over: null
	},
	_create: function() {

		var proportions,
			o = this.options,
			accept = o.accept;

		this.isover = false;
		this.isout = true;

		this.accept = $.isFunction( accept ) ? accept : function( d ) {
			return d.is( accept );
		};

		this.proportions = function( /* valueToWrite */ ) {
			if ( arguments.length ) {
				// Store the droppable's proportions
				proportions = arguments[ 0 ];
			} else {
				// Retrieve or derive the droppable's proportions
				return proportions ?
					proportions :
					proportions = {
						width: this.element[ 0 ].offsetWidth,
						height: this.element[ 0 ].offsetHeight
					};
			}
		};

		this._addToManager( o.scope );

		o.addClasses && this.element.addClass( "ui-droppable" );

	},

	_addToManager: function( scope ) {
		// Add the reference and positions to the manager
		$.ui.ddmanager.droppables[ scope ] = $.ui.ddmanager.droppables[ scope ] || [];
		$.ui.ddmanager.droppables[ scope ].push( this );
	},

	_splice: function( drop ) {
		var i = 0;
		for ( ; i < drop.length; i++ ) {
			if ( drop[ i ] === this ) {
				drop.splice( i, 1 );
			}
		}
	},

	_destroy: function() {
		var drop = $.ui.ddmanager.droppables[ this.options.scope ];

		this._splice( drop );

		this.element.removeClass( "ui-droppable ui-droppable-disabled" );
	},

	_setOption: function( key, value ) {

		if ( key === "accept" ) {
			this.accept = $.isFunction( value ) ? value : function( d ) {
				return d.is( value );
			};
		} else if ( key === "scope" ) {
			var drop = $.ui.ddmanager.droppables[ this.options.scope ];

			this._splice( drop );
			this._addToManager( value );
		}

		this._super( key, value );
	},

	_activate: function( event ) {
		var draggable = $.ui.ddmanager.current;
		if ( this.options.activeClass ) {
			this.element.addClass( this.options.activeClass );
		}
		if ( draggable ){
			this._trigger( "activate", event, this.ui( draggable ) );
		}
	},

	_deactivate: function( event ) {
		var draggable = $.ui.ddmanager.current;
		if ( this.options.activeClass ) {
			this.element.removeClass( this.options.activeClass );
		}
		if ( draggable ){
			this._trigger( "deactivate", event, this.ui( draggable ) );
		}
	},

	_over: function( event ) {

		var draggable = $.ui.ddmanager.current;

		// Bail if draggable and droppable are same element
		if ( !draggable || ( draggable.currentItem || draggable.element )[ 0 ] === this.element[ 0 ] ) {
			return;
		}

		if ( this.accept.call( this.element[ 0 ], ( draggable.currentItem || draggable.element ) ) ) {
			if ( this.options.hoverClass ) {
				this.element.addClass( this.options.hoverClass );
			}
			this._trigger( "over", event, this.ui( draggable ) );
		}

	},

	_out: function( event ) {

		var draggable = $.ui.ddmanager.current;

		// Bail if draggable and droppable are same element
		if ( !draggable || ( draggable.currentItem || draggable.element )[ 0 ] === this.element[ 0 ] ) {
			return;
		}

		if ( this.accept.call( this.element[ 0 ], ( draggable.currentItem || draggable.element ) ) ) {
			if ( this.options.hoverClass ) {
				this.element.removeClass( this.options.hoverClass );
			}
			this._trigger( "out", event, this.ui( draggable ) );
		}

	},

	_drop: function( event, custom ) {

		var draggable = custom || $.ui.ddmanager.current,
			childrenIntersection = false;

		// Bail if draggable and droppable are same element
		if ( !draggable || ( draggable.currentItem || draggable.element )[ 0 ] === this.element[ 0 ] ) {
			return false;
		}

		this.element.find( ":data(ui-droppable)" ).not( ".ui-draggable-dragging" ).each(function() {
			var inst = $( this ).droppable( "instance" );
			if (
				inst.options.greedy &&
				!inst.options.disabled &&
				inst.options.scope === draggable.options.scope &&
				inst.accept.call( inst.element[ 0 ], ( draggable.currentItem || draggable.element ) ) &&
				$.ui.intersect( draggable, $.extend( inst, { offset: inst.element.offset() } ), inst.options.tolerance, event )
			) { childrenIntersection = true; return false; }
		});
		if ( childrenIntersection ) {
			return false;
		}

		if ( this.accept.call( this.element[ 0 ], ( draggable.currentItem || draggable.element ) ) ) {
			if ( this.options.activeClass ) {
				this.element.removeClass( this.options.activeClass );
			}
			if ( this.options.hoverClass ) {
				this.element.removeClass( this.options.hoverClass );
			}
			this._trigger( "drop", event, this.ui( draggable ) );
			return this.element;
		}

		return false;

	},

	ui: function( c ) {
		return {
			draggable: ( c.currentItem || c.element ),
			helper: c.helper,
			position: c.position,
			offset: c.positionAbs
		};
	}

});

$.ui.intersect = (function() {
	function isOverAxis( x, reference, size ) {
		return ( x >= reference ) && ( x < ( reference + size ) );
	}

	return function( draggable, droppable, toleranceMode, event ) {

		if ( !droppable.offset ) {
			return false;
		}

		var x1 = ( draggable.positionAbs || draggable.position.absolute ).left + draggable.margins.left,
			y1 = ( draggable.positionAbs || draggable.position.absolute ).top + draggable.margins.top,
			x2 = x1 + draggable.helperProportions.width,
			y2 = y1 + draggable.helperProportions.height,
			l = droppable.offset.left,
			t = droppable.offset.top,
			r = l + droppable.proportions().width,
			b = t + droppable.proportions().height;

		switch ( toleranceMode ) {
		case "fit":
			return ( l <= x1 && x2 <= r && t <= y1 && y2 <= b );
		case "intersect":
			return ( l < x1 + ( draggable.helperProportions.width / 2 ) && // Right Half
				x2 - ( draggable.helperProportions.width / 2 ) < r && // Left Half
				t < y1 + ( draggable.helperProportions.height / 2 ) && // Bottom Half
				y2 - ( draggable.helperProportions.height / 2 ) < b ); // Top Half
		case "pointer":
			return isOverAxis( event.pageY, t, droppable.proportions().height ) && isOverAxis( event.pageX, l, droppable.proportions().width );
		case "touch":
			return (
				( y1 >= t && y1 <= b ) || // Top edge touching
				( y2 >= t && y2 <= b ) || // Bottom edge touching
				( y1 < t && y2 > b ) // Surrounded vertically
			) && (
				( x1 >= l && x1 <= r ) || // Left edge touching
				( x2 >= l && x2 <= r ) || // Right edge touching
				( x1 < l && x2 > r ) // Surrounded horizontally
			);
		default:
			return false;
		}
	};
})();

/*
	This manager tracks offsets of draggables and droppables
*/
$.ui.ddmanager = {
	current: null,
	droppables: { "default": [] },
	prepareOffsets: function( t, event ) {

		var i, j,
			m = $.ui.ddmanager.droppables[ t.options.scope ] || [],
			type = event ? event.type : null, // workaround for #2317
			list = ( t.currentItem || t.element ).find( ":data(ui-droppable)" ).addBack();

		droppablesLoop: for ( i = 0; i < m.length; i++ ) {

			// No disabled and non-accepted
			if ( m[ i ].options.disabled || ( t && !m[ i ].accept.call( m[ i ].element[ 0 ], ( t.currentItem || t.element ) ) ) ) {
				continue;
			}

			// Filter out elements in the current dragged item
			for ( j = 0; j < list.length; j++ ) {
				if ( list[ j ] === m[ i ].element[ 0 ] ) {
					m[ i ].proportions().height = 0;
					continue droppablesLoop;
				}
			}

			m[ i ].visible = m[ i ].element.css( "display" ) !== "none";
			if ( !m[ i ].visible ) {
				continue;
			}

			// Activate the droppable if used directly from draggables
			if ( type === "mousedown" ) {
				m[ i ]._activate.call( m[ i ], event );
			}

			m[ i ].offset = m[ i ].element.offset();
			m[ i ].proportions({ width: m[ i ].element[ 0 ].offsetWidth, height: m[ i ].element[ 0 ].offsetHeight });

		}

	},
	drop: function( draggable, event ) {

		var dropped = false;
		// Create a copy of the droppables in case the list changes during the drop (#9116)
		$.each( ( $.ui.ddmanager.droppables[ draggable.options.scope ] || [] ).slice(), function() {

			if ( !this.options ) {
				return;
			}
			if ( !this.options.disabled && this.visible && $.ui.intersect( draggable, this, this.options.tolerance, event ) ) {
				dropped = this._drop.call( this, event ) || dropped;
			}

			if ( !this.options.disabled && this.visible && this.accept.call( this.element[ 0 ], ( draggable.currentItem || draggable.element ) ) ) {
				this.isout = true;
				this.isover = false;
				this._deactivate.call( this, event );
			}

		});
		return dropped;

	},
	dragStart: function( draggable, event ) {
		// Listen for scrolling so that if the dragging causes scrolling the position of the droppables can be recalculated (see #5003)
		draggable.element.parentsUntil( "body" ).bind( "scroll.droppable", function() {
			if ( !draggable.options.refreshPositions ) {
				$.ui.ddmanager.prepareOffsets( draggable, event );
			}
		});
	},
	drag: function( draggable, event ) {

		// If you have a highly dynamic page, you might try this option. It renders positions every time you move the mouse.
		if ( draggable.options.refreshPositions ) {
			$.ui.ddmanager.prepareOffsets( draggable, event );
		}

		// Run through all droppables and check their positions based on specific tolerance options
		$.each( $.ui.ddmanager.droppables[ draggable.options.scope ] || [], function() {

			if ( this.options.disabled || this.greedyChild || !this.visible ) {
				return;
			}

			var parentInstance, scope, parent,
				intersects = $.ui.intersect( draggable, this, this.options.tolerance, event ),
				c = !intersects && this.isover ? "isout" : ( intersects && !this.isover ? "isover" : null );
			if ( !c ) {
				return;
			}

			if ( this.options.greedy ) {
				// find droppable parents with same scope
				scope = this.options.scope;
				parent = this.element.parents( ":data(ui-droppable)" ).filter(function() {
					return $( this ).droppable( "instance" ).options.scope === scope;
				});

				if ( parent.length ) {
					parentInstance = $( parent[ 0 ] ).droppable( "instance" );
					parentInstance.greedyChild = ( c === "isover" );
				}
			}

			// we just moved into a greedy child
			if ( parentInstance && c === "isover" ) {
				parentInstance.isover = false;
				parentInstance.isout = true;
				parentInstance._out.call( parentInstance, event );
			}

			this[ c ] = true;
			this[c === "isout" ? "isover" : "isout"] = false;
			this[c === "isover" ? "_over" : "_out"].call( this, event );

			// we just moved out of a greedy child
			if ( parentInstance && c === "isout" ) {
				parentInstance.isout = false;
				parentInstance.isover = true;
				parentInstance._over.call( parentInstance, event );
			}
		});

	},
	dragStop: function( draggable, event ) {
		draggable.element.parentsUntil( "body" ).unbind( "scroll.droppable" );
		// Call prepareOffsets one final time since IE does not fire return scroll events when overflow was caused by drag (see #5003)
		if ( !draggable.options.refreshPositions ) {
			$.ui.ddmanager.prepareOffsets( draggable, event );
		}
	}
};

var droppable = $.ui.droppable;


/*
 * jQuery UI Resizable 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/resizable/
 */


$.widget("ui.resizable", $.ui.mouse, {
	version: "1.11.4",
	widgetEventPrefix: "resize",
	options: {
		alsoResize: false,
		animate: false,
		animateDuration: "slow",
		animateEasing: "swing",
		aspectRatio: false,
		autoHide: false,
		containment: false,
		ghost: false,
		grid: false,
		handles: "e,s,se",
		helper: false,
		maxHeight: null,
		maxWidth: null,
		minHeight: 10,
		minWidth: 10,
		// See #7960
		zIndex: 90,

		// callbacks
		resize: null,
		start: null,
		stop: null
	},

	_num: function( value ) {
		return parseInt( value, 10 ) || 0;
	},

	_isNumber: function( value ) {
		return !isNaN( parseInt( value, 10 ) );
	},

	_hasScroll: function( el, a ) {

		if ( $( el ).css( "overflow" ) === "hidden") {
			return false;
		}

		var scroll = ( a && a === "left" ) ? "scrollLeft" : "scrollTop",
			has = false;

		if ( el[ scroll ] > 0 ) {
			return true;
		}

		// TODO: determine which cases actually cause this to happen
		// if the element doesn't have the scroll set, see if it's possible to
		// set the scroll
		el[ scroll ] = 1;
		has = ( el[ scroll ] > 0 );
		el[ scroll ] = 0;
		return has;
	},

	_create: function() {

		var n, i, handle, axis, hname,
			that = this,
			o = this.options;
		this.element.addClass("ui-resizable");

		$.extend(this, {
			_aspectRatio: !!(o.aspectRatio),
			aspectRatio: o.aspectRatio,
			originalElement: this.element,
			_proportionallyResizeElements: [],
			_helper: o.helper || o.ghost || o.animate ? o.helper || "ui-resizable-helper" : null
		});

		// Wrap the element if it cannot hold child nodes
		if (this.element[0].nodeName.match(/^(canvas|textarea|input|select|button|img)$/i)) {

			this.element.wrap(
				$("<div class='ui-wrapper' style='overflow: hidden;'></div>").css({
					position: this.element.css("position"),
					width: this.element.outerWidth(),
					height: this.element.outerHeight(),
					top: this.element.css("top"),
					left: this.element.css("left")
				})
			);

			this.element = this.element.parent().data(
				"ui-resizable", this.element.resizable( "instance" )
			);

			this.elementIsWrapper = true;

			this.element.css({
				marginLeft: this.originalElement.css("marginLeft"),
				marginTop: this.originalElement.css("marginTop"),
				marginRight: this.originalElement.css("marginRight"),
				marginBottom: this.originalElement.css("marginBottom")
			});
			this.originalElement.css({
				marginLeft: 0,
				marginTop: 0,
				marginRight: 0,
				marginBottom: 0
			});
			// support: Safari
			// Prevent Safari textarea resize
			this.originalResizeStyle = this.originalElement.css("resize");
			this.originalElement.css("resize", "none");

			this._proportionallyResizeElements.push( this.originalElement.css({
				position: "static",
				zoom: 1,
				display: "block"
			}) );

			// support: IE9
			// avoid IE jump (hard set the margin)
			this.originalElement.css({ margin: this.originalElement.css("margin") });

			this._proportionallyResize();
		}

		this.handles = o.handles ||
			( !$(".ui-resizable-handle", this.element).length ?
				"e,s,se" : {
					n: ".ui-resizable-n",
					e: ".ui-resizable-e",
					s: ".ui-resizable-s",
					w: ".ui-resizable-w",
					se: ".ui-resizable-se",
					sw: ".ui-resizable-sw",
					ne: ".ui-resizable-ne",
					nw: ".ui-resizable-nw"
				} );

		this._handles = $();
		if ( this.handles.constructor === String ) {

			if ( this.handles === "all") {
				this.handles = "n,e,s,w,se,sw,ne,nw";
			}

			n = this.handles.split(",");
			this.handles = {};

			for (i = 0; i < n.length; i++) {

				handle = $.trim(n[i]);
				hname = "ui-resizable-" + handle;
				axis = $("<div class='ui-resizable-handle " + hname + "'></div>");

				axis.css({ zIndex: o.zIndex });

				// TODO : What's going on here?
				if ("se" === handle) {
					axis.addClass("ui-icon ui-icon-gripsmall-diagonal-se");
				}

				this.handles[handle] = ".ui-resizable-" + handle;
				this.element.append(axis);
			}

		}

		this._renderAxis = function(target) {

			var i, axis, padPos, padWrapper;

			target = target || this.element;

			for (i in this.handles) {

				if (this.handles[i].constructor === String) {
					this.handles[i] = this.element.children( this.handles[ i ] ).first().show();
				} else if ( this.handles[ i ].jquery || this.handles[ i ].nodeType ) {
					this.handles[ i ] = $( this.handles[ i ] );
					this._on( this.handles[ i ], { "mousedown": that._mouseDown });
				}

				if (this.elementIsWrapper && this.originalElement[0].nodeName.match(/^(textarea|input|select|button)$/i)) {

					axis = $(this.handles[i], this.element);

					padWrapper = /sw|ne|nw|se|n|s/.test(i) ? axis.outerHeight() : axis.outerWidth();

					padPos = [ "padding",
						/ne|nw|n/.test(i) ? "Top" :
						/se|sw|s/.test(i) ? "Bottom" :
						/^e$/.test(i) ? "Right" : "Left" ].join("");

					target.css(padPos, padWrapper);

					this._proportionallyResize();
				}

				this._handles = this._handles.add( this.handles[ i ] );
			}
		};

		// TODO: make renderAxis a prototype function
		this._renderAxis(this.element);

		this._handles = this._handles.add( this.element.find( ".ui-resizable-handle" ) );
		this._handles.disableSelection();

		this._handles.mouseover(function() {
			if (!that.resizing) {
				if (this.className) {
					axis = this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i);
				}
				that.axis = axis && axis[1] ? axis[1] : "se";
			}
		});

		if (o.autoHide) {
			this._handles.hide();
			$(this.element)
				.addClass("ui-resizable-autohide")
				.mouseenter(function() {
					if (o.disabled) {
						return;
					}
					$(this).removeClass("ui-resizable-autohide");
					that._handles.show();
				})
				.mouseleave(function() {
					if (o.disabled) {
						return;
					}
					if (!that.resizing) {
						$(this).addClass("ui-resizable-autohide");
						that._handles.hide();
					}
				});
		}

		this._mouseInit();
	},

	_destroy: function() {

		this._mouseDestroy();

		var wrapper,
			_destroy = function(exp) {
				$(exp)
					.removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing")
					.removeData("resizable")
					.removeData("ui-resizable")
					.unbind(".resizable")
					.find(".ui-resizable-handle")
						.remove();
			};

		// TODO: Unwrap at same DOM position
		if (this.elementIsWrapper) {
			_destroy(this.element);
			wrapper = this.element;
			this.originalElement.css({
				position: wrapper.css("position"),
				width: wrapper.outerWidth(),
				height: wrapper.outerHeight(),
				top: wrapper.css("top"),
				left: wrapper.css("left")
			}).insertAfter( wrapper );
			wrapper.remove();
		}

		this.originalElement.css("resize", this.originalResizeStyle);
		_destroy(this.originalElement);

		return this;
	},

	_mouseCapture: function(event) {
		var i, handle,
			capture = false;

		for (i in this.handles) {
			handle = $(this.handles[i])[0];
			if (handle === event.target || $.contains(handle, event.target)) {
				capture = true;
			}
		}

		return !this.options.disabled && capture;
	},

	_mouseStart: function(event) {

		var curleft, curtop, cursor,
			o = this.options,
			el = this.element;

		this.resizing = true;

		this._renderProxy();

		curleft = this._num(this.helper.css("left"));
		curtop = this._num(this.helper.css("top"));

		if (o.containment) {
			curleft += $(o.containment).scrollLeft() || 0;
			curtop += $(o.containment).scrollTop() || 0;
		}

		this.offset = this.helper.offset();
		this.position = { left: curleft, top: curtop };

		this.size = this._helper ? {
				width: this.helper.width(),
				height: this.helper.height()
			} : {
				width: el.width(),
				height: el.height()
			};

		this.originalSize = this._helper ? {
				width: el.outerWidth(),
				height: el.outerHeight()
			} : {
				width: el.width(),
				height: el.height()
			};

		this.sizeDiff = {
			width: el.outerWidth() - el.width(),
			height: el.outerHeight() - el.height()
		};

		this.originalPosition = { left: curleft, top: curtop };
		this.originalMousePosition = { left: event.pageX, top: event.pageY };

		this.aspectRatio = (typeof o.aspectRatio === "number") ?
			o.aspectRatio :
			((this.originalSize.width / this.originalSize.height) || 1);

		cursor = $(".ui-resizable-" + this.axis).css("cursor");
		$("body").css("cursor", cursor === "auto" ? this.axis + "-resize" : cursor);

		el.addClass("ui-resizable-resizing");
		this._propagate("start", event);
		return true;
	},

	_mouseDrag: function(event) {

		var data, props,
			smp = this.originalMousePosition,
			a = this.axis,
			dx = (event.pageX - smp.left) || 0,
			dy = (event.pageY - smp.top) || 0,
			trigger = this._change[a];

		this._updatePrevProperties();

		if (!trigger) {
			return false;
		}

		data = trigger.apply(this, [ event, dx, dy ]);

		this._updateVirtualBoundaries(event.shiftKey);
		if (this._aspectRatio || event.shiftKey) {
			data = this._updateRatio(data, event);
		}

		data = this._respectSize(data, event);

		this._updateCache(data);

		this._propagate("resize", event);

		props = this._applyChanges();

		if ( !this._helper && this._proportionallyResizeElements.length ) {
			this._proportionallyResize();
		}

		if ( !$.isEmptyObject( props ) ) {
			this._updatePrevProperties();
			this._trigger( "resize", event, this.ui() );
			this._applyChanges();
		}

		return false;
	},

	_mouseStop: function(event) {

		this.resizing = false;
		var pr, ista, soffseth, soffsetw, s, left, top,
			o = this.options, that = this;

		if (this._helper) {

			pr = this._proportionallyResizeElements;
			ista = pr.length && (/textarea/i).test(pr[0].nodeName);
			soffseth = ista && this._hasScroll(pr[0], "left") ? 0 : that.sizeDiff.height;
			soffsetw = ista ? 0 : that.sizeDiff.width;

			s = {
				width: (that.helper.width()  - soffsetw),
				height: (that.helper.height() - soffseth)
			};
			left = (parseInt(that.element.css("left"), 10) +
				(that.position.left - that.originalPosition.left)) || null;
			top = (parseInt(that.element.css("top"), 10) +
				(that.position.top - that.originalPosition.top)) || null;

			if (!o.animate) {
				this.element.css($.extend(s, { top: top, left: left }));
			}

			that.helper.height(that.size.height);
			that.helper.width(that.size.width);

			if (this._helper && !o.animate) {
				this._proportionallyResize();
			}
		}

		$("body").css("cursor", "auto");

		this.element.removeClass("ui-resizable-resizing");

		this._propagate("stop", event);

		if (this._helper) {
			this.helper.remove();
		}

		return false;

	},

	_updatePrevProperties: function() {
		this.prevPosition = {
			top: this.position.top,
			left: this.position.left
		};
		this.prevSize = {
			width: this.size.width,
			height: this.size.height
		};
	},

	_applyChanges: function() {
		var props = {};

		if ( this.position.top !== this.prevPosition.top ) {
			props.top = this.position.top + "px";
		}
		if ( this.position.left !== this.prevPosition.left ) {
			props.left = this.position.left + "px";
		}
		if ( this.size.width !== this.prevSize.width ) {
			props.width = this.size.width + "px";
		}
		if ( this.size.height !== this.prevSize.height ) {
			props.height = this.size.height + "px";
		}

		this.helper.css( props );

		return props;
	},

	_updateVirtualBoundaries: function(forceAspectRatio) {
		var pMinWidth, pMaxWidth, pMinHeight, pMaxHeight, b,
			o = this.options;

		b = {
			minWidth: this._isNumber(o.minWidth) ? o.minWidth : 0,
			maxWidth: this._isNumber(o.maxWidth) ? o.maxWidth : Infinity,
			minHeight: this._isNumber(o.minHeight) ? o.minHeight : 0,
			maxHeight: this._isNumber(o.maxHeight) ? o.maxHeight : Infinity
		};

		if (this._aspectRatio || forceAspectRatio) {
			pMinWidth = b.minHeight * this.aspectRatio;
			pMinHeight = b.minWidth / this.aspectRatio;
			pMaxWidth = b.maxHeight * this.aspectRatio;
			pMaxHeight = b.maxWidth / this.aspectRatio;

			if (pMinWidth > b.minWidth) {
				b.minWidth = pMinWidth;
			}
			if (pMinHeight > b.minHeight) {
				b.minHeight = pMinHeight;
			}
			if (pMaxWidth < b.maxWidth) {
				b.maxWidth = pMaxWidth;
			}
			if (pMaxHeight < b.maxHeight) {
				b.maxHeight = pMaxHeight;
			}
		}
		this._vBoundaries = b;
	},

	_updateCache: function(data) {
		this.offset = this.helper.offset();
		if (this._isNumber(data.left)) {
			this.position.left = data.left;
		}
		if (this._isNumber(data.top)) {
			this.position.top = data.top;
		}
		if (this._isNumber(data.height)) {
			this.size.height = data.height;
		}
		if (this._isNumber(data.width)) {
			this.size.width = data.width;
		}
	},

	_updateRatio: function( data ) {

		var cpos = this.position,
			csize = this.size,
			a = this.axis;

		if (this._isNumber(data.height)) {
			data.width = (data.height * this.aspectRatio);
		} else if (this._isNumber(data.width)) {
			data.height = (data.width / this.aspectRatio);
		}

		if (a === "sw") {
			data.left = cpos.left + (csize.width - data.width);
			data.top = null;
		}
		if (a === "nw") {
			data.top = cpos.top + (csize.height - data.height);
			data.left = cpos.left + (csize.width - data.width);
		}

		return data;
	},

	_respectSize: function( data ) {

		var o = this._vBoundaries,
			a = this.axis,
			ismaxw = this._isNumber(data.width) && o.maxWidth && (o.maxWidth < data.width),
			ismaxh = this._isNumber(data.height) && o.maxHeight && (o.maxHeight < data.height),
			isminw = this._isNumber(data.width) && o.minWidth && (o.minWidth > data.width),
			isminh = this._isNumber(data.height) && o.minHeight && (o.minHeight > data.height),
			dw = this.originalPosition.left + this.originalSize.width,
			dh = this.position.top + this.size.height,
			cw = /sw|nw|w/.test(a), ch = /nw|ne|n/.test(a);
		if (isminw) {
			data.width = o.minWidth;
		}
		if (isminh) {
			data.height = o.minHeight;
		}
		if (ismaxw) {
			data.width = o.maxWidth;
		}
		if (ismaxh) {
			data.height = o.maxHeight;
		}

		if (isminw && cw) {
			data.left = dw - o.minWidth;
		}
		if (ismaxw && cw) {
			data.left = dw - o.maxWidth;
		}
		if (isminh && ch) {
			data.top = dh - o.minHeight;
		}
		if (ismaxh && ch) {
			data.top = dh - o.maxHeight;
		}

		// Fixing jump error on top/left - bug #2330
		if (!data.width && !data.height && !data.left && data.top) {
			data.top = null;
		} else if (!data.width && !data.height && !data.top && data.left) {
			data.left = null;
		}

		return data;
	},

	_getPaddingPlusBorderDimensions: function( element ) {
		var i = 0,
			widths = [],
			borders = [
				element.css( "borderTopWidth" ),
				element.css( "borderRightWidth" ),
				element.css( "borderBottomWidth" ),
				element.css( "borderLeftWidth" )
			],
			paddings = [
				element.css( "paddingTop" ),
				element.css( "paddingRight" ),
				element.css( "paddingBottom" ),
				element.css( "paddingLeft" )
			];

		for ( ; i < 4; i++ ) {
			widths[ i ] = ( parseInt( borders[ i ], 10 ) || 0 );
			widths[ i ] += ( parseInt( paddings[ i ], 10 ) || 0 );
		}

		return {
			height: widths[ 0 ] + widths[ 2 ],
			width: widths[ 1 ] + widths[ 3 ]
		};
	},

	_proportionallyResize: function() {

		if (!this._proportionallyResizeElements.length) {
			return;
		}

		var prel,
			i = 0,
			element = this.helper || this.element;

		for ( ; i < this._proportionallyResizeElements.length; i++) {

			prel = this._proportionallyResizeElements[i];

			// TODO: Seems like a bug to cache this.outerDimensions
			// considering that we are in a loop.
			if (!this.outerDimensions) {
				this.outerDimensions = this._getPaddingPlusBorderDimensions( prel );
			}

			prel.css({
				height: (element.height() - this.outerDimensions.height) || 0,
				width: (element.width() - this.outerDimensions.width) || 0
			});

		}

	},

	_renderProxy: function() {

		var el = this.element, o = this.options;
		this.elementOffset = el.offset();

		if (this._helper) {

			this.helper = this.helper || $("<div style='overflow:hidden;'></div>");

			this.helper.addClass(this._helper).css({
				width: this.element.outerWidth() - 1,
				height: this.element.outerHeight() - 1,
				position: "absolute",
				left: this.elementOffset.left + "px",
				top: this.elementOffset.top + "px",
				zIndex: ++o.zIndex //TODO: Don't modify option
			});

			this.helper
				.appendTo("body")
				.disableSelection();

		} else {
			this.helper = this.element;
		}

	},

	_change: {
		e: function(event, dx) {
			return { width: this.originalSize.width + dx };
		},
		w: function(event, dx) {
			var cs = this.originalSize, sp = this.originalPosition;
			return { left: sp.left + dx, width: cs.width - dx };
		},
		n: function(event, dx, dy) {
			var cs = this.originalSize, sp = this.originalPosition;
			return { top: sp.top + dy, height: cs.height - dy };
		},
		s: function(event, dx, dy) {
			return { height: this.originalSize.height + dy };
		},
		se: function(event, dx, dy) {
			return $.extend(this._change.s.apply(this, arguments),
				this._change.e.apply(this, [ event, dx, dy ]));
		},
		sw: function(event, dx, dy) {
			return $.extend(this._change.s.apply(this, arguments),
				this._change.w.apply(this, [ event, dx, dy ]));
		},
		ne: function(event, dx, dy) {
			return $.extend(this._change.n.apply(this, arguments),
				this._change.e.apply(this, [ event, dx, dy ]));
		},
		nw: function(event, dx, dy) {
			return $.extend(this._change.n.apply(this, arguments),
				this._change.w.apply(this, [ event, dx, dy ]));
		}
	},

	_propagate: function(n, event) {
		$.ui.plugin.call(this, n, [ event, this.ui() ]);
		(n !== "resize" && this._trigger(n, event, this.ui()));
	},

	plugins: {},

	ui: function() {
		return {
			originalElement: this.originalElement,
			element: this.element,
			helper: this.helper,
			position: this.position,
			size: this.size,
			originalSize: this.originalSize,
			originalPosition: this.originalPosition
		};
	}

});

/*
 * Resizable Extensions
 */

$.ui.plugin.add("resizable", "animate", {

	stop: function( event ) {
		var that = $(this).resizable( "instance" ),
			o = that.options,
			pr = that._proportionallyResizeElements,
			ista = pr.length && (/textarea/i).test(pr[0].nodeName),
			soffseth = ista && that._hasScroll(pr[0], "left") ? 0 : that.sizeDiff.height,
			soffsetw = ista ? 0 : that.sizeDiff.width,
			style = { width: (that.size.width - soffsetw), height: (that.size.height - soffseth) },
			left = (parseInt(that.element.css("left"), 10) +
				(that.position.left - that.originalPosition.left)) || null,
			top = (parseInt(that.element.css("top"), 10) +
				(that.position.top - that.originalPosition.top)) || null;

		that.element.animate(
			$.extend(style, top && left ? { top: top, left: left } : {}), {
				duration: o.animateDuration,
				easing: o.animateEasing,
				step: function() {

					var data = {
						width: parseInt(that.element.css("width"), 10),
						height: parseInt(that.element.css("height"), 10),
						top: parseInt(that.element.css("top"), 10),
						left: parseInt(that.element.css("left"), 10)
					};

					if (pr && pr.length) {
						$(pr[0]).css({ width: data.width, height: data.height });
					}

					// propagating resize, and updating values for each animation step
					that._updateCache(data);
					that._propagate("resize", event);

				}
			}
		);
	}

});

$.ui.plugin.add( "resizable", "containment", {

	start: function() {
		var element, p, co, ch, cw, width, height,
			that = $( this ).resizable( "instance" ),
			o = that.options,
			el = that.element,
			oc = o.containment,
			ce = ( oc instanceof $ ) ? oc.get( 0 ) : ( /parent/.test( oc ) ) ? el.parent().get( 0 ) : oc;

		if ( !ce ) {
			return;
		}

		that.containerElement = $( ce );

		if ( /document/.test( oc ) || oc === document ) {
			that.containerOffset = {
				left: 0,
				top: 0
			};
			that.containerPosition = {
				left: 0,
				top: 0
			};

			that.parentData = {
				element: $( document ),
				left: 0,
				top: 0,
				width: $( document ).width(),
				height: $( document ).height() || document.body.parentNode.scrollHeight
			};
		} else {
			element = $( ce );
			p = [];
			$([ "Top", "Right", "Left", "Bottom" ]).each(function( i, name ) {
				p[ i ] = that._num( element.css( "padding" + name ) );
			});

			that.containerOffset = element.offset();
			that.containerPosition = element.position();
			that.containerSize = {
				height: ( element.innerHeight() - p[ 3 ] ),
				width: ( element.innerWidth() - p[ 1 ] )
			};

			co = that.containerOffset;
			ch = that.containerSize.height;
			cw = that.containerSize.width;
			width = ( that._hasScroll ( ce, "left" ) ? ce.scrollWidth : cw );
			height = ( that._hasScroll ( ce ) ? ce.scrollHeight : ch ) ;

			that.parentData = {
				element: ce,
				left: co.left,
				top: co.top,
				width: width,
				height: height
			};
		}
	},

	resize: function( event ) {
		var woset, hoset, isParent, isOffsetRelative,
			that = $( this ).resizable( "instance" ),
			o = that.options,
			co = that.containerOffset,
			cp = that.position,
			pRatio = that._aspectRatio || event.shiftKey,
			cop = {
				top: 0,
				left: 0
			},
			ce = that.containerElement,
			continueResize = true;

		if ( ce[ 0 ] !== document && ( /static/ ).test( ce.css( "position" ) ) ) {
			cop = co;
		}

		if ( cp.left < ( that._helper ? co.left : 0 ) ) {
			that.size.width = that.size.width +
				( that._helper ?
					( that.position.left - co.left ) :
					( that.position.left - cop.left ) );

			if ( pRatio ) {
				that.size.height = that.size.width / that.aspectRatio;
				continueResize = false;
			}
			that.position.left = o.helper ? co.left : 0;
		}

		if ( cp.top < ( that._helper ? co.top : 0 ) ) {
			that.size.height = that.size.height +
				( that._helper ?
					( that.position.top - co.top ) :
					that.position.top );

			if ( pRatio ) {
				that.size.width = that.size.height * that.aspectRatio;
				continueResize = false;
			}
			that.position.top = that._helper ? co.top : 0;
		}

		isParent = that.containerElement.get( 0 ) === that.element.parent().get( 0 );
		isOffsetRelative = /relative|absolute/.test( that.containerElement.css( "position" ) );

		if ( isParent && isOffsetRelative ) {
			that.offset.left = that.parentData.left + that.position.left;
			that.offset.top = that.parentData.top + that.position.top;
		} else {
			that.offset.left = that.element.offset().left;
			that.offset.top = that.element.offset().top;
		}

		woset = Math.abs( that.sizeDiff.width +
			(that._helper ?
				that.offset.left - cop.left :
				(that.offset.left - co.left)) );

		hoset = Math.abs( that.sizeDiff.height +
			(that._helper ?
				that.offset.top - cop.top :
				(that.offset.top - co.top)) );

		if ( woset + that.size.width >= that.parentData.width ) {
			that.size.width = that.parentData.width - woset;
			if ( pRatio ) {
				that.size.height = that.size.width / that.aspectRatio;
				continueResize = false;
			}
		}

		if ( hoset + that.size.height >= that.parentData.height ) {
			that.size.height = that.parentData.height - hoset;
			if ( pRatio ) {
				that.size.width = that.size.height * that.aspectRatio;
				continueResize = false;
			}
		}

		if ( !continueResize ) {
			that.position.left = that.prevPosition.left;
			that.position.top = that.prevPosition.top;
			that.size.width = that.prevSize.width;
			that.size.height = that.prevSize.height;
		}
	},

	stop: function() {
		var that = $( this ).resizable( "instance" ),
			o = that.options,
			co = that.containerOffset,
			cop = that.containerPosition,
			ce = that.containerElement,
			helper = $( that.helper ),
			ho = helper.offset(),
			w = helper.outerWidth() - that.sizeDiff.width,
			h = helper.outerHeight() - that.sizeDiff.height;

		if ( that._helper && !o.animate && ( /relative/ ).test( ce.css( "position" ) ) ) {
			$( this ).css({
				left: ho.left - cop.left - co.left,
				width: w,
				height: h
			});
		}

		if ( that._helper && !o.animate && ( /static/ ).test( ce.css( "position" ) ) ) {
			$( this ).css({
				left: ho.left - cop.left - co.left,
				width: w,
				height: h
			});
		}
	}
});

$.ui.plugin.add("resizable", "alsoResize", {

	start: function() {
		var that = $(this).resizable( "instance" ),
			o = that.options;

		$(o.alsoResize).each(function() {
			var el = $(this);
			el.data("ui-resizable-alsoresize", {
				width: parseInt(el.width(), 10), height: parseInt(el.height(), 10),
				left: parseInt(el.css("left"), 10), top: parseInt(el.css("top"), 10)
			});
		});
	},

	resize: function(event, ui) {
		var that = $(this).resizable( "instance" ),
			o = that.options,
			os = that.originalSize,
			op = that.originalPosition,
			delta = {
				height: (that.size.height - os.height) || 0,
				width: (that.size.width - os.width) || 0,
				top: (that.position.top - op.top) || 0,
				left: (that.position.left - op.left) || 0
			};

			$(o.alsoResize).each(function() {
				var el = $(this), start = $(this).data("ui-resizable-alsoresize"), style = {},
					css = el.parents(ui.originalElement[0]).length ?
							[ "width", "height" ] :
							[ "width", "height", "top", "left" ];

				$.each(css, function(i, prop) {
					var sum = (start[prop] || 0) + (delta[prop] || 0);
					if (sum && sum >= 0) {
						style[prop] = sum || null;
					}
				});

				el.css(style);
			});
	},

	stop: function() {
		$(this).removeData("resizable-alsoresize");
	}
});

$.ui.plugin.add("resizable", "ghost", {

	start: function() {

		var that = $(this).resizable( "instance" ), o = that.options, cs = that.size;

		that.ghost = that.originalElement.clone();
		that.ghost
			.css({
				opacity: 0.25,
				display: "block",
				position: "relative",
				height: cs.height,
				width: cs.width,
				margin: 0,
				left: 0,
				top: 0
			})
			.addClass("ui-resizable-ghost")
			.addClass(typeof o.ghost === "string" ? o.ghost : "");

		that.ghost.appendTo(that.helper);

	},

	resize: function() {
		var that = $(this).resizable( "instance" );
		if (that.ghost) {
			that.ghost.css({
				position: "relative",
				height: that.size.height,
				width: that.size.width
			});
		}
	},

	stop: function() {
		var that = $(this).resizable( "instance" );
		if (that.ghost && that.helper) {
			that.helper.get(0).removeChild(that.ghost.get(0));
		}
	}

});

$.ui.plugin.add("resizable", "grid", {

	resize: function() {
		var outerDimensions,
			that = $(this).resizable( "instance" ),
			o = that.options,
			cs = that.size,
			os = that.originalSize,
			op = that.originalPosition,
			a = that.axis,
			grid = typeof o.grid === "number" ? [ o.grid, o.grid ] : o.grid,
			gridX = (grid[0] || 1),
			gridY = (grid[1] || 1),
			ox = Math.round((cs.width - os.width) / gridX) * gridX,
			oy = Math.round((cs.height - os.height) / gridY) * gridY,
			newWidth = os.width + ox,
			newHeight = os.height + oy,
			isMaxWidth = o.maxWidth && (o.maxWidth < newWidth),
			isMaxHeight = o.maxHeight && (o.maxHeight < newHeight),
			isMinWidth = o.minWidth && (o.minWidth > newWidth),
			isMinHeight = o.minHeight && (o.minHeight > newHeight);

		o.grid = grid;

		if (isMinWidth) {
			newWidth += gridX;
		}
		if (isMinHeight) {
			newHeight += gridY;
		}
		if (isMaxWidth) {
			newWidth -= gridX;
		}
		if (isMaxHeight) {
			newHeight -= gridY;
		}

		if (/^(se|s|e)$/.test(a)) {
			that.size.width = newWidth;
			that.size.height = newHeight;
		} else if (/^(ne)$/.test(a)) {
			that.size.width = newWidth;
			that.size.height = newHeight;
			that.position.top = op.top - oy;
		} else if (/^(sw)$/.test(a)) {
			that.size.width = newWidth;
			that.size.height = newHeight;
			that.position.left = op.left - ox;
		} else {
			if ( newHeight - gridY <= 0 || newWidth - gridX <= 0) {
				outerDimensions = that._getPaddingPlusBorderDimensions( this );
			}

			if ( newHeight - gridY > 0 ) {
				that.size.height = newHeight;
				that.position.top = op.top - oy;
			} else {
				newHeight = gridY - outerDimensions.height;
				that.size.height = newHeight;
				that.position.top = op.top + os.height - newHeight;
			}
			if ( newWidth - gridX > 0 ) {
				that.size.width = newWidth;
				that.position.left = op.left - ox;
			} else {
				newWidth = gridX - outerDimensions.width;
				that.size.width = newWidth;
				that.position.left = op.left + os.width - newWidth;
			}
		}
	}

});

var resizable = $.ui.resizable;


/*
 * jQuery UI Selectable 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/selectable/
 */


var selectable = $.widget("ui.selectable", $.ui.mouse, {
	version: "1.11.4",
	options: {
		appendTo: "body",
		autoRefresh: true,
		distance: 0,
		filter: "*",
		tolerance: "touch",

		// callbacks
		selected: null,
		selecting: null,
		start: null,
		stop: null,
		unselected: null,
		unselecting: null
	},
	_create: function() {
		var selectees,
			that = this;

		this.element.addClass("ui-selectable");

		this.dragged = false;

		// cache selectee children based on filter
		this.refresh = function() {
			selectees = $(that.options.filter, that.element[0]);
			selectees.addClass("ui-selectee");
			selectees.each(function() {
				var $this = $(this),
					pos = $this.offset();
				$.data(this, "selectable-item", {
					element: this,
					$element: $this,
					left: pos.left,
					top: pos.top,
					right: pos.left + $this.outerWidth(),
					bottom: pos.top + $this.outerHeight(),
					startselected: false,
					selected: $this.hasClass("ui-selected"),
					selecting: $this.hasClass("ui-selecting"),
					unselecting: $this.hasClass("ui-unselecting")
				});
			});
		};
		this.refresh();

		this.selectees = selectees.addClass("ui-selectee");

		this._mouseInit();

		this.helper = $("<div class='ui-selectable-helper'></div>");
	},

	_destroy: function() {
		this.selectees
			.removeClass("ui-selectee")
			.removeData("selectable-item");
		this.element
			.removeClass("ui-selectable ui-selectable-disabled");
		this._mouseDestroy();
	},

	_mouseStart: function(event) {
		var that = this,
			options = this.options;

		this.opos = [ event.pageX, event.pageY ];

		if (this.options.disabled) {
			return;
		}

		this.selectees = $(options.filter, this.element[0]);

		this._trigger("start", event);

		$(options.appendTo).append(this.helper);
		// position helper (lasso)
		this.helper.css({
			"left": event.pageX,
			"top": event.pageY,
			"width": 0,
			"height": 0
		});

		if (options.autoRefresh) {
			this.refresh();
		}

		this.selectees.filter(".ui-selected").each(function() {
			var selectee = $.data(this, "selectable-item");
			selectee.startselected = true;
			if (!event.metaKey && !event.ctrlKey) {
				selectee.$element.removeClass("ui-selected");
				selectee.selected = false;
				selectee.$element.addClass("ui-unselecting");
				selectee.unselecting = true;
				// selectable UNSELECTING callback
				that._trigger("unselecting", event, {
					unselecting: selectee.element
				});
			}
		});

		$(event.target).parents().addBack().each(function() {
			var doSelect,
				selectee = $.data(this, "selectable-item");
			if (selectee) {
				doSelect = (!event.metaKey && !event.ctrlKey) || !selectee.$element.hasClass("ui-selected");
				selectee.$element
					.removeClass(doSelect ? "ui-unselecting" : "ui-selected")
					.addClass(doSelect ? "ui-selecting" : "ui-unselecting");
				selectee.unselecting = !doSelect;
				selectee.selecting = doSelect;
				selectee.selected = doSelect;
				// selectable (UN)SELECTING callback
				if (doSelect) {
					that._trigger("selecting", event, {
						selecting: selectee.element
					});
				} else {
					that._trigger("unselecting", event, {
						unselecting: selectee.element
					});
				}
				return false;
			}
		});

	},

	_mouseDrag: function(event) {

		this.dragged = true;

		if (this.options.disabled) {
			return;
		}

		var tmp,
			that = this,
			options = this.options,
			x1 = this.opos[0],
			y1 = this.opos[1],
			x2 = event.pageX,
			y2 = event.pageY;

		if (x1 > x2) { tmp = x2; x2 = x1; x1 = tmp; }
		if (y1 > y2) { tmp = y2; y2 = y1; y1 = tmp; }
		this.helper.css({ left: x1, top: y1, width: x2 - x1, height: y2 - y1 });

		this.selectees.each(function() {
			var selectee = $.data(this, "selectable-item"),
				hit = false;

			//prevent helper from being selected if appendTo: selectable
			if (!selectee || selectee.element === that.element[0]) {
				return;
			}

			if (options.tolerance === "touch") {
				hit = ( !(selectee.left > x2 || selectee.right < x1 || selectee.top > y2 || selectee.bottom < y1) );
			} else if (options.tolerance === "fit") {
				hit = (selectee.left > x1 && selectee.right < x2 && selectee.top > y1 && selectee.bottom < y2);
			}

			if (hit) {
				// SELECT
				if (selectee.selected) {
					selectee.$element.removeClass("ui-selected");
					selectee.selected = false;
				}
				if (selectee.unselecting) {
					selectee.$element.removeClass("ui-unselecting");
					selectee.unselecting = false;
				}
				if (!selectee.selecting) {
					selectee.$element.addClass("ui-selecting");
					selectee.selecting = true;
					// selectable SELECTING callback
					that._trigger("selecting", event, {
						selecting: selectee.element
					});
				}
			} else {
				// UNSELECT
				if (selectee.selecting) {
					if ((event.metaKey || event.ctrlKey) && selectee.startselected) {
						selectee.$element.removeClass("ui-selecting");
						selectee.selecting = false;
						selectee.$element.addClass("ui-selected");
						selectee.selected = true;
					} else {
						selectee.$element.removeClass("ui-selecting");
						selectee.selecting = false;
						if (selectee.startselected) {
							selectee.$element.addClass("ui-unselecting");
							selectee.unselecting = true;
						}
						// selectable UNSELECTING callback
						that._trigger("unselecting", event, {
							unselecting: selectee.element
						});
					}
				}
				if (selectee.selected) {
					if (!event.metaKey && !event.ctrlKey && !selectee.startselected) {
						selectee.$element.removeClass("ui-selected");
						selectee.selected = false;

						selectee.$element.addClass("ui-unselecting");
						selectee.unselecting = true;
						// selectable UNSELECTING callback
						that._trigger("unselecting", event, {
							unselecting: selectee.element
						});
					}
				}
			}
		});

		return false;
	},

	_mouseStop: function(event) {
		var that = this;

		this.dragged = false;

		$(".ui-unselecting", this.element[0]).each(function() {
			var selectee = $.data(this, "selectable-item");
			selectee.$element.removeClass("ui-unselecting");
			selectee.unselecting = false;
			selectee.startselected = false;
			that._trigger("unselected", event, {
				unselected: selectee.element
			});
		});
		$(".ui-selecting", this.element[0]).each(function() {
			var selectee = $.data(this, "selectable-item");
			selectee.$element.removeClass("ui-selecting").addClass("ui-selected");
			selectee.selecting = false;
			selectee.selected = true;
			selectee.startselected = true;
			that._trigger("selected", event, {
				selected: selectee.element
			});
		});
		this._trigger("stop", event);

		this.helper.remove();

		return false;
	}

});


/*
 * jQuery UI Sortable 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/sortable/
 */


var sortable = $.widget("ui.sortable", $.ui.mouse, {
	version: "1.11.4",
	widgetEventPrefix: "sort",
	ready: false,
	options: {
		appendTo: "parent",
		axis: false,
		connectWith: false,
		containment: false,
		cursor: "auto",
		cursorAt: false,
		dropOnEmpty: true,
		forcePlaceholderSize: false,
		forceHelperSize: false,
		grid: false,
		handle: false,
		helper: "original",
		items: "> *",
		opacity: false,
		placeholder: false,
		revert: false,
		scroll: true,
		scrollSensitivity: 20,
		scrollSpeed: 20,
		scope: "default",
		tolerance: "intersect",
		zIndex: 1000,

		// callbacks
		activate: null,
		beforeStop: null,
		change: null,
		deactivate: null,
		out: null,
		over: null,
		receive: null,
		remove: null,
		sort: null,
		start: null,
		stop: null,
		update: null
	},

	_isOverAxis: function( x, reference, size ) {
		return ( x >= reference ) && ( x < ( reference + size ) );
	},

	_isFloating: function( item ) {
		return (/left|right/).test(item.css("float")) || (/inline|table-cell/).test(item.css("display"));
	},

	_create: function() {
		this.containerCache = {};
		this.element.addClass("ui-sortable");

		//Get the items
		this.refresh();

		//Let's determine the parent's offset
		this.offset = this.element.offset();

		//Initialize mouse events for interaction
		this._mouseInit();

		this._setHandleClassName();

		//We're ready to go
		this.ready = true;

	},

	_setOption: function( key, value ) {
		this._super( key, value );

		if ( key === "handle" ) {
			this._setHandleClassName();
		}
	},

	_setHandleClassName: function() {
		this.element.find( ".ui-sortable-handle" ).removeClass( "ui-sortable-handle" );
		$.each( this.items, function() {
			( this.instance.options.handle ?
				this.item.find( this.instance.options.handle ) : this.item )
				.addClass( "ui-sortable-handle" );
		});
	},

	_destroy: function() {
		this.element
			.removeClass( "ui-sortable ui-sortable-disabled" )
			.find( ".ui-sortable-handle" )
				.removeClass( "ui-sortable-handle" );
		this._mouseDestroy();

		for ( var i = this.items.length - 1; i >= 0; i-- ) {
			this.items[i].item.removeData(this.widgetName + "-item");
		}

		return this;
	},

	_mouseCapture: function(event, overrideHandle) {
		var currentItem = null,
			validHandle = false,
			that = this;

		if (this.reverting) {
			return false;
		}

		if(this.options.disabled || this.options.type === "static") {
			return false;
		}

		//We have to refresh the items data once first
		this._refreshItems(event);

		//Find out if the clicked node (or one of its parents) is a actual item in this.items
		$(event.target).parents().each(function() {
			if($.data(this, that.widgetName + "-item") === that) {
				currentItem = $(this);
				return false;
			}
		});
		if($.data(event.target, that.widgetName + "-item") === that) {
			currentItem = $(event.target);
		}

		if(!currentItem) {
			return false;
		}
		if(this.options.handle && !overrideHandle) {
			$(this.options.handle, currentItem).find("*").addBack().each(function() {
				if(this === event.target) {
					validHandle = true;
				}
			});
			if(!validHandle) {
				return false;
			}
		}

		this.currentItem = currentItem;
		this._removeCurrentsFromItems();
		return true;

	},

	_mouseStart: function(event, overrideHandle, noActivation) {

		var i, body,
			o = this.options;

		this.currentContainer = this;

		//We only need to call refreshPositions, because the refreshItems call has been moved to mouseCapture
		this.refreshPositions();

		//Create and append the visible helper
		this.helper = this._createHelper(event);

		//Cache the helper size
		this._cacheHelperProportions();

		/*
		 * - Position generation -
		 * This block generates everything position related - it's the core of draggables.
		 */

		//Cache the margins of the original element
		this._cacheMargins();

		//Get the next scrolling parent
		this.scrollParent = this.helper.scrollParent();

		//The element's absolute position on the page minus margins
		this.offset = this.currentItem.offset();
		this.offset = {
			top: this.offset.top - this.margins.top,
			left: this.offset.left - this.margins.left
		};

		$.extend(this.offset, {
			click: { //Where the click happened, relative to the element
				left: event.pageX - this.offset.left,
				top: event.pageY - this.offset.top
			},
			parent: this._getParentOffset(),
			relative: this._getRelativeOffset() //This is a relative to absolute position minus the actual position calculation - only used for relative positioned helper
		});

		// Only after we got the offset, we can change the helper's position to absolute
		// TODO: Still need to figure out a way to make relative sorting possible
		this.helper.css("position", "absolute");
		this.cssPosition = this.helper.css("position");

		//Generate the original position
		this.originalPosition = this._generatePosition(event);
		this.originalPageX = event.pageX;
		this.originalPageY = event.pageY;

		//Adjust the mouse offset relative to the helper if "cursorAt" is supplied
		(o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt));

		//Cache the former DOM position
		this.domPosition = { prev: this.currentItem.prev()[0], parent: this.currentItem.parent()[0] };

		//If the helper is not the original, hide the original so it's not playing any role during the drag, won't cause anything bad this way
		if(this.helper[0] !== this.currentItem[0]) {
			this.currentItem.hide();
		}

		//Create the placeholder
		this._createPlaceholder();

		//Set a containment if given in the options
		if(o.containment) {
			this._setContainment();
		}

		if( o.cursor && o.cursor !== "auto" ) { // cursor option
			body = this.document.find( "body" );

			// support: IE
			this.storedCursor = body.css( "cursor" );
			body.css( "cursor", o.cursor );

			this.storedStylesheet = $( "<style>*{ cursor: "+o.cursor+" !important; }</style>" ).appendTo( body );
		}

		if(o.opacity) { // opacity option
			if (this.helper.css("opacity")) {
				this._storedOpacity = this.helper.css("opacity");
			}
			this.helper.css("opacity", o.opacity);
		}

		if(o.zIndex) { // zIndex option
			if (this.helper.css("zIndex")) {
				this._storedZIndex = this.helper.css("zIndex");
			}
			this.helper.css("zIndex", o.zIndex);
		}

		//Prepare scrolling
		if(this.scrollParent[0] !== this.document[0] && this.scrollParent[0].tagName !== "HTML") {
			this.overflowOffset = this.scrollParent.offset();
		}

		//Call callbacks
		this._trigger("start", event, this._uiHash());

		//Recache the helper size
		if(!this._preserveHelperProportions) {
			this._cacheHelperProportions();
		}


		//Post "activate" events to possible containers
		if( !noActivation ) {
			for ( i = this.containers.length - 1; i >= 0; i-- ) {
				this.containers[ i ]._trigger( "activate", event, this._uiHash( this ) );
			}
		}

		//Prepare possible droppables
		if($.ui.ddmanager) {
			$.ui.ddmanager.current = this;
		}

		if ($.ui.ddmanager && !o.dropBehaviour) {
			$.ui.ddmanager.prepareOffsets(this, event);
		}

		this.dragging = true;

		this.helper.addClass("ui-sortable-helper");
		this._mouseDrag(event); //Execute the drag once - this causes the helper not to be visible before getting its correct position
		return true;

	},

	_mouseDrag: function(event) {
		var i, item, itemElement, intersection,
			o = this.options,
			scrolled = false;

		//Compute the helpers position
		this.position = this._generatePosition(event);
		this.positionAbs = this._convertPositionTo("absolute");

		if (!this.lastPositionAbs) {
			this.lastPositionAbs = this.positionAbs;
		}

		//Do scrolling
		if(this.options.scroll) {
			if(this.scrollParent[0] !== this.document[0] && this.scrollParent[0].tagName !== "HTML") {

				if((this.overflowOffset.top + this.scrollParent[0].offsetHeight) - event.pageY < o.scrollSensitivity) {
					this.scrollParent[0].scrollTop = scrolled = this.scrollParent[0].scrollTop + o.scrollSpeed;
				} else if(event.pageY - this.overflowOffset.top < o.scrollSensitivity) {
					this.scrollParent[0].scrollTop = scrolled = this.scrollParent[0].scrollTop - o.scrollSpeed;
				}

				if((this.overflowOffset.left + this.scrollParent[0].offsetWidth) - event.pageX < o.scrollSensitivity) {
					this.scrollParent[0].scrollLeft = scrolled = this.scrollParent[0].scrollLeft + o.scrollSpeed;
				} else if(event.pageX - this.overflowOffset.left < o.scrollSensitivity) {
					this.scrollParent[0].scrollLeft = scrolled = this.scrollParent[0].scrollLeft - o.scrollSpeed;
				}

			} else {

				if(event.pageY - this.document.scrollTop() < o.scrollSensitivity) {
					scrolled = this.document.scrollTop(this.document.scrollTop() - o.scrollSpeed);
				} else if(this.window.height() - (event.pageY - this.document.scrollTop()) < o.scrollSensitivity) {
					scrolled = this.document.scrollTop(this.document.scrollTop() + o.scrollSpeed);
				}

				if(event.pageX - this.document.scrollLeft() < o.scrollSensitivity) {
					scrolled = this.document.scrollLeft(this.document.scrollLeft() - o.scrollSpeed);
				} else if(this.window.width() - (event.pageX - this.document.scrollLeft()) < o.scrollSensitivity) {
					scrolled = this.document.scrollLeft(this.document.scrollLeft() + o.scrollSpeed);
				}

			}

			if(scrolled !== false && $.ui.ddmanager && !o.dropBehaviour) {
				$.ui.ddmanager.prepareOffsets(this, event);
			}
		}

		//Regenerate the absolute position used for position checks
		this.positionAbs = this._convertPositionTo("absolute");

		//Set the helper position
		if(!this.options.axis || this.options.axis !== "y") {
			this.helper[0].style.left = this.position.left+"px";
		}
		if(!this.options.axis || this.options.axis !== "x") {
			this.helper[0].style.top = this.position.top+"px";
		}

		//Rearrange
		for (i = this.items.length - 1; i >= 0; i--) {

			//Cache variables and intersection, continue if no intersection
			item = this.items[i];
			itemElement = item.item[0];
			intersection = this._intersectsWithPointer(item);
			if (!intersection) {
				continue;
			}

			// Only put the placeholder inside the current Container, skip all
			// items from other containers. This works because when moving
			// an item from one container to another the
			// currentContainer is switched before the placeholder is moved.
			// Without this, moving items in "sub-sortables" can cause
			// the placeholder to jitter between the outer and inner container.
			if (item.instance !== this.currentContainer) {
				continue;
			}

			// cannot intersect with itself
			// no useless actions that have been done before
			// no action if the item moved is the parent of the item checked
			if (itemElement !== this.currentItem[0] &&
				this.placeholder[intersection === 1 ? "next" : "prev"]()[0] !== itemElement &&
				!$.contains(this.placeholder[0], itemElement) &&
				(this.options.type === "semi-dynamic" ? !$.contains(this.element[0], itemElement) : true)
			) {

				this.direction = intersection === 1 ? "down" : "up";

				if (this.options.tolerance === "pointer" || this._intersectsWithSides(item)) {
					this._rearrange(event, item);
				} else {
					break;
				}

				this._trigger("change", event, this._uiHash());
				break;
			}
		}

		//Post events to containers
		this._contactContainers(event);

		//Interconnect with droppables
		if($.ui.ddmanager) {
			$.ui.ddmanager.drag(this, event);
		}

		//Call callbacks
		this._trigger("sort", event, this._uiHash());

		this.lastPositionAbs = this.positionAbs;
		return false;

	},

	_mouseStop: function(event, noPropagation) {

		if(!event) {
			return;
		}

		//If we are using droppables, inform the manager about the drop
		if ($.ui.ddmanager && !this.options.dropBehaviour) {
			$.ui.ddmanager.drop(this, event);
		}

		if(this.options.revert) {
			var that = this,
				cur = this.placeholder.offset(),
				axis = this.options.axis,
				animation = {};

			if ( !axis || axis === "x" ) {
				animation.left = cur.left - this.offset.parent.left - this.margins.left + (this.offsetParent[0] === this.document[0].body ? 0 : this.offsetParent[0].scrollLeft);
			}
			if ( !axis || axis === "y" ) {
				animation.top = cur.top - this.offset.parent.top - this.margins.top + (this.offsetParent[0] === this.document[0].body ? 0 : this.offsetParent[0].scrollTop);
			}
			this.reverting = true;
			$(this.helper).animate( animation, parseInt(this.options.revert, 10) || 500, function() {
				that._clear(event);
			});
		} else {
			this._clear(event, noPropagation);
		}

		return false;

	},

	cancel: function() {

		if(this.dragging) {

			this._mouseUp({ target: null });

			if(this.options.helper === "original") {
				this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper");
			} else {
				this.currentItem.show();
			}

			//Post deactivating events to containers
			for (var i = this.containers.length - 1; i >= 0; i--){
				this.containers[i]._trigger("deactivate", null, this._uiHash(this));
				if(this.containers[i].containerCache.over) {
					this.containers[i]._trigger("out", null, this._uiHash(this));
					this.containers[i].containerCache.over = 0;
				}
			}

		}

		if (this.placeholder) {
			//$(this.placeholder[0]).remove(); would have been the jQuery way - unfortunately, it unbinds ALL events from the original node!
			if(this.placeholder[0].parentNode) {
				this.placeholder[0].parentNode.removeChild(this.placeholder[0]);
			}
			if(this.options.helper !== "original" && this.helper && this.helper[0].parentNode) {
				this.helper.remove();
			}

			$.extend(this, {
				helper: null,
				dragging: false,
				reverting: false,
				_noFinalSort: null
			});

			if(this.domPosition.prev) {
				$(this.domPosition.prev).after(this.currentItem);
			} else {
				$(this.domPosition.parent).prepend(this.currentItem);
			}
		}

		return this;

	},

	serialize: function(o) {

		var items = this._getItemsAsjQuery(o && o.connected),
			str = [];
		o = o || {};

		$(items).each(function() {
			var res = ($(o.item || this).attr(o.attribute || "id") || "").match(o.expression || (/(.+)[\-=_](.+)/));
			if (res) {
				str.push((o.key || res[1]+"[]")+"="+(o.key && o.expression ? res[1] : res[2]));
			}
		});

		if(!str.length && o.key) {
			str.push(o.key + "=");
		}

		return str.join("&");

	},

	toArray: function(o) {

		var items = this._getItemsAsjQuery(o && o.connected),
			ret = [];

		o = o || {};

		items.each(function() { ret.push($(o.item || this).attr(o.attribute || "id") || ""); });
		return ret;

	},

	/* Be careful with the following core functions */
	_intersectsWith: function(item) {

		var x1 = this.positionAbs.left,
			x2 = x1 + this.helperProportions.width,
			y1 = this.positionAbs.top,
			y2 = y1 + this.helperProportions.height,
			l = item.left,
			r = l + item.width,
			t = item.top,
			b = t + item.height,
			dyClick = this.offset.click.top,
			dxClick = this.offset.click.left,
			isOverElementHeight = ( this.options.axis === "x" ) || ( ( y1 + dyClick ) > t && ( y1 + dyClick ) < b ),
			isOverElementWidth = ( this.options.axis === "y" ) || ( ( x1 + dxClick ) > l && ( x1 + dxClick ) < r ),
			isOverElement = isOverElementHeight && isOverElementWidth;

		if ( this.options.tolerance === "pointer" ||
			this.options.forcePointerForContainers ||
			(this.options.tolerance !== "pointer" && this.helperProportions[this.floating ? "width" : "height"] > item[this.floating ? "width" : "height"])
		) {
			return isOverElement;
		} else {

			return (l < x1 + (this.helperProportions.width / 2) && // Right Half
				x2 - (this.helperProportions.width / 2) < r && // Left Half
				t < y1 + (this.helperProportions.height / 2) && // Bottom Half
				y2 - (this.helperProportions.height / 2) < b ); // Top Half

		}
	},

	_intersectsWithPointer: function(item) {

		var isOverElementHeight = (this.options.axis === "x") || this._isOverAxis(this.positionAbs.top + this.offset.click.top, item.top, item.height),
			isOverElementWidth = (this.options.axis === "y") || this._isOverAxis(this.positionAbs.left + this.offset.click.left, item.left, item.width),
			isOverElement = isOverElementHeight && isOverElementWidth,
			verticalDirection = this._getDragVerticalDirection(),
			horizontalDirection = this._getDragHorizontalDirection();

		if (!isOverElement) {
			return false;
		}

		return this.floating ?
			( ((horizontalDirection && horizontalDirection === "right") || verticalDirection === "down") ? 2 : 1 )
			: ( verticalDirection && (verticalDirection === "down" ? 2 : 1) );

	},

	_intersectsWithSides: function(item) {

		var isOverBottomHalf = this._isOverAxis(this.positionAbs.top + this.offset.click.top, item.top + (item.height/2), item.height),
			isOverRightHalf = this._isOverAxis(this.positionAbs.left + this.offset.click.left, item.left + (item.width/2), item.width),
			verticalDirection = this._getDragVerticalDirection(),
			horizontalDirection = this._getDragHorizontalDirection();

		if (this.floating && horizontalDirection) {
			return ((horizontalDirection === "right" && isOverRightHalf) || (horizontalDirection === "left" && !isOverRightHalf));
		} else {
			return verticalDirection && ((verticalDirection === "down" && isOverBottomHalf) || (verticalDirection === "up" && !isOverBottomHalf));
		}

	},

	_getDragVerticalDirection: function() {
		var delta = this.positionAbs.top - this.lastPositionAbs.top;
		return delta !== 0 && (delta > 0 ? "down" : "up");
	},

	_getDragHorizontalDirection: function() {
		var delta = this.positionAbs.left - this.lastPositionAbs.left;
		return delta !== 0 && (delta > 0 ? "right" : "left");
	},

	refresh: function(event) {
		this._refreshItems(event);
		this._setHandleClassName();
		this.refreshPositions();
		return this;
	},

	_connectWith: function() {
		var options = this.options;
		return options.connectWith.constructor === String ? [options.connectWith] : options.connectWith;
	},

	_getItemsAsjQuery: function(connected) {

		var i, j, cur, inst,
			items = [],
			queries = [],
			connectWith = this._connectWith();

		if(connectWith && connected) {
			for (i = connectWith.length - 1; i >= 0; i--){
				cur = $(connectWith[i], this.document[0]);
				for ( j = cur.length - 1; j >= 0; j--){
					inst = $.data(cur[j], this.widgetFullName);
					if(inst && inst !== this && !inst.options.disabled) {
						queries.push([$.isFunction(inst.options.items) ? inst.options.items.call(inst.element) : $(inst.options.items, inst.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), inst]);
					}
				}
			}
		}

		queries.push([$.isFunction(this.options.items) ? this.options.items.call(this.element, null, { options: this.options, item: this.currentItem }) : $(this.options.items, this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), this]);

		function addItems() {
			items.push( this );
		}
		for (i = queries.length - 1; i >= 0; i--){
			queries[i][0].each( addItems );
		}

		return $(items);

	},

	_removeCurrentsFromItems: function() {

		var list = this.currentItem.find(":data(" + this.widgetName + "-item)");

		this.items = $.grep(this.items, function (item) {
			for (var j=0; j < list.length; j++) {
				if(list[j] === item.item[0]) {
					return false;
				}
			}
			return true;
		});

	},

	_refreshItems: function(event) {

		this.items = [];
		this.containers = [this];

		var i, j, cur, inst, targetData, _queries, item, queriesLength,
			items = this.items,
			queries = [[$.isFunction(this.options.items) ? this.options.items.call(this.element[0], event, { item: this.currentItem }) : $(this.options.items, this.element), this]],
			connectWith = this._connectWith();

		if(connectWith && this.ready) { //Shouldn't be run the first time through due to massive slow-down
			for (i = connectWith.length - 1; i >= 0; i--){
				cur = $(connectWith[i], this.document[0]);
				for (j = cur.length - 1; j >= 0; j--){
					inst = $.data(cur[j], this.widgetFullName);
					if(inst && inst !== this && !inst.options.disabled) {
						queries.push([$.isFunction(inst.options.items) ? inst.options.items.call(inst.element[0], event, { item: this.currentItem }) : $(inst.options.items, inst.element), inst]);
						this.containers.push(inst);
					}
				}
			}
		}

		for (i = queries.length - 1; i >= 0; i--) {
			targetData = queries[i][1];
			_queries = queries[i][0];

			for (j=0, queriesLength = _queries.length; j < queriesLength; j++) {
				item = $(_queries[j]);

				item.data(this.widgetName + "-item", targetData); // Data for target checking (mouse manager)

				items.push({
					item: item,
					instance: targetData,
					width: 0, height: 0,
					left: 0, top: 0
				});
			}
		}

	},

	refreshPositions: function(fast) {

		// Determine whether items are being displayed horizontally
		this.floating = this.items.length ?
			this.options.axis === "x" || this._isFloating( this.items[ 0 ].item ) :
			false;

		//This has to be redone because due to the item being moved out/into the offsetParent, the offsetParent's position will change
		if(this.offsetParent && this.helper) {
			this.offset.parent = this._getParentOffset();
		}

		var i, item, t, p;

		for (i = this.items.length - 1; i >= 0; i--){
			item = this.items[i];

			//We ignore calculating positions of all connected containers when we're not over them
			if(item.instance !== this.currentContainer && this.currentContainer && item.item[0] !== this.currentItem[0]) {
				continue;
			}

			t = this.options.toleranceElement ? $(this.options.toleranceElement, item.item) : item.item;

			if (!fast) {
				item.width = t.outerWidth();
				item.height = t.outerHeight();
			}

			p = t.offset();
			item.left = p.left;
			item.top = p.top;
		}

		if(this.options.custom && this.options.custom.refreshContainers) {
			this.options.custom.refreshContainers.call(this);
		} else {
			for (i = this.containers.length - 1; i >= 0; i--){
				p = this.containers[i].element.offset();
				this.containers[i].containerCache.left = p.left;
				this.containers[i].containerCache.top = p.top;
				this.containers[i].containerCache.width = this.containers[i].element.outerWidth();
				this.containers[i].containerCache.height = this.containers[i].element.outerHeight();
			}
		}

		return this;
	},

	_createPlaceholder: function(that) {
		that = that || this;
		var className,
			o = that.options;

		if(!o.placeholder || o.placeholder.constructor === String) {
			className = o.placeholder;
			o.placeholder = {
				element: function() {

					var nodeName = that.currentItem[0].nodeName.toLowerCase(),
						element = $( "<" + nodeName + ">", that.document[0] )
							.addClass(className || that.currentItem[0].className+" ui-sortable-placeholder")
							.removeClass("ui-sortable-helper");

					if ( nodeName === "tbody" ) {
						that._createTrPlaceholder(
							that.currentItem.find( "tr" ).eq( 0 ),
							$( "<tr>", that.document[ 0 ] ).appendTo( element )
						);
					} else if ( nodeName === "tr" ) {
						that._createTrPlaceholder( that.currentItem, element );
					} else if ( nodeName === "img" ) {
						element.attr( "src", that.currentItem.attr( "src" ) );
					}

					if ( !className ) {
						element.css( "visibility", "hidden" );
					}

					return element;
				},
				update: function(container, p) {

					// 1. If a className is set as 'placeholder option, we don't force sizes - the class is responsible for that
					// 2. The option 'forcePlaceholderSize can be enabled to force it even if a class name is specified
					if(className && !o.forcePlaceholderSize) {
						return;
					}

					//If the element doesn't have a actual height by itself (without styles coming from a stylesheet), it receives the inline height from the dragged item
					if(!p.height()) { p.height(that.currentItem.innerHeight() - parseInt(that.currentItem.css("paddingTop")||0, 10) - parseInt(that.currentItem.css("paddingBottom")||0, 10)); }
					if(!p.width()) { p.width(that.currentItem.innerWidth() - parseInt(that.currentItem.css("paddingLeft")||0, 10) - parseInt(that.currentItem.css("paddingRight")||0, 10)); }
				}
			};
		}

		//Create the placeholder
		that.placeholder = $(o.placeholder.element.call(that.element, that.currentItem));

		//Append it after the actual current item
		that.currentItem.after(that.placeholder);

		//Update the size of the placeholder (TODO: Logic to fuzzy, see line 316/317)
		o.placeholder.update(that, that.placeholder);

	},

	_createTrPlaceholder: function( sourceTr, targetTr ) {
		var that = this;

		sourceTr.children().each(function() {
			$( "<td>&#160;</td>", that.document[ 0 ] )
				.attr( "colspan", $( this ).attr( "colspan" ) || 1 )
				.appendTo( targetTr );
		});
	},

	_contactContainers: function(event) {
		var i, j, dist, itemWithLeastDistance, posProperty, sizeProperty, cur, nearBottom, floating, axis,
			innermostContainer = null,
			innermostIndex = null;

		// get innermost container that intersects with item
		for (i = this.containers.length - 1; i >= 0; i--) {

			// never consider a container that's located within the item itself
			if($.contains(this.currentItem[0], this.containers[i].element[0])) {
				continue;
			}

			if(this._intersectsWith(this.containers[i].containerCache)) {

				// if we've already found a container and it's more "inner" than this, then continue
				if(innermostContainer && $.contains(this.containers[i].element[0], innermostContainer.element[0])) {
					continue;
				}

				innermostContainer = this.containers[i];
				innermostIndex = i;

			} else {
				// container doesn't intersect. trigger "out" event if necessary
				if(this.containers[i].containerCache.over) {
					this.containers[i]._trigger("out", event, this._uiHash(this));
					this.containers[i].containerCache.over = 0;
				}
			}

		}

		// if no intersecting containers found, return
		if(!innermostContainer) {
			return;
		}

		// move the item into the container if it's not there already
		if(this.containers.length === 1) {
			if (!this.containers[innermostIndex].containerCache.over) {
				this.containers[innermostIndex]._trigger("over", event, this._uiHash(this));
				this.containers[innermostIndex].containerCache.over = 1;
			}
		} else {

			//When entering a new container, we will find the item with the least distance and append our item near it
			dist = 10000;
			itemWithLeastDistance = null;
			floating = innermostContainer.floating || this._isFloating(this.currentItem);
			posProperty = floating ? "left" : "top";
			sizeProperty = floating ? "width" : "height";
			axis = floating ? "clientX" : "clientY";

			for (j = this.items.length - 1; j >= 0; j--) {
				if(!$.contains(this.containers[innermostIndex].element[0], this.items[j].item[0])) {
					continue;
				}
				if(this.items[j].item[0] === this.currentItem[0]) {
					continue;
				}

				cur = this.items[j].item.offset()[posProperty];
				nearBottom = false;
				if ( event[ axis ] - cur > this.items[ j ][ sizeProperty ] / 2 ) {
					nearBottom = true;
				}

				if ( Math.abs( event[ axis ] - cur ) < dist ) {
					dist = Math.abs( event[ axis ] - cur );
					itemWithLeastDistance = this.items[ j ];
					this.direction = nearBottom ? "up": "down";
				}
			}

			//Check if dropOnEmpty is enabled
			if(!itemWithLeastDistance && !this.options.dropOnEmpty) {
				return;
			}

			if(this.currentContainer === this.containers[innermostIndex]) {
				if ( !this.currentContainer.containerCache.over ) {
					this.containers[ innermostIndex ]._trigger( "over", event, this._uiHash() );
					this.currentContainer.containerCache.over = 1;
				}
				return;
			}

			itemWithLeastDistance ? this._rearrange(event, itemWithLeastDistance, null, true) : this._rearrange(event, null, this.containers[innermostIndex].element, true);
			this._trigger("change", event, this._uiHash());
			this.containers[innermostIndex]._trigger("change", event, this._uiHash(this));
			this.currentContainer = this.containers[innermostIndex];

			//Update the placeholder
			this.options.placeholder.update(this.currentContainer, this.placeholder);

			this.containers[innermostIndex]._trigger("over", event, this._uiHash(this));
			this.containers[innermostIndex].containerCache.over = 1;
		}


	},

	_createHelper: function(event) {

		var o = this.options,
			helper = $.isFunction(o.helper) ? $(o.helper.apply(this.element[0], [event, this.currentItem])) : (o.helper === "clone" ? this.currentItem.clone() : this.currentItem);

		//Add the helper to the DOM if that didn't happen already
		if(!helper.parents("body").length) {
			$(o.appendTo !== "parent" ? o.appendTo : this.currentItem[0].parentNode)[0].appendChild(helper[0]);
		}

		if(helper[0] === this.currentItem[0]) {
			this._storedCSS = { width: this.currentItem[0].style.width, height: this.currentItem[0].style.height, position: this.currentItem.css("position"), top: this.currentItem.css("top"), left: this.currentItem.css("left") };
		}

		if(!helper[0].style.width || o.forceHelperSize) {
			helper.width(this.currentItem.width());
		}
		if(!helper[0].style.height || o.forceHelperSize) {
			helper.height(this.currentItem.height());
		}

		return helper;

	},

	_adjustOffsetFromHelper: function(obj) {
		if (typeof obj === "string") {
			obj = obj.split(" ");
		}
		if ($.isArray(obj)) {
			obj = {left: +obj[0], top: +obj[1] || 0};
		}
		if ("left" in obj) {
			this.offset.click.left = obj.left + this.margins.left;
		}
		if ("right" in obj) {
			this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
		}
		if ("top" in obj) {
			this.offset.click.top = obj.top + this.margins.top;
		}
		if ("bottom" in obj) {
			this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
		}
	},

	_getParentOffset: function() {


		//Get the offsetParent and cache its position
		this.offsetParent = this.helper.offsetParent();
		var po = this.offsetParent.offset();

		// This is a special case where we need to modify a offset calculated on start, since the following happened:
		// 1. The position of the helper is absolute, so it's position is calculated based on the next positioned parent
		// 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't the document, which means that
		//    the scroll is included in the initial calculation of the offset of the parent, and never recalculated upon drag
		if(this.cssPosition === "absolute" && this.scrollParent[0] !== this.document[0] && $.contains(this.scrollParent[0], this.offsetParent[0])) {
			po.left += this.scrollParent.scrollLeft();
			po.top += this.scrollParent.scrollTop();
		}

		// This needs to be actually done for all browsers, since pageX/pageY includes this information
		// with an ugly IE fix
		if( this.offsetParent[0] === this.document[0].body || (this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() === "html" && $.ui.ie)) {
			po = { top: 0, left: 0 };
		}

		return {
			top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"),10) || 0),
			left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"),10) || 0)
		};

	},

	_getRelativeOffset: function() {

		if(this.cssPosition === "relative") {
			var p = this.currentItem.position();
			return {
				top: p.top - (parseInt(this.helper.css("top"),10) || 0) + this.scrollParent.scrollTop(),
				left: p.left - (parseInt(this.helper.css("left"),10) || 0) + this.scrollParent.scrollLeft()
			};
		} else {
			return { top: 0, left: 0 };
		}

	},

	_cacheMargins: function() {
		this.margins = {
			left: (parseInt(this.currentItem.css("marginLeft"),10) || 0),
			top: (parseInt(this.currentItem.css("marginTop"),10) || 0)
		};
	},

	_cacheHelperProportions: function() {
		this.helperProportions = {
			width: this.helper.outerWidth(),
			height: this.helper.outerHeight()
		};
	},

	_setContainment: function() {

		var ce, co, over,
			o = this.options;
		if(o.containment === "parent") {
			o.containment = this.helper[0].parentNode;
		}
		if(o.containment === "document" || o.containment === "window") {
			this.containment = [
				0 - this.offset.relative.left - this.offset.parent.left,
				0 - this.offset.relative.top - this.offset.parent.top,
				o.containment === "document" ? this.document.width() : this.window.width() - this.helperProportions.width - this.margins.left,
				(o.containment === "document" ? this.document.width() : this.window.height() || this.document[0].body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top
			];
		}

		if(!(/^(document|window|parent)$/).test(o.containment)) {
			ce = $(o.containment)[0];
			co = $(o.containment).offset();
			over = ($(ce).css("overflow") !== "hidden");

			this.containment = [
				co.left + (parseInt($(ce).css("borderLeftWidth"),10) || 0) + (parseInt($(ce).css("paddingLeft"),10) || 0) - this.margins.left,
				co.top + (parseInt($(ce).css("borderTopWidth"),10) || 0) + (parseInt($(ce).css("paddingTop"),10) || 0) - this.margins.top,
				co.left+(over ? Math.max(ce.scrollWidth,ce.offsetWidth) : ce.offsetWidth) - (parseInt($(ce).css("borderLeftWidth"),10) || 0) - (parseInt($(ce).css("paddingRight"),10) || 0) - this.helperProportions.width - this.margins.left,
				co.top+(over ? Math.max(ce.scrollHeight,ce.offsetHeight) : ce.offsetHeight) - (parseInt($(ce).css("borderTopWidth"),10) || 0) - (parseInt($(ce).css("paddingBottom"),10) || 0) - this.helperProportions.height - this.margins.top
			];
		}

	},

	_convertPositionTo: function(d, pos) {

		if(!pos) {
			pos = this.position;
		}
		var mod = d === "absolute" ? 1 : -1,
			scroll = this.cssPosition === "absolute" && !(this.scrollParent[0] !== this.document[0] && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent,
			scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

		return {
			top: (
				pos.top	+																// The absolute mouse position
				this.offset.relative.top * mod +										// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.top * mod -											// The offsetParent's offset without borders (offset + border)
				( ( this.cssPosition === "fixed" ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ) * mod)
			),
			left: (
				pos.left +																// The absolute mouse position
				this.offset.relative.left * mod +										// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.left * mod	-										// The offsetParent's offset without borders (offset + border)
				( ( this.cssPosition === "fixed" ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ) * mod)
			)
		};

	},

	_generatePosition: function(event) {

		var top, left,
			o = this.options,
			pageX = event.pageX,
			pageY = event.pageY,
			scroll = this.cssPosition === "absolute" && !(this.scrollParent[0] !== this.document[0] && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

		// This is another very weird special case that only happens for relative elements:
		// 1. If the css position is relative
		// 2. and the scroll parent is the document or similar to the offset parent
		// we have to refresh the relative offset during the scroll so there are no jumps
		if(this.cssPosition === "relative" && !(this.scrollParent[0] !== this.document[0] && this.scrollParent[0] !== this.offsetParent[0])) {
			this.offset.relative = this._getRelativeOffset();
		}

		/*
		 * - Position constraining -
		 * Constrain the position to a mix of grid, containment.
		 */

		if(this.originalPosition) { //If we are not dragging yet, we won't check for options

			if(this.containment) {
				if(event.pageX - this.offset.click.left < this.containment[0]) {
					pageX = this.containment[0] + this.offset.click.left;
				}
				if(event.pageY - this.offset.click.top < this.containment[1]) {
					pageY = this.containment[1] + this.offset.click.top;
				}
				if(event.pageX - this.offset.click.left > this.containment[2]) {
					pageX = this.containment[2] + this.offset.click.left;
				}
				if(event.pageY - this.offset.click.top > this.containment[3]) {
					pageY = this.containment[3] + this.offset.click.top;
				}
			}

			if(o.grid) {
				top = this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1];
				pageY = this.containment ? ( (top - this.offset.click.top >= this.containment[1] && top - this.offset.click.top <= this.containment[3]) ? top : ((top - this.offset.click.top >= this.containment[1]) ? top - o.grid[1] : top + o.grid[1])) : top;

				left = this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0];
				pageX = this.containment ? ( (left - this.offset.click.left >= this.containment[0] && left - this.offset.click.left <= this.containment[2]) ? left : ((left - this.offset.click.left >= this.containment[0]) ? left - o.grid[0] : left + o.grid[0])) : left;
			}

		}

		return {
			top: (
				pageY -																// The absolute mouse position
				this.offset.click.top -													// Click offset (relative to the element)
				this.offset.relative.top	-											// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.top +												// The offsetParent's offset without borders (offset + border)
				( ( this.cssPosition === "fixed" ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ))
			),
			left: (
				pageX -																// The absolute mouse position
				this.offset.click.left -												// Click offset (relative to the element)
				this.offset.relative.left	-											// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.left +												// The offsetParent's offset without borders (offset + border)
				( ( this.cssPosition === "fixed" ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ))
			)
		};

	},

	_rearrange: function(event, i, a, hardRefresh) {

		a ? a[0].appendChild(this.placeholder[0]) : i.item[0].parentNode.insertBefore(this.placeholder[0], (this.direction === "down" ? i.item[0] : i.item[0].nextSibling));

		//Various things done here to improve the performance:
		// 1. we create a setTimeout, that calls refreshPositions
		// 2. on the instance, we have a counter variable, that get's higher after every append
		// 3. on the local scope, we copy the counter variable, and check in the timeout, if it's still the same
		// 4. this lets only the last addition to the timeout stack through
		this.counter = this.counter ? ++this.counter : 1;
		var counter = this.counter;

		this._delay(function() {
			if(counter === this.counter) {
				this.refreshPositions(!hardRefresh); //Precompute after each DOM insertion, NOT on mousemove
			}
		});

	},

	_clear: function(event, noPropagation) {

		this.reverting = false;
		// We delay all events that have to be triggered to after the point where the placeholder has been removed and
		// everything else normalized again
		var i,
			delayedTriggers = [];

		// We first have to update the dom position of the actual currentItem
		// Note: don't do it if the current item is already removed (by a user), or it gets reappended (see #4088)
		if(!this._noFinalSort && this.currentItem.parent().length) {
			this.placeholder.before(this.currentItem);
		}
		this._noFinalSort = null;

		if(this.helper[0] === this.currentItem[0]) {
			for(i in this._storedCSS) {
				if(this._storedCSS[i] === "auto" || this._storedCSS[i] === "static") {
					this._storedCSS[i] = "";
				}
			}
			this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper");
		} else {
			this.currentItem.show();
		}

		if(this.fromOutside && !noPropagation) {
			delayedTriggers.push(function(event) { this._trigger("receive", event, this._uiHash(this.fromOutside)); });
		}
		if((this.fromOutside || this.domPosition.prev !== this.currentItem.prev().not(".ui-sortable-helper")[0] || this.domPosition.parent !== this.currentItem.parent()[0]) && !noPropagation) {
			delayedTriggers.push(function(event) { this._trigger("update", event, this._uiHash()); }); //Trigger update callback if the DOM position has changed
		}

		// Check if the items Container has Changed and trigger appropriate
		// events.
		if (this !== this.currentContainer) {
			if(!noPropagation) {
				delayedTriggers.push(function(event) { this._trigger("remove", event, this._uiHash()); });
				delayedTriggers.push((function(c) { return function(event) { c._trigger("receive", event, this._uiHash(this)); };  }).call(this, this.currentContainer));
				delayedTriggers.push((function(c) { return function(event) { c._trigger("update", event, this._uiHash(this));  }; }).call(this, this.currentContainer));
			}
		}


		//Post events to containers
		function delayEvent( type, instance, container ) {
			return function( event ) {
				container._trigger( type, event, instance._uiHash( instance ) );
			};
		}
		for (i = this.containers.length - 1; i >= 0; i--){
			if (!noPropagation) {
				delayedTriggers.push( delayEvent( "deactivate", this, this.containers[ i ] ) );
			}
			if(this.containers[i].containerCache.over) {
				delayedTriggers.push( delayEvent( "out", this, this.containers[ i ] ) );
				this.containers[i].containerCache.over = 0;
			}
		}

		//Do what was originally in plugins
		if ( this.storedCursor ) {
			this.document.find( "body" ).css( "cursor", this.storedCursor );
			this.storedStylesheet.remove();
		}
		if(this._storedOpacity) {
			this.helper.css("opacity", this._storedOpacity);
		}
		if(this._storedZIndex) {
			this.helper.css("zIndex", this._storedZIndex === "auto" ? "" : this._storedZIndex);
		}

		this.dragging = false;

		if(!noPropagation) {
			this._trigger("beforeStop", event, this._uiHash());
		}

		//$(this.placeholder[0]).remove(); would have been the jQuery way - unfortunately, it unbinds ALL events from the original node!
		this.placeholder[0].parentNode.removeChild(this.placeholder[0]);

		if ( !this.cancelHelperRemoval ) {
			if ( this.helper[ 0 ] !== this.currentItem[ 0 ] ) {
				this.helper.remove();
			}
			this.helper = null;
		}

		if(!noPropagation) {
			for (i=0; i < delayedTriggers.length; i++) {
				delayedTriggers[i].call(this, event);
			} //Trigger all delayed events
			this._trigger("stop", event, this._uiHash());
		}

		this.fromOutside = false;
		return !this.cancelHelperRemoval;

	},

	_trigger: function() {
		if ($.Widget.prototype._trigger.apply(this, arguments) === false) {
			this.cancel();
		}
	},

	_uiHash: function(_inst) {
		var inst = _inst || this;
		return {
			helper: inst.helper,
			placeholder: inst.placeholder || $([]),
			position: inst.position,
			originalPosition: inst.originalPosition,
			offset: inst.positionAbs,
			item: inst.currentItem,
			sender: _inst ? _inst.element : null
		};
	}

});


/*
 * jQuery UI Accordion 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/accordion/
 */


var accordion = $.widget( "ui.accordion", {
	version: "1.11.4",
	options: {
		active: 0,
		animate: {},
		collapsible: false,
		event: "click",
		header: "> li > :first-child,> :not(li):even",
		heightStyle: "auto",
		icons: {
			activeHeader: "ui-icon-triangle-1-s",
			header: "ui-icon-triangle-1-e"
		},

		// callbacks
		activate: null,
		beforeActivate: null
	},

	hideProps: {
		borderTopWidth: "hide",
		borderBottomWidth: "hide",
		paddingTop: "hide",
		paddingBottom: "hide",
		height: "hide"
	},

	showProps: {
		borderTopWidth: "show",
		borderBottomWidth: "show",
		paddingTop: "show",
		paddingBottom: "show",
		height: "show"
	},

	_create: function() {
		var options = this.options;
		this.prevShow = this.prevHide = $();
		this.element.addClass( "ui-accordion ui-widget ui-helper-reset" )
			// ARIA
			.attr( "role", "tablist" );

		// don't allow collapsible: false and active: false / null
		if ( !options.collapsible && (options.active === false || options.active == null) ) {
			options.active = 0;
		}

		this._processPanels();
		// handle negative values
		if ( options.active < 0 ) {
			options.active += this.headers.length;
		}
		this._refresh();
	},

	_getCreateEventData: function() {
		return {
			header: this.active,
			panel: !this.active.length ? $() : this.active.next()
		};
	},

	_createIcons: function() {
		var icons = this.options.icons;
		if ( icons ) {
			$( "<span>" )
				.addClass( "ui-accordion-header-icon ui-icon " + icons.header )
				.prependTo( this.headers );
			this.active.children( ".ui-accordion-header-icon" )
				.removeClass( icons.header )
				.addClass( icons.activeHeader );
			this.headers.addClass( "ui-accordion-icons" );
		}
	},

	_destroyIcons: function() {
		this.headers
			.removeClass( "ui-accordion-icons" )
			.children( ".ui-accordion-header-icon" )
				.remove();
	},

	_destroy: function() {
		var contents;

		// clean up main element
		this.element
			.removeClass( "ui-accordion ui-widget ui-helper-reset" )
			.removeAttr( "role" );

		// clean up headers
		this.headers
			.removeClass( "ui-accordion-header ui-accordion-header-active ui-state-default " +
				"ui-corner-all ui-state-active ui-state-disabled ui-corner-top" )
			.removeAttr( "role" )
			.removeAttr( "aria-expanded" )
			.removeAttr( "aria-selected" )
			.removeAttr( "aria-controls" )
			.removeAttr( "tabIndex" )
			.removeUniqueId();

		this._destroyIcons();

		// clean up content panels
		contents = this.headers.next()
			.removeClass( "ui-helper-reset ui-widget-content ui-corner-bottom " +
				"ui-accordion-content ui-accordion-content-active ui-state-disabled" )
			.css( "display", "" )
			.removeAttr( "role" )
			.removeAttr( "aria-hidden" )
			.removeAttr( "aria-labelledby" )
			.removeUniqueId();

		if ( this.options.heightStyle !== "content" ) {
			contents.css( "height", "" );
		}
	},

	_setOption: function( key, value ) {
		if ( key === "active" ) {
			// _activate() will handle invalid values and update this.options
			this._activate( value );
			return;
		}

		if ( key === "event" ) {
			if ( this.options.event ) {
				this._off( this.headers, this.options.event );
			}
			this._setupEvents( value );
		}

		this._super( key, value );

		// setting collapsible: false while collapsed; open first panel
		if ( key === "collapsible" && !value && this.options.active === false ) {
			this._activate( 0 );
		}

		if ( key === "icons" ) {
			this._destroyIcons();
			if ( value ) {
				this._createIcons();
			}
		}

		// #5332 - opacity doesn't cascade to positioned elements in IE
		// so we need to add the disabled class to the headers and panels
		if ( key === "disabled" ) {
			this.element
				.toggleClass( "ui-state-disabled", !!value )
				.attr( "aria-disabled", value );
			this.headers.add( this.headers.next() )
				.toggleClass( "ui-state-disabled", !!value );
		}
	},

	_keydown: function( event ) {
		if ( event.altKey || event.ctrlKey ) {
			return;
		}

		var keyCode = $.ui.keyCode,
			length = this.headers.length,
			currentIndex = this.headers.index( event.target ),
			toFocus = false;

		switch ( event.keyCode ) {
			case keyCode.RIGHT:
			case keyCode.DOWN:
				toFocus = this.headers[ ( currentIndex + 1 ) % length ];
				break;
			case keyCode.LEFT:
			case keyCode.UP:
				toFocus = this.headers[ ( currentIndex - 1 + length ) % length ];
				break;
			case keyCode.SPACE:
			case keyCode.ENTER:
				this._eventHandler( event );
				break;
			case keyCode.HOME:
				toFocus = this.headers[ 0 ];
				break;
			case keyCode.END:
				toFocus = this.headers[ length - 1 ];
				break;
		}

		if ( toFocus ) {
			$( event.target ).attr( "tabIndex", -1 );
			$( toFocus ).attr( "tabIndex", 0 );
			toFocus.focus();
			event.preventDefault();
		}
	},

	_panelKeyDown: function( event ) {
		if ( event.keyCode === $.ui.keyCode.UP && event.ctrlKey ) {
			$( event.currentTarget ).prev().focus();
		}
	},

	refresh: function() {
		var options = this.options;
		this._processPanels();

		// was collapsed or no panel
		if ( ( options.active === false && options.collapsible === true ) || !this.headers.length ) {
			options.active = false;
			this.active = $();
		// active false only when collapsible is true
		} else if ( options.active === false ) {
			this._activate( 0 );
		// was active, but active panel is gone
		} else if ( this.active.length && !$.contains( this.element[ 0 ], this.active[ 0 ] ) ) {
			// all remaining panel are disabled
			if ( this.headers.length === this.headers.find(".ui-state-disabled").length ) {
				options.active = false;
				this.active = $();
			// activate previous panel
			} else {
				this._activate( Math.max( 0, options.active - 1 ) );
			}
		// was active, active panel still exists
		} else {
			// make sure active index is correct
			options.active = this.headers.index( this.active );
		}

		this._destroyIcons();

		this._refresh();
	},

	_processPanels: function() {
		var prevHeaders = this.headers,
			prevPanels = this.panels;

		this.headers = this.element.find( this.options.header )
			.addClass( "ui-accordion-header ui-state-default ui-corner-all" );

		this.panels = this.headers.next()
			.addClass( "ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom" )
			.filter( ":not(.ui-accordion-content-active)" )
			.hide();

		// Avoid memory leaks (#10056)
		if ( prevPanels ) {
			this._off( prevHeaders.not( this.headers ) );
			this._off( prevPanels.not( this.panels ) );
		}
	},

	_refresh: function() {
		var maxHeight,
			options = this.options,
			heightStyle = options.heightStyle,
			parent = this.element.parent();

		this.active = this._findActive( options.active )
			.addClass( "ui-accordion-header-active ui-state-active ui-corner-top" )
			.removeClass( "ui-corner-all" );
		this.active.next()
			.addClass( "ui-accordion-content-active" )
			.show();

		this.headers
			.attr( "role", "tab" )
			.each(function() {
				var header = $( this ),
					headerId = header.uniqueId().attr( "id" ),
					panel = header.next(),
					panelId = panel.uniqueId().attr( "id" );
				header.attr( "aria-controls", panelId );
				panel.attr( "aria-labelledby", headerId );
			})
			.next()
				.attr( "role", "tabpanel" );

		this.headers
			.not( this.active )
			.attr({
				"aria-selected": "false",
				"aria-expanded": "false",
				tabIndex: -1
			})
			.next()
				.attr({
					"aria-hidden": "true"
				})
				.hide();

		// make sure at least one header is in the tab order
		if ( !this.active.length ) {
			this.headers.eq( 0 ).attr( "tabIndex", 0 );
		} else {
			this.active.attr({
				"aria-selected": "true",
				"aria-expanded": "true",
				tabIndex: 0
			})
			.next()
				.attr({
					"aria-hidden": "false"
				});
		}

		this._createIcons();

		this._setupEvents( options.event );

		if ( heightStyle === "fill" ) {
			maxHeight = parent.height();
			this.element.siblings( ":visible" ).each(function() {
				var elem = $( this ),
					position = elem.css( "position" );

				if ( position === "absolute" || position === "fixed" ) {
					return;
				}
				maxHeight -= elem.outerHeight( true );
			});

			this.headers.each(function() {
				maxHeight -= $( this ).outerHeight( true );
			});

			this.headers.next()
				.each(function() {
					$( this ).height( Math.max( 0, maxHeight -
						$( this ).innerHeight() + $( this ).height() ) );
				})
				.css( "overflow", "auto" );
		} else if ( heightStyle === "auto" ) {
			maxHeight = 0;
			this.headers.next()
				.each(function() {
					maxHeight = Math.max( maxHeight, $( this ).css( "height", "" ).height() );
				})
				.height( maxHeight );
		}
	},

	_activate: function( index ) {
		var active = this._findActive( index )[ 0 ];

		// trying to activate the already active panel
		if ( active === this.active[ 0 ] ) {
			return;
		}

		// trying to collapse, simulate a click on the currently active header
		active = active || this.active[ 0 ];

		this._eventHandler({
			target: active,
			currentTarget: active,
			preventDefault: $.noop
		});
	},

	_findActive: function( selector ) {
		return typeof selector === "number" ? this.headers.eq( selector ) : $();
	},

	_setupEvents: function( event ) {
		var events = {
			keydown: "_keydown"
		};
		if ( event ) {
			$.each( event.split( " " ), function( index, eventName ) {
				events[ eventName ] = "_eventHandler";
			});
		}

		this._off( this.headers.add( this.headers.next() ) );
		this._on( this.headers, events );
		this._on( this.headers.next(), { keydown: "_panelKeyDown" });
		this._hoverable( this.headers );
		this._focusable( this.headers );
	},

	_eventHandler: function( event ) {
		var options = this.options,
			active = this.active,
			clicked = $( event.currentTarget ),
			clickedIsActive = clicked[ 0 ] === active[ 0 ],
			collapsing = clickedIsActive && options.collapsible,
			toShow = collapsing ? $() : clicked.next(),
			toHide = active.next(),
			eventData = {
				oldHeader: active,
				oldPanel: toHide,
				newHeader: collapsing ? $() : clicked,
				newPanel: toShow
			};

		event.preventDefault();

		if (
				// click on active header, but not collapsible
				( clickedIsActive && !options.collapsible ) ||
				// allow canceling activation
				( this._trigger( "beforeActivate", event, eventData ) === false ) ) {
			return;
		}

		options.active = collapsing ? false : this.headers.index( clicked );

		// when the call to ._toggle() comes after the class changes
		// it causes a very odd bug in IE 8 (see #6720)
		this.active = clickedIsActive ? $() : clicked;
		this._toggle( eventData );

		// switch classes
		// corner classes on the previously active header stay after the animation
		active.removeClass( "ui-accordion-header-active ui-state-active" );
		if ( options.icons ) {
			active.children( ".ui-accordion-header-icon" )
				.removeClass( options.icons.activeHeader )
				.addClass( options.icons.header );
		}

		if ( !clickedIsActive ) {
			clicked
				.removeClass( "ui-corner-all" )
				.addClass( "ui-accordion-header-active ui-state-active ui-corner-top" );
			if ( options.icons ) {
				clicked.children( ".ui-accordion-header-icon" )
					.removeClass( options.icons.header )
					.addClass( options.icons.activeHeader );
			}

			clicked
				.next()
				.addClass( "ui-accordion-content-active" );
		}
	},

	_toggle: function( data ) {
		var toShow = data.newPanel,
			toHide = this.prevShow.length ? this.prevShow : data.oldPanel;

		// handle activating a panel during the animation for another activation
		this.prevShow.add( this.prevHide ).stop( true, true );
		this.prevShow = toShow;
		this.prevHide = toHide;

		if ( this.options.animate ) {
			this._animate( toShow, toHide, data );
		} else {
			toHide.hide();
			toShow.show();
			this._toggleComplete( data );
		}

		toHide.attr({
			"aria-hidden": "true"
		});
		toHide.prev().attr({
			"aria-selected": "false",
			"aria-expanded": "false"
		});
		// if we're switching panels, remove the old header from the tab order
		// if we're opening from collapsed state, remove the previous header from the tab order
		// if we're collapsing, then keep the collapsing header in the tab order
		if ( toShow.length && toHide.length ) {
			toHide.prev().attr({
				"tabIndex": -1,
				"aria-expanded": "false"
			});
		} else if ( toShow.length ) {
			this.headers.filter(function() {
				return parseInt( $( this ).attr( "tabIndex" ), 10 ) === 0;
			})
			.attr( "tabIndex", -1 );
		}

		toShow
			.attr( "aria-hidden", "false" )
			.prev()
				.attr({
					"aria-selected": "true",
					"aria-expanded": "true",
					tabIndex: 0
				});
	},

	_animate: function( toShow, toHide, data ) {
		var total, easing, duration,
			that = this,
			adjust = 0,
			boxSizing = toShow.css( "box-sizing" ),
			down = toShow.length &&
				( !toHide.length || ( toShow.index() < toHide.index() ) ),
			animate = this.options.animate || {},
			options = down && animate.down || animate,
			complete = function() {
				that._toggleComplete( data );
			};

		if ( typeof options === "number" ) {
			duration = options;
		}
		if ( typeof options === "string" ) {
			easing = options;
		}
		// fall back from options to animation in case of partial down settings
		easing = easing || options.easing || animate.easing;
		duration = duration || options.duration || animate.duration;

		if ( !toHide.length ) {
			return toShow.animate( this.showProps, duration, easing, complete );
		}
		if ( !toShow.length ) {
			return toHide.animate( this.hideProps, duration, easing, complete );
		}

		total = toShow.show().outerHeight();
		toHide.animate( this.hideProps, {
			duration: duration,
			easing: easing,
			step: function( now, fx ) {
				fx.now = Math.round( now );
			}
		});
		toShow
			.hide()
			.animate( this.showProps, {
				duration: duration,
				easing: easing,
				complete: complete,
				step: function( now, fx ) {
					fx.now = Math.round( now );
					if ( fx.prop !== "height" ) {
						if ( boxSizing === "content-box" ) {
							adjust += fx.now;
						}
					} else if ( that.options.heightStyle !== "content" ) {
						fx.now = Math.round( total - toHide.outerHeight() - adjust );
						adjust = 0;
					}
				}
			});
	},

	_toggleComplete: function( data ) {
		var toHide = data.oldPanel;

		toHide
			.removeClass( "ui-accordion-content-active" )
			.prev()
				.removeClass( "ui-corner-top" )
				.addClass( "ui-corner-all" );

		// Work around for rendering bug in IE (#5421)
		if ( toHide.length ) {
			toHide.parent()[ 0 ].className = toHide.parent()[ 0 ].className;
		}
		this._trigger( "activate", null, data );
	}
});


/*
 * jQuery UI Menu 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/menu/
 */


var menu = $.widget( "ui.menu", {
	version: "1.11.4",
	defaultElement: "<ul>",
	delay: 300,
	options: {
		icons: {
			submenu: "ui-icon-carat-1-e"
		},
		items: "> *",
		menus: "ul",
		position: {
			my: "left-1 top",
			at: "right top"
		},
		role: "menu",

		// callbacks
		blur: null,
		focus: null,
		select: null
	},

	_create: function() {
		this.activeMenu = this.element;

		// Flag used to prevent firing of the click handler
		// as the event bubbles up through nested menus
		this.mouseHandled = false;
		this.element
			.uniqueId()
			.addClass( "ui-menu ui-widget ui-widget-content" )
			.toggleClass( "ui-menu-icons", !!this.element.find( ".ui-icon" ).length )
			.attr({
				role: this.options.role,
				tabIndex: 0
			});

		if ( this.options.disabled ) {
			this.element
				.addClass( "ui-state-disabled" )
				.attr( "aria-disabled", "true" );
		}

		this._on({
			// Prevent focus from sticking to links inside menu after clicking
			// them (focus should always stay on UL during navigation).
			"mousedown .ui-menu-item": function( event ) {
				event.preventDefault();
			},
			"click .ui-menu-item": function( event ) {
				var target = $( event.target );
				if ( !this.mouseHandled && target.not( ".ui-state-disabled" ).length ) {
					this.select( event );

					// Only set the mouseHandled flag if the event will bubble, see #9469.
					if ( !event.isPropagationStopped() ) {
						this.mouseHandled = true;
					}

					// Open submenu on click
					if ( target.has( ".ui-menu" ).length ) {
						this.expand( event );
					} else if ( !this.element.is( ":focus" ) && $( this.document[ 0 ].activeElement ).closest( ".ui-menu" ).length ) {

						// Redirect focus to the menu
						this.element.trigger( "focus", [ true ] );

						// If the active item is on the top level, let it stay active.
						// Otherwise, blur the active item since it is no longer visible.
						if ( this.active && this.active.parents( ".ui-menu" ).length === 1 ) {
							clearTimeout( this.timer );
						}
					}
				}
			},
			"mouseenter .ui-menu-item": function( event ) {
				// Ignore mouse events while typeahead is active, see #10458.
				// Prevents focusing the wrong item when typeahead causes a scroll while the mouse
				// is over an item in the menu
				if ( this.previousFilter ) {
					return;
				}
				var target = $( event.currentTarget );
				// Remove ui-state-active class from siblings of the newly focused menu item
				// to avoid a jump caused by adjacent elements both having a class with a border
				target.siblings( ".ui-state-active" ).removeClass( "ui-state-active" );
				this.focus( event, target );
			},
			mouseleave: "collapseAll",
			"mouseleave .ui-menu": "collapseAll",
			focus: function( event, keepActiveItem ) {
				// If there's already an active item, keep it active
				// If not, activate the first item
				var item = this.active || this.element.find( this.options.items ).eq( 0 );

				if ( !keepActiveItem ) {
					this.focus( event, item );
				}
			},
			blur: function( event ) {
				this._delay(function() {
					if ( !$.contains( this.element[0], this.document[0].activeElement ) ) {
						this.collapseAll( event );
					}
				});
			},
			keydown: "_keydown"
		});

		this.refresh();

		// Clicks outside of a menu collapse any open menus
		this._on( this.document, {
			click: function( event ) {
				if ( this._closeOnDocumentClick( event ) ) {
					this.collapseAll( event );
				}

				// Reset the mouseHandled flag
				this.mouseHandled = false;
			}
		});
	},

	_destroy: function() {
		// Destroy (sub)menus
		this.element
			.removeAttr( "aria-activedescendant" )
			.find( ".ui-menu" ).addBack()
				.removeClass( "ui-menu ui-widget ui-widget-content ui-menu-icons ui-front" )
				.removeAttr( "role" )
				.removeAttr( "tabIndex" )
				.removeAttr( "aria-labelledby" )
				.removeAttr( "aria-expanded" )
				.removeAttr( "aria-hidden" )
				.removeAttr( "aria-disabled" )
				.removeUniqueId()
				.show();

		// Destroy menu items
		this.element.find( ".ui-menu-item" )
			.removeClass( "ui-menu-item" )
			.removeAttr( "role" )
			.removeAttr( "aria-disabled" )
			.removeUniqueId()
			.removeClass( "ui-state-hover" )
			.removeAttr( "tabIndex" )
			.removeAttr( "role" )
			.removeAttr( "aria-haspopup" )
			.children().each( function() {
				var elem = $( this );
				if ( elem.data( "ui-menu-submenu-carat" ) ) {
					elem.remove();
				}
			});

		// Destroy menu dividers
		this.element.find( ".ui-menu-divider" ).removeClass( "ui-menu-divider ui-widget-content" );
	},

	_keydown: function( event ) {
		var match, prev, character, skip,
			preventDefault = true;

		switch ( event.keyCode ) {
		case $.ui.keyCode.PAGE_UP:
			this.previousPage( event );
			break;
		case $.ui.keyCode.PAGE_DOWN:
			this.nextPage( event );
			break;
		case $.ui.keyCode.HOME:
			this._move( "first", "first", event );
			break;
		case $.ui.keyCode.END:
			this._move( "last", "last", event );
			break;
		case $.ui.keyCode.UP:
			this.previous( event );
			break;
		case $.ui.keyCode.DOWN:
			this.next( event );
			break;
		case $.ui.keyCode.LEFT:
			this.collapse( event );
			break;
		case $.ui.keyCode.RIGHT:
			if ( this.active && !this.active.is( ".ui-state-disabled" ) ) {
				this.expand( event );
			}
			break;
		case $.ui.keyCode.ENTER:
		case $.ui.keyCode.SPACE:
			this._activate( event );
			break;
		case $.ui.keyCode.ESCAPE:
			this.collapse( event );
			break;
		default:
			preventDefault = false;
			prev = this.previousFilter || "";
			character = String.fromCharCode( event.keyCode );
			skip = false;

			clearTimeout( this.filterTimer );

			if ( character === prev ) {
				skip = true;
			} else {
				character = prev + character;
			}

			match = this._filterMenuItems( character );
			match = skip && match.index( this.active.next() ) !== -1 ?
				this.active.nextAll( ".ui-menu-item" ) :
				match;

			// If no matches on the current filter, reset to the last character pressed
			// to move down the menu to the first item that starts with that character
			if ( !match.length ) {
				character = String.fromCharCode( event.keyCode );
				match = this._filterMenuItems( character );
			}

			if ( match.length ) {
				this.focus( event, match );
				this.previousFilter = character;
				this.filterTimer = this._delay(function() {
					delete this.previousFilter;
				}, 1000 );
			} else {
				delete this.previousFilter;
			}
		}

		if ( preventDefault ) {
			event.preventDefault();
		}
	},

	_activate: function( event ) {
		if ( !this.active.is( ".ui-state-disabled" ) ) {
			if ( this.active.is( "[aria-haspopup='true']" ) ) {
				this.expand( event );
			} else {
				this.select( event );
			}
		}
	},

	refresh: function() {
		var menus, items,
			that = this,
			icon = this.options.icons.submenu,
			submenus = this.element.find( this.options.menus );

		this.element.toggleClass( "ui-menu-icons", !!this.element.find( ".ui-icon" ).length );

		// Initialize nested menus
		submenus.filter( ":not(.ui-menu)" )
			.addClass( "ui-menu ui-widget ui-widget-content ui-front" )
			.hide()
			.attr({
				role: this.options.role,
				"aria-hidden": "true",
				"aria-expanded": "false"
			})
			.each(function() {
				var menu = $( this ),
					item = menu.parent(),
					submenuCarat = $( "<span>" )
						.addClass( "ui-menu-icon ui-icon " + icon )
						.data( "ui-menu-submenu-carat", true );

				item
					.attr( "aria-haspopup", "true" )
					.prepend( submenuCarat );
				menu.attr( "aria-labelledby", item.attr( "id" ) );
			});

		menus = submenus.add( this.element );
		items = menus.find( this.options.items );

		// Initialize menu-items containing spaces and/or dashes only as dividers
		items.not( ".ui-menu-item" ).each(function() {
			var item = $( this );
			if ( that._isDivider( item ) ) {
				item.addClass( "ui-widget-content ui-menu-divider" );
			}
		});

		// Don't refresh list items that are already adapted
		items.not( ".ui-menu-item, .ui-menu-divider" )
			.addClass( "ui-menu-item" )
			.uniqueId()
			.attr({
				tabIndex: -1,
				role: this._itemRole()
			});

		// Add aria-disabled attribute to any disabled menu item
		items.filter( ".ui-state-disabled" ).attr( "aria-disabled", "true" );

		// If the active item has been removed, blur the menu
		if ( this.active && !$.contains( this.element[ 0 ], this.active[ 0 ] ) ) {
			this.blur();
		}
	},

	_itemRole: function() {
		return {
			menu: "menuitem",
			listbox: "option"
		}[ this.options.role ];
	},

	_setOption: function( key, value ) {
		if ( key === "icons" ) {
			this.element.find( ".ui-menu-icon" )
				.removeClass( this.options.icons.submenu )
				.addClass( value.submenu );
		}
		if ( key === "disabled" ) {
			this.element
				.toggleClass( "ui-state-disabled", !!value )
				.attr( "aria-disabled", value );
		}
		this._super( key, value );
	},

	focus: function( event, item ) {
		var nested, focused;
		this.blur( event, event && event.type === "focus" );

		this._scrollIntoView( item );

		this.active = item.first();
		focused = this.active.addClass( "ui-state-focus" ).removeClass( "ui-state-active" );
		// Only update aria-activedescendant if there's a role
		// otherwise we assume focus is managed elsewhere
		if ( this.options.role ) {
			this.element.attr( "aria-activedescendant", focused.attr( "id" ) );
		}

		// Highlight active parent menu item, if any
		this.active
			.parent()
			.closest( ".ui-menu-item" )
			.addClass( "ui-state-active" );

		if ( event && event.type === "keydown" ) {
			this._close();
		} else {
			this.timer = this._delay(function() {
				this._close();
			}, this.delay );
		}

		nested = item.children( ".ui-menu" );
		if ( nested.length && event && ( /^mouse/.test( event.type ) ) ) {
			this._startOpening(nested);
		}
		this.activeMenu = item.parent();

		this._trigger( "focus", event, { item: item } );
	},

	_scrollIntoView: function( item ) {
		var borderTop, paddingTop, offset, scroll, elementHeight, itemHeight;
		if ( this._hasScroll() ) {
			borderTop = parseFloat( $.css( this.activeMenu[0], "borderTopWidth" ) ) || 0;
			paddingTop = parseFloat( $.css( this.activeMenu[0], "paddingTop" ) ) || 0;
			offset = item.offset().top - this.activeMenu.offset().top - borderTop - paddingTop;
			scroll = this.activeMenu.scrollTop();
			elementHeight = this.activeMenu.height();
			itemHeight = item.outerHeight();

			if ( offset < 0 ) {
				this.activeMenu.scrollTop( scroll + offset );
			} else if ( offset + itemHeight > elementHeight ) {
				this.activeMenu.scrollTop( scroll + offset - elementHeight + itemHeight );
			}
		}
	},

	blur: function( event, fromFocus ) {
		if ( !fromFocus ) {
			clearTimeout( this.timer );
		}

		if ( !this.active ) {
			return;
		}

		this.active.removeClass( "ui-state-focus" );
		this.active = null;

		this._trigger( "blur", event, { item: this.active } );
	},

	_startOpening: function( submenu ) {
		clearTimeout( this.timer );

		// Don't open if already open fixes a Firefox bug that caused a .5 pixel
		// shift in the submenu position when mousing over the carat icon
		if ( submenu.attr( "aria-hidden" ) !== "true" ) {
			return;
		}

		this.timer = this._delay(function() {
			this._close();
			this._open( submenu );
		}, this.delay );
	},

	_open: function( submenu ) {
		var position = $.extend({
			of: this.active
		}, this.options.position );

		clearTimeout( this.timer );
		this.element.find( ".ui-menu" ).not( submenu.parents( ".ui-menu" ) )
			.hide()
			.attr( "aria-hidden", "true" );

		submenu
			.show()
			.removeAttr( "aria-hidden" )
			.attr( "aria-expanded", "true" )
			.position( position );
	},

	collapseAll: function( event, all ) {
		clearTimeout( this.timer );
		this.timer = this._delay(function() {
			// If we were passed an event, look for the submenu that contains the event
			var currentMenu = all ? this.element :
				$( event && event.target ).closest( this.element.find( ".ui-menu" ) );

			// If we found no valid submenu ancestor, use the main menu to close all sub menus anyway
			if ( !currentMenu.length ) {
				currentMenu = this.element;
			}

			this._close( currentMenu );

			this.blur( event );
			this.activeMenu = currentMenu;
		}, this.delay );
	},

	// With no arguments, closes the currently active menu - if nothing is active
	// it closes all menus.  If passed an argument, it will search for menus BELOW
	_close: function( startMenu ) {
		if ( !startMenu ) {
			startMenu = this.active ? this.active.parent() : this.element;
		}

		startMenu
			.find( ".ui-menu" )
				.hide()
				.attr( "aria-hidden", "true" )
				.attr( "aria-expanded", "false" )
			.end()
			.find( ".ui-state-active" ).not( ".ui-state-focus" )
				.removeClass( "ui-state-active" );
	},

	_closeOnDocumentClick: function( event ) {
		return !$( event.target ).closest( ".ui-menu" ).length;
	},

	_isDivider: function( item ) {

		// Match hyphen, em dash, en dash
		return !/[^\-\u2014\u2013\s]/.test( item.text() );
	},

	collapse: function( event ) {
		var newItem = this.active &&
			this.active.parent().closest( ".ui-menu-item", this.element );
		if ( newItem && newItem.length ) {
			this._close();
			this.focus( event, newItem );
		}
	},

	expand: function( event ) {
		var newItem = this.active &&
			this.active
				.children( ".ui-menu " )
				.find( this.options.items )
				.first();

		if ( newItem && newItem.length ) {
			this._open( newItem.parent() );

			// Delay so Firefox will not hide activedescendant change in expanding submenu from AT
			this._delay(function() {
				this.focus( event, newItem );
			});
		}
	},

	next: function( event ) {
		this._move( "next", "first", event );
	},

	previous: function( event ) {
		this._move( "prev", "last", event );
	},

	isFirstItem: function() {
		return this.active && !this.active.prevAll( ".ui-menu-item" ).length;
	},

	isLastItem: function() {
		return this.active && !this.active.nextAll( ".ui-menu-item" ).length;
	},

	_move: function( direction, filter, event ) {
		var next;
		if ( this.active ) {
			if ( direction === "first" || direction === "last" ) {
				next = this.active
					[ direction === "first" ? "prevAll" : "nextAll" ]( ".ui-menu-item" )
					.eq( -1 );
			} else {
				next = this.active
					[ direction + "All" ]( ".ui-menu-item" )
					.eq( 0 );
			}
		}
		if ( !next || !next.length || !this.active ) {
			next = this.activeMenu.find( this.options.items )[ filter ]();
		}

		this.focus( event, next );
	},

	nextPage: function( event ) {
		var item, base, height;

		if ( !this.active ) {
			this.next( event );
			return;
		}
		if ( this.isLastItem() ) {
			return;
		}
		if ( this._hasScroll() ) {
			base = this.active.offset().top;
			height = this.element.height();
			this.active.nextAll( ".ui-menu-item" ).each(function() {
				item = $( this );
				return item.offset().top - base - height < 0;
			});

			this.focus( event, item );
		} else {
			this.focus( event, this.activeMenu.find( this.options.items )
				[ !this.active ? "first" : "last" ]() );
		}
	},

	previousPage: function( event ) {
		var item, base, height;
		if ( !this.active ) {
			this.next( event );
			return;
		}
		if ( this.isFirstItem() ) {
			return;
		}
		if ( this._hasScroll() ) {
			base = this.active.offset().top;
			height = this.element.height();
			this.active.prevAll( ".ui-menu-item" ).each(function() {
				item = $( this );
				return item.offset().top - base + height > 0;
			});

			this.focus( event, item );
		} else {
			this.focus( event, this.activeMenu.find( this.options.items ).first() );
		}
	},

	_hasScroll: function() {
		return this.element.outerHeight() < this.element.prop( "scrollHeight" );
	},

	select: function( event ) {
		// TODO: It should never be possible to not have an active item at this
		// point, but the tests don't trigger mouseenter before click.
		this.active = this.active || $( event.target ).closest( ".ui-menu-item" );
		var ui = { item: this.active };
		if ( !this.active.has( ".ui-menu" ).length ) {
			this.collapseAll( event, true );
		}
		this._trigger( "select", event, ui );
	},

	_filterMenuItems: function(character) {
		var escapedCharacter = character.replace( /[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&" ),
			regex = new RegExp( "^" + escapedCharacter, "i" );

		return this.activeMenu
			.find( this.options.items )

			// Only match on items, not dividers or other content (#10571)
			.filter( ".ui-menu-item" )
			.filter(function() {
				return regex.test( $.trim( $( this ).text() ) );
			});
	}
});


/*
 * jQuery UI Autocomplete 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/autocomplete/
 */


$.widget( "ui.autocomplete", {
	version: "1.11.4",
	defaultElement: "<input>",
	options: {
		appendTo: null,
		autoFocus: false,
		delay: 300,
		minLength: 1,
		position: {
			my: "left top",
			at: "left bottom",
			collision: "none"
		},
		source: null,

		// callbacks
		change: null,
		close: null,
		focus: null,
		open: null,
		response: null,
		search: null,
		select: null
	},

	requestIndex: 0,
	pending: 0,

	_create: function() {
		// Some browsers only repeat keydown events, not keypress events,
		// so we use the suppressKeyPress flag to determine if we've already
		// handled the keydown event. #7269
		// Unfortunately the code for & in keypress is the same as the up arrow,
		// so we use the suppressKeyPressRepeat flag to avoid handling keypress
		// events when we know the keydown event was used to modify the
		// search term. #7799
		var suppressKeyPress, suppressKeyPressRepeat, suppressInput,
			nodeName = this.element[ 0 ].nodeName.toLowerCase(),
			isTextarea = nodeName === "textarea",
			isInput = nodeName === "input";

		this.isMultiLine =
			// Textareas are always multi-line
			isTextarea ? true :
			// Inputs are always single-line, even if inside a contentEditable element
			// IE also treats inputs as contentEditable
			isInput ? false :
			// All other element types are determined by whether or not they're contentEditable
			this.element.prop( "isContentEditable" );

		this.valueMethod = this.element[ isTextarea || isInput ? "val" : "text" ];
		this.isNewMenu = true;

		this.element
			.addClass( "ui-autocomplete-input" )
			.attr( "autocomplete", "off" );

		this._on( this.element, {
			keydown: function( event ) {
				if ( this.element.prop( "readOnly" ) ) {
					suppressKeyPress = true;
					suppressInput = true;
					suppressKeyPressRepeat = true;
					return;
				}

				suppressKeyPress = false;
				suppressInput = false;
				suppressKeyPressRepeat = false;
				var keyCode = $.ui.keyCode;
				switch ( event.keyCode ) {
				case keyCode.PAGE_UP:
					suppressKeyPress = true;
					this._move( "previousPage", event );
					break;
				case keyCode.PAGE_DOWN:
					suppressKeyPress = true;
					this._move( "nextPage", event );
					break;
				case keyCode.UP:
					suppressKeyPress = true;
					this._keyEvent( "previous", event );
					break;
				case keyCode.DOWN:
					suppressKeyPress = true;
					this._keyEvent( "next", event );
					break;
				case keyCode.ENTER:
					// when menu is open and has focus
					if ( this.menu.active ) {
						// #6055 - Opera still allows the keypress to occur
						// which causes forms to submit
						suppressKeyPress = true;
						event.preventDefault();
						this.menu.select( event );
					}
					break;
				case keyCode.TAB:
					if ( this.menu.active ) {
						this.menu.select( event );
					}
					break;
				case keyCode.ESCAPE:
					if ( this.menu.element.is( ":visible" ) ) {
						if ( !this.isMultiLine ) {
							this._value( this.term );
						}
						this.close( event );
						// Different browsers have different default behavior for escape
						// Single press can mean undo or clear
						// Double press in IE means clear the whole form
						event.preventDefault();
					}
					break;
				default:
					suppressKeyPressRepeat = true;
					// search timeout should be triggered before the input value is changed
					this._searchTimeout( event );
					break;
				}
			},
			keypress: function( event ) {
				if ( suppressKeyPress ) {
					suppressKeyPress = false;
					if ( !this.isMultiLine || this.menu.element.is( ":visible" ) ) {
						event.preventDefault();
					}
					return;
				}
				if ( suppressKeyPressRepeat ) {
					return;
				}

				// replicate some key handlers to allow them to repeat in Firefox and Opera
				var keyCode = $.ui.keyCode;
				switch ( event.keyCode ) {
				case keyCode.PAGE_UP:
					this._move( "previousPage", event );
					break;
				case keyCode.PAGE_DOWN:
					this._move( "nextPage", event );
					break;
				case keyCode.UP:
					this._keyEvent( "previous", event );
					break;
				case keyCode.DOWN:
					this._keyEvent( "next", event );
					break;
				}
			},
			input: function( event ) {
				if ( suppressInput ) {
					suppressInput = false;
					event.preventDefault();
					return;
				}
				this._searchTimeout( event );
			},
			focus: function() {
				this.selectedItem = null;
				this.previous = this._value();
			},
			blur: function( event ) {
				if ( this.cancelBlur ) {
					delete this.cancelBlur;
					return;
				}

				clearTimeout( this.searching );
				this.close( event );
				this._change( event );
			}
		});

		this._initSource();
		this.menu = $( "<ul>" )
			.addClass( "ui-autocomplete ui-front" )
			.appendTo( this._appendTo() )
			.menu({
				// disable ARIA support, the live region takes care of that
				role: null
			})
			.hide()
			.menu( "instance" );

		this._on( this.menu.element, {
			mousedown: function( event ) {
				// prevent moving focus out of the text field
				event.preventDefault();

				// IE doesn't prevent moving focus even with event.preventDefault()
				// so we set a flag to know when we should ignore the blur event
				this.cancelBlur = true;
				this._delay(function() {
					delete this.cancelBlur;
				});

				// clicking on the scrollbar causes focus to shift to the body
				// but we can't detect a mouseup or a click immediately afterward
				// so we have to track the next mousedown and close the menu if
				// the user clicks somewhere outside of the autocomplete
				var menuElement = this.menu.element[ 0 ];
				if ( !$( event.target ).closest( ".ui-menu-item" ).length ) {
					this._delay(function() {
						var that = this;
						this.document.one( "mousedown", function( event ) {
							if ( event.target !== that.element[ 0 ] &&
									event.target !== menuElement &&
									!$.contains( menuElement, event.target ) ) {
								that.close();
							}
						});
					});
				}
			},
			menufocus: function( event, ui ) {
				var label, item;
				// support: Firefox
				// Prevent accidental activation of menu items in Firefox (#7024 #9118)
				if ( this.isNewMenu ) {
					this.isNewMenu = false;
					if ( event.originalEvent && /^mouse/.test( event.originalEvent.type ) ) {
						this.menu.blur();

						this.document.one( "mousemove", function() {
							$( event.target ).trigger( event.originalEvent );
						});

						return;
					}
				}

				item = ui.item.data( "ui-autocomplete-item" );
				if ( false !== this._trigger( "focus", event, { item: item } ) ) {
					// use value to match what will end up in the input, if it was a key event
					if ( event.originalEvent && /^key/.test( event.originalEvent.type ) ) {
						this._value( item.value );
					}
				}

				// Announce the value in the liveRegion
				label = ui.item.attr( "aria-label" ) || item.value;
				if ( label && $.trim( label ).length ) {
					this.liveRegion.children().hide();
					$( "<div>" ).text( label ).appendTo( this.liveRegion );
				}
			},
			menuselect: function( event, ui ) {
				var item = ui.item.data( "ui-autocomplete-item" ),
					previous = this.previous;

				// only trigger when focus was lost (click on menu)
				if ( this.element[ 0 ] !== this.document[ 0 ].activeElement ) {
					this.element.focus();
					this.previous = previous;
					// #6109 - IE triggers two focus events and the second
					// is asynchronous, so we need to reset the previous
					// term synchronously and asynchronously :-(
					this._delay(function() {
						this.previous = previous;
						this.selectedItem = item;
					});
				}

				if ( false !== this._trigger( "select", event, { item: item } ) ) {
					this._value( item.value );
				}
				// reset the term after the select event
				// this allows custom select handling to work properly
				this.term = this._value();

				this.close( event );
				this.selectedItem = item;
			}
		});

		this.liveRegion = $( "<span>", {
				role: "status",
				"aria-live": "assertive",
				"aria-relevant": "additions"
			})
			.addClass( "ui-helper-hidden-accessible" )
			.appendTo( this.document[ 0 ].body );

		// turning off autocomplete prevents the browser from remembering the
		// value when navigating through history, so we re-enable autocomplete
		// if the page is unloaded before the widget is destroyed. #7790
		this._on( this.window, {
			beforeunload: function() {
				this.element.removeAttr( "autocomplete" );
			}
		});
	},

	_destroy: function() {
		clearTimeout( this.searching );
		this.element
			.removeClass( "ui-autocomplete-input" )
			.removeAttr( "autocomplete" );
		this.menu.element.remove();
		this.liveRegion.remove();
	},

	_setOption: function( key, value ) {
		this._super( key, value );
		if ( key === "source" ) {
			this._initSource();
		}
		if ( key === "appendTo" ) {
			this.menu.element.appendTo( this._appendTo() );
		}
		if ( key === "disabled" && value && this.xhr ) {
			this.xhr.abort();
		}
	},

	_appendTo: function() {
		var element = this.options.appendTo;

		if ( element ) {
			element = element.jquery || element.nodeType ?
				$( element ) :
				this.document.find( element ).eq( 0 );
		}

		if ( !element || !element[ 0 ] ) {
			element = this.element.closest( ".ui-front" );
		}

		if ( !element.length ) {
			element = this.document[ 0 ].body;
		}

		return element;
	},

	_initSource: function() {
		var array, url,
			that = this;
		if ( $.isArray( this.options.source ) ) {
			array = this.options.source;
			this.source = function( request, response ) {
				response( $.ui.autocomplete.filter( array, request.term ) );
			};
		} else if ( typeof this.options.source === "string" ) {
			url = this.options.source;
			this.source = function( request, response ) {
				if ( that.xhr ) {
					that.xhr.abort();
				}
				that.xhr = $.ajax({
					url: url,
					data: request,
					dataType: "json",
					success: function( data ) {
						response( data );
					},
					error: function() {
						response([]);
					}
				});
			};
		} else {
			this.source = this.options.source;
		}
	},

	_searchTimeout: function( event ) {
		clearTimeout( this.searching );
		this.searching = this._delay(function() {

			// Search if the value has changed, or if the user retypes the same value (see #7434)
			var equalValues = this.term === this._value(),
				menuVisible = this.menu.element.is( ":visible" ),
				modifierKey = event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;

			if ( !equalValues || ( equalValues && !menuVisible && !modifierKey ) ) {
				this.selectedItem = null;
				this.search( null, event );
			}
		}, this.options.delay );
	},

	search: function( value, event ) {
		value = value != null ? value : this._value();

		// always save the actual value, not the one passed as an argument
		this.term = this._value();

		if ( value.length < this.options.minLength ) {
			return this.close( event );
		}

		if ( this._trigger( "search", event ) === false ) {
			return;
		}

		return this._search( value );
	},

	_search: function( value ) {
		this.pending++;
		this.element.addClass( "ui-autocomplete-loading" );
		this.cancelSearch = false;

		this.source( { term: value }, this._response() );
	},

	_response: function() {
		var index = ++this.requestIndex;

		return $.proxy(function( content ) {
			if ( index === this.requestIndex ) {
				this.__response( content );
			}

			this.pending--;
			if ( !this.pending ) {
				this.element.removeClass( "ui-autocomplete-loading" );
			}
		}, this );
	},

	__response: function( content ) {
		if ( content ) {
			content = this._normalize( content );
		}
		this._trigger( "response", null, { content: content } );
		if ( !this.options.disabled && content && content.length && !this.cancelSearch ) {
			this._suggest( content );
			this._trigger( "open" );
		} else {
			// use ._close() instead of .close() so we don't cancel future searches
			this._close();
		}
	},

	close: function( event ) {
		this.cancelSearch = true;
		this._close( event );
	},

	_close: function( event ) {
		if ( this.menu.element.is( ":visible" ) ) {
			this.menu.element.hide();
			this.menu.blur();
			this.isNewMenu = true;
			this._trigger( "close", event );
		}
	},

	_change: function( event ) {
		if ( this.previous !== this._value() ) {
			this._trigger( "change", event, { item: this.selectedItem } );
		}
	},

	_normalize: function( items ) {
		// assume all items have the right format when the first item is complete
		if ( items.length && items[ 0 ].label && items[ 0 ].value ) {
			return items;
		}
		return $.map( items, function( item ) {
			if ( typeof item === "string" ) {
				return {
					label: item,
					value: item
				};
			}
			return $.extend( {}, item, {
				label: item.label || item.value,
				value: item.value || item.label
			});
		});
	},

	_suggest: function( items ) {
		var ul = this.menu.element.empty();
		this._renderMenu( ul, items );
		this.isNewMenu = true;
		this.menu.refresh();

		// size and position menu
		ul.show();
		this._resizeMenu();
		ul.position( $.extend({
			of: this.element
		}, this.options.position ) );

		if ( this.options.autoFocus ) {
			this.menu.next();
		}
	},

	_resizeMenu: function() {
		var ul = this.menu.element;
		ul.outerWidth( Math.max(
			// Firefox wraps long text (possibly a rounding bug)
			// so we add 1px to avoid the wrapping (#7513)
			ul.width( "" ).outerWidth() + 1,
			this.element.outerWidth()
		) );
	},

	_renderMenu: function( ul, items ) {
		var that = this;
		$.each( items, function( index, item ) {
			that._renderItemData( ul, item );
		});
	},

	_renderItemData: function( ul, item ) {
		return this._renderItem( ul, item ).data( "ui-autocomplete-item", item );
	},

	_renderItem: function( ul, item ) {
		return $( "<li>" ).text( item.label ).appendTo( ul );
	},

	_move: function( direction, event ) {
		if ( !this.menu.element.is( ":visible" ) ) {
			this.search( null, event );
			return;
		}
		if ( this.menu.isFirstItem() && /^previous/.test( direction ) ||
				this.menu.isLastItem() && /^next/.test( direction ) ) {

			if ( !this.isMultiLine ) {
				this._value( this.term );
			}

			this.menu.blur();
			return;
		}
		this.menu[ direction ]( event );
	},

	widget: function() {
		return this.menu.element;
	},

	_value: function() {
		return this.valueMethod.apply( this.element, arguments );
	},

	_keyEvent: function( keyEvent, event ) {
		if ( !this.isMultiLine || this.menu.element.is( ":visible" ) ) {
			this._move( keyEvent, event );

			// prevents moving cursor to beginning/end of the text field in some browsers
			event.preventDefault();
		}
	}
});

$.extend( $.ui.autocomplete, {
	escapeRegex: function( value ) {
		return value.replace( /[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&" );
	},
	filter: function( array, term ) {
		var matcher = new RegExp( $.ui.autocomplete.escapeRegex( term ), "i" );
		return $.grep( array, function( value ) {
			return matcher.test( value.label || value.value || value );
		});
	}
});

// live region extension, adding a `messages` option
// NOTE: This is an experimental API. We are still investigating
// a full solution for string manipulation and internationalization.
$.widget( "ui.autocomplete", $.ui.autocomplete, {
	options: {
		messages: {
			noResults: "No search results.",
			results: function( amount ) {
				return amount + ( amount > 1 ? " results are" : " result is" ) +
					" available, use up and down arrow keys to navigate.";
			}
		}
	},

	__response: function( content ) {
		var message;
		this._superApply( arguments );
		if ( this.options.disabled || this.cancelSearch ) {
			return;
		}
		if ( content && content.length ) {
			message = this.options.messages.results( content.length );
		} else {
			message = this.options.messages.noResults;
		}
		this.liveRegion.children().hide();
		$( "<div>" ).text( message ).appendTo( this.liveRegion );
	}
});

var autocomplete = $.ui.autocomplete;


/*
 * jQuery UI Button 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/button/
 */


var lastActive,
	baseClasses = "ui-button ui-widget ui-state-default ui-corner-all",
	typeClasses = "ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only",
	formResetHandler = function() {
		var form = $( this );
		setTimeout(function() {
			form.find( ":ui-button" ).button( "refresh" );
		}, 1 );
	},
	radioGroup = function( radio ) {
		var name = radio.name,
			form = radio.form,
			radios = $( [] );
		if ( name ) {
			name = name.replace( /'/g, "\\'" );
			if ( form ) {
				radios = $( form ).find( "[name='" + name + "'][type=radio]" );
			} else {
				radios = $( "[name='" + name + "'][type=radio]", radio.ownerDocument )
					.filter(function() {
						return !this.form;
					});
			}
		}
		return radios;
	};

$.widget( "ui.button", {
	version: "1.11.4",
	defaultElement: "<button>",
	options: {
		disabled: null,
		text: true,
		label: null,
		icons: {
			primary: null,
			secondary: null
		}
	},
	_create: function() {
		this.element.closest( "form" )
			.unbind( "reset" + this.eventNamespace )
			.bind( "reset" + this.eventNamespace, formResetHandler );

		if ( typeof this.options.disabled !== "boolean" ) {
			this.options.disabled = !!this.element.prop( "disabled" );
		} else {
			this.element.prop( "disabled", this.options.disabled );
		}

		this._determineButtonType();
		this.hasTitle = !!this.buttonElement.attr( "title" );

		var that = this,
			options = this.options,
			toggleButton = this.type === "checkbox" || this.type === "radio",
			activeClass = !toggleButton ? "ui-state-active" : "";

		if ( options.label === null ) {
			options.label = (this.type === "input" ? this.buttonElement.val() : this.buttonElement.html());
		}

		this._hoverable( this.buttonElement );

		this.buttonElement
			.addClass( baseClasses )
			.attr( "role", "button" )
			.bind( "mouseenter" + this.eventNamespace, function() {
				if ( options.disabled ) {
					return;
				}
				if ( this === lastActive ) {
					$( this ).addClass( "ui-state-active" );
				}
			})
			.bind( "mouseleave" + this.eventNamespace, function() {
				if ( options.disabled ) {
					return;
				}
				$( this ).removeClass( activeClass );
			})
			.bind( "click" + this.eventNamespace, function( event ) {
				if ( options.disabled ) {
					event.preventDefault();
					event.stopImmediatePropagation();
				}
			});

		// Can't use _focusable() because the element that receives focus
		// and the element that gets the ui-state-focus class are different
		this._on({
			focus: function() {
				this.buttonElement.addClass( "ui-state-focus" );
			},
			blur: function() {
				this.buttonElement.removeClass( "ui-state-focus" );
			}
		});

		if ( toggleButton ) {
			this.element.bind( "change" + this.eventNamespace, function() {
				that.refresh();
			});
		}

		if ( this.type === "checkbox" ) {
			this.buttonElement.bind( "click" + this.eventNamespace, function() {
				if ( options.disabled ) {
					return false;
				}
			});
		} else if ( this.type === "radio" ) {
			this.buttonElement.bind( "click" + this.eventNamespace, function() {
				if ( options.disabled ) {
					return false;
				}
				$( this ).addClass( "ui-state-active" );
				that.buttonElement.attr( "aria-pressed", "true" );

				var radio = that.element[ 0 ];
				radioGroup( radio )
					.not( radio )
					.map(function() {
						return $( this ).button( "widget" )[ 0 ];
					})
					.removeClass( "ui-state-active" )
					.attr( "aria-pressed", "false" );
			});
		} else {
			this.buttonElement
				.bind( "mousedown" + this.eventNamespace, function() {
					if ( options.disabled ) {
						return false;
					}
					$( this ).addClass( "ui-state-active" );
					lastActive = this;
					that.document.one( "mouseup", function() {
						lastActive = null;
					});
				})
				.bind( "mouseup" + this.eventNamespace, function() {
					if ( options.disabled ) {
						return false;
					}
					$( this ).removeClass( "ui-state-active" );
				})
				.bind( "keydown" + this.eventNamespace, function(event) {
					if ( options.disabled ) {
						return false;
					}
					if ( event.keyCode === $.ui.keyCode.SPACE || event.keyCode === $.ui.keyCode.ENTER ) {
						$( this ).addClass( "ui-state-active" );
					}
				})
				// see #8559, we bind to blur here in case the button element loses
				// focus between keydown and keyup, it would be left in an "active" state
				.bind( "keyup" + this.eventNamespace + " blur" + this.eventNamespace, function() {
					$( this ).removeClass( "ui-state-active" );
				});

			if ( this.buttonElement.is("a") ) {
				this.buttonElement.keyup(function(event) {
					if ( event.keyCode === $.ui.keyCode.SPACE ) {
						// TODO pass through original event correctly (just as 2nd argument doesn't work)
						$( this ).click();
					}
				});
			}
		}

		this._setOption( "disabled", options.disabled );
		this._resetButton();
	},

	_determineButtonType: function() {
		var ancestor, labelSelector, checked;

		if ( this.element.is("[type=checkbox]") ) {
			this.type = "checkbox";
		} else if ( this.element.is("[type=radio]") ) {
			this.type = "radio";
		} else if ( this.element.is("input") ) {
			this.type = "input";
		} else {
			this.type = "button";
		}

		if ( this.type === "checkbox" || this.type === "radio" ) {
			// we don't search against the document in case the element
			// is disconnected from the DOM
			ancestor = this.element.parents().last();
			labelSelector = "label[for='" + this.element.attr("id") + "']";
			this.buttonElement = ancestor.find( labelSelector );
			if ( !this.buttonElement.length ) {
				ancestor = ancestor.length ? ancestor.siblings() : this.element.siblings();
				this.buttonElement = ancestor.filter( labelSelector );
				if ( !this.buttonElement.length ) {
					this.buttonElement = ancestor.find( labelSelector );
				}
			}
			this.element.addClass( "ui-helper-hidden-accessible" );

			checked = this.element.is( ":checked" );
			if ( checked ) {
				this.buttonElement.addClass( "ui-state-active" );
			}
			this.buttonElement.prop( "aria-pressed", checked );
		} else {
			this.buttonElement = this.element;
		}
	},

	widget: function() {
		return this.buttonElement;
	},

	_destroy: function() {
		this.element
			.removeClass( "ui-helper-hidden-accessible" );
		this.buttonElement
			.removeClass( baseClasses + " ui-state-active " + typeClasses )
			.removeAttr( "role" )
			.removeAttr( "aria-pressed" )
			.html( this.buttonElement.find(".ui-button-text").html() );

		if ( !this.hasTitle ) {
			this.buttonElement.removeAttr( "title" );
		}
	},

	_setOption: function( key, value ) {
		this._super( key, value );
		if ( key === "disabled" ) {
			this.widget().toggleClass( "ui-state-disabled", !!value );
			this.element.prop( "disabled", !!value );
			if ( value ) {
				if ( this.type === "checkbox" || this.type === "radio" ) {
					this.buttonElement.removeClass( "ui-state-focus" );
				} else {
					this.buttonElement.removeClass( "ui-state-focus ui-state-active" );
				}
			}
			return;
		}
		this._resetButton();
	},

	refresh: function() {
		//See #8237 & #8828
		var isDisabled = this.element.is( "input, button" ) ? this.element.is( ":disabled" ) : this.element.hasClass( "ui-button-disabled" );

		if ( isDisabled !== this.options.disabled ) {
			this._setOption( "disabled", isDisabled );
		}
		if ( this.type === "radio" ) {
			radioGroup( this.element[0] ).each(function() {
				if ( $( this ).is( ":checked" ) ) {
					$( this ).button( "widget" )
						.addClass( "ui-state-active" )
						.attr( "aria-pressed", "true" );
				} else {
					$( this ).button( "widget" )
						.removeClass( "ui-state-active" )
						.attr( "aria-pressed", "false" );
				}
			});
		} else if ( this.type === "checkbox" ) {
			if ( this.element.is( ":checked" ) ) {
				this.buttonElement
					.addClass( "ui-state-active" )
					.attr( "aria-pressed", "true" );
			} else {
				this.buttonElement
					.removeClass( "ui-state-active" )
					.attr( "aria-pressed", "false" );
			}
		}
	},

	_resetButton: function() {
		if ( this.type === "input" ) {
			if ( this.options.label ) {
				this.element.val( this.options.label );
			}
			return;
		}
		var buttonElement = this.buttonElement.removeClass( typeClasses ),
			buttonText = $( "<span></span>", this.document[0] )
				.addClass( "ui-button-text" )
				.html( this.options.label )
				.appendTo( buttonElement.empty() )
				.text(),
			icons = this.options.icons,
			multipleIcons = icons.primary && icons.secondary,
			buttonClasses = [];

		if ( icons.primary || icons.secondary ) {
			if ( this.options.text ) {
				buttonClasses.push( "ui-button-text-icon" + ( multipleIcons ? "s" : ( icons.primary ? "-primary" : "-secondary" ) ) );
			}

			if ( icons.primary ) {
				buttonElement.prepend( "<span class='ui-button-icon-primary ui-icon " + icons.primary + "'></span>" );
			}

			if ( icons.secondary ) {
				buttonElement.append( "<span class='ui-button-icon-secondary ui-icon " + icons.secondary + "'></span>" );
			}

			if ( !this.options.text ) {
				buttonClasses.push( multipleIcons ? "ui-button-icons-only" : "ui-button-icon-only" );

				if ( !this.hasTitle ) {
					buttonElement.attr( "title", $.trim( buttonText ) );
				}
			}
		} else {
			buttonClasses.push( "ui-button-text-only" );
		}
		buttonElement.addClass( buttonClasses.join( " " ) );
	}
});

$.widget( "ui.buttonset", {
	version: "1.11.4",
	options: {
		items: "button, input[type=button], input[type=submit], input[type=reset], input[type=checkbox], input[type=radio], a, :data(ui-button)"
	},

	_create: function() {
		this.element.addClass( "ui-buttonset" );
	},

	_init: function() {
		this.refresh();
	},

	_setOption: function( key, value ) {
		if ( key === "disabled" ) {
			this.buttons.button( "option", key, value );
		}

		this._super( key, value );
	},

	refresh: function() {
		var rtl = this.element.css( "direction" ) === "rtl",
			allButtons = this.element.find( this.options.items ),
			existingButtons = allButtons.filter( ":ui-button" );

		// Initialize new buttons
		allButtons.not( ":ui-button" ).button();

		// Refresh existing buttons
		existingButtons.button( "refresh" );

		this.buttons = allButtons
			.map(function() {
				return $( this ).button( "widget" )[ 0 ];
			})
				.removeClass( "ui-corner-all ui-corner-left ui-corner-right" )
				.filter( ":first" )
					.addClass( rtl ? "ui-corner-right" : "ui-corner-left" )
				.end()
				.filter( ":last" )
					.addClass( rtl ? "ui-corner-left" : "ui-corner-right" )
				.end()
			.end();
	},

	_destroy: function() {
		this.element.removeClass( "ui-buttonset" );
		this.buttons
			.map(function() {
				return $( this ).button( "widget" )[ 0 ];
			})
				.removeClass( "ui-corner-left ui-corner-right" )
			.end()
			.button( "destroy" );
	}
});

var button = $.ui.button;


/*
 * jQuery UI Datepicker 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/datepicker/
 */


$.extend($.ui, { datepicker: { version: "1.11.4" } });

var datepicker_instActive;

function datepicker_getZindex( elem ) {
	var position, value;
	while ( elem.length && elem[ 0 ] !== document ) {
		// Ignore z-index if position is set to a value where z-index is ignored by the browser
		// This makes behavior of this function consistent across browsers
		// WebKit always returns auto if the element is positioned
		position = elem.css( "position" );
		if ( position === "absolute" || position === "relative" || position === "fixed" ) {
			// IE returns 0 when zIndex is not specified
			// other browsers return a string
			// we ignore the case of nested elements with an explicit value of 0
			// <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
			value = parseInt( elem.css( "zIndex" ), 10 );
			if ( !isNaN( value ) && value !== 0 ) {
				return value;
			}
		}
		elem = elem.parent();
	}

	return 0;
}
/* Date picker manager.
   Use the singleton instance of this class, $.datepicker, to interact with the date picker.
   Settings for (groups of) date pickers are maintained in an instance object,
   allowing multiple different settings on the same page. */

function Datepicker() {
	this._curInst = null; // The current instance in use
	this._keyEvent = false; // If the last event was a key event
	this._disabledInputs = []; // List of date picker inputs that have been disabled
	this._datepickerShowing = false; // True if the popup picker is showing , false if not
	this._inDialog = false; // True if showing within a "dialog", false if not
	this._mainDivId = "ui-datepicker-div"; // The ID of the main datepicker division
	this._inlineClass = "ui-datepicker-inline"; // The name of the inline marker class
	this._appendClass = "ui-datepicker-append"; // The name of the append marker class
	this._triggerClass = "ui-datepicker-trigger"; // The name of the trigger marker class
	this._dialogClass = "ui-datepicker-dialog"; // The name of the dialog marker class
	this._disableClass = "ui-datepicker-disabled"; // The name of the disabled covering marker class
	this._unselectableClass = "ui-datepicker-unselectable"; // The name of the unselectable cell marker class
	this._currentClass = "ui-datepicker-current-day"; // The name of the current day marker class
	this._dayOverClass = "ui-datepicker-days-cell-over"; // The name of the day hover marker class
	this.regional = []; // Available regional settings, indexed by language code
	this.regional[""] = { // Default regional settings
		closeText: "Done", // Display text for close link
		prevText: "Prev", // Display text for previous month link
		nextText: "Next", // Display text for next month link
		currentText: "Today", // Display text for current month link
		monthNames: ["January","February","March","April","May","June",
			"July","August","September","October","November","December"], // Names of months for drop-down and formatting
		monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], // For formatting
		dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], // For formatting
		dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], // For formatting
		dayNamesMin: ["Su","Mo","Tu","We","Th","Fr","Sa"], // Column headings for days starting at Sunday
		weekHeader: "Wk", // Column header for week of the year
		dateFormat: "mm/dd/yy", // See format options on parseDate
		firstDay: 0, // The first day of the week, Sun = 0, Mon = 1, ...
		isRTL: false, // True if right-to-left language, false if left-to-right
		showMonthAfterYear: false, // True if the year select precedes month, false for month then year
		yearSuffix: "" // Additional text to append to the year in the month headers
	};
	this._defaults = { // Global defaults for all the date picker instances
		showOn: "focus", // "focus" for popup on focus,
			// "button" for trigger button, or "both" for either
		showAnim: "fadeIn", // Name of jQuery animation for popup
		showOptions: {}, // Options for enhanced animations
		defaultDate: null, // Used when field is blank: actual date,
			// +/-number for offset from today, null for today
		appendText: "", // Display text following the input box, e.g. showing the format
		buttonText: "...", // Text for trigger button
		buttonImage: "", // URL for trigger button image
		buttonImageOnly: false, // True if the image appears alone, false if it appears on a button
		hideIfNoPrevNext: false, // True to hide next/previous month links
			// if not applicable, false to just disable them
		navigationAsDateFormat: false, // True if date formatting applied to prev/today/next links
		gotoCurrent: false, // True if today link goes back to current selection instead
		changeMonth: false, // True if month can be selected directly, false if only prev/next
		changeYear: false, // True if year can be selected directly, false if only prev/next
		yearRange: "c-10:c+10", // Range of years to display in drop-down,
			// either relative to today's year (-nn:+nn), relative to currently displayed year
			// (c-nn:c+nn), absolute (nnnn:nnnn), or a combination of the above (nnnn:-n)
		showOtherMonths: false, // True to show dates in other months, false to leave blank
		selectOtherMonths: false, // True to allow selection of dates in other months, false for unselectable
		showWeek: false, // True to show week of the year, false to not show it
		calculateWeek: this.iso8601Week, // How to calculate the week of the year,
			// takes a Date and returns the number of the week for it
		shortYearCutoff: "+10", // Short year values < this are in the current century,
			// > this are in the previous century,
			// string value starting with "+" for current year + value
		minDate: null, // The earliest selectable date, or null for no limit
		maxDate: null, // The latest selectable date, or null for no limit
		duration: "fast", // Duration of display/closure
		beforeShowDay: null, // Function that takes a date and returns an array with
			// [0] = true if selectable, false if not, [1] = custom CSS class name(s) or "",
			// [2] = cell title (optional), e.g. $.datepicker.noWeekends
		beforeShow: null, // Function that takes an input field and
			// returns a set of custom settings for the date picker
		onSelect: null, // Define a callback function when a date is selected
		onChangeMonthYear: null, // Define a callback function when the month or year is changed
		onClose: null, // Define a callback function when the datepicker is closed
		numberOfMonths: 1, // Number of months to show at a time
		showCurrentAtPos: 0, // The position in multipe months at which to show the current month (starting at 0)
		stepMonths: 1, // Number of months to step back/forward
		stepBigMonths: 12, // Number of months to step back/forward for the big links
		altField: "", // Selector for an alternate field to store selected dates into
		altFormat: "", // The date format to use for the alternate field
		constrainInput: true, // The input is constrained by the current date format
		showButtonPanel: false, // True to show button panel, false to not show it
		autoSize: false, // True to size the input for the date format, false to leave as is
		disabled: false // The initial disabled state
	};
	$.extend(this._defaults, this.regional[""]);
	this.regional.en = $.extend( true, {}, this.regional[ "" ]);
	this.regional[ "en-US" ] = $.extend( true, {}, this.regional.en );
	this.dpDiv = datepicker_bindHover($("<div id='" + this._mainDivId + "' class='ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>"));
}

$.extend(Datepicker.prototype, {
	/* Class name added to elements to indicate already configured with a date picker. */
	markerClassName: "hasDatepicker",

	//Keep track of the maximum number of rows displayed (see #7043)
	maxRows: 4,

	// TODO rename to "widget" when switching to widget factory
	_widgetDatepicker: function() {
		return this.dpDiv;
	},

	/* Override the default settings for all instances of the date picker.
	 * @param  settings  object - the new settings to use as defaults (anonymous object)
	 * @return the manager object
	 */
	setDefaults: function(settings) {
		datepicker_extendRemove(this._defaults, settings || {});
		return this;
	},

	/* Attach the date picker to a jQuery selection.
	 * @param  target	element - the target input field or division or span
	 * @param  settings  object - the new settings to use for this date picker instance (anonymous)
	 */
	_attachDatepicker: function(target, settings) {
		var nodeName, inline, inst;
		nodeName = target.nodeName.toLowerCase();
		inline = (nodeName === "div" || nodeName === "span");
		if (!target.id) {
			this.uuid += 1;
			target.id = "dp" + this.uuid;
		}
		inst = this._newInst($(target), inline);
		inst.settings = $.extend({}, settings || {});
		if (nodeName === "input") {
			this._connectDatepicker(target, inst);
		} else if (inline) {
			this._inlineDatepicker(target, inst);
		}
	},

	/* Create a new instance object. */
	_newInst: function(target, inline) {
		var id = target[0].id.replace(/([^A-Za-z0-9_\-])/g, "\\\\$1"); // escape jQuery meta chars
		return {id: id, input: target, // associated target
			selectedDay: 0, selectedMonth: 0, selectedYear: 0, // current selection
			drawMonth: 0, drawYear: 0, // month being drawn
			inline: inline, // is datepicker inline or not
			dpDiv: (!inline ? this.dpDiv : // presentation div
			datepicker_bindHover($("<div class='" + this._inlineClass + " ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>")))};
	},

	/* Attach the date picker to an input field. */
	_connectDatepicker: function(target, inst) {
		var input = $(target);
		inst.append = $([]);
		inst.trigger = $([]);
		if (input.hasClass(this.markerClassName)) {
			return;
		}
		this._attachments(input, inst);
		input.addClass(this.markerClassName).keydown(this._doKeyDown).
			keypress(this._doKeyPress).keyup(this._doKeyUp);
		this._autoSize(inst);
		$.data(target, "datepicker", inst);
		//If disabled option is true, disable the datepicker once it has been attached to the input (see ticket #5665)
		if( inst.settings.disabled ) {
			this._disableDatepicker( target );
		}
	},

	/* Make attachments based on settings. */
	_attachments: function(input, inst) {
		var showOn, buttonText, buttonImage,
			appendText = this._get(inst, "appendText"),
			isRTL = this._get(inst, "isRTL");

		if (inst.append) {
			inst.append.remove();
		}
		if (appendText) {
			inst.append = $("<span class='" + this._appendClass + "'>" + appendText + "</span>");
			input[isRTL ? "before" : "after"](inst.append);
		}

		input.unbind("focus", this._showDatepicker);

		if (inst.trigger) {
			inst.trigger.remove();
		}

		showOn = this._get(inst, "showOn");
		if (showOn === "focus" || showOn === "both") { // pop-up date picker when in the marked field
			input.focus(this._showDatepicker);
		}
		if (showOn === "button" || showOn === "both") { // pop-up date picker when button clicked
			buttonText = this._get(inst, "buttonText");
			buttonImage = this._get(inst, "buttonImage");
			inst.trigger = $(this._get(inst, "buttonImageOnly") ?
				$("<img/>").addClass(this._triggerClass).
					attr({ src: buttonImage, alt: buttonText, title: buttonText }) :
				$("<button type='button'></button>").addClass(this._triggerClass).
					html(!buttonImage ? buttonText : $("<img/>").attr(
					{ src:buttonImage, alt:buttonText, title:buttonText })));
			input[isRTL ? "before" : "after"](inst.trigger);
			inst.trigger.click(function() {
				if ($.datepicker._datepickerShowing && $.datepicker._lastInput === input[0]) {
					$.datepicker._hideDatepicker();
				} else if ($.datepicker._datepickerShowing && $.datepicker._lastInput !== input[0]) {
					$.datepicker._hideDatepicker();
					$.datepicker._showDatepicker(input[0]);
				} else {
					$.datepicker._showDatepicker(input[0]);
				}
				return false;
			});
		}
	},

	/* Apply the maximum length for the date format. */
	_autoSize: function(inst) {
		if (this._get(inst, "autoSize") && !inst.inline) {
			var findMax, max, maxI, i,
				date = new Date(2009, 12 - 1, 20), // Ensure double digits
				dateFormat = this._get(inst, "dateFormat");

			if (dateFormat.match(/[DM]/)) {
				findMax = function(names) {
					max = 0;
					maxI = 0;
					for (i = 0; i < names.length; i++) {
						if (names[i].length > max) {
							max = names[i].length;
							maxI = i;
						}
					}
					return maxI;
				};
				date.setMonth(findMax(this._get(inst, (dateFormat.match(/MM/) ?
					"monthNames" : "monthNamesShort"))));
				date.setDate(findMax(this._get(inst, (dateFormat.match(/DD/) ?
					"dayNames" : "dayNamesShort"))) + 20 - date.getDay());
			}
			inst.input.attr("size", this._formatDate(inst, date).length);
		}
	},

	/* Attach an inline date picker to a div. */
	_inlineDatepicker: function(target, inst) {
		var divSpan = $(target);
		if (divSpan.hasClass(this.markerClassName)) {
			return;
		}
		divSpan.addClass(this.markerClassName).append(inst.dpDiv);
		$.data(target, "datepicker", inst);
		this._setDate(inst, this._getDefaultDate(inst), true);
		this._updateDatepicker(inst);
		this._updateAlternate(inst);
		//If disabled option is true, disable the datepicker before showing it (see ticket #5665)
		if( inst.settings.disabled ) {
			this._disableDatepicker( target );
		}
		// Set display:block in place of inst.dpDiv.show() which won't work on disconnected elements
		// http://bugs.jqueryui.com/ticket/7552 - A Datepicker created on a detached div has zero height
		inst.dpDiv.css( "display", "block" );
	},

	/* Pop-up the date picker in a "dialog" box.
	 * @param  input element - ignored
	 * @param  date	string or Date - the initial date to display
	 * @param  onSelect  function - the function to call when a date is selected
	 * @param  settings  object - update the dialog date picker instance's settings (anonymous object)
	 * @param  pos int[2] - coordinates for the dialog's position within the screen or
	 *					event - with x/y coordinates or
	 *					leave empty for default (screen centre)
	 * @return the manager object
	 */
	_dialogDatepicker: function(input, date, onSelect, settings, pos) {
		var id, browserWidth, browserHeight, scrollX, scrollY,
			inst = this._dialogInst; // internal instance

		if (!inst) {
			this.uuid += 1;
			id = "dp" + this.uuid;
			this._dialogInput = $("<input type='text' id='" + id +
				"' style='position: absolute; top: -100px; width: 0px;'/>");
			this._dialogInput.keydown(this._doKeyDown);
			$("body").append(this._dialogInput);
			inst = this._dialogInst = this._newInst(this._dialogInput, false);
			inst.settings = {};
			$.data(this._dialogInput[0], "datepicker", inst);
		}
		datepicker_extendRemove(inst.settings, settings || {});
		date = (date && date.constructor === Date ? this._formatDate(inst, date) : date);
		this._dialogInput.val(date);

		this._pos = (pos ? (pos.length ? pos : [pos.pageX, pos.pageY]) : null);
		if (!this._pos) {
			browserWidth = document.documentElement.clientWidth;
			browserHeight = document.documentElement.clientHeight;
			scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
			scrollY = document.documentElement.scrollTop || document.body.scrollTop;
			this._pos = // should use actual width/height below
				[(browserWidth / 2) - 100 + scrollX, (browserHeight / 2) - 150 + scrollY];
		}

		// move input on screen for focus, but hidden behind dialog
		this._dialogInput.css("left", (this._pos[0] + 20) + "px").css("top", this._pos[1] + "px");
		inst.settings.onSelect = onSelect;
		this._inDialog = true;
		this.dpDiv.addClass(this._dialogClass);
		this._showDatepicker(this._dialogInput[0]);
		if ($.blockUI) {
			$.blockUI(this.dpDiv);
		}
		$.data(this._dialogInput[0], "datepicker", inst);
		return this;
	},

	/* Detach a datepicker from its control.
	 * @param  target	element - the target input field or division or span
	 */
	_destroyDatepicker: function(target) {
		var nodeName,
			$target = $(target),
			inst = $.data(target, "datepicker");

		if (!$target.hasClass(this.markerClassName)) {
			return;
		}

		nodeName = target.nodeName.toLowerCase();
		$.removeData(target, "datepicker");
		if (nodeName === "input") {
			inst.append.remove();
			inst.trigger.remove();
			$target.removeClass(this.markerClassName).
				unbind("focus", this._showDatepicker).
				unbind("keydown", this._doKeyDown).
				unbind("keypress", this._doKeyPress).
				unbind("keyup", this._doKeyUp);
		} else if (nodeName === "div" || nodeName === "span") {
			$target.removeClass(this.markerClassName).empty();
		}

		if ( datepicker_instActive === inst ) {
			datepicker_instActive = null;
		}
	},

	/* Enable the date picker to a jQuery selection.
	 * @param  target	element - the target input field or division or span
	 */
	_enableDatepicker: function(target) {
		var nodeName, inline,
			$target = $(target),
			inst = $.data(target, "datepicker");

		if (!$target.hasClass(this.markerClassName)) {
			return;
		}

		nodeName = target.nodeName.toLowerCase();
		if (nodeName === "input") {
			target.disabled = false;
			inst.trigger.filter("button").
				each(function() { this.disabled = false; }).end().
				filter("img").css({opacity: "1.0", cursor: ""});
		} else if (nodeName === "div" || nodeName === "span") {
			inline = $target.children("." + this._inlineClass);
			inline.children().removeClass("ui-state-disabled");
			inline.find("select.ui-datepicker-month, select.ui-datepicker-year").
				prop("disabled", false);
		}
		this._disabledInputs = $.map(this._disabledInputs,
			function(value) { return (value === target ? null : value); }); // delete entry
	},

	/* Disable the date picker to a jQuery selection.
	 * @param  target	element - the target input field or division or span
	 */
	_disableDatepicker: function(target) {
		var nodeName, inline,
			$target = $(target),
			inst = $.data(target, "datepicker");

		if (!$target.hasClass(this.markerClassName)) {
			return;
		}

		nodeName = target.nodeName.toLowerCase();
		if (nodeName === "input") {
			target.disabled = true;
			inst.trigger.filter("button").
				each(function() { this.disabled = true; }).end().
				filter("img").css({opacity: "0.5", cursor: "default"});
		} else if (nodeName === "div" || nodeName === "span") {
			inline = $target.children("." + this._inlineClass);
			inline.children().addClass("ui-state-disabled");
			inline.find("select.ui-datepicker-month, select.ui-datepicker-year").
				prop("disabled", true);
		}
		this._disabledInputs = $.map(this._disabledInputs,
			function(value) { return (value === target ? null : value); }); // delete entry
		this._disabledInputs[this._disabledInputs.length] = target;
	},

	/* Is the first field in a jQuery collection disabled as a datepicker?
	 * @param  target	element - the target input field or division or span
	 * @return boolean - true if disabled, false if enabled
	 */
	_isDisabledDatepicker: function(target) {
		if (!target) {
			return false;
		}
		for (var i = 0; i < this._disabledInputs.length; i++) {
			if (this._disabledInputs[i] === target) {
				return true;
			}
		}
		return false;
	},

	/* Retrieve the instance data for the target control.
	 * @param  target  element - the target input field or division or span
	 * @return  object - the associated instance data
	 * @throws  error if a jQuery problem getting data
	 */
	_getInst: function(target) {
		try {
			return $.data(target, "datepicker");
		}
		catch (err) {
			throw "Missing instance data for this datepicker";
		}
	},

	/* Update or retrieve the settings for a date picker attached to an input field or division.
	 * @param  target  element - the target input field or division or span
	 * @param  name	object - the new settings to update or
	 *				string - the name of the setting to change or retrieve,
	 *				when retrieving also "all" for all instance settings or
	 *				"defaults" for all global defaults
	 * @param  value   any - the new value for the setting
	 *				(omit if above is an object or to retrieve a value)
	 */
	_optionDatepicker: function(target, name, value) {
		var settings, date, minDate, maxDate,
			inst = this._getInst(target);

		if (arguments.length === 2 && typeof name === "string") {
			return (name === "defaults" ? $.extend({}, $.datepicker._defaults) :
				(inst ? (name === "all" ? $.extend({}, inst.settings) :
				this._get(inst, name)) : null));
		}

		settings = name || {};
		if (typeof name === "string") {
			settings = {};
			settings[name] = value;
		}

		if (inst) {
			if (this._curInst === inst) {
				this._hideDatepicker();
			}

			date = this._getDateDatepicker(target, true);
			minDate = this._getMinMaxDate(inst, "min");
			maxDate = this._getMinMaxDate(inst, "max");
			datepicker_extendRemove(inst.settings, settings);
			// reformat the old minDate/maxDate values if dateFormat changes and a new minDate/maxDate isn't provided
			if (minDate !== null && settings.dateFormat !== undefined && settings.minDate === undefined) {
				inst.settings.minDate = this._formatDate(inst, minDate);
			}
			if (maxDate !== null && settings.dateFormat !== undefined && settings.maxDate === undefined) {
				inst.settings.maxDate = this._formatDate(inst, maxDate);
			}
			if ( "disabled" in settings ) {
				if ( settings.disabled ) {
					this._disableDatepicker(target);
				} else {
					this._enableDatepicker(target);
				}
			}
			this._attachments($(target), inst);
			this._autoSize(inst);
			this._setDate(inst, date);
			this._updateAlternate(inst);
			this._updateDatepicker(inst);
		}
	},

	// change method deprecated
	_changeDatepicker: function(target, name, value) {
		this._optionDatepicker(target, name, value);
	},

	/* Redraw the date picker attached to an input field or division.
	 * @param  target  element - the target input field or division or span
	 */
	_refreshDatepicker: function(target) {
		var inst = this._getInst(target);
		if (inst) {
			this._updateDatepicker(inst);
		}
	},

	/* Set the dates for a jQuery selection.
	 * @param  target element - the target input field or division or span
	 * @param  date	Date - the new date
	 */
	_setDateDatepicker: function(target, date) {
		var inst = this._getInst(target);
		if (inst) {
			this._setDate(inst, date);
			this._updateDatepicker(inst);
			this._updateAlternate(inst);
		}
	},

	/* Get the date(s) for the first entry in a jQuery selection.
	 * @param  target element - the target input field or division or span
	 * @param  noDefault boolean - true if no default date is to be used
	 * @return Date - the current date
	 */
	_getDateDatepicker: function(target, noDefault) {
		var inst = this._getInst(target);
		if (inst && !inst.inline) {
			this._setDateFromField(inst, noDefault);
		}
		return (inst ? this._getDate(inst) : null);
	},

	/* Handle keystrokes. */
	_doKeyDown: function(event) {
		var onSelect, dateStr, sel,
			inst = $.datepicker._getInst(event.target),
			handled = true,
			isRTL = inst.dpDiv.is(".ui-datepicker-rtl");

		inst._keyEvent = true;
		if ($.datepicker._datepickerShowing) {
			switch (event.keyCode) {
				case 9: $.datepicker._hideDatepicker();
						handled = false;
						break; // hide on tab out
				case 13: sel = $("td." + $.datepicker._dayOverClass + ":not(." +
									$.datepicker._currentClass + ")", inst.dpDiv);
						if (sel[0]) {
							$.datepicker._selectDay(event.target, inst.selectedMonth, inst.selectedYear, sel[0]);
						}

						onSelect = $.datepicker._get(inst, "onSelect");
						if (onSelect) {
							dateStr = $.datepicker._formatDate(inst);

							// trigger custom callback
							onSelect.apply((inst.input ? inst.input[0] : null), [dateStr, inst]);
						} else {
							$.datepicker._hideDatepicker();
						}

						return false; // don't submit the form
				case 27: $.datepicker._hideDatepicker();
						break; // hide on escape
				case 33: $.datepicker._adjustDate(event.target, (event.ctrlKey ?
							-$.datepicker._get(inst, "stepBigMonths") :
							-$.datepicker._get(inst, "stepMonths")), "M");
						break; // previous month/year on page up/+ ctrl
				case 34: $.datepicker._adjustDate(event.target, (event.ctrlKey ?
							+$.datepicker._get(inst, "stepBigMonths") :
							+$.datepicker._get(inst, "stepMonths")), "M");
						break; // next month/year on page down/+ ctrl
				case 35: if (event.ctrlKey || event.metaKey) {
							$.datepicker._clearDate(event.target);
						}
						handled = event.ctrlKey || event.metaKey;
						break; // clear on ctrl or command +end
				case 36: if (event.ctrlKey || event.metaKey) {
							$.datepicker._gotoToday(event.target);
						}
						handled = event.ctrlKey || event.metaKey;
						break; // current on ctrl or command +home
				case 37: if (event.ctrlKey || event.metaKey) {
							$.datepicker._adjustDate(event.target, (isRTL ? +1 : -1), "D");
						}
						handled = event.ctrlKey || event.metaKey;
						// -1 day on ctrl or command +left
						if (event.originalEvent.altKey) {
							$.datepicker._adjustDate(event.target, (event.ctrlKey ?
								-$.datepicker._get(inst, "stepBigMonths") :
								-$.datepicker._get(inst, "stepMonths")), "M");
						}
						// next month/year on alt +left on Mac
						break;
				case 38: if (event.ctrlKey || event.metaKey) {
							$.datepicker._adjustDate(event.target, -7, "D");
						}
						handled = event.ctrlKey || event.metaKey;
						break; // -1 week on ctrl or command +up
				case 39: if (event.ctrlKey || event.metaKey) {
							$.datepicker._adjustDate(event.target, (isRTL ? -1 : +1), "D");
						}
						handled = event.ctrlKey || event.metaKey;
						// +1 day on ctrl or command +right
						if (event.originalEvent.altKey) {
							$.datepicker._adjustDate(event.target, (event.ctrlKey ?
								+$.datepicker._get(inst, "stepBigMonths") :
								+$.datepicker._get(inst, "stepMonths")), "M");
						}
						// next month/year on alt +right
						break;
				case 40: if (event.ctrlKey || event.metaKey) {
							$.datepicker._adjustDate(event.target, +7, "D");
						}
						handled = event.ctrlKey || event.metaKey;
						break; // +1 week on ctrl or command +down
				default: handled = false;
			}
		} else if (event.keyCode === 36 && event.ctrlKey) { // display the date picker on ctrl+home
			$.datepicker._showDatepicker(this);
		} else {
			handled = false;
		}

		if (handled) {
			event.preventDefault();
			event.stopPropagation();
		}
	},

	/* Filter entered characters - based on date format. */
	_doKeyPress: function(event) {
		var chars, chr,
			inst = $.datepicker._getInst(event.target);

		if ($.datepicker._get(inst, "constrainInput")) {
			chars = $.datepicker._possibleChars($.datepicker._get(inst, "dateFormat"));
			chr = String.fromCharCode(event.charCode == null ? event.keyCode : event.charCode);
			return event.ctrlKey || event.metaKey || (chr < " " || !chars || chars.indexOf(chr) > -1);
		}
	},

	/* Synchronise manual entry and field/alternate field. */
	_doKeyUp: function(event) {
		var date,
			inst = $.datepicker._getInst(event.target);

		if (inst.input.val() !== inst.lastVal) {
			try {
				date = $.datepicker.parseDate($.datepicker._get(inst, "dateFormat"),
					(inst.input ? inst.input.val() : null),
					$.datepicker._getFormatConfig(inst));

				if (date) { // only if valid
					$.datepicker._setDateFromField(inst);
					$.datepicker._updateAlternate(inst);
					$.datepicker._updateDatepicker(inst);
				}
			}
			catch (err) {
			}
		}
		return true;
	},

	/* Pop-up the date picker for a given input field.
	 * If false returned from beforeShow event handler do not show.
	 * @param  input  element - the input field attached to the date picker or
	 *					event - if triggered by focus
	 */
	_showDatepicker: function(input) {
		input = input.target || input;
		if (input.nodeName.toLowerCase() !== "input") { // find from button/image trigger
			input = $("input", input.parentNode)[0];
		}

		if ($.datepicker._isDisabledDatepicker(input) || $.datepicker._lastInput === input) { // already here
			return;
		}

		var inst, beforeShow, beforeShowSettings, isFixed,
			offset, showAnim, duration;

		inst = $.datepicker._getInst(input);
		if ($.datepicker._curInst && $.datepicker._curInst !== inst) {
			$.datepicker._curInst.dpDiv.stop(true, true);
			if ( inst && $.datepicker._datepickerShowing ) {
				$.datepicker._hideDatepicker( $.datepicker._curInst.input[0] );
			}
		}

		beforeShow = $.datepicker._get(inst, "beforeShow");
		beforeShowSettings = beforeShow ? beforeShow.apply(input, [input, inst]) : {};
		if(beforeShowSettings === false){
			return;
		}
		datepicker_extendRemove(inst.settings, beforeShowSettings);

		inst.lastVal = null;
		$.datepicker._lastInput = input;
		$.datepicker._setDateFromField(inst);

		if ($.datepicker._inDialog) { // hide cursor
			input.value = "";
		}
		if (!$.datepicker._pos) { // position below input
			$.datepicker._pos = $.datepicker._findPos(input);
			$.datepicker._pos[1] += input.offsetHeight; // add the height
		}

		isFixed = false;
		$(input).parents().each(function() {
			isFixed |= $(this).css("position") === "fixed";
			return !isFixed;
		});

		offset = {left: $.datepicker._pos[0], top: $.datepicker._pos[1]};
		$.datepicker._pos = null;
		//to avoid flashes on Firefox
		inst.dpDiv.empty();
		// determine sizing offscreen
		inst.dpDiv.css({position: "absolute", display: "block", top: "-1000px"});
		$.datepicker._updateDatepicker(inst);
		// fix width for dynamic number of date pickers
		// and adjust position before showing
		offset = $.datepicker._checkOffset(inst, offset, isFixed);
		inst.dpDiv.css({position: ($.datepicker._inDialog && $.blockUI ?
			"static" : (isFixed ? "fixed" : "absolute")), display: "none",
			left: offset.left + "px", top: offset.top + "px"});

		if (!inst.inline) {
			showAnim = $.datepicker._get(inst, "showAnim");
			duration = $.datepicker._get(inst, "duration");
			inst.dpDiv.css( "z-index", datepicker_getZindex( $( input ) ) + 1 );
			$.datepicker._datepickerShowing = true;

			if ( $.effects && $.effects.effect[ showAnim ] ) {
				inst.dpDiv.show(showAnim, $.datepicker._get(inst, "showOptions"), duration);
			} else {
				inst.dpDiv[showAnim || "show"](showAnim ? duration : null);
			}

			if ( $.datepicker._shouldFocusInput( inst ) ) {
				inst.input.focus();
			}

			$.datepicker._curInst = inst;
		}
	},

	/* Generate the date picker content. */
	_updateDatepicker: function(inst) {
		this.maxRows = 4; //Reset the max number of rows being displayed (see #7043)
		datepicker_instActive = inst; // for delegate hover events
		inst.dpDiv.empty().append(this._generateHTML(inst));
		this._attachHandlers(inst);

		var origyearshtml,
			numMonths = this._getNumberOfMonths(inst),
			cols = numMonths[1],
			width = 17,
			activeCell = inst.dpDiv.find( "." + this._dayOverClass + " a" );

		if ( activeCell.length > 0 ) {
			datepicker_handleMouseover.apply( activeCell.get( 0 ) );
		}

		inst.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width("");
		if (cols > 1) {
			inst.dpDiv.addClass("ui-datepicker-multi-" + cols).css("width", (width * cols) + "em");
		}
		inst.dpDiv[(numMonths[0] !== 1 || numMonths[1] !== 1 ? "add" : "remove") +
			"Class"]("ui-datepicker-multi");
		inst.dpDiv[(this._get(inst, "isRTL") ? "add" : "remove") +
			"Class"]("ui-datepicker-rtl");

		if (inst === $.datepicker._curInst && $.datepicker._datepickerShowing && $.datepicker._shouldFocusInput( inst ) ) {
			inst.input.focus();
		}

		// deffered render of the years select (to avoid flashes on Firefox)
		if( inst.yearshtml ){
			origyearshtml = inst.yearshtml;
			setTimeout(function(){
				//assure that inst.yearshtml didn't change.
				if( origyearshtml === inst.yearshtml && inst.yearshtml ){
					inst.dpDiv.find("select.ui-datepicker-year:first").replaceWith(inst.yearshtml);
				}
				origyearshtml = inst.yearshtml = null;
			}, 0);
		}
	},

	// #6694 - don't focus the input if it's already focused
	// this breaks the change event in IE
	// Support: IE and jQuery <1.9
	_shouldFocusInput: function( inst ) {
		return inst.input && inst.input.is( ":visible" ) && !inst.input.is( ":disabled" ) && !inst.input.is( ":focus" );
	},

	/* Check positioning to remain on screen. */
	_checkOffset: function(inst, offset, isFixed) {
		var dpWidth = inst.dpDiv.outerWidth(),
			dpHeight = inst.dpDiv.outerHeight(),
			inputWidth = inst.input ? inst.input.outerWidth() : 0,
			inputHeight = inst.input ? inst.input.outerHeight() : 0,
			viewWidth = document.documentElement.clientWidth + (isFixed ? 0 : $(document).scrollLeft()),
			viewHeight = document.documentElement.clientHeight + (isFixed ? 0 : $(document).scrollTop());

		offset.left -= (this._get(inst, "isRTL") ? (dpWidth - inputWidth) : 0);
		offset.left -= (isFixed && offset.left === inst.input.offset().left) ? $(document).scrollLeft() : 0;
		offset.top -= (isFixed && offset.top === (inst.input.offset().top + inputHeight)) ? $(document).scrollTop() : 0;

		// now check if datepicker is showing outside window viewport - move to a better place if so.
		offset.left -= Math.min(offset.left, (offset.left + dpWidth > viewWidth && viewWidth > dpWidth) ?
			Math.abs(offset.left + dpWidth - viewWidth) : 0);
		offset.top -= Math.min(offset.top, (offset.top + dpHeight > viewHeight && viewHeight > dpHeight) ?
			Math.abs(dpHeight + inputHeight) : 0);

		return offset;
	},

	/* Find an object's position on the screen. */
	_findPos: function(obj) {
		var position,
			inst = this._getInst(obj),
			isRTL = this._get(inst, "isRTL");

		while (obj && (obj.type === "hidden" || obj.nodeType !== 1 || $.expr.filters.hidden(obj))) {
			obj = obj[isRTL ? "previousSibling" : "nextSibling"];
		}

		position = $(obj).offset();
		return [position.left, position.top];
	},

	/* Hide the date picker from view.
	 * @param  input  element - the input field attached to the date picker
	 */
	_hideDatepicker: function(input) {
		var showAnim, duration, postProcess, onClose,
			inst = this._curInst;

		if (!inst || (input && inst !== $.data(input, "datepicker"))) {
			return;
		}

		if (this._datepickerShowing) {
			showAnim = this._get(inst, "showAnim");
			duration = this._get(inst, "duration");
			postProcess = function() {
				$.datepicker._tidyDialog(inst);
			};

			// DEPRECATED: after BC for 1.8.x $.effects[ showAnim ] is not needed
			if ( $.effects && ( $.effects.effect[ showAnim ] || $.effects[ showAnim ] ) ) {
				inst.dpDiv.hide(showAnim, $.datepicker._get(inst, "showOptions"), duration, postProcess);
			} else {
				inst.dpDiv[(showAnim === "slideDown" ? "slideUp" :
					(showAnim === "fadeIn" ? "fadeOut" : "hide"))]((showAnim ? duration : null), postProcess);
			}

			if (!showAnim) {
				postProcess();
			}
			this._datepickerShowing = false;

			onClose = this._get(inst, "onClose");
			if (onClose) {
				onClose.apply((inst.input ? inst.input[0] : null), [(inst.input ? inst.input.val() : ""), inst]);
			}

			this._lastInput = null;
			if (this._inDialog) {
				this._dialogInput.css({ position: "absolute", left: "0", top: "-100px" });
				if ($.blockUI) {
					$.unblockUI();
					$("body").append(this.dpDiv);
				}
			}
			this._inDialog = false;
		}
	},

	/* Tidy up after a dialog display. */
	_tidyDialog: function(inst) {
		inst.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar");
	},

	/* Close date picker if clicked elsewhere. */
	_checkExternalClick: function(event) {
		if (!$.datepicker._curInst) {
			return;
		}

		var $target = $(event.target),
			inst = $.datepicker._getInst($target[0]);

		if ( ( ( $target[0].id !== $.datepicker._mainDivId &&
				$target.parents("#" + $.datepicker._mainDivId).length === 0 &&
				!$target.hasClass($.datepicker.markerClassName) &&
				!$target.closest("." + $.datepicker._triggerClass).length &&
				$.datepicker._datepickerShowing && !($.datepicker._inDialog && $.blockUI) ) ) ||
			( $target.hasClass($.datepicker.markerClassName) && $.datepicker._curInst !== inst ) ) {
				$.datepicker._hideDatepicker();
		}
	},

	/* Adjust one of the date sub-fields. */
	_adjustDate: function(id, offset, period) {
		var target = $(id),
			inst = this._getInst(target[0]);

		if (this._isDisabledDatepicker(target[0])) {
			return;
		}
		this._adjustInstDate(inst, offset +
			(period === "M" ? this._get(inst, "showCurrentAtPos") : 0), // undo positioning
			period);
		this._updateDatepicker(inst);
	},

	/* Action for current link. */
	_gotoToday: function(id) {
		var date,
			target = $(id),
			inst = this._getInst(target[0]);

		if (this._get(inst, "gotoCurrent") && inst.currentDay) {
			inst.selectedDay = inst.currentDay;
			inst.drawMonth = inst.selectedMonth = inst.currentMonth;
			inst.drawYear = inst.selectedYear = inst.currentYear;
		} else {
			date = new Date();
			inst.selectedDay = date.getDate();
			inst.drawMonth = inst.selectedMonth = date.getMonth();
			inst.drawYear = inst.selectedYear = date.getFullYear();
		}
		this._notifyChange(inst);
		this._adjustDate(target);
	},

	/* Action for selecting a new month/year. */
	_selectMonthYear: function(id, select, period) {
		var target = $(id),
			inst = this._getInst(target[0]);

		inst["selected" + (period === "M" ? "Month" : "Year")] =
		inst["draw" + (period === "M" ? "Month" : "Year")] =
			parseInt(select.options[select.selectedIndex].value,10);

		this._notifyChange(inst);
		this._adjustDate(target);
	},

	/* Action for selecting a day. */
	_selectDay: function(id, month, year, td) {
		var inst,
			target = $(id);

		if ($(td).hasClass(this._unselectableClass) || this._isDisabledDatepicker(target[0])) {
			return;
		}

		inst = this._getInst(target[0]);
		inst.selectedDay = inst.currentDay = $("a", td).html();
		inst.selectedMonth = inst.currentMonth = month;
		inst.selectedYear = inst.currentYear = year;
		this._selectDate(id, this._formatDate(inst,
			inst.currentDay, inst.currentMonth, inst.currentYear));
	},

	/* Erase the input field and hide the date picker. */
	_clearDate: function(id) {
		var target = $(id);
		this._selectDate(target, "");
	},

	/* Update the input field with the selected date. */
	_selectDate: function(id, dateStr) {
		var onSelect,
			target = $(id),
			inst = this._getInst(target[0]);

		dateStr = (dateStr != null ? dateStr : this._formatDate(inst));
		if (inst.input) {
			inst.input.val(dateStr);
		}
		this._updateAlternate(inst);

		onSelect = this._get(inst, "onSelect");
		if (onSelect) {
			onSelect.apply((inst.input ? inst.input[0] : null), [dateStr, inst]);  // trigger custom callback
		} else if (inst.input) {
			inst.input.trigger("change"); // fire the change event
		}

		if (inst.inline){
			this._updateDatepicker(inst);
		} else {
			this._hideDatepicker();
			this._lastInput = inst.input[0];
			if (typeof(inst.input[0]) !== "object") {
				inst.input.focus(); // restore focus
			}
			this._lastInput = null;
		}
	},

	/* Update any alternate field to synchronise with the main field. */
	_updateAlternate: function(inst) {
		var altFormat, date, dateStr,
			altField = this._get(inst, "altField");

		if (altField) { // update alternate field too
			altFormat = this._get(inst, "altFormat") || this._get(inst, "dateFormat");
			date = this._getDate(inst);
			dateStr = this.formatDate(altFormat, date, this._getFormatConfig(inst));
			$(altField).each(function() { $(this).val(dateStr); });
		}
	},

	/* Set as beforeShowDay function to prevent selection of weekends.
	 * @param  date  Date - the date to customise
	 * @return [boolean, string] - is this date selectable?, what is its CSS class?
	 */
	noWeekends: function(date) {
		var day = date.getDay();
		return [(day > 0 && day < 6), ""];
	},

	/* Set as calculateWeek to determine the week of the year based on the ISO 8601 definition.
	 * @param  date  Date - the date to get the week for
	 * @return  number - the number of the week within the year that contains this date
	 */
	iso8601Week: function(date) {
		var time,
			checkDate = new Date(date.getTime());

		// Find Thursday of this week starting on Monday
		checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));

		time = checkDate.getTime();
		checkDate.setMonth(0); // Compare with Jan 1
		checkDate.setDate(1);
		return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
	},

	/* Parse a string value into a date object.
	 * See formatDate below for the possible formats.
	 *
	 * @param  format string - the expected format of the date
	 * @param  value string - the date in the above format
	 * @param  settings Object - attributes include:
	 *					shortYearCutoff  number - the cutoff year for determining the century (optional)
	 *					dayNamesShort	string[7] - abbreviated names of the days from Sunday (optional)
	 *					dayNames		string[7] - names of the days from Sunday (optional)
	 *					monthNamesShort string[12] - abbreviated names of the months (optional)
	 *					monthNames		string[12] - names of the months (optional)
	 * @return  Date - the extracted date value or null if value is blank
	 */
	parseDate: function (format, value, settings) {
		if (format == null || value == null) {
			throw "Invalid arguments";
		}

		value = (typeof value === "object" ? value.toString() : value + "");
		if (value === "") {
			return null;
		}

		var iFormat, dim, extra,
			iValue = 0,
			shortYearCutoffTemp = (settings ? settings.shortYearCutoff : null) || this._defaults.shortYearCutoff,
			shortYearCutoff = (typeof shortYearCutoffTemp !== "string" ? shortYearCutoffTemp :
				new Date().getFullYear() % 100 + parseInt(shortYearCutoffTemp, 10)),
			dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort,
			dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames,
			monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort,
			monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames,
			year = -1,
			month = -1,
			day = -1,
			doy = -1,
			literal = false,
			date,
			// Check whether a format character is doubled
			lookAhead = function(match) {
				var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
				if (matches) {
					iFormat++;
				}
				return matches;
			},
			// Extract a number from the string value
			getNumber = function(match) {
				var isDoubled = lookAhead(match),
					size = (match === "@" ? 14 : (match === "!" ? 20 :
					(match === "y" && isDoubled ? 4 : (match === "o" ? 3 : 2)))),
					minSize = (match === "y" ? size : 1),
					digits = new RegExp("^\\d{" + minSize + "," + size + "}"),
					num = value.substring(iValue).match(digits);
				if (!num) {
					throw "Missing number at position " + iValue;
				}
				iValue += num[0].length;
				return parseInt(num[0], 10);
			},
			// Extract a name from the string value and convert to an index
			getName = function(match, shortNames, longNames) {
				var index = -1,
					names = $.map(lookAhead(match) ? longNames : shortNames, function (v, k) {
						return [ [k, v] ];
					}).sort(function (a, b) {
						return -(a[1].length - b[1].length);
					});

				$.each(names, function (i, pair) {
					var name = pair[1];
					if (value.substr(iValue, name.length).toLowerCase() === name.toLowerCase()) {
						index = pair[0];
						iValue += name.length;
						return false;
					}
				});
				if (index !== -1) {
					return index + 1;
				} else {
					throw "Unknown name at position " + iValue;
				}
			},
			// Confirm that a literal character matches the string value
			checkLiteral = function() {
				if (value.charAt(iValue) !== format.charAt(iFormat)) {
					throw "Unexpected literal at position " + iValue;
				}
				iValue++;
			};

		for (iFormat = 0; iFormat < format.length; iFormat++) {
			if (literal) {
				if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
					literal = false;
				} else {
					checkLiteral();
				}
			} else {
				switch (format.charAt(iFormat)) {
					case "d":
						day = getNumber("d");
						break;
					case "D":
						getName("D", dayNamesShort, dayNames);
						break;
					case "o":
						doy = getNumber("o");
						break;
					case "m":
						month = getNumber("m");
						break;
					case "M":
						month = getName("M", monthNamesShort, monthNames);
						break;
					case "y":
						year = getNumber("y");
						break;
					case "@":
						date = new Date(getNumber("@"));
						year = date.getFullYear();
						month = date.getMonth() + 1;
						day = date.getDate();
						break;
					case "!":
						date = new Date((getNumber("!") - this._ticksTo1970) / 10000);
						year = date.getFullYear();
						month = date.getMonth() + 1;
						day = date.getDate();
						break;
					case "'":
						if (lookAhead("'")){
							checkLiteral();
						} else {
							literal = true;
						}
						break;
					default:
						checkLiteral();
				}
			}
		}

		if (iValue < value.length){
			extra = value.substr(iValue);
			if (!/^\s+/.test(extra)) {
				throw "Extra/unparsed characters found in date: " + extra;
			}
		}

		if (year === -1) {
			year = new Date().getFullYear();
		} else if (year < 100) {
			year += new Date().getFullYear() - new Date().getFullYear() % 100 +
				(year <= shortYearCutoff ? 0 : -100);
		}

		if (doy > -1) {
			month = 1;
			day = doy;
			do {
				dim = this._getDaysInMonth(year, month - 1);
				if (day <= dim) {
					break;
				}
				month++;
				day -= dim;
			} while (true);
		}

		date = this._daylightSavingAdjust(new Date(year, month - 1, day));
		if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
			throw "Invalid date"; // E.g. 31/02/00
		}
		return date;
	},

	/* Standard date formats. */
	ATOM: "yy-mm-dd", // RFC 3339 (ISO 8601)
	COOKIE: "D, dd M yy",
	ISO_8601: "yy-mm-dd",
	RFC_822: "D, d M y",
	RFC_850: "DD, dd-M-y",
	RFC_1036: "D, d M y",
	RFC_1123: "D, d M yy",
	RFC_2822: "D, d M yy",
	RSS: "D, d M y", // RFC 822
	TICKS: "!",
	TIMESTAMP: "@",
	W3C: "yy-mm-dd", // ISO 8601

	_ticksTo1970: (((1970 - 1) * 365 + Math.floor(1970 / 4) - Math.floor(1970 / 100) +
		Math.floor(1970 / 400)) * 24 * 60 * 60 * 10000000),

	/* Format a date object into a string value.
	 * The format can be combinations of the following:
	 * d  - day of month (no leading zero)
	 * dd - day of month (two digit)
	 * o  - day of year (no leading zeros)
	 * oo - day of year (three digit)
	 * D  - day name short
	 * DD - day name long
	 * m  - month of year (no leading zero)
	 * mm - month of year (two digit)
	 * M  - month name short
	 * MM - month name long
	 * y  - year (two digit)
	 * yy - year (four digit)
	 * @ - Unix timestamp (ms since 01/01/1970)
	 * ! - Windows ticks (100ns since 01/01/0001)
	 * "..." - literal text
	 * '' - single quote
	 *
	 * @param  format string - the desired format of the date
	 * @param  date Date - the date value to format
	 * @param  settings Object - attributes include:
	 *					dayNamesShort	string[7] - abbreviated names of the days from Sunday (optional)
	 *					dayNames		string[7] - names of the days from Sunday (optional)
	 *					monthNamesShort string[12] - abbreviated names of the months (optional)
	 *					monthNames		string[12] - names of the months (optional)
	 * @return  string - the date in the above format
	 */
	formatDate: function (format, date, settings) {
		if (!date) {
			return "";
		}

		var iFormat,
			dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort,
			dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames,
			monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort,
			monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames,
			// Check whether a format character is doubled
			lookAhead = function(match) {
				var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
				if (matches) {
					iFormat++;
				}
				return matches;
			},
			// Format a number, with leading zero if necessary
			formatNumber = function(match, value, len) {
				var num = "" + value;
				if (lookAhead(match)) {
					while (num.length < len) {
						num = "0" + num;
					}
				}
				return num;
			},
			// Format a name, short or long as requested
			formatName = function(match, value, shortNames, longNames) {
				return (lookAhead(match) ? longNames[value] : shortNames[value]);
			},
			output = "",
			literal = false;

		if (date) {
			for (iFormat = 0; iFormat < format.length; iFormat++) {
				if (literal) {
					if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
						literal = false;
					} else {
						output += format.charAt(iFormat);
					}
				} else {
					switch (format.charAt(iFormat)) {
						case "d":
							output += formatNumber("d", date.getDate(), 2);
							break;
						case "D":
							output += formatName("D", date.getDay(), dayNamesShort, dayNames);
							break;
						case "o":
							output += formatNumber("o",
								Math.round((new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000), 3);
							break;
						case "m":
							output += formatNumber("m", date.getMonth() + 1, 2);
							break;
						case "M":
							output += formatName("M", date.getMonth(), monthNamesShort, monthNames);
							break;
						case "y":
							output += (lookAhead("y") ? date.getFullYear() :
								(date.getYear() % 100 < 10 ? "0" : "") + date.getYear() % 100);
							break;
						case "@":
							output += date.getTime();
							break;
						case "!":
							output += date.getTime() * 10000 + this._ticksTo1970;
							break;
						case "'":
							if (lookAhead("'")) {
								output += "'";
							} else {
								literal = true;
							}
							break;
						default:
							output += format.charAt(iFormat);
					}
				}
			}
		}
		return output;
	},

	/* Extract all possible characters from the date format. */
	_possibleChars: function (format) {
		var iFormat,
			chars = "",
			literal = false,
			// Check whether a format character is doubled
			lookAhead = function(match) {
				var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
				if (matches) {
					iFormat++;
				}
				return matches;
			};

		for (iFormat = 0; iFormat < format.length; iFormat++) {
			if (literal) {
				if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
					literal = false;
				} else {
					chars += format.charAt(iFormat);
				}
			} else {
				switch (format.charAt(iFormat)) {
					case "d": case "m": case "y": case "@":
						chars += "0123456789";
						break;
					case "D": case "M":
						return null; // Accept anything
					case "'":
						if (lookAhead("'")) {
							chars += "'";
						} else {
							literal = true;
						}
						break;
					default:
						chars += format.charAt(iFormat);
				}
			}
		}
		return chars;
	},

	/* Get a setting value, defaulting if necessary. */
	_get: function(inst, name) {
		return inst.settings[name] !== undefined ?
			inst.settings[name] : this._defaults[name];
	},

	/* Parse existing date and initialise date picker. */
	_setDateFromField: function(inst, noDefault) {
		if (inst.input.val() === inst.lastVal) {
			return;
		}

		var dateFormat = this._get(inst, "dateFormat"),
			dates = inst.lastVal = inst.input ? inst.input.val() : null,
			defaultDate = this._getDefaultDate(inst),
			date = defaultDate,
			settings = this._getFormatConfig(inst);

		try {
			date = this.parseDate(dateFormat, dates, settings) || defaultDate;
		} catch (event) {
			dates = (noDefault ? "" : dates);
		}
		inst.selectedDay = date.getDate();
		inst.drawMonth = inst.selectedMonth = date.getMonth();
		inst.drawYear = inst.selectedYear = date.getFullYear();
		inst.currentDay = (dates ? date.getDate() : 0);
		inst.currentMonth = (dates ? date.getMonth() : 0);
		inst.currentYear = (dates ? date.getFullYear() : 0);
		this._adjustInstDate(inst);
	},

	/* Retrieve the default date shown on opening. */
	_getDefaultDate: function(inst) {
		return this._restrictMinMax(inst,
			this._determineDate(inst, this._get(inst, "defaultDate"), new Date()));
	},

	/* A date may be specified as an exact value or a relative one. */
	_determineDate: function(inst, date, defaultDate) {
		var offsetNumeric = function(offset) {
				var date = new Date();
				date.setDate(date.getDate() + offset);
				return date;
			},
			offsetString = function(offset) {
				try {
					return $.datepicker.parseDate($.datepicker._get(inst, "dateFormat"),
						offset, $.datepicker._getFormatConfig(inst));
				}
				catch (e) {
					// Ignore
				}

				var date = (offset.toLowerCase().match(/^c/) ?
					$.datepicker._getDate(inst) : null) || new Date(),
					year = date.getFullYear(),
					month = date.getMonth(),
					day = date.getDate(),
					pattern = /([+\-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g,
					matches = pattern.exec(offset);

				while (matches) {
					switch (matches[2] || "d") {
						case "d" : case "D" :
							day += parseInt(matches[1],10); break;
						case "w" : case "W" :
							day += parseInt(matches[1],10) * 7; break;
						case "m" : case "M" :
							month += parseInt(matches[1],10);
							day = Math.min(day, $.datepicker._getDaysInMonth(year, month));
							break;
						case "y": case "Y" :
							year += parseInt(matches[1],10);
							day = Math.min(day, $.datepicker._getDaysInMonth(year, month));
							break;
					}
					matches = pattern.exec(offset);
				}
				return new Date(year, month, day);
			},
			newDate = (date == null || date === "" ? defaultDate : (typeof date === "string" ? offsetString(date) :
				(typeof date === "number" ? (isNaN(date) ? defaultDate : offsetNumeric(date)) : new Date(date.getTime()))));

		newDate = (newDate && newDate.toString() === "Invalid Date" ? defaultDate : newDate);
		if (newDate) {
			newDate.setHours(0);
			newDate.setMinutes(0);
			newDate.setSeconds(0);
			newDate.setMilliseconds(0);
		}
		return this._daylightSavingAdjust(newDate);
	},

	/* Handle switch to/from daylight saving.
	 * Hours may be non-zero on daylight saving cut-over:
	 * > 12 when midnight changeover, but then cannot generate
	 * midnight datetime, so jump to 1AM, otherwise reset.
	 * @param  date  (Date) the date to check
	 * @return  (Date) the corrected date
	 */
	_daylightSavingAdjust: function(date) {
		if (!date) {
			return null;
		}
		date.setHours(date.getHours() > 12 ? date.getHours() + 2 : 0);
		return date;
	},

	/* Set the date(s) directly. */
	_setDate: function(inst, date, noChange) {
		var clear = !date,
			origMonth = inst.selectedMonth,
			origYear = inst.selectedYear,
			newDate = this._restrictMinMax(inst, this._determineDate(inst, date, new Date()));

		inst.selectedDay = inst.currentDay = newDate.getDate();
		inst.drawMonth = inst.selectedMonth = inst.currentMonth = newDate.getMonth();
		inst.drawYear = inst.selectedYear = inst.currentYear = newDate.getFullYear();
		if ((origMonth !== inst.selectedMonth || origYear !== inst.selectedYear) && !noChange) {
			this._notifyChange(inst);
		}
		this._adjustInstDate(inst);
		if (inst.input) {
			inst.input.val(clear ? "" : this._formatDate(inst));
		}
	},

	/* Retrieve the date(s) directly. */
	_getDate: function(inst) {
		var startDate = (!inst.currentYear || (inst.input && inst.input.val() === "") ? null :
			this._daylightSavingAdjust(new Date(
			inst.currentYear, inst.currentMonth, inst.currentDay)));
			return startDate;
	},

	/* Attach the onxxx handlers.  These are declared statically so
	 * they work with static code transformers like Caja.
	 */
	_attachHandlers: function(inst) {
		var stepMonths = this._get(inst, "stepMonths"),
			id = "#" + inst.id.replace( /\\\\/g, "\\" );
		inst.dpDiv.find("[data-handler]").map(function () {
			var handler = {
				prev: function () {
					$.datepicker._adjustDate(id, -stepMonths, "M");
				},
				next: function () {
					$.datepicker._adjustDate(id, +stepMonths, "M");
				},
				hide: function () {
					$.datepicker._hideDatepicker();
				},
				today: function () {
					$.datepicker._gotoToday(id);
				},
				selectDay: function () {
					$.datepicker._selectDay(id, +this.getAttribute("data-month"), +this.getAttribute("data-year"), this);
					return false;
				},
				selectMonth: function () {
					$.datepicker._selectMonthYear(id, this, "M");
					return false;
				},
				selectYear: function () {
					$.datepicker._selectMonthYear(id, this, "Y");
					return false;
				}
			};
			$(this).bind(this.getAttribute("data-event"), handler[this.getAttribute("data-handler")]);
		});
	},

	/* Generate the HTML for the current state of the date picker. */
	_generateHTML: function(inst) {
		var maxDraw, prevText, prev, nextText, next, currentText, gotoDate,
			controls, buttonPanel, firstDay, showWeek, dayNames, dayNamesMin,
			monthNames, monthNamesShort, beforeShowDay, showOtherMonths,
			selectOtherMonths, defaultDate, html, dow, row, group, col, selectedDate,
			cornerClass, calender, thead, day, daysInMonth, leadDays, curRows, numRows,
			printDate, dRow, tbody, daySettings, otherMonth, unselectable,
			tempDate = new Date(),
			today = this._daylightSavingAdjust(
				new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate())), // clear time
			isRTL = this._get(inst, "isRTL"),
			showButtonPanel = this._get(inst, "showButtonPanel"),
			hideIfNoPrevNext = this._get(inst, "hideIfNoPrevNext"),
			navigationAsDateFormat = this._get(inst, "navigationAsDateFormat"),
			numMonths = this._getNumberOfMonths(inst),
			showCurrentAtPos = this._get(inst, "showCurrentAtPos"),
			stepMonths = this._get(inst, "stepMonths"),
			isMultiMonth = (numMonths[0] !== 1 || numMonths[1] !== 1),
			currentDate = this._daylightSavingAdjust((!inst.currentDay ? new Date(9999, 9, 9) :
				new Date(inst.currentYear, inst.currentMonth, inst.currentDay))),
			minDate = this._getMinMaxDate(inst, "min"),
			maxDate = this._getMinMaxDate(inst, "max"),
			drawMonth = inst.drawMonth - showCurrentAtPos,
			drawYear = inst.drawYear;

		if (drawMonth < 0) {
			drawMonth += 12;
			drawYear--;
		}
		if (maxDate) {
			maxDraw = this._daylightSavingAdjust(new Date(maxDate.getFullYear(),
				maxDate.getMonth() - (numMonths[0] * numMonths[1]) + 1, maxDate.getDate()));
			maxDraw = (minDate && maxDraw < minDate ? minDate : maxDraw);
			while (this._daylightSavingAdjust(new Date(drawYear, drawMonth, 1)) > maxDraw) {
				drawMonth--;
				if (drawMonth < 0) {
					drawMonth = 11;
					drawYear--;
				}
			}
		}
		inst.drawMonth = drawMonth;
		inst.drawYear = drawYear;

		prevText = this._get(inst, "prevText");
		prevText = (!navigationAsDateFormat ? prevText : this.formatDate(prevText,
			this._daylightSavingAdjust(new Date(drawYear, drawMonth - stepMonths, 1)),
			this._getFormatConfig(inst)));

		prev = (this._canAdjustMonth(inst, -1, drawYear, drawMonth) ?
			"<a class='ui-datepicker-prev ui-corner-all' data-handler='prev' data-event='click'" +
			" title='" + prevText + "'><span class='ui-icon ui-icon-circle-triangle-" + ( isRTL ? "e" : "w") + "'>" + prevText + "</span></a>" :
			(hideIfNoPrevNext ? "" : "<a class='ui-datepicker-prev ui-corner-all ui-state-disabled' title='"+ prevText +"'><span class='ui-icon ui-icon-circle-triangle-" + ( isRTL ? "e" : "w") + "'>" + prevText + "</span></a>"));

		nextText = this._get(inst, "nextText");
		nextText = (!navigationAsDateFormat ? nextText : this.formatDate(nextText,
			this._daylightSavingAdjust(new Date(drawYear, drawMonth + stepMonths, 1)),
			this._getFormatConfig(inst)));

		next = (this._canAdjustMonth(inst, +1, drawYear, drawMonth) ?
			"<a class='ui-datepicker-next ui-corner-all' data-handler='next' data-event='click'" +
			" title='" + nextText + "'><span class='ui-icon ui-icon-circle-triangle-" + ( isRTL ? "w" : "e") + "'>" + nextText + "</span></a>" :
			(hideIfNoPrevNext ? "" : "<a class='ui-datepicker-next ui-corner-all ui-state-disabled' title='"+ nextText + "'><span class='ui-icon ui-icon-circle-triangle-" + ( isRTL ? "w" : "e") + "'>" + nextText + "</span></a>"));

		currentText = this._get(inst, "currentText");
		gotoDate = (this._get(inst, "gotoCurrent") && inst.currentDay ? currentDate : today);
		currentText = (!navigationAsDateFormat ? currentText :
			this.formatDate(currentText, gotoDate, this._getFormatConfig(inst)));

		controls = (!inst.inline ? "<button type='button' class='ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all' data-handler='hide' data-event='click'>" +
			this._get(inst, "closeText") + "</button>" : "");

		buttonPanel = (showButtonPanel) ? "<div class='ui-datepicker-buttonpane ui-widget-content'>" + (isRTL ? controls : "") +
			(this._isInRange(inst, gotoDate) ? "<button type='button' class='ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all' data-handler='today' data-event='click'" +
			">" + currentText + "</button>" : "") + (isRTL ? "" : controls) + "</div>" : "";

		firstDay = parseInt(this._get(inst, "firstDay"),10);
		firstDay = (isNaN(firstDay) ? 0 : firstDay);

		showWeek = this._get(inst, "showWeek");
		dayNames = this._get(inst, "dayNames");
		dayNamesMin = this._get(inst, "dayNamesMin");
		monthNames = this._get(inst, "monthNames");
		monthNamesShort = this._get(inst, "monthNamesShort");
		beforeShowDay = this._get(inst, "beforeShowDay");
		showOtherMonths = this._get(inst, "showOtherMonths");
		selectOtherMonths = this._get(inst, "selectOtherMonths");
		defaultDate = this._getDefaultDate(inst);
		html = "";
		dow;
		for (row = 0; row < numMonths[0]; row++) {
			group = "";
			this.maxRows = 4;
			for (col = 0; col < numMonths[1]; col++) {
				selectedDate = this._daylightSavingAdjust(new Date(drawYear, drawMonth, inst.selectedDay));
				cornerClass = " ui-corner-all";
				calender = "";
				if (isMultiMonth) {
					calender += "<div class='ui-datepicker-group";
					if (numMonths[1] > 1) {
						switch (col) {
							case 0: calender += " ui-datepicker-group-first";
								cornerClass = " ui-corner-" + (isRTL ? "right" : "left"); break;
							case numMonths[1]-1: calender += " ui-datepicker-group-last";
								cornerClass = " ui-corner-" + (isRTL ? "left" : "right"); break;
							default: calender += " ui-datepicker-group-middle"; cornerClass = ""; break;
						}
					}
					calender += "'>";
				}
				calender += "<div class='ui-datepicker-header ui-widget-header ui-helper-clearfix" + cornerClass + "'>" +
					(/all|left/.test(cornerClass) && row === 0 ? (isRTL ? next : prev) : "") +
					(/all|right/.test(cornerClass) && row === 0 ? (isRTL ? prev : next) : "") +
					this._generateMonthYearHeader(inst, drawMonth, drawYear, minDate, maxDate,
					row > 0 || col > 0, monthNames, monthNamesShort) + // draw month headers
					"</div><table class='ui-datepicker-calendar'><thead>" +
					"<tr>";
				thead = (showWeek ? "<th class='ui-datepicker-week-col'>" + this._get(inst, "weekHeader") + "</th>" : "");
				for (dow = 0; dow < 7; dow++) { // days of the week
					day = (dow + firstDay) % 7;
					thead += "<th scope='col'" + ((dow + firstDay + 6) % 7 >= 5 ? " class='ui-datepicker-week-end'" : "") + ">" +
						"<span title='" + dayNames[day] + "'>" + dayNamesMin[day] + "</span></th>";
				}
				calender += thead + "</tr></thead><tbody>";
				daysInMonth = this._getDaysInMonth(drawYear, drawMonth);
				if (drawYear === inst.selectedYear && drawMonth === inst.selectedMonth) {
					inst.selectedDay = Math.min(inst.selectedDay, daysInMonth);
				}
				leadDays = (this._getFirstDayOfMonth(drawYear, drawMonth) - firstDay + 7) % 7;
				curRows = Math.ceil((leadDays + daysInMonth) / 7); // calculate the number of rows to generate
				numRows = (isMultiMonth ? this.maxRows > curRows ? this.maxRows : curRows : curRows); //If multiple months, use the higher number of rows (see #7043)
				this.maxRows = numRows;
				printDate = this._daylightSavingAdjust(new Date(drawYear, drawMonth, 1 - leadDays));
				for (dRow = 0; dRow < numRows; dRow++) { // create date picker rows
					calender += "<tr>";
					tbody = (!showWeek ? "" : "<td class='ui-datepicker-week-col'>" +
						this._get(inst, "calculateWeek")(printDate) + "</td>");
					for (dow = 0; dow < 7; dow++) { // create date picker days
						daySettings = (beforeShowDay ?
							beforeShowDay.apply((inst.input ? inst.input[0] : null), [printDate]) : [true, ""]);
						otherMonth = (printDate.getMonth() !== drawMonth);
						unselectable = (otherMonth && !selectOtherMonths) || !daySettings[0] ||
							(minDate && printDate < minDate) || (maxDate && printDate > maxDate);
						tbody += "<td class='" +
							((dow + firstDay + 6) % 7 >= 5 ? " ui-datepicker-week-end" : "") + // highlight weekends
							(otherMonth ? " ui-datepicker-other-month" : "") + // highlight days from other months
							((printDate.getTime() === selectedDate.getTime() && drawMonth === inst.selectedMonth && inst._keyEvent) || // user pressed key
							(defaultDate.getTime() === printDate.getTime() && defaultDate.getTime() === selectedDate.getTime()) ?
							// or defaultDate is current printedDate and defaultDate is selectedDate
							" " + this._dayOverClass : "") + // highlight selected day
							(unselectable ? " " + this._unselectableClass + " ui-state-disabled": "") +  // highlight unselectable days
							(otherMonth && !showOtherMonths ? "" : " " + daySettings[1] + // highlight custom dates
							(printDate.getTime() === currentDate.getTime() ? " " + this._currentClass : "") + // highlight selected day
							(printDate.getTime() === today.getTime() ? " ui-datepicker-today" : "")) + "'" + // highlight today (if different)
							((!otherMonth || showOtherMonths) && daySettings[2] ? " title='" + daySettings[2].replace(/'/g, "&#39;") + "'" : "") + // cell title
							(unselectable ? "" : " data-handler='selectDay' data-event='click' data-month='" + printDate.getMonth() + "' data-year='" + printDate.getFullYear() + "'") + ">" + // actions
							(otherMonth && !showOtherMonths ? "&#xa0;" : // display for other months
							(unselectable ? "<span class='ui-state-default'>" + printDate.getDate() + "</span>" : "<a class='ui-state-default" +
							(printDate.getTime() === today.getTime() ? " ui-state-highlight" : "") +
							(printDate.getTime() === currentDate.getTime() ? " ui-state-active" : "") + // highlight selected day
							(otherMonth ? " ui-priority-secondary" : "") + // distinguish dates from other months
							"' href='#'>" + printDate.getDate() + "</a>")) + "</td>"; // display selectable date
						printDate.setDate(printDate.getDate() + 1);
						printDate = this._daylightSavingAdjust(printDate);
					}
					calender += tbody + "</tr>";
				}
				drawMonth++;
				if (drawMonth > 11) {
					drawMonth = 0;
					drawYear++;
				}
				calender += "</tbody></table>" + (isMultiMonth ? "</div>" +
							((numMonths[0] > 0 && col === numMonths[1]-1) ? "<div class='ui-datepicker-row-break'></div>" : "") : "");
				group += calender;
			}
			html += group;
		}
		html += buttonPanel;
		inst._keyEvent = false;
		return html;
	},

	/* Generate the month and year header. */
	_generateMonthYearHeader: function(inst, drawMonth, drawYear, minDate, maxDate,
			secondary, monthNames, monthNamesShort) {

		var inMinYear, inMaxYear, month, years, thisYear, determineYear, year, endYear,
			changeMonth = this._get(inst, "changeMonth"),
			changeYear = this._get(inst, "changeYear"),
			showMonthAfterYear = this._get(inst, "showMonthAfterYear"),
			html = "<div class='ui-datepicker-title'>",
			monthHtml = "";

		// month selection
		if (secondary || !changeMonth) {
			monthHtml += "<span class='ui-datepicker-month'>" + monthNames[drawMonth] + "</span>";
		} else {
			inMinYear = (minDate && minDate.getFullYear() === drawYear);
			inMaxYear = (maxDate && maxDate.getFullYear() === drawYear);
			monthHtml += "<select class='ui-datepicker-month' data-handler='selectMonth' data-event='change'>";
			for ( month = 0; month < 12; month++) {
				if ((!inMinYear || month >= minDate.getMonth()) && (!inMaxYear || month <= maxDate.getMonth())) {
					monthHtml += "<option value='" + month + "'" +
						(month === drawMonth ? " selected='selected'" : "") +
						">" + monthNamesShort[month] + "</option>";
				}
			}
			monthHtml += "</select>";
		}

		if (!showMonthAfterYear) {
			html += monthHtml + (secondary || !(changeMonth && changeYear) ? "&#xa0;" : "");
		}

		// year selection
		if ( !inst.yearshtml ) {
			inst.yearshtml = "";
			if (secondary || !changeYear) {
				html += "<span class='ui-datepicker-year'>" + drawYear + "</span>";
			} else {
				// determine range of years to display
				years = this._get(inst, "yearRange").split(":");
				thisYear = new Date().getFullYear();
				determineYear = function(value) {
					var year = (value.match(/c[+\-].*/) ? drawYear + parseInt(value.substring(1), 10) :
						(value.match(/[+\-].*/) ? thisYear + parseInt(value, 10) :
						parseInt(value, 10)));
					return (isNaN(year) ? thisYear : year);
				};
				year = determineYear(years[0]);
				endYear = Math.max(year, determineYear(years[1] || ""));
				year = (minDate ? Math.max(year, minDate.getFullYear()) : year);
				endYear = (maxDate ? Math.min(endYear, maxDate.getFullYear()) : endYear);
				inst.yearshtml += "<select class='ui-datepicker-year' data-handler='selectYear' data-event='change'>";
				for (; year <= endYear; year++) {
					inst.yearshtml += "<option value='" + year + "'" +
						(year === drawYear ? " selected='selected'" : "") +
						">" + year + "</option>";
				}
				inst.yearshtml += "</select>";

				html += inst.yearshtml;
				inst.yearshtml = null;
			}
		}

		html += this._get(inst, "yearSuffix");
		if (showMonthAfterYear) {
			html += (secondary || !(changeMonth && changeYear) ? "&#xa0;" : "") + monthHtml;
		}
		html += "</div>"; // Close datepicker_header
		return html;
	},

	/* Adjust one of the date sub-fields. */
	_adjustInstDate: function(inst, offset, period) {
		var year = inst.drawYear + (period === "Y" ? offset : 0),
			month = inst.drawMonth + (period === "M" ? offset : 0),
			day = Math.min(inst.selectedDay, this._getDaysInMonth(year, month)) + (period === "D" ? offset : 0),
			date = this._restrictMinMax(inst, this._daylightSavingAdjust(new Date(year, month, day)));

		inst.selectedDay = date.getDate();
		inst.drawMonth = inst.selectedMonth = date.getMonth();
		inst.drawYear = inst.selectedYear = date.getFullYear();
		if (period === "M" || period === "Y") {
			this._notifyChange(inst);
		}
	},

	/* Ensure a date is within any min/max bounds. */
	_restrictMinMax: function(inst, date) {
		var minDate = this._getMinMaxDate(inst, "min"),
			maxDate = this._getMinMaxDate(inst, "max"),
			newDate = (minDate && date < minDate ? minDate : date);
		return (maxDate && newDate > maxDate ? maxDate : newDate);
	},

	/* Notify change of month/year. */
	_notifyChange: function(inst) {
		var onChange = this._get(inst, "onChangeMonthYear");
		if (onChange) {
			onChange.apply((inst.input ? inst.input[0] : null),
				[inst.selectedYear, inst.selectedMonth + 1, inst]);
		}
	},

	/* Determine the number of months to show. */
	_getNumberOfMonths: function(inst) {
		var numMonths = this._get(inst, "numberOfMonths");
		return (numMonths == null ? [1, 1] : (typeof numMonths === "number" ? [1, numMonths] : numMonths));
	},

	/* Determine the current maximum date - ensure no time components are set. */
	_getMinMaxDate: function(inst, minMax) {
		return this._determineDate(inst, this._get(inst, minMax + "Date"), null);
	},

	/* Find the number of days in a given month. */
	_getDaysInMonth: function(year, month) {
		return 32 - this._daylightSavingAdjust(new Date(year, month, 32)).getDate();
	},

	/* Find the day of the week of the first of a month. */
	_getFirstDayOfMonth: function(year, month) {
		return new Date(year, month, 1).getDay();
	},

	/* Determines if we should allow a "next/prev" month display change. */
	_canAdjustMonth: function(inst, offset, curYear, curMonth) {
		var numMonths = this._getNumberOfMonths(inst),
			date = this._daylightSavingAdjust(new Date(curYear,
			curMonth + (offset < 0 ? offset : numMonths[0] * numMonths[1]), 1));

		if (offset < 0) {
			date.setDate(this._getDaysInMonth(date.getFullYear(), date.getMonth()));
		}
		return this._isInRange(inst, date);
	},

	/* Is the given date in the accepted range? */
	_isInRange: function(inst, date) {
		var yearSplit, currentYear,
			minDate = this._getMinMaxDate(inst, "min"),
			maxDate = this._getMinMaxDate(inst, "max"),
			minYear = null,
			maxYear = null,
			years = this._get(inst, "yearRange");
			if (years){
				yearSplit = years.split(":");
				currentYear = new Date().getFullYear();
				minYear = parseInt(yearSplit[0], 10);
				maxYear = parseInt(yearSplit[1], 10);
				if ( yearSplit[0].match(/[+\-].*/) ) {
					minYear += currentYear;
				}
				if ( yearSplit[1].match(/[+\-].*/) ) {
					maxYear += currentYear;
				}
			}

		return ((!minDate || date.getTime() >= minDate.getTime()) &&
			(!maxDate || date.getTime() <= maxDate.getTime()) &&
			(!minYear || date.getFullYear() >= minYear) &&
			(!maxYear || date.getFullYear() <= maxYear));
	},

	/* Provide the configuration settings for formatting/parsing. */
	_getFormatConfig: function(inst) {
		var shortYearCutoff = this._get(inst, "shortYearCutoff");
		shortYearCutoff = (typeof shortYearCutoff !== "string" ? shortYearCutoff :
			new Date().getFullYear() % 100 + parseInt(shortYearCutoff, 10));
		return {shortYearCutoff: shortYearCutoff,
			dayNamesShort: this._get(inst, "dayNamesShort"), dayNames: this._get(inst, "dayNames"),
			monthNamesShort: this._get(inst, "monthNamesShort"), monthNames: this._get(inst, "monthNames")};
	},

	/* Format the given date for display. */
	_formatDate: function(inst, day, month, year) {
		if (!day) {
			inst.currentDay = inst.selectedDay;
			inst.currentMonth = inst.selectedMonth;
			inst.currentYear = inst.selectedYear;
		}
		var date = (day ? (typeof day === "object" ? day :
			this._daylightSavingAdjust(new Date(year, month, day))) :
			this._daylightSavingAdjust(new Date(inst.currentYear, inst.currentMonth, inst.currentDay)));
		return this.formatDate(this._get(inst, "dateFormat"), date, this._getFormatConfig(inst));
	}
});

/*
 * Bind hover events for datepicker elements.
 * Done via delegate so the binding only occurs once in the lifetime of the parent div.
 * Global datepicker_instActive, set by _updateDatepicker allows the handlers to find their way back to the active picker.
 */
function datepicker_bindHover(dpDiv) {
	var selector = "button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a";
	return dpDiv.delegate(selector, "mouseout", function() {
			$(this).removeClass("ui-state-hover");
			if (this.className.indexOf("ui-datepicker-prev") !== -1) {
				$(this).removeClass("ui-datepicker-prev-hover");
			}
			if (this.className.indexOf("ui-datepicker-next") !== -1) {
				$(this).removeClass("ui-datepicker-next-hover");
			}
		})
		.delegate( selector, "mouseover", datepicker_handleMouseover );
}

function datepicker_handleMouseover() {
	if (!$.datepicker._isDisabledDatepicker( datepicker_instActive.inline? datepicker_instActive.dpDiv.parent()[0] : datepicker_instActive.input[0])) {
		$(this).parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover");
		$(this).addClass("ui-state-hover");
		if (this.className.indexOf("ui-datepicker-prev") !== -1) {
			$(this).addClass("ui-datepicker-prev-hover");
		}
		if (this.className.indexOf("ui-datepicker-next") !== -1) {
			$(this).addClass("ui-datepicker-next-hover");
		}
	}
}

/* jQuery extend now ignores nulls! */
function datepicker_extendRemove(target, props) {
	$.extend(target, props);
	for (var name in props) {
		if (props[name] == null) {
			target[name] = props[name];
		}
	}
	return target;
}

/* Invoke the datepicker functionality.
   @param  options  string - a command, optionally followed by additional parameters or
					Object - settings for attaching new datepicker functionality
   @return  jQuery object */
$.fn.datepicker = function(options){

	/* Verify an empty collection wasn't passed - Fixes #6976 */
	if ( !this.length ) {
		return this;
	}

	/* Initialise the date picker. */
	if (!$.datepicker.initialized) {
		$(document).mousedown($.datepicker._checkExternalClick);
		$.datepicker.initialized = true;
	}

	/* Append datepicker main container to body if not exist. */
	if ($("#"+$.datepicker._mainDivId).length === 0) {
		$("body").append($.datepicker.dpDiv);
	}

	var otherArgs = Array.prototype.slice.call(arguments, 1);
	if (typeof options === "string" && (options === "isDisabled" || options === "getDate" || options === "widget")) {
		return $.datepicker["_" + options + "Datepicker"].
			apply($.datepicker, [this[0]].concat(otherArgs));
	}
	if (options === "option" && arguments.length === 2 && typeof arguments[1] === "string") {
		return $.datepicker["_" + options + "Datepicker"].
			apply($.datepicker, [this[0]].concat(otherArgs));
	}
	return this.each(function() {
		typeof options === "string" ?
			$.datepicker["_" + options + "Datepicker"].
				apply($.datepicker, [this].concat(otherArgs)) :
			$.datepicker._attachDatepicker(this, options);
	});
};

$.datepicker = new Datepicker(); // singleton instance
$.datepicker.initialized = false;
$.datepicker.uuid = new Date().getTime();
$.datepicker.version = "1.11.4";

var datepicker = $.datepicker;


/*
 * jQuery UI Dialog 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/dialog/
 */


var dialog = $.widget( "ui.dialog", {
	version: "1.11.4",
	options: {
		appendTo: "body",
		autoOpen: true,
		buttons: [],
		closeOnEscape: true,
		closeText: "Close",
		dialogClass: "",
		draggable: true,
		hide: null,
		height: "auto",
		maxHeight: null,
		maxWidth: null,
		minHeight: 150,
		minWidth: 150,
		modal: false,
		position: {
			my: "center",
			at: "center",
			of: window,
			collision: "fit",
			// Ensure the titlebar is always visible
			using: function( pos ) {
				var topOffset = $( this ).css( pos ).offset().top;
				if ( topOffset < 0 ) {
					$( this ).css( "top", pos.top - topOffset );
				}
			}
		},
		resizable: true,
		show: null,
		title: null,
		width: 300,

		// callbacks
		beforeClose: null,
		close: null,
		drag: null,
		dragStart: null,
		dragStop: null,
		focus: null,
		open: null,
		resize: null,
		resizeStart: null,
		resizeStop: null
	},

	sizeRelatedOptions: {
		buttons: true,
		height: true,
		maxHeight: true,
		maxWidth: true,
		minHeight: true,
		minWidth: true,
		width: true
	},

	resizableRelatedOptions: {
		maxHeight: true,
		maxWidth: true,
		minHeight: true,
		minWidth: true
	},

	_create: function() {
		this.originalCss = {
			display: this.element[ 0 ].style.display,
			width: this.element[ 0 ].style.width,
			minHeight: this.element[ 0 ].style.minHeight,
			maxHeight: this.element[ 0 ].style.maxHeight,
			height: this.element[ 0 ].style.height
		};
		this.originalPosition = {
			parent: this.element.parent(),
			index: this.element.parent().children().index( this.element )
		};
		this.originalTitle = this.element.attr( "title" );
		this.options.title = this.options.title || this.originalTitle;

		this._createWrapper();

		this.element
			.show()
			.removeAttr( "title" )
			.addClass( "ui-dialog-content ui-widget-content" )
			.appendTo( this.uiDialog );

		this._createTitlebar();
		this._createButtonPane();

		if ( this.options.draggable && $.fn.draggable ) {
			this._makeDraggable();
		}
		if ( this.options.resizable && $.fn.resizable ) {
			this._makeResizable();
		}

		this._isOpen = false;

		this._trackFocus();
	},

	_init: function() {
		if ( this.options.autoOpen ) {
			this.open();
		}
	},

	_appendTo: function() {
		var element = this.options.appendTo;
		if ( element && (element.jquery || element.nodeType) ) {
			return $( element );
		}
		return this.document.find( element || "body" ).eq( 0 );
	},

	_destroy: function() {
		var next,
			originalPosition = this.originalPosition;

		this._untrackInstance();
		this._destroyOverlay();

		this.element
			.removeUniqueId()
			.removeClass( "ui-dialog-content ui-widget-content" )
			.css( this.originalCss )
			// Without detaching first, the following becomes really slow
			.detach();

		this.uiDialog.stop( true, true ).remove();

		if ( this.originalTitle ) {
			this.element.attr( "title", this.originalTitle );
		}

		next = originalPosition.parent.children().eq( originalPosition.index );
		// Don't try to place the dialog next to itself (#8613)
		if ( next.length && next[ 0 ] !== this.element[ 0 ] ) {
			next.before( this.element );
		} else {
			originalPosition.parent.append( this.element );
		}
	},

	widget: function() {
		return this.uiDialog;
	},

	disable: $.noop,
	enable: $.noop,

	close: function( event ) {
		var activeElement,
			that = this;

		if ( !this._isOpen || this._trigger( "beforeClose", event ) === false ) {
			return;
		}

		this._isOpen = false;
		this._focusedElement = null;
		this._destroyOverlay();
		this._untrackInstance();

		if ( !this.opener.filter( ":focusable" ).focus().length ) {

			// support: IE9
			// IE9 throws an "Unspecified error" accessing document.activeElement from an <iframe>
			try {
				activeElement = this.document[ 0 ].activeElement;

				// Support: IE9, IE10
				// If the <body> is blurred, IE will switch windows, see #4520
				if ( activeElement && activeElement.nodeName.toLowerCase() !== "body" ) {

					// Hiding a focused element doesn't trigger blur in WebKit
					// so in case we have nothing to focus on, explicitly blur the active element
					// https://bugs.webkit.org/show_bug.cgi?id=47182
					$( activeElement ).blur();
				}
			} catch ( error ) {}
		}

		this._hide( this.uiDialog, this.options.hide, function() {
			that._trigger( "close", event );
		});
	},

	isOpen: function() {
		return this._isOpen;
	},

	moveToTop: function() {
		this._moveToTop();
	},

	_moveToTop: function( event, silent ) {
		var moved = false,
			zIndices = this.uiDialog.siblings( ".ui-front:visible" ).map(function() {
				return +$( this ).css( "z-index" );
			}).get(),
			zIndexMax = Math.max.apply( null, zIndices );

		if ( zIndexMax >= +this.uiDialog.css( "z-index" ) ) {
			this.uiDialog.css( "z-index", zIndexMax + 1 );
			moved = true;
		}

		if ( moved && !silent ) {
			this._trigger( "focus", event );
		}
		return moved;
	},

	open: function() {
		var that = this;
		if ( this._isOpen ) {
			if ( this._moveToTop() ) {
				this._focusTabbable();
			}
			return;
		}

		this._isOpen = true;
		this.opener = $( this.document[ 0 ].activeElement );

		this._size();
		this._position();
		this._createOverlay();
		this._moveToTop( null, true );

		// Ensure the overlay is moved to the top with the dialog, but only when
		// opening. The overlay shouldn't move after the dialog is open so that
		// modeless dialogs opened after the modal dialog stack properly.
		if ( this.overlay ) {
			this.overlay.css( "z-index", this.uiDialog.css( "z-index" ) - 1 );
		}

		this._show( this.uiDialog, this.options.show, function() {
			that._focusTabbable();
			that._trigger( "focus" );
		});

		// Track the dialog immediately upon openening in case a focus event
		// somehow occurs outside of the dialog before an element inside the
		// dialog is focused (#10152)
		this._makeFocusTarget();

		this._trigger( "open" );
	},

	_focusTabbable: function() {
		// Set focus to the first match:
		// 1. An element that was focused previously
		// 2. First element inside the dialog matching [autofocus]
		// 3. Tabbable element inside the content element
		// 4. Tabbable element inside the buttonpane
		// 5. The close button
		// 6. The dialog itself
		var hasFocus = this._focusedElement;
		if ( !hasFocus ) {
			hasFocus = this.element.find( "[autofocus]" );
		}
		if ( !hasFocus.length ) {
			hasFocus = this.element.find( ":tabbable" );
		}
		if ( !hasFocus.length ) {
			hasFocus = this.uiDialogButtonPane.find( ":tabbable" );
		}
		if ( !hasFocus.length ) {
			hasFocus = this.uiDialogTitlebarClose.filter( ":tabbable" );
		}
		if ( !hasFocus.length ) {
			hasFocus = this.uiDialog;
		}
		hasFocus.eq( 0 ).focus();
	},

	_keepFocus: function( event ) {
		function checkFocus() {
			var activeElement = this.document[0].activeElement,
				isActive = this.uiDialog[0] === activeElement ||
					$.contains( this.uiDialog[0], activeElement );
			if ( !isActive ) {
				this._focusTabbable();
			}
		}
		event.preventDefault();
		checkFocus.call( this );
		// support: IE
		// IE <= 8 doesn't prevent moving focus even with event.preventDefault()
		// so we check again later
		this._delay( checkFocus );
	},

	_createWrapper: function() {
		this.uiDialog = $("<div>")
			.addClass( "ui-dialog ui-widget ui-widget-content ui-corner-all ui-front " +
				this.options.dialogClass )
			.hide()
			.attr({
				// Setting tabIndex makes the div focusable
				tabIndex: -1,
				role: "dialog"
			})
			.appendTo( this._appendTo() );

		this._on( this.uiDialog, {
			keydown: function( event ) {
				if ( this.options.closeOnEscape && !event.isDefaultPrevented() && event.keyCode &&
						event.keyCode === $.ui.keyCode.ESCAPE ) {
					event.preventDefault();
					this.close( event );
					return;
				}

				// prevent tabbing out of dialogs
				if ( event.keyCode !== $.ui.keyCode.TAB || event.isDefaultPrevented() ) {
					return;
				}
				var tabbables = this.uiDialog.find( ":tabbable" ),
					first = tabbables.filter( ":first" ),
					last = tabbables.filter( ":last" );

				if ( ( event.target === last[0] || event.target === this.uiDialog[0] ) && !event.shiftKey ) {
					this._delay(function() {
						first.focus();
					});
					event.preventDefault();
				} else if ( ( event.target === first[0] || event.target === this.uiDialog[0] ) && event.shiftKey ) {
					this._delay(function() {
						last.focus();
					});
					event.preventDefault();
				}
			},
			mousedown: function( event ) {
				if ( this._moveToTop( event ) ) {
					this._focusTabbable();
				}
			}
		});

		// We assume that any existing aria-describedby attribute means
		// that the dialog content is marked up properly
		// otherwise we brute force the content as the description
		if ( !this.element.find( "[aria-describedby]" ).length ) {
			this.uiDialog.attr({
				"aria-describedby": this.element.uniqueId().attr( "id" )
			});
		}
	},

	_createTitlebar: function() {
		var uiDialogTitle;

		this.uiDialogTitlebar = $( "<div>" )
			.addClass( "ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix" )
			.prependTo( this.uiDialog );
		this._on( this.uiDialogTitlebar, {
			mousedown: function( event ) {
				// Don't prevent click on close button (#8838)
				// Focusing a dialog that is partially scrolled out of view
				// causes the browser to scroll it into view, preventing the click event
				if ( !$( event.target ).closest( ".ui-dialog-titlebar-close" ) ) {
					// Dialog isn't getting focus when dragging (#8063)
					this.uiDialog.focus();
				}
			}
		});

		// support: IE
		// Use type="button" to prevent enter keypresses in textboxes from closing the
		// dialog in IE (#9312)
		this.uiDialogTitlebarClose = $( "<button type='button'></button>" )
			.button({
				label: this.options.closeText,
				icons: {
					primary: "ui-icon-closethick"
				},
				text: false
			})
			.addClass( "ui-dialog-titlebar-close" )
			.appendTo( this.uiDialogTitlebar );
		this._on( this.uiDialogTitlebarClose, {
			click: function( event ) {
				event.preventDefault();
				this.close( event );
			}
		});

		uiDialogTitle = $( "<span>" )
			.uniqueId()
			.addClass( "ui-dialog-title" )
			.prependTo( this.uiDialogTitlebar );
		this._title( uiDialogTitle );

		this.uiDialog.attr({
			"aria-labelledby": uiDialogTitle.attr( "id" )
		});
	},

	_title: function( title ) {
		if ( !this.options.title ) {
			title.html( "&#160;" );
		}
		title.text( this.options.title );
	},

	_createButtonPane: function() {
		this.uiDialogButtonPane = $( "<div>" )
			.addClass( "ui-dialog-buttonpane ui-widget-content ui-helper-clearfix" );

		this.uiButtonSet = $( "<div>" )
			.addClass( "ui-dialog-buttonset" )
			.appendTo( this.uiDialogButtonPane );

		this._createButtons();
	},

	_createButtons: function() {
		var that = this,
			buttons = this.options.buttons;

		// if we already have a button pane, remove it
		this.uiDialogButtonPane.remove();
		this.uiButtonSet.empty();

		if ( $.isEmptyObject( buttons ) || ($.isArray( buttons ) && !buttons.length) ) {
			this.uiDialog.removeClass( "ui-dialog-buttons" );
			return;
		}

		$.each( buttons, function( name, props ) {
			var click, buttonOptions;
			props = $.isFunction( props ) ?
				{ click: props, text: name } :
				props;
			// Default to a non-submitting button
			props = $.extend( { type: "button" }, props );
			// Change the context for the click callback to be the main element
			click = props.click;
			props.click = function() {
				click.apply( that.element[ 0 ], arguments );
			};
			buttonOptions = {
				icons: props.icons,
				text: props.showText
			};
			delete props.icons;
			delete props.showText;
			$( "<button></button>", props )
				.button( buttonOptions )
				.appendTo( that.uiButtonSet );
		});
		this.uiDialog.addClass( "ui-dialog-buttons" );
		this.uiDialogButtonPane.appendTo( this.uiDialog );
	},

	_makeDraggable: function() {
		var that = this,
			options = this.options;

		function filteredUi( ui ) {
			return {
				position: ui.position,
				offset: ui.offset
			};
		}

		this.uiDialog.draggable({
			cancel: ".ui-dialog-content, .ui-dialog-titlebar-close",
			handle: ".ui-dialog-titlebar",
			containment: "document",
			start: function( event, ui ) {
				$( this ).addClass( "ui-dialog-dragging" );
				that._blockFrames();
				that._trigger( "dragStart", event, filteredUi( ui ) );
			},
			drag: function( event, ui ) {
				that._trigger( "drag", event, filteredUi( ui ) );
			},
			stop: function( event, ui ) {
				var left = ui.offset.left - that.document.scrollLeft(),
					top = ui.offset.top - that.document.scrollTop();

				options.position = {
					my: "left top",
					at: "left" + (left >= 0 ? "+" : "") + left + " " +
						"top" + (top >= 0 ? "+" : "") + top,
					of: that.window
				};
				$( this ).removeClass( "ui-dialog-dragging" );
				that._unblockFrames();
				that._trigger( "dragStop", event, filteredUi( ui ) );
			}
		});
	},

	_makeResizable: function() {
		var that = this,
			options = this.options,
			handles = options.resizable,
			// .ui-resizable has position: relative defined in the stylesheet
			// but dialogs have to use absolute or fixed positioning
			position = this.uiDialog.css("position"),
			resizeHandles = typeof handles === "string" ?
				handles	:
				"n,e,s,w,se,sw,ne,nw";

		function filteredUi( ui ) {
			return {
				originalPosition: ui.originalPosition,
				originalSize: ui.originalSize,
				position: ui.position,
				size: ui.size
			};
		}

		this.uiDialog.resizable({
			cancel: ".ui-dialog-content",
			containment: "document",
			alsoResize: this.element,
			maxWidth: options.maxWidth,
			maxHeight: options.maxHeight,
			minWidth: options.minWidth,
			minHeight: this._minHeight(),
			handles: resizeHandles,
			start: function( event, ui ) {
				$( this ).addClass( "ui-dialog-resizing" );
				that._blockFrames();
				that._trigger( "resizeStart", event, filteredUi( ui ) );
			},
			resize: function( event, ui ) {
				that._trigger( "resize", event, filteredUi( ui ) );
			},
			stop: function( event, ui ) {
				var offset = that.uiDialog.offset(),
					left = offset.left - that.document.scrollLeft(),
					top = offset.top - that.document.scrollTop();

				options.height = that.uiDialog.height();
				options.width = that.uiDialog.width();
				options.position = {
					my: "left top",
					at: "left" + (left >= 0 ? "+" : "") + left + " " +
						"top" + (top >= 0 ? "+" : "") + top,
					of: that.window
				};
				$( this ).removeClass( "ui-dialog-resizing" );
				that._unblockFrames();
				that._trigger( "resizeStop", event, filteredUi( ui ) );
			}
		})
		.css( "position", position );
	},

	_trackFocus: function() {
		this._on( this.widget(), {
			focusin: function( event ) {
				this._makeFocusTarget();
				this._focusedElement = $( event.target );
			}
		});
	},

	_makeFocusTarget: function() {
		this._untrackInstance();
		this._trackingInstances().unshift( this );
	},

	_untrackInstance: function() {
		var instances = this._trackingInstances(),
			exists = $.inArray( this, instances );
		if ( exists !== -1 ) {
			instances.splice( exists, 1 );
		}
	},

	_trackingInstances: function() {
		var instances = this.document.data( "ui-dialog-instances" );
		if ( !instances ) {
			instances = [];
			this.document.data( "ui-dialog-instances", instances );
		}
		return instances;
	},

	_minHeight: function() {
		var options = this.options;

		return options.height === "auto" ?
			options.minHeight :
			Math.min( options.minHeight, options.height );
	},

	_position: function() {
		// Need to show the dialog to get the actual offset in the position plugin
		var isVisible = this.uiDialog.is( ":visible" );
		if ( !isVisible ) {
			this.uiDialog.show();
		}
		this.uiDialog.position( this.options.position );
		if ( !isVisible ) {
			this.uiDialog.hide();
		}
	},

	_setOptions: function( options ) {
		var that = this,
			resize = false,
			resizableOptions = {};

		$.each( options, function( key, value ) {
			that._setOption( key, value );

			if ( key in that.sizeRelatedOptions ) {
				resize = true;
			}
			if ( key in that.resizableRelatedOptions ) {
				resizableOptions[ key ] = value;
			}
		});

		if ( resize ) {
			this._size();
			this._position();
		}
		if ( this.uiDialog.is( ":data(ui-resizable)" ) ) {
			this.uiDialog.resizable( "option", resizableOptions );
		}
	},

	_setOption: function( key, value ) {
		var isDraggable, isResizable,
			uiDialog = this.uiDialog;

		if ( key === "dialogClass" ) {
			uiDialog
				.removeClass( this.options.dialogClass )
				.addClass( value );
		}

		if ( key === "disabled" ) {
			return;
		}

		this._super( key, value );

		if ( key === "appendTo" ) {
			this.uiDialog.appendTo( this._appendTo() );
		}

		if ( key === "buttons" ) {
			this._createButtons();
		}

		if ( key === "closeText" ) {
			this.uiDialogTitlebarClose.button({
				// Ensure that we always pass a string
				label: "" + value
			});
		}

		if ( key === "draggable" ) {
			isDraggable = uiDialog.is( ":data(ui-draggable)" );
			if ( isDraggable && !value ) {
				uiDialog.draggable( "destroy" );
			}

			if ( !isDraggable && value ) {
				this._makeDraggable();
			}
		}

		if ( key === "position" ) {
			this._position();
		}

		if ( key === "resizable" ) {
			// currently resizable, becoming non-resizable
			isResizable = uiDialog.is( ":data(ui-resizable)" );
			if ( isResizable && !value ) {
				uiDialog.resizable( "destroy" );
			}

			// currently resizable, changing handles
			if ( isResizable && typeof value === "string" ) {
				uiDialog.resizable( "option", "handles", value );
			}

			// currently non-resizable, becoming resizable
			if ( !isResizable && value !== false ) {
				this._makeResizable();
			}
		}

		if ( key === "title" ) {
			this._title( this.uiDialogTitlebar.find( ".ui-dialog-title" ) );
		}
	},

	_size: function() {
		// If the user has resized the dialog, the .ui-dialog and .ui-dialog-content
		// divs will both have width and height set, so we need to reset them
		var nonContentHeight, minContentHeight, maxContentHeight,
			options = this.options;

		// Reset content sizing
		this.element.show().css({
			width: "auto",
			minHeight: 0,
			maxHeight: "none",
			height: 0
		});

		if ( options.minWidth > options.width ) {
			options.width = options.minWidth;
		}

		// reset wrapper sizing
		// determine the height of all the non-content elements
		nonContentHeight = this.uiDialog.css({
				height: "auto",
				width: options.width
			})
			.outerHeight();
		minContentHeight = Math.max( 0, options.minHeight - nonContentHeight );
		maxContentHeight = typeof options.maxHeight === "number" ?
			Math.max( 0, options.maxHeight - nonContentHeight ) :
			"none";

		if ( options.height === "auto" ) {
			this.element.css({
				minHeight: minContentHeight,
				maxHeight: maxContentHeight,
				height: "auto"
			});
		} else {
			this.element.height( Math.max( 0, options.height - nonContentHeight ) );
		}

		if ( this.uiDialog.is( ":data(ui-resizable)" ) ) {
			this.uiDialog.resizable( "option", "minHeight", this._minHeight() );
		}
	},

	_blockFrames: function() {
		this.iframeBlocks = this.document.find( "iframe" ).map(function() {
			var iframe = $( this );

			return $( "<div>" )
				.css({
					position: "absolute",
					width: iframe.outerWidth(),
					height: iframe.outerHeight()
				})
				.appendTo( iframe.parent() )
				.offset( iframe.offset() )[0];
		});
	},

	_unblockFrames: function() {
		if ( this.iframeBlocks ) {
			this.iframeBlocks.remove();
			delete this.iframeBlocks;
		}
	},

	_allowInteraction: function( event ) {
		if ( $( event.target ).closest( ".ui-dialog" ).length ) {
			return true;
		}

		// TODO: Remove hack when datepicker implements
		// the .ui-front logic (#8989)
		return !!$( event.target ).closest( ".ui-datepicker" ).length;
	},

	_createOverlay: function() {
		if ( !this.options.modal ) {
			return;
		}

		// We use a delay in case the overlay is created from an
		// event that we're going to be cancelling (#2804)
		var isOpening = true;
		this._delay(function() {
			isOpening = false;
		});

		if ( !this.document.data( "ui-dialog-overlays" ) ) {

			// Prevent use of anchors and inputs
			// Using _on() for an event handler shared across many instances is
			// safe because the dialogs stack and must be closed in reverse order
			this._on( this.document, {
				focusin: function( event ) {
					if ( isOpening ) {
						return;
					}

					if ( !this._allowInteraction( event ) ) {
						event.preventDefault();
						this._trackingInstances()[ 0 ]._focusTabbable();
					}
				}
			});
		}

		this.overlay = $( "<div>" )
			.addClass( "ui-widget-overlay ui-front" )
			.appendTo( this._appendTo() );
		this._on( this.overlay, {
			mousedown: "_keepFocus"
		});
		this.document.data( "ui-dialog-overlays",
			(this.document.data( "ui-dialog-overlays" ) || 0) + 1 );
	},

	_destroyOverlay: function() {
		if ( !this.options.modal ) {
			return;
		}

		if ( this.overlay ) {
			var overlays = this.document.data( "ui-dialog-overlays" ) - 1;

			if ( !overlays ) {
				this.document
					.unbind( "focusin" )
					.removeData( "ui-dialog-overlays" );
			} else {
				this.document.data( "ui-dialog-overlays", overlays );
			}

			this.overlay.remove();
			this.overlay = null;
		}
	}
});


/*
 * jQuery UI Progressbar 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/progressbar/
 */


var progressbar = $.widget( "ui.progressbar", {
	version: "1.11.4",
	options: {
		max: 100,
		value: 0,

		change: null,
		complete: null
	},

	min: 0,

	_create: function() {
		// Constrain initial value
		this.oldValue = this.options.value = this._constrainedValue();

		this.element
			.addClass( "ui-progressbar ui-widget ui-widget-content ui-corner-all" )
			.attr({
				// Only set static values, aria-valuenow and aria-valuemax are
				// set inside _refreshValue()
				role: "progressbar",
				"aria-valuemin": this.min
			});

		this.valueDiv = $( "<div class='ui-progressbar-value ui-widget-header ui-corner-left'></div>" )
			.appendTo( this.element );

		this._refreshValue();
	},

	_destroy: function() {
		this.element
			.removeClass( "ui-progressbar ui-widget ui-widget-content ui-corner-all" )
			.removeAttr( "role" )
			.removeAttr( "aria-valuemin" )
			.removeAttr( "aria-valuemax" )
			.removeAttr( "aria-valuenow" );

		this.valueDiv.remove();
	},

	value: function( newValue ) {
		if ( newValue === undefined ) {
			return this.options.value;
		}

		this.options.value = this._constrainedValue( newValue );
		this._refreshValue();
	},

	_constrainedValue: function( newValue ) {
		if ( newValue === undefined ) {
			newValue = this.options.value;
		}

		this.indeterminate = newValue === false;

		// sanitize value
		if ( typeof newValue !== "number" ) {
			newValue = 0;
		}

		return this.indeterminate ? false :
			Math.min( this.options.max, Math.max( this.min, newValue ) );
	},

	_setOptions: function( options ) {
		// Ensure "value" option is set after other values (like max)
		var value = options.value;
		delete options.value;

		this._super( options );

		this.options.value = this._constrainedValue( value );
		this._refreshValue();
	},

	_setOption: function( key, value ) {
		if ( key === "max" ) {
			// Don't allow a max less than min
			value = Math.max( this.min, value );
		}
		if ( key === "disabled" ) {
			this.element
				.toggleClass( "ui-state-disabled", !!value )
				.attr( "aria-disabled", value );
		}
		this._super( key, value );
	},

	_percentage: function() {
		return this.indeterminate ? 100 : 100 * ( this.options.value - this.min ) / ( this.options.max - this.min );
	},

	_refreshValue: function() {
		var value = this.options.value,
			percentage = this._percentage();

		this.valueDiv
			.toggle( this.indeterminate || value > this.min )
			.toggleClass( "ui-corner-right", value === this.options.max )
			.width( percentage.toFixed(0) + "%" );

		this.element.toggleClass( "ui-progressbar-indeterminate", this.indeterminate );

		if ( this.indeterminate ) {
			this.element.removeAttr( "aria-valuenow" );
			if ( !this.overlayDiv ) {
				this.overlayDiv = $( "<div class='ui-progressbar-overlay'></div>" ).appendTo( this.valueDiv );
			}
		} else {
			this.element.attr({
				"aria-valuemax": this.options.max,
				"aria-valuenow": value
			});
			if ( this.overlayDiv ) {
				this.overlayDiv.remove();
				this.overlayDiv = null;
			}
		}

		if ( this.oldValue !== value ) {
			this.oldValue = value;
			this._trigger( "change" );
		}
		if ( value === this.options.max ) {
			this._trigger( "complete" );
		}
	}
});


/*
 * jQuery UI Selectmenu 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/selectmenu
 */


var selectmenu = $.widget( "ui.selectmenu", {
	version: "1.11.4",
	defaultElement: "<select>",
	options: {
		appendTo: null,
		disabled: null,
		icons: {
			button: "ui-icon-triangle-1-s"
		},
		position: {
			my: "left top",
			at: "left bottom",
			collision: "none"
		},
		width: null,

		// callbacks
		change: null,
		close: null,
		focus: null,
		open: null,
		select: null
	},

	_create: function() {
		var selectmenuId = this.element.uniqueId().attr( "id" );
		this.ids = {
			element: selectmenuId,
			button: selectmenuId + "-button",
			menu: selectmenuId + "-menu"
		};

		this._drawButton();
		this._drawMenu();

		if ( this.options.disabled ) {
			this.disable();
		}
	},

	_drawButton: function() {
		var that = this;

		// Associate existing label with the new button
		this.label = $( "label[for='" + this.ids.element + "']" ).attr( "for", this.ids.button );
		this._on( this.label, {
			click: function( event ) {
				this.button.focus();
				event.preventDefault();
			}
		});

		// Hide original select element
		this.element.hide();

		// Create button
		this.button = $( "<span>", {
			"class": "ui-selectmenu-button ui-widget ui-state-default ui-corner-all",
			tabindex: this.options.disabled ? -1 : 0,
			id: this.ids.button,
			role: "combobox",
			"aria-expanded": "false",
			"aria-autocomplete": "list",
			"aria-owns": this.ids.menu,
			"aria-haspopup": "true"
		})
			.insertAfter( this.element );

		$( "<span>", {
			"class": "ui-icon " + this.options.icons.button
		})
			.prependTo( this.button );

		this.buttonText = $( "<span>", {
			"class": "ui-selectmenu-text"
		})
			.appendTo( this.button );

		this._setText( this.buttonText, this.element.find( "option:selected" ).text() );
		this._resizeButton();

		this._on( this.button, this._buttonEvents );
		this.button.one( "focusin", function() {

			// Delay rendering the menu items until the button receives focus.
			// The menu may have already been rendered via a programmatic open.
			if ( !that.menuItems ) {
				that._refreshMenu();
			}
		});
		this._hoverable( this.button );
		this._focusable( this.button );
	},

	_drawMenu: function() {
		var that = this;

		// Create menu
		this.menu = $( "<ul>", {
			"aria-hidden": "true",
			"aria-labelledby": this.ids.button,
			id: this.ids.menu
		});

		// Wrap menu
		this.menuWrap = $( "<div>", {
			"class": "ui-selectmenu-menu ui-front"
		})
			.append( this.menu )
			.appendTo( this._appendTo() );

		// Initialize menu widget
		this.menuInstance = this.menu
			.menu({
				role: "listbox",
				select: function( event, ui ) {
					event.preventDefault();

					// support: IE8
					// If the item was selected via a click, the text selection
					// will be destroyed in IE
					that._setSelection();

					that._select( ui.item.data( "ui-selectmenu-item" ), event );
				},
				focus: function( event, ui ) {
					var item = ui.item.data( "ui-selectmenu-item" );

					// Prevent inital focus from firing and check if its a newly focused item
					if ( that.focusIndex != null && item.index !== that.focusIndex ) {
						that._trigger( "focus", event, { item: item } );
						if ( !that.isOpen ) {
							that._select( item, event );
						}
					}
					that.focusIndex = item.index;

					that.button.attr( "aria-activedescendant",
						that.menuItems.eq( item.index ).attr( "id" ) );
				}
			})
			.menu( "instance" );

		// Adjust menu styles to dropdown
		this.menu
			.addClass( "ui-corner-bottom" )
			.removeClass( "ui-corner-all" );

		// Don't close the menu on mouseleave
		this.menuInstance._off( this.menu, "mouseleave" );

		// Cancel the menu's collapseAll on document click
		this.menuInstance._closeOnDocumentClick = function() {
			return false;
		};

		// Selects often contain empty items, but never contain dividers
		this.menuInstance._isDivider = function() {
			return false;
		};
	},

	refresh: function() {
		this._refreshMenu();
		this._setText( this.buttonText, this._getSelectedItem().text() );
		if ( !this.options.width ) {
			this._resizeButton();
		}
	},

	_refreshMenu: function() {
		this.menu.empty();

		var item,
			options = this.element.find( "option" );

		if ( !options.length ) {
			return;
		}

		this._parseOptions( options );
		this._renderMenu( this.menu, this.items );

		this.menuInstance.refresh();
		this.menuItems = this.menu.find( "li" ).not( ".ui-selectmenu-optgroup" );

		item = this._getSelectedItem();

		// Update the menu to have the correct item focused
		this.menuInstance.focus( null, item );
		this._setAria( item.data( "ui-selectmenu-item" ) );

		// Set disabled state
		this._setOption( "disabled", this.element.prop( "disabled" ) );
	},

	open: function( event ) {
		if ( this.options.disabled ) {
			return;
		}

		// If this is the first time the menu is being opened, render the items
		if ( !this.menuItems ) {
			this._refreshMenu();
		} else {

			// Menu clears focus on close, reset focus to selected item
			this.menu.find( ".ui-state-focus" ).removeClass( "ui-state-focus" );
			this.menuInstance.focus( null, this._getSelectedItem() );
		}

		this.isOpen = true;
		this._toggleAttr();
		this._resizeMenu();
		this._position();

		this._on( this.document, this._documentClick );

		this._trigger( "open", event );
	},

	_position: function() {
		this.menuWrap.position( $.extend( { of: this.button }, this.options.position ) );
	},

	close: function( event ) {
		if ( !this.isOpen ) {
			return;
		}

		this.isOpen = false;
		this._toggleAttr();

		this.range = null;
		this._off( this.document );

		this._trigger( "close", event );
	},

	widget: function() {
		return this.button;
	},

	menuWidget: function() {
		return this.menu;
	},

	_renderMenu: function( ul, items ) {
		var that = this,
			currentOptgroup = "";

		$.each( items, function( index, item ) {
			if ( item.optgroup !== currentOptgroup ) {
				$( "<li>", {
					"class": "ui-selectmenu-optgroup ui-menu-divider" +
						( item.element.parent( "optgroup" ).prop( "disabled" ) ?
							" ui-state-disabled" :
							"" ),
					text: item.optgroup
				})
					.appendTo( ul );

				currentOptgroup = item.optgroup;
			}

			that._renderItemData( ul, item );
		});
	},

	_renderItemData: function( ul, item ) {
		return this._renderItem( ul, item ).data( "ui-selectmenu-item", item );
	},

	_renderItem: function( ul, item ) {
		var li = $( "<li>" );

		if ( item.disabled ) {
			li.addClass( "ui-state-disabled" );
		}
		this._setText( li, item.label );

		return li.appendTo( ul );
	},

	_setText: function( element, value ) {
		if ( value ) {
			element.text( value );
		} else {
			element.html( "&#160;" );
		}
	},

	_move: function( direction, event ) {
		var item, next,
			filter = ".ui-menu-item";

		if ( this.isOpen ) {
			item = this.menuItems.eq( this.focusIndex );
		} else {
			item = this.menuItems.eq( this.element[ 0 ].selectedIndex );
			filter += ":not(.ui-state-disabled)";
		}

		if ( direction === "first" || direction === "last" ) {
			next = item[ direction === "first" ? "prevAll" : "nextAll" ]( filter ).eq( -1 );
		} else {
			next = item[ direction + "All" ]( filter ).eq( 0 );
		}

		if ( next.length ) {
			this.menuInstance.focus( event, next );
		}
	},

	_getSelectedItem: function() {
		return this.menuItems.eq( this.element[ 0 ].selectedIndex );
	},

	_toggle: function( event ) {
		this[ this.isOpen ? "close" : "open" ]( event );
	},

	_setSelection: function() {
		var selection;

		if ( !this.range ) {
			return;
		}

		if ( window.getSelection ) {
			selection = window.getSelection();
			selection.removeAllRanges();
			selection.addRange( this.range );

		// support: IE8
		} else {
			this.range.select();
		}

		// support: IE
		// Setting the text selection kills the button focus in IE, but
		// restoring the focus doesn't kill the selection.
		this.button.focus();
	},

	_documentClick: {
		mousedown: function( event ) {
			if ( !this.isOpen ) {
				return;
			}

			if ( !$( event.target ).closest( ".ui-selectmenu-menu, #" + this.ids.button ).length ) {
				this.close( event );
			}
		}
	},

	_buttonEvents: {

		// Prevent text selection from being reset when interacting with the selectmenu (#10144)
		mousedown: function() {
			var selection;

			if ( window.getSelection ) {
				selection = window.getSelection();
				if ( selection.rangeCount ) {
					this.range = selection.getRangeAt( 0 );
				}

			// support: IE8
			} else {
				this.range = document.selection.createRange();
			}
		},

		click: function( event ) {
			this._setSelection();
			this._toggle( event );
		},

		keydown: function( event ) {
			var preventDefault = true;
			switch ( event.keyCode ) {
				case $.ui.keyCode.TAB:
				case $.ui.keyCode.ESCAPE:
					this.close( event );
					preventDefault = false;
					break;
				case $.ui.keyCode.ENTER:
					if ( this.isOpen ) {
						this._selectFocusedItem( event );
					}
					break;
				case $.ui.keyCode.UP:
					if ( event.altKey ) {
						this._toggle( event );
					} else {
						this._move( "prev", event );
					}
					break;
				case $.ui.keyCode.DOWN:
					if ( event.altKey ) {
						this._toggle( event );
					} else {
						this._move( "next", event );
					}
					break;
				case $.ui.keyCode.SPACE:
					if ( this.isOpen ) {
						this._selectFocusedItem( event );
					} else {
						this._toggle( event );
					}
					break;
				case $.ui.keyCode.LEFT:
					this._move( "prev", event );
					break;
				case $.ui.keyCode.RIGHT:
					this._move( "next", event );
					break;
				case $.ui.keyCode.HOME:
				case $.ui.keyCode.PAGE_UP:
					this._move( "first", event );
					break;
				case $.ui.keyCode.END:
				case $.ui.keyCode.PAGE_DOWN:
					this._move( "last", event );
					break;
				default:
					this.menu.trigger( event );
					preventDefault = false;
			}

			if ( preventDefault ) {
				event.preventDefault();
			}
		}
	},

	_selectFocusedItem: function( event ) {
		var item = this.menuItems.eq( this.focusIndex );
		if ( !item.hasClass( "ui-state-disabled" ) ) {
			this._select( item.data( "ui-selectmenu-item" ), event );
		}
	},

	_select: function( item, event ) {
		var oldIndex = this.element[ 0 ].selectedIndex;

		// Change native select element
		this.element[ 0 ].selectedIndex = item.index;
		this._setText( this.buttonText, item.label );
		this._setAria( item );
		this._trigger( "select", event, { item: item } );

		if ( item.index !== oldIndex ) {
			this._trigger( "change", event, { item: item } );
		}

		this.close( event );
	},

	_setAria: function( item ) {
		var id = this.menuItems.eq( item.index ).attr( "id" );

		this.button.attr({
			"aria-labelledby": id,
			"aria-activedescendant": id
		});
		this.menu.attr( "aria-activedescendant", id );
	},

	_setOption: function( key, value ) {
		if ( key === "icons" ) {
			this.button.find( "span.ui-icon" )
				.removeClass( this.options.icons.button )
				.addClass( value.button );
		}

		this._super( key, value );

		if ( key === "appendTo" ) {
			this.menuWrap.appendTo( this._appendTo() );
		}

		if ( key === "disabled" ) {
			this.menuInstance.option( "disabled", value );
			this.button
				.toggleClass( "ui-state-disabled", value )
				.attr( "aria-disabled", value );

			this.element.prop( "disabled", value );
			if ( value ) {
				this.button.attr( "tabindex", -1 );
				this.close();
			} else {
				this.button.attr( "tabindex", 0 );
			}
		}

		if ( key === "width" ) {
			this._resizeButton();
		}
	},

	_appendTo: function() {
		var element = this.options.appendTo;

		if ( element ) {
			element = element.jquery || element.nodeType ?
				$( element ) :
				this.document.find( element ).eq( 0 );
		}

		if ( !element || !element[ 0 ] ) {
			element = this.element.closest( ".ui-front" );
		}

		if ( !element.length ) {
			element = this.document[ 0 ].body;
		}

		return element;
	},

	_toggleAttr: function() {
		this.button
			.toggleClass( "ui-corner-top", this.isOpen )
			.toggleClass( "ui-corner-all", !this.isOpen )
			.attr( "aria-expanded", this.isOpen );
		this.menuWrap.toggleClass( "ui-selectmenu-open", this.isOpen );
		this.menu.attr( "aria-hidden", !this.isOpen );
	},

	_resizeButton: function() {
		var width = this.options.width;

		if ( !width ) {
			width = this.element.show().outerWidth();
			this.element.hide();
		}

		this.button.outerWidth( width );
	},

	_resizeMenu: function() {
		this.menu.outerWidth( Math.max(
			this.button.outerWidth(),

			// support: IE10
			// IE10 wraps long text (possibly a rounding bug)
			// so we add 1px to avoid the wrapping
			this.menu.width( "" ).outerWidth() + 1
		) );
	},

	_getCreateOptions: function() {
		return { disabled: this.element.prop( "disabled" ) };
	},

	_parseOptions: function( options ) {
		var data = [];
		options.each(function( index, item ) {
			var option = $( item ),
				optgroup = option.parent( "optgroup" );
			data.push({
				element: option,
				index: index,
				value: option.val(),
				label: option.text(),
				optgroup: optgroup.attr( "label" ) || "",
				disabled: optgroup.prop( "disabled" ) || option.prop( "disabled" )
			});
		});
		this.items = data;
	},

	_destroy: function() {
		this.menuWrap.remove();
		this.button.remove();
		this.element.show();
		this.element.removeUniqueId();
		this.label.attr( "for", this.ids.element );
	}
});


/*
 * jQuery UI Slider 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/slider/
 */


var slider = $.widget( "ui.slider", $.ui.mouse, {
	version: "1.11.4",
	widgetEventPrefix: "slide",

	options: {
		animate: false,
		distance: 0,
		max: 100,
		min: 0,
		orientation: "horizontal",
		range: false,
		step: 1,
		value: 0,
		values: null,

		// callbacks
		change: null,
		slide: null,
		start: null,
		stop: null
	},

	// number of pages in a slider
	// (how many times can you page up/down to go through the whole range)
	numPages: 5,

	_create: function() {
		this._keySliding = false;
		this._mouseSliding = false;
		this._animateOff = true;
		this._handleIndex = null;
		this._detectOrientation();
		this._mouseInit();
		this._calculateNewMax();

		this.element
			.addClass( "ui-slider" +
				" ui-slider-" + this.orientation +
				" ui-widget" +
				" ui-widget-content" +
				" ui-corner-all");

		this._refresh();
		this._setOption( "disabled", this.options.disabled );

		this._animateOff = false;
	},

	_refresh: function() {
		this._createRange();
		this._createHandles();
		this._setupEvents();
		this._refreshValue();
	},

	_createHandles: function() {
		var i, handleCount,
			options = this.options,
			existingHandles = this.element.find( ".ui-slider-handle" ).addClass( "ui-state-default ui-corner-all" ),
			handle = "<span class='ui-slider-handle ui-state-default ui-corner-all' tabindex='0'></span>",
			handles = [];

		handleCount = ( options.values && options.values.length ) || 1;

		if ( existingHandles.length > handleCount ) {
			existingHandles.slice( handleCount ).remove();
			existingHandles = existingHandles.slice( 0, handleCount );
		}

		for ( i = existingHandles.length; i < handleCount; i++ ) {
			handles.push( handle );
		}

		this.handles = existingHandles.add( $( handles.join( "" ) ).appendTo( this.element ) );

		this.handle = this.handles.eq( 0 );

		this.handles.each(function( i ) {
			$( this ).data( "ui-slider-handle-index", i );
		});
	},

	_createRange: function() {
		var options = this.options,
			classes = "";

		if ( options.range ) {
			if ( options.range === true ) {
				if ( !options.values ) {
					options.values = [ this._valueMin(), this._valueMin() ];
				} else if ( options.values.length && options.values.length !== 2 ) {
					options.values = [ options.values[0], options.values[0] ];
				} else if ( $.isArray( options.values ) ) {
					options.values = options.values.slice(0);
				}
			}

			if ( !this.range || !this.range.length ) {
				this.range = $( "<div></div>" )
					.appendTo( this.element );

				classes = "ui-slider-range" +
				// note: this isn't the most fittingly semantic framework class for this element,
				// but worked best visually with a variety of themes
				" ui-widget-header ui-corner-all";
			} else {
				this.range.removeClass( "ui-slider-range-min ui-slider-range-max" )
					// Handle range switching from true to min/max
					.css({
						"left": "",
						"bottom": ""
					});
			}

			this.range.addClass( classes +
				( ( options.range === "min" || options.range === "max" ) ? " ui-slider-range-" + options.range : "" ) );
		} else {
			if ( this.range ) {
				this.range.remove();
			}
			this.range = null;
		}
	},

	_setupEvents: function() {
		this._off( this.handles );
		this._on( this.handles, this._handleEvents );
		this._hoverable( this.handles );
		this._focusable( this.handles );
	},

	_destroy: function() {
		this.handles.remove();
		if ( this.range ) {
			this.range.remove();
		}

		this.element
			.removeClass( "ui-slider" +
				" ui-slider-horizontal" +
				" ui-slider-vertical" +
				" ui-widget" +
				" ui-widget-content" +
				" ui-corner-all" );

		this._mouseDestroy();
	},

	_mouseCapture: function( event ) {
		var position, normValue, distance, closestHandle, index, allowed, offset, mouseOverHandle,
			that = this,
			o = this.options;

		if ( o.disabled ) {
			return false;
		}

		this.elementSize = {
			width: this.element.outerWidth(),
			height: this.element.outerHeight()
		};
		this.elementOffset = this.element.offset();

		position = { x: event.pageX, y: event.pageY };
		normValue = this._normValueFromMouse( position );
		distance = this._valueMax() - this._valueMin() + 1;
		this.handles.each(function( i ) {
			var thisDistance = Math.abs( normValue - that.values(i) );
			if (( distance > thisDistance ) ||
				( distance === thisDistance &&
					(i === that._lastChangedValue || that.values(i) === o.min ))) {
				distance = thisDistance;
				closestHandle = $( this );
				index = i;
			}
		});

		allowed = this._start( event, index );
		if ( allowed === false ) {
			return false;
		}
		this._mouseSliding = true;

		this._handleIndex = index;

		closestHandle
			.addClass( "ui-state-active" )
			.focus();

		offset = closestHandle.offset();
		mouseOverHandle = !$( event.target ).parents().addBack().is( ".ui-slider-handle" );
		this._clickOffset = mouseOverHandle ? { left: 0, top: 0 } : {
			left: event.pageX - offset.left - ( closestHandle.width() / 2 ),
			top: event.pageY - offset.top -
				( closestHandle.height() / 2 ) -
				( parseInt( closestHandle.css("borderTopWidth"), 10 ) || 0 ) -
				( parseInt( closestHandle.css("borderBottomWidth"), 10 ) || 0) +
				( parseInt( closestHandle.css("marginTop"), 10 ) || 0)
		};

		if ( !this.handles.hasClass( "ui-state-hover" ) ) {
			this._slide( event, index, normValue );
		}
		this._animateOff = true;
		return true;
	},

	_mouseStart: function() {
		return true;
	},

	_mouseDrag: function( event ) {
		var position = { x: event.pageX, y: event.pageY },
			normValue = this._normValueFromMouse( position );

		this._slide( event, this._handleIndex, normValue );

		return false;
	},

	_mouseStop: function( event ) {
		this.handles.removeClass( "ui-state-active" );
		this._mouseSliding = false;

		this._stop( event, this._handleIndex );
		this._change( event, this._handleIndex );

		this._handleIndex = null;
		this._clickOffset = null;
		this._animateOff = false;

		return false;
	},

	_detectOrientation: function() {
		this.orientation = ( this.options.orientation === "vertical" ) ? "vertical" : "horizontal";
	},

	_normValueFromMouse: function( position ) {
		var pixelTotal,
			pixelMouse,
			percentMouse,
			valueTotal,
			valueMouse;

		if ( this.orientation === "horizontal" ) {
			pixelTotal = this.elementSize.width;
			pixelMouse = position.x - this.elementOffset.left - ( this._clickOffset ? this._clickOffset.left : 0 );
		} else {
			pixelTotal = this.elementSize.height;
			pixelMouse = position.y - this.elementOffset.top - ( this._clickOffset ? this._clickOffset.top : 0 );
		}

		percentMouse = ( pixelMouse / pixelTotal );
		if ( percentMouse > 1 ) {
			percentMouse = 1;
		}
		if ( percentMouse < 0 ) {
			percentMouse = 0;
		}
		if ( this.orientation === "vertical" ) {
			percentMouse = 1 - percentMouse;
		}

		valueTotal = this._valueMax() - this._valueMin();
		valueMouse = this._valueMin() + percentMouse * valueTotal;

		return this._trimAlignValue( valueMouse );
	},

	_start: function( event, index ) {
		var uiHash = {
			handle: this.handles[ index ],
			value: this.value()
		};
		if ( this.options.values && this.options.values.length ) {
			uiHash.value = this.values( index );
			uiHash.values = this.values();
		}
		return this._trigger( "start", event, uiHash );
	},

	_slide: function( event, index, newVal ) {
		var otherVal,
			newValues,
			allowed;

		if ( this.options.values && this.options.values.length ) {
			otherVal = this.values( index ? 0 : 1 );

			if ( ( this.options.values.length === 2 && this.options.range === true ) &&
					( ( index === 0 && newVal > otherVal) || ( index === 1 && newVal < otherVal ) )
				) {
				newVal = otherVal;
			}

			if ( newVal !== this.values( index ) ) {
				newValues = this.values();
				newValues[ index ] = newVal;
				// A slide can be canceled by returning false from the slide callback
				allowed = this._trigger( "slide", event, {
					handle: this.handles[ index ],
					value: newVal,
					values: newValues
				} );
				otherVal = this.values( index ? 0 : 1 );
				if ( allowed !== false ) {
					this.values( index, newVal );
				}
			}
		} else {
			if ( newVal !== this.value() ) {
				// A slide can be canceled by returning false from the slide callback
				allowed = this._trigger( "slide", event, {
					handle: this.handles[ index ],
					value: newVal
				} );
				if ( allowed !== false ) {
					this.value( newVal );
				}
			}
		}
	},

	_stop: function( event, index ) {
		var uiHash = {
			handle: this.handles[ index ],
			value: this.value()
		};
		if ( this.options.values && this.options.values.length ) {
			uiHash.value = this.values( index );
			uiHash.values = this.values();
		}

		this._trigger( "stop", event, uiHash );
	},

	_change: function( event, index ) {
		if ( !this._keySliding && !this._mouseSliding ) {
			var uiHash = {
				handle: this.handles[ index ],
				value: this.value()
			};
			if ( this.options.values && this.options.values.length ) {
				uiHash.value = this.values( index );
				uiHash.values = this.values();
			}

			//store the last changed value index for reference when handles overlap
			this._lastChangedValue = index;

			this._trigger( "change", event, uiHash );
		}
	},

	value: function( newValue ) {
		if ( arguments.length ) {
			this.options.value = this._trimAlignValue( newValue );
			this._refreshValue();
			this._change( null, 0 );
			return;
		}

		return this._value();
	},

	values: function( index, newValue ) {
		var vals,
			newValues,
			i;

		if ( arguments.length > 1 ) {
			this.options.values[ index ] = this._trimAlignValue( newValue );
			this._refreshValue();
			this._change( null, index );
			return;
		}

		if ( arguments.length ) {
			if ( $.isArray( arguments[ 0 ] ) ) {
				vals = this.options.values;
				newValues = arguments[ 0 ];
				for ( i = 0; i < vals.length; i += 1 ) {
					vals[ i ] = this._trimAlignValue( newValues[ i ] );
					this._change( null, i );
				}
				this._refreshValue();
			} else {
				if ( this.options.values && this.options.values.length ) {
					return this._values( index );
				} else {
					return this.value();
				}
			}
		} else {
			return this._values();
		}
	},

	_setOption: function( key, value ) {
		var i,
			valsLength = 0;

		if ( key === "range" && this.options.range === true ) {
			if ( value === "min" ) {
				this.options.value = this._values( 0 );
				this.options.values = null;
			} else if ( value === "max" ) {
				this.options.value = this._values( this.options.values.length - 1 );
				this.options.values = null;
			}
		}

		if ( $.isArray( this.options.values ) ) {
			valsLength = this.options.values.length;
		}

		if ( key === "disabled" ) {
			this.element.toggleClass( "ui-state-disabled", !!value );
		}

		this._super( key, value );

		switch ( key ) {
			case "orientation":
				this._detectOrientation();
				this.element
					.removeClass( "ui-slider-horizontal ui-slider-vertical" )
					.addClass( "ui-slider-" + this.orientation );
				this._refreshValue();

				// Reset positioning from previous orientation
				this.handles.css( value === "horizontal" ? "bottom" : "left", "" );
				break;
			case "value":
				this._animateOff = true;
				this._refreshValue();
				this._change( null, 0 );
				this._animateOff = false;
				break;
			case "values":
				this._animateOff = true;
				this._refreshValue();
				for ( i = 0; i < valsLength; i += 1 ) {
					this._change( null, i );
				}
				this._animateOff = false;
				break;
			case "step":
			case "min":
			case "max":
				this._animateOff = true;
				this._calculateNewMax();
				this._refreshValue();
				this._animateOff = false;
				break;
			case "range":
				this._animateOff = true;
				this._refresh();
				this._animateOff = false;
				break;
		}
	},

	//internal value getter
	// _value() returns value trimmed by min and max, aligned by step
	_value: function() {
		var val = this.options.value;
		val = this._trimAlignValue( val );

		return val;
	},

	//internal values getter
	// _values() returns array of values trimmed by min and max, aligned by step
	// _values( index ) returns single value trimmed by min and max, aligned by step
	_values: function( index ) {
		var val,
			vals,
			i;

		if ( arguments.length ) {
			val = this.options.values[ index ];
			val = this._trimAlignValue( val );

			return val;
		} else if ( this.options.values && this.options.values.length ) {
			// .slice() creates a copy of the array
			// this copy gets trimmed by min and max and then returned
			vals = this.options.values.slice();
			for ( i = 0; i < vals.length; i += 1) {
				vals[ i ] = this._trimAlignValue( vals[ i ] );
			}

			return vals;
		} else {
			return [];
		}
	},

	// returns the step-aligned value that val is closest to, between (inclusive) min and max
	_trimAlignValue: function( val ) {
		if ( val <= this._valueMin() ) {
			return this._valueMin();
		}
		if ( val >= this._valueMax() ) {
			return this._valueMax();
		}
		var step = ( this.options.step > 0 ) ? this.options.step : 1,
			valModStep = (val - this._valueMin()) % step,
			alignValue = val - valModStep;

		if ( Math.abs(valModStep) * 2 >= step ) {
			alignValue += ( valModStep > 0 ) ? step : ( -step );
		}

		// Since JavaScript has problems with large floats, round
		// the final value to 5 digits after the decimal point (see #4124)
		return parseFloat( alignValue.toFixed(5) );
	},

	_calculateNewMax: function() {
		var max = this.options.max,
			min = this._valueMin(),
			step = this.options.step,
			aboveMin = Math.floor( ( +( max - min ).toFixed( this._precision() ) ) / step ) * step;
		max = aboveMin + min;
		this.max = parseFloat( max.toFixed( this._precision() ) );
	},

	_precision: function() {
		var precision = this._precisionOf( this.options.step );
		if ( this.options.min !== null ) {
			precision = Math.max( precision, this._precisionOf( this.options.min ) );
		}
		return precision;
	},

	_precisionOf: function( num ) {
		var str = num.toString(),
			decimal = str.indexOf( "." );
		return decimal === -1 ? 0 : str.length - decimal - 1;
	},

	_valueMin: function() {
		return this.options.min;
	},

	_valueMax: function() {
		return this.max;
	},

	_refreshValue: function() {
		var lastValPercent, valPercent, value, valueMin, valueMax,
			oRange = this.options.range,
			o = this.options,
			that = this,
			animate = ( !this._animateOff ) ? o.animate : false,
			_set = {};

		if ( this.options.values && this.options.values.length ) {
			this.handles.each(function( i ) {
				valPercent = ( that.values(i) - that._valueMin() ) / ( that._valueMax() - that._valueMin() ) * 100;
				_set[ that.orientation === "horizontal" ? "left" : "bottom" ] = valPercent + "%";
				$( this ).stop( 1, 1 )[ animate ? "animate" : "css" ]( _set, o.animate );
				if ( that.options.range === true ) {
					if ( that.orientation === "horizontal" ) {
						if ( i === 0 ) {
							that.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( { left: valPercent + "%" }, o.animate );
						}
						if ( i === 1 ) {
							that.range[ animate ? "animate" : "css" ]( { width: ( valPercent - lastValPercent ) + "%" }, { queue: false, duration: o.animate } );
						}
					} else {
						if ( i === 0 ) {
							that.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( { bottom: ( valPercent ) + "%" }, o.animate );
						}
						if ( i === 1 ) {
							that.range[ animate ? "animate" : "css" ]( { height: ( valPercent - lastValPercent ) + "%" }, { queue: false, duration: o.animate } );
						}
					}
				}
				lastValPercent = valPercent;
			});
		} else {
			value = this.value();
			valueMin = this._valueMin();
			valueMax = this._valueMax();
			valPercent = ( valueMax !== valueMin ) ?
					( value - valueMin ) / ( valueMax - valueMin ) * 100 :
					0;
			_set[ this.orientation === "horizontal" ? "left" : "bottom" ] = valPercent + "%";
			this.handle.stop( 1, 1 )[ animate ? "animate" : "css" ]( _set, o.animate );

			if ( oRange === "min" && this.orientation === "horizontal" ) {
				this.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( { width: valPercent + "%" }, o.animate );
			}
			if ( oRange === "max" && this.orientation === "horizontal" ) {
				this.range[ animate ? "animate" : "css" ]( { width: ( 100 - valPercent ) + "%" }, { queue: false, duration: o.animate } );
			}
			if ( oRange === "min" && this.orientation === "vertical" ) {
				this.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( { height: valPercent + "%" }, o.animate );
			}
			if ( oRange === "max" && this.orientation === "vertical" ) {
				this.range[ animate ? "animate" : "css" ]( { height: ( 100 - valPercent ) + "%" }, { queue: false, duration: o.animate } );
			}
		}
	},

	_handleEvents: {
		keydown: function( event ) {
			var allowed, curVal, newVal, step,
				index = $( event.target ).data( "ui-slider-handle-index" );

			switch ( event.keyCode ) {
				case $.ui.keyCode.HOME:
				case $.ui.keyCode.END:
				case $.ui.keyCode.PAGE_UP:
				case $.ui.keyCode.PAGE_DOWN:
				case $.ui.keyCode.UP:
				case $.ui.keyCode.RIGHT:
				case $.ui.keyCode.DOWN:
				case $.ui.keyCode.LEFT:
					event.preventDefault();
					if ( !this._keySliding ) {
						this._keySliding = true;
						$( event.target ).addClass( "ui-state-active" );
						allowed = this._start( event, index );
						if ( allowed === false ) {
							return;
						}
					}
					break;
			}

			step = this.options.step;
			if ( this.options.values && this.options.values.length ) {
				curVal = newVal = this.values( index );
			} else {
				curVal = newVal = this.value();
			}

			switch ( event.keyCode ) {
				case $.ui.keyCode.HOME:
					newVal = this._valueMin();
					break;
				case $.ui.keyCode.END:
					newVal = this._valueMax();
					break;
				case $.ui.keyCode.PAGE_UP:
					newVal = this._trimAlignValue(
						curVal + ( ( this._valueMax() - this._valueMin() ) / this.numPages )
					);
					break;
				case $.ui.keyCode.PAGE_DOWN:
					newVal = this._trimAlignValue(
						curVal - ( (this._valueMax() - this._valueMin()) / this.numPages ) );
					break;
				case $.ui.keyCode.UP:
				case $.ui.keyCode.RIGHT:
					if ( curVal === this._valueMax() ) {
						return;
					}
					newVal = this._trimAlignValue( curVal + step );
					break;
				case $.ui.keyCode.DOWN:
				case $.ui.keyCode.LEFT:
					if ( curVal === this._valueMin() ) {
						return;
					}
					newVal = this._trimAlignValue( curVal - step );
					break;
			}

			this._slide( event, index, newVal );
		},
		keyup: function( event ) {
			var index = $( event.target ).data( "ui-slider-handle-index" );

			if ( this._keySliding ) {
				this._keySliding = false;
				this._stop( event, index );
				this._change( event, index );
				$( event.target ).removeClass( "ui-state-active" );
			}
		}
	}
});


/*
 * jQuery UI Spinner 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/spinner/
 */


function spinner_modifier( fn ) {
	return function() {
		var previous = this.element.val();
		fn.apply( this, arguments );
		this._refresh();
		if ( previous !== this.element.val() ) {
			this._trigger( "change" );
		}
	};
}

var spinner = $.widget( "ui.spinner", {
	version: "1.11.4",
	defaultElement: "<input>",
	widgetEventPrefix: "spin",
	options: {
		culture: null,
		icons: {
			down: "ui-icon-triangle-1-s",
			up: "ui-icon-triangle-1-n"
		},
		incremental: true,
		max: null,
		min: null,
		numberFormat: null,
		page: 10,
		step: 1,

		change: null,
		spin: null,
		start: null,
		stop: null
	},

	_create: function() {
		// handle string values that need to be parsed
		this._setOption( "max", this.options.max );
		this._setOption( "min", this.options.min );
		this._setOption( "step", this.options.step );

		// Only format if there is a value, prevents the field from being marked
		// as invalid in Firefox, see #9573.
		if ( this.value() !== "" ) {
			// Format the value, but don't constrain.
			this._value( this.element.val(), true );
		}

		this._draw();
		this._on( this._events );
		this._refresh();

		// turning off autocomplete prevents the browser from remembering the
		// value when navigating through history, so we re-enable autocomplete
		// if the page is unloaded before the widget is destroyed. #7790
		this._on( this.window, {
			beforeunload: function() {
				this.element.removeAttr( "autocomplete" );
			}
		});
	},

	_getCreateOptions: function() {
		var options = {},
			element = this.element;

		$.each( [ "min", "max", "step" ], function( i, option ) {
			var value = element.attr( option );
			if ( value !== undefined && value.length ) {
				options[ option ] = value;
			}
		});

		return options;
	},

	_events: {
		keydown: function( event ) {
			if ( this._start( event ) && this._keydown( event ) ) {
				event.preventDefault();
			}
		},
		keyup: "_stop",
		focus: function() {
			this.previous = this.element.val();
		},
		blur: function( event ) {
			if ( this.cancelBlur ) {
				delete this.cancelBlur;
				return;
			}

			this._stop();
			this._refresh();
			if ( this.previous !== this.element.val() ) {
				this._trigger( "change", event );
			}
		},
		mousewheel: function( event, delta ) {
			if ( !delta ) {
				return;
			}
			if ( !this.spinning && !this._start( event ) ) {
				return false;
			}

			this._spin( (delta > 0 ? 1 : -1) * this.options.step, event );
			clearTimeout( this.mousewheelTimer );
			this.mousewheelTimer = this._delay(function() {
				if ( this.spinning ) {
					this._stop( event );
				}
			}, 100 );
			event.preventDefault();
		},
		"mousedown .ui-spinner-button": function( event ) {
			var previous;

			// We never want the buttons to have focus; whenever the user is
			// interacting with the spinner, the focus should be on the input.
			// If the input is focused then this.previous is properly set from
			// when the input first received focus. If the input is not focused
			// then we need to set this.previous based on the value before spinning.
			previous = this.element[0] === this.document[0].activeElement ?
				this.previous : this.element.val();
			function checkFocus() {
				var isActive = this.element[0] === this.document[0].activeElement;
				if ( !isActive ) {
					this.element.focus();
					this.previous = previous;
					// support: IE
					// IE sets focus asynchronously, so we need to check if focus
					// moved off of the input because the user clicked on the button.
					this._delay(function() {
						this.previous = previous;
					});
				}
			}

			// ensure focus is on (or stays on) the text field
			event.preventDefault();
			checkFocus.call( this );

			// support: IE
			// IE doesn't prevent moving focus even with event.preventDefault()
			// so we set a flag to know when we should ignore the blur event
			// and check (again) if focus moved off of the input.
			this.cancelBlur = true;
			this._delay(function() {
				delete this.cancelBlur;
				checkFocus.call( this );
			});

			if ( this._start( event ) === false ) {
				return;
			}

			this._repeat( null, $( event.currentTarget ).hasClass( "ui-spinner-up" ) ? 1 : -1, event );
		},
		"mouseup .ui-spinner-button": "_stop",
		"mouseenter .ui-spinner-button": function( event ) {
			// button will add ui-state-active if mouse was down while mouseleave and kept down
			if ( !$( event.currentTarget ).hasClass( "ui-state-active" ) ) {
				return;
			}

			if ( this._start( event ) === false ) {
				return false;
			}
			this._repeat( null, $( event.currentTarget ).hasClass( "ui-spinner-up" ) ? 1 : -1, event );
		},
		// TODO: do we really want to consider this a stop?
		// shouldn't we just stop the repeater and wait until mouseup before
		// we trigger the stop event?
		"mouseleave .ui-spinner-button": "_stop"
	},

	_draw: function() {
		var uiSpinner = this.uiSpinner = this.element
			.addClass( "ui-spinner-input" )
			.attr( "autocomplete", "off" )
			.wrap( this._uiSpinnerHtml() )
			.parent()
				// add buttons
				.append( this._buttonHtml() );

		this.element.attr( "role", "spinbutton" );

		// button bindings
		this.buttons = uiSpinner.find( ".ui-spinner-button" )
			.attr( "tabIndex", -1 )
			.button()
			.removeClass( "ui-corner-all" );

		// IE 6 doesn't understand height: 50% for the buttons
		// unless the wrapper has an explicit height
		if ( this.buttons.height() > Math.ceil( uiSpinner.height() * 0.5 ) &&
				uiSpinner.height() > 0 ) {
			uiSpinner.height( uiSpinner.height() );
		}

		// disable spinner if element was already disabled
		if ( this.options.disabled ) {
			this.disable();
		}
	},

	_keydown: function( event ) {
		var options = this.options,
			keyCode = $.ui.keyCode;

		switch ( event.keyCode ) {
		case keyCode.UP:
			this._repeat( null, 1, event );
			return true;
		case keyCode.DOWN:
			this._repeat( null, -1, event );
			return true;
		case keyCode.PAGE_UP:
			this._repeat( null, options.page, event );
			return true;
		case keyCode.PAGE_DOWN:
			this._repeat( null, -options.page, event );
			return true;
		}

		return false;
	},

	_uiSpinnerHtml: function() {
		return "<span class='ui-spinner ui-widget ui-widget-content ui-corner-all'></span>";
	},

	_buttonHtml: function() {
		return "" +
			"<a class='ui-spinner-button ui-spinner-up ui-corner-tr'>" +
				"<span class='ui-icon " + this.options.icons.up + "'>&#9650;</span>" +
			"</a>" +
			"<a class='ui-spinner-button ui-spinner-down ui-corner-br'>" +
				"<span class='ui-icon " + this.options.icons.down + "'>&#9660;</span>" +
			"</a>";
	},

	_start: function( event ) {
		if ( !this.spinning && this._trigger( "start", event ) === false ) {
			return false;
		}

		if ( !this.counter ) {
			this.counter = 1;
		}
		this.spinning = true;
		return true;
	},

	_repeat: function( i, steps, event ) {
		i = i || 500;

		clearTimeout( this.timer );
		this.timer = this._delay(function() {
			this._repeat( 40, steps, event );
		}, i );

		this._spin( steps * this.options.step, event );
	},

	_spin: function( step, event ) {
		var value = this.value() || 0;

		if ( !this.counter ) {
			this.counter = 1;
		}

		value = this._adjustValue( value + step * this._increment( this.counter ) );

		if ( !this.spinning || this._trigger( "spin", event, { value: value } ) !== false) {
			this._value( value );
			this.counter++;
		}
	},

	_increment: function( i ) {
		var incremental = this.options.incremental;

		if ( incremental ) {
			return $.isFunction( incremental ) ?
				incremental( i ) :
				Math.floor( i * i * i / 50000 - i * i / 500 + 17 * i / 200 + 1 );
		}

		return 1;
	},

	_precision: function() {
		var precision = this._precisionOf( this.options.step );
		if ( this.options.min !== null ) {
			precision = Math.max( precision, this._precisionOf( this.options.min ) );
		}
		return precision;
	},

	_precisionOf: function( num ) {
		var str = num.toString(),
			decimal = str.indexOf( "." );
		return decimal === -1 ? 0 : str.length - decimal - 1;
	},

	_adjustValue: function( value ) {
		var base, aboveMin,
			options = this.options;

		// make sure we're at a valid step
		// - find out where we are relative to the base (min or 0)
		base = options.min !== null ? options.min : 0;
		aboveMin = value - base;
		// - round to the nearest step
		aboveMin = Math.round(aboveMin / options.step) * options.step;
		// - rounding is based on 0, so adjust back to our base
		value = base + aboveMin;

		// fix precision from bad JS floating point math
		value = parseFloat( value.toFixed( this._precision() ) );

		// clamp the value
		if ( options.max !== null && value > options.max) {
			return options.max;
		}
		if ( options.min !== null && value < options.min ) {
			return options.min;
		}

		return value;
	},

	_stop: function( event ) {
		if ( !this.spinning ) {
			return;
		}

		clearTimeout( this.timer );
		clearTimeout( this.mousewheelTimer );
		this.counter = 0;
		this.spinning = false;
		this._trigger( "stop", event );
	},

	_setOption: function( key, value ) {
		if ( key === "culture" || key === "numberFormat" ) {
			var prevValue = this._parse( this.element.val() );
			this.options[ key ] = value;
			this.element.val( this._format( prevValue ) );
			return;
		}

		if ( key === "max" || key === "min" || key === "step" ) {
			if ( typeof value === "string" ) {
				value = this._parse( value );
			}
		}
		if ( key === "icons" ) {
			this.buttons.first().find( ".ui-icon" )
				.removeClass( this.options.icons.up )
				.addClass( value.up );
			this.buttons.last().find( ".ui-icon" )
				.removeClass( this.options.icons.down )
				.addClass( value.down );
		}

		this._super( key, value );

		if ( key === "disabled" ) {
			this.widget().toggleClass( "ui-state-disabled", !!value );
			this.element.prop( "disabled", !!value );
			this.buttons.button( value ? "disable" : "enable" );
		}
	},

	_setOptions: spinner_modifier(function( options ) {
		this._super( options );
	}),

	_parse: function( val ) {
		if ( typeof val === "string" && val !== "" ) {
			val = window.Globalize && this.options.numberFormat ?
				Globalize.parseFloat( val, 10, this.options.culture ) : +val;
		}
		return val === "" || isNaN( val ) ? null : val;
	},

	_format: function( value ) {
		if ( value === "" ) {
			return "";
		}
		return window.Globalize && this.options.numberFormat ?
			Globalize.format( value, this.options.numberFormat, this.options.culture ) :
			value;
	},

	_refresh: function() {
		this.element.attr({
			"aria-valuemin": this.options.min,
			"aria-valuemax": this.options.max,
			// TODO: what should we do with values that can't be parsed?
			"aria-valuenow": this._parse( this.element.val() )
		});
	},

	isValid: function() {
		var value = this.value();

		// null is invalid
		if ( value === null ) {
			return false;
		}

		// if value gets adjusted, it's invalid
		return value === this._adjustValue( value );
	},

	// update the value without triggering change
	_value: function( value, allowAny ) {
		var parsed;
		if ( value !== "" ) {
			parsed = this._parse( value );
			if ( parsed !== null ) {
				if ( !allowAny ) {
					parsed = this._adjustValue( parsed );
				}
				value = this._format( parsed );
			}
		}
		this.element.val( value );
		this._refresh();
	},

	_destroy: function() {
		this.element
			.removeClass( "ui-spinner-input" )
			.prop( "disabled", false )
			.removeAttr( "autocomplete" )
			.removeAttr( "role" )
			.removeAttr( "aria-valuemin" )
			.removeAttr( "aria-valuemax" )
			.removeAttr( "aria-valuenow" );
		this.uiSpinner.replaceWith( this.element );
	},

	stepUp: spinner_modifier(function( steps ) {
		this._stepUp( steps );
	}),
	_stepUp: function( steps ) {
		if ( this._start() ) {
			this._spin( (steps || 1) * this.options.step );
			this._stop();
		}
	},

	stepDown: spinner_modifier(function( steps ) {
		this._stepDown( steps );
	}),
	_stepDown: function( steps ) {
		if ( this._start() ) {
			this._spin( (steps || 1) * -this.options.step );
			this._stop();
		}
	},

	pageUp: spinner_modifier(function( pages ) {
		this._stepUp( (pages || 1) * this.options.page );
	}),

	pageDown: spinner_modifier(function( pages ) {
		this._stepDown( (pages || 1) * this.options.page );
	}),

	value: function( newVal ) {
		if ( !arguments.length ) {
			return this._parse( this.element.val() );
		}
		spinner_modifier( this._value ).call( this, newVal );
	},

	widget: function() {
		return this.uiSpinner;
	}
});


/*
 * jQuery UI Tabs 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/tabs/
 */


var tabs = $.widget( "ui.tabs", {
	version: "1.11.4",
	delay: 300,
	options: {
		active: null,
		collapsible: false,
		event: "click",
		heightStyle: "content",
		hide: null,
		show: null,

		// callbacks
		activate: null,
		beforeActivate: null,
		beforeLoad: null,
		load: null
	},

	_isLocal: (function() {
		var rhash = /#.*$/;

		return function( anchor ) {
			var anchorUrl, locationUrl;

			// support: IE7
			// IE7 doesn't normalize the href property when set via script (#9317)
			anchor = anchor.cloneNode( false );

			anchorUrl = anchor.href.replace( rhash, "" );
			locationUrl = location.href.replace( rhash, "" );

			// decoding may throw an error if the URL isn't UTF-8 (#9518)
			try {
				anchorUrl = decodeURIComponent( anchorUrl );
			} catch ( error ) {}
			try {
				locationUrl = decodeURIComponent( locationUrl );
			} catch ( error ) {}

			return anchor.hash.length > 1 && anchorUrl === locationUrl;
		};
	})(),

	_create: function() {
		var that = this,
			options = this.options;

		this.running = false;

		this.element
			.addClass( "ui-tabs ui-widget ui-widget-content ui-corner-all" )
			.toggleClass( "ui-tabs-collapsible", options.collapsible );

		this._processTabs();
		options.active = this._initialActive();

		// Take disabling tabs via class attribute from HTML
		// into account and update option properly.
		if ( $.isArray( options.disabled ) ) {
			options.disabled = $.unique( options.disabled.concat(
				$.map( this.tabs.filter( ".ui-state-disabled" ), function( li ) {
					return that.tabs.index( li );
				})
			) ).sort();
		}

		// check for length avoids error when initializing empty list
		if ( this.options.active !== false && this.anchors.length ) {
			this.active = this._findActive( options.active );
		} else {
			this.active = $();
		}

		this._refresh();

		if ( this.active.length ) {
			this.load( options.active );
		}
	},

	_initialActive: function() {
		var active = this.options.active,
			collapsible = this.options.collapsible,
			locationHash = location.hash.substring( 1 );

		if ( active === null ) {
			// check the fragment identifier in the URL
			if ( locationHash ) {
				this.tabs.each(function( i, tab ) {
					if ( $( tab ).attr( "aria-controls" ) === locationHash ) {
						active = i;
						return false;
					}
				});
			}

			// check for a tab marked active via a class
			if ( active === null ) {
				active = this.tabs.index( this.tabs.filter( ".ui-tabs-active" ) );
			}

			// no active tab, set to false
			if ( active === null || active === -1 ) {
				active = this.tabs.length ? 0 : false;
			}
		}

		// handle numbers: negative, out of range
		if ( active !== false ) {
			active = this.tabs.index( this.tabs.eq( active ) );
			if ( active === -1 ) {
				active = collapsible ? false : 0;
			}
		}

		// don't allow collapsible: false and active: false
		if ( !collapsible && active === false && this.anchors.length ) {
			active = 0;
		}

		return active;
	},

	_getCreateEventData: function() {
		return {
			tab: this.active,
			panel: !this.active.length ? $() : this._getPanelForTab( this.active )
		};
	},

	_tabKeydown: function( event ) {
		var focusedTab = $( this.document[0].activeElement ).closest( "li" ),
			selectedIndex = this.tabs.index( focusedTab ),
			goingForward = true;

		if ( this._handlePageNav( event ) ) {
			return;
		}

		switch ( event.keyCode ) {
			case $.ui.keyCode.RIGHT:
			case $.ui.keyCode.DOWN:
				selectedIndex++;
				break;
			case $.ui.keyCode.UP:
			case $.ui.keyCode.LEFT:
				goingForward = false;
				selectedIndex--;
				break;
			case $.ui.keyCode.END:
				selectedIndex = this.anchors.length - 1;
				break;
			case $.ui.keyCode.HOME:
				selectedIndex = 0;
				break;
			case $.ui.keyCode.SPACE:
				// Activate only, no collapsing
				event.preventDefault();
				clearTimeout( this.activating );
				this._activate( selectedIndex );
				return;
			case $.ui.keyCode.ENTER:
				// Toggle (cancel delayed activation, allow collapsing)
				event.preventDefault();
				clearTimeout( this.activating );
				// Determine if we should collapse or activate
				this._activate( selectedIndex === this.options.active ? false : selectedIndex );
				return;
			default:
				return;
		}

		// Focus the appropriate tab, based on which key was pressed
		event.preventDefault();
		clearTimeout( this.activating );
		selectedIndex = this._focusNextTab( selectedIndex, goingForward );

		// Navigating with control/command key will prevent automatic activation
		if ( !event.ctrlKey && !event.metaKey ) {

			// Update aria-selected immediately so that AT think the tab is already selected.
			// Otherwise AT may confuse the user by stating that they need to activate the tab,
			// but the tab will already be activated by the time the announcement finishes.
			focusedTab.attr( "aria-selected", "false" );
			this.tabs.eq( selectedIndex ).attr( "aria-selected", "true" );

			this.activating = this._delay(function() {
				this.option( "active", selectedIndex );
			}, this.delay );
		}
	},

	_panelKeydown: function( event ) {
		if ( this._handlePageNav( event ) ) {
			return;
		}

		// Ctrl+up moves focus to the current tab
		if ( event.ctrlKey && event.keyCode === $.ui.keyCode.UP ) {
			event.preventDefault();
			this.active.focus();
		}
	},

	// Alt+page up/down moves focus to the previous/next tab (and activates)
	_handlePageNav: function( event ) {
		if ( event.altKey && event.keyCode === $.ui.keyCode.PAGE_UP ) {
			this._activate( this._focusNextTab( this.options.active - 1, false ) );
			return true;
		}
		if ( event.altKey && event.keyCode === $.ui.keyCode.PAGE_DOWN ) {
			this._activate( this._focusNextTab( this.options.active + 1, true ) );
			return true;
		}
	},

	_findNextTab: function( index, goingForward ) {
		var lastTabIndex = this.tabs.length - 1;

		function constrain() {
			if ( index > lastTabIndex ) {
				index = 0;
			}
			if ( index < 0 ) {
				index = lastTabIndex;
			}
			return index;
		}

		while ( $.inArray( constrain(), this.options.disabled ) !== -1 ) {
			index = goingForward ? index + 1 : index - 1;
		}

		return index;
	},

	_focusNextTab: function( index, goingForward ) {
		index = this._findNextTab( index, goingForward );
		this.tabs.eq( index ).focus();
		return index;
	},

	_setOption: function( key, value ) {
		if ( key === "active" ) {
			// _activate() will handle invalid values and update this.options
			this._activate( value );
			return;
		}

		if ( key === "disabled" ) {
			// don't use the widget factory's disabled handling
			this._setupDisabled( value );
			return;
		}

		this._super( key, value);

		if ( key === "collapsible" ) {
			this.element.toggleClass( "ui-tabs-collapsible", value );
			// Setting collapsible: false while collapsed; open first panel
			if ( !value && this.options.active === false ) {
				this._activate( 0 );
			}
		}

		if ( key === "event" ) {
			this._setupEvents( value );
		}

		if ( key === "heightStyle" ) {
			this._setupHeightStyle( value );
		}
	},

	_sanitizeSelector: function( hash ) {
		return hash ? hash.replace( /[!"$%&'()*+,.\/:;<=>?@\[\]\^`{|}~]/g, "\\$&" ) : "";
	},

	refresh: function() {
		var options = this.options,
			lis = this.tablist.children( ":has(a[href])" );

		// get disabled tabs from class attribute from HTML
		// this will get converted to a boolean if needed in _refresh()
		options.disabled = $.map( lis.filter( ".ui-state-disabled" ), function( tab ) {
			return lis.index( tab );
		});

		this._processTabs();

		// was collapsed or no tabs
		if ( options.active === false || !this.anchors.length ) {
			options.active = false;
			this.active = $();
		// was active, but active tab is gone
		} else if ( this.active.length && !$.contains( this.tablist[ 0 ], this.active[ 0 ] ) ) {
			// all remaining tabs are disabled
			if ( this.tabs.length === options.disabled.length ) {
				options.active = false;
				this.active = $();
			// activate previous tab
			} else {
				this._activate( this._findNextTab( Math.max( 0, options.active - 1 ), false ) );
			}
		// was active, active tab still exists
		} else {
			// make sure active index is correct
			options.active = this.tabs.index( this.active );
		}

		this._refresh();
	},

	_refresh: function() {
		this._setupDisabled( this.options.disabled );
		this._setupEvents( this.options.event );
		this._setupHeightStyle( this.options.heightStyle );

		this.tabs.not( this.active ).attr({
			"aria-selected": "false",
			"aria-expanded": "false",
			tabIndex: -1
		});
		this.panels.not( this._getPanelForTab( this.active ) )
			.hide()
			.attr({
				"aria-hidden": "true"
			});

		// Make sure one tab is in the tab order
		if ( !this.active.length ) {
			this.tabs.eq( 0 ).attr( "tabIndex", 0 );
		} else {
			this.active
				.addClass( "ui-tabs-active ui-state-active" )
				.attr({
					"aria-selected": "true",
					"aria-expanded": "true",
					tabIndex: 0
				});
			this._getPanelForTab( this.active )
				.show()
				.attr({
					"aria-hidden": "false"
				});
		}
	},

	_processTabs: function() {
		var that = this,
			prevTabs = this.tabs,
			prevAnchors = this.anchors,
			prevPanels = this.panels;

		this.tablist = this._getList()
			.addClass( "ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all" )
			.attr( "role", "tablist" )

			// Prevent users from focusing disabled tabs via click
			.delegate( "> li", "mousedown" + this.eventNamespace, function( event ) {
				if ( $( this ).is( ".ui-state-disabled" ) ) {
					event.preventDefault();
				}
			})

			// support: IE <9
			// Preventing the default action in mousedown doesn't prevent IE
			// from focusing the element, so if the anchor gets focused, blur.
			// We don't have to worry about focusing the previously focused
			// element since clicking on a non-focusable element should focus
			// the body anyway.
			.delegate( ".ui-tabs-anchor", "focus" + this.eventNamespace, function() {
				if ( $( this ).closest( "li" ).is( ".ui-state-disabled" ) ) {
					this.blur();
				}
			});

		this.tabs = this.tablist.find( "> li:has(a[href])" )
			.addClass( "ui-state-default ui-corner-top" )
			.attr({
				role: "tab",
				tabIndex: -1
			});

		this.anchors = this.tabs.map(function() {
				return $( "a", this )[ 0 ];
			})
			.addClass( "ui-tabs-anchor" )
			.attr({
				role: "presentation",
				tabIndex: -1
			});

		this.panels = $();

		this.anchors.each(function( i, anchor ) {
			var selector, panel, panelId,
				anchorId = $( anchor ).uniqueId().attr( "id" ),
				tab = $( anchor ).closest( "li" ),
				originalAriaControls = tab.attr( "aria-controls" );

			// inline tab
			if ( that._isLocal( anchor ) ) {
				selector = anchor.hash;
				panelId = selector.substring( 1 );
				panel = that.element.find( that._sanitizeSelector( selector ) );
			// remote tab
			} else {
				// If the tab doesn't already have aria-controls,
				// generate an id by using a throw-away element
				panelId = tab.attr( "aria-controls" ) || $( {} ).uniqueId()[ 0 ].id;
				selector = "#" + panelId;
				panel = that.element.find( selector );
				if ( !panel.length ) {
					panel = that._createPanel( panelId );
					panel.insertAfter( that.panels[ i - 1 ] || that.tablist );
				}
				panel.attr( "aria-live", "polite" );
			}

			if ( panel.length) {
				that.panels = that.panels.add( panel );
			}
			if ( originalAriaControls ) {
				tab.data( "ui-tabs-aria-controls", originalAriaControls );
			}
			tab.attr({
				"aria-controls": panelId,
				"aria-labelledby": anchorId
			});
			panel.attr( "aria-labelledby", anchorId );
		});

		this.panels
			.addClass( "ui-tabs-panel ui-widget-content ui-corner-bottom" )
			.attr( "role", "tabpanel" );

		// Avoid memory leaks (#10056)
		if ( prevTabs ) {
			this._off( prevTabs.not( this.tabs ) );
			this._off( prevAnchors.not( this.anchors ) );
			this._off( prevPanels.not( this.panels ) );
		}
	},

	// allow overriding how to find the list for rare usage scenarios (#7715)
	_getList: function() {
		return this.tablist || this.element.find( "ol,ul" ).eq( 0 );
	},

	_createPanel: function( id ) {
		return $( "<div>" )
			.attr( "id", id )
			.addClass( "ui-tabs-panel ui-widget-content ui-corner-bottom" )
			.data( "ui-tabs-destroy", true );
	},

	_setupDisabled: function( disabled ) {
		if ( $.isArray( disabled ) ) {
			if ( !disabled.length ) {
				disabled = false;
			} else if ( disabled.length === this.anchors.length ) {
				disabled = true;
			}
		}

		// disable tabs
		for ( var i = 0, li; ( li = this.tabs[ i ] ); i++ ) {
			if ( disabled === true || $.inArray( i, disabled ) !== -1 ) {
				$( li )
					.addClass( "ui-state-disabled" )
					.attr( "aria-disabled", "true" );
			} else {
				$( li )
					.removeClass( "ui-state-disabled" )
					.removeAttr( "aria-disabled" );
			}
		}

		this.options.disabled = disabled;
	},

	_setupEvents: function( event ) {
		var events = {};
		if ( event ) {
			$.each( event.split(" "), function( index, eventName ) {
				events[ eventName ] = "_eventHandler";
			});
		}

		this._off( this.anchors.add( this.tabs ).add( this.panels ) );
		// Always prevent the default action, even when disabled
		this._on( true, this.anchors, {
			click: function( event ) {
				event.preventDefault();
			}
		});
		this._on( this.anchors, events );
		this._on( this.tabs, { keydown: "_tabKeydown" } );
		this._on( this.panels, { keydown: "_panelKeydown" } );

		this._focusable( this.tabs );
		this._hoverable( this.tabs );
	},

	_setupHeightStyle: function( heightStyle ) {
		var maxHeight,
			parent = this.element.parent();

		if ( heightStyle === "fill" ) {
			maxHeight = parent.height();
			maxHeight -= this.element.outerHeight() - this.element.height();

			this.element.siblings( ":visible" ).each(function() {
				var elem = $( this ),
					position = elem.css( "position" );

				if ( position === "absolute" || position === "fixed" ) {
					return;
				}
				maxHeight -= elem.outerHeight( true );
			});

			this.element.children().not( this.panels ).each(function() {
				maxHeight -= $( this ).outerHeight( true );
			});

			this.panels.each(function() {
				$( this ).height( Math.max( 0, maxHeight -
					$( this ).innerHeight() + $( this ).height() ) );
			})
			.css( "overflow", "auto" );
		} else if ( heightStyle === "auto" ) {
			maxHeight = 0;
			this.panels.each(function() {
				maxHeight = Math.max( maxHeight, $( this ).height( "" ).height() );
			}).height( maxHeight );
		}
	},

	_eventHandler: function( event ) {
		var options = this.options,
			active = this.active,
			anchor = $( event.currentTarget ),
			tab = anchor.closest( "li" ),
			clickedIsActive = tab[ 0 ] === active[ 0 ],
			collapsing = clickedIsActive && options.collapsible,
			toShow = collapsing ? $() : this._getPanelForTab( tab ),
			toHide = !active.length ? $() : this._getPanelForTab( active ),
			eventData = {
				oldTab: active,
				oldPanel: toHide,
				newTab: collapsing ? $() : tab,
				newPanel: toShow
			};

		event.preventDefault();

		if ( tab.hasClass( "ui-state-disabled" ) ||
				// tab is already loading
				tab.hasClass( "ui-tabs-loading" ) ||
				// can't switch durning an animation
				this.running ||
				// click on active header, but not collapsible
				( clickedIsActive && !options.collapsible ) ||
				// allow canceling activation
				( this._trigger( "beforeActivate", event, eventData ) === false ) ) {
			return;
		}

		options.active = collapsing ? false : this.tabs.index( tab );

		this.active = clickedIsActive ? $() : tab;
		if ( this.xhr ) {
			this.xhr.abort();
		}

		if ( !toHide.length && !toShow.length ) {
			$.error( "jQuery UI Tabs: Mismatching fragment identifier." );
		}

		if ( toShow.length ) {
			this.load( this.tabs.index( tab ), event );
		}
		this._toggle( event, eventData );
	},

	// handles show/hide for selecting tabs
	_toggle: function( event, eventData ) {
		var that = this,
			toShow = eventData.newPanel,
			toHide = eventData.oldPanel;

		this.running = true;

		function complete() {
			that.running = false;
			that._trigger( "activate", event, eventData );
		}

		function show() {
			eventData.newTab.closest( "li" ).addClass( "ui-tabs-active ui-state-active" );

			if ( toShow.length && that.options.show ) {
				that._show( toShow, that.options.show, complete );
			} else {
				toShow.show();
				complete();
			}
		}

		// start out by hiding, then showing, then completing
		if ( toHide.length && this.options.hide ) {
			this._hide( toHide, this.options.hide, function() {
				eventData.oldTab.closest( "li" ).removeClass( "ui-tabs-active ui-state-active" );
				show();
			});
		} else {
			eventData.oldTab.closest( "li" ).removeClass( "ui-tabs-active ui-state-active" );
			toHide.hide();
			show();
		}

		toHide.attr( "aria-hidden", "true" );
		eventData.oldTab.attr({
			"aria-selected": "false",
			"aria-expanded": "false"
		});
		// If we're switching tabs, remove the old tab from the tab order.
		// If we're opening from collapsed state, remove the previous tab from the tab order.
		// If we're collapsing, then keep the collapsing tab in the tab order.
		if ( toShow.length && toHide.length ) {
			eventData.oldTab.attr( "tabIndex", -1 );
		} else if ( toShow.length ) {
			this.tabs.filter(function() {
				return $( this ).attr( "tabIndex" ) === 0;
			})
			.attr( "tabIndex", -1 );
		}

		toShow.attr( "aria-hidden", "false" );
		eventData.newTab.attr({
			"aria-selected": "true",
			"aria-expanded": "true",
			tabIndex: 0
		});
	},

	_activate: function( index ) {
		var anchor,
			active = this._findActive( index );

		// trying to activate the already active panel
		if ( active[ 0 ] === this.active[ 0 ] ) {
			return;
		}

		// trying to collapse, simulate a click on the current active header
		if ( !active.length ) {
			active = this.active;
		}

		anchor = active.find( ".ui-tabs-anchor" )[ 0 ];
		this._eventHandler({
			target: anchor,
			currentTarget: anchor,
			preventDefault: $.noop
		});
	},

	_findActive: function( index ) {
		return index === false ? $() : this.tabs.eq( index );
	},

	_getIndex: function( index ) {
		// meta-function to give users option to provide a href string instead of a numerical index.
		if ( typeof index === "string" ) {
			index = this.anchors.index( this.anchors.filter( "[href$='" + index + "']" ) );
		}

		return index;
	},

	_destroy: function() {
		if ( this.xhr ) {
			this.xhr.abort();
		}

		this.element.removeClass( "ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible" );

		this.tablist
			.removeClass( "ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all" )
			.removeAttr( "role" );

		this.anchors
			.removeClass( "ui-tabs-anchor" )
			.removeAttr( "role" )
			.removeAttr( "tabIndex" )
			.removeUniqueId();

		this.tablist.unbind( this.eventNamespace );

		this.tabs.add( this.panels ).each(function() {
			if ( $.data( this, "ui-tabs-destroy" ) ) {
				$( this ).remove();
			} else {
				$( this )
					.removeClass( "ui-state-default ui-state-active ui-state-disabled " +
						"ui-corner-top ui-corner-bottom ui-widget-content ui-tabs-active ui-tabs-panel" )
					.removeAttr( "tabIndex" )
					.removeAttr( "aria-live" )
					.removeAttr( "aria-busy" )
					.removeAttr( "aria-selected" )
					.removeAttr( "aria-labelledby" )
					.removeAttr( "aria-hidden" )
					.removeAttr( "aria-expanded" )
					.removeAttr( "role" );
			}
		});

		this.tabs.each(function() {
			var li = $( this ),
				prev = li.data( "ui-tabs-aria-controls" );
			if ( prev ) {
				li
					.attr( "aria-controls", prev )
					.removeData( "ui-tabs-aria-controls" );
			} else {
				li.removeAttr( "aria-controls" );
			}
		});

		this.panels.show();

		if ( this.options.heightStyle !== "content" ) {
			this.panels.css( "height", "" );
		}
	},

	enable: function( index ) {
		var disabled = this.options.disabled;
		if ( disabled === false ) {
			return;
		}

		if ( index === undefined ) {
			disabled = false;
		} else {
			index = this._getIndex( index );
			if ( $.isArray( disabled ) ) {
				disabled = $.map( disabled, function( num ) {
					return num !== index ? num : null;
				});
			} else {
				disabled = $.map( this.tabs, function( li, num ) {
					return num !== index ? num : null;
				});
			}
		}
		this._setupDisabled( disabled );
	},

	disable: function( index ) {
		var disabled = this.options.disabled;
		if ( disabled === true ) {
			return;
		}

		if ( index === undefined ) {
			disabled = true;
		} else {
			index = this._getIndex( index );
			if ( $.inArray( index, disabled ) !== -1 ) {
				return;
			}
			if ( $.isArray( disabled ) ) {
				disabled = $.merge( [ index ], disabled ).sort();
			} else {
				disabled = [ index ];
			}
		}
		this._setupDisabled( disabled );
	},

	load: function( index, event ) {
		index = this._getIndex( index );
		var that = this,
			tab = this.tabs.eq( index ),
			anchor = tab.find( ".ui-tabs-anchor" ),
			panel = this._getPanelForTab( tab ),
			eventData = {
				tab: tab,
				panel: panel
			},
			complete = function( jqXHR, status ) {
				if ( status === "abort" ) {
					that.panels.stop( false, true );
				}

				tab.removeClass( "ui-tabs-loading" );
				panel.removeAttr( "aria-busy" );

				if ( jqXHR === that.xhr ) {
					delete that.xhr;
				}
			};

		// not remote
		if ( this._isLocal( anchor[ 0 ] ) ) {
			return;
		}

		this.xhr = $.ajax( this._ajaxSettings( anchor, event, eventData ) );

		// support: jQuery <1.8
		// jQuery <1.8 returns false if the request is canceled in beforeSend,
		// but as of 1.8, $.ajax() always returns a jqXHR object.
		if ( this.xhr && this.xhr.statusText !== "canceled" ) {
			tab.addClass( "ui-tabs-loading" );
			panel.attr( "aria-busy", "true" );

			this.xhr
				.done(function( response, status, jqXHR ) {
					// support: jQuery <1.8
					// http://bugs.jquery.com/ticket/11778
					setTimeout(function() {
						panel.html( response );
						that._trigger( "load", event, eventData );

						complete( jqXHR, status );
					}, 1 );
				})
				.fail(function( jqXHR, status ) {
					// support: jQuery <1.8
					// http://bugs.jquery.com/ticket/11778
					setTimeout(function() {
						complete( jqXHR, status );
					}, 1 );
				});
		}
	},

	_ajaxSettings: function( anchor, event, eventData ) {
		var that = this;
		return {
			url: anchor.attr( "href" ),
			beforeSend: function( jqXHR, settings ) {
				return that._trigger( "beforeLoad", event,
					$.extend( { jqXHR: jqXHR, ajaxSettings: settings }, eventData ) );
			}
		};
	},

	_getPanelForTab: function( tab ) {
		var id = $( tab ).attr( "aria-controls" );
		return this.element.find( this._sanitizeSelector( "#" + id ) );
	}
});


/*
 * jQuery UI Tooltip 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/tooltip/
 */


var tooltip = $.widget( "ui.tooltip", {
	version: "1.11.4",
	options: {
		content: function() {
			// support: IE<9, Opera in jQuery <1.7
			// .text() can't accept undefined, so coerce to a string
			var title = $( this ).attr( "title" ) || "";
			// Escape title, since we're going from an attribute to raw HTML
			return $( "<a>" ).text( title ).html();
		},
		hide: true,
		// Disabled elements have inconsistent behavior across browsers (#8661)
		items: "[title]:not([disabled])",
		position: {
			my: "left top+15",
			at: "left bottom",
			collision: "flipfit flip"
		},
		show: true,
		tooltipClass: null,
		track: false,

		// callbacks
		close: null,
		open: null
	},

	_addDescribedBy: function( elem, id ) {
		var describedby = (elem.attr( "aria-describedby" ) || "").split( /\s+/ );
		describedby.push( id );
		elem
			.data( "ui-tooltip-id", id )
			.attr( "aria-describedby", $.trim( describedby.join( " " ) ) );
	},

	_removeDescribedBy: function( elem ) {
		var id = elem.data( "ui-tooltip-id" ),
			describedby = (elem.attr( "aria-describedby" ) || "").split( /\s+/ ),
			index = $.inArray( id, describedby );

		if ( index !== -1 ) {
			describedby.splice( index, 1 );
		}

		elem.removeData( "ui-tooltip-id" );
		describedby = $.trim( describedby.join( " " ) );
		if ( describedby ) {
			elem.attr( "aria-describedby", describedby );
		} else {
			elem.removeAttr( "aria-describedby" );
		}
	},

	_create: function() {
		this._on({
			mouseover: "open",
			focusin: "open"
		});

		// IDs of generated tooltips, needed for destroy
		this.tooltips = {};

		// IDs of parent tooltips where we removed the title attribute
		this.parents = {};

		if ( this.options.disabled ) {
			this._disable();
		}

		// Append the aria-live region so tooltips announce correctly
		this.liveRegion = $( "<div>" )
			.attr({
				role: "log",
				"aria-live": "assertive",
				"aria-relevant": "additions"
			})
			.addClass( "ui-helper-hidden-accessible" )
			.appendTo( this.document[ 0 ].body );
	},

	_setOption: function( key, value ) {
		var that = this;

		if ( key === "disabled" ) {
			this[ value ? "_disable" : "_enable" ]();
			this.options[ key ] = value;
			// disable element style changes
			return;
		}

		this._super( key, value );

		if ( key === "content" ) {
			$.each( this.tooltips, function( id, tooltipData ) {
				that._updateContent( tooltipData.element );
			});
		}
	},

	_disable: function() {
		var that = this;

		// close open tooltips
		$.each( this.tooltips, function( id, tooltipData ) {
			var event = $.Event( "blur" );
			event.target = event.currentTarget = tooltipData.element[ 0 ];
			that.close( event, true );
		});

		// remove title attributes to prevent native tooltips
		this.element.find( this.options.items ).addBack().each(function() {
			var element = $( this );
			if ( element.is( "[title]" ) ) {
				element
					.data( "ui-tooltip-title", element.attr( "title" ) )
					.removeAttr( "title" );
			}
		});
	},

	_enable: function() {
		// restore title attributes
		this.element.find( this.options.items ).addBack().each(function() {
			var element = $( this );
			if ( element.data( "ui-tooltip-title" ) ) {
				element.attr( "title", element.data( "ui-tooltip-title" ) );
			}
		});
	},

	open: function( event ) {
		var that = this,
			target = $( event ? event.target : this.element )
				// we need closest here due to mouseover bubbling,
				// but always pointing at the same event target
				.closest( this.options.items );

		// No element to show a tooltip for or the tooltip is already open
		if ( !target.length || target.data( "ui-tooltip-id" ) ) {
			return;
		}

		if ( target.attr( "title" ) ) {
			target.data( "ui-tooltip-title", target.attr( "title" ) );
		}

		target.data( "ui-tooltip-open", true );

		// kill parent tooltips, custom or native, for hover
		if ( event && event.type === "mouseover" ) {
			target.parents().each(function() {
				var parent = $( this ),
					blurEvent;
				if ( parent.data( "ui-tooltip-open" ) ) {
					blurEvent = $.Event( "blur" );
					blurEvent.target = blurEvent.currentTarget = this;
					that.close( blurEvent, true );
				}
				if ( parent.attr( "title" ) ) {
					parent.uniqueId();
					that.parents[ this.id ] = {
						element: this,
						title: parent.attr( "title" )
					};
					parent.attr( "title", "" );
				}
			});
		}

		this._registerCloseHandlers( event, target );
		this._updateContent( target, event );
	},

	_updateContent: function( target, event ) {
		var content,
			contentOption = this.options.content,
			that = this,
			eventType = event ? event.type : null;

		if ( typeof contentOption === "string" ) {
			return this._open( event, target, contentOption );
		}

		content = contentOption.call( target[0], function( response ) {

			// IE may instantly serve a cached response for ajax requests
			// delay this call to _open so the other call to _open runs first
			that._delay(function() {

				// Ignore async response if tooltip was closed already
				if ( !target.data( "ui-tooltip-open" ) ) {
					return;
				}

				// jQuery creates a special event for focusin when it doesn't
				// exist natively. To improve performance, the native event
				// object is reused and the type is changed. Therefore, we can't
				// rely on the type being correct after the event finished
				// bubbling, so we set it back to the previous value. (#8740)
				if ( event ) {
					event.type = eventType;
				}
				this._open( event, target, response );
			});
		});
		if ( content ) {
			this._open( event, target, content );
		}
	},

	_open: function( event, target, content ) {
		var tooltipData, tooltip, delayedShow, a11yContent,
			positionOption = $.extend( {}, this.options.position );

		if ( !content ) {
			return;
		}

		// Content can be updated multiple times. If the tooltip already
		// exists, then just update the content and bail.
		tooltipData = this._find( target );
		if ( tooltipData ) {
			tooltipData.tooltip.find( ".ui-tooltip-content" ).html( content );
			return;
		}

		// if we have a title, clear it to prevent the native tooltip
		// we have to check first to avoid defining a title if none exists
		// (we don't want to cause an element to start matching [title])
		// We use removeAttr only for key events, to allow IE to export the correct
		// accessible attributes. For mouse events, set to empty string to avoid
		// native tooltip showing up (happens only when removing inside mouseover).
		if ( target.is( "[title]" ) ) {
			if ( event && event.type === "mouseover" ) {
				target.attr( "title", "" );
			} else {
				target.removeAttr( "title" );
			}
		}

		tooltipData = this._tooltip( target );
		tooltip = tooltipData.tooltip;
		this._addDescribedBy( target, tooltip.attr( "id" ) );
		tooltip.find( ".ui-tooltip-content" ).html( content );

		// Support: Voiceover on OS X, JAWS on IE <= 9
		// JAWS announces deletions even when aria-relevant="additions"
		// Voiceover will sometimes re-read the entire log region's contents from the beginning
		this.liveRegion.children().hide();
		if ( content.clone ) {
			a11yContent = content.clone();
			a11yContent.removeAttr( "id" ).find( "[id]" ).removeAttr( "id" );
		} else {
			a11yContent = content;
		}
		$( "<div>" ).html( a11yContent ).appendTo( this.liveRegion );

		function position( event ) {
			positionOption.of = event;
			if ( tooltip.is( ":hidden" ) ) {
				return;
			}
			tooltip.position( positionOption );
		}
		if ( this.options.track && event && /^mouse/.test( event.type ) ) {
			this._on( this.document, {
				mousemove: position
			});
			// trigger once to override element-relative positioning
			position( event );
		} else {
			tooltip.position( $.extend({
				of: target
			}, this.options.position ) );
		}

		tooltip.hide();

		this._show( tooltip, this.options.show );
		// Handle tracking tooltips that are shown with a delay (#8644). As soon
		// as the tooltip is visible, position the tooltip using the most recent
		// event.
		if ( this.options.show && this.options.show.delay ) {
			delayedShow = this.delayedShow = setInterval(function() {
				if ( tooltip.is( ":visible" ) ) {
					position( positionOption.of );
					clearInterval( delayedShow );
				}
			}, $.fx.interval );
		}

		this._trigger( "open", event, { tooltip: tooltip } );
	},

	_registerCloseHandlers: function( event, target ) {
		var events = {
			keyup: function( event ) {
				if ( event.keyCode === $.ui.keyCode.ESCAPE ) {
					var fakeEvent = $.Event(event);
					fakeEvent.currentTarget = target[0];
					this.close( fakeEvent, true );
				}
			}
		};

		// Only bind remove handler for delegated targets. Non-delegated
		// tooltips will handle this in destroy.
		if ( target[ 0 ] !== this.element[ 0 ] ) {
			events.remove = function() {
				this._removeTooltip( this._find( target ).tooltip );
			};
		}

		if ( !event || event.type === "mouseover" ) {
			events.mouseleave = "close";
		}
		if ( !event || event.type === "focusin" ) {
			events.focusout = "close";
		}
		this._on( true, target, events );
	},

	close: function( event ) {
		var tooltip,
			that = this,
			target = $( event ? event.currentTarget : this.element ),
			tooltipData = this._find( target );

		// The tooltip may already be closed
		if ( !tooltipData ) {

			// We set ui-tooltip-open immediately upon open (in open()), but only set the
			// additional data once there's actually content to show (in _open()). So even if the
			// tooltip doesn't have full data, we always remove ui-tooltip-open in case we're in
			// the period between open() and _open().
			target.removeData( "ui-tooltip-open" );
			return;
		}

		tooltip = tooltipData.tooltip;

		// disabling closes the tooltip, so we need to track when we're closing
		// to avoid an infinite loop in case the tooltip becomes disabled on close
		if ( tooltipData.closing ) {
			return;
		}

		// Clear the interval for delayed tracking tooltips
		clearInterval( this.delayedShow );

		// only set title if we had one before (see comment in _open())
		// If the title attribute has changed since open(), don't restore
		if ( target.data( "ui-tooltip-title" ) && !target.attr( "title" ) ) {
			target.attr( "title", target.data( "ui-tooltip-title" ) );
		}

		this._removeDescribedBy( target );

		tooltipData.hiding = true;
		tooltip.stop( true );
		this._hide( tooltip, this.options.hide, function() {
			that._removeTooltip( $( this ) );
		});

		target.removeData( "ui-tooltip-open" );
		this._off( target, "mouseleave focusout keyup" );

		// Remove 'remove' binding only on delegated targets
		if ( target[ 0 ] !== this.element[ 0 ] ) {
			this._off( target, "remove" );
		}
		this._off( this.document, "mousemove" );

		if ( event && event.type === "mouseleave" ) {
			$.each( this.parents, function( id, parent ) {
				$( parent.element ).attr( "title", parent.title );
				delete that.parents[ id ];
			});
		}

		tooltipData.closing = true;
		this._trigger( "close", event, { tooltip: tooltip } );
		if ( !tooltipData.hiding ) {
			tooltipData.closing = false;
		}
	},

	_tooltip: function( element ) {
		var tooltip = $( "<div>" )
				.attr( "role", "tooltip" )
				.addClass( "ui-tooltip ui-widget ui-corner-all ui-widget-content " +
					( this.options.tooltipClass || "" ) ),
			id = tooltip.uniqueId().attr( "id" );

		$( "<div>" )
			.addClass( "ui-tooltip-content" )
			.appendTo( tooltip );

		tooltip.appendTo( this.document[0].body );

		return this.tooltips[ id ] = {
			element: element,
			tooltip: tooltip
		};
	},

	_find: function( target ) {
		var id = target.data( "ui-tooltip-id" );
		return id ? this.tooltips[ id ] : null;
	},

	_removeTooltip: function( tooltip ) {
		tooltip.remove();
		delete this.tooltips[ tooltip.attr( "id" ) ];
	},

	_destroy: function() {
		var that = this;

		// close open tooltips
		$.each( this.tooltips, function( id, tooltipData ) {
			// Delegate to close method to handle common cleanup
			var event = $.Event( "blur" ),
				element = tooltipData.element;
			event.target = event.currentTarget = element[ 0 ];
			that.close( event, true );

			// Remove immediately; destroying an open tooltip doesn't use the
			// hide animation
			$( "#" + id ).remove();

			// Restore the title
			if ( element.data( "ui-tooltip-title" ) ) {
				// If the title attribute has changed since open(), don't restore
				if ( !element.attr( "title" ) ) {
					element.attr( "title", element.data( "ui-tooltip-title" ) );
				}
				element.removeData( "ui-tooltip-title" );
			}
		});
		this.liveRegion.remove();
	}
});



}));
})(ChemDoodle.lib.jQuery);
/*
 * jQuery simple-color plugin
 * @requires jQuery v1.4.2 or later
 *
 * See http://recursive-design.com/projects/jquery-simple-color/
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Version: 1.2.0 (201310121400)
 */
 (function($) {
/**
 * simpleColor() provides a mechanism for displaying simple color-choosers.
 *
 * If an options Object is provided, the following attributes are supported:
 *
 *  defaultColor:       Default (initially selected) color.
 *                      Default value: '#FFF'
 *
 *  cellWidth:          Width of each individual color cell.
 *                      Default value: 10
 *
 *  cellHeight:         Height of each individual color cell.
 *                      Default value: 10
 *
 *  cellMargin:         Margin of each individual color cell.
 *                      Default value: 1
 *
 *  boxWidth:           Width of the color display box.
 *                      Default value: 115px
 *
 *  boxHeight:          Height of the color display box.
 *                      Default value: 20px
 *
 *  columns:            Number of columns to display. Color order may look strange if this is altered.
 *                      Default value: 16
 *
 *  insert:             The position to insert the color chooser. 'before' or 'after'.
 *                      Default value: 'after'
 *
 *  colors:             An array of colors to display, if you want to customize the default color set.
 *                      Default value: default color set - see 'defaultColors' below.
 *
 *  displayColorCode:   Display the color code (eg #333333) as text inside the button. true or false.
 *                      Default value: false
 *
 *  colorCodeAlign:     Text alignment used to display the color code inside the button. Only used if
 *                      'displayColorCode' is true. 'left', 'center' or 'right'
 *                      Default value: 'center'
 *
 *  colorCodeColor:     Text color of the color code inside the button. Only used if 'displayColorCode'
 *                      is true.
 *                      Default value: '#FFF'
 *
 *  onSelect:           Callback function to call after a color has been chosen. The callback
 *                      function will be passed two arguments - the hex code of the selected color,
 *                      and the input element that triggered the chooser.
 *                      Default value: null
 *                      Returns:       hex value
 *
 *  onCellEnter:        Callback function that excecutes when the mouse enters a cell. The callback
 *                      function will be passed two arguments - the hex code of the current color,
 *                      and the input element that triggered the chooser.
 *                      Default value: null
 *                      Returns:       hex value
 *
 *  onClose:            Callback function that executes when the chooser is closed. The callback
 *                      function will be passed one argument - the input element that triggered
 *                      the chooser.
 *                      Default value: null
 *
 *  livePreview:        The color display will change to show the color of the hovered color cell.
 *                      The display will revert if no color is selected.
 *                      Default value: false
 *
 *  chooserCSS:         An associative array of CSS properties that will be applied to the pop-up
 *                      color chooser.
 *                      Default value: see options.chooserCSS in the source
 *
 *  displayCSS:         An associative array of CSS properties that will be applied to the color
 *                      display box.
 *                      Default value: see options.displayCSS in the source
 */
  $.fn.simpleColor = function(options) {

    var element = this;

    var defaultColors = [
      '990033', 'ff3366', 'cc0033', 'ff0033', 'ff9999', 'cc3366', 'ffccff', 'cc6699',
      '993366', '660033', 'cc3399', 'ff99cc', 'ff66cc', 'ff99ff', 'ff6699', 'cc0066',
      'ff0066', 'ff3399', 'ff0099', 'ff33cc', 'ff00cc', 'ff66ff', 'ff33ff', 'ff00ff',
      'cc0099', '990066', 'cc66cc', 'cc33cc', 'cc99ff', 'cc66ff', 'cc33ff', '993399',
      'cc00cc', 'cc00ff', '9900cc', '990099', 'cc99cc', '996699', '663366', '660099',
      '9933cc', '660066', '9900ff', '9933ff', '9966cc', '330033', '663399', '6633cc',
      '6600cc', '9966ff', '330066', '6600ff', '6633ff', 'ccccff', '9999ff', '9999cc',
      '6666cc', '6666ff', '666699', '333366', '333399', '330099', '3300cc', '3300ff',
      '3333ff', '3333cc', '0066ff', '0033ff', '3366ff', '3366cc', '000066', '000033',
      '0000ff', '000099', '0033cc', '0000cc', '336699', '0066cc', '99ccff', '6699ff',
      '003366', '6699cc', '006699', '3399cc', '0099cc', '66ccff', '3399ff', '003399',
      '0099ff', '33ccff', '00ccff', '99ffff', '66ffff', '33ffff', '00ffff', '00cccc',
      '009999', '669999', '99cccc', 'ccffff', '33cccc', '66cccc', '339999', '336666',
      '006666', '003333', '00ffcc', '33ffcc', '33cc99', '00cc99', '66ffcc', '99ffcc',
      '00ff99', '339966', '006633', '336633', '669966', '66cc66', '99ff99', '66ff66',
      '339933', '99cc99', '66ff99', '33ff99', '33cc66', '00cc66', '66cc99', '009966',
      '009933', '33ff66', '00ff66', 'ccffcc', 'ccff99', '99ff66', '99ff33', '00ff33',
      '33ff33', '00cc33', '33cc33', '66ff33', '00ff00', '66cc33', '006600', '003300',
      '009900', '33ff00', '66ff00', '99ff00', '66cc00', '00cc00', '33cc00', '339900',
      '99cc66', '669933', '99cc33', '336600', '669900', '99cc00', 'ccff66', 'ccff33',
      'ccff00', '999900', 'cccc00', 'cccc33', '333300', '666600', '999933', 'cccc66',
      '666633', '999966', 'cccc99', 'ffffcc', 'ffff99', 'ffff66', 'ffff33', 'ffff00',
      'ffcc00', 'ffcc66', 'ffcc33', 'cc9933', '996600', 'cc9900', 'ff9900', 'cc6600',
      '993300', 'cc6633', '663300', 'ff9966', 'ff6633', 'ff9933', 'ff6600', 'cc3300',
      '996633', '330000', '663333', '996666', 'cc9999', '993333', 'cc6666', 'ffcccc',
      'ff3333', 'cc3333', 'ff6666', '660000', '990000', 'cc0000', 'ff0000', 'ff3300',
      'cc9966', 'ffcc99', 'ffffff', 'cccccc', '999999', '666666', '333333', '000000',
      '000000', '000000', '000000', '000000', '000000', '000000', '000000', '000000'
    ];

    // Option defaults
    options = $.extend({
      defaultColor:     this.attr('defaultColor') || '#FFF',
      cellWidth:        this.attr('cellWidth') || 10,
      cellHeight:       this.attr('cellHeight') || 10,
      cellMargin:       this.attr('cellMargin') || 1,
      boxWidth:         this.attr('boxWidth') || '115px',
      boxHeight:        this.attr('boxHeight') || '20px',
      columns:          this.attr('columns') || 16,
      insert:           this.attr('insert') || 'after',
      colors:           this.attr('colors') || defaultColors,
      displayColorCode: this.attr('displayColorCode') || false,
      colorCodeAlign:   this.attr('colorCodeAlign') || 'center',
      colorCodeColor:   this.attr('colorCodeColor') || '#FFF',
      onSelect:         null,
      onCellEnter:      null,
      onClose:          null,
      livePreview:      false
    }, options || {});

    // Figure out the cell dimensions
    options.totalWidth = options.columns * (options.cellWidth + (2 * options.cellMargin));

    // Custom CSS for the chooser, which relies on previously defined options.
    options.chooserCSS = $.extend({
      'border':           '1px solid #000',
      'margin':           '0 0 0 5px',
      'width':            options.totalWidth,
      'height':           options.totalHeight,
      'top':              0,
      'left':             options.boxWidth,
      'position':         'absolute',
      'background-color': '#fff'
    }, options.chooserCSS || {});

    // Custom CSS for the display box, which relies on previously defined options.
    options.displayCSS = $.extend({
      'background-color': options.defaultColor,
      'border':           '1px solid #000',
      'width':            options.boxWidth,
      'height':           options.boxHeight,
      'line-height':      options.boxHeight + 'px',
      'cursor':           'pointer'
    }, options.displayCSS || {});

    // Hide the input
    this.hide();

    // this should probably do feature detection - I don't know why we need +2 for IE
    // but this works for jQuery 1.9.1
    if (navigator.userAgent.indexOf("MSIE")!=-1){
      options.totalWidth += 2;
    }

    options.totalHeight = Math.ceil(options.colors.length / options.columns) * (options.cellHeight + (2 * options.cellMargin));

    // Store these options so they'll be available to the other functions
    // TODO - must be a better way to do this, not sure what the 'official'
    // jQuery method is. Ideally i want to pass these as a parameter to the
    // each() function but i'm not sure how
    $.simpleColorOptions = options;

    function buildChooser(index) {
      options = $.simpleColorOptions;

      // Create a container to hold everything
      var container = $("<div class='simpleColorContainer' />");

      // Absolutely positioned child elements now 'work'.
			container.css('position', 'relative');

      // Create the color display box
      var defaultColor = (this.value && this.value != '') ? this.value : options.defaultColor;

      var displayBox = $("<div class='simpleColorDisplay' />");
      displayBox.css($.extend(options.displayCSS, { 'background-color': defaultColor }));
      displayBox.data('color', defaultColor);
      container.append(displayBox);

      // If 'displayColorCode' is turned on, display the currently selected color code as text inside the button.
      if (options.displayColorCode) {
        displayBox.data('displayColorCode', true);
        displayBox.text(this.value);
        displayBox.css({
          'color':     options.colorCodeColor,
          'textAlign': options.colorCodeAlign
        });
      }

      var selectCallback = function (event) {
        // Bind and namespace the click listener only when the chooser is
        // displayed. Unbind when the chooser is closed.
        $('html').bind("click.simpleColorDisplay", function(e) {
          $('html').unbind("click.simpleColorDisplay");
          $('.simpleColorChooser').hide();

          // If the user has not selected a new color, then revert the display.
          // Makes sure the selected cell is within the current color chooser.
          var target = $(e.target);
          if (target.is('.simpleColorCell') === false || $.contains( $(event.target).closest('.simpleColorContainer')[0], target[0]) === false) {
            displayBox.css('background-color', displayBox.data('color'));
            if (options.displayColorCode) {
              displayBox.text(displayBox.data('color'));
            }
          }
          // Execute onClose callback whenever the color chooser is closed.
          if (options.onClose) {
            options.onClose(element);
          }
        });

        // Use an existing chooser if there is one
        if (event.data.container.chooser) {
          event.data.container.chooser.toggle();

        // Build the chooser.
        } else {
          // Make a chooser div to hold the cells
          var chooser = $("<div class='simpleColorChooser'/>");
          chooser.css(options.chooserCSS);

          event.data.container.chooser = chooser;
          event.data.container.append(chooser);

          // Create the cells
          for (var i=0; i<options.colors.length; i++) {
            var cell = $("<div class='simpleColorCell' id='" + options.colors[i] + "'/>");
            cell.css({
              'width':            options.cellWidth + 'px',
              'height':           options.cellHeight + 'px',
              'margin':           options.cellMargin + 'px',
              'cursor':           'pointer',
              'lineHeight':       options.cellHeight + 'px',
              'fontSize':         '1px',
              'float':            'left',
              'background-color': '#'+options.colors[i]
            });
            chooser.append(cell);
            if (options.onCellEnter || options.livePreview) {
              cell.bind('mouseenter', function(event) {
                if (options.onCellEnter) {
                  options.onCellEnter(this.id, element);
                }
                if (options.livePreview) {
                  displayBox.css('background-color', '#' + this.id);
                  if (options.displayColorCode) {
                    displayBox.text('#' + this.id);
                  }
                }
              });
            }
            cell.bind('click', {
              input: event.data.input,
              chooser: chooser,
              displayBox: displayBox
            },
            function(event) {
              var color = '#' + this.id;
              event.data.input.value = color;
              $(event.data.input).change();
              $(event.data.displayBox).data('color', color);
              event.data.displayBox.css('background-color', color);
              event.data.chooser.hide();

              // If 'displayColorCode' is turned on, display the currently selected color code as text inside the button.
              if (options.displayColorCode) {
                event.data.displayBox.text(color);
              }

              // If an onSelect callback function is defined then excecute it.
              if (options.onSelect) {
                options.onSelect(color, element);
              }
            });
          }
        }
      };

      // Also bind the display box button to display the chooser.
      var callbackParams = {
        input:      this,
        container:  container,
        displayBox: displayBox
      };
      displayBox.bind('click', callbackParams, selectCallback);

      $(this).after(container);
      $(this).data('container', container);
    };

    this.each(buildChooser);

    $('.simpleColorDisplay').each(function() {
      $(this).click(function(e){
        e.stopPropagation();
      });
    });

    return this;
  };

  /*
   * Close the given color choosers.
   */
  $.fn.closeChooser = function() {
    this.each( function(index) {
      $(this).data('container').find('.simpleColorChooser').hide();
    });

    return this;
  };

  /*
   * Set the color of the given color choosers.
   */
  $.fn.setColor = function(color) {
    this.each( function(index) {
      var displayBox = $(this).data('container').find('.simpleColorDisplay');
      displayBox.css('background-color', color).data('color', color);
      if (displayBox.data('displayColorCode') === true) {
        displayBox.text(color);
      }
    });

    return this;
  };

})(ChemDoodle.lib.jQuery);
/*
 *
 * jQuery UI Touch Punch 0.2.3
 *
 * Copyright 2011–2014, Dave Furfero
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *  jquery.ui.widget.js
 *  jquery.ui.mouse.js
 */
(function ($) {

  // Detect touch support
  $.support.touch = 'ontouchend' in document;

  // Ignore browsers without touch support
  if (!$.support.touch) {
    return;
  }

  var mouseProto = $.ui.mouse.prototype,
      _mouseInit = mouseProto._mouseInit,
      _mouseDestroy = mouseProto._mouseDestroy,
      touchHandled;

  /**
   * Simulate a mouse event based on a corresponding touch event
   * @param {Object} event A touch event
   * @param {String} simulatedType The corresponding mouse event
   */
  function simulateMouseEvent (event, simulatedType) {

    // Ignore multi-touch events
    if (event.originalEvent.touches.length > 1) {
      return;
    }

    event.preventDefault();

    var touch = event.originalEvent.changedTouches[0],
        simulatedEvent = document.createEvent('MouseEvents');
    
    // Initialize the simulated mouse event using the touch event's coordinates
    simulatedEvent.initMouseEvent(
      simulatedType,    // type
      true,             // bubbles                    
      true,             // cancelable                 
      window,           // view                       
      1,                // detail                     
      touch.screenX,    // screenX                    
      touch.screenY,    // screenY                    
      touch.clientX,    // clientX                    
      touch.clientY,    // clientY                    
      false,            // ctrlKey                    
      false,            // altKey                     
      false,            // shiftKey                   
      false,            // metaKey                    
      0,                // button                     
      null              // relatedTarget              
    );

    // Dispatch the simulated event to the target element
    event.target.dispatchEvent(simulatedEvent);
  }

  /**
   * Handle the jQuery UI widget's touchstart events
   * @param {Object} event The widget element's touchstart event
   */
  mouseProto._touchStart = function (event) {

    var self = this;

    // Ignore the event if another widget is already being handled
    if (touchHandled || !self._mouseCapture(event.originalEvent.changedTouches[0])) {
      return;
    }

    // Set the flag to prevent other widgets from inheriting the touch event
    touchHandled = true;

    // Track movement to determine if interaction was a click
    self._touchMoved = false;

    // Simulate the mouseover event
    simulateMouseEvent(event, 'mouseover');

    // Simulate the mousemove event
    simulateMouseEvent(event, 'mousemove');

    // Simulate the mousedown event
    simulateMouseEvent(event, 'mousedown');
    
    // iChemLabs - making touchmove less sensitive
    this.psave = {x: event.originalEvent.changedTouches?event.originalEvent.changedTouches[0].pageX:event.pageX, y: event.originalEvent.changedTouches?event.originalEvent.changedTouches[0].pageY:event.pageY};
  };

  /**
   * Handle the jQuery UI widget's touchmove events
   * @param {Object} event The document's touchmove event
   */
  mouseProto._touchMove = function (event) {

    // iChemLabs - making touchmove less sensitive
    var x = event.pageX;
    var y = event.pageY;
    if (event.originalEvent.changedTouches) {
		x = event.originalEvent.changedTouches[0].pageX;
		y = event.originalEvent.changedTouches[0].pageY;
	}
	if(x-this.psave.x<4 && y-this.psave.y<4){
		return;
	}

    // Ignore event if not handled
    if (!touchHandled) {
      return;
    }

    // Interaction was not a click
    this._touchMoved = true;

    // Simulate the mousemove event
    simulateMouseEvent(event, 'mousemove');
  };

  /**
   * Handle the jQuery UI widget's touchend events
   * @param {Object} event The document's touchend event
   */
  mouseProto._touchEnd = function (event) {

    // iChemLabs - making touchmove less sensitive
    this.psave = undefined;
    
    // Ignore event if not handled
    if (!touchHandled) {
      return;
    }

    // Simulate the mouseup event
    simulateMouseEvent(event, 'mouseup');

    // Simulate the mouseout event
    simulateMouseEvent(event, 'mouseout');

    // If the touch interaction did not move, it should trigger a click
    if (!this._touchMoved) {

      // Simulate the click event
      simulateMouseEvent(event, 'click');
    }

    // Unset the flag to allow other widgets to inherit the touch event
    touchHandled = false;
  };

  /**
   * A duck punch of the $.ui.mouse _mouseInit method to support touch events.
   * This method extends the widget with bound touch event handlers that
   * translate touch events to mouse events and pass them to the widget's
   * original mouse event handling methods.
   */
  mouseProto._mouseInit = function () {
    
    var self = this;

    // Delegate the touch handlers to the widget's element
    self.element.bind({
      touchstart: $.proxy(self, '_touchStart'),
      touchmove: $.proxy(self, '_touchMove'),
      touchend: $.proxy(self, '_touchEnd')
    });

    // Call the original $.ui.mouse init method
    _mouseInit.call(self);
  };

  /**
   * Remove the touch event handlers
   */
  mouseProto._mouseDestroy = function () {
    
    var self = this;

    // Delegate the touch handlers to the widget's element
    self.element.unbind({
      touchstart: $.proxy(self, '_touchStart'),
      touchmove: $.proxy(self, '_touchMove'),
      touchend: $.proxy(self, '_touchEnd')
    });

    // Call the original $.ui.mouse destroy method
    _mouseDestroy.call(self);
  };

})(ChemDoodle.lib.jQuery);
ChemDoodle.uis = (function(iChemLabs, q, undefined) {
	'use strict';

	iChemLabs.INFO.v_jQuery_ui = q.ui.version;

	let p = {};

	p.actions = {};
	p.gui = {};
	p.gui.desktop = {};
	p.gui.mobile = {};
	p.states = {};
	p.tools = {};

	return p;

})(ChemDoodle.iChemLabs, ChemDoodle.lib.jQuery);

(function(actions, undefined) {
	'use strict';
	actions._Action = function() {
	};
	let _ = actions._Action.prototype;
	_.forward = function(sketcher) {
		this.innerForward();
		this.checks(sketcher);
	};
	_.reverse = function(sketcher) {
		this.innerReverse();
		this.checks(sketcher);
	};
	_.checks = function(sketcher) {
		for ( let i = 0, ii = sketcher.molecules.length; i < ii; i++) {
			sketcher.molecules[i].check();
		}
		if (sketcher.lasso && sketcher.lasso.isActive()) {
			sketcher.lasso.setBounds();
		}
		sketcher.checksOnAction();
		sketcher.repaint();
	};

})(ChemDoodle.uis.actions);

(function(informatics, structures, actions, undefined) {
	'use strict';
	actions.AddAction = function(sketcher, a, as, bs) {
		this.sketcher = sketcher;
		this.a = a;
		this.as = as;
		this.bs = bs;
	};
	let _ = actions.AddAction.prototype = new actions._Action();
	_.innerForward = function() {
		let mol = this.sketcher.getMoleculeByAtom(this.a);
		if (!mol) {
			mol = new structures.Molecule();
			this.sketcher.molecules.push(mol);
		}
		if (this.as) {
			for ( let i = 0, ii = this.as.length; i < ii; i++) {
				mol.atoms.push(this.as[i]);
			}
		}
		if (this.bs) {
			let merging = [];
			for ( let i = 0, ii = this.bs.length; i < ii; i++) {
				let b = this.bs[i];
				if (mol.atoms.indexOf(b.a1) === -1) {
					let otherMol = this.sketcher.getMoleculeByAtom(b.a1);
					if (merging.indexOf(otherMol) === -1) {
						merging.push(otherMol);
					}
				}
				if (mol.atoms.indexOf(b.a2) === -1) {
					let otherMol = this.sketcher.getMoleculeByAtom(b.a2);
					if (merging.indexOf(otherMol) === -1) {
						merging.push(otherMol);
					}
				}
				mol.bonds.push(b);
			}
			for ( let i = 0, ii = merging.length; i < ii; i++) {
				let molRemoving = merging[i];
				this.sketcher.removeMolecule(molRemoving);
				mol.atoms = mol.atoms.concat(molRemoving.atoms);
				mol.bonds = mol.bonds.concat(molRemoving.bonds);
			}
		}
	};
	_.innerReverse = function() {
		let mol = this.sketcher.getMoleculeByAtom(this.a);
		if (this.as) {
			let aKeep = [];
			for ( let i = 0, ii = mol.atoms.length; i < ii; i++) {
				if (this.as.indexOf(mol.atoms[i]) === -1) {
					aKeep.push(mol.atoms[i]);
				}
			}
			mol.atoms = aKeep;
		}
		if (this.bs) {
			let bKeep = [];
			for ( let i = 0, ii = mol.bonds.length; i < ii; i++) {
				if (this.bs.indexOf(mol.bonds[i]) === -1) {
					bKeep.push(mol.bonds[i]);
				}
			}
			mol.bonds = bKeep;
		}
		if (mol.atoms.length === 0) {
			// remove molecule if it is empty
			this.sketcher.removeMolecule(mol);
		} else {
			let split = new informatics.Splitter().split(mol);
			if (split.length > 1) {
				this.sketcher.removeMolecule(mol);
				for ( let i = 0, ii = split.length; i < ii; i++) {
					this.sketcher.molecules.push(split[i]);
				}
			}
		}
	};

})(ChemDoodle.informatics, ChemDoodle.structures, ChemDoodle.uis.actions);

(function(actions, undefined) {
	'use strict';
	actions.AddContentAction = function(sketcher, mols, shapes) {
		this.sketcher = sketcher;
		this.mols = mols;
		this.shapes = shapes;
	};
	let _ = actions.AddContentAction.prototype = new actions._Action();
	_.innerForward = function() {
		this.sketcher.molecules = this.sketcher.molecules.concat(this.mols);
		this.sketcher.shapes = this.sketcher.shapes.concat(this.shapes);
	};
	_.innerReverse = function() {
		for(let i = 0, ii = this.mols.length; i<ii; i++){
			this.sketcher.removeMolecule(this.mols[i]);
		}
		for(let i = 0, ii = this.shapes.length; i<ii; i++){
			this.sketcher.removeShape(this.shapes[i]);
		}
	};

})(ChemDoodle.uis.actions);

(function(actions, undefined) {
	'use strict';
	actions.AddShapeAction = function(sketcher, s) {
		this.sketcher = sketcher;
		this.s = s;
	};
	let _ = actions.AddShapeAction.prototype = new actions._Action();
	_.innerForward = function() {
		this.sketcher.shapes.push(this.s);
	};
	_.innerReverse = function() {
		this.sketcher.removeShape(this.s);
	};

})(ChemDoodle.uis.actions);
(function(actions, undefined) {
	'use strict';
	actions.AddVAPAttachementAction = function(vap, a, substituent) {
		this.vap = vap;
		this.a = a;
		this.substituent = substituent;
	};
	let _ = actions.AddVAPAttachementAction.prototype = new actions._Action();
	_.innerForward = function() {
		if(this.substituent){
			this.vap.substituent = this.a;
		}else{
			this.vap.attachments.push(this.a);
		}
	};
	_.innerReverse = function() {
		if(this.substituent){
			this.vap.substituent = undefined;
		}else{
			this.vap.attachments.pop();
		}
	};

})(ChemDoodle.uis.actions);
(function(actions, Bond, m, undefined) {
	'use strict';
	actions.ChangeBondAction = function(b, orderAfter, stereoAfter) {
		this.b = b;
		this.orderBefore = b.bondOrder;
		this.stereoBefore = b.stereo;
		if (orderAfter) {
			this.orderAfter = orderAfter;
			this.stereoAfter = stereoAfter;
		} else {
			// make sure to floor so half bond types increment correctly
			this.orderAfter = m.floor(b.bondOrder + 1);
			if (this.orderAfter > 3) {
				this.orderAfter = 1;
			}
			this.stereoAfter = Bond.STEREO_NONE;
		}
	};
	let _ = actions.ChangeBondAction.prototype = new actions._Action();
	_.innerForward = function() {
		this.b.bondOrder = this.orderAfter;
		this.b.stereo = this.stereoAfter;
	};
	_.innerReverse = function() {
		this.b.bondOrder = this.orderBefore;
		this.b.stereo = this.stereoBefore;
	};

})(ChemDoodle.uis.actions, ChemDoodle.structures.Bond, Math);
(function(actions, m, undefined) {
	'use strict';
	actions.ChangeDynamicBracketAttributeAction = function(s, type) {
		this.s = s;
		this.type = type;
	};
	let _ = actions.ChangeDynamicBracketAttributeAction.prototype = new actions._Action();
	_.innerForward = function() {
		let c = this.type > 0 ? 1 : -1;
		switch (m.abs(this.type)) {
		case 1:
			this.s.n1 += c;
			break;
		case 2:
			this.s.n2 += c;
			break;
		}
	};
	_.innerReverse = function() {
		let c = this.type > 0 ? -1 : 1;
		switch (m.abs(this.type)) {
		case 1:
			this.s.n1 += c;
			break;
		case 2:
			this.s.n2 += c;
			break;
		}
	};

})(ChemDoodle.uis.actions, Math);
(function(actions, m, undefined) {
	'use strict';
	actions.ChangeBracketAttributeAction = function(s, type) {
		this.s = s;
		this.type = type;
	};
	let _ = actions.ChangeBracketAttributeAction.prototype = new actions._Action();
	_.innerForward = function() {
		let c = this.type > 0 ? 1 : -1;
		switch (m.abs(this.type)) {
		case 1:
			this.s.charge += c;
			break;
		case 2:
			this.s.repeat += c;
			break;
		case 3:
			this.s.mult += c;
			break;
		}
	};
	_.innerReverse = function() {
		let c = this.type > 0 ? -1 : 1;
		switch (m.abs(this.type)) {
		case 1:
			this.s.charge += c;
			break;
		case 2:
			this.s.repeat += c;
			break;
		case 3:
			this.s.mult += c;
			break;
		}
	};

})(ChemDoodle.uis.actions, Math);
(function(actions, undefined) {
	'use strict';
	actions.ChangeChargeAction = function(a, delta) {
		this.a = a;
		this.delta = delta;
	};
	let _ = actions.ChangeChargeAction.prototype = new actions._Action();
	_.innerForward = function() {
		this.a.charge += this.delta;
	};
	_.innerReverse = function() {
		this.a.charge -= this.delta;
	};

})(ChemDoodle.uis.actions);
(function(actions, undefined) {
	'use strict';
	actions.ChangeCoordinatesAction = function(as, newCoords) {
		this.as = as;
		this.recs = [];
		for ( let i = 0, ii = this.as.length; i < ii; i++) {
			this.recs[i] = {
				'xo' : this.as[i].x,
				'yo' : this.as[i].y,
				'xn' : newCoords[i].x,
				'yn' : newCoords[i].y
			};
		}
	};
	let _ = actions.ChangeCoordinatesAction.prototype = new actions._Action();
	_.innerForward = function() {
		for ( let i = 0, ii = this.as.length; i < ii; i++) {
			this.as[i].x = this.recs[i].xn;
			this.as[i].y = this.recs[i].yn;
		}
	};
	_.innerReverse = function() {
		for ( let i = 0, ii = this.as.length; i < ii; i++) {
			this.as[i].x = this.recs[i].xo;
			this.as[i].y = this.recs[i].yo;
		}
	};

})(ChemDoodle.uis.actions);
(function(actions, undefined) {
	'use strict';
	actions.ChangeLabelAction = function(a, after) {
		this.a = a;
		this.before = a.label;
		this.after = after;
	};
	let _ = actions.ChangeLabelAction.prototype = new actions._Action();
	_.innerForward = function() {
		this.a.label = this.after;
	};
	_.innerReverse = function() {
		this.a.label = this.before;
	};

})(ChemDoodle.uis.actions);
(function(actions, undefined) {
	'use strict';
	actions.ChangeLonePairAction = function(a, delta) {
		this.a = a;
		this.delta = delta;
	};
	let _ = actions.ChangeLonePairAction.prototype = new actions._Action();
	_.innerForward = function() {
		this.a.numLonePair += this.delta;
	};
	_.innerReverse = function() {
		this.a.numLonePair -= this.delta;
	};

})(ChemDoodle.uis.actions);
(function(actions, undefined) {
	'use strict';
	actions.ChangeQueryAction = function(o, after) {
		this.o = o;
		this.before = o.query;
		this.after = after;
	};
	let _ = actions.ChangeQueryAction.prototype = new actions._Action();
	_.innerForward = function() {
		this.o.query = this.after;
	};
	_.innerReverse = function() {
		this.o.query = this.before;
	};

})(ChemDoodle.uis.actions);
(function(actions, undefined) {
	'use strict';
	actions.ChangeRadicalAction = function(a, delta) {
		this.a = a;
		this.delta = delta;
	};
	let _ = actions.ChangeRadicalAction.prototype = new actions._Action();
	_.innerForward = function() {
		this.a.numRadical += this.delta;
	};
	_.innerReverse = function() {
		this.a.numRadical -= this.delta;
	};

})(ChemDoodle.uis.actions);
(function(actions, Bond, m, undefined) {
	'use strict';
	actions.ChangeVAPOrderAction = function(vap, orderAfter) {
		this.vap = vap;
		this.orderBefore = vap.bondType;
		this.orderAfter = orderAfter;
	};
	let _ = actions.ChangeVAPOrderAction.prototype = new actions._Action();
	_.innerForward = function() {
		this.vap.bondType = this.orderAfter;
	};
	_.innerReverse = function() {
		this.vap.bondType = this.orderBefore;
	};

})(ChemDoodle.uis.actions, ChemDoodle.structures.Bond, Math);
(function(actions, Bond, m, undefined) {
	'use strict';
	actions.ChangeVAPSubstituentAction = function(vap, nsub) {
		this.vap = vap;
		this.nsub = nsub;
		this.orderBefore = vap.bondType;
		this.osub = vap.substituent;
	};
	let _ = actions.ChangeVAPSubstituentAction.prototype = new actions._Action();
	_.innerForward = function() {
		this.vap.bondType = 1;
		this.vap.substituent = this.nsub;
		this.vap.attachments.splice(this.vap.attachments.indexOf(this.nsub), 1);
		if(this.osub){
			this.vap.attachments.push(this.osub);
		}
	};
	_.innerReverse = function() {
		this.vap.bondType = this.orderBefore;
		this.vap.substituent = this.osub;
		if(this.osub){
			this.vap.attachments.pop();
		}
		this.vap.attachments.push(this.nsub);
	};

})(ChemDoodle.uis.actions, ChemDoodle.structures.Bond, Math);
(function(structures, actions, undefined) {
	'use strict';
	actions.ClearAction = function(sketcher) {
		this.sketcher = sketcher;
		this.beforeMols = this.sketcher.molecules;
		this.beforeShapes = this.sketcher.shapes;
		this.sketcher.clear();
		if (this.sketcher.oneMolecule && !this.sketcher.setupScene) {
			this.afterMol = new structures.Molecule();
			this.afterMol.atoms.push(new structures.Atom());
			this.sketcher.molecules.push(this.afterMol);
			this.sketcher.center();
			this.sketcher.repaint();
		}
	};
	let _ = actions.ClearAction.prototype = new actions._Action();
	_.innerForward = function() {
		this.sketcher.molecules = [];
		this.sketcher.shapes = [];
		if (this.sketcher.oneMolecule && !this.sketcher.setupScene) {
			this.sketcher.molecules.push(this.afterMol);
		}
	};
	_.innerReverse = function() {
		this.sketcher.molecules = this.beforeMols;
		this.sketcher.shapes = this.beforeShapes;
	};

})(ChemDoodle.structures, ChemDoodle.uis.actions);
(function(actions, undefined) {
	'use strict';
	actions.DeleteAction = function(sketcher, a, as, bs) {
		this.sketcher = sketcher;
		this.a = a;
		this.as = as;
		this.bs = bs;
		this.ss = [];
	};
	let _ = actions.DeleteAction.prototype = new actions._Action();
	_.innerForwardAReverse = actions.AddAction.prototype.innerReverse;
	_.innerReverseAForward = actions.AddAction.prototype.innerForward;
	_.innerForward = function() {
		this.innerForwardAReverse();
		for ( let i = 0, ii = this.ss.length; i < ii; i++) {
			this.sketcher.removeShape(this.ss[i]);
		}
	};
	_.innerReverse = function() {
		this.innerReverseAForward();
		if (this.ss.length > 0) {
			this.sketcher.shapes = this.sketcher.shapes.concat(this.ss);
		}
	};

})(ChemDoodle.uis.actions);

(function(informatics, actions, undefined) {
	'use strict';
	actions.DeleteContentAction = function(sketcher, as, ss) {
		this.sketcher = sketcher;
		this.as = as;
		this.ss = ss;
		this.bs = [];
		for ( let i = 0, ii = this.sketcher.molecules.length; i < ii; i++) {
			let mol = this.sketcher.molecules[i];
			for ( let j = 0, jj = mol.bonds.length; j < jj; j++) {
				let b = mol.bonds[j];
				if (b.a1.isLassoed || b.a2.isLassoed) {
					this.bs.push(b);
				}
			}
		}
	};
	let _ = actions.DeleteContentAction.prototype = new actions._Action();
	_.innerForward = function() {
		for ( let i = 0, ii = this.ss.length; i < ii; i++) {
			this.sketcher.removeShape(this.ss[i]);
		}
		let asKeep = [];
		let bsKeep = [];
		for ( let i = 0, ii = this.sketcher.molecules.length; i < ii; i++) {
			let mol = this.sketcher.molecules[i];
			for ( let j = 0, jj = mol.atoms.length; j < jj; j++) {
				let a = mol.atoms[j];
				if (this.as.indexOf(a) === -1) {
					asKeep.push(a);
				}
			}
			for ( let j = 0, jj = mol.bonds.length; j < jj; j++) {
				let b = mol.bonds[j];
				if (this.bs.indexOf(b) === -1) {
					bsKeep.push(b);
				}
			}
		}
		this.sketcher.molecules = new informatics.Splitter().split({
			atoms : asKeep,
			bonds : bsKeep
		});
	};
	_.innerReverse = function() {
		this.sketcher.shapes = this.sketcher.shapes.concat(this.ss);
		let asKeep = [];
		let bsKeep = [];
		for ( let i = 0, ii = this.sketcher.molecules.length; i < ii; i++) {
			let mol = this.sketcher.molecules[i];
			asKeep = asKeep.concat(mol.atoms);
			bsKeep = bsKeep.concat(mol.bonds);
		}
		this.sketcher.molecules = new informatics.Splitter().split({
			atoms : asKeep.concat(this.as),
			bonds : bsKeep.concat(this.bs)
		});
	};

})(ChemDoodle.informatics, ChemDoodle.uis.actions);
(function(actions, undefined) {
	'use strict';
	actions.DeleteShapeAction = function(sketcher, s) {
		this.sketcher = sketcher;
		this.s = s;
	};
	let _ = actions.DeleteShapeAction.prototype = new actions._Action();
	_.innerForward = actions.AddShapeAction.prototype.innerReverse;
	_.innerReverse = actions.AddShapeAction.prototype.innerForward;

})(ChemDoodle.uis.actions);
(function(actions, undefined) {
	'use strict';
	actions.DeleteVAPConnectionAction = function(vap, connection) {
		this.vap = vap;
		this.connection = connection;
		this.substituent = vap.substituent===connection;
	};
	let _ = actions.DeleteVAPConnectionAction.prototype = new actions._Action();
	_.innerForward = function() {
		if(this.substituent){
			this.vap.substituent = undefined;
		}else{
			this.vap.attachments.splice(this.vap.attachments.indexOf(this.connection), 1);
		}
	};
	_.innerReverse = function() {
		if(this.substituent){
			this.vap.substituent = this.connection;
		}else{
			this.vap.attachments.push(this.connection);
		}
	};

})(ChemDoodle.uis.actions);
(function(structures, actions, m, undefined) {
	'use strict';
	actions.FlipAction = function(ps, bs, horizontal) {
		this.ps = ps;
		this.bs = bs;
		let minX = Infinity, minY = Infinity;
		let maxX = -Infinity, maxY = -Infinity;
		for ( let i = 0, ii = this.ps.length; i < ii; i++) {
			minX = m.min(this.ps[i].x, minX);
			minY = m.min(this.ps[i].y, minY);
			maxX = m.max(this.ps[i].x, maxX);
			maxY = m.max(this.ps[i].y, maxY);
		}
		this.center = new structures.Point((maxX + minX) / 2, (maxY + minY) / 2);
		this.horizontal = horizontal;		
	};
	let _ = actions.FlipAction.prototype = new actions._Action();
	_.innerForward = _.innerReverse = function() {
		for ( let i = 0, ii = this.ps.length; i < ii; i++) {
			let p = this.ps[i];
			if(this.horizontal){
				p.x += 2*(this.center.x-p.x);
			}else{
				p.y += 2*(this.center.y-p.y);
			}
		}
		for(let i = 0, ii = this.bs.length; i<ii; i++){
			let b = this.bs[i];
			if(b.stereo===structures.Bond.STEREO_PROTRUDING){
				b.stereo = structures.Bond.STEREO_RECESSED;
			}else if(b.stereo===structures.Bond.STEREO_RECESSED){
				b.stereo = structures.Bond.STEREO_PROTRUDING;
			}
		}
	};

})(ChemDoodle.structures, ChemDoodle.uis.actions, Math);
(function(actions, undefined) {
	'use strict';
	actions.FlipBondAction = function(b) {
		this.b = b;
	};
	let _ = actions.FlipBondAction.prototype = new actions._Action();
	_.innerForward = function() {
		let temp = this.b.a1;
		this.b.a1 = this.b.a2;
		this.b.a2 = temp;
	};
	_.innerReverse = function() {
		this.innerForward();
	};

})(ChemDoodle.uis.actions);
(function(actions, undefined) {
	'use strict';
	actions.FlipDynamicBracketAction = function(b) {
		this.b = b;
	};
	let _ = actions.FlipDynamicBracketAction.prototype = new actions._Action();
	_.innerReverse = _.innerForward = function() {
		this.b.flip = !this.b.flip;
	};

})(ChemDoodle.uis.actions);
(function(actions, undefined) {
	'use strict';
	actions.MoveAction = function(ps, dif) {
		this.ps = ps;
		this.dif = dif;
	};
	let _ = actions.MoveAction.prototype = new actions._Action();
	_.innerForward = function() {
		for ( let i = 0, ii = this.ps.length; i < ii; i++) {
			this.ps[i].add(this.dif);
		}
	};
	_.innerReverse = function() {
		for ( let i = 0, ii = this.ps.length; i < ii; i++) {
			this.ps[i].sub(this.dif);
		}
	};

})(ChemDoodle.uis.actions);

(function(structures, actions, undefined) {
	'use strict';
	actions.NewMoleculeAction = function(sketcher, as, bs) {
		this.sketcher = sketcher;
		this.as = as;
		this.bs = bs;
	};
	let _ = actions.NewMoleculeAction.prototype = new actions._Action();
	_.innerForward = function() {
		let mol = new structures.Molecule();
		mol.atoms = mol.atoms.concat(this.as);
		mol.bonds = mol.bonds.concat(this.bs);
		mol.check();
		this.sketcher.addMolecule(mol);
	};
	_.innerReverse = function() {
		this.sketcher.removeMolecule(this.sketcher.getMoleculeByAtom(this.as[0]));
	};

})(ChemDoodle.structures, ChemDoodle.uis.actions);
(function(actions, m, undefined) {
	'use strict';
	actions.RotateAction = function(ps, dif, center) {
		this.ps = ps;
		this.dif = dif;
		this.center = center;
	};
	let _ = actions.RotateAction.prototype = new actions._Action();
	_.innerForward = function() {
		for ( let i = 0, ii = this.ps.length; i < ii; i++) {
			let p = this.ps[i];
			let dist = this.center.distance(p);
			let angle = this.center.angle(p) + this.dif;
			p.x = this.center.x + dist * m.cos(angle);
			p.y = this.center.y - dist * m.sin(angle);
		}
	};
	_.innerReverse = function() {
		for ( let i = 0, ii = this.ps.length; i < ii; i++) {
			let p = this.ps[i];
			let dist = this.center.distance(p);
			let angle = this.center.angle(p) - this.dif;
			p.x = this.center.x + dist * m.cos(angle);
			p.y = this.center.y - dist * m.sin(angle);
		}
	};

})(ChemDoodle.uis.actions, Math);

(function(actions, undefined) {
	'use strict';
	actions.SwitchContentAction = function(sketcher, mols, shapes) {
		this.sketcher = sketcher;
		this.beforeMols = this.sketcher.molecules;
		this.beforeShapes = this.sketcher.shapes;
		this.molsA = mols;
		this.shapesA = shapes;
	};
	let _ = actions.SwitchContentAction.prototype = new actions._Action();
	_.innerForward = function() {
		this.sketcher.loadContent(this.molsA, this.shapesA);
	};
	_.innerReverse = function() {
		this.sketcher.molecules = this.beforeMols;
		this.sketcher.shapes = this.beforeShapes;
	};

})(ChemDoodle.uis.actions);

(function(actions, undefined) {
	'use strict';
	actions.SwitchMoleculeAction = function(sketcher, mol) {
		this.sketcher = sketcher;
		this.beforeMols = this.sketcher.molecules;
		this.beforeShapes = this.sketcher.shapes;
		this.molA = mol;
	};
	let _ = actions.SwitchMoleculeAction.prototype = new actions._Action();
	_.innerForward = function() {
		this.sketcher.loadMolecule(this.molA);
	};
	_.innerReverse = function() {
		this.sketcher.molecules = this.beforeMols;
		this.sketcher.shapes = this.beforeShapes;
	};

})(ChemDoodle.uis.actions);

(function(actions, undefined) {
	'use strict';
	actions.HistoryManager = function(sketcher) {
		this.sketcher = sketcher;
		this.undoStack = [];
		this.redoStack = [];
	};
	let _ = actions.HistoryManager.prototype;
	_.undo = function() {
		if (this.undoStack.length !== 0) {
			if (this.sketcher.lasso && this.sketcher.lasso.isActive()) {
				this.sketcher.lasso.empty();
			}
			let a = this.undoStack.pop();
			a.reverse(this.sketcher);
			this.redoStack.push(a);
			if (this.undoStack.length === 0) {
				this.sketcher.toolbarManager.buttonUndo.disable();
			}
			this.sketcher.toolbarManager.buttonRedo.enable();
		}
	};
	_.redo = function() {
		if (this.redoStack.length !== 0) {
			if (this.sketcher.lasso && this.sketcher.lasso.isActive()) {
				this.sketcher.lasso.empty();
			}
			let a = this.redoStack.pop();
			a.forward(this.sketcher);
			this.undoStack.push(a);
			this.sketcher.toolbarManager.buttonUndo.enable();
			if (this.redoStack.length === 0) {
				this.sketcher.toolbarManager.buttonRedo.disable();
			}
		}
	};
	_.pushUndo = function(a) {
		a.forward(this.sketcher);
		this.undoStack.push(a);
		if (this.redoStack.length !== 0) {
			this.redoStack = [];
		}
		this.sketcher.toolbarManager.buttonUndo.enable();
		this.sketcher.toolbarManager.buttonRedo.disable();
	};
	_.clear = function() {
		if (this.undoStack.length !== 0) {
			this.undoStack = [];
			this.sketcher.toolbarManager.buttonUndo.disable();
		}
		if (this.redoStack.length !== 0) {
			this.redoStack = [];
			this.sketcher.toolbarManager.buttonRedo.disable();
		}
	};

})(ChemDoodle.uis.actions);

(function(math, monitor, actions, states, desktop, structures, d2, SYMBOLS, m, window, undefined) {
	'use strict';
	states._State = function() {
	};
	let _ = states._State.prototype;
	_.setup = function(sketcher) {
		this.sketcher = sketcher;
	};

	_.clearHover = function() {
		if (this.sketcher.hovering) {
			this.sketcher.hovering.isHover = false;
			this.sketcher.hovering.isSelected = false;
			this.sketcher.hovering = undefined;
		}
	};
	_.findHoveredObject = function(e, includeAtoms, includeBonds, includeShapes) {
		this.clearHover();
		let min = Infinity;
		let hovering;
		let hoverdist = 10;
		if (!this.sketcher.isMobile) {
			hoverdist /= this.sketcher.styles.scale;
		}
		if (includeAtoms) {
			for ( let i = 0, ii = this.sketcher.molecules.length; i < ii; i++) {
				let mol = this.sketcher.molecules[i];
				for ( let j = 0, jj = mol.atoms.length; j < jj; j++) {
					let a = mol.atoms[j];
					a.isHover = false;
					let dist = e.p.distance(a);
					if (dist < hoverdist && dist < min) {
						min = dist;
						hovering = a;
					}
				}
			}
		}
		if (includeBonds) {
			for ( let i = 0, ii = this.sketcher.molecules.length; i < ii; i++) {
				let mol = this.sketcher.molecules[i];
				for ( let j = 0, jj = mol.bonds.length; j < jj; j++) {
					let b = mol.bonds[j];
					b.isHover = false;
					let dist = math.distanceFromPointToLineInclusive(e.p, b.a1, b.a2, hoverdist/2);
					if (dist !== -1 && dist < hoverdist && dist < min) {
						min = dist;
						hovering = b;
					}
				}
			}
		}
		if (includeShapes) {
			for ( let i = 0, ii = this.sketcher.shapes.length; i < ii; i++) {
				let s = this.sketcher.shapes[i];
				s.isHover = false;
				s.hoverPoint = undefined;
				if(this instanceof states.DynamicBracketState && (!(s instanceof d2.DynamicBracket) || !s.contents.flippable)){
					continue;
				}
				let sps = s.getPoints();
				for ( let j = 0, jj = sps.length; j < jj; j++) {
					let p = sps[j];
					let dist = e.p.distance(p);
					if (dist < hoverdist && dist < min) {
						min = dist;
						hovering = s;
						s.hoverPoint = p;
					}
				}
				if(this instanceof states.EraseState && s instanceof d2.VAP){
					s.hoverBond = undefined;
					// check vap bonds only in the erase state
					if(s.substituent){
						let att = s.substituent;
						let dist = e.p.distance(new structures.Point((s.asterisk.x + att.x) / 2, (s.asterisk.y + att.y) / 2));
						if (dist < hoverdist && dist < min) {
							min = dist;
							s.hoverBond = att;
							hovering = s;
						}
					}
					for ( let j = 0, jj = s.attachments.length; j < jj; j++) {
						let att = s.attachments[j];
						let dist = e.p.distance(new structures.Point((s.asterisk.x + att.x) / 2, (s.asterisk.y + att.y) / 2));
						if (dist < hoverdist && dist < min) {
							min = dist;
							s.hoverBond = att;
							hovering = s;
						}
					}
				}
			}
			if (!hovering) {
				// find smallest shape pointer is over
				for ( let i = 0, ii = this.sketcher.shapes.length; i < ii; i++) {
					let s = this.sketcher.shapes[i];
					if (s.isOver(e.p, hoverdist)) {
						hovering = s;
					}
				}
			}
		}
		if (hovering) {
			hovering.isHover = true;
			this.sketcher.hovering = hovering;
		}
	};
	_.getOptimumAngle = function(a, order) {
		let mol = this.sketcher.getMoleculeByAtom(a);
		let angles = mol.getAngles(a);
		let angle = 0;
		if (angles.length === 0) {
			angle = m.PI / 6;
		} else if (angles.length === 1) {
			let b;
			for ( let j = 0, jj = mol.bonds.length; j < jj; j++) {
				if (mol.bonds[j].contains(this.sketcher.hovering)) {
					b = mol.bonds[j];
				}
			}
			if (b.bondOrder >= 3 || order>=3) {
				angle = angles[0] + m.PI;
			} else {
				let concerned = angles[0] % m.PI * 2;
				if (math.isBetween(concerned, 0, m.PI / 2) || math.isBetween(concerned, m.PI, 3 * m.PI / 2)) {
					angle = angles[0] + 2 * m.PI / 3;
				} else {
					angle = angles[0] - 2 * m.PI / 3;
				}
			}
		} else {
			// avoid inside rings
			let modded;
			for ( let j = 0, jj = mol.rings.length; j < jj; j++) {
				let r = mol.rings[j];
				if(r.atoms.indexOf(a)!==-1){
					angles.push(a.angle(r.getCenter()));
					modded = true;
				}
			}
			if(modded){
				angles.sort(function(a, b) {
					return a - b;
				});
			}
			angle = math.angleBetweenLargest(angles).angle;
		}
		return angle;
	};
	_.removeStartAtom = function() {
		if (this.sketcher.startAtom) {
			this.sketcher.startAtom.x = -10;
			this.sketcher.startAtom.y = -10;
			this.sketcher.repaint();
		}
	};
	_.placeRequiredAtom = function(e){
		let a = new structures.Atom('C', e.p.x, e.p.y);
		this.sketcher.hovering = a;
		this.sketcher.hovering.isHover = true;
		this.sketcher.historyManager.pushUndo(new actions.NewMoleculeAction(this.sketcher, [ a ], []));
		this.innermousedown(e);
	};

	_.enter = function() {
		if (this.innerenter) {
			this.innerenter();
		}
	};
	_.exit = function() {
		if (this.innerexit) {
			this.innerexit();
		}
	};
	_.click = function(e) {
		if (this.innerclick) {
			this.innerclick(e);
		}
	};
	_.rightclick = function(e) {
		if (this.innerrightclick) {
			this.innerrightclick(e);
		}
	};
	_.dblclick = function(e) {
		if (this.innerdblclick) {
			this.innerdblclick(e);
		}
		if (!this.sketcher.hovering && this.sketcher.oneMolecule) {
			// center structure
			this.sketcher.toolbarManager.buttonCenter.func();
		}
	};
	_.mousedown = function(e) {
		this.sketcher.lastPoint = e.p;
		// must also check for mobile hits here to the help button
		if (this.sketcher.isHelp || this.sketcher.isMobile && e.op.distance(new structures.Point(this.sketcher.width - 20, 20)) < 10) {
			this.sketcher.isHelp = false;
			this.sketcher.lastPoint = undefined;
			this.sketcher.repaint();
			// window.open doesn't work once Event.preventDefault() has been called
			location.href='https://web.chemdoodle.com/demos/2d-sketcher';
			//window.open('https://web.chemdoodle.com/demos/2d-sketcher', '_blank');
		} else if (this.innermousedown) {
			this.innermousedown(e);
		}
	};
	_.rightmousedown = function(e) {
		if (this.innerrightmousedown) {
			this.innerrightmousedown(e);
		}
	};
	_.mousemove = function(e) {
		// lastMousePos is really only used for pasting
		this.sketcher.lastMousePos = e.p;
		if (this.innermousemove) {
			this.innermousemove(e);
		}
		// call the repaint here to repaint the help button, also this is called
		// by other functions, so the repaint must be here
		this.sketcher.repaint();
	};
	_.mouseout = function(e) {
		this.sketcher.lastMousePos = undefined;
		if (this.innermouseout) {
			this.innermouseout(e);
		}
		if (this.sketcher.isHelp) {
			this.sketcher.isHelp = false;
			this.sketcher.repaint();
		}
		if (this.sketcher.hovering && monitor.CANVAS_DRAGGING != this.sketcher) {
			this.sketcher.hovering = undefined;
			this.sketcher.repaint();
		}
	};
	_.mouseover = function(e) {
		if (this.innermouseover) {
			this.innermouseover(e);
		}
	};
	_.mouseup = function(e) {
		this.parentAction = undefined;
		if (this.innermouseup) {
			this.innermouseup(e);
		}
	};
	_.rightmouseup = function(e) {
		if (this.innerrightmouseup) {
			this.innerrightmouseup(e);
		}
	};
	_.mousewheel = function(e, delta) {
		if (this.innermousewheel) {
			this.innermousewheel(e);
		}
		this.sketcher.styles.scale += delta / 50;
		this.sketcher.checkScale();
		this.sketcher.repaint();
	};
	_.drag = function(e) {
		if (this.innerdrag) {
			this.innerdrag(e);
		}
		if (!this.sketcher.hovering && !this.dontTranslateOnDrag) {
			if (monitor.SHIFT) {
				// rotate structure
				if (this.parentAction) {
					let center = this.parentAction.center;
					let oldAngle = center.angle(this.sketcher.lastPoint);
					let newAngle = center.angle(e.p);
					let rot = newAngle - oldAngle;
					this.parentAction.dif += rot;
					for ( let i = 0, ii = this.parentAction.ps.length; i < ii; i++) {
						let a = this.parentAction.ps[i];
						let dist = center.distance(a);
						let angle = center.angle(a) + rot;
						a.x = center.x + dist * m.cos(angle);
						a.y = center.y - dist * m.sin(angle);
					}
					// must check here as change is outside of an action
					for ( let i = 0, ii = this.sketcher.molecules.length; i < ii; i++) {
						this.sketcher.molecules[i].check();
					}
				} else {
					let center = new structures.Point(this.sketcher.width / 2, this.sketcher.height / 2);
					let oldAngle = center.angle(this.sketcher.lastPoint);
					let newAngle = center.angle(e.p);
					let rot = newAngle - oldAngle;
					this.parentAction = new actions.RotateAction(this.sketcher.getAllPoints(), rot, center);
					this.sketcher.historyManager.pushUndo(this.parentAction);
				}
			} else {
				if (!this.sketcher.lastPoint) {
					// this prevents the structure from being rotated and
					// translated at the same time while a gesture is occuring,
					// which is preferable based on use cases since the rotation
					// center is the canvas center
					return;
				}
				// move structure
				let dif = new structures.Point(e.p.x, e.p.y);
				dif.sub(this.sketcher.lastPoint);
				if (this.parentAction) {
					this.parentAction.dif.add(dif);
					for ( let i = 0, ii = this.parentAction.ps.length; i < ii; i++) {
						this.parentAction.ps[i].add(dif);
					}
					if (this.sketcher.lasso && this.sketcher.lasso.isActive()) {
						this.sketcher.lasso.bounds.minX += dif.x;
						this.sketcher.lasso.bounds.maxX += dif.x;
						this.sketcher.lasso.bounds.minY += dif.y;
						this.sketcher.lasso.bounds.maxY += dif.y;
					}
					// must check here as change is outside of an action
					for ( let i = 0, ii = this.sketcher.molecules.length; i < ii; i++) {
						this.sketcher.molecules[i].check();
					}
				} else {
					this.parentAction = new actions.MoveAction(this.sketcher.getAllPoints(), dif);
					this.sketcher.historyManager.pushUndo(this.parentAction);
				}
			}
			this.sketcher.repaint();
		}
		this.sketcher.lastPoint = e.p;
	};
	_.keydown = function(e) {
		if (monitor.CANVAS_DRAGGING === this.sketcher) {
			if (this.sketcher.lastPoint) {
				// create a copy, as the drag function may alter the point
				e.p = new structures.Point(this.sketcher.lastPoint.x, this.sketcher.lastPoint.y);
				this.drag(e);
			}
		} else if (monitor.META) {
			if (e.which === 90) {
				// z
				this.sketcher.historyManager.undo();
			} else if (e.which === 89) {
				// y
				this.sketcher.historyManager.redo();
			} else if (e.which === 83) {
				// s
				this.sketcher.toolbarManager.buttonSave.func();
			} else if (e.which === 79) {
				// o
				this.sketcher.toolbarManager.buttonOpen.func();
			} else if (e.which === 78) {
				// n
				this.sketcher.toolbarManager.buttonClear.func();
			} else if (e.which === 187 || e.which === 61) {
				// +
				this.sketcher.toolbarManager.buttonScalePlus.func();
			} else if (e.which === 189 || e.which === 109) {
				// -
				this.sketcher.toolbarManager.buttonScaleMinus.func();
			} else if (e.which === 65) {
				// a
				if (!this.sketcher.oneMolecule) {
					this.sketcher.toolbarManager.buttonLasso.select();
					this.sketcher.toolbarManager.buttonLasso.getElement().click();
					this.sketcher.lasso.select(this.sketcher.getAllAtoms(), this.sketcher.shapes);
				}
			} else if (e.which === 88) {
				// x
				this.sketcher.copyPasteManager.copy(true);
			} else if (e.which === 67) {
				// c
				this.sketcher.copyPasteManager.copy(false);
			} else if (e.which === 86) {
				// v
				this.sketcher.copyPasteManager.paste();
			}
		} else if (e.which === 9) {
			// tab
			if (!this.sketcher.oneMolecule) {
				this.sketcher.lasso.block = true;
				this.sketcher.toolbarManager.buttonLasso.select();
				this.sketcher.toolbarManager.buttonLasso.getElement().click();
				this.sketcher.lasso.block = false;
				if (monitor.SHIFT) {
					this.sketcher.lasso.selectNextShape();
				} else {
					this.sketcher.lasso.selectNextMolecule();
				}
			}
		} else if (e.which === 32) {
			// space key
			if (this.sketcher.lasso) {
				this.sketcher.lasso.empty();
			}
			if(this.sketcher.hovering instanceof structures.Atom){
				if(desktop.TextInput){
					this.sketcher.stateManager.STATE_TEXT_INPUT.innerclick(e);
				}
			}else if(this.sketcher.stateManager.getCurrentState() === this.sketcher.stateManager.STATE_LASSO){
				if(this.sketcher.floatDrawTools){
					this.sketcher.toolbarManager.buttonBond.getLabelElement().click();
					this.sketcher.toolbarManager.buttonBond.getElement().click();
				}else{
					this.sketcher.toolbarManager.buttonSingle.getElement().click();
				}
			}
		} else if (e.which === 13) {
			// enter or return key
			if(this.sketcher.hovering instanceof structures.Atom && this.sketcher.stateManager.STATE_TEXT_INPUT.lastLabel && this.sketcher.stateManager.STATE_TEXT_INPUT.lastLabel !== this.sketcher.hovering.label){
				this.sketcher.historyManager.pushUndo(new actions.ChangeLabelAction(this.sketcher.hovering, this.sketcher.stateManager.STATE_TEXT_INPUT.lastLabel));
			}
		} else if (e.which >= 37 && e.which <= 40) {
			// arrow keys
			let dif = new structures.Point();
			switch (e.which) {
			case 37:
				dif.x = -10;
				break;
			case 38:
				dif.y = -10;
				break;
			case 39:
				dif.x = 10;
				break;
			case 40:
				dif.y = 10;
				break;
			}
			this.sketcher.historyManager.pushUndo(new actions.MoveAction(this.sketcher.lasso && this.sketcher.lasso.isActive() ? this.sketcher.lasso.getAllPoints() : this.sketcher.getAllPoints(), dif));
		} else if (e.which === 187 || e.which === 189 || e.which === 61 || e.which === 109) {
			// plus or minus
			if (this.sketcher.hovering && this.sketcher.hovering instanceof structures.Atom) {
				this.sketcher.historyManager.pushUndo(new actions.ChangeChargeAction(this.sketcher.hovering, e.which === 187 || e.which === 61 ? 1 : -1));
			}
		} else if (e.which === 8 || e.which === 46) {
			// delete or backspace
			this.sketcher.stateManager.STATE_ERASE.handleDelete();
		} else if (e.which >= 48 && e.which <= 57) {
			// digits
			if (this.sketcher.hovering) {
				let number = e.which - 48;
				let molIdentifier;
				let as = [];
				let bs = [];
				if (this.sketcher.hovering instanceof structures.Atom) {
					molIdentifier = this.sketcher.hovering;
					if (monitor.SHIFT) {
						if (number > 2 && number < 9) {
							let mol = this.sketcher.getMoleculeByAtom(this.sketcher.hovering);
							let angles = mol.getAngles(this.sketcher.hovering);
							let angle = 3 * m.PI / 2;
							if (angles.length !== 0) {
								angle = math.angleBetweenLargest(angles).angle;
							}
							let ring = this.sketcher.stateManager.STATE_NEW_RING.getRing(this.sketcher.hovering, number, this.sketcher.styles.bondLength_2D, angle, false);
							if (mol.atoms.indexOf(ring[0]) === -1) {
								as.push(ring[0]);
							}
							if (!this.sketcher.bondExists(this.sketcher.hovering, ring[0])) {
								bs.push(new structures.Bond(this.sketcher.hovering, ring[0]));
							}
							for ( let i = 1, ii = ring.length; i < ii; i++) {
								if (mol.atoms.indexOf(ring[i]) === -1) {
									as.push(ring[i]);
								}
								if (!this.sketcher.bondExists(ring[i - 1], ring[i])) {
									bs.push(new structures.Bond(ring[i - 1], ring[i]));
								}
							}
							if (!this.sketcher.bondExists(ring[ring.length - 1], this.sketcher.hovering)) {
								bs.push(new structures.Bond(ring[ring.length - 1], this.sketcher.hovering));
							}
						}
					} else {
						if (number === 0) {
							number = 10;
						}
						let p = new structures.Point(this.sketcher.hovering.x, this.sketcher.hovering.y);
						let a = this.getOptimumAngle(this.sketcher.hovering);
						let prev = this.sketcher.hovering;
						for ( let k = 0; k < number; k++) {
							let ause = a + (k % 2 === 1 ? m.PI / 3 : 0);
							p.x += this.sketcher.styles.bondLength_2D * m.cos(ause);
							p.y -= this.sketcher.styles.bondLength_2D * m.sin(ause);
							let use = new structures.Atom('C', p.x, p.y);
							let minDist = Infinity;
							let closest;
							for ( let i = 0, ii = this.sketcher.molecules.length; i < ii; i++) {
								let mol = this.sketcher.molecules[i];
								for ( let j = 0, jj = mol.atoms.length; j < jj; j++) {
									let at = mol.atoms[j];
									let dist = at.distance(use);
									if (dist < minDist) {
										minDist = dist;
										closest = at;
									}
								}
							}
							if (minDist < 5) {
								use = closest;
							} else {
								as.push(use);
							}
							if (!this.sketcher.bondExists(prev, use)) {
								bs.push(new structures.Bond(prev, use));
							}
							prev = use;
						}
					}
				} else if (this.sketcher.hovering instanceof structures.Bond) {
					molIdentifier = this.sketcher.hovering.a1;
					if (monitor.SHIFT) {
						if (number > 2 && number < 9) {
							let ring = this.sketcher.stateManager.STATE_NEW_RING.getOptimalRing(this.sketcher.hovering, number);
							let start = this.sketcher.hovering.a2;
							let end = this.sketcher.hovering.a1;
							let mol = this.sketcher.getMoleculeByAtom(start);
							if (ring[0] === this.sketcher.hovering.a1) {
								start = this.sketcher.hovering.a1;
								end = this.sketcher.hovering.a2;
							}
							if (mol.atoms.indexOf(ring[1]) === -1) {
								as.push(ring[1]);
							}
							if (!this.sketcher.bondExists(start, ring[1])) {
								bs.push(new structures.Bond(start, ring[1]));
							}
							for ( let i = 2, ii = ring.length; i < ii; i++) {
								if (mol.atoms.indexOf(ring[i]) === -1) {
									as.push(ring[i]);
								}
								if (!this.sketcher.bondExists(ring[i - 1], ring[i])) {
									bs.push(new structures.Bond(ring[i - 1], ring[i]));
								}
							}
							if (!this.sketcher.bondExists(ring[ring.length - 1], end)) {
								bs.push(new structures.Bond(ring[ring.length - 1], end));
							}
						}
					} else if (number > 0 && number < 4 && this.sketcher.hovering.bondOrder !== number) {
						this.sketcher.historyManager.pushUndo(new actions.ChangeBondAction(this.sketcher.hovering, number, structures.Bond.STEREO_NONE));
					} else if (number === 7 || number === 8) {
						let stereo = structures.Bond.STEREO_RECESSED;
						if(number===7){
							stereo = structures.Bond.STEREO_PROTRUDING;
						}
						this.sketcher.historyManager.pushUndo(new actions.ChangeBondAction(this.sketcher.hovering, 1, stereo));
					}
				}
				if (as.length !== 0 || bs.length !== 0) {
					this.sketcher.historyManager.pushUndo(new actions.AddAction(this.sketcher, molIdentifier, as, bs));
				}
			}
		} else if (e.which >= 65 && e.which <= 90) {
			// alphabet
			if (this.sketcher.hovering) {
				if (this.sketcher.hovering instanceof structures.Atom) {
					let check = String.fromCharCode(e.which);
					let firstMatch;
					let firstAfterMatch;
					let found = false;
					for ( let j = 0, jj = SYMBOLS.length; j < jj; j++) {
						if (this.sketcher.hovering.label.charAt(0) === check) {
							if (SYMBOLS[j] === this.sketcher.hovering.label) {
								found = true;
							} else if (SYMBOLS[j].charAt(0) === check) {
								if (found && !firstAfterMatch) {
									firstAfterMatch = SYMBOLS[j];
								} else if (!firstMatch) {
									firstMatch = SYMBOLS[j];
								}
							}
						} else {
							if (SYMBOLS[j].charAt(0) === check) {
								firstMatch = SYMBOLS[j];
								break;
							}
						}
					}
					let use = 'C';
					if (firstAfterMatch) {
						use = firstAfterMatch;
					} else if (firstMatch) {
						use = firstMatch;
					}
					if (use !== this.sketcher.hovering.label) {
						this.sketcher.historyManager.pushUndo(new actions.ChangeLabelAction(this.sketcher.hovering, use));
					}
				} else if (this.sketcher.hovering instanceof structures.Bond) {
					if (e.which === 70) {
						// f
						this.sketcher.historyManager.pushUndo(new actions.FlipBondAction(this.sketcher.hovering));
					}
				}
			}
		}
		if (this.innerkeydown) {
			this.innerkeydown(e);
		}
	};
	_.keypress = function(e) {
		if (this.innerkeypress) {
			this.innerkeypress(e);
		}
	};
	_.keyup = function(e) {
		if (monitor.CANVAS_DRAGGING === this.sketcher) {
			if (this.sketcher.lastPoint) {
				// create a copy, as the drag function may alter the point
				e.p = new structures.Point(this.sketcher.lastPoint.x, this.sketcher.lastPoint.y);
				this.sketcher.drag(e);
			}
		}
		if (this.innerkeyup) {
			this.innerkeyup(e);
		}
	};

})(ChemDoodle.math, ChemDoodle.monitor, ChemDoodle.uis.actions, ChemDoodle.uis.states, ChemDoodle.uis.gui.desktop, ChemDoodle.structures, ChemDoodle.structures.d2, ChemDoodle.SYMBOLS, Math, window);

(function(actions, states, undefined) {
	'use strict';
	states.ChargeState = function(sketcher) {
		this.setup(sketcher);
	};
	let _ = states.ChargeState.prototype = new states._State();
	_.delta = 1;
	_.innermouseup = function(e) {
		if (this.sketcher.hovering) {
			this.sketcher.historyManager.pushUndo(new actions.ChangeChargeAction(this.sketcher.hovering, this.delta));
		}
	};
	_.innermousemove = function(e) {
		this.findHoveredObject(e, true, false);
	};

})(ChemDoodle.uis.actions, ChemDoodle.uis.states);

(function(extensions, math, structures, d2, actions, states, m, undefined) {
	'use strict';
	let controlsize = 4;
	
	states.DynamicBracketState = function(sketcher) {
		this.setup(sketcher);
		this.dontTranslateOnDrag = true;
	};
	let _ = states.DynamicBracketState.prototype = new states._State();
	_.superDoubleClick = _.dblclick;
	_.dblclick = function(e) {
		// override double click not to center when editing controls
		if (!this.control) {
			this.superDoubleClick(e);
		}
	};
	_.innermousedown = function(e) {
		if (this.control) {
			// this part controls the limits
			let cont = true;
			let c = this.control.t > 0 ? 1 : -1;
			switch (m.abs(this.control.t)) {
			case 1:{
					let nn = this.control.s.n1 + c;
					if(nn<0 || nn>this.control.s.n2){
						cont = false;
					}
					break;
				}
			case 2:{
					let nn = this.control.s.n2 + c;
					if(nn>20 || nn<this.control.s.n1){
						cont = false;
					}
					break;
				}
			}
			if(cont){
				this.sketcher.historyManager.pushUndo(new actions.ChangeDynamicBracketAttributeAction(this.control.s, this.control.t));
				this.sketcher.repaint();
			}
		} else if (this.sketcher.hovering && this.start!==this.sketcher.hovering && this.sketcher.hovering instanceof structures.Bond) {
			if(!this.start){
				this.start = this.sketcher.hovering;
			}
		}else{
			this.start = undefined;
			this.end = undefined;
			this.sketcher.repaint();
		}
	};
	_.innerdrag = function(e) {
		this.control = undefined;
		if (this.start) {
			this.end = new structures.Point(e.p.x, e.p.y);
			this.findHoveredObject(e, false, true);
			this.sketcher.repaint();
		}
	};
	_.innermouseup = function(e) {
		if (this.start && this.sketcher.hovering && this.sketcher.hovering !== this.start) {
			let dup;
			let remove = false;
			for ( let i = 0, ii = this.sketcher.shapes.length; i < ii; i++) {
				let s = this.sketcher.shapes[i];
				if (s instanceof d2.DynamicBracket) {
					if (s.b1 === this.start && s.b2 === this.sketcher.hovering || s.b2 === this.start && s.b1 === this.sketcher.hovering) {
						dup = s;
						remove = true;
					}
				}
			}
			if (dup) {
				if (remove) {
					this.sketcher.historyManager.pushUndo(new actions.DeleteShapeAction(this.sketcher, dup));
				}
				this.start = undefined;
				this.end = undefined;
				this.sketcher.repaint();
			} else {
				let shape = new d2.DynamicBracket(this.start, this.sketcher.hovering);
				this.start = undefined;
				this.end = undefined;
				this.sketcher.historyManager.pushUndo(new actions.AddShapeAction(this.sketcher, shape));
			}
		} else if(this.sketcher.hovering instanceof d2.DynamicBracket){
			this.sketcher.historyManager.pushUndo(new actions.FlipDynamicBracketAction(this.sketcher.hovering));
		} else {
			//this.start = undefined;
			//this.end = undefined;
			//this.sketcher.repaint();
		}
	};
	_.innermousemove = function(e) {
		this.control = undefined;
		if(this.start){
			this.end = new structures.Point(e.p.x, e.p.y);
		}else{
			for ( let i = 0, ii = this.sketcher.shapes.length; i < ii; i++) {
				let s = this.sketcher.shapes[i];
				if (s instanceof d2.DynamicBracket && !s.error) {
					let hits = [];
					hits.push({
						x : s.textPos.x-1,
						y : s.textPos.y+6,
						v : 1
					});
					hits.push({
						x : s.textPos.x+13,
						y : s.textPos.y+6,
						v : 2
					});
					for ( let j = 0, jj = hits.length; j < jj; j++) {
						let h = hits[j];
						if (math.isBetween(e.p.x, h.x, h.x + controlsize * 2) && math.isBetween(e.p.y, h.y - controlsize, h.y+3)) {
							this.control = {
								s : s,
								t : h.v
							};
							break;
						} else if (math.isBetween(e.p.x, h.x, h.x + controlsize * 2) && math.isBetween(e.p.y, h.y + controlsize-2, h.y + controlsize * 2+3)) {
							this.control = {
								s : s,
								t : -1 * h.v
							};
							break;
						}
					}
					if (this.control) {
						break;
					}
				}
			}
		}
		if(this.control){
			this.clearHover();
		}else{
			this.findHoveredObject(e, false, true, true);
			if(this.sketcher.hovering && this.sketcher.hovering instanceof d2._Shape && !(this.sketcher.hovering instanceof d2.DynamicBracket)){
				this.clearHover();
			}
		}
		this.sketcher.repaint();
	};
	function drawBracketControl(ctx, styles, x, y, control, type) {
		if (control && m.abs(control.t) === type) {
			ctx.fillStyle = styles.colorHover;
			ctx.beginPath();
			if (control.t > 0) {
				ctx.moveTo(x, y);
				ctx.lineTo(x + controlsize, y - controlsize);
				ctx.lineTo(x + controlsize * 2, y);
			} else {
				ctx.moveTo(x, y + controlsize);
				ctx.lineTo(x + controlsize, y + controlsize * 2);
				ctx.lineTo(x + controlsize * 2, y + controlsize);
			}
			ctx.closePath();
			ctx.fill();
		}
		ctx.strokeStyle = 'blue';
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x + controlsize, y - controlsize);
		ctx.lineTo(x + controlsize * 2, y);
		ctx.moveTo(x, y + controlsize);
		ctx.lineTo(x + controlsize, y + controlsize * 2);
		ctx.lineTo(x + controlsize * 2, y + controlsize);
		ctx.stroke();
	}
	_.draw = function(ctx, styles) {
		if (this.start && this.end) {
			ctx.strokeStyle = styles.colorPreview;
			ctx.fillStyle = styles.colorPreview;
			ctx.lineWidth = 1;
			let p1 = this.start.getCenter();
			let p2 = this.end;
			if (this.sketcher.hovering && this.sketcher.hovering !== this.start) {
				p2 = this.sketcher.hovering.getCenter();
			}
			ctx.beginPath();
			ctx.moveTo(p1.x, p1.y);
			ctx.lineTo(p2.x, p2.y);
			ctx.setLineDash([2]);
			ctx.stroke();
			ctx.setLineDash([]);
		}else {
			// controls
			ctx.lineWidth = 2;
			ctx.lineJoin = 'miter';
			ctx.lineCap = 'butt';
			for ( let i = 0, ii = this.sketcher.shapes.length; i < ii; i++) {
				let s = this.sketcher.shapes[i];
				if (s instanceof d2.DynamicBracket && !s.error) {
					let c = this.control && this.control.s === s ? this.control : undefined;
					drawBracketControl(ctx, styles, s.textPos.x-1, s.textPos.y+6, c, 1);
					drawBracketControl(ctx, styles, s.textPos.x+13, s.textPos.y+6, c, 2);
				}
			}
			if(this.sketcher.hovering && this.sketcher.hovering instanceof d2.DynamicBracket && this.sketcher.hovering.contents.flippable){
				let s = this.sketcher.hovering;
				ctx.font = extensions.getFontString(styles.text_font_size, styles.text_font_families, styles.text_font_bold, styles.text_font_italic);
				ctx.fillStyle = styles.colorPreview;
				ctx.textAlign = 'left';
				ctx.textBaseline = 'bottom';
				ctx.fillText('flip?', s.textPos.x+(s.error?0:20), s.textPos.y);
			}
		}
	};

})(ChemDoodle.extensions, ChemDoodle.math, ChemDoodle.structures, ChemDoodle.structures.d2, ChemDoodle.uis.actions, ChemDoodle.uis.states, Math);

(function(actions, states, structures, d2, undefined) {
	'use strict';
	states.EraseState = function(sketcher) {
		this.setup(sketcher);
	};
	let _ = states.EraseState.prototype = new states._State();
	_.handleDelete = function() {
		let action;
		if (this.sketcher.lasso && this.sketcher.lasso.isActive()) {
			action = new actions.DeleteContentAction(this.sketcher, this.sketcher.lasso.atoms, this.sketcher.lasso.shapes);
			this.sketcher.lasso.empty();
		} else if (this.sketcher.hovering) {
			if (this.sketcher.hovering instanceof structures.Atom) {
				if (this.sketcher.oneMolecule) {
					let mol = this.sketcher.molecules[0];
					for ( let j = 0, jj = mol.atoms.length; j < jj; j++) {
						mol.atoms[j].visited = false;
					}
					let connectionsA = [];
					let connectionsB = [];
					this.sketcher.hovering.visited = true;
					for ( let j = 0, jj = mol.bonds.length; j < jj; j++) {
						let bj = mol.bonds[j];
						if (bj.contains(this.sketcher.hovering)) {
							let atoms = [];
							let bonds = [];
							let q = new structures.Queue();
							q.enqueue(bj.getNeighbor(this.sketcher.hovering));
							while (!q.isEmpty()) {
								let a = q.dequeue();
								if (!a.visited) {
									a.visited = true;
									atoms.push(a);
									for ( let k = 0, kk = mol.bonds.length; k < kk; k++) {
										let bk = mol.bonds[k];
										if (bk.contains(a) && !bk.getNeighbor(a).visited) {
											q.enqueue(bk.getNeighbor(a));
											bonds.push(bk);
										}
									}
								}
							}
							connectionsA.push(atoms);
							connectionsB.push(bonds);
						}
					}
					let largest = -1;
					let index = -1;
					for ( let j = 0, jj = connectionsA.length; j < jj; j++) {
						if (connectionsA[j].length > largest) {
							index = j;
							largest = connectionsA[j].length;
						}
					}
					if (index > -1) {
						let as = [];
						let bs = [];
						let hold;
						for ( let i = 0, ii = mol.atoms.length; i < ii; i++) {
							let a = mol.atoms[i];
							if (connectionsA[index].indexOf(a) === -1) {
								as.push(a);
							} else if (!hold) {
								hold = a;
							}
						}
						for ( let i = 0, ii = mol.bonds.length; i < ii; i++) {
							let b = mol.bonds[i];
							if (connectionsB[index].indexOf(b) === -1) {
								bs.push(b);
							}
						}
						action = new actions.DeleteAction(this.sketcher, hold, as, bs);
					} else {
						action = new actions.ClearAction(this.sketcher);
					}
				} else {
					let mol = this.sketcher.getMoleculeByAtom(this.sketcher.hovering);
					action = new actions.DeleteAction(this.sketcher, mol.atoms[0], [ this.sketcher.hovering ], mol.getBonds(this.sketcher.hovering));
				}
			} else if (this.sketcher.hovering instanceof structures.Bond) {
				if (!this.sketcher.oneMolecule || this.sketcher.hovering.ring) {
					action = new actions.DeleteAction(this.sketcher, this.sketcher.hovering.a1, undefined, [ this.sketcher.hovering ]);
				}
			} else if (this.sketcher.hovering instanceof d2._Shape) {
				let s = this.sketcher.hovering;
				if(s.hoverBond){
					// delete only the hovered bond in the VAP
					action = new actions.DeleteVAPConnectionAction(s, s.hoverBond);
				}else{
					action = new actions.DeleteShapeAction(this.sketcher, s);
				}
			}
			this.sketcher.hovering.isHover = false;
			this.sketcher.hovering = undefined;
			this.sketcher.repaint();
		}
		if(action){
			this.sketcher.historyManager.pushUndo(action);
			// check shapes to see if they should be removed
			for ( let i = this.sketcher.shapes.length - 1; i >= 0; i--) {
				let s = this.sketcher.shapes[i];
				if (s instanceof d2.Pusher || s instanceof d2.AtomMapping) {
					let remains1 = false, remains2 = false;
					for ( let j = 0, jj = this.sketcher.molecules.length; j < jj; j++) {
						let mol = this.sketcher.molecules[j];
						for ( let k = 0, kk = mol.atoms.length; k < kk; k++) {
							let a = mol.atoms[k];
							if (a === s.o1) {
								remains1 = true;
							} else if (a === s.o2) {
								remains2 = true;
							}
						}
						for ( let k = 0, kk = mol.bonds.length; k < kk; k++) {
							let b = mol.bonds[k];
							if (b === s.o1) {
								remains1 = true;
							} else if (b === s.o2) {
								remains2 = true;
							}
						}
					}
					if (!remains1 || !remains2) {
						action.ss.push(s);
						this.sketcher.removeShape(s);
					}
				}
				if (s instanceof d2.DynamicBracket) {
					let remains1 = false, remains2 = false;
					for ( let j = 0, jj = this.sketcher.molecules.length; j < jj; j++) {
						let mol = this.sketcher.molecules[j];
						for ( let k = 0, kk = mol.bonds.length; k < kk; k++) {
							let b = mol.bonds[k];
							if (b === s.b1) {
								remains1 = true;
							} else if (b === s.b2) {
								remains2 = true;
							}
						}
					}
					if (!remains1 || !remains2) {
						action.ss.push(s);
						this.sketcher.removeShape(s);
					}
				}
				if (s instanceof d2.VAP) {
					let broken = false;
					for ( let j = 0, jj = this.sketcher.molecules.length; j < jj; j++) {
						let mol = this.sketcher.molecules[j];
						for ( let k = 0, kk = mol.atoms.length; k < kk; k++) {
							mol.atoms[k].present = true;
						}
					}
					if(s.substituent && !s.substituent.present){
						broken = true;
					}
					if(!broken){
						for(let j = 0, jj = s.attachments.length; j < jj; j++){
							if(!s.attachments[j].present){
								broken = true;
								break;
							}
						}
					}
					for ( let j = 0, jj = this.sketcher.molecules.length; j < jj; j++) {
						let mol = this.sketcher.molecules[j];
						for ( let k = 0, kk = mol.atoms.length; k < kk; k++) {
							mol.atoms[k].present = undefined;
						}
					}
					if (broken) {
						action.ss.push(s);
						this.sketcher.removeShape(s);
					}
				}
			}
			this.sketcher.checksOnAction();
			this.sketcher.repaint();
		}
	};
	_.innermouseup = function(e) {
		this.handleDelete();
	};
	_.innermousemove = function(e) {
		this.findHoveredObject(e, true, true, true);
	};

})(ChemDoodle.uis.actions, ChemDoodle.uis.states, ChemDoodle.structures, ChemDoodle.structures.d2);
(function(monitor, structures, actions, states, m, undefined) {
	'use strict';
	states.LabelState = function(sketcher) {
		this.setup(sketcher);
	};
	let _ = states.LabelState.prototype = new states._State();
	_.label = 'C';
	_.innermousedown = function(e) {
		this.downPoint = e.p;
		this.newMolAllowed = true;
		if(this.sketcher.hovering){
			this.sketcher.hovering.isHover = false;
			this.sketcher.hovering.isSelected = true;
			this.sketcher.repaint();
		}
	};
	_.innermouseup = function(e) {
		this.downPoint = undefined;
		if (this.sketcher.hovering) {
			this.sketcher.hovering.isSelected = false;
			if(this.sketcher.tempAtom){
				let b = new structures.Bond(this.sketcher.hovering, this.sketcher.tempAtom);
				this.sketcher.historyManager.pushUndo(new actions.AddAction(this.sketcher, b.a1, [b.a2], [b]));
				this.sketcher.tempAtom = undefined;
			}else if (this.label !== this.sketcher.hovering.label) {
				this.sketcher.historyManager.pushUndo(new actions.ChangeLabelAction(this.sketcher.hovering, this.label));
			}
		} else if (!this.sketcher.oneMolecule && this.newMolAllowed) {
			this.sketcher.historyManager.pushUndo(new actions.NewMoleculeAction(this.sketcher, [ new structures.Atom(this.label, e.p.x, e.p.y) ], []));
		}
		if (!this.sketcher.isMobile) {
			this.mousemove(e);
		}
	};
	_.innermousemove = function(e) {
		this.findHoveredObject(e, true, false);
	};
	_.innerdrag = function(e) {
		if(this.downPoint && this.downPoint.distance(e.p)>3){
			// give it a little allowance, but if we move too much, then don't place a lone atom
			this.newMolAllowed = false;
		}
		if(this.sketcher.hovering){
			let dist = this.sketcher.hovering.distance(e.p);
			if(dist<9){
				this.sketcher.tempAtom = undefined;
			}else if (e.p.distance(this.sketcher.hovering) < 15) {
				let angle = this.getOptimumAngle(this.sketcher.hovering);
				let x = this.sketcher.hovering.x + this.sketcher.styles.bondLength_2D * m.cos(angle);
				let y = this.sketcher.hovering.y - this.sketcher.styles.bondLength_2D * m.sin(angle);
				this.sketcher.tempAtom = new structures.Atom(this.label, x, y, 0);
			} else {
				if (monitor.ALT && monitor.SHIFT) {
					this.sketcher.tempAtom = new structures.Atom(this.label, e.p.x, e.p.y, 0);
				} else {
					let angle = this.sketcher.hovering.angle(e.p);
					let length = this.sketcher.hovering.distance(e.p);
					if (!monitor.SHIFT) {
						length = this.sketcher.styles.bondLength_2D;
					}
					if (!monitor.ALT) {
						let increments = m.floor((angle + m.PI / 12) / (m.PI / 6));
						angle = increments * m.PI / 6;
					}
					this.sketcher.tempAtom = new structures.Atom(this.label, this.sketcher.hovering.x + length * m.cos(angle), this.sketcher.hovering.y - length * m.sin(angle), 0);
				}
			}
			this.sketcher.repaint();
		}
	};

})(ChemDoodle.monitor, ChemDoodle.structures, ChemDoodle.uis.actions, ChemDoodle.uis.states, Math);
(function(math, monitor, structures, d2, actions, states, tools, m, undefined) {
	'use strict';
	let TRANSLATE = 1;
	let ROTATE = 2;
	//let SCALE = 3;
	let transformType = undefined;
	let paintRotate = false;
	
	states.LassoState = function(sketcher) {
		this.setup(sketcher);
		this.dontTranslateOnDrag = true;
	};
	let _ = states.LassoState.prototype = new states._State();
	_.innerdrag = function(e) {
		this.inDrag = true;
		if (this.sketcher.lasso.isActive() && transformType) {
			if (!this.sketcher.lastPoint) {
				// this prevents the structure from being rotated and
				// translated at the same time while a gesture is occurring,
				// which is preferable based on use cases since the rotation
				// center is the canvas center
				return;
			}
			if (transformType === TRANSLATE) {
				// move selection
				let dif = new structures.Point(e.p.x, e.p.y);
				dif.sub(this.sketcher.lastPoint);
				if (this.parentAction) {
					this.parentAction.dif.add(dif);
					for ( let i = 0, ii = this.parentAction.ps.length; i < ii; i++) {
						this.parentAction.ps[i].add(dif);
					}
					// must check here as change is outside of an action
					this.parentAction.checks(this.sketcher);
				} else {
					this.parentAction = new actions.MoveAction(this.sketcher.lasso.getAllPoints(), dif);
					this.sketcher.historyManager.pushUndo(this.parentAction);
				}
			} else if (transformType === ROTATE) {
				// rotate structure
				if (this.parentAction) {
					let center = this.parentAction.center;
					let oldAngle = center.angle(this.sketcher.lastPoint);
					let newAngle = center.angle(e.p);
					let rot = newAngle - oldAngle;
					this.parentAction.dif += rot;
					for ( let i = 0, ii = this.parentAction.ps.length; i < ii; i++) {
						let a = this.parentAction.ps[i];
						let dist = center.distance(a);
						let angle = center.angle(a) + rot;
						a.x = center.x + dist * m.cos(angle);
						a.y = center.y - dist * m.sin(angle);
					}
					// must check here as change is outside of an action
					this.parentAction.checks(this.sketcher);
				} else {
					let center = new structures.Point((this.sketcher.lasso.bounds.minX + this.sketcher.lasso.bounds.maxX) / 2, (this.sketcher.lasso.bounds.minY + this.sketcher.lasso.bounds.maxY) / 2);
					let oldAngle = center.angle(this.sketcher.lastPoint);
					let newAngle = center.angle(e.p);
					let rot = newAngle - oldAngle;
					this.parentAction = new actions.RotateAction(this.sketcher.lasso.getAllPoints(), rot, center);
					this.sketcher.historyManager.pushUndo(this.parentAction);
				}
			}
		} else if (this.sketcher.hovering) {
			if (!this.sketcher.lastPoint) {
				// this prevents the structure from being rotated and
				// translated at the same time while a gesture is occurring,
				// which is preferable based on use cases since the rotation
				// center is the canvas center
				return;
			}
			// move structure
			let dif = new structures.Point(e.p.x, e.p.y);
			dif.sub(this.sketcher.lastPoint);
			if (!this.parentAction) {
				let ps;
				if (this.sketcher.hovering instanceof structures.Atom) {
					ps = monitor.SHIFT ? [ this.sketcher.hovering ] : this.sketcher.getMoleculeByAtom(this.sketcher.hovering).atoms;
				} else if (this.sketcher.hovering instanceof structures.Bond) {
					ps = [ this.sketcher.hovering.a1, this.sketcher.hovering.a2 ];
				} else if (this.sketcher.hovering instanceof d2._Shape) {
					ps = this.sketcher.hovering.hoverPoint ? [ this.sketcher.hovering.hoverPoint ] : this.sketcher.hovering.getPoints();
				}
				this.parentAction = new actions.MoveAction(ps, dif);
				this.sketcher.historyManager.pushUndo(this.parentAction);
			} else {
				this.parentAction.dif.add(dif);
				for ( let i = 0, ii = this.parentAction.ps.length; i < ii; i++) {
					this.parentAction.ps[i].add(dif);
				}
				// must check here as change is outside of an action
				this.parentAction.checks(this.sketcher);
			}
		} else {
			// must check against undefined as lastGestureRotate can be 0, in
			// mobile mode it is set during gestures, don't use lasso
			this.sketcher.lasso.addPoint(e.p);
			this.sketcher.repaint();
		}
	};
	_.innermousedown = function(e) {
		this.inDrag = false;
		transformType = undefined;
		if (this.sketcher.lasso.isActive() && !monitor.SHIFT) {
			let rotateBuffer = 25 / this.sketcher.styles.scale;
			if (math.isBetween(e.p.x, this.sketcher.lasso.bounds.minX, this.sketcher.lasso.bounds.maxX) && math.isBetween(e.p.y, this.sketcher.lasso.bounds.minY, this.sketcher.lasso.bounds.maxY)) {
				transformType = TRANSLATE;
			} else if (math.isBetween(e.p.x, this.sketcher.lasso.bounds.minX - rotateBuffer, this.sketcher.lasso.bounds.maxX + rotateBuffer) && math.isBetween(e.p.y, this.sketcher.lasso.bounds.minY - rotateBuffer, this.sketcher.lasso.bounds.maxY + rotateBuffer)) {
				transformType = ROTATE;
			}
		} else if (!this.sketcher.hovering) {
			this.sketcher.lastPoint = undefined;
			this.sketcher.lasso.addPoint(e.p);
			this.sketcher.repaint();
		}
	};
	_.innermouseup = function(e) {
		if (!transformType) {
			if (!this.sketcher.hovering) {
				this.sketcher.lasso.select();
			}
		}
		this.innermousemove(e);
	};
	_.innerclick = function(e) {
		if (!transformType && !this.inDrag) {
			if (this.sketcher.hovering) {
				let as = [];
				let ss = [];
				if (this.sketcher.hovering instanceof structures.Atom) {
					as.push(this.sketcher.hovering);
				} else if (this.sketcher.hovering instanceof structures.Bond) {
					as.push(this.sketcher.hovering.a1);
					as.push(this.sketcher.hovering.a2);
				} else if (this.sketcher.hovering instanceof d2._Shape) {
					ss.push(this.sketcher.hovering);
				}
				this.sketcher.lasso.select(as, ss);
			} else if (this.sketcher.lasso.isActive()) {
				this.sketcher.lasso.empty();
			}
		}
		transformType = undefined;
	};
	_.innermousemove = function(e) {
		if (!this.sketcher.lasso.isActive()) {
			let includeMol = this.sketcher.lasso.mode !== tools.Lasso.MODE_LASSO_SHAPES;
			this.findHoveredObject(e, includeMol, includeMol, true);
		} else if (!monitor.SHIFT) {
			let p = false;
			let rotateBuffer = 25 / this.sketcher.styles.scale;
			if (!(math.isBetween(e.p.x, this.sketcher.lasso.bounds.minX, this.sketcher.lasso.bounds.maxX) && math.isBetween(e.p.y, this.sketcher.lasso.bounds.minY, this.sketcher.lasso.bounds.maxY)) && math.isBetween(e.p.x, this.sketcher.lasso.bounds.minX - rotateBuffer, this.sketcher.lasso.bounds.maxX + rotateBuffer) && math.isBetween(e.p.y, this.sketcher.lasso.bounds.minY - rotateBuffer, this.sketcher.lasso.bounds.maxY + rotateBuffer)) {
				p = true;
			}
			if (p != paintRotate) {
				paintRotate = p;
				this.sketcher.repaint();
			}
		}
	};
	_.innerdblclick = function(e) {
		if (this.sketcher.lasso.isActive()) {
			this.sketcher.lasso.empty();
		}
	};
	_.draw = function(ctx, styles) {
		if (paintRotate && this.sketcher.lasso.bounds) {
			ctx.fillStyle = styles.colorSelect;
			ctx.globalAlpha = .1;
			let rotateBuffer = 25 / this.sketcher.styles.scale;
			let b = this.sketcher.lasso.bounds;
			ctx.beginPath();
			ctx.rect(b.minX - rotateBuffer, b.minY - rotateBuffer, b.maxX - b.minX + 2 * rotateBuffer, rotateBuffer);
			ctx.rect(b.minX - rotateBuffer, b.maxY, b.maxX - b.minX + 2 * rotateBuffer, rotateBuffer);
			ctx.rect(b.minX - rotateBuffer, b.minY, rotateBuffer, b.maxY - b.minY);
			ctx.rect(b.maxX, b.minY, rotateBuffer, b.maxY - b.minY);
			ctx.fill();
			ctx.globalAlpha = 1;
		}
	};

})(ChemDoodle.math, ChemDoodle.monitor, ChemDoodle.structures, ChemDoodle.structures.d2, ChemDoodle.uis.actions, ChemDoodle.uis.states, ChemDoodle.uis.tools, Math);

(function(actions, states, undefined) {
	'use strict';
	states.LonePairState = function(sketcher) {
		this.setup(sketcher);
	};
	let _ = states.LonePairState.prototype = new states._State();
	_.delta = 1;
	_.innermouseup = function(e) {
		if (this.delta < 0 && this.sketcher.hovering.numLonePair < 1) {
			return;
		}
		if (this.sketcher.hovering) {
			this.sketcher.historyManager.pushUndo(new actions.ChangeLonePairAction(this.sketcher.hovering, this.delta));
		}
	};
	_.innermousemove = function(e) {
		this.findHoveredObject(e, true, false);
	};

})(ChemDoodle.uis.actions, ChemDoodle.uis.states);
(function(actions, states, structures, undefined) {
	'use strict';
	states.MoveState = function(sketcher) {
		this.setup(sketcher);
	};
	let _ = states.MoveState.prototype = new states._State();
	_.action = undefined;
	_.innerdrag = function(e) {
		if (this.sketcher.hovering) {
			if (!this.action) {
				let ps = [];
				let dif = new structures.Point(e.p.x, e.p.y);
				if (this.sketcher.hovering instanceof structures.Atom) {
					dif.sub(this.sketcher.hovering);
					ps[0] = this.sketcher.hovering;
				} else if (this.sketcher.hovering instanceof structures.Bond) {
					dif.sub(this.sketcher.lastPoint);
					ps[0] = this.sketcher.hovering.a1;
					ps[1] = this.sketcher.hovering.a2;
				}
				this.action = new actions.MoveAction(ps, dif);
				this.sketcher.historyManager.pushUndo(this.action);
			} else {
				let dif = new structures.Point(e.p.x, e.p.y);
				dif.sub(this.sketcher.lastPoint);
				this.action.dif.add(dif);
				for ( let i = 0, ii = this.action.ps.length; i < ii; i++) {
					this.action.ps[i].add(dif);
				}
				for ( let i = 0, ii = this.sketcher.molecules.length; i < ii; i++) {
					this.sketcher.molecules[i].check();
				}
				this.sketcher.repaint();
			}
		}
	};
	_.innermousemove = function(e) {
		this.findHoveredObject(e, true, true);
	};
	_.innermouseup = function(e) {
		this.action = undefined;
	};

})(ChemDoodle.uis.actions, ChemDoodle.uis.states, ChemDoodle.structures);
(function(monitor, actions, states, structures, m, undefined) {
	'use strict';
	states.NewBondState = function(sketcher) {
		this.setup(sketcher);
	};
	let _ = states.NewBondState.prototype = new states._State();
	_.bondOrder = 1;
	_.stereo = structures.Bond.STEREO_NONE;
	_.incrementBondOrder = function(b) {
		this.newMolAllowed = false;
		if (this.bondOrder === 1 && this.stereo === structures.Bond.STEREO_NONE) {
			this.sketcher.historyManager.pushUndo(new actions.ChangeBondAction(b));
		} else {
			if (b.bondOrder === this.bondOrder && b.stereo === this.stereo) {
				if (b.bondOrder === 1 && b.stereo !== structures.Bond.STEREO_NONE || b.bondOrder === 2 && b.stereo === structures.Bond.STEREO_NONE) {
					this.sketcher.historyManager.pushUndo(new actions.FlipBondAction(b));
				}
			} else {
				this.sketcher.historyManager.pushUndo(new actions.ChangeBondAction(b, this.bondOrder, this.stereo));
			}
		}
	};

	_.innerexit = function() {
		this.removeStartAtom();
	};
	_.innerdrag = function(e) {
		this.newMolAllowed = false;
		this.removeStartAtom();
		if (this.sketcher.hovering instanceof structures.Atom) {
			if (e.p.distance(this.sketcher.hovering) < 15) {
				let angle = this.getOptimumAngle(this.sketcher.hovering, this.bondOrder);
				let x = this.sketcher.hovering.x + this.sketcher.styles.bondLength_2D * m.cos(angle);
				let y = this.sketcher.hovering.y - this.sketcher.styles.bondLength_2D * m.sin(angle);
				this.sketcher.tempAtom = new structures.Atom('C', x, y, 0);
			} else {
				let closest;
				let distMin = 1000;
				for ( let i = 0, ii = this.sketcher.molecules.length; i < ii; i++) {
					let mol = this.sketcher.molecules[i];
					for ( let j = 0, jj = mol.atoms.length; j < jj; j++) {
						let a = mol.atoms[j];
						let dist = a.distance(e.p);
						if (dist < 5 && (!closest || dist < distMin)) {
							closest = a;
							distMin = dist;
						}
					}
				}
				if (closest) {
					this.sketcher.tempAtom = new structures.Atom('C', closest.x, closest.y, 0);
				} else if (monitor.ALT && monitor.SHIFT) {
					this.sketcher.tempAtom = new structures.Atom('C', e.p.x, e.p.y, 0);
				} else {
					let angle = this.sketcher.hovering.angle(e.p);
					let length = this.sketcher.hovering.distance(e.p);
					if (!monitor.SHIFT) {
						length = this.sketcher.styles.bondLength_2D;
					}
					if (!monitor.ALT) {
						let increments = m.floor((angle + m.PI / 12) / (m.PI / 6));
						angle = increments * m.PI / 6;
					}
					this.sketcher.tempAtom = new structures.Atom('C', this.sketcher.hovering.x + length * m.cos(angle), this.sketcher.hovering.y - length * m.sin(angle), 0);
				}
			}
			for ( let i = 0, ii = this.sketcher.molecules.length; i < ii; i++) {
				let mol = this.sketcher.molecules[i];
				for ( let j = 0, jj = mol.atoms.length; j < jj; j++) {
					let a = mol.atoms[j];
					if (a.distance(this.sketcher.tempAtom) < 5) {
						this.sketcher.tempAtom.x = a.x;
						this.sketcher.tempAtom.y = a.y;
						this.sketcher.tempAtom.isOverlap = true;
					}
				}
			}
			this.sketcher.repaint();
		}
	};
	_.innerclick = function(e) {
		if (!this.sketcher.hovering && !this.sketcher.oneMolecule && this.newMolAllowed) {
			this.sketcher.historyManager.pushUndo(new actions.NewMoleculeAction(this.sketcher, [ new structures.Atom('C', e.p.x, e.p.y) ], []));
			if (!this.sketcher.isMobile) {
				this.mousemove(e);
			}
			this.newMolAllowed = false;
		}
	};
	_.innermousedown = function(e) {
		this.newMolAllowed = true;
		if (this.sketcher.hovering instanceof structures.Atom) {
			this.sketcher.hovering.isHover = false;
			this.sketcher.hovering.isSelected = true;
			this.drag(e);
		} else if (this.sketcher.hovering instanceof structures.Bond) {
			this.sketcher.hovering.isHover = false;
			this.incrementBondOrder(this.sketcher.hovering);
			for ( let i = 0, ii = this.sketcher.molecules.length; i < ii; i++) {
				this.sketcher.molecules[i].check();
			}
			this.sketcher.repaint();
		}else if(!this.sketcher.hovering && !this.sketcher.requireStartingAtom){
			this.placeRequiredAtom(e);
		}
	};
	_.innermouseup = function(e) {
		if (this.sketcher.tempAtom && this.sketcher.hovering) {
			let as = [];
			let bs = [];
			let makeBond = true;
			if (this.sketcher.tempAtom.isOverlap) {
				for ( let i = 0, ii = this.sketcher.molecules.length; i < ii; i++) {
					let mol = this.sketcher.molecules[i];
					for ( let j = 0, jj = mol.atoms.length; j < jj; j++) {
						let a = mol.atoms[j];
						if (a.distance(this.sketcher.tempAtom) < 5) {
							this.sketcher.tempAtom = a;
						}
					}
				}
				let bond = this.sketcher.getBond(this.sketcher.hovering, this.sketcher.tempAtom);
				if (bond) {
					this.incrementBondOrder(bond);
					makeBond = false;
				}
			} else {
				as.push(this.sketcher.tempAtom);
			}
			if (makeBond) {
				bs[0] = new structures.Bond(this.sketcher.hovering, this.sketcher.tempAtom, this.bondOrder);
				bs[0].stereo = this.stereo;
				this.sketcher.historyManager.pushUndo(new actions.AddAction(this.sketcher, bs[0].a1, as, bs));
			}
		}
		this.sketcher.tempAtom = undefined;
		if (!this.sketcher.isMobile) {
			this.mousemove(e);
		}
	};
	_.innermousemove = function(e) {
		if (this.sketcher.tempAtom) {
			return;
		}
		this.findHoveredObject(e, true, true);
		if (this.sketcher.startAtom) {
			if (this.sketcher.hovering) {
				this.sketcher.startAtom.x = -10;
				this.sketcher.startAtom.y = -10;
			} else {
				this.sketcher.startAtom.x = e.p.x;
				this.sketcher.startAtom.y = e.p.y;
			}
		}
	};
	_.innermouseout = function(e) {
		this.removeStartAtom();
	};

})(ChemDoodle.monitor, ChemDoodle.uis.actions, ChemDoodle.uis.states, ChemDoodle.structures, Math);
(function(math, monitor, actions, states, structures, m, undefined) {
	'use strict';
	states.NewChainState = function(sketcher) {
		this.setup(sketcher);
	};
	let _ = states.NewChainState.prototype = new states._State();
	_.getChain = function(pivot, end) {
		if (monitor.SHIFT) {
			let difx = end.x - pivot.x;
			let dify = end.y - pivot.y;
			if (m.abs(difx) > m.abs(dify)) {
				end.x = pivot.x+difx;
				end.y = pivot.y;
			} else {
				end.x = pivot.x;
				end.y = pivot.y+dify;
			}
		}
		let chain = [];
		let beginning = pivot;
		let angle = 2 * m.PI - pivot.angle(end);
		if(!monitor.SHIFT && !monitor.ALT){
			let remainder = angle % (m.PI / 24);
			angle -= remainder;
		}
		let blength = this.sketcher.styles.bondLength_2D;
		let length =  m.floor(pivot.distance(end) / (blength * m.cos(m.PI / 6)));
		let flip = m.round(angle / (m.PI / 24)) % 2 == 1;
		if (flip) {
			angle -= m.PI / 24;
		}
		if (this.flipOverride) {
			flip = !flip;
		}
		for (let i = 0; i < length; i++) {
			let angleAdd = m.PI / 6 * (flip ? 1 : -1);
			if ((i & 1) == 1) {
				angleAdd *= -1;
			}
			let newX = beginning.x + blength * m.cos(angle + angleAdd);
			let newY = beginning.y + blength * m.sin(angle + angleAdd);
			beginning = new structures.Atom('C', newX, newY);
			chain.push(beginning);
		}
		
		let allAs = this.sketcher.getAllAtoms();
		for ( let i = 0, ii = allAs.length; i < ii; i++) {
			allAs[i].isOverlap = false;
		}
		for ( let i = 0, ii = chain.length; i < ii; i++) {
			let minDist = Infinity;
			let closest;
			for ( let k = 0, kk = allAs.length; k < kk; k++) {
				let dist = allAs[k].distance(chain[i]);
				if (dist < minDist) {
					minDist = dist;
					closest = allAs[k];
				}
			}
			if (minDist < 5) {
				chain[i] = closest;
				closest.isOverlap = true;
			}
		}
		return chain;
	};

	_.innerexit = function() {
		this.removeStartAtom();
	};
	_.innerdrag = function(e) {
		this.newMolAllowed = false;
		this.removeStartAtom();
		if (this.sketcher.hovering) {
			// send in a copy of e.p as the getChain function does change the point if shift is held
			this.sketcher.tempChain = this.getChain(this.sketcher.hovering, new structures.Point(e.p.x, e.p.y));
			this.sketcher.repaint();
		}
	};
	_.innerclick = function(e) {
		if (!this.sketcher.hovering && !this.sketcher.oneMolecule && this.newMolAllowed) {
			this.sketcher.historyManager.pushUndo(new actions.NewMoleculeAction(this.sketcher, [ new structures.Atom('C', e.p.x, e.p.y) ], []));
			if (!this.sketcher.isMobile) {
				this.mousemove(e);
			}
			this.newMolAllowed = false;
		}
	};
	_.innermousedown = function(e) {
		this.newMolAllowed = true;
		if (this.sketcher.hovering) {
			this.sketcher.hovering.isHover = false;
			this.sketcher.hovering.isSelected = true;
			this.drag(e);
		}else if(!this.sketcher.requireStartingAtom){
			this.placeRequiredAtom(e);
		}
	};
	_.innermouseup = function(e) {
		if (this.sketcher.tempChain && this.sketcher.hovering && this.sketcher.tempChain.length!==0) {
			let as = [];
			let bs = [];
			let allAs = this.sketcher.getAllAtoms();
			for ( let i = 0, ii = this.sketcher.tempChain.length; i < ii; i++) {
				if (allAs.indexOf(this.sketcher.tempChain[i]) === -1) {
					as.push(this.sketcher.tempChain[i]);
				}
				if (i!=0 && !this.sketcher.bondExists(this.sketcher.tempChain[i - 1], this.sketcher.tempChain[i])) {
					bs.push(new structures.Bond(this.sketcher.tempChain[i - 1], this.sketcher.tempChain[i]));
				}
			}
			if (!this.sketcher.bondExists(this.sketcher.tempChain[0], this.sketcher.hovering)) {
				bs.push(new structures.Bond(this.sketcher.tempChain[0], this.sketcher.hovering));
			}
			if (as.length !== 0 || bs.length !== 0) {
				this.sketcher.historyManager.pushUndo(new actions.AddAction(this.sketcher, this.sketcher.hovering, as, bs));
			}
			for ( let j = 0, jj = allAs.length; j < jj; j++) {
				allAs[j].isOverlap = false;
			}
		}
		this.sketcher.tempChain = undefined;
		if (!this.sketcher.isMobile) {
			this.mousemove(e);
		}
	};
	_.innermousemove = function(e) {
		if (this.sketcher.tempAtom) {
			return;
		}
		this.findHoveredObject(e, true);
		if (this.sketcher.startAtom) {
			if (this.sketcher.hovering) {
				this.sketcher.startAtom.x = -10;
				this.sketcher.startAtom.y = -10;
			} else {
				this.sketcher.startAtom.x = e.p.x;
				this.sketcher.startAtom.y = e.p.y;
			}
		}
	};
	_.innermouseout = function(e) {
		this.removeStartAtom();
	};

})(ChemDoodle.math, ChemDoodle.monitor, ChemDoodle.uis.actions, ChemDoodle.uis.states, ChemDoodle.structures, Math);
(function(math, monitor, actions, states, structures, m, undefined) {
	'use strict';
	states.NewRingState = function(sketcher) {
		this.setup(sketcher);
	};
	let _ = states.NewRingState.prototype = new states._State();
	_.numSides = 6;
	_.unsaturated = false;
	_.getRing = function(a, numSides, bondLength, angle, setOverlaps) {
		let innerAngle = m.PI - 2 * m.PI / numSides;
		angle += innerAngle / 2;
		let ring = [];
		for ( let i = 0; i < numSides - 1; i++) {
			let p = i === 0 ? new structures.Atom('C', a.x, a.y) : new structures.Atom('C', ring[ring.length - 1].x, ring[ring.length - 1].y);
			p.x += bondLength * m.cos(angle);
			p.y -= bondLength * m.sin(angle);
			ring.push(p);
			angle += m.PI + innerAngle;
		}
		for ( let i = 0, ii = this.sketcher.molecules.length; i < ii; i++) {
			let mol = this.sketcher.molecules[i];
			for ( let j = 0, jj = mol.atoms.length; j < jj; j++) {
				mol.atoms[j].isOverlap = false;
			}
		}
		for ( let i = 0, ii = ring.length; i < ii; i++) {
			let minDist = Infinity;
			let closest;
			for ( let k = 0, kk = this.sketcher.molecules.length; k < kk; k++) {
				let mol = this.sketcher.molecules[k];
				for ( let j = 0, jj = mol.atoms.length; j < jj; j++) {
					let dist = mol.atoms[j].distance(ring[i]);
					if (dist < minDist) {
						minDist = dist;
						closest = mol.atoms[j];
					}
				}
			}
			if (minDist < 5) {
				ring[i] = closest;
				if (setOverlaps) {
					closest.isOverlap = true;
				}
			}
		}
		return ring;
	};
	_.getOptimalRing = function(b, numSides) {
		let innerAngle = m.PI / 2 - m.PI / numSides;
		let bondLength = b.a1.distance(b.a2);
		let ring1 = this.getRing(b.a1, numSides, bondLength, b.a1.angle(b.a2) - innerAngle, false);
		let ring2 = this.getRing(b.a2, numSides, bondLength, b.a2.angle(b.a1) - innerAngle, false);
		let dist1 = 0, dist2 = 0;
		for ( let i = 1, ii = ring1.length; i < ii; i++) {
			for ( let k = 0, kk = this.sketcher.molecules.length; k < kk; k++) {
				let mol = this.sketcher.molecules[k];
				for ( let j = 0, jj = mol.atoms.length; j < jj; j++) {
					let d1 = mol.atoms[j].distance(ring1[i]);
					let d2 = mol.atoms[j].distance(ring2[i]);
					dist1 += m.min(1E8, 1 / (d1 * d1));
					dist2 += m.min(1E8, 1 / (d2 * d2));
				}
			}
		}
		if (dist1 < dist2) {
			return ring1;
		} else {
			return ring2;
		}
	};

	_.innerexit = function() {
		this.removeStartAtom();
	};
	_.innerdrag = function(e) {
		this.newMolAllowed = false;
		this.removeStartAtom();
		function getHeight(n, startFromSide, standardLength) {
			let mpn = m.PI / n;
			let r = standardLength/ 2 / m.sin(mpn);
			let a = r * m.cos(mpn);
			let odd = n % 2 == 1;
			return odd ? a + r : startFromSide ? 2 * a : 2 * r;
		};
		if (this.sketcher.hovering instanceof structures.Atom) {
			let a = 0;
			let l = 0;
			let n = this.numSides;
			if(n === -1){
				a = this.sketcher.hovering.angle(e.p);
				l = this.sketcher.styles.bondLength_2D;
				n = 3;
				let dist = this.sketcher.hovering.distance(e.p);
				while (dist > getHeight(n + 1, false, l)) {
					n++;
				}
				if (!monitor.ALT) {
					let increments = m.floor((a + m.PI / 12) / (m.PI / 6));
					a = increments * m.PI / 6;
				}
			}else if (e.p.distance(this.sketcher.hovering) < 15) {
				let angles = this.sketcher.getMoleculeByAtom(this.sketcher.hovering).getAngles(this.sketcher.hovering);
				if (angles.length === 0) {
					a = 3 * m.PI / 2;
				} else {
					a = math.angleBetweenLargest(angles).angle;
				}
				l = this.sketcher.styles.bondLength_2D;
			} else {
				a = this.sketcher.hovering.angle(e.p);
				l = this.sketcher.hovering.distance(e.p);
				if (!(monitor.ALT && monitor.SHIFT)) {
					if (!monitor.SHIFT) {
						l = this.sketcher.styles.bondLength_2D;
					}
					if (!monitor.ALT) {
						let increments = m.floor((a + m.PI / 12) / (m.PI / 6));
						a = increments * m.PI / 6;
					}
				}
			}
			this.sketcher.tempRing = this.getRing(this.sketcher.hovering, n, l, a, true);
			this.sketcher.repaint();
		} else if (this.sketcher.hovering instanceof structures.Bond) {
			let dist = math.distanceFromPointToLineInclusive(e.p, this.sketcher.hovering.a1, this.sketcher.hovering.a2);
			let ringUse;
			let n = this.numSides;
			if(n === -1){
				n = 3;
				let dist = this.sketcher.hovering.getCenter().distance(e.p);
				let bondLength = this.sketcher.hovering.a1.distance(this.sketcher.hovering.a2);
				while (dist > getHeight(n + 1, true, bondLength)) {
					n++;
				}
			}
			if (dist !== -1 && dist <= 7) {
				ringUse = this.getOptimalRing(this.sketcher.hovering, n);
			} else {
				let innerAngle = m.PI / 2 - m.PI / n;
				let bondLength = this.sketcher.hovering.a1.distance(this.sketcher.hovering.a2);
				let ring1 = this.getRing(this.sketcher.hovering.a1, n, bondLength, this.sketcher.hovering.a1.angle(this.sketcher.hovering.a2) - innerAngle, false);
				let ring2 = this.getRing(this.sketcher.hovering.a2, n, bondLength, this.sketcher.hovering.a2.angle(this.sketcher.hovering.a1) - innerAngle, false);
				let center1 = new structures.Point();
				let center2 = new structures.Point();
				for ( let i = 1, ii = ring1.length; i < ii; i++) {
					center1.add(ring1[i]);
					center2.add(ring2[i]);
				}
				center1.x /= (ring1.length - 1);
				center1.y /= (ring1.length - 1);
				center2.x /= (ring2.length - 1);
				center2.y /= (ring2.length - 1);
				let dist1 = center1.distance(e.p);
				let dist2 = center2.distance(e.p);
				ringUse = ring2;
				if (dist1 < dist2) {
					ringUse = ring1;
				}
			}
			for ( let j = 1, jj = ringUse.length; j < jj; j++) {
				if (this.sketcher.getAllAtoms().indexOf(ringUse[j]) !== -1) {
					ringUse[j].isOverlap = true;
				}
			}
			this.sketcher.tempRing = ringUse;
			this.sketcher.repaint();
		}
	};
	_.innerclick = function(e) {
		if (!this.sketcher.hovering && !this.sketcher.oneMolecule && this.newMolAllowed) {
			this.sketcher.historyManager.pushUndo(new actions.NewMoleculeAction(this.sketcher, [ new structures.Atom('C', e.p.x, e.p.y) ], []));
			if (!this.sketcher.isMobile) {
				this.mousemove(e);
			}
			this.newMolAllowed = false;
		}
	};
	_.innermousedown = function(e) {
		this.newMolAllowed = true;
		if (this.sketcher.hovering) {
			this.sketcher.hovering.isHover = false;
			this.sketcher.hovering.isSelected = true;
			this.drag(e);
		}else if(!this.sketcher.requireStartingAtom){
			this.placeRequiredAtom(e);
		}
	};
	_.innermouseup = function(e) {
		if (this.sketcher.tempRing && this.sketcher.hovering) {
			let as = [];
			let bs = [];
			let allAs = this.sketcher.getAllAtoms();
			let unsat = this.unsaturated || this.numSides===-1 && monitor.SHIFT;
			if (this.sketcher.hovering instanceof structures.Atom) {
				if (allAs.indexOf(this.sketcher.tempRing[0]) === -1) {
					as.push(this.sketcher.tempRing[0]);
				}
				if (!this.sketcher.bondExists(this.sketcher.hovering, this.sketcher.tempRing[0])) {
					bs.push(new structures.Bond(this.sketcher.hovering, this.sketcher.tempRing[0]));
				}
				for ( let i = 1, ii = this.sketcher.tempRing.length; i < ii; i++) {
					let ai = this.sketcher.tempRing[i];
					let aip = this.sketcher.tempRing[i-1];
					if (allAs.indexOf(ai) === -1) {
						as.push(ai);
					}
					if (!this.sketcher.bondExists(aip, ai)) {
						bs.push(new structures.Bond(aip, ai, unsat && i % 2 === 1 && ai.getImplicitHydrogenCount()>1 && aip.getImplicitHydrogenCount()>1 ? 2 : 1));
					}
				}
				if (!this.sketcher.bondExists(this.sketcher.tempRing[this.sketcher.tempRing.length - 1], this.sketcher.hovering)) {
					bs.push(new structures.Bond(this.sketcher.tempRing[this.sketcher.tempRing.length - 1], this.sketcher.hovering, unsat && this.sketcher.tempRing.length%2===1 && this.sketcher.tempRing[this.sketcher.tempRing.length - 1].getImplicitHydrogenCount()>1 && this.sketcher.hovering.getImplicitHydrogenCount()>1 ? 2 : 1));
				}
			} else if (this.sketcher.hovering instanceof structures.Bond) {
				let start = this.sketcher.hovering.a2;
				let end = this.sketcher.hovering.a1;
				if (this.sketcher.tempRing[0] === this.sketcher.hovering.a1) {
					start = this.sketcher.hovering.a1;
					end = this.sketcher.hovering.a2;
				}
				if (allAs.indexOf(this.sketcher.tempRing[1]) === -1) {
					as.push(this.sketcher.tempRing[1]);
				}
				if (!this.sketcher.bondExists(start, this.sketcher.tempRing[1])) {
					bs.push(new structures.Bond(start, this.sketcher.tempRing[1]));
				}
				for ( let i = 2, ii = this.sketcher.tempRing.length; i < ii; i++) {
					let ai = this.sketcher.tempRing[i];
					let aip = this.sketcher.tempRing[i - 1];
					if (allAs.indexOf(ai) === -1) {
						as.push(ai);
					}
					if (!this.sketcher.bondExists(aip, ai)) {
						bs.push(new structures.Bond(aip, ai, unsat && i % 2 === 0 && ai.getImplicitHydrogenCount()>1 && aip.getImplicitHydrogenCount()>1 ? 2 : 1));
					}
				}
				if (!this.sketcher.bondExists(this.sketcher.tempRing[this.sketcher.tempRing.length - 1], end)) {
					bs.push(new structures.Bond(this.sketcher.tempRing[this.sketcher.tempRing.length - 1], end, unsat && this.sketcher.tempRing.length % 2 === 0 && this.sketcher.tempRing[this.sketcher.tempRing.length - 1].getImplicitHydrogenCount()>1 && end.getImplicitHydrogenCount()>1 ? 2 : 1));
				}
			}
			if (as.length !== 0 || bs.length !== 0) {
				this.sketcher.historyManager.pushUndo(new actions.AddAction(this.sketcher, bs[0].a1, as, bs));
			}
			for ( let j = 0, jj = allAs.length; j < jj; j++) {
				allAs[j].isOverlap = false;
			}
		}
		this.sketcher.tempRing = undefined;
		if (!this.sketcher.isMobile) {
			this.mousemove(e);
		}
	};
	_.innermousemove = function(e) {
		if (this.sketcher.tempAtom) {
			return;
		}
		this.findHoveredObject(e, true, true);
		if (this.sketcher.startAtom) {
			if (this.sketcher.hovering) {
				this.sketcher.startAtom.x = -10;
				this.sketcher.startAtom.y = -10;
			} else {
				this.sketcher.startAtom.x = e.p.x;
				this.sketcher.startAtom.y = e.p.y;
			}
		}
	};
	_.innermouseout = function(e) {
		this.removeStartAtom();
	};

})(ChemDoodle.math, ChemDoodle.monitor, ChemDoodle.uis.actions, ChemDoodle.uis.states, ChemDoodle.structures, Math);
(function(math, monitor, actions, states, io, structures, m, undefined) {
	'use strict';
	
	let INTERPRETER = new io.JSONInterpreter();
	
	states.NewTemplateState = function(sketcher) {
		this.setup(sketcher);
		this.template = {"a":[{"x":270,"i":"a0","y":105},{"x":252.6795,"i":"a1","y":115},{"x":252.6795,"i":"a2","y":135},{"x":270,"i":"a3","y":145},{"x":287.3205,"i":"a4","y":135},{"x":287.3205,"i":"a5","y":115},{"x":270,"i":"a6","y":85},{"x":287.3205,"i":"a7","y":75},{"x":270,"i":"a8","y":165,"l":"O"},{"x":252.6795,"i":"a9","y":175},{"x":252.6795,"i":"a10","y":195},{"x":252.6795,"i":"a11","y":215},{"x":252.6795,"i":"a12","y":235,"l":"Si"},{"x":272.6795,"i":"a13","y":235},{"x":232.6795,"i":"a14","y":235},{"x":252.6795,"i":"a15","y":255}],"b":[{"b":0,"e":1,"i":"b0","o":2},{"b":1,"e":2,"i":"b1"},{"b":2,"e":3,"i":"b2","o":2},{"b":3,"e":4,"i":"b3"},{"b":4,"e":5,"i":"b4","o":2},{"b":5,"e":0,"i":"b5"},{"b":0,"e":6,"i":"b6"},{"b":6,"e":7,"i":"b7","o":2},{"b":3,"e":8,"i":"b8"},{"b":8,"e":9,"i":"b9"},{"b":9,"e":10,"i":"b10"},{"b":10,"e":11,"i":"b11","o":3},{"b":11,"e":12,"i":"b12"},{"b":12,"e":13,"i":"b13"},{"b":12,"e":14,"i":"b14"},{"b":12,"e":15,"i":"b15"}]};
		this.attachPos = 0;
	};
	let _ = states.NewTemplateState.prototype = new states._State();
	_.getTemplate = function(p) {
		let origin = this.sketcher.hovering;
		let newMol = INTERPRETER.molFrom(this.template);
		newMol.scaleToAverageBondLength(this.sketcher.styles.bondLength_2D);
		let pivot = newMol.atoms[this.attachPos];
		let thrad = origin.angle(p);
		let rotate = true;
		if (!monitor.ALT) {
			if (origin.distance(p) < 15) {
				let angles = this.sketcher.getMoleculeByAtom(this.sketcher.hovering).getAngles(this.sketcher.hovering);
				if (angles.length === 0) {
					thrad = 0;
					rotate = false;
				} else if (angles.length === 1) {
					thrad = angles[0] + m.PI;
				} else {
					thrad = math.angleBetweenLargest(angles).angle;
				}
				let angles2 = newMol.getAngles(pivot);
				if (angles2.length === 1) {
					thrad -= angles2[0] + (angles.length === 1 ? m.PI / 3 : 0);
				} else {
					thrad -= math.angleBetweenLargest(angles2).angle + m.PI;
				}
			} else {
				let divider = m.round(thrad / (m.PI / 6));
				thrad = divider * m.PI / 6;
			}
		}
		let difx = origin.x-pivot.x;
		let dify = origin.y-pivot.y;
		for(let i = 0, ii = newMol.atoms.length; i<ii; i++){
			let a = newMol.atoms[i];
			a.x+=difx;
			a.y+=dify;
		}
		if (rotate) {
			for(let i = 0, ii = newMol.atoms.length; i<ii; i++){
				let a = newMol.atoms[i];
				let angleUse = a.angle(origin) + thrad;
				let distance = pivot.distance(a);
				if (monitor.SHIFT) {
					distance *= origin.distance(p) / this.sketcher.styles.bondLength_2D;
				}
				a.x = origin.x - m.cos(angleUse) * distance;
				a.y = origin.y + m.sin(angleUse) * distance;
			}
		}
		let allAs = this.sketcher.getAllAtoms();
		let allBs = this.sketcher.getAllBonds();
		for ( let j = 0, jj = allAs.length; j < jj; j++) {
			let a2 = allAs[j];
			a2.isOverlap = false;
			let hits = [];
			for(let i = 0, ii = newMol.atoms.length; i<ii; i++){
				let a = newMol.atoms[i];
				if (a2.distance(a) < 5) {
					hits.push(i);
				}
			}
			// make sure to look for the closest, as several atoms may
			// try to merge onto a single atom...
			let closest = -1;
			for(let i = 0, ii = hits.length; i<ii; i++){
				let h = hits[i];
				if (closest === -1 || a2.distance(newMol.atoms[h]) < a2.distance(newMol.atoms[closest])) {
					closest = h;
				}
			}
			if (closest !== -1) {
				let a = newMol.atoms[closest];
				newMol.atoms.splice(closest,1);
				if (a2.x!==pivot.x || a2.y!==pivot.y) {
					a2.isOverlap = true;
				}
				for(let i = 0, ii = newMol.bonds.length; i<ii; i++){
					let b = newMol.bonds[i];
					if(b.a1===a){
						b.a1 = a2;
						b.tmpreplace1 = true;
					}else if(b.a2===a){
						b.a2 = a2;
						b.tmpreplace2 = true;
					}
					if(b.tmpreplace1 && b.tmpreplace2){
						// get rid of the bond if both atoms are overlapping
						// just double check that that bond doesn't exist even if the atoms have both been replaced
						let match = false;
						for(let k = 0, kk = allBs.length; k<kk; k++){
							let b2 = allBs[k];
							if(b.a1===b2.a1 && b.a2===b2.a2 || b.a2===b2.a1 && b.a1===b2.a2){
								match = true;
								break;
							}
						}
						if(match){
							newMol.bonds.splice(i--,1);
							ii--;
						}
					}
				}
			}
		}
		newMol.check();
		newMol.check(true);
		return newMol;
	};

	_.innerexit = function() {
		this.removeStartAtom();
	};
	_.innerdrag = function(e) {
		this.newMolAllowed = false;
		this.removeStartAtom();
		if (this.sketcher.hovering) {
			this.sketcher.tempTemplate = this.getTemplate(e.p);
			this.sketcher.repaint();
		}
	};
	_.innerclick = function(e) {
		if (!this.sketcher.hovering && !this.sketcher.oneMolecule && this.newMolAllowed) {
			this.sketcher.historyManager.pushUndo(new actions.NewMoleculeAction(this.sketcher, [ new structures.Atom('C', e.p.x, e.p.y) ], []));
			if (!this.sketcher.isMobile) {
				this.mousemove(e);
			}
			this.newMolAllowed = false;
		}
	};
	_.innermousedown = function(e) {
		this.newMolAllowed = true;
		if (this.sketcher.hovering) {
			this.sketcher.hovering.isHover = false;
			this.sketcher.hovering.isSelected = true;
			this.drag(e);
		}else if(!this.sketcher.requireStartingAtom){
			this.placeRequiredAtom(e);
		}
	};
	_.innermouseup = function(e) {
		if (this.sketcher.hovering && this.sketcher.tempTemplate) {
			if(this.sketcher.tempTemplate.atoms.length!==0){
				this.sketcher.historyManager.pushUndo(new actions.AddAction(this.sketcher, this.sketcher.hovering, this.sketcher.tempTemplate.atoms, this.sketcher.tempTemplate.bonds));
			}
			let allAs = this.sketcher.getAllAtoms();
			for ( let i = 0, ii = allAs.length; i < ii; i++) {
				allAs[i].isOverlap = false;
			}
			this.sketcher.tempTemplate = undefined;
		}
		if (!this.sketcher.isMobile) {
			this.mousemove(e);
		}
	};
	_.innermousemove = function(e) {
		if (this.sketcher.tempAtom) {
			return;
		}
		this.findHoveredObject(e, true);
		if (this.sketcher.startAtom) {
			if (this.sketcher.hovering) {
				this.sketcher.startAtom.x = -10;
				this.sketcher.startAtom.y = -10;
			} else {
				this.sketcher.startAtom.x = e.p.x;
				this.sketcher.startAtom.y = e.p.y;
			}
		}
	};
	_.innermouseout = function(e) {
		this.removeStartAtom();
	};

})(ChemDoodle.math, ChemDoodle.monitor, ChemDoodle.uis.actions, ChemDoodle.uis.states, ChemDoodle.io, ChemDoodle.structures, Math);

(function(structures, d2, actions, states, undefined) {
	'use strict';
	states.PusherState = function(sketcher) {
		this.setup(sketcher);
		this.dontTranslateOnDrag = true;
	};
	let _ = states.PusherState.prototype = new states._State();
	_.numElectron = 1;
	_.innermousedown = function(e) {
		if (this.sketcher.hovering && this.start!==this.sketcher.hovering) {
			if(!this.start){
				this.start = this.sketcher.hovering;
			}
		}else{
			this.start = undefined;
			this.end = undefined;
			this.sketcher.repaint();
		}
	};
	_.innerdrag = function(e) {
		if (this.start) {
			this.end = new structures.Point(e.p.x, e.p.y);
			this.findHoveredObject(e, true, this.numElectron!=-10);
			this.sketcher.repaint();
		}
	};
	_.innermouseup = function(e) {
		if (this.start && this.sketcher.hovering && this.sketcher.hovering !== this.start) {
			let dup;
			let remove = false;
			for ( let i = 0, ii = this.sketcher.shapes.length; i < ii; i++) {
				let s = this.sketcher.shapes[i];
				if (s instanceof d2.Pusher) {
					if (s.o1 === this.start && s.o2 === this.sketcher.hovering) {
						dup = s;
					} else if (s.o2 === this.start && s.o1 === this.sketcher.hovering) {
						dup = s;
						remove = true;
					}
				}else if (s instanceof d2.AtomMapping) {
					if (s.o1 === this.start && s.o2 === this.sketcher.hovering || s.o2 === this.start && s.o1 === this.sketcher.hovering) {
						dup = s;
						remove = true;
					}
				}
			}
			if (dup) {
				if (remove) {
					this.sketcher.historyManager.pushUndo(new actions.DeleteShapeAction(this.sketcher, dup));
				}
				this.start = undefined;
				this.end = undefined;
				this.sketcher.repaint();
			} else {
				let shape;
				if(this.numElectron==-10){
					shape = new d2.AtomMapping(this.start, this.sketcher.hovering);
				}else{
					shape = new d2.Pusher(this.start, this.sketcher.hovering, this.numElectron);
				}
				this.start = undefined;
				this.end = undefined;
				this.sketcher.historyManager.pushUndo(new actions.AddShapeAction(this.sketcher, shape));
			}
		} else {
			//this.start = undefined;
			//this.end = undefined;
			//this.sketcher.repaint();
		}
	};
	_.innermousemove = function(e) {
		if(this.start){
			this.end = new structures.Point(e.p.x, e.p.y);
		}
		this.findHoveredObject(e, true, this.numElectron!=-10);
		this.sketcher.repaint();
	};
	_.draw = function(ctx, styles) {
		if (this.start && this.end) {
			ctx.strokeStyle = styles.colorPreview;
			ctx.fillStyle = styles.colorPreview;
			ctx.lineWidth = 1;
			let p1 = this.start instanceof structures.Atom ? this.start : this.start.getCenter();
			let p2 = this.end;
			if (this.sketcher.hovering && this.sketcher.hovering !== this.start) {
				p2 = this.sketcher.hovering instanceof structures.Atom ? this.sketcher.hovering : this.sketcher.hovering.getCenter();
			}
			ctx.beginPath();
			ctx.moveTo(p1.x, p1.y);
			ctx.lineTo(p2.x, p2.y);
			ctx.setLineDash([2]);
			ctx.stroke();
			ctx.setLineDash([]);
		}
	};

})(ChemDoodle.structures, ChemDoodle.structures.d2, ChemDoodle.uis.actions, ChemDoodle.uis.states);

(function(actions, states, structures, d2, undefined) {
	'use strict';
	states.QueryState = function(sketcher) {
		this.setup(sketcher);
	};
	let _ = states.QueryState.prototype = new states._State();
	_.innermouseup = function(e) {
		if (this.sketcher.hovering) {
			if(this.sketcher.hovering instanceof structures.Atom){
				this.sketcher.dialogManager.atomQueryDialog.setAtom(this.sketcher.hovering);
				this.sketcher.dialogManager.atomQueryDialog.open();
			}else if(this.sketcher.hovering instanceof structures.Bond){
				this.sketcher.dialogManager.bondQueryDialog.setBond(this.sketcher.hovering);
				this.sketcher.dialogManager.bondQueryDialog.open();
			}
		}
	};
	_.innermousemove = function(e) {
		this.findHoveredObject(e, true, true, false);
	};

})(ChemDoodle.uis.actions, ChemDoodle.uis.states, ChemDoodle.structures, ChemDoodle.structures.d2);

(function(actions, states, undefined) {
	'use strict';
	states.RadicalState = function(sketcher) {
		this.setup(sketcher);
	};
	let _ = states.RadicalState.prototype = new states._State();
	_.delta = 1;
	_.innermouseup = function(e) {
		if (this.delta < 0 && this.sketcher.hovering.numRadical < 1) {
			return;
		}
		if (this.sketcher.hovering) {
			this.sketcher.historyManager.pushUndo(new actions.ChangeRadicalAction(this.sketcher.hovering, this.delta));
		}
	};
	_.innermousemove = function(e) {
		this.findHoveredObject(e, true, false);
	};

})(ChemDoodle.uis.actions, ChemDoodle.uis.states);

(function(math, monitor, structures, d2, actions, states, m, undefined) {
	'use strict';
	states.ShapeState = function(sketcher) {
		this.setup(sketcher);
		this.dontTranslateOnDrag = true;
	};
	let _ = states.ShapeState.prototype = new states._State();
	_.shapeType = states.ShapeState.LINE;
	_.superDoubleClick = _.dblclick;
	_.dblclick = function(e) {
		// override double click not to center when editing shapes
		if (!this.control) {
			this.superDoubleClick(e);
		}
	};
	_.innerexit = function(e) {
		// set it back to line to remove graphical controls for other shapes
		this.shapeType = states.ShapeState.LINE;
		this.sketcher.repaint();
	};
	_.innermousemove = function(e) {
		this.control = undefined;
		if (this.shapeType === states.ShapeState.BRACKET) {
			let size = 6;
			for ( let i = 0, ii = this.sketcher.shapes.length; i < ii; i++) {
				let s = this.sketcher.shapes[i];
				if (s instanceof d2.Bracket) {
					let minX = m.min(s.p1.x, s.p2.x);
					let maxX = m.max(s.p1.x, s.p2.x);
					let minY = m.min(s.p1.y, s.p2.y);
					let maxY = m.max(s.p1.y, s.p2.y);
					let hits = [];
					hits.push({
						x : maxX + 5,
						y : minY + 15,
						v : 1
					});
					hits.push({
						x : maxX + 5,
						y : maxY + 15,
						v : 2
					});
					hits.push({
						x : minX - 17,
						y : (minY + maxY) / 2 + 15,
						v : 3
					});
					for ( let j = 0, jj = hits.length; j < jj; j++) {
						let h = hits[j];
						if (math.isBetween(e.p.x, h.x, h.x + size * 2) && math.isBetween(e.p.y, h.y - size, h.y)) {
							this.control = {
								s : s,
								t : h.v
							};
							break;
						} else if (math.isBetween(e.p.x, h.x, h.x + size * 2) && math.isBetween(e.p.y, h.y + size, h.y + size * 2)) {
							this.control = {
								s : s,
								t : -1 * h.v
							};
							break;
						}
					}
					if (this.control) {
						break;
					}
				}
			}
			this.sketcher.repaint();
		}
	};
	_.innermousedown = function(e) {
		if (this.control) {
			this.sketcher.historyManager.pushUndo(new actions.ChangeBracketAttributeAction(this.control.s, this.control.t));
			this.sketcher.repaint();
		} else {
			this.start = new structures.Point(e.p.x, e.p.y);
			this.end = this.start;
		}
	};
	_.innerdrag = function(e) {
		this.end = new structures.Point(e.p.x, e.p.y);
		if (this.shapeType === states.ShapeState.BRACKET) {
			if (monitor.SHIFT) {
				let difx = this.end.x - this.start.x;
				let dify = this.end.y - this.start.y;
				if (difx < 0 && dify > 0) {
					dify *= -1;
				} else if (difx > 0 && dify < 0) {
					difx *= -1;
				}
				let difuse = dify;
				if (m.abs(difx) < m.abs(dify)) {
					difuse = difx;
				}
				this.end.x = this.start.x + difuse;
				this.end.y = this.start.y + difuse;
			}
		} else {
			if (!monitor.ALT) {
				let angle = this.start.angle(this.end);
				let length = this.start.distance(this.end);
				if (!monitor.ALT) {
					let increments = m.floor((angle + m.PI / 12) / (m.PI / 6));
					angle = increments * m.PI / 6;
				}
				this.end.x = this.start.x + length * m.cos(angle);
				this.end.y = this.start.y - length * m.sin(angle);
			}
		}
		this.sketcher.repaint();
	};
	_.innermouseup = function(e) {
		if (this.start && this.end) {
			let shape;
			if (this.start.distance(this.end) > 5) {
				if (this.shapeType >= states.ShapeState.LINE && this.shapeType <= states.ShapeState.ARROW_EQUILIBRIUM) {
					shape = new d2.Line(this.start, this.end);
					if (this.shapeType === states.ShapeState.ARROW_SYNTHETIC) {
						shape.arrowType = d2.Line.ARROW_SYNTHETIC;
					} else if (this.shapeType === states.ShapeState.ARROW_RETROSYNTHETIC) {
						shape.arrowType = d2.Line.ARROW_RETROSYNTHETIC;
					} else if (this.shapeType === states.ShapeState.ARROW_RESONANCE) {
						shape.arrowType = d2.Line.ARROW_RESONANCE;
					} else if (this.shapeType === states.ShapeState.ARROW_EQUILIBRIUM) {
						shape.arrowType = d2.Line.ARROW_EQUILIBRIUM;
					}
				} else if (this.shapeType === states.ShapeState.BRACKET) {
					shape = new d2.Bracket(this.start, this.end);
				}
			}
			this.start = undefined;
			this.end = undefined;
			if (shape) {
				this.sketcher.historyManager.pushUndo(new actions.AddShapeAction(this.sketcher, shape));
			}
		}
	};
	function drawBracketControl(ctx, styles, x, y, control, type) {
		let size = 6;
		if (control && m.abs(control.t) === type) {
			ctx.fillStyle = styles.colorHover;
			ctx.beginPath();
			if (control.t > 0) {
				ctx.moveTo(x, y);
				ctx.lineTo(x + size, y - size);
				ctx.lineTo(x + size * 2, y);
			} else {
				ctx.moveTo(x, y + size);
				ctx.lineTo(x + size, y + size * 2);
				ctx.lineTo(x + size * 2, y + size);
			}
			ctx.closePath();
			ctx.fill();
		}
		ctx.strokeStyle = 'blue';
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x + size, y - size);
		ctx.lineTo(x + size * 2, y);
		ctx.moveTo(x, y + size);
		ctx.lineTo(x + size, y + size * 2);
		ctx.lineTo(x + size * 2, y + size);
		ctx.stroke();
	}
	_.draw = function(ctx, styles) {
		if (this.start && this.end) {
			ctx.strokeStyle = styles.colorPreview;
			ctx.fillStyle = styles.colorPreview;
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(this.start.x, this.start.y);
			if (this.shapeType === states.ShapeState.BRACKET) {
				ctx.lineTo(this.end.x, this.start.y);
				ctx.lineTo(this.end.x, this.end.y);
				ctx.lineTo(this.start.x, this.end.y);
				ctx.lineTo(this.start.x, this.start.y);
			} else {
				ctx.lineTo(this.end.x, this.end.y);
			}
			ctx.setLineDash([2]);
			ctx.stroke();
			ctx.setLineDash([]);
		} else if (this.shapeType === states.ShapeState.BRACKET) {
			ctx.lineWidth = 2;
			ctx.lineJoin = 'miter';
			ctx.lineCap = 'butt';
			for ( let i = 0, ii = this.sketcher.shapes.length; i < ii; i++) {
				let s = this.sketcher.shapes[i];
				if (s instanceof d2.Bracket) {
					let minX = m.min(s.p1.x, s.p2.x);
					let maxX = m.max(s.p1.x, s.p2.x);
					let minY = m.min(s.p1.y, s.p2.y);
					let maxY = m.max(s.p1.y, s.p2.y);
					let c = this.control && this.control.s === s ? this.control : undefined;
					drawBracketControl(ctx, styles, maxX + 5, minY + 15, c, 1);
					drawBracketControl(ctx, styles, maxX + 5, maxY + 15, c, 2);
					drawBracketControl(ctx, styles, minX - 17, (minY + maxY) / 2 + 15, c, 3);
				}
			}
		}

	};

	states.ShapeState.LINE = 1;
	states.ShapeState.ARROW_SYNTHETIC = 2;
	states.ShapeState.ARROW_RETROSYNTHETIC = 3;
	states.ShapeState.ARROW_RESONANCE = 4;
	states.ShapeState.ARROW_EQUILIBRIUM = 5;
	states.ShapeState.BRACKET = 10;

})(ChemDoodle.math, ChemDoodle.monitor, ChemDoodle.structures, ChemDoodle.structures.d2, ChemDoodle.uis.actions, ChemDoodle.uis.states, Math);

(function(math, structures, d2, actions, states, undefined) {
	'use strict';
	states.VAPState = function(sketcher) {
		this.setup(sketcher);
		this.dontTranslateOnDrag = true;
	};
	let _ = states.VAPState.prototype = new states._State();
	_.innermousedown = function(e) {
		if(!this.sketcher.hovering && (!this.start || !(this.start instanceof d2.VAP))){
			// out of convenience, since the user cannot drag from the VAP asterisk and may accidentally try to, don't allow placement of another vap within 30 pixels
			let add = true; 
			for ( let i = 0, ii = this.sketcher.shapes.length; i < ii; i++) {
				let s = this.sketcher.shapes[i];
				if(s instanceof d2.VAP && s.asterisk.distance(e.p)<30){
					add = false;
				}
			}
			if(add){
				let vap = new d2.VAP(e.p.x, e.p.y);
				if (!this.sketcher.isMobile) {
					vap.isHover = true;
					this.sketcher.hovering = vap;
				}
				this.sketcher.historyManager.pushUndo(new actions.AddShapeAction(this.sketcher, vap));
			}
		}else if (this.sketcher.hovering && this.start!==this.sketcher.hovering) {
			if(this.sketcher.hovering.hoverBond){
				let vap = this.sketcher.hovering;
				if(vap.hoverBond===vap.substituent){
					let nbo = 1;
					if(vap.bondType===1 || vap.bondType===2){
						nbo = vap.bondType+1;
					}else if(vap.bondType===3){
						nbo = .5;
					}
					this.sketcher.historyManager.pushUndo(new actions.ChangeVAPOrderAction(vap, nbo));
				}else {
					this.sketcher.historyManager.pushUndo(new actions.ChangeVAPSubstituentAction(vap, this.sketcher.hovering.hoverBond));
				}
			}else if(!this.start){
				this.start = this.sketcher.hovering;
			}
		}else{
			this.start = undefined;
			this.end = undefined;
			this.sketcher.repaint();
		}
	};
	_.innerdrag = function(e) {
		if (this.start) {
			this.end = new structures.Point(e.p.x, e.p.y);
			this.findHoveredObject(e, this.start instanceof d2.VAP, false, this.start instanceof structures.Atom);
			this.sketcher.repaint();
		}
	};
	_.innermouseup = function(e) {
		if (this.start && this.sketcher.hovering && this.sketcher.hovering !== this.start) {
			let vap = this.sketcher.hovering;
			let attach = this.start;
			if(attach instanceof d2.VAP){
				let tmp = vap;
				vap = attach;
				attach = tmp;
			}
			if(vap.substituent!==attach && vap.attachments.indexOf(attach)===-1){
				this.sketcher.historyManager.pushUndo(new actions.AddVAPAttachementAction(vap, attach, vap.substituent===undefined));
			}
			this.start = undefined;
			this.end = undefined;
			this.sketcher.repaint();
		} else {
			//this.start = undefined;
			//this.end = undefined;
			//this.sketcher.repaint();
		}
	};
	_.innermousemove = function(e) {
		if(this.start){
			this.end = new structures.Point(e.p.x, e.p.y);
			this.findHoveredObject(e, this.start instanceof d2.VAP, false, this.start instanceof structures.Atom);
		}else{
			this.findHoveredObject(e, true, true, true);
		}
		this.sketcher.repaint();
	};
	_.draw = function(ctx, styles) {
		if (this.start && this.end) {
			ctx.strokeStyle = styles.colorPreview;
			ctx.fillStyle = styles.colorPreview;
			ctx.lineWidth = 1;
			let p1 = this.start;
			let p2 = this.end;
			if (this.sketcher.hovering) {
				p2 = this.sketcher.hovering;
			}
			if(p1 instanceof d2.VAP){
				p1 = p1.asterisk;
			}
			if(p2 instanceof d2.VAP){
				p2 = p2.asterisk;
			}
			ctx.beginPath();
			ctx.moveTo(p1.x, p1.y);
			ctx.lineTo(p2.x, p2.y);
			ctx.setLineDash([2]);
			ctx.stroke();
			ctx.setLineDash([]);
		}
	};
	_.findHoveredObject = function(e, includeAtoms, includeVAPsBonds, includeVAPsAsterisks) {
		this.clearHover();
		let min = Infinity;
		let hovering;
		let hoverdist = 10;
		if (!this.sketcher.isMobile) {
			hoverdist /= this.sketcher.styles.scale;
		}
		if (includeAtoms) {
			for ( let i = 0, ii = this.sketcher.molecules.length; i < ii; i++) {
				let mol = this.sketcher.molecules[i];
				for ( let j = 0, jj = mol.atoms.length; j < jj; j++) {
					let a = mol.atoms[j];
					a.isHover = false;
					let dist = e.p.distance(a);
					if (dist < hoverdist && dist < min) {
						min = dist;
						hovering = a;
					}
				}
			}
		}
		if (includeVAPsBonds) {
			for ( let i = 0, ii = this.sketcher.shapes.length; i < ii; i++) {
				let s = this.sketcher.shapes[i];
				if(s instanceof d2.VAP){
					s.hoverBond = undefined;
					if(s.substituent){
						let att = s.substituent;
						let dist = math.distanceFromPointToLineInclusive(e.p, s.asterisk, att, hoverdist/2);
						if (dist !== -1 && dist < hoverdist && dist < min) {
							min = dist;
							s.hoverBond = att;
							hovering = s;
						}
					}
					for ( let j = 0, jj = s.attachments.length; j < jj; j++) {
						let att = s.attachments[j];
						let dist = math.distanceFromPointToLineInclusive(e.p, s.asterisk, att, hoverdist/2);
						if (dist !== -1 && dist < hoverdist && dist < min) {
							min = dist;
							s.hoverBond = att;
							hovering = s;
						}
					}
				}
			}
		}
		if (includeVAPsAsterisks) {
			for ( let i = 0, ii = this.sketcher.shapes.length; i < ii; i++) {
				let s = this.sketcher.shapes[i];
				if(s instanceof d2.VAP){
					s.isHover = false;
					let dist = e.p.distance(s.asterisk);
					if (dist < hoverdist && dist < min) {
						min = dist;
						hovering = s;
					}
				}
			}
		}
		if (hovering) {
			hovering.isHover = true;
			this.sketcher.hovering = hovering;
		}
	};

})(ChemDoodle.math, ChemDoodle.structures, ChemDoodle.structures.d2, ChemDoodle.uis.actions, ChemDoodle.uis.states);

(function(states, q, undefined) {
	'use strict';
	states.StateManager = function(sketcher) {
		this.STATE_NEW_BOND = new states.NewBondState(sketcher);
		this.STATE_NEW_RING = new states.NewRingState(sketcher);
		this.STATE_NEW_CHAIN = new states.NewChainState(sketcher);
		this.STATE_NEW_TEMPLATE= new states.NewTemplateState(sketcher);
		if(states.TextInputState){
			this.STATE_TEXT_INPUT= new states.TextInputState(sketcher);
		}
		this.STATE_CHARGE = new states.ChargeState(sketcher);
		this.STATE_LONE_PAIR = new states.LonePairState(sketcher);
		this.STATE_RADICAL = new states.RadicalState(sketcher);
		this.STATE_MOVE = new states.MoveState(sketcher);
		this.STATE_ERASE = new states.EraseState(sketcher);
		this.STATE_LABEL = new states.LabelState(sketcher);
		this.STATE_LASSO = new states.LassoState(sketcher);
		this.STATE_SHAPE = new states.ShapeState(sketcher);
		this.STATE_PUSHER = new states.PusherState(sketcher);
		this.STATE_DYNAMIC_BRACKET = new states.DynamicBracketState(sketcher);
		this.STATE_VAP = new states.VAPState(sketcher);
		this.STATE_QUERY = new states.QueryState(sketcher);
		let currentState = this.STATE_NEW_BOND;
		this.setState = function(nextState) {
			if (nextState !== currentState) {
				currentState.exit();
				currentState = nextState;
				currentState.enter();
			}
			if(sketcher.openTray && q('#'+sketcher.openTray.dummy.id+'_label').attr('aria-pressed')==='false'){
				// due to weirdness in how radio buttons in groups, but outside of jquery ui buttonsets are treated, we check for the aria-pressed attribute on the button label to determine select state
				sketcher.openTray.close();
			}
		};
		this.getCurrentState = function() {
			return currentState;
		};
	};

})(ChemDoodle.uis.states, ChemDoodle.lib.jQuery);

ChemDoodle.uis.gui.imageDepot = (function (ext, undefined) {
	'use strict';
	let d = {};
	d.getURI = function (s) {
		// for PNG, but all internal images are SVG now
		//return 'data:image/png;base64,' + s;
		// for SVG
		return 'data:image/svg+xml;base64,' + s;
	};

	d.ADD_LONE_PAIR = 'PHN2ZyBmaWxsLW9wYWNpdHk9IjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBjb2xvci1yZW5kZXJpbmc9ImF1dG8iIGNvbG9yLWludGVycG9sYXRpb249ImF1dG8iIHRleHQtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2U9ImJsYWNrIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiB3aWR0aD0iMjAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc2hhcGUtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2Utb3BhY2l0eT0iMSIgZmlsbD0iYmxhY2siIHN0cm9rZS1kYXNoYXJyYXk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHN0cm9rZS13aWR0aD0iMSIgdmlld0JveD0iMCAwIDIwLjAgMjAuMCIgaGVpZ2h0PSIyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmb250LWZhbWlseT0iJmFwb3M7RGlhbG9nJmFwb3M7IiBmb250LXN0eWxlPSJub3JtYWwiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIGZvbnQtc2l6ZT0iMTIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBpbWFnZS1yZW5kZXJpbmc9ImF1dG8iPjxkZWZzIGlkPSJnZW5lcmljRGVmcyIgIC8+PGcgID48ZyB0ZXh0LXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiBjb2xvci1yZW5kZXJpbmc9Im9wdGltaXplUXVhbGl0eSIgY29sb3ItaW50ZXJwb2xhdGlvbj0ibGluZWFyUkdCIiBpbWFnZS1yZW5kZXJpbmc9Im9wdGltaXplU3BlZWQiICAgID48Y2lyY2xlIHI9IjIiIGN4PSI2IiBjeT0iMTAiIHN0cm9rZT0ibm9uZSIgICAgICAvPjxjaXJjbGUgcj0iMiIgY3g9IjE0IiBjeT0iMTAiIHN0cm9rZT0ibm9uZSIgICAgLz48L2cgID48L2c+PC9zdmc+';
	d.ADD_RADICAL = 'PHN2ZyBmaWxsLW9wYWNpdHk9IjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBjb2xvci1yZW5kZXJpbmc9ImF1dG8iIGNvbG9yLWludGVycG9sYXRpb249ImF1dG8iIHRleHQtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2U9ImJsYWNrIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiB3aWR0aD0iMjAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc2hhcGUtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2Utb3BhY2l0eT0iMSIgZmlsbD0iYmxhY2siIHN0cm9rZS1kYXNoYXJyYXk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHN0cm9rZS13aWR0aD0iMSIgdmlld0JveD0iMCAwIDIwLjAgMjAuMCIgaGVpZ2h0PSIyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmb250LWZhbWlseT0iJmFwb3M7RGlhbG9nJmFwb3M7IiBmb250LXN0eWxlPSJub3JtYWwiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIGZvbnQtc2l6ZT0iMTIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBpbWFnZS1yZW5kZXJpbmc9ImF1dG8iPjxkZWZzIGlkPSJnZW5lcmljRGVmcyIgIC8+PGcgID48ZyB0ZXh0LXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiBjb2xvci1yZW5kZXJpbmc9Im9wdGltaXplUXVhbGl0eSIgY29sb3ItaW50ZXJwb2xhdGlvbj0ibGluZWFyUkdCIiBpbWFnZS1yZW5kZXJpbmc9Im9wdGltaXplU3BlZWQiICAgID48Y2lyY2xlIHI9IjIiIGN4PSIxMCIgY3k9IjEwIiBzdHJva2U9Im5vbmUiICAgIC8+PC9nICA+PC9nPjwvc3ZnPg==';
	d.ANGLE = 'PHN2ZyB0PSIxNTg3NzE4NjkwMDcyIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjE4MDY1MCIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiPjxwYXRoIGQ9Ik03NzcuMjggNjI2LjI0YTE4MS43NiAxODEuNzYgMCAwIDAtOTYgMjcuMiA3OS42OCA3OS42OCAwIDAgMS04MC45NiAxLjZMNDcwLjQgNTgyLjRhODAgODAgMCAwIDEtNDAuNjQtNzAuNCA3OS42OCA3OS42OCAwIDAgMSA0MC42NC03MC40bDEyOS45Mi03Mi45NmE4MCA4MCAwIDAgMSA4MC45NiAxLjYgMTgyLjcyIDE4Mi43MiAwIDEgMC04Ny4wNC0xNTUuODQgNzkuNjggNzkuNjggMCAwIDEtNDAuNjQgNzAuNzJsLTEyNS40NCA3MC40YTg4LjY0IDg4LjY0IDAgMCAxLTg4LjMyIDAgMTgyLjcyIDE4Mi43MiAwIDEgMCAyLjg4IDMxMy4yOCA3OS42OCA3OS42OCAwIDAgMSA4MC45Ni0xLjZsMTI5LjkyIDcyLjk2YTgwIDgwIDAgMCAxIDQwLjY0IDY5Ljc2IDE4Mi43MiAxODIuNzIgMCAxIDAgMTgyLjcyLTE4Mi43MnoiICBwLWlkPSIxODA2NTEiPjwvcGF0aD48L3N2Zz4=';
	d.ANIMATION = 'PHN2ZyB0PSIxNTg3NzExNjI5ODYxIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjMwNDYzIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiPjxwYXRoIGQ9Ik05MTAuMjMzNiAyODQuNDY3MkgxMTMuNzY2NFYxNzAuNzAwOGMwLTMxLjQzNjggMjUuNDk3Ni01Ni45MzQ0IDU2LjkzNDQtNTYuOTM0NGg2ODIuNzAwOGMzMS40MzY4IDAgNTYuOTM0NCAyNS40OTc2IDU2LjkzNDQgNTYuOTM0NGwtMC4xMDI0IDExMy43NjY0eiBtMCA1Ni44MzJ2NTEyYzAgMzEuNDM2OC0yNS40OTc2IDU2LjkzNDQtNTYuOTM0NCA1Ni45MzQ0SDE3MC43MDA4Yy0zMS40MzY4IDAtNTYuOTM0NC0yNS40OTc2LTU2LjkzNDQtNTYuOTM0NHYtNTEyaDc5Ni40Njcyek0yODQuNDY3MiAxNzAuNzAwOGw1Ny4yNDE2IDExMy43NjY0aDU2LjkzNDRsLTU3LjI0MTYtMTEzLjc2NjRoLTU2LjkzNDR6IG0xNzAuNTk4NCAwbDU3LjI0MTYgMTEzLjc2NjRoNTYuOTM0NEw1MTIgMTcwLjcwMDhoLTU2LjkzNDR6IG0xNzAuNzAwOCAwTDY4My4wMDggMjg0LjQ2NzJoNTYuOTM0NGwtNTcuMjQxNi0xMTMuNzY2NGgtNTYuOTM0NHogbTYuMDQxNiA0NTIuMDk2YzUuNTI5Ni0yLjc2NDggOS45MzI4LTcuMTY4IDEyLjY5NzYtMTIuNjk3NiA3LjA2NTYtMTQuMDI4OCAxLjMzMTItMzEuMTI5Ni0xMi42OTc2LTM4LjE5NTJsLTE5Mi40MDk2LTk2LjE1MzZjLTMuOTkzNi0xLjk0NTYtOC4yOTQ0LTIuOTY5Ni0xMi42OTc2LTIuOTY5Ni0xNS42NjcyIDAtMjguNDY3MiAxMi42OTc2LTI4LjQ2NzIgMjguNDY3MnYxOTIuNDA5NmMwIDQuNDAzMiAxLjAyNCA4LjgwNjQgMi45Njk2IDEyLjY5NzYgNy4wNjU2IDE0LjAyODggMjQuMDY0IDE5Ljc2MzIgMzguMTk1MiAxMi42OTc2bDE5Mi40MDk2LTk2LjI1NnoiIGZpbGw9IiMzMjMyMzMiIHAtaWQ9IjMwNDY0Ij48L3BhdGg+PC9zdmc+';
	d.ARROW_DOWN = 'PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIJIHZpZXdCb3g9IjAgMCA5IDIwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA5IDIwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHBvbHlnb24gc3R5bGU9InN0cm9rZTojMDAwMDAwO3N0cm9rZS1taXRlcmxpbWl0OjEwOyIgcG9pbnRzPSIxLjI3OCw3LjY5NSA3LjcyMiw3LjY5NSA0LjYwNSwxMi4zMDUgIi8+PC9zdmc+';
	d.ARROW_EQUILIBRIUM = 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKIHdpZHRoPSI0MHB4IiBoZWlnaHQ9IjQwcHgiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgNDAgNDAiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8Zz48cG9seWdvbiBmaWxsPSIjMzIzMzMzIiBwb2ludHM9IjMzLjY5MSwxNy41NTIgMjQuNDcxLDEzIDI2LjYyNiwxNS45NDUgMjguMDIxLDE3LjU1MiAiLz48cmVjdCB4PSI2IiB5PSIxNi41NTIiIGZpbGw9IiMzMjMzMzMiIHdpZHRoPSIyMy45MiIgaGVpZ2h0PSIxIi8+PHBvbHlnb24gZmlsbD0iIzMyMzMzMyIgcG9pbnRzPSI2LjMzNiwyMi40NzMgMTUuNSwyNyAxMy4zNjQsMjQuMDggMTIuMzQ4LDIyLjQ3MyIvPjxyZWN0IHg9IjEwLjA4IiB5PSIyMi40NzMiIGZpbGw9IiMzMjMzMzMiIHdpZHRoPSIyMy45MiIgaGVpZ2h0PSIxIi8+PC9nPgo8L3N2Zz4=';
	d.ARROW_RESONANCE = 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKIHdpZHRoPSI0MHB4IiBoZWlnaHQ9IjQwcHgiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgNDAgNDAiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8Zz48cGF0aCBmaWxsPSIjMzMzMzMzIiBkPSJNMzMuNzAyLDE5LjY3OGwtNC4zNjctMS45M2MtMC40MDEtMC4xNzctMC41OTctMC4wNjQtMC40NCwwLjIzOGwxLjI2LDEuNjA0SDkuODQzbDEuMjY2LTEuNjAyYzAuMTQ4LTAuMzA1LTAuMDQzLTAuNDE2LTAuNDQzLTAuMjM4bC00LjM2NywxLjkzYy0wLjM5NSwwLjE3NC0wLjQsMC40NjMsMCwwLjY0MWw0LjM2NywxLjkyN2MwLjM5NSwwLjE3NCwwLjU5OCwwLjA3MywwLjQ0My0wLjIzMkw5LjgxLDIwLjQxMmgyMC4zODNsLTEuMjk3LDEuNjAyYy0wLjE1NCwwLjMxLDAuMDQ1LDAuNDEyLDAuNDQxLDAuMjM1bDQuMzY3LTEuOTNDMzQuMSwyMC4xNDEsMzQuMDk4LDE5Ljg1MiwzMy43MDIsMTkuNjc4eiIvPjxyZWN0IHg9IjkuMDYiIHk9IjE5LjQ5OCIgZmlsbD0iIzMzMzMzMyIgd2lkdGg9IjIxLjg1MiIgaGVpZ2h0PSIxIi8+CjwvZz4KPC9zdmc+';
	d.ARROW_RETROSYNTHETIC = 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjQwcHgiIGhlaWdodD0iNDBweCIgdmlld0JveD0iMCAwIDQwIDQwIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA0MCA0MCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnPjxwb2x5Z29uIGZpbGw9IiMzMjMzMzMiIHBvaW50cz0iMjIuMDAyLDI4LjUgMjIuMDAyLDIzLjU0NyA2LDIzLjU0NyA2LDIyLjU0MyAyMy4wMDYsMjIuNTQzIDIzLjAwNiwyNi41NTkgMzIuMjY0LDIwIDIzLjAwNiwxMy40NDMgMjMuMDA2LDE3LjQ1OSA2LDE3LjQ1OSA2LDE2LjQ1NiAyMi4wMDIsMTYuNDU2IDIyLjAwMiwxMS41IDM0LDIwIi8+PC9nPgo8L3N2Zz4=';
	d.ARROW_SYNTHETIC = 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjQwcHgiIGhlaWdodD0iNDBweCIgdmlld0JveD0iMCAwIDQwIDQwIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA0MCA0MCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnPjxwYXRoIGZpbGw9IiMzMzMzMzMiIGQ9Ik0zMy40ODcsMTkuMjU0bC03LjQ2MS00LjVjLTAuNjgzLTAuNDE0LTEuMDE0LTAuMTUxLTAuNzU0LDAuNTU0bDAuOTA0LDIuNDM4bDAuNTQxLDEuNzAxIGMtMC4wMiwwLTAuMDM3LTAuMDAyLTAuMDU4LTAuMDAybC0wLjAwNywxLjExMWMwLjAzNSwwLDAuMDYzLTAuMDAxLDAuMDk5LTAuMDAxbC0wLjU3MiwxLjdsLTAuOTAxLDIuNDM2IGMtMC4yNzIsMC43MjEsMC4wNzYsMC45NjMsMC43NTIsMC41NTVsNy40NjMtNC41MDJDMzQuMTczLDIwLjMzNCwzNC4xNjcsMTkuNjYxLDMzLjQ4NywxOS4yNTR6Ii8+PHJlY3QgeD0iNiIgeT0iMTkuNTAxIiBmaWxsPSIjMzMzMzMzIiB3aWR0aD0iMjEiIGhlaWdodD0iMSIvPjwvZz4KPC9zdmc+';
	d.ATOM_REACTION_MAP = 'PHN2ZyBmaWxsLW9wYWNpdHk9IjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBjb2xvci1yZW5kZXJpbmc9ImF1dG8iIGNvbG9yLWludGVycG9sYXRpb249ImF1dG8iIHRleHQtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2U9ImJsYWNrIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiB3aWR0aD0iMjAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc2hhcGUtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2Utb3BhY2l0eT0iMSIgZmlsbD0iYmxhY2siIHN0cm9rZS1kYXNoYXJyYXk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHN0cm9rZS13aWR0aD0iMSIgdmlld0JveD0iMCAwIDIwLjAgMjAuMCIgaGVpZ2h0PSIyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmb250LWZhbWlseT0iJmFwb3M7RGlhbG9nJmFwb3M7IiBmb250LXN0eWxlPSJub3JtYWwiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIGZvbnQtc2l6ZT0iMTIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBpbWFnZS1yZW5kZXJpbmc9ImF1dG8iPjxkZWZzIGlkPSJnZW5lcmljRGVmcyIgIC8+PGcgID48ZyB0ZXh0LXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiBjb2xvci1yZW5kZXJpbmc9Im9wdGltaXplUXVhbGl0eSIgY29sb3ItaW50ZXJwb2xhdGlvbj0ibGluZWFyUkdCIiBpbWFnZS1yZW5kZXJpbmc9Im9wdGltaXplU3BlZWQiICAgID48bGluZSB5Mj0iMTUiIGZpbGw9Im5vbmUiIHgxPSIxIiB4Mj0iMTgiIHkxPSIxNSIgICAgICAvPjxwYXRoIGQ9Ik0xOSAxNS41IEwxMy4yOTM3IDE3LjM1NDEgQzEzLjI5MzcgMTcuMzU0MSAxNC40MzQ5IDE2Ljk4MzMgMTQuNDM0OSAxNS41IEMxNC40MzQ5IDE0LjAxNjcgMTMuMjkzNyAxMy42NDU5IDEzLjI5MzcgMTMuNjQ1OSBaIiBzdHJva2U9Im5vbmUiICAgICAgLz48cGF0aCBmaWxsPSJub25lIiBkPSJNMTkgMTUuNSBMMTMuMjkzNyAxNy4zNTQxIEMxMy4yOTM3IDE3LjM1NDEgMTQuNDM0OSAxNi45ODMzIDE0LjQzNDkgMTUuNSBDMTQuNDM0OSAxNC4wMTY3IDEzLjI5MzcgMTMuNjQ1OSAxMy4yOTM3IDEzLjY0NTkgWiIgICAgICAvPjxyZWN0IGZpbGw9ImdyYXkiIHg9IjEiIHdpZHRoPSI2IiBoZWlnaHQ9IjgiIHk9IjQiIHN0cm9rZT0ibm9uZSIgICAgICAvPjxyZWN0IGZpbGw9ImdyYXkiIHg9IjEzIiB3aWR0aD0iNiIgaGVpZ2h0PSI4IiB5PSI0IiBzdHJva2U9Im5vbmUiICAgIC8+PC9nICAgID48ZyBmb250LXNpemU9IjgiIGZpbGw9IndoaXRlIiB0ZXh0LXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiBpbWFnZS1yZW5kZXJpbmc9Im9wdGltaXplU3BlZWQiIGNvbG9yLXJlbmRlcmluZz0ib3B0aW1pemVRdWFsaXR5IiBmb250LWZhbWlseT0iJmFwb3M7THVjaWRhIEdyYW5kZSZhcG9zOyIgc3Ryb2tlPSJ3aGl0ZSIgY29sb3ItaW50ZXJwb2xhdGlvbj0ibGluZWFyUkdCIiAgICA+PHBhdGggZD0iTTIuNzAzMSAxMSBMMi43MDMxIDEwLjQyMTkgTDMuODU5NCAxMC40MjE5IEwzLjg1OTQgNS44NTk0IEwyLjcwMzEgNi4xNDg0IEwyLjcwMzEgNS41NTQ3IEw0LjYzMjggNS4wNzQyIEw0LjYzMjggMTAuNDIxOSBMNS43ODkxIDEwLjQyMTkgTDUuNzg5MSAxMSBaIiBzdHJva2U9Im5vbmUiICAgICAgLz48cGF0aCBkPSJNMTQuNzAzMSAxMSBMMTQuNzAzMSAxMC40MjE5IEwxNS44NTk0IDEwLjQyMTkgTDE1Ljg1OTQgNS44NTk0IEwxNC43MDMxIDYuMTQ4NCBMMTQuNzAzMSA1LjU1NDcgTDE2LjYzMjggNS4wNzQyIEwxNi42MzI4IDEwLjQyMTkgTDE3Ljc4OTEgMTAuNDIxOSBMMTcuNzg5MSAxMSBaIiBzdHJva2U9Im5vbmUiICAgIC8+PC9nICA+PC9nPjwvc3ZnPg==';
	d.BENZENE = 'PHN2ZyBmaWxsLW9wYWNpdHk9IjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBjb2xvci1yZW5kZXJpbmc9ImF1dG8iIGNvbG9yLWludGVycG9sYXRpb249ImF1dG8iIHRleHQtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2U9ImJsYWNrIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiB3aWR0aD0iMjAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc2hhcGUtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2Utb3BhY2l0eT0iMSIgZmlsbD0iYmxhY2siIHN0cm9rZS1kYXNoYXJyYXk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHN0cm9rZS13aWR0aD0iMSIgdmlld0JveD0iMCAwIDIwLjAgMjAuMCIgaGVpZ2h0PSIyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmb250LWZhbWlseT0iJmFwb3M7RGlhbG9nJmFwb3M7IiBmb250LXN0eWxlPSJub3JtYWwiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIGZvbnQtc2l6ZT0iMTIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBpbWFnZS1yZW5kZXJpbmc9ImF1dG8iPjxkZWZzIGlkPSJnZW5lcmljRGVmcyIgIC8+PGcgID48ZyB0ZXh0LXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMCwxMCkiIGNvbG9yLXJlbmRlcmluZz0ib3B0aW1pemVRdWFsaXR5IiBjb2xvci1pbnRlcnBvbGF0aW9uPSJsaW5lYXJSR0IiIGltYWdlLXJlbmRlcmluZz0ib3B0aW1pemVTcGVlZCIgICAgPjxsaW5lIHkyPSI1LjUiIGZpbGw9Im5vbmUiIHgxPSItNC43NjMxIiB4Mj0iLTAiIHkxPSIyLjc1IiAgICAgIC8+PGxpbmUgeTI9Ii0yLjc1IiBmaWxsPSJub25lIiB4MT0iNC43NjMxIiB4Mj0iNC43NjMxIiB5MT0iMi43NSIgICAgICAvPjxsaW5lIHkyPSItMi43NSIgZmlsbD0ibm9uZSIgeDE9IjAiIHgyPSItNC43NjMxIiB5MT0iLTUuNSIgICAgICAvPjxsaW5lIHkyPSI4LjUiIGZpbGw9Im5vbmUiIHgxPSItNy4zNjEyIiB4Mj0iLTAiIHkxPSI0LjI1IiAgICAgIC8+PGxpbmUgeTI9IjQuMjUiIGZpbGw9Im5vbmUiIHgxPSItMCIgeDI9IjcuMzYxMiIgeTE9IjguNSIgICAgICAvPjxsaW5lIHkyPSItNC4yNSIgZmlsbD0ibm9uZSIgeDE9IjcuMzYxMiIgeDI9IjcuMzYxMiIgeTE9IjQuMjUiICAgICAgLz48bGluZSB5Mj0iLTguNSIgZmlsbD0ibm9uZSIgeDE9IjcuMzYxMiIgeDI9IjAiIHkxPSItNC4yNSIgICAgICAvPjxsaW5lIHkyPSItNC4yNSIgZmlsbD0ibm9uZSIgeDE9IjAiIHgyPSItNy4zNjEyIiB5MT0iLTguNSIgICAgICAvPjxsaW5lIHkyPSI0LjI1IiBmaWxsPSJub25lIiB4MT0iLTcuMzYxMiIgeDI9Ii03LjM2MTIiIHkxPSItNC4yNSIgICAgLz48L2cgID48L2c+PC9zdmc+';
	d.BOND_ANY = 'PHN2ZyBmaWxsLW9wYWNpdHk9IjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBjb2xvci1yZW5kZXJpbmc9ImF1dG8iIGNvbG9yLWludGVycG9sYXRpb249ImF1dG8iIHRleHQtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2U9ImJsYWNrIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiB3aWR0aD0iMjAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc2hhcGUtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2Utb3BhY2l0eT0iMSIgZmlsbD0iYmxhY2siIHN0cm9rZS1kYXNoYXJyYXk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHN0cm9rZS13aWR0aD0iMSIgdmlld0JveD0iMCAwIDIwLjAgMjAuMCIgaGVpZ2h0PSIyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmb250LWZhbWlseT0iJmFwb3M7RGlhbG9nJmFwb3M7IiBmb250LXN0eWxlPSJub3JtYWwiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIGZvbnQtc2l6ZT0iMTIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBpbWFnZS1yZW5kZXJpbmc9ImF1dG8iPjxkZWZzIGlkPSJnZW5lcmljRGVmcyIgIC8+PGcgID48ZGVmcyBpZD0iZGVmczEiICAgID48Y2xpcFBhdGggY2xpcFBhdGhVbml0cz0idXNlclNwYWNlT25Vc2UiIGlkPSJjbGlwUGF0aDEiICAgICAgPjxwYXRoIGQ9Ik0wIDAgTDAgMjAgTDIwIDIwIEwyMCAxNCBMMSAxNCBMMSA3IEwyMCA3IEwyMCAwIFoiICAgICAgLz48L2NsaXBQYXRoICAgICAgPjxjbGlwUGF0aCBjbGlwUGF0aFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgaWQ9ImNsaXBQYXRoMiIgICAgICA+PHBhdGggZD0iTTAgMCBMMjAgMCBMMjAgMjAgTDAgMjAgTDAgMCBaIiAgICAgIC8+PC9jbGlwUGF0aCAgICA+PC9kZWZzICAgID48ZyB0ZXh0LXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiBmb250LXNpemU9IjgiIGZvbnQtZmFtaWx5PSImYXBvcztMdWNpZGEgR3JhbmRlJmFwb3M7IiBjb2xvci1pbnRlcnBvbGF0aW9uPSJsaW5lYXJSR0IiIGNvbG9yLXJlbmRlcmluZz0ib3B0aW1pemVRdWFsaXR5IiBpbWFnZS1yZW5kZXJpbmc9Im9wdGltaXplU3BlZWQiICAgID48bGluZSB5Mj0iMiIgZmlsbD0ibm9uZSIgeDE9IjIiIGNsaXAtcGF0aD0idXJsKCNjbGlwUGF0aDEpIiB4Mj0iMTgiIHkxPSIxOCIgICAgICAvPjxwYXRoIGQ9Ik01LjY3NTggMTEuNzg5MSBMNC42OTE0IDkuMjk2OSBMMy43MDMxIDExLjc4OTEgWk02LjU0MyAxNCBMNS45MTQxIDEyLjM5ODQgTDMuNDY0OCAxMi4zOTg0IEwyLjgyODEgMTQgTDIuMDY2NCAxNCBMNC4zNTk0IDguMjE4OCBMNS4xNzE5IDguMjE4OCBMNy40Mjk3IDE0IFpNOC43NDYxIDE0IEw4Ljc0NjEgOC4yMTg4IEw5LjU1MDggOC4yMTg4IEwxMi40NjA5IDEyLjY4MzYgTDEyLjQ2MDkgOC4yMTg4IEwxMy4xNjQxIDguMjE4OCBMMTMuMTY0MSAxNCBMMTIuMzYzMyAxNCBMOS40NDkyIDkuNTM1MiBMOS40NDkyIDE0IFpNMTUuOTk2MSAxNCBMMTUuOTk2MSAxMS41ODU5IEwxNC4wNjY0IDguMjE4OCBMMTUuMDAzOSA4LjIxODggTDE2LjUwMzkgMTAuODI4MSBMMTguMTIxMSA4LjIxODggTDE4Ljg4MjggOC4yMTg4IEwxNi44MTY0IDExLjU3MDMgTDE2LjgxNjQgMTQgWiIgY2xpcC1wYXRoPSJ1cmwoI2NsaXBQYXRoMikiIHN0cm9rZT0ibm9uZSIgICAgLz48L2cgID48L2c+PC9zdmc+';
	d.BOND_DOUBLE = 'PHN2ZyBmaWxsLW9wYWNpdHk9IjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBjb2xvci1yZW5kZXJpbmc9ImF1dG8iIGNvbG9yLWludGVycG9sYXRpb249ImF1dG8iIHRleHQtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2U9ImJsYWNrIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiB3aWR0aD0iMjAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc2hhcGUtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2Utb3BhY2l0eT0iMSIgZmlsbD0iYmxhY2siIHN0cm9rZS1kYXNoYXJyYXk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHN0cm9rZS13aWR0aD0iMSIgdmlld0JveD0iMCAwIDIwLjAgMjAuMCIgaGVpZ2h0PSIyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmb250LWZhbWlseT0iJmFwb3M7RGlhbG9nJmFwb3M7IiBmb250LXN0eWxlPSJub3JtYWwiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIGZvbnQtc2l6ZT0iMTIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBpbWFnZS1yZW5kZXJpbmc9ImF1dG8iPjxkZWZzIGlkPSJnZW5lcmljRGVmcyIgIC8+PGcgID48ZyB0ZXh0LXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiBjb2xvci1yZW5kZXJpbmc9Im9wdGltaXplUXVhbGl0eSIgY29sb3ItaW50ZXJwb2xhdGlvbj0ibGluZWFyUkdCIiBpbWFnZS1yZW5kZXJpbmc9Im9wdGltaXplU3BlZWQiICAgID48bGluZSB5Mj0iMSIgZmlsbD0ibm9uZSIgeDE9IjEiIHgyPSIxNyIgeTE9IjE3IiAgICAgIC8+PGxpbmUgeTI9IjMiIGZpbGw9Im5vbmUiIHgxPSIzIiB4Mj0iMTkiIHkxPSIxOSIgICAgLz48L2cgID48L2c+PC9zdmc+';
	d.BOND_DOUBLE_AMBIGUOUS = 'PHN2ZyBmaWxsLW9wYWNpdHk9IjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBjb2xvci1yZW5kZXJpbmc9ImF1dG8iIGNvbG9yLWludGVycG9sYXRpb249ImF1dG8iIHRleHQtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2U9ImJsYWNrIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiB3aWR0aD0iMjAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc2hhcGUtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2Utb3BhY2l0eT0iMSIgZmlsbD0iYmxhY2siIHN0cm9rZS1kYXNoYXJyYXk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHN0cm9rZS13aWR0aD0iMSIgdmlld0JveD0iMCAwIDIwLjAgMjAuMCIgaGVpZ2h0PSIyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmb250LWZhbWlseT0iJmFwb3M7RGlhbG9nJmFwb3M7IiBmb250LXN0eWxlPSJub3JtYWwiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIGZvbnQtc2l6ZT0iMTIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBpbWFnZS1yZW5kZXJpbmc9ImF1dG8iPjxkZWZzIGlkPSJnZW5lcmljRGVmcyIgIC8+PGcgID48ZyB0ZXh0LXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiBjb2xvci1yZW5kZXJpbmc9Im9wdGltaXplUXVhbGl0eSIgY29sb3ItaW50ZXJwb2xhdGlvbj0ibGluZWFyUkdCIiBpbWFnZS1yZW5kZXJpbmc9Im9wdGltaXplU3BlZWQiICAgID48bGluZSB5Mj0iMyIgZmlsbD0ibm9uZSIgeDE9IjEiIHgyPSIxOSIgeTE9IjE3IiAgICAgIC8+PGxpbmUgeTI9IjEiIGZpbGw9Im5vbmUiIHgxPSIzIiB4Mj0iMTciIHkxPSIxOSIgICAgLz48L2cgID48L2c+PC9zdmc+';
	d.BOND_HALF = 'PHN2ZyBmaWxsLW9wYWNpdHk9IjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBjb2xvci1yZW5kZXJpbmc9ImF1dG8iIGNvbG9yLWludGVycG9sYXRpb249ImF1dG8iIHRleHQtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2U9ImJsYWNrIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiB3aWR0aD0iMjAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc2hhcGUtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2Utb3BhY2l0eT0iMSIgZmlsbD0iYmxhY2siIHN0cm9rZS1kYXNoYXJyYXk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHN0cm9rZS13aWR0aD0iMSIgdmlld0JveD0iMCAwIDIwLjAgMjAuMCIgaGVpZ2h0PSIyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmb250LWZhbWlseT0iJmFwb3M7RGlhbG9nJmFwb3M7IiBmb250LXN0eWxlPSJub3JtYWwiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIGZvbnQtc2l6ZT0iMTIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBpbWFnZS1yZW5kZXJpbmc9ImF1dG8iPjxkZWZzIGlkPSJnZW5lcmljRGVmcyIgIC8+PGcgID48ZyBzdHJva2UtZGFzaG9mZnNldD0iMSIgdGV4dC1yZW5kZXJpbmc9Imdlb21ldHJpY1ByZWNpc2lvbiIgaW1hZ2UtcmVuZGVyaW5nPSJvcHRpbWl6ZVNwZWVkIiBjb2xvci1yZW5kZXJpbmc9Im9wdGltaXplUXVhbGl0eSIgc3Ryb2tlLWxpbmVqb2luPSJiZXZlbCIgc3Ryb2tlLWRhc2hhcnJheT0iMSwxLDQsNCw0LDQsNCw0LDQsMSIgY29sb3ItaW50ZXJwb2xhdGlvbj0ibGluZWFyUkdCIiBzdHJva2UtbWl0ZXJsaW1pdD0iMSIgICAgPjxsaW5lIHkyPSIyIiBmaWxsPSJub25lIiB4MT0iMiIgeDI9IjE4IiB5MT0iMTgiICAgIC8+PC9nICA+PC9nPjwvc3ZnPg==';
	d.BOND_PROTRUDING = 'PHN2ZyBmaWxsLW9wYWNpdHk9IjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBjb2xvci1yZW5kZXJpbmc9ImF1dG8iIGNvbG9yLWludGVycG9sYXRpb249ImF1dG8iIHRleHQtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2U9ImJsYWNrIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiB3aWR0aD0iMjAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc2hhcGUtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2Utb3BhY2l0eT0iMSIgZmlsbD0iYmxhY2siIHN0cm9rZS1kYXNoYXJyYXk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHN0cm9rZS13aWR0aD0iMSIgdmlld0JveD0iMCAwIDIwLjAgMjAuMCIgaGVpZ2h0PSIyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmb250LWZhbWlseT0iJmFwb3M7RGlhbG9nJmFwb3M7IiBmb250LXN0eWxlPSJub3JtYWwiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIGZvbnQtc2l6ZT0iMTIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBpbWFnZS1yZW5kZXJpbmc9ImF1dG8iPjxkZWZzIGlkPSJnZW5lcmljRGVmcyIgIC8+PGcgID48ZyB0ZXh0LXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiBjb2xvci1yZW5kZXJpbmc9Im9wdGltaXplUXVhbGl0eSIgY29sb3ItaW50ZXJwb2xhdGlvbj0ibGluZWFyUkdCIiBpbWFnZS1yZW5kZXJpbmc9Im9wdGltaXplU3BlZWQiICAgID48cG9seWdvbiBwb2ludHM9IiAyIDE4IDE2IDAgMjAgNCIgc3Ryb2tlPSJub25lIiAgICAvPjwvZyAgPjwvZz48L3N2Zz4=';
	d.BOND_QUADRUPLE = 'PHN2ZyBmaWxsLW9wYWNpdHk9IjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBjb2xvci1yZW5kZXJpbmc9ImF1dG8iIGNvbG9yLWludGVycG9sYXRpb249ImF1dG8iIHRleHQtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2U9ImJsYWNrIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiB3aWR0aD0iMjAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc2hhcGUtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2Utb3BhY2l0eT0iMSIgZmlsbD0iYmxhY2siIHN0cm9rZS1kYXNoYXJyYXk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHN0cm9rZS13aWR0aD0iMSIgdmlld0JveD0iMCAwIDIwLjAgMjAuMCIgaGVpZ2h0PSIyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmb250LWZhbWlseT0iJmFwb3M7RGlhbG9nJmFwb3M7IiBmb250LXN0eWxlPSJub3JtYWwiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIGZvbnQtc2l6ZT0iMTIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBpbWFnZS1yZW5kZXJpbmc9ImF1dG8iPjxkZWZzIGlkPSJnZW5lcmljRGVmcyIgIC8+PGcgID48ZyB0ZXh0LXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiBjb2xvci1yZW5kZXJpbmc9Im9wdGltaXplUXVhbGl0eSIgY29sb3ItaW50ZXJwb2xhdGlvbj0ibGluZWFyUkdCIiBpbWFnZS1yZW5kZXJpbmc9Im9wdGltaXplU3BlZWQiICAgID48bGluZSB5Mj0iMSIgZmlsbD0ibm9uZSIgeDE9IjEiIHgyPSIxMyIgeTE9IjEzIiAgICAgIC8+PGxpbmUgeTI9IjciIGZpbGw9Im5vbmUiIHgxPSI3IiB4Mj0iMTkiIHkxPSIxOSIgICAgICAvPjxsaW5lIHkyPSIzIiBmaWxsPSJub25lIiB4MT0iMyIgeDI9IjE1IiB5MT0iMTUiICAgICAgLz48bGluZSB5Mj0iNSIgZmlsbD0ibm9uZSIgeDE9IjUiIHgyPSIxNyIgeTE9IjE3IiAgICAvPjwvZyAgPjwvZz48L3N2Zz4=';
	d.BOND_QUINTUPLE = 'PHN2ZyBmaWxsLW9wYWNpdHk9IjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBjb2xvci1yZW5kZXJpbmc9ImF1dG8iIGNvbG9yLWludGVycG9sYXRpb249ImF1dG8iIHRleHQtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2U9ImJsYWNrIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiB3aWR0aD0iMjAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc2hhcGUtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2Utb3BhY2l0eT0iMSIgZmlsbD0iYmxhY2siIHN0cm9rZS1kYXNoYXJyYXk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHN0cm9rZS13aWR0aD0iMSIgdmlld0JveD0iMCAwIDIwLjAgMjAuMCIgaGVpZ2h0PSIyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmb250LWZhbWlseT0iJmFwb3M7RGlhbG9nJmFwb3M7IiBmb250LXN0eWxlPSJub3JtYWwiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIGZvbnQtc2l6ZT0iMTIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBpbWFnZS1yZW5kZXJpbmc9ImF1dG8iPjxkZWZzIGlkPSJnZW5lcmljRGVmcyIgIC8+PGcgID48ZyB0ZXh0LXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiBjb2xvci1yZW5kZXJpbmc9Im9wdGltaXplUXVhbGl0eSIgY29sb3ItaW50ZXJwb2xhdGlvbj0ibGluZWFyUkdCIiBpbWFnZS1yZW5kZXJpbmc9Im9wdGltaXplU3BlZWQiICAgID48bGluZSB5Mj0iMSIgZmlsbD0ibm9uZSIgeDE9IjEiIHgyPSIxMSIgeTE9IjExIiAgICAgIC8+PGxpbmUgeTI9IjkiIGZpbGw9Im5vbmUiIHgxPSI5IiB4Mj0iMTkiIHkxPSIxOSIgICAgICAvPjxsaW5lIHkyPSIzIiBmaWxsPSJub25lIiB4MT0iMyIgeDI9IjEzIiB5MT0iMTMiICAgICAgLz48bGluZSB5Mj0iNyIgZmlsbD0ibm9uZSIgeDE9IjciIHgyPSIxNyIgeTE9IjE3IiAgICAgIC8+PGxpbmUgeTI9IjUiIGZpbGw9Im5vbmUiIHgxPSI1IiB4Mj0iMTUiIHkxPSIxNSIgICAgLz48L2cgID48L2c+PC9zdmc+';
	d.BOND_RECESSED = 'PHN2ZyBmaWxsLW9wYWNpdHk9IjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBjb2xvci1yZW5kZXJpbmc9ImF1dG8iIGNvbG9yLWludGVycG9sYXRpb249ImF1dG8iIHRleHQtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2U9ImJsYWNrIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiB3aWR0aD0iMjAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc2hhcGUtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2Utb3BhY2l0eT0iMSIgZmlsbD0iYmxhY2siIHN0cm9rZS1kYXNoYXJyYXk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHN0cm9rZS13aWR0aD0iMSIgdmlld0JveD0iMCAwIDIwLjAgMjAuMCIgaGVpZ2h0PSIyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmb250LWZhbWlseT0iJmFwb3M7RGlhbG9nJmFwb3M7IiBmb250LXN0eWxlPSJub3JtYWwiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIGZvbnQtc2l6ZT0iMTIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBpbWFnZS1yZW5kZXJpbmc9ImF1dG8iPjxkZWZzIGlkPSJnZW5lcmljRGVmcyIgIC8+PGcgID48ZGVmcyBpZD0iZGVmczEiICAgID48Y2xpcFBhdGggY2xpcFBhdGhVbml0cz0idXNlclNwYWNlT25Vc2UiIGlkPSJjbGlwUGF0aDEiICAgICAgPjxwYXRoIGQ9Ik0yIDE4IEwxNiAwIEwyMCA0IFoiIGZpbGwtcnVsZT0iZXZlbm9kZCIgICAgICAvPjwvY2xpcFBhdGggICAgPjwvZGVmcyAgICA+PGcgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiIHN0cm9rZS1kYXNob2Zmc2V0PSIxLjIxIiB0ZXh0LXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiBpbWFnZS1yZW5kZXJpbmc9Im9wdGltaXplU3BlZWQiIGNvbG9yLXJlbmRlcmluZz0ib3B0aW1pemVRdWFsaXR5IiBzdHJva2UtbGluZWpvaW49ImJldmVsIiBzdHJva2UtZGFzaGFycmF5PSIxLjIxLDMiIGNvbG9yLWludGVycG9sYXRpb249ImxpbmVhclJHQiIgc3Ryb2tlLXdpZHRoPSI2LjIiIHN0cm9rZS1taXRlcmxpbWl0PSIxIiAgICA+PGxpbmUgeTI9IjIiIGZpbGw9Im5vbmUiIHgxPSIyIiBjbGlwLXBhdGg9InVybCgjY2xpcFBhdGgxKSIgeDI9IjE4IiB5MT0iMTgiICAgIC8+PC9nICA+PC9nPjwvc3ZnPg==';
	d.BOND_RESONANCE = 'PHN2ZyBmaWxsLW9wYWNpdHk9IjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBjb2xvci1yZW5kZXJpbmc9ImF1dG8iIGNvbG9yLWludGVycG9sYXRpb249ImF1dG8iIHRleHQtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2U9ImJsYWNrIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiB3aWR0aD0iMjAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc2hhcGUtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2Utb3BhY2l0eT0iMSIgZmlsbD0iYmxhY2siIHN0cm9rZS1kYXNoYXJyYXk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHN0cm9rZS13aWR0aD0iMSIgdmlld0JveD0iMCAwIDIwLjAgMjAuMCIgaGVpZ2h0PSIyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmb250LWZhbWlseT0iJmFwb3M7RGlhbG9nJmFwb3M7IiBmb250LXN0eWxlPSJub3JtYWwiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIGZvbnQtc2l6ZT0iMTIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBpbWFnZS1yZW5kZXJpbmc9ImF1dG8iPjxkZWZzIGlkPSJnZW5lcmljRGVmcyIgIC8+PGcgID48ZyB0ZXh0LXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiBjb2xvci1yZW5kZXJpbmc9Im9wdGltaXplUXVhbGl0eSIgY29sb3ItaW50ZXJwb2xhdGlvbj0ibGluZWFyUkdCIiBpbWFnZS1yZW5kZXJpbmc9Im9wdGltaXplU3BlZWQiICAgID48bGluZSB5Mj0iMSIgZmlsbD0ibm9uZSIgeDE9IjEiIHgyPSIxNyIgeTE9IjE3IiAgICAvPjwvZyAgICA+PGcgc3Ryb2tlLWRhc2hvZmZzZXQ9IjEiIHRleHQtcmVuZGVyaW5nPSJnZW9tZXRyaWNQcmVjaXNpb24iIGltYWdlLXJlbmRlcmluZz0ib3B0aW1pemVTcGVlZCIgY29sb3ItcmVuZGVyaW5nPSJvcHRpbWl6ZVF1YWxpdHkiIHN0cm9rZS1saW5lam9pbj0iYmV2ZWwiIHN0cm9rZS1kYXNoYXJyYXk9IjEsMSw0LDQsNCw0LDQsNCw0LDEiIGNvbG9yLWludGVycG9sYXRpb249ImxpbmVhclJHQiIgc3Ryb2tlLW1pdGVybGltaXQ9IjEiICAgID48bGluZSB5Mj0iMyIgZmlsbD0ibm9uZSIgeDE9IjMiIHgyPSIxOSIgeTE9IjE5IiAgICAvPjwvZyAgPjwvZz48L3N2Zz4=';
	d.BOND_SEXTUPLE = 'PHN2ZyBmaWxsLW9wYWNpdHk9IjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBjb2xvci1yZW5kZXJpbmc9ImF1dG8iIGNvbG9yLWludGVycG9sYXRpb249ImF1dG8iIHRleHQtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2U9ImJsYWNrIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiB3aWR0aD0iMjAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc2hhcGUtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2Utb3BhY2l0eT0iMSIgZmlsbD0iYmxhY2siIHN0cm9rZS1kYXNoYXJyYXk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHN0cm9rZS13aWR0aD0iMSIgdmlld0JveD0iMCAwIDIwLjAgMjAuMCIgaGVpZ2h0PSIyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmb250LWZhbWlseT0iJmFwb3M7RGlhbG9nJmFwb3M7IiBmb250LXN0eWxlPSJub3JtYWwiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIGZvbnQtc2l6ZT0iMTIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBpbWFnZS1yZW5kZXJpbmc9ImF1dG8iPjxkZWZzIGlkPSJnZW5lcmljRGVmcyIgIC8+PGcgID48ZyB0ZXh0LXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiBjb2xvci1yZW5kZXJpbmc9Im9wdGltaXplUXVhbGl0eSIgY29sb3ItaW50ZXJwb2xhdGlvbj0ibGluZWFyUkdCIiBpbWFnZS1yZW5kZXJpbmc9Im9wdGltaXplU3BlZWQiICAgID48bGluZSB5Mj0iMSIgZmlsbD0ibm9uZSIgeDE9IjEiIHgyPSI5IiB5MT0iOSIgICAgICAvPjxsaW5lIHkyPSIxMSIgZmlsbD0ibm9uZSIgeDE9IjExIiB4Mj0iMTkiIHkxPSIxOSIgICAgICAvPjxsaW5lIHkyPSIzIiBmaWxsPSJub25lIiB4MT0iMyIgeDI9IjExIiB5MT0iMTEiICAgICAgLz48bGluZSB5Mj0iOSIgZmlsbD0ibm9uZSIgeDE9IjkiIHgyPSIxNyIgeTE9IjE3IiAgICAgIC8+PGxpbmUgeTI9IjUiIGZpbGw9Im5vbmUiIHgxPSI1IiB4Mj0iMTMiIHkxPSIxMyIgICAgICAvPjxsaW5lIHkyPSI3IiBmaWxsPSJub25lIiB4MT0iNyIgeDI9IjE1IiB5MT0iMTUiICAgIC8+PC9nICA+PC9nPjwvc3ZnPg==';
	d.BOND_SINGLE = 'PHN2ZyBmaWxsLW9wYWNpdHk9IjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBjb2xvci1yZW5kZXJpbmc9ImF1dG8iIGNvbG9yLWludGVycG9sYXRpb249ImF1dG8iIHRleHQtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2U9ImJsYWNrIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiB3aWR0aD0iMjAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc2hhcGUtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2Utb3BhY2l0eT0iMSIgZmlsbD0iYmxhY2siIHN0cm9rZS1kYXNoYXJyYXk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHN0cm9rZS13aWR0aD0iMSIgdmlld0JveD0iMCAwIDIwLjAgMjAuMCIgaGVpZ2h0PSIyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmb250LWZhbWlseT0iJmFwb3M7RGlhbG9nJmFwb3M7IiBmb250LXN0eWxlPSJub3JtYWwiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIGZvbnQtc2l6ZT0iMTIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBpbWFnZS1yZW5kZXJpbmc9ImF1dG8iPjxkZWZzIGlkPSJnZW5lcmljRGVmcyIgIC8+PGcgID48ZyB0ZXh0LXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiBjb2xvci1yZW5kZXJpbmc9Im9wdGltaXplUXVhbGl0eSIgY29sb3ItaW50ZXJwb2xhdGlvbj0ibGluZWFyUkdCIiBpbWFnZS1yZW5kZXJpbmc9Im9wdGltaXplU3BlZWQiICAgID48bGluZSB5Mj0iMiIgZmlsbD0ibm9uZSIgeDE9IjIiIHgyPSIxOCIgeTE9IjE4IiAgICAvPjwvZyAgPjwvZz48L3N2Zz4=';
	d.BOND_TRIPLE = 'PHN2ZyBmaWxsLW9wYWNpdHk9IjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBjb2xvci1yZW5kZXJpbmc9ImF1dG8iIGNvbG9yLWludGVycG9sYXRpb249ImF1dG8iIHRleHQtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2U9ImJsYWNrIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiB3aWR0aD0iMjAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc2hhcGUtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2Utb3BhY2l0eT0iMSIgZmlsbD0iYmxhY2siIHN0cm9rZS1kYXNoYXJyYXk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHN0cm9rZS13aWR0aD0iMSIgdmlld0JveD0iMCAwIDIwLjAgMjAuMCIgaGVpZ2h0PSIyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmb250LWZhbWlseT0iJmFwb3M7RGlhbG9nJmFwb3M7IiBmb250LXN0eWxlPSJub3JtYWwiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIGZvbnQtc2l6ZT0iMTIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBpbWFnZS1yZW5kZXJpbmc9ImF1dG8iPjxkZWZzIGlkPSJnZW5lcmljRGVmcyIgIC8+PGcgID48ZyB0ZXh0LXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiBjb2xvci1yZW5kZXJpbmc9Im9wdGltaXplUXVhbGl0eSIgY29sb3ItaW50ZXJwb2xhdGlvbj0ibGluZWFyUkdCIiBpbWFnZS1yZW5kZXJpbmc9Im9wdGltaXplU3BlZWQiICAgID48bGluZSB5Mj0iMSIgZmlsbD0ibm9uZSIgeDE9IjEiIHgyPSIxNSIgeTE9IjE1IiAgICAgIC8+PGxpbmUgeTI9IjMiIGZpbGw9Im5vbmUiIHgxPSIzIiB4Mj0iMTciIHkxPSIxNyIgICAgICAvPjxsaW5lIHkyPSI1IiBmaWxsPSJub25lIiB4MT0iNSIgeDI9IjE5IiB5MT0iMTkiICAgIC8+PC9nICA+PC9nPjwvc3ZnPg==';
	d.BOND_WAVY = 'PHN2ZyBmaWxsLW9wYWNpdHk9IjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBjb2xvci1yZW5kZXJpbmc9ImF1dG8iIGNvbG9yLWludGVycG9sYXRpb249ImF1dG8iIHRleHQtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2U9ImJsYWNrIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiB3aWR0aD0iMjAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc2hhcGUtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2Utb3BhY2l0eT0iMSIgZmlsbD0iYmxhY2siIHN0cm9rZS1kYXNoYXJyYXk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHN0cm9rZS13aWR0aD0iMSIgdmlld0JveD0iMCAwIDIwLjAgMjAuMCIgaGVpZ2h0PSIyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmb250LWZhbWlseT0iJmFwb3M7RGlhbG9nJmFwb3M7IiBmb250LXN0eWxlPSJub3JtYWwiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIGZvbnQtc2l6ZT0iMTIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBpbWFnZS1yZW5kZXJpbmc9ImF1dG8iPjxkZWZzIGlkPSJnZW5lcmljRGVmcyIgIC8+PGcgID48ZyB0ZXh0LXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiBjb2xvci1yZW5kZXJpbmc9Im9wdGltaXplUXVhbGl0eSIgY29sb3ItaW50ZXJwb2xhdGlvbj0ibGluZWFyUkdCIiBpbWFnZS1yZW5kZXJpbmc9Im9wdGltaXplU3BlZWQiICAgID48cGF0aCBmaWxsPSJub25lIiBkPSJNMiAxOCBRNy4zMDMzIDE5Ljc2NzggNS41MzU1IDE0LjQ2NDUgUTMuNzY3OCA5LjE2MTIgOS4wNzExIDEwLjkyODkgUTE0LjM3NDQgMTIuNjk2NyAxMi42MDY2IDcuMzkzNCBRMTAuODM4OCAyLjA5MDEgMTYuMTQyMSAzLjg1NzkiICAgIC8+PC9nICA+PC9nPjwvc3ZnPg==';
	d.BOND_ZERO = 'PHN2ZyBmaWxsLW9wYWNpdHk9IjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBjb2xvci1yZW5kZXJpbmc9ImF1dG8iIGNvbG9yLWludGVycG9sYXRpb249ImF1dG8iIHRleHQtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2U9ImJsYWNrIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiB3aWR0aD0iMjAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc2hhcGUtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2Utb3BhY2l0eT0iMSIgZmlsbD0iYmxhY2siIHN0cm9rZS1kYXNoYXJyYXk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHN0cm9rZS13aWR0aD0iMSIgdmlld0JveD0iMCAwIDIwLjAgMjAuMCIgaGVpZ2h0PSIyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmb250LWZhbWlseT0iJmFwb3M7RGlhbG9nJmFwb3M7IiBmb250LXN0eWxlPSJub3JtYWwiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIGZvbnQtc2l6ZT0iMTIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBpbWFnZS1yZW5kZXJpbmc9ImF1dG8iPjxkZWZzIGlkPSJnZW5lcmljRGVmcyIgIC8+PGcgID48ZyB0ZXh0LXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiBjb2xvci1yZW5kZXJpbmc9Im9wdGltaXplUXVhbGl0eSIgY29sb3ItaW50ZXJwb2xhdGlvbj0ibGluZWFyUkdCIiBpbWFnZS1yZW5kZXJpbmc9Im9wdGltaXplU3BlZWQiICAgID48Y2lyY2xlIHI9IjEiIGN4PSI1IiBjeT0iMTYiIHN0cm9rZT0ibm9uZSIgICAgICAvPjxjaXJjbGUgcj0iMSIgY3g9IjkiIGN5PSIxMiIgc3Ryb2tlPSJub25lIiAgICAgIC8+PGNpcmNsZSByPSIxIiBjeD0iMTMiIGN5PSI4IiBzdHJva2U9Im5vbmUiICAgICAgLz48Y2lyY2xlIHI9IjEiIGN4PSIxNyIgY3k9IjQiIHN0cm9rZT0ibm9uZSIgICAgLz48L2cgID48L2c+PC9zdmc+';
	d.BRACKET_CHARGE = 'PHN2ZyBmaWxsLW9wYWNpdHk9IjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBjb2xvci1yZW5kZXJpbmc9ImF1dG8iIGNvbG9yLWludGVycG9sYXRpb249ImF1dG8iIHRleHQtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2U9ImJsYWNrIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiB3aWR0aD0iMjAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc2hhcGUtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2Utb3BhY2l0eT0iMSIgZmlsbD0iYmxhY2siIHN0cm9rZS1kYXNoYXJyYXk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHN0cm9rZS13aWR0aD0iMSIgdmlld0JveD0iMCAwIDIwLjAgMjAuMCIgaGVpZ2h0PSIyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmb250LWZhbWlseT0iJmFwb3M7RGlhbG9nJmFwb3M7IiBmb250LXN0eWxlPSJub3JtYWwiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIGZvbnQtc2l6ZT0iMTIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBpbWFnZS1yZW5kZXJpbmc9ImF1dG8iPjxkZWZzIGlkPSJnZW5lcmljRGVmcyIgIC8+PGcgID48ZyB0ZXh0LXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiBjb2xvci1yZW5kZXJpbmc9Im9wdGltaXplUXVhbGl0eSIgY29sb3ItaW50ZXJwb2xhdGlvbj0ibGluZWFyUkdCIiBzdHJva2UtbGluZWNhcD0iYnV0dCIgaW1hZ2UtcmVuZGVyaW5nPSJvcHRpbWl6ZVNwZWVkIiAgICA+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTMgMyBMMSAzIEwxIDE3IEwzIDE3IE05IDE3IEwxMSAxNyBMMTEgMyBMOSAzIiAgICAgIC8+PHBhdGggZD0iTTEzLjMwMDggMTAgTDEzLjMwMDggOS4xMzI4IEwyMC4yMzgzIDkuMTMyOCBMMjAuMjM4MyAxMCBaTTE2LjMzNTkgOC4yNjU2IEwxNi4zMzU5IDYuMDk3NyBMMTMuMzAwOCA2LjA5NzcgTDEzLjMwMDggNS4yMzA1IEwxNi4zMzU5IDUuMjMwNSBMMTYuMzM1OSAzLjA2MjUgTDE3LjIwMzEgMy4wNjI1IEwxNy4yMDMxIDUuMjMwNSBMMjAuMjM4MyA1LjIzMDUgTDIwLjIzODMgNi4wOTc3IEwxNy4yMDMxIDYuMDk3NyBMMTcuMjAzMSA4LjI2NTYgWiIgc3Ryb2tlPSJub25lIiAgICAvPjwvZyAgPjwvZz48L3N2Zz4=';
	d.BRACKET_DYNAMIC = 'PHN2ZyBmaWxsLW9wYWNpdHk9IjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBjb2xvci1yZW5kZXJpbmc9ImF1dG8iIGNvbG9yLWludGVycG9sYXRpb249ImF1dG8iIHRleHQtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2U9ImJsYWNrIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiB3aWR0aD0iMjAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc2hhcGUtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2Utb3BhY2l0eT0iMSIgZmlsbD0iYmxhY2siIHN0cm9rZS1kYXNoYXJyYXk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHN0cm9rZS13aWR0aD0iMSIgdmlld0JveD0iMCAwIDIwLjAgMjAuMCIgaGVpZ2h0PSIyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmb250LWZhbWlseT0iJmFwb3M7RGlhbG9nJmFwb3M7IiBmb250LXN0eWxlPSJub3JtYWwiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIGZvbnQtc2l6ZT0iMTIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBpbWFnZS1yZW5kZXJpbmc9ImF1dG8iPjxkZWZzIGlkPSJnZW5lcmljRGVmcyIgIC8+PGcgID48ZGVmcyBpZD0iZGVmczEiICAgID48bGluZWFyR3JhZGllbnQgeDE9IjE1IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDI9IjIwIiB5MT0iMTUiIHkyPSIyMCIgaWQ9ImxpbmVhckdyYWRpZW50MSIgc3ByZWFkTWV0aG9kPSJwYWQiICAgICAgPjxzdG9wIHN0b3Atb3BhY2l0eT0iMSIgc3RvcC1jb2xvcj0iYmx1ZSIgb2Zmc2V0PSIwJSIgICAgICAgIC8+PHN0b3Agc3RvcC1vcGFjaXR5PSIxIiBzdG9wLWNvbG9yPSJibGFjayIgb2Zmc2V0PSIxMDAlIiAgICAgIC8+PC9saW5lYXJHcmFkaWVudCAgICA+PC9kZWZzICAgID48ZyB0ZXh0LXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiBjb2xvci1yZW5kZXJpbmc9Im9wdGltaXplUXVhbGl0eSIgY29sb3ItaW50ZXJwb2xhdGlvbj0ibGluZWFyUkdCIiBpbWFnZS1yZW5kZXJpbmc9Im9wdGltaXplU3BlZWQiICAgID48bGluZSB5Mj0iMSIgZmlsbD0ibm9uZSIgeDE9IjEiIHgyPSIzIiB5MT0iMSIgICAgICAvPjxsaW5lIHkyPSIxNiIgZmlsbD0ibm9uZSIgeDE9IjEiIHgyPSIxIiB5MT0iMSIgICAgICAvPjxsaW5lIHkyPSIxNiIgZmlsbD0ibm9uZSIgeDE9IjEiIHgyPSIzIiB5MT0iMTYiICAgICAgLz48bGluZSB5Mj0iMSIgZmlsbD0ibm9uZSIgeDE9IjEwIiB4Mj0iOCIgeTE9IjEiICAgICAgLz48bGluZSB5Mj0iMTYiIGZpbGw9Im5vbmUiIHgxPSIxMCIgeDI9IjEwIiB5MT0iMSIgICAgICAvPjxsaW5lIHkyPSIxNiIgZmlsbD0ibm9uZSIgeDE9IjEwIiB4Mj0iOCIgeTE9IjE2IiAgICAvPjwvZyAgICA+PGcgZm9udC1zaXplPSIxNSIgZmlsbD0idXJsKCNsaW5lYXJHcmFkaWVudDEpIiB0ZXh0LXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiBpbWFnZS1yZW5kZXJpbmc9Im9wdGltaXplU3BlZWQiIGNvbG9yLXJlbmRlcmluZz0ib3B0aW1pemVRdWFsaXR5IiBmb250LWZhbWlseT0ic2VyaWYiIHN0cm9rZT0idXJsKCNsaW5lYXJHcmFkaWVudDEpIiBjb2xvci1pbnRlcnBvbGF0aW9uPSJsaW5lYXJSR0IiIGZvbnQtd2VpZ2h0PSJib2xkIiAgICA+PHBhdGggZD0iTTEyLjI0MTcgMTguNjQxMSBRMTIuNjUxOSAxOC41ODk4IDEyLjg0NTkgMTguNDE3NyBRMTMuMDQgMTguMjQ1NiAxMy4wNCAxNy43MzI5IEwxMy4wNCAxMy4zMjM3IFExMy4wNCAxMi44Njk2IDEyLjg4MjYgMTIuNjkzOCBRMTIuNzI1MSAxMi41MTgxIDEyLjI0MTcgMTIuNDU5NSBMMTIuMjQxNyAxMi4wOTMzIEwxNS4wODM1IDEyLjA5MzMgTDE1LjA4MzUgMTMuMTY5OSBRMTUuNDQyNCAxMi42Mjc5IDE1Ljk5NTQgMTIuMjcyNyBRMTYuNTQ4MyAxMS45MTc1IDE3LjIyMjIgMTEuOTE3NSBRMTguMTg5IDExLjkxNzUgMTguNzIgMTIuNDE1NSBRMTkuMjUxIDEyLjkxMzYgMTkuMjUxIDE0LjE2NiBMMTkuMjUxIDE3Ljc5MTUgUTE5LjI1MSAxOC4yOTY5IDE5LjQyMzEgMTguNDQzNCBRMTkuNTk1MiAxOC41ODk4IDE5Ljk5OCAxOC42NDExIEwxOS45OTggMTkgTDE2LjQ3NTEgMTkgTDE2LjQ3NTEgMTguNjQxMSBRMTYuODc3OSAxOC41NjA1IDE3LjAyNDQgMTguNDIxNCBRMTcuMTcwOSAxOC4yODIyIDE3LjE3MDkgMTcuNzkxNSBMMTcuMTcwOSAxNC4xNTg3IFExNy4xNzA5IDEzLjY0NiAxNy4wNjg0IDEzLjM4OTYgUTE2Ljg5MjYgMTIuOTI4MiAxNi4zNzI2IDEyLjkyODIgUTE1Ljk4NDQgMTIuOTI4MiAxNS42NTg0IDEzLjIxMDIgUTE1LjMzMjUgMTMuNDkyMiAxNS4xNTY3IDEzLjc3NzggTDE1LjE1NjcgMTcuNzkxNSBRMTUuMTU2NyAxOC4yODIyIDE1LjMwMzIgMTguNDIxNCBRMTUuNDQ5NyAxOC41NjA1IDE1Ljg1MjUgMTguNjQxMSBMMTUuODUyNSAxOSBMMTIuMjQxNyAxOSBaIiBzdHJva2U9Im5vbmUiICAgIC8+PC9nICA+PC9nPjwvc3ZnPg==';
	d.BROMINE = 'PHN2ZyBmaWxsLW9wYWNpdHk9IjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBjb2xvci1yZW5kZXJpbmc9ImF1dG8iIGNvbG9yLWludGVycG9sYXRpb249ImF1dG8iIHRleHQtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2U9ImJsYWNrIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiB3aWR0aD0iMjAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc2hhcGUtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2Utb3BhY2l0eT0iMSIgZmlsbD0iYmxhY2siIHN0cm9rZS1kYXNoYXJyYXk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHN0cm9rZS13aWR0aD0iMSIgdmlld0JveD0iMCAwIDIwLjAgMjAuMCIgaGVpZ2h0PSIyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmb250LWZhbWlseT0iJmFwb3M7RGlhbG9nJmFwb3M7IiBmb250LXN0eWxlPSJub3JtYWwiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIGZvbnQtc2l6ZT0iMTIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBpbWFnZS1yZW5kZXJpbmc9ImF1dG8iPjxkZWZzIGlkPSJnZW5lcmljRGVmcyIgIC8+PGcgID48ZyBmb250LXNpemU9IjE0IiBmaWxsPSJyZ2IoMTY2LDQxLDQxKSIgdGV4dC1yZW5kZXJpbmc9Imdlb21ldHJpY1ByZWNpc2lvbiIgaW1hZ2UtcmVuZGVyaW5nPSJvcHRpbWl6ZVNwZWVkIiBjb2xvci1yZW5kZXJpbmc9Im9wdGltaXplUXVhbGl0eSIgZm9udC1mYW1pbHk9IiZhcG9zO0x1Y2lkYSBHcmFuZGUmYXBvczsiIHN0cm9rZT0icmdiKDE2Niw0MSw0MSkiIGNvbG9yLWludGVycG9sYXRpb249ImxpbmVhclJHQiIgICAgPjxwYXRoIGQ9Ik00LjMwNTcgMTUgTDQuMzA1NyA0Ljg4MjggTDYuOTMwNyA0Ljg4MjggUTguNDQ4MiA0Ljg4MjggOS4yNTgzIDUuNDU3IFExMC4wNjg0IDYuMDMxMiAxMC4wNjg0IDcuMTExMyBRMTAuMDY4NCA4Ljk1MDIgNy45OTAyIDkuNzI5NSBRMTAuNDcxNyAxMC40ODgzIDEwLjQ3MTcgMTIuNDcwNyBRMTAuNDcxNyAxMy43MDEyIDkuNjUxNCAxNC4zNTA2IFE4LjgzMTEgMTUgNy4yODYxIDE1IFpNNS43Mjc1IDEzLjkyNjggTDYuMDIxNSAxMy45MjY4IFE3LjYwMDYgMTMuOTI2OCA4LjA2NTQgMTMuNzI4NSBROC45NTQxIDEzLjM1MjUgOC45NTQxIDEyLjMzNCBROC45NTQxIDExLjQzMTYgOC4xNDc1IDEwLjgzMzUgUTcuMzQwOCAxMC4yMzU0IDYuMTMwOSAxMC4yMzU0IEw1LjcyNzUgMTAuMjM1NCBaTTUuNzI3NSA5LjMyNjIgTDYuMTg1NSA5LjMyNjIgUTcuMzM0IDkuMzI2MiA3Ljk2NjMgOC44MzQgUTguNTk4NiA4LjM0MTggOC41OTg2IDcuNDQ2MyBROC41OTg2IDUuOTU2MSA2LjI4ODEgNS45NTYxIEw1LjcyNzUgNS45NTYxIFpNMTIuMzQ2NyAxNSBMMTIuMzQ2NyA3LjU3NjIgTDEzLjY5MzQgNy41NzYyIEwxMy42OTM0IDguOTcwNyBRMTQuNDkzMiA3LjQxMjEgMTYuMDE3NiA3LjQxMjEgUTE2LjIyMjcgNy40MTIxIDE2LjQ0ODIgNy40NDYzIEwxNi40NDgyIDguNzA0MSBRMTYuMDk5NiA4LjU4NzkgMTUuODMzIDguNTg3OSBRMTQuNTU0NyA4LjU4NzkgMTMuNjkzNCAxMC4xMDU1IEwxMy42OTM0IDE1IFoiIHN0cm9rZT0ibm9uZSIgICAgLz48L2cgID48L2c+PC9zdmc+';
	d.CALCULATE = 'PHN2ZyB0PSIxNTg3NzEyMTIwNTk1IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjM3OTE4IiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiPjxwYXRoIGQ9Ik04NjQgMEgxNjBDMTA4LjggMCA2NCA0NC44IDY0IDk2djgzMmMwIDUxLjIgNDQuOCA5NiA5NiA5Nmg3MDRjNTEuMiAwIDk2LTQ0LjggOTYtOTZWOTZjMC01MS4yLTQ0LjgtOTYtOTYtOTZ6TTMyMCA4NzAuNGMwIDEyLjgtMTIuOCAyNS42LTI1LjYgMjUuNkgyMTcuNmMtMTIuOCAwLTI1LjYtMTIuOC0yNS42LTI1LjZ2LTc2LjhjMC0xMi44IDEyLjgtMjUuNiAyNS42LTI1LjZoNzYuOGMxMi44IDAgMjUuNiAxMi44IDI1LjYgMjUuNnY3Ni44eiBtMC0yNTZjMCAxMi44LTEyLjggMjUuNi0yNS42IDI1LjZIMjE3LjZjLTEyLjggMC0yNS42LTEyLjgtMjUuNi0yNS42di03Ni44YzAtMTIuOCAxMi44LTI1LjYgMjUuNi0yNS42aDc2LjhjMTIuOCAwIDI1LjYgMTIuOCAyNS42IDI1LjZ2NzYuOHogbTI1NiAyNTZjMCAxMi44LTEyLjggMjUuNi0yNS42IDI1LjZoLTc2LjhjLTEyLjggMC0yNS42LTEyLjgtMjUuNi0yNS42di03Ni44YzAtMTIuOCAxMi44LTI1LjYgMjUuNi0yNS42aDc2LjhjMTIuOCAwIDI1LjYgMTIuOCAyNS42IDI1LjZ2NzYuOHogbTAtMjU2YzAgMTIuOC0xMi44IDI1LjYtMjUuNiAyNS42aC03Ni44Yy0xMi44IDAtMjUuNi0xMi44LTI1LjYtMjUuNnYtNzYuOGMwLTEyLjggMTIuOC0yNS42IDI1LjYtMjUuNmg3Ni44YzEyLjggMCAyNS42IDEyLjggMjUuNiAyNS42djc2Ljh6IG0yNTYgMjU2YzAgMTIuOC0xMi44IDI1LjYtMjUuNiAyNS42aC03Ni44Yy0xMi44IDAtMjUuNi0xMi44LTI1LjYtMjUuNlY1MzcuNmMwLTEyLjggMTIuOC0yNS42IDI1LjYtMjUuNmg3Ni44YzEyLjggMCAyNS42IDEyLjggMjUuNiAyNS42djMzMi44eiBtMC01MTJjMCAxMi44LTEyLjggMjUuNi0yNS42IDI1LjZIMjE3LjZjLTEyLjggMC0yNS42LTEyLjgtMjUuNi0yNS42VjE1My42QzE5MiAxNDAuOCAyMDQuOCAxMjggMjE3LjYgMTI4aDU4OC44YzEyLjggMCAyNS42IDEyLjggMjUuNiAyNS42djIwNC44eiIgcC1pZD0iMzc5MTkiPjwvcGF0aD48L3N2Zz4=';
	d.CARBON = 'PHN2ZyBmaWxsLW9wYWNpdHk9IjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBjb2xvci1yZW5kZXJpbmc9ImF1dG8iIGNvbG9yLWludGVycG9sYXRpb249ImF1dG8iIHRleHQtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2U9ImJsYWNrIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiB3aWR0aD0iMjAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc2hhcGUtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2Utb3BhY2l0eT0iMSIgZmlsbD0iYmxhY2siIHN0cm9rZS1kYXNoYXJyYXk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHN0cm9rZS13aWR0aD0iMSIgdmlld0JveD0iMCAwIDIwLjAgMjAuMCIgaGVpZ2h0PSIyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmb250LWZhbWlseT0iJmFwb3M7RGlhbG9nJmFwb3M7IiBmb250LXN0eWxlPSJub3JtYWwiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIGZvbnQtc2l6ZT0iMTIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBpbWFnZS1yZW5kZXJpbmc9ImF1dG8iPjxkZWZzIGlkPSJnZW5lcmljRGVmcyIgIC8+PGcgID48ZyBmb250LXNpemU9IjE0IiBmaWxsPSJyZ2IoMTQ0LDE0NCwxNDQpIiB0ZXh0LXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiBpbWFnZS1yZW5kZXJpbmc9Im9wdGltaXplU3BlZWQiIGNvbG9yLXJlbmRlcmluZz0ib3B0aW1pemVRdWFsaXR5IiBmb250LWZhbWlseT0iJmFwb3M7THVjaWRhIEdyYW5kZSZhcG9zOyIgc3Ryb2tlPSJyZ2IoMTQ0LDE0NCwxNDQpIiBjb2xvci1pbnRlcnBvbGF0aW9uPSJsaW5lYXJSR0IiICAgID48cGF0aCBkPSJNMTAuNjM5NiAxNS4yNTI5IFE4LjI4MTIgMTUuMjUyOSA2Ljk5NjEgMTMuODY4NyBRNS43MTA5IDEyLjQ4NDQgNS43MTA5IDkuOTQ4MiBRNS43MTA5IDcuNDE4OSA3LjAyIDYuMDI0NCBROC4zMjkxIDQuNjI5OSAxMC43MDggNC42Mjk5IFExMi4wNjg0IDQuNjI5OSAxMy44OTM2IDUuMDc0MiBMMTMuODkzNiA2LjQyMDkgUTExLjgxNTQgNS43MDMxIDEwLjY4NzUgNS43MDMxIFE5LjA0IDUuNzAzMSA4LjEzNzcgNi44MTc0IFE3LjIzNTQgNy45MzE2IDcuMjM1NCA5Ljk2MTkgUTcuMjM1NCAxMS44OTY1IDguMTk5MiAxMy4wMTQyIFE5LjE2MzEgMTQuMTMxOCAxMC44MzExIDE0LjEzMTggUTEyLjI2NjYgMTQuMTMxOCAxMy45MDcyIDEzLjI1IEwxMy45MDcyIDE0LjQ4MDUgUTEyLjQxMDIgMTUuMjUyOSAxMC42Mzk2IDE1LjI1MjkgWiIgc3Ryb2tlPSJub25lIiAgICAvPjwvZyAgPjwvZz48L3N2Zz4=';
	d.CENTER = 'PHN2ZyB0PSIxNTg3NzEyMjA3NjI2IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjM5OTExIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiPjxwYXRoIGQ9Ik01MTIgMzQxLjMzMzMzM2MtOTQuMjkzMzMzIDAtMTcwLjY2NjY2NyA3Ni4zNzMzMzMtMTcwLjY2NjY2NyAxNzAuNjY2NjY3czc2LjM3MzMzMyAxNzAuNjY2NjY3IDE3MC42NjY2NjcgMTcwLjY2NjY2NyAxNzAuNjY2NjY3LTc2LjM3MzMzMyAxNzAuNjY2NjY3LTE3MC42NjY2NjctNzYuMzczMzMzLTE3MC42NjY2NjctMTcwLjY2NjY2Ny0xNzAuNjY2NjY3eiBtLTM0MS4zMzMzMzMgMjk4LjY2NjY2N2MtMjMuNDY2NjY3IDAtNDIuNjY2NjY3IDE5LjItNDIuNjY2NjY3IDQyLjY2NjY2N3YxMjhjMCA0Ni45MzMzMzMgMzguNCA4NS4zMzMzMzMgODUuMzMzMzMzIDg1LjMzMzMzM2gxMjhjMjMuNDY2NjY3IDAgNDIuNjY2NjY3LTE5LjIgNDIuNjY2NjY3LTQyLjY2NjY2N3MtMTkuMi00Mi42NjY2NjctNDIuNjY2NjY3LTQyLjY2NjY2NkgyNTZjLTIzLjQ2NjY2NyAwLTQyLjY2NjY2Ny0xOS4yLTQyLjY2NjY2Ny00Mi42NjY2Njd2LTg1LjMzMzMzM2MwLTIzLjQ2NjY2Ny0xOS4yLTQyLjY2NjY2Ny00Mi42NjY2NjYtNDIuNjY2NjY3eiBtNDIuNjY2NjY2LTM4NGMwLTIzLjQ2NjY2NyAxOS4yLTQyLjY2NjY2NyA0Mi42NjY2NjctNDIuNjY2NjY3aDg1LjMzMzMzM2MyMy40NjY2NjcgMCA0Mi42NjY2NjctMTkuMiA0Mi42NjY2NjctNDIuNjY2NjY2cy0xOS4yLTQyLjY2NjY2Ny00Mi42NjY2NjctNDIuNjY2NjY3SDIxMy4zMzMzMzNjLTQ2LjkzMzMzMyAwLTg1LjMzMzMzMyAzOC40LTg1LjMzMzMzMyA4NS4zMzMzMzN2MTI4YzAgMjMuNDY2NjY3IDE5LjIgNDIuNjY2NjY3IDQyLjY2NjY2NyA0Mi42NjY2NjdzNDIuNjY2NjY3LTE5LjIgNDIuNjY2NjY2LTQyLjY2NjY2N1YyNTZ6IG01OTcuMzMzMzM0LTEyOGgtMTI4Yy0yMy40NjY2NjcgMC00Mi42NjY2NjcgMTkuMi00Mi42NjY2NjcgNDIuNjY2NjY3czE5LjIgNDIuNjY2NjY3IDQyLjY2NjY2NyA0Mi42NjY2NjZoODUuMzMzMzMzYzIzLjQ2NjY2NyAwIDQyLjY2NjY2NyAxOS4yIDQyLjY2NjY2NyA0Mi42NjY2Njd2ODUuMzMzMzMzYzAgMjMuNDY2NjY3IDE5LjIgNDIuNjY2NjY3IDQyLjY2NjY2NiA0Mi42NjY2NjdzNDIuNjY2NjY3LTE5LjIgNDIuNjY2NjY3LTQyLjY2NjY2N1YyMTMuMzMzMzMzYzAtNDYuOTMzMzMzLTM4LjQtODUuMzMzMzMzLTg1LjMzMzMzMy04NS4zMzMzMzN6IG0wIDY0MGMwIDIzLjQ2NjY2Ny0xOS4yIDQyLjY2NjY2Ny00Mi42NjY2NjcgNDIuNjY2NjY3aC04NS4zMzMzMzNjLTIzLjQ2NjY2NyAwLTQyLjY2NjY2NyAxOS4yLTQyLjY2NjY2NyA0Mi42NjY2NjZzMTkuMiA0Mi42NjY2NjcgNDIuNjY2NjY3IDQyLjY2NjY2N2gxMjhjNDYuOTMzMzMzIDAgODUuMzMzMzMzLTM4LjQgODUuMzMzMzMzLTg1LjMzMzMzM3YtMTI4YzAtMjMuNDY2NjY3LTE5LjItNDIuNjY2NjY3LTQyLjY2NjY2Ny00Mi42NjY2NjdzLTQyLjY2NjY2NyAxOS4yLTQyLjY2NjY2NiA0Mi42NjY2Njd2ODUuMzMzMzMzeiIgcC1pZD0iMzk5MTIiPjwvcGF0aD48L3N2Zz4=';
	d.CHAIN_CARBON = 'PHN2ZyBmaWxsLW9wYWNpdHk9IjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBjb2xvci1yZW5kZXJpbmc9ImF1dG8iIGNvbG9yLWludGVycG9sYXRpb249ImF1dG8iIHRleHQtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2U9ImJsYWNrIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiB3aWR0aD0iMjAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc2hhcGUtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2Utb3BhY2l0eT0iMSIgZmlsbD0iYmxhY2siIHN0cm9rZS1kYXNoYXJyYXk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHN0cm9rZS13aWR0aD0iMSIgdmlld0JveD0iMCAwIDIwLjAgMjAuMCIgaGVpZ2h0PSIyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmb250LWZhbWlseT0iJmFwb3M7RGlhbG9nJmFwb3M7IiBmb250LXN0eWxlPSJub3JtYWwiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIGZvbnQtc2l6ZT0iMTIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBpbWFnZS1yZW5kZXJpbmc9ImF1dG8iPjxkZWZzIGlkPSJnZW5lcmljRGVmcyIgIC8+PGcgID48ZGVmcyBpZD0iZGVmczEiICAgID48bGluZWFyR3JhZGllbnQgeDE9IjE1IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDI9IjIwIiB5MT0iMTUiIHkyPSIyMCIgaWQ9ImxpbmVhckdyYWRpZW50MSIgc3ByZWFkTWV0aG9kPSJwYWQiICAgICAgPjxzdG9wIHN0b3Atb3BhY2l0eT0iMSIgc3RvcC1jb2xvcj0iYmx1ZSIgb2Zmc2V0PSIwJSIgICAgICAgIC8+PHN0b3Agc3RvcC1vcGFjaXR5PSIxIiBzdG9wLWNvbG9yPSJibGFjayIgb2Zmc2V0PSIxMDAlIiAgICAgIC8+PC9saW5lYXJHcmFkaWVudCAgICA+PC9kZWZzICAgID48ZyB0ZXh0LXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiBjb2xvci1yZW5kZXJpbmc9Im9wdGltaXplUXVhbGl0eSIgY29sb3ItaW50ZXJwb2xhdGlvbj0ibGluZWFyUkdCIiBpbWFnZS1yZW5kZXJpbmc9Im9wdGltaXplU3BlZWQiICAgID48cGF0aCBmaWxsPSJub25lIiBkPSJNMCAxOSBMNSAxNiBMNSAxMSBMOSA4IEw5IDMgTDEzIDAiICAgIC8+PC9nICAgID48ZyBmb250LXNpemU9IjE1IiBmaWxsPSJ1cmwoI2xpbmVhckdyYWRpZW50MSkiIHRleHQtcmVuZGVyaW5nPSJnZW9tZXRyaWNQcmVjaXNpb24iIGltYWdlLXJlbmRlcmluZz0ib3B0aW1pemVTcGVlZCIgY29sb3ItcmVuZGVyaW5nPSJvcHRpbWl6ZVF1YWxpdHkiIGZvbnQtZmFtaWx5PSJzZXJpZiIgc3Ryb2tlPSJ1cmwoI2xpbmVhckdyYWRpZW50MSkiIGNvbG9yLWludGVycG9sYXRpb249ImxpbmVhclJHQiIgZm9udC13ZWlnaHQ9ImJvbGQiICAgID48cGF0aCBkPSJNMTIuMjQxNyAxNy42NDExIFExMi42NTE5IDE3LjU4OTggMTIuODQ1OSAxNy40MTc3IFExMy4wNCAxNy4yNDU2IDEzLjA0IDE2LjczMjkgTDEzLjA0IDEyLjMyMzcgUTEzLjA0IDExLjg2OTYgMTIuODgyNiAxMS42OTM4IFExMi43MjUxIDExLjUxODEgMTIuMjQxNyAxMS40NTk1IEwxMi4yNDE3IDExLjA5MzMgTDE1LjA4MzUgMTEuMDkzMyBMMTUuMDgzNSAxMi4xNjk5IFExNS40NDI0IDExLjYyNzkgMTUuOTk1NCAxMS4yNzI3IFExNi41NDgzIDEwLjkxNzUgMTcuMjIyMiAxMC45MTc1IFExOC4xODkgMTAuOTE3NSAxOC43MiAxMS40MTU1IFExOS4yNTEgMTEuOTEzNiAxOS4yNTEgMTMuMTY2IEwxOS4yNTEgMTYuNzkxNSBRMTkuMjUxIDE3LjI5NjkgMTkuNDIzMSAxNy40NDM0IFExOS41OTUyIDE3LjU4OTggMTkuOTk4IDE3LjY0MTEgTDE5Ljk5OCAxOCBMMTYuNDc1MSAxOCBMMTYuNDc1MSAxNy42NDExIFExNi44Nzc5IDE3LjU2MDUgMTcuMDI0NCAxNy40MjE0IFExNy4xNzA5IDE3LjI4MjIgMTcuMTcwOSAxNi43OTE1IEwxNy4xNzA5IDEzLjE1ODcgUTE3LjE3MDkgMTIuNjQ2IDE3LjA2ODQgMTIuMzg5NiBRMTYuODkyNiAxMS45MjgyIDE2LjM3MjYgMTEuOTI4MiBRMTUuOTg0NCAxMS45MjgyIDE1LjY1ODQgMTIuMjEwMiBRMTUuMzMyNSAxMi40OTIyIDE1LjE1NjcgMTIuNzc3OCBMMTUuMTU2NyAxNi43OTE1IFExNS4xNTY3IDE3LjI4MjIgMTUuMzAzMiAxNy40MjE0IFExNS40NDk3IDE3LjU2MDUgMTUuODUyNSAxNy42NDExIEwxNS44NTI1IDE4IEwxMi4yNDE3IDE4IFoiIHN0cm9rZT0ibm9uZSIgICAgLz48L2cgID48L2c+PC9zdmc+';
	d.CHLORINE = 'PHN2ZyBmaWxsLW9wYWNpdHk9IjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBjb2xvci1yZW5kZXJpbmc9ImF1dG8iIGNvbG9yLWludGVycG9sYXRpb249ImF1dG8iIHRleHQtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2U9ImJsYWNrIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiB3aWR0aD0iMjAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc2hhcGUtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2Utb3BhY2l0eT0iMSIgZmlsbD0iYmxhY2siIHN0cm9rZS1kYXNoYXJyYXk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHN0cm9rZS13aWR0aD0iMSIgdmlld0JveD0iMCAwIDIwLjAgMjAuMCIgaGVpZ2h0PSIyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmb250LWZhbWlseT0iJmFwb3M7RGlhbG9nJmFwb3M7IiBmb250LXN0eWxlPSJub3JtYWwiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIGZvbnQtc2l6ZT0iMTIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBpbWFnZS1yZW5kZXJpbmc9ImF1dG8iPjxkZWZzIGlkPSJnZW5lcmljRGVmcyIgIC8+PGcgID48ZyBmb250LXNpemU9IjE0IiBmaWxsPSJyZ2IoMzEsMjQwLDMxKSIgdGV4dC1yZW5kZXJpbmc9Imdlb21ldHJpY1ByZWNpc2lvbiIgaW1hZ2UtcmVuZGVyaW5nPSJvcHRpbWl6ZVNwZWVkIiBjb2xvci1yZW5kZXJpbmc9Im9wdGltaXplUXVhbGl0eSIgZm9udC1mYW1pbHk9IiZhcG9zO0x1Y2lkYSBHcmFuZGUmYXBvczsiIHN0cm9rZT0icmdiKDMxLDI0MCwzMSkiIGNvbG9yLWludGVycG9sYXRpb249ImxpbmVhclJHQiIgICAgPjxwYXRoIGQ9Ik04LjYzOTYgMTUuMjUyOSBRNi4yODEyIDE1LjI1MjkgNC45OTYxIDEzLjg2ODcgUTMuNzEwOSAxMi40ODQ0IDMuNzEwOSA5Ljk0ODIgUTMuNzEwOSA3LjQxODkgNS4wMiA2LjAyNDQgUTYuMzI5MSA0LjYyOTkgOC43MDggNC42Mjk5IFExMC4wNjg0IDQuNjI5OSAxMS44OTM2IDUuMDc0MiBMMTEuODkzNiA2LjQyMDkgUTkuODE1NCA1LjcwMzEgOC42ODc1IDUuNzAzMSBRNy4wNCA1LjcwMzEgNi4xMzc3IDYuODE3NCBRNS4yMzU0IDcuOTMxNiA1LjIzNTQgOS45NjE5IFE1LjIzNTQgMTEuODk2NSA2LjE5OTIgMTMuMDE0MiBRNy4xNjMxIDE0LjEzMTggOC44MzExIDE0LjEzMTggUTEwLjI2NjYgMTQuMTMxOCAxMS45MDcyIDEzLjI1IEwxMS45MDcyIDE0LjQ4MDUgUTEwLjQxMDIgMTUuMjUyOSA4LjYzOTYgMTUuMjUyOSBaTTE0LjM0NjcgMTUgTDE0LjM0NjcgNC4yMDYxIEwxNS42OTM0IDQuMjA2MSBMMTUuNjkzNCAxNSBaIiBzdHJva2U9Im5vbmUiICAgIC8+PC9nICA+PC9nPjwvc3ZnPg==';
	d.CLEAR = 'PHN2ZyB0PSIxNTg3NzEzMDY5Mzc4IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjY1MDgzIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiPjxwYXRoIGQ9Ik03MDQgMTI4Yy04LjM4NC00OS41MzYtNTAuNTYtNjQtOTIuOC02NEw0MDcuODcyIDY0QzM2NS42MzIgNjQgMzI4LjQ0OCA3OC40NjQgMzIwIDEyOGwwIDY0IDM4NCAwTDcwNCAxMjh6IiBwLWlkPSI2NTA4NCI+PC9wYXRoPjxwYXRoIGQ9Ik0yMDQuOCA0MTIuNDE2bDAgNDczLjIxNkMyMDQuOCA5MzQuMTQ0IDIyOC4yODggOTYwIDI4MS42IDk2MGw0NjAuOCAwYzUzLjM3NiAwIDc2LjgtMjUuODU2IDc2LjgtNzQuMzY4TDgxOS4yIDQxMi40MTZjNTMuOTUyIDAgNzYuOC0yOS43NiA3Ni44LTc4LjIwOEM4OTYgMjg1LjY5NiA4NzIuNTEyIDI1NiA4MTkuMiAyNTZMNTUwLjQgMjU2IDIwNC44IDI1NkMxNTEuNDg4IDI1NiAxMjggMjg1LjY5NiAxMjggMzM0LjIwOCAxMjggMzgyLjY1NiAxNTEuNDg4IDQxMi40MTYgMjA0LjggNDEyLjQxNnpNNTc2IDM4Ny45NjhDNTc2IDM4Ni40OTYgNTc2LjU3NiAzODUuNDA4IDU3Ni43MDQgMzg0bDYyLjY1NiAwQzYzOS40ODggMzg1LjQwOCA2NDAgMzg2LjQ5NiA2NDAgMzg3Ljk2OGwwIDQxNC40NjRjMCAzOS40MjQtNjQgMzkuNDI0LTY0IDBMNTc2IDM4Ny45Njh6TTM4NCAzODcuOTY4QzM4NCAzODYuNDk2IDM4NC40NDggMzg1LjQwOCAzODQuNjQgMzg0bDU5LjEzNiAwYzAuMTI4IDEuNDA4IDAuNzA0IDIuNDk2IDAuNzA0IDMuOTY4bDAgNDE0LjQ2NGMwIDM5LjQyNC02MC40OCAzOS40MjQtNjAuNDggMEwzODQgMzg3Ljk2OHoiIHAtaWQ9IjY1MDg1Ij48L3BhdGg+PC9zdmc+';
	d.COPY = 'PHN2ZyB0PSIxNTg3NzEyNDM4NDQ1IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjQzOTg1IiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiPjxwYXRoIGQ9Ik04NjYuNDYxNTM4IDM5LjM4NDYxNUgzNTQuNDYxNTM4Yy00My4zMjMwNzcgMC03OC43NjkyMzEgMzUuNDQ2MTU0LTc4Ljc2OTIzIDc4Ljc2OTIzMXYzOS4zODQ2MTZoNDcyLjYxNTM4NGM0My4zMjMwNzcgMCA3OC43NjkyMzEgMzUuNDQ2MTU0IDc4Ljc2OTIzMSA3OC43NjkyM3Y1NTEuMzg0NjE2aDM5LjM4NDYxNWM0My4zMjMwNzcgMCA3OC43NjkyMzEtMzUuNDQ2MTU0IDc4Ljc2OTIzMS03OC43NjkyMzFWMTE4LjE1Mzg0NmMwLTQzLjMyMzA3Ny0zNS40NDYxNTQtNzguNzY5MjMxLTc4Ljc2OTIzMS03OC43NjkyMzF6IG0tMTE4LjE1Mzg0NiAyNzUuNjkyMzA4YzAtNDMuMzIzMDc3LTM1LjQ0NjE1NC03OC43NjkyMzEtNzguNzY5MjMtNzguNzY5MjMxSDE1Ny41Mzg0NjJjLTQzLjMyMzA3NyAwLTc4Ljc2OTIzMSAzNS40NDYxNTQtNzguNzY5MjMxIDc4Ljc2OTIzMXY1OTAuNzY5MjMxYzAgNDMuMzIzMDc3IDM1LjQ0NjE1NCA3OC43NjkyMzEgNzguNzY5MjMxIDc4Ljc2OTIzMWg1MTJjNDMuMzIzMDc3IDAgNzguNzY5MjMxLTM1LjQ0NjE1NCA3OC43NjkyMy03OC43NjkyMzFWMzE1LjA3NjkyM3ogbS0zNTQuNDYxNTM4IDEzNy44NDYxNTRjMCAxMS44MTUzODUtNy44NzY5MjMgMTkuNjkyMzA4LTE5LjY5MjMwOCAxOS42OTIzMDhoLTE1Ny41Mzg0NjFjLTExLjgxNTM4NSAwLTE5LjY5MjMwOC03Ljg3NjkyMy0xOS42OTIzMDgtMTkuNjkyMzA4di0zOS4zODQ2MTVjMC0xMS44MTUzODUgNy44NzY5MjMtMTkuNjkyMzA4IDE5LjY5MjMwOC0xOS42OTIzMDhoMTU3LjUzODQ2MWMxMS44MTUzODUgMCAxOS42OTIzMDggNy44NzY5MjMgMTkuNjkyMzA4IDE5LjY5MjMwOHYzOS4zODQ2MTV6IG0xNTcuNTM4NDYxIDMxNS4wNzY5MjNjMCAxMS44MTUzODUtNy44NzY5MjMgMTkuNjkyMzA4LTE5LjY5MjMwNyAxOS42OTIzMDhIMjE2LjYxNTM4NWMtMTEuODE1Mzg1IDAtMTkuNjkyMzA4LTcuODc2OTIzLTE5LjY5MjMwOC0xOS42OTIzMDh2LTM5LjM4NDYxNWMwLTExLjgxNTM4NSA3Ljg3NjkyMy0xOS42OTIzMDggMTkuNjkyMzA4LTE5LjY5MjMwOGgzMTUuMDc2OTIzYzExLjgxNTM4NSAwIDE5LjY5MjMwOCA3Ljg3NjkyMyAxOS42OTIzMDcgMTkuNjkyMzA4djM5LjM4NDYxNXogbTc4Ljc2OTIzMS0xNTcuNTM4NDYyYzAgMTEuODE1Mzg1LTcuODc2OTIzIDE5LjY5MjMwOC0xOS42OTIzMDggMTkuNjkyMzA4SDIxNi42MTUzODVjLTExLjgxNTM4NSAwLTE5LjY5MjMwOC03Ljg3NjkyMy0xOS42OTIzMDgtMTkuNjkyMzA4di0zOS4zODQ2MTVjMC0xMS44MTUzODUgNy44NzY5MjMtMTkuNjkyMzA4IDE5LjY5MjMwOC0xOS42OTIzMDhoMzkzLjg0NjE1M2MxMS44MTUzODUgMCAxOS42OTIzMDggNy44NzY5MjMgMTkuNjkyMzA4IDE5LjY5MjMwOHYzOS4zODQ2MTV6IiBwLWlkPSI0Mzk4NiI+PC9wYXRoPjwvc3ZnPg==';
	d.CUT = 'PHN2ZyB0PSIxNTg3NzEyNTAxMDY4IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjQ0ODAzIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiPjxwYXRoIGQ9Ik01NDguNTcxNDI5IDUxMnExNC44NTcxNDMgMCAyNS43MTQyODUgMTAuODU3MTQzdDEwLjg1NzE0MyAyNS43MTQyODYtMTAuODU3MTQzIDI1LjcxNDI4NS0yNS43MTQyODUgMTAuODU3MTQzLTI1LjcxNDI4Ni0xMC44NTcxNDMtMTAuODU3MTQzLTI1LjcxNDI4NSAxMC44NTcxNDMtMjUuNzE0Mjg2IDI1LjcxNDI4Ni0xMC44NTcxNDN6IG0xNzEuNDI4NTcxIDM2LjU3MTQyOWwyODkuNzE0Mjg2IDIyNy40Mjg1NzFxMTYgMTEuNDI4NTcxIDE0LjI4NTcxNCAzMi0yLjg1NzE0MyAyMC0yMCAyOS4xNDI4NTdsLTczLjE0Mjg1NyAzNi41NzE0MjlxLTcuNDI4NTcxIDQtMTYuNTcxNDI5IDQtOS43MTQyODYgMC0xNy43MTQyODUtNC41NzE0MjlsLTM5NC4yODU3MTUtMjIxLjE0Mjg1Ny02Mi44NTcxNDMgMzcuNzE0Mjg2cS00LjU3MTQyOSAyLjI4NTcxNC02Ljg1NzE0MiAyLjg1NzE0MyA4IDI4IDUuNzE0Mjg1IDU1LjQyODU3MS00IDQ0LTMyIDg0LjI4NTcxNFQzMzAuODU3MTQzIDkwMi44NTcxNDNxLTc1LjQyODU3MSA0OC0xNTguMjg1NzE0IDQ4LTc3LjcxNDI4NiAwLTEyNi44NTcxNDMtNDQuNTcxNDI5LTUxLjQyODU3MS00OC00NS4xNDI4NTctMTE4LjI4NTcxNCA0LTQzLjQyODU3MSAzMi04NHQ3NC44NTcxNDItNzAuODU3MTQzcTc1LjQyODU3MS00OCAxNTguODU3MTQzLTQ4IDQ3LjQyODU3MSAwIDg2LjI4NTcxNSAxNy43MTQyODYgNS4xNDI4NTctNy40Mjg1NzEgMTIuNTcxNDI4LTEyLjU3MTQyOWw2OS43MTQyODYtNDEuNzE0Mjg1LTY5LjcxNDI4Ni00MS43MTQyODZxLTcuNDI4NTcxLTUuMTQyODU3LTEyLjU3MTQyOC0xMi41NzE0MjktMzguODU3MTQzIDE3LjcxNDI4Ni04Ni4yODU3MTUgMTcuNzE0Mjg2LTgzLjQyODU3MSAwLTE1OC44NTcxNDMtNDgtNDYuODU3MTQzLTMwLjI4NTcxNC03NC44NTcxNDItNzAuODU3MTQzVDAuNTcxNDI5IDMwOS4xNDI4NTdxLTIuODU3MTQzLTMzLjcxNDI4NiA4Ljg1NzE0Mi02NC41NzE0MjhUNDUuNzE0Mjg2IDE5MS40Mjg1NzFxNDguNTcxNDI5LTQ1LjE0Mjg1NyAxMjYuODU3MTQzLTQ1LjE0Mjg1NyA4Mi44NTcxNDMgMCAxNTguMjg1NzE0IDQ4IDQ3LjQyODU3MSAyOS43MTQyODYgNzUuNDI4NTcxIDcwLjI4NTcxNXQzMiA4NC41NzE0MjhxMi4yODU3MTQgMjcuNDI4NTcxLTUuNzE0Mjg1IDU1LjQyODU3MiAyLjI4NTcxNCAwLjU3MTQyOSA2Ljg1NzE0MiAyLjg1NzE0Mmw2Mi44NTcxNDMgMzcuNzE0Mjg2IDM5NC4yODU3MTUtMjIxLjE0Mjg1N3E4LTQuNTcxNDI5IDE3LjcxNDI4NS00LjU3MTQyOSA5LjE0Mjg1NyAwIDE2LjU3MTQyOSA0bDczLjE0Mjg1NyAzNi41NzE0MjlxMTcuMTQyODU3IDkuMTQyODU3IDIwIDI5LjE0Mjg1NyAxLjcxNDI4NiAyMC41NzE0MjktMTQuMjg1NzE0IDMyek0zMzAuODU3MTQzIDQwMHEyNi4yODU3MTQtMjQgMTItNjEuNzE0Mjg2VDI4Mi4yODU3MTQgMjcxLjQyODU3MXEtNTIuNTcxNDI5LTMzLjcxNDI4Ni0xMDkuNzE0Mjg1LTMzLjcxNDI4NS00Mi4yODU3MTQgMC02NC41NzE0MjkgMjAuNTcxNDI4LTI2LjI4NTcxNCAyNC0xMiA2MS43MTQyODZ0NjAuNTcxNDI5IDY2Ljg1NzE0M3E1Mi41NzE0MjkgMzMuNzE0Mjg2IDEwOS43MTQyODUgMzMuNzE0Mjg2IDQyLjI4NTcxNCAwIDY0LjU3MTQyOS0yMC41NzE0Mjl6IG0tNDguNTcxNDI5IDQyNS43MTQyODZxNDYuMjg1NzE0LTI5LjE0Mjg1NyA2MC41NzE0MjktNjYuODU3MTQzdC0xMi02MS43MTQyODZxLTIyLjI4NTcxNC0yMC41NzE0MjktNjQuNTcxNDI5LTIwLjU3MTQyOC01Ny4xNDI4NTcgMC0xMDkuNzE0Mjg1IDMzLjcxNDI4NS00Ni4yODU3MTQgMjkuMTQyODU3LTYwLjU3MTQyOSA2Ni44NTcxNDN0MTIgNjEuNzE0Mjg2cTIyLjI4NTcxNCAyMC41NzE0MjkgNjQuNTcxNDI5IDIwLjU3MTQyOCA1Ny4xNDI4NTcgMCAxMDkuNzE0Mjg1LTMzLjcxNDI4NXogbTEwMS43MTQyODYtMzUwLjI4NTcxNWw1NC44NTcxNDMgMzMuMTQyODU4di02LjI4NTcxNXEwLTIwLjU3MTQyOSAxOC44NTcxNDMtMzJsOC00LjU3MTQyOC00NS4xNDI4NTctMjYuODU3MTQzLTE0Ljg1NzE0MyAxNC44NTcxNDNxLTEuNzE0Mjg2IDEuNzE0Mjg2LTUuNzE0Mjg2IDYuMjg1NzE0dC02Ljg1NzE0MyA2Ljg1NzE0M3EtMS4xNDI4NTcgMS4xNDI4NTctMi4yODU3MTQgMnQtMS43MTQyODYgMS40Mjg1NzF6IG0xMjggMTI4bDU0Ljg1NzE0MyAxOC4yODU3MTUgNDIwLjU3MTQyOC0zMjkuMTQyODU3LTczLjE0Mjg1Ny0zNi41NzE0MjktNDM4Ljg1NzE0MyAyNDYuMjg1NzE0djY0LjU3MTQyOWwtOTEuNDI4NTcxIDU0Ljg1NzE0MyA1LjE0Mjg1NyA0LjU3MTQyOHExLjE0Mjg1NyAxLjE0Mjg1NyA0IDMuNDI4NTcyIDIuMjg1NzE0IDIuMjg1NzE0IDYuMjg1NzE0IDYuODU3MTQzdDYuMjg1NzE1IDYuODU3MTQybDE0Ljg1NzE0MyAxNC44NTcxNDN6IG00MDIuMjg1NzE0IDIzNy43MTQyODZsNzMuMTQyODU3LTM2LjU3MTQyOC0yOTcuMTQyODU3LTIzMy4xNDI4NTgtMTAxLjE0Mjg1NyA3OC44NTcxNDNxLTEuMTQyODU3IDEuNzE0Mjg2LTcuNDI4NTcxIDR6IiBwLWlkPSI0NDgwNCI+PC9wYXRoPjwvc3ZnPg==';
	d.CYCLOBUTANE = 'PHN2ZyBmaWxsLW9wYWNpdHk9IjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBjb2xvci1yZW5kZXJpbmc9ImF1dG8iIGNvbG9yLWludGVycG9sYXRpb249ImF1dG8iIHRleHQtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2U9ImJsYWNrIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiB3aWR0aD0iMjAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc2hhcGUtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2Utb3BhY2l0eT0iMSIgZmlsbD0iYmxhY2siIHN0cm9rZS1kYXNoYXJyYXk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHN0cm9rZS13aWR0aD0iMSIgdmlld0JveD0iMCAwIDIwLjAgMjAuMCIgaGVpZ2h0PSIyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmb250LWZhbWlseT0iJmFwb3M7RGlhbG9nJmFwb3M7IiBmb250LXN0eWxlPSJub3JtYWwiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIGZvbnQtc2l6ZT0iMTIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBpbWFnZS1yZW5kZXJpbmc9ImF1dG8iPjxkZWZzIGlkPSJnZW5lcmljRGVmcyIgIC8+PGcgID48ZyB0ZXh0LXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMCwxMCkiIGNvbG9yLXJlbmRlcmluZz0ib3B0aW1pemVRdWFsaXR5IiBjb2xvci1pbnRlcnBvbGF0aW9uPSJsaW5lYXJSR0IiIGltYWdlLXJlbmRlcmluZz0ib3B0aW1pemVTcGVlZCIgICAgPjxsaW5lIHkyPSI5IiBmaWxsPSJub25lIiB4MT0iLTkiIHgyPSItMCIgeTE9IjAiICAgICAgLz48bGluZSB5Mj0iMCIgZmlsbD0ibm9uZSIgeDE9Ii0wIiB4Mj0iOSIgeTE9IjkiICAgICAgLz48bGluZSB5Mj0iLTkiIGZpbGw9Im5vbmUiIHgxPSI5IiB4Mj0iMCIgeTE9IjAiICAgICAgLz48bGluZSB5Mj0iMCIgZmlsbD0ibm9uZSIgeDE9IjAiIHgyPSItOSIgeTE9Ii05IiAgICAvPjwvZyAgPjwvZz48L3N2Zz4=';
	d.CYCLOHEPTANE = 'PHN2ZyBmaWxsLW9wYWNpdHk9IjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBjb2xvci1yZW5kZXJpbmc9ImF1dG8iIGNvbG9yLWludGVycG9sYXRpb249ImF1dG8iIHRleHQtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2U9ImJsYWNrIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiB3aWR0aD0iMjAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc2hhcGUtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2Utb3BhY2l0eT0iMSIgZmlsbD0iYmxhY2siIHN0cm9rZS1kYXNoYXJyYXk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHN0cm9rZS13aWR0aD0iMSIgdmlld0JveD0iMCAwIDIwLjAgMjAuMCIgaGVpZ2h0PSIyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmb250LWZhbWlseT0iJmFwb3M7RGlhbG9nJmFwb3M7IiBmb250LXN0eWxlPSJub3JtYWwiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIGZvbnQtc2l6ZT0iMTIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBpbWFnZS1yZW5kZXJpbmc9ImF1dG8iPjxkZWZzIGlkPSJnZW5lcmljRGVmcyIgIC8+PGcgID48ZyB0ZXh0LXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMCwxMCkiIGNvbG9yLXJlbmRlcmluZz0ib3B0aW1pemVRdWFsaXR5IiBjb2xvci1pbnRlcnBvbGF0aW9uPSJsaW5lYXJSR0IiIGltYWdlLXJlbmRlcmluZz0ib3B0aW1pemVTcGVlZCIgICAgPjxsaW5lIHkyPSItNS42MTE0IiBmaWxsPSJub25lIiB4MT0iLTAiIHgyPSItNy4wMzY1IiB5MT0iLTkiICAgICAgLz48bGluZSB5Mj0iMi4wMDI3IiBmaWxsPSJub25lIiB4MT0iLTcuMDM2NSIgeDI9Ii04Ljc3NDQiIHkxPSItNS42MTE0IiAgICAgIC8+PGxpbmUgeTI9IjguMTA4NyIgZmlsbD0ibm9uZSIgeDE9Ii04Ljc3NDQiIHgyPSItMy45MDUiIHkxPSIyLjAwMjciICAgICAgLz48bGluZSB5Mj0iOC4xMDg3IiBmaWxsPSJub25lIiB4MT0iLTMuOTA1IiB4Mj0iMy45MDUiIHkxPSI4LjEwODciICAgICAgLz48bGluZSB5Mj0iMi4wMDI3IiBmaWxsPSJub25lIiB4MT0iMy45MDUiIHgyPSI4Ljc3NDQiIHkxPSI4LjEwODciICAgICAgLz48bGluZSB5Mj0iLTUuNjExNCIgZmlsbD0ibm9uZSIgeDE9IjguNzc0NCIgeDI9IjcuMDM2NSIgeTE9IjIuMDAyNyIgICAgICAvPjxsaW5lIHkyPSItOSIgZmlsbD0ibm9uZSIgeDE9IjcuMDM2NSIgeDI9Ii0wIiB5MT0iLTUuNjExNCIgICAgLz48L2cgID48L2c+PC9zdmc+';
	d.CYCLOHEXANE = 'PHN2ZyBmaWxsLW9wYWNpdHk9IjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBjb2xvci1yZW5kZXJpbmc9ImF1dG8iIGNvbG9yLWludGVycG9sYXRpb249ImF1dG8iIHRleHQtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2U9ImJsYWNrIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiB3aWR0aD0iMjAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc2hhcGUtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2Utb3BhY2l0eT0iMSIgZmlsbD0iYmxhY2siIHN0cm9rZS1kYXNoYXJyYXk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHN0cm9rZS13aWR0aD0iMSIgdmlld0JveD0iMCAwIDIwLjAgMjAuMCIgaGVpZ2h0PSIyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmb250LWZhbWlseT0iJmFwb3M7RGlhbG9nJmFwb3M7IiBmb250LXN0eWxlPSJub3JtYWwiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIGZvbnQtc2l6ZT0iMTIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBpbWFnZS1yZW5kZXJpbmc9ImF1dG8iPjxkZWZzIGlkPSJnZW5lcmljRGVmcyIgIC8+PGcgID48ZyB0ZXh0LXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMCwxMCkiIGNvbG9yLXJlbmRlcmluZz0ib3B0aW1pemVRdWFsaXR5IiBjb2xvci1pbnRlcnBvbGF0aW9uPSJsaW5lYXJSR0IiIGltYWdlLXJlbmRlcmluZz0ib3B0aW1pemVTcGVlZCIgICAgPjxsaW5lIHkyPSI4LjUiIGZpbGw9Im5vbmUiIHgxPSItNy4zNjEyIiB4Mj0iLTAiIHkxPSI0LjI1IiAgICAgIC8+PGxpbmUgeTI9IjQuMjUiIGZpbGw9Im5vbmUiIHgxPSItMCIgeDI9IjcuMzYxMiIgeTE9IjguNSIgICAgICAvPjxsaW5lIHkyPSItNC4yNSIgZmlsbD0ibm9uZSIgeDE9IjcuMzYxMiIgeDI9IjcuMzYxMiIgeTE9IjQuMjUiICAgICAgLz48bGluZSB5Mj0iLTguNSIgZmlsbD0ibm9uZSIgeDE9IjcuMzYxMiIgeDI9IjAiIHkxPSItNC4yNSIgICAgICAvPjxsaW5lIHkyPSItNC4yNSIgZmlsbD0ibm9uZSIgeDE9IjAiIHgyPSItNy4zNjEyIiB5MT0iLTguNSIgICAgICAvPjxsaW5lIHkyPSI0LjI1IiBmaWxsPSJub25lIiB4MT0iLTcuMzYxMiIgeDI9Ii03LjM2MTIiIHkxPSItNC4yNSIgICAgLz48L2cgID48L2c+PC9zdmc+';
	d.CYCLOOCTANE = 'PHN2ZyBmaWxsLW9wYWNpdHk9IjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBjb2xvci1yZW5kZXJpbmc9ImF1dG8iIGNvbG9yLWludGVycG9sYXRpb249ImF1dG8iIHRleHQtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2U9ImJsYWNrIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiB3aWR0aD0iMjAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc2hhcGUtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2Utb3BhY2l0eT0iMSIgZmlsbD0iYmxhY2siIHN0cm9rZS1kYXNoYXJyYXk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHN0cm9rZS13aWR0aD0iMSIgdmlld0JveD0iMCAwIDIwLjAgMjAuMCIgaGVpZ2h0PSIyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmb250LWZhbWlseT0iJmFwb3M7RGlhbG9nJmFwb3M7IiBmb250LXN0eWxlPSJub3JtYWwiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIGZvbnQtc2l6ZT0iMTIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBpbWFnZS1yZW5kZXJpbmc9ImF1dG8iPjxkZWZzIGlkPSJnZW5lcmljRGVmcyIgIC8+PGcgID48ZyB0ZXh0LXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMCwxMCkiIGNvbG9yLXJlbmRlcmluZz0ib3B0aW1pemVRdWFsaXR5IiBjb2xvci1pbnRlcnBvbGF0aW9uPSJsaW5lYXJSR0IiIGltYWdlLXJlbmRlcmluZz0ib3B0aW1pemVTcGVlZCIgICAgPjxsaW5lIHkyPSI2LjM2NCIgZmlsbD0ibm9uZSIgeDE9Ii05IiB4Mj0iLTYuMzY0IiB5MT0iMCIgICAgICAvPjxsaW5lIHkyPSI5IiBmaWxsPSJub25lIiB4MT0iLTYuMzY0IiB4Mj0iLTAiIHkxPSI2LjM2NCIgICAgICAvPjxsaW5lIHkyPSI2LjM2NCIgZmlsbD0ibm9uZSIgeDE9Ii0wIiB4Mj0iNi4zNjQiIHkxPSI5IiAgICAgIC8+PGxpbmUgeTI9IjAiIGZpbGw9Im5vbmUiIHgxPSI2LjM2NCIgeDI9IjkiIHkxPSI2LjM2NCIgICAgICAvPjxsaW5lIHkyPSItNi4zNjQiIGZpbGw9Im5vbmUiIHgxPSI5IiB4Mj0iNi4zNjQiIHkxPSIwIiAgICAgIC8+PGxpbmUgeTI9Ii05IiBmaWxsPSJub25lIiB4MT0iNi4zNjQiIHgyPSIwIiB5MT0iLTYuMzY0IiAgICAgIC8+PGxpbmUgeTI9Ii02LjM2NCIgZmlsbD0ibm9uZSIgeDE9IjAiIHgyPSItNi4zNjQiIHkxPSItOSIgICAgICAvPjxsaW5lIHkyPSIwIiBmaWxsPSJub25lIiB4MT0iLTYuMzY0IiB4Mj0iLTkiIHkxPSItNi4zNjQiICAgIC8+PC9nICA+PC9nPjwvc3ZnPg==';
	d.CYCLOPENTANE = 'PHN2ZyBmaWxsLW9wYWNpdHk9IjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBjb2xvci1yZW5kZXJpbmc9ImF1dG8iIGNvbG9yLWludGVycG9sYXRpb249ImF1dG8iIHRleHQtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2U9ImJsYWNrIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiB3aWR0aD0iMjAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc2hhcGUtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2Utb3BhY2l0eT0iMSIgZmlsbD0iYmxhY2siIHN0cm9rZS1kYXNoYXJyYXk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHN0cm9rZS13aWR0aD0iMSIgdmlld0JveD0iMCAwIDIwLjAgMjAuMCIgaGVpZ2h0PSIyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmb250LWZhbWlseT0iJmFwb3M7RGlhbG9nJmFwb3M7IiBmb250LXN0eWxlPSJub3JtYWwiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIGZvbnQtc2l6ZT0iMTIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBpbWFnZS1yZW5kZXJpbmc9ImF1dG8iPjxkZWZzIGlkPSJnZW5lcmljRGVmcyIgIC8+PGcgID48ZyB0ZXh0LXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMCwxMCkiIGNvbG9yLXJlbmRlcmluZz0ib3B0aW1pemVRdWFsaXR5IiBjb2xvci1pbnRlcnBvbGF0aW9uPSJsaW5lYXJSR0IiIGltYWdlLXJlbmRlcmluZz0ib3B0aW1pemVTcGVlZCIgICAgPjxsaW5lIHkyPSItMi43ODEyIiBmaWxsPSJub25lIiB4MT0iLTAiIHgyPSItOC41NTk1IiB5MT0iLTkiICAgICAgLz48bGluZSB5Mj0iNy4yODEyIiBmaWxsPSJub25lIiB4MT0iLTguNTU5NSIgeDI9Ii01LjI5MDEiIHkxPSItMi43ODEyIiAgICAgIC8+PGxpbmUgeTI9IjcuMjgxMiIgZmlsbD0ibm9uZSIgeDE9Ii01LjI5MDEiIHgyPSI1LjI5MDEiIHkxPSI3LjI4MTIiICAgICAgLz48bGluZSB5Mj0iLTIuNzgxMiIgZmlsbD0ibm9uZSIgeDE9IjUuMjkwMSIgeDI9IjguNTU5NSIgeTE9IjcuMjgxMiIgICAgICAvPjxsaW5lIHkyPSItOSIgZmlsbD0ibm9uZSIgeDE9IjguNTU5NSIgeDI9Ii0wIiB5MT0iLTIuNzgxMiIgICAgLz48L2cgID48L2c+PC9zdmc+';
	d.CYCLOPROPANE = 'PHN2ZyBmaWxsLW9wYWNpdHk9IjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBjb2xvci1yZW5kZXJpbmc9ImF1dG8iIGNvbG9yLWludGVycG9sYXRpb249ImF1dG8iIHRleHQtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2U9ImJsYWNrIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiB3aWR0aD0iMjAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc2hhcGUtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2Utb3BhY2l0eT0iMSIgZmlsbD0iYmxhY2siIHN0cm9rZS1kYXNoYXJyYXk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHN0cm9rZS13aWR0aD0iMSIgdmlld0JveD0iMCAwIDIwLjAgMjAuMCIgaGVpZ2h0PSIyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmb250LWZhbWlseT0iJmFwb3M7RGlhbG9nJmFwb3M7IiBmb250LXN0eWxlPSJub3JtYWwiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIGZvbnQtc2l6ZT0iMTIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBpbWFnZS1yZW5kZXJpbmc9ImF1dG8iPjxkZWZzIGlkPSJnZW5lcmljRGVmcyIgIC8+PGcgID48ZyB0ZXh0LXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMCwxMCkgcm90YXRlKDkwKSB0cmFuc2xhdGUoMiwwKSIgY29sb3ItcmVuZGVyaW5nPSJvcHRpbWl6ZVF1YWxpdHkiIGNvbG9yLWludGVycG9sYXRpb249ImxpbmVhclJHQiIgaW1hZ2UtcmVuZGVyaW5nPSJvcHRpbWl6ZVNwZWVkIiAgICA+PGxpbmUgeTI9IjcuNzk0MiIgZmlsbD0ibm9uZSIgeDE9Ii05IiB4Mj0iNC41IiB5MT0iMCIgICAgICAvPjxsaW5lIHkyPSItNy43OTQyIiBmaWxsPSJub25lIiB4MT0iNC41IiB4Mj0iNC41IiB5MT0iNy43OTQyIiAgICAgIC8+PGxpbmUgeTI9IjAiIGZpbGw9Im5vbmUiIHgxPSI0LjUiIHgyPSItOSIgeTE9Ii03Ljc5NDIiICAgIC8+PC9nICA+PC9nPjwvc3ZnPg==';
	d.DECREASE_CHARGE = 'PHN2ZyBmaWxsLW9wYWNpdHk9IjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBjb2xvci1yZW5kZXJpbmc9ImF1dG8iIGNvbG9yLWludGVycG9sYXRpb249ImF1dG8iIHRleHQtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2U9ImJsYWNrIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiB3aWR0aD0iMjAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc2hhcGUtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2Utb3BhY2l0eT0iMSIgZmlsbD0iYmxhY2siIHN0cm9rZS1kYXNoYXJyYXk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHN0cm9rZS13aWR0aD0iMSIgdmlld0JveD0iMCAwIDIwLjAgMjAuMCIgaGVpZ2h0PSIyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmb250LWZhbWlseT0iJmFwb3M7RGlhbG9nJmFwb3M7IiBmb250LXN0eWxlPSJub3JtYWwiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIGZvbnQtc2l6ZT0iMTIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBpbWFnZS1yZW5kZXJpbmc9ImF1dG8iPjxkZWZzIGlkPSJnZW5lcmljRGVmcyIgIC8+PGcgID48ZyBzdHJva2UtbGluZWNhcD0iYnV0dCIgdGV4dC1yZW5kZXJpbmc9Imdlb21ldHJpY1ByZWNpc2lvbiIgY29sb3ItcmVuZGVyaW5nPSJvcHRpbWl6ZVF1YWxpdHkiIGltYWdlLXJlbmRlcmluZz0ib3B0aW1pemVTcGVlZCIgc3Ryb2tlLWxpbmVqb2luPSJiZXZlbCIgY29sb3ItaW50ZXJwb2xhdGlvbj0ibGluZWFyUkdCIiBzdHJva2Utd2lkdGg9IjEuMiIgICAgPjxsaW5lIHkyPSIxMCIgZmlsbD0ibm9uZSIgeDE9IjYiIHgyPSIxNCIgeTE9IjEwIiAgICAgIC8+PGNpcmNsZSBmaWxsPSJub25lIiByPSI2IiBjeD0iMTAiIGN5PSIxMCIgICAgLz48L2cgID48L2c+PC9zdmc+';
	d.DISTANCE = 'PHN2ZyB0PSIxNTg3NzE5MTk1OTAwIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjEwNjUiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cGF0aCBkPSJNNDE3LjA4MzczMyA2NTcuMzIyNjY3bDIzOC4yMjUwNjctMjM4LjIyNTA2N2MwLjY2OTg2Ny0wLjY2OTg2NyAxLjMwNTYtMS4zNjUzMzMgMS45MTE0NjctMi4wNzM2QTEzNS45MDE4NjcgMTM1LjkwMTg2NyAwIDAgMCA3MjUuMzMzMzMzIDQzNS4yYzc1LjQwNDggMCAxMzYuNTMzMzMzLTYxLjEyODUzMyAxMzYuNTMzMzM0LTEzNi41MzMzMzMgMC03NS40MDQ4LTYxLjEyODUzMy0xMzYuNTMzMzMzLTEzNi41MzMzMzQtMTM2LjUzMzMzNC03NS40MDQ4IDAtMTM2LjUzMzMzMyA2MS4xMjg1MzMtMTM2LjUzMzMzMyAxMzYuNTMzMzM0YTEzNS44OTMzMzMgMTM1Ljg5MzMzMyAwIDAgMCAxOS43Mzc2IDcwLjc0NTZjLTAuNTEyIDAuNDUyMjY3LTEuMDExMiAwLjkyNTg2Ny0xLjUwMTg2NyAxLjQxMjI2NmwtMjM3LjY3ODkzMyAyMzcuNjc4OTM0QTEzNS44OTMzMzMgMTM1Ljg5MzMzMyAwIDAgMCAyOTguNjY2NjY3IDU4OC44Yy03NS40MDQ4IDAtMTM2LjUzMzMzMyA2MS4xMjg1MzMtMTM2LjUzMzMzNCAxMzYuNTMzMzMzIDAgNzUuNDA0OCA2MS4xMjg1MzMgMTM2LjUzMzMzMyAxMzYuNTMzMzM0IDEzNi41MzMzMzQgNzUuNDA0OCAwIDEzNi41MzMzMzMtNjEuMTI4NTMzIDEzNi41MzMzMzMtMTM2LjUzMzMzNGExMzUuOTA2MTMzIDEzNS45MDYxMzMgMCAwIDAtMTguMTE2MjY3LTY4LjAxMDY2NnpNNzkwLjc1ODQgOTMuODY2NjY3Qzg2Ny43MjQ4IDkzLjg2NjY2NyA5MzAuMTMzMzMzIDE1Ni4yNjY2NjciIHAtaWQ9IjEwNjYiPjwvcGF0aD48L3N2Zz4=';
	d.ERASE = 'PHN2ZyB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIj48cGF0aCBkPSJNOTk1Ljg4MzUgNTQ3Ljg4MmMzNy40OS0zNy40OSAzNy40OS05OC4yNzQgMC0xMzUuNzY0bC0zMjAtMzIwYy0zNy40OS0zNy40OS05OC4yNzItMzcuNDkyLTEzNS43NjYgMGwtNTEyIDUxMmMtMzcuNDkgMzcuNDktMzcuNDkgOTguMjc0IDAgMTM1Ljc2NGwxOTIgMTkyQTk2LjAwOCA5Ni4wMDggMCAwIDAgMjg4LjAwMTUgOTYwaDcxMmMxMy4yNTQgMCAyNC0xMC43NDYgMjQtMjR2LTgwYzAtMTMuMjU0LTEwLjc0Ni0yNC0yNC0yNEg3MTEuNzY3NWwyODQuMTE2LTI4NC4xMTh6IG0tNjA1LjI1NC0xMjUuMjU0bDI3NC43NDYgMjc0Ljc0Nkw1MzAuNzQ3NSA4MzJIMzAxLjI1NzVsLTE2MC0xNjAgMjQ5LjM3Mi0yNDkuMzcyeiI+PC9wYXRoPjwvc3ZnPg==';
	d.FLIP_HOR = 'PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIJIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxMDAgMTAwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PGc+CTxnPgkJPHBhdGggZD0iTTgyLjgyOCw2Mi42NDhMNTUuNDMsNTMuMDdWMjIuNjQzbDI3LjM5OC05LjU3OGwxNi43NCwyNC43OTJMODIuODI4LDYyLjY0OEw4Mi44MjgsNjIuNjQ4egkJCSBNNjIuNDk4LDQ4LjA1M2wxNy41MjEsNi4xMjVsMTEuMDIxLTE2LjMyMUw4MC4wMTksMjEuNTM1TDYyLjQ5OCwyNy42NlY0OC4wNTNMNjIuNDk4LDQ4LjA1M3oiLz4JPC9nPgk8Zz4JCTxwYXRoICBkPSJNMTguMDM5LDYyLjY0OEwxLjI5NywzNy44NTZsMTYuNzQyLTI0Ljc5MmwyNy4zOTksOS41NzhWNTMuMDdMMTguMDM5LDYyLjY0OEwxOC4wMzksNjIuNjQ4egkJCSBNOS44MjcsMzcuODU2bDExLjAyMiwxNi4zMjFsMTcuNTIxLTYuMTI1VjI3LjY2bC0xNy41MjEtNi4xMjVMOS44MjcsMzcuODU2TDkuODI3LDM3Ljg1NnoiLz4JPC9nPgk8Zz4JCTxwYXRoIGQ9Ik01Mi44NjgsNjguNDI5aC01LjE4N1Y1NC45NDRoNS4xODdWNjguNDI5TDUyLjg2OCw2OC40Mjl6IE01Mi44NjgsNDEuNDZoLTUuMTg3VjI3Ljk3NWg1LjE4N1Y0MS40Nkw1Mi44NjgsNDEuNDZ6CQkJIE01Mi44NjgsMTQuNDloLTUuMTg3VjEuMDA2aDUuMTg3VjE0LjQ5TDUyLjg2OCwxNC40OXoiLz4JPC9nPgk8Zz4JCTxwb2x5Z29uIHBvaW50cz0iNTkuNTI3LDc3LjUwNyA5MS42ODIsNjYuMjY2IDgzLjQxNCw5OC4zODEgCQkiLz4JPC9nPgk8Zz4JCTxwYXRoIGQ9Ik00Ni44MTIsOTkuNjM0Yy0yLjA4NiwwLTQuMjg3LTAuMTAxLTYuNjEyLTAuMzE4QzIwLjQxNyw5Ny40Niw3Ljc4LDgyLjE5MSw3LjI1MSw4MS41NDNsNi45OTQtNS42OTMJCQljMC4xLDAuMTIxLDEwLjg1NSwxMi45OTIsMjYuNzk3LDE0LjQ4N2MyMS43NTYsMi4wNDEsMzAuMDA1LTcuODkyLDMwLjA4My03Ljk5Mmw3LjE2NSw1LjQ3NwkJCUM3Ny44ODksODguMzQ2LDY4Ljk4MSw5OS42MzQsNDYuODEyLDk5LjYzNEw0Ni44MTIsOTkuNjM0eiIvPgk8L2c+PC9nPjwvc3ZnPg==';
	d.FLIP_VER = 'PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIJIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxMDAgMTAwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PGc+CTxnPgkJPHBhdGggZD0iTTUzLjIyMSw0NC44N0gyMi43OTNsLTkuNTc4LTI3LjM5OGwyNC43OTItMTYuNzRsMjQuNzkyLDE2Ljc0TDUzLjIyMSw0NC44N0w1My4yMjEsNDQuODd6CQkJIE0yNy44MSwzNy44MDJoMjAuMzkzbDYuMTI0LTE3LjUyTDM4LjAwNyw5LjI2MUwyMS42ODYsMjAuMjgyTDI3LjgxLDM3LjgwMkwyNy44MSwzNy44MDJ6Ii8+CTwvZz4JPGc+CQk8cGF0aCBkPSJNMzguMDA3LDk5LjAwM0wxMy4yMTUsODIuMjYxbDkuNTc4LTI3LjM5OGgzMC40MjhsOS41NzgsMjcuMzk4TDM4LjAwNyw5OS4wMDNMMzguMDA3LDk5LjAwM3oJCQkgTTIxLjY4Niw3OS40NTFsMTYuMzIxLDExLjAyMmwxNi4zMjEtMTEuMDIybC02LjEyNS0xNy41MjFIMjcuODFMMjEuNjg2LDc5LjQ1MUwyMS42ODYsNzkuNDUxeiIvPgk8L2c+CTxnPgkJPHBhdGggZD0iTTY4LjU4LDUyLjYxOEg1NS4wOTZ2LTUuMTg2SDY4LjU4VjUyLjYxOEw2OC41OCw1Mi42MTh6IE00MS42MSw1Mi42MThIMjguMTI1di01LjE4Nkg0MS42MVY1Mi42MThMNDEuNjEsNTIuNjE4egkJCSBNMTQuNjQxLDUyLjYxOEgxLjE1NnYtNS4xODZoMTMuNDg0VjUyLjYxOEwxNC42NDEsNTIuNjE4eiIvPgk8L2c+CTxnPgkJPHBvbHlnb24gcG9pbnRzPSI3Ny42NTYsNDAuNzczIDY2LjQxNiw4LjYxOCA5OC41MzEsMTYuODg2IAkJIi8+CTwvZz4JPGc+CQk8cGF0aCBkPSJNODEuNjkzLDkzLjA0OUw3Niw4Ni4wNTVjMC4xMjEtMC4xLDEyLjk5Mi0xMC44NTUsMTQuNDg4LTI2Ljc5N2MyLjA0MS0yMS43NjItNy44OTMtMzAuMDA2LTcuOTk0LTMwLjA4M2w1LjQ3Ny03LjE2NAkJCWMwLjU3NCwwLjQzOCwxNC4wMzEsMTEuMDU3LDExLjQ5NiwzOC4wODlDOTcuNjA5LDc5Ljg4NCw4Mi4zNDIsOTIuNTIxLDgxLjY5Myw5My4wNDlMODEuNjkzLDkzLjA0OXoiLz4JPC9nPjwvZz48L3N2Zz4=';
	d.FLUORINE = 'PHN2ZyBmaWxsLW9wYWNpdHk9IjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBjb2xvci1yZW5kZXJpbmc9ImF1dG8iIGNvbG9yLWludGVycG9sYXRpb249ImF1dG8iIHRleHQtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2U9ImJsYWNrIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiB3aWR0aD0iMjAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc2hhcGUtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2Utb3BhY2l0eT0iMSIgZmlsbD0iYmxhY2siIHN0cm9rZS1kYXNoYXJyYXk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHN0cm9rZS13aWR0aD0iMSIgdmlld0JveD0iMCAwIDIwLjAgMjAuMCIgaGVpZ2h0PSIyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmb250LWZhbWlseT0iJmFwb3M7RGlhbG9nJmFwb3M7IiBmb250LXN0eWxlPSJub3JtYWwiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIGZvbnQtc2l6ZT0iMTIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBpbWFnZS1yZW5kZXJpbmc9ImF1dG8iPjxkZWZzIGlkPSJnZW5lcmljRGVmcyIgIC8+PGcgID48ZyBmb250LXNpemU9IjE0IiBmaWxsPSJyZ2IoMTQ0LDIyNCw4MCkiIHRleHQtcmVuZGVyaW5nPSJnZW9tZXRyaWNQcmVjaXNpb24iIGltYWdlLXJlbmRlcmluZz0ib3B0aW1pemVTcGVlZCIgY29sb3ItcmVuZGVyaW5nPSJvcHRpbWl6ZVF1YWxpdHkiIGZvbnQtZmFtaWx5PSImYXBvcztMdWNpZGEgR3JhbmRlJmFwb3M7IiBzdHJva2U9InJnYigxNDQsMjI0LDgwKSIgY29sb3ItaW50ZXJwb2xhdGlvbj0ibGluZWFyUkdCIiAgICA+PHBhdGggZD0iTTcuMzA1NyAxNSBMNy4zMDU3IDQuODgyOCBMMTIuOTU5IDQuODgyOCBMMTIuOTU5IDUuOTU2MSBMOC43NDEyIDUuOTU2MSBMOC43NDEyIDkuMzQ2NyBMMTIuMjgyMiA5LjM0NjcgTDEyLjI4MjIgMTAuNDA2MiBMOC43NDEyIDEwLjQwNjIgTDguNzQxMiAxNSBaIiBzdHJva2U9Im5vbmUiICAgIC8+PC9nICA+PC9nPjwvc3ZnPg==';
	d.HYDROGEN = 'PHN2ZyBmaWxsLW9wYWNpdHk9IjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBjb2xvci1yZW5kZXJpbmc9ImF1dG8iIGNvbG9yLWludGVycG9sYXRpb249ImF1dG8iIHRleHQtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2U9ImJsYWNrIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiB3aWR0aD0iMjAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc2hhcGUtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2Utb3BhY2l0eT0iMSIgZmlsbD0iYmxhY2siIHN0cm9rZS1kYXNoYXJyYXk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHN0cm9rZS13aWR0aD0iMSIgdmlld0JveD0iMCAwIDIwLjAgMjAuMCIgaGVpZ2h0PSIyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmb250LWZhbWlseT0iJmFwb3M7RGlhbG9nJmFwb3M7IiBmb250LXN0eWxlPSJub3JtYWwiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIGZvbnQtc2l6ZT0iMTIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBpbWFnZS1yZW5kZXJpbmc9ImF1dG8iPjxkZWZzIGlkPSJnZW5lcmljRGVmcyIgIC8+PGcgID48ZyB0ZXh0LXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiBmb250LXNpemU9IjE0IiBmb250LWZhbWlseT0iJmFwb3M7THVjaWRhIEdyYW5kZSZhcG9zOyIgY29sb3ItaW50ZXJwb2xhdGlvbj0ibGluZWFyUkdCIiBjb2xvci1yZW5kZXJpbmc9Im9wdGltaXplUXVhbGl0eSIgaW1hZ2UtcmVuZGVyaW5nPSJvcHRpbWl6ZVNwZWVkIiAgICA+PHBhdGggZD0iTTYuMzA1NyAxNSBMNi4zMDU3IDQuODgyOCBMNy43NDEyIDQuODgyOCBMNy43NDEyIDkuMTQ4NCBMMTIuNTUzNyA5LjE0ODQgTDEyLjU1MzcgNC44ODI4IEwxMy45ODkzIDQuODgyOCBMMTMuOTg5MyAxNSBMMTIuNTUzNyAxNSBMMTIuNTUzNyAxMC4yMjE3IEw3Ljc0MTIgMTAuMjIxNyBMNy43NDEyIDE1IFoiIHN0cm9rZT0ibm9uZSIgICAgLz48L2cgID48L2c+PC9zdmc+';
	d.INCREASE_CHARGE = 'PHN2ZyBmaWxsLW9wYWNpdHk9IjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBjb2xvci1yZW5kZXJpbmc9ImF1dG8iIGNvbG9yLWludGVycG9sYXRpb249ImF1dG8iIHRleHQtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2U9ImJsYWNrIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiB3aWR0aD0iMjAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc2hhcGUtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2Utb3BhY2l0eT0iMSIgZmlsbD0iYmxhY2siIHN0cm9rZS1kYXNoYXJyYXk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHN0cm9rZS13aWR0aD0iMSIgdmlld0JveD0iMCAwIDIwLjAgMjAuMCIgaGVpZ2h0PSIyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmb250LWZhbWlseT0iJmFwb3M7RGlhbG9nJmFwb3M7IiBmb250LXN0eWxlPSJub3JtYWwiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIGZvbnQtc2l6ZT0iMTIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBpbWFnZS1yZW5kZXJpbmc9ImF1dG8iPjxkZWZzIGlkPSJnZW5lcmljRGVmcyIgIC8+PGcgID48ZyBzdHJva2UtbGluZWNhcD0iYnV0dCIgdGV4dC1yZW5kZXJpbmc9Imdlb21ldHJpY1ByZWNpc2lvbiIgY29sb3ItcmVuZGVyaW5nPSJvcHRpbWl6ZVF1YWxpdHkiIGltYWdlLXJlbmRlcmluZz0ib3B0aW1pemVTcGVlZCIgc3Ryb2tlLWxpbmVqb2luPSJiZXZlbCIgY29sb3ItaW50ZXJwb2xhdGlvbj0ibGluZWFyUkdCIiBzdHJva2Utd2lkdGg9IjEuMiIgICAgPjxsaW5lIHkyPSIxMCIgZmlsbD0ibm9uZSIgeDE9IjYiIHgyPSIxNCIgeTE9IjEwIiAgICAgIC8+PGxpbmUgeTI9IjE0IiBmaWxsPSJub25lIiB4MT0iMTAiIHgyPSIxMCIgeTE9IjYiICAgICAgLz48Y2lyY2xlIGZpbGw9Im5vbmUiIHI9IjYiIGN4PSIxMCIgY3k9IjEwIiAgICAvPjwvZyAgPjwvZz48L3N2Zz4=';
	d.IODINE = 'PHN2ZyBmaWxsLW9wYWNpdHk9IjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBjb2xvci1yZW5kZXJpbmc9ImF1dG8iIGNvbG9yLWludGVycG9sYXRpb249ImF1dG8iIHRleHQtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2U9ImJsYWNrIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiB3aWR0aD0iMjAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc2hhcGUtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2Utb3BhY2l0eT0iMSIgZmlsbD0iYmxhY2siIHN0cm9rZS1kYXNoYXJyYXk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHN0cm9rZS13aWR0aD0iMSIgdmlld0JveD0iMCAwIDIwLjAgMjAuMCIgaGVpZ2h0PSIyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmb250LWZhbWlseT0iJmFwb3M7RGlhbG9nJmFwb3M7IiBmb250LXN0eWxlPSJub3JtYWwiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIGZvbnQtc2l6ZT0iMTIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBpbWFnZS1yZW5kZXJpbmc9ImF1dG8iPjxkZWZzIGlkPSJnZW5lcmljRGVmcyIgIC8+PGcgID48ZyBmb250LXNpemU9IjE0IiBmaWxsPSJyZ2IoMTQ4LDAsMTQ4KSIgdGV4dC1yZW5kZXJpbmc9Imdlb21ldHJpY1ByZWNpc2lvbiIgaW1hZ2UtcmVuZGVyaW5nPSJvcHRpbWl6ZVNwZWVkIiBjb2xvci1yZW5kZXJpbmc9Im9wdGltaXplUXVhbGl0eSIgZm9udC1mYW1pbHk9IiZhcG9zO0x1Y2lkYSBHcmFuZGUmYXBvczsiIHN0cm9rZT0icmdiKDE0OCwwLDE0OCkiIGNvbG9yLWludGVycG9sYXRpb249ImxpbmVhclJHQiIgICAgPjxwYXRoIGQ9Ik05LjI5ODggMTUgTDkuMjk4OCA0Ljg4MjggTDEwLjczNDQgNC44ODI4IEwxMC43MzQ0IDE1IFoiIHN0cm9rZT0ibm9uZSIgICAgLz48L2cgID48L2c+PC9zdmc+';
	d.LASSO = 'PHN2ZyB0PSIxNTg3NzEzNzM3MzU4IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjcyMDMyIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiPjxwYXRoIGQ9Ik0xODcuNzMzMzMzIDEwMjRjLTMuNDEzMzMzIDAtNi44MjY2NjcgMC0xMC4yNC0zLjQxMzMzMy02LjgyNjY2Ny02LjgyNjY2Ny02LjgyNjY2Ny0xNy4wNjY2NjcgMC0yMy44OTMzMzQgMTA1LjgxMzMzMy0xMjYuMjkzMzMzIDU4LjAyNjY2Ny0yMjUuMjggMC0yODMuMzA2NjY2LTYuODI2NjY3LTYuODI2NjY3LTYuODI2NjY3LTE3LjA2NjY2NyAwLTIzLjg5MzMzNHMxNy4wNjY2NjctNi44MjY2NjcgMjMuODkzMzM0IDBjOTUuNTczMzMzIDk1LjU3MzMzMyA5OC45ODY2NjcgMjE4LjQ1MzMzMyAzLjQxMzMzMyAzMzEuMDkzMzM0LTYuODI2NjY3IDAtMTAuMjQgMy40MTMzMzMtMTcuMDY2NjY3IDMuNDEzMzMzek04MDIuMTMzMzMzIDg4Ny40NjY2NjdjLTYuODI2NjY3IDAtMTMuNjUzMzMzLTMuNDEzMzMzLTE3LjA2NjY2Ni0xMC4yNGwtMTcwLjY2NjY2Ny00MDkuNmMtMy40MTMzMzMtNi44MjY2NjcgMC0xMy42NTMzMzMgMy40MTMzMzMtMjAuNDggNi44MjY2NjctMy40MTMzMzMgMTMuNjUzMzMzLTYuODI2NjY3IDIwLjQ4LTMuNDEzMzM0bDM3NS40NjY2NjcgMjA0LjhjNi44MjY2NjcgMy40MTMzMzMgMTAuMjQgMTAuMjQgMTAuMjQgMTMuNjUzMzM0IDAgNi44MjY2NjctMy40MTMzMzMgMTMuNjUzMzMzLTEwLjI0IDEzLjY1MzMzM2wtMTMzLjEyIDY0Ljg1MzMzMy02NC44NTMzMzMgMTMzLjEyYzAgMTAuMjQtNi44MjY2NjcgMTMuNjUzMzMzLTEzLjY1MzMzNCAxMy42NTMzMzR6IG0tMTM2LjUzMzMzMy0zODkuMTJsMTM2LjUzMzMzMyAzMzEuMDkzMzMzIDUxLjItMTAyLjRjMC0zLjQxMzMzMyAzLjQxMzMzMy02LjgyNjY2NyA2LjgyNjY2Ny02LjgyNjY2N2wxMDUuODEzMzMzLTU0LjYxMzMzMy0zMDAuMzczMzMzLTE2Ny4yNTMzMzN6IiBmaWxsPSIiIHAtaWQ9IjcyMDMzIj48L3BhdGg+PHBhdGggZD0iTTUxMiA2ODIuNjY2NjY3Yy04OC43NDY2NjcgMC0xODAuOTA2NjY3LTE3LjA2NjY2Ny0yNjYuMjQtNTEuMi0zLjQxMzMzMy0zLjQxMzMzMy0xMC4yNC02LjgyNjY2Ny0xMC4yNC0xMC4yNC02LjgyNjY2Ny0yNy4zMDY2NjctMzcuNTQ2NjY3LTQ3Ljc4NjY2Ny02OC4yNjY2NjctMzQuMTMzMzM0LTMuNDEzMzMzIDMuNDEzMzMzLTEwLjI0IDAtMTcuMDY2NjY2IDBDNTQuNjEzMzMzIDUxOC44MjY2NjcgMCA0MzMuNDkzMzMzIDAgMzQxLjMzMzMzMyAwIDE1My42IDIyOC42OTMzMzMgMCA1MTIgMHM1MTIgMTUzLjYgNTEyIDM0MS4zMzMzMzNjMCA5OC45ODY2NjctNTguMDI2NjY3IDE5MS4xNDY2NjctMTYwLjQyNjY2NyAyNTIuNTg2NjY3LTYuODI2NjY3IDMuNDEzMzMzLTEwLjI0IDMuNDEzMzMzLTE3LjA2NjY2NiAwbC0xODAuOTA2NjY3LTk1LjU3MzMzMyA1MS4yIDEyNi4yOTMzMzNjMy40MTMzMzMgMy40MTMzMzMgMCAxMC4yNCAwIDEzLjY1MzMzM2wtMTAuMjQgMTAuMjQtMTcuMDY2NjY3IDMuNDEzMzM0Yy01NC42MTMzMzMgMTMuNjUzMzMzLTExNi4wNTMzMzMgMzAuNzItMTc3LjQ5MzMzMyAzMC43MnogbS0yNDUuNzYtODEuOTJjNzguNTA2NjY3IDMwLjcyIDE2My44NCA0Ny43ODY2NjcgMjQ1Ljc2IDQ3Ljc4NjY2NiA1NC42MTMzMzMgMCAxMTIuNjQtMTMuNjUzMzMzIDE2My44NC0yNy4zMDY2NjZMNjE0LjQgNDY3LjYyNjY2N2MtMy40MTMzMzMtNi44MjY2NjcgMC0xMy42NTMzMzMgMy40MTMzMzMtMjAuNDggNi44MjY2NjctMy40MTMzMzMgMTMuNjUzMzMzLTYuODI2NjY3IDIwLjQ4LTMuNDEzMzM0bDIxMS42MjY2NjcgMTE2LjA1MzMzNGM4OC43NDY2NjctNTQuNjEzMzMzIDEzNi41MzMzMzMtMTM2LjUzMzMzMyAxMzYuNTMzMzMzLTIxOC40NTMzMzQgMC0xNzAuNjY2NjY3LTIxNS4wNC0zMDcuMi00NzcuODY2NjY2LTMwNy4yUzM0LjEzMzMzMyAxNzAuNjY2NjY3IDM0LjEzMzMzMyAzNDEuMzMzMzMzYzAgNzguNTA2NjY3IDQ3Ljc4NjY2NyAxNTAuMTg2NjY3IDEzMy4xMiAyMDguMjEzMzM0IDQwLjk2LTEzLjY1MzMzMyA4NS4zMzMzMzMgMTMuNjUzMzMzIDk4Ljk4NjY2NyA1MS4yeiIgZmlsbD0iIiBwLWlkPSI3MjAzNCI+PC9wYXRoPjxwYXRoIGQ9Ik0xODcuNzMzMzMzIDcxNi44QzEzOS45NDY2NjcgNzE2LjggMTAyLjQgNjc5LjI1MzMzMyAxMDIuNCA2MzEuNDY2NjY3UzEzOS45NDY2NjcgNTQ2LjEzMzMzMyAxODcuNzMzMzMzIDU0Ni4xMzMzMzMgMjczLjA2NjY2NyA1ODMuNjggMjczLjA2NjY2NyA2MzEuNDY2NjY3IDIzNS41MiA3MTYuOCAxODcuNzMzMzMzIDcxNi44eiBtMC0xMzYuNTMzMzMzYy0yNy4zMDY2NjcgMC01MS4yIDIzLjg5MzMzMy01MS4yIDUxLjJTMTYwLjQyNjY2NyA2ODIuNjY2NjY3IDE4Ny43MzMzMzMgNjgyLjY2NjY2NyAyMzguOTMzMzMzIDY1OC43NzMzMzMgMjM4LjkzMzMzMyA2MzEuNDY2NjY3IDIxNS4wNCA1ODAuMjY2NjY3IDE4Ny43MzMzMzMgNTgwLjI2NjY2N3oiIGZpbGw9IiIgcC1pZD0iNzIwMzUiPjwvcGF0aD48L3N2Zz4=';
	d.LASSO_SHAPES = 'PHN2ZyB0PSIxNTg3NzEzNjU0MjQyIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjcxODQ0IiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiPjxwYXRoIGQ9Ik0xODcuNzMzMzMzIDEwMjRjLTMuNDEzMzMzIDAtNi44MjY2NjcgMC0xMC4yNC0zLjQxMzMzMy02LjgyNjY2Ny02LjgyNjY2Ny02LjgyNjY2Ny0xNy4wNjY2NjcgMC0yMy44OTMzMzQgMTA1LjgxMzMzMy0xMjYuMjkzMzMzIDU4LjAyNjY2Ny0yMjUuMjggMC0yODMuMzA2NjY2LTYuODI2NjY3LTYuODI2NjY3LTYuODI2NjY3LTE3LjA2NjY2NyAwLTIzLjg5MzMzNHMxNy4wNjY2NjctNi44MjY2NjcgMjMuODkzMzM0IDBjOTUuNTczMzMzIDk1LjU3MzMzMyA5OC45ODY2NjcgMjE4LjQ1MzMzMyAzLjQxMzMzMyAzMzEuMDkzMzM0LTYuODI2NjY3IDAtMTAuMjQgMy40MTMzMzMtMTcuMDY2NjY3IDMuNDEzMzMzek0xMDEzLjc2IDY1MS45NDY2NjdsLTM3NS40NjY2NjctMjA0LjhjLTYuODI2NjY3LTMuNDEzMzMzLTEzLjY1MzMzMy0zLjQxMzMzMy0yMC40OCAzLjQxMzMzMy0zLjQxMzMzMyAzLjQxMzMzMy0zLjQxMzMzMyAxMC4yNC0zLjQxMzMzMyAxNy4wNjY2NjdsMTcwLjY2NjY2NyA0MDkuNmMzLjQxMzMzMyA2LjgyNjY2NyA2LjgyNjY2NyAxMC4yNCAxMy42NTMzMzMgMTAuMjRzMTMuNjUzMzMzLTMuNDEzMzMzIDEzLjY1MzMzMy0xMC4yNGw2NC44NTMzMzQtMTMzLjEyIDEzMy4xMi02NC44NTMzMzRjNi44MjY2NjctMy40MTMzMzMgMTAuMjQtMTAuMjQgMTAuMjQtMTMuNjUzMzMzIDMuNDEzMzMzLTYuODI2NjY3IDAtMTAuMjQtNi44MjY2NjctMTMuNjUzMzMzeiIgZmlsbD0iIiBwLWlkPSI3MTg0NSI+PC9wYXRoPjxwYXRoIGQ9Ik0xODcuNzMzMzMzIDcxNi44QzEzOS45NDY2NjcgNzE2LjggMTAyLjQgNjc5LjI1MzMzMyAxMDIuNCA2MzEuNDY2NjY3UzEzOS45NDY2NjcgNTQ2LjEzMzMzMyAxODcuNzMzMzMzIDU0Ni4xMzMzMzMgMjczLjA2NjY2NyA1ODMuNjggMjczLjA2NjY2NyA2MzEuNDY2NjY3IDIzNS41MiA3MTYuOCAxODcuNzMzMzMzIDcxNi44eiBtMC0xMzYuNTMzMzMzYy0yNy4zMDY2NjcgMC01MS4yIDIzLjg5MzMzMy01MS4yIDUxLjJTMTYwLjQyNjY2NyA2ODIuNjY2NjY3IDE4Ny43MzMzMzMgNjgyLjY2NjY2NyAyMzguOTMzMzMzIDY1OC43NzMzMzMgMjM4LjkzMzMzMyA2MzEuNDY2NjY3IDIxNS4wNCA1ODAuMjY2NjY3IDE4Ny43MzMzMzMgNTgwLjI2NjY2N3oiIGZpbGw9IiIgcC1pZD0iNzE4NDYiPjwvcGF0aD48cGF0aCBkPSJNNTEyIDY4Mi42NjY2NjdjLTg4Ljc0NjY2NyAwLTE4MC45MDY2NjctMTcuMDY2NjY3LTI2Ni4yNC01MS4yLTMuNDEzMzMzLTMuNDEzMzMzLTEwLjI0LTYuODI2NjY3LTEwLjI0LTEwLjI0LTYuODI2NjY3LTI3LjMwNjY2Ny0zNy41NDY2NjctNDcuNzg2NjY3LTY4LjI2NjY2Ny0zNC4xMzMzMzQtMy40MTMzMzMgMy40MTMzMzMtMTAuMjQgMC0xNy4wNjY2NjYgMEM1NC42MTMzMzMgNTE4LjgyNjY2NyAwIDQzMy40OTMzMzMgMCAzNDEuMzMzMzMzIDAgMTUzLjYgMjI4LjY5MzMzMyAwIDUxMiAwczUxMiAxNTMuNiA1MTIgMzQxLjMzMzMzM2MwIDc1LjA5MzMzMy0zNC4xMzMzMzMgMTUwLjE4NjY2Ny05OC45ODY2NjcgMjA4LjIxMzMzNC02LjgyNjY2NyA2LjgyNjY2Ny0xNy4wNjY2NjcgNi44MjY2NjctMjMuODkzMzMzIDAtNi44MjY2NjctNi44MjY2NjctNi44MjY2NjctMTcuMDY2NjY3IDAtMjMuODkzMzM0IDU4LjAyNjY2Ny01MS4yIDg4Ljc0NjY2Ny0xMTYuMDUzMzMzIDg4Ljc0NjY2Ny0xODAuOTA2NjY2IDAtMTcwLjY2NjY2Ny0yMTUuMDQtMzA3LjItNDc3Ljg2NjY2Ny0zMDcuMlMzNC4xMzMzMzMgMTcwLjY2NjY2NyAzNC4xMzMzMzMgMzQxLjMzMzMzM2MwIDc4LjUwNjY2NyA0Ny43ODY2NjcgMTUwLjE4NjY2NyAxMzMuMTIgMjA4LjIxMzMzNCA0NC4zNzMzMzMtMTAuMjQgODUuMzMzMzMzIDEzLjY1MzMzMyAxMDIuNCA1MS4yIDc4LjUwNjY2NyAzMC43MiAxNjMuODQgNDcuNzg2NjY3IDI0NS43NiA0Ny43ODY2NjYgNDAuOTYgMCA4NS4zMzMzMzMtMTAuMjQgMTE5LjQ2NjY2Ny0xNy4wNjY2NjYgMTAuMjQtMy40MTMzMzMgMTcuMDY2NjY3IDMuNDEzMzMzIDIwLjQ4IDEzLjY1MzMzMyAzLjQxMzMzMyAxMC4yNC0zLjQxMzMzMyAxNy4wNjY2NjctMTMuNjUzMzMzIDIwLjQ4LTQwLjk2IDYuODI2NjY3LTg1LjMzMzMzMyAxNy4wNjY2NjctMTI5LjcwNjY2NyAxNy4wNjY2Njd6IiBmaWxsPSIiIHAtaWQ9IjcxODQ3Ij48L3BhdGg+PC9zdmc+';
	d.MARQUEE = 'PHN2ZyB0PSIxNTg3NzEzNzgxMTcwIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjcyNzIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiPjxwYXRoIGQ9Ik0zMTAuMjA1OTUyIDUzLjY1NzZ2MjIzLjI5MTM5Mkg0MTUuMjg4MzJWNTMuNjU4MTEySDMxMC4yMDU5NTJ6TTU1Ljc3MTEzNiAzMDUuMzU2OFY0MTAuNDM5NjhIMjc5LjA2MDQ4VjMwNS4zNTY4SDU1Ljc3MTEzNnogbTM4OS4wODI2MjQgMFY0MTAuNDM5NjhoMjIzLjI5MTM5MlYzMDUuMzU2OEg0NDQuODUzNzZ6IG0zNTcuMzEzMDI0IDMwLjcwNDY0djQwLjk2aDEyNS41NDM0MjR2MTE5LjQyMTQ0aDQwLjk2VjMzNi4wNjE0NGgtMTY2LjUwMzQyNHogbS00OTEuOTYwMzIgMTA2LjY4MDMydjIyMy4yOTAzNjhoMTA1LjA4MTM0NFY0NDIuNzQxNzZIMzEwLjIwNTk1MnogbTYxNy4xNTQ1NiAxNjIuNjgyMzY4djc4LjQ2Mjk3Nmg0MC45NnYtNzguNDYyOTc2aC00MC45NnogbTAuMzQ5MTg0IDE5NC4xNDAxNnYxMTkuNDIyOTc2aC0xMjEuODQ4MzJ2NDAuOTZoMTYyLjgwODMydi0xNjAuMzgzNDg4aC00MC45NnogbS01ODQuMDkyMTYgMS4xNjU4MjR2MTYwLjM4MTk1MmgxNjIuODA3ODA4di00MC45NkgzODQuNTc4NTZ2LTExOS40MjE5NTJoLTQwLjk2eiBtMjcwLjIzMzYgMTE5LjQyMTk1MnY0MC45Nmg4NC41ODM0MjR2LTQwLjk2SDYxMy44NTIxNnoiIHAtaWQ9IjcyNzIxIj48L3BhdGg+PC9zdmc+';
	d.MOVE = 'PHN2ZyB0PSIxNTg3NzEwMjg2MTc1IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjIzNjUiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTk1MC43NDEgNTM0LjUxM2wtMTI4LjA3IDEyOC4wN2MtNi4wMDQgNi4wMDMtMTQuMDA4IDkuNTA1LTIyLjUxMyA5LjUwNS0xNy41MSAwLTMyLjAxOC0xNC41MDgtMzIuMDE4LTMyLjAxOGwwLTY0LjAzNUw1NzYuMDM1IDU3Ni4wMzVsMCAxOTIuMTA1IDY0LjAzNSAwYzE3LjUxIDAgMzIuMDE4IDE0LjUwOCAzMi4wMTggMzIuMDE4IDAgOC41MDUtMy41MDIgMTYuNTA5LTkuNTA1IDIyLjUxM2wtMTI4LjA3IDEyOC4wN2MtNi4wMDQgNi4wMDMtMTQuMDA4IDkuNTA1LTIyLjUxMyA5LjUwNXMtMTYuNTA5LTMuNTAyLTIyLjUxMi05LjUwNWwtMTI4LjA3LTEyOC4wN2MtNi4wMDMtNi4wMDQtOS41MDUtMTQuMDA4LTkuNTA1LTIyLjUxMyAwLTE3LjUxIDE0LjUwOC0zMi4wMTggMzIuMDE4LTMyLjAxOGw2NC4wMzUgMEw0NDcuOTY2IDU3Ni4wMzUgMjU1Ljg1OSA1NzYuMDM1bDAgNjQuMDM1YzAgMTcuNTEtMTQuNTA4IDMyLjAxOC0zMi4wMTggMzIuMDE4LTguNTA1IDAtMTYuNTA5LTMuNTAyLTIyLjUxMi05LjUwNWwtMTI4LjA3LTEyOC4wN2MtNi4wMDMtNi4wMDQtOS41MDUtMTQuMDA4LTkuNTA1LTIyLjUxM3MzLjUwMi0xNi41MDkgOS41MDUtMjIuNTEybDEyOC4wNy0xMjguMDdjNi4wMDMtNi4wMDMgMTQuMDA3LTkuNTA1IDIyLjUxMi05LjUwNSAxNy41MSAwIDMyLjAxOCAxNC41MDggMzIuMDE4IDMyLjAxOGwwIDY0LjAzNSAxOTIuMTA1IDBMNDQ3Ljk2NCAyNTUuODU5IDM4My45MyAyNTUuODU5Yy0xNy41MSAwLTMyLjAxOC0xNC41MDgtMzIuMDE4LTMyLjAxOCAwLTguNTA1IDMuNTAyLTE2LjUwOSA5LjUwNS0yMi41MTJsMTI4LjA3LTEyOC4wN2M2LjAwMy02LjAwMyAxNC4wMDctOS41MDUgMjIuNTEyLTkuNTA1czE2LjUwOSAzLjUwMiAyMi41MTMgOS41MDVsMTI4LjA3IDEyOC4wN2M2LjAwMyA2LjAwMyA5LjUwNSAxNC4wMDcgOS41MDUgMjIuNTEyIDAgMTcuNTEtMTQuNTA4IDMyLjAxOC0zMi4wMTggMzIuMDE4bC02NC4wMzUgMCAwIDE5Mi4xMDUgMTkyLjEwNSAwTDc2OC4xMzkgMzgzLjkzYzAtMTcuNTEgMTQuNTA4LTMyLjAxOCAzMi4wMTgtMzIuMDE4IDguNTA1IDAgMTYuNTA5IDMuNTAyIDIyLjUxMyA5LjUwNWwxMjguMDcgMTI4LjA3YzYuMDAzIDYuMDAzIDkuNTA1IDE0LjAwNyA5LjUwNSAyMi41MTJTOTU2Ljc0NCA1MjguNTA5IDk1MC43NDEgNTM0LjUxM3oiIHAtaWQ9IjIzNjYiPjwvcGF0aD48L3N2Zz4=';
	d.NITROGEN = 'PHN2ZyBmaWxsLW9wYWNpdHk9IjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBjb2xvci1yZW5kZXJpbmc9ImF1dG8iIGNvbG9yLWludGVycG9sYXRpb249ImF1dG8iIHRleHQtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2U9ImJsYWNrIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiB3aWR0aD0iMjAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc2hhcGUtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2Utb3BhY2l0eT0iMSIgZmlsbD0iYmxhY2siIHN0cm9rZS1kYXNoYXJyYXk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHN0cm9rZS13aWR0aD0iMSIgdmlld0JveD0iMCAwIDIwLjAgMjAuMCIgaGVpZ2h0PSIyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmb250LWZhbWlseT0iJmFwb3M7RGlhbG9nJmFwb3M7IiBmb250LXN0eWxlPSJub3JtYWwiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIGZvbnQtc2l6ZT0iMTIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBpbWFnZS1yZW5kZXJpbmc9ImF1dG8iPjxkZWZzIGlkPSJnZW5lcmljRGVmcyIgIC8+PGcgID48ZyBmb250LXNpemU9IjE0IiBmaWxsPSJyZ2IoNDgsODAsMjQ4KSIgdGV4dC1yZW5kZXJpbmc9Imdlb21ldHJpY1ByZWNpc2lvbiIgaW1hZ2UtcmVuZGVyaW5nPSJvcHRpbWl6ZVNwZWVkIiBjb2xvci1yZW5kZXJpbmc9Im9wdGltaXplUXVhbGl0eSIgZm9udC1mYW1pbHk9IiZhcG9zO0x1Y2lkYSBHcmFuZGUmYXBvczsiIHN0cm9rZT0icmdiKDQ4LDgwLDI0OCkiIGNvbG9yLWludGVycG9sYXRpb249ImxpbmVhclJHQiIgICAgPjxwYXRoIGQ9Ik02LjMwNTcgMTUgTDYuMzA1NyA0Ljg4MjggTDcuNzEzOSA0Ljg4MjggTDEyLjgwNjYgMTIuNjk2MyBMMTIuODA2NiA0Ljg4MjggTDE0LjAzNzEgNC44ODI4IEwxNC4wMzcxIDE1IEwxMi42MzU3IDE1IEw3LjUzNjEgNy4xODY1IEw3LjUzNjEgMTUgWiIgc3Ryb2tlPSJub25lIiAgICAvPjwvZyAgPjwvZz48L3N2Zz4=';
	d.OPEN = 'PHN2ZyB0PSIxNTg3NzEzODgwMDU2IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9Ijc2MzI3IiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiPjxwYXRoIGQ9Ik0xODAuNTQ0IDE5Ni45OTJsMzg5LjQ0IDBjMCAwIDYzLjQ4OCAxLjk4NCA2NC42NCA1Ny43MjggMS4xNTIgNTYuMzg0LTY0LjY0IDU2LjUxMi02NC42NCA1Ni41MTJMMzYwLjU3NiAzMTEuMjMyYzAgMC00OS42LTcuNTUyLTY5LjQ0IDQ0LjQ4QzI4My40NTYgMzc1Ljg3MiAyMTcuNjY0IDU1OS40ODggMTkyLjA2NCA2NDBjLTcuMjMyIDIyLjcyIDEwLjA0OCAyOC44NjQgMjQuMTI4IDI5LjI0OCAxNC43MiAwLjUxMiAyNy45NjggMC4yNTYgNDAuMTkyIDAgMTYuMzg0LTAuMTI4IDMwLjI3Mi02LjQgMzcuODg4LTI5LjI0OCAxNi4zODQtNDkuNzI4IDY5LjY5Ni0xODIuNCA3Ni42MDgtMTk5Ljg3MkMzODguNzM2IDM5NS4wMDggNDEyLjE2IDM5OS42MTYgNDM4LjAxNiAzOTkuNjE2YzQ3LjE2OCAwIDQ5MS43MTIgMCA0OTEuNzEyIDAgNjEuMTIgMCA4NC4wMzIgMzMuMDI0IDY2LjMwNCA4My45NjhMOTIxLjYgODQ5LjM0NEM5MDIuNTkyIDkwOC4wMzIgODQ1LjQ0IDk2MCA3ODQuMzIgOTYwTDE4Mi42NTYgOTYwQzExOC45MTIgOTYwIDY0IDkwNS42IDY0IDg0NC40OGwwLTUzNC40QzY0IDI0OS4wMjQgMTE5LjQ4OCAxOTYuOTkyIDE4MC41NDQgMTk2Ljk5MnpNNzYzLjY0OCAyNjcuNjQ4Yy0yOS4xODQtMi4zMDQtMzQuNzUyLTMuOTA0LTguNjQtMjkuOTUyIDE4LjI0LTE5Ljk2OCA0MS41MzYtMzguNTkyIDQxLjUzNi0zOC41OTIgMC43MDQtMS43OTItMTguMTc2LTQ3Ljg3Mi05NS4xNjgtODEuNDcyUzUxMi41MTIgMTE2LjkyOCA0ODIuMzY4IDEzMi40OGMtMTQuMjcyIDEyLjIyNC01Ny42IDE5LjEzNi0xOC4yNC0yMC44IDY2LjYyNC02Mi41MjggMTYxLjAyNC0xMDEuNjk2IDI2My4yMzItNzIuNTc2IDk1LjEwNCAyNy4zMjggMTM5LjM5MiA4Mi4zNjggMTQyLjcyIDg5LjkyLTAuNDQ4IDAuNTc2LTAuNTc2IDAuOTYgMC4wNjQgMC45NiAwIDAgMC4xOTItMC4zODQtMC4wNjQtMC45NiAyLjA0OC0yLjgxNiAxNi4yNTYtMTMuMjQ4IDQwLjY0LTM1LjcxMiAyMC44NjQtMjEuMjQ4IDI2Ljk0NC0xNiAyOS4zNzYgOS44NTYgMy4wMDggNDguNjQgMS4zNDQgMTg3LjQ1NiAxLjM0NCAxODcuNDU2UzgxMS4zOTIgMjc0LjQ5NiA3NjMuNjQ4IDI2Ny42NDh6IiBwLWlkPSI3NjMyOCI+PC9wYXRoPjwvc3ZnPg==';
	d.OPTIMIZE = 'PHN2ZyB0PSIxNTg3NzE0MTcwNjQzIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjgzODU1IiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiPjxwYXRoIGQ9Ik04OTUuMzkyMjUzIDBIMTI3LjkxMzE3OWExMjcuOTEzMTc5IDEyNy45MTMxNzkgMCAwIDAtMTI3LjkxMzE3OSAxMjcuOTEzMTc5djYzOS41NjU4OTVhMTI3LjkxMzE3OSAxMjcuOTEzMTc5IDAgMCAwIDEyNy45MTMxNzkgMTI3LjkxMzE3OSA0Mi42Mzc3MjYgNDIuNjM3NzI2IDAgMCAwIDAtODUuMjc1NDUzIDQyLjYzNzcyNiA0Mi42Mzc3MjYgMCAwIDEtNDIuNjM3NzI2LTQyLjYzNzcyNlYzMTkuNzgyOTQ3YTIxLjMxODg2MyAyMS4zMTg4NjMgMCAwIDEgMjEuMzE4ODYzLTIxLjMxODg2M2g4MTAuMTE2OGEyMS4zMTg4NjMgMjEuMzE4ODYzIDAgMCAxIDIxLjMxODg2MyAyMS4zMTg4NjNWNzY3LjQ3OTA3NGE0Mi42Mzc3MjYgNDIuNjM3NzI2IDAgMCAxLTQyLjYzNzcyNiA0Mi42Mzc3MjYgNDIuNjM3NzI2IDQyLjYzNzcyNiAwIDAgMCAwIDg1LjI3NTQ1MyAxMjcuOTEzMTc5IDEyNy45MTMxNzkgMCAwIDAgMTI3LjkxMzE3OC0xMjcuOTEzMTc5VjEyNy45MTMxNzlhMTI3LjkxMzE3OSAxMjcuOTEzMTc5IDAgMCAwLTEyNy45MTMxNzgtMTI3LjkxMzE3OXpNMTI3LjkxMzE3OSAxNDkuMjMyMDQyYTQyLjYzNzcyNiA0Mi42Mzc3MjYgMCAxIDEgNDIuNjM3NzI2IDQyLjYzNzcyNiA0Mi42Mzc3MjYgNDIuNjM3NzI2IDAgMCAxLTQyLjYzNzcyNi00Mi42Mzc3MjZ6IG0xMjcuOTEzMTc5IDBhNDIuNjM3NzI2IDQyLjYzNzcyNiAwIDEgMSA0Mi42Mzc3MjYgNDIuNjM3NzI2IDQyLjYzNzcyNiA0Mi42Mzc3MjYgMCAwIDEtNDIuNjM3NzI2LTQyLjYzNzcyNnogbTEyNy45MTMxNzkgMGE0Mi42Mzc3MjYgNDIuNjM3NzI2IDAgMSAxIDQyLjYzNzcyNiA0Mi42Mzc3MjYgNDIuNjM3NzI2IDQyLjYzNzcyNiAwIDAgMS00Mi42Mzc3MjYtNDIuNjM3NzI2eiIgcC1pZD0iODM4NTYiPjwvcGF0aD48cGF0aCBkPSJNNzQ3LjQzOTM0MiA1MzQuMjkzMzQ4YTMxLjk3ODI5NSAzMS45NzgyOTUgMCAwIDAtNDUuMTk1OTktNDUuMjM4NjI3bC0zMC45NTQ5ODkgMzAuOTU0OTg5YTI3NS4yNjkxNjEgMjc1LjI2OTE2MSAwIDAgMC0xMjcuNjU3MzUzLTQ4Ljk5MDc0N3YtMzQuMTEwMTgyaDMxLjk3ODI5NWEzMS45NzgyOTUgMzEuOTc4Mjk1IDAgMCAwIDAtNjMuOTU2NTg5aC0xMjcuOTEzMTc5YTMxLjk3ODI5NSAzMS45NzgyOTUgMCAwIDAgMCA2My45NTY1ODloMzEuOTc4Mjk1djM0LjExMDE4MkEyNzUuMDk4NjEgMjc1LjA5ODYxIDAgMCAwIDM1Mi4wMTcwNjggNTIwLjE4MDI2MWwtMzAuOTU0OTg5LTMxLjEyNTU0YTMxLjk3ODI5NSAzMS45NzgyOTUgMCAxIDAtNDUuMTk1OTkgNDUuMjM4NjI3bDI4LjUyNDYzOSAyOC41MjQ2MzlhMjc3LjE0NTIyMSAyNzcuMTQ1MjIxIDAgMSAwIDQxNC41MjM5NzUgMHpNNTExLjY1MjcxNiA5MzguMDI5OTc5YTE5MS44Njk3NjggMTkxLjg2OTc2OCAwIDEgMSAxOTEuODY5NzY4LTE5MS44Njk3NjlBMTkxLjg2OTc2OCAxOTEuODY5NzY4IDAgMCAxIDUxMS42NTI3MTYgOTM4LjAyOTk3OXoiIHAtaWQ9IjgzODU3Ij48L3BhdGg+PHBhdGggZD0iTTU1My4wMTEzMSA2NTkuNjA1NjI2bC02My45NTY1ODkgNjMuOTU2NTg5YTMxLjk3ODI5NSAzMS45NzgyOTUgMCAwIDAgNDUuMTk1OTkgNDUuMjM4NjI4bDYzLjk1NjU4OS02My45NTY1ODlhMzEuOTc4Mjk1IDMxLjk3ODI5NSAwIDEgMC00NS4xOTU5OS00NS4yMzg2Mjh6IiBwLWlkPSI4Mzg1OCI+PC9wYXRoPjwvc3ZnPg==';
	d.OXYGEN = 'PHN2ZyBmaWxsLW9wYWNpdHk9IjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBjb2xvci1yZW5kZXJpbmc9ImF1dG8iIGNvbG9yLWludGVycG9sYXRpb249ImF1dG8iIHRleHQtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2U9ImJsYWNrIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiB3aWR0aD0iMjAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc2hhcGUtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2Utb3BhY2l0eT0iMSIgZmlsbD0iYmxhY2siIHN0cm9rZS1kYXNoYXJyYXk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHN0cm9rZS13aWR0aD0iMSIgdmlld0JveD0iMCAwIDIwLjAgMjAuMCIgaGVpZ2h0PSIyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmb250LWZhbWlseT0iJmFwb3M7RGlhbG9nJmFwb3M7IiBmb250LXN0eWxlPSJub3JtYWwiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIGZvbnQtc2l6ZT0iMTIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBpbWFnZS1yZW5kZXJpbmc9ImF1dG8iPjxkZWZzIGlkPSJnZW5lcmljRGVmcyIgIC8+PGcgID48ZyBmb250LXNpemU9IjE0IiBmaWxsPSJyZ2IoMjU1LDEzLDEzKSIgdGV4dC1yZW5kZXJpbmc9Imdlb21ldHJpY1ByZWNpc2lvbiIgaW1hZ2UtcmVuZGVyaW5nPSJvcHRpbWl6ZVNwZWVkIiBjb2xvci1yZW5kZXJpbmc9Im9wdGltaXplUXVhbGl0eSIgZm9udC1mYW1pbHk9IiZhcG9zO0x1Y2lkYSBHcmFuZGUmYXBvczsiIHN0cm9rZT0icmdiKDI1NSwxMywxMykiIGNvbG9yLWludGVycG9sYXRpb249ImxpbmVhclJHQiIgICAgPjxwYXRoIGQ9Ik0xMC4zNzk5IDE1LjI1MjkgUTguMjc0NCAxNS4yNTI5IDYuOTkyNyAxMy43OTM1IFE1LjcxMDkgMTIuMzM0IDUuNzEwOSA5LjkzNDYgUTUuNzEwOSA3LjUyMTUgNi45OTk1IDYuMDc1NyBROC4yODgxIDQuNjI5OSAxMC40NDE0IDQuNjI5OSBRMTIuNTg3OSA0LjYyOTkgMTMuODc5OSA2LjA3MjMgUTE1LjE3MTkgNy41MTQ2IDE1LjE3MTkgOS45MjA5IFExNS4xNzE5IDEyLjM3NSAxMy44Nzk5IDEzLjgxNCBRMTIuNTg3OSAxNS4yNTI5IDEwLjM3OTkgMTUuMjUyOSBaTTEwLjQwMDQgMTQuMTc5NyBRMTEuOTUyMSAxNC4xNzk3IDEyLjc5OTggMTMuMDYyIFExMy42NDc1IDExLjk0NDMgMTMuNjQ3NSA5LjkwNzIgUTEzLjY0NzUgNy45MzE2IDEyLjc5NjQgNi44MTc0IFExMS45NDUzIDUuNzAzMSAxMC40NDE0IDUuNzAzMSBROC45MzA3IDUuNzAzMSA4LjA4MyA2LjgyMDggUTcuMjM1NCA3LjkzODUgNy4yMzU0IDkuOTI3NyBRNy4yMzU0IDExLjkxMDIgOC4wNzYyIDEzLjA0NDkgUTguOTE3IDE0LjE3OTcgMTAuNDAwNCAxNC4xNzk3IFoiIHN0cm9rZT0ibm9uZSIgICAgLz48L2cgID48L2c+PC9zdmc+';
	d.PASTE = 'PHN2ZyB0PSIxNTg3NzE0MjU5NzYyIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9Ijg1MDIxIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTMxMiAyNTUuM3YtNTdjMC0xMy41IDMuMi0yNi43IDkuMi0zOC41IDcuMy0xMy43IDI0LjItMTkgMzgtMTJzMTkuNiAyMy43IDEyLjkgMzcuN2MtMiA0LTMgOC40LTMgMTIuOHY1N2gyNTYuNmMyMi43IDAgNDQuNCA5IDYwLjUgMjUgMTYgMTYgMjUgMzcuOCAyNSA2MC41djM3MC42SDc0N2MxMC4yIDAgMTkuNiA1LjQgMjQuNyAxNC4zIDUuMSA4LjggNS4xIDE5LjcgMCAyOC41cy0xNC41IDE0LjMtMjQuNyAxNC4zaC0zNS45djU3YzAgNDcuMi0zOC4zIDg1LjUtODUuNSA4NS41SDI1NWMtMjIuNyAwLTQ0LjQtOS02MC41LTI1cy0yNS0zNy44LTI1LTYwLjVWMzQwLjljMC0yMi43IDktNDQuNCAyNS02MC41IDE2LTE2IDM3LjgtMjUgNjAuNS0yNWg1N3ogbTExMC4yLTg1LjVjLTE1LjcgMC0yOC41LTEyLjgtMjguNS0yOC41czEyLjgtMjguNSAyOC41LTI4LjVoODUuNWMxMC4yIDAgMTkuNiA1LjQgMjQuNyAxNC4zIDUuMSA4LjggNS4xIDE5LjcgMCAyOC41cy0xNC41IDE0LjMtMjQuNyAxNC4zaC04NS41eiBtMTcxIDBjLTE1LjcgMC0yOC41LTEyLjgtMjguNS0yOC41czEyLjgtMjguNSAyOC41LTI4LjVoODUuNWMxMC4yIDAgMTkuNiA1LjQgMjQuNyAxNC4zIDUuMSA4LjggNS4xIDE5LjcgMCAyOC41cy0xNC41IDE0LjMtMjQuNyAxNC4zaC04NS41eiBtMTcxLjEgMGMtMTUuNyAwLTI4LjUtMTIuOC0yOC41LTI4LjVzMTIuOC0yOC41IDI4LjUtMjguNWgzLjljNDMuNyAwIDgwLjQgMzMgODUgNzYuNSAxLjcgMTUuNy05LjcgMjkuNy0yNS40IDMxLjMtMTUuNyAxLjctMjkuNy05LjctMzEuMy0yNS40LTEuNi0xNC41LTEzLjgtMjUuNS0yOC4zLTI1LjVoLTMuOXogbTMyLjQgMTA4LjRjMC0xNS43IDEyLjgtMjguNSAyOC41LTI4LjVzMjguNSAxMi44IDI4LjUgMjguNXY4NS41YzAgMTUuNy0xMi44IDI4LjUtMjguNSAyOC41cy0yOC41LTEyLjgtMjguNS0yOC41di04NS41eiBtMCAxNzFjMC0xNS43IDEyLjgtMjguNSAyOC41LTI4LjVzMjguNSAxMi44IDI4LjUgMjguNXY4NS41YzAgMTUuNy0xMi44IDI4LjUtMjguNSAyOC41cy0yOC41LTEyLjgtMjguNS0yOC41di04NS41eiBtMCAxNzEuMWMwLTE1LjcgMTIuOC0yOC41IDI4LjUtMjguNXMyOC41IDEyLjggMjguNSAyOC41VjY4M2MwIDExLjctMi40IDIzLjEtNi45IDMzLjYtNi4yIDE0LjUtMjMgMjEuMi0zNy40IDE1LTE0LjUtNi4yLTIxLjItMjMtMTUtMzcuNCAxLjUtMy41IDIuMy03LjQgMi4zLTExLjJ2LTYyLjd6IG0wIDAiIHAtaWQ9Ijg1MDIyIj48L3BhdGg+PC9zdmc+';
	d.PERIODIC_TABLE = 'PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIJIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxMDAgMTAwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PGc+CTxwb2x5Z29uIHN0eWxlPSJmaWxsOiNGNzkzMUU7IiBwb2ludHM9IjEyLjUxLDkuNTY4IDYuMjEyLDkuNTY4IDYuMjEyLDkuNTQgNi4yMTIsMCAtMC4yMTksMCAtMC4yMTksOS41NCAtMC4yMTksNzAuODUgCQkxMi41MSw3MC44NSAJIi8+CTxwb2x5Z29uIHN0eWxlPSJmaWxsOiMyOUFCRTI7IiBwb2ludHM9IjkzLjE3LDAgOTMuMTcsMTAuMzYyIDY3LjQ0NywxMC4zNjIgNjcuNDQ3LDcwLjg1IDY4LjIxOSw3MC44NSA5OS45MDEsNzAuODUgOTkuOTAxLDAgCSIvPgk8bGluZSBzdHlsZT0iZmlsbDpub25lO3N0cm9rZTojMDA3MUJDO3N0cm9rZS13aWR0aDozLjAxMzQ7IiB4MT0iOTcuNDY3IiB5MT0iNjguNTMyIiB4Mj0iOTcuNDY3IiB5Mj0iMi4xOSIvPgk8bGluZSBzdHlsZT0iZmlsbDpub25lO3N0cm9rZTojMDA3MUJDO3N0cm9rZS13aWR0aDozLjAxMzQ7IiB4MT0iNzAuNTk4IiB5MT0iNjguNTMyIiB4Mj0iOTguOTMxIiB5Mj0iNjguNTMyIi8+CTxwb2x5bGluZSBzdHlsZT0iZmlsbDpub25lO3N0cm9rZTojMDBGRkZGO3N0cm9rZS13aWR0aDozLjAxMzQ7IiBwb2ludHM9IjY5LjM3NSw3MC44NSA2OS4zNzUsMTIuMjc4IDk1LjE0MiwxMi4yNzggOTUuMTQyLDEuNzk2IAkJOTkuMjI2LDEuODA1IAkiLz4JPHJlY3QgeD0iMTIuNTA1IiB5PSIzMC4yOTgiIHN0eWxlPSJmaWxsOiNFRDFDMjQ7IiB3aWR0aD0iNTQuODcxIiBoZWlnaHQ9IjQwLjYwOCIvPgk8cmVjdCB4PSI1Ljc3IiB5PSI4MC4xMDciIHN0eWxlPSJmaWxsOiM4Q0M2M0Y7IiB3aWR0aD0iODcuMTQ2IiBoZWlnaHQ9IjE5Ljg5MyIvPgk8bGluZSBzdHlsZT0iZmlsbDpub25lO3N0cm9rZTojRjE1QTI0O3N0cm9rZS13aWR0aDozLjAxMzQ7IiB4MT0iMS43NiIgeTE9IjY4LjM1NiIgeDI9IjExLjUxIiB5Mj0iNjguMzU2Ii8+CTxsaW5lIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlOiNGQkQyM0I7c3Ryb2tlLXdpZHRoOjMuMDEzNDsiIHgxPSIxLjc2IiB5MT0iMCIgeDI9IjEuNzYiIHkyPSI3MC44NSIvPgk8bGluZSBzdHlsZT0iZmlsbDpub25lO3N0cm9rZTojRjE1QTI0O3N0cm9rZS13aWR0aDozLjAxMzQ7IiB4MT0iMTAuMjUiIHkxPSI5LjYwNCIgeDI9IjEwLjI1IiB5Mj0iNzAuODUiLz4JPGxpbmUgc3R5bGU9ImZpbGw6bm9uZTtzdHJva2U6I0JEMUMyNDtzdHJva2Utd2lkdGg6My4wMTM0OyIgeDE9IjEzLjkxNyIgeTE9IjY4LjUzMiIgeDI9IjY2LjU4MyIgeTI9IjY4LjUzMiIvPgk8bGluZSBzdHlsZT0iZmlsbDpub25lO3N0cm9rZTojRjY3N0NBO3N0cm9rZS13aWR0aDozLjAxMzQ7IiB4MT0iMTUuMDA2IiB5MT0iMzAuNzI5IiB4Mj0iMTUuMDA2IiB5Mj0iNzAuODUiLz4JPGxpbmUgc3R5bGU9ImZpbGw6bm9uZTtzdHJva2U6I0JEMUMyNDtzdHJva2Utd2lkdGg6My4wMTM0OyIgeDE9IjY1LjI1IiB5MT0iMzAuNzI5IiB4Mj0iNjUuMjUiIHkyPSI3MC44NSIvPgk8bGluZSBzdHlsZT0iZmlsbDpub25lO3N0cm9rZTojRkJEMjNCO3N0cm9rZS13aWR0aDozLjAxMzQ7IiB4MT0iNS4zODkiIHkxPSIxMi4wNjQiIHgyPSIxMi41MSIgeTI9IjEyLjA2NCIvPgk8cGF0aCBzdHlsZT0iZmlsbDojRUQxQzI0OyIgZD0iTTUuMjA4LDEuMDA0djguNTYzdjEuMDA0aDEuMDA0aDUuMjkzdjU5LjI3MkgwLjc4NlY5LjU0VjEuMDA0SDUuMjA4IE02LjIxMiwwaC02LjQzMXY5LjU0djYxLjMxCQlIMTIuNTFWOS41NjhINi4yMTJWOS41NFYwTDYuMjEyLDB6Ii8+CTxsaW5lIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlOiNGNjc3Q0E7c3Ryb2tlLXdpZHRoOjMuMDEzNDsiIHgxPSIxMy45MTciIHkxPSIzMi44MzgiIHgyPSI2Ni41ODMiIHkyPSIzMi44MzgiLz4JPHBhdGggc3R5bGU9ImZpbGw6bm9uZTtzdHJva2U6I0JEMUMyNDtzdHJva2Utd2lkdGg6My4wMTM0OyIgZD0iTTY2LjU4Myw2OC41MzIiLz4JPHBhdGggc3R5bGU9ImZpbGw6bm9uZTtzdHJva2U6I0JEMUMyNDtzdHJva2Utd2lkdGg6My4wMTM0OyIgZD0iTTEzLjkxNyw2OC41MzIiLz4JPHBhdGggc3R5bGU9ImZpbGw6IzlBMDAwMDsiIGQ9Ik02Ni4zNzEsMzEuMzAydjM4LjU5OUgxMy41MDlWMzEuMzAySDY2LjM3MSBNNjcuMzc2LDMwLjI5OEgxMi41MDV2NDAuNjA4aDU0Ljg3MVYzMC4yOTgJCUw2Ny4zNzYsMzAuMjk4eiIvPgk8cGF0aCBzdHlsZT0iZmlsbDojMDA0RUJDOyIgZD0iTTk4Ljg5NiwxLjAwNHY2OC44NEg2OC40NTJWMTEuMzY3SDkzLjE3aDEuMDA1di0xLjAwNFYxLjAwNEg5OC44OTYgTTk5LjkwMSwwSDkzLjE3djEwLjM2Mkg2Ny40NDcJCVY3MC44NWgwLjc3MWgzMS42ODNWMEw5OS45MDEsMHoiLz4JPGxpbmUgc3R5bGU9ImZpbGw6bm9uZTtzdHJva2U6IzAwOTI0NTtzdHJva2Utd2lkdGg6My4wMTM0OyIgeDE9IjYuOTE3IiB5MT0iOTcuOTYyIiB4Mj0iOTIuOTE2IiB5Mj0iOTcuOTYyIi8+CTxsaW5lIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlOiNEOUUwMjE7c3Ryb2tlLXdpZHRoOjMuMDEzNDsiIHgxPSI4LjE4NyIgeTE9IjgwLjU0MiIgeDI9IjguMTg3IiB5Mj0iMTAwIi8+CTxsaW5lIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlOiMwMDkyNDU7c3Ryb2tlLXdpZHRoOjMuMDEzNDsiIHgxPSI5MC40MzEiIHkxPSI4MC41NDIiIHgyPSI5MC40MzEiIHkyPSIxMDAiLz4JPGxpbmUgc3R5bGU9ImZpbGw6bm9uZTtzdHJva2U6I0Q5RTAyMTtzdHJva2Utd2lkdGg6My4wMTM0OyIgeDE9IjYuOTE3IiB5MT0iODIuMTQxIiB4Mj0iOTIuOTE2IiB5Mj0iODIuMTQxIi8+CTxwYXRoIHN0eWxlPSJmaWxsOiMwMDY4Mzc7IiBkPSJNOTEuOTExLDgxLjExMnYxNy44ODNINi43NzRWODEuMTEySDkxLjkxMSBNOTIuOTE2LDgwLjEwN0g1Ljc3VjEwMGg4Ny4xNDZWODAuMTA3TDkyLjkxNiw4MC4xMDd6IgkJLz48L2c+PC9zdmc+';
	d.PERSPECTIVE = 'PHN2ZyB0PSIxNTg3NzE0OTcwODAwIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjExNDk4NSIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiPjxwYXRoIGQ9Ik05NDUuMzU2OCA1MjQuMzEzNmMwLTEwMy41MDA4LTM5Ljk2MTYtMTk3LjU4MDgtMTA0LjgzMi0yNjguNTQ0IDEwLjk1NjgtMTkuMDk3NiAxNy43MTUyLTQwLjk2IDE3LjcxNTItNjQuNTYzMiAwLTcyLjA4OTYtNTguNDQ0OC0xMzAuNTA4OC0xMzAuNTM0NC0xMzAuNTA4OC01MC40MzIgMC05My42NzA0IDI4LjkwMjQtMTE1LjQwNDggNzAuNzU4NC0yMS40MjcyLTMuNTg0LTQzLjI4OTYtNS44ODgtNjUuNzE1Mi01Ljg4OC0yMTIuMDE5MiAwLTM4NS40MDggMTY2LjQ1MTItMzk3LjU2OCAzNzUuNDc1Mi01NS4yMTkyIDE1LjIzMi05NS45NzQ0IDY1LjI4LTk1Ljk3NDQgMTI1LjMxMiAwIDcyLjA4OTYgNTguNDQ0OCAxMzAuNTM0NCAxMzAuNTM0NCAxMzAuNTM0NCAxMi40NDE2IDAgMjQuMjQzMi0yLjMwNCAzNS42MzUyLTUuNTU1MiA3Mi4wODk2IDEwMy42Mjg4IDE5MS44NzIgMTcxLjcyNDggMzI3LjM5ODQgMTcxLjcyNDggMzguNCAwIDc1LjQ0MzItNS43NiAxMTAuNjE3Ni0xNS45NDg4IDIzLjU3NzYgMzMuODY4OCA2Mi42OTQ0IDU2LjE2NjQgMTA3LjA4NDggNTYuMTY2NCA3Mi4wODk2IDAgMTMwLjUzNDQtNTguNDQ0OCAxMzAuNTM0NC0xMzAuNTM0NCAwLTI4LjQ2NzItOS4zNjk2LTU0LjYwNDgtMjQuODMyLTc2LjA4MzJDOTE3LjIyMjQgNjkxLjE3NDQgOTQ1LjM1NjggNjExLjA3MiA5NDUuMzU2OCA1MjQuMzEzNnpNODM3LjkzOTIgNzI1LjA2ODhjLTIwLjk2NjQtMTQuMzYxNi00Ni4yODQ4LTIyLjgzNTItNzMuNjI1Ni0yMi44MzUyLTcyLjA4OTYgMC0xMzAuNTM0NCA1OC40NDQ4LTEzMC41MzQ0IDEzMC41MzQ0IDAgMTEuNTIgMS45NzEyIDIyLjQ3NjggNC43NjE2IDMzLjEwMDgtMjkuMzg4OCA3LjkxMDQtNjAuMTA4OCAxMi41NDQtOTEuOTU1MiAxMi41NDQtMTE3Ljc4NTYgMC0yMjIuMDI4OC01OC4wMzUyLTI4Ni40Mzg0LTE0Ni43OTA0IDMyLjU2MzItMjMuNzMxMiA1My45MzkyLTYxLjg3NTIgNTMuOTM5Mi0xMDUuMjY3MiAwLTY4LjUzMTItNTMuMDE3Ni0xMjQuMTM0NC0xMjAuMTkyLTEyOS40ODQ4QzIwOCAzMTQuNDQ0OCAzNjAuNjI3MiAxNzAuMjQgNTQ2LjYxMTIgMTcwLjI0YzE3Ljc5MiAwIDM1LjE0ODggMS43NDA4IDUyLjI3NTIgNC4zMDA4LTAuNzE2OCA1LjUyOTYtMS42ODk2IDEwLjk1NjgtMS42ODk2IDE2LjY2NTYgMCA3Mi4wODk2IDU4LjQ0NDggMTMwLjUzNDQgMTMwLjUzNDQgMTMwLjUzNDQgMzIuMTc5MiAwIDYxLjIzNTItMTIuMDgzMiA4My45OTM2LTMxLjM2IDU1LjE5MzYgNjIuNDY0IDg4Ljk4NTYgMTQ0LjIzMDQgODguOTg1NiAyMzMuOTMyOEM5MDAuNjg0OCA1OTguODM1MiA4NzcuNDE0NCA2NjcuOTU1MiA4MzcuOTM5MiA3MjUuMDY4OHoiIHAtaWQ9IjExNDk4NiI+PC9wYXRoPjxwYXRoIGQ9Ik00MTYuMDc2OCAzOTMuMTM5MmwyNjEuMDY4OCAwIDAgMjYxLjA2ODgtMjYxLjA2ODggMCAwLTI2MS4wNjg4WiIgcC1pZD0iMTE0OTg3Ij48L3BhdGg+PC9zdmc+';
	d.PHOSPHORUS = 'PHN2ZyBmaWxsLW9wYWNpdHk9IjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBjb2xvci1yZW5kZXJpbmc9ImF1dG8iIGNvbG9yLWludGVycG9sYXRpb249ImF1dG8iIHRleHQtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2U9ImJsYWNrIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiB3aWR0aD0iMjAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc2hhcGUtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2Utb3BhY2l0eT0iMSIgZmlsbD0iYmxhY2siIHN0cm9rZS1kYXNoYXJyYXk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHN0cm9rZS13aWR0aD0iMSIgdmlld0JveD0iMCAwIDIwLjAgMjAuMCIgaGVpZ2h0PSIyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmb250LWZhbWlseT0iJmFwb3M7RGlhbG9nJmFwb3M7IiBmb250LXN0eWxlPSJub3JtYWwiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIGZvbnQtc2l6ZT0iMTIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBpbWFnZS1yZW5kZXJpbmc9ImF1dG8iPjxkZWZzIGlkPSJnZW5lcmljRGVmcyIgIC8+PGcgID48ZyBmb250LXNpemU9IjE0IiBmaWxsPSJyZ2IoMjU1LDEyOCwwKSIgdGV4dC1yZW5kZXJpbmc9Imdlb21ldHJpY1ByZWNpc2lvbiIgaW1hZ2UtcmVuZGVyaW5nPSJvcHRpbWl6ZVNwZWVkIiBjb2xvci1yZW5kZXJpbmc9Im9wdGltaXplUXVhbGl0eSIgZm9udC1mYW1pbHk9IiZhcG9zO0x1Y2lkYSBHcmFuZGUmYXBvczsiIHN0cm9rZT0icmdiKDI1NSwxMjgsMCkiIGNvbG9yLWludGVycG9sYXRpb249ImxpbmVhclJHQiIgICAgPjxwYXRoIGQ9Ik03LjMwNTcgMTUgTDcuMzA1NyA0Ljg4MjggTDEwLjA2MDUgNC44ODI4IFExMS44OTI2IDQuODgyOCAxMi42OTI0IDUuNTAxNSBRMTMuNDkyMiA2LjEyMDEgMTMuNDkyMiA3LjUzNTIgUTEzLjQ5MjIgOS4xNDg0IDEyLjM5ODQgMTAuMDY0NSBRMTEuMzA0NyAxMC45ODA1IDkuMzYzMyAxMC45ODA1IEw4LjcyNzUgMTAuOTgwNSBMOC43Mjc1IDE1IFpNOC43Mjc1IDkuODkzNiBMOS4zMDg2IDkuODkzNiBRMTAuNTg2OSA5Ljg5MzYgMTEuMjg0MiA5LjMwNTcgUTExLjk4MTQgOC43MTc4IDExLjk4MTQgNy42NDQ1IFExMS45ODE0IDYuNzM1NCAxMS40MzQ2IDYuMzQ1NyBRMTAuODg3NyA1Ljk1NjEgOS42MDk0IDUuOTU2MSBMOC43Mjc1IDUuOTU2MSBaIiBzdHJva2U9Im5vbmUiICAgIC8+PC9nICA+PC9nPjwvc3ZnPg==';
	d.PUSHER_BOND_FORMING = 'PHN2ZyBmaWxsLW9wYWNpdHk9IjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBjb2xvci1yZW5kZXJpbmc9ImF1dG8iIGNvbG9yLWludGVycG9sYXRpb249ImF1dG8iIHRleHQtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2U9ImJsYWNrIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiB3aWR0aD0iMjAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc2hhcGUtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2Utb3BhY2l0eT0iMSIgZmlsbD0iYmxhY2siIHN0cm9rZS1kYXNoYXJyYXk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHN0cm9rZS13aWR0aD0iMSIgdmlld0JveD0iMCAwIDIwLjAgMjAuMCIgaGVpZ2h0PSIyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmb250LWZhbWlseT0iJmFwb3M7RGlhbG9nJmFwb3M7IiBmb250LXN0eWxlPSJub3JtYWwiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIGZvbnQtc2l6ZT0iMTIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBpbWFnZS1yZW5kZXJpbmc9ImF1dG8iPjxkZWZzIGlkPSJnZW5lcmljRGVmcyIgIC8+PGcgID48ZyB0ZXh0LXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiBjb2xvci1yZW5kZXJpbmc9Im9wdGltaXplUXVhbGl0eSIgY29sb3ItaW50ZXJwb2xhdGlvbj0ibGluZWFyUkdCIiBpbWFnZS1yZW5kZXJpbmc9Im9wdGltaXplU3BlZWQiICAgID48Y2lyY2xlIHI9IjEiIGN4PSIyIiBjeT0iOCIgc3Ryb2tlPSJub25lIiAgICAgIC8+PGNpcmNsZSByPSIxIiBjeD0iMTkiIGN5PSI4IiBzdHJva2U9Im5vbmUiICAgICAgLz48cGF0aCBmaWxsPSJub25lIiBkPSJNMiA1IEMyIC0zIDYgLTMgNiAxMSIgICAgICAvPjxwYXRoIGZpbGw9Im5vbmUiIGQ9Ik0xOCA1IEMxOCAtMyAxNCAtMyAxNCAxMSIgICAgICAvPjxwYXRoIGQ9Ik02IDE1IEw5IDkuODAzOCBDOSA5LjgwMzggOC40IDEwLjg0MzEgNiAxMC44NDMxIFoiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49ImJldmVsIiBzdHJva2U9Im5vbmUiICAgICAgLz48cGF0aCBmaWxsPSJub25lIiBkPSJNNiAxNSBMOSA5LjgwMzggQzkgOS44MDM4IDguNCAxMC44NDMxIDYgMTAuODQzMSBaIiBzdHJva2UtbGluZWNhcD0iYnV0dCIgc3Ryb2tlLWxpbmVqb2luPSJiZXZlbCIgICAgICAvPjxwYXRoIGQ9Ik0xNCAxNSBMMTEuNzAzOSA5LjQ1NjcgQzExLjcwMzkgOS40NTY3IDEyLjE2MzEgMTAuNTY1NCAxNCAxMC41NjU0IFoiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49ImJldmVsIiBzdHJva2U9Im5vbmUiICAgICAgLz48cGF0aCBmaWxsPSJub25lIiBkPSJNMTQgMTUgTDExLjcwMzkgOS40NTY3IEMxMS43MDM5IDkuNDU2NyAxMi4xNjMxIDEwLjU2NTQgMTQgMTAuNTY1NCBaIiBzdHJva2UtbGluZWNhcD0iYnV0dCIgc3Ryb2tlLWxpbmVqb2luPSJiZXZlbCIgICAgICAvPjxsaW5lIHN0cm9rZS1saW5lY2FwPSJidXR0IiBmaWxsPSJub25lIiB4MT0iMSIgeDI9IjE5IiB5MT0iMTgiIHkyPSIxOCIgc3Ryb2tlLWxpbmVqb2luPSJiZXZlbCIgICAgICAvPjxsaW5lIHN0cm9rZS1saW5lY2FwPSJidXR0IiBmaWxsPSJub25lIiB4MT0iMSIgeDI9IjE5IiB5MT0iMTkiIHkyPSIxOSIgc3Ryb2tlLWxpbmVqb2luPSJiZXZlbCIgICAgLz48L2cgID48L2c+PC9zdmc+';
	d.PUSHER_DOUBLE = 'PHN2ZyBmaWxsLW9wYWNpdHk9IjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBjb2xvci1yZW5kZXJpbmc9ImF1dG8iIGNvbG9yLWludGVycG9sYXRpb249ImF1dG8iIHRleHQtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2U9ImJsYWNrIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiB3aWR0aD0iMjAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc2hhcGUtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2Utb3BhY2l0eT0iMSIgZmlsbD0iYmxhY2siIHN0cm9rZS1kYXNoYXJyYXk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHN0cm9rZS13aWR0aD0iMSIgdmlld0JveD0iMCAwIDIwLjAgMjAuMCIgaGVpZ2h0PSIyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmb250LWZhbWlseT0iJmFwb3M7RGlhbG9nJmFwb3M7IiBmb250LXN0eWxlPSJub3JtYWwiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIGZvbnQtc2l6ZT0iMTIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBpbWFnZS1yZW5kZXJpbmc9ImF1dG8iPjxkZWZzIGlkPSJnZW5lcmljRGVmcyIgIC8+PGcgID48ZyB0ZXh0LXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiBjb2xvci1yZW5kZXJpbmc9Im9wdGltaXplUXVhbGl0eSIgY29sb3ItaW50ZXJwb2xhdGlvbj0ibGluZWFyUkdCIiBpbWFnZS1yZW5kZXJpbmc9Im9wdGltaXplU3BlZWQiICAgID48Y2lyY2xlIHI9IjEiIGN4PSIxIiBjeT0iMTkiIHN0cm9rZT0ibm9uZSIgICAgICAvPjxjaXJjbGUgcj0iMSIgY3g9IjUiIGN5PSIxOSIgc3Ryb2tlPSJub25lIiAgICAgIC8+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTIgMTYgQzIgLTMgMTYgLTMgMTYgMTUiICAgICAgLz48cGF0aCBkPSJNMTYgMTcgTDE0LjE0NTkgMTEuMjkzNyBDMTQuMTQ1OSAxMS4yOTM3IDE0LjUxNjcgMTIuNDM0OSAxNiAxMi40MzQ5IEMxNy40ODMzIDEyLjQzNDkgMTcuODU0MSAxMS4yOTM3IDE3Ljg1NDEgMTEuMjkzNyBaIiBzdHJva2U9Im5vbmUiICAgICAgLz48cGF0aCBmaWxsPSJub25lIiBkPSJNMTYgMTcgTDE0LjE0NTkgMTEuMjkzNyBDMTQuMTQ1OSAxMS4yOTM3IDE0LjUxNjcgMTIuNDM0OSAxNiAxMi40MzQ5IEMxNy40ODMzIDEyLjQzNDkgMTcuODU0MSAxMS4yOTM3IDE3Ljg1NDEgMTEuMjkzNyBaIiAgICAvPjwvZyAgPjwvZz48L3N2Zz4=';
	d.PUSHER_SINGLE = 'PHN2ZyBmaWxsLW9wYWNpdHk9IjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBjb2xvci1yZW5kZXJpbmc9ImF1dG8iIGNvbG9yLWludGVycG9sYXRpb249ImF1dG8iIHRleHQtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2U9ImJsYWNrIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiB3aWR0aD0iMjAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc2hhcGUtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2Utb3BhY2l0eT0iMSIgZmlsbD0iYmxhY2siIHN0cm9rZS1kYXNoYXJyYXk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHN0cm9rZS13aWR0aD0iMSIgdmlld0JveD0iMCAwIDIwLjAgMjAuMCIgaGVpZ2h0PSIyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmb250LWZhbWlseT0iJmFwb3M7RGlhbG9nJmFwb3M7IiBmb250LXN0eWxlPSJub3JtYWwiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIGZvbnQtc2l6ZT0iMTIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBpbWFnZS1yZW5kZXJpbmc9ImF1dG8iPjxkZWZzIGlkPSJnZW5lcmljRGVmcyIgIC8+PGcgID48ZyB0ZXh0LXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiBjb2xvci1yZW5kZXJpbmc9Im9wdGltaXplUXVhbGl0eSIgY29sb3ItaW50ZXJwb2xhdGlvbj0ibGluZWFyUkdCIiBpbWFnZS1yZW5kZXJpbmc9Im9wdGltaXplU3BlZWQiICAgID48Y2lyY2xlIHI9IjEiIGN4PSIzIiBjeT0iMTkiIHN0cm9rZT0ibm9uZSIgICAgICAvPjxwYXRoIGZpbGw9Im5vbmUiIGQ9Ik0yIDE2IEMyIC0zIDE2IC0zIDE2IDE1IiAgICAgIC8+PHBhdGggZD0iTTE2IDE3IEwxOC4yOTYxIDExLjQ1NjcgQzE4LjI5NjEgMTEuNDU2NyAxNy44MzY5IDEyLjU2NTQgMTYgMTIuNTY1NCBaIiBzdHJva2U9Im5vbmUiICAgICAgLz48cGF0aCBmaWxsPSJub25lIiBkPSJNMTYgMTcgTDE4LjI5NjEgMTEuNDU2NyBDMTguMjk2MSAxMS40NTY3IDE3LjgzNjkgMTIuNTY1NCAxNiAxMi41NjU0IFoiICAgIC8+PC9nICA+PC9nPjwvc3ZnPg==';
	d.QUERY = 'PHN2ZyB0PSIxNTg3NzE1MTY1NTUyIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjExNjgwMiIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiPjxwYXRoIGQ9Ik01MTEuNjkwNDUgNjUuNzE0Njc3Yy0yNDcuMTUzMDA2IDAtNDQ3LjUwNjEyNyAyMDAuMzU0MTQ0LTQ0Ny41MDYxMjcgNDQ3LjUwNjEyNyAwIDI0Ny4xNTMwMDYgMjAwLjM1NDE0NCA0NDcuNTA3MTUgNDQ3LjUwNjEyNyA0NDcuNTA3MTUgMjQ3LjE1MzAwNiAwIDQ0Ny41MDUxMDQtMjAwLjM1NDE0NCA0NDcuNTA1MTA0LTQ0Ny41MDcxNUM5NTkuMTk2NTc3IDI2Ni4wNjg4MjEgNzU4Ljg0NDQ3OSA2NS43MTQ2NzcgNTExLjY5MDQ1IDY1LjcxNDY3N3pNNTYyLjg5MzYyMiA3OTAuOTg2MDE1bC05OS4xNTgzNzEgMEw0NjMuNzM1MjUxIDY4NC44MzY0MTdsOTkuMTU4MzcxIDBMNTYyLjg5MzYyMiA3OTAuOTg2MDE1ek02NzguNzg5MTg5IDQ1Ni45NTMyOWMtMTIuMzMyODg2IDIwLjkyMTQ5NS0zOC43NTk3NjkgNDkuMzg2ODA0LTc5LjE3MjE3NyA4NS4zOTM4NzktMjAuOTc2NzU0IDE4LjY2NDA4Mi0zMy45Njk2NzMgMzMuNjQwMTY4LTM5LjAzNTAzOCA0NC45ODI0OTQtNS4wNjUzNjYgMTEuMzQxMzAzLTcuMzIyNzc5IDMxLjYwMjc2NS02Ljg4Mjc1NyA2MC44Mzc2TDQ2My43MzUyNTEgNjQ4LjE2NzI2M2MtMC4yMjAwMTEtMTMuODc1MDA5LTAuMzMwNTI4LTIyLjI5Nzg0Mi0wLjMzMDUyOC0yNS4zMjY4MjggMC0zMS4yMTY5NzkgNC43OTAwOTYtNTYuOTI4NTcgMTQuNDI0NTI0LTc3LjA3OTUxNiA5LjY5MDcxLTIwLjE1MDk0NiAyOC45NjA1ODktNDIuODM0NTc0IDU3Ljg2NTkxOS02Ny45OTU2MjcgMjguOTU5NTY1LTI1LjIxNjMxMSA0Ni4yNDczLTQxLjY3ODIzOCA1MS45MTg0NjMtNDkuNDk2Mjk4IDguNjk5MTI2LTEyLjMzMjg4NiAxMy4wNDgxNzctMjUuOTMyNjI2IDEzLjA0ODE3Ny00MC43OTcxNzIgMC0yMC42NDcyNDktNy43MDc1NDItMzguMzc1MDA2LTIzLjEyNDY3My01My4xMzAwNTgtMTUuNDE2MTA4LTE0LjcwMDgxNy0zNi4xNzI4NTEtMjIuMDc4ODU1LTYyLjI3MDIyOS0yMi4wNzg4NTUtMjUuMjE2MzExIDAtNDYuMjQ4MzI0IDcuNzA4NTY2LTYzLjIwNTUzMSAyMy4wNjk0MTUtMTYuOTAyOTcyIDE1LjM2MDg0OS0yOC41NzQ4MDIgMzguNzYwNzkyLTM0LjkwNzAyMSA3MC4yNTMwNGwtOTEuMDY1MDQyLTEyLjExMjg3NWMyLjU4Nzk0MS00NS4wOTE5ODggMjAuNTM2NzMyLTgzLjM1NjQ3NiA1My44NDYzNzItMTE0Ljg0OTc0OCAzMy4yNTU0MDUtMzEuNDkyMjQ4IDc2Ljk3MDAyMi00Ny4yMzg4ODQgMTMxLjA5MTY2NC00Ny4yMzg4ODQgNTYuOTI5NTk0IDAgMTAyLjE4NTMxIDE1Ljk2NzY3IDEzNS44MjY1MDIgNDcuNzkwNDQ2IDMzLjYzOTE0NSAzMS44NzgwMzUgNTAuNDg2ODU4IDY4Ljk4NzIxMSA1MC40ODY4NTggMTExLjI3MTI0NkM2OTcuMzQzNzc3IDQxMy44OTc2ODEgNjkxLjE3NzMzNCA0MzYuMDg2MDMgNjc4Ljc4OTE4OSA0NTYuOTUzMjl6IiBwLWlkPSIxMTY4MDMiPjwvcGF0aD48L3N2Zz4=';
	d.REDO = 'PHN2ZyB0PSIxNTg3NzE1MjU2OTUwIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjExNzY3OCIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiPjxwYXRoIGQ9Ik05NDYuOCA0MjBMNjUxLjkgMTI1LjFjLTE5LjUtMTkuNS01Mi43LTUuNy01Mi43IDIxLjh2MTc0Yy03OS4zLTEuOC01MDEuOCAxNC45LTUzMi4zIDU2OS42LTAuOSAxNy4yIDIyLjEgMjQuMyAzMC42IDkuM0MyNTUgNjIxIDM5Ni42IDU1My4zIDU5OS4xIDU2MS41djE3NS4yYzAgMjcuNSAzMy4zIDQxLjMgNTIuOCAyMS45bDI5NC44LTI5NC45YzEyLjEtMTIuMSAxMi4xLTMxLjYgMC4xLTQzLjd6IiBwLWlkPSIxMTc2NzkiPjwvcGF0aD48L3N2Zz4=';
	d.REMOVE_LONE_PAIR = 'PHN2ZyBmaWxsLW9wYWNpdHk9IjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBjb2xvci1yZW5kZXJpbmc9ImF1dG8iIGNvbG9yLWludGVycG9sYXRpb249ImF1dG8iIHRleHQtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2U9ImJsYWNrIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiB3aWR0aD0iMjAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc2hhcGUtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2Utb3BhY2l0eT0iMSIgZmlsbD0iYmxhY2siIHN0cm9rZS1kYXNoYXJyYXk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHN0cm9rZS13aWR0aD0iMSIgdmlld0JveD0iMCAwIDIwLjAgMjAuMCIgaGVpZ2h0PSIyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmb250LWZhbWlseT0iJmFwb3M7RGlhbG9nJmFwb3M7IiBmb250LXN0eWxlPSJub3JtYWwiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIGZvbnQtc2l6ZT0iMTIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBpbWFnZS1yZW5kZXJpbmc9ImF1dG8iPjxkZWZzIGlkPSJnZW5lcmljRGVmcyIgIC8+PGcgID48ZyB0ZXh0LXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiBjb2xvci1yZW5kZXJpbmc9Im9wdGltaXplUXVhbGl0eSIgY29sb3ItaW50ZXJwb2xhdGlvbj0ibGluZWFyUkdCIiBpbWFnZS1yZW5kZXJpbmc9Im9wdGltaXplU3BlZWQiICAgID48Y2lyY2xlIGZpbGw9Im5vbmUiIHI9IjIiIGN4PSI2IiBjeT0iMTAiICAgICAgLz48Y2lyY2xlIGZpbGw9Im5vbmUiIHI9IjIiIGN4PSIxNCIgY3k9IjEwIiAgICAvPjwvZyAgPjwvZz48L3N2Zz4=';
	d.REMOVE_RADICAL = 'PHN2ZyBmaWxsLW9wYWNpdHk9IjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBjb2xvci1yZW5kZXJpbmc9ImF1dG8iIGNvbG9yLWludGVycG9sYXRpb249ImF1dG8iIHRleHQtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2U9ImJsYWNrIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiB3aWR0aD0iMjAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc2hhcGUtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2Utb3BhY2l0eT0iMSIgZmlsbD0iYmxhY2siIHN0cm9rZS1kYXNoYXJyYXk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHN0cm9rZS13aWR0aD0iMSIgdmlld0JveD0iMCAwIDIwLjAgMjAuMCIgaGVpZ2h0PSIyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmb250LWZhbWlseT0iJmFwb3M7RGlhbG9nJmFwb3M7IiBmb250LXN0eWxlPSJub3JtYWwiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIGZvbnQtc2l6ZT0iMTIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBpbWFnZS1yZW5kZXJpbmc9ImF1dG8iPjxkZWZzIGlkPSJnZW5lcmljRGVmcyIgIC8+PGcgID48ZyB0ZXh0LXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiBjb2xvci1yZW5kZXJpbmc9Im9wdGltaXplUXVhbGl0eSIgY29sb3ItaW50ZXJwb2xhdGlvbj0ibGluZWFyUkdCIiBpbWFnZS1yZW5kZXJpbmc9Im9wdGltaXplU3BlZWQiICAgID48Y2lyY2xlIGZpbGw9Im5vbmUiIHI9IjIiIGN4PSIxMCIgY3k9IjEwIiAgICAvPjwvZyAgPjwvZz48L3N2Zz4=';
	d.RING_ARBITRARY = 'PHN2ZyBmaWxsLW9wYWNpdHk9IjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBjb2xvci1yZW5kZXJpbmc9ImF1dG8iIGNvbG9yLWludGVycG9sYXRpb249ImF1dG8iIHRleHQtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2U9ImJsYWNrIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiB3aWR0aD0iMjAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc2hhcGUtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2Utb3BhY2l0eT0iMSIgZmlsbD0iYmxhY2siIHN0cm9rZS1kYXNoYXJyYXk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHN0cm9rZS13aWR0aD0iMSIgdmlld0JveD0iMCAwIDIwLjAgMjAuMCIgaGVpZ2h0PSIyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmb250LWZhbWlseT0iJmFwb3M7RGlhbG9nJmFwb3M7IiBmb250LXN0eWxlPSJub3JtYWwiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIGZvbnQtc2l6ZT0iMTIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBpbWFnZS1yZW5kZXJpbmc9ImF1dG8iPjxkZWZzIGlkPSJnZW5lcmljRGVmcyIgIC8+PGcgID48ZGVmcyBpZD0iZGVmczEiICAgID48bGluZWFyR3JhZGllbnQgeDE9IjE1IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDI9IjIwIiB5MT0iMTUiIHkyPSIyMCIgaWQ9ImxpbmVhckdyYWRpZW50MSIgc3ByZWFkTWV0aG9kPSJwYWQiICAgICAgPjxzdG9wIHN0b3Atb3BhY2l0eT0iMSIgc3RvcC1jb2xvcj0iYmx1ZSIgb2Zmc2V0PSIwJSIgICAgICAgIC8+PHN0b3Agc3RvcC1vcGFjaXR5PSIxIiBzdG9wLWNvbG9yPSJibGFjayIgb2Zmc2V0PSIxMDAlIiAgICAgIC8+PC9saW5lYXJHcmFkaWVudCAgICA+PC9kZWZzICAgID48ZyB0ZXh0LXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiBjb2xvci1yZW5kZXJpbmc9Im9wdGltaXplUXVhbGl0eSIgY29sb3ItaW50ZXJwb2xhdGlvbj0ibGluZWFyUkdCIiBpbWFnZS1yZW5kZXJpbmc9Im9wdGltaXplU3BlZWQiICAgID48Y2lyY2xlIGZpbGw9Im5vbmUiIHI9IjkiIGN4PSIxMCIgY3k9IjEwIiAgICAvPjwvZyAgICA+PGcgZm9udC1zaXplPSIxNCIgZmlsbD0idXJsKCNsaW5lYXJHcmFkaWVudDEpIiB0ZXh0LXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiBpbWFnZS1yZW5kZXJpbmc9Im9wdGltaXplU3BlZWQiIGNvbG9yLXJlbmRlcmluZz0ib3B0aW1pemVRdWFsaXR5IiBmb250LWZhbWlseT0ic2VyaWYiIHN0cm9rZT0idXJsKCNsaW5lYXJHcmFkaWVudDEpIiBjb2xvci1pbnRlcnBvbGF0aW9uPSJsaW5lYXJSR0IiIGZvbnQtd2VpZ2h0PSJib2xkIiAgICA+PHBhdGggZD0iTTcuMjI1NiAxMy42NjUgUTcuNjA4NCAxMy42MTcyIDcuNzg5NiAxMy40NTY1IFE3Ljk3MDcgMTMuMjk1OSA3Ljk3MDcgMTIuODE3NCBMNy45NzA3IDguNzAyMSBRNy45NzA3IDguMjc4MyA3LjgyMzcgOC4xMTQzIFE3LjY3NjggNy45NTAyIDcuMjI1NiA3Ljg5NTUgTDcuMjI1NiA3LjU1MzcgTDkuODc3OSA3LjU1MzcgTDkuODc3OSA4LjU1ODYgUTEwLjIxMjkgOC4wNTI3IDEwLjcyOSA3LjcyMTIgUTExLjI0NTEgNy4zODk2IDExLjg3NCA3LjM4OTYgUTEyLjc3NjQgNy4zODk2IDEzLjI3MiA3Ljg1NDUgUTEzLjc2NzYgOC4zMTkzIDEzLjc2NzYgOS40ODgzIEwxMy43Njc2IDEyLjg3MjEgUTEzLjc2NzYgMTMuMzQzOCAxMy45MjgyIDEzLjQ4MDUgUTE0LjA4ODkgMTMuNjE3MiAxNC40NjQ4IDEzLjY2NSBMMTQuNDY0OCAxNCBMMTEuMTc2OCAxNCBMMTEuMTc2OCAxMy42NjUgUTExLjU1MjcgMTMuNTg5OCAxMS42ODk1IDEzLjQ2IFExMS44MjYyIDEzLjMzMDEgMTEuODI2MiAxMi44NzIxIEwxMS44MjYyIDkuNDgxNCBRMTEuODI2MiA5LjAwMjkgMTEuNzMwNSA4Ljc2MzcgUTExLjU2NjQgOC4zMzMgMTEuMDgxMSA4LjMzMyBRMTAuNzE4OCA4LjMzMyAxMC40MTQ2IDguNTk2MiBRMTAuMTEwNCA4Ljg1OTQgOS45NDYzIDkuMTI2IEw5Ljk0NjMgMTIuODcyMSBROS45NDYzIDEzLjMzMDEgMTAuMDgzIDEzLjQ2IFExMC4yMTk3IDEzLjU4OTggMTAuNTk1NyAxMy42NjUgTDEwLjU5NTcgMTQgTDcuMjI1NiAxNCBaIiBzdHJva2U9Im5vbmUiICAgIC8+PC9nICA+PC9nPjwvc3ZnPg==';
	d.SAVE = 'PHN2ZyB0PSIxNTg3NzE1MzE1NDgyIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjExODQzNyIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiPjxwYXRoIGQ9Ik0xOTYuNDQ1NDI0IDk5OS43MjY1NzEgODIwLjIxNjA5NyA5OTkuNzI2NTcxIDgyMC43ODA1OTUgNjY0Ljk3OTA1MiAxOTYuNDQ1NDI0IDY2NC45NzkwNTJaTTg1MS44MjgwMDQgMTgyLjMzMjk2NkM3MzEuNTg5ODU3IDU3LjAxNDMzMyA3MTUuMjE5NDA1IDM5LjUxNDg4NCA3MDEuNjcxNDQ0IDM5LjUxNDg4NGwtODcuNDk3MjQ0IDAgMCAyODcuODk0MTU3YzAgMTcuNDk5NDQ5LTE0LjExMjQ1OSAzMi4xNzY0MDYtMzIuMTc2NDA2IDMyLjE3NjQwNmwtNDE3LjcyODc3NiAwYy0xNy40OTk0NDkgMC0zMi4xNzY0MDYtMTQuMTEyNDU5LTMyLjE3NjQwNi0zMi4xNzY0MDZMMTMyLjA5MjYxMyAzOS41MTQ4ODRsLTUyLjQ5ODM0NiAwYy0yNi41MzE0MjIgMC00Ny45ODIzNTkgMjEuNDUwOTM3LTQ3Ljk4MjM1OSA0Ny45ODIzNTlsMCA4NjQuMjQ2OTY4YzAgMjYuNTMxNDIyIDIxLjQ1MDkzNyA0Ny45ODIzNTkgNDcuOTgyMzU5IDQ3Ljk4MjM1OWw1Mi40OTgzNDYgMCAwLTM3MC44NzU0MTNjMC0xNS44MDU5NTQgMTQuMTEyNDU5LTI4LjIyNDkxNyAzMi4xNzY0MDYtMjguMjI0OTE3bDY4OC42ODc5ODIgMGMxNy40OTk0NDkgMCAzMi4xNzY0MDYgMTIuNDE4OTY0IDMyLjE3NjQwNiAyOC4yMjQ5MTdsMCAzNzAuODc1NDEzIDU5LjI3MjMyNiAwYzI2LjUzMTQyMiAwIDQ3Ljk4MjM1OS0yMS40NTA5MzcgNDcuOTgyMzU5LTQ3Ljk4MjM1OUw5OTIuMzg4MDkzIDMzMC4yMzE1MzNDOTkyLjM4ODA5MyAzMTcuMjQ4MDcxIDk3Ny43MTExMzYgMzA4LjIxNjA5NyA4NTEuODI4MDA0IDE4Mi4zMzI5NjZ6TTU0OS44MjEzODkgMzkuNTE0ODg0IDE5Ni40NDU0MjQgMzkuNTE0ODg0bDAgMjU2LjI4MjI0OSAzNTMuMzc1OTY1IDBMNTQ5LjgyMTM4OSAzOS41MTQ4ODR6TTMzMS45MjUwMjggMjM4LjIxODMwMmMwIDUuMDgwNDg1LTMuOTUxNDg4IDkuNTk2NDcyLTkuNTk2NDcyIDkuNTk2NDcybC00NS4xNTk4NjggMGMtNS4wODA0ODUgMC05LjU5NjQ3Mi0zLjk1MTQ4OC05LjU5NjQ3Mi05LjU5NjQ3MmwwLTE0MS4xMjQ1ODdjMC01LjA4MDQ4NSAzLjk1MTQ4OC05LjU5NjQ3MiA5LjU5NjQ3Mi05LjU5NjQ3Mmw0NS4xNTk4NjggMGM1LjA4MDQ4NSAwIDkuNTk2NDcyIDMuOTUxNDg4IDkuNTk2NDcyIDkuNTk2NDcyTDMzMS45MjUwMjggMjM4LjIxODMwMnoiIHAtaWQ9IjExODQzOCI+PC9wYXRoPjwvc3ZnPg==';
	d.SEARCH = 'PHN2ZyB0PSIxNTg3NzE1Mzk5MDAzIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjEyMTgyMSIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiPjxwYXRoIGQ9Ik03NjggNDk0LjkzMzMzM2MtNzEuNjggMC0xMzYuNTMzMzMzIDM0LjEzMzMzMy0xODAuOTA2NjY3IDg1LjMzMzMzNGwtNzguNTA2NjY2LTc4LjUwNjY2N3MtMy40MTMzMzMtMy40MTMzMzMtNi44MjY2NjctMy40MTMzMzNjMzcuNTQ2NjY3LTQ3Ljc4NjY2NyA2MS40NC0xMDUuODEzMzMzIDYxLjQ0LTE3MC42NjY2NjcgMC0zNy41NDY2NjctNi44MjY2NjctNzEuNjgtMjAuNDgtMTAyLjRoMTI2LjI5MzMzM2MtMy40MTMzMzMgMTAuMjQtMy40MTMzMzMgMjMuODkzMzMzLTMuNDEzMzMzIDM0LjEzMzMzMyAwIDk1LjU3MzMzMyA3NS4wOTMzMzMgMTcwLjY2NjY2NyAxNzAuNjY2NjY3IDE3MC42NjY2NjdzMTcwLjY2NjY2Ny03NS4wOTMzMzMgMTcwLjY2NjY2Ni0xNzAuNjY2NjY3LTc1LjA5MzMzMy0xNzAuNjY2NjY3LTE3MC42NjY2NjYtMTcwLjY2NjY2NmMtNjguMjY2NjY3IDAtMTI5LjcwNjY2NyA0MC45Ni0xNTcuMDEzMzM0IDEwMi40aC0xNTAuMTg2NjY2LTMuNDEzMzM0Yy00Ny43ODY2NjctODEuOTItMTM2LjUzMzMzMy0xMzYuNTMzMzMzLTIzNS41Mi0xMzYuNTMzMzM0LTE1MC4xODY2NjcgMC0yNzMuMDY2NjY3IDEyMi44OC0yNzMuMDY2NjY2IDI3My4wNjY2NjcgMCAxMjYuMjkzMzMzIDg4Ljc0NjY2NyAyMzUuNTIgMjA4LjIxMzMzMyAyNjYuMjRsMjcuMzA2NjY3IDgxLjkyYy01OC4wMjY2NjcgMTcuMDY2NjY3LTk4Ljk4NjY2NyA2OC4yNjY2NjctOTguOTg2NjY3IDEyOS43MDY2NjcgMCA3NS4wOTMzMzMgNjEuNDQgMTM2LjUzMzMzMyAxMzYuNTMzMzMzIDEzNi41MzMzMzNzMTM2LjUzMzMzMy02MS40NCAxMzYuNTMzMzM0LTEzNi41MzMzMzMtNjEuNDQtMTM2LjUzMzMzMy0xMzYuNTMzMzM0LTEzNi41MzMzMzRoLTMuNDEzMzMzbC0yMy44OTMzMzMtNzEuNjhoMjcuMzA2NjY2Yzc1LjA5MzMzMyAwIDEzOS45NDY2NjctMzAuNzIgMTkxLjE0NjY2Ny03OC41MDY2NjYgMCAwIDAgMy40MTMzMzMgMy40MTMzMzMgMy40MTMzMzNsODEuOTIgODEuOTJjLTIzLjg5MzMzMyAzNy41NDY2NjctMzcuNTQ2NjY3IDc4LjUwNjY2Ny0zNy41NDY2NjYgMTI2LjI5MzMzMyAwIDEzMy4xMiAxMDUuODEzMzMzIDIzOC45MzMzMzMgMjM4LjkzMzMzMyAyMzguOTMzMzM0czIzOC45MzMzMzMtMTA1LjgxMzMzMyAyMzguOTMzMzMzLTIzOC45MzMzMzQtMTA1LjgxMzMzMy0yMzUuNTItMjM4LjkzMzMzMy0yMzUuNTJ6IiBmaWxsPSIiIHAtaWQ9IjEyMTgyMiI+PC9wYXRoPjwvc3ZnPg==';
	d.SETTINGS = 'PHN2ZyB0PSIxNTg3NzE1NDQxMDgwIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjEyMjYwMiIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiPjxwYXRoIGQ9Ik04ODUuMTk2OTU4IDg3MS41MjgxNDVjLTE0Ljc1MzE0MS01LjQ2NDEyNi0yNS4xMzQ5ODEtOC43NDI2MDItMzQuOTcwNDA4LTEyLjU2NzQ5LTMwLjA1MjY5NS0xMS40NzQ2NjUtNTkuMDEyNTY0LTI0LjU4ODU2OC04OS42MTE2NzEtMzQuOTcwNDA4LTguNzQyNjAyLTIuNzMyMDYzLTIxLjMxMDA5My0xLjYzOTIzOC0yOS41MDYyODIgMi43MzIwNjMtMjEuMzEwMDkzIDEwLjM4MTg0LTQyLjA3Mzc3MyAyMi40MDI5MTgtNjEuNzQ0NjI3IDM2LjA2MzIzNC02LjU1Njk1MiA0LjM3MTMwMS0xMi4wMjEwNzggMTQuMjA2NzI4LTEzLjY2MDMxNiAyMi40MDI5MTgtNi41NTY5NTIgMzYuMDYzMjM0LTExLjQ3NDY2NSA3Mi42NzI4OC0xNS44NDU5NjYgMTA5LjI4MjUyNi0yLjczMjA2MyAyMC43NjM2OC0xMi41Njc0OSAzMC4wNTI2OTUtMzMuODc3NTgzIDI5LjUwNjI4Mi02Mi44Mzc0NTItMC41NDY0MTMtMTI1LjY3NDkwNS0wLjU0NjQxMy0xODguNTEyMzU3IDAtMjAuNzYzNjggMC0zMS42OTE5MzMtOC4xOTYxODktMzQuNDIzOTk2LTI4Ljk1OTg2OS00LjkxNzcxNC0zNi42MDk2NDYtMTAuOTI4MjUzLTcyLjY3Mjg4LTE1LjI5OTU1NC0xMDkuMjgyNTI2LTEuNjM5MjM4LTEyLjU2NzQ5LTYuMDEwNTM5LTIwLjIxNzI2Ny0xOC4wMzE2MTctMjYuMjI3ODA2LTIwLjIxNzI2Ny05LjgzNTQyNy0zOC4yNDg4ODQtMjMuNDk1NzQzLTU4LjQ2NjE1MS0zMy4zMzExNy03LjEwMzM2NC0zLjgyNDg4OC0xOC4wMzE2MTctNS40NjQxMjYtMjUuNjgxMzk0LTIuNzMyMDYzLTM1LjUxNjgyMSAxMi41Njc0OS02OS45NDA4MTcgMjYuNzc0MjE5LTEwNC45MTEyMjUgNDAuNDM0NTM1LTI1LjEzNDk4MSA5LjgzNTQyNy0zMi4yMzgzNDUgNy42NDk3NzctNDYuNDQ1MDc0LTE2LjM5MjM3OS0zMS4xNDU1Mi01My4wMDIwMjUtNjEuNzQ0NjI3LTEwNi4wMDQwNS05Mi4zNDM3MzUtMTU5LjAwNjA3NS0xNC4yMDY3MjgtMjQuNTg4NTY4LTEzLjY2MDMxNi0zMC41OTkxMDcgOC43NDI2MDItNDguMDg0MzExIDI5LjUwNjI4Mi0yMy40OTU3NDMgNTkuNTU4OTc3LTQ1Ljg5ODY2MSA4OC41MTg4NDYtNjkuOTQwODE3IDUuNDY0MTI2LTQuMzcxMzAxIDkuMjg5MDE1LTE0LjIwNjcyOCA5LjI4OTAxNS0yMS4zMTAwOTMgMS4wOTI4MjUtMjAuMjE3MjY3LTMuMjc4NDc2LTQxLjUyNzM2IDAtNjEuMTk4MjE1IDMuODI0ODg4LTIxLjMxMDA5My00LjkxNzcxNC0zMi4yMzgzNDUtMjAuMjE3MjY3LTQzLjcxMzAxLTI3LjMyMDYzMi0xOS42NzA4NTUtNTIuNDU1NjEzLTQxLjUyNzM2LTc5LjIyOTgzMS02MS4xOTgyMTUtMTUuODQ1OTY2LTEyLjAyMTA3OC0xOS42NzA4NTUtMjQuNTg4NTY4LTkuMjg5MDE1LTQyLjA3Mzc3MyAzMy4zMzExNy01Ni4yODA1MDEgNjYuMTE1OTI4LTExMy4xMDc0MTQgOTguOTAwNjg2LTE2OS45MzQzMjggOS4yODkwMTUtMTUuODQ1OTY2IDIxLjMxMDA5My0xOS4xMjQ0NDIgMzguMjQ4ODg0LTEyLjU2NzQ5IDM2LjA2MzIzNCAxNC4yMDY3MjggNzIuMTI2NDY3IDI4Ljk1OTg2OSAxMDguNzM2MTEzIDQyLjA3Mzc3MyA3LjY0OTc3NyAyLjczMjA2MyAxOS42NzA4NTUgMS4wOTI4MjUgMjcuMzIwNjMyLTIuNzMyMDYzIDIwLjc2MzY4LTEwLjM4MTg0IDM5LjM0MTcwOS0yNC4wNDIxNTYgNjAuMTA1Mzg5LTM0LjQyMzk5NiAxMC45MjgyNTMtNS40NjQxMjYgMTQuNzUzMTQxLTEyLjAyMTA3OCAxNS44NDU5NjYtMjIuOTQ5MzMgNC45MTc3MTQtMzcuMTU2MDU5IDEwLjkyODI1My03NC4zMTIxMTggMTUuODQ1OTY2LTExMS40NjgxNzdDMzg2LjMyMjIyNiA3LjY0OTc3NyAzOTcuNzk2ODkyIDAgNDE4LjAxNDE1OSAwYzYyLjgzNzQ1MiAwLjU0NjQxMyAxMjUuNjc0OTA1IDAuNTQ2NDEzIDE4OC41MTIzNTcgMCAxOS42NzA4NTUgMCAzMC41OTkxMDcgOC4xOTYxODkgMzIuNzg0NzU4IDI3Ljg2NzA0NCA0LjkxNzcxNCAzNi42MDk2NDYgMTAuOTI4MjUzIDcyLjY3Mjg4IDE1LjI5OTU1NCAxMDkuMjgyNTI2IDEuNjM5MjM4IDEzLjY2MDMxNiA2LjU1Njk1MiAyMS44NTY1MDUgMTkuNjcwODU1IDI3Ljg2NzA0NCAxOS4xMjQ0NDIgOC43NDI2MDIgMzcuMTU2MDU5IDE5LjY3MDg1NSA1NC42NDEyNjMgMzEuNjkxOTMzIDExLjQ3NDY2NSA4LjE5NjE4OSAyMS4zMTAwOTMgOC4xOTYxODkgMzMuODc3NTgzIDIuNzMyMDYzIDMzLjg3NzU4My0xNC4yMDY3MjggNjguMzAxNTc5LTI2Ljc3NDIxOSAxMDIuNzI1NTc1LTQwLjk4MDk0NyAxOS4xMjQ0NDItNy42NDk3NzcgMzIuMjM4MzQ1LTMuODI0ODg4IDQyLjYyMDE4NSAxNC43NTMxNDEgMzEuMTQ1NTIgNTUuMTg3Njc2IDYzLjkzMDI3OCAxMDkuODI4OTM5IDk1LjYyMjIxIDE2NC40NzAyMDIgMTIuNTY3NDkgMjEuODU2NTA1IDEwLjkyODI1MyAyOC45NTk4NjktOS4yODkwMTUgNDQuODA1ODM2LTI4Ljk1OTg2OSAyMi40MDI5MTgtNTcuOTE5NzM5IDQ1LjM1MjI0OC04Ny40MjYwMjEgNjcuNzU1MTY2LTkuODM1NDI3IDcuNjQ5Nzc3LTEyLjU2NzQ5IDE0Ljc1MzE0MS0xMS40NzQ2NjUgMjcuMzIwNjMyIDIuMTg1NjUxIDIyLjk0OTMzLTAuNTQ2NDEzIDQ2LjQ0NTA3NCAwLjU0NjQxMyA2OS4zOTQ0MDQgMC41NDY0MTMgOC4xOTYxODkgNC4zNzEzMDEgMTguMDMxNjE3IDEwLjM4MTg0IDIyLjk0OTMzIDI4Ljk1OTg2OSAyNC4wNDIxNTYgNTkuMDEyNTY0IDQ2LjQ0NTA3NCA4OC41MTg4NDYgNjkuMzk0NDA0IDIwLjIxNzI2NyAxNS44NDU5NjYgMjEuMzEwMDkzIDIyLjk0OTMzIDguNzQyNjAyIDQ0LjgwNTgzNi0zMi4yMzgzNDUgNTUuNzM0MDg4LTY0LjQ3NjY5IDExMC45MjE3NjQtOTcuMjYxNDQ4IDE2Ni4xMDk0NEM5MDEuMDQyOTI0IDg2MC4wNTM0OCA4OTEuNzUzOTA5IDg2NS41MTc2MDYgODg1LjE5Njk1OCA4NzEuNTI4MTQ1ek01MTAuMzU3ODkzIDY5Mi4zMDQ4MDNjOTguOTAwNjg2IDAuNTQ2NDEzIDE4MC44NjI1ODEtNzkuNzc2MjQ0IDE4MS40MDg5OTMtMTc3LjU4NDEwNSAwLjU0NjQxMy0xMDAuNTM5OTI0LTc5LjIyOTgzMS0xODEuOTU1NDA2LTE3OC42NzY5My0xODIuNTAxODE5LTk5LjQ0NzA5OS0wLjU0NjQxMy0xODEuNDA4OTkzIDgwLjMyMjY1Ny0xODEuNDA4OTkzIDE3OS43Njk3NTVDMzMxLjEzNDU1MSA2MTAuMzQyOTA4IDQxMi4wMDM2MiA2OTEuNzU4MzkgNTEwLjM1Nzg5MyA2OTIuMzA0ODAzeiIgcC1pZD0iMTIyNjAzIj48L3BhdGg+PC9zdmc+';
	d.SILICON = 'PHN2ZyBmaWxsLW9wYWNpdHk9IjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBjb2xvci1yZW5kZXJpbmc9ImF1dG8iIGNvbG9yLWludGVycG9sYXRpb249ImF1dG8iIHRleHQtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2U9ImJsYWNrIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiB3aWR0aD0iMjAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc2hhcGUtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2Utb3BhY2l0eT0iMSIgZmlsbD0iYmxhY2siIHN0cm9rZS1kYXNoYXJyYXk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHN0cm9rZS13aWR0aD0iMSIgdmlld0JveD0iMCAwIDIwLjAgMjAuMCIgaGVpZ2h0PSIyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmb250LWZhbWlseT0iJmFwb3M7RGlhbG9nJmFwb3M7IiBmb250LXN0eWxlPSJub3JtYWwiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIGZvbnQtc2l6ZT0iMTIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBpbWFnZS1yZW5kZXJpbmc9ImF1dG8iPjxkZWZzIGlkPSJnZW5lcmljRGVmcyIgIC8+PGcgID48ZyBmb250LXNpemU9IjE0IiBmaWxsPSJyZ2IoMjQwLDIwMCwxNjApIiB0ZXh0LXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiBpbWFnZS1yZW5kZXJpbmc9Im9wdGltaXplU3BlZWQiIGNvbG9yLXJlbmRlcmluZz0ib3B0aW1pemVRdWFsaXR5IiBmb250LWZhbWlseT0iJmFwb3M7THVjaWRhIEdyYW5kZSZhcG9zOyIgc3Ryb2tlPSJyZ2IoMjQwLDIwMCwxNjApIiBjb2xvci1pbnRlcnBvbGF0aW9uPSJsaW5lYXJSR0IiICAgID48cGF0aCBkPSJNNy4yODgxIDE1LjI1MjkgUTYuMjY5NSAxNS4yNTI5IDQuNjgzNiAxNC44MDg2IEw0LjY4MzYgMTMuMzg2NyBRNi4zOTI2IDE0LjE3OTcgNy40OTMyIDE0LjE3OTcgUTguMzQwOCAxNC4xNzk3IDguODU2OSAxMy43MzU0IFE5LjM3MyAxMy4yOTEgOS4zNzMgMTIuNTY2NCBROS4zNzMgMTEuOTcxNyA5LjAzNDcgMTEuNTU0NyBROC42OTYzIDExLjEzNzcgNy43ODcxIDEwLjYyNSBMNy4wODk4IDEwLjIyMTcgUTUuNzk3OSA5LjQ4MzQgNS4yNjgxIDguODMwNiBRNC43MzgzIDguMTc3NyA0LjczODMgNy4zMDk2IFE0LjczODMgNi4xNDA2IDUuNTg1OSA1LjM4NTMgUTYuNDMzNiA0LjYyOTkgNy43NDYxIDQuNjI5OSBROC45MTUgNC42Mjk5IDEwLjIxMzkgNS4wMTk1IEwxMC4yMTM5IDYuMzMyIFE4LjYxNDMgNS43MDMxIDcuODI4MSA1LjcwMzEgUTcuMDgzIDUuNzAzMSA2LjU5NzcgNi4wOTk2IFE2LjExMjMgNi40OTYxIDYuMTEyMyA3LjA5NzcgUTYuMTEyMyA3LjYwMzUgNi40Njc4IDcuOTkzMiBRNi44MjMyIDguMzgyOCA3Ljc2NjYgOC45MjI5IEw4LjQ5MTIgOS4zMzMgUTkuODAzNyAxMC4wNzgxIDEwLjMyMzIgMTAuNzQxMiBRMTAuODQyOCAxMS40MDQzIDEwLjg0MjggMTIuMzM0IFExMC44NDI4IDEzLjY1MzMgOS44Njg3IDE0LjQ1MzEgUTguODk0NSAxNS4yNTI5IDcuMjg4MSAxNS4yNTI5IFpNMTMuMzQ2NyAxNSBMMTMuMzQ2NyA3LjU3NjIgTDE0LjY5MzQgNy41NzYyIEwxNC42OTM0IDE1IFpNMTMuMzQ2NyA2LjIyOTUgTDEzLjM0NjcgNC44ODI4IEwxNC42OTM0IDQuODgyOCBMMTQuNjkzNCA2LjIyOTUgWiIgc3Ryb2tlPSJub25lIiAgICAvPjwvZyAgPjwvZz48L3N2Zz4=';
	d.SULFUR = 'PHN2ZyBmaWxsLW9wYWNpdHk9IjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBjb2xvci1yZW5kZXJpbmc9ImF1dG8iIGNvbG9yLWludGVycG9sYXRpb249ImF1dG8iIHRleHQtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2U9ImJsYWNrIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiB3aWR0aD0iMjAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc2hhcGUtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2Utb3BhY2l0eT0iMSIgZmlsbD0iYmxhY2siIHN0cm9rZS1kYXNoYXJyYXk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHN0cm9rZS13aWR0aD0iMSIgdmlld0JveD0iMCAwIDIwLjAgMjAuMCIgaGVpZ2h0PSIyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmb250LWZhbWlseT0iJmFwb3M7RGlhbG9nJmFwb3M7IiBmb250LXN0eWxlPSJub3JtYWwiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIGZvbnQtc2l6ZT0iMTIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBpbWFnZS1yZW5kZXJpbmc9ImF1dG8iPjxkZWZzIGlkPSJnZW5lcmljRGVmcyIgIC8+PGcgID48ZyBmb250LXNpemU9IjE0IiBmaWxsPSJyZ2IoMjA0LDEwMiwwKSIgdGV4dC1yZW5kZXJpbmc9Imdlb21ldHJpY1ByZWNpc2lvbiIgaW1hZ2UtcmVuZGVyaW5nPSJvcHRpbWl6ZVNwZWVkIiBjb2xvci1yZW5kZXJpbmc9Im9wdGltaXplUXVhbGl0eSIgZm9udC1mYW1pbHk9IiZhcG9zO0x1Y2lkYSBHcmFuZGUmYXBvczsiIHN0cm9rZT0icmdiKDIwNCwxMDIsMCkiIGNvbG9yLWludGVycG9sYXRpb249ImxpbmVhclJHQiIgICAgPjxwYXRoIGQ9Ik05LjI4ODEgMTUuMjUyOSBROC4yNjk1IDE1LjI1MjkgNi42ODM2IDE0LjgwODYgTDYuNjgzNiAxMy4zODY3IFE4LjM5MjYgMTQuMTc5NyA5LjQ5MzIgMTQuMTc5NyBRMTAuMzQwOCAxNC4xNzk3IDEwLjg1NjkgMTMuNzM1NCBRMTEuMzczIDEzLjI5MSAxMS4zNzMgMTIuNTY2NCBRMTEuMzczIDExLjk3MTcgMTEuMDM0NyAxMS41NTQ3IFExMC42OTYzIDExLjEzNzcgOS43ODcxIDEwLjYyNSBMOS4wODk4IDEwLjIyMTcgUTcuNzk3OSA5LjQ4MzQgNy4yNjgxIDguODMwNiBRNi43MzgzIDguMTc3NyA2LjczODMgNy4zMDk2IFE2LjczODMgNi4xNDA2IDcuNTg1OSA1LjM4NTMgUTguNDMzNiA0LjYyOTkgOS43NDYxIDQuNjI5OSBRMTAuOTE1IDQuNjI5OSAxMi4yMTM5IDUuMDE5NSBMMTIuMjEzOSA2LjMzMiBRMTAuNjE0MyA1LjcwMzEgOS44MjgxIDUuNzAzMSBROS4wODMgNS43MDMxIDguNTk3NyA2LjA5OTYgUTguMTEyMyA2LjQ5NjEgOC4xMTIzIDcuMDk3NyBROC4xMTIzIDcuNjAzNSA4LjQ2NzggNy45OTMyIFE4LjgyMzIgOC4zODI4IDkuNzY2NiA4LjkyMjkgTDEwLjQ5MTIgOS4zMzMgUTExLjgwMzcgMTAuMDc4MSAxMi4zMjMyIDEwLjc0MTIgUTEyLjg0MjggMTEuNDA0MyAxMi44NDI4IDEyLjMzNCBRMTIuODQyOCAxMy42NTMzIDExLjg2ODcgMTQuNDUzMSBRMTAuODk0NSAxNS4yNTI5IDkuMjg4MSAxNS4yNTI5IFoiIHN0cm9rZT0ibm9uZSIgICAgLz48L2cgID48L2c+PC9zdmc+';
	d.TEMPLATES = 'PHN2ZyB0PSIxNTg3NzE1NTE2MjA5IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjEyMzgzMCIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiPjxwYXRoIGQ9Ik04ODkuNiA0NDhhMTIwLjk2IDEyMC45NiAwIDAgMC01Ny42IDE1LjA3MlYxOTJoLTI3MS4wNzJBMTIwLjk2IDEyMC45NiAwIDAgMCA1NzYgMTM0LjRhMTI4IDEyOCAwIDAgMC0yNTYgMCAxMjAuOTYgMTIwLjk2IDAgMCAwIDE1LjA3MiA1Ny42SDY0djI3MS4wNzJBMTIwLjk2IDEyMC45NiAwIDAgMSAxMjEuNiA0NDhhMTI4IDEyOCAwIDAgMSAwIDI1NiAxMjAuOTYgMTIwLjk2IDAgMCAxLTU3LjYtMTUuMDcyVjk2MGgyNzEuMDcyQTEyMC45NiAxMjAuOTYgMCAwIDEgMzIwIDkwMi40YTEyOCAxMjggMCAwIDEgMjU2IDAgMTIwLjk2IDEyMC45NiAwIDAgMS0xNS4wNzIgNTcuNkg4MzJ2LTI3MS4wNzJhMTIwLjk2IDEyMC45NiAwIDAgMCA1Ny42IDE1LjA3MiAxMjggMTI4IDAgMCAwIDAtMjU2eiIgZmlsbD0iIiBwLWlkPSIxMjM4MzEiPjwvcGF0aD48L3N2Zz4=';
	d.TEXT = 'PHN2ZyB0PSIxNTg3NzE1NjMxOTQ2IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjEyNzYyNiIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiPjxwYXRoIGQ9Ik0zMjAgODk2YzY0IDAgOTYtNzQuODggOTYtMTI4VjE5MkgyNzAuNzJhOTYgOTYgMCAwIDAtOTQuMDggNzcuMTJMMTYwIDM1Mkg5NlYxMjhhNjQgNjQgMCAwIDEgNjQtNjRoNzA0YTY0IDY0IDAgMCAxIDY0IDY0djIyNGgtNjRsLTE2LjY0LTgyLjg4QTk2IDk2IDAgMCAwIDc1My4yOCAxOTJINjA4djU3NmMwIDUzLjEyIDMyIDEyOCA5NiAxMjh2NjRIMzIweiIgZmlsbD0iIzIzMUYyMCIgcC1pZD0iMTI3NjI3Ij48L3BhdGg+PC9zdmc+';
	d.TORSION = 'PHN2ZyB0PSIxNTg3NzE2MzYwMDYxIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjYgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjEzNzExMiIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiPjxwYXRoIGQ9Ik03NzAuMzI3MjczIDQ3MC4xMDkwOTFjLTYyLjgzNjM2NCAwLTEyMS4wMTgxODIgMjMuMjcyNzI3LTE2NS4yMzYzNjQgNjIuODM2MzY0TDQ4Ni40IDMyNS44MTgxODJjMzcuMjM2MzY0LTMwLjI1NDU0NSA2NS4xNjM2MzYtNzIuMTQ1NDU1IDY5LjgxODE4Mi0xMjMuMzQ1NDU1bDEzMi42NTQ1NDUgNC42NTQ1NDZjOS4zMDkwOTEgNTUuODU0NTQ1IDU4LjE4MTgxOCA5Ny43NDU0NTUgMTE2LjM2MzYzNyA5Ny43NDU0NTQgNjUuMTYzNjM2IDAgMTE4LjY5MDkwOS01My41MjcyNzMgMTE4LjY5MDkwOS0xMTguNjkwOTA5cy01My41MjcyNzMtMTE4LjY5MDkwOS0xMTguNjkwOTA5LTExOC42OTA5MDljLTU1Ljg1NDU0NSAwLTEwNC43MjcyNzMgMzkuNTYzNjM2LTExNi4zNjM2MzcgOTMuMDkwOTA5bC0xMzQuOTgxODE4LTQuNjU0NTQ1QzU0Mi4yNTQ1NDUgNjcuNDkwOTA5IDQ2Ny43ODE4MTggMCAzNzQuNjkwOTA5IDBjLTEwMC4wNzI3MjcgMC0xODEuNTI3MjczIDgxLjQ1NDU0NS0xODEuNTI3MjczIDE4MS41MjcyNzNzODEuNDU0NTQ1IDE4MS41MjcyNzMgMTgxLjUyNzI3MyAxODEuNTI3MjcyYzI1LjYgMCA0OC44NzI3MjctNC42NTQ1NDUgNjkuODE4MTgyLTEzLjk2MzYzNmwxMjUuNjcyNzI3IDIxOC43NjM2MzZjLTMyLjU4MTgxOCA0MS44OTA5MDktNTMuNTI3MjczIDk1LjQxODE4Mi01My41MjcyNzMgMTU1LjkyNzI3MyAwIDE2LjI5MDkwOSAyLjMyNzI3MyAzMi41ODE4MTggNC42NTQ1NDYgNDguODcyNzI3bC0xNjcuNTYzNjM2IDM3LjIzNjM2NGMtMTYuMjkwOTA5LTgxLjQ1NDU0NS04OC40MzYzNjQtMTQxLjk2MzYzNi0xNzQuNTQ1NDU1LTE0MS45NjM2MzYtMTAwLjA3MjcyNyAwLTE3OS4yIDc5LjEyNzI3My0xNzkuMiAxNzkuMkMwIDk0NC44NzI3MjcgNzkuMTI3MjczIDEwMjQgMTc5LjIgMTAyNGM5NS40MTgxODIgMCAxNzIuMjE4MTgyLTc0LjQ3MjcyNyAxNzkuMi0xNjcuNTYzNjM2bDE3OS4yLTM5LjU2MzYzN2MzNy4yMzYzNjQgOTMuMDkwOTA5IDEyOCAxNTguMjU0NTQ1IDIzNS4wNTQ1NDUgMTU4LjI1NDU0NiAxMzkuNjM2MzY0IDAgMjUzLjY3MjcyNy0xMTQuMDM2MzY0IDI1My42NzI3MjgtMjUxLjM0NTQ1NS0yLjMyNzI3My0xMzkuNjM2MzY0LTExNi4zNjM2MzYtMjUzLjY3MjcyNy0yNTYtMjUzLjY3MjcyN3oiIHAtaWQ9IjEzNzExMyI+PC9wYXRoPjwvc3ZnPg==';
	d.UNDO = 'PHN2ZyB0PSIxNTg3NzE2OTAwNTI3IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjEzNzg1OCIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiPjxwYXRoIGQ9Ik03NiA0NjMuN2wyOTQuOCAyOTQuOWMxOS41IDE5LjQgNTIuOCA1LjYgNTIuOC0yMS45VjU2MS41YzIwMi41LTguMiAzNDQuMSA1OS41IDUwMS42IDMzOC4zIDguNSAxNSAzMS41IDcuOSAzMC42LTkuMy0zMC41LTU1NC43LTQ1My01NzEuNC01MzIuMy01NjkuNnYtMTc0YzAtMjcuNS0zMy4yLTQxLjMtNTIuNy0yMS44TDc1LjkgNDIwYy0xMiAxMi4xLTEyIDMxLjYgMC4xIDQzLjd6IiBwLWlkPSIxMzc4NTkiPjwvcGF0aD48L3N2Zz4=';
	d.VARIABLE_ATTACHMENT_POINTS = 'PHN2ZyBmaWxsLW9wYWNpdHk9IjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBjb2xvci1yZW5kZXJpbmc9ImF1dG8iIGNvbG9yLWludGVycG9sYXRpb249ImF1dG8iIHRleHQtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2U9ImJsYWNrIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiB3aWR0aD0iMjAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc2hhcGUtcmVuZGVyaW5nPSJhdXRvIiBzdHJva2Utb3BhY2l0eT0iMSIgZmlsbD0iYmxhY2siIHN0cm9rZS1kYXNoYXJyYXk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHN0cm9rZS13aWR0aD0iMSIgdmlld0JveD0iMCAwIDIwLjAgMjAuMCIgaGVpZ2h0PSIyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmb250LWZhbWlseT0iJmFwb3M7RGlhbG9nJmFwb3M7IiBmb250LXN0eWxlPSJub3JtYWwiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIGZvbnQtc2l6ZT0iMTIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBpbWFnZS1yZW5kZXJpbmc9ImF1dG8iPjxkZWZzIGlkPSJnZW5lcmljRGVmcyIgIC8+PGcgID48ZyB0ZXh0LXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiBjb2xvci1yZW5kZXJpbmc9Im9wdGltaXplUXVhbGl0eSIgY29sb3ItaW50ZXJwb2xhdGlvbj0ibGluZWFyUkdCIiBpbWFnZS1yZW5kZXJpbmc9Im9wdGltaXplU3BlZWQiICAgID48cGF0aCBmaWxsPSJub25lIiBkPSJNNyA2IEwxMyAxMCBMMTMgMTYgTDcgMjAgTDEgMTYgTDEgMTAgWiIgICAgICAvPjxjaXJjbGUgZmlsbD0ibm9uZSIgcj0iMyIgY3g9IjciIGN5PSIxMyIgICAgICAvPjxsaW5lIHkyPSI3IiBmaWxsPSJub25lIiB4MT0iNyIgeDI9IjEzIiB5MT0iMTMiICAgICAgLz48cGF0aCBkPSJNMTQuMjE1MyA2IEwxNi4yOTgzIDIuNzk2NCBMMTQuMzA3NiAtMC41MDM5IEwxNS44ODUzIC0wLjUwMzkgTDE3LjIwOCAxLjY4NDYgTDE4LjY0MDYgLTAuNTAzOSBMMTkuNzM0OSAtMC41MDM5IEwxNy43Mzk3IDIuNTYzNSBMMTkuODA1MiA2IEwxOC4yMzE5IDYgTDE2LjgyMTMgMy42NzUzIEwxNS4zMDk2IDYgWiIgc3Ryb2tlPSJub25lIiAgICAvPjwvZyAgPjwvZz48L3N2Zz4=';
	d.ZOOM_IN = 'PHN2ZyB0PSIxNTg3NzE3MzMwMjUzIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjUgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjE0NTM3MCIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiPjxwYXRoIGQ9Ik05ODEuODg2NzcyIDg2Mi4yODU4MiA3NDEuODYxNTYyIDY1OC4xMzc3MjhjLTI0LjgyNTgyNy0yMi4zMjQyNDUtNTEuMzYxNTk1LTMyLjU4Mzg5Ny03Mi43OTkyMDMtMzEuNjAyMjY0QzcyNS43NDM3NzQgNTYwLjE5NjA0MyA3NTkuOTc0MjgyIDQ3NC4wOTcyOSA3NTkuOTc0MjgyIDM3OS45ODcxNDEgNzU5Ljk3NDI4MiAxNzAuMTM5MjQyIDU4OS44MzUwNCAwIDM3OS45ODcxNDEgMCAxNzAuMTM5MjQyIDAgMCAxNzAuMTM5MjQyIDAgMzc5Ljk4NzE0MWMwIDIwOS44NDc4OTkgMTcwLjEzOTI0MiAzNzkuOTg3MTQxIDM3OS45ODcxNDEgMzc5Ljk4NzE0MSA5NC4xMTAxNDkgMCAxODAuMjA4OTAyLTM0LjIzMDUwOCAyNDYuNTc5OTg5LTkwLjg4MDI1OC0wLjk4MTYzMyAyMS40Mzc2MDggOS4yNDYzNTQgNDcuOTczMzc3IDMxLjYwMjI2NCA3Mi43OTkyMDNsMjA0LjE0ODA5MiAyNDAuMDI1MjExYzM0Ljk1ODgxNyAzOC44MjIwMiA5Mi4wNTE4ODUgNDIuMTE1MjQxIDEyNi44ODQwNCA3LjI4MzA4N1MxMDIwLjc0MDQ1OCA4OTcuMjQ0NjM3IDk4MS44ODY3NzIgODYyLjI4NTgyek0zNzkuOTg3MTQxIDYzMy4zMTE5MDJjLTEzOS44OTg1OTkgMC0yNTMuMzI0NzYxLTExMy40MjYxNjItMjUzLjMyNDc2MS0yNTMuMzI0NzYxUzI0MC4wODg1NDIgMTI2LjY2MjM4IDM3OS45ODcxNDEgMTI2LjY2MjM4czI1My4zMjQ3NjEgMTEzLjQyNjE2MiAyNTMuMzI0NzYxIDI1My4zMjQ3NjFTNTE5Ljg4NTc0IDYzMy4zMTE5MDIgMzc5Ljk4NzE0MSA2MzMuMzExOTAyek00NDMuMzE4MzMxIDE4OS45OTM1NzEgMzE2LjY1NTk1MSAxODkuOTkzNTcxIDMxNi42NTU5NTEgMzE2LjY1NTk1MSAxODkuOTkzNTcxIDMxNi42NTU5NTEgMTg5Ljk5MzU3MSA0NDMuMzE4MzMxIDMxNi42NTU5NTEgNDQzLjMxODMzMSAzMTYuNjU1OTUxIDU2OS45ODA3MTIgNDQzLjMxODMzMSA1NjkuOTgwNzEyIDQ0My4zMTgzMzEgNDQzLjMxODMzMSA1NjkuOTgwNzEyIDQ0My4zMTgzMzEgNTY5Ljk4MDcxMiAzMTYuNjU1OTUxIDQ0My4zMTgzMzEgMzE2LjY1NTk1MXoiIHAtaWQ9IjE0NTM3MSI+PC9wYXRoPjwvc3ZnPg==';
	d.ZOOM_OUT = 'PHN2ZyB0PSIxNTg3NzE3Mjc5MDcwIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjUgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjE0MjY5NSIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiPjxwYXRoIGQ9Ik05ODEuODg2NzcyIDg2Mi4yODU4MiA3NDEuODYxNTYyIDY1OC4xMzc3MjhjLTI0LjgyNTgyNy0yMi4zMjQyNDUtNTEuMzYxNTk1LTMyLjU4Mzg5Ny03Mi43OTkyMDMtMzEuNjAyMjY0QzcyNS43NDM3NzQgNTYwLjE5NjA0MyA3NTkuOTc0MjgyIDQ3NC4wOTcyOSA3NTkuOTc0MjgyIDM3OS45ODcxNDEgNzU5Ljk3NDI4MiAxNzAuMTM5MjQyIDU4OS44MzUwNCAwIDM3OS45ODcxNDEgMCAxNzAuMTM5MjQyIDAgMCAxNzAuMTM5MjQyIDAgMzc5Ljk4NzE0MWMwIDIwOS44NDc4OTkgMTcwLjEzOTI0MiAzNzkuOTg3MTQxIDM3OS45ODcxNDEgMzc5Ljk4NzE0MSA5NC4xMTAxNDkgMCAxODAuMjA4OTAyLTM0LjIzMDUwOCAyNDYuNTc5OTg5LTkwLjg4MDI1OC0wLjk4MTYzMyAyMS40Mzc2MDggOS4yNDYzNTQgNDcuOTczMzc3IDMxLjYwMjI2NCA3Mi43OTkyMDNsMjA0LjE0ODA5MiAyNDAuMDI1MjExYzM0Ljk1ODgxNyAzOC44MjIwMiA5Mi4wNTE4ODUgNDIuMTE1MjQxIDEyNi44ODQwNCA3LjI4MzA4N1MxMDIwLjc0MDQ1OCA4OTcuMjQ0NjM3IDk4MS44ODY3NzIgODYyLjI4NTgyek0zNzkuOTg3MTQxIDYzMy4zMTE5MDJjLTEzOS44OTg1OTkgMC0yNTMuMzI0NzYxLTExMy40MjYxNjItMjUzLjMyNDc2MS0yNTMuMzI0NzYxUzI0MC4wODg1NDIgMTI2LjY2MjM4IDM3OS45ODcxNDEgMTI2LjY2MjM4czI1My4zMjQ3NjEgMTEzLjQyNjE2MiAyNTMuMzI0NzYxIDI1My4zMjQ3NjFTNTE5Ljg4NTc0IDYzMy4zMTE5MDIgMzc5Ljk4NzE0MSA2MzMuMzExOTAyek0xODkuOTkzNTcxIDMxNi42NTU5NTEgNTY5Ljk4MDcxMiAzMTYuNjU1OTUxIDU2OS45ODA3MTIgNDQzLjMxODMzMSAxODkuOTkzNTcxIDQ0My4zMTgzMzF6IiBwLWlkPSIxNDI2OTYiPjwvcGF0aD48L3N2Zz4=';

	return d;

})(ChemDoodle.extensions);

ChemDoodle.uis.gui.templateDepot = (function(JSON, localStorage, undefined) {
	'use strict';
	let d = [];
	
	let group = {name:'Amino Acids', templates:[]};
	group.templates.push({
		name: 'Alanine <b>Ala</b> <i>A</i>',
		data: {"a":[{"x":195.34,"y":269},{"x":195.34,"y":289,"l":"N"},{"x":178.018,"y":259},{"x":212.66,"y":259},{"x":212.66,"y":239,"l":"O"},{"x":229.982,"y":269,"l":"O"}],"b":[{"b":0,"e":2},{"b":0,"e":3},{"b":0,"e":1},{"b":3,"e":5},{"b":3,"e":4,"o":2}]}
	});
	group.templates.push({
		name: 'Alanine <i>chain</i>',
		data: {"a":[{"x":-29.9995,"y":0,"l":"N"},{"x":-9.9989,"y":0},{"x":9.9989,"y":0},{"x":-9.9989,"y":20.0006},{"x":29.9995,"y":0,"l":"O"},{"x":9.9989,"y":-20.0006,"l":"O"}],"b":[{"b":0,"e":1},{"b":1,"e":2},{"b":1,"e":3},{"b":2,"e":4},{"b":2,"e":5,"o":2}]}
	});
	group.templates.push({
		name: 'Alanine <i>side chain</i>',
		data: {"a":[{"x":-10,"y":0},{"x":10,"y":0}],"b":[{"b":0,"e":1}]}
	});
	group.templates.push({
		name: 'Arginine <b>Arg</b> <i>R</i>',
		data: {"a":[{"x":134.718,"y":269,"l":"N"},{"x":152.04,"y":259},{"x":169.36,"y":269,"l":"N"},{"x":152.04,"y":239,"l":"N"},{"x":186.68,"y":259},{"x":204,"y":269},{"x":221.322,"y":259},{"x":238.642,"y":269},{"x":255.962,"y":259},{"x":238.642,"y":289,"l":"N"},{"x":273.282,"y":269,"l":"O"},{"x":255.962,"y":239,"l":"O"}],"b":[{"b":0,"e":1},{"b":1,"e":2},{"b":1,"e":3,"o":2},{"b":2,"e":4},{"b":4,"e":5},{"b":5,"e":6},{"b":7,"e":6},{"b":7,"e":8},{"b":7,"e":9},{"b":8,"e":10},{"b":8,"e":11,"o":2}]}
	});
	group.templates.push({
		name: 'Arginine <i>chain</i>',
		data: {"a":[{"x":-30.0001,"y":-49.9998,"l":"N"},{"x":-9.9991,"y":-49.9998},{"x":9.9991,"y":-49.9998},{"x":-9.9991,"y":-29.9988},{"x":9.9991,"y":-70.0007,"l":"O"},{"x":30.0001,"y":-49.9998,"l":"O"},{"x":-9.9991,"y":-10.0005},{"x":-9.9991,"y":10.0005},{"x":-9.9991,"y":29.9987,"l":"N"},{"x":-9.9991,"y":49.9997},{"x":-9.9991,"y":70.0007,"l":"N"},{"x":9.9991,"y":49.9997,"l":"N"}],"b":[{"b":0,"e":1},{"b":1,"e":2},{"b":1,"e":3},{"b":2,"e":5},{"b":2,"e":4,"o":2},{"b":3,"e":6},{"b":6,"e":7},{"b":7,"e":8},{"b":8,"e":9},{"b":9,"e":10},{"b":9,"e":11,"o":2}]}
	});
	group.templates.push({
		name: 'Arginine <i>side chain</i>',
		data: {"a":[{"x":-59.9973,"y":9.9986},{"x":-39.9973,"y":9.9986},{"x":-20,"y":9.9986},{"x":-0,"y":9.9986},{"x":19.9972,"y":9.9986,"l":"N"},{"x":39.9973,"y":9.9986},{"x":39.9973,"y":-9.9986,"l":"N"},{"x":59.9973,"y":9.9986,"l":"N"}],"b":[{"b":0,"e":1},{"b":1,"e":2},{"b":2,"e":3},{"b":3,"e":4},{"b":4,"e":5},{"b":5,"e":7},{"b":5,"e":6,"o":2}]}
	});
	group.templates.push({
		name: 'Asparagine <b>Asn</b> <i>N</i>',
		data: {"a":[{"x":178.02,"y":269},{"x":178.02,"y":289,"l":"N"},{"x":160.698,"y":259,"l":"O"},{"x":195.34,"y":259},{"x":212.66,"y":269},{"x":229.98,"y":259},{"x":212.66,"y":289,"l":"N"},{"x":247.302,"y":269,"l":"O"},{"x":229.98,"y":239,"l":"O"}],"b":[{"b":0,"e":3},{"b":0,"e":2,"o":2},{"b":0,"e":1},{"b":4,"e":3},{"b":4,"e":5},{"b":4,"e":6},{"b":5,"e":7},{"b":5,"e":8,"o":2}]}
	});
	group.templates.push({
		name: 'Asparagine <i>chain</i>',
		data: {"a":[{"x":-30.0002,"y":-19.9996,"l":"N"},{"x":-9.9991,"y":-19.9996},{"x":-9.9991,"y":0.0014},{"x":9.9991,"y":-19.9996},{"x":-9.9991,"y":19.9996},{"x":9.9991,"y":-40.0007,"l":"O"},{"x":30.0002,"y":-19.9997,"l":"O"},{"x":-9.9991,"y":40.0007,"l":"N"},{"x":9.9991,"y":19.9996,"l":"O"}],"b":[{"b":0,"e":1},{"b":1,"e":3},{"b":1,"e":2},{"b":3,"e":6},{"b":3,"e":5,"o":2},{"b":2,"e":4},{"b":4,"e":7},{"b":4,"e":8,"o":2}]}
	});
	group.templates.push({
		name: 'Asparagine <i>side chain</i>',
		data: {"a":[{"x":-29.9986,"y":9.9986},{"x":-9.9986,"y":9.9986},{"x":9.9986,"y":9.9986},{"x":29.9986,"y":9.9986,"l":"N"},{"x":9.9986,"y":-9.9986,"l":"O"}],"b":[{"b":0,"e":1},{"b":1,"e":2},{"b":2,"e":3},{"b":2,"e":4,"o":2}]}
	});
	group.templates.push({
		name: 'Aspartic Acid <b>Asp</b> <i>D</i>',
		data: {"a":[{"x":178.02,"y":269},{"x":178.02,"y":289,"l":"O"},{"x":195.34,"y":259},{"x":160.698,"y":259,"l":"O"},{"x":212.66,"y":269},{"x":229.98,"y":259},{"x":212.66,"y":289,"l":"N"},{"x":229.98,"y":239,"l":"O"},{"x":247.302,"y":269,"l":"O"}],"b":[{"b":0,"e":2},{"b":0,"e":3,"o":2},{"b":0,"e":1},{"b":4,"e":2},{"b":4,"e":5},{"b":4,"e":6},{"b":5,"e":8},{"b":5,"e":7,"o":2}]}
	});
	group.templates.push({
		name: 'Aspartic Acid <i>chain</i>',
		data: {"a":[{"x":-30.0002,"y":-19.9997,"l":"N"},{"x":-9.9991,"y":-19.9997},{"x":-9.9991,"y":0.0014},{"x":9.9991,"y":-19.9997},{"x":-9.9991,"y":19.9996},{"x":30.0002,"y":-19.9997,"l":"O"},{"x":9.9991,"y":-40.0007,"l":"O"},{"x":-9.9991,"y":40.0007,"l":"O"},{"x":9.9991,"y":19.9996,"l":"O"}],"b":[{"b":0,"e":1},{"b":1,"e":3},{"b":1,"e":2},{"b":3,"e":5},{"b":3,"e":6,"o":2},{"b":2,"e":4},{"b":4,"e":7},{"b":4,"e":8,"o":2}]}
	});
	group.templates.push({
		name: 'Aspartic Acid <i>side chain</i>',
		data: {"a":[{"x":-29.9986,"y":9.9986},{"x":-9.9986,"y":9.9986},{"x":9.9986,"y":9.9986},{"x":9.9986,"y":-9.9986,"l":"O"},{"x":29.9986,"y":9.9986,"l":"O"}],"b":[{"b":0,"e":1},{"b":1,"e":2},{"b":2,"e":4},{"b":2,"e":3,"o":2}]}
	});
	group.templates.push({
		name: 'Cysteine <b>Cys</b> <i>C</i>',
		data: {"a":[{"x":169.358,"y":269,"l":"S"},{"x":186.678,"y":259},{"x":203.998,"y":269},{"x":221.32,"y":259},{"x":203.998,"y":289,"l":"N"},{"x":221.32,"y":239,"l":"O"},{"x":238.642,"y":269,"l":"O"}],"b":[{"b":0,"e":1},{"b":2,"e":1},{"b":2,"e":3},{"b":2,"e":4},{"b":3,"e":6},{"b":3,"e":5,"o":2}]}
	});
	group.templates.push({
		name: 'Cysteine <i>chain</i>',
		data: {"a":[{"x":-30,"y":-9.9991,"l":"N"},{"x":-9.9991,"y":-9.9991},{"x":-9.9991,"y":10.0019},{"x":9.9991,"y":-9.9991},{"x":-9.9991,"y":30,"l":"S"},{"x":30,"y":-9.9991,"l":"O"},{"x":9.9991,"y":-30,"l":"O"}],"b":[{"b":0,"e":1},{"b":1,"e":3},{"b":1,"e":2},{"b":3,"e":5},{"b":3,"e":6,"o":2},{"b":2,"e":4}]}
	});
	group.templates.push({
		name: 'Cysteine <i>side chain</i>',
		data: {"a":[{"x":-19.9986,"y":0},{"x":0.0014,"y":0},{"x":19.9986,"y":0,"l":"S"}],"b":[{"b":0,"e":1},{"b":1,"e":2}]}
	});
	group.templates.push({
		name: 'Glutamic Acid <b>Glu</b> <i>E</i>',
		data: {"a":[{"x":152.038,"y":269,"l":"O"},{"x":169.358,"y":259},{"x":186.68,"y":269},{"x":169.358,"y":239,"l":"O"},{"x":204,"y":259},{"x":221.32,"y":269},{"x":238.642,"y":259},{"x":221.32,"y":289,"l":"N"},{"x":255.962,"y":269,"l":"O"},{"x":238.642,"y":239,"l":"O"}],"b":[{"b":0,"e":1},{"b":1,"e":2},{"b":1,"e":3,"o":2},{"b":2,"e":4},{"b":5,"e":4},{"b":5,"e":6},{"b":5,"e":7},{"b":6,"e":8},{"b":6,"e":9,"o":2}]}
	});
	group.templates.push({
		name: 'Glutamic Acid <i>chain</i>',
		data: {"a":[{"x":-30.0005,"y":-29.9991,"l":"N"},{"x":-9.9992,"y":-29.9991},{"x":-9.9992,"y":-9.9978},{"x":9.9993,"y":-29.9991},{"x":-9.9992,"y":10.0006},{"x":9.9992,"y":-50.0003,"l":"O"},{"x":30.0005,"y":-29.9991,"l":"O"},{"x":-9.9992,"y":30.0018},{"x":-9.9992,"y":50.0003,"l":"O"},{"x":9.9992,"y":30.0018,"l":"O"}],"b":[{"b":0,"e":1},{"b":1,"e":3},{"b":1,"e":2},{"b":3,"e":6},{"b":3,"e":5,"o":2},{"b":2,"e":4},{"b":4,"e":7},{"b":7,"e":8},{"b":7,"e":9,"o":2}]}
	});
	group.templates.push({
		name: 'Glutamic Acid <i>side chain</i>',
		data: {"a":[{"x":-40.0028,"y":10},{"x":-20,"y":10},{"x":0,"y":10},{"x":20.0028,"y":10},{"x":40.0028,"y":10,"l":"O"},{"x":20.0028,"y":-10,"l":"O"}],"b":[{"b":0,"e":1},{"b":1,"e":2},{"b":2,"e":3},{"b":3,"e":4},{"b":3,"e":5,"o":2}]}
	});
	group.templates.push({
		name: 'Glutamine <b>Gln</b> <i>Q</i>',
		data: {"a":[{"x":152.038,"y":269,"l":"N"},{"x":169.358,"y":259},{"x":186.68,"y":269},{"x":169.358,"y":239,"l":"O"},{"x":204,"y":259},{"x":221.32,"y":269},{"x":238.642,"y":259},{"x":221.32,"y":289,"l":"N"},{"x":238.642,"y":239,"l":"O"},{"x":255.962,"y":269,"l":"O"}],"b":[{"b":0,"e":1},{"b":1,"e":2},{"b":1,"e":3,"o":2},{"b":2,"e":4},{"b":5,"e":4},{"b":5,"e":6},{"b":5,"e":7},{"b":6,"e":9},{"b":6,"e":8,"o":2}]}
	});
	group.templates.push({
		name: 'Glutamine <i>chain</i>',
		data: {"a":[{"x":-30.0005,"y":-29.9991,"l":"N"},{"x":-9.9992,"y":-29.9991},{"x":9.9992,"y":-29.9991},{"x":-9.9992,"y":-9.9979},{"x":9.9992,"y":-50.0003,"l":"O"},{"x":30.0005,"y":-29.9991,"l":"O"},{"x":-9.9992,"y":10.0006},{"x":-9.9992,"y":30.0018},{"x":-9.9992,"y":50.0003,"l":"N"},{"x":9.9992,"y":30.0018,"l":"O"}],"b":[{"b":0,"e":1},{"b":1,"e":2},{"b":1,"e":3},{"b":2,"e":5},{"b":2,"e":4,"o":2},{"b":3,"e":6},{"b":6,"e":7},{"b":7,"e":8},{"b":7,"e":9,"o":2}]}
	});
	group.templates.push({
		name: 'Glutamine <i>side chain</i>',
		data: {"a":[{"x":-40.0028,"y":10},{"x":-20,"y":10},{"x":0,"y":10},{"x":20.0028,"y":10},{"x":40.0027,"y":10,"l":"N"},{"x":20.0028,"y":-10,"l":"O"}],"b":[{"b":0,"e":1},{"b":1,"e":2},{"b":2,"e":3},{"b":3,"e":4},{"b":3,"e":5,"o":2}]}
	});
	group.templates.push({
		name: 'Glycine <b>Gly</b> <i>G</i>',
		data: {"a":[{"x":186.678,"y":269},{"x":204,"y":259},{"x":186.678,"y":289,"l":"N"},{"x":221.322,"y":269,"l":"O"},{"x":204,"y":239,"l":"O"}],"b":[{"b":0,"e":1},{"b":0,"e":2},{"b":1,"e":3},{"b":1,"e":4,"o":2}]}
	});
	group.templates.push({
		name: 'Glycine <i>chain</i>',
		data: {"a":[{"x":-29.9995,"y":0,"l":"N"},{"x":-9.9989,"y":0},{"x":9.9989,"y":0},{"x":-9.9989,"y":20.0005,"l":"H"},{"x":29.9995,"y":0,"l":"O"},{"x":9.9989,"y":-20.0005,"l":"O"}],"b":[{"b":0,"e":1},{"b":1,"e":2},{"b":1,"e":3},{"b":2,"e":4},{"b":2,"e":5,"o":2}]}
	});
	group.templates.push({
		name: 'Glycine <i>side chain</i>',
		data: {"a":[{"x":-10,"y":0},{"x":10,"y":0,"l":"H"}],"b":[{"b":0,"e":1}]}
	});
	group.templates.push({
		name: 'Histidine <b>His</b> <i>H</i>',
		data: {"a":[{"x":185.186,"y":266.976},{"x":166.914,"y":258.84,"l":"N"},{"x":183.094,"y":286.866},{"x":202.506,"y":256.976},{"x":153.532,"y":273.704},{"x":163.532,"y":291.024,"l":"N"},{"x":219.826,"y":266.976},{"x":219.826,"y":286.976,"l":"N"},{"x":237.146,"y":256.976},{"x":254.468,"y":266.976,"l":"O"},{"x":237.146,"y":236.976,"l":"O"}],"b":[{"b":0,"e":3},{"b":0,"e":2,"o":2},{"b":0,"e":1},{"b":6,"e":3},{"b":2,"e":5},{"b":4,"e":1,"o":2},{"b":5,"e":4},{"b":6,"e":8},{"b":6,"e":7},{"b":8,"e":9},{"b":8,"e":10,"o":2}]}
	});
	group.templates.push({
		name: 'Histidine <i>chain</i>',
		data: {"a":[{"x":-30.009,"y":-25.4208,"l":"N"},{"x":-10.0021,"y":-25.4208},{"x":10.0021,"y":-25.4208},{"x":-10.0021,"y":-5.4138},{"x":30.009,"y":-25.4208,"l":"O"},{"x":10.0021,"y":-45.4277,"l":"O"},{"x":-10.0021,"y":14.5903},{"x":6.1209,"y":26.4104},{"x":-26.1636,"y":26.4104,"l":"N"},{"x":0.0179,"y":45.4277,"l":"N"},{"x":-19.9532,"y":45.4277}],"b":[{"b":0,"e":1},{"b":1,"e":2},{"b":1,"e":3},{"b":2,"e":4},{"b":2,"e":5,"o":2},{"b":3,"e":6},{"b":6,"e":8},{"b":8,"e":10,"o":2},{"b":10,"e":9},{"b":9,"e":7},{"b":6,"e":7,"o":2}]}
	});
	group.templates.push({
		name: 'Histidine <i>side chain</i>',
		data: {"a":[{"x":-35.4168,"y":-0.0193},{"x":-15.4141,"y":-0.0193},{"x":4.5859,"y":-0.0193},{"x":16.4035,"y":16.1389,"l":"N"},{"x":16.4035,"y":-16.1389},{"x":35.4168,"y":9.9297},{"x":35.4168,"y":-10.0372,"l":"N"}],"b":[{"b":0,"e":1},{"b":1,"e":2},{"b":2,"e":3},{"b":3,"e":5,"o":2},{"b":5,"e":6},{"b":6,"e":4},{"b":2,"e":4,"o":2}]}
	});
	group.templates.push({
		name: 'Isoleucine <b>Ile</b> <i>I</i>',
		data: {"a":[{"x":178.02,"y":269},{"x":160.698,"y":259},{"x":195.34,"y":259},{"x":212.66,"y":269},{"x":195.34,"y":239},{"x":212.66,"y":289,"l":"N"},{"x":229.98,"y":259},{"x":247.302,"y":269,"l":"O"},{"x":229.98,"y":239,"l":"O"}],"b":[{"b":0,"e":2},{"b":0,"e":1},{"b":2,"e":3},{"b":2,"e":4},{"b":3,"e":6},{"b":3,"e":5},{"b":6,"e":7},{"b":6,"e":8,"o":2}]}
	});
	group.templates.push({
		name: 'Isoleucine <i>chain</i>',
		data: {"a":[{"x":-30.0002,"y":-19.9997,"l":"N"},{"x":-9.9991,"y":-19.9997},{"x":-9.9991,"y":0.0014},{"x":9.9991,"y":-19.9997},{"x":9.9991,"y":0.0014},{"x":-9.9991,"y":19.9997},{"x":9.9991,"y":-40.0007,"l":"O"},{"x":30.0002,"y":-19.9997,"l":"O"},{"x":-9.9991,"y":40.0007}],"b":[{"b":0,"e":1},{"b":1,"e":3},{"b":1,"e":2},{"b":3,"e":7},{"b":3,"e":6,"o":2},{"b":2,"e":4},{"b":2,"e":5},{"b":5,"e":8}]}
	});
	group.templates.push({
		name: 'Isoleucine <i>side chain</i>',
		data: {"a":[{"x":-27.0711,"y":2.5882},{"x":-7.0711,"y":2.5882},{"x":7.0711,"y":16.7303},{"x":-1.8947,"y":-16.7303,"l":"H"},{"x":7.0711,"y":-11.554},{"x":27.0711,"y":16.7303}],"b":[{"b":0,"e":1},{"b":1,"e":4},{"b":1,"e":2},{"b":2,"e":5},{"b":1,"e":3}]}
	});
	group.templates.push({
		name: 'Leucine <b>Leu</b> <i>L</i>',
		data: {"a":[{"x":178.02,"y":269},{"x":178.02,"y":289},{"x":160.698,"y":259},{"x":195.34,"y":259},{"x":212.66,"y":269},{"x":212.66,"y":289,"l":"N"},{"x":229.98,"y":259},{"x":247.302,"y":269,"l":"O"},{"x":229.98,"y":239,"l":"O"}],"b":[{"b":0,"e":3},{"b":0,"e":2},{"b":0,"e":1},{"b":4,"e":3},{"b":4,"e":6},{"b":4,"e":5},{"b":6,"e":7},{"b":6,"e":8,"o":2}]}
	});
	group.templates.push({
		name: 'Leucine <i>chain</i>',
		data: {"a":[{"x":-30.0002,"y":-19.9997,"l":"N"},{"x":-9.9991,"y":-19.9997},{"x":-9.9991,"y":0.0013},{"x":9.9991,"y":-19.9997},{"x":-9.9991,"y":19.9996},{"x":9.9991,"y":-40.0007,"l":"O"},{"x":30.0002,"y":-19.9997,"l":"O"},{"x":-9.9992,"y":40.0007},{"x":9.9991,"y":19.9996}],"b":[{"b":0,"e":1},{"b":1,"e":3},{"b":1,"e":2},{"b":3,"e":6},{"b":3,"e":5,"o":2},{"b":2,"e":4},{"b":4,"e":8},{"b":4,"e":7}]}
	});
	group.templates.push({
		name: 'Leucine <i>side chain</i>',
		data: {"a":[{"x":-29.9986,"y":9.9986},{"x":-9.9986,"y":9.9986},{"x":9.9986,"y":9.9986},{"x":29.9986,"y":9.9986},{"x":9.9986,"y":-9.9986}],"b":[{"b":0,"e":1},{"b":1,"e":2},{"b":2,"e":4},{"b":2,"e":3}]}
	});
	group.templates.push({
		name: 'Lysine <b>Lys</b> <i>K</i>',
		data: {"a":[{"x":160.698,"y":269},{"x":143.378,"y":259,"l":"N"},{"x":178.02,"y":259},{"x":195.34,"y":269},{"x":212.66,"y":259},{"x":229.98,"y":269},{"x":247.302,"y":259},{"x":229.98,"y":289,"l":"N"},{"x":264.622,"y":269,"l":"O"},{"x":247.302,"y":239,"l":"O"}],"b":[{"b":0,"e":2},{"b":0,"e":1},{"b":2,"e":3},{"b":3,"e":4},{"b":5,"e":4},{"b":5,"e":6},{"b":5,"e":7},{"b":6,"e":8},{"b":6,"e":9,"o":2}]}
	});
	group.templates.push({
		name: 'Lysine <i>chain</i>',
		data: {"a":[{"x":-30,"y":-39.9991,"l":"N"},{"x":-9.9991,"y":-39.9991},{"x":-9.9991,"y":-19.9982},{"x":9.9991,"y":-39.9991},{"x":-9.9991,"y":-0},{"x":30,"y":-39.9991,"l":"O"},{"x":9.9991,"y":-60,"l":"O"},{"x":-9.9991,"y":20.0009},{"x":-9.9991,"y":39.9991},{"x":-9.9991,"y":60.0001,"l":"N"}],"b":[{"b":0,"e":1},{"b":1,"e":3},{"b":1,"e":2},{"b":3,"e":5},{"b":3,"e":6,"o":2},{"b":2,"e":4},{"b":4,"e":7},{"b":7,"e":8},{"b":8,"e":9}]}
	});
	group.templates.push({
		name: 'Lysine <i>side chain</i>',
		data: {"a":[{"x":-49.9973,"y":0},{"x":-29.9973,"y":0},{"x":-10,"y":0},{"x":10,"y":0},{"x":29.9973,"y":0},{"x":49.9973,"y":0,"l":"N"}],"b":[{"b":0,"e":1},{"b":1,"e":2},{"b":2,"e":3},{"b":3,"e":4},{"b":4,"e":5}]}
	});
	group.templates.push({
		name: 'Methionine <b>Met</b> <i>M</i>',
		data: {"a":[{"x":169.36,"y":259,"l":"S"},{"x":152.038,"y":269},{"x":186.68,"y":269},{"x":204,"y":259},{"x":221.32,"y":269},{"x":221.32,"y":289,"l":"N"},{"x":238.642,"y":259},{"x":255.962,"y":269,"l":"O"},{"x":238.642,"y":239,"l":"O"}],"b":[{"b":0,"e":1},{"b":0,"e":2},{"b":2,"e":3},{"b":4,"e":3},{"b":4,"e":6},{"b":4,"e":5},{"b":6,"e":7},{"b":6,"e":8,"o":2}]}
	});
	group.templates.push({
		name: 'Methionine <i>chain</i>',
		data: {"a":[{"x":-30.0002,"y":-29.9989,"l":"N"},{"x":-9.9992,"y":-29.9989},{"x":9.9991,"y":-29.9989},{"x":-9.9991,"y":-9.9978},{"x":9.9991,"y":-49.9999,"l":"O"},{"x":30.0002,"y":-29.9989,"l":"O"},{"x":-9.9991,"y":10.0004},{"x":-9.9991,"y":30.0015,"l":"S"},{"x":-9.9992,"y":49.9998}],"b":[{"b":0,"e":1},{"b":1,"e":2},{"b":1,"e":3},{"b":2,"e":5},{"b":2,"e":4,"o":2},{"b":3,"e":6},{"b":6,"e":7},{"b":7,"e":8}]}
	});
	group.templates.push({
		name: 'Methionine <i>side chain</i>',
		data: {"a":[{"x":-39.9972,"y":0},{"x":-19.9972,"y":0},{"x":0,"y":0},{"x":20,"y":0,"l":"S"},{"x":39.9972,"y":0}],"b":[{"b":0,"e":1},{"b":1,"e":2},{"b":2,"e":3},{"b":3,"e":4}]}
	});
	group.templates.push({
		name: 'Phenylalanine <b>Phe</b> <i>F</i>',
		data: {"a":[{"x":186.678,"y":264},{"x":169.358,"y":254},{"x":186.678,"y":284},{"x":204,"y":254},{"x":152.04,"y":264},{"x":169.358,"y":294},{"x":221.322,"y":264},{"x":152.04,"y":284},{"x":238.64,"y":254},{"x":221.322,"y":284,"l":"N"},{"x":255.96,"y":264,"l":"O"},{"x":238.64,"y":234,"l":"O"}],"b":[{"b":0,"e":2,"o":2},{"b":0,"e":1},{"b":0,"e":3},{"b":2,"e":5},{"b":4,"e":1,"o":2},{"b":6,"e":3},{"b":5,"e":7,"o":2},{"b":7,"e":4},{"b":6,"e":8},{"b":6,"e":9},{"b":8,"e":10},{"b":8,"e":11,"o":2}]}
	});
	group.templates.push({
		name: 'Phenylalanine <i>chain</i>',
		data: {"a":[{"x":-29.9902,"y":-30.0426,"l":"N"},{"x":-9.9958,"y":-30.0426},{"x":-9.9958,"y":-10.0482},{"x":9.9958,"y":-30.0426},{"x":-9.9958,"y":9.9435},{"x":29.9902,"y":-30.0426,"l":"O"},{"x":9.9958,"y":-50.037,"l":"O"},{"x":-27.3098,"y":19.993},{"x":7.2823,"y":19.993},{"x":-27.3098,"y":40.0232},{"x":7.2823,"y":40.0232},{"x":-9.9958,"y":50.037}],"b":[{"b":0,"e":1},{"b":1,"e":3},{"b":1,"e":2},{"b":3,"e":5},{"b":3,"e":6,"o":2},{"b":2,"e":4},{"b":4,"e":7,"o":2},{"b":7,"e":9},{"b":9,"e":11,"o":2},{"b":11,"e":10},{"b":10,"e":8,"o":2},{"b":4,"e":8}]}
	});
	group.templates.push({
		name: 'Phenylalanine <i>side chain</i>',
		data: {"a":[{"x":-40.0373,"y":-0.0179},{"x":-20.0442,"y":-0.0179},{"x":-0.0537,"y":-0.0179},{"x":9.9952,"y":17.295},{"x":9.9952,"y":-17.295},{"x":30.0242,"y":17.295},{"x":30.0242,"y":-17.295},{"x":40.0373,"y":-0.0179}],"b":[{"b":0,"e":1},{"b":1,"e":2},{"b":2,"e":3,"o":2},{"b":3,"e":5},{"b":5,"e":7,"o":2},{"b":7,"e":6},{"b":6,"e":4,"o":2},{"b":2,"e":4}]}
	});
	group.templates.push({
		name: 'Proline <b>Pro</b> <i>P</i>',
		data: {"a":[{"x":202.506,"y":266.976},{"x":184.236,"y":258.84},{"x":200.414,"y":286.866,"l":"N"},{"x":219.828,"y":256.976},{"x":170.854,"y":273.704},{"x":180.854,"y":291.024},{"x":237.148,"y":266.976,"l":"O"},{"x":219.828,"y":236.976,"l":"O"}],"b":[{"b":0,"e":2},{"b":0,"e":1},{"b":0,"e":3},{"b":2,"e":5},{"b":4,"e":1},{"b":5,"e":4},{"b":3,"e":6},{"b":3,"e":7,"o":2}]}
	});
	group.templates.push({
		name: 'Proline <i>chain</i>',
		data: {"a":[{"x":14.9378,"y":29.9651},{"x":14.9378,"y":9.9874},{"x":-4.0875,"y":36.1665},{"x":-4.0875,"y":3.786},{"x":-15.8902,"y":19.9597,"l":"N"},{"x":-4.0875,"y":-16.1888},{"x":15.8902,"y":-16.1888,"l":"O"},{"x":-4.0875,"y":-36.1665,"l":"O"}],"b":[{"b":0,"e":1},{"b":1,"e":3},{"b":3,"e":4},{"b":4,"e":2},{"b":0,"e":2},{"b":3,"e":5},{"b":5,"e":6},{"b":5,"e":7,"o":2}]}
	});
	group.templates.push({
		name: 'Proline <i>side chain</i>',
		data: {"a":[{"x":15.4059,"y":9.9836},{"x":15.4059,"y":-9.9836},{"x":-3.6094,"y":16.1817},{"x":-3.6094,"y":-16.1817},{"x":-15.4059,"y":-0.0165}],"b":[{"b":0,"e":1},{"b":1,"e":3},{"b":4,"e":2},{"b":0,"e":2}]}
	});
	group.templates.push({
		name: 'Serine <b>Ser</b> <i>S</i>',
		data: {"a":[{"x":204.002,"y":269},{"x":221.322,"y":259},{"x":186.678,"y":259},{"x":204.002,"y":289,"l":"N"},{"x":238.642,"y":269,"l":"O"},{"x":221.322,"y":239,"l":"O"},{"x":169.358,"y":269,"l":"O"}],"b":[{"b":0,"e":2},{"b":0,"e":1},{"b":0,"e":3},{"b":2,"e":6},{"b":1,"e":4},{"b":1,"e":5,"o":2}]}
	});
	group.templates.push({
		name: 'Serine <i>chain</i>',
		data: {"a":[{"x":-30,"y":-9.9991,"l":"N"},{"x":-9.9991,"y":-9.9991},{"x":9.9991,"y":-9.9991},{"x":-9.9991,"y":10.0019},{"x":30,"y":-9.9991,"l":"O"},{"x":9.9991,"y":-29.9999,"l":"O"},{"x":-9.9991,"y":30,"l":"O"}],"b":[{"b":0,"e":1},{"b":1,"e":2},{"b":1,"e":3},{"b":2,"e":4},{"b":2,"e":5,"o":2},{"b":3,"e":6}]}
	});
	group.templates.push({
		name: 'Serine <i>side chain</i>',
		data: {"a":[{"x":-19.9986,"y":0},{"x":0.0014,"y":0},{"x":19.9986,"y":0,"l":"O"}],"b":[{"b":0,"e":1},{"b":1,"e":2}]}
	});
	group.templates.push({
		name: 'Threonine <b>Thr</b> <i>T</i>',
		data: {"a":[{"x":204.002,"y":269},{"x":221.322,"y":259},{"x":204.002,"y":289,"l":"N"},{"x":186.68,"y":259},{"x":221.322,"y":239,"l":"O"},{"x":238.642,"y":269,"l":"O"},{"x":186.68,"y":239,"l":"O"},{"x":169.358,"y":269}],"b":[{"b":0,"e":1},{"b":0,"e":2},{"b":0,"e":3},{"b":1,"e":4,"o":2},{"b":1,"e":5},{"b":3,"e":7},{"b":3,"e":6}]}
	});
	group.templates.push({
		name: 'Threonine <i>chain</i>',
		data: {"a":[{"x":-30.0004,"y":-9.9993,"l":"N"},{"x":-9.9992,"y":-9.9993},{"x":-9.9992,"y":10.002},{"x":9.9992,"y":-9.9993},{"x":-9.9992,"y":30.0004},{"x":9.9992,"y":10.002,"l":"O"},{"x":30.0004,"y":-9.9992,"l":"O"},{"x":9.9992,"y":-30.0004,"l":"O"}],"b":[{"b":0,"e":1},{"b":1,"e":3},{"b":1,"e":2},{"b":3,"e":6},{"b":3,"e":7,"o":2},{"b":2,"e":5},{"b":2,"e":4}]}
	});
	group.templates.push({
		name: 'Threonine <i>side chain</i>',
		data: {"a":[{"x":-17.0711,"y":0.999},{"x":2.9289,"y":0.999},{"x":8.1053,"y":-18.3195,"l":"H"},{"x":12.9289,"y":18.3195},{"x":17.0711,"y":-13.1431,"l":"O"}],"b":[{"b":0,"e":1},{"b":1,"e":4},{"b":1,"e":3},{"b":1,"e":2}]}
	});
	group.templates.push({
		name: 'Tryptophan <b>Trp</b> <i>W</i>',
		data: {"a":[{"x":232.89,"y":267.526},{"x":232.89,"y":287.526,"l":"N"},{"x":250.21,"y":257.526},{"x":215.57,"y":257.526},{"x":267.532,"y":267.526,"l":"O"},{"x":250.21,"y":237.526,"l":"O"},{"x":198.248,"y":267.526},{"x":196.158,"y":287.418},{"x":179.98,"y":259.392},{"x":176.596,"y":291.576,"l":"N"},{"x":173.23,"y":240.256},{"x":166.596,"y":274.254},{"x":153.6,"y":236.424},{"x":146.968,"y":270.424},{"x":140.468,"y":251.51}],"b":[{"b":0,"e":2},{"b":0,"e":3},{"b":0,"e":1},{"b":2,"e":4},{"b":2,"e":5,"o":2},{"b":3,"e":6},{"b":6,"e":7,"o":2},{"b":6,"e":8},{"b":7,"e":9},{"b":11,"e":8,"o":2},{"b":10,"e":8},{"b":9,"e":11},{"b":11,"e":13},{"b":12,"e":10,"o":2},{"b":13,"e":14,"o":2},{"b":14,"e":12}]}
	});
	group.templates.push({
		name: 'Tryptophan <i>chain</i>',
		data: {"a":[{"x":-34.5594,"y":-32.7962,"l":"N"},{"x":-14.5632,"y":-32.7962},{"x":-14.5632,"y":-12.8},{"x":5.4302,"y":-32.7962},{"x":-14.5632,"y":7.1934},{"x":25.4264,"y":-32.7962,"l":"O"},{"x":5.4302,"y":-52.7924,"l":"O"},{"x":-30.7519,"y":18.8666},{"x":1.5511,"y":18.8666},{"x":-24.6495,"y":37.8737,"l":"N"},{"x":-4.6891,"y":37.8737},{"x":21.1946,"y":14.7065},{"x":8.6757,"y":52.7924},{"x":34.5594,"y":29.6581},{"x":28.2834,"y":48.7011}],"b":[{"b":0,"e":1},{"b":1,"e":3},{"b":1,"e":2},{"b":3,"e":5},{"b":3,"e":6,"o":2},{"b":2,"e":4},{"b":4,"e":7,"o":2},{"b":7,"e":9},{"b":9,"e":10},{"b":10,"e":8,"o":2},{"b":4,"e":8},{"b":10,"e":12},{"b":12,"e":14,"o":2},{"b":14,"e":13},{"b":13,"e":11,"o":2},{"b":8,"e":11}]}
	});
	group.templates.push({
		name: 'Tryptophan <i>side chain</i>',
		data: {"a":[{"x":-42.876,"y":16.3756},{"x":-22.8416,"y":16.3756},{"x":-2.81,"y":16.3756},{"x":9.0262,"y":0.2305},{"x":9.0262,"y":32.5593},{"x":4.9631,"y":-19.0972},{"x":28.0696,"y":6.3418},{"x":28.0696,"y":26.3403,"l":"N"},{"x":19.6976,"y":-32.5593},{"x":42.876,"y":-7.0485},{"x":38.6693,"y":-26.517}],"b":[{"b":0,"e":1},{"b":1,"e":2},{"b":2,"e":4,"o":2},{"b":4,"e":7},{"b":7,"e":6},{"b":6,"e":3,"o":2},{"b":2,"e":3},{"b":6,"e":9},{"b":9,"e":10,"o":2},{"b":10,"e":8},{"b":8,"e":5,"o":2},{"b":3,"e":5}]}
	});
	group.templates.push({
		name: 'Tyrosine <b>Tyr</b> <i>Y</i>',
		data: {"a":[{"x":247.3,"y":254},{"x":247.3,"y":234,"l":"O"},{"x":229.98,"y":264},{"x":264.622,"y":264,"l":"O"},{"x":212.66,"y":254},{"x":229.98,"y":284,"l":"N"},{"x":195.34,"y":264},{"x":195.34,"y":284},{"x":178.018,"y":254},{"x":178.018,"y":294},{"x":160.698,"y":264},{"x":160.698,"y":284},{"x":143.378,"y":294,"l":"O"}],"b":[{"b":0,"e":1,"o":2},{"b":0,"e":3},{"b":0,"e":2},{"b":2,"e":4},{"b":2,"e":5},{"b":4,"e":6},{"b":6,"e":7,"o":2},{"b":6,"e":8},{"b":7,"e":9},{"b":10,"e":8,"o":2},{"b":9,"e":11,"o":2},{"b":11,"e":10},{"b":11,"e":12}]}
	});
	group.templates.push({
		name: 'Tyrosine <i>chain</i>',
		data: {"a":[{"x":-29.9912,"y":-40.0397,"l":"N"},{"x":-9.9962,"y":-40.0397},{"x":9.9961,"y":-40.0397},{"x":-9.9962,"y":-20.0447},{"x":29.9911,"y":-40.0397,"l":"O"},{"x":9.9961,"y":-60.0347,"l":"O"},{"x":-9.9962,"y":-0.0524},{"x":7.2826,"y":9.9976},{"x":-27.3107,"y":9.9976},{"x":7.2826,"y":30.0284},{"x":-27.3107,"y":30.0285},{"x":-9.9962,"y":40.0424},{"x":-9.9962,"y":60.0347,"l":"O"}],"b":[{"b":0,"e":1},{"b":1,"e":2},{"b":1,"e":3},{"b":2,"e":4},{"b":2,"e":5,"o":2},{"b":3,"e":6},{"b":6,"e":8,"o":2},{"b":8,"e":10},{"b":10,"e":11,"o":2},{"b":11,"e":9},{"b":9,"e":7,"o":2},{"b":6,"e":7},{"b":11,"e":12}]}
	});
	group.templates.push({
		name: 'Tyrosine <i>side chain</i>',
		data: {"a":[{"x":-50.0496,"y":-0.0179},{"x":-30.0496,"y":-0.0179},{"x":-10.0524,"y":-0.0179},{"x":0,"y":17.3009},{"x":0,"y":-17.3009},{"x":20.0358,"y":17.3009},{"x":20.0358,"y":-17.3009},{"x":30.0524,"y":-0.0179},{"x":50.0496,"y":-0.0179,"l":"O"}],"b":[{"b":0,"e":1},{"b":1,"e":2},{"b":2,"e":3,"o":2},{"b":3,"e":5},{"b":5,"e":7,"o":2},{"b":7,"e":6},{"b":6,"e":4,"o":2},{"b":2,"e":4},{"b":7,"e":8}]}
	});
	group.templates.push({
		name: 'Valine <b>Val</b> <i>V</i>',
		data: {"a":[{"x":204,"y":269},{"x":204,"y":289,"l":"N"},{"x":186.678,"y":259},{"x":221.322,"y":259},{"x":186.678,"y":239},{"x":169.36,"y":269},{"x":238.64,"y":269,"l":"O"},{"x":221.322,"y":239,"l":"O"}],"b":[{"b":0,"e":3},{"b":0,"e":2},{"b":0,"e":1},{"b":3,"e":6},{"b":3,"e":7,"o":2},{"b":2,"e":5},{"b":2,"e":4}]}
	});
	group.templates.push({
		name: 'Valine <i>chain</i>',
		data: {"a":[{"x":-30.0004,"y":-9.9992,"l":"N"},{"x":-9.9992,"y":-9.9992},{"x":-9.9992,"y":10.0019},{"x":9.9992,"y":-9.9992},{"x":9.9992,"y":10.0019},{"x":-9.9992,"y":30.0004},{"x":30.0004,"y":-9.9992,"l":"O"},{"x":9.9992,"y":-30.0005,"l":"O"}],"b":[{"b":0,"e":1},{"b":1,"e":3},{"b":1,"e":2},{"b":3,"e":6},{"b":3,"e":7,"o":2},{"b":2,"e":4},{"b":2,"e":5}]}
	});
	group.templates.push({
		name: 'Valine <i>side chain</i>',
		data: {"a":[{"x":-20.0014,"y":10},{"x":0.0014,"y":10},{"x":20.0014,"y":10},{"x":0.0014,"y":-10}],"b":[{"b":0,"e":1},{"b":1,"e":3},{"b":1,"e":2}]}
	});
	d.push(group);
	
	group = {name:'Cyclic Terpenes', templates:[]};
	group.templates.push({
		name: 'Bornane',
		data: {"a":[{"x":-1.0324,"y":-18.324},{"x":9.6351,"y":-4.5595},{"x":-16.3453,"y":-28.3032},{"x":-5.3337,"y":12.4741},{"x":14.1611,"y":-27.0959},{"x":-10.8395,"y":1.8066},{"x":25.2923,"y":1.8066},{"x":-14.2806,"y":28.3032},{"x":-25.2923,"y":15.9152},{"x":14.7968,"y":16.6035}],"b":[{"b":0,"e":4},{"b":0,"e":2},{"b":0,"e":1},{"b":1,"e":6},{"b":6,"e":9},{"b":9,"e":3},{"b":3,"e":7},{"b":8,"e":3},{"b":8,"e":5},{"b":5,"e":1},{"b":0,"e":3}]}
	});
	group.templates.push({
		name: 'Carane',
		data: {"a":[{"x":-19.9985,"y":-39.643},{"x":-9.9992,"y":-22.3243},{"x":-19.9985,"y":-5.0056},{"x":9.9992,"y":-22.3242},{"x":-9.9992,"y":12.3151},{"x":19.9985,"y":-5.0056},{"x":0,"y":29.6437},{"x":9.9992,"y":12.3151},{"x":-17.3187,"y":39.643},{"x":17.3187,"y":39.643}],"b":[{"b":4,"e":6},{"b":7,"e":6},{"b":6,"e":9},{"b":6,"e":8},{"b":4,"e":7},{"b":4,"e":2},{"b":7,"e":5},{"b":2,"e":1},{"b":5,"e":3},{"b":1,"e":3},{"b":1,"e":0}]}
	});
	group.templates.push({
		name: 'Menthane',
		data: {"a":[{"x":-17.3202,"y":-5.0001},{"x":-17.3203,"y":15.0002},{"x":0,"y":-15.0002},{"x":0,"y":25.0003},{"x":17.3203,"y":-5.0001},{"x":0,"y":-35.0005},{"x":17.3202,"y":15.0002},{"x":0,"y":45.0006},{"x":-17.3203,"y":-45.0006},{"x":17.3202,"y":-45.0006}],"b":[{"b":2,"e":0},{"b":2,"e":4},{"b":2,"e":5},{"b":0,"e":1},{"b":4,"e":6},{"b":3,"e":6},{"b":3,"e":1},{"b":3,"e":7},{"b":5,"e":9},{"b":5,"e":8}]}
	});
	group.templates.push({
		name: 'Norbornane 1',
		data: {"a":[{"x":-0.995,"y":-16.8329},{"x":-5.1411,"y":12.8527},{"x":9.2871,"y":-3.5656},{"x":-24.3787,"y":16.1695},{"x":14.2624,"y":16.8329},{"x":-10.448,"y":2.5705},{"x":24.3787,"y":2.5705}],"b":[{"b":0,"e":2},{"b":2,"e":6},{"b":6,"e":4},{"b":4,"e":1},{"b":3,"e":1},{"b":3,"e":5},{"b":5,"e":2},{"b":0,"e":1}]}
	});
	group.templates.push({
		name: 'Norbornane 2',
		data: {"a":[{"x":0,"y":-19.7533},{"x":-6.3211,"y":0},{"x":17.1069,"y":-9.8766},{"x":-17.1069,"y":-9.8766},{"x":0,"y":19.7533},{"x":17.1069,"y":9.8767},{"x":-17.1069,"y":9.8767}],"b":[{"b":0,"e":3},{"b":3,"e":6},{"b":6,"e":4},{"b":4,"e":5},{"b":5,"e":2},{"b":2,"e":0},{"b":4,"e":1},{"b":0,"e":1}]}
	});
	group.templates.push({
		name: 'Norcarane',
		data: {"a":[{"x":9.9989,"y":-25.983},{"x":19.9977,"y":-8.665},{"x":-9.9989,"y":-25.983},{"x":9.9989,"y":8.653},{"x":-19.9977,"y":-8.665},{"x":0,"y":25.9831},{"x":-9.9989,"y":8.653}],"b":[{"b":3,"e":6},{"b":3,"e":5},{"b":3,"e":1},{"b":6,"e":5},{"b":6,"e":4},{"b":1,"e":0},{"b":4,"e":2},{"b":0,"e":2}]}
	});
	group.templates.push({
		name: 'Norpinane',
		data: {"a":[{"x":-9.0329,"y":-16.7698},{"x":-14.1777,"y":-0.5106},{"x":-5.027,"y":9.1507},{"x":3.6889,"y":3.8049},{"x":-24.1925,"y":16.7698},{"x":15.081,"y":13.8636},{"x":24.1925,"y":0.3535}],"b":[{"b":0,"e":1},{"b":1,"e":3},{"b":3,"e":6},{"b":6,"e":5},{"b":5,"e":2},{"b":4,"e":2},{"b":4,"e":1},{"b":0,"e":2}]}
	});
	group.templates.push({
		name: 'Pinane',
		data: {"a":[{"x":-9.3626,"y":-10.136},{"x":-24.0985,"y":-22.6738},{"x":3.2566,"y":-24.6277},{"x":-5.2105,"y":16.7306},{"x":-14.6952,"y":6.7166},{"x":15.6315,"y":21.6154},{"x":-25.0755,"y":24.6277},{"x":5.5362,"y":2.646},{"x":25.0755,"y":7.6122},{"x":13.3519,"y":-10.6245}],"b":[{"b":0,"e":2},{"b":0,"e":1},{"b":0,"e":4},{"b":4,"e":7},{"b":7,"e":9},{"b":7,"e":8},{"b":8,"e":5},{"b":5,"e":3},{"b":6,"e":3},{"b":6,"e":4},{"b":0,"e":3}]}
	});
	group.templates.push({
		name: 'Thujane',
		data: {"a":[{"x":-24.0519,"y":2.3998},{"x":-12.2969,"y":-13.7808},{"x":-12.2969,"y":18.5784},{"x":6.7214,"y":-7.5993},{"x":6.7214,"y":12.399},{"x":-18.4764,"y":37.5967},{"x":6.7214,"y":-27.5976},{"x":24.0519,"y":2.3998},{"x":24.0419,"y":-37.5967},{"x":-10.5971,"y":-37.5967}],"b":[{"b":3,"e":4},{"b":3,"e":7},{"b":3,"e":1},{"b":3,"e":6},{"b":4,"e":7},{"b":4,"e":2},{"b":2,"e":0},{"b":2,"e":5},{"b":1,"e":0},{"b":6,"e":8},{"b":6,"e":9}]}
	});
	d.push(group);
	
	group = {name:'Cycloalkanes', templates:[]};
	group.templates.push({
		name: '<a></a><b>9</b> Nonane <i>packed</i>',
		data: {"a":[{"x":236.708,"y":264},{"x":224.954,"y":247.82},{"x":224.954,"y":280.178},{"x":205.932,"y":254},{"x":205.932,"y":273.998},{"x":188.612,"y":244},{"x":188.612,"y":284},{"x":171.29,"y":254},{"x":171.29,"y":273.998}],"b":[{"b":0,"e":2},{"b":0,"e":1},{"b":2,"e":4},{"b":3,"e":1},{"b":4,"e":6},{"b":3,"e":5},{"b":6,"e":8},{"b":7,"e":5},{"b":8,"e":7}]}
	});
	group.templates.push({
		name: '<a></a><b>9</b> Nonane <i>unpacked</i>',
		data: {"a":[{"x":175.644,"y":274},{"x":175.644,"y":254},{"x":188.5,"y":289.32},{"x":188.5,"y":238.68},{"x":208.196,"y":292.794},{"x":208.196,"y":235.206},{"x":225.516,"y":282.794},{"x":225.516,"y":245.206},{"x":232.356,"y":264}],"b":[{"b":0,"e":2},{"b":0,"e":1},{"b":2,"e":4},{"b":3,"e":1},{"b":4,"e":6},{"b":3,"e":5},{"b":6,"e":8},{"b":7,"e":5},{"b":8,"e":7}]}
	});
	group.templates.push({
		name: '<b>10</b> Decane <i>packed</i>',
		data: {"a":[{"x":186.678,"y":244},{"x":169.36,"y":254},{"x":204,"y":254},{"x":169.36,"y":274},{"x":221.32,"y":244},{"x":186.678,"y":284},{"x":238.642,"y":254},{"x":204,"y":274},{"x":238.642,"y":274},{"x":221.32,"y":284}],"b":[{"b":0,"e":2},{"b":0,"e":1},{"b":2,"e":4},{"b":3,"e":1},{"b":4,"e":6},{"b":5,"e":3},{"b":6,"e":8},{"b":7,"e":5},{"b":8,"e":9},{"b":9,"e":7}]}
	});
	group.templates.push({
		name: '<b>10</b> Decane <i>unpacked</i>',
		data: {"a":[{"x":173.224,"y":274},{"x":184.978,"y":290.18},{"x":173.224,"y":254},{"x":204,"y":296.36},{"x":184.978,"y":237.82},{"x":223.022,"y":290.18},{"x":204,"y":231.64},{"x":234.776,"y":274},{"x":223.022,"y":237.82},{"x":234.776,"y":254}],"b":[{"b":0,"e":1},{"b":0,"e":2},{"b":1,"e":3},{"b":4,"e":2},{"b":3,"e":5},{"b":6,"e":4},{"b":5,"e":7},{"b":8,"e":6},{"b":7,"e":9},{"b":9,"e":8}]}
	});
	group.templates.push({
		name: '<b>11</b> Undecane <i>packed</i>',
		data: {"a":[{"x":169.358,"y":243.61},{"x":169.358,"y":263.612},{"x":186.678,"y":233.612},{"x":186.678,"y":273.61},{"x":204,"y":243.61},{"x":193.998,"y":294.388},{"x":221.318,"y":233.612},{"x":213.998,"y":294.388},{"x":238.64,"y":243.61},{"x":221.318,"y":273.61},{"x":238.64,"y":263.612}],"b":[{"b":0,"e":2},{"b":0,"e":1},{"b":2,"e":4},{"b":3,"e":1},{"b":4,"e":6},{"b":5,"e":3},{"b":6,"e":8},{"b":7,"e":5},{"b":8,"e":10},{"b":9,"e":7},{"b":10,"e":9}]}
	});
	group.templates.push({
		name: '<b>11</b> Undecane <i>unpacked</i>',
		data: {"a":[{"x":169.224,"y":274},{"x":180.038,"y":290.826},{"x":169.224,"y":254},{"x":198.23,"y":299.134},{"x":180.038,"y":237.174},{"x":218.026,"y":296.288},{"x":198.23,"y":228.866},{"x":233.142,"y":283.19},{"x":218.026,"y":231.712},{"x":238.776,"y":264},{"x":233.142,"y":244.81}],"b":[{"b":0,"e":1},{"b":0,"e":2},{"b":1,"e":3},{"b":4,"e":2},{"b":3,"e":5},{"b":6,"e":4},{"b":5,"e":7},{"b":8,"e":6},{"b":7,"e":9},{"b":10,"e":8},{"b":9,"e":10}]}
	});
	group.templates.push({
		name: '<b>12</b> Dodecane <i>packed</i>',
		data: {"a":[{"x":204,"y":229},{"x":186.678,"y":239},{"x":221.32,"y":239},{"x":186.678,"y":259},{"x":221.32,"y":259},{"x":169.358,"y":269},{"x":238.64,"y":269},{"x":169.358,"y":289},{"x":238.64,"y":289},{"x":186.678,"y":299},{"x":221.32,"y":299},{"x":204,"y":289}],"b":[{"b":0,"e":2},{"b":0,"e":1},{"b":2,"e":4},{"b":3,"e":1},{"b":4,"e":6},{"b":3,"e":5},{"b":6,"e":8},{"b":7,"e":5},{"b":8,"e":10},{"b":9,"e":7},{"b":10,"e":11},{"b":11,"e":9}]}
	});
	group.templates.push({
		name: '<b>12</b> Dodecane <i>unpacked</i>',
		data: {"a":[{"x":166.68,"y":274},{"x":176.68,"y":291.32},{"x":166.68,"y":254},{"x":194,"y":301.32},{"x":176.68,"y":236.68},{"x":214,"y":301.32},{"x":194,"y":226.68},{"x":231.32,"y":291.32},{"x":214,"y":226.68},{"x":241.32,"y":274},{"x":231.32,"y":236.68},{"x":241.32,"y":254}],"b":[{"b":0,"e":1},{"b":0,"e":2},{"b":1,"e":3},{"b":4,"e":2},{"b":3,"e":5},{"b":4,"e":6},{"b":5,"e":7},{"b":8,"e":6},{"b":7,"e":9},{"b":10,"e":8},{"b":9,"e":11},{"b":11,"e":10}]}
	});
	group.templates.push({
		name: '<b>13</b> Tridecane <i>packed</i>',
		data: {"a":[{"x":204,"y":218.612},{"x":221.322,"y":228.614},{"x":186.68,"y":228.614},{"x":221.322,"y":248.612},{"x":186.68,"y":248.612},{"x":238.64,"y":258.614},{"x":169.358,"y":258.614},{"x":238.64,"y":278.612},{"x":169.358,"y":278.612},{"x":221.322,"y":288.614},{"x":186.68,"y":288.614},{"x":214.002,"y":309.388},{"x":194,"y":309.388}],"b":[{"b":0,"e":1},{"b":0,"e":2},{"b":1,"e":3},{"b":4,"e":2},{"b":3,"e":5},{"b":6,"e":4},{"b":5,"e":7},{"b":8,"e":6},{"b":7,"e":9},{"b":10,"e":8},{"b":9,"e":11},{"b":12,"e":10},{"b":11,"e":12}]}
	});
	group.templates.push({
		name: '<b>13</b> Tridecane <i>unpacked</i>',
		data: {"a":[{"x":162.822,"y":274},{"x":172.116,"y":291.71},{"x":162.822,"y":254},{"x":188.576,"y":303.07},{"x":172.116,"y":236.29},{"x":208.43,"y":305.482},{"x":188.576,"y":224.93},{"x":227.13,"y":298.39},{"x":208.43,"y":222.518},{"x":240.392,"y":283.418},{"x":227.13,"y":229.61},{"x":245.178,"y":264},{"x":240.392,"y":244.582}],"b":[{"b":0,"e":1},{"b":0,"e":2},{"b":1,"e":3},{"b":4,"e":2},{"b":3,"e":5},{"b":6,"e":4},{"b":5,"e":7},{"b":8,"e":6},{"b":7,"e":9},{"b":10,"e":8},{"b":9,"e":11},{"b":12,"e":10},{"b":11,"e":12}]}
	});
	group.templates.push({
		name: '<b>14</b> Tetradecane <i>packed</i>',
		data: {"a":[{"x":204,"y":214},{"x":186.68,"y":224},{"x":221.32,"y":224},{"x":186.68,"y":244},{"x":221.32,"y":244},{"x":169.358,"y":254},{"x":238.642,"y":254},{"x":169.358,"y":274},{"x":238.642,"y":274},{"x":186.68,"y":284},{"x":221.32,"y":284},{"x":186.68,"y":304},{"x":221.32,"y":304},{"x":204,"y":314}],"b":[{"b":0,"e":2},{"b":0,"e":1},{"b":2,"e":4},{"b":3,"e":1},{"b":4,"e":6},{"b":5,"e":3},{"b":6,"e":8},{"b":7,"e":5},{"b":8,"e":10},{"b":9,"e":7},{"b":10,"e":12},{"b":11,"e":9},{"b":12,"e":13},{"b":13,"e":11}]}
	});
	group.templates.push({
		name: '<b>14</b> Tetradecane <i>unpacked</i>',
		data: {"a":[{"x":160.188,"y":274},{"x":168.864,"y":292.02},{"x":160.188,"y":254},{"x":184.502,"y":304.49},{"x":168.864,"y":235.98},{"x":204,"y":308.94},{"x":184.502,"y":223.51},{"x":223.498,"y":304.49},{"x":204,"y":219.06},{"x":239.136,"y":292.02},{"x":223.498,"y":223.51},{"x":247.812,"y":274},{"x":239.136,"y":235.98},{"x":247.812,"y":254}],"b":[{"b":0,"e":1},{"b":0,"e":2},{"b":1,"e":3},{"b":4,"e":2},{"b":3,"e":5},{"b":6,"e":4},{"b":5,"e":7},{"b":8,"e":6},{"b":7,"e":9},{"b":10,"e":8},{"b":9,"e":11},{"b":12,"e":10},{"b":11,"e":13},{"b":13,"e":12}]}
	});
	group.templates.push({
		name: '<b>15</b> Pendecane <i>packed</i>',
		data: {"a":[{"x":184,"y":251.23},{"x":164,"y":251.23},{"x":186.226,"y":233.358},{"x":154,"y":268.548},{"x":204.306,"y":224.808},{"x":164,"y":285.87},{"x":222.264,"y":233.61},{"x":184,"y":285.87},{"x":224,"y":251.23},{"x":194,"y":303.192},{"x":244,"y":251.23},{"x":214,"y":303.192},{"x":254,"y":268.548},{"x":224,"y":285.87},{"x":244,"y":285.87}],"b":[{"b":0,"e":1},{"b":0,"e":2},{"b":3,"e":1},{"b":2,"e":4},{"b":5,"e":3},{"b":4,"e":6},{"b":7,"e":5},{"b":6,"e":8},{"b":9,"e":7},{"b":8,"e":10},{"b":11,"e":9},{"b":10,"e":12},{"b":13,"e":11},{"b":12,"e":14},{"b":14,"e":13}]}
	});
	group.templates.push({
		name: '<b>15</b> Pendecane <i>unpacked</i>',
		data: {"a":[{"x":156.428,"y":274},{"x":164.562,"y":292.27},{"x":156.428,"y":254},{"x":179.426,"y":305.654},{"x":164.562,"y":235.728},{"x":198.446,"y":311.834},{"x":179.426,"y":222.346},{"x":218.338,"y":309.744},{"x":198.446,"y":216.166},{"x":235.658,"y":299.744},{"x":218.338,"y":218.256},{"x":247.414,"y":283.562},{"x":235.658,"y":228.256},{"x":251.572,"y":264},{"x":247.414,"y":244.438}],"b":[{"b":0,"e":1},{"b":0,"e":2},{"b":3,"e":1},{"b":2,"e":4},{"b":5,"e":3},{"b":4,"e":6},{"b":7,"e":5},{"b":6,"e":8},{"b":9,"e":7},{"b":8,"e":10},{"b":11,"e":9},{"b":10,"e":12},{"b":13,"e":11},{"b":12,"e":14},{"b":14,"e":13}]}
	});
	group.templates.push({
		name: '<b>16</b> Hexadecane <i>packed</i>',
		data: {"a":[{"x":186.68,"y":229},{"x":204.002,"y":239},{"x":169.36,"y":239},{"x":221.32,"y":229},{"x":169.36,"y":259},{"x":238.642,"y":239},{"x":152.038,"y":269},{"x":238.642,"y":259},{"x":152.038,"y":289},{"x":255.962,"y":269},{"x":169.36,"y":299},{"x":255.962,"y":289},{"x":186.68,"y":289},{"x":238.642,"y":299},{"x":204.002,"y":299},{"x":221.32,"y":289}],"b":[{"b":0,"e":1},{"b":0,"e":2},{"b":1,"e":3},{"b":4,"e":2},{"b":3,"e":5},{"b":4,"e":6},{"b":5,"e":7},{"b":8,"e":6},{"b":7,"e":9},{"b":10,"e":8},{"b":9,"e":11},{"b":12,"e":10},{"b":11,"e":13},{"b":14,"e":12},{"b":15,"e":13},{"b":15,"e":14}]}
	});
	group.templates.push({
		name: '<b>16</b> Hexadecane <i>unpacked</i>',
		data: {"a":[{"x":153.726,"y":274},{"x":161.38,"y":292.478},{"x":153.726,"y":254},{"x":175.522,"y":306.62},{"x":161.38,"y":235.522},{"x":194,"y":314.274},{"x":175.522,"y":221.38},{"x":214,"y":314.274},{"x":194,"y":213.726},{"x":232.478,"y":306.62},{"x":214,"y":213.726},{"x":246.62,"y":292.478},{"x":232.478,"y":221.38},{"x":254.274,"y":274},{"x":246.62,"y":235.522},{"x":254.274,"y":254}],"b":[{"b":0,"e":1},{"b":0,"e":2},{"b":1,"e":3},{"b":4,"e":2},{"b":3,"e":5},{"b":4,"e":6},{"b":5,"e":7},{"b":8,"e":6},{"b":7,"e":9},{"b":10,"e":8},{"b":9,"e":11},{"b":12,"e":10},{"b":11,"e":13},{"b":14,"e":12},{"b":15,"e":13},{"b":15,"e":14}]}
	});
	group.templates.push({
		name: '<b>17</b> Heptadecane <i>packed</i>',
		data: {"a":[{"x":152.038,"y":228.614},{"x":152.038,"y":248.612},{"x":169.358,"y":218.612},{"x":169.358,"y":258.614},{"x":186.68,"y":228.614},{"x":169.358,"y":278.612},{"x":203.998,"y":218.612},{"x":186.68,"y":288.614},{"x":221.32,"y":228.614},{"x":194,"y":309.388},{"x":238.64,"y":218.612},{"x":214,"y":309.388},{"x":255.962,"y":228.614},{"x":221.32,"y":288.614},{"x":255.962,"y":248.612},{"x":238.64,"y":278.612},{"x":238.64,"y":258.614}],"b":[{"b":0,"e":2},{"b":0,"e":1},{"b":2,"e":4},{"b":3,"e":1},{"b":4,"e":6},{"b":5,"e":3},{"b":6,"e":8},{"b":7,"e":5},{"b":8,"e":10},{"b":9,"e":7},{"b":10,"e":12},{"b":11,"e":9},{"b":12,"e":14},{"b":13,"e":11},{"b":14,"e":16},{"b":15,"e":13},{"b":16,"e":15}]}
	});
	group.templates.push({
		name: '<b>17</b> Heptadecane <i>unpacked</i>',
		data: {"a":[{"x":150.042,"y":274},{"x":150.042,"y":254},{"x":157.266,"y":292.65},{"x":157.266,"y":235.35},{"x":170.74,"y":307.43},{"x":170.74,"y":220.57},{"x":188.644,"y":316.344},{"x":188.644,"y":211.656},{"x":208.558,"y":318.19},{"x":208.558,"y":209.81},{"x":227.794,"y":312.716},{"x":227.794,"y":215.284},{"x":243.754,"y":300.664},{"x":243.754,"y":227.336},{"x":254.284,"y":283.66},{"x":254.284,"y":244.34},{"x":257.958,"y":264}],"b":[{"b":0,"e":2},{"b":0,"e":1},{"b":2,"e":4},{"b":3,"e":1},{"b":4,"e":6},{"b":5,"e":3},{"b":6,"e":8},{"b":7,"e":5},{"b":8,"e":10},{"b":9,"e":7},{"b":10,"e":12},{"b":11,"e":9},{"b":12,"e":14},{"b":13,"e":11},{"b":14,"e":16},{"b":15,"e":13},{"b":16,"e":15}]}
	});
	group.templates.push({
		name: '<b>18</b> Octodecane <i>packed</i>',
		data: {"a":[{"x":186.68,"y":214},{"x":169.36,"y":224},{"x":204.002,"y":224},{"x":169.36,"y":244},{"x":221.32,"y":214},{"x":152.038,"y":254},{"x":238.642,"y":224},{"x":152.038,"y":274},{"x":238.642,"y":244},{"x":169.36,"y":284},{"x":255.962,"y":254},{"x":169.36,"y":304},{"x":255.962,"y":274},{"x":186.68,"y":314},{"x":238.642,"y":284},{"x":204.002,"y":304},{"x":238.642,"y":304},{"x":221.32,"y":314}],"b":[{"b":0,"e":2},{"b":0,"e":1},{"b":2,"e":4},{"b":3,"e":1},{"b":4,"e":6},{"b":3,"e":5},{"b":6,"e":8},{"b":7,"e":5},{"b":8,"e":10},{"b":9,"e":7},{"b":10,"e":12},{"b":11,"e":9},{"b":12,"e":14},{"b":13,"e":11},{"b":14,"e":16},{"b":15,"e":13},{"b":16,"e":17},{"b":17,"e":15}]}
	});
	group.templates.push({
		name: '<b>18</b> Octodecane <i>unpacked</i>',
		data: {"a":[{"x":147.288,"y":274},{"x":147.288,"y":254},{"x":154.128,"y":292.794},{"x":154.128,"y":235.206},{"x":166.984,"y":308.114},{"x":166.984,"y":219.886},{"x":184.304,"y":318.114},{"x":184.304,"y":209.886},{"x":204,"y":321.588},{"x":204,"y":206.412},{"x":223.696,"y":318.114},{"x":223.696,"y":209.886},{"x":241.016,"y":308.114},{"x":241.016,"y":219.886},{"x":253.872,"y":292.794},{"x":253.872,"y":235.206},{"x":260.712,"y":274},{"x":260.712,"y":254}],"b":[{"b":0,"e":2},{"b":0,"e":1},{"b":2,"e":4},{"b":3,"e":1},{"b":4,"e":6},{"b":3,"e":5},{"b":6,"e":8},{"b":7,"e":5},{"b":8,"e":10},{"b":9,"e":7},{"b":10,"e":12},{"b":11,"e":9},{"b":12,"e":14},{"b":13,"e":11},{"b":14,"e":16},{"b":15,"e":13},{"b":16,"e":17},{"b":17,"e":15}]}
	});
	group.templates.push({
		name: '<b>19</b> Enneadecane <i>packed</i>',
		data: {"a":[{"x":186.68,"y":203.612},{"x":169.36,"y":213.61},{"x":203.998,"y":213.61},{"x":169.36,"y":233.612},{"x":221.32,"y":203.612},{"x":152.038,"y":243.61},{"x":238.642,"y":213.61},{"x":152.038,"y":263.612},{"x":238.642,"y":233.612},{"x":169.36,"y":273.61},{"x":255.962,"y":243.61},{"x":169.36,"y":293.612},{"x":255.962,"y":263.612},{"x":186.68,"y":303.61},{"x":238.642,"y":273.61},{"x":194,"y":324.388},{"x":238.64,"y":293.612},{"x":214,"y":324.388},{"x":221.32,"y":303.61}],"b":[{"b":0,"e":2},{"b":0,"e":1},{"b":2,"e":4},{"b":3,"e":1},{"b":4,"e":6},{"b":3,"e":5},{"b":6,"e":8},{"b":7,"e":5},{"b":8,"e":10},{"b":9,"e":7},{"b":10,"e":12},{"b":11,"e":9},{"b":12,"e":14},{"b":13,"e":11},{"b":14,"e":16},{"b":15,"e":13},{"b":16,"e":18},{"b":17,"e":15},{"b":18,"e":17}]}
	});
	group.templates.push({
		name: '<b>19</b> Enneadecane <i>unpacked</i>',
		data: {"a":[{"x":143.658,"y":274},{"x":150.152,"y":292.916},{"x":143.658,"y":254},{"x":162.438,"y":308.7},{"x":150.154,"y":235.084},{"x":179.18,"y":319.638},{"x":162.438,"y":219.3},{"x":198.568,"y":324.548},{"x":179.18,"y":208.362},{"x":218.5,"y":322.896},{"x":198.568,"y":203.452},{"x":236.816,"y":314.862},{"x":218.5,"y":205.104},{"x":251.53,"y":301.316},{"x":236.816,"y":213.138},{"x":261.05,"y":283.728},{"x":251.53,"y":226.684},{"x":264.342,"y":264},{"x":261.05,"y":244.272}],"b":[{"b":0,"e":1},{"b":0,"e":2},{"b":1,"e":3},{"b":4,"e":2},{"b":3,"e":5},{"b":4,"e":6},{"b":5,"e":7},{"b":8,"e":6},{"b":7,"e":9},{"b":10,"e":8},{"b":9,"e":11},{"b":12,"e":10},{"b":11,"e":13},{"b":14,"e":12},{"b":13,"e":15},{"b":16,"e":14},{"b":15,"e":17},{"b":18,"e":16},{"b":17,"e":18}]}
	});
	group.templates.push({
		name: '<b>20</b> Icosane <i>packed</i>',
		data: {"a":[{"x":139.36,"y":264},{"x":149.358,"y":281.318},{"x":149.358,"y":246.682},{"x":169.36,"y":281.318},{"x":169.36,"y":246.682},{"x":169.36,"y":301.32},{"x":169.36,"y":226.68},{"x":186.678,"y":311.318},{"x":186.678,"y":216.682},{"x":204,"y":301.32},{"x":204,"y":226.68},{"x":221.322,"y":311.318},{"x":221.322,"y":216.682},{"x":238.642,"y":301.32},{"x":238.642,"y":226.68},{"x":238.642,"y":281.318},{"x":238.642,"y":246.682},{"x":258.642,"y":281.318},{"x":258.642,"y":246.682},{"x":268.64,"y":264}],"b":[{"b":0,"e":2},{"b":0,"e":1},{"b":2,"e":4},{"b":3,"e":1},{"b":4,"e":6},{"b":3,"e":5},{"b":6,"e":8},{"b":7,"e":5},{"b":8,"e":10},{"b":9,"e":7},{"b":10,"e":12},{"b":9,"e":11},{"b":12,"e":14},{"b":13,"e":11},{"b":14,"e":16},{"b":15,"e":13},{"b":16,"e":18},{"b":17,"e":15},{"b":18,"e":19},{"b":19,"e":17}]}
	});
	group.templates.push({
		name: '<b>20</b> Icosane <i>unpacked</i>',
		data: {"a":[{"x":140.862,"y":274},{"x":147.042,"y":293.02},{"x":140.862,"y":254},{"x":158.798,"y":309.202},{"x":147.042,"y":234.98},{"x":174.978,"y":320.958},{"x":158.798,"y":218.798},{"x":194,"y":327.138},{"x":174.978,"y":207.042},{"x":214,"y":327.138},{"x":194,"y":200.862},{"x":233.022,"y":320.958},{"x":214,"y":200.862},{"x":249.202,"y":309.202},{"x":233.02,"y":207.042},{"x":260.958,"y":293.02},{"x":249.202,"y":218.798},{"x":267.138,"y":274},{"x":260.958,"y":234.978},{"x":267.138,"y":254}],"b":[{"b":0,"e":1},{"b":0,"e":2},{"b":1,"e":3},{"b":4,"e":2},{"b":3,"e":5},{"b":4,"e":6},{"b":5,"e":7},{"b":8,"e":6},{"b":7,"e":9},{"b":10,"e":8},{"b":9,"e":11},{"b":10,"e":12},{"b":11,"e":13},{"b":14,"e":12},{"b":13,"e":15},{"b":16,"e":14},{"b":15,"e":17},{"b":18,"e":16},{"b":17,"e":19},{"b":19,"e":18}]}
	});
	d.push(group);
	
	group = {name:'Functional Groups', templates:[]};
	group.templates.push({
		name: 'Alkenyl',
		data: {"a":[{"x":194.002,"y":263.998},{"x":214,"y":263.998},{"x":184,"y":246.68},{"x":184,"y":281.32},{"x":224.002,"y":281.32},{"x":224.002,"y":246.68}],"b":[{"b":0,"e":1,"o":2},{"b":0,"e":2},{"b":0,"e":3},{"b":1,"e":5},{"b":1,"e":4}]}
	});
	group.templates.push({
		name: 'Alkynyl',
		data: {"a":[{"x":193.998,"y":264},{"x":174,"y":264},{"x":213.998,"y":264},{"x":234,"y":264}],"b":[{"b":0,"e":2,"o":3},{"b":0,"e":1},{"b":2,"e":3}]}
	});
	group.templates.push({
		name: 'Amine',
		data: {"a":[{"x":204.002,"y":259.002,"l":"N"},{"x":221.32,"y":249},{"x":204.002,"y":279},{"x":186.68,"y":249}],"b":[{"b":0,"e":1},{"b":0,"e":3},{"b":0,"e":2}]}
	});
	group.templates.push({
		name: 'Ammonium',
		data: {"a":[{"c":1,"x":203.998,"y":265.342,"l":"N"},{"x":186.68,"y":275.34},{"x":203.998,"y":245.34},{"x":194,"y":282.66},{"x":221.32,"y":275.34}],"b":[{"b":0,"e":2},{"b":0,"e":4},{"b":0,"e":1},{"b":0,"e":3}]}
	});
	group.templates.push({
		name: 'Azide',
		data: {"a":[{"x":178.02,"y":263.998},{"x":195.34,"y":254,"l":"N"},{"c":1,"x":212.662,"y":263.998,"l":"N"},{"c":-1,"x":229.98,"y":274,"l":"N"}],"b":[{"b":0,"e":1},{"b":1,"e":2,"o":2},{"b":2,"e":3,"o":2}]}
	});
	group.templates.push({
		name: 'Azo',
		data: {"a":[{"x":184,"y":246.68},{"x":194,"y":264.002,"l":"N"},{"x":214,"y":264.002,"l":"N"},{"x":224,"y":281.32}],"b":[{"b":0,"e":1},{"b":1,"e":2,"o":2},{"b":2,"e":3}]}
	});
	group.templates.push({
		name: 'Benzyl',
		data: {"a":[{"x":169.36,"y":254},{"x":186.678,"y":244},{"x":204,"y":254},{"x":204,"y":274},{"x":221.32,"y":244},{"x":221.32,"y":284},{"x":238.64,"y":254},{"x":238.64,"y":274}],"b":[{"b":0,"e":1},{"b":1,"e":2},{"b":2,"e":4,"o":2},{"b":2,"e":3},{"b":4,"e":6},{"b":5,"e":3,"o":2},{"b":6,"e":7,"o":2},{"b":7,"e":5}]}
	});
	group.templates.push({
		name: 'Carbonate Ester',
		data: {"a":[{"x":186.678,"y":279,"l":"O"},{"x":169.36,"y":269.002},{"x":204,"y":269.002},{"x":221.32,"y":279,"l":"O"},{"x":204,"y":249,"l":"O"},{"x":238.642,"y":269.002}],"b":[{"b":0,"e":2},{"b":0,"e":1},{"b":2,"e":4,"o":2},{"b":2,"e":3},{"b":3,"e":5}]}
	});
	group.templates.push({
		name: 'Carbonyl',
		data: {"a":[{"x":186.68,"y":279},{"x":204.002,"y":268.998},{"x":204.002,"y":249,"l":"O"},{"x":221.32,"y":279}],"b":[{"b":0,"e":1},{"b":1,"e":2,"o":2},{"b":1,"e":3}]}
	});
	group.templates.push({
		name: 'Carboxamide',
		data: {"a":[{"x":178.02,"y":269},{"x":195.34,"y":259},{"x":195.34,"y":239,"l":"O"},{"x":212.662,"y":269,"l":"N"},{"x":212.662,"y":289},{"x":229.98,"y":259}],"b":[{"b":0,"e":1},{"b":1,"e":2,"o":2},{"b":1,"e":3},{"b":3,"e":5},{"b":3,"e":4}]}
	});
	group.templates.push({
		name: 'Cyanate',
		data: {"a":[{"x":178.02,"y":263.998},{"x":195.338,"y":254,"l":"O"},{"x":212.66,"y":263.998},{"x":229.98,"y":274,"l":"N"}],"b":[{"b":0,"e":1},{"b":1,"e":2},{"b":2,"e":3,"o":3}]}
	});
	group.templates.push({
		name: 'Disulfide',
		data: {"a":[{"x":184,"y":246.68},{"x":194,"y":263.998,"l":"S"},{"x":214,"y":263.998,"l":"S"},{"x":224,"y":281.32}],"b":[{"b":0,"e":1},{"b":1,"e":2},{"b":2,"e":3}]}
	});
	group.templates.push({
		name: 'Ester',
		data: {"a":[{"x":178.02,"y":279},{"x":195.34,"y":269.002},{"x":212.66,"y":279,"l":"O"},{"x":195.34,"y":249,"l":"O"},{"x":229.98,"y":269.002}],"b":[{"b":0,"e":1},{"b":1,"e":3,"o":2},{"b":1,"e":2},{"b":2,"e":4}]}
	});
	group.templates.push({
		name: 'Ether',
		data: {"a":[{"x":186.68,"y":269},{"x":204.002,"y":259,"l":"O"},{"x":221.32,"y":269}],"b":[{"b":0,"e":1},{"b":1,"e":2}]}
	});
	group.templates.push({
		name: 'Imide',
		data: {"a":[{"x":169.36,"y":269.002},{"x":186.678,"y":258.998},{"x":186.678,"y":239.002,"l":"O"},{"x":204,"y":269.002,"l":"N"},{"x":204,"y":288.998},{"x":221.32,"y":258.998},{"x":238.64,"y":269.002},{"x":221.32,"y":239.002,"l":"O"}],"b":[{"b":0,"e":1},{"b":1,"e":3},{"b":1,"e":2,"o":2},{"b":3,"e":5},{"b":3,"e":4},{"b":5,"e":6},{"b":5,"e":7,"o":2}]}
	});
	group.templates.push({
		name: 'Isocyanate',
		data: {"a":[{"x":178.02,"y":264.002},{"x":195.34,"y":254,"l":"N"},{"x":212.662,"y":264.002},{"x":229.98,"y":274,"l":"O"}],"b":[{"b":0,"e":1},{"b":1,"e":2,"o":2},{"b":2,"e":3,"o":2}]}
	});
	group.templates.push({
		name: 'Isocyanide',
		data: {"a":[{"x":184,"y":264},{"c":1,"x":204.002,"y":264,"l":"N"},{"c":-1,"x":224,"y":264}],"b":[{"b":0,"e":1},{"b":1,"e":2,"o":3}]}
	});
	group.templates.push({
		name: 'Isothiocyanate',
		data: {"a":[{"x":178.02,"y":264},{"x":195.34,"y":254,"l":"N"},{"x":212.662,"y":264},{"x":229.98,"y":274,"l":"S"}],"b":[{"b":0,"e":1},{"b":1,"e":2,"o":2},{"b":2,"e":3,"o":2}]}
	});
	group.templates.push({
		name: 'Ketimine',
		data: {"a":[{"x":204,"y":273.998},{"x":204,"y":254.002,"l":"N"},{"x":221.32,"y":284.002},{"x":186.68,"y":284.002},{"x":221.32,"y":243.998}],"b":[{"b":0,"e":1,"o":2},{"b":0,"e":3},{"b":0,"e":2},{"b":1,"e":4}]}
	});
	group.templates.push({
		name: 'Nitrate',
		data: {"a":[{"x":178.02,"y":269},{"x":195.338,"y":279,"l":"O"},{"c":1,"x":212.66,"y":269,"l":"N"},{"c":-1,"x":229.98,"y":279,"l":"O"},{"x":212.66,"y":249,"l":"O"}],"b":[{"b":0,"e":1},{"b":1,"e":2},{"b":2,"e":3},{"b":2,"e":4,"o":2}]}
	});
	group.templates.push({
		name: 'Nitrile',
		data: {"a":[{"x":184,"y":264},{"x":204.002,"y":264},{"x":224,"y":264,"l":"N"}],"b":[{"b":0,"e":1},{"b":1,"e":2,"o":3}]}
	});
	group.templates.push({
		name: 'Nitro',
		data: {"a":[{"x":189,"y":263.998},{"c":1,"x":209.002,"y":263.998,"l":"N"},{"c":-1,"x":219,"y":281.32,"l":"O"},{"x":219,"y":246.68,"l":"O"}],"b":[{"b":0,"e":1},{"b":1,"e":3,"o":2},{"b":1,"e":2}]}
	});
	group.templates.push({
		name: 'Nitroso',
		data: {"a":[{"x":186.68,"y":269},{"x":203.998,"y":259,"l":"N"},{"x":221.32,"y":269,"l":"O"}],"b":[{"b":0,"e":1},{"b":1,"e":2,"o":2}]}
	});
	group.templates.push({
		name: 'Nitrosooxy',
		data: {"a":[{"x":178.018,"y":259},{"x":195.34,"y":269,"l":"O"},{"x":212.66,"y":259,"l":"N"},{"x":229.982,"y":269,"l":"O"}],"b":[{"b":0,"e":1},{"b":1,"e":2},{"b":2,"e":3,"o":2}]}
	});
	group.templates.push({
		name: 'Peroxy',
		data: {"a":[{"x":183.998,"y":246.68},{"x":194.002,"y":264.002,"l":"O"},{"x":213.998,"y":264.002,"l":"O"},{"x":224.002,"y":281.32}],"b":[{"b":0,"e":1},{"b":1,"e":2},{"b":2,"e":3}]}
	});
	group.templates.push({
		name: 'Phosphate',
		data: {"a":[{"x":204,"y":265.342,"l":"P"},{"x":221.322,"y":275.34,"l":"O"},{"x":204,"y":245.34,"l":"O"},{"x":186.682,"y":275.34,"l":"O"},{"x":194.002,"y":282.66,"l":"O"},{"x":238.642,"y":265.342},{"x":169.36,"y":265.342},{"x":174,"y":282.66}],"b":[{"b":0,"e":2,"o":2},{"b":0,"e":1},{"b":0,"e":3},{"b":0,"e":4},{"b":1,"e":5},{"b":3,"e":6},{"b":4,"e":7}]}
	});
	group.templates.push({
		name: 'Phosphino',
		data: {"a":[{"x":204,"y":255.34,"l":"P"},{"x":194.002,"y":272.66},{"x":186.678,"y":265.34},{"x":221.322,"y":265.34}],"b":[{"b":0,"e":2},{"b":0,"e":3},{"b":0,"e":1}]}
	});
	group.templates.push({
		name: 'Pyridyl',
		data: {"a":[{"x":178.018,"y":244},{"x":195.34,"y":254},{"x":212.66,"y":244},{"x":195.34,"y":274},{"x":229.982,"y":254},{"x":212.66,"y":284},{"x":229.982,"y":274,"l":"N"}],"b":[{"b":0,"e":1},{"b":1,"e":2,"o":2},{"b":1,"e":3},{"b":2,"e":4},{"b":5,"e":3,"o":2},{"b":4,"e":6,"o":2},{"b":6,"e":5}]}
	});
	group.templates.push({
		name: 'Sulfide',
		data: {"a":[{"x":203.998,"y":259,"l":"S"},{"x":186.68,"y":269},{"x":221.32,"y":269}],"b":[{"b":0,"e":1},{"b":0,"e":2}]}
	});
	group.templates.push({
		name: 'Sulfinyl',
		data: {"a":[{"x":186.68,"y":279},{"x":203.998,"y":268.998,"l":"S"},{"x":203.998,"y":249,"l":"O"},{"x":221.32,"y":279}],"b":[{"b":0,"e":1},{"b":1,"e":3},{"b":1,"e":2,"o":2}]}
	});
	group.templates.push({
		name: 'Sulfonyl',
		data: {"a":[{"x":204,"y":267.66,"l":"S"},{"x":194.002,"y":250.342,"l":"O"},{"x":213.998,"y":250.342,"l":"O"},{"x":186.68,"y":277.658},{"x":221.32,"y":277.658}],"b":[{"b":0,"e":3},{"b":0,"e":4},{"b":0,"e":1,"o":2},{"b":0,"e":2,"o":2}]}
	});
	group.templates.push({
		name: 'Thiocyanate',
		data: {"a":[{"x":178.018,"y":264.002},{"x":195.34,"y":254,"l":"S"},{"x":212.66,"y":264.002},{"x":229.982,"y":274,"l":"N"}],"b":[{"b":0,"e":1},{"b":1,"e":2},{"b":2,"e":3,"o":3}]}
	});
	d.push(group);
	
	group = {name:'Sugars (Hexoses)', templates:[]};
	group.templates.push({
		name: 'Allose <i>Fisher Projection</i>',
		data: {"a":[{"x":0,"y":-50,"l":"CHO"},{"x":0,"y":-30},{"x":0,"y":-10},{"x":20,"y":-30,"l":"O"},{"x":-20,"y":-30,"l":"H"},{"x":-20,"y":-10,"l":"H"},{"x":20,"y":-10,"l":"O"},{"x":0,"y":10},{"x":20,"y":10,"l":"O"},{"x":-20,"y":10,"l":"H"},{"x":0,"y":30},{"x":-20,"y":30,"l":"H"},{"x":20,"y":30,"l":"O"},{"x":0,"y":50,"l":"CH2OH"}],"b":[{"b":0,"e":1},{"b":1,"e":4},{"b":1,"e":3},{"b":1,"e":2},{"b":2,"e":5},{"b":2,"e":6},{"b":2,"e":7},{"b":7,"e":9},{"b":7,"e":8},{"b":7,"e":10},{"b":10,"e":11},{"b":10,"e":12},{"b":10,"e":13}]}
	});
	group.templates.push({
		name: 'Allose <i>Furanose Form</i>',
		data: {"a":[{"x":7.3205,"y":-13.6239,"l":"O"},{"x":-27.7677,"y":-1.3055},{"x":42.4087,"y":-1.3055},{"x":-14.3652,"y":18.6261},{"x":-27.7677,"y":-21.3055},{"x":-27.7677,"y":18.6945,"l":"H"},{"x":29.0062,"y":18.6261},{"x":62.4087,"y":-1.3055,"l":"O"},{"x":-14.3652,"y":38.6261,"l":"O"},{"x":-14.3652,"y":-1.3739,"l":"H"},{"x":-17.7677,"y":-38.6261,"l":"O"},{"x":-45.0882,"y":-31.3055},{"x":-9.2969,"y":-28.9755,"l":"H"},{"x":29.0062,"y":38.6261,"l":"O"},{"x":29.0062,"y":-1.3739,"l":"H"},{"x":-62.4087,"y":-21.3055,"l":"O"}],"b":[{"b":0,"e":1},{"b":1,"e":3},{"b":3,"e":6,"o":1},{"b":2,"e":6},{"b":2,"e":0},{"b":3,"e":9},{"b":3,"e":8},{"b":6,"e":14},{"b":6,"e":13},{"b":1,"e":4},{"b":1,"e":5},{"b":4,"e":11},{"b":11,"e":15},{"b":4,"e":10},{"b":4,"e":12},{"b":2,"e":7,"o":1}]}
	});
	group.templates.push({
		name: 'Allose <i>Pyranose Form</i>',
		data: {"a":[{"x":-36.6654,"y":-9.7292},{"x":-22.0845,"y":15.5237},{"x":-36.6654,"y":-29.7292,"l":"H"},{"x":-8.6254,"y":-2.3409},{"x":-54.1679,"y":-0.0514,"l":"O"},{"x":-22.0845,"y":35.5237,"l":"O"},{"x":-41.6882,"y":11.5623,"l":"H"},{"x":6.1279,"y":8.1324},{"x":-8.6254,"y":24.8818,"l":"H"},{"x":-23.6658,"y":-15.5237},{"x":19.5899,"y":-9.7292,"l":"O"},{"x":34.1679,"y":15.5237},{"x":6.1279,"y":-11.8676,"l":"H"},{"x":20.3041,"y":22.2404,"l":"O"},{"x":-23.6658,"y":-35.5237,"l":"O"},{"x":54.1679,"y":15.5237,"l":"O"}],"b":[{"b":0,"e":1},{"b":3,"e":0},{"b":10,"e":3},{"b":11,"e":7},{"b":11,"e":10},{"b":3,"e":8},{"b":7,"e":12},{"b":7,"e":13},{"b":3,"e":9},{"b":9,"e":14},{"b":0,"e":2},{"b":0,"e":4},{"b":1,"e":5},{"b":1,"e":6},{"b":1,"e":7,"o":1},{"b":11,"e":15,"o":1}]}
	});
	group.templates.push({
		name: 'Altrose <i>Fisher Projection</i>',
		data: {"a":[{"x":0,"y":-50,"l":"CHO"},{"x":0,"y":-30},{"x":-20,"y":-30,"l":"O"},{"x":0,"y":-10},{"x":20,"y":-30,"l":"H"},{"x":-20,"y":-10,"l":"H"},{"x":20,"y":-10,"l":"O"},{"x":0,"y":10},{"x":20,"y":10,"l":"O"},{"x":-20,"y":10,"l":"H"},{"x":0,"y":30},{"x":-20,"y":30,"l":"H"},{"x":0,"y":50,"l":"CH2OH"},{"x":20,"y":30,"l":"O"}],"b":[{"b":0,"e":1},{"b":1,"e":2},{"b":1,"e":4},{"b":1,"e":3},{"b":3,"e":5},{"b":3,"e":6},{"b":3,"e":7},{"b":7,"e":9},{"b":7,"e":8},{"b":7,"e":10},{"b":10,"e":11},{"b":10,"e":13},{"b":10,"e":12}]}
	});
	group.templates.push({
		name: 'Altrose <i>Furanose Form</i>',
		data: {"a":[{"x":7.3205,"y":-13.6239,"l":"O"},{"x":-27.7677,"y":-1.3055},{"x":42.4087,"y":-1.3055},{"x":-27.7677,"y":18.6945,"l":"H"},{"x":-14.3652,"y":18.6261},{"x":-27.7677,"y":-21.3055},{"x":29.0062,"y":18.6261},{"x":62.4087,"y":-1.3055,"l":"O"},{"x":-14.3652,"y":38.6261,"l":"O"},{"x":-14.3652,"y":-1.3739,"l":"H"},{"x":-9.2969,"y":-28.9755,"l":"H"},{"x":-45.0882,"y":-31.3055},{"x":-17.7677,"y":-38.6261,"l":"O"},{"x":29.0062,"y":-1.3739,"l":"O"},{"x":29.0062,"y":38.6261,"l":"H"},{"x":-62.4087,"y":-21.3055,"l":"O"}],"b":[{"b":0,"e":1},{"b":1,"e":4},{"b":4,"e":6,"o":1},{"b":2,"e":6},{"b":2,"e":0},{"b":4,"e":9},{"b":4,"e":8},{"b":6,"e":13},{"b":6,"e":14},{"b":1,"e":5},{"b":1,"e":3},{"b":5,"e":11},{"b":11,"e":15},{"b":5,"e":12},{"b":5,"e":10},{"b":2,"e":7,"o":1}]}
	});
	group.templates.push({
		name: 'Altrose <i>Pyranose Form</i>',
		data: {"a":[{"x":-36.6654,"y":-9.7292},{"x":-22.0845,"y":15.5237},{"x":-36.6654,"y":-29.7292,"l":"H"},{"x":-8.6254,"y":-2.3409},{"x":-54.1679,"y":-0.0514,"l":"O"},{"x":-22.0845,"y":35.5237,"l":"O"},{"x":6.1279,"y":8.1324},{"x":-41.6882,"y":11.5623,"l":"H"},{"x":-8.6254,"y":24.8818,"l":"H"},{"x":19.5899,"y":-9.7292,"l":"O"},{"x":-23.6658,"y":-15.5237},{"x":20.3041,"y":22.2404,"l":"H"},{"x":34.1679,"y":15.5237},{"x":6.1279,"y":-11.8676,"l":"O"},{"x":-23.6658,"y":-35.5237,"l":"O"},{"x":54.1679,"y":15.5237,"l":"O"}],"b":[{"b":0,"e":1},{"b":3,"e":0},{"b":9,"e":3},{"b":12,"e":6},{"b":12,"e":9},{"b":3,"e":8},{"b":6,"e":13},{"b":6,"e":11},{"b":3,"e":10},{"b":10,"e":14},{"b":0,"e":2},{"b":0,"e":4},{"b":1,"e":5},{"b":1,"e":7},{"b":1,"e":6,"o":1},{"b":12,"e":15,"o":1}]}
	});
	group.templates.push({
		name: 'Galactose <i>Fisher Projection</i>',
		data: {"a":[{"x":0,"y":-50,"l":"CHO"},{"x":0,"y":-30},{"x":20,"y":-30,"l":"O"},{"x":0,"y":-10},{"x":-20,"y":-30,"l":"H"},{"x":-20,"y":-10,"l":"O"},{"x":20,"y":-10,"l":"H"},{"x":0,"y":10},{"x":-20,"y":10,"l":"O"},{"x":20,"y":10,"l":"H"},{"x":0,"y":30},{"x":20,"y":30,"l":"O"},{"x":0,"y":50,"l":"CH2OH"},{"x":-20,"y":30,"l":"H"}],"b":[{"b":0,"e":1},{"b":1,"e":4},{"b":1,"e":2},{"b":1,"e":3},{"b":3,"e":5},{"b":3,"e":6},{"b":3,"e":7},{"b":7,"e":8},{"b":7,"e":9},{"b":7,"e":10},{"b":10,"e":13},{"b":10,"e":11},{"b":10,"e":12}]}
	});
	group.templates.push({
		name: 'Galactose <i>Furanose Form</i>',
		data: {"a":[{"x":8.6603,"y":-22.3184,"l":"O"},{"x":43.7485,"y":-10},{"x":-26.428,"y":-10},{"x":30.346,"y":9.9316},{"x":63.7485,"y":-10,"l":"O"},{"x":-43.7485,"y":0},{"x":-13.0255,"y":9.9316},{"x":-26.428,"y":-30,"l":"H"},{"x":30.346,"y":-10.0684,"l":"H"},{"x":30.346,"y":29.9316,"l":"O"},{"x":-63.7485,"y":0,"l":"O"},{"x":-53.7485,"y":-17.3205,"l":"H"},{"x":-43.7485,"y":20},{"x":-13.0255,"y":-10.0684,"l":"O"},{"x":-13.0255,"y":29.9316,"l":"H"},{"x":-61.069,"y":30,"l":"O"}],"b":[{"b":6,"e":3,"o":1},{"b":1,"e":3},{"b":1,"e":0},{"b":6,"e":13},{"b":6,"e":14},{"b":3,"e":8},{"b":3,"e":9},{"b":1,"e":4,"o":1},{"b":0,"e":2},{"b":2,"e":6},{"b":2,"e":7},{"b":2,"e":5},{"b":5,"e":12},{"b":12,"e":15},{"b":5,"e":11},{"b":5,"e":10}]}
	});
	group.templates.push({
		name: 'Galactose <i>Pyranose Form</i>',
		data: {"a":[{"x":-36.6654,"y":-9.7292},{"x":-36.6654,"y":-29.7292,"l":"O"},{"x":-54.1679,"y":-0.0514,"l":"H"},{"x":-22.0845,"y":15.5237},{"x":-8.6254,"y":-2.3409},{"x":-41.6882,"y":11.5623,"l":"O"},{"x":6.1279,"y":8.1324},{"x":-22.0845,"y":35.5237,"l":"H"},{"x":-8.6254,"y":24.8818,"l":"H"},{"x":-23.6658,"y":-15.5237},{"x":19.5899,"y":-9.7292,"l":"O"},{"x":34.1679,"y":15.5237},{"x":6.1279,"y":-11.8676,"l":"H"},{"x":20.3041,"y":22.2404,"l":"O"},{"x":-23.6658,"y":-35.5237,"l":"O"},{"x":54.1679,"y":15.5237,"l":"O"}],"b":[{"b":0,"e":3},{"b":4,"e":0},{"b":10,"e":4},{"b":11,"e":6},{"b":11,"e":10},{"b":4,"e":8},{"b":6,"e":12},{"b":6,"e":13},{"b":4,"e":9},{"b":9,"e":14},{"b":0,"e":1},{"b":0,"e":2},{"b":3,"e":7},{"b":3,"e":5},{"b":3,"e":6,"o":1},{"b":11,"e":15,"o":1}]}
	});
	group.templates.push({
		name: 'Glucose <i>Fisher Projection</i>',
		data: {"a":[{"x":0,"y":-50,"l":"CHO"},{"x":0,"y":-30},{"x":-20,"y":-30,"l":"H"},{"x":20,"y":-30,"l":"O"},{"x":0,"y":-10},{"x":20,"y":-10,"l":"H"},{"x":-20,"y":-10,"l":"O"},{"x":0,"y":10},{"x":-20,"y":10,"l":"H"},{"x":20,"y":10,"l":"O"},{"x":0,"y":30},{"x":-20,"y":30,"l":"H"},{"x":20,"y":30,"l":"O"},{"x":0,"y":50,"l":"CH2OH"}],"b":[{"b":0,"e":1},{"b":1,"e":2},{"b":1,"e":3},{"b":1,"e":4},{"b":4,"e":6},{"b":4,"e":5},{"b":4,"e":7},{"b":7,"e":8},{"b":7,"e":9},{"b":7,"e":10},{"b":10,"e":11},{"b":10,"e":12},{"b":10,"e":13}]}
	});
	group.templates.push({
		name: 'Glucose <i>Furanose Form</i>',
		data: {"a":[{"x":7.3205,"y":-13.6239,"l":"O"},{"x":42.4087,"y":-1.3055},{"x":-27.7677,"y":-1.3055},{"x":29.0062,"y":18.6261},{"x":62.4087,"y":-1.3055,"l":"O"},{"x":-27.7677,"y":18.6945,"l":"H"},{"x":-14.3652,"y":18.6261},{"x":-27.7677,"y":-21.3055},{"x":29.0062,"y":38.6261,"l":"O"},{"x":29.0062,"y":-1.3739,"l":"H"},{"x":-14.3652,"y":38.6261,"l":"H"},{"x":-14.3652,"y":-1.3739,"l":"O"},{"x":-9.2969,"y":-28.9755,"l":"H"},{"x":-17.7677,"y":-38.6261,"l":"O"},{"x":-45.0882,"y":-31.3055},{"x":-62.4087,"y":-21.3055,"l":"O"}],"b":[{"b":0,"e":2},{"b":2,"e":6},{"b":6,"e":3,"o":1},{"b":1,"e":3},{"b":1,"e":0},{"b":6,"e":11},{"b":6,"e":10},{"b":3,"e":9},{"b":3,"e":8},{"b":2,"e":7},{"b":2,"e":5},{"b":7,"e":14},{"b":14,"e":15},{"b":7,"e":13},{"b":7,"e":12},{"b":1,"e":4,"o":1}]}
	});
	group.templates.push({
		name: 'Glucose <i>Pyranose Form</i>',
		data: {"a":[{"x":-36.6654,"y":-9.7292},{"x":-54.1679,"y":-0.0514,"l":"O"},{"x":-36.6654,"y":-29.7292,"l":"H"},{"x":-8.6254,"y":-2.3409},{"x":-22.0845,"y":15.5237},{"x":19.5899,"y":-9.7292,"l":"O"},{"x":-8.6254,"y":24.8818,"l":"H"},{"x":-23.6658,"y":-15.5237},{"x":-22.0845,"y":35.5237,"l":"H"},{"x":6.1279,"y":8.1324},{"x":-41.6882,"y":11.5623,"l":"O"},{"x":34.1679,"y":15.5237},{"x":-23.6658,"y":-35.5237,"l":"O"},{"x":20.3041,"y":22.2404,"l":"O"},{"x":6.1279,"y":-11.8676,"l":"H"},{"x":54.1679,"y":15.5237,"l":"O"}],"b":[{"b":0,"e":4},{"b":3,"e":0},{"b":5,"e":3},{"b":11,"e":9},{"b":11,"e":5},{"b":3,"e":6},{"b":9,"e":14},{"b":9,"e":13},{"b":3,"e":7},{"b":7,"e":12},{"b":0,"e":2},{"b":0,"e":1},{"b":4,"e":8},{"b":4,"e":10},{"b":4,"e":9,"o":1},{"b":11,"e":15,"o":1}]}
	});
	group.templates.push({
		name: 'Gulose <i>Fisher Projection</i>',
		data: {"a":[{"x":0,"y":-50,"l":"CHO"},{"x":0,"y":-30},{"x":-20,"y":-30,"l":"H"},{"x":20,"y":-30,"l":"O"},{"x":0,"y":-10},{"x":-20,"y":-10,"l":"H"},{"x":20,"y":-10,"l":"O"},{"x":0,"y":10},{"x":-20,"y":10,"l":"O"},{"x":20,"y":10,"l":"H"},{"x":0,"y":30},{"x":-20,"y":30,"l":"H"},{"x":20,"y":30,"l":"O"},{"x":0,"y":50,"l":"CH2OH"}],"b":[{"b":0,"e":1},{"b":1,"e":2},{"b":1,"e":3},{"b":1,"e":4},{"b":4,"e":5},{"b":4,"e":6},{"b":4,"e":7},{"b":7,"e":8},{"b":7,"e":9},{"b":7,"e":10},{"b":10,"e":11},{"b":10,"e":12},{"b":10,"e":13}]}
	});
	group.templates.push({
		name: 'Gulose <i>Furanose Form</i>',
		data: {"a":[{"x":8.6603,"y":-22.3184,"l":"O"},{"x":43.7485,"y":-10},{"x":-26.428,"y":-10},{"x":63.7485,"y":-10,"l":"O"},{"x":30.346,"y":9.9316},{"x":-43.7485,"y":0},{"x":-13.0255,"y":9.9316},{"x":-26.428,"y":-30,"l":"H"},{"x":30.346,"y":29.9316,"l":"O"},{"x":30.346,"y":-10.0684,"l":"H"},{"x":-43.7485,"y":20},{"x":-53.7485,"y":-17.3205,"l":"H"},{"x":-63.7485,"y":0,"l":"O"},{"x":-13.0255,"y":29.9316,"l":"O"},{"x":-13.0255,"y":-10.0684,"l":"H"},{"x":-61.069,"y":30,"l":"O"}],"b":[{"b":6,"e":4,"o":1},{"b":1,"e":4},{"b":1,"e":0},{"b":6,"e":14},{"b":6,"e":13},{"b":4,"e":9},{"b":4,"e":8},{"b":1,"e":3,"o":1},{"b":0,"e":2},{"b":2,"e":6},{"b":2,"e":7},{"b":2,"e":5},{"b":5,"e":10},{"b":10,"e":15},{"b":5,"e":11},{"b":5,"e":12}]}
	});
	group.templates.push({
		name: 'Gulose <i>Pyranose Form</i>',
		data: {"a":[{"x":-36.6654,"y":-9.7292},{"x":-22.0845,"y":15.5237},{"x":-36.6654,"y":-29.7292,"l":"O"},{"x":-54.1679,"y":-0.0514,"l":"H"},{"x":-8.6254,"y":-2.3409},{"x":-41.6882,"y":11.5623,"l":"H"},{"x":-22.0845,"y":35.5237,"l":"O"},{"x":6.1279,"y":8.1324},{"x":-8.6254,"y":24.8818,"l":"H"},{"x":19.5899,"y":-9.7292,"l":"O"},{"x":-23.6658,"y":-15.5237},{"x":34.1679,"y":15.5237},{"x":6.1279,"y":-11.8676,"l":"H"},{"x":20.3041,"y":22.2404,"l":"O"},{"x":-23.6658,"y":-35.5237,"l":"O"},{"x":54.1679,"y":15.5237,"l":"O"}],"b":[{"b":0,"e":1},{"b":4,"e":0},{"b":9,"e":4},{"b":11,"e":7},{"b":11,"e":9},{"b":4,"e":8},{"b":7,"e":12},{"b":7,"e":13},{"b":4,"e":10},{"b":10,"e":14},{"b":0,"e":2},{"b":0,"e":3},{"b":1,"e":6},{"b":1,"e":5},{"b":1,"e":7,"o":1},{"b":11,"e":15,"o":1}]}
	});
	group.templates.push({
		name: 'Idose <i>Fisher Projection</i>',
		data: {"a":[{"x":0,"y":-50,"l":"CHO"},{"x":0,"y":-30},{"x":0,"y":-10},{"x":20,"y":-30,"l":"H"},{"x":-20,"y":-30,"l":"O"},{"x":0,"y":10},{"x":-20,"y":-10,"l":"H"},{"x":20,"y":-10,"l":"O"},{"x":0,"y":30},{"x":-20,"y":10,"l":"O"},{"x":20,"y":10,"l":"H"},{"x":-20,"y":30,"l":"H"},{"x":20,"y":30,"l":"O"},{"x":0,"y":50,"l":"CH2OH"}],"b":[{"b":0,"e":1},{"b":1,"e":4},{"b":1,"e":3},{"b":1,"e":2},{"b":2,"e":6},{"b":2,"e":7},{"b":2,"e":5},{"b":5,"e":9},{"b":5,"e":10},{"b":5,"e":8},{"b":8,"e":11},{"b":8,"e":12},{"b":8,"e":13}]}
	});
	group.templates.push({
		name: 'Idose <i>Furanose Form</i>',
		data: {"a":[{"x":8.6603,"y":-22.3184,"l":"O"},{"x":43.7485,"y":-10},{"x":-26.428,"y":-10},{"x":30.346,"y":9.9316},{"x":63.7485,"y":-10,"l":"O"},{"x":-43.7485,"y":0},{"x":-13.0255,"y":9.9316},{"x":-26.428,"y":-30,"l":"H"},{"x":30.346,"y":-10.0684,"l":"O"},{"x":30.346,"y":29.9316,"l":"H"},{"x":-53.7485,"y":-17.3205,"l":"H"},{"x":-43.7485,"y":20},{"x":-63.7485,"y":0,"l":"O"},{"x":-13.0255,"y":-10.0684,"l":"H"},{"x":-13.0255,"y":29.9316,"l":"O"},{"x":-61.069,"y":30,"l":"O"}],"b":[{"b":6,"e":3,"o":1},{"b":1,"e":3},{"b":1,"e":0},{"b":6,"e":13},{"b":6,"e":14},{"b":3,"e":8},{"b":3,"e":9},{"b":1,"e":4,"o":1},{"b":0,"e":2},{"b":2,"e":6},{"b":2,"e":7},{"b":2,"e":5},{"b":5,"e":11},{"b":11,"e":15},{"b":5,"e":10},{"b":5,"e":12}]}
	});
	group.templates.push({
		name: 'Idose <i>Pyranose Form</i>',
		data: {"a":[{"x":-36.6654,"y":-9.7292},{"x":-22.0845,"y":15.5237},{"x":-54.1679,"y":-0.0514,"l":"H"},{"x":-8.6254,"y":-2.3409},{"x":-36.6654,"y":-29.7292,"l":"O"},{"x":-41.6882,"y":11.5623,"l":"H"},{"x":-22.0845,"y":35.5237,"l":"O"},{"x":6.1279,"y":8.1324},{"x":-8.6254,"y":24.8818,"l":"H"},{"x":19.5899,"y":-9.7292,"l":"O"},{"x":-23.6658,"y":-15.5237},{"x":20.3041,"y":22.2404,"l":"H"},{"x":6.1279,"y":-11.8676,"l":"O"},{"x":34.1679,"y":15.5237},{"x":-23.6658,"y":-35.5237,"l":"O"},{"x":54.1679,"y":15.5237,"l":"O"}],"b":[{"b":0,"e":1},{"b":3,"e":0},{"b":9,"e":3},{"b":13,"e":7},{"b":13,"e":9},{"b":3,"e":8},{"b":7,"e":12},{"b":7,"e":11},{"b":3,"e":10},{"b":10,"e":14},{"b":0,"e":4},{"b":0,"e":2},{"b":1,"e":6},{"b":1,"e":5},{"b":1,"e":7,"o":1},{"b":13,"e":15,"o":1}]}
	});
	group.templates.push({
		name: 'Mannose <i>Fisher Projection</i>',
		data: {"a":[{"x":0,"y":-50,"l":"CHO"},{"x":0,"y":-30},{"x":20,"y":-30,"l":"H"},{"x":-20,"y":-30,"l":"O"},{"x":0,"y":-10},{"x":20,"y":-10,"l":"H"},{"x":-20,"y":-10,"l":"O"},{"x":0,"y":10},{"x":0,"y":30},{"x":-20,"y":10,"l":"H"},{"x":20,"y":10,"l":"O"},{"x":-20,"y":30,"l":"H"},{"x":0,"y":50,"l":"CH2OH"},{"x":20,"y":30,"l":"O"}],"b":[{"b":0,"e":1},{"b":1,"e":3},{"b":1,"e":2},{"b":1,"e":4},{"b":4,"e":6},{"b":4,"e":5},{"b":4,"e":7},{"b":7,"e":9},{"b":7,"e":10},{"b":7,"e":8},{"b":8,"e":11},{"b":8,"e":13},{"b":8,"e":12}]}
	});
	group.templates.push({
		name: 'Mannose <i>Furanose Form</i>',
		data: {"a":[{"x":7.3205,"y":-13.6239,"l":"O"},{"x":42.4087,"y":-1.3055},{"x":-27.7677,"y":-1.3055},{"x":29.0062,"y":18.6261},{"x":62.4087,"y":-1.3055,"l":"O"},{"x":-14.3652,"y":18.6261},{"x":-27.7677,"y":18.6945,"l":"H"},{"x":-27.7677,"y":-21.3055},{"x":29.0062,"y":38.6261,"l":"H"},{"x":29.0062,"y":-1.3739,"l":"O"},{"x":-14.3652,"y":-1.3739,"l":"O"},{"x":-14.3652,"y":38.6261,"l":"H"},{"x":-9.2969,"y":-28.9755,"l":"H"},{"x":-45.0882,"y":-31.3055},{"x":-17.7677,"y":-38.6261,"l":"O"},{"x":-62.4087,"y":-21.3055,"l":"O"}],"b":[{"b":0,"e":2},{"b":2,"e":5},{"b":5,"e":3,"o":1},{"b":1,"e":3},{"b":1,"e":0},{"b":5,"e":10},{"b":5,"e":11},{"b":3,"e":9},{"b":3,"e":8},{"b":2,"e":7},{"b":2,"e":6},{"b":7,"e":13},{"b":13,"e":15},{"b":7,"e":14},{"b":7,"e":12},{"b":1,"e":4,"o":1}]}
	});
	group.templates.push({
		name: 'Mannose <i>Pyranose Form</i>',
		data: {"a":[{"x":-36.6654,"y":-9.7292},{"x":-8.6254,"y":-2.3409},{"x":-36.6654,"y":-29.7292,"l":"H"},{"x":-54.1679,"y":-0.0514,"l":"O"},{"x":-22.0845,"y":15.5237},{"x":19.5899,"y":-9.7292,"l":"O"},{"x":-8.6254,"y":24.8818,"l":"H"},{"x":-23.6658,"y":-15.5237},{"x":6.1279,"y":8.1324},{"x":-22.0845,"y":35.5237,"l":"H"},{"x":-41.6882,"y":11.5623,"l":"O"},{"x":34.1679,"y":15.5237},{"x":-23.6658,"y":-35.5237,"l":"O"},{"x":6.1279,"y":-11.8676,"l":"O"},{"x":20.3041,"y":22.2404,"l":"H"},{"x":54.1679,"y":15.5237,"l":"O"}],"b":[{"b":0,"e":4},{"b":1,"e":0},{"b":5,"e":1},{"b":11,"e":8},{"b":11,"e":5},{"b":1,"e":6},{"b":8,"e":13},{"b":8,"e":14},{"b":1,"e":7},{"b":7,"e":12},{"b":0,"e":2},{"b":0,"e":3},{"b":4,"e":9},{"b":4,"e":10},{"b":4,"e":8,"o":1},{"b":11,"e":15,"o":1}]}
	});
	group.templates.push({
		name: 'Talose <i>Fisher Projection</i>',
		data: {"a":[{"x":0,"y":-50,"l":"CHO"},{"x":0,"y":-30},{"x":0,"y":-10},{"x":-20,"y":-30,"l":"O"},{"x":20,"y":-30,"l":"H"},{"x":-20,"y":-10,"l":"O"},{"x":20,"y":-10,"l":"H"},{"x":0,"y":10},{"x":20,"y":10,"l":"H"},{"x":0,"y":30},{"x":-20,"y":10,"l":"O"},{"x":20,"y":30,"l":"O"},{"x":0,"y":50,"l":"CH2OH"},{"x":-20,"y":30,"l":"H"}],"b":[{"b":0,"e":1},{"b":1,"e":3},{"b":1,"e":4},{"b":1,"e":2},{"b":2,"e":5},{"b":2,"e":6},{"b":2,"e":7},{"b":7,"e":10},{"b":7,"e":8},{"b":7,"e":9},{"b":9,"e":13},{"b":9,"e":11},{"b":9,"e":12}]}
	});
	group.templates.push({
		name: 'Talose <i>Furanose Form</i>',
		data: {"a":[{"x":8.6603,"y":-22.3184,"l":"O"},{"x":43.7485,"y":-10},{"x":-26.428,"y":-10},{"x":30.346,"y":9.9316},{"x":63.7485,"y":-10,"l":"O"},{"x":-13.0255,"y":9.9316},{"x":-26.428,"y":-30,"l":"H"},{"x":-43.7485,"y":0},{"x":30.346,"y":29.9316,"l":"H"},{"x":30.346,"y":-10.0684,"l":"O"},{"x":-13.0255,"y":29.9316,"l":"H"},{"x":-13.0255,"y":-10.0684,"l":"O"},{"x":-43.7485,"y":20},{"x":-53.7485,"y":-17.3205,"l":"H"},{"x":-63.7485,"y":0,"l":"O"},{"x":-61.069,"y":30,"l":"O"}],"b":[{"b":5,"e":3,"o":1},{"b":1,"e":3},{"b":1,"e":0},{"b":5,"e":11},{"b":5,"e":10},{"b":3,"e":9},{"b":3,"e":8},{"b":1,"e":4,"o":1},{"b":0,"e":2},{"b":2,"e":5},{"b":2,"e":6},{"b":2,"e":7},{"b":7,"e":12},{"b":12,"e":15},{"b":7,"e":13},{"b":7,"e":14}]}
	});
	group.templates.push({
		name: 'Talose <i>Pyranose Form</i>',
		data: {"a":[{"x":-36.6654,"y":-9.7292},{"x":-22.0845,"y":15.5237},{"x":-54.1679,"y":-0.0514,"l":"H"},{"x":-36.6654,"y":-29.7292,"l":"O"},{"x":-8.6254,"y":-2.3409},{"x":-41.6882,"y":11.5623,"l":"O"},{"x":-22.0845,"y":35.5237,"l":"H"},{"x":6.1279,"y":8.1324},{"x":19.5899,"y":-9.7292,"l":"O"},{"x":-8.6254,"y":24.8818,"l":"H"},{"x":-23.6658,"y":-15.5237},{"x":34.1679,"y":15.5237},{"x":20.3041,"y":22.2404,"l":"H"},{"x":6.1279,"y":-11.8676,"l":"O"},{"x":-23.6658,"y":-35.5237,"l":"O"},{"x":54.1679,"y":15.5237,"l":"O"}],"b":[{"b":0,"e":1},{"b":4,"e":0},{"b":8,"e":4},{"b":11,"e":7},{"b":11,"e":8},{"b":4,"e":9},{"b":7,"e":13},{"b":7,"e":12},{"b":4,"e":10},{"b":10,"e":14},{"b":0,"e":3},{"b":0,"e":2},{"b":1,"e":6},{"b":1,"e":5},{"b":1,"e":7,"o":1},{"b":11,"e":15,"o":1}]}
	});
	d.push(group);
	
	group = {name:'Sugars (Other Monosaccharides)', templates:[]};
	group.templates.push({
		name: 'Glyceraldehyde <i>Fisher Projection</i>',
		data: {"a":[{"x":0,"y":0},{"x":0,"y":-20,"l":"CHO"},{"x":0,"y":20,"l":"CH2OH"},{"x":-20,"y":0,"l":"H"},{"x":20,"y":0,"l":"O"}],"b":[{"b":0,"e":1},{"b":0,"e":2},{"b":0,"e":3},{"b":0,"e":4}]}
	});
	group.templates.push({
		name: 'Erythrose <i>Fisher Projection</i>',
		data: {"a":[{"x":0,"y":-30,"l":"CHO"},{"x":0,"y":-10},{"x":20,"y":-10,"l":"O"},{"x":0,"y":10},{"x":-20,"y":-10,"l":"H"},{"x":20,"y":10,"l":"O"},{"x":0,"y":30,"l":"CH2OH"},{"x":-20,"y":10,"l":"H"}],"b":[{"b":0,"e":1},{"b":1,"e":3},{"b":3,"e":6},{"b":3,"e":5},{"b":1,"e":2},{"b":1,"e":4},{"b":3,"e":7}]}
	});
	group.templates.push({
		name: 'Threose <i>Fisher Projection</i>',
		data: {"a":[{"x":0,"y":-30,"l":"CHO"},{"x":0,"y":-10},{"x":0,"y":10},{"x":20,"y":-10,"l":"H"},{"x":-20,"y":-10,"l":"O"},{"x":-20,"y":10,"l":"H"},{"x":20,"y":10,"l":"O"},{"x":0,"y":30,"l":"CH2OH"}],"b":[{"b":0,"e":1},{"b":1,"e":2},{"b":2,"e":7},{"b":2,"e":6},{"b":1,"e":3},{"b":1,"e":4},{"b":2,"e":5}]}
	});
	group.templates.push({
		name: 'Ribose <i>Fisher Projection</i>',
		data: {"a":[{"x":0,"y":-20},{"x":20,"y":-20,"l":"O"},{"x":0,"y":0},{"x":0,"y":-40,"l":"CHO"},{"x":-20,"y":-20,"l":"H"},{"x":20,"y":0,"l":"O"},{"x":-20,"y":0,"l":"H"},{"x":0,"y":20},{"x":0,"y":40,"l":"CH2OH"},{"x":20,"y":20,"l":"O"},{"x":-20,"y":20,"l":"H"}],"b":[{"b":0,"e":3},{"b":0,"e":2},{"b":2,"e":7},{"b":7,"e":8},{"b":0,"e":4},{"b":0,"e":1},{"b":2,"e":6},{"b":2,"e":5},{"b":7,"e":10},{"b":7,"e":9}]}
	});
	group.templates.push({
		name: 'Arabinose <i>Fisher Projection</i>',
		data: {"a":[{"x":0,"y":-20},{"x":0,"y":-40,"l":"CHO"},{"x":-20,"y":-20,"l":"O"},{"x":0,"y":0},{"x":20,"y":-20,"l":"H"},{"x":-20,"y":0,"l":"H"},{"x":20,"y":0,"l":"O"},{"x":0,"y":20},{"x":0,"y":40,"l":"CH2OH"},{"x":-20,"y":20,"l":"H"},{"x":20,"y":20,"l":"O"}],"b":[{"b":0,"e":1},{"b":0,"e":3},{"b":3,"e":7},{"b":7,"e":8},{"b":0,"e":2},{"b":0,"e":4},{"b":3,"e":5},{"b":3,"e":6},{"b":7,"e":9},{"b":7,"e":10}]}
	});
	group.templates.push({
		name: 'Xylose <i>Fisher Projection</i>',
		data: {"a":[{"x":0,"y":-20},{"x":0,"y":-40,"l":"CHO"},{"x":0,"y":0},{"x":-20,"y":-20,"l":"H"},{"x":20,"y":-20,"l":"O"},{"x":20,"y":0,"l":"H"},{"x":0,"y":20},{"x":-20,"y":0,"l":"O"},{"x":20,"y":20,"l":"O"},{"x":-20,"y":20,"l":"H"},{"x":0,"y":40,"l":"CH2OH"}],"b":[{"b":0,"e":1},{"b":0,"e":2},{"b":2,"e":6},{"b":6,"e":10},{"b":0,"e":3},{"b":0,"e":4},{"b":2,"e":7},{"b":2,"e":5},{"b":6,"e":9},{"b":6,"e":8}]}
	});
	group.templates.push({
		name: 'Lyxose <i>Fisher Projection</i>',
		data: {"a":[{"x":0,"y":-20},{"x":-20,"y":-20,"l":"O"},{"x":0,"y":-40,"l":"CHO"},{"x":20,"y":-20,"l":"H"},{"x":0,"y":0},{"x":20,"y":0,"l":"H"},{"x":0,"y":20},{"x":-20,"y":0,"l":"O"},{"x":20,"y":20,"l":"O"},{"x":-20,"y":20,"l":"H"},{"x":0,"y":40,"l":"CH2OH"}],"b":[{"b":0,"e":2},{"b":0,"e":4},{"b":4,"e":6},{"b":6,"e":10},{"b":0,"e":1},{"b":0,"e":3},{"b":4,"e":7},{"b":4,"e":5},{"b":6,"e":9},{"b":6,"e":8}]}
	});
	d.push(group);
	
	group = {name:'Nucleotides', templates:[]};
	group.templates.push({
		name: 'Adenine',
		data: {"a":[{"x":-32.709,"y":10},{"x":-20.9532,"y":26.1804,"l":"N"},{"x":-20.9532,"y":-6.1803,"l":"N"},{"x":-1.9321,"y":20},{"x":-1.9321,"y":0},{"x":15.3884,"y":30.0001,"l":"N"},{"x":15.3884,"y":-10},{"x":32.709,"y":20},{"x":15.3884,"y":-30,"l":"N"},{"x":32.709,"y":0,"l":"N"}],"b":[{"b":0,"e":1},{"b":1,"e":3},{"b":3,"e":4,"o":2},{"b":4,"e":2},{"b":2,"e":0,"o":2},{"b":3,"e":5},{"b":5,"e":7,"o":2},{"b":7,"e":9},{"b":9,"e":6,"o":2},{"b":6,"e":4},{"b":6,"e":8}]}
	});
	group.templates.push({
		name: 'Guanine',
		data: {"a":[{"x":-41.3692,"y":10},{"x":-29.6135,"y":-6.1804,"l":"N"},{"x":-29.6135,"y":26.1803,"l":"N"},{"x":-10.5924,"y":-0},{"x":-10.5924,"y":20},{"x":6.7282,"y":-10.0001},{"x":6.7282,"y":30,"l":"N"},{"x":6.7282,"y":-30,"l":"O"},{"x":24.0487,"y":-0,"l":"N"},{"x":24.0487,"y":20},{"x":41.3692,"y":30,"l":"N"}],"b":[{"b":0,"e":2},{"b":2,"e":4},{"b":4,"e":3,"o":2},{"b":3,"e":1},{"b":1,"e":0,"o":2},{"b":4,"e":6},{"b":6,"e":9,"o":2},{"b":9,"e":8},{"b":8,"e":5},{"b":5,"e":3},{"b":5,"e":7,"o":2},{"b":9,"e":10}]}
	});
	group.templates.push({
		name: 'Cytosine',
		data: {"a":[{"x":-8.6603,"y":-10},{"x":-8.6603,"y":-30,"l":"N"},{"x":-25.9808,"y":0},{"x":8.6603,"y":0,"l":"N"},{"x":-25.9808,"y":20},{"x":8.6603,"y":20},{"x":-8.6603,"y":30,"l":"N"},{"x":25.9808,"y":30,"l":"O"}],"b":[{"b":0,"e":2},{"b":2,"e":4,"o":2},{"b":4,"e":6},{"b":6,"e":5},{"b":5,"e":3},{"b":3,"e":0,"o":2},{"b":5,"e":7,"o":2},{"b":0,"e":1}]}
	});
	group.templates.push({
		name: 'Thymine',
		data: {"a":[{"x":0,"y":-10},{"x":17.3205,"y":0,"l":"N"},{"x":0,"y":-30,"l":"O"},{"x":-17.3205,"y":0},{"x":17.3205,"y":20},{"x":-17.3205,"y":20},{"x":-34.641,"y":-10},{"x":34.641,"y":30,"l":"O"},{"x":0,"y":30,"l":"N"}],"b":[{"b":0,"e":3},{"b":3,"e":5,"o":2},{"b":5,"e":8},{"b":8,"e":4},{"b":4,"e":1},{"b":1,"e":0},{"b":0,"e":2,"o":2},{"b":3,"e":6},{"b":4,"e":7,"o":2}]}
	});
	group.templates.push({
		name: 'Uracil',
		data: {"a":[{"x":-8.6603,"y":-10},{"x":-25.9808,"y":0},{"x":-8.6603,"y":-30,"l":"O"},{"x":8.6603,"y":0,"l":"N"},{"x":-25.9808,"y":20},{"x":8.6603,"y":20},{"x":-8.6603,"y":30,"l":"N"},{"x":25.9808,"y":30,"l":"O"}],"b":[{"b":0,"e":1},{"b":1,"e":4,"o":2},{"b":4,"e":6},{"b":6,"e":5},{"b":5,"e":3},{"b":3,"e":0},{"b":0,"e":2,"o":2},{"b":5,"e":7,"o":2}]}
	});
	group.templates.push({
		name: 'Ribonucleoside',
		data: {"a":[{"x":-14.2796,"y":-14.9551},{"c":-1,"x":-34.2796,"y":-14.9551,"l":"O"},{"x":-14.2796,"y":5.0449},{"x":9.5513,"y":-2.7359,"l":"O"},{"x":-5.177,"y":17.6345},{"x":33.3822,"y":5.045},{"x":24.2796,"y":17.6345},{"x":-15.177,"y":34.955,"l":"O"},{"x":33.3822,"y":-34.955,"l":"N"},{"x":34.2796,"y":34.955,"l":"O"}],"b":[{"b":3,"e":2},{"b":2,"e":4},{"b":4,"e":6,"o":1},{"b":5,"e":6},{"b":5,"e":3},{"b":4,"e":7},{"b":5,"e":8},{"b":2,"e":0},{"b":0,"e":1},{"b":6,"e":9}]}
	});
	group.templates.push({
		name: 'Ribonucleoside Monophosphate',
		data: {"a":[{"x":5.7204,"y":-14.955},{"x":-14.2796,"y":-14.955,"l":"O"},{"x":5.7204,"y":5.045},{"x":-34.2796,"y":-14.955,"l":"P"},{"x":14.823,"y":17.6345},{"x":29.5513,"y":-2.7358,"l":"O"},{"c":-1,"x":-54.2796,"y":-14.9551,"l":"O"},{"x":-34.2796,"y":-34.955,"l":"O"},{"c":-1,"x":-34.2796,"y":5.045,"l":"O"},{"x":4.823,"y":34.955,"l":"O"},{"x":44.2796,"y":17.6345},{"x":53.3822,"y":5.045},{"x":54.2796,"y":34.955,"l":"O"},{"x":53.3822,"y":-34.955,"l":"N"}],"b":[{"b":5,"e":2},{"b":2,"e":4},{"b":4,"e":10,"o":1},{"b":11,"e":10},{"b":11,"e":5},{"b":4,"e":9},{"b":11,"e":13},{"b":2,"e":0},{"b":0,"e":1},{"b":1,"e":3},{"b":3,"e":6},{"b":3,"e":7,"o":2},{"b":3,"e":8},{"b":10,"e":12}]}
	});
	group.templates.push({
		name: 'Ribonucleoside Diphosphate',
		data: {"a":[{"x":25.7204,"y":-14.955},{"x":5.7204,"y":-14.955,"l":"O"},{"x":25.7204,"y":5.045},{"x":-14.2796,"y":-14.955,"l":"P"},{"x":49.5513,"y":-2.7358,"l":"O"},{"x":34.823,"y":17.6345},{"c":-1,"x":-14.2796,"y":5.045,"l":"O"},{"x":-14.2796,"y":-34.955,"l":"O"},{"x":-34.2796,"y":-14.955,"l":"O"},{"x":73.3822,"y":5.045},{"x":64.2796,"y":17.6345},{"x":24.823,"y":34.955,"l":"O"},{"x":-54.2796,"y":-14.955,"l":"P"},{"x":73.3822,"y":-34.955,"l":"N"},{"x":74.2796,"y":34.9551,"l":"O"},{"c":-1,"x":-54.2796,"y":5.045,"l":"O"},{"x":-54.2796,"y":-34.955,"l":"O"},{"c":-1,"x":-74.2796,"y":-14.955,"l":"O"}],"b":[{"b":4,"e":2},{"b":2,"e":5},{"b":5,"e":10,"o":1},{"b":9,"e":10},{"b":9,"e":4},{"b":5,"e":11},{"b":9,"e":13},{"b":2,"e":0},{"b":0,"e":1},{"b":1,"e":3},{"b":3,"e":8},{"b":3,"e":7,"o":2},{"b":3,"e":6},{"b":10,"e":14},{"b":8,"e":12},{"b":12,"e":17},{"b":12,"e":16,"o":2},{"b":12,"e":15}]}
	});
	group.templates.push({
		name: 'Ribonucleoside Triphosphate',
		data: {"a":[{"x":45.7204,"y":-14.955},{"x":45.7204,"y":5.045},{"x":25.7204,"y":-14.955,"l":"O"},{"x":54.823,"y":17.6345},{"x":69.5513,"y":-2.7358,"l":"O"},{"x":5.7204,"y":-14.955,"l":"P"},{"x":44.823,"y":34.955,"l":"O"},{"x":84.2796,"y":17.6345},{"x":93.3822,"y":5.045},{"c":-1,"x":5.7204,"y":5.045,"l":"O"},{"x":-14.2796,"y":-14.955,"l":"O"},{"x":5.7204,"y":-34.955,"l":"O"},{"x":94.2796,"y":34.9551,"l":"O"},{"x":93.3822,"y":-34.955,"l":"N"},{"x":-34.2796,"y":-14.955,"l":"P"},{"c":-1,"x":-34.2796,"y":5.045,"l":"O"},{"x":-34.2796,"y":-34.955,"l":"O"},{"x":-54.2796,"y":-14.955,"l":"O"},{"x":-74.2796,"y":-14.955,"l":"P"},{"x":-74.2796,"y":-34.955,"l":"O"},{"c":-1,"x":-94.2796,"y":-14.955,"l":"O"},{"c":-1,"x":-74.2796,"y":5.045,"l":"O"}],"b":[{"b":4,"e":1},{"b":1,"e":3},{"b":3,"e":7,"o":1},{"b":8,"e":7},{"b":8,"e":4},{"b":3,"e":6},{"b":8,"e":13},{"b":1,"e":0},{"b":0,"e":2},{"b":2,"e":5},{"b":5,"e":10},{"b":5,"e":11,"o":2},{"b":5,"e":9},{"b":7,"e":12},{"b":10,"e":14},{"b":14,"e":17},{"b":14,"e":16,"o":2},{"b":14,"e":15},{"b":17,"e":18},{"b":18,"e":20},{"b":18,"e":19,"o":2},{"b":18,"e":21}]}
	});
	group.templates.push({
		name: 'Ribonucleotide chain form',
		data: {"a":[{"x":-13.8309,"y":-36.2948},{"x":-33.8309,"y":-36.2948,"l":"O"},{"x":-13.8309,"y":-16.2948},{"x":10,"y":-24.0756,"l":"O"},{"x":-4.7283,"y":-3.7052},{"x":33.8309,"y":-16.2948},{"x":24.7283,"y":-3.7052},{"x":-4.7283,"y":16.2948,"l":"O"},{"x":33.8309,"y":-56.2948,"l":"N"},{"x":24.7283,"y":16.2948,"l":"O"},{"x":-4.7283,"y":36.2948,"l":"P"},{"c":-1,"x":-4.7283,"y":56.2948,"l":"O"},{"c":-1,"x":15.2717,"y":36.2948,"l":"O"},{"x":-24.7283,"y":36.2948,"l":"O"}],"b":[{"b":3,"e":2},{"b":2,"e":4},{"b":4,"e":6,"o":1},{"b":5,"e":6},{"b":5,"e":3},{"b":4,"e":7},{"b":5,"e":8},{"b":2,"e":0},{"b":0,"e":1},{"b":6,"e":9},{"b":7,"e":10},{"b":10,"e":12},{"b":10,"e":13,"o":2},{"b":10,"e":11}]}
	});
	group.templates.push({
		name: 'Deoxyribonucleoside',
		data: {"a":[{"x":-13.8309,"y":-14.9551},{"c":-1,"x":-33.8309,"y":-14.9551,"l":"O"},{"x":-13.8309,"y":5.0449},{"x":10,"y":-2.7359,"l":"O"},{"x":-4.7283,"y":17.6345},{"x":33.8309,"y":5.045},{"x":24.7283,"y":17.6345},{"x":-14.7283,"y":34.955,"l":"O"},{"x":33.8309,"y":-34.955,"l":"N"}],"b":[{"b":3,"e":2},{"b":2,"e":4},{"b":4,"e":6,"o":1},{"b":5,"e":6},{"b":5,"e":3},{"b":4,"e":7},{"b":5,"e":8},{"b":2,"e":0},{"b":0,"e":1}]}
	});
	group.templates.push({
		name: 'Deoxyribonucleoside Monophosphate',
		data: {"a":[{"x":6.1691,"y":-14.955},{"x":-13.8309,"y":-14.955,"l":"O"},{"x":6.1691,"y":5.045},{"x":-33.8309,"y":-14.955,"l":"P"},{"x":30,"y":-2.7358,"l":"O"},{"x":15.2717,"y":17.6345},{"x":-33.8309,"y":-34.955,"l":"O"},{"c":-1,"x":-53.8309,"y":-14.9551,"l":"O"},{"c":-1,"x":-33.8309,"y":5.045,"l":"O"},{"x":53.8309,"y":5.045},{"x":5.2717,"y":34.955,"l":"O"},{"x":44.7283,"y":17.6345},{"x":53.8309,"y":-34.955,"l":"N"}],"b":[{"b":4,"e":2},{"b":2,"e":5},{"b":5,"e":11,"o":1},{"b":9,"e":11},{"b":9,"e":4},{"b":5,"e":10},{"b":9,"e":12},{"b":2,"e":0},{"b":0,"e":1},{"b":1,"e":3},{"b":3,"e":7},{"b":3,"e":6,"o":2},{"b":3,"e":8}]}
	});
	group.templates.push({
		name: 'Deoxyribonucleoside Diphosphate',
		data: {"a":[{"x":26.1691,"y":-14.955},{"x":6.1691,"y":-14.955,"l":"O"},{"x":26.1691,"y":5.045},{"x":-13.8309,"y":-14.955,"l":"P"},{"x":50,"y":-2.7358,"l":"O"},{"x":35.2717,"y":17.6345},{"c":-1,"x":-13.8309,"y":5.045,"l":"O"},{"x":-13.8309,"y":-34.955,"l":"O"},{"x":-33.8309,"y":-14.955,"l":"O"},{"x":73.8309,"y":5.045},{"x":64.7283,"y":17.6345},{"x":25.2717,"y":34.955,"l":"O"},{"x":-53.8309,"y":-14.955,"l":"P"},{"x":73.8309,"y":-34.955,"l":"N"},{"x":-53.8309,"y":-34.955,"l":"O"},{"c":-1,"x":-53.8309,"y":5.045,"l":"O"},{"c":-1,"x":-73.8309,"y":-14.955,"l":"O"}],"b":[{"b":4,"e":2},{"b":2,"e":5},{"b":5,"e":10,"o":1},{"b":9,"e":10},{"b":9,"e":4},{"b":5,"e":11},{"b":9,"e":13},{"b":2,"e":0},{"b":0,"e":1},{"b":1,"e":3},{"b":3,"e":8},{"b":3,"e":7,"o":2},{"b":3,"e":6},{"b":8,"e":12},{"b":12,"e":16},{"b":12,"e":14,"o":2},{"b":12,"e":15}]}
	});
	group.templates.push({
		name: 'Deoxyribonucleoside Triphosphate',
		data: {"a":[{"x":46.1691,"y":-14.955},{"x":26.1691,"y":-14.955,"l":"O"},{"x":46.1691,"y":5.045},{"x":6.1691,"y":-14.955,"l":"P"},{"x":70,"y":-2.7358,"l":"O"},{"x":55.2717,"y":17.6345},{"c":-1,"x":6.1691,"y":5.045,"l":"O"},{"x":-13.8309,"y":-14.955,"l":"O"},{"x":6.1691,"y":-34.955,"l":"O"},{"x":93.8309,"y":5.045},{"x":84.7283,"y":17.6345},{"x":45.2717,"y":34.955,"l":"O"},{"x":-33.8309,"y":-14.955,"l":"P"},{"x":93.8309,"y":-34.955,"l":"N"},{"x":-33.8309,"y":-34.955,"l":"O"},{"c":-1,"x":-33.8309,"y":5.045,"l":"O"},{"x":-53.8309,"y":-14.955,"l":"O"},{"x":-73.8309,"y":-14.955,"l":"P"},{"x":-73.8309,"y":-34.955,"l":"O"},{"c":-1,"x":-93.8309,"y":-14.955,"l":"O"},{"c":-1,"x":-73.8309,"y":5.045,"l":"O"}],"b":[{"b":4,"e":2},{"b":2,"e":5},{"b":5,"e":10,"o":1},{"b":9,"e":10},{"b":9,"e":4},{"b":5,"e":11},{"b":9,"e":13},{"b":2,"e":0},{"b":0,"e":1},{"b":1,"e":3},{"b":3,"e":7},{"b":3,"e":8,"o":2},{"b":3,"e":6},{"b":7,"e":12},{"b":12,"e":16},{"b":12,"e":14,"o":2},{"b":12,"e":15},{"b":16,"e":17},{"b":17,"e":19},{"b":17,"e":18,"o":2},{"b":17,"e":20}]}
	});
	group.templates.push({
		name: 'Deoxyribonucleotide chain form',
		data: {"a":[{"x":-13.8309,"y":-36.2948},{"x":-13.8309,"y":-16.2948},{"x":-33.8309,"y":-36.2948,"l":"O"},{"x":10,"y":-24.0756,"l":"O"},{"x":-4.7284,"y":-3.7052},{"x":33.8309,"y":-16.2948},{"x":24.7283,"y":-3.7052},{"x":-4.7284,"y":16.2948,"l":"O"},{"x":33.8309,"y":-56.2948,"l":"N"},{"x":-4.7284,"y":36.2948,"l":"P"},{"x":-24.7284,"y":36.2948,"l":"O"},{"c":-1,"x":-4.7284,"y":56.2948,"l":"O"},{"c":-1,"x":15.2716,"y":36.2948,"l":"O"}],"b":[{"b":3,"e":1},{"b":1,"e":4},{"b":4,"e":6,"o":1},{"b":5,"e":6},{"b":5,"e":3},{"b":4,"e":7},{"b":5,"e":8},{"b":1,"e":0},{"b":0,"e":2},{"b":7,"e":9},{"b":9,"e":12},{"b":9,"e":10,"o":2},{"b":9,"e":11}]}
	});
	group.templates.push({
		name: 'Phosphate',
		data: {"a":[{"x":-18.6602,"y":-0.6571,"l":"O"},{"x":1.3398,"y":-0.6571,"l":"P"},{"c":-1,"x":8.6025,"y":17.9776,"l":"O"},{"x":11.3398,"y":-17.9776,"l":"O"},{"c":-1,"x":18.6603,"y":9.3429,"l":"O"}],"b":[{"b":0,"e":1},{"b":1,"e":2},{"b":1,"e":3,"o":2},{"b":1,"e":4}]}
	});
	d.push(group);
	
	group = {name:'Other', templates:[]};
	group.templates.push({
		name: 'Adamantane',
		data: {"a":[{"x":-23.2311,"y":23.1027},{"x":-5.451,"y":14.1461},{"x":-12.329,"y":4.0241},{"x":12.3291,"y":23.1027},{"x":-5.451,"y":-4.0241},{"x":5.451,"y":13.1092},{"x":-12.329,"y":-14.1461},{"x":23.2311,"y":4.0241},{"x":5.451,"y":-23.1027},{"x":23.2311,"y":-14.1461}],"b":[{"b":0,"e":1},{"b":4,"e":8},{"b":8,"e":6},{"b":6,"e":2},{"b":0,"e":2},{"b":2,"e":5},{"b":5,"e":7},{"b":7,"e":3},{"b":1,"e":3},{"b":7,"e":9},{"b":8,"e":9},{"b":4,"e":1}]}
	});
	group.templates.push({
		name: 'Basketane',
		data: {"a":[{"x":8.0624,"y":-6.6984,"z":0.0009},{"x":-10.9369,"y":7.243,"z":0.0009},{"x":6.1745,"y":-24.4805,"z":0.0007},{"x":21.1864,"y":7.5359,"z":0.0002},{"x":4.6483,"y":26.1053,"z":0.0005},{"x":-21.1864,"y":5.6242,"z":-0.0003},{"x":-4.1138,"y":-26.1053,"z":-0.0005},{"x":10.9373,"y":5.9171,"z":-0.001},{"x":-5.8568,"y":24.4464,"z":-0.0007},{"x":-7.126,"y":-9.0969,"z":-0.0009}],"b":[{"b":0,"e":3},{"b":0,"e":2},{"b":0,"e":1},{"b":3,"e":7},{"b":3,"e":4},{"b":7,"e":8},{"b":7,"e":9},{"b":8,"e":4},{"b":8,"e":5},{"b":4,"e":1},{"b":1,"e":5},{"b":5,"e":9},{"b":9,"e":6},{"b":6,"e":2}]}
	});
	group.templates.push({
		name: 'Bishomotwistane',
		data: {"a":[{"x":-9.3245,"y":9.3434,"z":0.0012},{"x":-3.4592,"y":27.6792,"z":0.0006},{"x":-27.685,"y":3.7727,"z":0.0006},{"x":9.1603,"y":-9.3884,"z":0.0012},{"x":3.7793,"y":27.6792,"z":-0.0006},{"x":-27.6729,"y":-3.3575,"z":-0.0006},{"x":27.5776,"y":-3.773,"z":0.0006},{"x":3.3516,"y":-27.6792,"z":0.0006},{"x":9.4006,"y":9.313,"z":-0.0012},{"x":-9.3316,"y":-9.1718,"z":-0.0012},{"x":27.6851,"y":3.4533,"z":-0.0006},{"x":-3.7669,"y":-27.5837,"z":-0.0006}],"b":[{"b":0,"e":3},{"b":0,"e":1},{"b":3,"e":7},{"b":9,"e":8},{"b":9,"e":11},{"b":8,"e":4},{"b":1,"e":4},{"b":7,"e":11},{"b":0,"e":2},{"b":2,"e":5},{"b":5,"e":9},{"b":8,"e":10},{"b":10,"e":6},{"b":6,"e":3}]}
	});
	group.templates.push({
		name: 'Cuneane',
		data: {"a":[{"x":1.9228,"y":16.1562,"z":0.0003},{"x":-17.4892,"y":4.2593,"z":0.0007},{"x":21.6967,"y":1.7764,"z":0.0004},{"x":-1.9533,"y":6.9712,"z":-0.0008},{"x":-21.6967,"y":-5.7118,"z":-0.0004},{"x":-10.3535,"y":-14.8421,"z":0.0004},{"x":10.3842,"y":-16.1562,"z":0.0002},{"x":17.4892,"y":-8.1944,"z":-0.0007}],"b":[{"b":0,"e":3},{"b":0,"e":1},{"b":0,"e":2},{"b":3,"e":4},{"b":3,"e":7},{"b":1,"e":4},{"b":1,"e":5},{"b":2,"e":7},{"b":2,"e":6},{"b":4,"e":5},{"b":7,"e":6},{"b":5,"e":6}]}
	});
	group.templates.push({
		name: 'Diademan',
		data: {"a":[{"x":-13.929,"y":-20.6479,"z":-0.0001},{"x":-14.1084,"y":-8.6671,"z":0.0009},{"x":-23.7135,"y":3.8281,"z":0},{"x":7.2834,"y":-23.6595,"z":-0.0005},{"x":8.8036,"y":0.6176,"z":0.0009},{"x":-10.952,"y":21.9588,"z":-0.0002},{"x":22.0579,"y":-2.6695,"z":-0.0008},{"x":23.7134,"y":-14.0348,"z":0.0002},{"x":8.6453,"y":23.6595,"z":0.0004},{"x":13.6064,"y":18.472,"z":-0.0007}],"b":[{"b":0,"e":1},{"b":0,"e":2},{"b":0,"e":3},{"b":1,"e":2},{"b":1,"e":4},{"b":2,"e":5},{"b":3,"e":7},{"b":3,"e":6},{"b":4,"e":7},{"b":4,"e":8},{"b":5,"e":8},{"b":5,"e":9},{"b":7,"e":6},{"b":6,"e":9},{"b":8,"e":9}]}
	});
	group.templates.push({
		name: 'Diamantane',
		data: {"a":[{"x":-14.141,"y":21.12,"z":0},{"x":-29.3361,"y":18.0407,"z":0.0006},{"x":10.8073,"y":19.3824,"z":0.0006},{"x":-10.7711,"y":6.3888,"z":-0.0011},{"x":-27.8889,"y":-9.1493,"z":0.001},{"x":25.7558,"y":25.458,"z":0.0001},{"x":10.7709,"y":-6.3887,"z":0.0011},{"x":-10.8074,"y":-19.3824,"z":-0.0006},{"x":2.5813,"y":11.5032,"z":-0.0017},{"x":-25.7559,"y":-25.458,"z":-0.0001},{"x":-2.5814,"y":-11.5031,"z":0.0017},{"x":27.8887,"y":9.1493,"z":-0.001},{"x":14.1409,"y":-21.12,"z":-0},{"x":29.3361,"y":-18.0406,"z":-0.0006}],"b":[{"b":0,"e":3},{"b":0,"e":2},{"b":0,"e":1},{"b":3,"e":7},{"b":3,"e":8},{"b":2,"e":6},{"b":2,"e":5},{"b":7,"e":12},{"b":7,"e":9},{"b":6,"e":12},{"b":6,"e":10},{"b":12,"e":13},{"b":4,"e":1},{"b":4,"e":9},{"b":4,"e":10},{"b":11,"e":8},{"b":11,"e":5},{"b":11,"e":13}]}
	});
	group.templates.push({
		name: 'Dihomocubane',
		data: {"a":[{"x":-1.8424,"y":-19.703,"z":-0.0007},{"x":-16.4495,"y":-15.2664,"z":0.0004},{"x":19.0463,"y":-14.4468,"z":0.0001},{"x":-4.0421,"y":5.4673,"z":-0.0011},{"x":4.0428,"y":-5.4672,"z":0.0011},{"x":-29.925,"y":-0.6907,"z":0.0003},{"x":29.9251,"y":0.6911,"z":-0.0003},{"x":-19.0462,"y":14.4468,"z":-0.0001},{"x":16.4496,"y":15.2664,"z":-0.0004},{"x":1.8432,"y":19.703,"z":0.0007}],"b":[{"b":0,"e":3},{"b":0,"e":1},{"b":0,"e":2},{"b":3,"e":7},{"b":3,"e":8},{"b":4,"e":9},{"b":4,"e":1},{"b":4,"e":2},{"b":9,"e":7},{"b":9,"e":8},{"b":1,"e":5},{"b":2,"e":6},{"b":7,"e":5},{"b":8,"e":6}]}
	});
	group.templates.push({
		name: 'Homoadamantane',
		data: {"a":[{"x":-18.7389,"y":6.0639,"z":-0.0008},{"x":3.5456,"y":9.9613,"z":-0.0015},{"x":-25.4634,"y":21.2769,"z":0.0001},{"x":-23.4106,"y":-20.1097,"z":-0.0006},{"x":21.6364,"y":2.2969,"z":-0.0006},{"x":-9.571,"y":14.4702,"z":0.0011},{"x":-4.1032,"y":-23.0779,"z":0.0003},{"x":25.4634,"y":17.5276,"z":0.0002},{"x":19.5509,"y":-21.9076,"z":-0.0002},{"x":11.2348,"y":23.0779,"z":0.001},{"x":-9.4581,"y":-10.5918,"z":0.0014}],"b":[{"b":0,"e":3},{"b":0,"e":1},{"b":0,"e":2},{"b":6,"e":3},{"b":6,"e":8},{"b":6,"e":10},{"b":4,"e":1},{"b":4,"e":8},{"b":4,"e":7},{"b":5,"e":2},{"b":5,"e":10},{"b":5,"e":9},{"b":7,"e":9}]}
	});
	group.templates.push({
		name: 'Homocubane',
		data: {"a":[{"x":6.7729,"y":18.8807,"z":0.0007},{"x":7.3705,"y":-7.6566,"z":0.001},{"x":17.1692,"y":14.1707,"z":-0.0004},{"x":-18.1844,"y":14.3742,"z":0.0002},{"x":-16.6906,"y":-8.9747,"z":0.0006},{"x":18.1844,"y":-12.5556,"z":-0.0001},{"x":-7.3703,"y":9.4751,"z":-0.001},{"x":-15.1701,"y":-18.8807,"z":-0.0001},{"x":-3.1609,"y":-15.1039,"z":-0.0008}],"b":[{"b":0,"e":2},{"b":0,"e":3},{"b":0,"e":1},{"b":2,"e":6},{"b":2,"e":5},{"b":3,"e":6},{"b":3,"e":4},{"b":1,"e":5},{"b":1,"e":4},{"b":6,"e":8},{"b":5,"e":8},{"b":4,"e":7},{"b":8,"e":7}]}
	});
	group.templates.push({
		name: 'Pagodane',
		data: {"a":[{"x":-14.2104,"y":6.7147,"z":0.0011},{"x":-20.5671,"y":-2.7196,"z":-0.0008},{"x":20.5671,"y":2.7185,"z":0.0008},{"x":-21.1215,"y":-15.4349,"z":0.0015},{"x":-17.4963,"y":31.478,"z":0.0009},{"x":-28.3797,"y":-26.2067,"z":-0.0006},{"x":-24.7543,"y":20.706,"z":-0.0012},{"x":14.2099,"y":-6.7158,"z":-0.0011},{"x":28.3797,"y":26.2067,"z":0.0006},{"x":24.7543,"y":-20.706,"z":0.0012},{"x":-33.3155,"y":-26.6568,"z":0.0006},{"x":0.1614,"y":-37.1774,"z":0.0016},{"x":6.6932,"y":47.3504,"z":0.0004},{"x":-28.6453,"y":33.7758,"z":-0.0002},{"x":-6.6932,"y":-47.3504,"z":-0.0004},{"x":-0.1614,"y":37.1774,"z":-0.0016},{"x":17.4963,"y":-31.478,"z":-0.0009},{"x":21.1215,"y":15.4349,"z":-0.0015},{"x":33.3155,"y":26.6568,"z":-0.0006},{"x":28.6453,"y":-33.7758,"z":0.0002}],"b":[{"b":0,"e":1},{"b":0,"e":2},{"b":0,"e":3},{"b":0,"e":4},{"b":1,"e":7},{"b":1,"e":5},{"b":1,"e":6},{"b":2,"e":7},{"b":2,"e":9},{"b":2,"e":8},{"b":7,"e":16},{"b":7,"e":17},{"b":3,"e":11},{"b":3,"e":10},{"b":4,"e":12},{"b":4,"e":13},{"b":5,"e":14},{"b":5,"e":10},{"b":6,"e":15},{"b":6,"e":13},{"b":9,"e":11},{"b":9,"e":19},{"b":8,"e":12},{"b":8,"e":18},{"b":16,"e":14},{"b":16,"e":19},{"b":17,"e":15},{"b":17,"e":18},{"b":11,"e":14},{"b":12,"e":15}]}
	});
	group.templates.push({
		name: 'Peristylane',
		data: {"a":[{"x":-15.3409,"y":-17.2723,"z":-0.0002},{"x":4.8361,"y":-19.4524,"z":-0.0006},{"x":-13.4583,"y":-10.0681,"z":0.0008},{"x":-29.1197,"y":-8.9382,"z":-0.0008},{"x":7.9832,"y":-12.9467,"z":-0.0016},{"x":19.1897,"y":-13.5953,"z":0.0001},{"x":7.8828,"y":-7.7953,"z":0.001},{"x":-25.658,"y":4.3094,"z":0.0011},{"x":-13.5287,"y":-2.0397,"z":-0.0017},{"x":-34.3758,"y":8.6531,"z":-0},{"x":25.8177,"y":2.1503,"z":-0.0012},{"x":34.3758,"y":-2.1764,"z":-0.0001},{"x":13.585,"y":8.4881,"z":0.0015},{"x":-7.912,"y":19.4523,"z":0.0014},{"x":29.2903,"y":15.4332,"z":0.0007}],"b":[{"b":0,"e":1},{"b":0,"e":2},{"b":0,"e":3},{"b":1,"e":5},{"b":1,"e":4},{"b":2,"e":6},{"b":2,"e":7},{"b":5,"e":6},{"b":5,"e":11},{"b":6,"e":12},{"b":3,"e":8},{"b":3,"e":9},{"b":4,"e":8},{"b":4,"e":10},{"b":7,"e":9},{"b":7,"e":13},{"b":11,"e":10},{"b":11,"e":14},{"b":12,"e":13},{"b":12,"e":14}]}
	});
	group.templates.push({
		name: 'Porphine',
		data: {"a":[{"x":40.7025,"y":17.8205},{"x":20.9488,"y":20.9488,"l":"N"},{"x":49.7832,"y":-0},{"x":49.7817,"y":35.6396},{"x":17.8205,"y":40.7024},{"x":40.7025,"y":-17.8205},{"x":35.6396,"y":49.7817},{"x":0,"y":49.7832},{"x":49.7817,"y":-35.6396},{"x":20.9487,"y":-20.9487,"l":"N"},{"x":-17.8205,"y":40.7025},{"x":35.6396,"y":-49.7818},{"x":17.8205,"y":-40.7025},{"x":-35.6396,"y":49.7818},{"x":-20.9487,"y":20.9488,"l":"N"},{"x":-0,"y":-49.7832},{"x":-49.7817,"y":35.6396},{"x":-40.7025,"y":17.8205},{"x":-17.8205,"y":-40.7025},{"x":-49.7832,"y":0},{"x":-35.6396,"y":-49.7817},{"x":-20.9488,"y":-20.9487,"l":"N"},{"x":-40.7024,"y":-17.8205},{"x":-49.7818,"y":-35.6396}],"b":[{"b":0,"e":2},{"b":2,"e":5,"o":2},{"b":5,"e":8},{"b":8,"e":11,"o":2},{"b":5,"e":9},{"b":9,"e":12},{"b":12,"e":11},{"b":12,"e":15,"o":2},{"b":0,"e":1,"o":2},{"b":1,"e":4},{"b":4,"e":6},{"b":6,"e":3,"o":2},{"b":3,"e":0},{"b":4,"e":7,"o":2},{"b":7,"e":10},{"b":10,"e":13,"o":2},{"b":13,"e":16},{"b":16,"e":17,"o":2},{"b":17,"e":19},{"b":19,"e":22,"o":2},{"b":22,"e":23},{"b":23,"e":20,"o":2},{"b":20,"e":18},{"b":18,"e":15},{"b":18,"e":21,"o":2},{"b":21,"e":22},{"b":17,"e":14},{"b":14,"e":10}]}
	});
	group.templates.push({
		name: 'Propellaprismane',
		data: {"a":[{"x":15.8061,"y":23.5917,"z":0.0008},{"x":26.2297,"y":29.8832,"z":0.0014},{"x":23.1528,"y":15.0751,"z":-0.001},{"x":-23.3446,"y":21.8447,"z":0.0005},{"x":15.998,"y":-13.3281,"z":0.0013},{"x":32.9326,"y":10.6278,"z":0.0022},{"x":-15.998,"y":13.3281,"z":-0.0013},{"x":23.3446,"y":-21.8447,"z":-0.0005},{"x":38.3971,"y":15.7753,"z":-0.0015},{"x":-23.1528,"y":-15.0751,"z":0.001},{"x":-38.6203,"y":26.9893,"z":0.0009},{"x":26.452,"y":-12.882,"z":0.002},{"x":-26.452,"y":12.882,"z":-0.002},{"x":-15.8061,"y":-23.5917,"z":-0.0008},{"x":38.6192,"y":-26.9897,"z":-0.0009},{"x":48.1469,"y":-7.0099,"z":-0.0015},{"x":-38.3981,"y":-15.7758,"z":0.0015},{"x":-48.1469,"y":7.0099,"z":0.0015},{"x":-32.9318,"y":-10.628,"z":-0.0022},{"x":-26.2297,"y":-29.8832,"z":-0.0014}],"b":[{"b":0,"e":2},{"b":0,"e":3},{"b":0,"e":4},{"b":0,"e":1},{"b":4,"e":7},{"b":4,"e":9},{"b":4,"e":11},{"b":7,"e":13},{"b":7,"e":14},{"b":7,"e":2},{"b":2,"e":6},{"b":2,"e":8},{"b":3,"e":6},{"b":3,"e":10},{"b":3,"e":9},{"b":9,"e":13},{"b":9,"e":16},{"b":13,"e":6},{"b":13,"e":19},{"b":6,"e":12},{"b":14,"e":15},{"b":15,"e":8},{"b":11,"e":5},{"b":5,"e":1},{"b":10,"e":17},{"b":17,"e":16},{"b":12,"e":18},{"b":18,"e":19}]}
	});
	group.templates.push({
		name: 'Pyramidane',
		data: {"a":[{"x":-17.2378,"y":6.685,"z":0.0002},{"x":-4.7779,"y":2.0713,"z":-0.0009},{"x":1.0091,"y":-10.8859,"z":0.0002},{"x":4.7776,"y":10.8859,"z":0.0008},{"x":17.2379,"y":6.2731,"z":-0.0003}],"b":[{"b":0,"e":3},{"b":3,"e":4},{"b":4,"e":1},{"b":1,"e":0},{"b":0,"e":2},{"b":2,"e":1},{"b":4,"e":2},{"b":3,"e":2}]}
	});
	group.templates.push({
		name: 'Secocubane',
		data: {"a":[{"x":-12.7876,"y":0.469,"z":0.0009},{"x":-17.3436,"y":-13.3054,"z":0.0001},{"x":-3.3968,"y":18.2664,"z":0.0006},{"x":1.8735,"y":-18.2664,"z":-0.0005},{"x":-18.1791,"y":9.8903,"z":-0.0003},{"x":15.8203,"y":13.3053,"z":-0},{"x":18.1791,"y":-7.5251,"z":-0.0001},{"x":2.5011,"y":4.5517,"z":-0.001}],"b":[{"b":0,"e":1},{"b":0,"e":2},{"b":1,"e":4},{"b":1,"e":3},{"b":3,"e":6},{"b":3,"e":7},{"b":6,"e":5},{"b":2,"e":4},{"b":2,"e":5},{"b":4,"e":7},{"b":7,"e":5}]}
	});
	group.templates.push({
		name: 'Snoutane',
		data: {"a":[{"x":-6.3364,"y":20.3269,"z":-0.0001},{"x":7.6179,"y":19.8849,"z":0.0003},{"x":-8.926,"y":7.7702,"z":-0.0008},{"x":-20.0203,"y":9.1351,"z":0.0002},{"x":8.926,"y":8.2183,"z":0.001},{"x":20.0203,"y":6.8534,"z":0},{"x":8.4811,"y":-3.8285,"z":-0.0007},{"x":-9.6143,"y":-1.6023,"z":0.001},{"x":3.4219,"y":-20.3269,"z":-0.0003},{"x":-6.3552,"y":-19.124,"z":0.0006}],"b":[{"b":0,"e":1},{"b":0,"e":2},{"b":0,"e":3},{"b":1,"e":5},{"b":1,"e":4},{"b":2,"e":3},{"b":2,"e":6},{"b":3,"e":7},{"b":5,"e":4},{"b":5,"e":6},{"b":4,"e":7},{"b":6,"e":8},{"b":7,"e":9},{"b":8,"e":9}]}
	});
	group.templates.push({
		name: 'Tetraasterane',
		data: {"a":[{"x":7.9814,"y":-4.7005,"z":-0.0012},{"x":4.5426,"y":16.8926,"z":-0.0011},{"x":7.4295,"y":-23.9433,"z":-0.0007},{"x":16.8749,"y":22.9377,"z":0.0001},{"x":-19.7619,"y":17.8982,"z":-0.0005},{"x":19.7619,"y":-17.8982,"z":0.0005},{"x":-16.8749,"y":-22.9377,"z":-0.0001},{"x":24.425,"y":3.3596,"z":0.0004},{"x":-7.4295,"y":23.9433,"z":0.0007},{"x":-24.425,"y":-3.3596,"z":-0.0004},{"x":-4.5426,"y":-16.8926,"z":0.0011},{"x":-7.9814,"y":4.7005,"z":0.0012}],"b":[{"b":0,"e":2},{"b":0,"e":1},{"b":2,"e":6},{"b":2,"e":5},{"b":1,"e":4},{"b":1,"e":3},{"b":6,"e":9},{"b":6,"e":10},{"b":4,"e":9},{"b":4,"e":8},{"b":7,"e":5},{"b":7,"e":3},{"b":5,"e":10},{"b":3,"e":8},{"b":10,"e":11},{"b":8,"e":11}]}
	});
	group.templates.push({
		name: 'Triptycene',
		data: {"a":[{"x":-1.8416,"y":33.5953},{"x":-22.0802,"y":39.915},{"x":15.2565,"y":41.2332},{"x":-1.8416,"y":7.8124},{"x":-11.7283,"y":24.3677},{"x":-40.1864,"y":47.0877},{"x":25.5308,"y":24.329},{"x":29.5243,"y":50.9648},{"x":9.2469,"y":-6.8431},{"x":-10.1774,"y":-11.9997},{"x":-32.4321,"y":21.9251},{"x":9.2469,"y":15.1014},{"x":-57.6334,"y":41.2332},{"x":45.3042,"y":24.329},{"x":46.9713,"y":50.9648},{"x":14.0546,"y":-29.4079},{"x":-6.3003,"y":-36.1929},{"x":-47.9406,"y":27.7409},{"x":57.6334,"y":35.4563},{"x":8.045,"y":-50.9648}],"b":[{"b":0,"e":1},{"b":1,"e":4,"o":2},{"b":4,"e":11},{"b":0,"e":3},{"b":3,"e":8,"o":2},{"b":11,"e":8},{"b":11,"e":6},{"b":0,"e":2},{"b":6,"e":2,"o":2},{"b":2,"e":7},{"b":7,"e":14,"o":2},{"b":14,"e":18},{"b":18,"e":13,"o":2},{"b":6,"e":13},{"b":4,"e":10},{"b":10,"e":17,"o":2},{"b":17,"e":12},{"b":12,"e":5,"o":2},{"b":1,"e":5},{"b":3,"e":9},{"b":9,"e":16,"o":2},{"b":16,"e":19},{"b":19,"e":15,"o":2},{"b":8,"e":15}]}
	});
	group.templates.push({
		name: 'Twistane',
		data: {"a":[{"x":-9.5219,"y":-26.0012},{"x":7.2133,"y":-26.1571},{"x":-14.5434,"y":-10.0357},{"x":12.5334,"y":-10.2879},{"x":-28.325,"y":0.1651},{"x":13.5307,"y":10.0357},{"x":28.325,"y":-1.1706},{"x":-13.5501,"y":10.2879},{"x":8.5073,"y":26.0012},{"x":-8.228,"y":26.1571}],"b":[{"b":0,"e":1},{"b":1,"e":3},{"b":3,"e":6},{"b":6,"e":5},{"b":5,"e":8},{"b":8,"e":9},{"b":9,"e":7},{"b":7,"e":3},{"b":7,"e":4},{"b":4,"e":2},{"b":2,"e":0},{"b":2,"e":5}]}
	});
	d.push(group);
	
	group = {name:'Platonic Solids', templates:[]};
	group.templates.push({
		name: 'Cubane',
		data: {"a":[{"x":6.8116,"y":7.3797,"z":-0.001},{"x":15.7836,"y":14.3051,"z":0.0002},{"x":-16.3582,"y":9.4716,"z":-0.0005},{"x":7.3866,"y":-16.3971,"z":-0.0006},{"x":-7.3865,"y":16.3971,"z":0.0006},{"x":16.3582,"y":-9.4716,"z":0.0005},{"x":-15.7838,"y":-14.3053,"z":-0.0002},{"x":-6.8118,"y":-7.38,"z":0.001}],"b":[{"b":0,"e":1},{"b":1,"e":4},{"b":4,"e":2},{"b":2,"e":0},{"b":0,"e":3},{"b":2,"e":6},{"b":4,"e":7},{"b":1,"e":5},{"b":6,"e":3},{"b":3,"e":5},{"b":5,"e":7},{"b":7,"e":6}]}
	});
	group.templates.push({
		name: 'Dodecahedrane',
		data: {"a":[{"x":5.5634,"y":23.4684,"z":-0.0013},{"x":16.1591,"y":0.9427,"z":-0.0016},{"x":-19.3759,"y":19.7391,"z":-0.0011},{"x":15.6559,"y":31.7957,"z":-0.0002},{"x":-2.2312,"y":-16.7085,"z":-0.0016},{"x":32.801,"y":-4.6523,"z":-0.0007},{"x":-24.6961,"y":25.7614,"z":0.0001},{"x":-24.1925,"y":-5.0917,"z":-0.0013},{"x":32.4899,"y":14.4157,"z":0.0002},{"x":-3.0451,"y":33.2128,"z":0.0006},{"x":3.0451,"y":-33.2128,"z":-0.0006},{"x":24.6961,"y":-25.7618,"z":-0.0001},{"x":-32.801,"y":4.6523,"z":0.0007},{"x":-32.4904,"y":-14.4156,"z":-0.0002},{"x":24.1925,"y":5.0917,"z":0.0013},{"x":2.2307,"y":16.7087,"z":0.0016},{"x":-15.6564,"y":-31.7956,"z":0.0002},{"x":19.3759,"y":-19.7394,"z":0.0011},{"x":-16.1591,"y":-0.9427,"z":0.0016},{"x":-5.5634,"y":-23.4684,"z":0.0013}],"b":[{"b":0,"e":1},{"b":0,"e":2},{"b":0,"e":3},{"b":1,"e":4},{"b":1,"e":5},{"b":2,"e":7},{"b":2,"e":6},{"b":3,"e":8},{"b":3,"e":9},{"b":4,"e":7},{"b":4,"e":10},{"b":5,"e":8},{"b":5,"e":11},{"b":7,"e":13},{"b":6,"e":9},{"b":6,"e":12},{"b":8,"e":14},{"b":9,"e":15},{"b":10,"e":11},{"b":10,"e":16},{"b":11,"e":17},{"b":13,"e":12},{"b":13,"e":16},{"b":12,"e":18},{"b":14,"e":15},{"b":14,"e":17},{"b":15,"e":18},{"b":16,"e":19},{"b":17,"e":19},{"b":18,"e":19}]}
	});
	group.templates.push({
		name: 'Icosahedrane',
		data: {"a":[{"x":-2.1935,"y":16.5915,"z":0.0009},{"x":19.041,"y":14.7651,"z":0.0002},{"x":-2.7246,"y":23.1426,"z":-0.0004},{"x":-12.2778,"y":-6.837,"z":0.001},{"x":13.1368,"y":-3.7632,"z":0.001},{"x":-22.0806,"y":9.7916,"z":0.0002},{"x":12.2777,"y":6.837,"z":-0.001},{"x":22.0806,"y":-9.7917,"z":-0.0002},{"x":-13.1371,"y":3.7632,"z":-0.001},{"x":2.7243,"y":-23.1426,"z":0.0004},{"x":-19.0411,"y":-14.7652,"z":-0.0002},{"x":2.1933,"y":-16.5915,"z":-0.0009}],"b":[{"b":0,"e":4},{"b":4,"e":7},{"b":7,"e":6},{"b":6,"e":2},{"b":2,"e":0},{"b":0,"e":1},{"b":1,"e":2},{"b":1,"e":6},{"b":1,"e":7},{"b":1,"e":4},{"b":11,"e":8},{"b":8,"e":5},{"b":5,"e":3},{"b":3,"e":9},{"b":9,"e":11},{"b":11,"e":10},{"b":10,"e":9},{"b":10,"e":8},{"b":10,"e":5},{"b":10,"e":3},{"b":0,"e":3,"o":2},{"b":0,"e":5},{"b":5,"e":2},{"b":2,"e":8},{"b":8,"e":6},{"b":6,"e":11},{"b":11,"e":7},{"b":7,"e":9},{"b":9,"e":4},{"b":4,"e":3}]}
	});
	group.templates.push({
		name: 'Octahedrane',
		data: {"a":[{"x":17.605,"y":1.6441,"z":0.0003},{"x":-0.3217,"y":18.0965,"z":-0.0002},{"x":0.3216,"y":-18.0965,"z":0.0002},{"x":5.9408,"y":-3.8922,"z":-0.0009},{"x":-5.941,"y":3.8922,"z":0.0009},{"x":-17.605,"y":-1.6443,"z":-0.0003}],"b":[{"b":0,"e":1},{"b":1,"e":5},{"b":5,"e":2},{"b":2,"e":0},{"b":2,"e":4},{"b":1,"e":4},{"b":0,"e":3},{"b":2,"e":3},{"b":1,"e":3},{"b":5,"e":3},{"b":5,"e":4},{"b":0,"e":4}]}
	});
	group.templates.push({
		name: 'Tetrahedrane',
		data: {"a":[{"x":-10.8801,"y":10.377,"z":-0.0003},{"x":9.7747,"y":11.0081,"z":0.0004},{"x":-2.0447,"y":-11.0081,"z":0.0002},{"x":10.8801,"y":0.3176,"z":-0.0007}],"b":[{"b":0,"e":1},{"b":0,"e":3},{"b":3,"e":1},{"b":1,"e":2},{"b":2,"e":3},{"b":2,"e":0}]}
	});
	d.push(group);
	
	group = {name:'Ring Conformers', templates:[]};
	group.templates.push({
		name: '<b>4</b> Cyclobutane',
		data: {"a":[{"x":188,"y":262},{"x":198,"y":260},{"x":208,"y":272},{"x":220,"y":256}],"b":[{"b":0,"e":2},{"b":1,"e":0},{"b":2,"e":3},{"b":3,"e":1}]}
	});
	group.templates.push({
		name: '<b>5</b> Cyclopentane <i>Parallel Pentagon</i>',
		data: {"a":[{"x":204,"y":249},{"x":186.68,"y":259},{"x":221.32,"y":259},{"x":186.68,"y":279},{"x":221.32,"y":279}],"b":[{"b":0,"e":1},{"b":0,"e":2},{"b":1,"e":3},{"b":2,"e":4},{"b":3,"e":4}]}
	});
	group.templates.push({
		name: '<b>5</b> Cyclopentane',
		data: {"a":[{"x":187.5,"y":256},{"x":182.5,"y":272},{"x":214.5,"y":259},{"x":202.5,"y":265},{"x":225.5,"y":263}],"b":[{"b":0,"e":1},{"b":2,"e":0},{"b":1,"e":3},{"b":4,"e":2},{"b":3,"e":4}]}
	});
	group.templates.push({
		name: '<b>6</b> Cyclohexane <i>Boat</i>',
		data: {"a":[{"x":185.5,"y":254.5},{"x":201.5,"y":265.5},{"x":189.5,"y":273.5},{"x":222.5,"y":264.5},{"x":208.5,"y":273.5},{"x":220.5,"y":254.5}],"b":[{"b":0,"e":2},{"b":1,"e":0},{"b":2,"e":4},{"b":3,"e":1},{"b":4,"e":5},{"b":5,"e":3}]}
	});
	group.templates.push({
		name: '<b>6</b> Cyclohexane <i>Chair 1</i>',
		data: {"a":[{"x":179.754,"y":255.356},{"x":198.95,"y":260.414},{"x":189.736,"y":272.644},{"x":218.266,"y":255.356},{"x":209.05,"y":267.584},{"x":228.246,"y":272.644}],"b":[{"b":0,"e":2},{"b":1,"e":0},{"b":2,"e":4},{"b":3,"e":1},{"b":4,"e":5},{"b":5,"e":3}]}
	});
	group.templates.push({
		name: '<b>6</b> Cyclohexane <i>Chair 2</i>',
		data: {"a":[{"x":189.736,"y":255.356},{"x":209.05,"y":260.84},{"x":179.752,"y":272.644},{"x":228.248,"y":255.356},{"x":198.95,"y":267.158},{"x":218.262,"y":272.644}],"b":[{"b":0,"e":2},{"b":1,"e":0},{"b":2,"e":4},{"b":3,"e":1},{"b":4,"e":5},{"b":5,"e":3}]}
	});
	group.templates.push({
		name: '<b>6</b> Cyclohexane <i>Twist Boat</i>',
		data: {"a":[{"x":183.5,"y":258},{"x":196.5,"y":267},{"x":190.5,"y":274},{"x":219.5,"y":268},{"x":208.5,"y":265},{"x":224.5,"y":254}],"b":[{"b":0,"e":1},{"b":2,"e":0},{"b":1,"e":3},{"b":4,"e":2},{"b":3,"e":5},{"b":5,"e":4}]}
	});
	group.templates.push({
		name: '<b>7</b> Cycloheptane',
		data: {"a":[{"x":178,"y":254.5},{"x":177,"y":275.5},{"x":196,"y":256.5},{"x":201,"y":284.5},{"x":218,"y":243.5},{"x":217,"y":261.5},{"x":231,"y":257.5}],"b":[{"b":0,"e":1},{"b":2,"e":0},{"b":1,"e":3},{"b":4,"e":2},{"b":3,"e":5},{"b":6,"e":4},{"b":5,"e":6}]}
	});
	group.templates.push({
		name: '<b>8</b> Cyclooctane',
		data: {"a":[{"x":188.5,"y":239},{"x":171.5,"y":260},{"x":205.5,"y":248},{"x":180.5,"y":274},{"x":229.5,"y":245},{"x":201.5,"y":289},{"x":236.5,"y":270},{"x":223.5,"y":273}],"b":[{"b":0,"e":1},{"b":2,"e":0},{"b":1,"e":3},{"b":4,"e":2},{"b":3,"e":5},{"b":6,"e":4},{"b":5,"e":7},{"b":7,"e":6}]}
	});
	d.push(group);
	
	group = {name:'Stereocenters and Geometries', templates:[]};
	group.templates.push({
		name: 'Bent Away',
		data: {"a":[{"x":195.34,"y":279},{"x":212.66,"y":269.002},{"x":212.66,"y":249}],"b":[{"b":0,"e":1},{"b":1,"e":2}]}
	});
	group.templates.push({
		name: 'Bent Towards',
		data: {"a":[{"x":195.338,"y":279},{"x":212.66,"y":269.002},{"x":212.66,"y":249}],"b":[{"b":0,"e":1},{"b":1,"e":2}]}
	});
	group.templates.push({
		name: 'Generic Diastereocenter',
		data: {"a":[{"x":181.68,"y":268.998},{"x":198.998,"y":258.998},{"x":216.32,"y":268.998},{"x":209,"y":241.68},{"x":189,"y":241.68},{"x":206.322,"y":286.32},{"x":226.32,"y":286.32}],"b":[{"b":0,"e":1},{"b":1,"e":2},{"b":1,"e":4},{"b":1,"e":3},{"b":2,"e":5},{"b":2,"e":6}]}
	});
	group.templates.push({
		name: 'Generic Stereocenter',
		data: {"a":[{"x":190.34,"y":277.66},{"x":207.662,"y":267.662},{"x":217.66,"y":250.34},{"x":197.66,"y":250.34}],"b":[{"b":0,"e":1},{"b":1,"e":3},{"b":1,"e":2}]}
	});
	group.templates.push({
		name: 'Heptavalent 1',
		data: {"a":[{"x":185.34,"y":263.998},{"x":205.338,"y":263.998},{"x":205.338,"y":284},{"x":222.66,"y":254},{"x":197.34,"y":252.68},{"x":199.338,"y":276.32},{"x":205.338,"y":244},{"x":222.66,"y":274}],"b":[{"b":0,"e":1},{"b":1,"e":6},{"b":1,"e":2},{"b":1,"e":3},{"b":1,"e":7},{"b":1,"e":4},{"b":1,"e":5}]}
	});
	group.templates.push({
		name: 'Heptavalent 2',
		data: {"a":[{"x":186.68,"y":252.66},{"x":204.002,"y":262.658},{"x":221.32,"y":252.66},{"x":186.68,"y":272.658},{"x":194.002,"y":245.34},{"x":221.32,"y":272.658},{"x":214,"y":245.34},{"x":204.002,"y":282.66}],"b":[{"b":1,"e":0},{"b":1,"e":2},{"b":1,"e":5},{"b":1,"e":3},{"b":1,"e":4},{"b":1,"e":6},{"b":1,"e":7}]}
	});
	group.templates.push({
		name: 'Hexavalent',
		data: {"a":[{"x":203.998,"y":263.998},{"x":186.68,"y":274},{"x":221.32,"y":274},{"x":214,"y":281.32},{"x":194,"y":246.68},{"x":214,"y":246.68},{"x":194,"y":281.32}],"b":[{"b":0,"e":4},{"b":0,"e":5},{"b":0,"e":1},{"b":0,"e":6},{"b":0,"e":2},{"b":0,"e":3}]}
	});
	group.templates.push({
		name: 'Incomplete Diastereocenter 1',
		data: {"a":[{"x":186.68,"y":269},{"x":203.998,"y":259},{"x":203.998,"y":239},{"x":221.32,"y":269},{"x":221.32,"y":289}],"b":[{"b":0,"e":1},{"b":1,"e":2},{"b":1,"e":3},{"b":3,"e":4}]}
	});
	group.templates.push({
		name: 'Incomplete Diastereocenter 2',
		data: {"a":[{"x":186.68,"y":269.002},{"x":203.998,"y":258.998},{"x":221.32,"y":269.002},{"x":203.998,"y":239.002},{"x":221.32,"y":288.998}],"b":[{"b":0,"e":1},{"b":1,"e":3},{"b":1,"e":2},{"b":2,"e":4}]}
	});
	group.templates.push({
		name: 'Incomplete Diastereocenter 3',
		data: {"a":[{"x":186.68,"y":269},{"x":203.998,"y":259},{"x":221.32,"y":269},{"x":203.998,"y":239},{"x":221.32,"y":289}],"b":[{"b":0,"e":1},{"b":1,"e":3},{"b":1,"e":2},{"b":2,"e":4}]}
	});
	group.templates.push({
		name: 'Incomplete Diastereocenter 4',
		data: {"a":[{"x":186.68,"y":269},{"x":204.002,"y":259},{"x":204.002,"y":239},{"x":221.32,"y":269},{"x":221.32,"y":289}],"b":[{"b":0,"e":1},{"b":1,"e":2},{"b":1,"e":3},{"b":3,"e":4}]}
	});
	group.templates.push({
		name: 'Octahedral',
		data: {"a":[{"x":203.998,"y":244},{"x":203.998,"y":264},{"x":186.68,"y":254},{"x":186.68,"y":274},{"x":203.998,"y":284},{"x":221.32,"y":254},{"x":221.32,"y":274}],"b":[{"b":0,"e":1},{"b":1,"e":2},{"b":1,"e":5},{"b":1,"e":3},{"b":1,"e":6},{"b":1,"e":4}]}
	});
	group.templates.push({
		name: 'Octavalent 1',
		data: {"a":[{"x":204,"y":264.002},{"x":194,"y":281.32},{"x":221.322,"y":254},{"x":213.998,"y":246.68},{"x":213.998,"y":281.32},{"x":186.678,"y":254},{"x":186.678,"y":274},{"x":221.322,"y":274},{"x":194,"y":246.68}],"b":[{"b":0,"e":5},{"b":0,"e":6},{"b":0,"e":2},{"b":0,"e":7},{"b":0,"e":8},{"b":0,"e":3},{"b":0,"e":1},{"b":0,"e":4}]}
	});
	group.templates.push({
		name: 'Octavalent 2',
		data: {"a":[{"x":183.998,"y":264},{"x":204,"y":264},{"x":194.002,"y":246.682},{"x":221.32,"y":274},{"x":213.998,"y":281.318},{"x":186.68,"y":274},{"x":213.998,"y":246.682},{"x":224.002,"y":264},{"x":194.002,"y":281.318}],"b":[{"b":0,"e":1},{"b":1,"e":7},{"b":1,"e":2},{"b":1,"e":6},{"b":1,"e":5},{"b":1,"e":3},{"b":1,"e":8},{"b":1,"e":4}]}
	});
	group.templates.push({
		name: 'Square Planar',
		data: {"a":[{"x":186.68,"y":254},{"x":203.998,"y":264.002},{"x":186.68,"y":274},{"x":221.32,"y":254},{"x":221.32,"y":274}],"b":[{"b":1,"e":0},{"b":1,"e":2},{"b":1,"e":3},{"b":1,"e":4}]}
	});
	group.templates.push({
		name: 'Square Pyramidal',
		data: {"a":[{"x":204.002,"y":249},{"x":204.002,"y":268.998},{"x":186.68,"y":259},{"x":221.32,"y":259},{"x":221.32,"y":279},{"x":186.68,"y":279}],"b":[{"b":0,"e":1},{"b":1,"e":2},{"b":1,"e":3},{"b":1,"e":4},{"b":1,"e":5}]}
	});
	group.templates.push({
		name: 'Tetrahedral',
		data: {"a":[{"x":204.002,"y":265.338},{"x":221.32,"y":275.34},{"x":204.002,"y":245.34},{"x":214,"y":282.66},{"x":186.68,"y":275.34}],"b":[{"b":0,"e":2},{"b":0,"e":4},{"b":0,"e":1},{"b":0,"e":3}]}
	});
	group.templates.push({
		name: 'Trigonal Bipyramidal',
		data: {"a":[{"x":185.338,"y":263.998},{"x":205.34,"y":263.998},{"x":205.34,"y":284},{"x":222.662,"y":274},{"x":205.34,"y":244},{"x":222.662,"y":254}],"b":[{"b":0,"e":1},{"b":1,"e":4},{"b":1,"e":2},{"b":1,"e":5},{"b":1,"e":3}]}
	});
	group.templates.push({
		name: 'Trigonal Planar',
		data: {"a":[{"x":185.338,"y":263.998},{"x":205.34,"y":263.998},{"x":222.662,"y":254},{"x":222.662,"y":274}],"b":[{"b":0,"e":1},{"b":1,"e":2},{"b":1,"e":3}]}
	});
	group.templates.push({
		name: 'Trigonal Pyramidal',
		data: {"a":[{"x":186.68,"y":265.34},{"x":204.002,"y":255.34},{"x":214,"y":272.66},{"x":221.32,"y":265.34}],"b":[{"b":0,"e":1},{"b":1,"e":3},{"b":1,"e":2}]}
	});
	d.push(group);
	
	group = {name:'Vitamins', templates:[]};
	group.templates.push({
		name: 'Vitamin A',
		data: {"a":[{"x":51.9615,"y":33.6602},{"x":51.9615,"y":13.6602},{"x":69.282,"y":3.6602},{"x":34.641,"y":3.6602},{"x":86.6025,"y":13.6602},{"x":17.3205,"y":13.6602},{"x":103.9231,"y":3.6602,"l":"OH"},{"x":0,"y":3.6602},{"x":-17.3205,"y":13.6602},{"x":-17.3205,"y":33.6602},{"x":-34.641,"y":3.6602},{"x":-51.9615,"y":13.6602},{"x":-69.2821,"y":3.6602},{"x":-86.6025,"y":13.6602},{"x":-69.2821,"y":-16.3398},{"x":-86.6025,"y":33.6602},{"x":-103.9231,"y":3.6602},{"x":-49.2821,"y":-16.3398},{"x":-59.2821,"y":-33.6603},{"x":-86.6025,"y":-26.3398},{"x":-103.9231,"y":-16.3398}],"b":[{"b":0,"e":1},{"b":1,"e":2,"o":2},{"b":2,"e":4},{"b":4,"e":6},{"b":1,"e":3},{"b":3,"e":5,"o":2},{"b":5,"e":7},{"b":7,"e":8,"o":2},{"b":8,"e":9},{"b":8,"e":10},{"b":10,"e":11,"o":2},{"b":11,"e":12},{"b":12,"e":13,"o":2},{"b":13,"e":15},{"b":13,"e":16},{"b":16,"e":20},{"b":20,"e":19},{"b":19,"e":14},{"b":12,"e":14},{"b":14,"e":18},{"b":14,"e":17}]}
	});
	group.templates.push({
		name: 'Vitamin B<sub>12</sub> (Cyanocobalamin)',
		data: {"a":[{"c":1,"x":3.3371,"y":-66.8596,"l":"Co"},{"x":3.3371,"y":-101.4081,"l":"CN"},{"x":23.0279,"y":-45.765,"l":"N"},{"x":-11.166,"y":-45.6584,"l":"N"},{"x":19.8359,"y":-89.7705,"l":"N"},{"x":-3.2171,"y":38.9619,"l":"N"},{"x":-14.0155,"y":-84.9408,"l":"N"},{"x":23.0322,"y":-25.5761},{"x":41.9322,"y":-51.4369},{"x":-28.8696,"y":-53.9362},{"x":-11.8939,"y":-26.1046},{"x":39.3607,"y":-86.886},{"x":16.9262,"y":-109.7484},{"x":-14.614,"y":55.3971},{"x":15.9353,"y":44.7225},{"x":-17.558,"y":-104.1851},{"x":-30.3391,"y":-74.1948},{"x":41.9009,"y":-19.2102},{"x":5.5664,"y":-16.0075},{"x":53.7886,"y":-35.3435},{"x":49.8682,"y":-69.8304},{"x":-42.1304,"y":-38.4984},{"x":-42.2629,"y":-57.2596,"l":"H"},{"x":-31.6747,"y":-21.3799},{"x":48.7705,"y":-104.5222},{"x":34.6787,"y":-118.7709},{"x":-1.7374,"y":-116.6962},{"x":-2.5054,"y":71.3148,"l":"N"},{"x":16.3752,"y":64.7177},{"x":33.0317,"y":34.344},{"x":-37.8135,"y":-106.0053},{"x":-45.6892,"y":-87.5572},{"x":-49.3397,"y":-67.9516},{"x":47.9104,"y":-0.1344},{"x":5.3354,"y":3.9912},{"x":62.8086,"y":-17.493},{"x":73.7887,"y":-35.3435},{"x":-62.0654,"y":-40.1103},{"x":-24.2744,"y":-2.7994},{"x":-48.9952,"y":-11.3799},{"x":68.5611,"y":-107.4094},{"x":44.6789,"y":-136.0914},{"x":24.6787,"y":-136.0914},{"x":-4.8522,"y":-136.4521},{"x":-2.5054,"y":127.7894},{"x":33.9115,"y":74.3343},{"x":50.5679,"y":43.9606},{"x":-48.0763,"y":-123.1714},{"x":-62.2078,"y":-76.2816},{"x":-63.5787,"y":-96.4996},{"x":67.3099,"y":4.73},{"x":-73.4289,"y":-23.6522,"l":"CONH2"},{"x":-48.9952,"y":8.6201},{"x":80.9568,"y":-91.7139},{"x":64.6788,"y":-136.0914,"l":"CONH2"},{"x":-21.4629,"y":133.9404,"l":"O"},{"x":-11.6748,"y":118.62},{"x":51.0078,"y":63.9557},{"x":67.6643,"y":33.5821},{"x":-38.0763,"y":-140.4919},{"x":-80.2678,"y":-85.4781,"l":"CONH2"},{"x":81.2223,"y":-9.6382,"l":"CONH2"},{"x":-66.3158,"y":18.6201},{"x":100.9568,"y":-91.7139,"l":"CONH2"},{"x":-40.8672,"y":127.8124},{"x":-31.6748,"y":118.62},{"x":-11.6748,"y":98.62,"l":"O"},{"x":68.5441,"y":73.5724},{"x":-48.0763,"y":-157.8124,"l":"CONH2"},{"x":-83.6363,"y":8.6201,"l":"O"},{"x":-66.3158,"y":38.62,"l":"N"},{"x":-40.8672,"y":147.8124},{"x":-31.6748,"y":98.62,"l":"O"},{"x":-83.6363,"y":48.62},{"x":-58.1877,"y":157.8124,"l":"O"},{"x":-48.9953,"y":88.62,"l":"P"},{"x":-83.6363,"y":68.62},{"x":-38.9953,"y":71.2995,"l":"O"},{"x":-66.3158,"y":78.62,"l":"O"},{"x":-58.9953,"y":105.9405,"l":"O"},{"x":-100.9568,"y":78.62}],"b":[{"b":20,"e":11},{"b":8,"e":20,"o":2},{"b":11,"e":4,"o":2},{"b":11,"e":24},{"b":19,"e":8},{"b":2,"e":8},{"b":4,"e":0,"o":0},{"b":12,"e":4},{"b":24,"e":40},{"b":24,"e":25},{"b":19,"e":36},{"b":17,"e":19},{"b":19,"e":35},{"b":2,"e":0,"o":0},{"b":2,"e":7,"o":2},{"b":3,"e":0},{"b":6,"e":0,"o":0},{"b":25,"e":12},{"b":12,"e":26,"o":2},{"b":40,"e":53},{"b":25,"e":41},{"b":25,"e":42},{"b":17,"e":33},{"b":7,"e":17},{"b":18,"e":7},{"b":3,"e":10},{"b":3,"e":9},{"b":15,"e":6,"o":2},{"b":6,"e":16},{"b":15,"e":26},{"b":26,"e":43},{"b":53,"e":63},{"b":41,"e":54},{"b":33,"e":50},{"b":18,"e":34},{"b":23,"e":10},{"b":9,"e":21},{"b":9,"e":22},{"b":9,"e":16},{"b":30,"e":15},{"b":16,"e":32},{"b":16,"e":31},{"b":50,"e":61},{"b":21,"e":23},{"b":23,"e":39},{"b":23,"e":38},{"b":21,"e":37},{"b":31,"e":30},{"b":30,"e":47},{"b":31,"e":48},{"b":31,"e":49},{"b":39,"e":52},{"b":37,"e":51},{"b":47,"e":59},{"b":49,"e":60},{"b":52,"e":62},{"b":59,"e":68},{"b":62,"e":70},{"b":62,"e":69,"o":2},{"b":70,"e":73},{"b":73,"e":76},{"b":76,"e":80},{"b":76,"e":78},{"b":78,"e":75},{"b":75,"e":72},{"b":75,"e":77,"o":2},{"b":75,"e":79},{"b":72,"e":65},{"b":65,"e":56},{"b":56,"e":66},{"b":56,"e":44},{"b":65,"e":64},{"b":64,"e":55},{"b":44,"e":55},{"b":64,"e":71},{"b":71,"e":74},{"b":44,"e":27},{"b":27,"e":28},{"b":28,"e":14},{"b":14,"e":5},{"b":5,"e":13,"o":2},{"b":13,"e":27},{"b":28,"e":45,"o":2},{"b":45,"e":57},{"b":57,"e":46,"o":2},{"b":46,"e":29},{"b":29,"e":14,"o":2},{"b":46,"e":58},{"b":57,"e":67},{"b":0,"e":5,"o":0},{"b":10,"e":18,"o":2},{"b":0,"e":1}]}
	});
	group.templates.push({
		name: 'Vitamin B<sub>1</sub>',
		data: {"a":[{"x":24.1354,"y":-28.8488},{"x":19.9771,"y":-9.2859},{"x":33.3597,"y":5.577},{"c":1,"x":1.7062,"y":-1.1512,"l":"N"},{"x":53.2502,"y":3.4865},{"x":23.3597,"y":22.8975,"l":"S"},{"x":3.7968,"y":18.7393},{"x":-15.6143,"y":-11.1512},{"x":65.0059,"y":19.6668},{"x":-32.9348,"y":-1.1512},{"x":84.8963,"y":17.5762,"l":"OH"},{"x":-32.9348,"y":18.8488},{"x":-50.2553,"y":-11.1512},{"x":-50.2553,"y":28.8488,"l":"N"},{"x":-15.6143,"y":28.8488,"l":"NH2"},{"x":-67.5758,"y":-1.1512,"l":"N"},{"x":-67.5758,"y":18.8488},{"x":-84.8963,"y":28.8488}],"b":[{"b":0,"e":1},{"b":1,"e":2,"o":2},{"b":2,"e":4},{"b":4,"e":8},{"b":8,"e":10},{"b":2,"e":5},{"b":5,"e":6},{"b":6,"e":3,"o":2},{"b":1,"e":3},{"b":3,"e":7},{"b":7,"e":9},{"b":9,"e":11,"o":2},{"b":11,"e":14},{"b":11,"e":13},{"b":13,"e":16,"o":2},{"b":16,"e":17},{"b":16,"e":15},{"b":15,"e":12,"o":2},{"b":9,"e":12}]}
	});
	group.templates.push({
		name: 'Vitamin B<sub>3</sub> (Niacin)',
		data: {"a":[{"x":-17.3205,"y":30,"l":"N"},{"x":0,"y":20},{"x":-34.641,"y":20},{"x":0,"y":0},{"x":-34.641,"y":0},{"x":-17.3205,"y":-10},{"x":17.3205,"y":-10},{"x":17.3205,"y":-30,"l":"O"},{"x":34.641,"y":0}],"b":[{"b":0,"e":1,"o":2},{"b":1,"e":3},{"b":3,"e":5,"o":2},{"b":5,"e":4},{"b":4,"e":2,"o":2},{"b":2,"e":0},{"b":3,"e":6},{"b":6,"e":8},{"b":6,"e":7,"o":2}]}
	});
	group.templates.push({
		name: 'Vitamin B<sub>5</sub>',
		data: {"a":[{"x":-15.9808,"y":23.6603,"l":"H"},{"x":-25.9808,"y":6.3397},{"x":-8.6603,"y":-3.6603},{"x":-35.9808,"y":23.6603,"l":"OH"},{"x":-43.3013,"y":-3.6603},{"x":-8.6603,"y":-23.6603,"l":"O"},{"x":8.6602,"y":6.3397,"l":"NH"},{"x":-53.3013,"y":-20.9808},{"x":-60.6218,"y":6.3397},{"x":-33.3013,"y":-20.9808},{"x":25.9807,"y":-3.6603},{"x":-77.9423,"y":-3.6603,"l":"OH"},{"x":43.3012,"y":6.3397},{"x":60.6218,"y":-3.6603},{"x":77.9423,"y":6.3397,"l":"OH"},{"x":60.6218,"y":-23.6603,"l":"O"}],"b":[{"b":1,"e":0},{"b":1,"e":3},{"b":1,"e":2},{"b":2,"e":5,"o":2},{"b":2,"e":6},{"b":6,"e":10},{"b":10,"e":12},{"b":12,"e":13},{"b":13,"e":14},{"b":13,"e":15,"o":2},{"b":1,"e":4},{"b":4,"e":9},{"b":4,"e":7},{"b":4,"e":8},{"b":8,"e":11}]}
	});
	group.templates.push({
		name: 'Vitamin B<sub>6</sub>',
		data: {"a":[{"x":-43.3012,"y":-10},{"x":-25.9808,"y":0},{"x":-25.9808,"y":20,"l":"N"},{"x":-8.6602,"y":-10},{"x":-8.6602,"y":30},{"x":8.6602,"y":0},{"x":-8.6602,"y":-30,"l":"OH"},{"x":8.6602,"y":20},{"x":25.9808,"y":-10},{"x":25.9808,"y":30},{"x":43.3012,"y":0,"l":"OH"},{"x":43.3012,"y":20,"l":"OH"}],"b":[{"b":0,"e":1},{"b":1,"e":2,"o":2},{"b":2,"e":4},{"b":4,"e":7,"o":2},{"b":7,"e":9},{"b":9,"e":11},{"b":7,"e":5},{"b":5,"e":8},{"b":8,"e":10},{"b":5,"e":3,"o":2},{"b":1,"e":3},{"b":3,"e":6}]}
	});
	group.templates.push({
		name: 'Vitamin B<sub>7</sub>',
		data: {"a":[{"x":-65.6493,"y":26.9066,"l":"H"},{"x":-52.2667,"y":12.0436},{"x":-42.2667,"y":29.3641},{"x":-38.8841,"y":-2.8193},{"x":-70.5376,"y":3.9089,"l":"NH"},{"x":-22.7037,"y":25.2059,"l":"S"},{"x":-48.8841,"y":-20.1398,"l":"NH"},{"x":-25.5015,"y":-17.6822,"l":"H"},{"x":-20.6132,"y":5.3155},{"x":-68.447,"y":-15.9815},{"x":-3.2927,"y":-4.6845},{"x":-83.3099,"y":-29.3641,"l":"O"},{"x":14.0278,"y":5.3155},{"x":31.3483,"y":-4.6845},{"x":48.6689,"y":5.3155},{"x":65.9894,"y":-4.6845},{"x":65.9894,"y":-24.6845,"l":"O"},{"x":83.3099,"y":5.3155,"l":"OH"}],"b":[{"b":1,"e":0},{"b":1,"e":2},{"b":2,"e":5},{"b":5,"e":8},{"b":8,"e":10},{"b":10,"e":12},{"b":12,"e":13},{"b":13,"e":14},{"b":14,"e":15},{"b":15,"e":17},{"b":15,"e":16,"o":2},{"b":8,"e":3},{"b":1,"e":3},{"b":3,"e":7},{"b":3,"e":6},{"b":6,"e":9},{"b":9,"e":11,"o":2},{"b":9,"e":4},{"b":1,"e":4}]}
	});
	group.templates.push({
		name: 'Vitamin B<sub>9</sub>',
		data: {"a":[{"x":-147.2244,"y":50,"l":"NH2"},{"x":-129.9039,"y":40},{"x":-129.9039,"y":20,"l":"N"},{"x":-112.5833,"y":50,"l":"N"},{"x":-112.5833,"y":10},{"x":-95.2628,"y":40},{"x":-95.2628,"y":20},{"x":-112.5833,"y":-10,"l":"OH"},{"x":-77.9423,"y":50,"l":"N"},{"x":-77.9423,"y":10,"l":"N"},{"x":-60.6218,"y":40},{"x":-60.6218,"y":20},{"x":-43.3013,"y":10},{"x":-25.9808,"y":20,"l":"NH"},{"x":-8.6603,"y":10},{"x":-8.6603,"y":-10},{"x":8.6602,"y":20},{"x":8.6602,"y":-20},{"x":25.9808,"y":10},{"x":25.9808,"y":-10},{"x":43.3013,"y":-20},{"x":43.3013,"y":-40,"l":"O"},{"x":60.6218,"y":-10,"l":"NH"},{"x":77.9423,"y":-20},{"x":95.2628,"y":-10},{"x":77.9423,"y":-40},{"x":112.5834,"y":-20},{"x":60.6218,"y":-50,"l":"O"},{"x":95.2628,"y":-50,"l":"OH"},{"x":129.9038,"y":-10},{"x":147.2244,"y":-20,"l":"OH"},{"x":129.9038,"y":10,"l":"O"}],"b":[{"b":0,"e":1},{"b":1,"e":2,"o":2},{"b":2,"e":4},{"b":4,"e":7},{"b":4,"e":6,"o":2},{"b":6,"e":9},{"b":9,"e":11,"o":2},{"b":11,"e":12},{"b":12,"e":13},{"b":13,"e":14},{"b":14,"e":15,"o":2},{"b":15,"e":17},{"b":17,"e":19,"o":2},{"b":19,"e":18},{"b":18,"e":16,"o":2},{"b":14,"e":16},{"b":19,"e":20},{"b":20,"e":21,"o":2},{"b":20,"e":22},{"b":22,"e":23},{"b":23,"e":24},{"b":24,"e":26},{"b":26,"e":29},{"b":29,"e":30},{"b":29,"e":31,"o":2},{"b":23,"e":25},{"b":25,"e":28},{"b":25,"e":27,"o":2},{"b":11,"e":10},{"b":10,"e":8,"o":2},{"b":8,"e":5},{"b":6,"e":5},{"b":5,"e":3,"o":2},{"b":1,"e":3}]}
	});
	group.templates.push({
		name: 'Vitamin C',
		data: {"a":[{"x":14.8183,"y":-7.3993,"l":"H"},{"x":-2.5022,"y":2.6007},{"x":-14.2579,"y":18.781,"l":"O"},{"x":-14.2579,"y":-13.5797},{"x":14.8183,"y":12.6007},{"x":-33.279,"y":12.6007},{"x":-33.2791,"y":-7.3993},{"x":-8.0775,"y":-32.6008,"l":"OH"},{"x":32.1389,"y":2.6007},{"x":14.8183,"y":32.6007,"l":"OH"},{"x":-49.4593,"y":24.3563,"l":"O"},{"x":-49.4593,"y":-19.155,"l":"OH"},{"x":49.4594,"y":12.6007,"l":"OH"}],"b":[{"b":1,"e":0},{"b":1,"e":2},{"b":2,"e":5},{"b":5,"e":10,"o":2},{"b":5,"e":6},{"b":6,"e":11},{"b":6,"e":3,"o":2},{"b":1,"e":3},{"b":3,"e":7},{"b":1,"e":4},{"b":4,"e":9},{"b":4,"e":8},{"b":8,"e":12}]}
	});
	group.templates.push({
		name: 'Vitamin D<sub>3</sub>',
		data: {"a":[{"x":-177.0877,"y":20.5302},{"x":-153.0316,"y":34.4191},{"x":-153.0316,"y":62.1969},{"x":-128.9753,"y":20.5302},{"x":-104.9189,"y":34.4191},{"x":-80.8628,"y":20.5302},{"x":-56.8066,"y":34.4191},{"x":-32.7503,"y":20.5302},{"x":-56.8066,"y":62.1969},{"x":-56.8065,"y":6.6413,"l":"H"},{"x":-29.8467,"y":-7.0957},{"x":-7.3741,"y":31.8285},{"x":-2.6759,"y":-12.871},{"x":-28.0168,"y":50.415},{"x":11.213,"y":11.185},{"x":1.2099,"y":58.2465},{"x":27.5404,"y":-11.2874,"l":"H"},{"x":38.3838,"y":16.961},{"x":28.3806,"y":64.0218},{"x":46.9676,"y":43.379},{"x":56.9707,"y":-3.6825},{"x":84.1414,"y":2.0928},{"x":103.7833,"y":-17.549},{"x":130.6146,"y":-10.359},{"x":96.5939,"y":-44.38},{"x":150.2565,"y":-30.0015},{"x":69.7627,"y":-51.5693},{"x":116.2357,"y":-64.0218},{"x":177.0877,"y":-22.8116,"l":"OH"},{"x":143.0669,"y":-56.8325}],"b":[{"b":14,"e":16},{"b":14,"e":12},{"b":12,"e":10},{"b":10,"e":7},{"b":7,"e":6},{"b":6,"e":8},{"b":6,"e":5},{"b":5,"e":4},{"b":4,"e":3},{"b":3,"e":1},{"b":1,"e":2},{"b":1,"e":0},{"b":7,"e":11},{"b":14,"e":11},{"b":11,"e":13},{"b":11,"e":15},{"b":15,"e":18},{"b":18,"e":19},{"b":19,"e":17},{"b":14,"e":17},{"b":17,"e":20,"o":2},{"b":20,"e":21},{"b":21,"e":22,"o":2},{"b":22,"e":23},{"b":23,"e":25},{"b":25,"e":28},{"b":25,"e":29},{"b":29,"e":27},{"b":27,"e":24},{"b":22,"e":24},{"b":24,"e":26,"o":2},{"b":7,"e":9}]}
	});
	group.templates.push({
		name: 'Vitamin D<sub>4</sub>',
		data: {"a":[{"x":-150.3688,"y":57.1289},{"x":-126.3125,"y":71.0178},{"x":-102.2562,"y":57.1289},{"x":-126.3125,"y":98.7956},{"x":-78.1999,"y":71.0178},{"x":-102.2562,"y":29.3511},{"x":-54.1437,"y":57.1289},{"x":-30.0875,"y":71.0178},{"x":-30.0875,"y":98.7956},{"x":-6.0311,"y":57.1289},{"x":-6.0311,"y":84.9067,"l":"H"},{"x":-17.3294,"y":31.7532},{"x":21.5944,"y":54.2257},{"x":3.3135,"y":13.166},{"x":42.2374,"y":72.8122},{"x":27.3697,"y":27.0549},{"x":13.0107,"y":80.6437},{"x":68.6556,"y":64.2287},{"x":30.2734,"y":-0.571,"l":"H"},{"x":53.788,"y":18.4706},{"x":74.4309,"y":37.0578},{"x":59.5634,"y":-8.6995},{"x":85.9816,"y":-17.2838},{"x":91.7569,"y":-44.4546},{"x":118.1751,"y":-53.0382},{"x":71.114,"y":-63.0412},{"x":123.9505,"y":-80.209},{"x":76.8894,"y":-90.212},{"x":44.6957,"y":-54.4576},{"x":150.3688,"y":-88.7926,"l":"OH"},{"x":103.3076,"y":-98.7956}],"b":[{"b":9,"e":10},{"b":9,"e":11},{"b":11,"e":13},{"b":13,"e":15},{"b":15,"e":18},{"b":15,"e":19},{"b":19,"e":20},{"b":20,"e":17},{"b":17,"e":14},{"b":14,"e":12},{"b":9,"e":12},{"b":15,"e":12},{"b":12,"e":16},{"b":19,"e":21,"o":2},{"b":21,"e":22},{"b":22,"e":23,"o":2},{"b":23,"e":24},{"b":24,"e":26},{"b":26,"e":29},{"b":26,"e":30},{"b":30,"e":27},{"b":27,"e":25},{"b":23,"e":25},{"b":25,"e":28,"o":2},{"b":9,"e":7},{"b":7,"e":8},{"b":7,"e":6},{"b":6,"e":4},{"b":4,"e":2},{"b":2,"e":5},{"b":2,"e":1},{"b":1,"e":3},{"b":1,"e":0}]}
	});
	group.templates.push({
		name: 'Vitamin D<sub>5</sub>',
		data: {"a":[{"x":-150.3688,"y":57.1289},{"x":-126.3126,"y":71.0178},{"x":-102.2563,"y":57.1289},{"x":-102.2563,"y":29.3511},{"x":-78.2,"y":71.0178},{"x":-78.2,"y":15.4622},{"x":-126.3126,"y":15.4622},{"x":-54.1438,"y":57.1289},{"x":-30.0875,"y":71.0178},{"x":-6.0311,"y":57.1289},{"x":-30.0875,"y":98.7956},{"x":-17.3294,"y":31.7532},{"x":-6.0311,"y":84.9067,"l":"H"},{"x":21.5944,"y":54.2257},{"x":3.3135,"y":13.166},{"x":42.2374,"y":72.8122},{"x":27.3698,"y":27.0549},{"x":13.0106,"y":80.6437},{"x":68.6556,"y":64.2287},{"x":30.2734,"y":-0.571,"l":"H"},{"x":53.788,"y":18.4713},{"x":74.4308,"y":37.0578},{"x":59.5634,"y":-8.6995},{"x":85.9816,"y":-17.2838},{"x":91.7569,"y":-44.4546},{"x":118.1751,"y":-53.0382},{"x":71.1139,"y":-63.0412},{"x":123.9505,"y":-80.209},{"x":76.8894,"y":-90.212},{"x":44.6957,"y":-54.4576},{"x":103.3076,"y":-98.7956},{"x":150.3688,"y":-88.7926,"l":"OH"}],"b":[{"b":9,"e":12},{"b":9,"e":11},{"b":11,"e":14},{"b":14,"e":16},{"b":16,"e":19},{"b":16,"e":20},{"b":20,"e":21},{"b":21,"e":18},{"b":18,"e":15},{"b":15,"e":13},{"b":9,"e":13},{"b":16,"e":13},{"b":13,"e":17},{"b":20,"e":22,"o":2},{"b":22,"e":23},{"b":23,"e":24,"o":2},{"b":24,"e":25},{"b":25,"e":27},{"b":27,"e":31},{"b":27,"e":30},{"b":30,"e":28},{"b":28,"e":26},{"b":24,"e":26},{"b":26,"e":29,"o":2},{"b":9,"e":8},{"b":8,"e":10},{"b":8,"e":7},{"b":7,"e":4},{"b":4,"e":2},{"b":2,"e":1},{"b":1,"e":0},{"b":2,"e":3},{"b":3,"e":6},{"b":3,"e":5}]}
	});
	group.templates.push({
		name: 'Vitamin E',
		data: {"a":[{"x":138.5641,"y":-10},{"x":138.5641,"y":10},{"x":121.2436,"y":20},{"x":155.8846,"y":20},{"x":103.9231,"y":10},{"x":86.6026,"y":20},{"x":69.282,"y":10},{"x":69.282,"y":-10},{"x":51.9615,"y":20},{"x":34.641,"y":10},{"x":17.3205,"y":20},{"x":0,"y":10},{"x":0,"y":-10},{"x":-17.3205,"y":20},{"x":-34.641,"y":10},{"x":-51.9615,"y":20},{"x":-69.2821,"y":10},{"x":-69.2821,"y":30},{"x":-69.2821,"y":-10},{"x":-86.6026,"y":20,"l":"O"},{"x":-86.6026,"y":-20},{"x":-103.9231,"y":10},{"x":-103.9231,"y":-10},{"x":-121.2436,"y":20},{"x":-121.2436,"y":-20},{"x":-138.5641,"y":10},{"x":-121.2436,"y":40},{"x":-121.2436,"y":-40},{"x":-138.5641,"y":-10},{"x":-155.8846,"y":20},{"x":-155.8846,"y":-20,"l":"OH"}],"b":[{"b":0,"e":1},{"b":1,"e":3},{"b":1,"e":2},{"b":2,"e":4},{"b":4,"e":5},{"b":5,"e":6},{"b":6,"e":7},{"b":6,"e":8},{"b":8,"e":9},{"b":9,"e":10},{"b":10,"e":11},{"b":11,"e":12},{"b":11,"e":13},{"b":13,"e":14},{"b":14,"e":15},{"b":15,"e":16},{"b":16,"e":17},{"b":16,"e":18},{"b":18,"e":20},{"b":20,"e":22},{"b":22,"e":24,"o":2},{"b":24,"e":27},{"b":24,"e":28},{"b":28,"e":30},{"b":28,"e":25,"o":2},{"b":25,"e":29},{"b":25,"e":23},{"b":23,"e":26},{"b":23,"e":21,"o":2},{"b":22,"e":21},{"b":21,"e":19},{"b":16,"e":19}]}
	});
	group.templates.push({
		name: 'Vitamin K<sub>1</sub>',
		data: {"a":[{"x":-155.8846,"y":40},{"x":-155.8846,"y":20},{"x":-138.5641,"y":10},{"x":-173.2051,"y":10},{"x":-121.2436,"y":20},{"x":-103.9231,"y":10},{"x":-86.6025,"y":20},{"x":-86.6025,"y":40},{"x":-69.2821,"y":10},{"x":-51.9615,"y":20},{"x":-34.641,"y":10},{"x":-17.3205,"y":20},{"x":0,"y":10},{"x":-17.3205,"y":40},{"x":17.3205,"y":20},{"x":34.641,"y":10},{"x":51.9615,"y":20},{"x":69.2821,"y":10},{"x":51.9615,"y":40},{"x":86.6026,"y":20},{"x":103.9231,"y":10},{"x":121.2437,"y":20},{"x":103.9231,"y":-10},{"x":138.5641,"y":10},{"x":121.2437,"y":40,"l":"O"},{"x":121.2437,"y":-20},{"x":86.6026,"y":-20},{"x":155.8847,"y":20},{"x":138.5641,"y":-10},{"x":121.2437,"y":-40,"l":"O"},{"x":173.2051,"y":10},{"x":155.8847,"y":-20},{"x":173.2051,"y":-10}],"b":[{"b":0,"e":1},{"b":1,"e":3},{"b":1,"e":2},{"b":2,"e":4},{"b":4,"e":5},{"b":5,"e":6},{"b":6,"e":7},{"b":6,"e":8},{"b":8,"e":9},{"b":9,"e":10},{"b":10,"e":11},{"b":11,"e":13},{"b":11,"e":12},{"b":12,"e":14},{"b":14,"e":15},{"b":15,"e":16},{"b":16,"e":18},{"b":16,"e":17,"o":2},{"b":17,"e":19},{"b":19,"e":20},{"b":20,"e":22,"o":2},{"b":22,"e":26},{"b":22,"e":25},{"b":25,"e":29,"o":2},{"b":25,"e":28},{"b":28,"e":23,"o":2},{"b":23,"e":27},{"b":27,"e":30,"o":2},{"b":30,"e":32},{"b":32,"e":31,"o":2},{"b":28,"e":31},{"b":23,"e":21},{"b":20,"e":21},{"b":21,"e":24,"o":2}]}
	});
	d.push(group);
	
	// this is the user's template group, don't remove this or the templates widget won't work
	// IE/Edge doesn't allow localStorage from local files
	let saved;
	if(localStorage){
		// load from local storage
		saved = localStorage.getItem('chemdoodle_user_templates');
	}
	group = {name:'My Templates', templates:!saved||saved===null?[]:JSON.parse(saved)};
	d.push(group);

	return d;

})(JSON, localStorage);

(function(desktop, imageDepot, q, undefined) {
	'use strict';
	desktop.Button = function(id, icon, tooltip, func) {
		this.id = id;
		this.icon = icon;
		this.toggle = false;
		this.tooltip = tooltip ? tooltip : '';
		this.func = func ? func : undefined;
	};
	let _ = desktop.Button.prototype;
	_.getElement = function() {
		return q('#' + this.id);
	};
	_.getLabelElement = function() {
		if(this.toggle){
			return q('#' + this.id + '_label');
		}
		return undefined;
	};
	_.getSource = function(buttonGroup) {
		let sb = [];
		let spacingStyles = 'box-sizing:border-box;margin-top:0px; margin-bottom:1px; padding:0px; height:28px; width:28px;';
		if (this.toggle) {
			sb.push('<input type="radio" name="');
			sb.push(buttonGroup);
			sb.push('" id="');
			sb.push(this.id);
			sb.push('" title="');
			sb.push(this.tooltip);
			sb.push('" /><label id="');
			sb.push(this.id);
			sb.push('_label" for="');
			sb.push(this.id);
			sb.push('" style="');
			sb.push(spacingStyles);
			sb.push('"><img id="');
			sb.push(this.id);
			sb.push('_icon" title="');
			sb.push(this.tooltip);
			sb.push('" width="20" height="20');
			if(this.icon){
				sb.push('" src="');
				sb.push(imageDepot.getURI(this.icon));
			}
			sb.push('"></label>');
		} else {
			sb.push('<button type="button" id="');
			sb.push(this.id);
			sb.push('" onclick="return false;" title="');
			sb.push(this.tooltip);
			sb.push('" style="');
			sb.push(spacingStyles);
			sb.push('"><img title="');
			sb.push(this.tooltip);
			sb.push('" width="20" height="20');
			if(this.icon){
				sb.push('" src="');
				sb.push(imageDepot.getURI(this.icon));
			}
			sb.push('"></button>');
		}
		return sb.join('');
	};
	_.setup = function(lone) {
		let element = this.getElement();
		if (!this.toggle || lone) {
			element.button();
		}
		element.click(this.func);
	};
	_.disable = function() {
		let element = this.getElement();
		element.mouseout();
		element.button('disable');
	};
	_.enable = function() {
		this.getElement().button('enable');
	};
	_.select = function() {
		// WARNING: this function will autofocus the element and move the page view to the button, use click() instead to avoid this behavior
		// getElement().click() - executes its function (same as just calling .func())
		// getLabelElement().click() - selects a toggle button (based on radio), similar to this call
		let element = this.getElement();
		element.attr('checked', true);
		element.button('refresh');
		if(this.toggle){
			this.getLabelElement().click();
		}
	};

})(ChemDoodle.uis.gui.desktop, ChemDoodle.uis.gui.imageDepot, ChemDoodle.lib.jQuery);
(function(desktop, q, undefined) {
	'use strict';
	desktop.ButtonSet = function(id) {
		this.id = id;
		this.buttons = [];
		this.toggle = true;
		this.columnCount = -1;
	};
	let _ = desktop.ButtonSet.prototype;
	_.getElement = function() {
		return q('#' + this.id);
	};
	_.getSource = function(buttonGroup) {
		let sb = [];
		if(this.columnCount===-1){
			sb.push('<span id="');
			sb.push(this.id);
			sb.push('">');
			for ( let i = 0, ii = this.buttons.length; i < ii; i++) {
				if (this.toggle) {
					this.buttons[i].toggle = true;
				}
				sb.push(this.buttons[i].getSource(buttonGroup));
			}
			if (this.dropDown) {
				sb.push(this.dropDown.getButtonSource());
			}
			sb.push('</span>');
			if (this.dropDown) {
				sb.push(this.dropDown.getHiddenSource());
			}
		}else{
			sb.push('<table cellspacing="0" style="margin:1px -2px 0px 1px;">');
			let c = 0;
			for ( let i = 0, ii = this.buttons.length; i < ii; i++) {
				if (this.toggle) {
						this.buttons[i].toggle = true;
				}
				if(c===0){
					sb.push('<tr>');
				}
				sb.push('<td style="padding:0px;">');
				sb.push(this.buttons[i].getSource(buttonGroup));
				sb.push('</td>');
				c++;
				if(c===this.columnCount){
					sb.push('</tr>');
					c = 0;
				}
			}
			sb.push('</table>');
		}
		return sb.join('');
	};
	_.setup = function() {
		if(this.columnCount===-1){
			this.getElement().buttonset();
		}
		for ( let i = 0, ii = this.buttons.length; i < ii; i++) {
			this.buttons[i].setup(this.columnCount!==-1);
		}
		if (this.dropDown) {
			this.dropDown.setup();
		}
	};
	_.addDropDown = function(tooltip) {
		this.dropDown = new desktop.DropDown(this.id + '_dd', tooltip, this.buttons[this.buttons.length - 1]);
	};
	
	_.disable = function() {
		for (let i = 0, ii = this.buttons.length; i < ii; i++) {
			this.buttons[i].disable();
		}
	};
	
	_.enable = function() {
		for (let i = 0, ii = this.buttons.length; i < ii; i++) {
			this.buttons[i].enable();
		}
	};

})(ChemDoodle.uis.gui.desktop, ChemDoodle.lib.jQuery);
(function(desktop, q, undefined) {
	'use strict';
	desktop.CheckBox = function(id, tooltip, func, checked) {
		this.id = id;
		this.checked = checked ? checked : false;
		this.tooltip = tooltip ? tooltip : '';
		this.func = func ? func : undefined;
	};
	let _ = desktop.CheckBox.prototype = new desktop.Button();
	_.getSource = function() {
		let sb = [];
		sb.push('<input type="checkbox" id="');
		sb.push(this.id);
		sb.push('" ');
		if (this.checked) {
			sb.push('checked="" ');
		}
		sb.push('><label for="');
		sb.push(this.id);
		sb.push('">');
		sb.push(this.tooltip);
		sb.push('</label>');
		return sb.join('');
	};
	_.setup = function() {
		this.getElement().click(this.func);
	};
	
	_.check = function() {
		this.checked = true;
		this.getElement().prop('checked', true);
	};
	
	_.uncheck = function() {
		this.checked = false;
		this.getElement().removeAttr('checked');
	};
})(ChemDoodle.uis.gui.desktop, ChemDoodle.lib.jQuery);
(function(desktop, q, undefined) {
	'use strict';
	desktop.ColorPicker = function (id, tooltip, func) {
		this.id = id;
		this.tooltip = tooltip ? tooltip : '';
		this.func = func ? func : undefined;
	};
	let _ = desktop.ColorPicker.prototype;
	_.getElement = function() {
		return q('#' + this.id);
	};
	_.getSource = function() {
		let sb = [];
		sb.push('<table style="font-size:12px;text-align:left;border-spacing:0px"><tr><td><p>');
		sb.push(this.tooltip);
		sb.push('</p></td><td><input id="');
		sb.push(this.id);
		sb.push('" class="simple_color" value="#000000" /></td></tr></table>');
		return sb.join('');
	};
	_.setup = function() {
		this.getElement().simpleColor({
			boxWidth : 20,
			livePreview : true,
			chooserCSS: { 'z-index' : '900'},
			onSelect : this.func });
	};
	_.setColor = function(color) {
		this.getElement().setColor(color);
	};
})(ChemDoodle.uis.gui.desktop, ChemDoodle.lib.jQuery);

(function(desktop, q, document, undefined) {
	'use strict';
	desktop.Dialog = function(sketcherid, subid, title) {
		// sketcherid is the DOM element id everything will be anchored around
		// when adding dynamically.
		this.sketcherid = sketcherid;
		this.id = sketcherid + subid;
		this.title = title ? title : 'Information';
	};
	let _ = desktop.Dialog.prototype;
	_.buttons = undefined;
	_.message = undefined;
	_.afterMessage = undefined;
	_.includeTextArea = false;
	_.includeTextField = false;
	_.getElement = function() {
		return q('#' + this.id);
	};
	_.getTextArea = function() {
		return q('#' + this.id + '_ta');
	};
	_.getTextField = function() {
		return q('#' + this.id + '_tf');
	};
	_.setup = function() {
		let sb = [];
		sb.push('<div style="font-size:12px;" id="');
		sb.push(this.id);
		sb.push('" title="');
		sb.push(this.title);
		sb.push('">');
		if (this.message) {
			sb.push('<p>');
			sb.push(this.message);
			sb.push('</p>');
		}
		if (this.includeTextField) {
			sb.push('<input type="text" style="font-family:\'Courier New\';" id="');
			sb.push(this.id);
			sb.push('_tf" autofocus></input>');
		}
		if (this.includeTextArea) {
			sb.push('<textarea style="font-family:\'Courier New\';" id="');
			sb.push(this.id);
			sb.push('_ta" cols="55" rows="10"></textarea>');
		}
		if (this.afterMessage) {
			sb.push('<p>');
			sb.push(this.afterMessage);
			sb.push('</p>');
		}
		sb.push('</div>');
		if (document.getElementById(this.sketcherid)) {
			let canvas = q('#' + this.sketcherid);
			canvas.before(sb.join(''));
		} else {
			document.writeln(sb.join(''));
		}
		let self = this;
		this.getElement().dialog({
			autoOpen : false,
			width : 435,
			buttons : self.buttons
		});
	};
	_.open = function() {
		this.getElement().dialog('open');
	};

})(ChemDoodle.uis.gui.desktop, ChemDoodle.lib.jQuery, document);
(function(desktop, q, undefined) {
	'use strict';
	desktop.FloatingToolbar = function(sketcher) {
		this.sketcher = sketcher;
		this.components = [];
	};
	let _ = desktop.FloatingToolbar.prototype;
	_.getElement = function() {
		return q('#' + this.id);
	};
	_.getSource = function(buttonGroup) {
		let sb = [];
		sb.push('<div id="');
		sb.push(this.sketcher.id);
		sb.push('_floating_toolbar" style="position:absolute;left:-50px;z-index:10;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);border:1px #C1C1C1 solid;background:#F5F5F5;padding:2px;">');
		sb.push('<div id="');
		sb.push(this.sketcher.id);
		// box-sizing makes the browser include borders and padding in width and height
		sb.push('_floating_toolbar_handle" style="height:14px;"><div style="box-sizing:border-box;padding:0px;height:4px;border-top:1px solid #999;border-bottom:1px solid #999;">');
		sb.push('</div></div>');
		for ( let i = 0, ii = this.components.length; i < ii; i++) {
			sb.push(this.components[i].getSource(buttonGroup));
			sb.push('<br>');	
		}
		sb.push('</div>');
		return sb.join('');
	};
	_.setup = function() {
		let self = this;
		q('#'+this.sketcher.id+'_floating_toolbar').draggable({handle:'#'+this.sketcher.id+'_floating_toolbar_handle', drag:function(){
			if(self.sketcher.openTray){
				self.sketcher.openTray.reposition();
			}
		}, containment:'document'});
		for ( let i = 0, ii = this.components.length; i < ii; i++) {
			this.components[i].setup(true);
		}
	};

})(ChemDoodle.uis.gui.desktop, ChemDoodle.lib.jQuery);

(function(c, structures, actions, desktop, q, document, undefined) {
	'use strict';

	let makeRow = function(id, name, tag, description, component) {
		let sb = ['<tr>'];
		// checkbox for include
		sb.push('<td>');
		if(id.indexOf('_elements')===-1){
			sb.push('<input type="checkbox" id="');
			sb.push(id);
			sb.push('_include">');
		}
		sb.push('</td>');
		// name and tag
		sb.push('<td>');
		sb.push(name);
		if(tag){
			sb.push('<br>(<strong>');
			sb.push(tag);
			sb.push('</strong>)');
		}
		sb.push('</td>');
		// component
		sb.push('<td style="padding-left:20px;padding-right:20px;">');
		sb.push(description);
		if(component){
			if(component===1){
				sb.push('<br>');
				sb.push('<input type="text" id="');
				sb.push(id);
				sb.push('_value">');
			}else{
				sb.push(component);
			}
		}
		sb.push('</td>');
		// checkbox for not
		sb.push('<td><input type="checkbox" id="');
		sb.push(id);
		sb.push('_not"><br><strong>NOT</strong>');
		sb.push('</td>');
		// close
		sb.push('</tr>');
		return sb.join('');
	};
	
	desktop.AtomQueryDialog = function(sketcher, subid) {
		this.sketcher = sketcher;
		this.id = sketcher.id + subid;
	};
	let _ = desktop.AtomQueryDialog.prototype = new desktop.Dialog();
	_.title = 'Atom Query';
	_.setAtom = function(a) {
		this.a = a;
		let use = a.query;
		if(!use){
			use = new structures.Query(structures.Query.TYPE_ATOM);
			use.elements.v.push(a.label);
		}
		for(let i = 0, ii = this.periodicTable.cells.length; i<ii; i++){
			this.periodicTable.cells[i].selected = use.elements.v.indexOf(this.periodicTable.cells[i].element.symbol)!==-1;
		}
		this.periodicTable.repaint();
		q('#'+this.id+'_el_any').prop("checked", use.elements.v.indexOf('a')!==-1);
		q('#'+this.id+'_el_noth').prop("checked", use.elements.v.indexOf('r')!==-1);
		q('#'+this.id+'_el_het').prop("checked", use.elements.v.indexOf('q')!==-1);
		q('#'+this.id+'_el_hal').prop("checked", use.elements.v.indexOf('x')!==-1);
		q('#'+this.id+'_el_met').prop("checked", use.elements.v.indexOf('m')!==-1);
		q('#'+this.id+'_elements_not').prop("checked", use.elements.not);
		
		q('#'+this.id+'_aromatic_include').prop("checked", use.aromatic!==undefined);
		q('#'+this.id+'_aromatic_not').prop("checked", use.aromatic!==undefined&&use.aromatic.not);
		q('#'+this.id+'_charge_include').prop("checked", use.charge!==undefined);
		q('#'+this.id+'_charge_value').val(use.charge?use.outputRange(use.charge.v):'');
		q('#'+this.id+'_charge_not').prop("checked", use.charge!==undefined&&use.charge.not);
		q('#'+this.id+'_hydrogens_include').prop("checked", use.hydrogens!==undefined);
		q('#'+this.id+'_hydrogens_value').val(use.hydrogens?use.outputRange(use.hydrogens.v):'');
		q('#'+this.id+'_hydrogens_not').prop("checked", use.charge!==undefined&&use.charge.not);
		q('#'+this.id+'_ringCount_include').prop("checked", use.ringCount!==undefined);
		q('#'+this.id+'_ringCount_value').val(use.ringCount?use.outputRange(use.ringCount.v):'');
		q('#'+this.id+'_ringCount_not').prop("checked", use.ringCount!==undefined&&use.ringCount.not);
		q('#'+this.id+'_saturation_include').prop("checked", use.saturation!==undefined);
		q('#'+this.id+'_saturation_not').prop("checked", use.saturation!==undefined&&use.saturation.not);
		q('#'+this.id+'_connectivity_include').prop("checked", use.connectivity!==undefined);
		q('#'+this.id+'_connectivity_value').val(use.connectivity?use.outputRange(use.connectivity.v):'');
		q('#'+this.id+'_connectivity_not').prop("checked", use.connectivity!==undefined&&use.connectivity.not);
		q('#'+this.id+'_connectivityNoH_include').prop("checked", use.connectivityNoH!==undefined);
		q('#'+this.id+'_connectivityNoH_value').val(use.connectivityNoH?use.outputRange(use.connectivityNoH.v):'');
		q('#'+this.id+'_connectivityNoH_not').prop("checked", use.connectivityNoH!==undefined&&use.connectivityNoH.not);
		q('#'+this.id+'_chirality_include').prop("checked", use.chirality!==undefined);
		if(!use.chirality || use.chirality.v === 'R'){
			q('#'+this.id+'_chiral_r').prop('checked', true).button('refresh');
		}else if(!use.chirality || use.chirality.v === 'S'){
			q('#'+this.id+'_chiral_s').prop('checked', true).button('refresh');
		}else if(!use.chirality || use.chirality.v === 'A'){
			q('#'+this.id+'_chiral_a').prop('checked', true).button('refresh');
		}
		q('#'+this.id+'_chirality_not').prop("checked", use.chirality!==undefined&&use.chirality.not);
	};
	_.setup = function() {
		let sb = [];
		sb.push('<div style="font-size:12px;text-align:center;height:300px;overflow-y:scroll;" id="');
		sb.push(this.id);
		sb.push('" title="');
		sb.push(this.title);
		sb.push('">');
		sb.push('<p>Set the following form to define the atom query.</p>');
		sb.push('<table>');
		sb.push(makeRow(this.id+'_elements', 'Identity', undefined, 'Select any number of elements and/or wildcards.', '<canvas class="ChemDoodleWebComponent" id="'+this.id+'_pt"></canvas><br><input type="checkbox" id="'+this.id+'_el_any">Any (a)<input type="checkbox" id="'+this.id+'_el_noth">!Hydrogen (r)<input type="checkbox" id="'+this.id+'_el_het">Heteroatom (q)<br><input type="checkbox" id="'+this.id+'_el_hal">Halide (x)<input type="checkbox" id="'+this.id+'_el_met">Metal (m)'));
		sb.push('<tr><td colspan="4"><hr style="width:100%"></td></tr>');
		sb.push(makeRow(this.id+'_aromatic', 'Aromatic', 'A', 'Specifies that the matched atom should be aromatic. Use the NOT modifier to specify not aromatic or anti-aromatic.'));
		sb.push(makeRow(this.id+'_charge', 'Charge', 'C', 'Defines the allowed charge for the matched atom.', 1));
		sb.push(makeRow(this.id+'_hydrogens', 'Hydrogens', 'H', 'Defines the total number of hydrogens attached to the atom, implicit and explicit.', 1));
		sb.push(makeRow(this.id+'_ringCount', 'Ring Count', 'R', 'Defines the total number of rings this atom is a member of. (SSSR)', 1));
		sb.push(makeRow(this.id+'_saturation', 'Saturation', 'S', 'Specifies that the matched atom should be saturated. Use the NOT modifier to specify unsaturation.'));
		sb.push(makeRow(this.id+'_connectivity', 'Connectivity', 'X', 'Defines the total number of bonds connected to the atom, including all hydrogens.', 1));
		sb.push(makeRow(this.id+'_connectivityNoH', 'Connectivity (No H)', 'x', 'Defines the total number of bonds connected to the atom, excluding all hydrogens.', 1));
		sb.push(makeRow(this.id+'_chirality', 'Chirality', '@', 'Defines the stereochemical configuration of the atom.', '<div id="'+this.id+'_radio"><input type="radio" id="'+this.id+'_chiral_a" name="radio"><label for="'+this.id+'_chiral_a">Any (A)</label><input type="radio" id="'+this.id+'_chiral_r" name="radio"><label for="'+this.id+'_chiral_r">Rectus (R)</label><input type="radio" id="'+this.id+'_chiral_s" name="radio"><label for="'+this.id+'_chiral_s">Sinestra (S)</label></div>'));
		sb.push('</table>');
		sb.push('</div>');
		if (document.getElementById(this.sketcher.id)) {
			let canvas = q('#' + this.sketcher.id);
			canvas.before(sb.join(''));
		} else {
			document.writeln(sb.join(''));
		}
		this.periodicTable = new c.PeriodicTableCanvas(this.id + '_pt', 24);
		this.periodicTable.allowMultipleSelections = true;
		this.periodicTable.drawCell = function(ctx, styles, cell){
		    //if hovered, then show a red background
		    if(this.hovered===cell){
		      ctx.fillStyle='blue';
		      ctx.fillRect(cell.x, cell.y, cell.dimension, cell.dimension);
		    }else if(cell.selected){
			    ctx.fillStyle='#c10000';
			    ctx.fillRect(cell.x, cell.y, cell.dimension, cell.dimension);
			}
		    //draw the main cells
		    ctx.strokeStyle='black';
		    ctx.strokeRect(cell.x, cell.y, cell.dimension, cell.dimension);
		    ctx.font = '16px Sans-serif';
		    ctx.fillStyle='black';
		    ctx.textAlign = 'center';
		    ctx.textBaseline = 'middle';
		    ctx.fillText(cell.element.symbol, cell.x+cell.dimension/2, cell.y+cell.dimension/2);
		};
		this.periodicTable.repaint();
		let self = this;
		function setNewQuery(){
			let query = new structures.Query(structures.Query.TYPE_ATOM);
			
			if(q('#'+self.id+'_el_any').is(':checked')){
				query.elements.v.push('a');
			}
			if(q('#'+self.id+'_el_noth').is(':checked')){
				query.elements.v.push('r');
			}
			if(q('#'+self.id+'_el_het').is(':checked')){
				query.elements.v.push('q');
			}
			if(q('#'+self.id+'_el_hal').is(':checked')){
				query.elements.v.push('x');
			}
			if(q('#'+self.id+'_el_met').is(':checked')){
				query.elements.v.push('m');
			}
			for(let i = 0, ii = self.periodicTable.cells.length; i<ii; i++){
				if(self.periodicTable.cells[i].selected){
					query.elements.v.push(self.periodicTable.cells[i].element.symbol);
				}
			}
			if(q('#'+self.id+'_elements_not').is(':checked')){
				query.elements.not = true;
			}
			
			if(q('#'+self.id+'_aromatic_include').is(':checked')){
				query.aromatic = {v:true,not:q('#'+self.id+'_aromatic_not').is(':checked')};
			}
			if(q('#'+self.id+'_charge_include').is(':checked')){
				query.charge = {v:query.parseRange(q('#'+self.id+'_charge_value').val()),not:q('#'+self.id+'_charge_not').is(':checked')};
			}
			if(q('#'+self.id+'_hydrogens_include').is(':checked')){
				query.hydrogens = {v:query.parseRange(q('#'+self.id+'_hydrogens_value').val()),not:q('#'+self.id+'_hydrogens_not').is(':checked')};
			}
			if(q('#'+self.id+'_ringCount_include').is(':checked')){
				query.ringCount = {v:query.parseRange(q('#'+self.id+'_ringCount_value').val()),not:q('#'+self.id+'_ringCount_not').is(':checked')};
			}
			if(q('#'+self.id+'_saturation_include').is(':checked')){
				query.saturation = {v:true,not:q('#'+self.id+'_saturation_not').is(':checked')};
			}
			if(q('#'+self.id+'_connectivity_include').is(':checked')){
				query.connectivity = {v:query.parseRange(q('#'+self.id+'_connectivity_value').val()),not:q('#'+self.id+'_connectivity_not').is(':checked')};
			}
			if(q('#'+self.id+'_connectivityNoH_include').is(':checked')){
				query.connectivityNoH = {v:query.parseRange(q('#'+self.id+'_connectivityNoH_value').val()),not:q('#'+self.id+'_connectivityNoH_not').is(':checked')};
			}
			if(q('#'+self.id+'_chirality_include').is(':checked')){
				let val = 'R';
				if(q('#'+self.id+'_chiral_a').is(':checked')){
					val = 'A';
				}else if(q('#'+self.id+'_chiral_s').is(':checked')){
					val = 'S';
				}
				query.chirality = {v:val,not:q('#'+self.id+'_chirity_not').is(':checked')};
			}
			
			self.sketcher.historyManager.pushUndo(new actions.ChangeQueryAction(self.a, query));
			q(this).dialog('close');
		};
		q('#'+this.id+'_radio').buttonset();
		this.getElement().dialog({
			autoOpen : false,
			width : 500,
			height: 300,
			buttons : {
				'Cancel' : function(){q(this).dialog('close');},
				'Remove' : function(){self.sketcher.historyManager.pushUndo(new actions.ChangeQueryAction(self.a));q(this).dialog('close');},
				'Set' : setNewQuery
			},
			open : function(event, ui) {
				q("#"+self.id).animate({ scrollTop: 0 }, "fast");
			}
		});
	};

})(ChemDoodle, ChemDoodle.structures, ChemDoodle.uis.actions, ChemDoodle.uis.gui.desktop, ChemDoodle.lib.jQuery, document);

(function(c, structures, actions, desktop, imageDepot, q, document, undefined) {
	'use strict';

	let makeRow = function(id, name, tag, description, component) {
		let sb = ['<tr>'];
		// checkbox for include
		sb.push('<td>');
		if(id.indexOf('_orders')===-1){
			sb.push('<input type="checkbox" id="');
			sb.push(id);
			sb.push('_include">');
		}
		sb.push('</td>');
		// name and tag
		sb.push('<td>');
		sb.push(name);
		if(tag){
			sb.push('<br>(<strong>');
			sb.push(tag);
			sb.push('</strong>)');
		}
		sb.push('</td>');
		// component
		sb.push('<td style="padding-left:20px;padding-right:20px;">');
		sb.push(description);
		if(component){
			if(component===1){
				sb.push('<br>');
				sb.push('<input type="text" id="');
				sb.push(id);
				sb.push('_value">');
			}else{
				sb.push(component);
			}
		}
		sb.push('</td>');
		// checkbox for not
		sb.push('<td><input type="checkbox" id="');
		sb.push(id);
		sb.push('_not"><br><strong>NOT</strong>');
		sb.push('</td>');
		// close
		sb.push('</tr>');
		return sb.join('');
	};
	
	desktop.BondQueryDialog = function(sketcher, subid) {
		this.sketcher = sketcher;
		this.id = sketcher.id + subid;
	};
	let _ = desktop.BondQueryDialog.prototype = new desktop.Dialog();
	_.title = 'Bond Query';
	_.setBond = function(b) {
		this.b = b;
		let use = b.query;
		if(!use){
			use = new structures.Query(structures.Query.TYPE_BOND);
			switch(b.bondOrder){
			case 0:
				use.orders.v.push('0');
				break;
			case 0.5:
				use.orders.v.push('h');
				break;
			case 1:
				use.orders.v.push('1');
				break;
			case 1.5:
				use.orders.v.push('r');
				break;
			case 2:
				use.orders.v.push('2');
				break;
			case 3:
				use.orders.v.push('3');
				break;
			}
		}
		
		q('#'+this.id+'_type_0').prop("checked", use.orders.v.indexOf('0')!==-1).button('refresh');
		q('#'+this.id+'_type_1').prop("checked", use.orders.v.indexOf('1')!==-1).button('refresh');
		q('#'+this.id+'_type_2').prop("checked", use.orders.v.indexOf('2')!==-1).button('refresh');
		q('#'+this.id+'_type_3').prop("checked", use.orders.v.indexOf('3')!==-1).button('refresh');
		q('#'+this.id+'_type_4').prop("checked", use.orders.v.indexOf('4')!==-1).button('refresh');
		q('#'+this.id+'_type_5').prop("checked", use.orders.v.indexOf('5')!==-1).button('refresh');
		q('#'+this.id+'_type_6').prop("checked", use.orders.v.indexOf('6')!==-1).button('refresh');
		q('#'+this.id+'_type_h').prop("checked", use.orders.v.indexOf('h')!==-1).button('refresh');
		q('#'+this.id+'_type_r').prop("checked", use.orders.v.indexOf('r')!==-1).button('refresh');
		q('#'+this.id+'_type_a').prop("checked", use.orders.v.indexOf('a')!==-1).button('refresh');
		q('#'+this.id+'_orders_not').prop("checked", use.orders.not);
		
		q('#'+this.id+'_aromatic_include').prop("checked", use.aromatic!==undefined);
		q('#'+this.id+'_aromatic_not').prop("checked", use.aromatic!==undefined&&use.aromatic.not);
		q('#'+this.id+'_ringCount_include').prop("checked", use.ringCount!==undefined);
		q('#'+this.id+'_ringCount_value').val(use.ringCount?use.outputRange(use.ringCount.v):'');
		q('#'+this.id+'_ringCount_not').prop("checked", use.ringCount!==undefined&&use.ringCount.not);
		q('#'+this.id+'_stereo_include').prop("checked", use.stereo!==undefined);
		if(!use.stereo || use.stereo.v === 'E'){
			q('#'+this.id+'_stereo_e').prop('checked', true).button('refresh');
		}else if(!use.stereo || use.stereo.v === 'Z'){
			q('#'+this.id+'_stereo_z').prop('checked', true).button('refresh');
		}else if(!use.stereo || use.stereo.v === 'A'){
			q('#'+this.id+'_stereo_a').prop('checked', true).button('refresh');
		}
		q('#'+this.id+'_stereo_not').prop("checked", use.stereo!==undefined&&use.stereo.not);
	};
	_.setup = function() {
		let sb = [];
		sb.push('<div style="font-size:12px;text-align:center;height:300px;overflow-y:scroll;" id="');
		sb.push(this.id);
		sb.push('" title="');
		sb.push(this.title);
		sb.push('">');
		sb.push('<p>Set the following form to define the bond query.</p>');
		sb.push('<table>');
		sb.push(makeRow(this.id+'_orders', 'Identity', undefined, 'Select any number of bond types.', '<div id="'+this.id+'_radioTypes"><input type="checkbox" id="'+this.id+'_type_0"><label for="'+this.id+'_type_0"><img width="20" height="20" src="'+imageDepot.getURI(imageDepot.BOND_ZERO)+'" /></label><input type="checkbox" id="'+this.id+'_type_1"><label for="'+this.id+'_type_1"><img width="20" height="20" src="'+imageDepot.getURI(imageDepot.BOND_SINGLE)+'" /></label><input type="checkbox" id="'+this.id+'_type_2"><label for="'+this.id+'_type_2"><img width="20" height="20" src="'+imageDepot.getURI(imageDepot.BOND_DOUBLE)+'" /></label><input type="checkbox" id="'+this.id+'_type_3"><label for="'+this.id+'_type_3"><img width="20" height="20" src="'+imageDepot.getURI(imageDepot.BOND_TRIPLE)+'" /></label><input type="checkbox" id="'+this.id+'_type_4"><label for="'+this.id+'_type_4"><img width="20" height="20" src="'+imageDepot.getURI(imageDepot.BOND_QUADRUPLE)+'" /></label><input type="checkbox" id="'+this.id+'_type_5"><label for="'+this.id+'_type_5"><img width="20" height="20" src="'+imageDepot.getURI(imageDepot.BOND_QUINTUPLE)+'" /></label><input type="checkbox" id="'+this.id+'_type_6"><label for="'+this.id+'_type_6"><img width="20" height="20" src="'+imageDepot.getURI(imageDepot.BOND_SEXTUPLE)+'" /></label><input type="checkbox" id="'+this.id+'_type_h"><label for="'+this.id+'_type_h"><img width="20" height="20" src="'+imageDepot.getURI(imageDepot.BOND_HALF)+'" /></label><input type="checkbox" id="'+this.id+'_type_r"><label for="'+this.id+'_type_r"><img width="20" height="20" src="'+imageDepot.getURI(imageDepot.BOND_RESONANCE)+'" /></label><input type="checkbox" id="'+this.id+'_type_a"><label for="'+this.id+'_type_a"><img width="20" height="20" src="'+imageDepot.getURI(imageDepot.BOND_ANY)+'" /></label></div>'));
		sb.push('<tr><td colspan="4"><hr style="width:100%"></td></tr>');
		sb.push(makeRow(this.id+'_aromatic', 'Aromatic', 'A', 'Specifies that the matched bond should be aromatic. Use the NOT modifier to specify not aromatic or anti-aromatic.'));
		sb.push(makeRow(this.id+'_ringCount', 'Ring Count', 'R', 'Defines the total number of rings this bond is a member of. (SSSR)', 1));
		sb.push(makeRow(this.id+'_stereo', 'Stereochemistry', '@', 'Defines the stereochemical configuration of the bond.', '<div id="'+this.id+'_radio"><input type="radio" id="'+this.id+'_stereo_a" name="radio"><label for="'+this.id+'_stereo_a">Any (A)</label><input type="radio" id="'+this.id+'_stereo_e" name="radio"><label for="'+this.id+'_stereo_e">Entgegen (E)</label><input type="radio" id="'+this.id+'_stereo_z" name="radio"><label for="'+this.id+'_stereo_z">Zusammen (Z)</label></div>'));
		sb.push('</table>');
		sb.push('</div>');
		if (document.getElementById(this.sketcher.id)) {
			let canvas = q('#' + this.sketcher.id);
			canvas.before(sb.join(''));
		} else {
			document.writeln(sb.join(''));
		}
		let self = this;
		function setNewQuery(){
			let query = new structures.Query(structures.Query.TYPE_BOND);

			if(q('#'+self.id+'_type_0').is(':checked')){
				query.orders.v.push('0');
			}
			if(q('#'+self.id+'_type_1').is(':checked')){
				query.orders.v.push('1');
			}
			if(q('#'+self.id+'_type_2').is(':checked')){
				query.orders.v.push('2');
			}
			if(q('#'+self.id+'_type_3').is(':checked')){
				query.orders.v.push('3');
			}
			if(q('#'+self.id+'_type_4').is(':checked')){
				query.orders.v.push('4');
			}
			if(q('#'+self.id+'_type_5').is(':checked')){
				query.orders.v.push('5');
			}
			if(q('#'+self.id+'_type_6').is(':checked')){
				query.orders.v.push('6');
			}
			if(q('#'+self.id+'_type_h').is(':checked')){
				query.orders.v.push('h');
			}
			if(q('#'+self.id+'_type_r').is(':checked')){
				query.orders.v.push('r');
			}
			if(q('#'+self.id+'_type_a').is(':checked')){
				query.orders.v.push('a');
			}
			if(q('#'+self.id+'_orders_not').is(':checked')){
				query.orders.not = true;
			}
			
			if(q('#'+self.id+'_aromatic_include').is(':checked')){
				query.aromatic = {v:true,not:q('#'+self.id+'_aromatic_not').is(':checked')};
			}
			if(q('#'+self.id+'_ringCount_include').is(':checked')){
				query.ringCount = {v:query.parseRange(q('#'+self.id+'_ringCount_value').val()),not:q('#'+self.id+'_ringCount_not').is(':checked')};
			}
			if(q('#'+self.id+'_stereo_include').is(':checked')){
				let val = 'E';
				if(q('#'+self.id+'_stereo_a').is(':checked')){
					val = 'A';
				}else if(q('#'+self.id+'_stereo_z').is(':checked')){
					val = 'Z';
				}
				query.stereo = {v:val,not:q('#'+self.id+'_stereo_not').is(':checked')};
			}
			
			self.sketcher.historyManager.pushUndo(new actions.ChangeQueryAction(self.b, query));
			q(this).dialog('close');
		};
		q('#'+this.id+'_radioTypes').buttonset();
		q('#'+this.id+'_radio').buttonset();
		this.getElement().dialog({
			autoOpen : false,
			width : 520,
			height: 300,
			buttons : {
				'Cancel' : function(){q(this).dialog('close');},
				'Remove' : function(){self.sketcher.historyManager.pushUndo(new actions.ChangeQueryAction(self.b));q(this).dialog('close');},
				'Set' : setNewQuery
			},
			open : function(event, ui) {
				q("#"+self.id).animate({ scrollTop: 0 }, "fast");
			}
		});
	};

})(ChemDoodle, ChemDoodle.structures, ChemDoodle.uis.actions, ChemDoodle.uis.gui.desktop, ChemDoodle.uis.gui.imageDepot, ChemDoodle.lib.jQuery, document);

(function(c, desktop, q, document, undefined) {
	'use strict';
	desktop.MolGrabberDialog = function(sketcherid, subid) {
		this.sketcherid = sketcherid;
		this.id = sketcherid + subid;
	};
	let _ = desktop.MolGrabberDialog.prototype = new desktop.Dialog();
	_.title = 'MolGrabber';
	_.setup = function() {
		let sb = [];
		sb.push('<div style="font-size:12px;text-align:center;" id="');
		sb.push(this.id);
		sb.push('" title="');
		sb.push(this.title);
		sb.push('">');
		if (this.message) {
			sb.push('<p>');
			sb.push(this.message);
			sb.push('</p>');
		}
		// Next is the MolGrabberCanvas, whose constructor will be called AFTER
		// the elements are in the DOM.
		sb.push('<canvas class="ChemDoodleWebComponent" id="');
		sb.push(this.id);
		sb.push('_mg"></canvas>');
		if (this.afterMessage) {
			sb.push('<p>');
			sb.push(this.afterMessage);
			sb.push('</p>');
		}
		sb.push('</div>');
		if (document.getElementById(this.sketcherid)) {
			let canvas = q('#' + this.sketcherid);
			canvas.before(sb.join(''));
		} else {
			document.writeln(sb.join(''));
		}
		this.canvas = new c.MolGrabberCanvas(this.id + '_mg', 200, 200);
		this.canvas.styles.backgroundColor = '#fff';
		this.canvas.repaint();
		let self = this;
		this.getElement().dialog({
			autoOpen : false,
			width : 250,
			buttons : self.buttons
		});
	};

})(ChemDoodle, ChemDoodle.uis.gui.desktop, ChemDoodle.lib.jQuery, document);

(function(c, desktop, q, document, undefined) {
	'use strict';
	desktop.PeriodicTableDialog = function(sketcher, subid) {
		this.sketcher = sketcher;
		this.id = sketcher.id + subid;
	};
	let _ = desktop.PeriodicTableDialog.prototype = new desktop.Dialog();
	_.title = 'Periodic Table';
	_.setup = function() {
		let sb = [];
		sb.push('<div style="text-align:center;" id="');
		sb.push(this.id);
		sb.push('" title="');
		sb.push(this.title);
		sb.push('">');
		sb.push('<canvas class="ChemDoodleWebComponents" id="');
		sb.push(this.id);
		sb.push('_pt"></canvas></div>');
		if (document.getElementById(this.sketcher.id)) {
			let canvas = q('#' + this.sketcher.id);
			canvas.before(sb.join(''));
		} else {
			document.writeln(sb.join(''));
		}
		this.canvas = new ChemDoodle.PeriodicTableCanvas(this.id + '_pt', 30);
		// set default to oxygen
		this.canvas.selected = this.canvas.cells[7];
		this.canvas.repaint();
		let self = this;
		this.canvas.click = function(evt) {
			if (this.hovered) {
				this.selected = this.hovered;
				let e = this.getHoveredElement();
				self.sketcher.stateManager.setState(self.sketcher.stateManager.STATE_LABEL);
				self.sketcher.stateManager.STATE_LABEL.label = e.symbol;
				if(self.sketcher.floatDrawTools){
					self.sketcher.toolbarManager.labelTray.open(self.sketcher.toolbarManager.buttonLabelPT);
				}else{
					self.sketcher.toolbarManager.buttonLabel.absorb(self.sketcher.toolbarManager.buttonLabelPT);
				}
				self.sketcher.toolbarManager.buttonLabel.select();
				this.repaint();
			}
		};
		this.getElement().dialog({
			autoOpen : false,
			width : 600,
			buttons : self.buttons
		});
	};

})(ChemDoodle, ChemDoodle.uis.gui.desktop, ChemDoodle.lib.jQuery, document);
(function(desktop, q, document, undefined) {
	'use strict';
	desktop.Popover = function(sketcher, id, free, onclose) {
		this.sketcher = sketcher;
		this.id = id;
		this.free = free;
		this.onclose = onclose;
	};
	let _ = desktop.Popover.prototype;
	_.getHiddenSource = function() {
		let sb = [];
		sb.push('<div style="display:none;position:absolute;z-index:10;border:1px #C1C1C1 solid;background:#F5F5F5;padding:5px;');
		if(this.free){
			// if free, round all edges
			sb.push('border-radius:5px;-moz-border-radius:5px;');
		}else{
			sb.push('border-bottom-left-radius:5px;-moz-border-radius-bottomleft:5px;border-bottom-right-radius:5px;-moz-border-radius-bottomright:5px;border-top-color:black;');
		}
		sb.push('" id="');
		sb.push(this.id);
		sb.push('">');
		sb.push(this.getContentSource());
		sb.push('</div>');
		return sb.join('');
	};
	_.setup = function() {
		if (document.getElementById(this.sketcher.id)) {
			let canvas = q('#' + this.sketcher.id);
			canvas.before(this.getHiddenSource());
		} else {
			document.writeln(this.getHiddenSource());
		}
		let tag = '#' + this.id;
		q(tag).hide();
		if(this.setupContent){
			this.setupContent();
		}
	};
	_.show = function(e){
		if(this.sketcher.modal){
			// apparently there is already another popover up, this shouldn't happen
			return false;
		}
		this.sketcher.modal = this;
		this.sketcher.doEventDefault = true;
		let component = q('#' + this.id);
		let self = this;
		if(this.free){
			component.fadeIn(200).position({
				my : 'center bottom',
				at : 'center top',
				of : e,
				collision : 'fit'
			});
		}else{
			component.slideDown(400).position({
				my : 'center top',
				at : 'center top',
				of : q('#' + this.sketcher.id),
				collision : 'fit'
			});
		}
		return false;
	};
	_.close = function(cancel){
		let component = q('#' + this.id);
		if(this.free){
			component.hide(0);
		}else{
			component.slideUp(400);
		}
		if(this.onclose){
			this.onclose(cancel);
		}
		this.sketcher.modal = undefined;
		this.sketcher.doEventDefault = false;
	};

})(ChemDoodle.uis.gui.desktop, ChemDoodle.lib.jQuery, document);

(function(c, desktop, q, document, undefined) {
	'use strict';
	desktop.SaveFileDialog = function(id, sketcher) {
		this.id = id;
		this.sketcher = sketcher;
	};
	let _ = desktop.SaveFileDialog.prototype = new desktop.Dialog();
	_.title = 'Save File';
	_.clear = function() {
		q('#' + this.id + '_link').html('The file link will appear here.');
	};
	_.setup = function() {
		let sb = [];
		sb.push('<div style="font-size:12px;" id="');
		sb.push(this.id);
		sb.push('" title="');
		sb.push(this.title);
		sb.push('">');
		sb.push('<p>Select the file format to save your structure to and click on the <strong>Generate File</strong> button.</p>');
		sb.push('<select id="');
		sb.push(this.id);
		sb.push('_select">');
		sb.push('<option value="sk2">ACD/ChemSketch Document {sk2}');
		sb.push('<option value="ros">Beilstein ROSDAL {ros}');
		sb.push('<option value="cdx">Cambridgesoft ChemDraw Exchange {cdx}');
		sb.push('<option value="cdxml">Cambridgesoft ChemDraw XML {cdxml}');
		sb.push('<option value="mrv">ChemAxon Marvin Document {mrv}');
		sb.push('<option value="cml">Chemical Markup Language {cml}');
		sb.push('<option value="smiles">Daylight SMILES {smiles}');
		sb.push('<option value="icl" selected>iChemLabs ChemDoodle Document {icl}');
		sb.push('<option value="inchi">IUPAC InChI {inchi}');
		sb.push('<option value="jdx">IUPAC JCAMP-DX {jdx}');
		sb.push('<option value="skc">MDL ISIS Sketch {skc}');
		sb.push('<option value="tgf">MDL ISIS Sketch Transportable Graphics File {tgf}');
		sb.push('<option value="mol">MDL MOLFile {mol}');
		// sb.push('<option value="rdf">MDL RDFile {rdf}');
		// sb.push('<option value="rxn">MDL RXNFile {rxn}');
		sb.push('<option value="sdf">MDL SDFile {sdf}');
		sb.push('<option value="jme">Molinspiration JME String {jme}');
		sb.push('<option value="pdb">RCSB Protein Data Bank {pdb}');
		sb.push('<option value="mmd">Schr&ouml;dinger Macromodel {mmd}');
		sb.push('<option value="mae">Schr&ouml;dinger Maestro {mae}');
		sb.push('<option value="smd">Standard Molecular Data {smd}');
		sb.push('<option value="mol2">Tripos Mol2 {mol2}');
		sb.push('<option value="sln">Tripos SYBYL SLN {sln}');
		sb.push('<option value="xyz">XYZ {xyz}');
		sb.push('</select>');
		sb.push('<button type="button" id="');
		sb.push(this.id);
		sb.push('_button">');
		sb.push('Generate File</button>');
		sb.push('<p>When the file is written, a link will appear in the red-bordered box below, right-click on the link and choose the browser\'s <strong>Save As...</strong> function to save the file to your computer.</p>');
		sb.push('<div style="width:100%;height:30px;border:1px solid #c10000;text-align:center;" id="');
		sb.push(this.id);
		sb.push('_link">The file link will appear here.</div>');
		sb.push('<p><a href="http://www.chemdoodle.com" target="_blank">How do I use these files?</a></p>');
		sb.push('</div>');
		if (document.getElementById(this.sketcher.id)) {
			let canvas = q('#' + this.sketcher.id);
			canvas.before(sb.join(''));
		} else {
			document.writeln(sb.join(''));
		}
		let self = this;
		q('#' + this.id + '_button').click(function() {
			q('#' + self.id + '_link').html('Generating file, please wait...');
			ChemDoodle.iChemLabs.saveFile(self.sketcher.oneMolecule ? self.sketcher.molecules[0] : self.sketcher.lasso.getFirstMolecule(), {
				ext : q('#' + self.id + '_select').val()
			}, function(link) {
				q('#' + self.id + '_link').html('<a href="' + link + '"><span style="text-decoration:underline;">File is generated. Right-click on this link and Save As...</span></a>');
			});
		});
		this.getElement().dialog({
			autoOpen : false,
			width : 435,
			buttons : self.buttons
		});
	};

})(ChemDoodle, ChemDoodle.uis.gui.desktop, ChemDoodle.lib.jQuery, document);

(function(c, io, desktop, templateDepot, q, m, document, JSON, localStorage, undefined) {
	'use strict';
	
	let INTERPRETER = new io.JSONInterpreter();
	let allowedRegex = /[^A-z0-9]|\[|\]/g;
	
	desktop.TemplateDialog = function(sketcher, subid) {
		this.sketcher = sketcher;
		this.id = sketcher.id + subid;
	};
	let _ = desktop.TemplateDialog.prototype = new desktop.Dialog();
	_.title = 'Templates';
	_.setup = function() {
		let self = this;
		let sb = [];
		sb.push('<div style="font-size:12px;align-items:center;display:flex;flex-direction:column;" id="');
		sb.push(this.id);
		sb.push('" title="');
		sb.push(this.title);
		sb.push('">');
		// Next is the MolGrabberCanvas, whose constructor will be called AFTER
		// the elements are in the DOM.
		sb.push('<canvas class="ChemDoodleWebComponent" id="');
		sb.push(this.id);
		sb.push('_buffer" style="display:none;"></canvas>');
		sb.push('<canvas class="ChemDoodleWebComponent" id="');
		sb.push(this.id);
		sb.push('_attachment"></canvas>');
		sb.push('<div><select id="');
		sb.push(this.id);
		sb.push('_select">');
		for(let i = 0, ii = templateDepot.length; i<ii; i++){
			let group = templateDepot[i];
			sb.push('<option value="');
			sb.push(group.name);
			sb.push('">');
			sb.push(group.name);
			sb.push('</option>');
		}
		sb.push('</select>');
		sb.push('&nbsp;&nbsp;<button type="button" id="');
		sb.push(this.id);
		sb.push('_button_add">Add Template</button></div>');
		// have to include height for Safari...
		sb.push('<div id="');
		sb.push(this.id);
		sb.push('_scroll" style="width:100%;height:150px;flex-grow:1;overflow-y:scroll;overflow-x:hidden;background:#eee;padding-right:5px;padding-bottom:5px;">');
		for(let i = 0, ii = templateDepot.length; i<ii; i++){
			let group = templateDepot[i];
			group.condensedName = group.name.replace(allowedRegex, '');
			sb.push('<div style="display:flex;flex-wrap:wrap;justify-content:center;" id="');
			sb.push(this.id);
			sb.push('_');
			sb.push(group.condensedName);
			sb.push('_panel">');
			sb.push('</div>');
		}
		sb.push('</div>');
		sb.push('</div>');
		if (document.getElementById(this.sketcher.id)) {
			let canvas = q('#' + this.sketcher.id);
			canvas.before(sb.join(''));
		} else {
			document.writeln(sb.join(''));
		}
		this.buffer = new c.ViewerCanvas(this.id + '_buffer', 100, 100);
		this.bufferElement = document.getElementById(this.buffer.id);
		this.canvas = new c.ViewerCanvas(this.id + '_attachment', 200, 200);
		this.canvas.mouseout = function(e){
			if(this.molecules.length!==0){
				for(let i = 0, ii = this.molecules[0].atoms.length; i<ii; i++){
					this.molecules[0].atoms[i].isHover = false;
				}
				this.repaint();
			}
		};
		this.canvas.touchend = this.canvas.mouseout;
		this.canvas.mousemove = function(e){
			if(this.molecules.length!==0){
				let closest=undefined;
				e.p.x = this.width / 2 + (e.p.x - this.width / 2) / this.styles.scale;
				e.p.y = this.height / 2 + (e.p.y - this.height / 2) / this.styles.scale;
				for(let i = 0, ii = this.molecules[0].atoms.length; i<ii; i++){
					let a = this.molecules[0].atoms[i];
					a.isHover = false;
					if(closest===undefined || e.p.distance(a)<e.p.distance(closest)){
						closest = a;
					}
				}
				if(e.p.distance(closest)<10){
					closest.isHover = true;
				}
				this.repaint();
			}
		};
		this.canvas.mousedown = function(e){
			if(this.molecules.length!==0){
				let cont = false;
				for(let i = 0, ii = this.molecules[0].atoms.length; i<ii; i++){
					let a = this.molecules[0].atoms[i];
					if(a.isHover){
						cont = true;
						break;
					}
				}
				// if no atom is hovered, then don't continue
				if(cont){
					for(let i = 0, ii = this.molecules[0].atoms.length; i<ii; i++){
						let a = this.molecules[0].atoms[i];
						a.isSelected = false;
						if(a.isHover){
							a.isSelected = true;
							a.isHover = false;
							self.sketcher.stateManager.STATE_NEW_TEMPLATE.attachPos = i;
							self.sketcher.toolbarManager.buttonTemplate.select();
							self.sketcher.toolbarManager.buttonTemplate.getElement().click();
						}
					}
				}
				this.repaint();
			}
		};
		this.canvas.touchstart = function(e){self.canvas.mousemove(e);self.canvas.mousedown(e);}
		this.canvas.drawChildExtras = function(ctx, styles){
			ctx.strokeStyle = self.sketcher.styles.colorSelect;
			ctx.fillStyle = self.sketcher.styles.colorSelect;
			ctx.beginPath();
			ctx.arc(8, 8, 7, 0, m.PI * 2, false);
			ctx.stroke();
			ctx.textAlign = 'left';
			ctx.textBaseline = 'middle';
			ctx.fillText('Substitution Point', 18, 8);
			ctx.save();
			ctx.translate(this.width / 2, this.height / 2);
			ctx.rotate(styles.rotateAngle);
			ctx.scale(styles.scale, styles.scale);
			ctx.translate(-this.width / 2, -this.height / 2);
			if(this.molecules.length!==0){
				for(let i = 0, ii = this.molecules[0].atoms.length; i<ii; i++){
					this.molecules[0].atoms[i].drawDecorations(ctx, self.sketcher.styles);
				}
			}
			ctx.restore();
		};
		
		this.getElement().dialog({
			autoOpen : false,
			width : 520,
			height : 450,
			buttons : self.buttons,
			open : function(){
				if(!self.populated){
					self.populated = true;
					self.populate();
				}
			}
		});
		
		let select = q('#'+this.id+'_select');
		select.change(function(){
			let index = this.selectedIndex;
			for(let i = 0, ii = templateDepot.length; i<ii; i++){
				let group = templateDepot[i];
				q('#'+self.id+'_'+group.condensedName+'_panel').hide();
			}
			q('#'+self.id+'_'+templateDepot[index].condensedName+'_panel').show();
			q('#'+self.id+'_scroll').scrollTop(0);
			self.loadTemplate(index, 0, true);
		});
		
		q('#'+this.id+'_button_add').click(function(){
			if(self.sketcher.lasso.atoms.length===0){
				alert('Please select a structure to define a template.');
			}else{
				let cont = true;
				if(self.sketcher.lasso.atoms.length>1){
					let mol = self.sketcher.lasso.getFirstMolecule();
					for(let i = 1, ii = self.sketcher.lasso.atoms.length; i<ii; i++){
						if(mol!==self.sketcher.getMoleculeByAtom(self.sketcher.lasso.atoms[i])){
							cont = false;
							alert('Templates may only be defined of a single discrete structure.');
							break;
						}
					}
				}
				if(cont){
					let name = prompt("Please enter the template name:", "My template");
					if(name!==null){
						let userTemplates = templateDepot[templateDepot.length-1];
						let jsonm = INTERPRETER.molTo(self.sketcher.lasso.getFirstMolecule());
						let mol = INTERPRETER.molFrom(jsonm);
						let panel = q('#'+self.id+'_'+userTemplates.condensedName+'_panel');
						if(userTemplates.templates.length===0){
							panel.empty();
						}
						let t = {name:name, data:jsonm};
						mol.scaleToAverageBondLength(self.sketcher.styles.bondLength_2D);
						self.buffer.loadMolecule(mol);
						t.img = self.bufferElement.toDataURL('image/png');
						t.condensedName = t.name.replace(allowedRegex, '');
						panel.append('<div style="margin-left:5px;margin-top:5px;"><center><img src="'+t.img+'" id="'+self.id+'_'+t.condensedName+'" g="'+(templateDepot.length-1)+'" t="'+userTemplates.templates.length+'"style="width:100px;height:100px;" /><br>'+t.name+'</center></div>');
						let img = q('#'+self.id+'_'+t.condensedName);
						img.click(function(){
							self.loadTemplate(parseInt(this.getAttribute('g')), parseInt(this.getAttribute('t')), true);
						});
						img.hover(function(){q(this).css({'border':'1px solid '+self.sketcher.styles.colorHover, 'margin':'-1px'});}, function(){q(this).css({'border':'none', 'margin':'0px'});});
						userTemplates.templates.push(t);
						// IE/Edge doesn't allow localStorage from local files
						if(localStorage){
							localStorage.setItem('chemdoodle_user_templates', JSON.stringify(templateDepot[templateDepot.length-1].templates));
						}
					}
				}
			}
		});
	};
	_.loadTemplate = function(g, t, changeState){
		let template = templateDepot[g].templates[t];
		if(template){
			let loading = INTERPRETER.molFrom(template.data);
			loading.scaleToAverageBondLength(this.sketcher.styles.bondLength_2D);
			let first = -1;
			let min = Infinity;
			for (let i = 0, ii = loading.atoms.length; i<ii; i++) {
				let a = loading.atoms[i];
				if (a.label==='C' && a.x < min) {
					first = i;
					min = a.x;
				}
			}
			if (first === -1) {
				first = 0;
			}
			loading.atoms[first].isSelected = true;
			this.canvas.loadMolecule(loading);
			this.sketcher.stateManager.STATE_NEW_TEMPLATE.template = template.data;
			this.sketcher.stateManager.STATE_NEW_TEMPLATE.attachPos = first;
			if(changeState){
				this.sketcher.toolbarManager.buttonTemplate.select();
				this.sketcher.toolbarManager.buttonTemplate.getElement().click();
			}
		}
	};
	_.populate = function() {
		// copy over styles from the sketcher
		this.canvas.styles = q.extend({}, this.sketcher.styles);
		this.canvas.styles.atoms_implicitHydrogens_2D = false;
		this.buffer.styles = q.extend({}, this.sketcher.styles);
		this.buffer.styles.atoms_implicitHydrogens_2D = false;
		// make template panels
		let self = this;
		for(let i = 0, ii = templateDepot.length; i<ii; i++){
			let group = templateDepot[i];
			let panel = q('#'+this.id+'_'+group.condensedName+'_panel');
			if(group.templates.length===0){
				panel.append('<div style="margin:5px;">There are no templates in this group.</div>');
			}else{
				for(let j = 0, jj = group.templates.length; j<jj; j++){
					let t = group.templates[j];
					let mol = INTERPRETER.molFrom(t.data);
					mol.scaleToAverageBondLength(this.sketcher.styles.bondLength_2D);
					this.buffer.loadMolecule(mol);
					t.img = this.bufferElement.toDataURL('image/png');
					t.condensedName = t.name.replace(allowedRegex, '');
					panel.append('<div style="margin-left:5px;margin-top:5px;"><center><img src="'+t.img+'" id="'+this.id+'_'+t.condensedName+'" g="'+i+'" t="'+j+'" style="width:100px;height:100px;border-radius:10px;" /><br>'+t.name+'</center></div>');
					let img = q('#'+this.id+'_'+t.condensedName);
					img.click(function(){
						self.loadTemplate(parseInt(this.getAttribute('g')), parseInt(this.getAttribute('t')), true);
					});
					img.hover(function(){q(this).css({'border':'1px solid '+self.sketcher.styles.colorHover, 'margin':'-1px'});}, function(){q(this).css({'border':'none', 'margin':'0px'});});
				}
			}
			if(i!==0){
				panel.hide();
			}
		}
		if(templateDepot.length!==0){
			q('#'+this.id+'_'+templateDepot[0].condensedName+'_panel').show();
			this.loadTemplate(0, 0, false);
		}
	};

})(ChemDoodle, ChemDoodle.io, ChemDoodle.uis.gui.desktop, ChemDoodle.uis.gui.templateDepot, ChemDoodle.lib.jQuery, Math, document, JSON, localStorage);

(function(c, actions, gui, desktop, q, undefined) {
	'use strict';
	gui.DialogManager = function(sketcher) {
		let self = this;
	
		if (sketcher.useServices) {
			this.saveDialog = new desktop.SaveFileDialog(sketcher.id + '_save_dialog', sketcher);
		} else {
			this.saveDialog = new desktop.Dialog(sketcher.id, '_save_dialog', 'Save Molecule');
			this.saveDialog.message = 'Copy and paste the content of the textarea into a file and save it with the extension <strong>.mol</strong>.';
			this.saveDialog.includeTextArea = true;
			// You must keep this link displayed at all times to abide by the
			// license
			// Contact us for permission to remove it,
			// http://www.ichemlabs.com/contact-us
			//this.saveDialog.afterMessage = '';
		}
		this.saveDialog.setup();

		this.openPopup = new desktop.Popover(sketcher, sketcher.id+'_open_popover');
		this.openPopup.getContentSource = function(){
			let sb = ['<div style="width:320px;">'];
			sb.push('<div width="100%">Paste SMILES text here.</div>');
			sb.push('<textarea rows="12" id="'+sketcher.id+'_open_text" style="width:100%;"></textarea>');
			sb.push('<br><button type="button" style="margin-left:270px;" id="'+sketcher.id+'_open_load">Load</button></div>');
			return sb.join('');
		};
		this.openPopup.setupContent = function(){
			q('#'+sketcher.id+'_open_load').click(function(){
				self.openPopup.close();
				let s = q('#'+sketcher.id+'_open_text').val();
				let newContent;
				if (s.indexOf('v2000') !== -1 || s.indexOf('V2000') !== -1) {
					newContent = {
						molecules : [ c.readMOL(s) ],
						shapes : []
					};
				} else if (s.charAt(0) === '{') {
					newContent = c.readJSON(s);
				}
				if (sketcher.oneMolecule && newContent && newContent.molecules.length > 0 && newContent.molecules[0].atoms.length > 0) {
					sketcher.historyManager.pushUndo(new actions.SwitchMoleculeAction(sketcher, newContent.molecules[0]));
				} else if (!sketcher.oneMolecule && newContent && (newContent.molecules.length > 0 || newContent.shapes.length > 0)) {
					sketcher.historyManager.pushUndo(new actions.SwitchContentAction(sketcher, newContent.molecules, newContent.shapes));
				} else if (s.match(/^[\+\-\[\]\(\)\\\/\d=#a-zA-Z]+$/)){
					let host = "https://autoff.mp.iresearch.net.cn"
					q.ajax({
						url: host + "/api/obabel/smi2mol2D2",
						data: JSON.stringify({data:s}),
						method: "post",
						dataType: "json",
						contentType: 'application/json',
						success: function (res) {
							if(res.code == 1) return;
							let mol = res.data;
							newContent = {
								molecules : [ c.readMOL(mol) ],
								shapes : []
							};
							if (sketcher.oneMolecule && newContent && newContent.molecules.length > 0 && newContent.molecules[0].atoms.length > 0) {
								sketcher.historyManager.pushUndo(new actions.SwitchMoleculeAction(sketcher, newContent.molecules[0]));
							} else if (!sketcher.oneMolecule && newContent && (newContent.molecules.length > 0 || newContent.shapes.length > 0)) {
								sketcher.historyManager.pushUndo(new actions.SwitchContentAction(sketcher, newContent.molecules, newContent.shapes));
							}
						}
					});
					// q.get('http://121.42.137.238/chemmol/src/server/smiToMol.php?smiles='+encodeURI(encodeURIComponent(s)),function(data,status){
					// 	let res = JSON.parse(data);
					// 	let mol = res.data.mol;
					// 	newContent = {
					// 		molecules : [ c.readMOL(mol) ],
					// 		shapes : []
					// 	};
					// 	if (sketcher.oneMolecule && newContent && newContent.molecules.length > 0 && newContent.molecules[0].atoms.length > 0) {
					// 		sketcher.historyManager.pushUndo(new actions.SwitchMoleculeAction(sketcher, newContent.molecules[0]));
					// 	} else if (!sketcher.oneMolecule && newContent && (newContent.molecules.length > 0 || newContent.shapes.length > 0)) {
					// 		sketcher.historyManager.pushUndo(new actions.SwitchContentAction(sketcher, newContent.molecules, newContent.shapes));
					// 	}
					// })
				}
			});
		};
		this.openPopup.setup();

		this.atomQueryDialog = new desktop.AtomQueryDialog(sketcher, '_atom_query_dialog');
		this.atomQueryDialog.setup();

		this.bondQueryDialog = new desktop.BondQueryDialog(sketcher, '_bond_query_dialog');
		this.bondQueryDialog.setup();

		this.templateDialog = new desktop.TemplateDialog(sketcher, '_templates_dialog');
		this.templateDialog.setup();

		this.searchDialog = new desktop.MolGrabberDialog(sketcher.id, '_search_dialog');
		this.searchDialog.buttons = {
			'Load' : function() {
				let newMol = self.searchDialog.canvas.molecules[0];
				if (newMol && newMol.atoms.length > 0) {
					q(this).dialog('close');
					if (sketcher.oneMolecule) {
						if (newMol !== sketcher.molecule) {
							sketcher.historyManager.pushUndo(new actions.SwitchMoleculeAction(sketcher, newMol));
						}
					} else {
						sketcher.historyManager.pushUndo(new actions.AddContentAction(sketcher, self.searchDialog.canvas.molecules, self.searchDialog.canvas.shapes));
						sketcher.toolbarManager.buttonLasso.select();
						sketcher.toolbarManager.buttonLasso.getElement().click();
						let as = [];
						for(let i = 0, ii = self.searchDialog.canvas.molecules.length; i<ii; i++){
							as = as.concat(self.searchDialog.canvas.molecules[i].atoms);
						}
						sketcher.lasso.select(as, self.searchDialog.canvas.shapes);
					}
				}else{
					alert('After entering a search term, press the "Show Molecule" button to show it before loading. To close this dialog, press the "X" button to the top-right.');
				}
			}
		};
		this.searchDialog.setup();

		if (sketcher.setupScene) {
			this.stylesDialog = new desktop.SpecsDialog(sketcher, '_styles_dialog');
			this.stylesDialog.buttons = {
				'Done' : function() {
					q(this).dialog('close');
				}
			};
			this.stylesDialog.setup(this.stylesDialog, sketcher);
		}

		this.periodicTableDialog = new desktop.PeriodicTableDialog(sketcher, '_periodicTable_dialog');
		// this.periodicTableDialog.buttons = {
		// 	'Close' : function() {
		// 		q(this).dialog('close');
		// 	}
		// };
		this.periodicTableDialog.setup();

		this.calculateDialog = new desktop.Dialog(sketcher.id, '_calculate_dialog', 'Calculations');
		this.calculateDialog.includeTextArea = true;
		// You must keep this link displayed at all times to abide by the license
		// Contact us for permission to remove it,
		// http://www.ichemlabs.com/contact-us
		this.calculateDialog.afterMessage = '<a href="http://www.chemdoodle.com" target="_blank">Want more calculations?</a>';
		this.calculateDialog.setup();

		this.inputDialog = new desktop.Dialog(sketcher.id, '_input_dialog', 'Input');
		this.inputDialog.message = 'Please input the rgroup number (must be a positive integer). Input "-1" to remove the rgroup.';
		this.inputDialog.includeTextField = true;
		this.inputDialog.buttons = {
			'Done' : function() {
				q(this).dialog('close');
				if (self.inputDialog.doneFunction) {
					self.inputDialog.doneFunction(self.inputDialog.getTextField().val());
				}
			}
		};
		this.inputDialog.setup();
		
		if(this.makeOtherDialogs){
			this.makeOtherDialogs(sketcher);
		}
	};

})(ChemDoodle, ChemDoodle.uis.actions, ChemDoodle.uis.gui, ChemDoodle.uis.gui.desktop, ChemDoodle.lib.jQuery);
(function(desktop, imageDepot, q, document, undefined) {
	'use strict';
	desktop.DropDown = function(id, tooltip, dummy) {
		this.id = id;
		this.tooltip = tooltip;
		this.dummy = dummy;
		this.buttonSet = new desktop.ButtonSet(id + '_set');
		this.buttonSet.buttonGroup = tooltip;
		this.defaultButton = undefined;
	};
	let _ = desktop.DropDown.prototype;
	_.getButtonSource = function() {
		let sb = [];
		sb.push('<button type="button" id="');
		sb.push(this.id);
		sb.push('" onclick="return false;" title="');
		sb.push(this.tooltip);
		sb.push('" style="box-sizing:border-box;margin-top:0px; margin-bottom:1px; padding:0px; height:28px; width:15px;"><img title="');
		sb.push(this.tooltip);
		sb.push('" width="9" height="20" src="');
		sb.push(imageDepot.getURI(imageDepot.ARROW_DOWN));
		sb.push('"></button>');
		return sb.join('');
	};
	_.getHiddenSource = function() {
		let sb = [];
		sb.push('<div style="display:none;position:absolute;z-index:10;border:1px #C1C1C1 solid;background:#F5F5F5;padding:5px;border-bottom-left-radius:5px;-moz-border-radius-bottomleft:5px;border-bottom-right-radius:5px;-moz-border-radius-bottomright:5px;" id="');
		sb.push(this.id);
		sb.push('_hidden">');
		sb.push(this.buttonSet.getSource(this.id + '_popup_set'));
		sb.push('</div>');
		return sb.join('');
	};
	_.setup = function() {
		if (!this.defaultButton) {
			this.defaultButton = this.buttonSet.buttons[0];
		}
		let tag = '#' + this.id;
		let qt = q(tag);
		qt.button();
		qt.click(function() {
			// mobile safari doesn't allow clicks to be triggered
			q(document).trigger('click');
			let qth = q(tag + '_hidden');
			qth.show().position({
				my : 'center top',
				at : 'center bottom',
				of : this,
				collision : 'fit'
			});
			q(document).one('click', function() {
				qth.hide();
			});
			return false;
		});
		this.buttonSet.setup();
		let self = this;
		q.each(this.buttonSet.buttons, function(index, value) {
			self.buttonSet.buttons[index].getElement().click(function() {
				self.dummy.absorb(self.buttonSet.buttons[index]);
				// both are needed, the first highlights, the second executes, select should be called first to get the tray to disappear
				self.dummy.select();
				self.dummy.getElement().click();
			});
		});
		self.dummy.absorb(this.defaultButton);
		this.defaultButton.select();
	};

})(ChemDoodle.uis.gui.desktop, ChemDoodle.uis.gui.imageDepot, ChemDoodle.lib.jQuery, document);

(function(desktop, imageDepot, q, undefined) {
	'use strict';
	desktop.DummyButton = function(id, tooltip) {
		this.id = id;
		this.toggle = false;
		this.tooltip = tooltip ? tooltip : '';
		this.func = undefined;
	};
	let _ = desktop.DummyButton.prototype = new desktop.Button();
	_.setup = function() {
		let self = this;
		this.getElement().click(function() {
			self.func();
		});
	};
	_.absorb = function(button) {
		q('#' + this.id + '_icon').attr('src', imageDepot.getURI(button.icon));
		this.func = button.func;
	};

})(ChemDoodle.uis.gui.desktop, ChemDoodle.uis.gui.imageDepot, ChemDoodle.lib.jQuery);
(function(desktop, q, undefined) {
	'use strict';
	desktop.TextButton = function(id, tooltip, func) {
		this.id = id;
		this.toggle = false;
		this.tooltip = tooltip ? tooltip : '';
		this.func = func ? func : undefined;
	};
	let _ = desktop.TextButton.prototype = new desktop.Button();
	_.getSource = function(buttonGroup) {
		let sb = [];
		if (this.toggle) {
			sb.push('<input type="radio" name="');
			sb.push(buttonGroup);
			sb.push('" id="');
			sb.push(this.id);
			sb.push('" title="');
			sb.push(this.tooltip);
			sb.push('" /><label for="');
			sb.push(this.id);
			sb.push('">');
			sb.push(this.tooltip);
			sb.push('</label>');
		} else {
			sb.push('<button type="button" id="');
			sb.push(this.id);
			sb.push('" onclick="return false;" title="');
			sb.push(this.tooltip);
			sb.push('"><label for="');
			sb.push(this.id);
			sb.push('">');
			sb.push(this.tooltip);
			sb.push('</label></button>');
		}
		return sb.join('');
	};
	
	_.check = function() {
		let element = this.getElement();
		element.prop('checked', true);
		element.button('refresh');
	};
	
	_.uncheck = function() {
		let element = this.getElement();
		element.removeAttr('checked');
		element.button('refresh');
	};

})(ChemDoodle.uis.gui.desktop, ChemDoodle.lib.jQuery);
(function(desktop, imageDepot, q, document, undefined) {
	'use strict';
	desktop.Tray = function(sketcher, id, dummy, columnCount) {
		this.sketcher = sketcher;
		this.id = id;
		this.tooltip = dummy.tooltip;
		this.dummy = dummy;
		this.dummy.toggle = true;
		this.buttonSet = new desktop.ButtonSet(id + '_set');
		this.buttonSet.columnCount = columnCount;
		this.buttonSet.buttonGroup = this.tooltip;
		this.defaultButton = undefined;
	};
	let _ = desktop.Tray.prototype;
	_.getSource = function(buttonGroup) {
		let sb = [];
		sb.push(this.dummy.getSource(buttonGroup));
		sb.push('<div style="display:none;position:absolute;z-index:11;border:none;background:#F5F5F5;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);" id="');
		sb.push(this.id);
		sb.push('_hidden">');
		sb.push(this.buttonSet.getSource(this.id + '_popup_set'));
		sb.push('</div>');
		return sb.join('');
	};
	_.setup = function() {
		this.dummy.setup(true);
		let button = this.dummy.getElement();
		// dummy doesn't call button() because when used in drop downs, the buttonset function is called
		// so we have to call it here
		button.button();
		if (!this.defaultButton) {
			this.defaultButton = this.buttonSet.buttons[0];
		}
		let self = this;
		let tag = '#' + this.id;
		button.click(function() {
			// have to duplicate here as scope makes "this" the button
			if(self.sketcher.openTray!==self){
				if(self.sketcher.openTray){
					self.sketcher.openTray.close();
				}
				self.sketcher.openTray = self;
				// mobile safari doesn't allow clicks to be triggered
				q(document).trigger('click');
				q(tag + '_hidden').show();
			}
			self.reposition();
		});
		this.buttonSet.setup();
		q.each(this.buttonSet.buttons, function(index, value) {
			self.buttonSet.buttons[index].getElement().click(function() {
				self.dummy.absorb(self.buttonSet.buttons[index]);
			});
		});
		this.dummy.absorb(this.defaultButton);
		this.defaultButton.select();
	};
	_.open = function(select) {
		if(this.sketcher.openTray!==this){
			if(this.sketcher.openTray){
				this.sketcher.openTray.close();
			}
			this.sketcher.openTray = this;
			// mobile safari doesn't allow clicks to be triggered
			q(document).trigger('click');
			q('#'+this.id + '_hidden').show();
		}
		if(select){
			this.dummy.absorb(select);
			select.select();
		}
		this.reposition();
	};
	_.reposition = function(){
		let button = q('#'+this.dummy.id+'_icon');
		q('#' + this.id + '_hidden').position({
			my : 'right-8 center',
			at : 'left center',
			of : button,
			collision: 'flip none'
		});
	};
	_.close = function(){
		q('#' + this.id + '_hidden').hide();
		this.sketcher.openTray = undefined;
	};

})(ChemDoodle.uis.gui.desktop, ChemDoodle.uis.gui.imageDepot, ChemDoodle.lib.jQuery, document);
(function(c, iChemLabs, io, structures, actions, gui, imageDepot, desktop, tools, states, q, document, undefined) {
	'use strict';
	gui.ToolbarManager = function(sketcher) {
		this.sketcher = sketcher;

		if(this.sketcher.floatDrawTools){
			this.drawTools = new desktop.FloatingToolbar(sketcher);
		}
		
		// open
		this.buttonOpen = new desktop.Button(sketcher.id + '_button_open', imageDepot.OPEN, 'Import', function() {
			let component = q('#' + sketcher.dialogManager.openPopup.id);
			if (component.is(":hidden")){
				sketcher.dialogManager.openPopup.show();
			}else{
				sketcher.dialogManager.openPopup.close();
			}
		});
		// save
		this.buttonSave = new desktop.Button(sketcher.id + '_button_save', imageDepot.SAVE, 'Save', function() {
			if (sketcher.useServices) {
				sketcher.dialogManager.saveDialog.clear();
			} else if (sketcher.oneMolecule) {
				sketcher.dialogManager.saveDialog.getTextArea().val(c.writeMOL(sketcher.molecules[0]));
			} else if (sketcher.lasso.isActive()) {
				sketcher.dialogManager.saveDialog.getTextArea().val(c.writeMOL(sketcher.lasso.getFirstMolecule()));
			}
			sketcher.dialogManager.saveDialog.open();
		});
		// template
		this.buttonTemplate = new desktop.Button(sketcher.id + '_button_template', imageDepot.TEMPLATES, 'Templates', function() {
			sketcher.stateManager.setState(sketcher.stateManager.STATE_NEW_TEMPLATE);
			sketcher.dialogManager.templateDialog.open();
		});
		this.buttonTemplate.toggle = true;
		// search
		this.buttonSearch = new desktop.Button(sketcher.id + '_button_search', imageDepot.SEARCH, 'Search', function() {
			sketcher.dialogManager.searchDialog.open();
		});
		// calculate
		this.buttonCalculate = new desktop.Button(sketcher.id + '_button_calculate', imageDepot.CALCULATE, 'Calculate', function() {
			let mol = sketcher.oneMolecule ? sketcher.molecules[0] : sketcher.lasso.getFirstMolecule();
			if (mol) {
				iChemLabs.calculate(mol, {
					descriptors : [ 'mf', 'ef', 'mw', 'miw', 'deg_unsat', 'hba', 'hbd', 'rot', 'electron', 'pol_miller', 'cmr', 'tpsa', 'vabc', 'xlogp2', 'bertz' ]
				}, function(content) {
					let sb = [];
					function addDatum(title, value, unit) {
						sb.push(title);
						sb.push(': ');
						for ( let i = title.length + 2; i < 30; i++) {
							sb.push(' ');
						}
						sb.push(value);
						sb.push(' ');
						sb.push(unit);
						sb.push('\n');
					}
					addDatum('Molecular Formula', content.mf, '');
					addDatum('Empirical Formula', content.ef, '');
					addDatum('Molecular Mass', content.mw, 'amu');
					addDatum('Monoisotopic Mass', content.miw, 'amu');
					addDatum('Degree of Unsaturation', content.deg_unsat, '');
					addDatum('Hydrogen Bond Acceptors', content.hba, '');
					addDatum('Hydrogen Bond Donors', content.hbd, '');
					addDatum('Rotatable Bonds', content.rot, '');
					addDatum('Total Electrons', content.rot, '');
					addDatum('Molecular Polarizability', content.pol_miller, 'A^3');
					addDatum('Molar Refractivity', content.cmr, 'cm^3/mol');
					addDatum('Polar Surface Area', content.tpsa, 'A^2');
					addDatum('vdW Volume', content.vabc, 'A^3');
					addDatum('logP', content.xlogp2, '');
					addDatum('Complexity', content.bertz, '');
					sketcher.dialogManager.calculateDialog.getTextArea().val(sb.join(''));
					sketcher.dialogManager.calculateDialog.open();
				});
			}
		});

		// move
		this.buttonMove = new desktop.Button(sketcher.id + '_button_move', imageDepot.MOVE, 'Move', function() {
			sketcher.stateManager.setState(sketcher.stateManager.STATE_MOVE);
		});
		this.buttonMove.toggle = true;
		// erase
		this.buttonErase = new desktop.Button(sketcher.id + '_button_erase', imageDepot.ERASE, 'Erase', function() {
			sketcher.stateManager.setState(sketcher.stateManager.STATE_ERASE);
		});
		this.buttonErase.toggle = true;
		// center
		this.buttonCenter = new desktop.Button(sketcher.id + '_button_center', imageDepot.CENTER, 'Center', function() {
			let dif = new structures.Point(sketcher.width / 2, sketcher.height / 2);
			let bounds = sketcher.getContentBounds();
			dif.x -= (bounds.maxX + bounds.minX) / 2;
			dif.y -= (bounds.maxY + bounds.minY) / 2;
			sketcher.historyManager.pushUndo(new actions.MoveAction(sketcher.getAllPoints(), dif));
		});

		// clear
		this.buttonClear = new desktop.Button(sketcher.id + '_button_clear', imageDepot.CLEAR, 'Clear', function() {
			let clear = true;
			if (sketcher.oneMolecule) {
				if (sketcher.molecules[0].atoms.length === 1) {
					let a = sketcher.molecules[0].atoms[0];
					if (a.label === 'C' && a.charge === 0 && a.mass === -1) {
						clear = false;
					}
				}
			} else {
				if (sketcher.molecules.length === 0 && sketcher.shapes.length === 0) {
					clear = false;
				}
			}
			if (clear) {
				sketcher.stateManager.getCurrentState().clearHover();
				if (sketcher.lasso && sketcher.lasso.isActive()) {
					sketcher.lasso.empty();
				}
				sketcher.historyManager.pushUndo(new actions.ClearAction(sketcher));
			}
		});
		// clean
		this.buttonClean = new desktop.Button(sketcher.id + '_button_clean', imageDepot.OPTIMIZE, 'Clean', function() {
			let mol = sketcher.oneMolecule ? sketcher.molecules[0] : sketcher.lasso.getFirstMolecule();
			if (mol) {
				let json = new io.JSONInterpreter();
				iChemLabs._contactServer('optimize', {
					'mol' : json.molTo(mol)
				}, {
					dimension : 2
				}, function(content) {
					let optimized = json.molFrom(content.mol);
					let optCenter = optimized.getCenter();
					let dif = sketcher.oneMolecule ? new structures.Point(sketcher.width / 2, sketcher.height / 2) : mol.getCenter();
					dif.sub(optCenter);
					for ( let i = 0, ii = optimized.atoms.length; i < ii; i++) {
						optimized.atoms[i].add(dif);
					}
					sketcher.historyManager.pushUndo(new actions.ChangeCoordinatesAction(mol.atoms, optimized.atoms));
				});
			}
		});

		// lasso set
		this.makeLassoSet(this);

		// cut/copy/paste set
		this.makeCopySet(this);

		// scale set
		this.makeScaleSet(this);

		// flip set
		this.makeFlipSet(this);

		// history set
		this.makeHistorySet(this);

		// label set
		this.makeLabelSet(this);
		
		// query
		this.buttonTextInput = new desktop.Button(sketcher.id + '_button_text_input', imageDepot.TEXT, 'Set Atom Label', function() {
			sketcher.stateManager.setState(sketcher.stateManager.STATE_TEXT_INPUT);
		});
		this.buttonTextInput.toggle = true;
		this.buttonQuery = new desktop.Button(sketcher.id + '_button_query', imageDepot.QUERY, 'Set Query to Atom or Bond', function() {
			sketcher.stateManager.setState(sketcher.stateManager.STATE_QUERY);
		});
		this.buttonQuery.toggle = true;

		// bond set
		this.makeBondSet(this);

		// ring set
		this.makeRingSet(this);
		
		// chain
		this.buttonChain = new desktop.Button(sketcher.id + '_button_chain', imageDepot.CHAIN_CARBON, 'Add Carbon Chain', function() {
			sketcher.stateManager.setState(sketcher.stateManager.STATE_NEW_CHAIN);
		});
		this.buttonChain.toggle = true;

		// attribute set
		this.makeAttributeSet(this);

		// shape set
		this.makeShapeSet(this);
		
		if(this.makeOtherButtons){
			this.makeOtherButtons(this);
		}
	};
	let _ = gui.ToolbarManager.prototype;
	_.write = function() {
		let sb = ['<div style="font-size:10px;">'];
		let bg = this.sketcher.id + '_main_group';
		if (this.sketcher.oneMolecule) {
			sb.push(this.buttonMove.getSource(bg));
		} else {
			sb.push(this.lassoSet.getSource(bg));
		}
		sb.push(this.buttonClear.getSource());
		sb.push(this.buttonErase.getSource(bg));
		//sb.push(this.buttonCenter.getSource());
		if (this.sketcher.useServices) {
			sb.push(this.buttonClean.getSource());
		}
		//sb.push(this.flipSet.getSource());
		sb.push(this.historySet.getSource());
		//sb.push(this.buttonCalculate.getSource());
		if (!this.sketcher.oneMolecule) {
			sb.push(this.copySet.getSource());
		}
		sb.push(this.scaleSet.getSource());
		sb.push(this.buttonOpen.getSource());
		//sb.push(this.buttonSave.getSource());
		sb.push(this.buttonTemplate.getSource(bg));
		if (this.sketcher.useServices) {
			sb.push(this.buttonSearch.getSource());
			sb.push(this.buttonCalculate.getSource());
		}
		if(!this.sketcher.floatDrawTools){
			//sb.push('<br>');
			if(desktop.TextInput){
				sb.push(this.buttonTextInput.getSource(bg));
			}
			sb.push(this.labelSet.getSource(bg));
			if (this.sketcher.includeQuery) {
				sb.push(this.buttonQuery.getSource(bg));
			}
			sb.push(this.attributeSet.getSource(bg));
			sb.push(this.bondSet.getSource(bg));
			sb.push(this.ringSet.getSource(bg));
			sb.push(this.buttonChain.getSource(bg));
			if (!this.sketcher.oneMolecule) {
				sb.push(this.shapeSet.getSource(bg));
			}
		}
		sb.push('</div>');
		if(this.sketcher.floatDrawTools){
			if(desktop.TextInput){
				this.drawTools.components.splice(0, 0, this.buttonTextInput);
			}
			if (this.sketcher.includeQuery) {
				this.drawTools.components.splice((desktop.TextInput?1:0), 0, this.buttonQuery);
			}
			this.drawTools.components.splice(this.drawTools.components.length-(this.sketcher.oneMolecule?1:3), 0, this.buttonChain);
			if (!this.sketcher.oneMolecule) {
				this.drawTools.components.push(this.buttonVAP);
			}
			sb.push(this.drawTools.getSource(bg));
		}

		if (document.getElementById(this.sketcher.id)) {
			let canvas = q('#' + this.sketcher.id);
			canvas.before(sb.join(''));
		} else {
			document.write(sb.join(''));
		}
	};
	_.setup = function() {
		if (this.sketcher.oneMolecule) {
			this.buttonMove.setup(true);
		} else {
			this.lassoSet.setup();
		}
		this.buttonClear.setup();
		this.buttonErase.setup(true);
		this.buttonCenter.setup();
		if (this.sketcher.useServices) {
			this.buttonClean.setup();
		}
		this.flipSet.setup();
		this.historySet.setup();
		if (!this.sketcher.oneMolecule) {
			this.copySet.setup();
		}
		this.scaleSet.setup();
		this.buttonOpen.setup();
		this.buttonSave.setup();
		this.buttonTemplate.setup(true);
		if (this.sketcher.useServices) {
			this.buttonSearch.setup();
			this.buttonCalculate.setup();
		}
		if(this.sketcher.floatDrawTools){
			this.drawTools.setup();
			this.buttonBond.getElement().click();
		}else{
			if(desktop.TextInput){
				this.buttonTextInput.setup(true);
			}
			this.labelSet.setup();
			if (this.sketcher.includeQuery) {
				this.buttonQuery.setup(true);
			}
			this.attributeSet.setup();
			this.bondSet.setup();
			this.ringSet.setup();
			this.buttonChain.setup(true);
			if (!this.sketcher.oneMolecule) {
				this.shapeSet.setup();
			}
			this.buttonSingle.getElement().click();
		}

		this.buttonUndo.disable();
		this.buttonRedo.disable();
		if (!this.sketcher.oneMolecule) {
			this.buttonCut.disable();
			this.buttonCopy.disable();
			this.buttonPaste.disable();
			this.buttonFlipVert.disable();
			this.buttonFlipHor.disable();
			if (this.sketcher.useServices) {
				this.buttonClean.disable();
				this.buttonCalculate.disable();
				this.buttonSave.disable();
			}
		}
	};

	_.makeCopySet = function(self) {
		this.buttonCut = new desktop.Button(self.sketcher.id + '_button_cut', imageDepot.CUT, 'Cut', function() {
			self.sketcher.copyPasteManager.copy(true);
		});
		this.buttonCopy = new desktop.Button(self.sketcher.id + '_button_copy', imageDepot.COPY, 'Copy', function() {
			self.sketcher.copyPasteManager.copy(false);
		});
		this.buttonPaste = new desktop.Button(self.sketcher.id + '_button_paste', imageDepot.PASTE, 'Paste', function() {
			self.sketcher.copyPasteManager.paste();
		});
		
		this.copySet = new desktop.ButtonSet(self.sketcher.id + '_buttons_copy');
		this.copySet.toggle = false;
		this.copySet.buttons.push(this.buttonCut);
		this.copySet.buttons.push(this.buttonCopy);
		this.copySet.buttons.push(this.buttonPaste);
	};
	_.makeScaleSet = function(self) {
		this.buttonScalePlus = new desktop.Button(self.sketcher.id + '_button_scale_plus', imageDepot.ZOOM_IN, 'Increase Scale', function() {
			self.sketcher.styles.scale *= 1.5;
			self.sketcher.checkScale();
			self.sketcher.repaint();
		});
		this.buttonScaleMinus = new desktop.Button(self.sketcher.id + '_button_scale_minus', imageDepot.ZOOM_OUT, 'Decrease Scale', function() {
			self.sketcher.styles.scale /= 1.5;
			self.sketcher.checkScale();
			self.sketcher.repaint();
		});
		
		this.scaleSet = new desktop.ButtonSet(self.sketcher.id + '_buttons_scale');
		this.scaleSet.toggle = false;
		this.scaleSet.buttons.push(this.buttonScalePlus);
		this.scaleSet.buttons.push(this.buttonScaleMinus);
	};
	_.makeLassoSet = function(self) {
		this.buttonLassoAll = new desktop.Button(self.sketcher.id + '_button_lasso_lasso', imageDepot.LASSO, 'Lasso Tool', function() {
			self.sketcher.stateManager.setState(self.sketcher.stateManager.STATE_LASSO);
			self.sketcher.lasso.mode = tools.Lasso.MODE_LASSO;
			if (!self.sketcher.lasso.isActive()) {
				self.sketcher.lasso.selectNextMolecule();
			}
		});
		this.buttonLassoShapes = new desktop.Button(self.sketcher.id + '_button_lasso_shapes', imageDepot.LASSO_SHAPES, 'Lasso Tool (shapes only)', function() {
			self.sketcher.stateManager.setState(self.sketcher.stateManager.STATE_LASSO);
			self.sketcher.lasso.mode = tools.Lasso.MODE_LASSO_SHAPES;
			if (!self.sketcher.lasso.isActive()) {
				self.sketcher.lasso.selectNextShape();
			}
		});
		this.buttonRectMarq = new desktop.Button(self.sketcher.id + '_button_lasso_marquee', imageDepot.MARQUEE, 'Marquee Tool', function() {
			self.sketcher.stateManager.setState(self.sketcher.stateManager.STATE_LASSO);
			self.sketcher.lasso.mode = tools.Lasso.MODE_RECTANGLE_MARQUEE;
			if (!self.sketcher.lasso.isActive()) {
				self.sketcher.lasso.selectNextMolecule();
			}
		});
		
		this.lassoSet = new desktop.ButtonSet(self.sketcher.id + '_buttons_lasso');
		this.buttonLasso = new desktop.DummyButton(self.sketcher.id + '_button_lasso', 'Selection Tool');
		this.lassoSet.buttons.push(this.buttonLasso);
		this.lassoSet.addDropDown('More Selection Tools');
		this.lassoSet.dropDown.buttonSet.buttons.push(this.buttonLassoAll);
		this.lassoSet.dropDown.buttonSet.buttons.push(this.buttonLassoShapes);
		this.lassoSet.dropDown.buttonSet.buttons.push(this.buttonRectMarq);
	};
	_.makeFlipSet = function(self) {
		let action = function(horizontal){
			let ps = self.sketcher.oneMolecule?self.sketcher.getAllPoints():self.sketcher.lasso.getAllPoints();
			let bs = [];
			let lbs = self.sketcher.oneMolecule?self.sketcher.getAllBonds():self.sketcher.lasso.getBonds();
			for(let i = 0, ii = lbs.length; i<ii; i++){
				let b = lbs[i];
				if(b.bondOrder===1 && (b.stereo===structures.Bond.STEREO_PROTRUDING || b.stereo===structures.Bond.STEREO_RECESSED)){
					bs.push(b);
				}
			}
			self.sketcher.historyManager.pushUndo(new actions.FlipAction(ps, bs, horizontal));
		}
		this.buttonFlipVert = new desktop.Button(self.sketcher.id + '_button_flip_hor', imageDepot.FLIP_HOR, 'Flip Horizontally', function() {
			action(true);
		});
		this.buttonFlipHor = new desktop.Button(self.sketcher.id + '_button_flip_ver', imageDepot.FLIP_VER, 'Flip Vertically', function() {
			action(false);
		});
		
		this.flipSet = new desktop.ButtonSet(self.sketcher.id + '_buttons_flip');
		this.flipSet.toggle = false;
		this.flipSet.buttons.push(this.buttonFlipVert);
		this.flipSet.buttons.push(this.buttonFlipHor);
	};
	_.makeHistorySet = function(self) {
		this.buttonUndo = new desktop.Button(self.sketcher.id + '_button_undo', imageDepot.UNDO, 'Undo', function() {
			self.sketcher.historyManager.undo();
		});
		this.buttonRedo = new desktop.Button(self.sketcher.id + '_button_redo', imageDepot.REDO, 'Redo', function() {
			self.sketcher.historyManager.redo();
		});
		
		this.historySet = new desktop.ButtonSet(self.sketcher.id + '_buttons_history');
		this.historySet.toggle = false;
		this.historySet.buttons.push(this.buttonUndo);
		this.historySet.buttons.push(this.buttonRedo);
	};
	_.makeLabelSet = function(self) {
		this.buttonLabelH = new desktop.Button(self.sketcher.id + '_button_label_h', imageDepot.HYDROGEN, 'Hydrogen', function() {
			self.sketcher.stateManager.setState(self.sketcher.stateManager.STATE_LABEL);
			self.sketcher.stateManager.STATE_LABEL.label = 'H';
		});
		this.buttonLabelC = new desktop.Button(self.sketcher.id + '_button_label_c', imageDepot.CARBON, 'Carbon', function() {
			self.sketcher.stateManager.setState(self.sketcher.stateManager.STATE_LABEL);
			self.sketcher.stateManager.STATE_LABEL.label = 'C';
		});
		this.buttonLabelN = new desktop.Button(self.sketcher.id + '_button_label_n', imageDepot.NITROGEN, 'Nitrogen', function() {
			self.sketcher.stateManager.setState(self.sketcher.stateManager.STATE_LABEL);
			self.sketcher.stateManager.STATE_LABEL.label = 'N';
		});
		this.buttonLabelO = new desktop.Button(self.sketcher.id + '_button_label_o', imageDepot.OXYGEN, 'Oxygen', function() {
			self.sketcher.stateManager.setState(self.sketcher.stateManager.STATE_LABEL);
			self.sketcher.stateManager.STATE_LABEL.label = 'O';
		});
		this.buttonLabelF = new desktop.Button(self.sketcher.id + '_button_label_f', imageDepot.FLUORINE, 'Fluorine', function() {
			self.sketcher.stateManager.setState(self.sketcher.stateManager.STATE_LABEL);
			self.sketcher.stateManager.STATE_LABEL.label = 'F';
		});
		this.buttonLabelCl = new desktop.Button(self.sketcher.id + '_button_label_cl', imageDepot.CHLORINE, 'Chlorine', function() {
			self.sketcher.stateManager.setState(self.sketcher.stateManager.STATE_LABEL);
			self.sketcher.stateManager.STATE_LABEL.label = 'Cl';
		});
		this.buttonLabelBr = new desktop.Button(self.sketcher.id + '_button_label_br', imageDepot.BROMINE, 'Bromine', function() {
			self.sketcher.stateManager.setState(self.sketcher.stateManager.STATE_LABEL);
			self.sketcher.stateManager.STATE_LABEL.label = 'Br';
		});
		this.buttonLabelI = new desktop.Button(self.sketcher.id + '_button_label_i', imageDepot.IODINE, 'Iodine', function() {
			self.sketcher.stateManager.setState(self.sketcher.stateManager.STATE_LABEL);
			self.sketcher.stateManager.STATE_LABEL.label = 'I';
		});
		this.buttonLabelP = new desktop.Button(self.sketcher.id + '_button_label_p', imageDepot.PHOSPHORUS, 'Phosphorus', function() {
			self.sketcher.stateManager.setState(self.sketcher.stateManager.STATE_LABEL);
			self.sketcher.stateManager.STATE_LABEL.label = 'P';
		});
		this.buttonLabelS = new desktop.Button(self.sketcher.id + '_button_label_s', imageDepot.SULFUR, 'Sulfur', function() {
			self.sketcher.stateManager.setState(self.sketcher.stateManager.STATE_LABEL);
			self.sketcher.stateManager.STATE_LABEL.label = 'S';
		});
		this.buttonLabelSi = new desktop.Button(self.sketcher.id + '_button_label_si', imageDepot.SILICON, 'Silicon', function() {
			self.sketcher.stateManager.setState(self.sketcher.stateManager.STATE_LABEL);
			self.sketcher.stateManager.STATE_LABEL.label = 'Si';
		});
		this.buttonLabelPT = new desktop.Button(self.sketcher.id + '_button_label_pt', imageDepot.PERIODIC_TABLE, 'Choose Symbol', function() {
			if(self.sketcher.dialogManager.periodicTableDialog.canvas.selected){
				self.sketcher.stateManager.setState(self.sketcher.stateManager.STATE_LABEL);
				self.sketcher.stateManager.STATE_LABEL.label = self.sketcher.dialogManager.periodicTableDialog.canvas.selected.element.symbol;
			}
			self.sketcher.dialogManager.periodicTableDialog.open();
		});
		
		this.buttonLabel = new desktop.DummyButton(self.sketcher.id + '_button_label', 'Set Label');
		if(self.sketcher.floatDrawTools){
			this.labelTray = new desktop.Tray(self.sketcher, self.sketcher.id + '_buttons_label', this.buttonLabel, 3);
			this.labelTray.defaultButton = this.buttonLabelO;
			this.labelTray.buttonSet.buttons.push(this.buttonLabelH);
			this.labelTray.buttonSet.buttons.push(this.buttonLabelC);
			this.labelTray.buttonSet.buttons.push(this.buttonLabelN);
			this.labelTray.buttonSet.buttons.push(this.buttonLabelO);
			this.labelTray.buttonSet.buttons.push(this.buttonLabelF);
			this.labelTray.buttonSet.buttons.push(this.buttonLabelCl);
			this.labelTray.buttonSet.buttons.push(this.buttonLabelBr);
			this.labelTray.buttonSet.buttons.push(this.buttonLabelI);
			this.labelTray.buttonSet.buttons.push(this.buttonLabelP);
			this.labelTray.buttonSet.buttons.push(this.buttonLabelS);
			this.labelTray.buttonSet.buttons.push(this.buttonLabelSi);
			this.labelTray.buttonSet.buttons.push(this.buttonLabelPT);
			this.drawTools.components.push(this.labelTray);
		}else{
			this.labelSet = new desktop.ButtonSet(self.sketcher.id + '_buttons_label');
			this.labelSet.buttons.push(this.buttonLabel);
			this.labelSet.addDropDown('More Labels');
			this.labelSet.dropDown.defaultButton = this.buttonLabelO;
			this.labelSet.dropDown.buttonSet.buttons.push(this.buttonLabelH);
			this.labelSet.dropDown.buttonSet.buttons.push(this.buttonLabelC);
			this.labelSet.dropDown.buttonSet.buttons.push(this.buttonLabelN);
			this.labelSet.dropDown.buttonSet.buttons.push(this.buttonLabelO);
			this.labelSet.dropDown.buttonSet.buttons.push(this.buttonLabelF);
			this.labelSet.dropDown.buttonSet.buttons.push(this.buttonLabelCl);
			this.labelSet.dropDown.buttonSet.buttons.push(this.buttonLabelBr);
			this.labelSet.dropDown.buttonSet.buttons.push(this.buttonLabelI);
			this.labelSet.dropDown.buttonSet.buttons.push(this.buttonLabelP);
			this.labelSet.dropDown.buttonSet.buttons.push(this.buttonLabelS);
			this.labelSet.dropDown.buttonSet.buttons.push(this.buttonLabelSi);
			this.labelSet.dropDown.buttonSet.buttons.push(this.buttonLabelPT);
		}
	};
	_.makeBondSet = function(self) {
		this.buttonSingle = new desktop.Button(self.sketcher.id + '_button_bond_single', imageDepot.BOND_SINGLE, 'Single Bond', function() {
			self.sketcher.stateManager.setState(self.sketcher.stateManager.STATE_NEW_BOND);
			self.sketcher.stateManager.STATE_NEW_BOND.bondOrder = 1;
			self.sketcher.stateManager.STATE_NEW_BOND.stereo = structures.Bond.STEREO_NONE;
		});
		this.buttonRecessed = new desktop.Button(self.sketcher.id + '_button_bond_recessed', imageDepot.BOND_RECESSED, 'Recessed Bond', function() {
			self.sketcher.stateManager.setState(self.sketcher.stateManager.STATE_NEW_BOND);
			self.sketcher.stateManager.STATE_NEW_BOND.bondOrder = 1;
			self.sketcher.stateManager.STATE_NEW_BOND.stereo = structures.Bond.STEREO_RECESSED;
		});
		this.buttonProtruding = new desktop.Button(self.sketcher.id + '_button_bond_protruding', imageDepot.BOND_PROTRUDING, 'Protruding Bond', function() {
			self.sketcher.stateManager.setState(self.sketcher.stateManager.STATE_NEW_BOND);
			self.sketcher.stateManager.STATE_NEW_BOND.bondOrder = 1;
			self.sketcher.stateManager.STATE_NEW_BOND.stereo = structures.Bond.STEREO_PROTRUDING;
		});
		this.buttonDouble = new desktop.Button(self.sketcher.id + '_button_bond_double', imageDepot.BOND_DOUBLE, 'Double Bond', function() {
			self.sketcher.stateManager.setState(self.sketcher.stateManager.STATE_NEW_BOND);
			self.sketcher.stateManager.STATE_NEW_BOND.bondOrder = 2;
			self.sketcher.stateManager.STATE_NEW_BOND.stereo = structures.Bond.STEREO_NONE;
		});
		this.buttonZero = new desktop.Button(self.sketcher.id + '_button_bond_zero', imageDepot.BOND_ZERO, 'Zero Bond (Ionic/Hydrogen)', function() {
			self.sketcher.stateManager.setState(self.sketcher.stateManager.STATE_NEW_BOND);
			self.sketcher.stateManager.STATE_NEW_BOND.bondOrder = 0;
			self.sketcher.stateManager.STATE_NEW_BOND.stereo = structures.Bond.STEREO_NONE;
		});
		this.buttonHalf = new desktop.Button(self.sketcher.id + '_button_bond_half', imageDepot.BOND_HALF, 'Half Bond', function() {
			self.sketcher.stateManager.setState(self.sketcher.stateManager.STATE_NEW_BOND);
			self.sketcher.stateManager.STATE_NEW_BOND.bondOrder = 0.5;
			self.sketcher.stateManager.STATE_NEW_BOND.stereo = structures.Bond.STEREO_NONE;
		});
		this.buttonWavy = new desktop.Button(self.sketcher.id + '_button_bond_wavy', imageDepot.BOND_WAVY, 'Wavy Bond', function() {
			self.sketcher.stateManager.setState(self.sketcher.stateManager.STATE_NEW_BOND);
			self.sketcher.stateManager.STATE_NEW_BOND.bondOrder = 1;
			self.sketcher.stateManager.STATE_NEW_BOND.stereo = structures.Bond.STEREO_AMBIGUOUS;
		});
		this.buttonResonance = new desktop.Button(self.sketcher.id + '_button_bond_resonance', imageDepot.BOND_RESONANCE, 'Resonance Bond', function() {
			self.sketcher.stateManager.setState(self.sketcher.stateManager.STATE_NEW_BOND);
			self.sketcher.stateManager.STATE_NEW_BOND.bondOrder = 1.5;
			self.sketcher.stateManager.STATE_NEW_BOND.stereo = structures.Bond.STEREO_NONE;
		});
		this.buttonDoubleAmbiguous = new desktop.Button(self.sketcher.id + '_button_bond_ambiguous_double', imageDepot.BOND_DOUBLE_AMBIGUOUS, 'Ambiguous Double Bond', function() {
			self.sketcher.stateManager.setState(self.sketcher.stateManager.STATE_NEW_BOND);
			self.sketcher.stateManager.STATE_NEW_BOND.bondOrder = 2;
			self.sketcher.stateManager.STATE_NEW_BOND.stereo = structures.Bond.STEREO_AMBIGUOUS;
		});
		this.buttonTriple = new desktop.Button(self.sketcher.id + '_button_bond_triple', imageDepot.BOND_TRIPLE, 'Triple Bond', function() {
			self.sketcher.stateManager.setState(self.sketcher.stateManager.STATE_NEW_BOND);
			self.sketcher.stateManager.STATE_NEW_BOND.bondOrder = 3;
			self.sketcher.stateManager.STATE_NEW_BOND.stereo = structures.Bond.STEREO_NONE;
		});
		
		this.buttonBond = new desktop.DummyButton(self.sketcher.id + '_button_bond', self.sketcher.floatDrawTools?'Draw Bond':'Other Bond');
		if(self.sketcher.floatDrawTools){
			this.bondTray = new desktop.Tray(self.sketcher, self.sketcher.id + '_buttons_bond', this.buttonBond, 2);
			this.bondTray.defaultButton = this.buttonSingle;
			//this.bondTray.buttonSet.buttons.push(this.buttonZero);
			this.bondTray.buttonSet.buttons.push(this.buttonHalf);
			//this.bondTray.buttonSet.buttons.push(this.buttonWavy);
			this.bondTray.buttonSet.buttons.push(this.buttonSingle);
			this.bondTray.buttonSet.buttons.push(this.buttonRecessed);
			this.bondTray.buttonSet.buttons.push(this.buttonProtruding);
			//this.bondTray.buttonSet.buttons.push(this.buttonDoubleAmbiguous);
			this.bondTray.buttonSet.buttons.push(this.buttonDouble);
			this.bondTray.buttonSet.buttons.push(this.buttonResonance);
			this.bondTray.buttonSet.buttons.push(this.buttonTriple);
			this.drawTools.components.push(this.bondTray);
		}else{
			this.bondSet = new desktop.ButtonSet(self.sketcher.id + '_buttons_bond');
			this.bondSet.buttons.push(this.buttonSingle);
			//this.bondSet.buttons.push(this.buttonRecessed);
			//this.bondSet.buttons.push(this.buttonProtruding);
			this.bondSet.buttons.push(this.buttonDouble);
			this.bondSet.buttons.push(this.buttonBond);
			this.bondSet.addDropDown('More Bonds');
			this.bondSet.dropDown.buttonSet.buttons.push(this.buttonRecessed);
			this.bondSet.dropDown.buttonSet.buttons.push(this.buttonProtruding);
			//this.bondSet.dropDown.buttonSet.buttons.push(this.buttonZero);
			this.bondSet.dropDown.buttonSet.buttons.push(this.buttonHalf);
			//this.bondSet.dropDown.buttonSet.buttons.push(this.buttonWavy);
			this.bondSet.dropDown.buttonSet.buttons.push(this.buttonResonance);
			//this.bondSet.dropDown.buttonSet.buttons.push(this.buttonDoubleAmbiguous);
			this.bondSet.dropDown.buttonSet.buttons.push(this.buttonTriple);
			this.bondSet.dropDown.defaultButton = this.buttonTriple;
		}
	};
	_.makeRingSet = function(self) {
		this.buttonCyclohexane = new desktop.Button(self.sketcher.id + '_button_ring_cyclohexane', imageDepot.CYCLOHEXANE, 'Cyclohexane Ring', function() {
			self.sketcher.stateManager.setState(self.sketcher.stateManager.STATE_NEW_RING);
			self.sketcher.stateManager.STATE_NEW_RING.numSides = 6;
			self.sketcher.stateManager.STATE_NEW_RING.unsaturated = false;
		});
		this.buttonBenzene = new desktop.Button(self.sketcher.id + '_button_ring_benzene', imageDepot.BENZENE, 'Benzene Ring', function() {
			self.sketcher.stateManager.setState(self.sketcher.stateManager.STATE_NEW_RING);
			self.sketcher.stateManager.STATE_NEW_RING.numSides = 6;
			self.sketcher.stateManager.STATE_NEW_RING.unsaturated = true;
		});
		this.buttonCyclopropane = new desktop.Button(self.sketcher.id + '_button_ring_cyclopropane', imageDepot.CYCLOPROPANE, 'Cyclopropane Ring', function() {
			self.sketcher.stateManager.setState(self.sketcher.stateManager.STATE_NEW_RING);
			self.sketcher.stateManager.STATE_NEW_RING.numSides = 3;
			self.sketcher.stateManager.STATE_NEW_RING.unsaturated = false;
		});
		this.buttonCyclobutane = new desktop.Button(self.sketcher.id + '_button_ring_cyclobutane', imageDepot.CYCLOBUTANE, 'Cyclobutane Ring', function() {
			self.sketcher.stateManager.setState(self.sketcher.stateManager.STATE_NEW_RING);
			self.sketcher.stateManager.STATE_NEW_RING.numSides = 4;
			self.sketcher.stateManager.STATE_NEW_RING.unsaturated = false;
		});
		this.buttonCyclopentane = new desktop.Button(self.sketcher.id + '_button_ring_cyclopentane', imageDepot.CYCLOPENTANE, 'Cyclopentane Ring', function() {
			self.sketcher.stateManager.setState(self.sketcher.stateManager.STATE_NEW_RING);
			self.sketcher.stateManager.STATE_NEW_RING.numSides = 5;
			self.sketcher.stateManager.STATE_NEW_RING.unsaturated = false;
		});
		this.buttonCycloheptane = new desktop.Button(self.sketcher.id + '_button_ring_cycloheptane', imageDepot.CYCLOHEPTANE, 'Cycloheptane Ring', function() {
			self.sketcher.stateManager.setState(self.sketcher.stateManager.STATE_NEW_RING);
			self.sketcher.stateManager.STATE_NEW_RING.numSides = 7;
			self.sketcher.stateManager.STATE_NEW_RING.unsaturated = false;
		});
		this.buttonCyclooctane = new desktop.Button(self.sketcher.id + '_button_ring_cyclooctane', imageDepot.CYCLOOCTANE, 'Cyclooctane Ring', function() {
			self.sketcher.stateManager.setState(self.sketcher.stateManager.STATE_NEW_RING);
			self.sketcher.stateManager.STATE_NEW_RING.numSides = 8;
			self.sketcher.stateManager.STATE_NEW_RING.unsaturated = false;
		});
		this.buttonRingArbitrary = new desktop.Button(self.sketcher.id + '_button_ring_arbitrary', imageDepot.RING_ARBITRARY, 'Arbitrary Ring Size Tool', function() {
			self.sketcher.stateManager.setState(self.sketcher.stateManager.STATE_NEW_RING);
			self.sketcher.stateManager.STATE_NEW_RING.numSides = -1;
			self.sketcher.stateManager.STATE_NEW_RING.unsaturated = false;
		});
		
		this.buttonRing = new desktop.DummyButton(self.sketcher.id + '_button_ring', self.sketcher.floatDrawTools?'Draw Ring':'Other Ring');
		if(self.sketcher.floatDrawTools){
			this.ringTray = new desktop.Tray(self.sketcher, self.sketcher.id + '_buttons_ring', this.buttonRing, 2);
			this.ringTray.defaultButton = this.buttonCyclohexane;
			this.ringTray.buttonSet.buttons.push(this.buttonCyclopropane);
			this.ringTray.buttonSet.buttons.push(this.buttonCyclobutane);
			this.ringTray.buttonSet.buttons.push(this.buttonCyclopentane);
			this.ringTray.buttonSet.buttons.push(this.buttonCyclohexane);
			this.ringTray.buttonSet.buttons.push(this.buttonCycloheptane);
			this.ringTray.buttonSet.buttons.push(this.buttonCyclooctane);
			this.ringTray.buttonSet.buttons.push(this.buttonBenzene);
			this.ringTray.buttonSet.buttons.push(this.buttonRingArbitrary);
			this.drawTools.components.push(this.ringTray);
		}else{
			this.ringSet = new desktop.ButtonSet(self.sketcher.id + '_buttons_ring');
			//this.ringSet.buttons.push(this.buttonCyclohexane);
			this.ringSet.buttons.push(this.buttonBenzene);
			this.ringSet.buttons.push(this.buttonRing);
			this.ringSet.addDropDown('More Rings');
			this.ringSet.dropDown.buttonSet.buttons.push(this.buttonCyclopropane);
			this.ringSet.dropDown.buttonSet.buttons.push(this.buttonCyclobutane);
			this.ringSet.dropDown.buttonSet.buttons.push(this.buttonCyclopentane);
			this.ringSet.dropDown.buttonSet.buttons.push(this.buttonCyclohexane);
			this.ringSet.dropDown.defaultButton = this.buttonCyclohexane;
			this.ringSet.dropDown.buttonSet.buttons.push(this.buttonCycloheptane);
			this.ringSet.dropDown.buttonSet.buttons.push(this.buttonCyclooctane);
			this.ringSet.dropDown.buttonSet.buttons.push(this.buttonRingArbitrary);
		}
	};
	_.makeAttributeSet = function(self) {
		this.buttonChargePlus = new desktop.Button(self.sketcher.id + '_button_attribute_charge_increment', imageDepot.INCREASE_CHARGE, 'Increase Charge', function() {
			self.sketcher.stateManager.setState(self.sketcher.stateManager.STATE_CHARGE);
			self.sketcher.stateManager.STATE_CHARGE.delta = 1;
		});
		this.buttonChargeMinus = new desktop.Button(self.sketcher.id + '_button_attribute_charge_decrement', imageDepot.DECREASE_CHARGE, 'Decrease Charge', function() {
			self.sketcher.stateManager.setState(self.sketcher.stateManager.STATE_CHARGE);
			self.sketcher.stateManager.STATE_CHARGE.delta = -1;
		});
		this.buttonPairPlus = new desktop.Button(self.sketcher.id + '_button_attribute_lonePair_increment', imageDepot.ADD_LONE_PAIR, 'Add Lone Pair', function() {
			self.sketcher.stateManager.setState(self.sketcher.stateManager.STATE_LONE_PAIR);
			self.sketcher.stateManager.STATE_LONE_PAIR.delta = 1;
		});
		this.buttonPairMinus = new desktop.Button(self.sketcher.id + '_button_attribute_lonePair_decrement', imageDepot.REMOVE_LONE_PAIR, 'Remove Lone Pair', function() {
			self.sketcher.stateManager.setState(self.sketcher.stateManager.STATE_LONE_PAIR);
			self.sketcher.stateManager.STATE_LONE_PAIR.delta = -1;
		});
		this.buttonRadicalPlus = new desktop.Button(self.sketcher.id + '_button_attribute_radical_increment', imageDepot.ADD_RADICAL, 'Add Radical', function() {
			self.sketcher.stateManager.setState(self.sketcher.stateManager.STATE_RADICAL);
			self.sketcher.stateManager.STATE_RADICAL.delta = 1;
		});
		this.buttonRadicalMinus = new desktop.Button(self.sketcher.id + '_button_attribute_radical_decrement', imageDepot.REMOVE_RADICAL, 'Remove Radical', function() {
			self.sketcher.stateManager.setState(self.sketcher.stateManager.STATE_RADICAL);
			self.sketcher.stateManager.STATE_RADICAL.delta = -1;
		});
	
		this.buttonAttribute = new desktop.DummyButton(self.sketcher.id + '_button_attribute', 'Attributes');
		if(self.sketcher.floatDrawTools){
			this.attributeTray = new desktop.Tray(self.sketcher, self.sketcher.id + '_buttons_attribute', this.buttonAttribute, 2);
			this.attributeTray.defaultButton = this.buttonChargePlus;
			this.attributeTray.buttonSet.buttons.push(this.buttonChargeMinus);
			this.attributeTray.buttonSet.buttons.push(this.buttonChargePlus);
			//this.attributeTray.buttonSet.buttons.push(this.buttonPairMinus);
			//this.attributeTray.buttonSet.buttons.push(this.buttonPairPlus);
			//this.attributeTray.buttonSet.buttons.push(this.buttonRadicalMinus);
			//this.attributeTray.buttonSet.buttons.push(this.buttonRadicalPlus);
			this.drawTools.components.push(this.attributeTray);
		}else{
			this.attributeSet = new desktop.ButtonSet(self.sketcher.id + '_buttons_attribute');
			this.attributeSet.buttons.push(this.buttonAttribute);
			this.attributeSet.addDropDown('More Attributes');
			this.attributeSet.dropDown.buttonSet.buttons.push(this.buttonChargePlus);
			this.attributeSet.dropDown.buttonSet.buttons.push(this.buttonChargeMinus);
			//this.attributeSet.dropDown.buttonSet.buttons.push(this.buttonPairPlus);
			//this.attributeSet.dropDown.buttonSet.buttons.push(this.buttonPairMinus);
			//this.attributeSet.dropDown.buttonSet.buttons.push(this.buttonRadicalPlus);
			//this.attributeSet.dropDown.buttonSet.buttons.push(this.buttonRadicalMinus);
		}
	};
	_.makeShapeSet = function(self) {
		this.buttonArrowSynthetic = new desktop.Button(self.sketcher.id + '_button_shape_arrow_synthetic', imageDepot.ARROW_SYNTHETIC, 'Synthetic Arrow', function() {
			self.sketcher.stateManager.setState(self.sketcher.stateManager.STATE_SHAPE);
			self.sketcher.stateManager.STATE_SHAPE.shapeType = states.ShapeState.ARROW_SYNTHETIC;
		});
		this.buttonArrowRetrosynthetic = new desktop.Button(self.sketcher.id + '_button_shape_arrow_retrosynthetic', imageDepot.ARROW_RETROSYNTHETIC, 'Retrosynthetic Arrow', function() {
			self.sketcher.stateManager.setState(self.sketcher.stateManager.STATE_SHAPE);
			self.sketcher.stateManager.STATE_SHAPE.shapeType = states.ShapeState.ARROW_RETROSYNTHETIC;
		});
		this.buttonArrowResonance = new desktop.Button(self.sketcher.id + '_button_shape_arrow_resonance', imageDepot.ARROW_RESONANCE, 'Resonance Arrow', function() {
			self.sketcher.stateManager.setState(self.sketcher.stateManager.STATE_SHAPE);
			self.sketcher.stateManager.STATE_SHAPE.shapeType = states.ShapeState.ARROW_RESONANCE;
		});
		this.buttonArrowEquilibrum = new desktop.Button(self.sketcher.id + '_button_shape_arrow_equilibrium', imageDepot.ARROW_EQUILIBRIUM, 'Equilibrium Arrow', function() {
			self.sketcher.stateManager.setState(self.sketcher.stateManager.STATE_SHAPE);
			self.sketcher.stateManager.STATE_SHAPE.shapeType = states.ShapeState.ARROW_EQUILIBRIUM;
		});
		this.buttonReactionMapping = new desktop.Button(self.sketcher.id + '_button_reaction_mapping', imageDepot.ATOM_REACTION_MAP, 'Reaction Mapping', function() {
			self.sketcher.stateManager.setState(self.sketcher.stateManager.STATE_PUSHER);
			self.sketcher.stateManager.STATE_PUSHER.numElectron = -10;
		});
		this.buttonPusher1 = new desktop.Button(self.sketcher.id + '_button_shape_pusher_1', imageDepot.PUSHER_SINGLE, 'Single Electron Pusher', function() {
			self.sketcher.stateManager.setState(self.sketcher.stateManager.STATE_PUSHER);
			self.sketcher.stateManager.STATE_PUSHER.numElectron = 1;
		});
		this.buttonPusher2 = new desktop.Button(self.sketcher.id + '_button_shape_pusher_2', imageDepot.PUSHER_DOUBLE, 'Electron Pair Pusher', function() {
			self.sketcher.stateManager.setState(self.sketcher.stateManager.STATE_PUSHER);
			self.sketcher.stateManager.STATE_PUSHER.numElectron = 2;
		});
		this.buttonPusherBond = new desktop.Button(self.sketcher.id + '_button_shape_pusher_bond_forming', imageDepot.PUSHER_BOND_FORMING, 'Bond Forming Pusher', function() {
			self.sketcher.stateManager.setState(self.sketcher.stateManager.STATE_PUSHER);
			self.sketcher.stateManager.STATE_PUSHER.numElectron = -1;
		});
		this.buttonReactionMapping = new desktop.Button(self.sketcher.id + '_button_reaction_mapping', imageDepot.ATOM_REACTION_MAP, 'Reaction Mapping', function() {
			self.sketcher.stateManager.setState(self.sketcher.stateManager.STATE_PUSHER);
			self.sketcher.stateManager.STATE_PUSHER.numElectron = -10;
		});
		this.buttonBracket = new desktop.Button(self.sketcher.id + '_button_shape_charge_bracket', imageDepot.BRACKET_CHARGE, 'Bracket', function() {
			self.sketcher.stateManager.setState(self.sketcher.stateManager.STATE_SHAPE);
			self.sketcher.stateManager.STATE_SHAPE.shapeType = states.ShapeState.BRACKET;
			self.sketcher.repaint();
		});
		this.buttonDynamicBracket = new desktop.Button(self.sketcher.id + '_button_bracket_dynamic', imageDepot.BRACKET_DYNAMIC, 'Repeating Group', function() {
			self.sketcher.stateManager.setState(self.sketcher.stateManager.STATE_DYNAMIC_BRACKET);
		});
		this.buttonVAP = new desktop.Button(self.sketcher.id + '_button_vap', imageDepot.VARIABLE_ATTACHMENT_POINTS, 'Variable Attachment Points', function() {
			self.sketcher.stateManager.setState(self.sketcher.stateManager.STATE_VAP);
		});
		
		if(!this.sketcher.oneMolecule){
			this.buttonShape = new desktop.DummyButton(self.sketcher.id + '_button_shape', self.sketcher.floatDrawTools?'Reactions':'Shapes');
			if(self.sketcher.floatDrawTools){
				// we have to set toggle to true for buttons we are including as parent options
				this.buttonVAP.toggle = true;
				this.shapeTray = new desktop.Tray(self.sketcher, self.sketcher.id + '_buttons_shape', this.buttonShape, 4);
				this.shapeTray.defaultButton = this.buttonArrowSynthetic;
				this.shapeTray.buttonSet.buttons.push(this.buttonArrowSynthetic);
				this.shapeTray.buttonSet.buttons.push(this.buttonArrowRetrosynthetic);
				this.shapeTray.buttonSet.buttons.push(this.buttonArrowResonance);
				this.shapeTray.buttonSet.buttons.push(this.buttonArrowEquilibrum);
				this.shapeTray.buttonSet.buttons.push(this.buttonPusher1);
				this.shapeTray.buttonSet.buttons.push(this.buttonPusher2);
				this.shapeTray.buttonSet.buttons.push(this.buttonPusherBond);
				this.shapeTray.buttonSet.buttons.push(this.buttonReactionMapping);
				this.drawTools.components.push(this.shapeTray);
				this.buttonBrackets = new desktop.DummyButton(self.sketcher.id + '_button_bracket', 'Brackets');
				this.bracketTray = new desktop.Tray(self.sketcher, self.sketcher.id + '_buttons_bracket', this.buttonBrackets, 2);
				this.bracketTray.buttonSet.buttons.push(this.buttonBracket);
				this.bracketTray.buttonSet.buttons.push(this.buttonDynamicBracket);
				this.drawTools.components.push(this.bracketTray);
			}else{
				this.shapeSet = new desktop.ButtonSet(self.sketcher.id + '_buttons_shape');
				this.shapeSet.buttons.push(this.buttonShape);
				this.shapeSet.addDropDown('More Shapes');
				this.shapeSet.dropDown.buttonSet.buttons.push(this.buttonArrowSynthetic);
				this.shapeSet.dropDown.buttonSet.buttons.push(this.buttonArrowRetrosynthetic);
				this.shapeSet.dropDown.buttonSet.buttons.push(this.buttonArrowResonance);
				this.shapeSet.dropDown.buttonSet.buttons.push(this.buttonArrowEquilibrum);
				this.shapeSet.dropDown.buttonSet.buttons.push(this.buttonPusher1);
				this.shapeSet.dropDown.buttonSet.buttons.push(this.buttonPusher2);
				this.shapeSet.dropDown.buttonSet.buttons.push(this.buttonPusherBond);
				this.shapeSet.dropDown.buttonSet.buttons.push(this.buttonReactionMapping);
				this.shapeSet.dropDown.buttonSet.buttons.push(this.buttonBracket);
				this.shapeSet.dropDown.buttonSet.buttons.push(this.buttonDynamicBracket);
				this.shapeSet.dropDown.buttonSet.buttons.push(this.buttonVAP);
			}
		}
	};

})(ChemDoodle, ChemDoodle.iChemLabs, ChemDoodle.io, ChemDoodle.structures, ChemDoodle.uis.actions, ChemDoodle.uis.gui, ChemDoodle.uis.gui.imageDepot, ChemDoodle.uis.gui.desktop, ChemDoodle.uis.tools, ChemDoodle.uis.states, ChemDoodle.lib.jQuery, document);

(function(math, monitor, structures, tools, undefined) {
	'use strict';
	tools.Lasso = function(sketcher) {
		this.sketcher = sketcher;
		this.atoms = [];
		this.shapes = [];
		this.bounds = undefined;
		this.mode = tools.Lasso.MODE_LASSO;
		this.points = [];
	};
	tools.Lasso.MODE_LASSO = 'lasso';
	tools.Lasso.MODE_LASSO_SHAPES = 'shapes';
	tools.Lasso.MODE_RECTANGLE_MARQUEE = 'rectangle';
	let _ = tools.Lasso.prototype;
	_.select = function(atoms, shapes) {
		if (this.block) {
			return;
		}
		if (!monitor.SHIFT) {
			this.empty();
		}
		if (atoms) {
			this.atoms = atoms.slice(0);
			this.shapes = shapes.slice(0);
		} else {
			if (this.mode !== tools.Lasso.MODE_LASSO_SHAPES) {
				let asAdd = [];
				for ( let i = 0, ii = this.sketcher.molecules.length; i < ii; i++) {
					let mol = this.sketcher.molecules[i];
					for ( let j = 0, jj = mol.atoms.length; j < jj; j++) {
						let a = mol.atoms[j];
						if (this.mode === tools.Lasso.MODE_RECTANGLE_MARQUEE) {
							if (this.points.length === 2) {
								if (math.isBetween(a.x, this.points[0].x, this.points[1].x) && math.isBetween(a.y, this.points[0].y, this.points[1].y)) {
									asAdd.push(a);
								}
							}
						} else {
							if (this.points.length > 1) {
								if (math.isPointInPoly(this.points, a)) {
									asAdd.push(a);
								}
							}
						}
					}
				}
				if (this.atoms.length === 0) {
					this.atoms = asAdd;
				} else {
					let asFinal = [];
					for ( let i = 0, ii = this.atoms.length; i < ii; i++) {
						let a = this.atoms[i];
						if (asAdd.indexOf(a) === -1) {
							asFinal.push(a);
						} else {
							a.isLassoed = false;
						}
					}
					for ( let i = 0, ii = asAdd.length; i < ii; i++) {
						if (this.atoms.indexOf(asAdd[i]) === -1) {
							asFinal.push(asAdd[i]);
						}
					}
					this.atoms = asFinal;
				}
			}
			let ssAdd = [];
			for ( let i = 0, ii = this.sketcher.shapes.length; i < ii; i++) {
				let s = this.sketcher.shapes[i];
				let sps = s.getPoints();
				let contained = sps.length>0;
				for ( let j = 0, jj = sps.length; j < jj; j++) {
					let p = sps[j];
					if (this.mode === tools.Lasso.MODE_RECTANGLE_MARQUEE) {
						if (this.points.length === 2) {
							if (!math.isBetween(p.x, this.points[0].x, this.points[1].x) || !math.isBetween(p.y, this.points[0].y, this.points[1].y)) {
								contained = false;
								break;
							}
						} else {
							contained = false;
							break;
						}
					} else {
						if (this.points.length > 1) {
							if (!math.isPointInPoly(this.points, p)) {
								contained = false;
								break;
							}
						} else {
							contained = false;
							break;
						}
					}
				}
				if (contained) {
					ssAdd.push(s);
				}
			}
			if (this.shapes.length === 0) {
				this.shapes = ssAdd;
			} else {
				let ssFinal = [];
				for ( let i = 0, ii = this.shapes.length; i < ii; i++) {
					let s = this.shapes[i];
					if (ssAdd.indexOf(s) === -1) {
						asFinal.push(s);
					} else {
						s.isLassoed = false;
					}
				}
				for ( let i = 0, ii = ssAdd.length; i < ii; i++) {
					if (this.shapes.indexOf(ssAdd[i]) === -1) {
						ssFinal.push(ssAdd[i]);
					}
				}
				this.shapes = ssFinal;
			}
		}
		for ( let i = 0, ii = this.atoms.length; i < ii; i++) {
			this.atoms[i].isLassoed = true;
		}
		for ( let i = 0, ii = this.shapes.length; i < ii; i++) {
			this.shapes[i].isLassoed = true;
		}
		this.setBounds();
		if (this.bounds && this.bounds.minX === Infinity) {
			this.empty();
		}
		this.points = [];
		this.sketcher.stateManager.getCurrentState().clearHover();
		this.enableButtons();
		this.sketcher.repaint();
	};
	_.enableButtons = function() {
		if (this.sketcher.useServices) {
			if (this.atoms.length > 0) {
				this.sketcher.toolbarManager.buttonClean.enable();
				this.sketcher.toolbarManager.buttonCalculate.enable();
			} else {
				this.sketcher.toolbarManager.buttonClean.disable();
				this.sketcher.toolbarManager.buttonCalculate.disable();
			}
		}
		if(this.atoms.length>0 || this.shapes.length>0){
			this.sketcher.toolbarManager.buttonSave.enable();
			this.sketcher.toolbarManager.buttonCut.enable();
			this.sketcher.toolbarManager.buttonCopy.enable();
			this.sketcher.toolbarManager.buttonFlipVert.enable();
			this.sketcher.toolbarManager.buttonFlipHor.enable();
		}else{
			this.sketcher.toolbarManager.buttonSave.disable();
			this.sketcher.toolbarManager.buttonCut.disable();
			this.sketcher.toolbarManager.buttonCopy.disable();
			this.sketcher.toolbarManager.buttonFlipVert.disable();
			this.sketcher.toolbarManager.buttonFlipHor.disable();
		}
	};
	_.setBounds = function() {
		if (this.isActive()) {
			this.sketcher.repaint();
			this.bounds = new math.Bounds();
			for ( let i = 0, ii = this.atoms.length; i < ii; i++) {
				let a = this.atoms[i];
				this.bounds.expand(a.getBounds());
			}
			for ( let i = 0, ii = this.shapes.length; i < ii; i++) {
				this.bounds.expand(this.shapes[i].getBounds());
			}
			let buffer = 5;
			this.bounds.minX -= buffer;
			this.bounds.minY -= buffer;
			this.bounds.maxX += buffer;
			this.bounds.maxY += buffer;
		} else {
			this.bounds = undefined;
		}
	};
	_.empty = function() {
		for ( let i = 0, ii = this.atoms.length; i < ii; i++) {
			this.atoms[i].isLassoed = false;
		}
		for ( let i = 0, ii = this.shapes.length; i < ii; i++) {
			this.shapes[i].isLassoed = false;
		}
		this.atoms = [];
		this.shapes = [];
		this.bounds = undefined;
		this.enableButtons();
		this.sketcher.repaint();
	};
	_.draw = function(ctx, styles) {
		ctx.strokeStyle = styles.colorSelect;
		ctx.lineWidth = 0.5 / styles.scale;
		ctx.setLineDash([5]);
		if (this.points.length > 0) {
			if (this.mode === tools.Lasso.MODE_RECTANGLE_MARQUEE) {
				if (this.points.length === 2) {
					let p1 = this.points[0];
					let p2 = this.points[1];
					ctx.beginPath();
					ctx.rect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);
					ctx.stroke();
				}
			} else {
				if (this.points.length > 1) {
					ctx.beginPath();
					ctx.moveTo(this.points[0].x, this.points[0].y);
					for ( let i = 1, ii = this.points.length; i < ii; i++) {
						ctx.lineTo(this.points[i].x, this.points[i].y);
					}
					ctx.closePath();
					ctx.stroke();
				}
			}
		}
		if (this.bounds) {
			ctx.beginPath();
			ctx.rect(this.bounds.minX, this.bounds.minY, this.bounds.maxX - this.bounds.minX, this.bounds.maxY - this.bounds.minY);
			ctx.stroke();
		}
		ctx.setLineDash([]);
	};
	_.isActive = function() {
		return this.atoms.length > 0 || this.shapes.length > 0;
	};
	_.getFirstMolecule = function() {
		if (this.atoms.length > 0) {
			return this.sketcher.getMoleculeByAtom(this.atoms[0]);
		}
		return undefined;
	};
	_.getBonds = function() {
		let bonds = [];
		if (this.atoms.length > 0) {
			for ( let i = 0, ii = this.sketcher.molecules.length; i < ii; i++) {
				let m = this.sketcher.molecules[i];
				for ( let j = 0, jj = m.bonds.length; j < jj; j++) {
					let b = m.bonds[j];
					if(b.a1.isLassoed && b.a2.isLassoed){
						bonds.push(b);
					}
				}
			}
		}
		return bonds;
	};
	_.getAllPoints = function() {
		let ps = this.atoms;
		for ( let i = 0, ii = this.shapes.length; i < ii; i++) {
			ps = ps.concat(this.shapes[i].getPoints());
		}
		return ps;
	};
	_.addPoint = function(p) {
		if (this.mode === tools.Lasso.MODE_RECTANGLE_MARQUEE) {
			if (this.points.length < 2) {
				this.points.push(p);
			} else {
				let changing = this.points[1];
				changing.x = p.x;
				changing.y = p.y;
			}
		} else {
			this.points.push(p);
		}
	};
	_.selectNextMolecule = function(){
		if (this.sketcher.molecules.length > 0) {
			let nextMolIndex = this.sketcher.molecules.length - 1;
			if (this.atoms.length > 0) {
				let curMol = this.sketcher.getMoleculeByAtom(this.atoms[0]);
				nextMolIndex = this.sketcher.molecules.indexOf(curMol) + 1;
			}
			if (nextMolIndex === this.sketcher.molecules.length) {
				nextMolIndex = 0;
			}
			let mol = this.sketcher.molecules[nextMolIndex];
			let attachedShapes = [];
			// also select shape appendages, like repeating groups
			for(let i = 0, ii = this.sketcher.shapes.length; i<ii; i++){
				let s = this.sketcher.shapes[i];
				if(s instanceof structures.d2.DynamicBracket && s.contents.length!==0 && mol.atoms.indexOf(s.contents[0])!==-1){
					attachedShapes.push(s);
				}
			}
			this.select(mol.atoms, attachedShapes);
		}
	};
	_.selectNextShape = function(){
		if (this.sketcher.shapes.length > 0) {
			let nextShapeIndex = this.sketcher.shapes.length - 1;
			if (this.shapes.length > 0) {
				nextShapeIndex = this.sketcher.shapes.indexOf(this.shapes[0]) + 1;
			}
			if (nextShapeIndex === this.sketcher.shapes.length) {
				nextShapeIndex = 0;
			}
			// have to manually empty because shift modifier key
			// is down
			this.empty();
			this.select([], [ this.sketcher.shapes[nextShapeIndex] ]);
		}
	};

})(ChemDoodle.math, ChemDoodle.monitor, ChemDoodle.structures, ChemDoodle.uis.tools);

(function(informatics, io, structures, uis, actions, undefined) {
	'use strict';
	
	let SPLITTER = new informatics.Splitter();
	
	uis.CopyPasteManager = function(sketcher) {
		this.sketcher = sketcher;
		this.data = undefined;
	};
	let _ = uis.CopyPasteManager.prototype;
	_.interpreter = new io.JSONInterpreter();
	_.copy = function(remove) {
		if (this.sketcher.lasso.isActive()) {
			let mols = SPLITTER.split({atoms:this.sketcher.lasso.atoms, bonds:this.sketcher.lasso.getBonds()}); 
			let shapes = this.sketcher.lasso.shapes;
			this.data = this.interpreter.contentTo(mols, shapes);
			if(remove){
				this.sketcher.stateManager.STATE_ERASE.handleDelete();
			}
			this.sketcher.toolbarManager.buttonPaste.enable();
		}
	};
	_.paste = function() {
		if(this.data){
			let content = this.interpreter.contentFrom(this.data);
			if(content.molecules.length!==0 || content.shapes.length!==0){
				let atoms = [];
				for(let i = 0, ii = content.molecules.length; i<ii; i++){
					atoms = atoms.concat(content.molecules[i].atoms);
				}
				let c;
				if(this.sketcher.lastMousePos){
					// you need to create a copy here as c is modified below
					c = new structures.Point(this.sketcher.lastMousePos.x, this.sketcher.lastMousePos.y);
				}else if(this.sketcher.lasso.isActive()){
					this.sketcher.lasso.setBounds();
					let b = this.sketcher.lasso.bounds;
					c = new structures.Point((b.minX+b.maxX)/2+50, (b.minY+b.maxY)/2+50);
				}else{
					c = new structures.Point(this.sketcher.width / 2, this.sketcher.height / 2);
				}
				this.sketcher.historyManager.pushUndo(new actions.AddContentAction(this.sketcher, content.molecules, content.shapes));
				this.sketcher.lasso.empty();
				this.sketcher.lasso.select(atoms, content.shapes);
				this.sketcher.lasso.setBounds();
				let b2 = this.sketcher.lasso.bounds;
				c.sub(new structures.Point((b2.minX+b2.maxX)/2+10, (b2.minY+b2.maxY)/2+10));
				new actions.MoveAction(this.sketcher.lasso.getAllPoints(), c).forward(this.sketcher);
				this.sketcher.repaint();
			}
		}
	};

})(ChemDoodle.informatics, ChemDoodle.io, ChemDoodle.structures, ChemDoodle.uis, ChemDoodle.uis.actions);

(function(c, extensions, featureDetection, sketcherPack, structures, d2, tools, q, m, window, undefined) {
	'use strict';
	c.SketcherCanvas = function(id, width, height, options) {
		// keep checks to undefined here as these are booleans
		this.isMobile = options.isMobile === undefined ? featureDetection.supports_touch() : options.isMobile;
		this.useServices = options.useServices === undefined ? false : options.useServices;
		this.oneMolecule = options.oneMolecule === undefined ? false : options.oneMolecule;
		this.requireStartingAtom = options.requireStartingAtom === undefined ? true : options.requireStartingAtom;
		this.includeToolbar = options.includeToolbar === undefined ? true : options.includeToolbar;
		this.floatDrawTools = options.floatDrawTools === undefined ? false : options.floatDrawTools;
		this.resizable = options.resizable === undefined ? false : options.resizable;
		this.includeQuery = options.includeQuery === undefined ? false : options.includeQuery;
		// save the original options object
		this.originalOptions = options;
		// toolbar manager needs the sketcher id to make it unique to this
		// canvas
		this.id = id;
		this.toolbarManager = new sketcherPack.gui.ToolbarManager(this);
		if (this.includeToolbar) {
			this.toolbarManager.write();
			// If pre-created, wait until the last button image loads before
			// calling setup.
			let self = this;
			if (document.getElementById(this.id)) {
				q('#' + id + '_button_chain_icon').load(function() {
					self.toolbarManager.setup();
				});
			} else {
				q(window).load(function() {
					self.toolbarManager.setup();
				});
			}
			this.dialogManager = new sketcherPack.gui.DialogManager(this);
		}
		if(sketcherPack.gui.desktop.TextInput){
			this.textInput = new sketcherPack.gui.desktop.TextInput(this, this.id+'_textInput');
		}
		this.stateManager = new sketcherPack.states.StateManager(this);
		this.historyManager = new sketcherPack.actions.HistoryManager(this);
		this.copyPasteManager = new sketcherPack.CopyPasteManager(this);
		if (id) {
			this.create(id, width, height);
		}
		// styles is now created and available
		this.styles.atoms_circleDiameter_2D = 7;
		this.styles.atoms_circleBorderWidth_2D = 0;
		this.isHelp = false;
		this.lastPinchScale = 1;
		this.lastGestureRotate = 0;
		this.inGesture = false;
		if (this.oneMolecule) {
			let startMol = new structures.Molecule();
			startMol.atoms.push(new structures.Atom());
			this.loadMolecule(startMol);
		} else {
			this.startAtom = new structures.Atom('C', -10, -10);
			this.startAtom.isLone = true;
			this.lasso = new tools.Lasso(this);
		}
		if(this.resizable){
			let jqsk = q('#'+this.id);
			let self = this;
			jqsk.resizable({
				resize: function( event, ui ) {
					self.resize(jqsk.innerWidth(), jqsk.innerHeight());
				}
			});
		}
	};
	let _ = c.SketcherCanvas.prototype = new c._Canvas();
	_.drawSketcherDecorations = function(ctx, styles) {
		ctx.save();
		ctx.translate(this.width / 2, this.height / 2);
		ctx.rotate(styles.rotateAngle);
		ctx.scale(styles.scale, styles.scale);
		ctx.translate(-this.width / 2, -this.height / 2);
		if (this.hovering) {
			this.hovering.drawDecorations(ctx, styles);
		}
		if (this.startAtom && this.startAtom.x != -10 && !this.isMobile) {
			this.startAtom.draw(ctx, styles);
		}
		if (this.tempAtom) {
			ctx.strokeStyle = styles.colorPreview;
			ctx.fillStyle = styles.colorPreview;
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(this.hovering.x, this.hovering.y);
			ctx.lineTo(this.tempAtom.x, this.tempAtom.y);
			ctx.setLineDash([2]);
			ctx.stroke();
			ctx.setLineDash([]);
			if (this.tempAtom.label === 'C') {
				ctx.beginPath();
				ctx.arc(this.tempAtom.x, this.tempAtom.y, 3, 0, m.PI * 2, false);
				ctx.fill();
			}else{
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				ctx.font = extensions.getFontString(styles.atoms_font_size_2D, styles.atoms_font_families_2D, styles.atoms_font_bold_2D, styles.atoms_font_italic_2D);
				ctx.fillText(this.tempAtom.label, this.tempAtom.x, this.tempAtom.y);
			}
			if (this.tempAtom.isOverlap) {
				ctx.strokeStyle = styles.colorError;
				ctx.lineWidth = 1.2;
				ctx.beginPath();
				ctx.arc(this.tempAtom.x, this.tempAtom.y, 7, 0, m.PI * 2, false);
				ctx.stroke();
			}
		}
		if (this.tempRing) {
			ctx.strokeStyle = styles.colorPreview;
			ctx.fillStyle = styles.colorPreview;
			ctx.lineWidth = 1;
			ctx.beginPath();
			if (this.hovering instanceof structures.Atom) {
				ctx.moveTo(this.hovering.x, this.hovering.y);
				ctx.lineTo(this.tempRing[0].x, this.tempRing[0].y);
				for ( let i = 1, ii = this.tempRing.length; i < ii; i++) {
					ctx.lineTo(this.tempRing[i].x, this.tempRing[i].y);
				}
				ctx.lineTo(this.hovering.x, this.hovering.y);
			} else if (this.hovering instanceof structures.Bond) {
				let start = this.hovering.a2;
				let end = this.hovering.a1;
				if (this.tempRing[0] === this.hovering.a1) {
					start = this.hovering.a1;
					end = this.hovering.a2;
				}
				ctx.moveTo(start.x, start.y);
				ctx.lineTo(this.tempRing[1].x, this.tempRing[1].y);
				for ( let i = 2, ii = this.tempRing.length; i < ii; i++) {
					ctx.lineTo(this.tempRing[i].x, this.tempRing[i].y);
				}
				ctx.lineTo(end.x, end.y);
			}
			ctx.setLineDash([2]);
			ctx.stroke();
			ctx.setLineDash([]);
			ctx.strokeStyle = styles.colorError;
			ctx.lineWidth = 1.2;
			for ( let i = 0, ii = this.tempRing.length; i < ii; i++) {
				if (this.tempRing[i].isOverlap) {
					ctx.beginPath();
					ctx.arc(this.tempRing[i].x, this.tempRing[i].y, 7, 0, m.PI * 2, false);
					ctx.stroke();
				}
			}
			// arbitrary ring size number
			if(this.stateManager.STATE_NEW_RING.numSides===-1){
				let midx = 0;
				let midy = 0;
				if (this.hovering instanceof structures.Atom) {
					midx+=this.hovering.x;
					midy+=this.hovering.y;
				} else if (this.hovering instanceof structures.Bond) {
					let start = this.hovering.a1;
					if (this.tempRing[0] === this.hovering.a1) {
						start = this.hovering.a2;
					}
					midx+=start.x;
					midy+=start.y;
				}
				let ii = this.tempRing.length;
				for ( let i = 0; i < ii; i++) {
					midx += this.tempRing[i].x;
					midy += this.tempRing[i].y;
				}
				ii++;
				midx /= ii;
				midy /= ii;
				ctx.font = extensions.getFontString(styles.text_font_size, styles.text_font_families, styles.text_font_bold, styles.text_font_italic);
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				ctx.fillStyle = 'black';
				ctx.fillText(ii, midx, midy);
			}
		}
		if (this.tempChain && this.tempChain.length>0) {
			ctx.strokeStyle = styles.colorPreview;
			ctx.fillStyle = styles.colorPreview;
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(this.hovering.x, this.hovering.y);
			ctx.lineTo(this.tempChain[0].x, this.tempChain[0].y);
			for ( let i = 1, ii = this.tempChain.length; i < ii; i++) {
				ctx.lineTo(this.tempChain[i].x, this.tempChain[i].y);
			}
			ctx.setLineDash([2]);
			ctx.stroke();
			ctx.setLineDash([]);
			ctx.strokeStyle = styles.colorError;
			ctx.lineWidth = 1.2;
			for ( let i = 0, ii = this.tempChain.length; i < ii; i++) {
				if (this.tempChain[i].isOverlap) {
					ctx.beginPath();
					ctx.arc(this.tempChain[i].x, this.tempChain[i].y, 7, 0, m.PI * 2, false);
					ctx.stroke();
				}
			}
			ctx.font = extensions.getFontString(styles.text_font_size, styles.text_font_families, styles.text_font_bold, styles.text_font_italic);
			ctx.textAlign = 'left';
			ctx.textBaseline = 'bottom';
			let size = this.tempChain.length;
			ctx.fillStyle = 'black';
			ctx.fillText(size, this.tempChain[size-1].x+10, this.tempChain[size-1].y-10);
		}
		if (this.tempTemplate) {
			if(this.tempTemplate.atoms.length>0){
				let spec1 = styles.atoms_color;
				let spec2 = styles.atoms_useJMOLColors;
				let spec3 = styles.atoms_usePYMOLColors;
				let spec4 = styles.bonds_color;
				let spec5 = styles.atoms_HBlack_2D;
				styles.atoms_color = styles.colorPreview;
				styles.atoms_useJMOLColors = false;
				styles.atoms_usePYMOLColors = false;
				styles.bonds_color = styles.colorPreview;
				styles.atoms_HBlack_2D = false;
				this.tempTemplate.draw(ctx, styles);
				styles.atoms_color = spec1;
				styles.atoms_useJMOLColors = spec2;
				styles.atoms_usePYMOLColors = spec3;
				styles.bonds_color = spec4;
				styles.atoms_HBlack_2D = spec5;
			}
			ctx.strokeStyle = styles.colorError;
			ctx.lineWidth = 1.2;
			for ( let i = 0, ii = this.molecules.length; i < ii; i++) {
				let mol = this.molecules[i];
				for ( let j = 0, jj = mol.atoms.length; j < jj; j++) {
					let a = mol.atoms[j];
					if (a.isOverlap) {
						ctx.beginPath();
						ctx.arc(a.x, a.y, 7, 0, m.PI * 2, false);
						ctx.stroke();
					}
				}
			}
		}
		if (this.lasso) {
			this.lasso.draw(ctx, styles);
		}
		if (this.stateManager.getCurrentState().draw) {
			this.stateManager.getCurrentState().draw(ctx, styles);
		}
		ctx.restore();
	};
	_.checksOnAction = function(force){
		// using force improves efficiency, so changes will not be checked
		// until a render occurs
		// you can force a check by sending true to this function after
		// calling check with a false
		if (force && this.doChecks) {
			// setup data for atom mappings
			let arrow;
			let mappings = [];
			let brackets = [];
			let vaps = [];
			for(let i = 0, ii = this.shapes.length; i<ii; i++){
				let s = this.shapes[i];
				if(s instanceof d2.AtomMapping){
					s.error = false;
					mappings.push(s);
				}else if(s instanceof d2.Line && !arrow){
					// make sure arrow isn't defined, just to make sure we use the first arrow
					arrow = s;
				}else if(s instanceof d2.DynamicBracket){
					s.error = false;
					brackets.push(s);
				}else if(s instanceof d2.VAP){
					s.error = false;
					vaps.push(s);
				}
			}
			for(let i = 0, ii = mappings.length; i<ii; i++){
				let si = mappings[i];
				si.label = (i+1).toString();
				for(let j = i+1, jj = mappings.length; j<jj; j++){
					let sj = mappings[j];
					if(si.o1===sj.o1 || si.o2===sj.o1 || si.o1===sj.o2 || si.o2===sj.o2){
						si.error = true;
						sj.error = true;
					}
				}
				// different labels
				if(!si.error && si.o1.label !== si.o2.label){
					si.error = true;
				}
				// same structure
				if(!si.error && this.getMoleculeByAtom(si.o1) === this.getMoleculeByAtom(si.o2)){
					si.error = true;
				}
			}
			if(brackets.length!==0){
				let allAs = this.getAllAtoms();
				for(let i = 0, ii = allAs.length; i<ii; i++){
					allAs[i].inBracket = false;
				}
				for(let i = 0, ii = brackets.length; i<ii; i++){
					let si = brackets[i];
					si.setContents(this);
					if(si.contents.length===0){
						// user error
						si.error = true;
					}else{
						for(let j = 0, jj = si.contents.length; j<jj; j++){
							if(si.contents[j].inBracket){
								si.error = true;
								break;
							}
						}
					}
					for(let j = 0, jj = si.contents.length; j<jj; j++){
						si.contents[j].inBracket = true;
					}
				}
			}
			for(let i = 0, ii = vaps.length; i<ii; i++){
				let vap = vaps[i];
				if(!vap.substituent){
					// no substituent
					vap.error = true;
				}else if(vap.attachments.length===0){
					// no attachments
					vap.error = true;
				}
				if(!vap.error){
					// check that all attachments are part of the same molecule
					let m = this.getMoleculeByAtom(vap.attachments[0]);
					vap.substituent.present = undefined;
					for(let j = 0, jj = m.atoms.length; j<jj; j++){
						m.atoms[j].present = true;
					}
					// also make sure the substituent is NOT part of the same molecule
					if(vap.substituent.present){
						vap.error = true;
					}
					if(!vap.error){
						for(let j = 0, jj = vap.attachments.length; j<jj; j++){
							if(!vap.attachments[j].present){
								vap.error = true;
								break;
							}
						}
					}
					for(let j = 0, jj = m.atoms.length; j<jj; j++){
						m.atoms[j].present = undefined;
					}
				}
			}
		}
		this.doChecks = !force;
	};
	_.drawChildExtras = function(ctx, styles) {
		this.drawSketcherDecorations(ctx, styles);
		if (!this.hideHelp) {
			// help and tutorial
			let helpPos = new structures.Point(this.width - 20, 20);
			let radgrad = ctx.createRadialGradient(helpPos.x, helpPos.y, 10, helpPos.x, helpPos.y, 2);
			radgrad.addColorStop(0, '#00680F');
			radgrad.addColorStop(1, '#01DF01');
			ctx.fillStyle = radgrad;
			ctx.beginPath();
			ctx.arc(helpPos.x, helpPos.y, 10, 0, m.PI * 2, false);
			ctx.fill();
			ctx.lineWidth = 2;
			if (this.isHelp) {
				ctx.strokeStyle = styles.colorHover;
				ctx.stroke();
			}
			ctx.strokeStyle = 'black';
			ctx.fillStyle = 'white';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.font = '14px sans-serif';
			ctx.strokeText('?', helpPos.x, helpPos.y);
			ctx.fillText('?', helpPos.x, helpPos.y);
		}
		if (!this.paidToHideTrademark) {
			// You must keep this name displayed at all times to abide by the license
			// Contact us for permission to remove it,
			// http://www.ichemlabs.com/contact-us
			ctx.font = '14px sans-serif';
			let x = '\x43\x68\x65\x6D\x44\x6F\x6F\x64\x6C\x65';
			let width = ctx.measureText(x).width;
			ctx.textAlign = 'left';
			ctx.textBaseline = 'bottom';
			ctx.fillStyle = 'rgba(60, 60, 60, 0.5)';
			ctx.fillText(x, this.width - width - 13, this.height - 4);
			ctx.font = '10px sans-serif';
			ctx.fillText('\u00AE', this.width - 13, this.height - 12);
		}
	};
	_.scaleEvent = function(e) {
		e.op = new structures.Point(e.p.x, e.p.y);
		if (this.styles.scale !== 1) {
			e.p.x = this.width / 2 + (e.p.x - this.width / 2) / this.styles.scale;
			e.p.y = this.height / 2 + (e.p.y - this.height / 2) / this.styles.scale;
		}
	};
	_.checkScale = function() {
		if (this.styles.scale < .5) {
			this.styles.scale = .5;
		} else if (this.styles.scale > 10) {
			this.styles.scale = 10;
		}
	};
	// desktop events
	_.click = function(e) {
		this.scaleEvent(e);
		if(this.modal){
			// for modal popovers, close requires a true value to state that is was cancelled
			// for text input, the event is required
			this.modal.close(e);
			return false;
		}
		this.stateManager.getCurrentState().click(e);
	};
	_.rightclick = function(e) {
		if(this.modal){
			return false;
		}
		this.scaleEvent(e);
		this.stateManager.getCurrentState().rightclick(e);
	};
	_.dblclick = function(e) {
		if(this.modal){
			return false;
		}
		this.scaleEvent(e);
		this.stateManager.getCurrentState().dblclick(e);
	};
	_.mousedown = function(e) {
		if(this.modal){
			return false;
		}
		this.scaleEvent(e);
		this.stateManager.getCurrentState().mousedown(e);
	};
	_.rightmousedown = function(e) {
		if(this.modal){
			return false;
		}
		this.scaleEvent(e);
		this.stateManager.getCurrentState().rightmousedown(e);
	};
	_.mousemove = function(e) {
		if(this.modal){
			return false;
		}
		// link to tutorial
		this.isHelp = false;
		if (e.p.distance(new structures.Point(this.width - 20, 20)) < 10) {
			this.isHelp = true;
		}
		this.scaleEvent(e);
		this.stateManager.getCurrentState().mousemove(e);
		// repaint is called in the state mousemove event
	};
	_.mouseout = function(e) {
		if(this.modal){
			return false;
		}
		this.scaleEvent(e);
		this.stateManager.getCurrentState().mouseout(e);
	};
	_.mouseover = function(e) {
		if(this.modal){
			return false;
		}
		this.scaleEvent(e);
		this.stateManager.getCurrentState().mouseover(e);
	};
	_.mouseup = function(e) {
		if(this.modal){
			return false;
		}
		this.scaleEvent(e);
		this.stateManager.getCurrentState().mouseup(e);
	};
	_.rightmouseup = function(e) {
		if(this.modal){
			return false;
		}
		this.scaleEvent(e);
		this.stateManager.getCurrentState().rightmouseup(e);
	};
	_.mousewheel = function(e, delta) {
		if(this.modal){
			return false;
		}
		this.scaleEvent(e);
		this.stateManager.getCurrentState().mousewheel(e, delta);
	};
	_.drag = function(e) {
		if(this.modal){
			return false;
		}
		this.scaleEvent(e);
		this.stateManager.getCurrentState().drag(e);
	};
	_.keydown = function(e) {
		if(this.modal){
			return false;
		}
		this.scaleEvent(e);
		this.stateManager.getCurrentState().keydown(e);
	};
	_.keypress = function(e) {
		if(this.modal){
			return false;
		}
		this.scaleEvent(e);
		this.stateManager.getCurrentState().keypress(e);
	};
	_.keyup = function(e) {
		if(this.modal){
			return false;
		}
		this.scaleEvent(e);
		this.stateManager.getCurrentState().keyup(e);
	};
	// mobile events
	_.touchstart = function(e) {
		if(this.modal){
			return false;
		}
		if (e.originalEvent.touches && e.originalEvent.touches.length > 1) {
			if (this.tempAtom || this.tempRing) {
				this.tempAtom = undefined;
				this.tempRing = undefined;
				this.hovering = undefined;
				this.repaint();
			}
			this.lastPoint = undefined;
		} else {
			this.scaleEvent(e);
			this.stateManager.getCurrentState().mousemove(e);
			this.stateManager.getCurrentState().mousedown(e);
		}
	};
	_.touchmove = function(e) {
		if(this.modal){
			return false;
		}
		this.scaleEvent(e);
		if (!this.inGesture && this.lastPoint.distance(e.p)>5) {
			this.stateManager.getCurrentState().drag(e);
		}
	};
	_.touchend = function(e) {
		if(this.modal){
			return false;
		}
		this.scaleEvent(e);
		this.stateManager.getCurrentState().mouseup(e);
		if (this.hovering) {
			this.stateManager.getCurrentState().clearHover();
			this.repaint();
		}
	};
	_.gesturechange = function(e) {
		if(this.modal){
			return false;
		}
		this.inGesture = true;
		// set no new mols to form to stop actions in label state
		this.stateManager.getCurrentState().newMolAllowed = false;
		if (e.originalEvent.scale - this.lastPinchScale !== 1) {
			if (!(this.lasso && this.lasso.isActive())) {
				this.styles.scale *= e.originalEvent.scale / this.lastPinchScale;
				this.checkScale();
			}
			this.lastPinchScale = e.originalEvent.scale;
		}
		if (this.lastGestureRotate - e.originalEvent.rotation !== 0) {
			let rot = (this.lastGestureRotate - e.originalEvent.rotation) / 180 * m.PI;
			if (!this.parentAction) {
				let ps = (this.lasso && this.lasso.isActive()) ? this.lasso.getAllPoints() : this.getAllPoints();
				let center = (this.lasso && this.lasso.isActive()) ? new structures.Point((this.lasso.bounds.minX + this.lasso.bounds.maxX) / 2, (this.lasso.bounds.minY + this.lasso.bounds.maxY) / 2) : new structures.Point(this.width / 2, this.height / 2);
				this.parentAction = new sketcherPack.actions.RotateAction(ps, rot, center);
				this.historyManager.pushUndo(this.parentAction);
			} else {
				this.parentAction.dif += rot;
				for ( let i = 0, ii = this.parentAction.ps.length; i < ii; i++) {
					let p = this.parentAction.ps[i];
					let dist = this.parentAction.center.distance(p);
					let angle = this.parentAction.center.angle(p) + rot;
					p.x = this.parentAction.center.x + dist * m.cos(angle);
					p.y = this.parentAction.center.y - dist * m.sin(angle);
				}
				// must check here as change is outside of an action
				for ( let i = 0, ii = this.molecules.length; i < ii; i++) {
					this.molecules[i].check();
				}
				if (this.lasso && this.lasso.isActive()) {
					this.lasso.setBounds();
				}
			}
			this.lastGestureRotate = e.originalEvent.rotation;
		}
		this.repaint();
	};
	_.gestureend = function(e) {
		if(this.modal){
			return false;
		}
		this.inGesture = false;
		this.lastPinchScale = 1;
		this.lastGestureRotate = 0;
		this.parentAction = undefined;
	};

})(ChemDoodle, ChemDoodle.extensions, ChemDoodle.featureDetection, ChemDoodle.uis, ChemDoodle.structures, ChemDoodle.structures.d2, ChemDoodle.uis.tools, ChemDoodle.lib.jQuery, Math, window);

(function(c, math, monitor, actions, states, structures, SYMBOLS, m, m4, undefined) {
	'use strict';
	states._State3D = function() {
	};
	let _ = states._State3D.prototype;
	_.setup = function(editor) {
		this.editor = editor;
	};

	_.enter = function() {
		if (this.innerenter) {
			this.innerenter();
		}
	};
	_.exit = function() {
		if (this.innerexit) {
			this.innerexit();
		}
	};
	_.click = function(e) {
		if (this.innerclick) {
			this.innerclick(e);
		}
	};
	_.rightclick = function(e) {
		if (this.innerrightclick) {
			this.innerrightclick(e);
		}
	};
	_.dblclick = function(e) {
		if (this.innerdblclick) {
			this.innerdblclick(e);
		}
	};
	_.mousedown = function(e) {
		this.editor.defaultmousedown(e);
		// must also check for mobile hits here to the help button
		if (this.editor.isHelp || this.editor.isMobile && e.p.distance(new structures.Point(this.editor.width - 20, 20)) < 10) {
			this.editor.isHelp = false;
			this.editor.lastPoint = undefined;
			this.editor.repaint();
			// window.open doesn't work once Event.preventDefault() has been called
			location.href='https://web.chemdoodle.com/demos/3d-editor';
			//window.open('https://web.chemdoodle.com/demos/3d-editor');
		} else if (this.innermousedown) {
			this.innermousedown(e);
		}
	};
	_.rightmousedown = function(e) {
		if (this.innerrightmousedown) {
			this.innerrightmousedown(e);
		}
		this.editor.defaultrightmousedown(e);
	};
	_.mousemove = function(e) {
		if (this.innermousemove) {
			this.innermousemove(e);
		}
		// call the repaint here to repaint the help button, also this is called
		// by other functions, so the repaint must be here
		this.editor.repaint();
	};
	_.mouseout = function(e) {
		if (this.innermouseout) {
			this.innermouseout(e);
		}
	};
	_.mouseover = function(e) {
		if (this.innermouseover) {
			this.innermouseover(e);
		}
	};
	_.mouseup = function(e) {
		if (this.innermouseup) {
			this.innermouseup(e);
		}
		this.editor.defaultmouseup(e);
	};
	_.rightmouseup = function(e) {
		if (this.innerrightmouseup) {
			this.innerrightmouseup(e);
		}
	};
	_.mousewheel = function(e, delta) {
		if (this.innermousewheel) {
			this.innermousewheel(e);
		} else {
			this.editor.defaultmousewheel(e, delta);
		}
	};
	_.drag = function(e) {
		if (this.innerdrag) {
			this.innerdrag(e);
		} else {
			this.editor.defaultdrag(e);
		}
	};
	_.keydown = function(e) {
		if (monitor.META) {
			if (e.which === 90) {
				// z
				this.editor.historyManager.undo();
			} else if (e.which === 89) {
				// y
				this.editor.historyManager.redo();
			} else if (e.which === 83) {
				// s
				this.editor.toolbarManager.buttonSave.func();
			} else if (e.which === 79) {
				// o
				this.editor.toolbarManager.buttonOpen.func();
			} else if (e.which === 78) {
				// n
				// this seems to always be overridden in some browsers, so we can't actually listen to ctrl/command+n
				this.editor.toolbarManager.buttonClear.func();
			} else if (e.which === 187 || e.which === 61) {
				// +
				this.editor.toolbarManager.buttonScalePlus.func();
			} else if (e.which === 189 || e.which === 109) {
				// -
				this.editor.toolbarManager.buttonScaleMinus.func();
			}
		}
		if (this.innerkeydown) {
			this.innerkeydown(e);
		}
	};
	_.keypress = function(e) {
		if (this.innerkeypress) {
			this.innerkeypress(e);
		}
	};
	_.keyup = function(e) {
		if (this.innerkeyup) {
			this.innerkeyup(e);
		}
	};

})(ChemDoodle, ChemDoodle.math, ChemDoodle.monitor, ChemDoodle.uis.actions, ChemDoodle.uis.states, ChemDoodle.structures, ChemDoodle.SYMBOLS, Math, ChemDoodle.lib.mat4);
(function(actions, states, structures, d3, q, undefined) {
	'use strict';
	states.MeasureState3D = function(editor) {
		this.setup(editor);
		this.selectedAtoms = [];
	};
	let _ = states.MeasureState3D.prototype = new states._State3D();
	_.numToSelect = 2;

	_.reset = function(){
		for(let i = 0, ii = this.selectedAtoms.length; i<ii; i++){
			this.selectedAtoms[i].isSelected = false;
		}
		this.selectedAtoms = [];
		this.editor.repaint();
	};
	_.innerenter = function(e) {
		this.reset();
	};
	_.innerexit = function(e) {
		this.reset();
	};
	_.innermousemove = function(e) {
		if (this.hoveredAtom) {
			this.hoveredAtom.isHover = false;
			this.hoveredAtom = undefined;
		}
		let obj = this.editor.pick(e.p.x, e.p.y, true, false);
		if (obj && obj instanceof structures.Atom) {
			this.hoveredAtom = obj;
			obj.isHover = true;
		}
		this.editor.repaint();
	};
	_.innermousedown = function(e) {
		// don't use click as that doesn't work on android
		if(this.editor.isMobile){
			this.innermousemove(e);
		}
		if (this.hoveredAtom) {
			this.hoveredAtom.isHover = false;
			if (this.hoveredAtom.isSelected) {
				let a = this.hoveredAtom;
				this.selectedAtoms = q.grep(this.selectedAtoms, function(value) {
					return value !== a;
				});
			} else {
				this.selectedAtoms.push(this.hoveredAtom);
			}
			this.hoveredAtom.isSelected = !this.hoveredAtom.isSelected;
			this.hoveredAtom = undefined;
			this.editor.repaint();
		}
		if (this.selectedAtoms.length === this.numToSelect) {
			let shape;
			switch(this.numToSelect){
			case 2:
				shape = new d3.Distance(this.selectedAtoms[0], this.selectedAtoms[1]);
				break;
			case 3:
				shape = new d3.Angle(this.selectedAtoms[0], this.selectedAtoms[1], this.selectedAtoms[2]);
				break;
			case 4:
				shape = new d3.Torsion(this.selectedAtoms[0], this.selectedAtoms[1], this.selectedAtoms[2], this.selectedAtoms[3]);
				break;
			}
			this.reset();
			if(shape){
				this.editor.historyManager.pushUndo(new actions.AddShapeAction(this.editor, shape));
			}
		}
	};

})(ChemDoodle.uis.actions, ChemDoodle.uis.states, ChemDoodle.structures, ChemDoodle.structures.d3, ChemDoodle.lib.jQuery);
(function(states, undefined) {
	'use strict';
	states.ViewState3D = function(editor) {
		this.setup(editor);
	};
	let _ = states.ViewState3D.prototype = new states._State3D();

})(ChemDoodle.uis.states);

(function(states, undefined) {
	'use strict';
	states.StateManager3D = function(editor) {
		this.STATE_VIEW = new states.ViewState3D(editor);
		this.STATE_MEASURE = new states.MeasureState3D(editor);
		let currentState = this.STATE_VIEW;
		this.setState = function(nextState) {
			if (nextState !== currentState) {
				currentState.exit();
				currentState = nextState;
				currentState.enter();
			}
		};
		this.getCurrentState = function() {
			return currentState;
		};
	};

})(ChemDoodle.uis.states);
(function(c, iChemLabs, io, structures, actions, gui, imageDepot, desktop, tools, states, q, document, undefined) {
	'use strict';
	gui.ToolbarManager3D = function(editor) {
		this.editor = editor;

		// open
		this.buttonOpen = new desktop.Button(editor.id + '_button_open', imageDepot.OPEN, 'Open', function() {
			let component = q('#' + editor.dialogManager.openPopup.id);
			if (component.is(":hidden")){
				editor.dialogManager.openPopup.show();
			}else{
				editor.dialogManager.openPopup.close();
			}
			
		});
		// save
		this.buttonSave = new desktop.Button(editor.id + '_button_save', imageDepot.SAVE, 'Save', function() {
			if (editor.useServices) {
				editor.dialogManager.saveDialog.clear();
			} else {
				editor.dialogManager.saveDialog.getTextArea().val(c.writeMOL(editor.molecules[0]));
			}
			editor.dialogManager.saveDialog.open();
		});
		// search
		this.buttonSearch = new desktop.Button(editor.id + '_button_search', imageDepot.SEARCH, 'Search', function() {
			editor.dialogManager.searchDialog.open();
		});
		// calculate
		this.buttonCalculate = new desktop.Button(editor.id + '_button_calculate', imageDepot.CALCULATE, 'Calculate', function() {
			let mol = editor.molecules[0];
			if (mol) {
				iChemLabs.calculate(mol, {
					descriptors : [ 'mf', 'ef', 'mw', 'miw', 'deg_unsat', 'hba', 'hbd', 'rot', 'electron', 'pol_miller', 'cmr', 'tpsa', 'vabc', 'xlogp2', 'bertz' ]
				}, function(content) {
					let sb = [];
					function addDatum(title, value, unit) {
						sb.push(title);
						sb.push(': ');
						for ( let i = title.length + 2; i < 30; i++) {
							sb.push(' ');
						}
						sb.push(value);
						sb.push(' ');
						sb.push(unit);
						sb.push('\n');
					}
					addDatum('Molecular Formula', content.mf, '');
					addDatum('Empirical Formula', content.ef, '');
					addDatum('Molecular Mass', content.mw, 'amu');
					addDatum('Monoisotopic Mass', content.miw, 'amu');
					addDatum('Degree of Unsaturation', content.deg_unsat, '');
					addDatum('Hydrogen Bond Acceptors', content.hba, '');
					addDatum('Hydrogen Bond Donors', content.hbd, '');
					addDatum('Rotatable Bonds', content.rot, '');
					addDatum('Total Electrons', content.rot, '');
					addDatum('Molecular Polarizability', content.pol_miller, 'A^3');
					addDatum('Molar Refractivity', content.cmr, 'cm^3/mol');
					addDatum('Polar Surface Area', content.tpsa, 'A^2');
					addDatum('vdW Volume', content.vabc, 'A^3');
					addDatum('logP', content.xlogp2, '');
					addDatum('Complexity', content.bertz, '');
					editor.dialogManager.calculateDialog.getTextArea().val(sb.join(''));
					editor.dialogManager.calculateDialog.open();
				});
			}
		});

		// transform
		this.buttonTransform = new desktop.Button(editor.id + '_button_transform', imageDepot.PERSPECTIVE, 'Transform', function() {
			editor.stateManager.setState(editor.stateManager.STATE_VIEW);
		});
		this.buttonTransform.toggle = true;

		// visual specifications
		this.buttonSettings = new desktop.Button(editor.id + '_button_specifications', imageDepot.SETTINGS, 'Visual Specifications', function() {
			editor.dialogManager.stylesDialog.update(editor.styles);
			editor.dialogManager.stylesDialog.open();
		});

		// animations
		this.buttonAnimation = new desktop.Button(editor.id + '_button_animation', imageDepot.ANIMATION, 'Animations', function() {
			editor.stateManager.setState(editor.stateManager.STATE_MOVE);
		});

		// clear
		this.buttonClear = new desktop.Button(editor.id + '_button_clear', imageDepot.CLEAR, 'Clear', function() {
			editor.historyManager.pushUndo(new actions.ClearAction(editor));
		});
		// clean
		this.buttonClean = new desktop.Button(editor.id + '_button_clean', imageDepot.OPTIMIZE, 'Clean', function() {
			let mol = editor.molecules[0];
			if (mol) {
				iChemLabs.optimize(mol, {
					dimension : 3
				}, function(mol) {
					editor.historyManager.pushUndo(new actions.SwitchMoleculeAction(editor, mol));
				});
			}
		});

		// scale set
		this.makeScaleSet(this);

		// history set
		this.makeHistorySet(this);

		// history set
		this.makeMeasurementsSet(this);
	};
	let _ = gui.ToolbarManager3D.prototype;
	_.write = function() {
		let sb = [ '<div style="font-size:10px;">' ];
		let bg = this.editor.id + '_main_group';
		//sb.push(this.historySet.getSource());
		sb.push(this.scaleSet.getSource());
		//sb.push(this.buttonOpen.getSource());
		//sb.push(this.buttonSave.getSource());
		if (this.editor.useServices) {
			sb.push(this.buttonSearch.getSource());
			sb.push(this.buttonCalculate.getSource());
		}
		//sb.push('<br>');
		sb.push(this.buttonTransform.getSource(bg));
		//sb.push(this.buttonSettings.getSource());
		//sb.push(this.buttonAnimation.getSource());
		sb.push(this.measurementsSet.getSource(bg));
		sb.push(this.buttonClear.getSource());
		if (this.editor.useServices) {
			sb.push(this.buttonClean.getSource());
		}
		sb.push('</div>');

		if (document.getElementById(this.editor.id)) {
			let canvas = q('#' + this.editor.id);
			canvas.before(sb.join(''));
		} else {
			document.write(sb.join(''));
		}
	};
	_.setup = function() {
		this.buttonTransform.setup(true);
		//this.buttonSettings.setup();
		//this.buttonAnimation.setup();
		this.measurementsSet.setup();
		this.buttonClear.setup();
		if (this.editor.useServices) {
			this.buttonClean.setup();
		}
		this.historySet.setup();
		this.scaleSet.setup();
		this.buttonOpen.setup();
		this.buttonSave.setup();
		if (this.editor.useServices) {
			this.buttonSearch.setup();
			this.buttonCalculate.setup();
		}

		this.buttonTransform.getElement().click();
		this.buttonUndo.disable();
		this.buttonRedo.disable();
	};

	_.makeScaleSet = function(self) {
		this.scaleSet = new desktop.ButtonSet(self.editor.id + '_buttons_scale');
		this.scaleSet.toggle = false;
		this.buttonScalePlus = new desktop.Button(self.editor.id + '_button_scale_plus', imageDepot.ZOOM_IN, 'Increase Scale', function() {
			self.editor.mousewheel(null, -10);
		});
		this.scaleSet.buttons.push(this.buttonScalePlus);
		this.buttonScaleMinus = new desktop.Button(self.editor.id + '_button_scale_minus', imageDepot.ZOOM_OUT, 'Decrease Scale', function() {
			self.editor.mousewheel(null, 10);
		});
		this.scaleSet.buttons.push(this.buttonScaleMinus);
	};
	_.makeHistorySet = function(self) {
		this.historySet = new desktop.ButtonSet(self.editor.id + '_buttons_history');
		this.historySet.toggle = false;
		this.buttonUndo = new desktop.Button(self.editor.id + '_button_undo', imageDepot.UNDO, 'Undo', function() {
			self.editor.historyManager.undo();
		});
		this.historySet.buttons.push(this.buttonUndo);
		this.buttonRedo = new desktop.Button(self.editor.id + '_button_redo', imageDepot.REDO, 'Redo', function() {
			self.editor.historyManager.redo();
		});
		this.historySet.buttons.push(this.buttonRedo);
	};
	_.makeMeasurementsSet = function(self) {
		this.measurementsSet = new desktop.ButtonSet(self.editor.id + '_buttons_measurements');
		this.buttonDistance = new desktop.Button(self.editor.id + '_button_distance', imageDepot.DISTANCE, 'Distance', function() {
			self.editor.stateManager.STATE_MEASURE.numToSelect = 2;
			self.editor.stateManager.STATE_MEASURE.reset();
			self.editor.stateManager.setState(self.editor.stateManager.STATE_MEASURE);
		});
		this.measurementsSet.buttons.push(this.buttonDistance);
		this.buttonAngle = new desktop.Button(self.editor.id + '_button_angle', imageDepot.ANGLE, 'Angle', function() {
			self.editor.stateManager.STATE_MEASURE.numToSelect = 3;
			self.editor.stateManager.STATE_MEASURE.reset();
			self.editor.stateManager.setState(self.editor.stateManager.STATE_MEASURE);
		});
		this.measurementsSet.buttons.push(this.buttonAngle);
		this.buttonTorsion = new desktop.Button(self.editor.id + '_button_torsion', imageDepot.TORSION, 'Torsion', function() {
			self.editor.stateManager.STATE_MEASURE.numToSelect = 4;
			self.editor.stateManager.STATE_MEASURE.reset();
			self.editor.stateManager.setState(self.editor.stateManager.STATE_MEASURE);
		});
		this.measurementsSet.buttons.push(this.buttonTorsion);
	};

})(ChemDoodle, ChemDoodle.iChemLabs, ChemDoodle.io, ChemDoodle.structures, ChemDoodle.uis.actions, ChemDoodle.uis.gui, ChemDoodle.uis.gui.imageDepot, ChemDoodle.uis.gui.desktop, ChemDoodle.uis.tools, ChemDoodle.uis.states, ChemDoodle.lib.jQuery, document);

(function(c, desktop, q, document, undefined) {
	'use strict';
	desktop.SpecsDialog = function(editor, subid) {
		this.editor = editor;
		this.id = this.editor.id + subid;
	};
	let _ = desktop.SpecsDialog.prototype = new desktop.Dialog();
	_.title = 'Visual Specifications';
	
	_.makeProjectionSet = function(self) {
		this.projectionSet = new desktop.ButtonSet(self.id + '_projection_group');
		this.buttonPerspective = new desktop.TextButton(self.id + '_button_Perspective', 'Perspective',function() {
			self.editor.styles.projectionPerspective_3D = true;
			self.editor.updateScene();
			self.update(editor.styles);
		});
		this.projectionSet.buttons.push(this.buttonPerspective);
		this.buttonOrthographic = new desktop.TextButton(self.id + '_button_Orthographic', 'Orthographic',function() {
			self.editor.styles.projectionPerspective_3D = false;
			self.editor.updateScene(self);
			self.update(editor.styles);
		});
		this.projectionSet.buttons.push(this.buttonOrthographic);
	};
	
	_.makeAtomColorSet = function(self) {
		this.atomColorSet = new desktop.ButtonSet(self.id + '_atom_color_group');
		this.atomColorSet.toggle = true;
		this.buttonJmolColors = new desktop.TextButton(self.id + '_button_Jmol_Colors', 'Jmol', function() {
			self.editor.styles.atoms_useJMOLColors = true;
			self.editor.styles.atoms_usePYMOLColors = false;
			self.editor.updateScene();
			self.update(editor.styles);
		});
		this.atomColorSet.buttons.push(this.buttonJmolColors);
		this.buttonPymolColors = new desktop.TextButton(self.id + '_button_PyMOL_Colors', 'PyMOL', function() {
			self.editor.styles.atoms_usePYMOLColors = true;
			self.editor.styles.atoms_useJMOLColors = false;
			self.editor.updateScene();
			self.update(editor.styles);
		});
		this.atomColorSet.buttons.push(this.buttonPymolColors);
	};
	
	_.makeBondColorSet = function(self) {
		this.bondColorSet = new desktop.ButtonSet(self.id + '_bond_color_group');
		this.bondColorSet.toggle = true;
		this.buttonJmolBondColors = new desktop.TextButton(self.id + '_button_Jmol_Bond_Colors', 'Jmol', function() {
			self.editor.styles.bonds_useJMOLColors = true;
			self.editor.styles.bonds_usePYMOLColors = false;
			self.editor.updateScene();
			self.update(editor.styles);
		});
		this.bondColorSet.buttons.push(this.buttonJmolBondColors);
		this.buttonPymolBondColors = new desktop.TextButton(self.id + '_button_PyMOL_Bond_Colors', 'PyMOL', function() {
			self.editor.styles.bonds_usePYMOLColors = true;
			self.editor.styles.bonds_useJMOLColors = false;
			self.editor.updateScene();
			self.update(editor.styles);
		});
		this.bondColorSet.buttons.push(this.buttonPymolBondColors);
	};
	
	_.makeCompassPositionSet = function(self) {
		this.compassPositionSet = new desktop.ButtonSet(self.id + '_compass_position_group');
		this.buttonCompassCorner = new desktop.TextButton(self.id + '_button_compass_corner', 'Corner',function() {
			self.editor.styles.compass_type_3D = 0;
			self.editor.styles.compass_size_3D = 50;
			self.editor.setupScene();
			self.editor.updateScene();
			self.update(editor.styles);
		});
		this.compassPositionSet.buttons.push(this.buttonCompassCorner);
		this.buttonCompassOrigin = new desktop.TextButton(self.id + '_button_compass_origin', 'Origin',function() {
			self.editor.styles.compass_type_3D = 1;
			self.editor.styles.compass_size_3D = 150;
			self.editor.setupScene();
			self.editor.updateScene();
			self.update(editor.styles);
		});
		this.compassPositionSet.buttons.push(this.buttonCompassOrigin);
	};
	
	_.makeFogModeSet = function(self) {
		this.fogModeSet = new desktop.ButtonSet(self.id + '_fog_mode_group');
		this.buttonFogMode0 = new desktop.TextButton(self.id + '_button_fog_mode_0', 'No Fogging', function() {
			self.editor.styles.fog_mode_3D = 0;
			self.editor.updateScene();
			self.update(editor.styles);
		});
		this.fogModeSet.buttons.push(this.buttonFogMode0);
		this.buttonFogMode1 = new desktop.TextButton(self.id + '_button_fog_mode_1', 'Linear', function() {
			self.editor.styles.fog_mode_3D = 1;
			self.editor.updateScene();
			self.update(editor.styles);
		});
		this.fogModeSet.buttons.push(this.buttonFogMode1);
		this.buttonFogMode2 = new desktop.TextButton(self.id + '_button_fog_mode_2', 'Exponential', function() {
			self.editor.styles.fog_mode_3D = 2;
			self.editor.updateScene();
			self.update(editor.styles);
		});
		this.fogModeSet.buttons.push(this.buttonFogMode2);
		this.buttonFogMode3 = new desktop.TextButton(self.id + '_button_fog_mode_3', 'Exponential&sup2;', function() {
			self.editor.styles.fog_mode_3D = 3;
			self.editor.updateScene();
			self.update(editor.styles);
		});
		this.fogModeSet.buttons.push(this.buttonFogMode3);
	};
	
	_.setup = function(self, editor) {
		// canvas
		this.makeProjectionSet(this);
		this.bgcolor = new desktop.ColorPicker(this.id + '_bgcolor', 'Background Color: ', function(hex) {editor.styles.backgroundColor = hex;editor.setupScene();editor.repaint();self.update(editor.styles);});
		this.makeFogModeSet(this);
		this.fogcolor = new desktop.ColorPicker(this.id + '_fogcolor', 'Fog Color: ', function(hex) {editor.styles.fog_color_3D = hex;editor.setupScene();editor.repaint();self.update(editor.styles);});
		
		// atoms
		this.atomsDisplayToggle = new desktop.CheckBox(this.id + '_atoms_display_toggle', 'Display atoms', function() { editor.styles.atoms_display=!editor.styles.atoms_display;editor.updateScene();self.update(editor.styles);}, true);
		this.atomcolor = new desktop.ColorPicker(this.id + '_atomcolor', 'Atom Color: ', function(hex) {editor.styles.atoms_color = hex;editor.setupScene();editor.repaint();self.update(editor.styles);});
		this.makeAtomColorSet(this);
		this.atomColorSetToggle = new desktop.CheckBox(this.id + '_atom_color_group_toggle', 'Color Schemes', function() { 
				if (self.buttonJmolColors.getElement().prop('disabled')) { 
					self.atomColorSet.enable();
					editor.styles.atoms_useJMOLColors = true;
				} else { 
					self.atomColorSet.disable();
					editor.styles.atoms_useJMOLColors = false;
					editor.styles.atoms_usePYMOLColors = false;
					self.buttonJmolColors.uncheck();
					self.buttonPymolColors.uncheck();
				}
				editor.updateScene();
				self.update(editor.styles);
			}, false);
		this.vdwToggle = new desktop.CheckBox(this.id + '_vdw_toggle', 'Use VDW Diameters', function() { editor.styles.atoms_useVDWDiameters_3D=!editor.styles.atoms_useVDWDiameters_3D;editor.updateScene();self.update(editor.styles); }, false);
		this.atomsNonBondedAsStarsToggle = new desktop.CheckBox(this.id + '_non_bonded_as_stars_toggle', 'Non-bonded as stars', function() { editor.styles.atoms_nonBondedAsStars_3D=!editor.styles.atoms_nonBondedAsStars_3D;editor.updateScene();self.update(editor.styles); }, false);
		this.displayLabelsToggle = new desktop.CheckBox(this.id + '_display_labels_toggle', 'Atom labels', function() { editor.styles.atoms_displayLabels_3D=!editor.styles.atoms_displayLabels_3D;editor.updateScene();self.update(editor.styles); }, false);
		
		//bonds
		this.bondsDisplayToggle = new desktop.CheckBox(this.id + '_bonds_display_toggle', 'Display bonds', function() { editor.styles.bonds_display=!editor.styles.bonds_display;editor.updateScene();self.update(editor.styles);}, true);
		this.bondcolor = new desktop.ColorPicker(this.id + '_bondcolor', 'Bond Color: ', function(hex) {editor.styles.bonds_color = hex;editor.setupScene();editor.repaint();self.update(editor.styles);});
		this.makeBondColorSet(this);
		this.bondColorSetToggle =  new desktop.CheckBox(this.id + '_bond_color_group_toggle', 'Color Schemes', function() { 
			if (self.buttonJmolBondColors.getElement().prop('disabled')) { 
				self.bondColorSet.enable(); 
				editor.styles.bonds_useJMOLColors = true;
			} else { 
				self.bondColorSet.disable();
				editor.styles.bonds_useJMOLColors = false;
				editor.styles.bonds_usePYMOLColors = false;
				self.buttonJmolBondColors.uncheck();
				self.buttonPymolBondColors.uncheck();
				
			} 
			editor.updateScene();
			self.update(editor.styles);
		}, false);
		this.bondOrderToggle = new desktop.CheckBox(this.id + '_bond_order_toggle', 'Show order', function() { editor.styles.bonds_showBondOrders_3D=!editor.styles.bonds_showBondOrders_3D;editor.updateScene();self.update(editor.styles); }, false);
		this.bondsRenderAsLinesToggle = new desktop.CheckBox(this.id + '_bonds_render_as_lines_toggle', 'Render as lines', function() { editor.styles.bonds_renderAsLines_3D=!editor.styles.bonds_renderAsLines_3D;editor.updateScene();self.update(editor.styles);}, false);
		
		// proteins
		this.ribbonsToggle = new desktop.CheckBox(this.id + '_ribbons_toggle', 'Ribbons', function() { editor.styles.proteins_displayRibbon=!editor.styles.proteins_displayRibbon;editor.updateScene();self.update(editor.styles); }, false);
		this.backboneToggle = new desktop.CheckBox(this.id + '_backbone_toggle', 'Backbone', function() { editor.styles.proteins_displayBackbone=!editor.styles.proteins_displayBackbone;editor.updateScene();self.update(editor.styles); }, false);
		this.pipeplankToggle = new desktop.CheckBox(this.id + '_pipeplank_toggle', 'Pipe and Plank', function() { editor.styles.proteins_displayPipePlank=!editor.styles.proteins_displayPipePlank;editor.updateScene();self.update(editor.styles); }, false);
		this.cartoonizeToggle = new desktop.CheckBox(this.id + '_cartoonize_toggle', 'Cartoonize', function() { editor.styles.proteins_ribbonCartoonize=!editor.styles.proteins_ribbonCartoonize;editor.updateScene();self.update(editor.styles); }, false);
		this.colorByChainToggle = new desktop.CheckBox(this.id + '_color_by_chain_toggle', 'Color by Chain', function() { editor.styles.macro_colorByChain=!editor.styles.macro_colorByChain;editor.updateScene();self.update(editor.styles); }, false);
		this.proteinColorToggle = new desktop.CheckBox(this.id + '_protein_color_toggle', 'Color by Segment', function() { 
			if (self.proteinColorToggle.checked) {
				editor.styles.proteins_residueColor = 'none';
				self.proteinColorToggle.uncheck();
				q('#proteinColors').prop('disabled', true);
			} else {
				self.proteinColorToggle.check();
				q('#proteinColors').removeAttr('disabled');
				editor.styles.proteins_residueColor = q('#proteinColors').val();
			}
			editor.updateScene();
			self.update(editor.styles);}, false);
		
		//nucleics
		this.nucleicAcidColorToggle = new desktop.CheckBox(this.id + '_nucleic_acid_color_toggle', 'Color by Segment', function() { 
			if (self.nucleicAcidColorToggle.checked) {
				editor.styles.nucleics_residueColor = 'none';
				self.nucleicAcidColorToggle.uncheck();
				q('#nucleicColors').prop('disabled', true);
			} else {
				self.nucleicAcidColorToggle.check();
				q('#nucleicColors').removeAttr('disabled');
				editor.styles.nucleics_residueColor = q('#nucleicColors').val();
			}
			editor.updateScene();
			self.update(editor.styles);}, false);
		
		// text
		//this.boldTextToggle = new desktop.CheckBox(this.id + '_bold_text_toggle', 'Bold', function() { editor.styles.text_font_bold=!editor.styles.text_font_bold;editor.updateScene();self.update(editor.styles); }, false);
		//this.italicTextToggle = new desktop.CheckBox(this.id + '_italic_text_toggle', 'Italic', function() { editor.styles.text_font_italics=!editor.styles.text_font_italics;editor.updateScene();self.update(editor.styles); }, false);
		
		// shapes
		this.shapecolor = new desktop.ColorPicker(this.id + '_shapecolor', 'Shape Color: ', function(hex) {editor.styles.shapes_color = hex;editor.setupScene();editor.repaint();self.update(editor.styles);});
		
		// compass
		this.displayCompassToggle = new desktop.CheckBox(this.id + '_display_compass_toggle', 'Display Compass', function() { 
			if (self.displayCompassToggle.checked) { 
				editor.styles.compass_display = false;
				editor.setupScene();
				editor.updateScene();
				self.compassPositionSet.disable();
				self.buttonCompassCorner.uncheck();
				self.displayCompassToggle.uncheck();
				self.update(editor.styles);
			} else { 
				editor.styles.compass_display = true;
				editor.styles.compass_type_3D = 0;
				editor.styles.compass_size_3D = 50;
				self.compassPositionSet.enable();
				self.displayCompassToggle.check();
				self.buttonCompassCorner.check();
				editor.setupScene();
				editor.updateScene();
				self.update(editor.styles);
			} 
		}, false);
		this.makeCompassPositionSet(this);
		//this.axisLabelsToggle = new desktop.CheckBox(this.id + '_axis_labels_toggle', 'Axis Labels', function() { editor.styles.compass_displayText_3D=!editor.styles.compass_displayText_3D;editor.updateScene();self.update(editor.styles); }, false);
		
		let sb = [];
		sb.push('<div style="font-size:12px;text-align:left;overflow-y:scroll;height:300px;" id="');
		sb.push(this.id);
		sb.push('" title="');
		sb.push(this.title);
		sb.push('">');
		if (this.message) {
			sb.push('<p>');
			sb.push(this.message);
			sb.push('</p>');
		}
		sb.push('<p><strong>Representation</strong>');
		sb.push('<p><select id="reps"><option value="Ball and Stick">Ball and Stick</option><option value="van der Waals Spheres">vdW Spheres</option><option value="Stick">Stick</option><option value="Wireframe">Wireframe</option><option value="Line">Line</option></select></p>');
		sb.push('<hr><strong>Canvas</strong>');
		sb.push(this.bgcolor.getSource());
		sb.push('<p>Projection: ');
		sb.push(this.projectionSet.getSource(this.id + '_projection_group'));
		sb.push('</p><p>Fog Mode: ');
		sb.push(this.fogModeSet.getSource(this.id + '_fog_mode_group'));
		sb.push(this.fogcolor.getSource());
		sb.push('</p><p>Fog start: <input type="number" id="fogstart" min="0" max="100" value="0"> %</p>');
		sb.push('</p><p>Fog end: <input type="number" id="fogend" min="0" max="100" value="100"> %</p>');
		sb.push('</p><p>Fog density: <input type="number" id="fogdensity" min="0" max="100" value="100"> %</p>');
		sb.push('<hr><strong>Atoms</strong><p>');
		sb.push(this.atomsDisplayToggle.getSource());
		sb.push('</p><p>');
		sb.push(this.atomcolor.getSource());
		sb.push('</p><p>Sphere diameter: <input type="number" id="spherediameter" min="0" max="40" value="0.8" step="0.01"> Angstroms</p>');
		sb.push(this.vdwToggle.getSource());
		sb.push('</p><p>VDW Multiplier: <input type="number" id="vdwMultiplier" min="0" max="100" value="100"> %</p>');
		sb.push(this.atomsNonBondedAsStarsToggle.getSource());
		sb.push('</p><p>');
		sb.push(this.displayLabelsToggle.getSource());
		sb.push('</p><p>');
		sb.push(this.atomColorSetToggle.getSource());
		sb.push(': ');
		sb.push(this.atomColorSet.getSource(this.id + '_atom_color_group'));
		sb.push('</p><hr><strong>Bonds</strong><p>');
		sb.push(this.bondsDisplayToggle.getSource());
		sb.push('</p><p>');
		sb.push(this.bondcolor.getSource());
		sb.push(this.bondColorSetToggle.getSource());
		sb.push(': ');
		sb.push(this.bondColorSet.getSource(this.id + '_bond_color_group'));
		sb.push('</p><p>');
		sb.push(this.bondOrderToggle.getSource());
		sb.push('</p><p>Cylinder diameter: <input type="number" id="cylinderdiameter" min="0" max="40" value="0.3" step="0.01"> Angstroms</p>');
		sb.push('</p><hr><strong>Proteins</strong>');
		sb.push('<p>');
		sb.push(this.ribbonsToggle.getSource());
		sb.push('</p><p>');
		sb.push(this.backboneToggle.getSource());
		sb.push('</p><p>');
		sb.push(this.pipeplankToggle.getSource());
		sb.push('</p><p>');
		sb.push(this.cartoonizeToggle.getSource());
		sb.push('</p><p>');
		sb.push(this.colorByChainToggle.getSource());
		sb.push('</p><p>');
		sb.push(this.proteinColorToggle.getSource());
		sb.push('<select id="proteinColors" disabled><option value="amino">Amino</option><option value="shapely">Shapely</option><option value="polarity">Polarity</option><option value="rainbow">Rainbow</option><option value="acidity">Acidity</option></select></p>');
		sb.push('<hr><strong>Nucleic Acids</strong><p>');
		sb.push(this.nucleicAcidColorToggle.getSource());
		sb.push(': ');
		sb.push('<select id="nucleicColors" disabled><option value="shapely">Shapely</option><option value="rainbow">Rainbow</option></select></p>');
		//sb.push('<hr><strong>Text</strong>');
		//sb.push('<p><table style="font-size:12px;text-align:left;border-spacing:0px"><tr><td><p>Text Color: </p></td><td><input id="textcolor" name="textcolor" class="simple_color" value="#000000" /></td></tr></table></p>');
		//sb.push('<p>Font Styles: ');
		//sb.push(this.boldTextToggle.getSource());
		//sb.push(this.italicTextToggle.getSource());
		//sb.push('</p>');
		sb.push('<hr><strong>Shapes</strong><p>');
		sb.push(this.shapecolor.getSource());
		sb.push('</p><hr><strong>Compass</strong>');
		sb.push('<p>');
		sb.push(this.displayCompassToggle.getSource());
		sb.push(': ');
		sb.push(this.compassPositionSet.getSource(this.id + '_compass_position_group'));
		//sb.push('</p><p>');
		sb.push('</p>');
		//sb.push(this.axisLabelsToggle.getSource());
		//sb.push('</p><table style="font-size:12px;text-align:left;border-spacing:0px"><tr><td>Axis Colors: </td><td><label for="xaxis">X</label></td><td><input id="xaxis" name="xaxis" class="simple_color" value="#FF0000" /></td><td><label for="yaxis">Y</label></td><td><input id="yaxis" name="yaxis" class="simple_color" value="#00FF00" /></td><td><label for="zaxis">Z</label></td><td><input id="zaxis" name="zaxis" class="simple_color" value="#0000FF" /></td></tr></table>');
		sb.push('</div>');
		if (this.afterMessage) {
			sb.push('<p>');
			sb.push(this.afterMessage);
			sb.push('</p>');
		}
		document.writeln(sb.join(''));
		this.getElement().dialog({
			autoOpen : false,
			position : {my: "center", at:"center", of:document },
			buttons : self.buttons,
			width : 500,
			height: 300,
			open : function(event, ui) {
				q(this).height(300);
				q(this).width(478);
				q(this).dialog('option', 'position', 'center');
			}
		});
		this.bgcolor.setup();
		this.fogcolor.setup();
		this.atomcolor.setup();
		this.bondcolor.setup();
		this.shapecolor.setup();	
		q('#reps').change(function() {
			let i = this.selectedIndex;
			let ops = this.options;
			editor.styles.set3DRepresentation(ops[i].value);
			editor.updateScene();
			self.update(editor.styles);
		});
		q('#proteinColors').change(function() {
			let i = this.selectedIndex;
			switch(i) {
			case 0:
				editor.styles.proteins_residueColor = 'amino';
				break;
			case 1:
				editor.styles.proteins_residueColor = 'shapely';
				break;
			case 2:
				editor.styles.proteins_residueColor = 'polarity';
				break;
			case 3:
				editor.styles.proteins_residueColor = 'rainbow';
				break;
			case 4:
				editor.styles.proteins_residueColor = 'acidity';
				break;
			}
				
			editor.updateScene();
			self.update(editor.styles);
		});
		q('#nucleicColors').change(function() {
			let i = this.selectedIndex;
			switch(i) {
			case 0:
				editor.styles.nucleics_residueColor = 'shapely';
				break;
			case 1:
				editor.styles.nucleics_residueColor = 'rainbow';
				break;
			}
				
			editor.updateScene();
			self.update(editor.styles);
		});
		
		q('#fogstart').change(function() {
			editor.styles.fog_start_3D = parseInt(this.value)/100;
			editor.updateScene();
		});
		q('#fogend').change(function() {
			editor.styles.fog_end_3D = parseInt(this.value)/100;
			editor.updateScene();
		});
		q('#fogdensity').change(function() {
			editor.styles.fog_density_3D = parseInt(this.value)/100;
			editor.updateScene();
		});
		q('#vdwMultiplier').change(function() {
			editor.styles.atoms_vdwMultiplier_3D = parseInt(this.value)/100;
			editor.updateScene();
		});
		q('#spherediameter').change(function() {
			editor.styles.atoms_sphereDiameter_3D = parseFloat(this.value);
			editor.updateScene();
		});
		q('#cylinderdiameter').change(function() {
			editor.styles.bonds_cylinderDiameter_3D = parseFloat(this.value);
			editor.updateScene();
		});
		
		this.projectionSet.setup();
		this.fogModeSet.setup();
		this.atomsDisplayToggle.setup();
		this.vdwToggle.setup();
		this.atomsNonBondedAsStarsToggle.setup();
		this.displayLabelsToggle.setup();
		this.atomColorSet.setup();
		this.atomColorSet.disable();
		this.atomColorSetToggle.setup();
		this.bondsDisplayToggle.setup();
		this.bondColorSet.setup();
		this.bondColorSet.disable();
		this.bondColorSetToggle.setup();
		this.bondOrderToggle.setup();
		this.ribbonsToggle.setup();
		this.backboneToggle.setup();
		this.pipeplankToggle.setup();
		this.cartoonizeToggle.setup();
		this.colorByChainToggle.setup();
		this.proteinColorToggle.setup();
		this.nucleicAcidColorToggle.setup();
		//this.boldTextToggle.setup();
		//this.italicTextToggle.setup();
		this.displayCompassToggle.setup();
		this.compassPositionSet.setup();
		this.compassPositionSet.disable();
		//this.axisLabelsToggle.setup();
	};
	_.update = function(styles){
		this.bgcolor.setColor(styles.backgroundColor);
		this.fogcolor.setColor(styles.fog_color_3D);
		this.atomcolor.setColor(styles.atoms_color);
		this.bondcolor.setColor(styles.bonds_color);
		this.shapecolor.setColor(styles.shapes_color);
		if (styles.projectionPerspective_3D) {
			this.buttonPerspective.select();
		} else {
			this.buttonOrthographic.select();
		}
		switch(styles.fog_mode_3D) {
		case 1:
			this.buttonFogMode0.uncheck();
			this.buttonFogMode1.check();
			this.buttonFogMode2.uncheck();
			this.buttonFogMode3.uncheck();
			break;
		case 2:
			this.buttonFogMode0.uncheck();
			this.buttonFogMode1.uncheck();
			this.buttonFogMode2.check();
			this.buttonFogMode3.uncheck();
			break;
		case 3:
			this.buttonFogMode0.uncheck();
			this.buttonFogMode1.uncheck();
			this.buttonFogMode2.uncheck();
			this.buttonFogMode3.check();
			break;
		default:
			this.buttonFogMode0.check();
			this.buttonFogMode1.uncheck();
			this.buttonFogMode2.uncheck();
			this.buttonFogMode3.uncheck();
			break;
		}
		q('#fogstart').val(styles.fog_start_3D * 100);
		q('#fogend').val(styles.fog_end_3D * 100);
		q('#fogdensity').val(styles.fog_density_3D * 100);
		if (styles.atoms_display) {
			this.atomsDisplayToggle.check();
		} else {
			this.atomsDisplayToggle.uncheck();
		}
		if (styles.atoms_useVDWDiameters_3D) {
			this.vdwToggle.check();
			q('#spherediameter').prop('disabled', true);
			q('#vdwMultiplier').prop('disabled', false);
			q('#vdwMultiplier').val(styles.atoms_vdwMultiplier_3D * 100);
		} else {
			this.vdwToggle.uncheck();
			q('#spherediameter').prop('disabled', false);
			q('#spherediameter').val(styles.atoms_sphereDiameter_3D);
			q('#vdwMultiplier').prop('disabled', true);
		}
		if (styles.atoms_useJMOLColors || styles.atoms_usePYMOLColors) {
			this.atomColorSetToggle.check();
			this.atomColorSet.enable();
			if (styles.atoms_useJMOLColors) {
				this.buttonJmolColors.check();
				this.buttonPymolColors.uncheck();
			} else if (styles.atoms_usePYMOLColors) {
				this.buttonJmolColors.uncheck();
				this.buttonPymolColors.check();
			}
		} else {
			this.atomColorSetToggle.uncheck();
			this.buttonPymolColors.uncheck();
			this.buttonJmolColors.uncheck();
			this.atomColorSet.disable();
		}
		if (styles.atoms_nonBondedAsStars_3D) {
			this.atomsNonBondedAsStarsToggle.check();
		} else {
			this.atomsNonBondedAsStarsToggle.uncheck();
		}
		if (styles.atoms_displayLabels_3D) {
			this.displayLabelsToggle.check();
		} else {
			this.displayLabelsToggle.uncheck();
		}
		if (styles.bonds_display) {
			this.bondsDisplayToggle.check();
		} else {
			this.bondsDisplayToggle.uncheck();
		}
		if (styles.bonds_useJMOLColors || styles.bonds_usePYMOLColors) {
			this.bondColorSetToggle.check();
			this.bondColorSet.enable();
			if (styles.bonds_useJMOLColors) {
				this.buttonJmolBondColors.check();
				this.buttonPymolBondColors.uncheck();
			} else if (styles.atoms_usePYMOLColors) {
				this.buttonJmolBondColors.uncheck();
				this.buttonPymolBondColors.check();
			}
		} else {
			this.bondColorSetToggle.uncheck();
			this.buttonPymolBondColors.uncheck();
			this.buttonJmolBondColors.uncheck();
			this.bondColorSet.disable();
		}
		if (styles.bonds_showBondOrders_3D) {
			this.bondOrderToggle.check();
		} else {
			this.bondOrderToggle.uncheck();
		}
		q('#cylinderdiameter').val(styles.bonds_cylinderDiameter_3D);
		if (styles.proteins_displayRibbon) {
			this.ribbonsToggle.check();
		} else {
			this.ribbonsToggle.uncheck();
		}
		if (styles.proteins_displayBackbone) {
			this.backboneToggle.check();
		} else {
			this.backboneToggle.uncheck();
		}
		if (styles.proteins_displayPipePlank) {
			this.pipeplankToggle.check();
		} else {
			this.pipeplankToggle.uncheck();
		}
		if (styles.proteins_ribbonCartoonize) {
			this.cartoonizeToggle.check();
		} else {
			this.cartoonizeToggle.uncheck();
		}
		if (styles.macro_colorByChain) {
			this.colorByChainToggle.check();
		} else {
			this.colorByChainToggle.uncheck();
		}
		switch (styles.proteins_residueColor) {
		case 'amino':
			this.proteinColorToggle.check();
			q('#proteinColors').val('amino');
			break;
		case 'shapely':
			this.proteinColorToggle.check();
			q('#proteinColors').val('shapely');
			break;
		case 'polarity':
			this.proteinColorToggle.check();
			q('#proteinColors').val('polarity');
			break;
		case 'rainbow':
			this.proteinColorToggle.check();
			q('#proteinColors').val('rainbow');
			break;
		case 'acidity':
			this.proteinColorToggle.check();
			q('#proteinColors').val('acidity');
			break;
		case 'none':
		default:
			this.proteinColorToggle.uncheck();
			q('#proteinColors').prop('disabled', true);
			break;
		}
		switch (styles.nucleics_residueColor) {
		case 'shapely':
			this.nucleicAcidColorToggle.check();
			q('#nucleicColors').val('shapely');
			break;
		case 'rainbow':
			this.nucleicAcidColorToggle.check();
			q('#nucleicColors').val('rainbow');
			break;
		case 'none':
		default:
			this.nucleicAcidColorToggle.uncheck();
			q('#nucleicColors').prop('disabled', true);
			break;
		}
		/*
		if (styles.text_font_bold) {
			this.boldTextToggle.check();
		}
		if (styles.text_font_italic) {
			this.italicTextToggle.check();
		}*/
		if (styles.compass_display == true) {
			this.compassPositionSet.enable();
			if (styles.compass_type_3D == 0) {
				this.buttonCompassCorner.check();
				this.buttonCompassOrigin.uncheck();
			} else {
				this.buttonCompassOrigin.check();
				this.buttonCompassCorner.uncheck();
			}
		} else {
			this.compassPositionSet.disable();
			this.buttonCompassCorner.uncheck();
			this.buttonCompassOrigin.uncheck();
		}
		/*if (styles.compass_display_text_3D) {
			this.axisLabelsToggle.check();
		} else {
			this.axisLabelsToggle.uncheck();
		} */
	};

})(ChemDoodle, ChemDoodle.uis.gui.desktop, ChemDoodle.lib.jQuery, document);

(function (c, featureDetection, d3, sketcherPack, structures, tools, q, m, m4, window, undefined) {
	'use strict';
	c.EditorCanvas3D = function (id, width, height, options) {
		// keep checks to undefined here as these are booleans
		this.isMobile = options.isMobile === undefined ? featureDetection.supports_touch() : options.isMobile;
		this.useServices = options.useServices === undefined ? false : options.useServices;
		this.includeToolbar = options.includeToolbar === undefined ? true : options.includeToolbar;
		this.oneMolecule = true;
		// toolbar manager needs the editor id to make it unique to this
		// canvas
		this.id = id;
		this.toolbarManager = new sketcherPack.gui.ToolbarManager3D(this);
		if (this.includeToolbar) {
			this.toolbarManager.write();
			// If pre-created, wait until the last button image loads before
			// calling setup.
			let self = this;
			if (document.getElementById(this.id)) {
				q('#' + id + '_button_calculate').load(function () {
					self.toolbarManager.setup();
				});
			} else {
				q(window).load(function () {
					self.toolbarManager.setup();
				});
			}
			this.dialogManager = new sketcherPack.gui.DialogManager(this);
		}
		this.stateManager = new sketcherPack.states.StateManager3D(this);
		this.historyManager = new sketcherPack.actions.HistoryManager(this);
		if (id) {
			this.create(id, width, height);
		}
		// styles for draw "help" atom
		let helpSpecs = new structures.Styles();
		helpSpecs.atoms_useVDWDiameters_3D = false;
		helpSpecs.atoms_sphereDiameter_3D = 2;
		this.helpButton = new structures.Atom('C', 0, 0, 0);
		this.helpButton.isHover = true;
		this.helpButton.styles = helpSpecs;
		this.styles.backgroundColor = '#000';
		this.styles.shapes_color = '#fff';
		this.isHelp = false;
		this.setupScene();
		this.repaint();
	};
	let _ = c.EditorCanvas3D.prototype = new c._Canvas3D();
	// saves of default behavior
	_.defaultmousedown = _.mousedown;
	_.defaultmouseup = _.mouseup;
	_.defaultrightmousedown = _.rightmousedown;
	_.defaultdrag = _.drag;
	_.defaultmousewheel = _.mousewheel;
	_.drawChildExtras = function (gl) {

		// NOTE: gl and this.gl is same object because "EditorCanvas3D" inherit
		// from "_Canvas3D"

		gl.disable(gl.DEPTH_TEST);

		let translationMatrix = m4.create();

		let height = this.height / 20;
		let tanTheta = m.tan(this.styles.projectionPerspectiveVerticalFieldOfView_3D / 360 * m.PI);
		let depth = height / tanTheta;
		let near = m.max(depth - height, 0.1);
		let far = depth + height;
		let aspec = this.width / this.height;

		let nearRatio = depth / this.height * tanTheta;
		let top = tanTheta * depth;
		let bottom = -top;
		let left = aspec * bottom;
		let right = aspec * top;

		let projectionMatrix = m4.ortho(left, right, bottom, top, near, far, []);

		this.phongShader.useShaderProgram(gl);

		this.phongShader.setProjectionMatrix(gl, projectionMatrix);

		this.phongShader.setFogMode(gl, 0);

		if (!this.hideHelp) {
			// help and tutorial

			let posX = (this.width - 40) * nearRatio;
			let posY = (this.height - 40) * nearRatio;

			m4.translate(m4.identity([]), [posX, posY, -depth], translationMatrix);

			// setting "help" button color
			gl.material.setTempColors(gl, this.styles.bonds_materialAmbientColor_3D, undefined, this.styles.bonds_materialSpecularColor_3D, this.styles.bonds_materialShininess_3D);
			gl.material.setDiffuseColor(gl, '#00ff00');

			// this "gl.modelViewMatrix" must be set because it used by Atom
			// when rendered
			gl.modelViewMatrix = m4.multiply(translationMatrix, gl.rotationMatrix, []);

			this.phongShader.enableAttribsArray(gl);

			gl.sphereBuffer.bindBuffers(this.gl);
			this.helpButton.render(gl, undefined, true);
			if (this.isHelp) {
				gl.sphereBuffer.bindBuffers(gl);
				// colors
				gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
				gl.material.setTempColors(gl, '#000000', undefined, '#000000', 0);
				gl.enable(gl.BLEND);
				gl.depthMask(false);
				gl.material.setAlpha(gl, .4);
				this.helpButton.renderHighlight(gl, undefined);
				gl.depthMask(true);
				gl.disable(gl.BLEND);
				gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
			}

			this.phongShader.disableAttribsArray(gl);

			gl.flush();

			// enable blend and depth mask set to false
			gl.enable(gl.BLEND);
			gl.depthMask(false);

			this.labelShader.useShaderProgram(gl);
			this.labelShader.setProjectionMatrix(gl, projectionMatrix);

			this.textTextImage.updateFont(this.gl, 14.1, ['sans-serif'], false, false, true);

			let modelMatrix = m4.multiply(translationMatrix, m4.identity([]), []);
			this.labelShader.setModelViewMatrix(gl, modelMatrix);

			this.labelShader.enableAttribsArray(gl);

			this.renderText('?', [0, 0, 0]);

			this.labelShader.disableAttribsArray(gl);

			// disable blend and depth mask set to true
			gl.disable(gl.BLEND);
			gl.depthMask(true);
		}

		if (!this.paidToHideTrademark) {
			// You must keep this name displayed at all times to abide by the license
			// Contact us for permission to remove it,
			// http://www.ichemlabs.com/contact-us
			let x = '\x43\x68\x65\x6D\x44\x6F\x6F\x64\x6C\x65';

			// enable blend for transparancy
			gl.enable(this.gl.BLEND);

			this.labelShader.useShaderProgram(gl);
			this.labelShader.setProjectionMatrix(gl, projectionMatrix);

			this.labelShader.enableAttribsArray(gl);
			// Draw the copyright logo and trademark
			this.textTextImage.updateFont(gl, 14.1, ['sans-serif'], false, false, true);

			let width = this.textTextImage.textWidth(x)/this.pixelRatio;

			let posX = (this.width - width - 30) * nearRatio;
			let posY = (-this.height + 24) * nearRatio;

			m4.translate(m4.identity([]), [posX, posY, -depth], translationMatrix);
			let modelMatrix = m4.multiply(translationMatrix, gl.rotationMatrix, []);
			this.labelShader.setModelViewMatrix(gl, modelMatrix);

			this.renderText(x, [0, 0, 0]);

			// Draw the (R) part
			posX = (this.width - 18) * nearRatio;
			posY = (-this.height + 30) * nearRatio;

			m4.translate(m4.identity([]), [posX, posY, -depth], translationMatrix);
			modelMatrix = m4.multiply(translationMatrix, gl.rotationMatrix, []);
			this.labelShader.setModelViewMatrix(gl, modelMatrix);

			this.textTextImage.updateFont(gl, 10, ['sans-serif'], false, false, true);

			this.renderText('\u00AE', [0, 0, 0]);

			// disable vertex for draw text
			this.labelShader.disableAttribsArray(gl);

			// disable blend
			gl.disable(gl.BLEND);
			gl.flush();
		}

		gl.enable(gl.DEPTH_TEST);
	};
	_.checksOnAction = function (force) {
		// using force improves efficiency, so changes will not be checked
		// until a render occurs
		// you can force a check by sending true to this function after
		// calling check with a false
		if (force && this.doChecks) {

		}
		this.doChecks = !force;
	};
	// desktop events
	_.click = function (e) {
		this.stateManager.getCurrentState().click(e);
	};
	_.rightclick = function (e) {
		this.stateManager.getCurrentState().rightclick(e);
	};
	_.dblclick = function (e) {
		this.stateManager.getCurrentState().dblclick(e);
	};
	_.mousedown = function (e) {
		this.stateManager.getCurrentState().mousedown(e);
	};
	_.rightmousedown = function (e) {
		this.stateManager.getCurrentState().rightmousedown(e);
	};
	_.mousemove = function (e) {
		this.isHelp = false;
		if (e.p.distance(new structures.Point(this.width - 20, 20)) < 10) {
			this.isHelp = true;
		}
		this.stateManager.getCurrentState().mousemove(e);
	};
	_.mouseout = function (e) {
		this.stateManager.getCurrentState().mouseout(e);
	};
	_.mouseover = function (e) {
		this.stateManager.getCurrentState().mouseover(e);
	};
	_.mouseup = function (e) {
		this.stateManager.getCurrentState().mouseup(e);
	};
	_.rightmouseup = function (e) {
		this.stateManager.getCurrentState().rightmouseup(e);
	};
	_.mousewheel = function (e, delta) {
		this.stateManager.getCurrentState().mousewheel(e, delta);
	};
	_.drag = function (e) {
		this.stateManager.getCurrentState().drag(e);
	};
	_.keydown = function (e) {
		this.stateManager.getCurrentState().keydown(e);
	};
	_.keypress = function (e) {
		this.stateManager.getCurrentState().keypress(e);
	};
	_.keyup = function (e) {
		this.stateManager.getCurrentState().keyup(e);
	};

})(ChemDoodle, ChemDoodle.featureDetection, ChemDoodle.structures.d3, ChemDoodle.uis, ChemDoodle.structures, ChemDoodle.uis.tools, ChemDoodle.lib.jQuery, Math, ChemDoodle.lib.mat4, window);
