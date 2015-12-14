var siteRoot = "https://api.gewis.nl:443/product/";
var selectedRow;
function initializeTable(){

    //Initialize the table with all active events
    // Retrieves data and parses it into the table with given columns
        $('#products').dataTable( {
            "info": true,
            "autoWidth": true,
            "ajax": {
                "url": "https://api.gewis.nl/product",
                "dataSrc": ""
            },
            "columns": [
                { "data": "name"},
                { "data": "price" },
                { "data": "image" },
                { "data": "traySize" },
                { "data": "category" },
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

function addProduct() {
    // Retrieve forms and create JSON
    var obj = new Object();
    obj.name = document.getElementById("name").value;
    obj.price = document.getElementById("price").value;
    obj.image = document.getElementById("image").value;
    obj.traySize = document.getElementById("traySize").value;
    obj.ownerID = document.getElementById("ownerID").value;
    obj.category = document.getElementById("category").value;
    var json = JSON.stringify(obj);
    console.log(json);
    $.ajax({
        url: "https://api.gewis.nl:443/product/",
        type: "POST",
        async: false,
        crossDomain: true,
        dataType: "json",
        data: json,
        success: function (data) {
             $('#successText').text("Product is added successfully");
             $('#addProductSuccess').modal('show');
         },
        error: function(error){
            if(error.status == 500){
                $('#errorText').text(error.responseJSON);
                $('#addProductError').modal('show');
            } else {
                $('#warningText').text(error.responseJSON);
                $('#addProductWarning').modal('show');
            }
         }
      });
    }

    function getProducts() {
    var json;
    $.ajax({
        dataType: "json",
        url: siteRoot,
        async: false,
        success: function (data){
        alert("success");
            json = data;
        },
        error: function (error)  {
            alert("fail");
            alert('error; ' + eval(JSON.stringify(error)));
        },
    });
   return json;
}

    function addProductModalFunctionality() {

        // Load data for add product confirmation modal
        $('#addButton').click(function () {
            if($('#product')[0].checkValidity()) {
                /* when the button in the form, display the entered values in the modal */
                $('#cname').html($('#name').val());
                $('#cprice').html($('#price').val());
                $('#cimage').html($('#image').val());
                $('#ctraySize').html($('#traySize').val());
                $('#cownerID').html($('#ownerID').val());
                $('#ccategory').html($('#category').val());

                $('#addProductConfirm').modal('show');
            }
        });

        $('#confirmAdd').click(function () {
            /* when the submit button in the modal is clicked, submit the form */
            addProduct();
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
                selectedRow = table.row( this ).data();

            }
        });
        $('#editButton').click(function(){
            openEditModal();
        });
        $('#editButton').ondblclick(function(){
            openEditModal();
        });
    }

function openEditModal(){
    $('#ename').val(selectedRow['name']);
    $('#eprice').val(selectedRow['price']);
    $('#eimage').val(selectedRow['image']);
    $('#etraySize').val(selectedRow['traySize']);
    $('#eownerID').val(selectedRow['ownerID']);
    $('#ecategory').val(selectedRow['category']);

    $('#editProductConfirm').modal('show');

    //name').val());
    //    price').val());
    //    image').val());
    //   traySize').val());
    //   ownerID').val());
    //   category').val());
}