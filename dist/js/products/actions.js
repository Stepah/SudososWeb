var siteRoot = "http://api.gewis.nl:80/product/";
var selectedRow;
//var table = $('#products').DataTable();

function initializeTable(){

    //Initialize the table with all active events
    // Retrieves data and parses it into the table with given columns
        $('#products').dataTable( {
            "columnDefs": [
                { "orderable": false, "targets": 2},
                { "orderable": false, "targets": 8 }
                ],
            "info": true,
            "iDisplayLength": "100",
            "autoWidth": true,
            "select": true,
            "ajax": {
                "url": siteRoot,
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
                { "data": "created_at" },
                { "data": "updated_at" },
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

function addProduct(data) {

        $.ajax({
        url: siteRoot,
        type: "POST",
        async: false,
        crossDomain: true,
        dataType: "json",
        data: data,
        success: function () {
            loadingAnimation('confirmAdd',false)
             $('#successText').text("Product is added successfully");
             $('#modalSuccess').modal('show');
         },
        error: function(error){
            loadingAnimation('confirmAdd',false)
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

function editProduct(id,data){

        $.ajax({
            url:siteRoot +id ,
            type: "PUT",
            async: false,
            crossDomain: true,
            dataType: "json",
            data: data,
            success: function () {
                $('#successText').text("Product is edited successfully");
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

function addProductModalFunctionality() {

        // Load data for add product confirmation modal
        $('#addButton').click(function () {
            if($('#product')[0].checkValidity()) {
                /* when the button in the form, display the entered values in the modal */
                $('#cname').html($('#name').val());
                $('#cprice').html($('#price').val());
                $('#thumbConfirm').attr("src", $('#thumb').attr("resized"));
                $('#ctraySize').html($('#traySize').val());
                $('#cownerID').html($('#ownerID').val());
                $('#ccategory').html($('#category').val());

                // Disable close when clicked outside the modal and open it
                $('#addProductConfirm').modal({backdrop:'static'});
                $('#addProductConfirm').modal('show');


            }
        });
    /* when the submit button in the modal is clicked, submit the form */
        $('#confirmAdd').click(function () {
            // Retrieve forms and create JSON
            var obj = new Object();
            obj.name = document.getElementById("name").value;
            obj.price = document.getElementById("price").value;
            obj.image = $('#thumbConfirm').attr("src");
            obj.traySize = document.getElementById("traySize").value;
            obj.ownerID = document.getElementById("ownerID").value;
            obj.category = document.getElementById("category").value;

            var json = JSON.stringify(obj);
            addProduct(json);
            $('#addProductConfirm').modal('hide')

        });
    }

function editProductModalFunctionality() {
         //Disable edit button by default
        $('#editButton').addClass('disabled');

    var table = $('#products').DataTable();


    $('#products').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
                $('#editButton').addClass('disabled');
            }
            else {
                //Enable edit button
                $('#editButton').removeClass('disabled');
                table.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
                selectedRow = table.row(this).data();
            }
        });
        $('#editButton').click(function () {
            if ($('#editButton').hasClass('disabled')) {
            }else{
                openEditModal();
            }
        });
        $('#products').on('dblclick', function () {
            openEditModal();
        });
    }

function openEditModal() {
    $('#identicalMessage').text("");

    // Load variables froms selected row
    var id = selectedRow['ID'];
    var name = selectedRow['name'];
    var price = selectedRow['price'];
    var image = selectedRow['image'];
    var traySize = selectedRow['traySize'];
    var ownerID = selectedRow['ownerID'];
    var category = selectedRow['category'];
    var active = selectedRow['deleted_at'];

    //Set variables from row to modal
    $('#ename').val(name);
    $('#eprice').val(price);
    $('#eimage').attr("src", image);
    $('#etraySize').val(traySize);
    $('#eownerID').val(ownerID);
        $('#ecategory').val(category);

    if (active == null) {
        active = "true";
        $('#eactive').iCheck('check')
        $('#eactive').attr("active", true);
    } else {
        active = "false";
        $('#eactive').iCheck('check');
        $('#eactive').attr("active", false);
    }

    checkRemoveButtonsNeeded();

    // Disable close when clicked outside the modal and open the model
       $('#editProductConfirm').modal({backdrop:"static"});
    $('#editProductConfirm').modal('show');

    // Edit product button pressed.
    $('#confirmEdit').click(function () {
        $('#identicalMessage').text("");
        //Get new values from edit modal.
        var newName = $('#ename').val();
        var newPrice = $('#eprice').val();
        //Check if image is changed. If so send resized image to server.
        if($('#eimage').attr("resized") == null){
            var newImage = $('#eimage').attr("src");
        }else {
            var newImage = $('#eimage').attr("resized");
        }
        var newTraySize = $('#etraySize').val();
        var newOwnerID = $('#eownerID').val();
        var newCategory = $('#ecategory').val();
        var newActive = $('#eactive').attr("active");

        // If no values are changed
        if (name === newName && price === newPrice && image === newImage && traySize === newTraySize
            && ownerID === newOwnerID && category === newCategory && active === newActive) {

            $('#identicalMessage').text("No changes are made to the product");
        } else {
            $('#identicalMessage').text("");
            var obj = new Object();
            obj.name = newName;
            obj.price = newPrice;
            obj.image = newImage;
            obj.traySize = newTraySize
            obj.ownerID = newOwnerID;
            obj.category = newCategory
            obj.active = newActive
            var json = JSON.stringify(obj);
            editProduct(id, json);
        }
    });
    }

// EventHandler for file selection.
function pickedFileHandler() {
    // Hide remove image button by default
    $('#removeButton').hide();
    $('#removeButtonEdit').hide();

    $('#image').change(function(){
        handleFileSelect(this.files,'#thumb');
    })
    $('#imageEdit').change(function(){
        handleFileSelect(this.files,'#eimage');
    })

    //Remove image wheb remove image button clicked
    $('#removeButton').click(function(){
        $('#thumb').attr("src","");
        $('#thumb').attr("resized","");
        $('#removeButton').hide();
    });
    //Remove image wheb remove image button clicked
    $('#removeButtonEdit').click(function(){
        $('#eimage').attr("src","");
        $('#eimage').attr("resized","");
        $('#removeButtonEdit').hide();
    });

}

// Handles the file that is selected and resize it.
function handleFileSelect(files,element) {
   loadingAnimation($(element),true);

    //Check number of files error when multiple are selected
    if(files.length > 1) {
        loadingAnimation($(element), false);
        $('#warningText').text("More than one file selected");
        $('#modalWarning').modal('show');

    } if(files.length == 0){
        loadingAnimation($(element), false);
    } else {
        // Select the file
        var f = files[0];

        // Only process image files.
        if (!f.type.match('image.*')) {
            loadingAnimation($(element),false);
            $('#warningText').text("File is not an image");
            $('#modalWarning').modal('show');
        }

        var reader = new FileReader();
        var image = new Image();

        // Closure to capture the file information.
        reader.onload = (function (theFile) {
            image.src = theFile.target.result;
            image.onload = function (e) {
                $(element).attr("src", this.src);
                loadingAnimation($(element),false);
                $(element).attr("resized", resizeImage(image, 200, 200))
                checkRemoveButtonsNeeded();
            };
        });
        // Read in the image file as a data URL.
        reader.readAsDataURL(f);
    }
   // checkRemoveButtonsNeeded();
}

// Resizes an image using a max width and max height.
function resizeImage(img,maxWidth,maxHeight){
    var canvas = document.createElement("canvas");
    var width = img.width;
    var height = img.height;

    if (width > height) {
        if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
        }
    } else {
        if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
        }
    }
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);
    return canvas.toDataURL();
}

// Checks and acts when there is a change in image if remove
// button should be present.
function checkRemoveButtonsNeeded() {
    if ($('#thumb').attr("src") == "") {
        $('#removeButton').hide();
    }else { $('#removeButton').show();
    }

    if ($('#eimage').attr("src") == "") {
        $('#removeButtonEdit').hide();
    }else{
        $('#removeButtonEdit').show();
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
    var table = $('#products').DataTable();
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