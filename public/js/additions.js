//Ajax request for categories listing in the database
$(document).ready(function(){
    $('#catForm').submit(function(e){
        e.preventDefault();
        var category = $('#category').val();
        var slug = $('#slug').val();
        $.ajax({
            url: '/add-category',
            type: 'POST',
            dataType: 'json',
            data: {
                category: category,
                slug: slug,
            },
            success: function(data){
                if(data.status === 'success'){
                    $(".msg").html('<span class="success">Category added successfully</span>');
                    setTimeout(function(){
                        $("#categoriesTable").load(location.href + " #categoriesTable");
                    }, 2000)
                }
            },
        });
    });
})

