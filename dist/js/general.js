function createSidebarMenu(){
    var sidebar = '<ul class="sidebar-menu">' +
        '<li class="header">MENU</li> ' +
        '<li class="treeview">' +
        '<a href="#"><i class="fa fa-fw fa-beer"></i> <span>Products</span> <i class="fa fa-angle-left pull-right"></i></a>' +
        '<ul class="treeview-menu">'+
        '<li class="active"><a href="products.html"><i class="fa fa-circle-o"></i>Products</a></li>'+
        '<li ><a href="productsStorage.html"><i class="fa fa-circle-o"></i>Product<->Storage</a></li>'+
        '</ul>'+
        '</li>'+
        '<li class="treeview">'+
        '<a href="#">'+
        '<i class="fa fa-fw fa-dropbox"></i> <span>Storages</span> <i class="fa fa-angle-left pull-right"></i>'+
        '</a>'+
        '<ul class="treeview-menu">'+
        '<li><a href="storage.html"><i class="fa fa-circle-o"></i>Storages</a></li>'+
        '<li><a href="storagePointofSales.html"><i class="fa fa-circle-o"></i>Storage<->Point of Sales</a></li>'+
        '</ul>'+
        '</li>'+
        '<li ><a href="pointOfSales.html"><i class="fa fa-link"></i> <span>Point of Sales</span></a></li> ' +
        '</ul>'
        $('#sidebar').append(sidebar);
}

function loadingAnimation(element,action){

    if(action) {
        var container = $(element).closest(".waitingAnimationApproved");

        var overlay = '<div class="overlayCustom"></div>'
        container.append(overlay);


        var animation = '<div class="cssload-thecube loadingAnimation"> ' +
            '<div class="cssload-cube cssload-c1"></div>' +
            '<div class="cssload-cube cssload-c2"></div>' +
            '<div class="cssload-cube cssload-c4"></div>' +
            '<div class="cssload-cube cssload-c3"></div>' +
            '</div>';

        container.append(animation);
        var animationSize = 0.2*Math.min(container.width(),container.height());
        $('.cssload-thecube').css({"width":animationSize,"height":animationSize});
        $('.loadingAnimation').css({"top":0.5*container.height()-0.8*animationSize,"left":0.5*container.width()-0.75*animationSize});

    }else {
        $('.loadingAnimation').remove();
        $('.overlayCustom').remove();
    }
}