function increaseNumberMessageGroup(divId) {
    let currentVal = +$(`.right[data-chat=${divId}]`).find('span.show-number-messages').text()
    currentVal++

    $(`.right[data-chat=${divId}]`).find('span.show-number-messages').html(currentVal)
}