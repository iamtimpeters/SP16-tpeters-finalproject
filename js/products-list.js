// custom code for parkland bookstore

$(document).ready(function(){

    var urlFirstPart = "https://api.bestbuy.com/v1/products(categoryPath.id=";
    
    var productCategoryRaw = document.location.hash.slice(1);

    var productCategory = productCategoryRaw.substring(productCategoryRaw.indexOf('&')).slice(1);

    console.log(productCategory);

    var pageNumber = productCategoryRaw.slice(8,11);

    console.log(pageNumber);

    var pageNumber = parseInt(pageNumber);

    if (pageNumber == 1) {
      $("#btn-prev").hide();
    };

    console.log(pageNumber);

    var apiKey = localStorage.getItem("BEST_BUY_API_KEY") 

    var urlSecondPart = ")?apiKey=" + apiKey + "&sort=name.asc&page="
    
    var urlThirdPart = "&format=json"
    
    var url = urlFirstPart + productCategory + urlSecondPart + pageNumber + urlThirdPart;

    console.log(url);

    $.get(url, /* callback */ function(result){

      result.products.forEach(function(product){

        product.manufacturer = product.manufacturer || '';

      });

      var productsData = result.products;

      var totalPages = result.totalPages;

      $("#thisPage").text(pageNumber);

      $("#totalPages").text(totalPages);

      var totalPages = parseInt(totalPages);

      if (pageNumber == totalPages) {
        $("#btn-next").hide();
      };

      console.log(totalPages);
        
    	console.log(productsData);

    	function AddingProducts(){

    		var self = this;

    		self.products = ko.observableArray(productsData);

            self.productDetailLink = function(products){
                var localSource = "file:///Users/Tim/Documents/Parkland%20classes/CSC175/SP16-tpeters-finalproject/product-details.html";    
                var productSku = products.sku;
                localSource += "#" + productSku
                console.log(document.location.hash);
                console.log(document.location.hash.slice(1));
                document.location.assign(localSource);
            };

            self.nextPage = function(){
                var localSource = document.location.pathname;
                pageNumber = pageNumber + 1;
                if (pageNumber < 10){
                    localSource += "#" + "pageNum=00" + pageNumber + "&" + productCategory
                } else if (pageNumber > 9 && pageNumber < 100){
                    localSource += "#" + "pageNum=0" + pageNumber + "&" + productCategory
                } else {
                    localSource += "#" + "pageNum=" + pageNumber + "&" + productCategory
                };
                document.location.assign(localSource);
                document.location.reload();
            };

            self.prevPage = function(){
                var localSource = document.location.pathname;
                pageNumber = pageNumber - 1;
                if (pageNumber < 10){
                    localSource += "#" + "pageNum=00" + pageNumber + "&" + productCategory
                } else if (pageNumber > 9 && pageNumber < 100){
                    localSource += "#" + "pageNum=0" + pageNumber + "&" + productCategory
                } else {
                    localSource += "#" + "pageNum=" + pageNumber + "&" + productCategory
                };
                document.location.assign(localSource);
                document.location.reload();
            };

    	};

    ko.applyBindings(new AddingProducts());

    });

});

