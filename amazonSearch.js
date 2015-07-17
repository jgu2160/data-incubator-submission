var aws = require("aws-lib");

var itemOptions = {
    SearchIndex: "Beauty",
    Keywords: "hair electric shaver",
    Sort: "salesrank",
    ItemPage: "10",
};

var reviewOptions = {
  ResponseGroup: "Reviews",
  IdType: "ASIN",
};

function getItems(err, result) {
    var items = result.Items.Item;
    asins = items.map(function(item) {
        return item.ASIN;
    });
    console.log(asins);
    reviewOptions["ItemId"] = asins[0];
    prodAdv.call("ItemLookup", reviewOptions, showReviews);
}

function showReviews(err, result) {
    reviews = result.Items.Item.CustomerReviews;
    console.log(reviews);
}

prodAdv.call("ItemSearch", itemOptions, getItems);
