;(function($) {
    $.fn.mauGallery = function(options) {
        var options = $.extend($.fn.mauGallery.defaults, options);
        var tagsCollection = [];
        return this.each(function() {
            var itemsCollection = $(this).children('.gallery-item').length;
            
            $.fn.mauGallery.methods.createRowWrapper($(this));
            if (options.lightBox) {
                $.fn.mauGallery.methods.createLightBox($(this), options.lightboxId);
            }
            $.fn.mauGallery.listeners(options);

            $(this).children('.gallery-item').each(function(index) {
                $.fn.mauGallery.methods.responsiveImageItem($(this));
                $.fn.mauGallery.methods.moveItemInRowWrapper($(this));
                $.fn.mauGallery.methods.wrapItemInColumn($(this), options.columns);
                var theTag = $(this).data('gallery-tag');
                if (options.showTags && theTag !== undefined && tagsCollection.indexOf(theTag) === -1) {
                    tagsCollection.push(theTag);
                }
            });

            if (options.showTags) {
                $.fn.mauGallery.methods.showItemTags($(this), options.tagsPosition, tagsCollection);
            }

            $(this).fadeIn(500);
        });
    };
    $.fn.mauGallery.defaults = {
        columns: 3,
        lightBox: true,
        lightboxId: null,
        showTags: true,
        tagsPosition: 'bottom'
    };
    $.fn.mauGallery.listeners = function(options) {
        $('.gallery-item').on('click', function() {
            if (options.lightBox && $(this).prop('tagName') === 'IMG') {
                $.fn.mauGallery.methods.openLightBox($(this), options.lightboxId);
            } else {
                return;
            }
        });

        $('.gallery').on('click', '.nav-link', $.fn.mauGallery.methods.filterByTag);
    }
    $.fn.mauGallery.methods = {
        createRowWrapper(element) {
            if (!element.children().first().hasClass('row')) {
                element.append('<div class="gallery-items-row row"></div>');
            }
        },
        wrapItemInColumn(element, columns) {
            if (columns.constructor === Number) {
                element.wrap(`<div class='item-column mb-4 col-${Math.ceil(12 / columns)}'></div>`);
            } else if (columns.constructor === Object){
                var columnClasses = '';
                if (columns.xs) {
                    columnClasses += ` col-${Math.ceil(12 / columns.xs)}`;
                } 
                if (columns.sm) {
                    columnClasses += ` col-sm-${Math.ceil(12 / columns.sm)}`;
                }
                if (columns.md) {
                    columnClasses += ` col-md-${Math.ceil(12 / columns.md)}`;
                }
                if (columns.lg) {
                    columnClasses += ` col-lg-${Math.ceil(12 / columns.lg)}`;
                }
                if (columns.xl) {
                    columnClasses += ` col-xl-${Math.ceil(12 / columns.xl)}`;
                }
                element.wrap(`<div class='item-column mb-4${columnClasses}'></div>`);
            } else {
                console.error(`Columns should be defined as numbers or objects. ${typeof(columns)} is not supported.`);
            }
        },
        moveItemInRowWrapper(element) {
            element.appendTo('.gallery-items-row');
        },
        responsiveImageItem(element) {
            if (element.prop('tagName') === 'IMG') {
                element.addClass('img-fluid');
            }
        },
        openLightBox(element, lightboxId) {
            $(`#${lightboxId}`).find('.lightboxImage').attr('src', element.attr('src'));
            $(`#${lightboxId}`).modal('toggle');
        },
        createLightBox(gallery, lightboxId) {
            gallery.append(`<div class="modal fade" id="${(lightboxId? lightboxId: 'galleryLightbox')}" tabindex="-1" role="dialog" aria-labelledby="lightboxModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-body">
                            <img class="lightboxImage img-fluid" />
                        </div>
                    </div>
                </div>
            </div>`);
        },
        showItemTags(gallery, position, tags) {
            var tagItems = '<li class="nav-item"><a class="nav-link active active-tag" href="#" data-images-toggle="all">all</a></li>';
            $.each(tags, function(index, value) {
                tagItems += `<li class="nav-item active">
                <a class="nav-link" href="#" data-images-toggle="${value}">${value}</a></li>`;
            });
            var tagsRow = `<ul class="my-4 tags-bar nav nav-pills">${tagItems}</ul>`;

            if (position === 'bottom') {
                gallery.append(tagsRow);
            } else if (position === 'top') {
                gallery.prepend(tagsRow);
            } else {
                console.error(`Unknown tags position: ${position}`);
            }
        },
        filterByTag() {
            if ($(this).hasClass('active-tag')) {
                return;
            }
            $('.active.active-tag').removeClass('active active-tag');
            $(this).addClass('active-tag active');

            var tag = $(this).data('images-toggle');
            
            $('.gallery-item').each(function() {
                $(this).parents('.item-column').hide();
                if (tag === 'all') {
                    $(this).parents('.item-column').show(300);;
                } else if ($(this).data('gallery-tag') === tag) {
                    $(this).parents('.item-column').show(300);;
                }
            });
        }
    }
})(jQuery);
