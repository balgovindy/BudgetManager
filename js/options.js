$(function () {
    chrome.storage.sync.get(['limit', 'gst', 'discount'], function (budget) {
        $('#limit').val(budget.limit)
        $('#gst').val(budget.gst)
        $('#discount').val(budget.discount)
    });

    $('#ready').click(function () {
        if ($('#limit').val() && $('#gst').val() && $('#discount').val()) {
            chrome.storage.sync.set(
                {
                    'limit': $('#limit').val(),
                    'gst': $('#gst').val(),
                    'discount': $('#discount').val()
                },
                function () {
                    close();
                });
        }
    });
})