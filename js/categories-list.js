// custom code for parkland bookstore

$(document).ready(function(){
    
    var url = "https://parkland-csc175.github.io/csc175data/bestbuy/categories-list.json";

    $.get(url, /* callback */ function(result){

    	var categoriesData = result.categories;

    	console.log(categoriesData)

    	function AddingCategories(){

    		var self = this;

    		self.categories = ko.observableArray(categoriesData);

            self.productLink = function(list){
                var localSource = "file:///Users/Tim/Documents/Parkland%20classes/CSC175/SP16-tpeters/final-project-resources-master/site-starter/products-list.html";    
                var productCatId = list.id;
                localSource += "#" + "pageNum=001&" + productCatId
                document.location.assign(localSource);
            };

    	};

    ko.applyBindings(new AddingCategories());

    });

 

});