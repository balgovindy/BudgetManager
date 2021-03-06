$(function () {
    chrome.storage.sync.get(['total', 'limit', 'percentage'], function (budget) {
        $('#total').text(budget.total);
        $('#limit').text(budget.limit);
        console.log(budget.percentage)
        $('.progressBar').css({
            width: `${budget.percentage}%`
        })
    });
    $('#resetTotal').click(function () {
        chrome.storage.sync.set({
            'total': 0,
            'percentage': 0
        });
        $('#total').text(0);
        $('.progressBar').css({
            width: `0%`
        })
    })

    $('#amount').keypress(function (event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') {
            updateView.call(this);
        }
    });

    $('#addTotal').click(function () {
        updateView()
    })
});

function priceCalculator(amt, gst, discount) {
    const costPrice = amt;
    const gstAmt = costPrice * gst * 0.01;
    const disc = costPrice * discount * 0.01;
    return (costPrice + gstAmt) - disc;
}


function updateView() {
    chrome.storage.sync.get(['total', 'limit', 'gst', 'discount', 'percentage'], function (budget) {
        var newTotal = 0;
        var amount = priceCalculator(+$('#amount').val(), +budget.gst, +budget.discount);
        if (budget.total) {
            newTotal += +parseInt(budget.total).toFixed(2);
        }
        if (amount) {
            newTotal += +amount;
        }
        var cprgcent = currentProgress(newTotal, budget.limit)
        chrome.storage.sync.set({ 'total': newTotal, 'percentage': cprgcent }, function () {
            if (newTotal >= +budget.limit) {
                var notifObj = {
                    type: "basic",
                    iconUrl: "./../images/icon128.png",
                    title: "Limit reached!",
                    message: "Hey you have reached your limit"
                }
                chrome.notifications.create('limitNotify', notifObj)
            }
        });
        $('#total').text(newTotal);
        $('#amount').val('');
        $('.progressBar').css({
            width: `${cprgcent}%`
        })
    });
}

function currentProgress(curAmt, limit) {
    return (curAmt / limit) * 100 > 100 ? 100 : (curAmt / limit) * 100;
}