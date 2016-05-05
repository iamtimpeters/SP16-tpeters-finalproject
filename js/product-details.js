// custom code for parkland bookstore

$(document).ready(function(){

    var urlFirstHalf = "https://api.bestbuy.com/v1/products(sku="
    
    var productSku = document.location.hash.slice(1)

    var apiKey = localStorage.getItem("BEST_BUY_API_KEY")
    
    var urlSecondHalf = ")?format=json&apiKey=" + apiKey
    
    var url = urlFirstHalf + productSku + urlSecondHalf;

    console.log(url);

    $.get(url, /* callback */ function(result){

    	var productsDetailData = result.products;

    	console.log(productsDetailData);

        result.products.forEach(function(product){

            $("#price").text("$" + product.salePrice);

            $("#prod_name").text(product.name);

            $("#prod_pic").attr("src", product.largeFrontImage);

            //$("#comment_total").text(product.customerReviewCount + " Comments");

            $("#rating_avg").text("Average rating: " + product.customerReviewAverage + " stars");

        });

    });

    var prodUrlFirstHalf = "https://api.bestbuy.com/v1/reviews(sku="

    var reviewsUrl = prodUrlFirstHalf + productSku + urlSecondHalf   

    console.log(reviewsUrl); 

    $.get(reviewsUrl, /* callback */ function(reviewsResult){

        var pageNumber = reviewsResult.currentPage

        var pageNumber = parseInt(pageNumber);

        console.log(pageNumber);

        var pageTotal = reviewsResult.totalPages

        console.log(pageTotal);

        $("#thisPage").text(pageNumber);

        $("#totalPages").text(pageTotal);

        if (pageNumber == pageTotal) {
            $("#btn-next").hide();
        };

        var productReviews = reviewsResult.reviews;

        console.log(productReviews);

    	function AddingProductReviews(){

    		var self = this;

    		self.reviews = ko.observableArray(productReviews);

            self.nextPage = function(){

                pageNumber = pageNumber + 1

                console.log(pageNumber)

                nextReviewsUrl = reviewsUrl + "&page=" + pageNumber

                $.get(nextReviewsUrl, /* callback */ function(nextReviewsPage){

                    var nextProductReviews = nextReviewsPage.reviews;

                    console.log(nextProductReviews);

                    self.reviews.removeAll();

                    for (i = 0; i < nextProductReviews.length; i++){

                        self.reviews.push(nextProductReviews[i]);

                    };

                    $("#thisPage").text(pageNumber);

                    $('html, body').animate({
                        scrollTop: $("#commentHeader").offset().top
                    }, 500);

                });

                if (pageNumber != 1) {
                    $("#btn-prev").show();
                };

                if (pageNumber == pageTotal) {
                    $("#btn-next").hide();
                };

            };

            self.prevPage = function(){

                pageNumber = pageNumber - 1

                console.log(pageNumber)

                prevReviewsUrl = reviewsUrl + "&page=" + pageNumber

                $.get(prevReviewsUrl, /* callback */ function(prevReviewsPage){

                    var prevProductReviews = prevReviewsPage.reviews;

                    console.log(prevProductReviews);

                    self.reviews.removeAll();

                    for (i = 0; i < prevProductReviews.length; i++){

                        self.reviews.push(prevProductReviews[i]);

                    };

                    $("#thisPage").text(pageNumber);

                    $('html, body').animate({
                        scrollTop: $("#commentHeader").offset().top
                    }, 500);

                });

                if (pageNumber = 1) {
                    $("#btn-prev").hide();
                };

            };

    	};

    ko.applyBindings(new AddingProductReviews());

    });

    $("#product_comment_form").validate({
        rules: {
            "firstName": {
                required: true
            },
            "lastName": {
                required: true
            },
            "email": {
                required: true,
                email: true
            },
            "rating": {
                required: true
            }
        },
        messages: {
            "firstName": {
                required: "Please enter your first name."
            },
            "lastName": {
                required: "Please enter your last name."
            },
            "email": {
                required: "Please enter an email address.",
                email: "Please enter an email address."
            },
            "rating":{
                required: "Please rate the product."
            }
        }
    });

});