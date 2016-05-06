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
            
            if (!product.largeFrontImage){
                $("#prod_pic").attr("src", product.largeImage);
            };

            var reviewAverage = product.customerReviewAverage

            if (reviewAverage) {
                $("#rating_avg").text("Average rating: " + reviewAverage + " stars");
                reviewAverage = parseFloat(reviewAverage).toFixed(1);
            } else {
                reviewAverage = "N/A"
                $("#rating_avg").text("Average rating: " + reviewAverage);
            }

            console.log(reviewAverage);

            if (reviewAverage < .5) {
                $("#star5").removeClass("glyphicon-star");
                $("#star4").removeClass("glyphicon-star");
                $("#star3").removeClass("glyphicon-star");
                $("#star2").removeClass("glyphicon-star");
                $("#star1").removeClass("glyphicon-star");
                $("#star5").addClass("glyphicon-star-empty");
                $("#star4").addClass("glyphicon-star-empty");
                $("#star3").addClass("glyphicon-star-empty");
                $("#star2").addClass("glyphicon-star-empty");
                $("#star1").addClass("glyphicon-star-empty");
            } else if (reviewAverage < 1.5 && reviewAverage >= .5) {
                $("#star5").removeClass("glyphicon-star");
                $("#star4").removeClass("glyphicon-star");
                $("#star3").removeClass("glyphicon-star");
                $("#star2").removeClass("glyphicon-star");
                $("#star5").addClass("glyphicon-star-empty");
                $("#star4").addClass("glyphicon-star-empty");
                $("#star3").addClass("glyphicon-star-empty");
                $("#star2").addClass("glyphicon-star-empty");
            } else if (reviewAverage < 2.5 && reviewAverage >= 1.5) {
                $("#star5").removeClass("glyphicon-star");
                $("#star4").removeClass("glyphicon-star");
                $("#star3").removeClass("glyphicon-star");
                $("#star5").addClass("glyphicon-star-empty");
                $("#star4").addClass("glyphicon-star-empty");
                $("#star3").addClass("glyphicon-star-empty");
            } else if (reviewAverage < 3.5 && reviewAverage >= 2.5) {
                $("#star5").removeClass("glyphicon-star");
                $("#star4").removeClass("glyphicon-star");
                $("#star5").addClass("glyphicon-star-empty");
                $("#star4").addClass("glyphicon-star-empty");
            } else if (reviewAverage < 4.5 && reviewAverage >= 3.5) {
                $("#star5").removeClass("glyphicon-star");
                $("#star5").addClass("glyphicon-star-empty");
            } else if (reviewAverage == "N/A") {
                $("#star5").hide();
                $("#star4").hide();
                $("#star3").hide();
                $("#star2").hide();
                $("#star1").hide();
            };
        });

    });

    var prodUrlFirstHalf = "https://api.bestbuy.com/v1/reviews(sku="

    var reviewsUrl = prodUrlFirstHalf + productSku + urlSecondHalf   

    console.log(reviewsUrl); 

    $.get(reviewsUrl, /* callback */ function(reviewsResult){
        
        reviewsResult.reviews.forEach(function(reviews){

            var subTime = reviews.submissionTime;

            var completed = new Date(subTime).getTime();

            var now = Date.now();

            var msElapsed = now - completed; // in milliseconds

            var daysElapsed = (((msElapsed / 1000) / 60) / 60) / 24;

            console.log(subTime);

            reviews.submissionTime = daysElapsed.toFixed(0);

        });

        var totalComments = reviewsResult.total;

        console.log(totalComments);

        $("#commentQuantity").text(totalComments);

        var pageNumber = reviewsResult.currentPage;

        var pageNumber = parseInt(pageNumber);

        console.log(pageNumber);

        var pageTotal = parseInt(reviewsResult.totalPages)

        if (pageTotal == 0) {
            pageNumber = 0
        };

        localStorage.setItem("detailsPageNumber", pageNumber);

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

                var currentPageNum = parseInt(localStorage.getItem("detailsPageNumber"))

                currentPageNum = currentPageNum + 1

                console.log(currentPageNum)

                nextReviewsUrl = reviewsUrl + "&page=" + currentPageNum

                $.get(nextReviewsUrl, /* callback */ function(nextReviewsPage){
                    
                    nextReviewsPage.reviews.forEach(function(reviews){

                        var subTime = reviews.submissionTime;

                        var completed = new Date(subTime).getTime();

                        var now = Date.now();

                        var msElapsed = now - completed; // in milliseconds

                        var daysElapsed = (((msElapsed / 1000) / 60) / 60) / 24;

                        console.log(subTime);

                        reviews.submissionTime = daysElapsed.toFixed(0);

                    });

                    var nextProductReviews = nextReviewsPage.reviews;

                    console.log(nextProductReviews);

                    self.reviews.removeAll();

                    for (i = 0; i < nextProductReviews.length; i++){

                        self.reviews.push(nextProductReviews[i]);

                    };

                    $("#thisPage").text(currentPageNum);

                    $('html, body').animate({
                        scrollTop: $("#commentHeader").offset().top
                    }, 500);

                });

                if (currentPageNum != 1) {
                    $("#btn-prev").show();
                };

                if (currentPageNum == pageTotal) {
                    $("#btn-next").hide();
                };

                localStorage.setItem("detailsPageNumber", currentPageNum);

            };

            self.prevPage = function(){

                var currentPageNum = parseInt(localStorage.getItem("detailsPageNumber"))

                currentPageNum = currentPageNum - 1

                console.log(currentPageNum)

                prevReviewsUrl = reviewsUrl + "&page=" + currentPageNum

                $.get(prevReviewsUrl, /* callback */ function(prevReviewsPage){

                    var prevProductReviews = prevReviewsPage.reviews;
                    
                    prevReviewsPage.reviews.forEach(function(reviews){

                        var subTime = reviews.submissionTime;

                        var completed = new Date(subTime).getTime();

                        var now = Date.now();

                        var msElapsed = now - completed; // in milliseconds

                        var daysElapsed = (((msElapsed / 1000) / 60) / 60) / 24;

                        console.log(subTime);

                        reviews.submissionTime = daysElapsed.toFixed(0);

                    });

                    console.log(prevProductReviews);

                    self.reviews.removeAll();

                    for (i = 0; i < prevProductReviews.length; i++){

                        self.reviews.push(prevProductReviews[i]);

                    };

                    $("#thisPage").text(currentPageNum);

                    $('html, body').animate({
                        scrollTop: $("#commentHeader").offset().top
                    }, 500);

                });

                if (currentPageNum == 1) {
                    $("#btn-prev").hide();
                };
                
                if (currentPageNum < pageTotal) {
                    $("#btn-next").show();
                };

                localStorage.setItem("detailsPageNumber", currentPageNum);

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
