var siteRootProduct = "http://api.gewis.nl:80/product/";
var siteRootStorage = "http://api.gewis.nl:80/storage/";
function initializeTables(){

    //Initialize the table with all active events
    // Retrieves data and parses it into the table with given columns
    $('#products').dataTable( {
        "columnDefs": [
            { "orderable": false, "targets": 3},
        ],
        "info": true,
        "iDisplayLength": "100",
        "autoWidth": true,
        "select": true,
        "ajax": {
            "url": siteRootProduct,
            "dataSrc": ""
        },
        "columns": [
            { "data": "name"},
            { "data": "price" },
            {"data": "image", render: function (data) {
                if (data == null || data == "" ) {
                    return '<i class="fa fa-fw fa-picture-o fa-2x"></i>'
                } else {
                    return '<img class =thumb1 src=' + data + '>';
                }
            }
            },
            { "data": "traySize" },
            { "data": "category" },
            { "data": "ownerID" },
            { "data": "deleted_at",render: function ( data) {
                if (data == null){
                    return '<i class="fa fa-fw fa-check-circle" style="color:green;"/>';
                } else {
                    return '<i class="fa fa-fw fa-close" style="color:red;"</i>';
                }
            }
            }
        ]
    });

    //Initialize the table with all active storagees
    // Retrieves data and parses it into the table with given columns
    $('#storages').dataTable( {
        "columnDefs": [
            { "orderable": false, "targets": 2},
        ],
        "info": true,
        "autoWidth": true,
        "ajax": {
            "url": siteRootStorage,
            "dataSrc": ""
        },
        "columns": [
            { "data": "name"},
            { "data": "ownerID" },
            { "data": "deleted_at",render: function ( data, type, full) {
                if (data == null){
                    return '<i class="fa fa-fw fa-check-circle" style="color:green;"/>';
                } else {
                    return '<i class="fa fa-fw fa-close" style="color:red;"</i>';
                }
            }
            },
        ],
    });
}

//Handles the functionality of the checkboxes
function checkBoxHandler(){
    $('input:checkbox').iCheck({
            checkboxClass: 'icheckbox_square-blue',
            increaseArea: '50%' // optional
        })
        .on('ifChecked',function(e) {
            var field = $(this).attr('id');

            switch (field) {
                case "filterCheckboxProducts":
                    filterDatabase(true);
                    break;
                case "filterCheckboxStorages":
                   filterDatabase(true);
                    break;
            }
        })
        .on('ifUnchecked', function(e){
            var field = $(this).attr('id');

            switch (field) {
                case "filterCheckbox":
                    filterDatabase(false)
                    break;
                case "eactive":
                    $('#eactive').attr("active", false);
                    break;
            }
        })
}


function filterDatabases(productsChecked,storagesChecked) {
    var tableProducts = $('#products').DataTable();
    var tableStorages = $('#storages').DataTable();

    var activeFilterProducts = function (oSettings, aData, iDataIndex) {
        var row = tableProducts.row(iDataIndex).data();
        console.log(row);
        return (row["deleted_at"] == null) ? true : false;
    };

    var activeFilterStorages = function (oSettings, aData, iDataIndex) {
        var row = tableStorages.row(iDataIndex).data();
        return (row["deleted_at"] == null) ? true : false;
    };

    $.fn.dataTable.ext.search.splice($.fn.dataTable.ext.search.indexOf(activeFilterProducts, 1));
    $.fn.dataTable.ext.search.splice($.fn.dataTable.ext.search.indexOf(activeFilterStorages, 1));

    if(productsChecked){
        $.fn.dataTableExt.afnFiltering.push(activeFilterProducts);
    }

    if(storagesChecked){
        $.fn.dataTableExt.afnFiltering.push(activeFilterStorages);
    }


    tableProducts.ajax.reload();
    tableProducts.ajax.reload();

}

function filterTable(table, checked){


