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
        '<li ><a href="pointOfSales.html"><i class="fa  fa-tv"></i> <span>Point of Sales</span></a></li> ' +
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
        var animationSize = 0.3*Math.min(container.width(),container.height());
        $('.cssload-thecube').css({"width":animationSize,"height":animationSize});
        $('.loadingAnimation').css({"top":(0.5*container.height())+(0.3*animationSize),"left":(0.5*container.width())+(0.3*animationSize)});
    //    $('.loadingAnimation').css({"top":0.5*container.height()+0.25*animationSize,"left":0.5*container.width()-0.25*animationSize});

    }else {
        $('.loadingAnimation').remove();
        $('.overlayCustom').remove();
    }
}



function warningModal(){
var modal = <!-- Warning modal -->
            '<div class="modal modal-warning" id="modalWarning">' +
            '   <div class="modal-dialog">' +
                 '<div class="modal-content">' +
                     '<div class="modal-header">'+
                        '<button type="button" class="close" data-dismiss="modal" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span></button>'+
                        '<h4 class="modal-title">Warning</h4>'+
                     '</div>'+
                 '<div class="modal-body">'+
                    '<p id="warningText">Warning</p>'+
                 '</div>'+
                '<div class="modal-footer">'+
                    '<button type="button" data-dismiss="modal" class="btn btn-outline">Close</button>'+
                '</div>'+
             '</div>'+
            '<!-- /.modal-content -->'+
             '</div>'+
            '<!-- /.modal-dialog -->'+
             '</div>';

    $('#content').append(modal);
}

function errorModal(){
var modal = <!--  Error modal -->
            '<div class="modal modal-danger" id="modalError">'+
                 '<div class="modal-dialog">'+
                    '<div class="modal-content">'+
                        '<div class="modal-header">'+
                            '<button type="button" class="close" data-dismiss="modal" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span></button>'+
                            '<h4 class="modal-title">Error</h4>'+
                        '</div>'+
                        '<div class="modal-body">'+
                            '<p id="errorText">Error</p>'+
                        '</div>'+
                        '<div class="modal-footer">'+
                            '<button type="button" class="btn btn-outline" data-dismiss="modal">Close</button>'+
                        '</div>'+
                    '<!-- /.modal-content -->'+
                     '</div>'+
                 '<!-- /.modal-dialog -->'+
                 '</div>'+
            '<!-- / Error modal -->'
            '</div>';

    $('#content').append(modal);
}

function succesModal(){
    var modal = <!--  Success modal -->
                '<div class="modal modal-success"  id="modalSuccess">'+
                    '<div class="modal-dialog">'+
                        '<div class="modal-content">'+
                            '<div class="modal-header">'+
                                '<button type="button" class="close" data-dismiss="modal" aria-label="Close">'+
                                '<span aria-hidden="true">&times;</span></button>'+
                                '<h4 class="modal-title">Success</h4>'+
                            '</div>'+
                            '<div class="modal-body">'+
                                '<p id="successText">Success</p>'+
                            '</div>'+
                            '<div class="modal-footer">'+
                                '<button type="button" class="btn btn-outline" data-dismiss="modal" onclick="location.reload()">Close</button>'+
                            '</div>'+
                        '</div>'+
                        '<!-- /.modal-content -->'+
                    '</div>'+
                    '<!-- /.modal-dialog -->'+
                '</div>'+
                '<!--  Success modal -->';
    $('#content').append(modal);
}

function templateModals(){
    warningModal();
    errorModal();
    succesModal();
}
