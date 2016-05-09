// custom code for parkland bookstore

$(document).ready(function(){
    
    var url = "https://parkland-csc175.github.io/csc175data/bestbuy/categories-list.json";

    $("#btn-apikey").click(function(){
        apiKey = prompt("Please Enter your API Key");
        localStorage.setItem("BEST_BUY_API_KEY", apiKey);
    });

    $.get(url, /* callback */ function(result){

    	var categoriesData = result.categories;

    	console.log(categoriesData)

    	function AddingCategories(){

    		var self = this;

    		self.categories = ko.observableArray(categoriesData);

            self.productLink = function(list){
                var apiKey = localStorage.getItem("BEST_BUY_API_KEY");
                if(apiKey == "null") {
                    alert("Please enter an API key.")
                } else if(!apiKey) {
                    alert("Please enter an API key.")
                } else {    
                    var localSource = "file:///Users/Tim/Documents/Parkland%20classes/CSC175/SP16-tpeters-finalproject/products-list.html";    
                    var productCatId = list.id;
                    localSource += "#" + "pageNum=001&" + productCatId
                    document.location.assign(localSource);
                }; 
            };

    	};

    ko.applyBindings(new AddingCategories());

    });

 

});
