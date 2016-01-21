var siteRootProduct = "http://api.gewis.nl:80/product/";
var siteRootStorage = "http://api.gewis.nl:80/storage/";
var productsChecked = false;
var storageChecked = false;
var productsInStorageArray = {};
var productSelected = null;
var productStorageSelected = null;
var storageSelected = null;

/**
 * Initialized the products table.
 */
function initializeProductsTable(){
    loadingAnimation($('#products'),true);
    //Initialize the table with all active events
    // Retrieves data and parses it into the table with given columns
    $('#products').dataTable( {
        "columnDefs": [
            { "orderable": false, "targets": 2},
            { "orderable": false, "targets": 6},
        ],
        "initComplete": function(){filterTables(productsChecked,storageChecked);
            loadingAnimation($('#products'),false)},
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
}

/**
 * Initializes the storages table
 */
function initializeStorageTables(){
    loadingAnimation($('#storages'),true);
    //Initialize the table with all active storages
    // Retrieves data and parses it into the table with given columns
    $('#storages').dataTable({
        "columnDefs": [
            {"orderable": false, "targets": 2},
        ],
        "initComplete": function () {
            filterTables(false, false);
            getChildData();
            loadingAnimation($('#storages'), false)
        },
        "info": true,
        "autoWidth": true,
        "ajax": {
            "url": siteRootStorage,
            "dataSrc": ""
        },
        "columns": [
            {"data": "name"},
            {"data": "ownerID"},
            {
                "data": "deleted_at", render: function (data, type, full) {
                if (data == null) {
                    return '<i class="fa fa-fw fa-check-circle" style="color:green;"/>';
                } else {
                    return '<i class="fa fa-fw fa-close" style="color:red;"</i>';
                }
            }
            },
        ],
        "createdRow": function (row) {
            $(row).addClass('storageRow');
        },
    });
}

/**
 * Initializes both products and storages table
 */
function initializeTables(){
initializeProductsTable();
initializeStorageTables();
}
/**
 * Retrieves all products that are contained in a storage.
 * @param storageID, integer representing the storage id from which the products should be retrieved.
 */
function getProductsPerStorage(storageID){
    // Start loading animation
    loadingAnimation('storages',true);
          $.ajax({
            url: siteRootStorage + storageID +"/stores",
            type: "GET",
            async: false,
            crossDomain: true,
            dataType: "json",
            success: function (data) {
                loadingAnimation('products',false);
               // Initialize array index for given storageID
                productsInStorageArray[storageID] = [];
                // For each product in the storage
                for (var key in data){
                    //Retrieved additional data from each product in the storage/
                   getAdditionalProductInformation(storageID,data[key]);
                }
                return null;
                console.log(productsInStorageArray);
            },
            error: function(error){
                loadingAnimation('products',false);
                if(error.status == 500){
                    $('#errorText').text(error.responseJSON);
                    $('#modalError').modal('show');
                }
            return null;
            }
        });
}

//TODO
function addProductToStorage(storageID,productID,data){
    // start the load animation
    loadingAnimation('content',true);
    $.ajax({
        url: siteRootStorage + storageID +"/stores/" + productID,
        type: "POST",
        async: false,
        crossDomain: true,
        processData: false,
        contentType: false,
        data: data,
        success: function (data) {
            loadingAnimation('content',false);
            getProductsPerStorage(storageID);
            $('#storages'+storageID).DataTable().ajax.reload();
        },
        error: function(error){
            loadingAnimation('content',false);
            if(error.status == 500){
                $('#errorText').text(error.responseJSON);
                $('#modalError').modal('show');
            }else{
                $('#warningText').text(error.responseJSON);
                $('#modalWarning').modal('show');
            }
        }
    });

}
/**
 * Retrieves additional data from the given product
 * @param storageID, integer representing the storage where the product is stored in
 * @param storageData, associative array containing product id and stcok
 * @modify productsInStorageArray, The gathered data is combined with storageData and added to this array
 */
function getAdditionalProductInformation(storageID,productStorageData){
    loadingAnimation('storages',true);
    $.ajax({
        url: siteRootProduct + productStorageData["productID"],
        type: "GET",
        async: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
            // Merge stock from product with additional information.
            var merged = $.extend(true, {}, data, productStorageData);
            // Add product to the products in storage array.
            productsInStorageArray[storageID].push(merged);
            loadingAnimation('products',false);
            return null;
        },
        error: function(error){
            loadingAnimation('products',false);
            if(error.status == 500){
                $('#errorText').text(error.responseJSON);
                $('#modalError').modal('show');
            }
            return null;
        }
    });
}

/**
 * Handles the functionality of the iCheckboxes
 */
function checkBoxHandler(){
    // Initialize the checkboxes
    $('input:checkbox').iCheck({
            checkboxClass: 'icheckbox_square-blue',
            increaseArea: '50%' // optional
        })
        // execute function when an icheckbox state is changed to checked
        .on('ifChecked',function(e) {
            var field = $(this).attr('id');

            // Based on which checkbox is checked execute functions
            switch (field) {
                case "filterCheckboxProducts":
                    productsChecked = true;
                    filterTables(productsChecked,storageChecked);
                    break;
                case "filterCheckboxStorage":
                    storageChecked = true;
                    filterTables(productsChecked,storageChecked);
                    break;
            }
        })
        // execute function when an icheckbox state is changed to umchecked
        .on('ifUnchecked', function(e){
            var field = $(this).attr('id');

            switch (field) {
                case "filterCheckboxProducts":
                    productsChecked = false;
                    filterTables(productsChecked,storageChecked);
                    break;
                case "filterCheckboxStorage":
                    storageChecked = false;
                    filterTables(productsChecked,storageChecked);
                    break;
            }
        })
}

/**
 * Filters the products and storages table based on two parameters.
 * @param productsChecked, boolean representing whether the show inactive box for products is checked
 * @param storagesChecked, boolean representing whether the show inactive box for storages is checked
 */
function filterTables(productsChecked, storagesChecked){
    // Initialize the
    var tableProducts = $('#products').DataTable();
    var tableStorages = $('#storages').DataTable();

    //Remove all current filters
    $.fn.dataTableExt.afnFiltering.length = 0;

    //Push filters
    $.fn.dataTableExt.afnFiltering.push(function(oSettings, aData, iDataIndex){
        // Check if the data is in the products table
        if(oSettings.nTable.getAttribute('id') === "products"){
            //Filter out inactive products if not checked
            if(!productsChecked){
                var row = tableProducts.row(iDataIndex).data();
                return (row["deleted_at"] == null) ? true : false;
            } else {
               // Do not filter out inactive products.
                return true;
            }
        }
        // Check if the data is in the storages table
        if(oSettings.nTable.getAttribute('id') === "storages") {
            //Filter out inactive storages if not checked
            if (!storagesChecked) {
                var row = tableStorages.row(iDataIndex).data();
                return (row["deleted_at"] == null) ? true : false;
            } else {
                // Do not filter out inactive storages.
                return true;
            }
        }
        return true;

    });
    // Reload both tables.
    tableProducts.ajax.reload();
    tableStorages.ajax.reload();
}

/**
 * Handles the functionality of the products table including row selection.
 */
function productsTableFunctionality(){
    var table = $('#products').DataTable();
    $('#products').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            setProductSelected(null);
        }
        else {

            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            selectedRow = table.row(this).data();
            setProductSelected(selectedRow);

        }
    });
}


function storageTableFunctionality() {
onClickStorageRow();
onClickProductStorageRow();
}

/**
 * Handles the click functionality on the Storage table
 */
function onClickStorageRow(){
    // retrieve tables.
    var table = $('#storages').dataTable();
    var table2 = $('#storages').DataTable();

    // When clicked on a row representing a storage
    $("#storages").on('click','.storageRow', function (){
        var tr = $(this).closest('tr');
        var row = table2.row(tr);

        // The row was already open
        if (table.fnIsOpen(tr)) {
            //Remove the shown and selected class.
            tr.removeClass('shown');
            tr.removeClass('selected');
            setStorageSelected(null);
            // Close the row
            table.fnClose(tr);
        }else{
            // Close all rows that are shown.
            if(table2.row('.shown').length){
                table.fnClose($(table2.row('.shown').node()));
                $(table2.row('.shown').node()).removeClass('shown');
            }
            // Remove all selections from rows that are selected.
            table2.$('tr.selected').removeClass('selected');
            tr.addClass('shown');
            tr.addClass('selected');
            //Get storage ID
            var id = row.data()["ID"];
            setStorageSelected(id);


            /* Open this row */
            table.fnOpen(tr, fnFormatDetails(id), 'details');
            // Initialize and fill the table that is just created with data.
            initializeProductStorageTable(id);
        }
    });
}

/**
 * Handles the click functionality on the product storage table
 */
function onClickProductStorageRow(){
    // When clicked on a row representing a product storage.
    $("#storages").on('click','.productStorageRow', function () {
        var tr = $(this).closest('tr');
        var table = $('#'+ $(this).closest('table').attr('id') + '').DataTable();

        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            setProductStorageSelected(null);

        }
        else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            var selectedProduct = table.row( this ).data();
            setProductStorageSelected(selectedProduct);

        }
    });
}

/**
 * Initializes and fills a productStorage table
 * @param storageID, integer representing the id of the storage for which the products are retrieved
 */
function initializeProductStorageTable(storageID){
    $("#storages" + storageID).dataTable({

        "aaData": productsInStorageArray[storageID],
        "aoColumns": [
            {"data": "name"},
            {"data": "price"},
            {"data": "stock"},
            { "data": "deleted_at",render: function ( data) {
                if (data == null){
                    return '<i class="fa fa-fw fa-check-circle" style="color:green;"/>';
                } else {
                    return '<i class="fa fa-fw fa-close" style="color:red;"</i>';
                }
            }
            },
        ],
        "info": true,
        "iDisplayLength": "100",
        "autoWidth": true,
        "select": true,
        "sPagination": false,
        "sDom": 'ft',
        "createdRow": function (row) {
            $(row).addClass('productStorageRow');
        },
    });
}

/**
 * Returns an table with dynamic id in html format.
 * @param table_id, integer representing the storage id which the products belong to
 * @returns {string}, html formatted table
 */
function fnFormatDetails(table_id) {
    var sOut = '<table id=storages' + table_id + ' class="childTable table-hover cell-border"\>'+
    '<thead>'+
    '<tr>'+
    '<th>Name</th>'+
    '<th>Price (cents)</th>'+
    '<th>Stock</th>'+
    '<th>Active</th>'+
    '</tr>'+
    '</thead>'+
    '<tbody>' +
    '<tr class= "test" role="childRow">' +
    '<td>Name</td>'+
    '<td>Price (cents)</td>'+
    '<td>Stock</td>'+
    '<td>Active</td>'+
    '</tr>'+
    '</tbody>'+
    '</table>';
    return sOut;
}

/**
 * Retrieves all the products for each storage.
 */
function getChildData(){
    //Retrieve the storage table.
     var table = $('#storages').DataTable();

    // For each storage in the table
    table.rows().every(function (){
      var data = this.data();
      getProductsPerStorage(data["ID"]);
  });
}

function setButtonAvailability(){
    if(productSelected && storageSelected){
        $('#addProduct').removeClass("disabled");
    }else{
        $('#addProduct').addClass("disabled");
    }

    if(productSelected && storageSelected && productStorageSelected){
        $('#removeProduct').removeClass("disabled");
    }else{
        $('#removeProduct').addClass("disabled");
    }
}

function setProductSelected(value){
    productSelected = value;
    setButtonAvailability();
}

function setStorageSelected(value){
    storageSelected = value;
    setButtonAvailability();
}

function setProductStorageSelected(value){
    productStorageSelected = value;
    setButtonAvailability();
}

function buttonHandler(){
    $('#addProduct').on("click", function(){
        var stock = new FormData();
        stock.append('stock', 0);
        addProductToStorage(storageSelected,productSelected["ID"],stock);
    });

    $('#removeProduct').on("click", function(){

    })
}