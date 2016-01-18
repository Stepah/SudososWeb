var siteRoot = "http://api.gewis.nl:80/storage/";
var selectedRow;
function initializeTable(){
    loadingAnimation($('#storages'),true);
    //Initialize the table with all active storages
    // Retrieves data and parses it into the table with given columns
    $('#storages').dataTable( {
        "columnDefs": [
            { "orderable": false, "targets": 4},
        ],
        "fnInitComplete": function(){filterDatabase(false);
                         loadingAnimation($('#storages'),false)},
        "info": true,
        "iDisplayLength": "100",
        "autoWidth": true,
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

function addStorage(data) {
    $.ajax({
        url: siteRoot,
        type: "POST",
        async: false,
        crossDomain: true,
        dataType: "json",
        data: data,
        success: function (data) {
            $('#successText').text("Storage is added successfully");
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

function editStorage(id,data) {

    $.ajax({
        url: siteRoot + id,
        type: "PUT",
        async: false,
        crossDomain: true,
        dataType: "json",
        data: data,
        success: function (data) {
            $('#successText').text("Storage is edited successfully");
            $('#modalSuccess').modal('show');
        },
        error: function (error) {
            if (error.status == 500) {
                $('#errorText').text(error.responseJSON);
                $('#modalError').modal('show');
            } else {
                $('#warningText').text(error.responseJSON);
                $('#modalWarning').modal('show');
            }
        }
    });
}

function addStorageModalFunctionality() {

    // Load data for add storage confirmation modal
    $('#addButton').click(function () {
        if($('#storage')[0].checkValidity()) {
            /* when the button in the form, display the entered values in the modal */
            $('#cname').html($('#name').val());
            $('#cownerID').html($('#ownerID').val());

            $('#addStorageConfirm').modal({backdrop:'static'});
            $('#addStorageConfirm').modal('show');
        }
    });

    $('#confirmAdd').click(function () {
        // Retrieve forms and create JSON
        var obj = new Object();
        obj.name = document.getElementById("name").value;
        obj.ownerID = document.getElementById("ownerID").value;
        var json = JSON.stringify(obj);
        /* when the submit button in the modal is clicked, submit the form */
        addStorage(json);
        $('#addStorageConfirm').modal('hide')

    });
}

function editStorageModalFunctionality() {

    var table = $('#storages').DataTable();
    $('#editButton').addClass('disabled');

    // When a row of the table is clicked
    $('#storages').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            $('#editButton').addClass('disabled');
        }
        else {
            $('#editButton').removeClass('disabled');
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            selectedRow = table.row(this).data();

        }
    });
    $('#editButton').click(function () {
        if ($('#editButton').hasClass('disabled')) {
        }else {
            openEditModal();
        }
    });
    $('#storages').on('dblclick', function () {
        openEditModal();
    });
}

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

        $('#editStorageConfirm').modal({backdrop:"static"});
        $('#editStorageConfirm').modal('show');

        // Edit storage button pressed.
        $('#confirmEdit').click(function () {
            $('#identicalMessage').text("");
            //Get new values from edit modal.
            var newName = $('#ename').val();
            var newOwnerID = $('#eownerID').val();
            var newActive = $('#eactive').attr("active");

            // If no values are changed
            if(name == newName && ownerID == newOwnerID && active == newActive){
                $('#identicalMessage').text("No changes are made to the storage");
            } else {
                var obj = new Object();
                obj.name = newName;
                obj.ownerID = newOwnerID;
                obj.active = newActive
                var json = JSON.stringify(obj);
                editStorage(id,json);
            }
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

//Filters the table based on active / inactive storages.
function filterDatabase(checked) {
    var table = $('#storages').DataTable();
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