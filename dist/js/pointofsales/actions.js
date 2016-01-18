var siteRoot = "http://api.gewis.nl/pointOfSales/";
var selectedRow;
function initializeTable(){
    loadingAnimation($('#pointsOfSales'),true);
    //Initialize the table with all active events
    // Retrieves data and parses it into the table with given columns
    $('#pointsOfSales').dataTable( {
        "columnDefs": [
            { "orderable": false, "targets": 4},
            ],
        "fnInitComplete": function(){filterDatabase(false);
            loadingAnimation($('#pointsOfSales'),false)},
        "info": true,
        "autoWidth": true,
        "iDisplayLength": "100",
        "ajax": {
            "url": siteRoot,
            "dataSrc": ""
        },
        "columns": [
            { "data": "name"},
            { "data": "ownerID" },
            { "data": "created_at" },
            { "data": "updated_at" },
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

function addPointOfSales(data) {
    $.ajax({
        url: siteRoot,
        type: "POST",
        async: false,
        crossDomain: true,
        dataType: "json",
        data: data,
        success: function (data) {
            $('#successText').text("Point of Sales is added successfully");
            $('#modalSuccess').modal('show');
        },
        error: function(error){
            if(error.status == 500){
                $('#errorText').text(error.responseJSON);
                $('#modalError').modal('show');
            } else {
                $('#warningText').text(error.responseJSON);
                $('#modalWarning').modal('show');
            }
        }
    });
}

function editPointOfSales(id,data){

    $.ajax({
        url: siteRoot +id ,
        type: "PUT",
        async: false,
        crossDomain: true,
        dataType: "json",
        data: data,
        success: function (data) {
            $('#successText').text("Point of Sales is edited successfully");
            $('#modalSuccess').modal('show');
        },
        error: function(error){
            if(error.status == 500){
                $('#errorText').text(error.responseJSON);
                $('#modalError').modal('show');
            } else {
                $('#warningText').text(error.responseJSON);
                $('#modalWarning').modal('show');
            }
        }
    });
}

function addPointOfSalesModalFunctionality() {

    // Load data for add Point of Sales confirmation modal
    $('#addButton').click(function () {
        if($('#pointOfSales')[0].checkValidity()) {
            /* when the button in the form, display the entered values in the modal */
            $('#cname').html($('#name').val());
            $('#cownerID').html($('#ownerID').val());

            $('#addPointOfSalesConfirm').modal({backdrop:'static'});
            $('#addPointOfSalesConfirm').modal('show');
        }
    });

    $('#confirmAdd').click(function () {
        // Retrieve forms and create JSON
        var obj = new Object();
        obj.name = document.getElementById("name").value;
        obj.ownerID = document.getElementById("ownerID").value;
        var json = JSON.stringify(obj);
        /* when the submit button in the modal is clicked, submit the form */
        addPointOfSales(json);

        $('#addPointOfSalesConfirm').modal('hide')

    });
}

function editPointOfSalesModalFunctionality() {

    var table = $('#pointsOfSales').DataTable();
    $('#editButton').addClass('disabled');

    // When a row of the table is clicked
    $('#pointsOfSales').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            $('#editButton').addClass('disabled');
        }
        else {
            $('#editButton').removeClass('disabled');
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            selectedRow = table.row( this ).data();

        }
    });
    $('#editButton').click(function(){
        if ($('#editButton').hasClass('disabled')) {
        }else {
            openEditModal();
        }
    });
    $('#pointsOfSales').on ('dblclick' ,function () {
        openEditModal();
    });

    function openEditModal(){
        $('#identicalMessage').text("");
        // Load variables froms selected row
        var id = selectedRow['ID'];
        var name = selectedRow['name'];
        var ownerID = selectedRow['ownerID'];
        var active = selectedRow['deleted_at'];

        //Set variables from row to modal
        $('#ename').val(name);
        $('#eownerID').val(ownerID);

        if(active == null) {
            active="true";
            $('#eactive').iCheck('check')
            $('#eactive').attr("active", true);
        }else {
            active = "false";
            $('#eactive').iCheck('unCheck');
            $('#eactive').attr("active", false);
        }

        $('#editPointOfSalesConfirm').modal({backdrop:"static"});
        $('#editPointOfSalesConfirm').modal('show');

        // Edit Point of Sales button pressed.
        $('#confirmEdit').click(function () {
            $('#identicalMessage').text("");
            //Get new values from edit modal.
            var newName = $('#ename').val();
            var newOwnerID = $('#eownerID').val();
            var newActive = $('#eactive').attr("active");

            // If no values are changed
            if(name == newName && ownerID == newOwnerID && active == newActive){
                $('#identicalMessage').text("No changes are made to the Point of Sales");
            } else {
                var obj = new Object();
                obj.name = newName;
                obj.ownerID = newOwnerID;
                obj.active = newActive
                var json = JSON.stringify(obj);
                editPointOfSales(id,json);
            }
        });
    }
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
                case "filterCheckbox":
                    filterDatabase(true)
                    break;
                case "eactive":
                    $('#eactive').attr("active", true);
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

function filterDatabase(checked) {
    var table = $('#pointsOfSales').DataTable();
    $.fn.dataTable.ext.search.splice($.fn.dataTable.ext.search.indexOf(activeFilter, 1));
    var activeFilter = function (oSettings, aData, iDataIndex) {

        var row = table.row(iDataIndex).data();
        if (!checked) {
            return (row["deleted_at"] == null) ? true : false;
        } else {
            return true;
        }
    };
    $.fn.dataTableExt.afnFiltering.push(activeFilter)
    table.ajax.reload();
}

