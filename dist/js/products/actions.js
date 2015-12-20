var siteRoot = "https://api.gewis.nl:443/product/";
var selectedRow;
var resizedDataURL;
function initializeTable(){

    //Initialize the table with all active events
    // Retrieves data and parses it into the table with given columns
        $('#products').dataTable( {
            "info": true,
            "autoWidth": true,
            "ajax": {
                "url": siteRoot,
                "dataSrc": ""
            },
            "columns": [
                { "data": "name"},
                { "data": "price" },
                {"data": "image", render: function (data) {
                    if (data == null) {
                        return '<i class="fa fa-fw fa-picture-o"></i>'
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
        url: "https://api.gewis.nl:443/product/",
        type: "POST",
        async: false,
        crossDomain: true,
        dataType: "json",
        data: data,
        success: function () {
             $('#successText').text("Product is added successfully");
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

function editProduct(id,data){

        $.ajax({
            url: "https://api.gewis.nl:443/product/" +id ,
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
                $('#thumbConfirm').attr("src", resizedDataURL);
                $('#ctraySize').html($('#traySize').val());
                $('#cownerID').html($('#ownerID').val());
                $('#ccategory').html($('#category').val());

                $('#addProductConfirm').modal('show');

            }
        });
    /* when the submit button in the modal is clicked, submit the form */
        $('#confirmAdd').click(function () {
            // Retrieve forms and create JSON
            var obj = new Object();
            obj.name = document.getElementById("name").value;
            obj.price = document.getElementById("price").value;
            obj.image = resizedDataURL;
            obj.traySize = document.getElementById("traySize").value;
            obj.ownerID = document.getElementById("ownerID").value;
            obj.category = document.getElementById("category").value;

            var json = JSON.stringify(obj);

            addProduct(json);
            $('#addProductConfirm').modal('hide')

        });
    }

function editProductModalFunctionality() {

        var table = $('#products').DataTable();


    $('#products').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                table.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
                selectedRow = table.row(this).data();

            }
        });
        $('#editButton').click(function () {
            openEditModal();
        });
        $('#products').on('dblclick', function () {
            openEditModal();
        });
    }

function openEditModal() {
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
        active = true;
        $('#eactive').prop("checked", true);
    } else {
        active = false;
        $('#eactive').prop("checked", false);
    }
    var active = $('#eactive').val();

    $('#editProductConfirm').modal('show');

    // Edit product button pressed.
    $('#confirmEdit').click(function () {
        //Get new values from edit modal.
        var newName = $('#ename').val();
        var newPrice = $('#eprice').val();
        var newImage = $('#eimage').val();
        var newTraySize = $('#etraySize').val();
        var newOwnerID = $('#eownerID').val();
        var newCategory = $('#ecategory').val();
        var newActive = $('#eactive').prop("checked");

        // If no values are changed
        if (name == newName && price == newPrice && traySize == newTraySize
            && ownerID == newOwnerID && category == newCategory && active == newActive) {
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

function pickedFileHandler() {
    document.getElementById('image').addEventListener('change', handleFileSelect, false);
}

function handleFileSelect(evt) {
    $('#thumb').attr("src", "");
    var files = evt.target.files; // FileList object

    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {

        // Only process image files.
        if (!f.type.match('image.*')) {
            continue;
        }

        var reader = new FileReader();
        var image = new Image();

        // Read in the image file as a data URL.
        reader.readAsDataURL(f);

        // Closure to capture the file information.
        reader.onload = (function (theFile) {
            image.src = theFile.target.result;
            image.onload = function (e) {
                    $('#thumb').attr("src", this.src);
                    resizedDataURL = (resizeImage(image,200,200));
            };
        });

    }
}

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