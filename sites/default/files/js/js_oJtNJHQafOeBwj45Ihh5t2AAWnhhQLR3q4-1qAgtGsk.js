Drupal.locale = { 'pluralFormula': function ($n) { return Number(($n!=1)); }, 'strings': {"":{"An AJAX HTTP error occurred.":"Se produjo un error HTTP AJAX.","HTTP Result Code: !status":"C\u00f3digo de Resultado HTTP: !status","An AJAX HTTP request terminated abnormally.":"Una solicitud HTTP de AJAX termin\u00f3 de manera anormal.","Debugging information follows.":"A continuaci\u00f3n se detalla la informaci\u00f3n de depuraci\u00f3n.","Path: !uri":"Ruta: !uri","StatusText: !statusText":"StatusText: !statusText","ResponseText: !responseText":"ResponseText: !responseText","ReadyState: !readyState":"ReadyState: !readyState","Hide":"Ocultar","Show":"Mostrar","Re-order rows by numerical weight instead of dragging.":"Reordenar las filas por peso num\u00e9rico en lugar de arrastrar.","Show row weights":"Mostrar pesos de la fila","Hide row weights":"Ocultar pesos de la fila","Drag to re-order":"Arrastre para reordenar","Changes made in this table will not be saved until the form is submitted.":"Los cambios realizados en esta tabla no se guardar\u00e1n hasta que se env\u00ede el formulario","Not restricted":"Sin restricci\u00f3n","Restricted to certain pages":"Restringido a algunas p\u00e1ginas","Not customizable":"No personalizable","The changes to these blocks will not be saved until the \u003Cem\u003ESave blocks\u003C\/em\u003E button is clicked.":"Los cambios sobre estos bloques no se guardar\u00e1n hasta que no pulse el bot\u00f3n \u003Cem\u003EGuardar bloques\u003C\/em\u003E.","The block cannot be placed in this region.":"El bloque no se puede colocar en esta regi\u00f3n.","Configure":"Configurar","Please wait...":"Espere, por favor...","OK":"OK","(active tab)":"(solapa activa)","Autocomplete popup":"Ventana emergente con autocompletado","Searching for matches...":"Buscando coincidencias","Edit":"Editar","Hide summary":"Ocultar resumen","Edit summary":"Editar resumen","Not in menu":"No est\u00e1 en un men\u00fa","New revision":"Nueva revisi\u00f3n","No revision":"Sin revisi\u00f3n","By @name on @date":"Por @name en @date","By @name":"Por @name","Not published":"No publicado","Alias: @alias":"Alias: @alias","No alias":"Sin alias","@number comments per page":"@number comentarios por p\u00e1gina","The selected file %filename cannot be uploaded. Only files with the following extensions are allowed: %extensions.":"El archivo seleccionado %filename no puede ser subido. Solo se permiten archivos con las siguientes extensiones: %extensions.","Select all rows in this table":"Seleccionar todas las filas de esta tabla","Deselect all rows in this table":"Quitar la selecci\u00f3n a todas las filas de esta tabla","Add":"Agregar","Requires a title":"Necesita un t\u00edtulo","Don\u0027t display post information":"No mostrar informaci\u00f3n del env\u00edo","All":"Todo","CustomMessage: !customMessage":"CustomMessage: !customMessage","The response failed verification so will not be processed.":"La respuesta de verificaci\u00f3n fall\u00f3 por lo que no ser\u00e1 procesado.","The callback URL is not local and not trusted: !url":"La URL de llamada no es local y no es confiable: !url","none":"ninguno"}} };;
(function ($) {

/**
 * Toggle the visibility of a fieldset using smooth animations.
 */
Drupal.toggleFieldset = function (fieldset) {
  var $fieldset = $(fieldset);
  if ($fieldset.is('.collapsed')) {
    var $content = $('> .fieldset-wrapper', fieldset).hide();
    $fieldset
      .removeClass('collapsed')
      .trigger({ type: 'collapsed', value: false })
      .find('> legend span.fieldset-legend-prefix').html(Drupal.t('Hide'));
    $content.slideDown({
      duration: 'fast',
      easing: 'linear',
      complete: function () {
        Drupal.collapseScrollIntoView(fieldset);
        fieldset.animating = false;
      },
      step: function () {
        // Scroll the fieldset into view.
        Drupal.collapseScrollIntoView(fieldset);
      }
    });
  }
  else {
    $fieldset.trigger({ type: 'collapsed', value: true });
    $('> .fieldset-wrapper', fieldset).slideUp('fast', function () {
      $fieldset
        .addClass('collapsed')
        .find('> legend span.fieldset-legend-prefix').html(Drupal.t('Show'));
      fieldset.animating = false;
    });
  }
};

/**
 * Scroll a given fieldset into view as much as possible.
 */
Drupal.collapseScrollIntoView = function (node) {
  var h = document.documentElement.clientHeight || document.body.clientHeight || 0;
  var offset = document.documentElement.scrollTop || document.body.scrollTop || 0;
  var posY = $(node).offset().top;
  var fudge = 55;
  if (posY + node.offsetHeight + fudge > h + offset) {
    if (node.offsetHeight > h) {
      window.scrollTo(0, posY);
    }
    else {
      window.scrollTo(0, posY + node.offsetHeight - h + fudge);
    }
  }
};

Drupal.behaviors.collapse = {
  attach: function (context, settings) {
    $('fieldset.collapsible', context).once('collapse', function () {
      var $fieldset = $(this);
      // Expand fieldset if there are errors inside, or if it contains an
      // element that is targeted by the URI fragment identifier.
      var anchor = location.hash && location.hash != '#' ? ', ' + location.hash : '';
      if ($fieldset.find('.error' + anchor).length) {
        $fieldset.removeClass('collapsed');
      }

      var summary = $('<span class="summary"></span>');
      $fieldset.
        bind('summaryUpdated', function () {
          var text = $.trim($fieldset.drupalGetSummary());
          summary.html(text ? ' (' + text + ')' : '');
        })
        .trigger('summaryUpdated');

      // Turn the legend into a clickable link, but retain span.fieldset-legend
      // for CSS positioning.
      var $legend = $('> legend .fieldset-legend', this);

      $('<span class="fieldset-legend-prefix element-invisible"></span>')
        .append($fieldset.hasClass('collapsed') ? Drupal.t('Show') : Drupal.t('Hide'))
        .prependTo($legend)
        .after(' ');

      // .wrapInner() does not retain bound events.
      var $link = $('<a class="fieldset-title" href="#"></a>')
        .prepend($legend.contents())
        .appendTo($legend)
        .click(function () {
          var fieldset = $fieldset.get(0);
          // Don't animate multiple times.
          if (!fieldset.animating) {
            fieldset.animating = true;
            Drupal.toggleFieldset(fieldset);
          }
          return false;
        });

      $legend.append(summary);
    });
  }
};

})(jQuery);
;
/*jslint devel: true, bitwise: true, regexp: true, browser: true, confusion: true, unparam: true, eqeq: true, white: true, nomen: true, plusplus: true, maxerr: 50, indent: 4 */
/*globals jQuery,Color */

/*!
 * ColorPicker
 *
 * Copyright (c) 2011-2013 Martijn W. van der Lee
 * Licensed under the MIT.
 */
/* Full-featured colorpicker for jQueryUI with full theming support.
 * Most images from jPicker by Christopher T. Tillman.
 * Sourcecode created from scratch by Martijn W. van der Lee.
 */

;(function ($) {
	"use strict";

	var _colorpicker_index = 0,

		_container_popup = '<div class="ui-colorpicker ui-colorpicker-dialog ui-dialog ui-widget ui-widget-content ui-corner-all" style="display: none;"></div>',
		_container_inlineFrame = '<div class="ui-colorpicker ui-colorpicker-inline ui-dialog ui-widget ui-widget-content ui-corner-all"></div>',
		_container_inline = '<div class="ui-colorpicker ui-colorpicker-inline"></div>',

		_intToHex = function (dec) {
			var result = Math.floor(dec).toString(16);
			if (result.length === 1) {
				result = ('0' + result);
			}
			return result.toLowerCase();
		},

        _parseHex = function(color) {
            var c,
                m;

            // {#}rrggbb
            m = /^#?([a-fA-F0-9]{1,6})$/.exec(color);
            if (m) {
                c = parseInt(m[1], 16);
                return new $.colorpicker.Color(
					((c >> 16) & 0xFF) / 255,
                    ((c >>  8) & 0xFF) / 255,
                    (c & 0xFF) / 255
				);
            }

            return new $.colorpicker.Color();
        },

		_layoutTable = function(layout, callback) {
			var bitmap,
				x, y,
				width, height,
				columns, rows,
				index,
				cell,
				html,
				w, h,
				colspan,
				walked;

			layout.sort(function(a, b) {
				if (a.pos[1] === b.pos[1]) {
					return a.pos[0] - b.pos[0];
				}
				return a.pos[1] - b.pos[1];
			});

			// Determine dimensions of the table
			width = 0;
			height = 0;
			$.each (layout, function(index, part) {
				width = Math.max(width, part.pos[0] + part.pos[2]);
				height = Math.max(height, part.pos[1] + part.pos[3]);
			});

			// Initialize bitmap
			bitmap = [];
			for (x = 0; x < width; ++x) {
				bitmap.push([]);
			}

			// Mark rows and columns which have layout assigned
			rows	= [];
			columns = [];
			$.each(layout, function(index, part) {
				// mark columns
				for (x = 0; x < part.pos[2]; x += 1) {
					columns[part.pos[0] + x] = true;
				}
				for (y = 0; y < part.pos[3]; y += 1) {
					rows[part.pos[1] + y] = true;
				}
			});

			// Generate the table
			html = '';
			cell = layout[index = 0];
			for (y = 0; y < height; ++y) {
				html += '<tr>';
                x = 0;
                while (x < width) {
					if (typeof cell !== 'undefined' && x === cell.pos[0] && y === cell.pos[1]) {
						// Create a "real" cell
						html += callback(cell, x, y);

						for (h = 0; h < cell.pos[3]; h +=1) {
							for (w = 0; w < cell.pos[2]; w +=1) {
								bitmap[x + w][y + h] = true;
							}
						}

						x += cell.pos[2];
						cell = layout[++index];
					} else {
						// Fill in the gaps
						colspan = 0;
						walked = false;

						while (x < width && bitmap[x][y] === undefined && (cell === undefined || y < cell.pos[1] || (y === cell.pos[1] && x < cell.pos[0]))) {
							if (columns[x] === true) {
								colspan += 1;
							}
							walked = true;
							x += 1;
						}

						if (colspan > 0) {
							html += '<td colspan="'+colspan+'"></td>';
						} else if (!walked) {
							x += 1;
						}
					}
				}
				html += '</tr>';
			}

			return '<table cellspacing="0" cellpadding="0" border="0"><tbody>' + html + '</tbody></table>';
		};

	$.colorpicker = new function() {
		this.regional = {
			'':	{
				ok:				'OK',
				cancel:			'Cancel',
				none:			'None',
				button:			'Color',
				title:			'Pick a color',
				transparent:	'Transparent',
				hsvH:			'H',
				hsvS:			'S',
				hsvV:			'V',
				rgbR:			'R',
				rgbG:			'G',
				rgbB:			'B',
				labL:			'L',
				labA:			'a',
				labB:			'b',
				hslH:			'H',
				hslS:			'S',
				hslL:			'L',
				cmykC:			'C',
				cmykM:			'M',
				cmykY:			'Y',
				cmykK:			'K',
				alphaA:			'A'
			}
		};

		this.swatches = {
			'html':	[
				{name: 'black',					r: 0, g: 0, b: 0},
				{name: 'dimgray',				r: 0.4117647058823529, g: 0.4117647058823529, b: 0.4117647058823529},
				{name: 'gray',					r: 0.5019607843137255, g: 0.5019607843137255, b: 0.5019607843137255},
				{name: 'darkgray',				r: 0.6627450980392157, g: 0.6627450980392157, b: 0.6627450980392157},
				{name: 'silver',				r: 0.7529411764705882, g: 0.7529411764705882, b: 0.7529411764705882},
				{name: 'lightgrey',				r: 0.8274509803921568, g: 0.8274509803921568, b: 0.8274509803921568},
				{name: 'gainsboro',				r: 0.8627450980392157, g: 0.8627450980392157, b: 0.8627450980392157},
				{name: 'whitesmoke',			r: 0.9607843137254902, g: 0.9607843137254902, b: 0.9607843137254902},
				{name: 'white',					r: 1, g: 1, b: 1},
				{name: 'rosybrown',				r: 0.7372549019607844, g: 0.5607843137254902, b: 0.5607843137254902},
				{name: 'indianred',				r: 0.803921568627451, g: 0.3607843137254902, b: 0.3607843137254902},
				{name: 'brown',					r: 0.6470588235294118, g: 0.16470588235294117, b: 0.16470588235294117},
				{name: 'firebrick',				r: 0.6980392156862745, g: 0.13333333333333333, b: 0.13333333333333333},
				{name: 'lightcoral',			r: 0.9411764705882353, g: 0.5019607843137255, b: 0.5019607843137255},
				{name: 'maroon',				r: 0.5019607843137255, g: 0, b: 0},
				{name: 'darkred',				r: 0.5450980392156862, g: 0, b: 0},
				{name: 'red',					r: 1, g: 0, b: 0},
				{name: 'snow',					r: 1, g: 0.9803921568627451, b: 0.9803921568627451},
				{name: 'salmon',				r: 0.9803921568627451, g: 0.5019607843137255, b: 0.4470588235294118},
				{name: 'mistyrose',				r: 1, g: 0.8941176470588236, b: 0.8823529411764706},
				{name: 'tomato',				r: 1, g: 0.38823529411764707, b: 0.2784313725490196},
				{name: 'darksalmon',			r: 0.9137254901960784, g: 0.5882352941176471, b: 0.47843137254901963},
				{name: 'orangered',				r: 1, g: 0.27058823529411763, b: 0},
				{name: 'coral',					r: 1, g: 0.4980392156862745, b: 0.3137254901960784},
				{name: 'lightsalmon',			r: 1, g: 0.6274509803921569, b: 0.47843137254901963},
				{name: 'sienna',				r: 0.6274509803921569, g: 0.3215686274509804, b: 0.17647058823529413},
				{name: 'seashell',				r: 1, g: 0.9607843137254902, b: 0.9333333333333333},
				{name: 'chocolate',				r: 0.8235294117647058, g: 0.4117647058823529, b: 0.11764705882352941},
				{name: 'saddlebrown',			r: 0.5450980392156862, g: 0.27058823529411763, b: 0.07450980392156863},
				{name: 'sandybrown',			r: 0.9568627450980393, g: 0.6431372549019608, b: 0.3764705882352941},
				{name: 'peachpuff',				r: 1, g: 0.8549019607843137, b: 0.7254901960784313},
				{name: 'peru',					r: 0.803921568627451, g: 0.5215686274509804, b: 0.24705882352941178},
				{name: 'linen',					r: 0.9803921568627451, g: 0.9411764705882353, b: 0.9019607843137255},
				{name: 'darkorange',			r: 1, g: 0.5490196078431373, b: 0},
				{name: 'bisque',				r: 1, g: 0.8941176470588236, b: 0.7686274509803922},
				{name: 'burlywood',				r: 0.8705882352941177, g: 0.7215686274509804, b: 0.5294117647058824},
				{name: 'tan',					r: 0.8235294117647058, g: 0.7058823529411765, b: 0.5490196078431373},
				{name: 'antiquewhite',			r: 0.9803921568627451, g: 0.9215686274509803, b: 0.8431372549019608},
				{name: 'navajowhite',			r: 1, g: 0.8705882352941177, b: 0.6784313725490196},
				{name: 'blanchedalmond',		r: 1, g: 0.9215686274509803, b: 0.803921568627451},
				{name: 'papayawhip',			r: 1, g: 0.9372549019607843, b: 0.8352941176470589},
				{name: 'orange',				r: 1, g: 0.6470588235294118, b: 0},
				{name: 'moccasin',				r: 1, g: 0.8941176470588236, b: 0.7098039215686275},
				{name: 'wheat',					r: 0.9607843137254902, g: 0.8705882352941177, b: 0.7019607843137254},
				{name: 'oldlace',				r: 0.9921568627450981, g: 0.9607843137254902, b: 0.9019607843137255},
				{name: 'floralwhite',			r: 1, g: 0.9803921568627451, b: 0.9411764705882353},
				{name: 'goldenrod',				r: 0.8549019607843137, g: 0.6470588235294118, b: 0.12549019607843137},
				{name: 'darkgoldenrod',			r: 0.7215686274509804, g: 0.5254901960784314, b: 0.043137254901960784},
				{name: 'cornsilk',				r: 1, g: 0.9725490196078431, b: 0.8627450980392157},
				{name: 'gold',					r: 1, g: 0.8431372549019608, b: 0},
				{name: 'palegoldenrod',			r: 0.9333333333333333, g: 0.9098039215686274, b: 0.6666666666666666},
				{name: 'khaki',					r: 0.9411764705882353, g: 0.9019607843137255, b: 0.5490196078431373},
				{name: 'lemonchiffon',			r: 1, g: 0.9803921568627451, b: 0.803921568627451},
				{name: 'darkkhaki',				r: 0.7411764705882353, g: 0.7176470588235294, b: 0.4196078431372549},
				{name: 'beige',					r: 0.9607843137254902, g: 0.9607843137254902, b: 0.8627450980392157},
				{name: 'lightgoldenrodyellow',	r: 0.9803921568627451, g: 0.9803921568627451, b: 0.8235294117647058},
				{name: 'olive',					r: 0.5019607843137255, g: 0.5019607843137255, b: 0},
				{name: 'yellow',				r: 1, g: 1, b: 0},
				{name: 'lightyellow',			r: 1, g: 1, b: 0.8784313725490196},
				{name: 'ivory',					r: 1, g: 1, b: 0.9411764705882353},
				{name: 'olivedrab',				r: 0.4196078431372549, g: 0.5568627450980392, b: 0.13725490196078433},
				{name: 'yellowgreen',			r: 0.6039215686274509, g: 0.803921568627451, b: 0.19607843137254902},
				{name: 'darkolivegreen',		r: 0.3333333333333333, g: 0.4196078431372549, b: 0.1843137254901961},
				{name: 'greenyellow',			r: 0.6784313725490196, g: 1, b: 0.1843137254901961},
				{name: 'lawngreen',				r: 0.48627450980392156, g: 0.9882352941176471, b: 0},
				{name: 'chartreuse',			r: 0.4980392156862745, g: 1, b: 0},
				{name: 'darkseagreen',			r: 0.5607843137254902, g: 0.7372549019607844, b: 0.5607843137254902},
				{name: 'forestgreen',			r: 0.13333333333333333, g: 0.5450980392156862, b: 0.13333333333333333},
				{name: 'limegreen',				r: 0.19607843137254902, g: 0.803921568627451, b: 0.19607843137254902},
				{name: 'lightgreen',			r: 0.5647058823529412, g: 0.9333333333333333, b: 0.5647058823529412},
				{name: 'palegreen',				r: 0.596078431372549, g: 0.984313725490196, b: 0.596078431372549},
				{name: 'darkgreen',				r: 0, g: 0.39215686274509803, b: 0},
				{name: 'green',					r: 0, g: 0.5019607843137255, b: 0},
				{name: 'lime',					r: 0, g: 1, b: 0},
				{name: 'honeydew',				r: 0.9411764705882353, g: 1, b: 0.9411764705882353},
				{name: 'mediumseagreen',		r: 0.23529411764705882, g: 0.7019607843137254, b: 0.44313725490196076},
				{name: 'seagreen',				r: 0.1803921568627451, g: 0.5450980392156862, b: 0.3411764705882353},
				{name: 'springgreen',			r: 0, g: 1, b: 0.4980392156862745},
				{name: 'mintcream',				r: 0.9607843137254902, g: 1, b: 0.9803921568627451},
				{name: 'mediumspringgreen',		r: 0, g: 0.9803921568627451, b: 0.6039215686274509},
				{name: 'mediumaquamarine',		r: 0.4, g: 0.803921568627451, b: 0.6666666666666666},
				{name: 'aquamarine',			r: 0.4980392156862745, g: 1, b: 0.8313725490196079},
				{name: 'turquoise',				r: 0.25098039215686274, g: 0.8784313725490196, b: 0.8156862745098039},
				{name: 'lightseagreen',			r: 0.12549019607843137, g: 0.6980392156862745, b: 0.6666666666666666},
				{name: 'mediumturquoise',		r: 0.2823529411764706, g: 0.8196078431372549, b: 0.8},
				{name: 'darkslategray',			r: 0.1843137254901961, g: 0.30980392156862746, b: 0.30980392156862746},
				{name: 'paleturquoise',			r: 0.6862745098039216, g: 0.9333333333333333, b: 0.9333333333333333},
				{name: 'teal',					r: 0, g: 0.5019607843137255, b: 0.5019607843137255},
				{name: 'darkcyan',				r: 0, g: 0.5450980392156862, b: 0.5450980392156862},
				{name: 'darkturquoise',			r: 0, g: 0.807843137254902, b: 0.8196078431372549},
				{name: 'aqua',					r: 0, g: 1, b: 1},
				{name: 'cyan',					r: 0, g: 1, b: 1},
				{name: 'lightcyan',				r: 0.8784313725490196, g: 1, b: 1},
				{name: 'azure',					r: 0.9411764705882353, g: 1, b: 1},
				{name: 'cadetblue',				r: 0.37254901960784315, g: 0.6196078431372549, b: 0.6274509803921569},
				{name: 'powderblue',			r: 0.6901960784313725, g: 0.8784313725490196, b: 0.9019607843137255},
				{name: 'lightblue',				r: 0.6784313725490196, g: 0.8470588235294118, b: 0.9019607843137255},
				{name: 'deepskyblue',			r: 0, g: 0.7490196078431373, b: 1},
				{name: 'skyblue',				r: 0.5294117647058824, g: 0.807843137254902, b: 0.9215686274509803},
				{name: 'lightskyblue',			r: 0.5294117647058824, g: 0.807843137254902, b: 0.9803921568627451},
				{name: 'steelblue',				r: 0.27450980392156865, g: 0.5098039215686274, b: 0.7058823529411765},
				{name: 'aliceblue',				r: 0.9411764705882353, g: 0.9725490196078431, b: 1},
				{name: 'dodgerblue',			r: 0.11764705882352941, g: 0.5647058823529412, b: 1},
				{name: 'slategray',				r: 0.4392156862745098, g: 0.5019607843137255, b: 0.5647058823529412},
				{name: 'lightslategray',		r: 0.4666666666666667, g: 0.5333333333333333, b: 0.6},
				{name: 'lightsteelblue',		r: 0.6901960784313725, g: 0.7686274509803922, b: 0.8705882352941177},
				{name: 'cornflowerblue',		r: 0.39215686274509803, g: 0.5843137254901961, b: 0.9294117647058824},
				{name: 'royalblue',				r: 0.2549019607843137, g: 0.4117647058823529, b: 0.8823529411764706},
				{name: 'midnightblue',			r: 0.09803921568627451, g: 0.09803921568627451, b: 0.4392156862745098},
				{name: 'lavender',				r: 0.9019607843137255, g: 0.9019607843137255, b: 0.9803921568627451},
				{name: 'navy',					r: 0, g: 0, b: 0.5019607843137255},
				{name: 'darkblue',				r: 0, g: 0, b: 0.5450980392156862},
				{name: 'mediumblue',			r: 0, g: 0, b: 0.803921568627451},
				{name: 'blue',					r: 0, g: 0, b: 1},
				{name: 'ghostwhite',			r: 0.9725490196078431, g: 0.9725490196078431, b: 1},
				{name: 'darkslateblue',			r: 0.2823529411764706, g: 0.23921568627450981, b: 0.5450980392156862},
				{name: 'slateblue',				r: 0.41568627450980394, g: 0.35294117647058826, b: 0.803921568627451},
				{name: 'mediumslateblue',		r: 0.4823529411764706, g: 0.40784313725490196, b: 0.9333333333333333},
				{name: 'mediumpurple',			r: 0.5764705882352941, g: 0.4392156862745098, b: 0.8588235294117647},
				{name: 'blueviolet',			r: 0.5411764705882353, g: 0.16862745098039217, b: 0.8862745098039215},
				{name: 'indigo',				r: 0.29411764705882354, g: 0, b: 0.5098039215686274},
				{name: 'darkorchid',			r: 0.6, g: 0.19607843137254902, b: 0.8},
				{name: 'darkviolet',			r: 0.5803921568627451, g: 0, b: 0.8274509803921568},
				{name: 'mediumorchid',			r: 0.7294117647058823, g: 0.3333333333333333, b: 0.8274509803921568},
				{name: 'thistle',				r: 0.8470588235294118, g: 0.7490196078431373, b: 0.8470588235294118},
				{name: 'plum',					r: 0.8666666666666667, g: 0.6274509803921569, b: 0.8666666666666667},
				{name: 'violet',				r: 0.9333333333333333, g: 0.5098039215686274, b: 0.9333333333333333},
				{name: 'purple',				r: 0.5019607843137255, g: 0, b: 0.5019607843137255},
				{name: 'darkmagenta',			r: 0.5450980392156862, g: 0, b: 0.5450980392156862},
				{name: 'magenta',				r: 1, g: 0, b: 1},
				{name: 'fuchsia',				r: 1, g: 0, b: 1},
				{name: 'orchid',				r: 0.8549019607843137, g: 0.4392156862745098, b: 0.8392156862745098},
				{name: 'mediumvioletred',		r: 0.7803921568627451, g: 0.08235294117647059, b: 0.5215686274509804},
				{name: 'deeppink',				r: 1, g: 0.0784313725490196, b: 0.5764705882352941},
				{name: 'hotpink',				r: 1, g: 0.4117647058823529, b: 0.7058823529411765},
				{name: 'palevioletred',			r: 0.8588235294117647, g: 0.4392156862745098, b: 0.5764705882352941},
				{name: 'lavenderblush',			r: 1, g: 0.9411764705882353, b: 0.9607843137254902},
				{name: 'crimson',				r: 0.8627450980392157, g: 0.0784313725490196, b: 0.23529411764705882},
				{name: 'pink',					r: 1, g: 0.7529411764705882, b: 0.796078431372549},
				{name: 'lightpink',				r: 1, g: 0.7137254901960784, b: 0.7568627450980392}
			]
		};

		this.writers = {
			'#HEX':		function(color, that) {
							return that._formatColor('#rxgxbx', color);
						}
		,	'#HEX3':	function(color, that) {
							var hex3 = $.colorpicker.writers.HEX3(color);
							return hex3 === false? false : '#'+hex3;
						}
		,	'HEX':		function(color, that) {
							return that._formatColor('rxgxbx', color);
						}
		,	'HEX3':		function(color, that) {
							var rgb = color.getRGB(),
								r = Math.floor(rgb.r * 255),
								g = Math.floor(rgb.g * 255),
								b = Math.floor(rgb.b * 255);

							if (((r >>> 4) === (r &= 0xf))
							 && ((g >>> 4) === (g &= 0xf))
							 && ((b >>> 4) === (b &= 0xf))) {
								return r.toString(16)+g.toString(16)+b.toString(16);
							}
							return false;
						}
		,	'RGB':		function(color, that) {
							return color.getAlpha() >= 1
									? that._formatColor('rgb(rd,gd,bd)', color)
									: false;
						}
		,	'RGBA':		function(color, that) {
							return that._formatColor('rgba(rd,gd,bd,af)', color);
						}
		,	'RGB%':		function(color, that) {
							return color.getAlpha() >= 1
									? that._formatColor('rgb(rp%,gp%,bp%)', color)
									: false;
						}
		,	'RGBA%':	function(color, that) {
							return that._formatColor('rgba(rp%,gp%,bp%,af)', color);
						}
		,	'HSL':		function(color, that) {
							return color.getAlpha() >= 1
									? that._formatColor('hsl(hd,sd,vd)', color)
									: false;
						}
		,	'HSLA':		function(color, that) {
							return that._formatColor('hsla(hd,sd,vd,af)', color);
						}
		,	'HSL%':		function(color, that) {
							return color.getAlpha() >= 1
									? that._formatColor('hsl(hp%,sp%,vp%)', color)
									: false;
						}
		,	'HSLA%':	function(color, that) {
							return that._formatColor('hsla(hp%,sp%,vp%,af)', color);
						}
		,	'NAME':		function(color, that) {
							return that._closestName(color);
						}
		,	'EXACT':	function(color, that) {		// @todo experimental. Implement a good fallback list
							return that._exactName(color);
						}
		};

		this.parsers = {
			'':			function(color) {
				            if (color === '') {
								return new $.colorpicker.Color();
							}
						}
		,	'NAME':		function(color, that) {
							var c = that._getSwatch($.trim(color));
							if (c) {
								return new $.colorpicker.Color(c.r, c.g, c.b);
							}
						}
		,	'RGBA':		function(color) {
							var m = /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)$/.exec(color);
							if (m) {
								return new $.colorpicker.Color(
									m[1] / 255,
									m[2] / 255,
									m[3] / 255,
									parseFloat(m[4])
								);
							}
						}
		,	'RGBA%':	function(color) {
							var m = /^rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)$/.exec(color);
							if (m) {
								return new $.colorpicker.Color(
									m[1] / 100,
									m[2] / 100,
									m[3] / 100,
									m[4] / 100
								);
							}
						}
		,	'HSLA':		function(color) {
							var m = /^hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)$/.exec(color);
							if (m) {
								return (new $.colorpicker.Color()).setHSL(
									m[1] / 255,
									m[2] / 255,
									m[3] / 255).setAlpha(parseFloat(m[4]));
							}
						}
		,	'HSLA%':	function(color) {
							var m = /^hsla?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)$/.exec(color);
							if (m) {
								return (new $.colorpicker.Color()).setHSL(
									m[1] / 100,
									m[2] / 100,
									m[3] / 100).setAlpha(m[4] / 100);
							}
						}
		,	'#HEX':		function(color) {
							var m = /^#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})$/.exec(color);
							if (m) {
								return new $.colorpicker.Color(
									parseInt(m[1], 16) / 255,
									parseInt(m[2], 16) / 255,
									parseInt(m[3], 16) / 255
								);
							}
						}
		,	'#HEX3':	function(color) {
							var m = /^#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])$/.exec(color);
							if (m) {
								return new $.colorpicker.Color(
								   parseInt(String(m[1]) + m[1], 16) / 255,
								   parseInt(String(m[2]) + m[2], 16) / 255,
								   parseInt(String(m[3]) + m[3], 16) / 255
								);
							}
						}
		,	'HEX':		function(color) {
							var m = /^([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})$/.exec(color);
							if (m) {
								return new $.colorpicker.Color(
									parseInt(m[1], 16) / 255,
									parseInt(m[2], 16) / 255,
									parseInt(m[3], 16) / 255
								);
							}
						}
		,	'HEX3':		function(color) {
							var m = /^([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])$/.exec(color);
							if (m) {
								return new $.colorpicker.Color(
								   parseInt(String(m[1]) + m[1], 16) / 255,
								   parseInt(String(m[2]) + m[2], 16) / 255,
								   parseInt(String(m[3]) + m[3], 16) / 255
								);
							}
						}
		};

		this.partslists = {
			'full':			['header', 'map', 'bar', 'hex', 'hsv', 'rgb', 'alpha', 'lab', 'cmyk', 'preview', 'swatches', 'footer'],
			'popup':		['map', 'bar', 'hex', 'hsv', 'rgb', 'alpha', 'preview', 'footer'],
			'draggable':	['header', 'map', 'bar', 'hex', 'hsv', 'rgb', 'alpha', 'preview', 'footer'],
			'inline':		['map', 'bar', 'hex', 'hsv', 'rgb', 'alpha', 'preview']
		};

		this.limits = {
			'websafe':		function(color) {
								color.limit(6);
							},
			'nibble':		function(color) {
								color.limit(16);
							},
			'binary':		function(color) {
								color.limit(2);
							},
			'name':			function(color, that) {
								var swatch = that._getSwatch(that._closestName(color));
								color.setRGB(swatch.r, swatch.g, swatch.b);
							}
		};

		this.parts = {
			header: function (inst) {
				var that	= this,
					e		= null,
					_html	=function() {
						var title = inst.options.title || inst._getRegional('title'),
							html = '<span class="ui-dialog-title">' + title + '</span>';

						if (!inst.inline && inst.options.showCloseButton) {
							html += '<a href="#" class="ui-dialog-titlebar-close ui-corner-all" role="button">'
								+ '<span class="ui-icon ui-icon-closethick">close</span></a>';
						}

						return '<div class="ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix">' + html + '</div>';
					};

				this.init = function() {
					e = $(_html()).prependTo(inst.dialog);

					var close = $('.ui-dialog-titlebar-close', e);
					inst._hoverable(close);
					inst._focusable(close);
					close.click(function(event) {
						event.preventDefault();
						inst.close(inst.options.revert);
					});

					if (!inst.inline && inst.options.draggable) {
						var draggableOptions = {
							handle: e,
						}
						if (inst.options.containment) {
							draggableOptions.containment = inst.options.containment;
						}
						inst.dialog.draggable(draggableOptions);
					}
				};
			},

			map: function (inst) {
				var that	= this,
					e		= null,
					mousemove_timeout = null,
					_mousedown, _mouseup, _mousemove, _html;

				_mousedown = function (event) {
					if (!inst.opened) {
						return;
					}

					var div		= $('.ui-colorpicker-map-layer-pointer', e),
						offset	= div.offset(),
						width	= div.width(),
						height	= div.height(),
						x		= event.pageX - offset.left,
						y		= event.pageY - offset.top;

					if (x >= 0 && x < width && y >= 0 && y < height) {
						event.stopImmediatePropagation();
						event.preventDefault();
						e.unbind('mousedown', _mousedown);
						$(document).bind('mouseup', _mouseup);
						$(document).bind('mousemove', _mousemove);
						_mousemove(event);
					}
				};

				_mouseup = function (event) {
					event.stopImmediatePropagation();
					event.preventDefault();
					$(document).unbind('mouseup', _mouseup);
					$(document).unbind('mousemove', _mousemove);
					e.bind('mousedown', _mousedown);
				};

				_mousemove = function (event) {
					event.stopImmediatePropagation();
					event.preventDefault();

					if (event.pageX === that.x && event.pageY === that.y) {
						return;
					}
					that.x = event.pageX;
					that.y = event.pageY;

					var div = $('.ui-colorpicker-map-layer-pointer', e),
						offset = div.offset(),
						width = div.width(),
						height = div.height(),
						x = event.pageX - offset.left,
						y = event.pageY - offset.top;

					x = Math.max(0, Math.min(x / width, 1));
					y = Math.max(0, Math.min(y / height, 1));

					// interpret values
					switch (inst.mode) {
					case 'h':
						inst.color.setHSV(null, x, 1 - y);
						break;

					case 's':
					case 'a':
						inst.color.setHSV(x, null, 1 - y);
						break;

					case 'v':
						inst.color.setHSV(x, 1 - y, null);
						break;

					case 'r':
						inst.color.setRGB(null, 1 - y, x);
						break;

					case 'g':
						inst.color.setRGB(1 - y, null, x);
						break;

					case 'b':
						inst.color.setRGB(x, 1 - y, null);
						break;
					}

					inst._change();
				};

				_html = function () {
					var html = '<div class="ui-colorpicker-map ui-colorpicker-map-'+(inst.options.part.map.size || 256)+' ui-colorpicker-border">'
							+ '<span class="ui-colorpicker-map-layer-1">&nbsp;</span>'
							+ '<span class="ui-colorpicker-map-layer-2">&nbsp;</span>'
							+ (inst.options.alpha ? '<span class="ui-colorpicker-map-layer-alpha">&nbsp;</span>' : '')
							+ '<span class="ui-colorpicker-map-layer-pointer"><span class="ui-colorpicker-map-pointer"></span></span></div>';
					return html;
				};

				this.update = function () {
					var step = ((inst.options.part.map.size || 256) * 65 / 64);

					switch (inst.mode) {
					case 'h':
						$('.ui-colorpicker-map-layer-1', e).css({'background-position': '0 0', 'opacity': ''}).show();
						$('.ui-colorpicker-map-layer-2', e).hide();
						break;

					case 's':
					case 'a':
						$('.ui-colorpicker-map-layer-1', e).css({'background-position': '0 '+(-step)+'px', 'opacity': ''}).show();
						$('.ui-colorpicker-map-layer-2', e).css({'background-position': '0 '+(-step*2)+'px', 'opacity': ''}).show();
						break;

					case 'v':
						$(e).css('background-color', 'black');
						$('.ui-colorpicker-map-layer-1', e).css({'background-position': '0 '+(-step*3)+'px', 'opacity': ''}).show();
						$('.ui-colorpicker-map-layer-2', e).hide();
						break;

					case 'r':
						$('.ui-colorpicker-map-layer-1', e).css({'background-position': '0 '+(-step*4)+'px', 'opacity': ''}).show();
						$('.ui-colorpicker-map-layer-2', e).css({'background-position': '0 '+(-step*5)+'px', 'opacity': ''}).show();
						break;

					case 'g':
						$('.ui-colorpicker-map-layer-1', e).css({'background-position': '0 '+(-step*6)+'px', 'opacity': ''}).show();
						$('.ui-colorpicker-map-layer-2', e).css({'background-position': '0 '+(-step*7)+'px', 'opacity': ''}).show();
						break;

					case 'b':
						$('.ui-colorpicker-map-layer-1', e).css({'background-position': '0 '+(-step*8)+'px', 'opacity': ''}).show();
						$('.ui-colorpicker-map-layer-2', e).css({'background-position': '0 '+(-step*9)+'px', 'opacity': ''}).show();
						break;
					}
					that.repaint();
				};

				this.repaint = function () {
					var div = $('.ui-colorpicker-map-layer-pointer', e),
						x = 0,
						y = 0;

					switch (inst.mode) {
					case 'h':
						x = inst.color.getHSV().s * div.width();
						y = (1 - inst.color.getHSV().v) * div.width();
						$(e).css('background-color', inst.color.copy().setHSV(null, 1, 1).toCSS());
						break;

					case 's':
					case 'a':
						x = inst.color.getHSV().h * div.width();
						y = (1 - inst.color.getHSV().v) * div.width();
						$('.ui-colorpicker-map-layer-2', e).css('opacity', 1 - inst.color.getHSV().s);
						break;

					case 'v':
						x = inst.color.getHSV().h * div.width();
						y = (1 - inst.color.getHSV().s) * div.width();
						$('.ui-colorpicker-map-layer-1', e).css('opacity', inst.color.getHSV().v);
						break;

					case 'r':
						x = inst.color.getRGB().b * div.width();
						y = (1 - inst.color.getRGB().g) * div.width();
						$('.ui-colorpicker-map-layer-2', e).css('opacity', inst.color.getRGB().r);
						break;

					case 'g':
						x = inst.color.getRGB().b * div.width();
						y = (1 - inst.color.getRGB().r) * div.width();
						$('.ui-colorpicker-map-layer-2', e).css('opacity', inst.color.getRGB().g);
						break;

					case 'b':
						x = inst.color.getRGB().r * div.width();
						y = (1 - inst.color.getRGB().g) * div.width();
						$('.ui-colorpicker-map-layer-2', e).css('opacity', inst.color.getRGB().b);
						break;
					}

					if (inst.options.alpha) {
						$('.ui-colorpicker-map-layer-alpha', e).css('opacity', 1 - inst.color.getAlpha());
					}

					$('.ui-colorpicker-map-pointer', e).css({
						'left': x - 7,
						'top': y - 7
					});
				};

				this.init = function () {
					e = $(_html()).appendTo($('.ui-colorpicker-map-container', inst.dialog));

					e.bind('mousedown', _mousedown);
				};
			},

			bar: function (inst) {
				var that		= this,
					e			= null,
					_mousedown, _mouseup, _mousemove, _html;

				_mousedown = function (event) {
					if (!inst.opened) {
						return;
					}

					var div		= $('.ui-colorpicker-bar-layer-pointer', e),
						offset	= div.offset(),
						width	= div.width(),
						height	= div.height(),
						x		= event.pageX - offset.left,
						y		= event.pageY - offset.top;

					if (x >= 0 && x < width && y >= 0 && y < height) {
						event.stopImmediatePropagation();
						event.preventDefault();
						e.unbind('mousedown', _mousedown);
						$(document).bind('mouseup', _mouseup);
						$(document).bind('mousemove', _mousemove);
						_mousemove(event);
					}
				};

				_mouseup = function (event) {
					event.stopImmediatePropagation();
					event.preventDefault();
					$(document).unbind('mouseup', _mouseup);
					$(document).unbind('mousemove', _mousemove);
					e.bind('mousedown', _mousedown);
				};

				_mousemove = function (event) {
					event.stopImmediatePropagation();
					event.preventDefault();

					if (event.pageY === that.y) {
						return;
					}
					that.y = event.pageY;

					var div = $('.ui-colorpicker-bar-layer-pointer', e),
						offset  = div.offset(),
						height  = div.height(),
						y = event.pageY - offset.top;

					y = Math.max(0, Math.min(y / height, 1));

					// interpret values
					switch (inst.mode) {
					case 'h':
						inst.color.setHSV(1 - y, null, null);
						break;

					case 's':
						inst.color.setHSV(null, 1 - y, null);
						break;

					case 'v':
						inst.color.setHSV(null, null, 1 - y);
						break;

					case 'r':
						inst.color.setRGB(1 - y, null, null);
						break;

					case 'g':
						inst.color.setRGB(null, 1 - y, null);
						break;

					case 'b':
						inst.color.setRGB(null, null, 1 - y);
						break;

					case 'a':
						inst.color.setAlpha(1 - y);
						break;
					}

					inst._change();
				};

				_html = function () {
					var html = '<div class="ui-colorpicker-bar ui-colorpicker-bar-'+(inst.options.part.bar.size || 256)+'  ui-colorpicker-border">'
							+ '<span class="ui-colorpicker-bar-layer-1">&nbsp;</span>'
							+ '<span class="ui-colorpicker-bar-layer-2">&nbsp;</span>'
							+ '<span class="ui-colorpicker-bar-layer-3">&nbsp;</span>'
							+ '<span class="ui-colorpicker-bar-layer-4">&nbsp;</span>';

					if (inst.options.alpha) {
						html += '<span class="ui-colorpicker-bar-layer-alpha">&nbsp;</span>'
							+ '<span class="ui-colorpicker-bar-layer-alphabar">&nbsp;</span>';
					}

					html += '<span class="ui-colorpicker-bar-layer-pointer"><span class="ui-colorpicker-bar-pointer"></span></span></div>';

					return html;
				};

				this.update = function () {
					var step = ((inst.options.part.bar.size || 256) * 65 / 64);

					switch (inst.mode) {
					case 'h':
					case 's':
					case 'v':
					case 'r':
					case 'g':
					case 'b':
						$('.ui-colorpicker-bar-layer-alpha', e).show();
						$('.ui-colorpicker-bar-layer-alphabar', e).hide();
						break;

					case 'a':
						$('.ui-colorpicker-bar-layer-alpha', e).hide();
						$('.ui-colorpicker-bar-layer-alphabar', e).show();
						break;
					}

					switch (inst.mode) {
					case 'h':
						$('.ui-colorpicker-bar-layer-1', e).css({'background-position': '0 0', 'opacity': ''}).show();
						$('.ui-colorpicker-bar-layer-2', e).hide();
						$('.ui-colorpicker-bar-layer-3', e).hide();
						$('.ui-colorpicker-bar-layer-4', e).hide();
						break;

					case 's':
						$('.ui-colorpicker-bar-layer-1', e).css({'background-position': '0 '+(-step)+'px', 'opacity': ''}).show();
						$('.ui-colorpicker-bar-layer-2', e).css({'background-position': '0 '+(-step*2)+'px', 'opacity': ''}).show();
						$('.ui-colorpicker-bar-layer-3', e).hide();
						$('.ui-colorpicker-bar-layer-4', e).hide();
						break;

					case 'v':
						$('.ui-colorpicker-bar-layer-1', e).css({'background-position': '0 '+(-step*2)+'px', 'opacity': ''}).show();
						$('.ui-colorpicker-bar-layer-2', e).hide();
						$('.ui-colorpicker-bar-layer-3', e).hide();
						$('.ui-colorpicker-bar-layer-4', e).hide();
						break;

					case 'r':
						$('.ui-colorpicker-bar-layer-1', e).css({'background-position': '0 '+(-step*6)+'px', 'opacity': ''}).show();
						$('.ui-colorpicker-bar-layer-2', e).css({'background-position': '0 '+(-step*5)+'px', 'opacity': ''}).show();
						$('.ui-colorpicker-bar-layer-3', e).css({'background-position': '0 '+(-step*3)+'px', 'opacity': ''}).show();
						$('.ui-colorpicker-bar-layer-4', e).css({'background-position': '0 '+(-step*4)+'px', 'opacity': ''}).show();
						break;

					case 'g':
						$('.ui-colorpicker-bar-layer-1', e).css({'background-position': '0 '+(-step*10)+'px', 'opacity': ''}).show();
						$('.ui-colorpicker-bar-layer-2', e).css({'background-position': '0 '+(-step*9)+'px', 'opacity': ''}).show();
						$('.ui-colorpicker-bar-layer-3', e).css({'background-position': '0 '+(-step*7)+'px', 'opacity': ''}).show();
						$('.ui-colorpicker-bar-layer-4', e).css({'background-position': '0 '+(-step*8)+'px', 'opacity': ''}).show();
						break;

					case 'b':
						$('.ui-colorpicker-bar-layer-1', e).css({'background-position': '0 '+(-step*14)+'px', 'opacity': ''}).show();
						$('.ui-colorpicker-bar-layer-2', e).css({'background-position': '0 '+(-step*13)+'px', 'opacity': ''}).show();
						$('.ui-colorpicker-bar-layer-3', e).css({'background-position': '0 '+(-step*11)+'px', 'opacity': ''}).show();
						$('.ui-colorpicker-bar-layer-4', e).css({'background-position': '0 '+(-step*12)+'px', 'opacity': ''}).show();
						break;

					case 'a':
						$('.ui-colorpicker-bar-layer-1', e).hide();
						$('.ui-colorpicker-bar-layer-2', e).hide();
						$('.ui-colorpicker-bar-layer-3', e).hide();
						$('.ui-colorpicker-bar-layer-4', e).hide();
						break;
					}
					that.repaint();
				};

				this.repaint = function () {
					var div = $('.ui-colorpicker-bar-layer-pointer', e),
						y = 0;

					switch (inst.mode) {
					case 'h':
						y = (1 - inst.color.getHSV().h) * div.height();
						break;

					case 's':
						y = (1 - inst.color.getHSV().s) * div.height();
						$('.ui-colorpicker-bar-layer-2', e).css('opacity', 1 - inst.color.getHSV().v);
						$(e).css('background-color', inst.color.copy().setHSV(null, 1, null).toCSS());
						break;

					case 'v':
						y = (1 - inst.color.getHSV().v) * div.height();
						$(e).css('background-color', inst.color.copy().setHSV(null, null, 1).toCSS());
						break;

					case 'r':
						y = (1 - inst.color.getRGB().r) * div.height();
						$('.ui-colorpicker-bar-layer-2', e).css('opacity', Math.max(0, (inst.color.getRGB().b - inst.color.getRGB().g)));
						$('.ui-colorpicker-bar-layer-3', e).css('opacity', Math.max(0, (inst.color.getRGB().g - inst.color.getRGB().b)));
						$('.ui-colorpicker-bar-layer-4', e).css('opacity', Math.min(inst.color.getRGB().b, inst.color.getRGB().g));
						break;

					case 'g':
						y = (1 - inst.color.getRGB().g) * div.height();
						$('.ui-colorpicker-bar-layer-2', e).css('opacity', Math.max(0, (inst.color.getRGB().b - inst.color.getRGB().r)));
						$('.ui-colorpicker-bar-layer-3', e).css('opacity', Math.max(0, (inst.color.getRGB().r - inst.color.getRGB().b)));
						$('.ui-colorpicker-bar-layer-4', e).css('opacity', Math.min(inst.color.getRGB().r, inst.color.getRGB().b));
						break;

					case 'b':
						y = (1 - inst.color.getRGB().b) * div.height();
						$('.ui-colorpicker-bar-layer-2', e).css('opacity', Math.max(0, (inst.color.getRGB().r - inst.color.getRGB().g)));
						$('.ui-colorpicker-bar-layer-3', e).css('opacity', Math.max(0, (inst.color.getRGB().g - inst.color.getRGB().r)));
						$('.ui-colorpicker-bar-layer-4', e).css('opacity', Math.min(inst.color.getRGB().r, inst.color.getRGB().g));
						break;

					case 'a':
						y = (1 - inst.color.getAlpha()) * div.height();
						$(e).css('background-color', inst.color.copy().toCSS());
						break;
					}

					if (inst.mode !== 'a') {
						$('.ui-colorpicker-bar-layer-alpha', e).css('opacity', 1 - inst.color.getAlpha());
					}

					$('.ui-colorpicker-bar-pointer', e).css('top', y - 3);
				};

				this.init = function () {
					e = $(_html()).appendTo($('.ui-colorpicker-bar-container', inst.dialog));

					e.bind('mousedown', _mousedown);
				};
			},

			preview: function (inst) {
				var that = this,
					e = null,
					_html;

				_html = function () {
					return '<div class="ui-colorpicker-preview ui-colorpicker-border">'
						+ '<div class="ui-colorpicker-preview-initial"><div class="ui-colorpicker-preview-initial-alpha"></div></div>'
						+ '<div class="ui-colorpicker-preview-current"><div class="ui-colorpicker-preview-current-alpha"></div></div>'
						+ '</div>';
				};

				this.init = function () {
					e = $(_html()).appendTo($('.ui-colorpicker-preview-container', inst.dialog));

					$('.ui-colorpicker-preview-initial', e).click(function () {
						inst.color = inst.currentColor.copy();
						inst._change();
					});
				};

				this.update = function () {
					if (inst.options.alpha) {
						$('.ui-colorpicker-preview-initial-alpha, .ui-colorpicker-preview-current-alpha', e).show();
					} else {
						$('.ui-colorpicker-preview-initial-alpha, .ui-colorpicker-preview-current-alpha', e).hide();
					}

					this.repaint();
				};

				this.repaint = function () {
					$('.ui-colorpicker-preview-initial', e).css('background-color', inst.currentColor.set ? inst.currentColor.toCSS() : '').attr('title', inst.currentColor.set ? inst.currentColor.toCSS() : '');
					$('.ui-colorpicker-preview-initial-alpha', e).css('opacity', 1 - inst.currentColor.getAlpha());
					$('.ui-colorpicker-preview-current', e).css('background-color', inst.color.set ? inst.color.toCSS() : '').attr('title', inst.color.set ? inst.color.toCSS() : '');
					$('.ui-colorpicker-preview-current-alpha', e).css('opacity', 1 - inst.color.getAlpha());
				};
			},

			hsv: function (inst) {
				var that = this,
					e = null,
					_html;

				_html = function () {
					var html = '';

					if (inst.options.hsv) {
						html +=	'<div class="ui-colorpicker-hsv-h"><input class="ui-colorpicker-mode" type="radio" value="h"/><label>' + inst._getRegional('hsvH') + '</label><input class="ui-colorpicker-number" type="number" min="0" max="360" size="10"/><span class="ui-colorpicker-unit">&deg;</span></div>'
							+ '<div class="ui-colorpicker-hsv-s"><input class="ui-colorpicker-mode" type="radio" value="s"/><label>' + inst._getRegional('hsvS') + '</label><input class="ui-colorpicker-number" type="number" min="0" max="100" size="10"/><span class="ui-colorpicker-unit">%</span></div>'
							+ '<div class="ui-colorpicker-hsv-v"><input class="ui-colorpicker-mode" type="radio" value="v"/><label>' + inst._getRegional('hsvV') + '</label><input class="ui-colorpicker-number" type="number" min="0" max="100" size="10"/><span class="ui-colorpicker-unit">%</span></div>';
					}

					return '<div class="ui-colorpicker-hsv">' + html + '</div>';
				};

				this.init = function () {
					e = $(_html()).appendTo($('.ui-colorpicker-hsv-container', inst.dialog));

					$('.ui-colorpicker-mode', e).click(function () {
						inst.mode = $(this).val();
						inst._updateAllParts();
					});

					$('.ui-colorpicker-number', e).bind('change keyup', function () {
						inst.color.setHSV(
							$('.ui-colorpicker-hsv-h .ui-colorpicker-number', e).val() / 360,
							$('.ui-colorpicker-hsv-s .ui-colorpicker-number', e).val() / 100,
							$('.ui-colorpicker-hsv-v .ui-colorpicker-number', e).val() / 100
						);
						inst._change();
					});
				};

				this.repaint = function () {
					var hsv = inst.color.getHSV();
					hsv.h *= 360;
					hsv.s *= 100;
					hsv.v *= 100;

					$.each(hsv, function (index, value) {
						var input = $('.ui-colorpicker-hsv-' + index + ' .ui-colorpicker-number', e);
						value = Math.round(value);
						if (parseInt(input.val(), 10) !== value) {
							input.val(value);
						}
					});
				};

				this.update = function () {
					$('.ui-colorpicker-mode', e).each(function () {
						$(this).attr('checked', $(this).val() === inst.mode);
					});
					this.repaint();
				};
			},

			rgb: function (inst) {
				var that = this,
					e = null,
					_html;

				_html = function () {
					var html = '';

					if (inst.options.rgb) {
						html += '<div class="ui-colorpicker-rgb-r"><input class="ui-colorpicker-mode" type="radio" value="r"/><label>' + inst._getRegional('rgbR') + '</label><input class="ui-colorpicker-number" type="number" min="0" max="255"/></div>'
							+ '<div class="ui-colorpicker-rgb-g"><input class="ui-colorpicker-mode" type="radio" value="g"/><label>' + inst._getRegional('rgbG') + '</label><input class="ui-colorpicker-number" type="number" min="0" max="255"/></div>'
							+ '<div class="ui-colorpicker-rgb-b"><input class="ui-colorpicker-mode" type="radio" value="b"/><label>' + inst._getRegional('rgbB') + '</label><input class="ui-colorpicker-number" type="number" min="0" max="255"/></div>';
					}

					return '<div class="ui-colorpicker-rgb">' + html + '</div>';
				};

				this.init = function () {
					e = $(_html()).appendTo($('.ui-colorpicker-rgb-container', inst.dialog));

					$('.ui-colorpicker-mode', e).click(function () {
						inst.mode = $(this).val();
						inst._updateAllParts();
					});

					$('.ui-colorpicker-number', e).bind('change keyup', function () {
						var r = $('.ui-colorpicker-rgb-r .ui-colorpicker-number', e).val();
						inst.color.setRGB(
							$('.ui-colorpicker-rgb-r .ui-colorpicker-number', e).val() / 255,
							$('.ui-colorpicker-rgb-g .ui-colorpicker-number', e).val() / 255,
							$('.ui-colorpicker-rgb-b .ui-colorpicker-number', e).val() / 255
						);

						inst._change();
					});
				};

				this.repaint = function () {
					$.each(inst.color.getRGB(), function (index, value) {
						var input = $('.ui-colorpicker-rgb-' + index + ' .ui-colorpicker-number', e);
						value = Math.floor(value * 255);
						if (parseInt(input.val(), 10) !== value) {
							input.val(value);
						}
					});
				};

				this.update = function () {
					$('.ui-colorpicker-mode', e).each(function () {
						$(this).attr('checked', $(this).val() === inst.mode);
					});
					this.repaint();
				};
			},

			lab: function (inst) {
				var that = this,
					part = null,
					html = function () {
						var html = '';

						if (inst.options.hsv) {
							html +=	'<div class="ui-colorpicker-lab-l"><label>' + inst._getRegional('labL') + '</label><input class="ui-colorpicker-number" type="number" min="0" max="100"/></div>'
								+ '<div class="ui-colorpicker-lab-a"><label>' + inst._getRegional('labA') + '</label><input class="ui-colorpicker-number" type="number" min="-128" max="127"/></div>'
								+ '<div class="ui-colorpicker-lab-b"><label>' + inst._getRegional('labB') + '</label><input class="ui-colorpicker-number" type="number" min="-128" max="127"/></div>';
						}

						return '<div class="ui-colorpicker-lab">' + html + '</div>';
					};

				this.init = function () {
					var data = 0;

					part = $(html()).appendTo($('.ui-colorpicker-lab-container', inst.dialog));

					$('.ui-colorpicker-number', part).bind('change keyup', function (event) {
						inst.color.setLAB(
							parseInt($('.ui-colorpicker-lab-l .ui-colorpicker-number', part).val(), 10) / 100,
							(parseInt($('.ui-colorpicker-lab-a .ui-colorpicker-number', part).val(), 10) + 128) / 255,
							(parseInt($('.ui-colorpicker-lab-b .ui-colorpicker-number', part).val(), 10) + 128) / 255
						);
						inst._change();
					});
				};

				this.repaint = function () {
					var lab = inst.color.getLAB();
					lab.l *= 100;
					lab.a = (lab.a * 255) - 128;
					lab.b = (lab.b * 255) - 128;

					$.each(lab, function (index, value) {
						var input = $('.ui-colorpicker-lab-' + index + ' .ui-colorpicker-number', part);
						value = Math.round(value);
						if (parseInt(input.val(), 10) !== value) {
							input.val(value);
						}
					});
				};

				this.update = function () {
					this.repaint();
				};
			},

			cmyk: function (inst) {
				var that = this,
					part = null,
					html = function () {
						var html = '';

						if (inst.options.hsv) {
							html +=	'<div class="ui-colorpicker-cmyk-c"><label>' + inst._getRegional('cmykC') + '</label><input class="ui-colorpicker-number" type="number" min="0" max="100"/><span class="ui-colorpicker-unit">%</span></div>'
								+ '<div class="ui-colorpicker-cmyk-m"><label>' + inst._getRegional('cmykM') + '</label><input class="ui-colorpicker-number" type="number" min="0" max="100"/><span class="ui-colorpicker-unit">%</span></div>'
								+ '<div class="ui-colorpicker-cmyk-y"><label>' + inst._getRegional('cmykY') + '</label><input class="ui-colorpicker-number" type="number" min="0" max="100"/><span class="ui-colorpicker-unit">%</span></div>'
								+ '<div class="ui-colorpicker-cmyk-k"><label>' + inst._getRegional('cmykK') + '</label><input class="ui-colorpicker-number" type="number" min="0" max="100"/><span class="ui-colorpicker-unit">%</span></div>';
						}

						return '<div class="ui-colorpicker-cmyk">' + html + '</div>';
					};

				this.init = function () {
					part = $(html()).appendTo($('.ui-colorpicker-cmyk-container', inst.dialog));

					$('.ui-colorpicker-number', part).bind('change keyup', function (event) {
						inst.color.setCMYK(
							parseInt($('.ui-colorpicker-cmyk-c .ui-colorpicker-number', part).val(), 10) / 100,
							parseInt($('.ui-colorpicker-cmyk-m .ui-colorpicker-number', part).val(), 10) / 100,
							parseInt($('.ui-colorpicker-cmyk-y .ui-colorpicker-number', part).val(), 10) / 100,
							parseInt($('.ui-colorpicker-cmyk-k .ui-colorpicker-number', part).val(), 10) / 100
						);
						inst._change();
					});
				};

				this.repaint = function () {
					$.each(inst.color.getCMYK(), function (index, value) {
						var input = $('.ui-colorpicker-cmyk-' + index + ' .ui-colorpicker-number', part);
						value = Math.round(value * 100);
						if (parseInt(input.val(), 10, 10) !== value) {
							input.val(value);
						}
					});
				};

				this.update = function () {
					this.repaint();
				};
			},

			alpha: function (inst) {
				var that = this,
					e = null,
					_html;

				_html = function () {
					var html = '';

					if (inst.options.alpha) {
						html += '<div class="ui-colorpicker-a"><input class="ui-colorpicker-mode" name="mode" type="radio" value="a"/><label>' + inst._getRegional('alphaA') + '</label><input class="ui-colorpicker-number" type="number" min="0" max="100"/><span class="ui-colorpicker-unit">%</span></div>';
					}

					return '<div class="ui-colorpicker-alpha">' + html + '</div>';
				};

				this.init = function () {
					e = $(_html()).appendTo($('.ui-colorpicker-alpha-container', inst.dialog));

					$('.ui-colorpicker-mode', e).click(function () {
						inst.mode = $(this).val();
						inst._updateAllParts();
					});

					$('.ui-colorpicker-number', e).bind('change keyup', function () {
						inst.color.setAlpha($('.ui-colorpicker-a .ui-colorpicker-number', e).val() / 100);
						inst._change();
					});
				};

				this.update = function () {
					$('.ui-colorpicker-mode', e).each(function () {
						$(this).attr('checked', $(this).val() === inst.mode);
					});
					this.repaint();
				};

				this.repaint = function () {
					var input = $('.ui-colorpicker-a .ui-colorpicker-number', e),
						value = Math.round(inst.color.getAlpha() * 100);
					if (parseInt(input.val(), 10) !== value) {
						input.val(value);
					}
				};
			},

			hex: function (inst) {
				var that = this,
					e = null,
					_html;

				_html = function () {
					var html = '';

					if (inst.options.alpha) {
						html += '<input class="ui-colorpicker-hex-alpha" type="text" maxlength="2" size="2"/>';
					}

					html += '<input class="ui-colorpicker-hex-input" type="text" maxlength="6" size="6"/>';

					return '<div class="ui-colorpicker-hex"><label>#</label>' + html + '</div>';
				};

				this.init = function () {
					e = $(_html()).appendTo($('.ui-colorpicker-hex-container', inst.dialog));

					// repeat here makes the invalid input disappear faster
					$('.ui-colorpicker-hex-input', e).bind('change keydown keyup', function (a, b, c) {
						if (/[^a-fA-F0-9]/.test($(this).val())) {
							$(this).val($(this).val().replace(/[^a-fA-F0-9]/, ''));
						}
					});

					$('.ui-colorpicker-hex-input', e).bind('change keyup', function () {
						// repeat here makes sure that the invalid input doesn't get parsed
						inst.color = _parseHex($(this).val()).setAlpha(inst.color.getAlpha());
						inst._change();
					});

					$('.ui-colorpicker-hex-alpha', e).bind('change keydown keyup', function () {
						if (/[^a-fA-F0-9]/.test($(this).val())) {
							$(this).val($(this).val().replace(/[^a-fA-F0-9]/, ''));
						}
					});

					$('.ui-colorpicker-hex-alpha', e).bind('change keyup', function () {
						inst.color.setAlpha(parseInt($('.ui-colorpicker-hex-alpha', e).val(), 16) / 255);
						inst._change();
					});
				};

				this.update = function () {
					this.repaint();
				};

				this.repaint = function () {
					if (!$('.ui-colorpicker-hex-input', e).is(':focus')) {
						$('.ui-colorpicker-hex-input', e).val(inst.color.toHex(true));
					}

					if (!$('.ui-colorpicker-hex-alpha', e).is(':focus')) {
						$('.ui-colorpicker-hex-alpha', e).val(_intToHex(inst.color.getAlpha() * 255));
					}
				};
			},

			swatches: function (inst) {
				var that = this,
					part = null,
					html = function () {
						var html = '';

						inst._eachSwatch(function (name, color) {
							var c = new $.colorpicker.Color(color.r, color.g, color.b),
								css = c.toCSS();
							html += '<div class="ui-colorpicker-swatch" style="background-color:' + css + '" title="' + name + '"></div>';
						});

						return '<div class="ui-colorpicker-swatches ui-colorpicker-border" style="width:' + inst.options.swatchesWidth + 'px">' + html + '</div>';
					};

				this.init = function () {
					part = $(html()).appendTo($('.ui-colorpicker-swatches-container', inst.dialog));

					$('.ui-colorpicker-swatch', part).click(function () {
						inst.color	= inst._parseColor($(this).css('background-color'));
						inst._change();
					});
				};
			},

			footer: function (inst) {
				var that = this,
					part = null,
					id_transparent = 'ui-colorpicker-special-transparent-'+_colorpicker_index,
					id_none = 'ui-colorpicker-special-none-'+_colorpicker_index,
					html = function () {
						var html = '';

						if (inst.options.alpha || (!inst.inline && inst.options.showNoneButton)) {
							html += '<div class="ui-colorpicker-buttonset">';

							if (inst.options.alpha) {
								html += '<input type="radio" name="ui-colorpicker-special" id="'+id_transparent+'" class="ui-colorpicker-special-transparent"/><label for="'+id_transparent+'">' + inst._getRegional('transparent') + '</label>';
							}
							if (!inst.inline && inst.options.showNoneButton) {
								html += '<input type="radio" name="ui-colorpicker-special" id="'+id_none+'" class="ui-colorpicker-special-none"><label for="'+id_none+'">' + inst._getRegional('none') + '</label>';
							}
							html += '</div>';
						}

						if (!inst.inline) {
							html += '<div class="ui-dialog-buttonset">';
							if (inst.options.showCancelButton) {
								html += '<button class="ui-colorpicker-cancel">' + inst._getRegional('cancel') + '</button>';
							}
							html += '<button class="ui-colorpicker-ok">' + inst._getRegional('ok') + '</button>';
							html += '</div>';
						}

						return '<div class="ui-dialog-buttonpane ui-widget-content">' + html + '</div>';
					};

				this.init = function () {
					part = $(html()).appendTo(inst.dialog);

					$('.ui-colorpicker-ok', part).button().click(function () {
						inst.close();
					});

					$('.ui-colorpicker-cancel', part).button().click(function () {
						inst.close(true);   //cancel
					});

					//inst._getRegional('transparent')
					$('.ui-colorpicker-buttonset', part).buttonset();

					$('.ui-colorpicker-special-color', part).click(function () {
						inst._change();
					});

					$('#'+id_none, part).click(function () {
						inst.color.set = false;
						inst._change();
					});

					$('#'+id_transparent, part).click(function () {
						inst.color.setAlpha(0);
						inst._change();
					});
				};

				this.repaint = function () {
					if (!inst.color.set) {
						$('.ui-colorpicker-special-none', part).attr('checked', true).button( "refresh" );
					} else if (inst.color.getAlpha() === 0) {
						$('.ui-colorpicker-special-transparent', part).attr('checked', true).button( "refresh" );
					} else {
						$('input', part).attr('checked', false).button( "refresh" );
					}

					$('.ui-colorpicker-cancel', part).button(inst.changed ? 'enable' : 'disable');
				};

				this.update = function () {};
			}
		};

		this.Color = function () {
			var spaces = {	rgb:	{r: 0, g: 0, b: 0},
							hsv:	{h: 0, s: 0, v: 0},
							hsl:	{h: 0, s: 0, l: 0},
							lab:	{l: 0, a: 0, b: 0},
							cmyk:	{c: 0, m: 0, y: 0, k: 1}
						},
				a = 1,
				illuminant = [0.9504285, 1, 1.0889],	// CIE-L*ab D65/2' 1931
				args = arguments,
				_clip = function(v) {
					if (isNaN(v) || v === null) {
						return 0;
					}
					if (typeof v == 'string') {
						v = parseInt(v, 10);
					}
					return Math.max(0, Math.min(v, 1));
				},
				_hexify = function (number) {
					var digits = '0123456789abcdef',
						lsd = number % 16,
						msd = (number - lsd) / 16,
						hexified = digits.charAt(msd) + digits.charAt(lsd);
					return hexified;
				},
				_rgb_to_xyz = function(rgb) {
					var r = (rgb.r > 0.04045) ? Math.pow((rgb.r + 0.055) / 1.055, 2.4) : rgb.r / 12.92,
						g = (rgb.g > 0.04045) ? Math.pow((rgb.g + 0.055) / 1.055, 2.4) : rgb.g / 12.92,
						b = (rgb.b > 0.04045) ? Math.pow((rgb.b + 0.055) / 1.055, 2.4) : rgb.b / 12.92;

					return {
						x: r * 0.4124 + g * 0.3576 + b * 0.1805,
						y: r * 0.2126 + g * 0.7152 + b * 0.0722,
						z: r * 0.0193 + g * 0.1192 + b * 0.9505
					};
				},
				_xyz_to_rgb = function(xyz) {
					var rgb = {
						r: xyz.x *  3.2406 + xyz.y * -1.5372 + xyz.z * -0.4986,
						g: xyz.x * -0.9689 + xyz.y *  1.8758 + xyz.z *  0.0415,
						b: xyz.x *  0.0557 + xyz.y * -0.2040 + xyz.z *  1.0570
					};

					rgb.r = (rgb.r > 0.0031308) ? 1.055 * Math.pow(rgb.r, (1 / 2.4)) - 0.055 : 12.92 * rgb.r;
					rgb.g = (rgb.g > 0.0031308) ? 1.055 * Math.pow(rgb.g, (1 / 2.4)) - 0.055 : 12.92 * rgb.g;
					rgb.b = (rgb.b > 0.0031308) ? 1.055 * Math.pow(rgb.b, (1 / 2.4)) - 0.055 : 12.92 * rgb.b;

					return rgb;
				},
				_rgb_to_hsv = function(rgb) {
					var minVal = Math.min(rgb.r, rgb.g, rgb.b),
						maxVal = Math.max(rgb.r, rgb.g, rgb.b),
						delta = maxVal - minVal,
						del_R, del_G, del_B,
						hsv = {
							h: 0,
							s: 0,
							v: maxVal
						};

					if (delta === 0) {
						hsv.h = 0;
						hsv.s = 0;
					} else {
						hsv.s = delta / maxVal;

						del_R = (((maxVal - rgb.r) / 6) + (delta / 2)) / delta;
						del_G = (((maxVal - rgb.g) / 6) + (delta / 2)) / delta;
						del_B = (((maxVal - rgb.b) / 6) + (delta / 2)) / delta;

						if (rgb.r === maxVal) {
							hsv.h = del_B - del_G;
						} else if (rgb.g === maxVal) {
							hsv.h = (1 / 3) + del_R - del_B;
						} else if (rgb.b === maxVal) {
							hsv.h = (2 / 3) + del_G - del_R;
						}

						if (hsv.h < 0) {
							hsv.h += 1;
						} else if (hsv.h > 1) {
							hsv.h -= 1;
						}
					}

					return hsv;
				},
				_hsv_to_rgb = function(hsv) {
					var rgb = {
							r: 0,
							g: 0,
							b: 0
						},
						var_h,
						var_i,
						var_1,
						var_2,
						var_3;

					if (hsv.s === 0) {
						rgb.r = rgb.g = rgb.b = hsv.v;
					} else {
						var_h = hsv.h === 1 ? 0 : hsv.h * 6;
						var_i = Math.floor(var_h);
						var_1 = hsv.v * (1 - hsv.s);
						var_2 = hsv.v * (1 - hsv.s * (var_h - var_i));
						var_3 = hsv.v * (1 - hsv.s * (1 - (var_h - var_i)));

						if (var_i === 0) {
							rgb.r = hsv.v;
							rgb.g = var_3;
							rgb.b = var_1;
						} else if (var_i === 1) {
							rgb.r = var_2;
							rgb.g = hsv.v;
							rgb.b = var_1;
						} else if (var_i === 2) {
							rgb.r = var_1;
							rgb.g = hsv.v;
							rgb.b = var_3;
						} else if (var_i === 3) {
							rgb.r = var_1;
							rgb.g = var_2;
							rgb.b = hsv.v;
						} else if (var_i === 4) {
							rgb.r = var_3;
							rgb.g = var_1;
							rgb.b = hsv.v;
						} else {
							rgb.r = hsv.v;
							rgb.g = var_1;
							rgb.b = var_2;
						}
					}

					return rgb;
				},
				_rgb_to_hsl = function(rgb) {
					var minVal = Math.min(rgb.r, rgb.g, rgb.b),
						maxVal = Math.max(rgb.r, rgb.g, rgb.b),
						delta = maxVal - minVal,
						del_R, del_G, del_B,
						hsl = {
							h: 0,
							s: 0,
							l: (maxVal + minVal) / 2
						};

					if (delta === 0) {
						hsl.h = 0;
						hsl.s = 0;
					} else {
						hsl.s = hsl.l < 0.5 ? delta / (maxVal + minVal) : delta / (2 - maxVal - minVal);

						del_R = (((maxVal - rgb.r) / 6) + (delta / 2)) / delta;
						del_G = (((maxVal - rgb.g) / 6) + (delta / 2)) / delta;
						del_B = (((maxVal - rgb.b) / 6) + (delta / 2)) / delta;

						if (rgb.r === maxVal) {
							hsl.h = del_B - del_G;
						} else if (rgb.g === maxVal) {
							hsl.h = (1 / 3) + del_R - del_B;
						} else if (rgb.b === maxVal) {
							hsl.h = (2 / 3) + del_G - del_R;
						}

						if (hsl.h < 0) {
							hsl.h += 1;
						} else if (hsl.h > 1) {
							hsl.h -= 1;
						}
					}

					return hsl;
				},
				_hsl_to_rgb = function(hsl) {
					var var_1,
						var_2,
						hue_to_rgb	= function(v1, v2, vH) {
										if (vH < 0) {
											vH += 1;
										}
										if (vH > 1) {
											vH -= 1;
										}
										if ((6 * vH) < 1) {
											return v1 + (v2 - v1) * 6 * vH;
										}
										if ((2 * vH) < 1) {
											return v2;
										}
										if ((3 * vH) < 2) {
											return v1 + (v2 - v1) * ((2 / 3) - vH) * 6;
										}
										return v1;
									};

					if (hsl.s === 0) {
						return {
							r: hsl.l,
							g: hsl.l,
							b: hsl.l
						};
					}

					var_2 = (hsl.l < 0.5) ? hsl.l * (1 + hsl.s) : (hsl.l + hsl.s) - (hsl.s * hsl.l);
					var_1 = 2 * hsl.l - var_2;

					return {
						r: hue_to_rgb(var_1, var_2, hsl.h + (1 / 3)),
						g: hue_to_rgb(var_1, var_2, hsl.h),
						b: hue_to_rgb(var_1, var_2, hsl.h - (1 / 3))
					};
				},
				_xyz_to_lab = function(xyz) {
					var x = xyz.x / illuminant[0],
						y = xyz.y / illuminant[1],
						z = xyz.z / illuminant[2];

					x = (x > 0.008856) ? Math.pow(x, (1/3)) : (7.787 * x) + (16/116);
					y = (y > 0.008856) ? Math.pow(y, (1/3)) : (7.787 * y) + (16/116);
					z = (z > 0.008856) ? Math.pow(z, (1/3)) : (7.787 * z) + (16/116);

					return {
						l: ((116 * y) - 16) / 100,	// [0,100]
						a: ((500 * (x - y)) + 128) / 255,	// [-128,127]
						b: ((200 * (y - z))	+ 128) / 255	// [-128,127]
					};
				},
				_lab_to_xyz = function(lab) {
					var lab2 = {
							l: lab.l * 100,
							a: (lab.a * 255) - 128,
							b: (lab.b * 255) - 128
						},
						xyz = {
							x: 0,
							y: (lab2.l + 16) / 116,
							z: 0
						};

					xyz.x = lab2.a / 500 + xyz.y;
					xyz.z = xyz.y - lab2.b / 200;

					xyz.x = (Math.pow(xyz.x, 3) > 0.008856) ? Math.pow(xyz.x, 3) : (xyz.x - 16 / 116) / 7.787;
					xyz.y = (Math.pow(xyz.y, 3) > 0.008856) ? Math.pow(xyz.y, 3) : (xyz.y - 16 / 116) / 7.787;
					xyz.z = (Math.pow(xyz.z, 3) > 0.008856) ? Math.pow(xyz.z, 3) : (xyz.z - 16 / 116) / 7.787;

					xyz.x *= illuminant[0];
					xyz.y *= illuminant[1];
					xyz.z *= illuminant[2];

					return xyz;
				},
				_rgb_to_cmy = function(rgb) {
					return {
						c: 1 - (rgb.r),
						m: 1 - (rgb.g),
						y: 1 - (rgb.b)
					};
				},
				_cmy_to_rgb = function(cmy) {
					return {
						r: 1 - (cmy.c),
						g: 1 - (cmy.m),
						b: 1 - (cmy.y)
					};
				},
				_cmy_to_cmyk = function(cmy) {
					var K = 1;

					if (cmy.c < K) {
						K = cmy.c;
					}
					if (cmy.m < K) {
						K = cmy.m;
					}
					if (cmy.y < K) {
						K = cmy.y;
					}

					if (K === 1) {
						return {
							c: 0,
							m: 0,
							y: 0,
							k: 1
						};
					}

					return {
						c: (cmy.c - K) / (1 - K),
						m: (cmy.m - K) / (1 - K),
						y: (cmy.y - K) / (1 - K),
						k: K
					};
				},
				_cmyk_to_cmy = function(cmyk) {
					return {
						c: cmyk.c * (1 - cmyk.k) + cmyk.k,
						m: cmyk.m * (1 - cmyk.k) + cmyk.k,
						y: cmyk.y * (1 - cmyk.k) + cmyk.k
					};
				};

			this.set = false;

			this.setAlpha = function(_a) {
				if (_a !== null) {
					a = _clip(_a);
				}
				this.set = true;

				return this;
			};

			this.getAlpha = function() {
				return a;
			};

			this.setRGB = function(r, g, b) {
				spaces = { rgb: this.getRGB() };
				if (r !== null) {
					spaces.rgb.r = _clip(r);
				}
				if (g !== null) {
					spaces.rgb.g = _clip(g);
				}
				if (b !== null) {
					spaces.rgb.b = _clip(b);
				}
				this.set = true;

				return this;
			};

			this.setHSV = function(h, s, v) {
				spaces = {hsv: this.getHSV()};
				if (h !== null) {
					spaces.hsv.h = _clip(h);
				}
				if (s !== null)	{
					spaces.hsv.s = _clip(s);
				}
				if (v !== null)	{
					spaces.hsv.v = _clip(v);
				}
				this.set = true;

				return this;
			};

			this.setHSL = function(h, s, l) {
				spaces = {hsl: this.getHSL()};
				if (h !== null)	{
					spaces.hsl.h = _clip(h);
				}
				if (s !== null) {
					spaces.hsl.s = _clip(s);
				}
				if (l !== null) {
					spaces.hsl.l = _clip(l);
				}
				this.set = true;

				return this;
			};

			this.setLAB = function(l, a, b) {
				spaces = {lab: this.getLAB()};
				if (l !== null) {
					spaces.lab.l = _clip(l);
				}
				if (a !== null) {
					spaces.lab.a = _clip(a);
				}
				if (b !== null) {
					spaces.lab.b = _clip(b);
				}
				this.set = true;

				return this;
			};

			this.setCMYK = function(c, m, y, k) {
				spaces = {cmyk: this.getCMYK()};
				if (c !== null) {
					spaces.cmyk.c = _clip(c);
				}
				if (m !== null) {
					spaces.cmyk.m = _clip(m);
				}
				if (y !== null) {
					spaces.cmyk.y = _clip(y);
				}
				if (k !== null) {
					spaces.cmyk.k = _clip(k);
				}
				this.set = true;

				return this;
			};

			this.getRGB = function() {
				if (!spaces.rgb) {
					spaces.rgb	= spaces.lab ?	_xyz_to_rgb(_lab_to_xyz(spaces.lab))
								: spaces.hsv ?	_hsv_to_rgb(spaces.hsv)
								: spaces.hsl ?	_hsl_to_rgb(spaces.hsl)
								: spaces.cmyk ?	_cmy_to_rgb(_cmyk_to_cmy(spaces.cmyk))
								: {r: 0, g: 0, b: 0};
					spaces.rgb.r = _clip(spaces.rgb.r);
					spaces.rgb.g = _clip(spaces.rgb.g);
					spaces.rgb.b = _clip(spaces.rgb.b);
				}
				return $.extend({}, spaces.rgb);
			};

			this.getHSV = function() {
				if (!spaces.hsv) {
					spaces.hsv	= spaces.lab ? _rgb_to_hsv(this.getRGB())
								: spaces.rgb ?	_rgb_to_hsv(spaces.rgb)
								: spaces.hsl ?	_rgb_to_hsv(this.getRGB())
								: spaces.cmyk ?	_rgb_to_hsv(this.getRGB())
								: {h: 0, s: 0, v: 0};
					spaces.hsv.h = _clip(spaces.hsv.h);
					spaces.hsv.s = _clip(spaces.hsv.s);
					spaces.hsv.v = _clip(spaces.hsv.v);
				}
				return $.extend({}, spaces.hsv);
			};

			this.getHSL = function() {
				if (!spaces.hsl) {
					spaces.hsl	= spaces.rgb ?	_rgb_to_hsl(spaces.rgb)
								: spaces.hsv ?	_rgb_to_hsl(this.getRGB())
								: spaces.cmyk ?	_rgb_to_hsl(this.getRGB())
								: spaces.hsv ?	_rgb_to_hsl(this.getRGB())
								: {h: 0, s: 0, l: 0};
					spaces.hsl.h = _clip(spaces.hsl.h);
					spaces.hsl.s = _clip(spaces.hsl.s);
					spaces.hsl.l = _clip(spaces.hsl.l);
				}
				return $.extend({}, spaces.hsl);
			};

			this.getCMYK = function() {
				if (!spaces.cmyk) {
					spaces.cmyk	= spaces.rgb ?	_cmy_to_cmyk(_rgb_to_cmy(spaces.rgb))
								: spaces.hsv ?	_cmy_to_cmyk(_rgb_to_cmy(this.getRGB()))
								: spaces.hsl ?	_cmy_to_cmyk(_rgb_to_cmy(this.getRGB()))
								: spaces.lab ?	_cmy_to_cmyk(_rgb_to_cmy(this.getRGB()))
								: {c: 0, m: 0, y: 0, k: 1};
					spaces.cmyk.c = _clip(spaces.cmyk.c);
					spaces.cmyk.m = _clip(spaces.cmyk.m);
					spaces.cmyk.y = _clip(spaces.cmyk.y);
					spaces.cmyk.k = _clip(spaces.cmyk.k);
				}
				return $.extend({}, spaces.cmyk);
			};

			this.getLAB = function() {
				if (!spaces.lab) {
					spaces.lab	= spaces.rgb ?	_xyz_to_lab(_rgb_to_xyz(spaces.rgb))
								: spaces.hsv ?	_xyz_to_lab(_rgb_to_xyz(this.getRGB()))
								: spaces.hsl ?	_xyz_to_lab(_rgb_to_xyz(this.getRGB()))
								: spaces.cmyk ?	_xyz_to_lab(_rgb_to_xyz(this.getRGB()))
								: {l: 0, a: 0, b: 0};
					spaces.lab.l = _clip(spaces.lab.l);
					spaces.lab.a = _clip(spaces.lab.a);
					spaces.lab.b = _clip(spaces.lab.b);
				}
				return $.extend({}, spaces.lab);
			};

			this.getChannels = function() {
				return {
					r:	this.getRGB().r,
					g:	this.getRGB().g,
					b:	this.getRGB().b,
					a:	this.getAlpha(),
					h:	this.getHSV().h,
					s:	this.getHSV().s,
					v:	this.getHSV().v,
					c:	this.getCMYK().c,
					m:	this.getCMYK().m,
					y:	this.getCMYK().y,
					k:	this.getCMYK().k,
					L:	this.getLAB().l,
					A:	this.getLAB().a,
					B:	this.getLAB().b
				};
			};

			this.getSpaces = function() {
				return $.extend(true, {}, spaces);
			};

			this.distance = function(color) {
				var space	= 'lab',
					getter	= 'get'+space.toUpperCase(),
					a = this[getter](),
					b = color[getter](),
					distance = 0,
					channel;

				for (channel in a) {
					distance += Math.pow(a[channel] - b[channel], 2);
				}

				return distance;
			};

			this.equals = function(color) {
				var a = this.getRGB(),
					b = color.getRGB();

				return this.getAlpha() === color.getAlpha()
					&& a.r === b.r
					&& a.g === b.g
					&& a.b === b.b;
			};

			this.limit = function(steps) {
				steps -= 1;
				var rgb = this.getRGB();
				this.setRGB(
					Math.round(rgb.r * steps) / steps,
					Math.round(rgb.g * steps) / steps,
					Math.round(rgb.b * steps) / steps
				);
			};

			this.toHex = function() {
				var rgb = this.getRGB();
				return _hexify(rgb.r * 255) + _hexify(rgb.g * 255) + _hexify(rgb.b * 255);
			};

			this.toCSS = function() {
				return '#' + this.toHex();
			};

			this.copy = function() {
				var color = new $.colorpicker.Color(this.getSpaces(), this.getAlpha());
				color.set = this.set;
				return color;
			};

			// Construct
			if (args.length === 2) {
				spaces = args[0];
				this.setAlpha(args[1] === 0 ? 0 : args[1] || 1);
				this.set = true;
			}
			if (args.length > 2) {
				this.setRGB(args[0], args[1], args[2]);
				this.setAlpha(args[3] === 0 ? 0 : args[3] || 1);
				this.set = true;
			}
		};
	}();

	$.widget("vanderlee.colorpicker", {
		options: {
			alpha:				false,		// Show alpha controls and mode
			altAlpha:			true,		// change opacity of altField as well?
			altField:			'',			// selector for DOM elements which change background color on change.
			altOnChange:		true,		// true to update on each change, false to update only on close.
			altProperties:		'background-color',	// comma separated list of any of 'background-color', 'color', 'border-color', 'outline-color'
			autoOpen:			false,		// Open dialog automatically upon creation
			buttonClass:		null,		// If set, the button will get this/these classname(s).
			buttonColorize:		false,
			buttonImage:		'images/ui-colorpicker.png',
			buttonImageOnly:	false,
			buttonText:			null,		// Text on the button and/or title of button image.
			closeOnEscape:		true,		// Close the dialog when the escape key is pressed.
			closeOnOutside:		true,		// Close the dialog when clicking outside the dialog (not for inline)
			color:				'#00FF00',	// Initial color (for inline only)
			colorFormat:		'HEX',		// Format string for output color format
			draggable:			true,		// Make popup dialog draggable if header is visible.
			containment:		null,		// Constrains dragging to within the bounds of the specified element or region.
			duration:			'fast',
			hsv:				true,		// Show HSV controls and modes
			inline:				true,		// Show any divs as inline by default
			inlineFrame:		true,		// Show a border and background when inline.
			layout: {
				map:		[0, 0, 1, 5],	// Left, Top, Width, Height (in table cells).
				bar:		[1, 0, 1, 5],
				preview:	[2, 0, 1, 1],
				hsv:		[2, 1, 1, 1],
				rgb:		[2, 2, 1, 1],
				alpha:		[2, 3, 1, 1],
				hex:		[2, 4, 1, 1],
				lab:		[3, 1, 1, 1],
				cmyk:		[3, 2, 1, 2],
				swatches:	[4, 0, 1, 5]
			},
			limit:				'',			// Limit color "resolution": '', 'websafe', 'nibble', 'binary', 'name'
			modal:				false,		// Modal dialog?
			mode:				'h',		// Initial editing mode, h, s, v, r, g, b or a
			okOnEnter:			false,		// Close (with OK) when pressing the enter key
			parts:				'',			// leave empty for automatic selection
			part: {
				map:		{ size: 256 },
				bar:		{ size: 256 }
			},			// options per part
			regional:			'',
			revert:				false,		// Revert color upon non
			rgb:				true,		// Show RGB controls and modes
			showAnim:			'fadeIn',
			showCancelButton:	true,
			showNoneButton:		false,
			showCloseButton:	true,
			showOn:				'focus click alt',		// 'focus', 'click', 'button', 'alt', 'both'
			showOptions:		{},
			swatches:			null,		// null for default or kv-object or names swatches set
			swatchesWidth:		84,			// width (in number of pixels) of swatches box.
			title:				null,

			cancel:             null,
            close:              null,
			init:				null,
			select:             null,
            ok:                 null,
			open:               null
		},

		_create: function () {
			var that = this,
				text;

			++_colorpicker_index;

			that.widgetEventPrefix = 'colorpicker';

			that.opened		= false;
			that.generated	= false;
			that.inline		= false;
			that.changed	= false;

			that.dialog		= null;
			that.button		= null;
			that.image		= null;
			that.overlay	= null;

			that.mode		= that.options.mode;

			if (that.element.is('input') || that.options.inline === false) {
				// Initial color
				that._setColor(that.element.is('input') ? that.element.val() : that.options.color);
				that._callback('init');

				// showOn focus
				if (/\bfocus|both\b/.test(that.options.showOn)) {
					that.element.bind('focus', function () {
						that.open();
					});
				}

				// showOn click
				if (/\bclick|both\b/.test(that.options.showOn)) {
					that.element.bind('click', function () {
						that.open();
					});
				}

				// showOn button
				if (/\bbutton|both\b/.test(that.options.showOn)) {
					if (that.options.buttonImage !== '') {
						text = that.options.buttonText || that._getRegional('button');

						that.image = $('<img/>').attr({
							'src':		that.options.buttonImage,
							'alt':		text,
							'title':	text
						});
						if (that.options.buttonClass) {
							that.image.attr('class', that.options.buttonClass);
						}

						that._setImageBackground();
					}

					if (that.options.buttonImageOnly && that.image) {
						that.button = that.image;
					} else {
						that.button = $('<button type="button"></button>').html(that.image || that.options.buttonText).button();
						that.image = that.image ? $('img', that.button).first() : null;
					}
					that.button.insertAfter(that.element).click(function () {
						that[that.opened ? 'close' : 'open']();
					});
				}

				// showOn alt
				if (/\balt|both\b/.test(that.options.showOn)) {
					$(that.options.altField).bind('click', function () {
						that.open();
					});
				}

				if (that.options.autoOpen) {
					that.open();
				}
			} else {
				that.inline = true;

				that._generate();
				that.opened = true;
			}

			return this;
		},

		_setOption: function(key, value){
			var that = this;

			switch (key) {
			case "disabled":
				if (value) {
					that.dialog.addClass('ui-colorpicker-disabled');
				} else {
					that.dialog.removeClass('ui-colorpicker-disabled');
				}
				break;
			}

			$.Widget.prototype._setOption.apply(that, arguments);
		},

		_setImageBackground: function() {
			if (this.image && this.options.buttonColorize) {
				this.image.css('background-color', this.color.set? this._formatColor('RGBA', this.color) : '');
			}
		},

		/**
		 * If an alternate field is specified, set it according to the current color.
		 */
		_setAltField: function () {
			if (this.options.altOnChange && this.options.altField && this.options.altProperties) {
				var index,
					property,
					properties = this.options.altProperties.split(',');

				for (index = 0; index <= properties.length; ++index) {
					property = $.trim(properties[index]);
					switch (property) {
						case 'color':
						case 'fill':
						case 'stroke':
						case 'background-color':
						case 'backgroundColor':
						case 'outline-color':
						case 'border-color':
							$(this.options.altField).css(property, this.color.set? this.color.toCSS() : '');
							break;
					}
				}

				if (this.options.altAlpha) {
					$(this.options.altField).css('opacity', this.color.set? this.color.getAlpha() : '');
				}
			}
		},

		_setColor: function(text) {
			this.color			= this._parseColor(text);
			this.currentColor	= this.color.copy();

			this._setImageBackground();
			this._setAltField();
		},

		setColor: function(text) {
			this._setColor(text);
			this._change();
		},

		getColor: function(format) {
			return this._formatColor(format || this.options.colorFormat, this.color);
		},

		_generateInline: function() {
			var that = this;

			$(that.element).html(that.options.inlineFrame ? _container_inlineFrame : _container_inline);

			that.dialog = $('.ui-colorpicker', that.element);
		},

		_generatePopup: function() {
			var that = this;

			$('body').append(_container_popup);
			that.dialog = $('.ui-colorpicker:last');

			// Close on clicking outside window and controls
			$(document).delegate('html', 'touchstart click', function (event) {
				if (!that.opened || event.target === that.element[0] || that.overlay) {
					return;
				}

				// Check if clicked on any part of dialog
				if (that.dialog.is(event.target) || that.dialog.has(event.target).length > 0) {
					that.element.blur();	// inside window!
					return;
				}

				// Check if clicked on known external elements
				var p,
					parents = $(event.target).parents();
				// add the event.target in case of buttonImageOnly and closeOnOutside both are set to true
				parents.push(event.target);
				for (p = 0; p <= parents.length; ++p) {
					// button
					if (that.button !== null && parents[p] === that.button[0]) {
						return;
					}
					// showOn alt
					if (/\balt|both\b/.test(that.options.showOn) && $(that.options.altField).is(parents[p])) {
						return;
					}
				}

				// no closeOnOutside
				if (!that.options.closeOnOutside) {
					return;
				}

				that.close(that.options.revert);
			});

			$(document).keydown(function (event) {
				// close on ESC key
				if (that.opened && event.keyCode === 27 && that.options.closeOnEscape) {
					that.close(that.options.revert);
				}

				// OK on Enter key
				if (that.opened && event.keyCode === 13 && that.options.okOnEnter) {
					that.close();
				}
			});

			// Close (with OK) on tab key in element
			that.element.keydown(function (event) {
				if (event.keyCode === 9) {
					that.close();
				}
			}).keyup(function (event) {
				var color = that._parseColor(that.element.val());
				if (!that.color.equals(color)) {
					that.color = color;
					that._change();
				}
			});
		},

		_generate: function () {
			var that = this,
				index,
				part,
				parts_list,
				layout_parts,
				table,
				classes;

			that._setColor(that.inline || !that.element.is('input') ? that.options.color : that.element.val());

			that[that.inline ? '_generateInline' : '_generatePopup']();

			// Determine the parts to include in this colorpicker
			if (typeof that.options.parts === 'string') {
				if ($.colorpicker.partslists[that.options.parts]) {
					parts_list = $.colorpicker.partslists[that.options.parts];
				} else {
					// automatic
					parts_list = $.colorpicker.partslists[that.inline ? 'inline' : 'popup'];
				}
			} else {
				parts_list = that.options.parts;
			}

			// Add any parts to the internal parts list
			that.parts = {};
			$.each(parts_list, function(index, part) {
				if ($.colorpicker.parts[part]) {
					that.parts[part] = new $.colorpicker.parts[part](that);
				}
			});

			if (!that.generated) {
				layout_parts = [];

				$.each(that.options.layout, function(part, pos) {
					if (that.parts[part]) {
						layout_parts.push({
							'part': part,
							'pos':  pos
						});
					}
				});

				table = $(_layoutTable(layout_parts, function(cell, x, y) {
					classes = ['ui-colorpicker-' + cell.part + '-container'];

					if (x > 0) {
						classes.push('ui-colorpicker-padding-left');
					}

					if (y > 0) {
						classes.push('ui-colorpicker-padding-top');
					}

					return '<td  class="' + classes.join(' ') + '"'
						+ (cell.pos[2] > 1 ? ' colspan="' + cell.pos[2] + '"' : '')
						+ (cell.pos[3] > 1 ? ' rowspan="' + cell.pos[3] + '"' : '')
						+ ' valign="top"></td>';
				})).appendTo(that.dialog);
				if (that.options.inlineFrame) {
					table.addClass('ui-dialog-content ui-widget-content');
				}

				that._initAllParts();
				that._updateAllParts();
				that.generated = true;
			}
		},

		_effectGeneric: function (element, show, slide, fade, callback) {
			var that = this;

			if ($.effects && $.effects[that.options.showAnim]) {
				element[show](that.options.showAnim, that.options.showOptions, that.options.duration, callback);
			} else {
				element[(that.options.showAnim === 'slideDown' ?
								slide
							:	(that.options.showAnim === 'fadeIn' ?
									fade
								:	show))]((that.options.showAnim ? that.options.duration : null), callback);
				if (!that.options.showAnim || !that.options.duration) {
					callback();
				}
			}
		},

		_effectShow: function(element, callback) {
			this._effectGeneric(element, 'show', 'slideDown', 'fadeIn', callback);
		},

		_effectHide: function(element, callback) {
			this._effectGeneric(element, 'hide', 'slideUp', 'fadeOut', callback);
		},

		open: function() {
			var that = this,
				offset,
				bottom, right,
				height, width,
				x, y,
				zIndex,
				hiddenPlaceholder;

			if (!that.opened) {
				that._generate();

				if (that.element.is(':hidden')) {
					hiddenPlaceholder = $('<div/>').insertBefore(that.element);
					offset	= hiddenPlaceholder.offset();
					hiddenPlaceholder.remove();
				} else {
					offset	= that.element.offset();
				}
				bottom	= $(window).height() + $(window).scrollTop();
				right	= $(window).width() + $(window).scrollLeft();
				height	= that.dialog.outerHeight(false);
				width	= that.dialog.outerWidth();
				x		= offset.left;
				y		= offset.top + that.element.outerHeight(false);

				if (x + width > right) {
					x = Math.max(0, right - width);
				}

				if (y + height > bottom) {
					if (offset.top - height >= $(window).scrollTop()) {
						y = offset.top - height;
					} else {
						y = Math.max(0, bottom - height);
					}
				}

				that.dialog.css({'left': x, 'top': y});

				// Automatically find highest z-index.
				zIndex = 0;
				$(that.element[0]).parents().each(function() {
					var z = $(this).css('z-index');
					if ((typeof(z) === 'number' || typeof(z) === 'string') && z !== '' && !isNaN(z)) {
						if (z > zIndex) {
							zIndex = parseInt(z, 10);
							return false;
						}
					}
					else {
						$(this).siblings().each(function() {
							var z = $(this).css('z-index');
							if ((typeof(z) === 'number' || typeof(z) === 'string') && z !== '' && !isNaN(z)) {
								if (z > zIndex) {
									zIndex = parseInt(z, 10);
								}
							}
						});
					}
				});

				// @todo zIndexOffset option, to raise above other elements?
				that.dialog.css('z-index', zIndex += 2);

				that.overlay = that.options.modal ? new $.ui.dialog.overlay(that) : null;
				if (that.overlay !== null) {
					var z = that.overlay.$el.css('z-index');
					if ((typeof(z) === 'number' || typeof(z) === 'string') && z !== '' && !isNaN(z)) {
						that.dialog.css('z-index', zIndex + z + 2);
					}
				}

				that._effectShow(this.dialog);
				that.opened = true;
				that._callback('open', true);

				// Without waiting for domready the width of the map is 0 and we
				// wind up with the cursor stuck in the upper left corner
				$(function() {
					that._repaintAllParts();
				});
			}
		},

		close: function (cancel) {
			var that = this;

            if (cancel) {
				that.color = that.currentColor.copy();
                that._change();
                that._callback('cancel', true);
            } else {
				that.currentColor	= that.color.copy();
                that._callback('ok', true);
            }
			that.changed		= false;

			// tear down the interface
			that._effectHide(that.dialog, function () {
				that.dialog.remove();
				that.dialog	= null;
				that.generated	= false;

				that.opened		= false;
				that._callback('close', true);
			});

			if (that.overlay) {
				that.overlay.destroy();
			}
		},

		destroy: function() {
			this.element.unbind();

			if (this.image !== null) {
				this.image.remove();
			}

			if (this.button !== null) {
				this.button.remove();
			}

			if (this.dialog !== null) {
				this.dialog.remove();
			}

			if (this.overlay) {
				this.overlay.destroy();
			}
		},

		_callback: function (callback, spaces) {
			var that = this,
				data,
				lab;

			if (that.color.set) {
				data = {
					formatted: that._formatColor(that.options.colorFormat, that.color),
					colorPicker: that
				};

				lab = that.color.getLAB();
				lab.a = (lab.a * 2) - 1;
				lab.b = (lab.b * 2) - 1;

				if (spaces === true) {
					data.a		= that.color.getAlpha();
					data.rgb	= that.color.getRGB();
					data.hsv	= that.color.getHSV();
					data.cmyk	= that.color.getCMYK();
					data.hsl	= that.color.getHSL();
					data.lab	= lab;
				}

				return that._trigger(callback, null, data);
			} else {
				return that._trigger(callback, null, {
					formatted: '',
					colorPicker: that
				});
			}
		},

		_initAllParts: function () {
			$.each(this.parts, function (index, part) {
				if (part.init) {
					part.init();
				}
			});
		},

		_updateAllParts: function () {
			$.each(this.parts, function (index, part) {
				if (part.update) {
					part.update();
				}
			});
		},

		_repaintAllParts: function () {
			$.each(this.parts, function (index, part) {
				if (part.repaint) {
					part.repaint();
				}
			});
		},

		_change: function () {
			this.changed = true;

			// Limit color palette
			if (this.options.limit && $.colorpicker.limits[this.options.limit]) {
				$.colorpicker.limits[this.options.limit](this.color, this);
			}

			// update input element content
			if (!this.inline) {
				if (!this.color.set) {
					this.element.val('');
				} else if (!this.color.equals(this._parseColor(this.element.val()))) {
					this.element.val(this._formatColor(this.options.colorFormat, this.color));
				}

				this._setImageBackground();
				this._setAltField();
			}

			// update color option
			this.options.color = this.color.set ? this.color.toCSS() : '';

			if (this.opened) {
				this._repaintAllParts();
			}

			// callback
			this._callback('select');
		},

		// This will be deprecated by jQueryUI 1.9 widget
		_hoverable: function (e) {
			e.hover(function () {
				e.addClass("ui-state-hover");
			}, function () {
				e.removeClass("ui-state-hover");
			});
		},

		// This will be deprecated by jQueryUI 1.9 widget
		_focusable: function (e) {
			e.focus(function () {
				e.addClass("ui-state-focus");
			}).blur(function () {
				e.removeClass("ui-state-focus");
			});
		},

		_getRegional: function(name) {
			return $.colorpicker.regional[this.options.regional][name] !== undefined ?
				$.colorpicker.regional[this.options.regional][name] : $.colorpicker.regional[''][name];
        },

		_getSwatches: function() {
			if (typeof(this.options.swatches) === 'string') {
				return $.colorpicker.swatches[this.options.swatches];
			}

			if ($.isPlainObject(this.options.swatches)) {
				return this.colorpicker.swatches;
			}

			return $.colorpicker.swatches.html;
		},

		_eachSwatch: function (callback) {
			var currentSwatches = this._getSwatches();
			var name;
			$.each(currentSwatches, function (nameOrIndex, swatch) {
				if ($.isArray(currentSwatches)) {
					name = swatch.name;
				} else {
					name = nameOrIndex;
				}
				callback(name, swatch);
			});
		},

		_getSwatch: function(name) {
			var swatch = false;

			this._eachSwatch(function(swatchName, current) {
				if (swatchName.toLowerCase() == name.toLowerCase()) {
					swatch = current;
					return false;
				}
				return true;
			});

			return swatch;
        },

        _parseColor: function(color) {
            var that = this,
				c;

			$.each($.colorpicker.parsers, function(name, parser) {
				c = parser(color, that);
				if (c) {
					return false;
				}
			});

			if (c) {
				return c;
			}

			return new $.colorpicker.Color();
        },

		_exactName: function(color) {
			var name	= false;

			this._eachSwatch(function(n, swatch) {
				if (color.equals(new $.colorpicker.Color(swatch.r, swatch.g, swatch.b))) {
					name = n;
					return false;
				}
				return true;
			});

			return name;
		},

		_closestName: function(color) {
			var rgb			= color.getRGB(),
				distance	= null,
				name		= false,
				d;

			this._eachSwatch(function(n, swatch) {
				d = color.distance(new $.colorpicker.Color(swatch.r, swatch.g, swatch.b));
				if (d < distance || distance === null) {
					name = n;
					if (d === 0) {
						return false;	// can't get much closer than 0
					}
					distance = d;
				}
				return true;
			});

			return name;
		},

		_formatColor: function (formats, color) {
			var that		= this,
				text		= null,
				types		= {	'x':	function(v) {return _intToHex(v * 255);}
							,	'd':	function(v) {return Math.floor(v * 255);}
							,	'f':	function(v) {return v;}
							,	'p':	function(v) {return v * 100;}
							},
				channels	= color.getChannels();

			if (!$.isArray(formats)) {
				formats = [formats];
			}

			$.each(formats, function(index, format) {
				if ($.colorpicker.writers[format]) {
					text = $.colorpicker.writers[format](color, that);
					return (text === false);
				} else {
					text = format.replace(/\\?[argbhsvcmykLAB][xdfp]/g, function(m) {
						if (m.match(/^\\/)) {
							return m.slice(1);
						}
						return types[m.charAt(1)](channels[m.charAt(0)]);
					});
					return false;
				}
			});

			return text;
		}
	});
}(jQuery));
;
(function ($) {

  var cache_shortcode = [];

  $.fn.outerHTML = function() {
    return $('<div />').append(this.eq(0).clone()).html();
  };

  orig_allowInteraction = $.ui.dialog.prototype._allowInteraction;
  $.ui.dialog.prototype._allowInteraction = function(event) {
    if ($(event.target).closest('.cke_dialog').length) {
      return true;
    }
    return orig_allowInteraction.apply(this, arguments);
  };

  $.fn.removeClassPrefix = function(prefix) {
      this.each(function(i, el) {
          var classes = el.className.split(" ").filter(function(c) {
              return c.lastIndexOf(prefix, 0) !== 0;
          });
          el.className = classes.join(" ");
      });
      return this;
  };

  var global_counter = 0;

  function nd_visualshortcodes_add_overlay() {
    $('body').append('<div class = "nd-visualshortcodes-overlay"><i class="fa fa-refresh fa-spin"></i></div>');
  }

  function nd_visualshortcodes_remove_overlay() {
    $('.nd-visualshortcodes-overlay').remove();
  }

  /**
   * Ajax delivery command to open shortcode settings form
   */
  Drupal.ajax.prototype.commands.shortcode_settings = function (ajax, response, status) {
    if (response.data) {
      $("#nd-visualshortcodes-shortcode-settings").html(response.data);
      $("#nd-visualshortcodes-shortcode-settings").dialog('open');
    }
    nd_visualshortcodes_remove_overlay();
  };

  Drupal.behaviors.nd_visualshortcodes = {
    attach: function (context, settings) {

      $('.nd_visualshortcodes_links:not(.default-hide-processed)', context).once('default-hide').hide();

      // Load Visual Shortcodes layout
      $('.nd_visualshortcodes_links:not(.nd-visual-shortcodes-processed)', context).once('nd-visual-shortcodes').click(function() {
        if(!Drupal.settings.nd_visualshortcodes.formats[$(this).data('format')]) {
          return;
        }
        // Remove the old Layout
        $('#' + $(this).attr('data-id')).prev('.nd_visualshortcodes').remove();
        // Upload Visual Shortcodes if Enable text clicked
        if($(this).text() == $(this).attr('data-enable-text')) {
          var shortcode = $('#' + $(this).attr('data-id')).val();
          $(this).parent().find('> .fa-spin').show();
          $this = $(this);
          $.ajax({
            async: false,
            type: 'POST',
            url: Drupal.settings.basePath + '?q=ajax/nd_visualshortcodes/ajax_backend_layout',
            data: {
              code: shortcode,
              format : $(this).data('format')
            },
            dataType: 'html',
            success: function(layout) {
              $('#' + $this.attr('data-id')).before(layout);
              $this.parent().find('> .fa-spin').hide();
              nd_visualshortcodes_link_text_update($this);
              Drupal.attachBehaviors($('#' + $this.attr('data-id')).prev(), Drupal.settings);
            }
          });
        }
        else {
          nd_visualshortcodes_link_text_update($(this));
        }
        return false;
      });

      // Shortcode Copy
      $('.nd-visualshortcodes-copy:not(.nd-visualshortcodes-processed)', context).once('nd-visualshortcodes').click(function() {
        var clone = $(this).closest('.shortcode-processed').outerHTML();
        $(this).closest('.shortcode-processed').after(clone);
        $(this).closest('.shortcode-processed').next().find('.nd-visualshortcodes-processed').removeClass('nd-visualshortcodes-processed');
        Drupal.attachBehaviors($(this).closest('.shortcode-processed').parent(), Drupal.settings);
        nd_visualshortcodes_save($(this).closest('.nd_visualshortcodes').next());
      });

      function nd_visualshortcodes_collect_attrs($this) {
        var attributes = $this.length ? $this.prop("attributes") : {};
        var attrs_array = {};
        $.each(attributes, function() {
          if(this.name != 'shortcode') {
            // Convert "{${" to "[", "}$}" to "]", "|{" to "<" and "|}" to ">"
            attrs_array[this.name] = this.value.replace(/\|LS\|/g, '[').replace(/\|RS\|/g, ']').replace(/\|LF\|/g, '{').replace(/\|RF\|/g, '}').replace(/\|\{/g, '<').replace(/\|\}/g, '>');
          }
        });
        return attrs_array;
      }

      // Show the Shortcode Settings Form
      $('.shortcode-settings:not(.nd-visualshortcodes-processed)', context).once('nd-visualshortcodes').click(function() {        
        nd_visualshortcodes_add_overlay();
        $this = $(this).closest('.shortcode-processed');
        $(this).parents('.nd_visualshortcodes').addClass('nd_active_layout');
        $('.shortcode-opened-settings').removeClass('shortcode-opened-settings');
        // Mark shortcode which opened the Settings Form
        $this.addClass('shortcode-opened-settings');
        var attributes = $this.prop("attributes");
        var attrs_array = nd_visualshortcodes_collect_attrs($this);
        var html = $this.find('.hidden:first').html();
        if(typeof(html) == 'string') {
          // Allow to add "[" and "]" to HTML shortcode
          html = html.replace(/\|LS\|/g, '[').replace(/\|RS\|/g, ']').replace(/\|LF\|/g, '{').replace(/\|RF\|/g, '}');
        }
        // Load the Settings form via default Drupal AJAX request
        var ajax = new Drupal.ajax(false, '#doesnt-matter', {url : Drupal.settings.basePath + '?q=admin_ajax/nd_visualshortcodes/ajax_backend_shortcode'});
        ajax.beforeSerialize = function (element_settings, options) {
          options['data']['shortcode'] = $this.attr('shortcode');
          options['data']['attrs'] = attrs_array;
          options['data']['text'] = html;
          return options;
        };
        // Run ajax request
        ajax.eventResponse(ajax, {});
      });

      // Add new shortcode form
      $('.nd_visualshortcodes_add:not(.nd-visualshortcodes-processed)', context).once('nd-visualshortcodes').click(function() {
        nd_visualshortcodes_add_form($(this));
      });

      $('.nd_visualshortcodes_enabled_links:not(.nd-visualshortcodes-processed) a', context).once('nd-visualshortcodes').click(function() {
        $('.nd_visualshortcodes_enabled_links .active').removeClass('active');
        $(this).addClass('active');
        return false;
      });

      // Search on the Add Shortcode Form
      $('.nd_visualshortcodes_enabled_list_search input:not(.nd-visualshortcodes-processed)', context).once('nd-visualshortcodes').keyup(function() {
        nd_visualshortcodes_add_form_search($(this));
      });
      $('.nd_visualshortcodes_enabled_list_search input', context).keyup();

      // Update Visual Shortcode status upon Textarea format is changed
      $('.filter-list:not(.nd-visual-shortcodes-format-processed)', context).once('nd-visual-shortcodes-format').change(function() {

        // Disable visual shortcodes if they enabled because the text format is changed
        var text_link = $(this).parents('.text-format-wrapper').find('.nd_visualshortcodes_links:first').text(),
            text_disable_link = $(this).parents('.text-format-wrapper').find('.nd_visualshortcodes_links').data('disable-text'),
            format_link = $(this).parents('.text-format-wrapper').find('.nd_visualshortcodes_links').data('format');
        if(text_link == text_disable_link && format_link != $(this).val()) {
          $(this).parents('.text-format-wrapper').find('.nd_visualshortcodes_links').click();
        }

        if(typeof(Drupal.settings.nd_visualshortcodes.formats) != 'undefined' && typeof(Drupal.settings.nd_visualshortcodes.formats[$(this).val()]) != 'undefined' && Drupal.settings.nd_visualshortcodes.formats[$(this).val()]) {
          // Setup the format for easy use then Layout will be rendered
          $(this).parents('.text-format-wrapper').find('.nd_visualshortcodes_links').data('format', $(this).val());
          $(this).parents('.text-format-wrapper').find('.nd_visualshortcodes_links, .nd_visualshortcodes').show();
        }
        else {
          $(this).parents('.text-format-wrapper').find('.nd_visualshortcodes_links, .nd_visualshortcodes').hide();
          $(this).parents('.text-format-wrapper').find('.form-textarea').show();
        }

      });

      // Update all Visual Shortcode link status
      nd_visualshortcodes_link_text_update($('.nd_visualshortcodes_links', context));

      // Autostart
      if(Drupal.settings.nd_visualshortcodes.autostart) {
        $('.nd_visualshortcodes_links:not(.autostart-processed)', context).once('autostart').click();
      }

      // Sortable Layout
      $('.nd_visualshortcodes:not(.sort-processed)').once('sort').sortable({
        containerSelector: '.nd-visualshortcodes-parent',
        containerPath: '> .border-style',
        delay: 200,
        onDrop:function ($item, container, _super, event) {
          $item.removeClass("dragged").removeAttr("style");
          $("body").removeClass("dragging");
          nd_visualshortcodes_save($item.parents('.nd_visualshortcodes').next());
        }
      });

      $('.nd-visualshortcodes-parent').disableSelection();

      // Setup correct classes for COL shortcode
      $('[shortcode="col"]', context).each(function() {
        $(this).removeClassPrefix('col');
        var classes = {'phone' : 'xs', 'tablet' : 'sm', 'desktop' : 'md', 'wide' : 'lg'};
        for (i in classes) {
          if ($(this).attr(i)) {
            $(this).addClass('col-' + classes[i] + '-' + $(this).attr(i));
          }
        }
      });

      $('.colorpicker-enable:not(.color-processed)', context).once('color').colorpicker();

    } // End of attach behaviour
  }; // End behaviour


  // Handle the Media Upload
  Drupal.behaviors.nd_visualshortcodes_media_upload = {
    attach: function (context, settings) {

      $('.media-upload:not(.nd_media-processed)', context).once('nd_media').each(function() {
        $(this).click(function() {
          nd_visualshortcodes_upload_image($(this));
          return false;
        });
        // Hide Delete button if there is no image
        if(!$(this).closest('.form-item').find('input').val()) {
          $(this).parent().find('.media-remove').hide();
        }
      });

      $('.media-remove:not(.nd_media-processed)', context).once('nd_media').click(function() {
        nd_visualshortcodes_remove_image($(this));
        return false;
      });

    } // End of attach behaviour
  }; // End behaviour

  // Add styles to Checkboxes
  Drupal.behaviors.styling_form = {
    attach: function (context, settings) {

      $('.form-checkbox:not(.styled-processed)', context).addClass('styled-processed').each(function() {
        if($(this).parents('.ui-dialog').length) {
          var switchery = new Switchery(this);
        }
      });

    } // End of attach behaviour
  }; // End behaviour


  /**
  * Save Visual Shortcodes to textarea value
  */
  function nd_visualshortcodes_save($textarea) {
    var shortcode = '<div class = "hidden nd_visualshortcodes_save_render">' + $textarea.prev('.nd_visualshortcodes').html() + '</div>';
    $('body').append(shortcode);
    // Process NoChilds tag, remove 'hidden' wrapped tag
    $('.nd_visualshortcodes_save_render .border-style > .hidden').each(function() {
      //$(this).parent().html($(this).html().replace(/\{\$\{/g, '[').replace(/\}\$\}/g, ']'));
      $(this).parent().html($(this).html().replace(/\[/g, '|LS|').replace(/\]/g, '|RS|').replace(/\{/g, '|LF|').replace(/\}/g, '|RF|'));
    });

    // Remove styling tags
    $('.nd_visualshortcodes_save_render').find('.border-style').each(function() {
      _nd_visualshortcodes_remove_borders($(this));
    });
    $('.nd_visualshortcodes_save_render').find('.nd-visualshortcodes-settings-links, .nd-visualshortcodes-remove, .nd_backend_preview').remove();

    $('.nd_visualshortcodes_save_render').find('.shortcode-processed').removeClass('shortcode-processed nd-visualshortcodes-parent-wrap row shortcode-opened-settings nd-visualshortcodes-sortable nd-visualshortcodes-parent sort-processed ui-sortable').removeClassPrefix('col').removeClassPrefix('nd-visualshortcodes');
    // Replace tag name with shortcode name
    $('.nd_visualshortcodes_save_render > [shortcode!=""]').each(function() {
      prepare_to_shortcodes($(this));
    });
    var html = $('.nd_visualshortcodes_save_render').html().replace(/(\r\n|\n|\r)/gm, "");
    html.replace(/(<(ndvs_([^0-9]+)[0-9]*))([^>]*)>(.*)(<\/\2>)/g, '[$3$4]\n$5\n[/$3]\n', "g");
    html.replace("\u2028", "\\u2028").replace("\u2029", "\\u2029");
    while(html.indexOf('<ndvs_') >= 0) {
      html = html.replace(/(<(ndvs_([^0-9]+)[0-9]*))([^>]*)>(.*)(<\/\2>)/g, '\n[$3$4]$5[/$3]\n', "g");
    }
    html = html.replace(/[ ]+/g, ' ').replace(/^([^\S]*)/, '').replace(/\]([^\S\[]*)\[/g, ']\n[').replace(/[\n]+/g, '\n');
    $textarea.val(html);
    $('.nd_visualshortcodes_save_render').remove();
    return false;
  }


  function _nd_visualshortcodes_remove_borders($this) {
    $this.find('.border-style').each(function() {
      _nd_visualshortcodes_remove_borders($(this));
    });
    $this.parent().html($this.html());
  }

  function _shortcode_form_to_settings($target_form) {
    $target_form.submit();
    settings = {};
    $target_form.find(':input').each(function() {
      if($(this).attr('type') == 'hidden' && !$(this).hasClass('.form-textarea') && !$(this).hasClass('.hidden')) {
        return;
      }
      var value = '';
      if($(this).attr('type') == 'checkbox') {
        value = $(this).is(':checked') ? 1 : 0;
      }
      else if($(this).attr('type') == 'radio') {
        value = $(this).closest('.form-radios').find('input[type="radio"]:checked').val();
      }
      else {
        value = $(this).val();
      }
      settings[$(this).attr('name')] = value;
    });    
    return settings;
  }

  function _settings_to_shortcode_attrs(settings, $shortcode) {
    for (i in settings) {
      // Process HTML shortcode text value 
      if(i.indexOf('text_') == 0 && i.indexOf('[value]') > -1) {
        // Allow to add "[" and "]" to HTML shortcode
        $shortcode.find('h3').next().html(settings[i].replace(/\[/g, '|LS|').replace(/\]/g, '|RS|').replace(/\{/g, '|LF|').replace(/\}/g, '|RF|'));
      }
      else if(i.indexOf('text_') == 0 && i.indexOf('[format]') > -1) {
        $shortcode.attr('format', settings[i]);
      }
      else if(!settings[i] && settings[i] !== 0) {
        $shortcode.removeAttr(i);
      }
      else {
        if (typeof(settings[i]) == 'string') {
          // Allow to add "[", "]", "<" and ">" to attributes
          settings[i] = settings[i].replace(/\[/g, '|LS|').replace(/\]/g, '|RS|').replace(/\{/g, '|LF|').replace(/\}/g, '|RF|').replace(/\</g, '|{').replace(/\>/g, '|}').replace(/"/g, "'");
        }
        $shortcode.attr(i, settings[i]); 
      }
    };
  }

  function get_from_cache(html) {
    for(i in cache_shortcode) {
      if(cache_shortcode[i].raw == html) {
        return cache_shortcode[i].rendered;
      }
    }
    return '';
  }

  function prepare_to_shortcodes($this) {
    var html = $this.outerHTML();
    // Search for this string in the cache
    //var rendered = get_from_cache(html);
    global_counter++;
    if(typeof($this.attr('shortcode')) == 'undefined') {
      return;
    }
    $this.find('[shortcode!=""]').each(function() {
      prepare_to_shortcodes($(this));
    });
    if($this.attr('class') == '') {
      $this.removeAttr('class');
    }
    var attributes = $this.prop("attributes");
    var attrs_string = '';
    $.each(attributes, function() {
      attrs_string += this.name != 'shortcode' ? (' ' + this.name + '="' + this.value + '"') : '';
    });
    // Remove required for sortable plugin tags
    if($this.find('> .nd-visualshortcodes-parent').length) {
      $this.html($this.find('> .nd-visualshortcodes-parent').html());
    }
    // Save in the cache
    //cache_shortcode.push({'raw': html, 'rendered': rendered});
    rendered = '<ndvs_' + $this.attr('shortcode') + global_counter + attrs_string + '>' + $this.html() +'</ndvs_' + $this.attr('shortcode') + global_counter + '>';
    $this.replaceWith(rendered);
  }

  function nd_visualshortcodes_link_text_update($this) {
    if($('#' + $this.attr('data-id')).prev('.nd_visualshortcodes').length) {
      $this.text($this.attr('data-disable-text'));
      $('#' + $this.attr('data-id')).hide();
      //$('#' + $this.attr('data-id')).parents('.text-format-wrapper').find('.filter-wrapper').hide();
    }
    else {
      $this.text($this.attr('data-enable-text'));
      $('#' + $this.attr('data-id')).show();
      //$('#' + $this.attr('data-id')).parents('.text-format-wrapper').find('.filter-wrapper').show();
    }
  }

  function nd_visualshortcodes_add_form($this) {
    nd_visualshortcodes_add_overlay();
    var id = $this.parents('.nd_visualshortcodes').next().attr('id');
    var data_format = $('.nd_visualshortcodes_links[data-id="' + id +'"]').data('format');
    var data_shortcode = $this.parents('.shortcode-processed').attr('shortcode');
    $('.nd_visualshortcodes_add_link_active').removeClass('nd_visualshortcodes_add_link_active');
    // Mark the link which have opened the Add Form, so will know there to insert the shortcode
    $this.addClass('nd_visualshortcodes_add_link_active');
    $.post(Drupal.settings.basePath + '?q=ajax/nd_visualshortcodes/shortcodes_list', {format: data_format, shortcode: data_shortcode}, function(result) {
      $('#nd-visualshortcodes-shortcode-add-form').html(result);
      $('#nd-visualshortcodes-shortcode-add-form').dialog('open');
      nd_visualshortcodes_remove_overlay();
    });
  }

  function nd_visualshortcodes_add_form_search($this) {
    if(!$this.val()) {
      $this.parents('.nd_visualshortcodes_enabled_list').find('.nd_visualshortcodes_enabled_links a').show();
    }
    else {
      $this.parents('.nd_visualshortcodes_enabled_list').find('.nd_visualshortcodes_enabled_links a').hide();
      if($this.attr('data-exactly')) {
        $this.parents('.nd_visualshortcodes_enabled_list').find('.nd_visualshortcodes_enabled_links a[data-title="' + $this.val().toLowerCase() + '"]').show(); 
        $this.removeAttr('data-exactly');
      }
      else {
        $this.parents('.nd_visualshortcodes_enabled_list').find('.nd_visualshortcodes_enabled_links a[data-title*="' + $this.val().toLowerCase() + '"]').show();   
      }
    }
  }

  function nd_visualshortcodes_remove_image($this) {
    var fid = $this.closest('.form-item').find('input').val();
    $this.closest('.form-item').find('.preview-image').html('');
    $this.closest('.form-item').find('input').val('');
    $this.closest('#nd-visualshortcodes-shortcode-settings').find('.fid-old-field').val('');
    $this.hide();
  }

  function nd_visualshortcodes_upload_image($this) {
    globalOptions = {};
    Drupal.media.popups.mediaBrowser(function (mediaFiles) {
      if (mediaFiles.length < 0) {
        return;
      }
      var mediaFile = mediaFiles[0];
      // Set the value of the filefield fid (hidden).
      $this.closest('.form-item').find('input').val(mediaFile.fid);
      $this.closest('.form-item').find('.preview-image').html(mediaFile.preview);
      $this.closest('.form-item').find('.media-remove').show();
    }, globalOptions);
    return false;
  }

  $(document).ready(function() {

    // Dialog Shortcode Settings Form
    $('body').append('<div id = "nd-visualshortcodes-shortcode-settings" title = "' + Drupal.t('Shortcode Settings') + '"></div>');
    $('#nd-visualshortcodes-shortcode-settings').dialog({
      autoOpen: false,
      width: 1200,
      modal: true,
      position: ['middle', 100],
      open: function() {
        Drupal.attachBehaviors($("#nd-visualshortcodes-shortcode-settings"), Drupal.settings);
        $(this).dialog('option', 'position', ['middle', 100]);
      },
      buttons: {
        "Save": function() {
          nd_visualshortcodes_add_overlay();
          // Run change() method so WYSIWYG editors will update textarea values with current values from WYSIWYG layout
          $('#nd-visualshortcodes-shortcode-settings .filter-list').change();
          // Load form values to array
          var settings = _shortcode_form_to_settings($('#nd-visualshortcodes-shortcode-settings'));
          // Load settings to shortcode text and attributes values
          _settings_to_shortcode_attrs(settings, $('.shortcode-opened-settings'));
          // If this is not child element - upload the preview
          if($('.shortcode-opened-settings > .border-style').hasClass('border-none')) {
            $.post(Drupal.settings.basePath + '?q=ajax/nd_visualshortcodes/ajax_backend_shortcode_preview', {attrs: settings, shortcode: $('.shortcode-opened-settings').attr('shortcode')}, function(data) {
              $('.shortcode-opened-settings .nd_backend_preview').remove();
              $('.shortcode-opened-settings .border-style').append(data);
            });
          }
          // Attach Drupal behaviours to updated element to allow scripts made some custom works
          Drupal.attachBehaviors($('.shortcode-opened-settings').parent(), Drupal.settings);
          $('.shortcode-opened-settings').find('.nd-visualshortcodes-settings-links:first').css('display', 'block').prepend('<span class = "saving-info btn btn-xs btn-success">' + Drupal.t('Saved.') + '</span>')
          setTimeout(function() {
            $('.saving-info').animate({opacity: 0}, 1500, function() {
              $(this).parent('.nd-visualshortcodes-settings-links').removeAttr('style');
              $(this).remove();
            });
            nd_visualshortcodes_remove_overlay();
          }, 1000);
          // Save updated shortcodes to textarea code
          nd_visualshortcodes_save($('.shortcode-opened-settings').parents('.nd_visualshortcodes').next());
          $(this).dialog( "close" );
          return false;
        },
        "Delete": function() {
          if (!Drupal.settings.nd_visualshortcodes.confirm_delete || confirm(Drupal.t('Delete shortcode?'))) {
            $('.shortcode-opened-settings').closest('.nd_visualshortcodes').addClass('nd_visualshortcodes_active');
            $('.shortcode-opened-settings').remove();
            nd_visualshortcodes_save($('.nd_visualshortcodes_active').next());
            $(this).dialog( "close" ); 
          }
          return false;
        },
        "Cancel": function() {
          $(this).dialog( "close" );
          return false;
        }
      },
    });

    // Dialog Shortcode Settings Form
    $('body').append('<div id = "nd-visualshortcodes-shortcode-add-form" title = "' + Drupal.t('Add Shortcode') + '"></div>');
    $('#nd-visualshortcodes-shortcode-add-form').dialog({
      autoOpen: false,
      width: 1000,
      modal: true,
      open: function() {
        Drupal.attachBehaviors($("#nd-visualshortcodes-shortcode-add-form"), Drupal.settings);
      },
      buttons: {
        "Add": function() {
          nd_visualshortcodes_add_overlay();
          var data_shortcode = $('.nd_visualshortcodes_enabled_links .active').attr('data-shortcode');
          $.post(Drupal.settings.basePath + '?q=ajax/nd_visualshortcodes/shortcodes_list_add', {shortcode: data_shortcode}, function(result) {
            $('.nd-visualshortcodes-added-shortcode').removeClass('nd-visualshortcodes-added-shortcode');
            // If this is main ADD button appear at the begining of the layout
            if($('.nd_visualshortcodes_add_link_active').parent().hasClass('nd-visualshortcodes-main-add')) {
              $('.nd_visualshortcodes_add_link_active').parent().parent().find('.end-layout').before(result);
              $('.nd_visualshortcodes_add_link_active').parent().parent().find('> .shortcode-processed:last').addClass('nd-visualshortcodes-added-shortcode');
            }
            else {
              $('.nd_visualshortcodes_add_link_active').closest('.shortcode-processed').find('.nd-visualshortcodes-parent:first').append(result);
              $('.nd_visualshortcodes_add_link_active').closest('.shortcode-processed').find('.nd-visualshortcodes-parent:first > .shortcode-processed:last').addClass('nd-visualshortcodes-added-shortcode');
            }
            $('.nd_visualshortcodes_add_link_active').closest('.nd_visualshortcodes').remove('sort-processed');
            // Attach Drupal behaviours to updated element to allow scripts made some custom works
            Drupal.attachBehaviors($('.nd_visualshortcodes_add_link_active').closest('.nd_visualshortcodes'), Drupal.settings);
            // Open the settings form
            $('.nd-visualshortcodes-added-shortcode .shortcode-settings:first').click();
            // Save updates shortcodes to textarea code
            nd_visualshortcodes_save($('.nd_visualshortcodes_add_link_active').closest('.nd_visualshortcodes').next());
            nd_visualshortcodes_remove_overlay();
          });
          $(this).dialog( "close" );
          // Show the user notification
          $('.nd_visualshortcodes_add_link_active').before('<span class = "saving-info btn btn-xs btn-success">' + Drupal.t('Saved.') + '</span>')
          setTimeout(function() {
            $('.saving-info').animate({opacity: 0}, 1500, function() {
              $(this).remove();
            });
          }, 1000);
        },
        Cancel: function() {
          $(this).dialog( "close" );
        }
      },
    });

  }); // end doc ready 

})(jQuery);;
/* ===================================================
 *  jquery-sortable.js v0.9.12
 *  http://johnny.github.com/jquery-sortable/
 * ===================================================
 *  Copyright (c) 2012 Jonas von Andrian
 *  All rights reserved.
 *
 *  Redistribution and use in source and binary forms, with or without
 *  modification, are permitted provided that the following conditions are met:
 *  * Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *  * The name of the author may not be used to endorse or promote products
 *    derived from this software without specific prior written permission.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 *  ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 *  WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 *  DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
 *  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 *  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 *  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 *  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 *  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 *  SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 * ========================================================== */


!function ( $, window, pluginName, undefined){
  var eventNames,
  containerDefaults = {
    // If true, items can be dragged from this container
    drag: true,
    // If true, items can be droped onto this container
    drop: true,
    // Exclude items from being draggable, if the
    // selector matches the item
    exclude: "",
    // If true, search for nested containers within an item
    nested: true,
    // If true, the items are assumed to be arranged vertically
    vertical: true
  }, // end container defaults
  groupDefaults = {
    // This is executed after the placeholder has been moved.
    // $closestItemOrContainer contains the closest item, the placeholder
    // has been put at or the closest empty Container, the placeholder has
    // been appended to.
    afterMove: function ($placeholder, container, $closestItemOrContainer) {
    },
    // The exact css path between the container and its items, e.g. "> tbody"
    containerPath: "",
    // The css selector of the containers
    containerSelector: "ol, ul",
    // Distance the mouse has to travel to start dragging
    distance: 0,
    // Time in milliseconds after mousedown until dragging should start.
    // This option can be used to prevent unwanted drags when clicking on an element.
    delay: 0,
    // The css selector of the drag handle
    handle: "",
    // The exact css path between the item and its subcontainers
    itemPath: "",
    // The css selector of the items
    itemSelector: "li",
    // Check if the dragged item may be inside the container.
    // Use with care, since the search for a valid container entails a depth first search
    // and may be quite expensive.
    isValidTarget: function ($item, container) {
      return true
    },
    // Executed before onDrop if placeholder is detached.
    // This happens if pullPlaceholder is set to false and the drop occurs outside a container.
    onCancel: function ($item, container, _super, event) {
    },
    // Executed at the beginning of a mouse move event.
    // The Placeholder has not been moved yet.
    onDrag: function ($item, position, _super, event) {
      $item.css(position)
    },
    // Called after the drag has been started,
    // that is the mouse button is beeing held down and
    // the mouse is moving.
    // The container is the closest initialized container.
    // Therefore it might not be the container, that actually contains the item.
    onDragStart: function ($item, container, _super, event) {
      $item.css({
        height: $item.height(),
        width: $item.width()
      })
      $item.addClass("dragged")
      $("body").addClass("dragging")
    },
    // Called when the mouse button is beeing released
    onDrop: function ($item, container, _super, event) {
      $item.removeClass("dragged").removeAttr("style")
      $("body").removeClass("dragging")
    },
    // Called on mousedown. If falsy value is returned, the dragging will not start.
    // If clicked on input element, ignore
    onMousedown: function ($item, _super, event) {
      if (!event.target.nodeName.match(/^(input|select)$/i)) {
        event.preventDefault()
        return true
      }
    },
    // Template for the placeholder. Can be any valid jQuery input
    // e.g. a string, a DOM element.
    // The placeholder must have the class "placeholder"
    placeholder: '<li class="placeholder"/>',
    // If true, the position of the placeholder is calculated on every mousemove.
    // If false, it is only calculated when the mouse is above a container.
    pullPlaceholder: true,
    // Specifies serialization of the container group.
    // The pair $parent/$children is either container/items or item/subcontainers.
    serialize: function ($parent, $children, parentIsContainer) {
      var result = $.extend({}, $parent.data())

      if(parentIsContainer)
        return [$children]
      else if ($children[0]){
        result.children = $children
      }

      delete result.subContainers
      delete result.sortable

      return result
    },
    // Set tolerance while dragging. Positive values decrease sensitivity,
    // negative values increase it.
    tolerance: 0
  }, // end group defaults
  containerGroups = {},
  groupCounter = 0,
  emptyBox = {
    left: 0,
    top: 0,
    bottom: 0,
    right:0
  },
  eventNames = {
    start: "touchstart.sortable mousedown.sortable",
    drop: "touchend.sortable touchcancel.sortable mouseup.sortable",
    drag: "touchmove.sortable mousemove.sortable",
    scroll: "scroll.sortable"
  },
  subContainerKey = "subContainers"

  /*
   * a is Array [left, right, top, bottom]
   * b is array [left, top]
   */
  function d(a,b) {
    var x = Math.max(0, a[0] - b[0], b[0] - a[1]),
    y = Math.max(0, a[2] - b[1], b[1] - a[3])
    return x+y;
  }

  function setDimensions(array, dimensions, tolerance, useOffset) {
    var i = array.length,
    offsetMethod = useOffset ? "offset" : "position"
    tolerance = tolerance || 0

    while(i--){
      var el = array[i].el ? array[i].el : $(array[i]),
      // use fitting method
      pos = el[offsetMethod]()
      pos.left += parseInt(el.css('margin-left'), 10)
      pos.top += parseInt(el.css('margin-top'),10)
      dimensions[i] = [
        pos.left - tolerance,
        pos.left + el.outerWidth() + tolerance,
        pos.top - tolerance,
        pos.top + el.outerHeight() + tolerance
      ]
    }
  }

  function getRelativePosition(pointer, element) {
    var offset = element.offset()
    return {
      left: pointer.left - offset.left,
      top: pointer.top - offset.top
    }
  }

  function sortByDistanceDesc(dimensions, pointer, lastPointer) {
    pointer = [pointer.left, pointer.top]
    lastPointer = lastPointer && [lastPointer.left, lastPointer.top]

    var dim,
    i = dimensions.length,
    distances = []

    while(i--){
      dim = dimensions[i]
      distances[i] = [i,d(dim,pointer), lastPointer && d(dim, lastPointer)]
    }
    distances = distances.sort(function  (a,b) {
      return b[1] - a[1] || b[2] - a[2] || b[0] - a[0]
    })

    // last entry is the closest
    return distances
  }

  function ContainerGroup(options) {
    this.options = $.extend({}, groupDefaults, options)
    this.containers = []

    if(!this.options.rootGroup){
      this.scrollProxy = $.proxy(this.scroll, this)
      this.dragProxy = $.proxy(this.drag, this)
      this.dropProxy = $.proxy(this.drop, this)
      this.placeholder = $(this.options.placeholder)

      if(!options.isValidTarget)
        this.options.isValidTarget = undefined
    }
  }

  ContainerGroup.get = function  (options) {
    if(!containerGroups[options.group]) {
      if(options.group === undefined)
        options.group = groupCounter ++

      containerGroups[options.group] = new ContainerGroup(options)
    }

    return containerGroups[options.group]
  }

  ContainerGroup.prototype = {
    dragInit: function  (e, itemContainer) {
      this.$document = $(itemContainer.el[0].ownerDocument)

      // get item to drag
      this.item = $(e.target).closest(this.options.itemSelector)
      this.itemContainer = itemContainer

      if(this.item.is(this.options.exclude) ||
         !this.options.onMousedown(this.item, groupDefaults.onMousedown, e)){
        return
      }

      this.setPointer(e)
      this.toggleListeners('on')

      this.setupDelayTimer()
      this.dragInitDone = true
    },
    drag: function  (e) {
      if(!this.dragging){
        if(!this.distanceMet(e) || !this.delayMet)
          return

        this.options.onDragStart(this.item, this.itemContainer, groupDefaults.onDragStart, e)
        this.item.before(this.placeholder)
        this.dragging = true
      }

      this.setPointer(e)
      // place item under the cursor
      this.options.onDrag(this.item,
                          getRelativePosition(this.pointer, this.item.offsetParent()),
                          groupDefaults.onDrag,
                          e)

      var x = e.pageX || e.originalEvent.pageX,
      y = e.pageY || e.originalEvent.pageY,
      box = this.sameResultBox,
      t = this.options.tolerance

      if(!box || box.top - t > y || box.bottom + t < y || box.left - t > x || box.right + t < x)
        if(!this.searchValidTarget())
          this.placeholder.detach()
    },
    drop: function  (e) {
      this.toggleListeners('off')

      this.dragInitDone = false

      if(this.dragging){
        // processing Drop, check if placeholder is detached
        if(this.placeholder.closest("html")[0])
          this.placeholder.before(this.item).detach()
        else
          this.options.onCancel(this.item, this.itemContainer, groupDefaults.onCancel, e)

        this.options.onDrop(this.item, this.getContainer(this.item), groupDefaults.onDrop, e)

        // cleanup
        this.clearDimensions()
        this.clearOffsetParent()
        this.lastAppendedItem = this.sameResultBox = undefined
        this.dragging = false
      }
    },
    searchValidTarget: function  (pointer, lastPointer) {
      if(!pointer){
        pointer = this.relativePointer || this.pointer
        lastPointer = this.lastRelativePointer || this.lastPointer
      }

      var distances = sortByDistanceDesc(this.getContainerDimensions(),
                                         pointer,
                                         lastPointer),
      i = distances.length

      while(i--){
        var index = distances[i][0],
        distance = distances[i][1]

        if(!distance || this.options.pullPlaceholder){
          var container = this.containers[index]
          if(!container.disabled){
            if(!this.$getOffsetParent()){
              var offsetParent = container.getItemOffsetParent()
              pointer = getRelativePosition(pointer, offsetParent)
              lastPointer = getRelativePosition(lastPointer, offsetParent)
            }
            if(container.searchValidTarget(pointer, lastPointer))
              return true
          }
        }
      }
      if(this.sameResultBox)
        this.sameResultBox = undefined
    },
    movePlaceholder: function  (container, item, method, sameResultBox) {
      var lastAppendedItem = this.lastAppendedItem
      if(!sameResultBox && lastAppendedItem && lastAppendedItem[0] === item[0])
        return;

      item[method](this.placeholder)
      this.lastAppendedItem = item
      this.sameResultBox = sameResultBox
      this.options.afterMove(this.placeholder, container, item)
    },
    getContainerDimensions: function  () {
      if(!this.containerDimensions)
        setDimensions(this.containers, this.containerDimensions = [], this.options.tolerance, !this.$getOffsetParent())
      return this.containerDimensions
    },
    getContainer: function  (element) {
      return element.closest(this.options.containerSelector).data(pluginName)
    },
    $getOffsetParent: function  () {
      if(this.offsetParent === undefined){
        var i = this.containers.length - 1,
        offsetParent = this.containers[i].getItemOffsetParent()

        if(!this.options.rootGroup){
          while(i--){
            if(offsetParent[0] != this.containers[i].getItemOffsetParent()[0]){
              // If every container has the same offset parent,
              // use position() which is relative to this parent,
              // otherwise use offset()
              // compare #setDimensions
              offsetParent = false
              break;
            }
          }
        }

        this.offsetParent = offsetParent
      }
      return this.offsetParent
    },
    setPointer: function (e) {
      var pointer = this.getPointer(e)

      if(this.$getOffsetParent()){
        var relativePointer = getRelativePosition(pointer, this.$getOffsetParent())
        this.lastRelativePointer = this.relativePointer
        this.relativePointer = relativePointer
      }

      this.lastPointer = this.pointer
      this.pointer = pointer
    },
    distanceMet: function (e) {
      var currentPointer = this.getPointer(e)
      return (Math.max(
        Math.abs(this.pointer.left - currentPointer.left),
        Math.abs(this.pointer.top - currentPointer.top)
      ) >= this.options.distance)
    },
    getPointer: function(e) {
      return {
        left: e.pageX || e.originalEvent.pageX,
        top: e.pageY || e.originalEvent.pageY
      }
    },
    setupDelayTimer: function () {
      var that = this
      this.delayMet = !this.options.delay

      // init delay timer if needed
      if (!this.delayMet) {
        clearTimeout(this._mouseDelayTimer);
        this._mouseDelayTimer = setTimeout(function() {
          that.delayMet = true
        }, this.options.delay)
      }
    },
    scroll: function  (e) {
      this.clearDimensions()
      this.clearOffsetParent() // TODO is this needed?
    },
    toggleListeners: function (method) {
      var that = this,
      events = ['drag','drop','scroll']

      $.each(events,function  (i,event) {
        that.$document[method](eventNames[event], that[event + 'Proxy'])
      })
    },
    clearOffsetParent: function () {
      this.offsetParent = undefined
    },
    // Recursively clear container and item dimensions
    clearDimensions: function  () {
      this.traverse(function(object){
        object._clearDimensions()
      })
    },
    traverse: function(callback) {
      callback(this)
      var i = this.containers.length
      while(i--){
        this.containers[i].traverse(callback)
      }
    },
    _clearDimensions: function(){
      this.containerDimensions = undefined
    },
    _destroy: function () {
      containerGroups[this.options.group] = undefined
    }
  }

  function Container(element, options) {
    this.el = element
    this.options = $.extend( {}, containerDefaults, options)

    this.group = ContainerGroup.get(this.options)
    this.rootGroup = this.options.rootGroup || this.group
    this.handle = this.rootGroup.options.handle || this.rootGroup.options.itemSelector

    var itemPath = this.rootGroup.options.itemPath
    this.target = itemPath ? this.el.find(itemPath) : this.el

    this.target.on(eventNames.start, this.handle, $.proxy(this.dragInit, this))

    if(this.options.drop)
      this.group.containers.push(this)
  }

  Container.prototype = {
    dragInit: function  (e) {
      var rootGroup = this.rootGroup

      if( !this.disabled &&
          !rootGroup.dragInitDone &&
          this.options.drag &&
          this.isValidDrag(e)) {
        rootGroup.dragInit(e, this)
      }
    },
    isValidDrag: function(e) {
      return e.which == 1 ||
        e.type == "touchstart" && e.originalEvent.touches.length == 1
    },
    searchValidTarget: function  (pointer, lastPointer) {
      var distances = sortByDistanceDesc(this.getItemDimensions(),
                                         pointer,
                                         lastPointer),
      i = distances.length,
      rootGroup = this.rootGroup,
      validTarget = !rootGroup.options.isValidTarget ||
        rootGroup.options.isValidTarget(rootGroup.item, this)

      if(!i && validTarget){
        rootGroup.movePlaceholder(this, this.target, "append")
        return true
      } else
        while(i--){
          var index = distances[i][0],
          distance = distances[i][1]
          if(!distance && this.hasChildGroup(index)){
            var found = this.getContainerGroup(index).searchValidTarget(pointer, lastPointer)
            if(found)
              return true
          }
          else if(validTarget){
            this.movePlaceholder(index, pointer)
            return true
          }
        }
    },
    movePlaceholder: function  (index, pointer) {
      var item = $(this.items[index]),
      dim = this.itemDimensions[index],
      method = "after",
      width = item.outerWidth(),
      height = item.outerHeight(),
      offset = item.offset(),
      sameResultBox = {
        left: offset.left,
        right: offset.left + width,
        top: offset.top,
        bottom: offset.top + height
      }
      if(this.options.vertical){
        var yCenter = (dim[2] + dim[3]) / 2,
        inUpperHalf = pointer.top <= yCenter
        if(inUpperHalf){
          method = "before"
          sameResultBox.bottom -= height / 2
        } else
          sameResultBox.top += height / 2
      } else {
        var xCenter = (dim[0] + dim[1]) / 2,
        inLeftHalf = pointer.left <= xCenter
        if(inLeftHalf){
          method = "before"
          sameResultBox.right -= width / 2
        } else
          sameResultBox.left += width / 2
      }
      if(this.hasChildGroup(index))
        sameResultBox = emptyBox
      this.rootGroup.movePlaceholder(this, item, method, sameResultBox)
    },
    getItemDimensions: function  () {
      if(!this.itemDimensions){
        this.items = this.$getChildren(this.el, "item").filter(":not(.placeholder, .dragged)").get()
        setDimensions(this.items, this.itemDimensions = [], this.options.tolerance)
      }
      return this.itemDimensions
    },
    getItemOffsetParent: function  () {
      var offsetParent,
      el = this.el
      // Since el might be empty we have to check el itself and
      // can not do something like el.children().first().offsetParent()
      if(el.css("position") === "relative" || el.css("position") === "absolute"  || el.css("position") === "fixed")
        offsetParent = el
      else
        offsetParent = el.offsetParent()
      return offsetParent
    },
    hasChildGroup: function (index) {
      return this.options.nested && this.getContainerGroup(index)
    },
    getContainerGroup: function  (index) {
      var childGroup = $.data(this.items[index], subContainerKey)
      if( childGroup === undefined){
        var childContainers = this.$getChildren(this.items[index], "container")
        childGroup = false

        if(childContainers[0]){
          var options = $.extend({}, this.options, {
            rootGroup: this.rootGroup,
            group: groupCounter ++
          })
          childGroup = childContainers[pluginName](options).data(pluginName).group
        }
        $.data(this.items[index], subContainerKey, childGroup)
      }
      return childGroup
    },
    $getChildren: function (parent, type) {
      var options = this.rootGroup.options,
      path = options[type + "Path"],
      selector = options[type + "Selector"]

      parent = $(parent)
      if(path)
        parent = parent.find(path)

      return parent.children(selector)
    },
    _serialize: function (parent, isContainer) {
      var that = this,
      childType = isContainer ? "item" : "container",

      children = this.$getChildren(parent, childType).not(this.options.exclude).map(function () {
        return that._serialize($(this), !isContainer)
      }).get()

      return this.rootGroup.options.serialize(parent, children, isContainer)
    },
    traverse: function(callback) {
      $.each(this.items || [], function(item){
        var group = $.data(this, subContainerKey)
        if(group)
          group.traverse(callback)
      });

      callback(this)
    },
    _clearDimensions: function  () {
      this.itemDimensions = undefined
    },
    _destroy: function() {
      var that = this;

      this.target.off(eventNames.start, this.handle);
      this.el.removeData(pluginName)

      if(this.options.drop)
        this.group.containers = $.grep(this.group.containers, function(val){
          return val != that
        })

      $.each(this.items || [], function(){
        $.removeData(this, subContainerKey)
      })
    }
  }

  var API = {
    enable: function() {
      this.traverse(function(object){
        object.disabled = false
      })
    },
    disable: function (){
      this.traverse(function(object){
        object.disabled = true
      })
    },
    serialize: function () {
      return this._serialize(this.el, true)
    },
    refresh: function() {
      this.traverse(function(object){
        object._clearDimensions()
      })
    },
    destroy: function () {
      this.traverse(function(object){
        object._destroy();
      })
    }
  }

  $.extend(Container.prototype, API)

  /**
   * jQuery API
   *
   * Parameters are
   *   either options on init
   *   or a method name followed by arguments to pass to the method
   */
  $.fn[pluginName] = function(methodOrOptions) {
    var args = Array.prototype.slice.call(arguments, 1)

    return this.map(function(){
      var $t = $(this),
      object = $t.data(pluginName)

      if(object && API[methodOrOptions])
        return API[methodOrOptions].apply(object, args) || this
      else if(!object && (methodOrOptions === undefined ||
                          typeof methodOrOptions === "object"))
        $t.data(pluginName, new Container($t, methodOrOptions))

      return this
    });
  };

}(jQuery, window, 'sortable');
;
;(function(){

/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module._resolving && !module.exports) {
    var mod = {};
    mod.exports = {};
    mod.client = mod.component = true;
    module._resolving = true;
    module.call(this, mod.exports, require.relative(resolved), mod);
    delete module._resolving;
    module.exports = mod.exports;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("abpetkov-transitionize/transitionize.js", function(exports, require, module){

/**
 * Transitionize 0.0.3
 * https://github.com/abpetkov/transitionize
 *
 * Authored by Alexander Petkov
 * https://github.com/abpetkov
 *
 * Copyright 2013, Alexander Petkov
 * License: The MIT License (MIT)
 * http://opensource.org/licenses/MIT
 *
 */

/**
 * Expose `Transitionize`.
 */

module.exports = Transitionize;

/**
 * Initialize new Transitionize.
 *
 * @param {Object} element
 * @param {Object} props
 * @api public
 */

function Transitionize(element, props) {
  if (!(this instanceof Transitionize)) return new Transitionize(element, props);

  this.element = element;
  this.props = props || {};
  this.init();
}

/**
 * Detect if Safari.
 *
 * @returns {Boolean}
 * @api private
 */

Transitionize.prototype.isSafari = function() {
  return (/Safari/).test(navigator.userAgent) && (/Apple Computer/).test(navigator.vendor);
};

/**
 * Loop though the object and push the keys and values in an array.
 * Apply the CSS3 transition to the element and prefix with -webkit- for Safari.
 *
 * @api private
 */

Transitionize.prototype.init = function() {
  var transitions = [];

  for (var key in this.props) {
    transitions.push(key + ' ' + this.props[key]);
  }

  this.element.style.transition = transitions.join(', ');
  if (this.isSafari()) this.element.style.webkitTransition = transitions.join(', ');
};
});
require.register("ftlabs-fastclick/lib/fastclick.js", function(exports, require, module){
/**
 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
 *
 * @version 0.6.11
 * @codingstandard ftlabs-jsv2
 * @copyright The Financial Times Limited [All Rights Reserved]
 * @license MIT License (see LICENSE.txt)
 */

/*jslint browser:true, node:true*/
/*global define, Event, Node*/


/**
 * Instantiate fast-clicking listeners on the specificed layer.
 *
 * @constructor
 * @param {Element} layer The layer to listen on
 */
function FastClick(layer) {
	'use strict';
	var oldOnClick, self = this;


	/**
	 * Whether a click is currently being tracked.
	 *
	 * @type boolean
	 */
	this.trackingClick = false;


	/**
	 * Timestamp for when when click tracking started.
	 *
	 * @type number
	 */
	this.trackingClickStart = 0;


	/**
	 * The element being tracked for a click.
	 *
	 * @type EventTarget
	 */
	this.targetElement = null;


	/**
	 * X-coordinate of touch start event.
	 *
	 * @type number
	 */
	this.touchStartX = 0;


	/**
	 * Y-coordinate of touch start event.
	 *
	 * @type number
	 */
	this.touchStartY = 0;


	/**
	 * ID of the last touch, retrieved from Touch.identifier.
	 *
	 * @type number
	 */
	this.lastTouchIdentifier = 0;


	/**
	 * Touchmove boundary, beyond which a click will be cancelled.
	 *
	 * @type number
	 */
	this.touchBoundary = 10;


	/**
	 * The FastClick layer.
	 *
	 * @type Element
	 */
	this.layer = layer;

	if (!layer || !layer.nodeType) {
		throw new TypeError('Layer must be a document node');
	}

	/** @type function() */
	this.onClick = function() { return FastClick.prototype.onClick.apply(self, arguments); };

	/** @type function() */
	this.onMouse = function() { return FastClick.prototype.onMouse.apply(self, arguments); };

	/** @type function() */
	this.onTouchStart = function() { return FastClick.prototype.onTouchStart.apply(self, arguments); };

	/** @type function() */
	this.onTouchMove = function() { return FastClick.prototype.onTouchMove.apply(self, arguments); };

	/** @type function() */
	this.onTouchEnd = function() { return FastClick.prototype.onTouchEnd.apply(self, arguments); };

	/** @type function() */
	this.onTouchCancel = function() { return FastClick.prototype.onTouchCancel.apply(self, arguments); };

	if (FastClick.notNeeded(layer)) {
		return;
	}

	// Set up event handlers as required
	if (this.deviceIsAndroid) {
		layer.addEventListener('mouseover', this.onMouse, true);
		layer.addEventListener('mousedown', this.onMouse, true);
		layer.addEventListener('mouseup', this.onMouse, true);
	}

	layer.addEventListener('click', this.onClick, true);
	layer.addEventListener('touchstart', this.onTouchStart, false);
	layer.addEventListener('touchmove', this.onTouchMove, false);
	layer.addEventListener('touchend', this.onTouchEnd, false);
	layer.addEventListener('touchcancel', this.onTouchCancel, false);

	// Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
	// which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
	// layer when they are cancelled.
	if (!Event.prototype.stopImmediatePropagation) {
		layer.removeEventListener = function(type, callback, capture) {
			var rmv = Node.prototype.removeEventListener;
			if (type === 'click') {
				rmv.call(layer, type, callback.hijacked || callback, capture);
			} else {
				rmv.call(layer, type, callback, capture);
			}
		};

		layer.addEventListener = function(type, callback, capture) {
			var adv = Node.prototype.addEventListener;
			if (type === 'click') {
				adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
					if (!event.propagationStopped) {
						callback(event);
					}
				}), capture);
			} else {
				adv.call(layer, type, callback, capture);
			}
		};
	}

	// If a handler is already declared in the element's onclick attribute, it will be fired before
	// FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
	// adding it as listener.
	if (typeof layer.onclick === 'function') {

		// Android browser on at least 3.2 requires a new reference to the function in layer.onclick
		// - the old one won't work if passed to addEventListener directly.
		oldOnClick = layer.onclick;
		layer.addEventListener('click', function(event) {
			oldOnClick(event);
		}, false);
		layer.onclick = null;
	}
}


/**
 * Android requires exceptions.
 *
 * @type boolean
 */
FastClick.prototype.deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0;


/**
 * iOS requires exceptions.
 *
 * @type boolean
 */
FastClick.prototype.deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent);


/**
 * iOS 4 requires an exception for select elements.
 *
 * @type boolean
 */
FastClick.prototype.deviceIsIOS4 = FastClick.prototype.deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


/**
 * iOS 6.0(+?) requires the target element to be manually derived
 *
 * @type boolean
 */
FastClick.prototype.deviceIsIOSWithBadTarget = FastClick.prototype.deviceIsIOS && (/OS ([6-9]|\d{2})_\d/).test(navigator.userAgent);


/**
 * Determine whether a given element requires a native click.
 *
 * @param {EventTarget|Element} target Target DOM element
 * @returns {boolean} Returns true if the element needs a native click
 */
FastClick.prototype.needsClick = function(target) {
	'use strict';
	switch (target.nodeName.toLowerCase()) {

	// Don't send a synthetic click to disabled inputs (issue #62)
	case 'button':
	case 'select':
	case 'textarea':
		if (target.disabled) {
			return true;
		}

		break;
	case 'input':

		// File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
		if ((this.deviceIsIOS && target.type === 'file') || target.disabled) {
			return true;
		}

		break;
	case 'label':
	case 'video':
		return true;
	}

	return (/\bneedsclick\b/).test(target.className);
};


/**
 * Determine whether a given element requires a call to focus to simulate click into element.
 *
 * @param {EventTarget|Element} target Target DOM element
 * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
 */
FastClick.prototype.needsFocus = function(target) {
	'use strict';
	switch (target.nodeName.toLowerCase()) {
	case 'textarea':
		return true;
	case 'select':
		return !this.deviceIsAndroid;
	case 'input':
		switch (target.type) {
		case 'button':
		case 'checkbox':
		case 'file':
		case 'image':
		case 'radio':
		case 'submit':
			return false;
		}

		// No point in attempting to focus disabled inputs
		return !target.disabled && !target.readOnly;
	default:
		return (/\bneedsfocus\b/).test(target.className);
	}
};


/**
 * Send a click event to the specified element.
 *
 * @param {EventTarget|Element} targetElement
 * @param {Event} event
 */
FastClick.prototype.sendClick = function(targetElement, event) {
	'use strict';
	var clickEvent, touch;

	// On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
	if (document.activeElement && document.activeElement !== targetElement) {
		document.activeElement.blur();
	}

	touch = event.changedTouches[0];

	// Synthesise a click event, with an extra attribute so it can be tracked
	clickEvent = document.createEvent('MouseEvents');
	clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
	clickEvent.forwardedTouchEvent = true;
	targetElement.dispatchEvent(clickEvent);
};

FastClick.prototype.determineEventType = function(targetElement) {
	'use strict';

	//Issue #159: Android Chrome Select Box does not open with a synthetic click event
	if (this.deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
		return 'mousedown';
	}

	return 'click';
};


/**
 * @param {EventTarget|Element} targetElement
 */
FastClick.prototype.focus = function(targetElement) {
	'use strict';
	var length;

	// Issue #160: on iOS 7, some input elements (e.g. date datetime) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
	if (this.deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time') {
		length = targetElement.value.length;
		targetElement.setSelectionRange(length, length);
	} else {
		targetElement.focus();
	}
};


/**
 * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
 *
 * @param {EventTarget|Element} targetElement
 */
FastClick.prototype.updateScrollParent = function(targetElement) {
	'use strict';
	var scrollParent, parentElement;

	scrollParent = targetElement.fastClickScrollParent;

	// Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
	// target element was moved to another parent.
	if (!scrollParent || !scrollParent.contains(targetElement)) {
		parentElement = targetElement;
		do {
			if (parentElement.scrollHeight > parentElement.offsetHeight) {
				scrollParent = parentElement;
				targetElement.fastClickScrollParent = parentElement;
				break;
			}

			parentElement = parentElement.parentElement;
		} while (parentElement);
	}

	// Always update the scroll top tracker if possible.
	if (scrollParent) {
		scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
	}
};


/**
 * @param {EventTarget} targetElement
 * @returns {Element|EventTarget}
 */
FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {
	'use strict';

	// On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
	if (eventTarget.nodeType === Node.TEXT_NODE) {
		return eventTarget.parentNode;
	}

	return eventTarget;
};


/**
 * On touch start, record the position and scroll offset.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onTouchStart = function(event) {
	'use strict';
	var targetElement, touch, selection;

	// Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
	if (event.targetTouches.length > 1) {
		return true;
	}

	targetElement = this.getTargetElementFromEventTarget(event.target);
	touch = event.targetTouches[0];

	if (this.deviceIsIOS) {

		// Only trusted events will deselect text on iOS (issue #49)
		selection = window.getSelection();
		if (selection.rangeCount && !selection.isCollapsed) {
			return true;
		}

		if (!this.deviceIsIOS4) {

			// Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
			// when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
			// with the same identifier as the touch event that previously triggered the click that triggered the alert.
			// Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
			// immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
			if (touch.identifier === this.lastTouchIdentifier) {
				event.preventDefault();
				return false;
			}

			this.lastTouchIdentifier = touch.identifier;

			// If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
			// 1) the user does a fling scroll on the scrollable layer
			// 2) the user stops the fling scroll with another tap
			// then the event.target of the last 'touchend' event will be the element that was under the user's finger
			// when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
			// is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
			this.updateScrollParent(targetElement);
		}
	}

	this.trackingClick = true;
	this.trackingClickStart = event.timeStamp;
	this.targetElement = targetElement;

	this.touchStartX = touch.pageX;
	this.touchStartY = touch.pageY;

	// Prevent phantom clicks on fast double-tap (issue #36)
	if ((event.timeStamp - this.lastClickTime) < 200) {
		event.preventDefault();
	}

	return true;
};


/**
 * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.touchHasMoved = function(event) {
	'use strict';
	var touch = event.changedTouches[0], boundary = this.touchBoundary;

	if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
		return true;
	}

	return false;
};


/**
 * Update the last position.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onTouchMove = function(event) {
	'use strict';
	if (!this.trackingClick) {
		return true;
	}

	// If the touch has moved, cancel the click tracking
	if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
		this.trackingClick = false;
		this.targetElement = null;
	}

	return true;
};


/**
 * Attempt to find the labelled control for the given label element.
 *
 * @param {EventTarget|HTMLLabelElement} labelElement
 * @returns {Element|null}
 */
FastClick.prototype.findControl = function(labelElement) {
	'use strict';

	// Fast path for newer browsers supporting the HTML5 control attribute
	if (labelElement.control !== undefined) {
		return labelElement.control;
	}

	// All browsers under test that support touch events also support the HTML5 htmlFor attribute
	if (labelElement.htmlFor) {
		return document.getElementById(labelElement.htmlFor);
	}

	// If no for attribute exists, attempt to retrieve the first labellable descendant element
	// the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
	return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
};


/**
 * On touch end, determine whether to send a click event at once.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onTouchEnd = function(event) {
	'use strict';
	var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

	if (!this.trackingClick) {
		return true;
	}

	// Prevent phantom clicks on fast double-tap (issue #36)
	if ((event.timeStamp - this.lastClickTime) < 200) {
		this.cancelNextClick = true;
		return true;
	}

	// Reset to prevent wrong click cancel on input (issue #156).
	this.cancelNextClick = false;

	this.lastClickTime = event.timeStamp;

	trackingClickStart = this.trackingClickStart;
	this.trackingClick = false;
	this.trackingClickStart = 0;

	// On some iOS devices, the targetElement supplied with the event is invalid if the layer
	// is performing a transition or scroll, and has to be re-detected manually. Note that
	// for this to function correctly, it must be called *after* the event target is checked!
	// See issue #57; also filed as rdar://13048589 .
	if (this.deviceIsIOSWithBadTarget) {
		touch = event.changedTouches[0];

		// In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
		targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
		targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
	}

	targetTagName = targetElement.tagName.toLowerCase();
	if (targetTagName === 'label') {
		forElement = this.findControl(targetElement);
		if (forElement) {
			this.focus(targetElement);
			if (this.deviceIsAndroid) {
				return false;
			}

			targetElement = forElement;
		}
	} else if (this.needsFocus(targetElement)) {

		// Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
		// Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
		if ((event.timeStamp - trackingClickStart) > 100 || (this.deviceIsIOS && window.top !== window && targetTagName === 'input')) {
			this.targetElement = null;
			return false;
		}

		this.focus(targetElement);

		// Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
		if (!this.deviceIsIOS4 || targetTagName !== 'select') {
			this.targetElement = null;
			event.preventDefault();
		}

		return false;
	}

	if (this.deviceIsIOS && !this.deviceIsIOS4) {

		// Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
		// and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
		scrollParent = targetElement.fastClickScrollParent;
		if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
			return true;
		}
	}

	// Prevent the actual click from going though - unless the target node is marked as requiring
	// real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
	if (!this.needsClick(targetElement)) {
		event.preventDefault();
		this.sendClick(targetElement, event);
	}

	return false;
};


/**
 * On touch cancel, stop tracking the click.
 *
 * @returns {void}
 */
FastClick.prototype.onTouchCancel = function() {
	'use strict';
	this.trackingClick = false;
	this.targetElement = null;
};


/**
 * Determine mouse events which should be permitted.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onMouse = function(event) {
	'use strict';

	// If a target element was never set (because a touch event was never fired) allow the event
	if (!this.targetElement) {
		return true;
	}

	if (event.forwardedTouchEvent) {
		return true;
	}

	// Programmatically generated events targeting a specific element should be permitted
	if (!event.cancelable) {
		return true;
	}

	// Derive and check the target element to see whether the mouse event needs to be permitted;
	// unless explicitly enabled, prevent non-touch click events from triggering actions,
	// to prevent ghost/doubleclicks.
	if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

		// Prevent any user-added listeners declared on FastClick element from being fired.
		if (event.stopImmediatePropagation) {
			event.stopImmediatePropagation();
		} else {

			// Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
			event.propagationStopped = true;
		}

		// Cancel the event
		event.stopPropagation();
		event.preventDefault();

		return false;
	}

	// If the mouse event is permitted, return true for the action to go through.
	return true;
};


/**
 * On actual clicks, determine whether this is a touch-generated click, a click action occurring
 * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
 * an actual click which should be permitted.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onClick = function(event) {
	'use strict';
	var permitted;

	// It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
	if (this.trackingClick) {
		this.targetElement = null;
		this.trackingClick = false;
		return true;
	}

	// Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
	if (event.target.type === 'submit' && event.detail === 0) {
		return true;
	}

	permitted = this.onMouse(event);

	// Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
	if (!permitted) {
		this.targetElement = null;
	}

	// If clicks are permitted, return true for the action to go through.
	return permitted;
};


/**
 * Remove all FastClick's event listeners.
 *
 * @returns {void}
 */
FastClick.prototype.destroy = function() {
	'use strict';
	var layer = this.layer;

	if (this.deviceIsAndroid) {
		layer.removeEventListener('mouseover', this.onMouse, true);
		layer.removeEventListener('mousedown', this.onMouse, true);
		layer.removeEventListener('mouseup', this.onMouse, true);
	}

	layer.removeEventListener('click', this.onClick, true);
	layer.removeEventListener('touchstart', this.onTouchStart, false);
	layer.removeEventListener('touchmove', this.onTouchMove, false);
	layer.removeEventListener('touchend', this.onTouchEnd, false);
	layer.removeEventListener('touchcancel', this.onTouchCancel, false);
};


/**
 * Check whether FastClick is needed.
 *
 * @param {Element} layer The layer to listen on
 */
FastClick.notNeeded = function(layer) {
	'use strict';
	var metaViewport;
	var chromeVersion;

	// Devices that don't support touch don't need FastClick
	if (typeof window.ontouchstart === 'undefined') {
		return true;
	}

	// Chrome version - zero for other browsers
	chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

	if (chromeVersion) {

		if (FastClick.prototype.deviceIsAndroid) {
			metaViewport = document.querySelector('meta[name=viewport]');
			
			if (metaViewport) {
				// Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
				if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
					return true;
				}
				// Chrome 32 and above with width=device-width or less don't need FastClick
				if (chromeVersion > 31 && window.innerWidth <= window.screen.width) {
					return true;
				}
			}

		// Chrome desktop doesn't need FastClick (issue #15)
		} else {
			return true;
		}
	}

	// IE10 with -ms-touch-action: none, which disables double-tap-to-zoom (issue #97)
	if (layer.style.msTouchAction === 'none') {
		return true;
	}

	return false;
};


/**
 * Factory method for creating a FastClick object
 *
 * @param {Element} layer The layer to listen on
 */
FastClick.attach = function(layer) {
	'use strict';
	return new FastClick(layer);
};


if (typeof define !== 'undefined' && define.amd) {

	// AMD. Register as an anonymous module.
	define(function() {
		'use strict';
		return FastClick;
	});
} else if (typeof module !== 'undefined' && module.exports) {
	module.exports = FastClick.attach;
	module.exports.FastClick = FastClick;
} else {
	window.FastClick = FastClick;
}

});
require.register("switchery/switchery.js", function(exports, require, module){
/**
 * Switchery 0.6.1
 * http://abpetkov.github.io/switchery/
 *
 * Authored by Alexander Petkov
 * https://github.com/abpetkov
 *
 * Copyright 2013-2014, Alexander Petkov
 * License: The MIT License (MIT)
 * http://opensource.org/licenses/MIT
 *
 */

/**
 * External dependencies.
 */

var transitionize = require('transitionize')
  , fastclick = require('fastclick');

/**
 * Expose `Switchery`.
 */

module.exports = Switchery;

/**
 * Set Switchery default values.
 *
 * @api public
 */

var defaults = {
    color          : '#64bd63'
  , secondaryColor : '#dfdfdf'
  , className      : 'switchery'
  , disabled       : false
  , disabledOpacity: 0.5
  , speed          : '0.4s'
};

/**
 * Create Switchery object.
 *
 * @param {Object} element
 * @param {Object} options
 * @api public
 */

function Switchery(element, options) {
  if (!(this instanceof Switchery)) return new Switchery(element, options);

  this.element = element;
  this.options = options || {};

  for (var i in defaults) {
    if (this.options[i] == null) {
      this.options[i] = defaults[i];
    }
  }

  if (this.element != null && this.element.type == 'checkbox') this.init();
}

/**
 * Hide the target element.
 *
 * @api private
 */

Switchery.prototype.hide = function() {
  this.element.style.display = 'none';
};

/**
 * Show custom switch after the target element.
 *
 * @api private
 */

Switchery.prototype.show = function() {
  var switcher = this.create();
  this.insertAfter(this.element, switcher);
};

/**
 * Create custom switch.
 *
 * @returns {Object} this.switcher
 * @api private
 */

Switchery.prototype.create = function() {
  this.switcher = document.createElement('span');
  this.jack = document.createElement('small');
  this.switcher.appendChild(this.jack);
  this.switcher.className = this.options.className;

  return this.switcher;
};

/**
 * Insert after element after another element.
 *
 * @param {Object} reference
 * @param {Object} target
 * @api private
 */

Switchery.prototype.insertAfter = function(reference, target) {
  reference.parentNode.insertBefore(target, reference.nextSibling);
};

/**
 * See if input is checked.
 *
 * @returns {Boolean}
 * @api private
 */

Switchery.prototype.isChecked = function() {
  return this.element.checked;
};

/**
 * See if switcher should be disabled.
 *
 * @returns {Boolean}
 * @api private
 */

Switchery.prototype.isDisabled = function() {
  return this.options.disabled || this.element.disabled;
};

/**
 * Set switch jack proper position.
 *
 * @param {Boolean} clicked - we need this in order to uncheck the input when the switch is clicked
 * @api private
 */

Switchery.prototype.setPosition = function (clicked) {
  var checked = this.isChecked()
    , switcher = this.switcher
    , jack = this.jack;

  if (clicked && checked) checked = false;
  else if (clicked && !checked) checked = true;

  if (checked === true) {
    this.element.checked = true;

    if (window.getComputedStyle) jack.style.left = parseInt(window.getComputedStyle(switcher).width) - parseInt(window.getComputedStyle(jack).width) + 'px';
    else jack.style.left = parseInt(switcher.currentStyle['width']) - parseInt(jack.currentStyle['width']) + 'px';

    if (this.options.color) this.colorize();
    this.setSpeed();
  } else {
    jack.style.left = 0;
    this.element.checked = false;
    this.switcher.style.boxShadow = 'inset 0 0 0 0 ' + this.options.secondaryColor;
    this.switcher.style.borderColor = this.options.secondaryColor;
    this.switcher.style.backgroundColor = (this.options.secondaryColor !== defaults.secondaryColor) ? this.options.secondaryColor : '#fff';
    this.setSpeed();
  }
};

/**
 * Set speed.
 *
 * @api private
 */

Switchery.prototype.setSpeed = function() {
  var switcherProp = {}
    , jackProp = { 'left': this.options.speed.replace(/[a-z]/, '') / 2 + 's' };

  if (this.isChecked()) {
    switcherProp = {
        'border': this.options.speed
      , 'box-shadow': this.options.speed
      , 'background-color': this.options.speed.replace(/[a-z]/, '') * 3 + 's'
    };
  } else {
    switcherProp = {
        'border': this.options.speed
      , 'box-shadow': this.options.speed
    };
  }

  transitionize(this.switcher, switcherProp);
  transitionize(this.jack, jackProp);
};

/**
 * Set switch color.
 *
 * @api private
 */

Switchery.prototype.colorize = function() {
  this.switcher.style.backgroundColor = this.options.color;
  this.switcher.style.borderColor = this.options.color;
  this.switcher.style.boxShadow = 'inset 0 0 0 16px ' + this.options.color;
};

/**
 * Handle the onchange event.
 *
 * @param {Boolean} state
 * @api private
 */

Switchery.prototype.handleOnchange = function(state) {
  if (typeof Event === 'function' || !document.fireEvent) {
    var event = document.createEvent('HTMLEvents');
    event.initEvent('change', true, true);
    this.element.dispatchEvent(event);
  } else {
    this.element.fireEvent('onchange');
  }
};

/**
 * Handle the native input element state change.
 * A `change` event must be fired in order to detect the change.
 *
 * @api private
 */

Switchery.prototype.handleChange = function() {
  var self = this
    , el = this.element;

  if (el.addEventListener) {
    el.addEventListener('change', function() {
      self.setPosition();
    });
  } else {
    el.attachEvent('onchange', function() {
      self.setPosition();
    });
  }
};

/**
 * Handle the switch click event.
 *
 * @api private
 */

Switchery.prototype.handleClick = function() {
  var self = this
    , switcher = this.switcher
    , parent = self.element.parentNode.tagName.toLowerCase()
    , labelParent = (parent === 'label') ? false : true;

  if (this.isDisabled() === false) {
    fastclick(switcher);

    if (switcher.addEventListener) {
      switcher.addEventListener('click', function() {
        self.setPosition(labelParent);
        self.handleOnchange(self.element.checked);
      });
    } else {
      switcher.attachEvent('onclick', function() {
        self.setPosition(labelParent);
        self.handleOnchange(self.element.checked);
      });
    }
  } else {
    this.element.disabled = true;
    this.switcher.style.opacity = this.options.disabledOpacity;
  }
};

/**
 * Mark an individual switch as already handled.
 *
 * @api private
 */

Switchery.prototype.markAsSwitched = function() {
  this.element.setAttribute('data-switchery', true);
};

/**
 * Check if an individual switch is already handled.
 *
 * @api private
 */

Switchery.prototype.markedAsSwitched = function() {
  return this.element.getAttribute('data-switchery');
};

/**
 * Initialize Switchery.
 *
 * @api private
 */

Switchery.prototype.init = function() {
  this.hide();
  this.show();
  this.setPosition();
  this.markAsSwitched();
  this.handleChange();
  this.handleClick();
};

});




require.alias("abpetkov-transitionize/transitionize.js", "switchery/deps/transitionize/transitionize.js");
require.alias("abpetkov-transitionize/transitionize.js", "switchery/deps/transitionize/index.js");
require.alias("abpetkov-transitionize/transitionize.js", "transitionize/index.js");
require.alias("abpetkov-transitionize/transitionize.js", "abpetkov-transitionize/index.js");
require.alias("ftlabs-fastclick/lib/fastclick.js", "switchery/deps/fastclick/lib/fastclick.js");
require.alias("ftlabs-fastclick/lib/fastclick.js", "switchery/deps/fastclick/index.js");
require.alias("ftlabs-fastclick/lib/fastclick.js", "fastclick/index.js");
require.alias("ftlabs-fastclick/lib/fastclick.js", "ftlabs-fastclick/index.js");
require.alias("switchery/switchery.js", "switchery/index.js");if (typeof exports == "object") {
  module.exports = require("switchery");
} else if (typeof define == "function" && define.amd) {
  define(function(){ return require("switchery"); });
} else {
  this["Switchery"] = require("switchery");
}})();;
(function ($) {

/**
 * A progressbar object. Initialized with the given id. Must be inserted into
 * the DOM afterwards through progressBar.element.
 *
 * method is the function which will perform the HTTP request to get the
 * progress bar state. Either "GET" or "POST".
 *
 * e.g. pb = new progressBar('myProgressBar');
 *      some_element.appendChild(pb.element);
 */
Drupal.progressBar = function (id, updateCallback, method, errorCallback) {
  var pb = this;
  this.id = id;
  this.method = method || 'GET';
  this.updateCallback = updateCallback;
  this.errorCallback = errorCallback;

  // The WAI-ARIA setting aria-live="polite" will announce changes after users
  // have completed their current activity and not interrupt the screen reader.
  this.element = $('<div class="progress" aria-live="polite"></div>').attr('id', id);
  this.element.html('<div class="bar"><div class="filled"></div></div>' +
                    '<div class="percentage"></div>' +
                    '<div class="message">&nbsp;</div>');
};

/**
 * Set the percentage and status message for the progressbar.
 */
Drupal.progressBar.prototype.setProgress = function (percentage, message) {
  if (percentage >= 0 && percentage <= 100) {
    $('div.filled', this.element).css('width', percentage + '%');
    $('div.percentage', this.element).html(percentage + '%');
  }
  $('div.message', this.element).html(message);
  if (this.updateCallback) {
    this.updateCallback(percentage, message, this);
  }
};

/**
 * Start monitoring progress via Ajax.
 */
Drupal.progressBar.prototype.startMonitoring = function (uri, delay) {
  this.delay = delay;
  this.uri = uri;
  this.sendPing();
};

/**
 * Stop monitoring progress via Ajax.
 */
Drupal.progressBar.prototype.stopMonitoring = function () {
  clearTimeout(this.timer);
  // This allows monitoring to be stopped from within the callback.
  this.uri = null;
};

/**
 * Request progress data from server.
 */
Drupal.progressBar.prototype.sendPing = function () {
  if (this.timer) {
    clearTimeout(this.timer);
  }
  if (this.uri) {
    var pb = this;
    // When doing a post request, you need non-null data. Otherwise a
    // HTTP 411 or HTTP 406 (with Apache mod_security) error may result.
    $.ajax({
      type: this.method,
      url: this.uri,
      data: '',
      dataType: 'json',
      success: function (progress) {
        // Display errors.
        if (progress.status == 0) {
          pb.displayError(progress.data);
          return;
        }
        // Update display.
        pb.setProgress(progress.percentage, progress.message);
        // Schedule next timer.
        pb.timer = setTimeout(function () { pb.sendPing(); }, pb.delay);
      },
      error: function (xmlhttp) {
        pb.displayError(Drupal.ajaxError(xmlhttp, pb.uri));
      }
    });
  }
};

/**
 * Display errors on the page.
 */
Drupal.progressBar.prototype.displayError = function (string) {
  var error = $('<div class="messages error"></div>').html(string);
  $(this.element).before(error).hide();

  if (this.errorCallback) {
    this.errorCallback(this);
  }
};

})(jQuery);
;
(function ($) {

Drupal.behaviors.textarea = {
  attach: function (context, settings) {
    $('.form-textarea-wrapper.resizable', context).once('textarea', function () {
      var staticOffset = null;
      var textarea = $(this).addClass('resizable-textarea').find('textarea');
      var grippie = $('<div class="grippie"></div>').mousedown(startDrag);

      grippie.insertAfter(textarea);

      function startDrag(e) {
        staticOffset = textarea.height() - e.pageY;
        textarea.css('opacity', 0.25);
        $(document).mousemove(performDrag).mouseup(endDrag);
        return false;
      }

      function performDrag(e) {
        textarea.height(Math.max(32, staticOffset + e.pageY) + 'px');
        return false;
      }

      function endDrag(e) {
        $(document).unbind('mousemove', performDrag).unbind('mouseup', endDrag);
        textarea.css('opacity', 1);
      }
    });
  }
};

})(jQuery);
;

(function ($) {

/**
 * Auto-hide summary textarea if empty and show hide and unhide links.
 */
Drupal.behaviors.textSummary = {
  attach: function (context, settings) {
    $('.text-summary', context).once('text-summary', function () {
      var $widget = $(this).closest('div.field-type-text-with-summary');
      var $summaries = $widget.find('div.text-summary-wrapper');

      $summaries.once('text-summary-wrapper').each(function(index) {
        var $summary = $(this);
        var $summaryLabel = $summary.find('label').first();
        var $full = $widget.find('.text-full').eq(index).closest('.form-item');
        var $fullLabel = $full.find('label').first();

        // Create a placeholder label when the field cardinality is
        // unlimited or greater than 1.
        if ($fullLabel.length == 0) {
          $fullLabel = $('<label></label>').prependTo($full);
        }

        // Setup the edit/hide summary link.
        var $link = $('<span class="field-edit-link">(<a class="link-edit-summary" href="#">' + Drupal.t('Hide summary') + '</a>)</span>');
        var $a = $link.find('a');
        var toggleClick = true;
        $link.bind('click', function (e) {
          if (toggleClick) {
            $summary.hide();
            $a.html(Drupal.t('Edit summary'));
            $link.appendTo($fullLabel);
          }
          else {
            $summary.show();
            $a.html(Drupal.t('Hide summary'));
            $link.appendTo($summaryLabel);
          }
          toggleClick = !toggleClick;
          return false;
        }).appendTo($summaryLabel);

        // If no summary is set, hide the summary field.
        if ($(this).find('.text-summary').val() == '') {
          $link.click();
        }
      });
    });
  }
};

})(jQuery);
;

/**
 * @file: Popup dialog interfaces for the media project.
 *
 * Drupal.media.popups.mediaBrowser
 *   Launches the media browser which allows users to pick a piece of media.
 *
 * Drupal.media.popups.mediaStyleSelector
 *  Launches the style selection form where the user can choose what
 *  format/style they want their media in.
 */

(function ($) {
namespace('Drupal.media.popups');

/**
 * Media browser popup. Creates a media browser dialog.
 *
 * @param {function}
 *   onSelect Callback for when dialog is closed, received (Array media, Object
 *   extra);
 * @param {Object}
 *   globalOptions Global options that will get passed upon initialization of
 *   the browser. @see Drupal.media.popups.mediaBrowser.getDefaults();
 * @param {Object}
 *   pluginOptions Options for specific plugins. These are passed to the plugin
 *   upon initialization.  If a function is passed here as a callback, it is
 *   obviously not passed, but is accessible to the plugin in
 *   Drupal.settings.variables. Example:
 *   pluginOptions = {library: {url_include_patterns:'/foo/bar'}};
 * @param {Object}
 *   widgetOptions Options controlling the appearance and behavior of the modal
 *   dialog. @see Drupal.media.popups.mediaBrowser.getDefaults();
 */
Drupal.media.popups.mediaBrowser = function (onSelect, globalOptions, pluginOptions, widgetOptions) {
  // Get default dialog options.
  var options = Drupal.media.popups.mediaBrowser.getDefaults();

  // Add global, plugin and widget options.
  options.global = $.extend({}, options.global, globalOptions);
  options.plugins = pluginOptions;
  options.widget = $.extend({}, options.widget, widgetOptions);

  // Find the URL of the modal iFrame.
  var browserSrc = options.widget.src;

  if ($.isArray(browserSrc) && browserSrc.length) {
    browserSrc = browserSrc[browserSrc.length - 1];
  }

  // Create an array of parameters to send along to the iFrame.
  var params = {};

  // Add global field widget settings and plugin information.
  $.extend(params, options.global);
  params.plugins = options.plugins;

  // Append the list of parameters to the iFrame URL as query parameters.
  browserSrc += '&' + $.param(params);

  // Create an iFrame with the iFrame URL.
  var mediaIframe = Drupal.media.popups.getPopupIframe(browserSrc, 'mediaBrowser');

  // Attach an onLoad event.
  mediaIframe.bind('load', options, options.widget.onLoad);

  // Create an array of Dialog options.
  var dialogOptions = options.dialog;

  // Setup the dialog buttons.
  var ok = Drupal.t('OK');
  var notSelected = Drupal.t('You have not selected anything!');

  dialogOptions.buttons[ok] = function () {
    // Find the current file selection.
    var selected = this.contentWindow.Drupal.media.browser.selectedMedia;

    // Alert the user if a selection has yet to be made.
    if (selected.length < 1) {
      alert(notSelected);

      return;
    }

    // Select the file.
    onSelect(selected);

    // Close the dialog.
    $(this).dialog('close');
  };

  // Create a jQuery UI dialog with the given options.
  var dialog = mediaIframe.dialog(dialogOptions);

  // Allow the dialog to react to re-sizing, scrolling, etc.
  Drupal.media.popups.sizeDialog(dialog);
  Drupal.media.popups.resizeDialog(dialog);
  Drupal.media.popups.scrollDialog(dialog);
  Drupal.media.popups.overlayDisplace(dialog.parents(".ui-dialog"));

  return mediaIframe;
};

/**
 * Retrieves a list of default settings for the media browser.
 *
 * @return
 *   An array of default settings.
 */
Drupal.media.popups.mediaBrowser.getDefaults = function () {
  return {
    global: {
      types: [], // Types to allow, defaults to all.
      activePlugins: [] // If provided, a list of plugins which should be enabled.
    },
    widget: { // Settings for the actual iFrame which is launched.
      src: Drupal.settings.media.browserUrl, // Src of the media browser (if you want to totally override it)
      onLoad: Drupal.media.popups.mediaBrowser.mediaBrowserOnLoad // Onload function when iFrame loads.
    },
    dialog: Drupal.media.popups.getDialogOptions()
  };
};

/**
 * Sets up the iFrame buttons.
 */
Drupal.media.popups.mediaBrowser.mediaBrowserOnLoad = function (e) {
  var options = e.data;

  // Ensure that the iFrame is defined.
  if (this.contentWindow.Drupal.media == undefined) {
    return;
  }

  // Check if a selection has been made and press the 'ok' button.
  if (this.contentWindow.Drupal.media.browser.selectedMedia.length > 0) {
    var ok = Drupal.t('OK');
    var ok_func = $(this).dialog('option', 'buttons')[ok];

    ok_func.call(this);

    return;
  }
};

/**
 * Finalizes the selection of a file.
 *
 * Alerts the user if a selection has yet to be made, triggers the file
 * selection and closes the modal dialog.
 */
Drupal.media.popups.mediaBrowser.finalizeSelection = function () {
  // Find the current file selection.
  var selected = this.contentWindow.Drupal.media.browser.selectedMedia;

  // Alert the user if a selection has yet to be made.
  if (selected.length < 1) {
    alert(notSelected);

    return;
  }

  // Select the file.
  onSelect(selected);

  // Close the dialog.
  $(this).dialog('close');
};

/**
 * Style chooser Popup. Creates a dialog for a user to choose a media style.
 *
 * @param mediaFile
 *   The mediaFile you are requesting this formatting form for.
 *   @todo: should this be fid? That's actually all we need now.
 *
 * @param Function
 *   onSubmit Function to be called when the user chooses a media style. Takes
 *   one parameter (Object formattedMedia).
 *
 * @param Object
 *   options Options for the mediaStyleChooser dialog.
 */
Drupal.media.popups.mediaStyleSelector = function (mediaFile, onSelect, options) {
  var defaults = Drupal.media.popups.mediaStyleSelector.getDefaults();

  // @todo: remove this awful hack :(
  if (typeof defaults.src === 'string' ) {
    defaults.src = defaults.src.replace('-media_id-', mediaFile.fid) + '&fields=' + encodeURIComponent(JSON.stringify(mediaFile.fields));
  }
  else {
    var src = defaults.src.shift();

    defaults.src.unshift(src);
    defaults.src = src.replace('-media_id-', mediaFile.fid) + '&fields=' + encodeURIComponent(JSON.stringify(mediaFile.fields));
  }

  options = $.extend({}, defaults, options);

  // Create an iFrame with the iFrame URL.
  var mediaIframe = Drupal.media.popups.getPopupIframe(options.src, 'mediaStyleSelector');

  // Attach an onLoad event.
  mediaIframe.bind('load', options, options.onLoad);

  // Create an array of Dialog options.
  var dialogOptions = Drupal.media.popups.getDialogOptions();

  // Setup the dialog buttons.
  var ok = Drupal.t('OK');
  var notSelected = Drupal.t('Very sorry, there was an unknown error embedding media.');

  dialogOptions.buttons[ok] = function () {
    // Find the current file selection.
    var formattedMedia = this.contentWindow.Drupal.media.formatForm.getFormattedMedia();

    // Alert the user if a selection has yet to be made.
    if (!formattedMedia) {
      alert(notSelected);

      return;
    }

    // Select the file.
    onSelect(formattedMedia);

    // Close the dialog.
    $(this).dialog('close');
  };

  // Create a jQuery UI dialog with the given options.
  var dialog = mediaIframe.dialog(dialogOptions);

  // Allow the dialog to react to re-sizing, scrolling, etc.
  Drupal.media.popups.sizeDialog(dialog);
  Drupal.media.popups.resizeDialog(dialog);
  Drupal.media.popups.scrollDialog(dialog);
  Drupal.media.popups.overlayDisplace(dialog.parents(".ui-dialog"));

  return mediaIframe;
};

Drupal.media.popups.mediaStyleSelector.mediaBrowserOnLoad = function (e) {
};

Drupal.media.popups.mediaStyleSelector.getDefaults = function () {
  return {
    src: Drupal.settings.media.styleSelectorUrl,
    onLoad: Drupal.media.popups.mediaStyleSelector.mediaBrowserOnLoad
  };
};

/**
 * Style chooser Popup. Creates a dialog for a user to choose a media style.
 *
 * @param mediaFile
 *   The mediaFile you are requesting this formatting form for.
 *   @todo: should this be fid? That's actually all we need now.
 *
 * @param Function
 *   onSubmit Function to be called when the user chooses a media style. Takes
 *   one parameter (Object formattedMedia).
 *
 * @param Object
 *   options Options for the mediaStyleChooser dialog.
 */
Drupal.media.popups.mediaFieldEditor = function (fid, onSelect, options) {
  var defaults = Drupal.media.popups.mediaFieldEditor.getDefaults();

  // @todo: remove this awful hack :(
  defaults.src = defaults.src.replace('-media_id-', fid);
  options = $.extend({}, defaults, options);

  // Create an iFrame with the iFrame URL.
  var mediaIframe = Drupal.media.popups.getPopupIframe(options.src, 'mediaFieldEditor');

  // Attach an onLoad event.
  mediaIframe.bind('load', options, options.onLoad);

  // Create an array of Dialog options.
  var dialogOptions = Drupal.media.popups.getDialogOptions();

  // Setup the dialog buttons.
  var ok = Drupal.t('OK');
  var notSelected = Drupal.t('Very sorry, there was an unknown error embedding media.');

  dialogOptions.buttons[ok] = function () {
    // Find the current file selection.
    var formattedMedia = this.contentWindow.Drupal.media.formatForm.getFormattedMedia();

    // Alert the user if a selection has yet to be made.
    if (!formattedMedia) {
      alert(notSelected);

      return;
    }

    // Select the file.
    onSelect(formattedMedia);

    // Close the dialog.
    $(this).dialog('close');
  };

  // Create a jQuery UI dialog with the given options.
  var dialog = mediaIframe.dialog(dialogOptions);

  // Allow the dialog to react to re-sizing, scrolling, etc.
  Drupal.media.popups.sizeDialog(dialog);
  Drupal.media.popups.resizeDialog(dialog);
  Drupal.media.popups.scrollDialog(dialog);
  Drupal.media.popups.overlayDisplace(dialog);

  return mediaIframe;
};

Drupal.media.popups.mediaFieldEditor.mediaBrowserOnLoad = function (e) {

};

Drupal.media.popups.mediaFieldEditor.getDefaults = function () {
  return {
    // @todo: do this for real
    src: '/media/-media_id-/edit?render=media-popup',
    onLoad: Drupal.media.popups.mediaFieldEditor.mediaBrowserOnLoad
  };
};

/**
 * Generic functions to both the media-browser and style selector.
 */

/**
 * Returns the commonly used options for the dialog.
 */
Drupal.media.popups.getDialogOptions = function () {
  return {
    title: Drupal.t('Media browser'),
    buttons: {},
    dialogClass: Drupal.settings.media.dialogOptions.dialogclass,
    modal: Drupal.settings.media.dialogOptions.modal,
    draggable: Drupal.settings.media.dialogOptions.draggable,
    resizable: Drupal.settings.media.dialogOptions.resizable,
    minWidth: Drupal.settings.media.dialogOptions.minwidth,
    width: Drupal.settings.media.dialogOptions.width,
    height: Drupal.settings.media.dialogOptions.height,
    position: Drupal.settings.media.dialogOptions.position,
    overlay: {
      backgroundColor: Drupal.settings.media.dialogOptions.overlay.backgroundcolor,
      opacity: Drupal.settings.media.dialogOptions.overlay.opacity
    },
    zIndex: Drupal.settings.media.dialogOptions.zindex,
    close: function (event, ui) {
      $(event.target).remove();
    }
  };
};

/**
 * Get an iframe to serve as the dialog's contents. Common to both plugins.
 */
Drupal.media.popups.getPopupIframe = function (src, id, options) {
  var defaults = {width: '100%', scrolling: 'auto'};
  var options = $.extend({}, defaults, options);

  return $('<iframe class="media-modal-frame"/>')
  .attr('src', src)
  .attr('width', options.width)
  .attr('id', id)
  .attr('scrolling', options.scrolling);
};

Drupal.media.popups.overlayDisplace = function (dialog) {
  if (parent.window.Drupal.overlay && jQuery.isFunction(parent.window.Drupal.overlay.getDisplacement)) {
    var overlayDisplace = parent.window.Drupal.overlay.getDisplacement('top');

    if (dialog.offset().top < overlayDisplace) {
      dialog.css('top', overlayDisplace);
    }
  }
}

/**
 * Size the dialog when it is first loaded and keep it centered when scrolling.
 *
 * @param jQuery dialogElement
 *  The element which has .dialog() attached to it.
 */
Drupal.media.popups.sizeDialog = function (dialogElement) {
  if (!dialogElement.is(':visible')) {
    return;
  }

  var windowWidth = $(window).width();
  var dialogWidth = windowWidth * 0.8;
  var windowHeight = $(window).height();
  var dialogHeight = windowHeight * 0.8;

  dialogElement.dialog("option", "width", dialogWidth);
  dialogElement.dialog("option", "height", dialogHeight);
  dialogElement.dialog("option", "position", 'center');

  $('.media-modal-frame').width('100%');
}

/**
 * Resize the dialog when the window changes.
 *
 * @param jQuery dialogElement
 *  The element which has .dialog() attached to it.
 */
Drupal.media.popups.resizeDialog = function (dialogElement) {
  $(window).resize(function() {
    Drupal.media.popups.sizeDialog(dialogElement);
  });
}

/**
 * Keeps the dialog centered when the window is scrolled.
 *
 * @param jQuery dialogElement
 *  The element which has .dialog() attached to it.
 */
Drupal.media.popups.scrollDialog = function (dialogElement) {
  // Keep the dialog window centered when scrolling.
  $(window).scroll(function() {
    if (!dialogElement.is(':visible')) {
      return;
    }

    dialogElement.dialog("option", "position", 'center');
  });
}

})(jQuery);
;
(function ($) {

/**
 * Automatically display the guidelines of the selected text format.
 */
Drupal.behaviors.filterGuidelines = {
  attach: function (context) {
    $('.filter-guidelines', context).once('filter-guidelines')
      .find(':header').hide()
      .closest('.filter-wrapper').find('select.filter-list')
      .bind('change', function () {
        $(this).closest('.filter-wrapper')
          .find('.filter-guidelines-item').hide()
          .siblings('.filter-guidelines-' + this.value).show();
      })
      .change();
  }
};

})(jQuery);
;
/**
 *  @file
 *  File with utilities to handle media in html editing.
 */
(function ($) {

  Drupal.media = Drupal.media || {};
  /**
   * Utility to deal with media tokens / placeholders.
   */
  Drupal.media.filter = {
    /**
     * Replaces media tokens with the placeholders for html editing.
     * @param content
     */
    replaceTokenWithPlaceholder: function(content) {
      Drupal.media.filter.ensure_tagmap();
      var matches = content.match(/\[\[.*?\]\]/g);

      if (matches) {
        for (var i = 0; i < matches.length; i++) {
          var match = matches[i];
          if (match.indexOf('"type":"media"') == -1) {
            continue;
          }

          // Check if the macro exists in the tagmap. This ensures backwards
          // compatibility with existing media and is moderately more efficient
          // than re-building the element.
          var media = Drupal.settings.tagmap[match];
          var media_json = match.replace('[[', '').replace(']]', '');

          // Ensure that the media JSON is valid.
          try {
            var media_definition = JSON.parse(media_json);
          }
          catch (err) {
            // @todo: error logging.
            // Content should be returned to prevent an empty editor.
            return content;
          }

          // Re-build the media if the macro has changed from the tagmap.
          if (!media && media_definition.fid) {
            Drupal.media.filter.ensureSourceMap();
            var source = Drupal.settings.mediaSourceMap[media_definition.fid];
            media = document.createElement(source.tagName);
            media.src = source.src;
            media.innerHTML = source.innerHTML;
          }

          // Apply attributes.
          var element = Drupal.media.filter.create_element(media, media_definition);
          var markup  = Drupal.media.filter.outerHTML(element);

          // Use split and join to replace all instances of macro with markup.
          content = content.split(match).join(markup);
        }
      }

      return content;
    },

    /**
     * Replaces media elements with tokens.
     *
     * @param content (string)
     *   The markup within the wysiwyg instance.
     */
    replacePlaceholderWithToken: function(content) {
      Drupal.media.filter.ensure_tagmap();

      // Rewrite the tagmap in case any of the macros have changed.
      Drupal.settings.tagmap = {};

      // Replace all media placeholders with their JSON macro representations.
      //
      // There are issues with using jQuery to parse the WYSIWYG content (see
      // http://drupal.org/node/1280758), and parsing HTML with regular
      // expressions is a terrible idea (see http://stackoverflow.com/a/1732454/854985)
      //
      // WYSIWYG editors act wacky with complex placeholder markup anyway, so an
      // image is the most reliable and most usable anyway: images can be moved by
      // dragging and dropping, and can be resized using interactive handles.
      //
      // Media requests a WYSIWYG place holder rendering of the file by passing
      // the wysiwyg => 1 flag in the settings array when calling
      // media_get_file_without_label().
      //
      // Finds the media-element class.
      var classRegex = 'class=[\'"][^\'"]*?media-element';
      // Image tag with the media-element class.
      var regex = '<img[^>]+' + classRegex + '[^>]*?>';
      // Or a span with the media-element class (used for documents).
      // \S\s catches any character, including a linebreak; JavaScript does not
      // have a dotall flag.
      regex += '|<span[^>]+' + classRegex + '[^>]*?>[\\S\\s]+?</span>';
      var matches = content.match(RegExp(regex, 'gi'));
      if (matches) {
        for (i = 0; i < matches.length; i++) {
          markup = matches[i];
          macro = Drupal.media.filter.create_macro($(markup));
          Drupal.settings.tagmap[macro] = markup;
          content = content.replace(markup, macro);
        }
      }

      return content;
    },

    /**
     * Serializes file information as a url-encoded JSON object and stores it
     * as a data attribute on the html element.
     *
     * @param html (string)
     *    A html element to be used to represent the inserted media element.
     * @param info (object)
     *    A object containing the media file information (fid, view_mode, etc).
     */
    create_element: function (html, info) {
      if ($('<div>').append(html).text().length === html.length) {
        // Element is not an html tag. Surround it in a span element so we can
        // pass the file attributes.
        html = '<span>' + html + '</span>';
      }
      var element = $(html);

      // Parse out link wrappers. They will be re-applied when the image is
      // rendered on the front-end.
      if (element.is('a')) {
        element = element.children();
      }

      // Move attributes from the file info array to the placeholder element.
      if (info.attributes) {
        $.each(Drupal.settings.media.wysiwyg_allowed_attributes, function(i, a) {
          if (info.attributes[a]) {
            element.attr(a, info.attributes[a]);
          }
        });
        delete(info.attributes);

        // Store information to rebuild the element later, if necessary.
        Drupal.media.filter.ensureSourceMap();
        Drupal.settings.mediaSourceMap[info.fid] = {
          tagName: element[0].tagName,
          src: element[0].src,
          innerHTML: element[0].innerHTML
        }
      }

      info.type = info.type || "media";

      // Store the data in the data map.
      Drupal.media.filter.ensureDataMap();
      Drupal.settings.mediaDataMap[info.fid] = info;

      // Store the fid in the DOM to retrieve the data from the info map.
      element.attr('data-fid', info.fid);

      // Add data-media-element attribute so we can find the markup element later.
      element.attr('data-media-element', '1')

      var classes = ['media-element'];
      if (info.view_mode) {
        classes.push('file-' + info.view_mode.replace(/_/g, '-'));
      }
      element.addClass(classes.join(' '));

      // Apply link_text if present.
      if (info.link_text) {
        $('a', element).html(info.link_text);
      }

      return element;
    },

    /**
     * Create a macro representation of the inserted media element.
     *
     * @param element (jQuery object)
     *    A media element with attached serialized file info.
     */
    create_macro: function (element) {
      var file_info = Drupal.media.filter.extract_file_info(element);
      if (file_info) {
        if (typeof file_info.link_text == 'string') {
          // Make sure the link_text-html-tags are properly escaped.
          file_info.link_text = file_info.link_text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }
        return '[[' + JSON.stringify(file_info) + ']]';
      }
      return false;
    },

    /**
     * Extract the file info from a WYSIWYG placeholder element as JSON.
     *
     * @param element (jQuery object)
     *    A media element with associated file info via a file id (fid).
     */
    extract_file_info: function (element) {
      var fid, file_info, value;

      if (fid = element.data('fid')) {
        Drupal.media.filter.ensureDataMap();

        if (file_info = Drupal.settings.mediaDataMap[fid]) {
          file_info.attributes = {};

          $.each(Drupal.settings.media.wysiwyg_allowed_attributes, function(i, a) {
            if (value = element.attr(a)) {
              // Replace &quot; by \" to avoid error with JSON format.
              if (typeof value == 'string') {
                value = value.replace('&quot;', '\\"');
              }
              file_info.attributes[a] = value;
            }
          });

          // Extract the link text, if there is any.
          file_info.link_text = element.find('a').html();
        }
      }

      return file_info;
    },

    /**
     * Gets the HTML content of an element.
     *
     * @param element (jQuery object)
     */
    outerHTML: function (element) {
      return element[0].outerHTML || $('<div>').append(element.eq(0).clone()).html();
    },

    /**
     * Gets the wrapped HTML content of an element to insert into the wysiwyg.
     *
     * It also registers the element in the tag map so that the token
     * replacement works.
     *
     * @param element (jQuery object) The element to insert.
     *
     * @see Drupal.media.filter.replacePlaceholderWithToken()
     */
    getWysiwygHTML: function (element) {
      // Create the markup and the macro.
      var markup = Drupal.media.filter.outerHTML(element),
        macro = Drupal.media.filter.create_macro(element);

      // Store macro/markup in the tagmap.
      Drupal.media.filter.ensure_tagmap();
      Drupal.settings.tagmap[macro] = markup;

      // Return the html code to insert in an editor and use it with
      // replacePlaceholderWithToken()
      return markup;
    },

    /**
     * Ensures the src tracking has been initialized and returns it.
     */
    ensureSourceMap: function() {
      Drupal.settings.mediaSourceMap = Drupal.settings.mediaSourceMap || {};
      return Drupal.settings.mediaSourceMap;
    },

    /**
     * Ensures the data tracking has been initialized and returns it.
     */
    ensureDataMap: function() {
      Drupal.settings.mediaDataMap = Drupal.settings.mediaDataMap || {};
      return Drupal.settings.mediaDataMap;
    },

    /**
     * Ensures the tag map has been initialized and returns it.
     */
    ensure_tagmap: function () {
      Drupal.settings.tagmap = Drupal.settings.tagmap || {};
      return Drupal.settings.tagmap;
    }
  }

})(jQuery);
;
(function ($) {

Drupal.behaviors.menuFieldsetSummaries = {
  attach: function (context) {
    $('fieldset.menu-link-form', context).drupalSetSummary(function (context) {
      if ($('.form-item-menu-enabled input', context).is(':checked')) {
        return Drupal.checkPlain($('.form-item-menu-link-title input', context).val());
      }
      else {
        return Drupal.t('Not in menu');
      }
    });
  }
};

/**
 * Automatically fill in a menu link title, if possible.
 */
Drupal.behaviors.menuLinkAutomaticTitle = {
  attach: function (context) {
    $('fieldset.menu-link-form', context).each(function () {
      // Try to find menu settings widget elements as well as a 'title' field in
      // the form, but play nicely with user permissions and form alterations.
      var $checkbox = $('.form-item-menu-enabled input', this);
      var $link_title = $('.form-item-menu-link-title input', context);
      var $title = $(this).closest('form').find('.form-item-title input');
      // Bail out if we do not have all required fields.
      if (!($checkbox.length && $link_title.length && $title.length)) {
        return;
      }
      // If there is a link title already, mark it as overridden. The user expects
      // that toggling the checkbox twice will take over the node's title.
      if ($checkbox.is(':checked') && $link_title.val().length) {
        $link_title.data('menuLinkAutomaticTitleOveridden', true);
      }
      // Whenever the value is changed manually, disable this behavior.
      $link_title.keyup(function () {
        $link_title.data('menuLinkAutomaticTitleOveridden', true);
      });
      // Global trigger on checkbox (do not fill-in a value when disabled).
      $checkbox.change(function () {
        if ($checkbox.is(':checked')) {
          if (!$link_title.data('menuLinkAutomaticTitleOveridden')) {
            $link_title.val($title.val());
          }
        }
        else {
          $link_title.val('');
          $link_title.removeData('menuLinkAutomaticTitleOveridden');
        }
        $checkbox.closest('fieldset.vertical-tabs-pane').trigger('summaryUpdated');
        $checkbox.trigger('formUpdated');
      });
      // Take over any title change.
      $title.keyup(function () {
        if (!$link_title.data('menuLinkAutomaticTitleOveridden') && $checkbox.is(':checked')) {
          $link_title.val($title.val());
          $link_title.val($title.val()).trigger('formUpdated');
        }
      });
    });
  }
};

})(jQuery);
;
(function ($) {

Drupal.behaviors.pathFieldsetSummaries = {
  attach: function (context) {
    $('fieldset.path-form', context).drupalSetSummary(function (context) {
      var path = $('.form-item-path-alias input', context).val();
      var automatic = $('.form-item-path-pathauto input', context).attr('checked');

      if (automatic) {
        return Drupal.t('Automatic alias');
      }
      else if (path) {
        return Drupal.t('Alias: @alias', { '@alias': path });
      }
      else {
        return Drupal.t('No alias');
      }
    });
  }
};

})(jQuery);
;

(function ($) {

Drupal.behaviors.commentFieldsetSummaries = {
  attach: function (context) {
    $('fieldset.comment-node-settings-form', context).drupalSetSummary(function (context) {
      return Drupal.checkPlain($('.form-item-comment input:checked', context).next('label').text());
    });

    // Provide the summary for the node type form.
    $('fieldset.comment-node-type-settings-form', context).drupalSetSummary(function(context) {
      var vals = [];

      // Default comment setting.
      vals.push($(".form-item-comment select option:selected", context).text());

      // Threading.
      var threading = $(".form-item-comment-default-mode input:checked", context).next('label').text();
      if (threading) {
        vals.push(threading);
      }

      // Comments per page.
      var number = $(".form-item-comment-default-per-page select option:selected", context).val();
      vals.push(Drupal.t('@number comments per page', {'@number': number}));

      return Drupal.checkPlain(vals.join(', '));
    });
  }
};

})(jQuery);
;
(function ($) {

/**
 * Attaches the autocomplete behavior to all required fields.
 */
Drupal.behaviors.autocomplete = {
  attach: function (context, settings) {
    var acdb = [];
    $('input.autocomplete', context).once('autocomplete', function () {
      var uri = this.value;
      if (!acdb[uri]) {
        acdb[uri] = new Drupal.ACDB(uri);
      }
      var $input = $('#' + this.id.substr(0, this.id.length - 13))
        .attr('autocomplete', 'OFF')
        .attr('aria-autocomplete', 'list');
      $($input[0].form).submit(Drupal.autocompleteSubmit);
      $input.parent()
        .attr('role', 'application')
        .append($('<span class="element-invisible" aria-live="assertive"></span>')
          .attr('id', $input.attr('id') + '-autocomplete-aria-live')
        );
      new Drupal.jsAC($input, acdb[uri]);
    });
  }
};

/**
 * Prevents the form from submitting if the suggestions popup is open
 * and closes the suggestions popup when doing so.
 */
Drupal.autocompleteSubmit = function () {
  return $('#autocomplete').each(function () {
    this.owner.hidePopup();
  }).length == 0;
};

/**
 * An AutoComplete object.
 */
Drupal.jsAC = function ($input, db) {
  var ac = this;
  this.input = $input[0];
  this.ariaLive = $('#' + this.input.id + '-autocomplete-aria-live');
  this.db = db;

  $input
    .keydown(function (event) { return ac.onkeydown(this, event); })
    .keyup(function (event) { ac.onkeyup(this, event); })
    .blur(function () { ac.hidePopup(); ac.db.cancel(); });

};

/**
 * Handler for the "keydown" event.
 */
Drupal.jsAC.prototype.onkeydown = function (input, e) {
  if (!e) {
    e = window.event;
  }
  switch (e.keyCode) {
    case 40: // down arrow.
      this.selectDown();
      return false;
    case 38: // up arrow.
      this.selectUp();
      return false;
    default: // All other keys.
      return true;
  }
};

/**
 * Handler for the "keyup" event.
 */
Drupal.jsAC.prototype.onkeyup = function (input, e) {
  if (!e) {
    e = window.event;
  }
  switch (e.keyCode) {
    case 16: // Shift.
    case 17: // Ctrl.
    case 18: // Alt.
    case 20: // Caps lock.
    case 33: // Page up.
    case 34: // Page down.
    case 35: // End.
    case 36: // Home.
    case 37: // Left arrow.
    case 38: // Up arrow.
    case 39: // Right arrow.
    case 40: // Down arrow.
      return true;

    case 9:  // Tab.
    case 13: // Enter.
    case 27: // Esc.
      this.hidePopup(e.keyCode);
      return true;

    default: // All other keys.
      if (input.value.length > 0 && !input.readOnly) {
        this.populatePopup();
      }
      else {
        this.hidePopup(e.keyCode);
      }
      return true;
  }
};

/**
 * Puts the currently highlighted suggestion into the autocomplete field.
 */
Drupal.jsAC.prototype.select = function (node) {
  this.input.value = $(node).data('autocompleteValue');
  $(this.input).trigger('autocompleteSelect', [node]);
};

/**
 * Highlights the next suggestion.
 */
Drupal.jsAC.prototype.selectDown = function () {
  if (this.selected && this.selected.nextSibling) {
    this.highlight(this.selected.nextSibling);
  }
  else if (this.popup) {
    var lis = $('li', this.popup);
    if (lis.length > 0) {
      this.highlight(lis.get(0));
    }
  }
};

/**
 * Highlights the previous suggestion.
 */
Drupal.jsAC.prototype.selectUp = function () {
  if (this.selected && this.selected.previousSibling) {
    this.highlight(this.selected.previousSibling);
  }
};

/**
 * Highlights a suggestion.
 */
Drupal.jsAC.prototype.highlight = function (node) {
  if (this.selected) {
    $(this.selected).removeClass('selected');
  }
  $(node).addClass('selected');
  this.selected = node;
  $(this.ariaLive).html($(this.selected).html());
};

/**
 * Unhighlights a suggestion.
 */
Drupal.jsAC.prototype.unhighlight = function (node) {
  $(node).removeClass('selected');
  this.selected = false;
  $(this.ariaLive).empty();
};

/**
 * Hides the autocomplete suggestions.
 */
Drupal.jsAC.prototype.hidePopup = function (keycode) {
  // Select item if the right key or mousebutton was pressed.
  if (this.selected && ((keycode && keycode != 46 && keycode != 8 && keycode != 27) || !keycode)) {
    this.select(this.selected);
  }
  // Hide popup.
  var popup = this.popup;
  if (popup) {
    this.popup = null;
    $(popup).fadeOut('fast', function () { $(popup).remove(); });
  }
  this.selected = false;
  $(this.ariaLive).empty();
};

/**
 * Positions the suggestions popup and starts a search.
 */
Drupal.jsAC.prototype.populatePopup = function () {
  var $input = $(this.input);
  var position = $input.position();
  // Show popup.
  if (this.popup) {
    $(this.popup).remove();
  }
  this.selected = false;
  this.popup = $('<div id="autocomplete"></div>')[0];
  this.popup.owner = this;
  $(this.popup).css({
    top: parseInt(position.top + this.input.offsetHeight, 10) + 'px',
    left: parseInt(position.left, 10) + 'px',
    width: $input.innerWidth() + 'px',
    display: 'none'
  });
  $input.before(this.popup);

  // Do search.
  this.db.owner = this;
  this.db.search(this.input.value);
};

/**
 * Fills the suggestion popup with any matches received.
 */
Drupal.jsAC.prototype.found = function (matches) {
  // If no value in the textfield, do not show the popup.
  if (!this.input.value.length) {
    return false;
  }

  // Prepare matches.
  var ul = $('<ul></ul>');
  var ac = this;
  for (key in matches) {
    $('<li></li>')
      .html($('<div></div>').html(matches[key]))
      .mousedown(function () { ac.hidePopup(this); })
      .mouseover(function () { ac.highlight(this); })
      .mouseout(function () { ac.unhighlight(this); })
      .data('autocompleteValue', key)
      .appendTo(ul);
  }

  // Show popup with matches, if any.
  if (this.popup) {
    if (ul.children().length) {
      $(this.popup).empty().append(ul).show();
      $(this.ariaLive).html(Drupal.t('Autocomplete popup'));
    }
    else {
      $(this.popup).css({ visibility: 'hidden' });
      this.hidePopup();
    }
  }
};

Drupal.jsAC.prototype.setStatus = function (status) {
  switch (status) {
    case 'begin':
      $(this.input).addClass('throbbing');
      $(this.ariaLive).html(Drupal.t('Searching for matches...'));
      break;
    case 'cancel':
    case 'error':
    case 'found':
      $(this.input).removeClass('throbbing');
      break;
  }
};

/**
 * An AutoComplete DataBase object.
 */
Drupal.ACDB = function (uri) {
  this.uri = uri;
  this.delay = 300;
  this.cache = {};
};

/**
 * Performs a cached and delayed search.
 */
Drupal.ACDB.prototype.search = function (searchString) {
  var db = this;
  this.searchString = searchString;

  // See if this string needs to be searched for anyway. The pattern ../ is
  // stripped since it may be misinterpreted by the browser.
  searchString = searchString.replace(/^\s+|\.{2,}\/|\s+$/g, '');
  // Skip empty search strings, or search strings ending with a comma, since
  // that is the separator between search terms.
  if (searchString.length <= 0 ||
    searchString.charAt(searchString.length - 1) == ',') {
    return;
  }

  // See if this key has been searched for before.
  if (this.cache[searchString]) {
    return this.owner.found(this.cache[searchString]);
  }

  // Initiate delayed search.
  if (this.timer) {
    clearTimeout(this.timer);
  }
  this.timer = setTimeout(function () {
    db.owner.setStatus('begin');

    // Ajax GET request for autocompletion. We use Drupal.encodePath instead of
    // encodeURIComponent to allow autocomplete search terms to contain slashes.
    $.ajax({
      type: 'GET',
      url: db.uri + '/' + Drupal.encodePath(searchString),
      dataType: 'json',
      success: function (matches) {
        if (typeof matches.status == 'undefined' || matches.status != 0) {
          db.cache[searchString] = matches;
          // Verify if these are still the matches the user wants to see.
          if (db.searchString == searchString) {
            db.owner.found(matches);
          }
          db.owner.setStatus('found');
        }
      },
      error: function (xmlhttp) {
        alert(Drupal.ajaxError(xmlhttp, db.uri));
      }
    });
  }, this.delay);
};

/**
 * Cancels the current autocomplete request.
 */
Drupal.ACDB.prototype.cancel = function () {
  if (this.owner) this.owner.setStatus('cancel');
  if (this.timer) clearTimeout(this.timer);
  this.searchString = '';
};

})(jQuery);
;

(function ($) {

Drupal.behaviors.nodeFieldsetSummaries = {
  attach: function (context) {
    $('fieldset.node-form-revision-information', context).drupalSetSummary(function (context) {
      var revisionCheckbox = $('.form-item-revision input', context);

      // Return 'New revision' if the 'Create new revision' checkbox is checked,
      // or if the checkbox doesn't exist, but the revision log does. For users
      // without the "Administer content" permission the checkbox won't appear,
      // but the revision log will if the content type is set to auto-revision.
      if (revisionCheckbox.is(':checked') || (!revisionCheckbox.length && $('.form-item-log textarea', context).length)) {
        return Drupal.t('New revision');
      }

      return Drupal.t('No revision');
    });

    $('fieldset.node-form-author', context).drupalSetSummary(function (context) {
      var name = $('.form-item-name input', context).val() || Drupal.settings.anonymous,
        date = $('.form-item-date input', context).val();
      return date ?
        Drupal.t('By @name on @date', { '@name': name, '@date': date }) :
        Drupal.t('By @name', { '@name': name });
    });

    $('fieldset.node-form-options', context).drupalSetSummary(function (context) {
      var vals = [];

      $('input:checked', context).parent().each(function () {
        vals.push(Drupal.checkPlain($.trim($(this).text())));
      });

      if (!$('.form-item-status input', context).is(':checked')) {
        vals.unshift(Drupal.t('Not published'));
      }
      return vals.join(', ');
    });
  }
};

})(jQuery);
;
